import { useEffect, useState } from "react";
import { getForecast } from "../services/forecastService";
import {
  FaBoxOpen,
  FaChartLine,
  FaExclamationTriangle,
  FaFire,
  FaSyncAlt,
} from "react-icons/fa";

export default function DemandForecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      setLoading(true);
      const data = await getForecast();
      setForecast(data);
    } catch (error) {
      console.error("Forecast error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (risk) => {
    if (risk === "High") return "risk-high";
    if (risk === "Medium") return "risk-medium";
    return "risk-low";
  };

  const getPriority = (item) => {
    if (item.risk === "High") return "Urgent";
    if (item.risk === "Medium" && item.recommendedRestock > 0) return "Soon";
    return "Normal";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Urgent") return "priority-urgent";
    if (priority === "Soon") return "priority-soon";
    return "priority-normal";
  };

  const getAiRecommendation = (item) => {
    if (item.risk === "High") {
      return `Demand may exceed current stock soon. Restock ${item.recommendedRestock} units immediately to avoid stockout.`;
    }

    if (item.risk === "Medium") {
      return `Sales velocity is active. Restock ${item.recommendedRestock} units within the next few days.`;
    }

    if (item.forecast30Days === 0) {
      return "No strong demand signal yet. Keep monitoring sales before restocking.";
    }

    return "Inventory looks healthy. No immediate restocking action is required.";
  };
  const totalProducts = forecast.length;

const highRisk = forecast.filter((item) => item.risk === "High").length;
const mediumRisk = forecast.filter((item) => item.risk === "Medium").length;
const lowRisk = forecast.filter((item) => item.risk === "Low").length;

const totalRestock = forecast.reduce(
  (sum, item) => sum + Number(item.recommendedRestock),
  0
);

const avgConfidence =
  forecast.length > 0
    ? Math.round(
        forecast.reduce((sum, item) => sum + Number(item.confidence), 0) /
          forecast.length
      )
    : 0;
  const avgHealth =
  forecast.length > 0
    ? Math.round(
        forecast.reduce(
          (sum, item) => sum + Number(item.healthScore || 0),
          0
        ) / forecast.length
      )
    : 0;

const revenueAtRisk = forecast.reduce(
  (sum, item) => sum + Number(item.estimatedRevenueAtRisk || 0),
  0
);

const priorityProduct =
  [...forecast].sort(
    (a, b) => b.recommendedRestock - a.recommendedRestock
  )[0];
  const aiExecutiveInsight = `Inventory health is currently ${avgHealth}%. ${mediumRisk} products need attention, with ${priorityProduct?.productName || "no product"} as the top restocking priority. Estimated revenue at risk is ₹${revenueAtRisk.toLocaleString()}. Recommended total restock quantity is ${totalRestock} units.`;
  if (loading) {
    return (
      <section className="forecast-section">
        <h2>AI Demand Forecasting</h2>
        <p>Loading forecast engine...</p>
      </section>
    );
  }

  return (
    <section className="forecast-section">
      <div className="forecast-header">
        <div>
          <span className="section-pill">Phase 9 · AI Forecast Engine</span>
          <h2>AI Demand Forecasting</h2>
          <p>
            Predict future demand, stockout risk, restocking priority and
            business action.
          </p>
        </div>

        <button onClick={loadForecast}>
          <FaSyncAlt /> Refresh Forecast
        </button>
      </div>
      <div className="forecast-summary">
  <div>
    <span>Products Analysed</span>
    <strong>{totalProducts}</strong>
  </div>

  <div>
    <span>High Risk</span>
    <strong>{highRisk}</strong>
  </div>

  <div>
    <span>Medium Risk</span>
    <strong>{mediumRisk}</strong>
  </div>

  <div>
    <span>Low Risk</span>
    <strong>{lowRisk}</strong>
  </div>

  <div>
    <span>Total Restock</span>
    <strong>{totalRestock} units</strong>
  </div>

  <div>
    <span>Avg Confidence</span>
    <strong>{avgConfidence}%</strong>
  </div>
  <div>
  <span>Inventory Health</span>
  <strong>{avgHealth}%</strong>
</div>

<div>
  <span>Revenue At Risk</span>
  <strong>₹{revenueAtRisk.toLocaleString()}</strong>
</div>

<div>
  <span>Top Priority</span>
  <strong>{priorityProduct?.productName || "-"}</strong>
</div>

</div>

<div className="executive-ai-panel">
  <div className="executive-ai-content">
    <span>🤖 AI Executive Insight</span>
    <h3>Smart Inventory Action Summary</h3>
    <p>{aiExecutiveInsight}</p>
  </div>

  <button>View Detailed Plan</button>
</div>

<div className="forecast-grid forecast-grid-v2">
  {forecast.map((item) => {
    const priority = getPriority(item);

    return (
            <div className="forecast-card forecast-card-v2" key={item.productId}>
              <div className="forecast-card-top">
                <div>
                  <h3>{item.productName}</h3>
                  <span>{item.category}</span>
                </div>

                <span className={`risk-badge ${getRiskClass(item.risk)}`}>
                  {item.risk} Risk
                </span>
              </div>

              <div className="forecast-hero">
                <div>
                  <p>Next 30-Day Demand</p>
                  <h2>{item.forecast30Days}</h2>
                  <span>units expected</span>
                </div>

                <div className={`priority-badge ${getPriorityClass(priority)}`}>
                  <FaFire />
                  {priority}
                </div>
              </div>

              <div className="forecast-metrics forecast-metrics-v2">
                <div>
                  <FaChartLine />
                  <p>7-Day</p>
                  <h4>{item.forecast7Days}</h4>
                </div>

                <div>
                  <FaBoxOpen />
                  <p>Stock</p>
                  <h4>{item.currentStock}</h4>
                </div>

                <div>
                  <FaExclamationTriangle />
                  <p>Restock</p>
                  <h4>{item.recommendedRestock}</h4>
                </div>
              </div>

              <div className="confidence-row">
                <span>Forecast Confidence</span>
                <strong>{item.confidence}%</strong>
              </div>

              <div className="confidence-bar">
                <div style={{ width: `${item.confidence}%` }}></div>
              </div>

              <div className="mini-trend">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="forecast-ai-box">
                <h4>AI Recommendation</h4>
                <p>{getAiRecommendation(item)}</p>
              </div>

              <p className="forecast-note">
                Avg daily sales: <strong>{item.averageDailySales}</strong> units
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}