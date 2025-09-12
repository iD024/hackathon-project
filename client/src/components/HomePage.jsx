import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MapView from "../components/MapView"; // Corrected path
import IssueFeed from "../components/IssueFeed";
import SubmitIssueForm from "../components/SubmitIssueForm";
import { getIssues } from "../services/apiService";
import "../components/css/HomePage.css";

function HomePage() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate(); // Get the navigate function

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("civicPulseToken");
    if (!token) {
      navigate("/login"); // If no token, redirect to login
    }
  }, [navigate]);

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
      {/* Pass issues to the MapView component */}
      <MapView issues={issues} />
      <div className="sidebar">
        <SubmitIssueForm onIssueSubmitted={fetchIssues} />
        <IssueFeed issues={issues} />
      </div>
    </main>
  );
}

export default HomePage;
