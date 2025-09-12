import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/apiService";
import "./css/AuthForm.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await registerUser({ name, email, password });
    if (result && result.token) {
      navigate("/home"); // Redirect to homepage on success
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card-purple">
        <div className="auth-header">
          <div className="auth-icon">✨</div>
          <h2>Join Civic Pulse</h2>
          <p className="auth-subtitle">Create your account and start making a difference</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="input-purple"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="input-purple"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input-purple"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password (min. 6 characters)"
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn-purple auth-btn">
            <span className="btn-icon">🎉</span>
            Create Account
          </button>
          
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>
          
          <Link to="/login" className="btn-outline auth-link">
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
