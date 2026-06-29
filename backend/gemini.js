async function generateInventoryReport({
  products,
  sales,
  totalRevenue,
  totalProfit,
  lowStockCount,
  bestSellingProduct,
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in .env");
  }

  const prompt = `
You are an AI business analyst for an inventory dashboard.

Inventory Summary:
- Total Products: ${(products || []).length}
- Total Revenue: ₹${totalRevenue}
- Total Profit: ₹${totalProfit}
- Low Stock Items: ${lowStockCount}
- Best Selling Product: ${bestSellingProduct}

Products:
${JSON.stringify(products || [], null, 2)}

Sales:
${JSON.stringify(sales || [], null, 2)}

Return ONLY valid JSON.

Use this exact structure:
{
  "score": 85,
  "health": "Good",
  "summary": "Short business summary",
  "risks": ["risk 1", "risk 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "profitTips": ["tip 1", "tip 2"]
}

Do not include markdown.
Do not include extra text.
`;

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

  return data.choices?.[0]?.message?.content || "No report generated.";
}

module.exports = { generateInventoryReport };
