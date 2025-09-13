import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIssues, getResolvedIssues } from '../services/apiService';
import '../components/css/IssuesPage.css';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const [allIssues, resolvedIssues] = await Promise.all([
          getIssues(),
          getResolvedIssues()
        ]);
        
        // Combine and sort by creation date (newest first)
        const combinedIssues = [
          ...allIssues.map(issue => ({ ...issue, status: 'Open' })),
          ...resolvedIssues.map(issue => ({ ...issue, status: 'Resolved' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setIssues(combinedIssues);
      } catch (err) {
        setError('Failed to load issues. Please try again later.');
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const filteredIssues = activeTab === 'all' 
    ? issues 
    : issues.filter(issue => issue.status.toLowerCase() === activeTab);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div className="loading">Loading issues...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="issues-container">
      <div className="issues-header">
        <h1>Reported Issues</h1>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Issues
          </button>
          <button 
            className={`tab ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            Open
          </button>
          <button 
            className={`tab ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="issues-grid">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div key={issue._id} className="issue-card">
              <div className="issue-image">
                {issue.photoUrl ? (
                  <img src={issue.photoUrl} alt={issue.title} />
                ) : (
                  <div className="image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
                <span className={`status-badge ${issue.status.toLowerCase()}`}>
                  {issue.status}
                </span>
              </div>
              <div className="issue-content">
                <div className="issue-header">
                  <h2>{issue.title || 'Untitled Issue'}</h2>
                  <span className="issue-date">
                    {formatDate(issue.createdAt)}
                  </span>
                </div>
                
                <div className="issue-meta">
                  <div className="meta-item">
                    <span className="meta-label">Reported by:</span>
                    <span className="meta-value">
                      {issue.reportedBy?.name || 'Anonymous'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">
                      {issue.aiCategory || 'General'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Severity:</span>
                    <span className={`severity ${issue.aiSeverity?.toLowerCase() || 'pending'}`}>
                      {issue.aiSeverty || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="issue-address">
                  <span className="meta-label">Location:</span>
                  <p>{issue.location?.address || 'No address provided'}</p>
                </div>

                <p className="issue-description">
                  {issue.description || 'No description provided.'}
                </p>

              </div>
            </div>
          ))
        ) : (
          <div className="no-issues">
            No issues found. Be the first to report an issue!
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;
