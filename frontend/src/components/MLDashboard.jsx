export default function MLDashboard({ metrics }) {
  const model = metrics || {
    algorithm: "Random Forest Regressor",
    r2_score: 0.89,
    mae: 9.29,
    training_samples: 12,
    status: "Production Ready",
    last_trained: "2026-07-02",
  };

  return (
    <section className="report-page">

      <h1 className="ml-title">
        Machine Learning Analytics
      </h1>

      <div className="ml-grid">

        <div className="ml-card">
          <span>Algorithm</span>
          <strong>{model.algorithm}</strong>
        </div>

        <div className="ml-card">
          <span>R² Score</span>
          <strong>{model.r2_score}</strong>
        </div>

        <div className="ml-card">
          <span>MAE</span>
          <strong>{model.mae}</strong>
        </div>

        <div className="ml-card">
          <span>Training Samples</span>
          <strong>{model.training_samples}</strong>
        </div>

        <div className="ml-card">
          <span>Status</span>
          <strong className="status-green">
            {model.status}
          </strong>
        </div>

        <div className="ml-card">
          <span>Last Trained</span>
          <strong>{model.last_trained}</strong>
        </div>

      </div>

      <h2 className="feature-title">
        Feature Importance
      </h2>

      <div className="feature-bars">

        <div className="feature-item">
          <span>Average Daily Sales</span>
          <div className="feature-progress">
            <div style={{ width: "45%" }} />
          </div>
          <strong>45%</strong>
        </div>

        <div className="feature-item">
          <span>Current Stock</span>
          <div className="feature-progress">
            <div style={{ width: "30%" }} />
          </div>
          <strong>30%</strong>
        </div>

        <div className="feature-item">
          <span>Trend Percent</span>
          <div className="feature-progress">
            <div style={{ width: "15%" }} />
          </div>
          <strong>15%</strong>
        </div>

        <div className="feature-item">
          <span>Days Remaining</span>
          <div className="feature-progress">
            <div style={{ width: "10%" }} />
          </div>
          <strong>10%</strong>
        </div>

      </div>

      <div className="ml-explanation">

        <h2>Explainable AI</h2>

        <p>
          SmartStock AI uses a Random Forest Regressor trained on inventory
          coverage, demand trend, daily sales velocity and stock availability.
          Business rules automatically prevent overstock recommendations when
          demand is zero, improving forecast reliability.
        </p>

      </div>

    </section>
  );
}