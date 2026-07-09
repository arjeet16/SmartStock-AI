export function generateDecision(product) {
  if (!product) return null;

  const productName = product.productName || product.item_name || "Unknown Product";

  const currentStock = Number(
  product.currentStock ??
  product.quantity ??
  0
);
  const forecastDemand = Number(
  product.mlForecast30Days ??
  product.forecast30Days ??
  product.predictedDemand ??
  product.forecast ??
  0
);

  const recommendedPurchase = Math.max(0, forecastDemand - currentStock);

  const sellingPrice = Number(
  product.selling_price ??
  product.sellingPrice ??
  product.sellingPricePerUnit ??
  product.price ??
  0
);

const buyingPrice = Number(
  product.buying_price ??
  product.buyingPrice ??
  product.costPrice ??
  product.cost ??
  0
);
console.log("Decision Product:", product);

  const profitPerUnit = Math.max(0, sellingPrice - buyingPrice);

  const expectedRevenue = recommendedPurchase * sellingPrice;
  const expectedProfit = recommendedPurchase * profitPerUnit;

  let decision = "WAIT";
  let reason = "Current stock is enough for forecasted demand.";
  let confidence = 70;

  if (recommendedPurchase > 0) {
    decision = "RESTOCK NOW";
    reason = `${productName} forecast demand is higher than current stock.`;
    confidence = 92;
  }

  if (recommendedPurchase === 0 && forecastDemand === 0) {
    decision = "DO NOT RESTOCK";
    reason = `${productName} has zero predicted demand. Avoid new purchase.`;
    confidence = 88;
  }

  return {
    productName,
    decision,
    confidence,
    reason,
    currentStock,
    forecastDemand,
    recommendedPurchase,
    expectedRevenue,
    expectedProfit,
  };
}