import { generateExecutiveReport } from "../services/reportGenerator";

function AIReport({ report, forecastData = [] }) {
  if (!report) return null;

  const highRiskProducts = forecastData.filter((p) => p.risk === "High");
  const mediumRiskProducts = forecastData.filter((p) => p.risk === "Medium");
  const zeroDemandProducts = forecastData.filter(
    (p) => Number(p.mlForecast30Days ?? p.forecast30Days ?? 0) === 0
  );

  const topPriority =
    [...forecastData].sort(
      (a, b) =>
        Number(b.mlRecommendedRestock ?? b.recommendedRestock ?? 0) -
        Number(a.mlRecommendedRestock ?? a.recommendedRestock ?? 0)
    )[0] || null;

  const risks = [];

  if (highRiskProducts.length) {
    risks.push(`${highRiskProducts.length} high-risk product(s) may stock out soon.`);
  }

  if (mediumRiskProducts.length) {
    risks.push(`${mediumRiskProducts.length} medium-risk product(s) require restocking.`);
  }

  if (zeroDemandProducts.length >= 2) {
    risks.push(`${zeroDemandProducts.length} product(s) have zero predicted demand and may be overstocked.`);
  }

  if (!risks.length) {
    risks.push("No significant inventory risks detected.");
  }

  const actions = [
    topPriority
      ? `Prioritize restocking ${topPriority.productName}.`
      : "Maintain current inventory strategy.",
    "Review medium-risk products daily.",
    "Use the What-If Simulator before bulk purchasing.",
  ];

  const profitTips = [
    topPriority
      ? `Focus on ${topPriority.productName} to protect forecasted revenue.`
      : "Monitor profit margins closely.",
    "Avoid overstocking products with zero predicted demand.",
  ];

  return (
    <div className="ceo-ai-report">
      <div className="ceo-report-hero">
        <div>
          <p className="ceo-badge">AI Executive Intelligence</p>
          <h2>CEO Business Dashboard</h2>
          <p>{report.summary}</p>

          <button
            className="download-report-btn"
            onClick={() =>
              generateExecutiveReport({
                forecastData,
                businessScore: report.score,
                businessHealth: report.health,
              })
            }
          >
            📄 Download Enterprise Report
          </button>
        </div>

        <div className="ceo-score-card">
          <span>Business Score</span>
          <strong>{report.score}/100</strong>
          <p>{report.health}</p>
        </div>
      </div>

      <div className="ceo-report-grid">
        <div className="ceo-panel risk-panel">
          <h3>⚠️ Business Risks</h3>
          {risks.map((risk, index) => (
            <div className="ceo-list-item" key={index}>
              <span>⚠️</span>
              <p>{risk}</p>
            </div>
          ))}
        </div>

        <div className="ceo-panel action-panel">
          <h3>🚀 Priority Actions</h3>
          {actions.map((item, index) => (
            <div className="ceo-list-item" key={index}>
              <span>✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="ceo-panel profit-panel">
          <h3>💰 Profit Opportunities</h3>
          {profitTips.map((tip, index) => (
            <div className="ceo-list-item" key={index}>
              <span>₹</span>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIReport;