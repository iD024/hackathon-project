import React from "react";
import MapView from "../components/MapView";
import IssueFeed from "../components/IssueFeed";

function HomePage() {
  return (
    <main className="home-container">
      <MapView />
      <IssueFeed />
    </main>
  );
}

export default HomePage;
