function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return `₹${Math.round(toNumber(value)).toLocaleString("en-IN")}`;
}

function buildProductAnalytics(products = [], sales = []) {
  return products.map((product) => {
    const productId = Number(product.id);
    const quantity = toNumber(product.quantity);
    const buyingPrice = toNumber(product.buying_price);
    const sellingPrice = toNumber(product.selling_price);
    const unitsPerCarton = Math.max(
      1,
      toNumber(product.units_per_carton) || 1
    );

    const productSales = sales.filter(
      (sale) => Number(sale.product_id) === productId
    );

    const unitsSold = productSales.reduce(
      (sum, sale) =>
        sum + toNumber(sale.quantity_sold),
      0
    );

    const revenue = productSales.reduce(
      (sum, sale) =>
        sum +
        toNumber(sale.quantity_sold) *
          toNumber(sale.selling_price),
      0
    );

    const realizedProfit = productSales.reduce(
      (sum, sale) => sum + toNumber(sale.profit),
      0
    );

    const profitPerUnit = sellingPrice - buyingPrice;

    const marginPercent =
      sellingPrice > 0
        ? Number(
            (
              (profitPerUnit / sellingPrice) *
              100
            ).toFixed(1)
          )
        : 0;

    const inventoryValue = quantity * buyingPrice;

    const availableCartons = Math.floor(
      quantity / unitsPerCarton
    );

    const openUnits = quantity % unitsPerCarton;

    let movementStatus = "No Sales Data";

    if (unitsSold >= 500) {
      movementStatus = "Fast Moving";
    } else if (unitsSold >= 100) {
      movementStatus = "Moderate Moving";
    } else if (unitsSold > 0) {
      movementStatus = "Slow Moving";
    }

    let stockStatus = "Healthy";

    if (quantity <= 0) {
      stockStatus = "Out of Stock";
    } else if (quantity < 20) {
      stockStatus = "Low Stock";
    } else if (
      unitsSold === 0 &&
      quantity >= unitsPerCarton * 5
    ) {
      stockStatus = "Possible Overstock";
    } else if (
      unitsSold > 0 &&
      quantity > unitsSold * 4
    ) {
      stockStatus = "High Stock";
    }

    let recommendedAction =
      "Monitor stock and sales movement.";

    if (quantity <= 0 && unitsSold > 0) {
      recommendedAction =
        "Restock because the product has recorded demand and is currently out of stock.";
    } else if (
      quantity < 20 &&
      unitsSold > 0
    ) {
      recommendedAction =
        "Consider restocking because remaining inventory is low and sales have been recorded.";
    } else if (
      unitsSold === 0 &&
      quantity > 0
    ) {
      recommendedAction =
        "Do not restock yet. Existing inventory has no recorded sales movement.";
    } else if (
      quantity > unitsSold * 4 &&
      unitsSold > 0
    ) {
      recommendedAction =
        "Avoid additional purchasing and focus on selling existing stock.";
    } else if (unitsSold >= 500) {
      recommendedAction =
        "Maintain safety stock and continue monitoring sales velocity.";
    }

    return {
      id: productId,
      name: product.item_name,
      category: product.category,
      quantity,
      unitsPerCarton,
      availableCartons,
      openUnits,
      buyingPrice,
      sellingPrice,
      profitPerUnit,
      marginPercent,
      inventoryValue,
      unitsSold,
      revenue,
      realizedProfit,
      movementStatus,
      stockStatus,
      recommendedAction,
    };
  });
}

async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is missing in .env"
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are SmartStock AI, a precise inventory and retail business analyst. Never invent data and never contradict supplied calculations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return (
    data.choices?.[0]?.message?.content ||
    "No response generated."
  );
}

