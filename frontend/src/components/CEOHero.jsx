
import AnimatedNumber from "./ui/AnimatedNumber";
import { FaBrain, FaFileDownload, FaRocket } from "react-icons/fa";
import { exportDashboardPDF } from "../utils/exportPDF";
import { generateAIReport } from "../services/aiService";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/motion";
import toast from "react-hot-toast";
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
  const storedUser = localStorage.getItem(
  "smartstock_current_user"
);

let currentUser = null;

try {
  currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch (error) {
  console.error(
    "Failed to read current user:",
    error
  );
}

const fullName =
  currentUser?.full_name ||
  currentUser?.name ||
  "User";

const firstName =
  String(fullName).trim().split(" ")[0] ||
  "User";
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
      toast.success("AI Report Generated Successfully!");
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
console.log("CEOHero current user:", currentUser);
console.log("CEOHero firstName:", firstName);
    return (
    <motion.div
      className="ceo-hero"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div className="ceo-hero-left">
        <p className="ceo-hero-badge">
          <FaBrain /> AI Executive Overview
        </p>

        <h1>
  Good to see you, {firstName} 👋
</h1>

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
          <span>
            <AnimatedNumber value={score} />
          </span>
          <p>AI Score</p>
        </div>

        <div className="ceo-hero-stats">
          <div>
            <span>Revenue</span>
            <strong>
              <AnimatedNumber value={totalRevenue} prefix="₹" />
            </strong>
          </div>

          <div>
            <span>Profit</span>
            <strong>
              <AnimatedNumber value={totalProfit} prefix="₹" />
            </strong>
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
    </motion.div>
  );
}

export default CEOHero;