import Card from "./ui/Card";
import { FaChartLine, FaCoins, FaWarehouse, FaExclamationTriangle } from "react-icons/fa";

function KPICardsV2({
  totalRevenue,
  totalProfit,
  lowStockCount,
  inventoryValue,
}) {
  const cards = [
    { icon: <FaChartLine />, label: "Revenue", value: `₹${totalRevenue}`, change: "+12.4%", note: "Total sales revenue" },
    { icon: <FaCoins />, label: "Profit", value: `₹${totalProfit}`, change: "+8.7%", note: "Net inventory profit" },
    { icon: <FaWarehouse />, label: "Inventory Value", value: `₹${inventoryValue}`, change: "+5.2%", note: "Current stock value" },
    { icon: <FaExclamationTriangle />, label: "Low Stock", value: lowStockCount, change: lowStockCount > 0 ? "Action needed" : "Healthy", note: "Items below threshold" },
  ];

  return (
    <div className="kpi-v2-grid">
      {cards.map((card, index) => (
        <Card className="kpi-v2-card" key={index}>
          <div className="kpi-icon">{card.icon}</div>

          <div className="kpi-v2-top">
            <span>{card.label}</span>
            <small>{card.change}</small>
          </div>

          <h2>{card.value}</h2>
          <p>{card.note}</p>
        </Card>
      ))}
    </div>
  );
}

export default KPICardsV2;