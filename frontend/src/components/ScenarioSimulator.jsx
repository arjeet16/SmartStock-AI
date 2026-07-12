import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaShieldAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaWallet,
  FaBullseye,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  fastStaggerContainer,
  motionViewport,
  cardHover,
  progressReveal,
} from "../utils/motion";
import AnimatedNumber from "./ui/AnimatedNumber";
const MAX_STOCK = 500;
const STOCK_STEP = 10;

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatCoverage(value) {
  return value === 999 ? "Stable" : `${value} days`;
}

export default function ScenarioSimulator({ forecast = [] }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [additionalStock, setAdditionalStock] = useState(300);

  useEffect(() => {
    if (!forecast.length) {
      setSelectedProductId("");
      return;
    }

    const selectedStillExists = forecast.some(
      (item) => String(item.productId) === String(selectedProductId)
    );

    if (!selectedProductId || !selectedStillExists) {
      setSelectedProductId(String(forecast[0].productId));
    }
  }, [forecast, selectedProductId]);

  const product = useMemo(
    () =>
      forecast.find(
        (item) => Number(item.productId) === Number(selectedProductId)
      ),
    [forecast, selectedProductId]
  );

  if (!forecast.length || !product) {
    return null;
  }

  const productName =
    product.productName ||
    product.itemName ||
    product.item_name ||
    "Product";

  const currentStock = Number(product.currentStock || 0);
  const avgDailySales = Number(product.averageDailySales || 0);
  const currentForecast = Number(
    product.mlForecast30Days ?? product.forecast30Days ?? 0
  );

  const buyingPrice = Number(
    product.buying_price ?? product.buyingPrice ?? 30
  );

  const sellingPrice = Number(
    product.selling_price ?? product.sellingPrice ?? 50
  );

  const additional = Number(additionalStock);
  const newStock = currentStock + additional;
  const remainingStock = Math.max(0, newStock - currentForecast);

  const currentCoverage =
    avgDailySales > 0 ? Math.round(currentStock / avgDailySales) : 999;

  const coverage =
    avgDailySales > 0 ? Math.round(newStock / avgDailySales) : 999;

  const investment = additional * buyingPrice;
  const expectedUnitsSold = Math.min(currentForecast, newStock);
  const expectedRevenue = expectedUnitsSold * sellingPrice;
  const expectedProfit =
    expectedUnitsSold * Math.max(0, sellingPrice - buyingPrice);

  const roi =
    investment > 0
      ? Math.round((expectedProfit / investment) * 100)
      : 0;

  const riskAfter = newStock >= currentForecast ? "Low" : "High";

  let decisionScore = 60;

  if (newStock >= currentForecast) decisionScore += 15;
  if (coverage >= 30 || coverage === 999) decisionScore += 10;
  if (roi >= 20) decisionScore += 10;
  if (riskAfter === "Low") decisionScore += 5;

  decisionScore = Math.min(decisionScore, 100);

  const scoreLabel =
    decisionScore >= 90
      ? "Excellent"
      : decisionScore >= 75
      ? "Good"
      : "Needs Review";

  const demandTrend = product.trend || "Stable";
  const currentRisk = product.risk || "Medium";

  const barMax = Math.max(
    currentStock,
    currentForecast,
    newStock,
    1
  );

  const stockIncreasePercent =
    currentStock > 0
      ? Math.round(((newStock - currentStock) / currentStock) * 100)
      : additional > 0
      ? 100
      : 0;

  const decreaseStock = () => {
    setAdditionalStock((previous) =>
      Math.max(0, previous - STOCK_STEP)
    );
  };

  const increaseStock = () => {
    setAdditionalStock((previous) =>
      Math.min(MAX_STOCK, previous + STOCK_STEP)
    );
  };

  return (
    <motion.section
  className="stock-simulator-pro"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={motionViewport}
> 
      <header className="simulator-header">
        <div className="simulator-title">
          <div className="simulator-icon" aria-hidden="true">
            🧪
          </div>

          <div>
            <span className="simulator-tag">
              Phase 12 • AI What-If Analysis
            </span>

            <h2>AI Stock Planning Simulator</h2>

            <p>
              Simulate purchasing decisions, estimate ROI, compare stock
              coverage and measure business impact before investing.
            </p>
          </div>
        </div>

        <aside className="decision-score-card">
          <small>AI Decision Score</small>
          <h3>
  <AnimatedNumber value={decisionScore} suffix="/100" />
</h3>
          <span>{scoreLabel}</span>
        </aside>
      </header>

      <div className="simulator-selector-card">
        <div className="simulator-selector-copy">
          <span>Select Product</span>
          <p>
            Choose an inventory item to evaluate a purchasing decision.
          </p>
        </div>

        <div className="simulator-select-wrapper">
          <div className="simulator-product-avatar">
            {productName.charAt(0).toUpperCase()}
          </div>

          <div className="simulator-select-content">
            <small>Active product</small>

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
      </div>

      <div className="simulator-kpi-grid">
        <motion.article
  className="simulator-kpi-card simulator-kpi-blue"
  variants={fadeUp}
  whileHover={cardHover.whileHover}
>
          <div className="simulator-kpi-icon">
            <FaBoxOpen />
          </div>
          <span>Current Stock</span>
          <h3>{currentStock}</h3>
          <small>units available</small>
          <div className="simulator-mini-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </motion.article>

        <article className="simulator-kpi-card simulator-kpi-green">
          <div className="simulator-kpi-icon">
            <FaChartLine />
          </div>
          <span>Average Daily Sales</span>
          <h3>{avgDailySales}</h3>
          <small>units per day</small>
          <div className="simulator-mini-bars" aria-hidden="true">
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
          <span>Demand Trend</span>
          <h3>{demandTrend}</h3>
          <small>
            {Number(product.trendPercent) > 0
              ? `+${product.trendPercent}% movement`
              : "Stable movement"}
          </small>
          <div className="simulator-mini-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>

        <article className="simulator-kpi-card simulator-kpi-purple">
          <div className="simulator-kpi-icon">
            <FaBullseye />
          </div>
          <span>Current ML Forecast</span>
          <h3>{currentForecast}</h3>
          <small>units expected</small>
          <div className="simulator-mini-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>
      </div>

      <div className="sim-main-grid">
        <article className="sim-slider-card">
          <div className="sim-card-heading">
            <div>
              <span>Purchase Planner</span>
              <h3>Additional stock</h3>
            </div>

            <div className="sim-stock-stepper">
              <button
                type="button"
                onClick={decreaseStock}
                aria-label="Decrease additional stock"
              >
                <FaMinus />
              </button>

              <strong>{additional} units</strong>

              <button
                type="button"
                onClick={increaseStock}
                aria-label="Increase additional stock"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <input
            className="simulator-range"
            type="range"
            min="0"
            max={MAX_STOCK}
            step={STOCK_STEP}
            value={additionalStock}
            aria-label="Additional stock quantity"
aria-valuemin={0}
aria-valuemax={MAX_STOCK}
aria-valuenow={additionalStock}
aria-valuetext={`${additionalStock} additional units`}
            onChange={(event) =>
              setAdditionalStock(Number(event.target.value))
            }
            style={{
              "--range-progress": `${
                (additionalStock / MAX_STOCK) * 100
              }%`,
            }}
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
              <strong>{formatCurrency(investment)}</strong>
            </div>

            <div>
              <span>After Stock</span>
              <strong>{newStock} units</strong>
            </div>

            <div>
              <span>Expected Profit</span>
              <strong>{formatCurrency(expectedProfit)}</strong>
            </div>
          </div>
        </article>

        <article className="before-sim-card">
          <div className="sim-card-heading">
            <div>
              <span>Scenario Comparison</span>
              <h3>Before vs After</h3>
            </div>

            <span
              className={`sim-risk-pill ${
                riskAfter === "Low" ? "safe" : "danger"
              }`}
            >
              {riskAfter} risk
            </span>
          </div>

          <div className="before-after-stock">
            <div>
              <small>Current</small>
              <strong>{currentStock}</strong>
              <span>units</span>
            </div>

            <div className="before-after-arrow">→</div>

            <div>
              <small>After purchase</small>
              <strong>
  <AnimatedNumber value={newStock} />
</strong>
              <span>units</span>
            </div>

            <div className="stock-growth-badge">
              +{stockIncreasePercent}%
            </div>
          </div>

          <div className="before-after-details">
            <p>
              <span>Coverage</span>
              <strong>
                {formatCoverage(currentCoverage)} →{" "}
                {formatCoverage(coverage)}
              </strong>
            </p>

            <p>
              <span>Risk</span>
              <strong>
                {currentRisk} → {riskAfter}
              </strong>
            </p>

            <p>
              <span>Forecast gap</span>
              <strong>
                {Math.max(0, currentForecast - newStock)} units
              </strong>
            </p>
          </div>
        </article>
      </div>

      <section className="after-section">
        <div className="after-section-heading">
          <div>
            <span>Simulation Output</span>
            <h3>After Simulation Results</h3>
          </div>

          <p>
            Live estimates based on current inventory and forecast data.
          </p>
        </div>

        <div className="after-grid">
          <article>
            <FaBoxOpen />
            <span>New Stock</span>
            <strong>{newStock}</strong>
            <small>units</small>
          </article>

          <article>
            <FaChartLine />
            <span>Predicted Demand</span>
            <strong>{currentForecast}</strong>
            <small>units</small>
          </article>

          <article>
            <FaShieldAlt />
            <span>Remaining Stock</span>
            <strong>{remainingStock}</strong>
            <small>units</small>
          </article>

          <article>
            <FaCalendarAlt />
            <span>Coverage</span>
            <strong>
              {coverage === 999 ? "Stable" : coverage}
            </strong>
            <small>
              {coverage === 999 ? "inventory" : "days"}
            </small>
          </article>
        </div>

        <div className="comparison-grid">
          <article className="comparison-card">
            <div className="sim-card-heading">
              <div>
                <span>Visual Comparison</span>
                <h4>Inventory Position</h4>
              </div>
            </div>

            <div className="bar-row">
              <span>Current Stock ({currentStock})</span>
              <div>
               <motion.b
  variants={progressReveal}
  style={{
    width: `${(currentStock / barMax) * 100}%`,
  }}
/>
              </div>
            </div>

            <div className="bar-row purple">
              <span>Predicted Demand ({currentForecast})</span>
              <div>
               <motion.b
  variants={progressReveal}
  style={{
    width: `${(currentForecast / barMax) * 100}%`,
  }}
/>
              </div>
            </div>

            <div className="bar-row green">
              <span>After Purchase ({newStock})</span>
              <div>
                <motion.b
  variants={progressReveal}
  style={{
    width: `${(newStock / barMax) * 100}%`,
  }}
/>
              </div>
            </div>
          </article>

          <article
            className={`risk-after-card ${
              riskAfter === "Low" ? "safe" : "danger"
            }`}
          >
            <div className="risk-after-icon">
              <FaShieldAlt />
            </div>

            <span>Risk After Simulation</span>
            <h3>{riskAfter}</h3>

            <p>
              {riskAfter === "Low"
                ? "Inventory is projected to satisfy forecasted demand."
                : "The selected purchase may still leave a stock shortage."}
            </p>
          </article>
        </div>

        <div className="financial-section-heading">
          <span>Financial Projection</span>
          <h3>Financial Impact Estimates</h3>
        </div>

        <div className="financial-grid">
          <article>
            <FaRupeeSign />
            <span>Inventory Investment</span>
            <strong>{formatCurrency(investment)}</strong>
            <small>additional cost</small>
          </article>

          <article>
            <FaChartLine />
            <span>Expected Revenue</span>
            <strong>{formatCurrency(expectedRevenue)}</strong>
            <small>projected revenue</small>
          </article>

          <article>
            <FaWallet />
            <span>Expected Profit</span>
            <strong>{formatCurrency(expectedProfit)}</strong>
            <small>estimated profit</small>
          </article>

          <article>
            <FaBullseye />
            <span>ROI</span>
            <strong>{roi}%</strong>
            <small>return on investment</small>
          </article>
        </div>

        <article
          className={`final-ai-recommendation ${
            riskAfter === "Low" ? "safe" : "danger"
          }`}
        >
          <div>
            <span>AI Executive Recommendation</span>

            <h3>
              {riskAfter === "Low"
                ? "This restocking plan is operationally safe."
                : "Increase stock to reduce shortage risk."}
            </h3>

            <p>
              Purchasing {additional} additional units changes coverage
              from {formatCoverage(currentCoverage)} to{" "}
              {formatCoverage(coverage)}. Estimated ROI is {roi}% with
              expected profit of {formatCurrency(expectedProfit)}.
            </p>
          </div>

         <div
  className="big-check"
  aria-label={
    riskAfter === "Low"
      ? "Safe recommendation"
      : "Risk warning"
  }
>
  <span>{riskAfter === "Low" ? "✓" : "!"}</span>
</div>
        </article>
      </section>
    </motion.section>
  );
}
