import Card from "./ui/Card";
import { generateDecision } from "../utils/decisionEngine";

function AIDecisionPanel({ forecast, products = [] }) {
  const matchedProduct = products.find(
    (item) =>
      item.item_name?.toLowerCase() === forecast?.productName?.toLowerCase()
  );

  const mergedProduct = {
    ...matchedProduct,
    ...forecast,
  };

  const decision = generateDecision(mergedProduct);

  if (!decision) return null;

  return (
    <Card className="ai-decision-panel">
      <div className="ai-decision-header">
        <div>
          <p className="ai-decision-badge">AI Decision Engine</p>
          <h2>Should you restock {decision.productName}?</h2>
        </div>

        <div className="ai-decision-status">
          <span>Decision</span>
          <strong>{decision.decision}</strong>
        </div>
      </div>

      <p className="ai-decision-reason">{decision.reason}</p>

      <div className="ai-decision-grid">
        <div>
          <span>Current Stock</span>
          <strong>{decision.currentStock}</strong>
        </div>

        <div>
          <span>Forecast Demand</span>
          <strong>{decision.forecastDemand}</strong>
        </div>

        <div>
          <span>Recommended Purchase</span>
          <strong>{decision.recommendedPurchase}</strong>
        </div>

        <div>
          <span>Expected Revenue</span>
          <strong>₹{decision.expectedRevenue.toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Expected Profit</span>
          <strong>₹{decision.expectedProfit.toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Confidence</span>
          <strong>{decision.confidence}%</strong>
        </div>
      </div>
    </Card>
  );
}

export default AIDecisionPanel;