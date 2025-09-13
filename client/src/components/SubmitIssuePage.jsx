import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitIssueForm from "./SubmitIssueForm";
import { Link } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import "./css/SubmitIssuePage.css";

function SubmitIssuePage() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(
            "Unable to get your location. Please enable location access."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Removed handleIssueSubmitted since we're redirecting in the form component

  return (
    <div className="submit-issue-page">
      <div className="submit-issue-header">
        <Link to="/" className="back-link">
          <img src={logo1} alt="Civic Pulse" className="header-logo" />
          <span>← Back to Home</span>
        </Link>
        <h1>Report an Issue</h1>
        <p className="page-subtitle">
          Help improve your community by reporting local issues. No account
          required!
        </p>
      </div>

      <div className="submit-issue-content">
        <div className="submit-issue-info">
          <h2>Why Report Issues?</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🏙️</div>
              <h3>Community Impact</h3>
              <p>
                Your reports help local authorities identify and fix problems
                quickly.
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Easy & Quick</h3>
              <p>Report issues in minutes with just a few clicks and photos.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔍</div>
              <h3>AI-Powered</h3>
              <p>
                Our AI analyzes your report to prioritize and categorize issues.
              </p>
            </div>
          </div>
        </div>

        <div className="submit-issue-form-container">
          <SubmitIssueForm location={location} locationError={locationError} />
        </div>
      </div>

      <div className="submit-issue-footer">
        <p>
          Want to track issues and join teams?{" "}
          <Link to="/register" className="footer-link">
            Create an account
          </Link>{" "}
          or{" "}
          <Link to="/login" className="footer-link">
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SubmitIssuePage;
