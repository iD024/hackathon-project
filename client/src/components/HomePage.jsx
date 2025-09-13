import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView/MapView";
import IssueFeed from "../components/IssueFeed";
import SubmitIssueForm from "../components/SubmitIssueForm";
import { getIssues } from "../services/apiService";
import "../components/css/HomePage.css";

function HomePage() {
  const [issues, setIssues] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("civicPulseToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Location access denied. Centering on Jaipur.");
        },
        geoOptions
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchIssues = useCallback(async () => {
    try {
      const data = await getIssues();
      setIssues(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleIssueSubmitted = () => {
    fetchIssues();
    setShowSubmitForm(false);
  };

  return (
    <main className="home-container">
      <MapView issues={issues} userLocation={userLocation} />
      <div className="sidebar">
        {showSubmitForm ? (
          <SubmitIssueForm
            onIssueSubmitted={handleIssueSubmitted}
            onCancel={() => setShowSubmitForm(false)}
            location={userLocation}
            locationError={locationError}
          />
        ) : (
          <div className="report-issue-prompt">
            <button
              className="btn-report"
              onClick={() => setShowSubmitForm(true)}
            >
              🚀 Report a New Issue
            </button>
          </div>
        )}
        <IssueFeed issues={issues} />
      </div>
    </main>
  );
}

export default HomePage;
