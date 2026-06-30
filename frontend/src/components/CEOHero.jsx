import Card from "./ui/Card";
import { FaBrain, FaFileDownload, FaRocket } from "react-icons/fa";
import { exportDashboardPDF } from "../utils/exportPDF";
import { generateAIReport } from "../services/aiService";

function CEOHero({
  products,
  sales,
  totalRevenue,
  totalProfit,
  inventoryValue,
  lowStockCount,
  bestSellingProduct,
  aiReport,
  setAiReport,
}) {
  const healthStatus = lowStockCount > 0 ? "Needs Attention" : "Healthy";
  const score = lowStockCount > 0 ? 85 : 94;

  const handleGenerateReport = async () => {
    try {
      const report = await generateAIReport({
        products,
        sales,
        totalRevenue,
        totalProfit,
        lowStockCount,
        bestSellingProduct,
      });

      setAiReport(report);
      alert("AI Report Generated Successfully!");
    } catch (err) {
      alert("Failed to generate AI report.");
    }
  };

  const handleDownloadPDF = () => {
    exportDashboardPDF({
      totalRevenue,
      totalProfit,
      inventoryValue,
      lowStockCount,
      bestSellingProduct,
      aiReport,
    });
  };

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
          <button className="ceo-primary-btn" onClick={handleGenerateReport}>
            <FaRocket /> Generate AI Report
          </button>

          <button className="ceo-secondary-btn" onClick={handleDownloadPDF}>
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