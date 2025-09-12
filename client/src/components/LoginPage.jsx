import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/apiService";
import "./css/AuthForm.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await loginUser({ email, password });
    if (result && result.token) {
      navigate("/home"); // Redirect to homepage on success
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card-purple">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your Civic Pulse account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
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
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn-purple auth-btn">
            <span className="btn-icon">🚀</span>
            Sign In
          </button>
          
          <div className="auth-divider">
            <span>New to Civic Pulse?</span>
          </div>
          
          <Link to="/register" className="btn-outline auth-link">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
