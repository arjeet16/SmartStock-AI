import {
  FaChartPie,
  FaBoxOpen,
  FaShoppingCart,
  FaRobot,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

function SidebarV2() {
  return (
    <aside className="sidebar-v2">
      <div className="sidebar-v2-brand">
        <h2>SmartStock AI</h2>
        <p>Inventory Intelligence</p>
      </div>

      <nav className="sidebar-v2-nav">
  <a href="#dashboard" className="active"><FaChartPie /> Dashboard</a>
  <a href="#inventory"><FaBoxOpen /> Inventory</a>
  <a href="#sales"><FaShoppingCart /> Sales</a>
  <a href="#ai"><FaRobot /> AI Copilot</a>
  <a href="#reports"><FaFileAlt /> Reports</a>
  <a href="#settings"><FaCog /> Settings</a>
</nav>

      <div className="sidebar-v2-user">
        <div className="user-avatar">A</div>
        <div>
          <h4>Arjeet Singh</h4>
          <p>Administrator</p>
        </div>
      </div>
    </aside>
  );
}

export default SidebarV2;