export function generatePurchaseAdvice(products = [], forecast = []) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeForecast = Array.isArray(forecast) ? forecast : [];

  const decisions = safeForecast.map((forecastItem) => {
    const matchedProduct = safeProducts.find(
      (product) =>
        product.item_name?.toLowerCase() ===
        forecastItem.productName?.toLowerCase()
    );

    const currentStock = Number(forecastItem.currentStock ?? 0);
    const forecastDemand = Number(
      forecastItem.mlForecast30Days ??
        forecastItem.forecast30Days ??
        forecastItem.predictedDemand ??
        0
    );

    const recommendedPurchase = Math.max(0, forecastDemand - currentStock);

    const buyingPrice = Number(matchedProduct?.buying_price ?? 0);
    const sellingPrice = Number(matchedProduct?.selling_price ?? 0);
    const profitPerUnit = Math.max(0, sellingPrice - buyingPrice);

    const investment = recommendedPurchase * buyingPrice;
    const expectedRevenue = recommendedPurchase * sellingPrice;
    const expectedProfit = recommendedPurchase * profitPerUnit;
    const roi =
  investment > 0 ? Math.round((expectedProfit / investment) * 100) : 0;
    let decision = "AVOID PURCHASE";
let status = "danger";

if (recommendedPurchase > 0 && forecastItem.risk === "High") {
  decision = "RESTOCK IMMEDIATELY";
  status = "success";
} else if (recommendedPurchase > 0 && forecastItem.risk === "Medium") {
  decision = "RESTOCK THIS WEEK";
  status = "warning";
} else if (recommendedPurchase > 0) {
  decision = "MONITOR STOCK";
  status = "neutral";
}
    return {
      productName: forecastItem.productName,
      risk: forecastItem.risk,
      currentStock,
      forecastDemand,
      recommendedPurchase,
      investment,
      expectedRevenue,
      expectedProfit,
      roi,
      decision,
      status,
      confidence: forecastItem.confidence ?? 75,
      
    };
  });

  const totalInvestment = decisions.reduce(
    (sum, item) => sum + item.investment,
    0
  );

  const expectedRevenue = decisions.reduce(
    (sum, item) => sum + item.expectedRevenue,
    0
  );

  const expectedProfit = decisions.reduce(
    (sum, item) => sum + item.expectedProfit,
    0
  );

  return {
    decisions,
    totalInvestment,
    expectedRevenue,
    expectedProfit,
  };
}