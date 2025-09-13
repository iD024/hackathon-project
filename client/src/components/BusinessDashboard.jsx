import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getMyBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "../services/apiService";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import "./css/BusinessDashboard.css";

const BusinessDashboard = () => {
  const [business, setBusiness] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userType, setUserType] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    coordinates: [0, 0],
    hours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("civicPulseToken");
    if (token) {
      const decoded = jwtDecode(token);
      setUserType(decoded.userType);
    }
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      setIsLoading(true);
      const response = await getMyBusiness();
      if (response && response.data) {
        setBusiness(response.data);
        setFormData({
          name: response.data.name || "",
          description: response.data.description || "",
          category: response.data.category || "",
          address: response.data.address || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          website: response.data.website || "",
          coordinates: response.data.location?.coordinates || [0, 0],
          hours: response.data.hours || {
            monday: { open: "", close: "" },
            tuesday: { open: "", close: "" },
            wednesday: { open: "", close: "" },
            thursday: { open: "", close: "" },
            friday: { open: "", close: "" },
            saturday: { open: "", close: "" },
            sunday: { open: "", close: "" },
          },
        });
      }
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 5 - selectedFiles.length);

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
    const newFiles = [...selectedFiles];
    const newPreviews = [...filePreviews];

    URL.revokeObjectURL(newPreviews[index].id);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const businessData = {
        ...formData,
        coordinates: JSON.stringify(formData.coordinates),
        hours: JSON.stringify(formData.hours),
      };

      let response;
      if (business) {
        response = await updateBusiness(businessData, selectedFiles);
      } else {
        response = await createBusiness(businessData, selectedFiles);
      }

      if (response && response.data) {
        setBusiness(response.data);
        setIsEditing(false);
        setSelectedFiles([]);
        setFilePreviews([]);
        setSuccess(
          business
            ? "Business updated successfully!"
            : "Business created successfully!"
        );
      }
    } catch (error) {
      setError(error.message || "Failed to save business");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your business listing? This action cannot be undone."
      )
    ) {
      try {
        await deleteBusiness();
        setBusiness(null);
        setSuccess("Business deleted successfully!");
      } catch (error) {
        setError(error.message || "Failed to delete business");
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            coordinates: [position.coords.longitude, position.coords.latitude],
          }));
        },
        (error) => {
          setError(
            "Unable to get your location. Please enter coordinates manually."
          );
        }
      );
    }
  };

  if (userType !== "business") {
    return (
      <div className="business-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This page is only available for business accounts.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="business-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="business-dashboard">
      <div className="dashboard-header">
        <h1>Business Dashboard</h1>
        <p>Manage your business listing and presence in the community</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      {business && !isEditing ? (
        <div className="business-view">
          <div className="business-header">
            <h2>{business.name}</h2>
            <div className="business-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Business
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete Business
              </button>
            </div>
          </div>

          <div className="business-content">
            <div className="business-info">
              <div className="info-section">
                <h3>Description</h3>
                <p>{business.description}</p>
              </div>

              <div className="info-section">
                <h3>Contact Information</h3>
                <div className="contact-grid">
                  <div className="contact-item">
                    <strong>Category:</strong> {business.category}
                  </div>
                  <div className="contact-item">
                    <strong>Address:</strong> {business.address}
                  </div>
                  <div className="contact-item">
                    <strong>Phone:</strong> {business.phone}
                  </div>
                  <div className="contact-item">
                    <strong>Email:</strong> {business.email}
                  </div>
                  {business.website && (
                    <div className="contact-item">
                      <strong>Website:</strong>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {business.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {business.hours && (
                <div className="info-section">
                  <h3>Business Hours</h3>
                  <div className="hours-grid">
                    {Object.entries(business.hours).map(([day, hours]) => (
                      <div key={day} className="hours-item">
                        <strong>
                          {day.charAt(0).toUpperCase() + day.slice(1)}:
                        </strong>
                        {hours.open && hours.close
                          ? `${hours.open} - ${hours.close}`
                          : "Closed"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {business.images && business.images.length > 0 && (
                <div className="info-section">
                  <h3>Business Images</h3>
                  <div className="business-images">
                    {business.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/uploads/${image}`}
                        alt={`${business.name} ${index + 1}`}
                        className="business-image"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="business-form">
          <div className="form-header">
            <h2>{business ? "Edit Business" : "Create Business Listing"}</h2>
            {business && (
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="business-form-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Business Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retail">Retail</option>
                  <option value="Service">Service</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="form-input"
                placeholder="Describe your business, services, and what makes you unique..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Business Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location Coordinates</label>
              <div className="coordinates-input">
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates[1]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coordinates: [
                        prev.coordinates[0],
                        parseFloat(e.target.value) || 0,
                      ],
                    }))
                  }
                  placeholder="Latitude"
                  className="form-input"
                />
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates[0]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coordinates: [
                        parseFloat(e.target.value) || 0,
                        prev.coordinates[1],
                      ],
                    }))
                  }
                  placeholder="Longitude"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn-secondary"
                >
                  Use Current Location
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Business Hours</label>
              <div className="hours-form">
                {Object.entries(formData.hours).map(([day, hours]) => (
                  <div key={day} className="hours-row">
                    <label className="day-label">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </label>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        handleHoursChange(day, "open", e.target.value)
                      }
                      className="form-input time-input"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        handleHoursChange(day, "close", e.target.value)
                      }
                      className="form-input time-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="file-upload-label">
                <ArrowUpTrayIcon className="upload-icon" width={18} />
                Upload Business Images (Max 5)
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  disabled={selectedFiles.length >= 5}
                />
              </label>
              <span className="file-upload-hint">
                {selectedFiles.length}/5 images selected
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

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : business
                  ? "Update Business"
                  : "Create Business"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
