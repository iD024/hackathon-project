import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo1 from "../assets/logo1.png";
import Notifications from "./Notifications";
import "./css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("civicPulseToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.userType);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("civicPulseToken");
    navigate("/");
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
            <Link to="/businesses">Businesses</Link>
            {userType === "business" && <Link to="/business">My Business</Link>}
            {userType === "citizen" && <Link to="/teams">Teams</Link>}
            <Link to="/resolved">Resolved</Link>
            <Link to="/stats">Statistics</Link>
          </>
        )}
      </div>
      {localStorage.getItem("civicPulseToken") && (
        <div className="navbar-user-actions">
          {/* --- NEW CODE --- */}
          {userType && <span className="user-type-badge">{userType}</span>}
          {/* --- END NEW CODE --- */}
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
