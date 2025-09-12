import React from "react";
import "../components/css/IssueFeed.css";

function IssueFeed({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="issue-feed-container placeholder-style">
        <h2>Issue Feed</h2>
        <p>No issues reported yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="issue-feed-container">
      <h2>Issue Feed</h2>
      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue._id} className="issue-item">
            <p className="issue-description">{issue.description}</p>
            <span
              className={`issue-status status-${issue.status.toLowerCase()}`}
            >
              {issue.status}
            </span>
            <small className="issue-date">
              {new Date(issue.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssueFeed;