async function generateInventoryReport({
  products = [],
  sales = [],
  forecastData = [],
  totalRevenue = 0,
  totalProfit = 0,
  lowStockCount = 0,
  bestSellingProduct = "No Sales",
}) {
  const analytics = buildProductAnalytics(
    products,
    sales
  );
const analyticsWithForecast = analytics.map((product) => {
  const forecast = forecastData.find(
    (item) =>
      Number(item.productId || item.product_id || item.id) ===
      Number(product.id)
  );

  return {
    ...product,

    forecast7Days: forecast?.forecast7Days ?? 0,
    forecast30Days: forecast?.forecast30Days ?? 0,

    recommendedRestock:
      forecast?.recommendedRestock ?? 0,

    safetyStock:
      forecast?.safetyStock ?? 0,

    targetStock:
      forecast?.targetStock ?? 0,

    confidence:
      forecast?.confidence ?? 0,

    risk:
      forecast?.risk ?? "Unknown",

    riskReason:
      forecast?.riskReason ??
      "No forecast available.",

    trend:
      forecast?.trend ?? "Stable",

    trendPercent:
      forecast?.trendPercent ?? 0,

    daysRemaining:
      forecast?.daysRemaining ?? 999,

    inventoryTurnover:
      forecast?.inventoryTurnover ?? 0,
  };
});
  const totalInventoryValue = analyticsWithForecast.reduce(
    (sum, product) =>
      sum + product.inventoryValue,
    0
  );

  const outOfStockProducts = analyticsWithForecast.filter(
    (product) => product.quantity <= 0
  );

  const possibleOverstockProducts =
  analyticsWithForecast.filter(
    (product) =>
      product.stockStatus === "Possible Overstock" ||
      product.stockStatus === "High Stock"
  );

  const fastMovingProducts = analyticsWithForecast.filter(
    (product) =>
      product.movementStatus === "Fast Moving"
  );

  const prompt = `
Create an executive inventory report using only the supplied data.

Return ONLY valid JSON. Do not include markdown or code fences.

Important business rules:

1. Total Profit means actual realized sales profit only.
2. Inventory value is not profit.
3. Forecast metrics are calculated by the SmartStock forecasting engine and must be treated as the source of truth.
4. Use recommendedRestock exactly as supplied. Do not calculate a different restock quantity.
5. Use riskReason when explaining stock risk.
6. Do not treat confidence as certainty. Mention low confidence when forecast confidence is weak.
7. A product marked Overstock must not be recommended for purchasing.
8. Use safetyStock and targetStock only when they are present in the supplied forecast data.
9. Never recommend restocking a product that has:
   - zero recorded sales,
   - zero predicted demand,
   - or a large quantity already available.
10. If a product has high stock and weak sales, recommend:
    - avoiding additional purchasing,
    - promoting existing stock,
    - reviewing pricing,
    - or reducing future order quantities.
11. Recommend restocking only when stock is low or zero and recorded demand exists.
12. Do not describe high stock as healthy without considering sales movement.
13. Use exact product names, quantities and financial values.
14. Keep each risk, recommendation and profit tip concise.
15. Return a maximum of 3 items in each array.

Business Summary:
- Total Products: ${analytics.length}
- Total Revenue: ${formatCurrency(totalRevenue)}
- Actual Realized Profit: ${formatCurrency(totalProfit)}
- Current Inventory Value: ${formatCurrency(
    totalInventoryValue
  )}
- Low Stock Products: ${lowStockCount}
- Out of Stock Products: ${
    outOfStockProducts.length
  }
- Possible Overstock Products: ${
    possibleOverstockProducts.length
  }
- Fast-Moving Products: ${
    fastMovingProducts.length
  }
- Best-Selling Product: ${bestSellingProduct}

Product and Forecast Analytics:
${JSON.stringify(analyticsWithForecast, null, 2)}

Sales History:
${JSON.stringify(sales, null, 2)}

Use this exact JSON structure:

{
  "score": 85,
  "health": "Good",
  "summary": "A concise executive summary based on the supplied figures.",
  "risks": [
    "Specific business risk"
  ],
  "recommendations": [
    "Specific priority action"
  ],
  "profitTips": [
    "Specific profit improvement opportunity"
  ]
}

Scoring guidance:
- 90-100: Excellent
- 75-89: Good
- 55-74: Needs Attention
- Below 55: High Risk

A high score must not hide clear overstock, dead-stock, low-margin or stockout risks.
`;

  return callOpenRouter(prompt);
}

