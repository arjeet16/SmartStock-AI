import Card from "./ui/Card";

function DashboardV2({
  totalRevenue,
  totalProfit,
  totalProducts,
  lowStockCount,
  bestSellingProduct,
}) {
  return (
    <div className="dashboard-v2">
      <div className="dashboard-v2-hero">
        <div>
          <p className="dashboard-v2-badge">SmartStock AI v2</p>
          <h1>Inventory Intelligence Command Center</h1>
          <p>
            Monitor revenue, profit, inventory health and AI-powered business
            signals from one premium dashboard.
          </p>
        </div>

        <div className="dashboard-v2-status">
          <span>AI Status</span>
          <strong>Active</strong>
        </div>
      </div>

      <div className="dashboard-v2-metrics">
        <Card>
          <span className="metric-label">Revenue</span>
          <h2>₹{totalRevenue}</h2>
          <p>Live sales revenue</p>
        </Card>

        <Card>
          <span className="metric-label">Profit</span>
          <h2>₹{totalProfit}</h2>
          <p>Current inventory profit</p>
        </Card>

        <Card>
          <span className="metric-label">Products</span>
          <h2>{totalProducts}</h2>
          <p>Total active products</p>
        </Card>

        <Card>
          <span className="metric-label">Low Stock</span>
          <h2>{lowStockCount}</h2>
          <p>Items needing attention</p>
        </Card>
      </div>

      <div className="dashboard-v2-highlight">
        <Card className="highlight-card">
          <span className="metric-label">Best Seller</span>
          <h2>{bestSellingProduct}</h2>
          <p>Top performing product based on sales movement.</p>
        </Card>
      </div>
    </div>
  );
}

export default DashboardV2;