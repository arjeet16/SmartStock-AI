function cleanAIJson(rawText) {
  return rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function formatAIReport(rawText) {
  try {
    const cleaned = cleanAIJson(rawText);
    const parsed = JSON.parse(cleaned);

    return {
      score: parsed.score || 75,
      health: parsed.health || "Good",
      summary: parsed.summary || "AI report generated successfully.",
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
      profitTips: Array.isArray(parsed.profitTips) ? parsed.profitTips : [],
    };
  } catch (error) {
    return {
      score: 70,
      health: "Review Needed",
      summary: rawText,
      risks: ["AI response could not be fully structured."],
      recommendations: ["Review the generated report manually."],
      profitTips: ["Improve product pricing and restocking strategy."],
    };
  }
}

module.exports = { formatAIReport };