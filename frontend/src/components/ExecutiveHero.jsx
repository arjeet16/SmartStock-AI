import { motion } from "framer-motion";
import {
  FaBrain,
  FaRocket,
  FaArrowTrendUp,
  FaShieldHalved,
  FaBolt,
} from "react-icons/fa6";

import { FaFileDownload } from "react-icons/fa";
import AnimatedNumber from "./ui/AnimatedNumber";
import { exportDashboardPDF } from "../utils/exportPDF";
import { generateAIReport } from "../services/aiService";
import { fadeUp, staggerContainer } from "../utils/motion";
import toast from "react-hot-toast";
function ExecutiveHero({
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
  const healthScore = lowStockCount > 0 ? 86 : 96;
  const aiConfidence = lowStockCount > 0 ? 91 : 97;
  const businessStatus = lowStockCount > 0 ? "Action Required" : "Excellent";

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

  const metrics = [
    {
      label: "Revenue",
      value: totalRevenue,
      prefix: "₹",
      change: "+12.4%",
    },
    {
      label: "Profit",
      value: totalProfit,
      prefix: "₹",
      change: "+8.7%",
    },
    {
      label: "Inventory Value",
      value: inventoryValue,
      prefix: "₹",
      change: "+5.2%",
    },
    {
      label: "Health Score",
      value: healthScore,
      prefix: "",
      suffix: "%",
      change: businessStatus,
    },
  ];

  return (
    <motion.section
      className="executive-hero"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <motion.div className="executive-hero-main" variants={fadeUp}>
        <div className="hero-badge">
          <FaBrain />
          SmartStock AI Executive Command Center
        </div>

        <h1>
          Good to see you, <span>Arjeet.</span>
        </h1>

        <p className="hero-subtitle">
          Your AI inventory engine analyzed revenue, profit, stock movement,
          risk signals and demand forecast for today.
        </p>

        <div className="hero-status-row">
          <div>
            <FaArrowTrendUp />
            Revenue Up 12.4%
          </div>

          <div>
            <FaShieldHalved />
            Health {healthScore}%
          </div>

          <div>
            <FaBolt />
            AI Confidence {aiConfidence}%
          </div>
        </div>

        <div className="hero-actions">
          <button className="hero-primary-btn" onClick={handleGenerateReport}>
            <FaRocket />
            Generate AI Report
          </button>

          <button className="hero-secondary-btn" onClick={handleDownloadPDF}>
            <FaFileDownload />
            Export PDF
          </button>
        </div>
      </motion.div>

      <motion.div className="executive-hero-side" variants={fadeUp}>
        <div className="ai-score-card">
          <div className="score-ring">
            <span>
              <AnimatedNumber value={aiConfidence} suffix="%" />
            </span>
          </div>

          <h3>AI Confidence</h3>
          <p>{businessStatus}</p>
        </div>

        <div className="executive-ai-recommendation">
          <span>AI Recommendation</span>
          <p>
            Restock low-moving risk products first. Prioritize{" "}
            <strong>{bestSellingProduct || "your best seller"}</strong> and
            protect revenue leakage from low-stock items.
          </p>
        </div>
      </motion.div>

      <motion.div className="executive-metrics" variants={staggerContainer}>
        {metrics.map((metric, index) => (
          <motion.div className="executive-metric-card" variants={fadeUp} key={index}>
            <div>
              <span>{metric.label}</span>
              <small>{metric.change}</small>
            </div>

            <h2>
              <AnimatedNumber
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix || ""}
              />
            </h2>

            <div className="mini-trend">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default ExecutiveHero;