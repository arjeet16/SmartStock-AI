import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { staggerContainer } from "../utils/motion";
import PremiumCard from "./premium/PremiumCard";
import SectionHeader from "./premium/SectionHeader";
import LiveBadge from "./premium/LiveBadge";

function createBarGradient(context) {
  const { chart } = context;
  const { ctx, chartArea } = chart;

  if (!chartArea) {
    return "rgba(59, 130, 246, 0.8)";
  }

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );

  gradient.addColorStop(0, "rgba(37, 99, 235, 0.35)");
  gradient.addColorStop(0.55, "rgba(59, 130, 246, 0.85)");
  gradient.addColorStop(1, "rgba(139, 92, 246, 1)");

  return gradient;
}

function AnalyticsV2({ barChartData, pieChartData }) {
  const enhancedBarData = {
    ...barChartData,
    datasets: barChartData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: createBarGradient,
      borderColor: "rgba(147, 197, 253, 0.85)",
      borderWidth: 0,
      hoverBorderWidth: 0,
      borderRadius: 14,
      borderSkipped: false,
      barThickness: 20,
      maxBarThickness: 22,
      hoverBackgroundColor: "rgba(139, 92, 246, 0.95)",
    })),
  };

  const enhancedPieData = {
    ...pieChartData,
    datasets: pieChartData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: [
        "#3b82f6",
        "#8b5cf6",
        "#22c55e",
        "#f59e0b",
        "#ec4899",
        "#06b6d4",
      ],
      borderColor: "rgba(15, 23, 42, 0.9)",
      borderWidth: 4,
      hoverOffset: 12,
      spacing: 3,
    })),
  };

  const barOptions = {
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    intersect: false,
    mode: "index",
  },

  layout: {
    padding: {
      top: 14,
      right: 8,
      bottom: 0,
      left: 0,
    },
  },

  animation: {
    duration: 1200,
    easing: "easeOutQuart",
    delay: (context) => {
      if (context.type !== "data") return 0;

      return context.dataIndex * 70;
    },
  },

  hover: {
    mode: "index",
    intersect: false,
  },

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      enabled: true,
      backgroundColor: "rgba(2, 6, 23, 0.97)",
      titleColor: "#ffffff",
      bodyColor: "#cbd5e1",
      footerColor: "#93c5fd",

      borderColor: "rgba(96, 165, 250, 0.35)",
      borderWidth: 1,

      padding: 14,
      cornerRadius: 14,
      displayColors: false,

      titleSpacing: 6,
      bodySpacing: 7,

      titleFont: {
        size: 13,
        weight: "700",
      },

      bodyFont: {
        size: 12,
        weight: "600",
      },

      callbacks: {
        title: (items) => {
          return items[0]?.label || "Product";
        },

        label: (context) => {
          const quantity = Number(context.raw || 0);

          return `Current stock: ${quantity.toLocaleString()} units`;
        },

        footer: (items) => {
          const quantity = Number(items[0]?.raw || 0);

          if (quantity <= 0) {
            return "Status: Out of stock";
          }

          if (quantity < 20) {
            return "Status: Low stock";
          }

          return "Status: Healthy stock";
        },
      },
    },
  },

  scales: {
    x: {
      border: {
        display: false,
      },

      grid: {
        display: false,
      },

      ticks: {
        color: "#94a3b8",
        padding: 12,
        maxRotation: 0,
        minRotation: 0,
        autoSkip: true,
        maxTicksLimit: 5,

        callback: function (value) {
          const label = this.getLabelForValue(value);

          if (!label) return "";

          return label.length > 12
            ? `${label.slice(0, 12)}…`
            : label;
        },

        font: {
          size: 11,
          weight: "700",
        },
      },
    },

    y: {
      beginAtZero: true,

      border: {
        display: false,
      },

      grid: {
        color: "rgba(148, 163, 184, 0.09)",
        drawTicks: false,
        lineWidth: 1,
      },

      ticks: {
        color: "#94a3b8",
        padding: 12,
        precision: 0,
        maxTicksLimit: 6,

        callback: (value) => {
          const number = Number(value);

          if (number >= 1000) {
            return `${(number / 1000).toFixed(1)}k`;
          }

          return number;
        },

        font: {
          size: 11,
          weight: "700",
        },
      },
    },
  },
};

  const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,

  cutout: "73%",

  layout: {
    padding: {
      top: 10,
      left: 6,
      right: 6,
      bottom: 0,
    },
  },

  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1300,
    easing: "easeOutQuart",
  },

  interaction: {
    intersect: true,
    mode: "nearest",
  },

  plugins: {
    legend: {
      display: true,
      position: "bottom",

      labels: {
        color: "#cbd5e1",
        usePointStyle: true,
        pointStyle: "circle",

        boxWidth: 8,
        boxHeight: 8,
        padding: 16,

        generateLabels: (chart) => {
          const data = chart.data;
          const dataset = data.datasets[0];

          if (!data.labels?.length || !dataset?.data?.length) {
            return [];
          }

          return data.labels.map((label, index) => {
            const value = Number(dataset.data[index] || 0);

            return {
              text: `${label} · ${value}`,
              fillStyle: dataset.backgroundColor[index],
              strokeStyle: dataset.backgroundColor[index],
              lineWidth: 0,
              hidden: !chart.getDataVisibility(index),
              index,
              pointStyle: "circle",
            };
          });
        },

        font: {
          size: 11,
          weight: "700",
        },
      },

      onClick: (event, legendItem, legend) => {
        const chart = legend.chart;
        const index = legendItem.index;

        chart.toggleDataVisibility(index);
        chart.update();
      },
    },

    tooltip: {
      enabled: true,
      backgroundColor: "rgba(2, 6, 23, 0.97)",
      titleColor: "#ffffff",
      bodyColor: "#cbd5e1",

      borderColor: "rgba(139, 92, 246, 0.35)",
      borderWidth: 1,

      padding: 14,
      cornerRadius: 14,

      titleSpacing: 6,
      bodySpacing: 7,

      callbacks: {
        title: (items) => {
          return items[0]?.label || "Category";
        },

        label: (context) => {
          const values = context.dataset.data;

          const total = values.reduce(
            (sum, value) => sum + Number(value || 0),
            0
          );

          const currentValue = Number(context.raw || 0);

          const percentage =
            total > 0
              ? Math.round((currentValue / total) * 100)
              : 0;

          return `${currentValue} products · ${percentage}%`;
        },

        afterLabel: () => {
          return "Click legend to filter";
        },
      },
    },
  },
};

  const totalProducts =
  enhancedPieData.datasets[0]?.data?.reduce(
    (sum, value) => sum + Number(value || 0),
    0
  ) || 0;

