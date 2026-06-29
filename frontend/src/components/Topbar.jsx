import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";

function Topbar({ handleLogout }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>Dashboard</h2>
        <p>{today}</p>
      </div>

      <div className="topbar-center">
        <FaSearch />
        <input
          type="text"
          placeholder="Search inventory..."
        />
      </div>

      <div className="topbar-right">
        <button className="icon-btn">
          <FaBell />
        </button>

        <div className="profile">
          <div className="avatar">A</div>

          <div>
            <strong>Arjeet Singh</strong>
            <small>Administrator</small>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;