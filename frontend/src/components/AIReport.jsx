import { generateExecutiveReport } from "../services/reportGenerator";
import { generateBusinessInsights } from "../utils/businessInsights";

function AIReport({
  report,
  forecastData = [],
  products = [],
  sales = [],
  totalRevenue = 0,
  totalProfit = 0,
  inventoryValue = 0,
}) {
  if (!report || typeof report !== "object") return null;
  

  const insights = generateBusinessInsights({
    products,
    forecastData,
    sales,
    totalRevenue,
    totalProfit,
    inventoryValue,
  });

  return (
    <div className="ceo-ai-report">
      <div className="ceo-report-hero">
        <div>
          <p className="ceo-badge">AI Executive Intelligence</p>
          <h2>CEO Business Dashboard</h2>
          <p>{insights.executiveSummary || "Executive report generated successfully."}</p>

          <button
            className="download-report-btn"
            onClick={() =>
              generateExecutiveReport({
                forecastData: insights.forecastData,
                businessScore: insights.businessScore,
                businessHealth: insights.businessHealth,
              })
            }
          >
            📄 Download Enterprise Report
          </button>
        </div>

        <div className="ceo-score-card">
          <span>Business Score</span>
          <strong>{insights.businessScore}/100</strong>
          <p>{insights.businessHealth}</p>
        </div>
      </div>

      <div className="ceo-report-grid">
        <div className="ceo-panel risk-panel">
          <h3>⚠️ Business Risks</h3>
          {(insights.risks || []).map((risk, index) => (
            <div className="ceo-list-item" key={index}>
              <span>⚠️</span>
              <p>{risk}</p>
            </div>
          ))}
        </div>

        <div className="ceo-panel action-panel">
          <h3>🚀 Priority Actions</h3>
          {(insights.actions || []).map((item, index) => (
            <div className="ceo-list-item" key={index}>
              <span>✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="ceo-panel profit-panel">
          <h3>💰 Profit Opportunities</h3>
          {(insights.opportunities || []).map((tip, index) => (
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