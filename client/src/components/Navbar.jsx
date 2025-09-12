import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("civicPulseToken"); // Clear the token
    navigate("/"); // Redirect to the landing page
  };

  return (
    <nav className="navbar">
      <h1>Civic Pulse</h1>
      {/* Show logout button if a token exists */}
      {localStorage.getItem("civicPulseToken") && (
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
