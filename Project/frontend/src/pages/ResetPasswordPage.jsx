import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/loginPage.css";

import AppLogo from "../components/AppLogo";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing from the link. Please request a new link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage("Your password has been successfully reset!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Header Bar */}
      <header className="header-bar">
        <Link to="/" className="logo-brand" style={{ display: "inline-flex", alignItems: "center" }}>
          <AppLogo height="56px" />
        </Link>
        <Link to="/login" className="back-btn">
          Back to Login
        </Link>
      </header>

      <div className="container">
        <div className="login-card" style={{
          border: "1px solid rgba(0, 229, 255, 0.15)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.55), 0 0 35px rgba(0, 229, 255, 0.1)",
        }}>
          <h1>Reset Password</h1>
          <p className="subtitle">
            Enter your new password below to secure your account.
          </p>

          {error && <div className="errorMessage" style={{ marginBottom: "20px" }}>{error}</div>}
          {message && (
            <div style={{ textAlign: "center" }}>
              <div className="successMessage" style={{ 
                color: "#00e5ff", 
                background: "rgba(0, 229, 255, 0.1)", 
                border: "1px solid rgba(0, 229, 255, 0.2)",
                padding: "15px",
                borderRadius: "10px",
                fontSize: "15px",
                marginBottom: "20px"
              }}>{message}</div>
              <Link 
                to="/login" 
                className="login-btn"
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  textDecoration: "none",
                  background: "linear-gradient(90deg, #00e5ff, #8a2be2)",
                  boxShadow: "0 10px 25px rgba(0, 229, 255, 0.25)",
                  marginTop: "10px",
                  lineHeight: "22px"
                }}
              >
                Go to Login
              </Link>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="login-content">
              <div className="input-group">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
                style={{
                  background: "linear-gradient(90deg, #00e5ff, #8a2be2)",
                  boxShadow: "0 10px 25px rgba(0, 229, 255, 0.25)",
                  marginTop: "10px"
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
