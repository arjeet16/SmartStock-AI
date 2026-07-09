import Card from "./ui/Card";
import { generatePurchaseAdvice } from "../utils/purchaseAdvisor";

function AIPurchaseAdvisor({ products = [], forecastData = [] }) {
  const advice = generatePurchaseAdvice(products, forecastData);

  if (!advice.decisions.length) return null;

  const bestPurchase =
    advice.decisions.find((item) => item.recommendedPurchase > 0) || null;

  return (
    <Card className="ai-purchase-advisor">
      <div className="purchase-advisor-header">
        <div>
          <p className="purchase-advisor-badge">AI Purchase Advisor</p>
          <h2>Today's Buying Decisions</h2>
          <p>
            SmartStock AI evaluated product demand, inventory risk and purchase
            profitability.
          </p>
        </div>

        <div className="purchase-advisor-summary">
          <span>🏆 Best Purchase</span>

          <strong>{bestPurchase?.productName || "None"}</strong>

          <p>ROI {bestPurchase?.roi || 0}%</p>
        </div>
      </div>

      <div className="purchase-advisor-kpis">
        <div>
          <span>Total Investment</span>
          <strong>₹{advice.totalInvestment.toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Expected Revenue</span>
          <strong>₹{advice.expectedRevenue.toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Expected Profit</span>
          <strong>₹{advice.expectedProfit.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div className="purchase-advisor-list">
        {advice.decisions.slice(0, 5).map((item) => (
          <div
            className={`purchase-decision purchase-decision-${item.status}`}
            key={item.productName}
          >
            <div>
              <div className="purchase-title">
                <h3>{item.productName}</h3>

                <span className={`risk-badge risk-${item.risk.toLowerCase()}`}>
                  {item.risk}
                </span>
              </div>

              <p>
                {item.decision} • {item.recommendedPurchase} units • ROI{" "}
                {item.roi}% • Confidence {item.confidence}%
              </p>
            </div>

            <div className="purchase-profit">
  <span>Expected Profit</span>
  <strong>₹{item.expectedProfit.toLocaleString("en-IN")}</strong>
</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AIPurchaseAdvisor;