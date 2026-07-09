export function generateCEOInsights({
  products = [],
  sales = [],
  totalRevenue = 0,
  totalProfit = 0,
  inventoryValue = 0,
  lowStockCount = 0,
  bestSellingProduct = "N/A",
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeSales = Array.isArray(sales) ? sales : [];

  const totalProducts = safeProducts.length;

  const lowStockProducts = safeProducts.filter(
    (product) => Number(product.quantity) <= 10
  );

  const outOfStockProducts = safeProducts.filter(
    (product) => Number(product.quantity) === 0
  );

  const profitableProducts = safeProducts.filter(
    (product) =>
      Number(product.selling_price || product.sellingPrice || 0) >
      Number(product.buying_price || product.buyingPrice || 0)
  );

  const profitMargin =
    totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  const inventoryRisk =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;

  let businessScore = 100;

  businessScore -= inventoryRisk;
  businessScore -= outOfStockProducts.length * 8;

  if (profitMargin < 15) businessScore -= 15;
  if (profitMargin >= 15 && profitMargin < 30) businessScore -= 6;
  if (safeSales.length === 0) businessScore -= 10;
  if (inventoryValue > totalRevenue && totalRevenue > 0) businessScore -= 8;

  businessScore = Math.max(45, Math.min(100, businessScore));

  const healthStatus =
    businessScore >= 90
      ? "Excellent"
      : businessScore >= 75
      ? "Healthy"
      : businessScore >= 60
      ? "Needs Attention"
      : "Critical";

  const risks = [];

  lowStockProducts.slice(0, 3).forEach((product) => {
    risks.push(
      `${product.item_name || product.name} may stock out soon. Current stock: ${
        product.quantity
      } units.`
    );
  });

  outOfStockProducts.slice(0, 2).forEach((product) => {
    risks.push(`${product.item_name || product.name} is currently out of stock.`);
  });

  if (profitMargin < 20) {
    risks.push(
      `Profit margin is only ${profitMargin}%. Review pricing or buying cost.`
    );
  }

  if (risks.length === 0) {
    risks.push("Inventory health is stable with no major immediate risk.");
  }

  const priorityActions = [];

  lowStockProducts.slice(0, 3).forEach((product) => {
    priorityActions.push(
      `Restock ${product.item_name || product.name} before demand increases.`
    );
  });

  if (bestSellingProduct && bestSellingProduct !== "N/A") {
    priorityActions.push(
      `Increase availability of ${bestSellingProduct}, your current best seller.`
    );
  }

  if (profitMargin < 25) {
    priorityActions.push("Improve pricing strategy to increase profit margin.");
  }

  if (priorityActions.length === 0) {
    priorityActions.push("Maintain current inventory strategy and monitor sales.");
  }

  const profitOpportunities = [];

  profitableProducts.slice(0, 3).forEach((product) => {
    const buyingPrice = Number(product.buying_price || product.buyingPrice || 0);
    const sellingPrice = Number(
      product.selling_price || product.sellingPrice || 0
    );
    const margin = sellingPrice - buyingPrice;

    profitOpportunities.push(
      `${product.item_name || product.name} gives ₹${margin} profit per unit. Push this product more.`
    );
  });

  if (inventoryValue > totalRevenue && totalRevenue > 0) {
    profitOpportunities.push(
      "Inventory value is higher than revenue. Convert slow-moving stock into sales."
    );
  }

  if (profitOpportunities.length === 0) {
    profitOpportunities.push("Add more high-margin products to improve growth.");
  }

  return {
    businessScore,
    healthStatus,
    profitMargin,
    risks,
    priorityActions,
    profitOpportunities,
  };
}