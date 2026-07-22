import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaSignOutAlt, FaRobot } from "react-icons/fa";
import { generateNotifications } from "../utils/liveNotifications";

function Topbar({
  handleLogout,
  products = [],
  forecastData = [],
  totalRevenue = 0,
  totalProfit = 0,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = generateNotifications(
    products,
    forecastData,
    totalRevenue,
    totalProfit
  );
const currentUser = JSON.parse(
  localStorage.getItem("smartstock_current_user") || "{}"
);

const displayName =
  currentUser.full_name ||
  currentUser.name ||
  "User";

const avatarLetter = displayName
  .charAt(0)
  .toUpperCase();
  const today = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="topbar live-topbar">
      <div className="topbar-left">
        <h2>Dashboard</h2>
        <p>{today}</p>
      </div>

      <div className="topbar-center live-search">
        <FaSearch />
        <input type="text" placeholder="Search inventory..." />
      </div>

      <div className="live-status-pill">
        <span className="live-dot"></span>
        <FaRobot />
        <strong>AI Live</strong>
        <small>{time}</small>
      </div>

      <div className="topbar-right">
        <div className="notification-wrapper">
          <button
            className="icon-btn notification-live"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            <span></span>
          </button>

          {showNotifications && (
            <div className="notification-menu">
              <h4>🔔 AI Notifications</h4>

              {notifications.map((item, index) => (
                <div
                  key={index}
                  className={`notification-item ${item.type}`}
                >
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile">
  <div className="avatar">
    {avatarLetter}
  </div>

  <div>
    <strong>{displayName}</strong>
    <small>Administrator</small>
  </div>
</div>
        <button className="logout-btn premium-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;