import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { staggerContainer } from "../utils/motion";
import PremiumCard from "./premium/PremiumCard";
import SectionHeader from "./premium/SectionHeader";
import LiveBadge from "./premium/LiveBadge";

function AnalyticsV2({ barChartData, pieChartData }) {
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1400,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        padding: 14,
        cornerRadius: 14,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { weight: "700" },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: { weight: "700" },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    animation: {
      animateRotate: true,
      duration: 1400,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#cbd5e1",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,
          font: {
            size: 12,
            weight: "800",
          },
        },
      },
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        padding: 14,
        cornerRadius: 14,
      },
    },
  };

  return (
    <motion.section
      className="analytics-v5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <PremiumCard className="analytics-v5-card analytics-wide">
        <SectionHeader
          eyebrow="LIVE INVENTORY INTELLIGENCE"
          title="Stock Movement Overview"
          description="AI-powered visibility into current stock concentration and product-level demand pressure."
          action={<LiveBadge label="Live Analytics" />}
        />

        <div className="analytics-v5-chart">
          <Bar data={barChartData} options={barOptions} />
        </div>

        <div className="analytics-insight-footer">
          <strong>AI Insight:</strong> Products with high stock but low movement
          should be monitored to avoid dead inventory.
        </div>
      </PremiumCard>

      <PremiumCard className="analytics-v5-card">
        <SectionHeader
          eyebrow="CATEGORY MIX"
          title="Inventory Distribution"
          description="Understand where your capital is currently concentrated."
        />

        <div className="analytics-v5-donut-wrap">
          <Doughnut data={pieChartData} options={doughnutOptions} />

          <div className="donut-center-label">
            <strong>AI</strong>
            <span>Mix</span>
          </div>
        </div>
      </PremiumCard>
    </motion.section>
  );
}

export default AnalyticsV2;