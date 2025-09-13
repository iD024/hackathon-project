import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import Notifications from "./Notifications";
import "./css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("civicPulseToken"); // Clear the token
    navigate("/"); // Redirect to the landing page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo1} alt="Civic Pulse" className="navbar-logo" />
        <h1>Civic Pulse</h1>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        {localStorage.getItem("civicPulseToken") && (
          <>
            <Link to="/issues">All Issues</Link>
            <Link to="/teams">Teams</Link>
            <Link to="/resolved">Resolved</Link>
            <Link to="/stats">Statistics</Link>
          </>
        )}
      </div>
      {/* Show logout button if a token exists */}
      {localStorage.getItem("civicPulseToken") && (
        <div className="navbar-user-actions">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="notification-btn"
          >
            🔔
          </button>
          {showNotifications && <Notifications />}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
