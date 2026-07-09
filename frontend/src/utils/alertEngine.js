export function generateSmartAlerts({
  forecastData = [],
  products = [],
  sales = [],
} = {}) {
  const alerts = [];

  const safeForecast = Array.isArray(forecastData) ? forecastData : [];

  const highRiskProducts = safeForecast.filter((item) => item.risk === "High");
  const mediumRiskProducts = safeForecast.filter(
    (item) => item.risk === "Medium"
  );

  highRiskProducts.forEach((product) => {
    alerts.push({
      type: "critical",
      title: "Stockout Risk",
      message: `${product.productName} may stock out soon. Restock ${
        product.mlRecommendedRestock ?? product.recommendedRestock ?? 0
      } units.`,
      productName: product.productName,
      priority: 1,
      icon: "🔴",
    
    });
  });

  mediumRiskProducts.forEach((product) => {
    alerts.push({
      type: "warning",
      title: "Restock Warning",
      message: `${product.productName} requires monitoring due to medium stock risk.`,
      productName: product.productName,
      priority: 2,
icon: "🟠",
    });
  });
  const zeroDemandProducts = safeForecast.filter(
  (item) => Number(item.predictedDemand ?? item.forecast ?? 0) === 0
);

zeroDemandProducts.forEach((product) => {
  alerts.push({
    type: "opportunity",
    title: "Overstock Opportunity",
    message: `${product.productName} has zero predicted demand. Avoid bulk purchasing and review inventory strategy.`,
    productName: product.productName,
    priority: 3,
icon: "🟢",
  });
});
alerts.sort((a, b) => a.priority - b.priority);
  return {
    alerts,
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter((alert) => alert.type === "critical").length,
    warningAlerts: alerts.filter((alert) => alert.type === "warning").length,
    opportunityAlerts: alerts.filter((alert) => alert.type === "opportunity")
      .length,
  };
}