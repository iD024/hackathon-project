import React, { useState } from "react";
import { createIssue } from "../services/apiService";
import logo2 from "../assets/logo2.png";
import "../components/css/SubmitIssueForm.css";

function SubmitIssueForm({ onIssueSubmitted, location, locationError }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || isSubmitting || !location) return;

    setIsSubmitting(true);

    const newIssue = {
      title,
      description,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat], // [longitude, latitude]
      },
    };

    const result = await createIssue(newIssue);
    if (result) {
      setTitle("");
      setDescription("");
      onIssueSubmitted();
    }
    setIsSubmitting(false);
  };

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (!location && !locationError) return "Getting Location...";
    if (locationError && !location) return "Location Unavailable";
    return "Submit Issue";
  };

  return (
    <div className="submit-form-container card-purple">
      <div className="form-header">
        <img src={logo2} alt="Report Issue" className="form-icon" />
        <h3>Report a New Issue</h3>
        <p className="form-subtitle">Help improve your community by reporting local issues</p>
      </div>
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="input-group">
          <label htmlFor="title">Issue Title</label>
          <input
            id="title"
            type="text"
            className="input-purple"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title for the issue (e.g., 'Pothole on Main Street')"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="description">Issue Description</label>
          <textarea
            id="description"
            className="input-purple"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail (e.g., 'Large pothole on Main St causing traffic delays')"
            required
            rows={4}
          />
        </div>
        
        <div className="location-status">
          {location && (
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span>Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
          )}
          {locationError && <p className="location-error">⚠️ {locationError}</p>}
        </div>
        
        <button 
          type="submit" 
          className={`btn-purple submit-btn ${isSubmitting || !location ? 'disabled' : ''}`}
          disabled={isSubmitting || !location}
        >
          <span className="btn-icon">
            {isSubmitting ? '⏳' : location ? '🚀' : '📍'}
          </span>
          {getButtonText()}
        </button>
      </form>
    </div>
  );
}

export default SubmitIssueForm;
