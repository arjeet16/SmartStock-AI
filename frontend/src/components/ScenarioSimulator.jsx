import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaExclamationTriangle,
  FaRobot,
} from "react-icons/fa";
import { simulateForecast } from "../services/simulatorService";

export default function ScenarioSimulator({ forecast = [] }) {
  const [selectedId, setSelectedId] = useState("");
  const [additionalStock, setAdditionalStock] = useState(50);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
    useEffect(() => {
    if (forecast.length && !selectedId) {
      setSelectedId(String(forecast[0].productId));
    }
  }, [forecast]);
  const selectedProduct =
    forecast.find((item) => String(item.productId) === String(selectedId)) ||
    forecast[0];

  if (!forecast.length) return null;

  const currentForecast =
    selectedProduct.mlForecast30Days ?? selectedProduct.forecast30Days;

  const currentShortage =
    selectedProduct.currentStock - currentForecast;

  const runSimulation = async () => {
    try {
      setLoading(true);

      const data = await simulateForecast({
        currentStock: selectedProduct.currentStock,
        additionalStock,
        averageDailySales: selectedProduct.averageDailySales,
        trendPercent: selectedProduct.trendPercent,
      });

      setResult(data);
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictClass = () => {
    if (!result) return "";
    if (result.remainingStock < 0) return "scenario-danger";
    if (result.remainingStock < 20) return "scenario-warning";
    return "scenario-success";
  };

  return (
    <section className="scenario-panel scenario-panel-v2">
      <div className="scenario-topbar">
        <div>
          <span className="section-pill">Phase 12 · What-If Analysis</span>
          <h2>AI Stock Planning Simulator</h2>
          <p>
            Simulate restocking decisions and see how AI predicts inventory
            impact.
          </p>
        </div>

        <div className="scenario-select-card">
          <label>Select Product</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setResult(null);
            }}
          >
            {forecast.map((item) => (
              <option key={item.productId} value={item.productId}>
                {item.productName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="scenario-context">
        <div className="scenario-item">
          <span>Current Stock</span>
          <strong>{selectedProduct.currentStock}</strong>
        </div>

        <div className="scenario-item">
          <span>Average Daily Sales</span>
          <strong>{selectedProduct.averageDailySales} units/day</strong>
        </div>

        <div className="scenario-item">
          <span>Demand Trend</span>
          <strong>
            {selectedProduct.trend}
            {selectedProduct.trendPercent > 0
              ? ` (+${selectedProduct.trendPercent}%)`
              : ""}
          </strong>
        </div>

        <div className="scenario-item">
          <span>Current ML Forecast</span>
          <strong>{currentForecast} units</strong>
        </div>
      </div>

      <div className="scenario-planner">
        <div className="scenario-slider-card">
          <div className="scenario-slider-header">
            <div>
              <span>Additional Stock</span>
              <h3>{additionalStock} units</h3>
            </div>

            <input
              type="number"
              min="0"
              max="300"
              value={additionalStock}
              onChange={(e) => setAdditionalStock(Number(e.target.value))}
            />
          </div>

          <input
            type="range"
            min="0"
            max="300"
            value={additionalStock}
            onChange={(e) => setAdditionalStock(Number(e.target.value))}
          />

          <button onClick={runSimulation} disabled={loading}>
            {loading ? "Simulating..." : "Run AI Simulation"}
          </button>
        </div>

        <div className="scenario-before-card">
          <h4>Before Simulation</h4>

          <p>
            <span>Current Forecast</span>
            <strong>{currentForecast} units</strong>
          </p>

          <p>
            <span>Current Shortage</span>
            <strong>{currentShortage} units</strong>
          </p>

          <p>
            <span>Current Risk</span>
            <strong>{selectedProduct.risk}</strong>
          </p>
        </div>
      </div>

      {result && (
        <>
          <div className="scenario-result scenario-result-v2">
            <div>
              <FaBoxOpen />
              <span>New Stock</span>
              <strong>{result.newStock}</strong>
            </div>

            <div>
              <FaChartLine />
              <span>Predicted Demand</span>
              <strong>{result.predictedDemand}</strong>
            </div>

            <div>
              <FaExclamationTriangle />
              <span>Remaining Stock</span>
              <strong>{result.remainingStock}</strong>
            </div>

            <div>
              <FaChartLine />
              <span>Coverage</span>
              <strong>
                {result.daysCoverage === 999
                  ? "Stable"
                  : `${result.daysCoverage} days`}
              </strong>
            </div>
          </div>

          <div className={`scenario-verdict ${getVerdictClass()}`}>
            <div>
              <FaRobot />
            </div>

            <div>
              <span>AI Recommendation</span>
              <h3>{result.recommendation}</h3>

              {result.remainingStock < 0 ? (
                <p>
                  Inventory will still fall short by{" "}
                  <strong>{Math.abs(result.remainingStock)} units</strong>.
                  Consider increasing purchase quantity.
                </p>
              ) : (
                <p>
                  This scenario creates a safer inventory position after
                  forecasted demand.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}