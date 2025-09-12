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
  const navigate = useNavigate();

  // Token check
  useEffect(() => {
    const token = localStorage.getItem("civicPulseToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user's location once when the component mounts
  useEffect(() => {
    // Options to request a more accurate location
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
        geoOptions // Pass the high-accuracy options here
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

  return (
    <main className="home-container">
      <MapView issues={issues} userLocation={userLocation} />
      <div className="sidebar">
        <SubmitIssueForm
          onIssueSubmitted={fetchIssues}
          location={userLocation}
          locationError={locationError}
        />
        <IssueFeed issues={issues} />
      </div>
    </main>
  );
}

export default HomePage;
