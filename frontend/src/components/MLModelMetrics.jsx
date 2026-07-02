import { useEffect, useState } from "react";
import { getMLMetrics } from "../services/mlMetricsService";

export default function MLModelMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getMLMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("ML metrics error:", error);
      }
    }

    loadMetrics();
  }, []);

  if (!metrics) return null;

  return (
    <section className="ml-metrics-panel">
      <div className="ml-metrics-header">
        <div>
          <span>🧠 Machine Learning Engine</span>
          <h2>Model Performance</h2>
          <p>Live metadata from the Python Random Forest forecasting service.</p>
        </div>

        <strong>{metrics.status}</strong>
      </div>

      <div className="ml-metrics-grid">
        <div>
          <span>Algorithm</span>
          <strong>{metrics.algorithm}</strong>
        </div>

        <div>
          <span>R² Score</span>
          <strong>{metrics.r2_score}</strong>
        </div>

        <div>
          <span>MAE</span>
          <strong>{metrics.mae}</strong>
        </div>

        <div>
          <span>Training Samples</span>
          <strong>{metrics.training_samples}</strong>
        </div>

        <div>
          <span>Last Trained</span>
          <strong>{metrics.last_trained}</strong>
        </div>

        <div>
          <span>Features</span>
          <strong>{metrics.features.length}</strong>
        </div>
      </div>
    </section>
  );
}