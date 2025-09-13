import React, { useState, useEffect } from "react";
import { getBusinesses } from "../services/apiService";
import "./css/BusinessesPage.css";

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      const response = await getBusinesses();
      if (response && response.data) {
        setBusinesses(response.data);
      }
    } catch (error) {
      setError("Failed to fetch businesses");
      console.error("Error fetching businesses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set(businesses.map((business) => business.category)),
  ];

  if (isLoading) {
    return (
      <div className="businesses-page">
        <div className="loading">Loading businesses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="businesses-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="businesses-page">
      <div className="page-header">
        <h1>Local Businesses</h1>
        <p>Discover businesses in your community</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="businesses-grid">
        {filteredBusinesses.length === 0 ? (
          <div className="no-results">
            <h3>No businesses found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          filteredBusinesses.map((business) => (
            <div key={business._id} className="business-card">
              <div className="business-images">
                {business.images && business.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${business.images[0]}`}
                    alt={business.name}
                    className="business-main-image"
                  />
                ) : (
                  <div className="no-image">
                    <span>📷</span>
                    <p>No image available</p>
                  </div>
                )}
              </div>

              <div className="business-info">
                <div className="business-header">
                  <h3>{business.name}</h3>
                  <span className="category-badge">{business.category}</span>
                </div>

                <p className="business-description">
                  {business.description.length > 150
                    ? `${business.description.substring(0, 150)}...`
                    : business.description}
                </p>

                <div className="business-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{business.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📞</span>
                    <span>{business.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">✉️</span>
                    <span>{business.email}</span>
                  </div>
                  {business.website && (
                    <div className="detail-item">
                      <span className="detail-icon">🌐</span>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {business.hours && (
                  <div className="business-hours">
                    <h4>Business Hours</h4>
                    <div className="hours-list">
                      {Object.entries(business.hours).map(([day, hours]) => (
                        <div key={day} className="hours-item">
                          <span className="day">
                            {day.charAt(0).toUpperCase() + day.slice(1)}:
                          </span>
                          <span className="time">
                            {hours.open && hours.close
                              ? `${hours.open} - ${hours.close}`
                              : "Closed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="business-footer">
                  <span className="owner">
                    Owner: {business.owner?.name || "Unknown"}
                  </span>
                  {business.isVerified && (
                    <span className="verified-badge">✅ Verified</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessesPage;
