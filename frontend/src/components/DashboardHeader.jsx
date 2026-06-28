function DashboardHeader({ handleLogout }) {
  return (
    <div className="dashboard-header">
      <div>
        <p className="dashboard-badge">
          AI Powered Inventory Intelligence
        </p>

        <h1>SmartStock AI Dashboard</h1>

        <p className="dashboard-subtitle">
          Track inventory, sales, profit and low-stock alerts in real time.
        </p>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardHeader;