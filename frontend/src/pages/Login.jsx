import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";
import audit3D from "../assets/audit-hologram.png"; // premium hologram illustration

export default function Login() {
  const [isMobileTab, setIsMobileTab] = useState(false);

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="left-section">
        <div className="left-content">
          <h1>Digitally Streamline the Audit Process</h1>
          <p>Ensure accuracy, transparency, and effortless compliance.</p>

          <img
            src={audit3D}
            alt="Audit Hologram Illustration"
            className="audit-illustration"
          />
        </div>
      </div>

      {/* RIGHT PANEL with Glass Card */}
      <div className="right-section">
        <img src={logo} alt="EDME" className="brand-logo" />

        <div className="login-card">
          <h2>Sign in to your account</h2>

          {/* Tabs */}
          <div className="tab-row">
            <button
              className={`tab ${!isMobileTab ? "active" : ""}`}
              onClick={() => setIsMobileTab(false)}
            >
              Email
            </button>
            <button
              className={`tab ${isMobileTab ? "active" : ""}`}
              onClick={() => setIsMobileTab(true)}
            >
              Mobile
            </button>
          </div>

          {/* Email field */}
          {!isMobileTab && (
            <div className="field">
              <input type="email" placeholder="Enter your email" className="input-box" />
            </div>
          )}

          {/* Mobile field */}
          {isMobileTab && (
            <div className="field">
              <input type="number" placeholder="Enter mobile number" className="input-box" />
            </div>
          )}

          {/* Radio Selection */}
          <div className="radio-row">
            <label><input type="radio" name="auth" defaultChecked /> Password</label>
            <label><input type="radio" name="auth" /> OTP</label>
          </div>

          {/* Password Field */}
          <div className="field">
            <input type="password" placeholder="Enter Password" className="input-box" />
          </div>

          <button className="login-btn">Sign In</button>
        </div>

        {/* FOOTER VERSION INFO */}
        <div className="version-footer">
          © 2025 EDME Audit Portal • Version 1.0.0 • Powered by EDME
        </div>
      </div>
    </div>
  );
}
