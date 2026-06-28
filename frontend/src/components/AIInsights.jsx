function AIInsights({ products, sales, lowStockCount, totalRevenue, totalProfit }) {
  const topProduct =
    sales.length > 0
      ? sales.reduce((best, current) =>
          Number(current.quantity_sold) > Number(best.quantity_sold)
            ? current
            : best
        ).item_name
      : "No sales yet";

  const inventoryHealth =
    lowStockCount === 0 ? "Excellent" : lowStockCount <= 2 ? "Good" : "Needs Attention";

  const profitMessage =
    totalProfit > 0
      ? "Your inventory is currently profitable."
      : "Profit is low. Review buying and selling prices.";

  return (
    <div className="ai-insights">
      <h2>🤖 AI Inventory Insights</h2>

      <div className="insight-grid">
        <div className="insight-card">
          <h3>Inventory Health</h3>
          <p>{inventoryHealth}</p>
        </div>

        <div className="insight-card">
          <h3>Top Selling Product</h3>
          <p>{topProduct}</p>
        </div>

        <div className="insight-card">
          <h3>Low Stock Alert</h3>
          <p>
            {lowStockCount > 0
              ? `${lowStockCount} items need restocking.`
              : "All items are sufficiently stocked."}
          </p>
        </div>

        <div className="insight-card">
          <h3>Profit Insight</h3>
          <p>{profitMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;