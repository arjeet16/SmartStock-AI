function AIBusinessAssistant({
  products,
  sales,
  lowStockCount,
  totalRevenue,
  totalProfit,
  bestSellingProduct,
}) {
  const lowStockProducts = products.filter(
    (item) => Number(item.quantity) < 10
  );

  const restockProduct =
    lowStockProducts.length > 0
      ? lowStockProducts[0].item_name
      : "No urgent restock";

  return (
    <div className="ai-business-assistant">
      <div className="assistant-header">
        <div>
          <p className="assistant-badge">SmartStock Intelligence</p>
          <h2>🤖 AI Business Assistant</h2>
          <p>
            Real-time inventory recommendations based on your products,
            sales and stock movement.
          </p>
        </div>

        <button className="generate-report-btn">
          ✨ Generate AI Report
        </button>
      </div>

      <div className="assistant-grid">
        <div className="assistant-card">
          <span>📦</span>
          <h3>Inventory Health</h3>
          <p>{lowStockCount <= 1 ? "Good" : "Needs Attention"}</p>
        </div>

        <div className="assistant-card">
          <span>🔥</span>
          <h3>Best Seller</h3>
          <p>{bestSellingProduct}</p>
        </div>

        <div className="assistant-card warning">
          <span>⚠️</span>
          <h3>Restock Priority</h3>
          <p>{restockProduct}</p>
        </div>

        <div className="assistant-card">
          <span>💰</span>
          <h3>Profit Status</h3>
          <p>
            {totalProfit > 0
              ? "Healthy profit margin"
              : "Review product pricing"}
          </p>
        </div>

        <div className="assistant-card">
          <span>📈</span>
          <h3>Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>

        <div className="assistant-card">
          <span>🎯</span>
          <h3>AI Confidence</h3>
          <p>92%</p>
        </div>
      </div>
    </div>
  );
}

export default AIBusinessAssistant;