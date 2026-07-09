import Card from "./ui/Card";

function ExecutiveBrief({
  totalRevenue = 18450,
  totalProfit = 5420,
  inventoryHealth = 83,
  businessScore = 92,
  businessStatus = "Healthy",
  aiConfidence = 94,
  topRecommendation = null,
}) {
  const generatedTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="executive-command-center">
      <div className="executive-command-header">
        <div>
          <p className="executive-command-badge">
            AI Executive Command Center
          </p>

          <h2>Today's Business Brief</h2>

          <p>
            Generated at {generatedTime} • AI Confidence {aiConfidence}% •
            SmartStock AI analyzed inventory, forecast signals and profit risks.
          </p>
        </div>

        <div className="executive-command-status">
          <span>Business Score</span>
          <strong>{businessScore}/100</strong>
          <p>{businessStatus}</p>
        </div>
      </div>

      <div className="executive-command-kpis">
        <div>
          <span>Revenue</span>
          <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
          <p>↑ Live sales signal</p>
        </div>

        <div>
          <span>Profit</span>
          <strong>₹{totalProfit.toLocaleString("en-IN")}</strong>
          <p>↑ Margin performance</p>
        </div>

        <div>
          <span>Inventory Health</span>
          <strong>{inventoryHealth}%</strong>
          <p>{inventoryHealth >= 75 ? "Good condition" : "Needs attention"}</p>
        </div>
      </div>

      <div className="executive-command-grid">
        <div className="executive-command-panel">
  <h3>📌 Today's Highlights</h3>

  <ul>
    <li>Revenue: ₹{totalRevenue.toLocaleString("en-IN")}</li>
    <li>Profit: ₹{totalProfit.toLocaleString("en-IN")}</li>
    <li>Inventory Health: {inventoryHealth}%</li>
    <li>AI Confidence: {aiConfidence}%</li>
  </ul>
</div>

<div className="executive-command-panel">
  <h3>🎯 Recommended Action</h3>

  <p>
    <strong>Priority Product:</strong> {" "}
    {topRecommendation?.productName || "N/A"}
  </p>

  <p>
    <strong>Action:</strong> {" "} 
    {topRecommendation?.decision || "No recommendation"}
  </p>

  <p>
    <strong>Expected Profit:</strong> ₹
    ₹{topRecommendation?.expectedProfit ?? 0}
  </p>

  <p>
  <strong>Expected ROI:</strong>{" "}
  {topRecommendation?.roi ?? 0}%
</p>
</div>
      </div>
    </Card>
  );
}

export default ExecutiveBrief;