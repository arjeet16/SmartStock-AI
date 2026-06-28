import { motion } from "framer-motion";
import "./Sidebar.css";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sidebar"
    >
      <h2 className="logo">SmartStock AI</h2>

      <ul>
        <li>
          <LayoutDashboard size={22} />
          Dashboard
        </li>

        <li>
          <Package size={22} />
          Products
        </li>

        <li>
          <ShoppingCart size={22} />
          Sales
        </li>

        <li>
          <BarChart3 size={22} />
          Analytics
        </li>

        <li>
          <Settings size={22} />
          Settings
        </li>
      </ul>
    </motion.div>
  );
}

export default Sidebar;