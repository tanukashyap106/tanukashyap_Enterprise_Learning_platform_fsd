import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import { FaEnvelope, FaLock, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import "../styles/loginPage.css";
import "../styles/registerPage.css";

import AppLogo from "../components/AppLogo";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setDevResetUrl("");

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate password reset request");
      }

      setMessage("Password reset request successful!");
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerPageWrapper">
      <Background />
      <PaperPlaneCursor />

      {/* Top Header Bar */}
      <header className="registerHeaderBar">
        <Link to="/" className="registerLogoBrand" style={{ display: "inline-flex", alignItems: "center" }}>
          <AppLogo height="56px" />
        </Link>

        <button className="btnBackHome" onClick={() => navigate('/login')}>
          <FaArrowLeft /> Back to Login
        </button>
      </header>

      {/* Main Container */}
      <main className="registerMainContent">
        <div className="registerFormCard">
          <div className="regHeaderIconBadge">
            <FaLock />
          </div>

          <h1>Forgot <span>Password?</span></h1>
          <p className="regSubtext">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
          <div className="orangeUnderline" style={{ marginBottom: "24px" }}></div>

          {error && <div className="errorMessageCard">{error}</div>}
          {message && (
            <div className="errorMessageCard" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#16A34A' }}>
              {message}
            </div>
          )}

          {devResetUrl && (
            <div className="mockDevModeBox" style={{ marginBottom: '20px' }}>
              <div className="mockDevHeader">
                <FaShieldAlt /> Local Dev Shortcut Link:
              </div>
              <a
                href={devResetUrl}
                style={{ color: '#F9572A', wordBreak: 'break-all', fontSize: '12px', fontWeight: '700', textDecoration: 'underline' }}
              >
                Click here to reset password directly
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="loginFormContent">
            <div className="inputFieldGroup">
              <label htmlFor="forgot-email">Email Address</label>
              <div className="inputWithIconWrapper">
                <FaEnvelope className="fieldPrefixIcon" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btnSubmitLogin" disabled={loading} style={{ marginTop: '10px' }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="orDividerLine">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btnGoogleLogin"
              onClick={() => navigate('/login')}
              style={{ justifyContent: 'center' }}
            >
              <FaShieldAlt style={{ color: '#F9572A' }} /> Back to Login
            </button>

            <div className="bottomAuthText">
              Remember your password?{" "}
              <Link to="/login">Login here</Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', padding: '20px 0', zIndex: 5 }}>
        &copy; {new Date().getFullYear()} SkillSphere. All rights reserved.
      </footer>
    </div>
  );
}
