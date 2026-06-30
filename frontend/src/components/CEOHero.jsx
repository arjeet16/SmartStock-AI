import Card from "./ui/Card";
import { FaBrain, FaFileDownload, FaRocket } from "react-icons/fa";

function CEOHero({
  totalRevenue,
  totalProfit,
  lowStockCount,
  bestSellingProduct,
}) {
  const healthStatus = lowStockCount > 0 ? "Needs Attention" : "Healthy";
  const score = lowStockCount > 0 ? 85 : 94;

  return (
    <Card className="ceo-hero">
      <div className="ceo-hero-left">
        <p className="ceo-hero-badge">
          <FaBrain /> AI Executive Overview
        </p>

        <h1>Good to see you, Arjeet 👋</h1>

        <p className="ceo-hero-text">
          SmartStock AI analyzed your inventory performance, stock movement and
          business signals for today.
        </p>

        <div className="ceo-hero-actions">
          <button className="ceo-primary-btn">
            <FaRocket /> Generate AI Report
          </button>

          <button className="ceo-secondary-btn">
            <FaFileDownload /> Download PDF
          </button>
        </div>
      </div>

      <div className="ceo-hero-right">
        <div className="ceo-score-circle">
          <span>{score}</span>
          <p>AI Score</p>
        </div>

        <div className="ceo-hero-stats">
          <div>
            <span>Revenue</span>
            <strong>₹{totalRevenue}</strong>
          </div>

          <div>
            <span>Profit</span>
            <strong>₹{totalProfit}</strong>
          </div>

          <div>
            <span>Inventory</span>
            <strong>{healthStatus}</strong>
          </div>

          <div>
            <span>Best Seller</span>
            <strong>{bestSellingProduct}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CEOHero;