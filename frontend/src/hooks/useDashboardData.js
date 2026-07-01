import { useMemo } from "react";

export function useDashboardData(products, sales) {
  return useMemo(() => {
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    const totalProfit = sales.reduce(
      (sum, sale) => sum + Number(sale.profit || 0),
      0
    );

    const inventoryValue = products.reduce(
      (sum, product) =>
        sum +
        Number(product.quantity || 0) *
          Number(product.selling_price || 0),
      0
    );

    const lowStockCount = products.filter(
      (product) => Number(product.quantity) <= 5
    ).length;

    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, product) => sum + Number(product.quantity || 0),
      0
    );

    const bestSellingProduct =
      sales.length > 0
        ? sales.reduce((best, current) =>
            current.quantity_sold > best.quantity_sold ? current : best
          ).item_name
        : "No Sales";

    return {
      totalRevenue,
      totalProfit,
      inventoryValue,
      lowStockCount,
      totalProducts,
      totalQuantity,
      bestSellingProduct,
    };
  }, [products, sales]);
}