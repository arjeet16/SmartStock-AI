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
  products = [],
  sales = [],
  totalRevenue = 0,
  totalProfit = 0,
  lowStockCount = 0,
  bestSellingProduct = "No Sales",
}) {
  const prompt = `
You are SmartStock Copilot, an inventory assistant.

Answer the user's question directly and practically.
Do NOT return JSON.
Do NOT use markdown tables.
Keep the answer concise and useful.

User Question:
${question}

Business Context:
- Total Products: ${products.length}
- Total Revenue: ₹${totalRevenue}
- Total Profit: ₹${totalProfit}
- Low Stock Items: ${lowStockCount}
- Best Selling Product: ${bestSellingProduct}

Products:
${JSON.stringify(products, null, 2)}

Sales:
${JSON.stringify(sales, null, 2)}
`;

  return callOpenRouter(prompt);
}

module.exports = {
  generateInventoryReport,
  generateCopilotAnswer,
};
