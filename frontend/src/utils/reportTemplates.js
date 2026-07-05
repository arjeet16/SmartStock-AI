export function buildExecutiveReportData({
  forecastData = [],
  mlMetrics = null,
  businessScore = 85,
  businessHealth = "Healthy",
}) {
  const totalProducts = forecastData.length;

  const highRisk = forecastData.filter((item) => item.risk === "High").length;
  const mediumRisk = forecastData.filter((item) => item.risk === "Medium").length;
  const lowRisk = forecastData.filter((item) => item.risk === "Low").length;

  const totalRestock = forecastData.reduce(
    (sum, item) =>
      sum + Number(item.mlRecommendedRestock ?? item.recommendedRestock ?? 0),
    0
  );

  const avgConfidence =
    forecastData.length > 0
      ? Math.round(
          forecastData.reduce(
            (sum, item) => sum + Number(item.confidence || 0),
            0
          ) / forecastData.length
        )
      : 0;

  const avgHealth =
    forecastData.length > 0
      ? Math.round(
          forecastData.reduce(
            (sum, item) => sum + Number(item.healthScore || 0),
            0
          ) / forecastData.length
        )
      : 0;

  const topPriority =
    [...forecastData].sort(
      (a, b) =>
        Number(b.mlRecommendedRestock ?? b.recommendedRestock ?? 0) -
        Number(a.mlRecommendedRestock ?? a.recommendedRestock ?? 0)
    )[0] || null;

  const topProducts = [...forecastData]
    .sort(
      (a, b) =>
        Number(b.mlForecast30Days ?? b.forecast30Days ?? 0) -
        Number(a.mlForecast30Days ?? a.forecast30Days ?? 0)
    )
    .slice(0, 8);

  return {
    generatedAt: new Date().toLocaleString(),
    businessScore,
    businessHealth,
    summary: {
      totalProducts,
      highRisk,
      mediumRisk,
      lowRisk,
      totalRestock,
      avgConfidence,
      avgHealth,
      topPriority,
    },
    topProducts,
    forecastData,
    mlMetrics,
  };
}