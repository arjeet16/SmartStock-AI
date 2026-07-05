export default function ExecutiveDashboard({
  forecastData = [],
  businessScore = 85,
}) {
  const totalProducts = forecastData.length;

  const totalRestock = forecastData.reduce(
    (sum, item) =>
      sum + Number(item.mlRecommendedRestock ?? item.recommendedRestock ?? 0),
    0
  );

  const inventoryHealth =
    forecastData.length > 0
      ? Math.round(
          forecastData.reduce(
            (sum, item) => sum + Number(item.healthScore || 0),
            0
          ) / forecastData.length
        )
      : 0;

  const aiConfidence =
    forecastData.length > 0
      ? Math.round(
          forecastData.reduce(
            (sum, item) => sum + Number(item.confidence || 0),
            0
          ) / forecastData.length
        )
      : 0;

  const revenueRisk = forecastData.reduce(
    (sum, item) => sum + Number(item.estimatedRevenueAtRisk || 0),
    0
  );

  const mediumRisk = forecastData.filter(
    (item) => item.risk === "Medium"
  ).length;

  return (
    <section className="report-page">

      <h1 className="dashboard-title">
        Executive Dashboard
      </h1>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span>Business Score</span>
          <strong>{businessScore}/100</strong>
        </div>

        <div className="dashboard-card">
          <span>Inventory Health</span>
          <strong>{inventoryHealth}%</strong>
        </div>

        <div className="dashboard-card">
          <span>AI Confidence</span>
          <strong>{aiConfidence}%</strong>
        </div>

        <div className="dashboard-card">
          <span>Products</span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Restock</span>
          <strong>{totalRestock}</strong>
        </div>

        <div className="dashboard-card">
          <span>Revenue At Risk</span>
          <strong>₹{revenueRisk.toLocaleString()}</strong>
        </div>

      </div>

      <div className="progress-section">

        <div>

          <h3>Inventory Health</h3>

          <div className="progress">
            <div
              className="green"
              style={{ width: `${inventoryHealth}%` }}
            />
          </div>

        </div>

        <div>

          <h3>AI Confidence</h3>

          <div className="progress">
            <div
              className="blue"
              style={{ width: `${aiConfidence}%` }}
            />
          </div>

        </div>

      </div>

      <div className="executive-note">

        <h2>AI Executive Insight</h2>

        <p>
          SmartStock AI analysed <strong>{totalProducts}</strong> products.
          Inventory health is currently <strong>{inventoryHealth}%</strong>.
          AI confidence is <strong>{aiConfidence}%</strong>.
          <strong> {mediumRisk}</strong> products require attention and the
          recommended total restocking quantity is
          <strong> {totalRestock}</strong> units.
        </p>

      </div>

    </section>
  );
}