const hasBarData =
  enhancedBarData.labels?.length > 0 &&
  enhancedBarData.datasets?.some((dataset) =>
    dataset.data?.some((value) => Number(value) > 0)
  );

const hasPieData =
  enhancedPieData.labels?.length > 0 &&
  enhancedPieData.datasets?.some((dataset) =>
    dataset.data?.some((value) => Number(value) > 0)
  );

  return (
    <motion.section
      className="analytics-v5"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
    >
      <PremiumCard className="analytics-v5-card analytics-wide">
        <SectionHeader
          eyebrow="LIVE INVENTORY INTELLIGENCE"
          title="Stock Movement Overview"
          description="AI-powered visibility into current stock concentration and product-level demand pressure."
          action={<LiveBadge label="Live Analytics" />}
        />

        <div className="analytics-v5-chart">
  {hasBarData ? (
    <Bar
      data={enhancedBarData}
      options={barOptions}
      aria-label="Current inventory stock by product"
      role="img"
    />
  ) : (
    <div className="analytics-empty-state">
      <div className="analytics-empty-icon">▥</div>

      <strong>No inventory data yet</strong>

      <span>
        Add products to display stock analytics.
      </span>
    </div>
  )}
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
          description="Understand where your inventory is currently concentrated."
        />

        <div className="analytics-v5-donut-wrap">
  {hasPieData ? (
    <>
      <Doughnut
        data={enhancedPieData}
        options={doughnutOptions}
        aria-label="Inventory category distribution"
        role="img"
      />

      <div className="donut-center-label">
        <strong>{totalProducts}</strong>
        <span>
          {totalProducts === 1 ? "Product" : "Products"}
        </span>
      </div>
    </>
  ) : (
    <div className="analytics-empty-state">
      <div className="analytics-empty-icon">◌</div>

      <strong>No category data yet</strong>

      <span>
        Product categories will appear here.
      </span>
    </div>
  )}
</div>
      </PremiumCard>
    </motion.section>
  );
}

export default AnalyticsV2;