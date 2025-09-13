import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import "./css/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-title-container">
            <img src={logo1} alt="Civic Pulse Logo" className="hero-logo" />
            <h1 className="hero-title">Civic Pulse</h1>
          </div>
          <p className="hero-subtitle">
            Transform your community with the power of collective action. Report
            issues, track progress, and make a real difference.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🏙️</span>
              <span>Smart Issue Reporting</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📍</span>
              <span>Location-Based Tracking</span>
            </div>
          </div>
          <div className="landing-actions">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">🚧</div>
            <div className="card-text">Road Repair</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">💡</div>
            <div className="card-text">Street Light</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🌳</div>
            <div className="card-text">Park Maintenance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
