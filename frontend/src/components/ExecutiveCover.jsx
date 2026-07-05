export default function ExecutiveCover({
  businessScore,
  businessHealth,
  generatedAt,
}) {
  return (
    <section className="report-page report-cover-page">
      <div className="cover-gradient">
        <div>
          <h1>SmartStock AI</h1>

          <h2>Enterprise Inventory Intelligence</h2>

          <p>
            AI • Machine Learning • Demand Forecasting • Scenario Simulation
          </p>
        </div>

        <div className="cover-score">
          <span>Business Score</span>

          <h1>{businessScore}/100</h1>

          <p>{businessHealth}</p>
        </div>
      </div>

      <div className="cover-summary">
        <div className="cover-card">
          <span>Generated</span>
          <strong>{generatedAt}</strong>
        </div>

        <div className="cover-card">
          <span>Version</span>
          <strong>Enterprise V6</strong>
        </div>

        <div className="cover-card">
          <span>Prepared By</span>
          <strong>SmartStock AI</strong>
        </div>

        <div className="cover-card">
          <span>Developer</span>
          <strong>Arjeet Singh</strong>
        </div>
      </div>

      <div className="cover-message">
        <h2>Executive Summary</h2>

        <p>
          This report presents AI-powered inventory intelligence generated using
          Random Forest forecasting, inventory analytics, demand prediction,
          scenario simulation and business recommendation engine.
        </p>
      </div>
    </section>
  );
}