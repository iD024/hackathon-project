import React from "react";
import { Link } from "react-router-dom";
import "./css/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-box">
        <h2>Welcome to Civic Pulse</h2>
        <p>Your platform for reporting and resolving civic issues.</p>
        <div className="landing-actions">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