async function generateCopilotAnswer({
  question,
  message,
  products = [],
  sales = [],
  forecastData = [],
  totalRevenue = 0,
  totalProfit = 0,
  lowStockCount = 0,
  bestSellingProduct = "No Sales",
}) {
  const userQuestion = String(
    question || message || ""
  ).trim();

  if (!userQuestion) {
    return "Please ask a specific inventory, sales, profit, or forecasting question.";
  }

  const analytics = buildProductAnalytics(
    products,
    sales
  );
  const analyticsWithForecast = analytics.map((product) => {
  const forecast = forecastData.find(
    (item) =>
      Number(item.productId || item.product_id || item.id) ===
      Number(product.id)
  );

  return {
    ...product,

    forecast7Days: forecast?.forecast7Days ?? 0,
    forecast30Days: forecast?.forecast30Days ?? 0,

    recommendedRestock:
      forecast?.recommendedRestock ?? 0,

    safetyStock:
      forecast?.safetyStock ?? 0,

    targetStock:
      forecast?.targetStock ?? 0,

    confidence:
      forecast?.confidence ?? 0,

    risk:
      forecast?.risk ?? "Unknown",

    riskReason:
      forecast?.riskReason ?? "No forecast available.",

    trend:
      forecast?.trend ?? "Stable",

    trendPercent:
      forecast?.trendPercent ?? 0,

    daysRemaining:
      forecast?.daysRemaining ?? 999,

    inventoryTurnover:
      forecast?.inventoryTurnover ?? 0,
  };
});
  const totalInventoryValue = analyticsWithForecast.reduce(
    (sum, product) =>
      sum + product.inventoryValue,
    0
  );

  const calculatedLowStock = analyticsWithForecast.filter(
    (product) =>
      product.quantity > 0 &&
      product.quantity < 20
  );

  const outOfStockProducts = analyticsWithForecast.filter(
  (product) => product.quantity <= 0
);

  const possibleOverstockProducts = analyticsWithForecast.filter(
  (product) =>
    product.stockStatus === "Possible Overstock" ||
    product.stockStatus === "High Stock"
);
  const prompt = `
Answer the user's exact question as SmartStock AI Copilot.

User question:
${userQuestion}

Use only the supplied business data.

Critical rules:

- Never invent figures or products.
- Total profit is actual realized sales profit.
- Inventory value and potential profit are not realized profit.
- Forecast metrics are generated by the SmartStock forecasting engine and must be treated as the source of truth.
- For every forecast question, copy forecast7Days, forecast30Days, confidence, risk, daysRemaining, recommendedRestock, safetyStock, targetStock, and riskReason exactly from Product-Level Analytics.
- Never derive forecast values from total units sold, sales history, average sales, or your own calculations.
- Never convert numeric forecast values into words such as "High", "Low", "Yes", or "No".
- recommendedRestock must remain a numeric quantity. For example, output 0 instead of "No".
- If Forecast Summary, Sales History, and Product-Level Analytics contain different values, Product-Level Analytics is authoritative.
- Use recommendedRestock exactly as supplied. Never calculate a different quantity.
- Explain stock risk using riskReason whenever it is available.
- Mention forecast confidence when confidence is below 60.
- Never recommend purchasing a product whose risk is "Overstock".
- When forecast data is unavailable, clearly state that the recommendation is based only on sales history.
- Do not recommend restocking products with zero sales or excess stock.
- Recommend restocking only when inventory is low or empty and demand exists.
- When discussing high inventory, include capital-lock and overstock risk.
- When discussing profitability, distinguish:
  - profit per unit,
  - realized sales profit,
  - inventory value.
- Mention exact product names and quantities.
- If sales history is insufficient, state that clearly.
Give practical actions supported by the data. Do not introduce thresholds, percentages, time periods, or formulas unless they are explicitly present in the supplied data.
- Use short headings and bullet points.
- Do not use markdown tables.
- Keep the response between 90 and 200 words.

Business Totals:
- Total Products: ${analytics.length}
- Total Revenue: ${formatCurrency(totalRevenue)}
- Actual Realized Profit: ${formatCurrency(totalProfit)}
- Current Inventory Value: ${formatCurrency(
    totalInventoryValue
  )}
- Low-Stock Products: ${
    lowStockCount || calculatedLowStock.length
  }
- Out-of-Stock Products: ${
    outOfStockProducts.length
  }
- Possible Overstock Products: ${
    possibleOverstockProducts.length
  }
- Best-Selling Product: ${bestSellingProduct}
Forecast Summary:
${JSON.stringify(forecastData, null, 2)}
Product-Level Analytics:
${JSON.stringify(analyticsWithForecast, null, 2)}

Sales History:
${JSON.stringify(sales, null, 2)}
`;
return callOpenRouter(prompt);
}
module.exports = {
  generateInventoryReport,
  generateCopilotAnswer,
};
