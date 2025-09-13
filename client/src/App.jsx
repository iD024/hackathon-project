import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import TeamPage from "./components/TeamPage";
import ResolvedIssues from "./components/ResolvedIssues";
import StatsPage from "./components/StatsPage";
import IssuesPage from "./components/IssuesPage";
import SubmitIssuePage from "./components/SubmitIssuePage";
import BusinessDashboard from "./components/BusinessDashboard";
import BusinessesPage from "./components/BusinessesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/submit-issue" element={<SubmitIssuePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business"
          element={
            <ProtectedRoute>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/resolved" element={<ResolvedIssues />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
