import React, { useState, useEffect, useCallback } from "react";
import MapView from "../components/MapView";
import IssueFeed from "../components/IssueFeed";
import SubmitIssueForm from "../components/SubmitIssueForm";
import { getIssues } from "../services/apiService";
import "../components/css/HomePage.css";

function HomePage() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = useCallback(async () => {
    const data = await getIssues();
    // Sort by most recent
    setIssues(
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <main className="home-container">
      <MapView />
      <div className="sidebar">
        <SubmitIssueForm onIssueSubmitted={fetchIssues} />
        <IssueFeed issues={issues} />
      </div>
    </main>
  );
}

export default HomePage;
