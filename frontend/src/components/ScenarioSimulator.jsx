import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaShieldAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaWallet,
  FaBullseye,
} from "react-icons/fa";

export default function ScenarioSimulator({ forecast = [] }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [additionalStock, setAdditionalStock] = useState(300);

  useEffect(() => {
    if (forecast.length > 0 && !selectedProductId) {
      setSelectedProductId(String(forecast[0].productId));
    }
  }, [forecast, selectedProductId]);

  const product = useMemo(() => {
    return forecast.find(
      (item) => Number(item.productId) === Number(selectedProductId)
    );
  }, [forecast, selectedProductId]);

  if (!forecast.length || !product) {
    return null;
  }

  const currentStock = Number(product.currentStock || 0);
  const avgDailySales = Number(product.averageDailySales || 0);

  const currentForecast = Number(
    product.mlForecast30Days ?? product.forecast30Days ?? 0
  );

  const additional = Number(additionalStock);
  const newStock = currentStock + additional;
  const remainingStock = Math.max(0, newStock - currentForecast);

  const coverage =
    avgDailySales > 0 ? Math.round(newStock / avgDailySales) : 999;

  const currentCoverage =
    avgDailySales > 0 ? Math.round(currentStock / avgDailySales) : 999;

  const sellingPrice = Number(
    product.selling_price || product.sellingPrice || 50
  );

  const buyingPrice = Number(
    product.buying_price || product.buyingPrice || 30
  );

  const investment = additional * buyingPrice;
  const expectedRevenue = currentForecast * sellingPrice;

  const expectedProfit =
    currentForecast * Math.max(0, sellingPrice - buyingPrice);

  const roi =
    investment > 0
      ? Math.round((expectedProfit / investment) * 100)
      : 0;

  const riskAfter = remainingStock > 0 ? "Low" : "High";

  let decisionScore = 65;

  if (remainingStock > 0) decisionScore += 10;
  if (coverage > 30 || coverage === 999) decisionScore += 10;
  if (roi >= 20) decisionScore += 10;
  if (riskAfter === "Low") decisionScore += 5;

  decisionScore = Math.min(decisionScore, 100);

  const scoreLabel =
    decisionScore >= 90
      ? "Excellent"
      : decisionScore >= 75
      ? "Good"
      : "Needs Review";

  const barMax = Math.max(
    newStock,
    currentForecast,
    currentStock,
    1
  );

  const productName =
    product.productName ||
    product.itemName ||
    product.item_name ||
    "Product";

  const demandTrend = product.trend || "Stable";

  return (
    <section className="stock-simulator-pro">
      {/* PREMIUM HEADER */}
      <div className="simulator-header">
        <div className="simulator-title">
          <div className="simulator-icon">🧪</div>

          <div>
            <span className="simulator-tag">
              Phase 12 • What-If Analysis
            </span>

            <h2>AI Stock Planning Simulator</h2>

            <p>
              Simulate purchasing decisions, estimate ROI and compare
              inventory outcomes before investing.
            </p>
          </div>
        </div>

        <div className="decision-score-card">
          <small>AI Decision Score</small>

          <h1>{decisionScore}/100</h1>

          <span>{scoreLabel}</span>
        </div>
      </div>

      {/* PRODUCT SELECTOR */}
      <div className="simulator-selector-card">
        <div className="simulator-selector-copy">
          <span>Select Product</span>

          <p>
            Choose an inventory item to simulate a purchasing decision.
          </p>
        </div>

        <div className="simulator-select-wrapper">
          <div className="simulator-product-avatar">
            {productName.charAt(0).toUpperCase()}
          </div>

          <select
            value={selectedProductId}
            onChange={(event) =>
              setSelectedProductId(event.target.value)
            }
          >
            {forecast.map((item) => {
              const itemName =
                item.productName ||
                item.itemName ||
                item.item_name ||
                "Product";

              return (
                <option
                  key={item.productId}
                  value={String(item.productId)}
                >
                  {itemName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* PREMIUM KPI CARDS */}
      <div className="simulator-kpi-grid">
        <article className="simulator-kpi-card simulator-kpi-blue">
          <div className="simulator-kpi-icon">
            <FaBoxOpen />
          </div>

          <div>
            <span>Current Stock</span>
            <h3>{currentStock}</h3>
            <small>units available</small>
          </div>

          <div className="simulator-mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>

        <article className="simulator-kpi-card simulator-kpi-green">
          <div className="simulator-kpi-icon">
            <FaChartLine />
          </div>

          <div>
            <span>Average Daily Sales</span>
            <h3>{avgDailySales}</h3>
            <small>units per day</small>
          </div>

          <div className="simulator-mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>

        <article className="simulator-kpi-card simulator-kpi-orange">
          <div className="simulator-kpi-icon">
            <FaChartLine />
          </div>

          <div>
            <span>Demand Trend</span>
            <h3>{demandTrend}</h3>
            <small>
              {Number(product.trendPercent) > 0
                ? `+${product.trendPercent}% movement`
                : "Stable movement"}
            </small>
          </div>

          <div className="simulator-mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>

        <article className="simulator-kpi-card simulator-kpi-purple">
          <div className="simulator-kpi-icon">
            <FaChartLine />
          </div>

          <div>
            <span>Current ML Forecast</span>
            <h3>{currentForecast}</h3>
            <small>units expected</small>
          </div>

          <div className="simulator-mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>
      </div>

      {/* SLIDER + BEFORE AFTER */}
      <div className="sim-main-grid">
        <div className="sim-slider-card">
          <span>Additional Stock</span>
          <h3>{additional} units</h3>

          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={additionalStock}
            onChange={(event) =>
              setAdditionalStock(Number(event.target.value))
            }
          />

          <div className="range-labels">
            <span>0</span>
            <span>125</span>
            <span>250</span>
            <span>375</span>
            <span>500</span>
          </div>

          <div className="slider-mini-summary">
            <div>
              <span>Estimated Cost</span>
              <strong>₹{investment.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>After Stock</span>
              <strong>{newStock} units</strong>
            </div>
          </div>
        </div>

        <div className="before-sim-card">
          <h3>Before vs After</h3>

          <p>
            <span>Coverage</span>

            <strong>
              {currentCoverage === 999
                ? "Stable"
                : `${currentCoverage} days`}{" "}
              →{" "}
              {coverage === 999
                ? "Stable"
                : `${coverage} days`}
            </strong>
          </p>

          <p>
            <span>Risk</span>
            <strong>
              {product.risk || "Medium"} → {riskAfter}
            </strong>
          </p>

          <p>
            <span>Stock</span>
            <strong>
              {currentStock} → {newStock}
            </strong>
          </p>
        </div>
      </div>

      {/* AFTER SIMULATION */}
      <div className="after-section">
        <h3>After Simulation Results</h3>

        <div className="after-grid">
          <div>
            <FaBoxOpen />
            <span>New Stock</span>
            <strong>{newStock}</strong>
            <small>units</small>
          </div>

          <div>
            <FaChartLine />
            <span>Predicted Demand</span>
            <strong>{currentForecast}</strong>
            <small>units</small>
          </div>

          <div>
            <FaShieldAlt />
            <span>Remaining Stock</span>
            <strong>{remainingStock}</strong>
            <small>units</small>
          </div>

          <div>
            <FaCalendarAlt />
            <span>Coverage</span>
            <strong>
              {coverage === 999 ? "Stable" : coverage}
            </strong>
            <small>
              {coverage === 999 ? "inventory" : "days"}
            </small>
          </div>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card">
            <h4>Inventory Position Comparison</h4>

            <div className="bar-row">
              <span>Current Stock ({currentStock})</span>

              <div>
                <b
                  style={{
                    width: `${(currentStock / barMax) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bar-row purple">
              <span>Predicted Demand ({currentForecast})</span>

              <div>
                <b
                  style={{
                    width: `${(currentForecast / barMax) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bar-row green">
              <span>After Purchase ({newStock})</span>

              <div>
                <b
                  style={{
                    width: `${(newStock / barMax) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="risk-after-card">
            <FaShieldAlt />

            <span>Risk After Simulation</span>

            <h3>{riskAfter}</h3>

            <p>
              {riskAfter === "Low"
                ? "Inventory position is safe and can meet forecasted demand."
                : "Inventory may still be insufficient after this purchase."}
            </p>
          </div>
        </div>

        <h3 className="financial-title">
          Financial Impact Estimates
        </h3>

        <div className="financial-grid">
          <div>
            <FaRupeeSign />
            <span>Inventory Investment</span>
            <strong>
              ₹{investment.toLocaleString("en-IN")}
            </strong>
            <small>Additional cost</small>
          </div>

          <div>
            <FaChartLine />
            <span>Expected Revenue</span>
            <strong>
              ₹{expectedRevenue.toLocaleString("en-IN")}
            </strong>
            <small>Projected revenue</small>
          </div>

          <div>
            <FaWallet />
            <span>Expected Profit</span>
            <strong>
              ₹{expectedProfit.toLocaleString("en-IN")}
            </strong>
            <small>Estimated profit</small>
          </div>

          <div>
            <FaBullseye />
            <span>ROI</span>
            <strong>{roi}%</strong>
            <small>Return on investment</small>
          </div>
        </div>

        <div className="final-ai-recommendation">
          <div>
            <span>🤖 AI Executive Recommendation</span>

            <h3>
              {riskAfter === "Low"
                ? "This restocking plan is operationally safe."
                : "Increase stock to reduce shortage risk."}
            </h3>

            <p>
              Purchasing {additional} additional units changes
              coverage from{" "}
              {currentCoverage === 999
                ? "stable"
                : `${currentCoverage} days`}{" "}
              to{" "}
              {coverage === 999
                ? "stable"
                : `${coverage} days`}
              . Estimated ROI is {roi}%, with expected profit of ₹
              {expectedProfit.toLocaleString("en-IN")}.
            </p>
          </div>

          <div className="big-check">✓</div>
        </div>
      </div>
    </section>
  );
}