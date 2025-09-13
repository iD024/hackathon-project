import React, { useState, useEffect } from 'react';
import { getIssues, getResolvedIssues } from '../services/apiService';
import '../components/css/StatsPage.css';

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    resolutionRate: 0,
    issuesByCategory: {},
    issuesBySeverity: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allIssues, resolvedIssues] = await Promise.all([
          getIssues(),
          getResolvedIssues()
        ]);

        // Calculate stats
        const total = allIssues.length + resolvedIssues.length;
        const resolved = resolvedIssues.length;
        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        // Group by category
        const byCategory = [...allIssues, ...resolvedIssues].reduce((acc, issue) => {
          const category = issue.aiCategory || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Group by severity
        const bySeverity = [...allIssues, ...resolvedIssues].reduce((acc, issue) => {
          const severity = issue.aiSeverity || 'Not Specified';
          acc[severity] = (acc[severity] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalIssues: total,
          resolvedIssues: resolved,
          resolutionRate: resolutionRate,
          issuesByCategory: byCategory,
          issuesBySeverity: bySeverity
        });
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="stats-container">
      <h1>Issue Statistics</h1>
      
      <div className="horizontal-layout">
        {/* Left Column - Summary Cards */}
        <div className="summary-cards">
          <div className="stat-card">
            <h3>Total Issues</h3>
            <div className="stat-value">{stats.totalIssues}</div>
          </div>
          
          <div className="stat-card">
            <h3>Resolved Issues</h3>
            <div className="stat-value">{stats.resolvedIssues}</div>
          </div>
          
          <div className="stat-card">
            <h3>Resolution Rate</h3>
            <div className="stat-value">{stats.resolutionRate}%</div>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div className="charts-container">
          <div className="stats-section">
            <h2>Issues by Category</h2>
            <div className="horizontal-bars">
              {Object.entries(stats.issuesByCategory).map(([category, count]) => (
                <div key={category} className="horizontal-bar">
                  <div className="bar-label">{category}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{
                        width: `${(count / stats.totalIssues) * 100}%`,
                        background: getRandomColor()
                      }}
                    ></div>
                    <span className="bar-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h2>Issues by Severity</h2>
            <div className="severity-horizontal">
              {Object.entries(stats.issuesBySeverity).map(([severity, count]) => (
                <div key={severity} className="severity-horizontal-item">
                  <div className="severity-info">
                    <span className="severity-label">{severity}</span>
                    <span className="severity-count">{count}</span>
                  </div>
                  <div 
                    className="severity-bar-horizontal"
                    style={{
                      width: `${(count / stats.totalIssues) * 100}%`,
                      background: getSeverityColor(severity)
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for styling
const getRandomColor = () => {
  const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getSeverityColor = (severity) => {
  const colors = {
    'High': '#e74a3b',
    'Medium': '#f6c23e',
    'Low': '#1cc88a',
    'Pending': '#858796'
  };
  return colors[severity] || '#4e73df';
};

export default StatsPage;
