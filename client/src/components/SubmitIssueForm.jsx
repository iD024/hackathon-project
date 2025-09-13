import React, { useState, useRef } from "react";
import { createIssue } from "../services/apiService";
import logo2 from "../assets/logo2.png";
import { ArrowUpTrayIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import "../components/css/SubmitIssueForm.css";

function SubmitIssueForm({ onIssueSubmitted, location, locationError }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    // Clear previous file preview if exists
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    
    // Create preview for the new file
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
    setSelectedFile(file);
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || isSubmitting || !location) return;

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
      const result = await createIssue(newIssue, selectedFile ? [selectedFile] : []);
      if (result) {
        setTitle("");
        setDescription("");
        removeFile();
        onIssueSubmitted();
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      alert('Failed to submit issue. Please try again.');
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

        <div className="file-upload-container">
          {!filePreview ? (
            <div 
              className="file-upload-box"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input"
                accept="image/*"
              />
              <div className="upload-icon">
                <PhotoIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p>Click to upload an image (optional)</p>
              <p className="file-upload-hint">JPG, PNG, or GIF (max 5MB)</p>
            </div>
          ) : (
            <div className="relative">
              <div className="relative group">
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeFile}
                    className="bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                    title="Remove image"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-800" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Click the image to change
              </p>
            </div>
          )}
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
