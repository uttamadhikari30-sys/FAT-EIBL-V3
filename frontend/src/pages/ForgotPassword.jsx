import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: call API to send reset link or OTP
    setSent(true);
    // optionally redirect to OTP page after 1.5s
    setTimeout(() => navigate("/otp-login"), 1500);
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="left-title">Digitally Streamline the Audit Process</h1>
        <p className="left-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>
        <div className="audit-wrapper-small" />
      </div>

      <div className="auth-right">
        <img src={logo} alt="logo" className="company-logo" />
        <div className="auth-card">
          <h2 className="auth-title">Forgot Password</h2>

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <label className="field-label">Enter your registered email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edmeinsurance.com"
                className="input-field"
                required
              />

              <div className="hint">
                We'll send a link or OTP to your email to reset the password.
              </div>

              <button className="primary-btn" type="submit">
                Send Reset Link
              </button>

              <div className="small-row">
                <Link to="/">Back to Sign In</Link>
              </div>
            </form>
          ) : (
            <div className="sent-msg">
              <p>Reset instructions sent to <b>{email}</b>.</p>
              <p>Redirecting to OTP page…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
