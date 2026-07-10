import {
  FaBell,
  FaBoxOpen,
  FaChartLine,
  FaChartPie,
  FaCog,
  FaFileAlt,
  FaFlask,
  FaRobot,
  FaShoppingCart,
} from "react-icons/fa";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <FaChartPie />,
  },
  {
    id: "forecast",
    label: "AI Forecast",
    icon: <FaChartLine />,
  },
  {
    id: "alerts",
    label: "Smart Alerts",
    icon: <FaBell />,
  },
  {
    id: "simulator",
    label: "Simulator",
    icon: <FaFlask />,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <FaBoxOpen />,
  },
  {
    id: "sales",
    label: "Sales",
    icon: <FaShoppingCart />,
  },
  {
    id: "ai",
    label: "AI Copilot",
    icon: <FaRobot />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FaFileAlt />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <FaCog />,
  },
];

function SidebarV2({
  activeSection,
  onNavigate,
  userName = "Arjeet Singh",
}) {
  const initials =
    userName
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <aside className="sidebar-v2">
      <button
        type="button"
        className="sidebar-v2-brand"
        onClick={() => onNavigate("dashboard")}
      >
        <div className="sidebar-brand-mark">S</div>

        <div>
          <h2>SmartStock AI</h2>
          <p>Inventory Intelligence</p>
        </div>
      </button>

      <div className="sidebar-navigation-label">
        Command Center
      </div>

      <nav className="sidebar-v2-nav">
        {navigationItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={
              activeSection === item.id ? "active" : ""
            }
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>

            {activeSection === item.id && (
              <i className="sidebar-active-dot" />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-v2-user">
        <div className="user-avatar">{initials}</div>

        <div>
          <h4>{userName}</h4>
          <p>Administrator</p>
        </div>

        <span className="sidebar-user-status" />
      </div>
    </aside>
  );
}

export default SidebarV2;