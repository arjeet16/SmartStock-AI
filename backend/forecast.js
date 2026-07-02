function calculateForecast(products, sales) {
  const today = new Date();

  return products.map((product) => {
    const productSales = sales.filter(
      (sale) => Number(sale.product_id) === Number(product.id)
    );

    const last30Days = productSales.filter((sale) => {
      const saleDate = new Date(sale.sale_date || sale.created_at);
      return (today - saleDate) / (1000 * 60 * 60 * 24) <= 30;
    });

    const last7Days = productSales.filter((sale) => {
      const saleDate = new Date(sale.sale_date || sale.created_at);
      return (today - saleDate) / (1000 * 60 * 60 * 24) <= 7;
    });

    const previous7Days = productSales.filter((sale) => {
      const saleDate = new Date(sale.sale_date || sale.created_at);
      const daysAgo = (today - saleDate) / (1000 * 60 * 60 * 24);
      return daysAgo > 7 && daysAgo <= 14;
    });

    const totalSold30 = last30Days.reduce(
      (sum, sale) => sum + Number(sale.quantity_sold),
      0
    );

    const soldLast7 = last7Days.reduce(
      (sum, sale) => sum + Number(sale.quantity_sold),
      0
    );

    const soldPrevious7 = previous7Days.reduce(
      (sum, sale) => sum + Number(sale.quantity_sold),
      0
    );

    const averageDailySales = totalSold30 / 30;

    let trend = "Stable";
    let trendPercent = 0;

    if (soldPrevious7 > 0) {
      trendPercent = Math.round(
        ((soldLast7 - soldPrevious7) / soldPrevious7) * 100
      );

      if (trendPercent > 10) trend = "Increasing";
      else if (trendPercent < -10) trend = "Decreasing";
    } else if (soldLast7 > 0) {
      trend = "Increasing";
      trendPercent = 100;
    }

    let trendFactor = 1;

    if (trend === "Increasing") trendFactor = 1.18;
    if (trend === "Decreasing") trendFactor = 0.88;

    const forecast7Days = Math.round(averageDailySales * 7 * trendFactor);
    const forecast30Days = Math.round(averageDailySales * 30 * trendFactor);

    const currentStock = Number(product.quantity);

    const daysRemaining =
      averageDailySales > 0
        ? Math.floor(currentStock / averageDailySales)
        : 999;

    let risk = "Low";

    if (daysRemaining <= 7) risk = "High";
    else if (daysRemaining <= 20 || currentStock < forecast30Days / 2)
      risk = "Medium";

    const recommendedRestock = Math.max(0, forecast30Days - currentStock);

    const sellingPrice = Number(product.selling_price || 0);
    const estimatedRevenueAtRisk = recommendedRestock * sellingPrice;

    let confidence = 65;

    if (productSales.length >= 20) confidence += 10;
    if (productSales.length >= 50) confidence += 10;
    if (averageDailySales > 0) confidence += 5;
    if (trend !== "Stable") confidence += 5;

    confidence = Math.min(confidence, 95);

    let healthScore = 100;

    if (risk === "High") healthScore = 45;
    else if (risk === "Medium") healthScore = 70;
    else healthScore = 90;

    return {
      productId: product.id,
      productName: product.item_name,
      category: product.category,

      currentStock,
      averageDailySales: Number(averageDailySales.toFixed(2)),

      forecast7Days,
      forecast30Days,

      recommendedRestock,
      confidence,
      risk,

      trend,
      trendPercent,
      daysRemaining,
      estimatedRevenueAtRisk,
      healthScore,
    };
  });
}

module.exports = {
  calculateForecast,
};