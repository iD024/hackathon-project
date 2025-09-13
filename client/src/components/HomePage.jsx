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
  const [showSubmitForm, setShowSubmitForm] = useState(false); // State to toggle the form
  const navigate = useNavigate();

  // Token check
  useEffect(() => {
    const token = localStorage.getItem("civicPulseToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user's location
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
          setLocationError(
            "Location access denied. Please enable it in your browser settings."
          );
        },
        geoOptions
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to fetch issues from the API
  const fetchIssues = useCallback(async () => {
    const data = await getIssues();
    setIssues(
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Handler to close the form and refresh the issue feed after submission
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
            onCancel={() => setShowSubmitForm(false)} // Pass a cancel handler
            location={userLocation}
            locationError={locationError}
          />
        ) : (
          <div className="report-issue-prompt card-purple">
            <button
              className="btn-purple btn-report"
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
