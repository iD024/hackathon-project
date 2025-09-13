import React from "react";
import logo1 from "../assets/logo1.png";
import "../components/css/IssueFeed.css";

function IssueFeed({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="issue-feed-container card-purple">
        <div className="feed-header">
          <img src={logo1} alt="Issue Feed" className="feed-icon" />
          <h2>Issue Feed</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🌟</div>
          <p>No issues reported yet. Be the first to make a difference!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-feed-container card-purple">
      <div className="feed-header">
        <img src={logo1} alt="Issue Feed" className="feed-icon" />
        <h2>Issue Feed</h2>
        <div className="issue-count">{issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</div>
      </div>
      <div className="issue-list">
        {issues.map((issue, index) => (
          <div key={issue._id} className="issue-item" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="issue-header">
              <div className="issue-title-section">
                <h4 className="issue-title">{issue.title || 'Untitled Issue'}</h4>
                <div className="issue-category">
                  <span className="category-icon">
                    {issue.aiCategory === 'Infrastructure' ? '🏗️' : 
                     issue.aiCategory === 'Safety' ? '⚠️' : 
                     issue.aiCategory === 'Environment' ? '🌱' : '📝'}
                  </span>
                  <span className="category-text">{issue.aiCategory || 'General'}</span>
                </div>
              </div>
              <div className="issue-badges">
                <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                  {issue.status}
                </span>
                <span className={`priority-badge priority-${issue.aiSeverity?.toLowerCase() || 'pending'}`}>
                  {issue.aiSeverity || 'Pending'}
                </span>
              </div>
            </div>
            
            <p className="issue-description">{issue.description}</p>
            
            <div className="issue-footer">
              <div className="issue-meta">
                <span className="reporter">
                  👤 {issue.reportedBy?.name || 'Anonymous'}
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
  );
}

export default IssueFeed;
