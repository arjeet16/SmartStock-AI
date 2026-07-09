export function generateBusinessInsights({
  products = [],
  forecastData = [],
  sales = [],
  totalRevenue = 0,
  totalProfit = 0,
  inventoryValue = 0,
} = {}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeForecast = Array.isArray(forecastData) ? forecastData : [];
  const safeSales = Array.isArray(sales) ? sales : [];

  const totalProducts = safeProducts.length;

  const highRiskProducts = safeForecast.filter((item) => item.risk === "High");
  const mediumRiskProducts = safeForecast.filter(
    (item) => item.risk === "Medium"
  );
  const lowRiskProducts = safeForecast.filter((item) => item.risk === "Low");

  const riskyProducts = highRiskProducts.length + mediumRiskProducts.length;

  const inventoryHealth =
    totalProducts > 0
      ? Math.max(0, Math.round(100 - (riskyProducts / totalProducts) * 50))
      : 100;

const zeroDemandProducts = safeForecast.filter(
  (item) => Number(item.predictedDemand ?? item.forecast ?? 0) === 0
);

const profitMargin =
  Number(totalRevenue) > 0
    ? Math.round((Number(totalProfit) / Number(totalRevenue)) * 100)
    : 0;

let businessScore = inventoryHealth;

businessScore -= highRiskProducts.length * 5;
businessScore -= zeroDemandProducts.length * 3;

if (profitMargin < 20) {
  businessScore -= 8;
}

businessScore = Math.max(40, Math.min(100, Math.round(businessScore)));
let businessHealth = "Excellent";

if (businessScore < 90) {
  businessHealth = "Good";
}

if (businessScore < 75) {
  businessHealth = "Needs Attention";
}

if (businessScore < 60) {
  businessHealth = "Critical";
}
const risks = [];

highRiskProducts.slice(0, 3).forEach((product) => {
  risks.push(
    `${product.productName} may stock out soon. Recommended restock: ${
      product.mlRecommendedRestock ?? product.recommendedRestock ?? 0
    } units.`
  );
});

mediumRiskProducts.slice(0, 3).forEach((product) => {
  risks.push(`${product.productName} needs monitoring due to medium stock risk.`);
});

zeroDemandProducts.slice(0, 2).forEach((product) => {
  risks.push(
    `${product.productName} has zero predicted demand and may be overstocked.`
  );
});

if (!risks.length) {
  risks.push("No significant inventory risks detected.");
}
  const topPriority =
  [...safeForecast].sort(
    (a, b) =>
      Number(b.mlRecommendedRestock ?? b.recommendedRestock ?? 0) -
      Number(a.mlRecommendedRestock ?? a.recommendedRestock ?? 0)
  )[0] || null;

const actions = [];

if (topPriority) {
  actions.push(
    `Prioritize restocking ${topPriority.productName} with ${
      topPriority.mlRecommendedRestock ?? topPriority.recommendedRestock ?? 0
    } units.`
  );
}

highRiskProducts.slice(0, 2).forEach((product) => {
  actions.push(`Create urgent purchase order for ${product.productName}.`);
});

if (mediumRiskProducts.length > 0) {
  actions.push("Review medium-risk products daily before bulk purchasing.");
}

if (zeroDemandProducts.length > 0) {
  actions.push("Avoid purchasing zero-demand products until sales recover.");
}

if (!actions.length) {
  actions.push("Maintain current inventory strategy.");
}
const opportunities = [];

if (topPriority) {
  opportunities.push(
    `Focus on ${topPriority.productName} to protect forecasted revenue.`
  );
}

if (zeroDemandProducts.length > 0) {
  opportunities.push("Reduce capital locked in zero-demand inventory.");
}

if (profitMargin < 25) {
  opportunities.push("Improve pricing or reduce buying cost to increase margin.");
}

if (highRiskProducts.length > 0) {
  opportunities.push("Restock high-demand products to prevent lost sales.");
}

if (!opportunities.length) {
  opportunities.push("Inventory position is healthy. Focus on margin growth.");
}
const executiveSummary = `SmartStock AI analyzed ${totalProducts} inventory product(s). Business health is ${businessHealth} with a score of ${businessScore}/100. ${
  topPriority
    ? `${topPriority.productName} is the top restocking priority.`
    : "No urgent restocking priority was detected."
} ${zeroDemandProducts.length > 0
  ? `${zeroDemandProducts.length} product(s) show zero predicted demand and should be reviewed before repurchasing.`
  : "No major dead-stock signal was detected."
}`;
return {
    totalProducts,
    highRiskProducts,
    mediumRiskProducts,
    lowRiskProducts,
    inventoryHealth,
    businessHealth,
    businessScore,
    zeroDemandProducts,
    profitMargin,
    risks,
    topPriority,
    actions,
    opportunities,
    executiveSummary,
    totalRevenue: Number(totalRevenue) || 0,
    totalProfit: Number(totalProfit) || 0,
    inventoryValue: Number(inventoryValue) || 0,

    products: safeProducts,
    forecastData: safeForecast,
    sales: safeSales,
  };
}