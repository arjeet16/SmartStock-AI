import {
  FaBoxes,
  FaWarehouse,
  FaMoneyBillWave,
  FaChartLine,
  FaShoppingCart,
  FaTrophy,
  FaExclamationTriangle,
} from "react-icons/fa";

function StatsCards({
  totalProducts,
  totalQuantity,
  inventoryValue,
  totalProfit,
  totalRevenue,
  totalSales,
  bestSellingProduct,
  lowStockCount,
}) {
  return (
    <div className="cards">
      <div className="card">
        <FaBoxes size={35} />
        <h3>Total Products</h3>
        <p>{totalProducts}</p>
      </div>

      <div className="card">
        <FaWarehouse size={35} />
        <h3>Total Quantity</h3>
        <p>{totalQuantity}</p>
      </div>

      <div className="card">
        <FaMoneyBillWave size={35} />
        <h3>Inventory Value</h3>
        <p>₹{inventoryValue}</p>
      </div>

      <div className="card">
        <FaChartLine size={35} />
        <h3>Total Profit</h3>
        <p>₹{totalProfit}</p>
      </div>

      <div className="card">
        <FaMoneyBillWave size={35} />
        <h3>Total Revenue</h3>
        <p>₹{totalRevenue}</p>
      </div>

      <div className="card">
        <FaShoppingCart size={35} />
        <h3>Total Sales</h3>
        <p>{totalSales}</p>
      </div>

      <div className="card best-card">
        <FaTrophy size={35} />
        <h3>Best Seller</h3>
        <p>{bestSellingProduct}</p>
      </div>

      <div className="card low-card">
        <FaExclamationTriangle size={35} />
        <h3>Low Stock Items</h3>
        <p>{lowStockCount}</p>
      </div>
    </div>
  );
}

export default StatsCards;