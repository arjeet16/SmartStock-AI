import Card from "./ui/Card";
import AnimatedNumber from "./ui/AnimatedNumber";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, cardHover } from "../utils/motion";
import {
  FaChartLine,
  FaCoins,
  FaWarehouse,
  FaExclamationTriangle,
} from "react-icons/fa";

function KPICardsV2({
  totalRevenue,
  totalProfit,
  lowStockCount,
  inventoryValue,
}) {
  const cards = [
    {
      icon: <FaChartLine />,
      label: "Revenue",
      value: totalRevenue,
      prefix: "₹",
      change: "+12.4%",
      note: "Total sales revenue",
    },
    {
      icon: <FaCoins />,
      label: "Profit",
      value: totalProfit,
      prefix: "₹",
      change: "+8.7%",
      note: "Net inventory profit",
    },
    {
      icon: <FaWarehouse />,
      label: "Inventory Value",
      value: inventoryValue,
      prefix: "₹",
      change: "+5.2%",
      note: "Current stock value",
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Low Stock",
      value: lowStockCount,
      prefix: "",
      change: lowStockCount > 0 ? "Action needed" : "Healthy",
      note: "Items below threshold",
    },
  ];

  return (
    <motion.div
      className="kpi-v2-grid"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={fadeUp}
          whileHover={cardHover.whileHover}
        >
          <Card className="kpi-v2-card">
            <div className="kpi-icon">{card.icon}</div>

            <div className="kpi-v2-top">
              <span>{card.label}</span>
              <small>{card.change}</small>
            </div>

            <h2>
              <AnimatedNumber value={card.value} prefix={card.prefix} />
            </h2>

            <p>{card.note}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default KPICardsV2;