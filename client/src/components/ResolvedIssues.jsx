import React, { useState, useEffect } from "react";
import { getResolvedIssues } from "../services/apiService";
import MapView from "./MapView/MapView";
import "./css/ResolvedIssues.css";

const ResolvedIssues = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResolvedIssues();
  }, []);

  const fetchResolvedIssues = async () => {
    try {
      setLoading(true);
      const issues = await getResolvedIssues();
      setResolvedIssues(issues);
    } catch (error) {
      console.error("Failed to fetch resolved issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="resolved-issues-page">
        <div className="loading">Loading resolved issues...</div>
      </div>
    );
  }

  return (
    <div className="resolved-issues-page">
      <div className="page-header">
        <h1>🎉 Resolved Issues</h1>
        <p className="page-subtitle">
          Celebrating community achievements - {resolvedIssues.length} issues resolved!
        </p>
      </div>

      {resolvedIssues.length === 0 ? (
        <div className="no-resolved-issues">
          <div className="empty-state">
            <h3>No resolved issues yet</h3>
            <p>Once teams complete their assigned issues, they'll appear here!</p>
          </div>
        </div>
      ) : (
        <div className="resolved-issues-grid">
          {resolvedIssues.map((issue) => (
            <div key={issue._id} className="resolved-issue-card">
              <div className="issue-status-badge">
                <span className="status-resolved">✅ Resolved</span>
              </div>
              
              <div className="issue-content">
                <h3 className="issue-title">
                  {issue.title || issue.description.substring(0, 50) + "..."}
                </h3>
                <p className="issue-description">{issue.description}</p>
                
                <div className="issue-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{issue.aiCategory || "General"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Priority:</span>
                    <span className={`priority-badge priority-${issue.aiSeverity?.toLowerCase() || 'medium'}`}>
                      {issue.aiSeverity || "Medium"}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Reported by:</span>
                    <span className="meta-value">{issue.reportedBy?.name || "Anonymous"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Completed:</span>
                    <span className="meta-value">{formatDate(issue.updatedAt || issue.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="issue-actions">
                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIssue && (
        <div className="issue-details-modal">
          <div className="issue-details-content">
            <span className="close" onClick={() => setSelectedIssue(null)}>
              &times;
            </span>
            
            <div className="modal-header">
              <h2>{selectedIssue.title || "Issue Details"}</h2>
              <span className="status-badge status-resolved">✅ Resolved</span>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedIssue.description}</p>
              </div>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Reported by:</strong>
                  <span>{selectedIssue.reportedBy?.name || "Anonymous"}</span>
                </div>
                <div className="detail-item">
                  <strong>Category:</strong>
                  <span>{selectedIssue.aiCategory || "General"}</span>
                </div>
                <div className="detail-item">
                  <strong>Priority:</strong>
                  <span className={`priority-badge priority-${selectedIssue.aiSeverity?.toLowerCase() || 'medium'}`}>
                    {selectedIssue.aiSeverity || "Medium"}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Reported on:</strong>
                  <span>{formatDate(selectedIssue.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <strong>Resolved on:</strong>
                  <span>{formatDate(selectedIssue.updatedAt || selectedIssue.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="map-container">
              <h4>Location</h4>
              <MapView issues={[selectedIssue]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedIssues;
