function AIReport({ report }) {
  if (!report) return null;

  return (
    <div className="ceo-ai-report">
      <div className="ceo-report-hero">
        <div>
          <p className="ceo-badge">AI Executive Intelligence</p>
          <h2>CEO Business Dashboard</h2>
          <p>{report.summary}</p>
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
          {report.risks.map((risk, index) => (
            <div className="ceo-list-item" key={index}>
              <span>!</span>
              <p>{risk}</p>
            </div>
          ))}
        </div>

        <div className="ceo-panel action-panel">
          <h3>🚀 Priority Actions</h3>
          {report.recommendations.map((item, index) => (
            <div className="ceo-list-item" key={index}>
              <span>✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="ceo-panel profit-panel">
          <h3>💰 Profit Opportunities</h3>
          {report.profitTips.map((tip, index) => (
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