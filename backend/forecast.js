function calculateForecast(products, sales) {
  const today = new Date();

  return products.map((product) => {
    const productSales = sales.filter(
      (sale) =>
        Number(sale.product_id) === Number(product.id)
    );

    const last30Days = productSales.filter((sale) => {
      const saleDate = new Date(
        sale.sale_date || sale.created_at
      );

      const daysAgo =
        (today - saleDate) /
        (1000 * 60 * 60 * 24);

      return daysAgo >= 0 && daysAgo <= 30;
    });

    const last7Days = productSales.filter((sale) => {
      const saleDate = new Date(
        sale.sale_date || sale.created_at
      );

      const daysAgo =
        (today - saleDate) /
        (1000 * 60 * 60 * 24);

      return daysAgo >= 0 && daysAgo <= 7;
    });

    const previous7Days = productSales.filter((sale) => {
      const saleDate = new Date(
        sale.sale_date || sale.created_at
      );

      const daysAgo =
        (today - saleDate) /
        (1000 * 60 * 60 * 24);

      return daysAgo > 7 && daysAgo <= 14;
    });

    const totalSold30 = last30Days.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity_sold || 0),
      0
    );

    const soldLast7 = last7Days.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity_sold || 0),
      0
    );

    const soldPrevious7 = previous7Days.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity_sold || 0),
      0
    );

    /*
     * Count unique selling days instead of dividing sales
     * by all 30 calendar days.
     */
    const activeSellingDays30 = Math.max(
      1,
      new Set(
        last30Days.map((sale) =>
          new Date(
            sale.sale_date || sale.created_at
          )
            .toISOString()
            .slice(0, 10)
        )
      ).size
    );

    const activeSellingDays7 = Math.max(
      1,
      new Set(
        last7Days.map((sale) =>
          new Date(
            sale.sale_date || sale.created_at
          )
            .toISOString()
            .slice(0, 10)
        )
      ).size
    );

    const averageDailySales30 =
      totalSold30 / activeSellingDays30;

    const averageDailySales7 =
      soldLast7 > 0
        ? soldLast7 / activeSellingDays7
        : averageDailySales30;

    /*
     * Give more importance to recent sales while still
     * considering the wider 30-day sales history.
     */
    const averageDailySales = Number(
      (
        averageDailySales7 * 0.6 +
        averageDailySales30 * 0.4
      ).toFixed(2)
    );

    /*
     * Calculate sales trend.
     */
    let trend = "Stable";
    let trendPercent = 0;

    if (soldPrevious7 > 0) {
      trendPercent = Math.round(
        ((soldLast7 - soldPrevious7) /
          soldPrevious7) *
          100
      );

      trendPercent = Math.max(
        -100,
        Math.min(trendPercent, 100)
      );

      if (trendPercent > 10) {
        trend = "Increasing";
      } else if (trendPercent < -10) {
        trend = "Decreasing";
      }
    } else if (soldLast7 > 0) {
      trend = "Increasing";
      trendPercent = 100;
    }

    let trendFactor = 1;

    if (trend === "Increasing") {
      trendFactor = 1.18;
    } else if (trend === "Decreasing") {
      trendFactor = 0.88;
    }

    const adjustedTrendFactor = Math.max(
      0.7,
      Math.min(trendFactor, 1.5)
    );

    /*
     * Separate weekday and weekend demand.
     */
    const weekdaySales = last30Days.filter((sale) => {
      const day = new Date(
        sale.sale_date || sale.created_at
      ).getDay();

      return day !== 0 && day !== 6;
    });

    const weekendSales = last30Days.filter((sale) => {
      const day = new Date(
        sale.sale_date || sale.created_at
      ).getDay();

      return day === 0 || day === 6;
    });

    const totalWeekdaySold = weekdaySales.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity_sold || 0),
      0
    );

    const totalWeekendSold = weekendSales.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity_sold || 0),
      0
    );

    const activeWeekdays = new Set(
      weekdaySales.map((sale) =>
        new Date(
          sale.sale_date || sale.created_at
        )
          .toISOString()
          .slice(0, 10)
      )
    ).size;

    const activeWeekendDays = new Set(
      weekendSales.map((sale) =>
        new Date(
          sale.sale_date || sale.created_at
        )
          .toISOString()
          .slice(0, 10)
      )
    ).size;

    const minimumSeasonalDays = 3;

    const weekdayAverage =
      activeWeekdays >= minimumSeasonalDays
        ? totalWeekdaySold / activeWeekdays
        : averageDailySales;

    const weekendAverage =
      activeWeekendDays >= minimumSeasonalDays
        ? totalWeekendSold / activeWeekendDays
        : averageDailySales;

    /*
     * Forecast future demand using weekday/weekend patterns.
     */
    const calculateSeasonalDemand = (
      numberOfDays
    ) => {
      let demand = 0;

      for (
        let dayOffset = 1;
        dayOffset <= numberOfDays;
        dayOffset++
      ) {
        const futureDate = new Date(today);

        futureDate.setDate(
          today.getDate() + dayOffset
        );

        const futureDay = futureDate.getDay();

        const isWeekend =
          futureDay === 0 || futureDay === 6;

        demand += isWeekend
          ? weekendAverage
          : weekdayAverage;
      }

      return demand;
    };

    const forecast7Days = Math.max(
      0,
      Math.round(
        calculateSeasonalDemand(7) *
          adjustedTrendFactor
      )
    );

    const forecast30Days = Math.max(
      0,
      Math.round(
        calculateSeasonalDemand(30) *
          adjustedTrendFactor
      )
    );

    const currentStock = Number(
      product.quantity || 0
    );

    const daysRemaining =
      averageDailySales > 0
        ? Math.floor(
            currentStock / averageDailySales
          )
        : 999;

    const inventoryTurnover =
      currentStock > 0
        ? Number(
            (
              totalSold30 / currentStock
            ).toFixed(2)
          )
        : 0;

    /*
     * Calculate safety stock and target stock before
     * they are used in the risk calculation.
     */
    const safetyStock = Math.ceil(
      averageDailySales * 7
    );

    const targetStock =
      forecast30Days + safetyStock;

    /*
     * Determine inventory risk.
     */
    let risk = "Low";
    let riskReason =
      "Stock level is sufficient for projected demand.";

    if (averageDailySales === 0) {
      risk = "Low";
      riskReason =
        "No recent sales demand detected.";
    } else if (
      currentStock <= forecast7Days ||
      daysRemaining <= 7
    ) {
      risk = "High";
      riskReason =
        "Current stock may not cover the next 7 days of demand.";
    } else if (
      currentStock < forecast30Days ||
      daysRemaining <= 20
    ) {
      risk = "Medium";
      riskReason =
        "Stock may fall below the projected 30-day demand.";
    } else if (
      targetStock > 0 &&
      currentStock > targetStock * 2
    ) {
      risk = "Overstock";
      riskReason =
        "Current stock is significantly above projected demand.";
    }

    const recommendedRestock = Math.max(
      0,
      Math.ceil(targetStock - currentStock)
    );

    const sellingPrice = Number(
      product.selling_price || 0
    );

    const estimatedRevenueAtRisk = Number(
      (
        recommendedRestock * sellingPrice
      ).toFixed(2)
    );

    /*
     * Calculate forecast confidence.
     */
    let confidence = 55;

    if (productSales.length >= 10) {
      confidence += 10;
    }

    if (productSales.length >= 30) {
      confidence += 10;
    }

    if (productSales.length >= 50) {
      confidence += 10;
    }

    if (soldLast7 > 0) {
      confidence += 5;
    }

    if (activeSellingDays30 >= 10) {
      confidence += 5;
    }

    if (trend !== "Stable") {
      confidence += 5;
    }

    if (soldLast7 === 0) {
      confidence -= 10;
    }

    if (totalSold30 === 0) {
      confidence -= 15;
    }

    confidence = Math.max(
      30,
      Math.min(confidence, 98)
    );

    /*
     * Convert risk into an inventory health score.
     */
    let healthScore = 90;

    if (risk === "High") {
      healthScore = 45;
    } else if (risk === "Medium") {
      healthScore = 70;
    } else if (risk === "Overstock") {
      healthScore = 65;
    }

    return {
      productId: product.id,
      productName: product.item_name,
      category: product.category,

      currentStock,
      averageDailySales,

      forecast7Days,
      forecast30Days,

      inventoryTurnover,
      recommendedRestock,
      safetyStock,
      targetStock,

      confidence,
      risk,
      riskReason,

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