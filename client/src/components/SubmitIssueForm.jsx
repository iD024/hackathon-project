import React, { useState } from "react";
import { createIssue } from "../services/apiService";
import "../components/css/SubmitIssueForm.css";

function SubmitIssueForm({ onIssueSubmitted }) {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || isSubmitting) return;

    setIsSubmitting(true);
    // Hardcoding location for now, we'll get this from the map later
    const newIssue = {
      description,
      location: {
        type: "Point",
        coordinates: [-74.006, 40.7128], // Default to NYC for now
      },
    };

    const result = await createIssue(newIssue);
    if (result) {
      setDescription(""); // Clear the form
      onIssueSubmitted(); // Trigger the refresh in the parent component
    }
    setIsSubmitting(false);
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
}

export default SubmitIssueForm;
