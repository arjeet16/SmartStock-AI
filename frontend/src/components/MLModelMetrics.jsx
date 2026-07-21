import { useEffect, useState } from "react";
import { authFetch } from "../services/authFetch";

export default function MLModelMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        const data = await authFetch("/ml-metrics");
        console.log("ML Metrics Response:", data);
        if (isMounted) {
          setMetrics(data?.metrics ?? null);
        }
      } catch (error) {
        console.error("ML metrics error:", error);

        if (isMounted) {
          setMetrics(null);
        }
      }
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!metrics) return null;

  const features = Array.isArray(metrics.features)
    ? metrics.features
    : [];

  return (
    <section className="ml-metrics-panel">
      <div className="ml-metrics-header">
        <div>
          <span>🧠 Machine Learning Engine</span>
          <h2>Model Performance</h2>
          <p>
            Live metadata from the Python Random Forest forecasting service.
          </p>
        </div>

        <strong>{metrics.status || "Healthy"}</strong>
      </div>

      <div className="ml-metrics-grid">
        <div>
          <span>Algorithm</span>
          <strong>{metrics.algorithm || "Random Forest"}</strong>
        </div>

        <div>
          <span>R² Score</span>
          <strong>{metrics.r2_score ?? "-"}</strong>
        </div>

        <div>
          <span>MAE</span>
          <strong>{metrics.mae ?? "-"}</strong>
        </div>

        <div>
          <span>Training Samples</span>
          <strong>{metrics.training_samples ?? "-"}</strong>
        </div>

        <div>
          <span>Last Trained</span>
          <strong>{metrics.last_trained ?? "-"}</strong>
        </div>

        <div>
          <span>Features</span>
          <strong>{features.length}</strong>
        </div>
      </div>
    </section>
  );
}