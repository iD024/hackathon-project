import React, { useState } from "react";
import logo1 from "../assets/logo1.png";
import "../components/css/IssueFeed.css";

function IssueFeed({ issues }) {
  // State to manage the image viewer
  const [viewingImage, setViewingImage] = useState(null);

  if (!issues || issues.length === 0) {
    return (
      <div className="issue-feed-container">
        <div className="feed-header">
          <h2>Issue Feed</h2>
        </div>
        <div className="empty-state">
          <img src={logo1} alt="Civic Pulse" />
          <p>No issues reported yet. Be the first to make a difference!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="issue-feed-container">
        <div className="feed-header">
          <h2>Issue Feed</h2>
          <div className="issue-count">
            {issues.length} {issues.length === 1 ? "Issue" : "Issues"}
          </div>
        </div>
        <div className="issue-list">
          {issues.map((issue, index) => (
            <div
              key={issue._id}
              className="issue-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="issue-header">
                <div className="issue-title-section">
                  <h4 className="issue-title">
                    {issue.title || "Untitled Issue"}
                  </h4>
                  <div className="issue-category">
                    <span className="category-icon">
                      {issue.aiCategory === "Infrastructure"
                        ? "🏗️"
                        : issue.aiCategory === "Safety"
                        ? "⚠️"
                        : issue.aiCategory === "Environment"
                        ? "🌱"
                        : "📝"}
                    </span>
                    <span className="category-text">
                      {issue.aiCategory || "General"}
                    </span>
                  </div>
                </div>
                <div className="issue-badges">
                  <span
                    className={`status-badge status-${issue.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {issue.status}
                  </span>
                  <span
                    className={`priority-badge priority-${
                      issue.aiSeverity?.toLowerCase() || "pending"
                    }`}
                  >
                    {issue.aiSeverity || "Pending"}
                  </span>
                </div>
              </div>

              <p className="issue-description">{issue.description}</p>

              {issue.images && issue.images.length > 0 && (
                <div className="issue-images">
                  {issue.images.slice(0, 4).map((image, idx) => (
                    <div
                      key={idx}
                      className="issue-image-container"
                      onMouseEnter={() => setViewingImage(image)}
                      onMouseLeave={() => setViewingImage(null)}
                      data-count={
                        idx === 3 && issue.images.length > 4
                          ? `+${issue.images.length - 4}`
                          : null
                      }
                    >
                      <img
                        src={image}
                        alt={`Issue ${idx + 1}`}
                        className="issue-image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="issue-footer">
                <div className="issue-meta">
                  <span className="reporter">
                    👤 {issue.reportedBy?.name || "Anonymous"}
                  </span>
                  <span className="date">
                    🕒 {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="image-viewer-backdrop"
          onClick={() => setViewingImage(null)}
        >
          <div className="image-viewer-content">
            <img src={viewingImage} alt="Enlarged issue" />
          </div>
        </div>
      )}
    </>
  );
}

export default IssueFeed;
