export default function FinancialDashboard({
  forecastData = [],
  scenario = null,
}) {
  const revenueRisk = forecastData.reduce(
    (sum, item) => sum + Number(item.estimatedRevenueAtRisk || 0),
    0
  );

  const totalRestock = forecastData.reduce(
    (sum, item) =>
      sum + Number(item.mlRecommendedRestock ?? item.recommendedRestock ?? 0),
    0
  );

  const investment = totalRestock * 25;
  const expectedRevenue = Math.round(investment * 1.45);
  const expectedProfit = expectedRevenue - investment;
  const roi =
    investment > 0
      ? Math.round((expectedProfit / investment) * 100)
      : 0;

  return (
    <section className="report-page">

      <h1 className="finance-title">
        Financial & Scenario Analysis
      </h1>

      <div className="finance-grid">

        <div className="finance-card">
          <span>Revenue At Risk</span>
          <strong>₹{revenueRisk.toLocaleString()}</strong>
        </div>

        <div className="finance-card">
          <span>Restock Investment</span>
          <strong>₹{investment.toLocaleString()}</strong>
        </div>

        <div className="finance-card">
          <span>Expected Revenue</span>
          <strong>₹{expectedRevenue.toLocaleString()}</strong>
        </div>

        <div className="finance-card">
          <span>Expected Profit</span>
          <strong>₹{expectedProfit.toLocaleString()}</strong>
        </div>

        <div className="finance-card">
          <span>ROI</span>
          <strong>{roi}%</strong>
        </div>

        <div className="finance-card">
          <span>Decision</span>
          <strong className="finance-success">
            APPROVED
          </strong>
        </div>

      </div>

      <div className="scenario-panel">

        <h2>Scenario Simulation</h2>

        <div className="scenario-report-grid">

          <div>
            <span>Current Stock</span>
            <strong>
              {scenario?.currentStock ?? "--"}
            </strong>
          </div>

          <div>
            <span>Predicted Demand</span>
            <strong>
              {scenario?.predictedDemand ?? "--"}
            </strong>
          </div>

          <div>
            <span>Suggested Restock</span>
            <strong>
              {scenario?.suggestedRestock ?? "--"}
            </strong>
          </div>

          <div>
            <span>Coverage</span>
            <strong>
              {scenario?.adjustedDaysRemaining ?? "--"} Days
            </strong>
          </div>

        </div>

      </div>

      <div className="finance-summary">

        <h2>Business Impact</h2>

        <p>
          Based on AI forecasting and scenario simulation,
          SmartStock AI estimates that recommended restocking
          can improve inventory availability while reducing
          revenue loss and maintaining healthy stock coverage.
        </p>

      </div>

    </section>
  );
}