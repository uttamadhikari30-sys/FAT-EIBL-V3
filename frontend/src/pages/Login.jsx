import React, { useState } from "react";
import "./NewLogin.css";

import logo from "../assets/logo.png";
import audit from "../assets/audit-illustration.png";

export default function Login() {
  const [loginWith, setLoginWith] = useState("email");
  const [authMode, setAuthMode] = useState("password");

  return (
    <div className="login-container">

      {/* LEFT SECTION */}
      <div className="left-section">
        <h1 className="left-title">Digitally Streamline the Audit Process</h1>
        <p className="left-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img src={audit} alt="Audit Illustration" className="audit-image" />
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <img src={logo} className="company-logo" alt="Company Logo" />

        <div className="login-box">
          <h2 className="login-title">Sign in to your account</h2>

          {/* Tabs */}
          <div className="tab-buttons">
            <button
              className={loginWith === "email" ? "tab-active" : ""}
              onClick={() => setLoginWith("email")}
            >
              Email
            </button>
            <button
              className={loginWith === "mobile" ? "tab-active" : ""}
              onClick={() => setLoginWith("mobile")}
            >
              Mobile
            </button>
          </div>

          {/* Email/Mobile Input */}
          <input
            type={loginWith === "email" ? "email" : "number"}
            className="input-field"
            placeholder={
              loginWith === "email"
                ? "admin@edmeinsurance.com"
                : "Enter mobile number"
            }
          />

          {/* Auth Type */}
          <div className="auth-type">
            <label>
              <input
                type="radio"
                checked={authMode === "password"}
                onChange={() => setAuthMode("password")}
              />
              Password
            </label>

            <label>
              <input
                type="radio"
                checked={authMode === "otp"}
                onChange={() => setAuthMode("otp")}
              />
              OTP
            </label>
          </div>

          {/* Password Field */}
          {authMode === "password" && (
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
            />
          )}

          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button className="login-btn">Sign In</button>
        </div>

        {/* FOOTER */}
        <div className="footer">
          © 2025 EDME Services Pvt Ltd.
          <div className="footer-links">
            <a href="/privacy-policy">Privacy Policy</a> |{" "}
            <a href="/terms">Terms</a> |{" "}
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
