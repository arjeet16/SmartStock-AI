async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in .env");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.choices?.[0]?.message?.content || "No response generated.";
}

async function generateInventoryReport({
  products = [],
  sales = [],
  totalRevenue = 0,
  totalProfit = 0,
  lowStockCount = 0,
  bestSellingProduct = "No Sales",
}) {
  const prompt = `
You are an AI business analyst for an inventory dashboard.

Return ONLY valid JSON.

Inventory Summary:
- Total Products: ${products.length}
- Total Revenue: ₹${totalRevenue}
- Total Profit: ₹${totalProfit}
- Low Stock Items: ${lowStockCount}
- Best Selling Product: ${bestSellingProduct}

Products:
${JSON.stringify(products, null, 2)}

Sales:
${JSON.stringify(sales, null, 2)}

Use this exact JSON structure:
{
  "score": 85,
  "health": "Good",
  "summary": "Short business summary",
  "risks": ["risk 1", "risk 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "profitTips": ["tip 1", "tip 2"]
}
`;

  return callOpenRouter(prompt);
}

async function generateCopilotAnswer({
  question,
  message,
  products = [],
  sales = [],
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

  const normalizedProducts = products.map((product) => {
    const quantity = Number(product.quantity || 0);
    const buyingPrice = Number(product.buying_price || 0);
    const sellingPrice = Number(product.selling_price || 0);

    return {
      id: product.id,
      name: product.item_name,
      category: product.category,
      quantity,
      buyingPrice,
      sellingPrice,
      profitPerUnit: sellingPrice - buyingPrice,
      stockStatus:
        quantity <= 0
          ? "Out of Stock"
          : quantity < 20
          ? "Low Stock"
          : "Healthy",
    };
  });

  const calculatedLowStock = normalizedProducts.filter(
    (product) => product.quantity < 20
  );

  const prompt = `
You are SmartStock AI Copilot, an expert inventory and retail business analyst.

Answer the user's exact question using only the supplied business data.

Rules:
- Do not claim that no question was asked.
- Do not invent products, quantities, revenue, sales, or profit.
- Mention exact product names and quantities when relevant.
- Give practical actions, not generic advice.
- Use short headings and bullet points.
- Do not use markdown tables.
- Keep the response between 100 and 220 words.
- If data is missing, clearly state which data is unavailable.
- For low-stock questions, list every product below 20 units.
- For profit questions, calculate from buying and selling prices.
- For executive summaries, include performance, risks, and next actions.

User question:
${userQuestion}

Business summary:
- Total products: ${normalizedProducts.length}
- Total revenue: ₹${Number(totalRevenue).toLocaleString("en-IN")}
- Total profit: ₹${Number(totalProfit).toLocaleString("en-IN")}
- Low-stock products: ${
    lowStockCount || calculatedLowStock.length
  }
- Best-selling product: ${bestSellingProduct}

Products:
${JSON.stringify(normalizedProducts, null, 2)}

Sales:
${JSON.stringify(sales, null, 2)}
`;

  return callOpenRouter(prompt);
}

module.exports = {
  generateInventoryReport,
  generateCopilotAnswer,
};
