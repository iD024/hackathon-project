import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createIssue } from "../services/apiService";
import logo2 from "../assets/logo2.png";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "../components/css/SubmitIssueForm.css";

function SubmitIssueForm({ onIssueSubmitted, location, locationError }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 3 - selectedFiles.length);

    if (imageFiles.length === 0) return;

    const newPreviews = imageFiles.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      name: file.name,
    }));

    setSelectedFiles((prev) => [...prev, ...imageFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(filePreviews[index].id);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setFilePreviews(filePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || isSubmitting || !location) {
      console.error(
        "Submission prevented: Missing title, description, or location."
      );
      return;
    }

    setIsSubmitting(true);

    const newIssue = {
      title,
      description,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat],
      },
    };

    try {
      const result = await createIssue(newIssue, selectedFiles);
      if (result) {
        setTitle("");
        setDescription("");
        setSelectedFiles([]);
        setFilePreviews([]);
        if (onIssueSubmitted) {
          onIssueSubmitted();
        }
        navigate("/issues");
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        <p className="form-subtitle">
          Help improve your community by reporting local issues
        </p>
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
              <span>
                Location detected: {location.lat.toFixed(4)},{" "}
                {location.lng.toFixed(4)}
              </span>
            </div>
          )}
          {locationError && (
            <p className="location-error">⚠️ {locationError}</p>
          )}
        </div>

        <div className="file-upload-section">
          <label className="file-upload-label">
            <ArrowUpTrayIcon className="upload-icon" width={18} />
            Upload Photos (Max 3)
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              style={{ display: "none" }}
              disabled={selectedFiles.length >= 3}
            />
          </label>
          <span className="file-upload-hint">
            {selectedFiles.length}/3 photos selected
          </span>

          <div className="file-previews">
            {filePreviews.map((preview, index) => (
              <div key={preview.id} className="file-preview">
                <div className="file-preview-image">
                  <img src={preview.id} alt={preview.name} />
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                    aria-label="Remove image"
                  >
                    <XMarkIcon width={16} />
                  </button>
                </div>
                <div className="file-name">{preview.name}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`btn-purple submit-btn ${
            isSubmitting || !location ? "disabled" : ""
          }`}
          disabled={isSubmitting || !location}
        >
          <span className="btn-icon">
            {isSubmitting ? "⏳" : location ? "🚀" : "📍"}
          </span>
          {getButtonText()}
        </button>
      </form>
    </div>
  );
}

export default SubmitIssueForm;
