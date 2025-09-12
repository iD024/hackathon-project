import React, { useState } from "react";
import { createIssue } from "../services/apiService";
import "../components/css/SubmitIssueForm.css";

function SubmitIssueForm({ onIssueSubmitted, location, locationError }) {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || isSubmitting || !location) return;

    setIsSubmitting(true);

    const newIssue = {
      description,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat], // [longitude, latitude]
      },
    };

    const result = await createIssue(newIssue);
    if (result) {
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
    <div className="submit-form-container">
      <h3>Report a New Issue</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue (e.g., 'Large pothole on Main St')"
          required
        />
        {locationError && <p className="location-error">{locationError}</p>}
        <button type="submit" disabled={isSubmitting || !location}>
          {getButtonText()}
        </button>
      </form>
    </div>
  );
}

export default SubmitIssueForm;
