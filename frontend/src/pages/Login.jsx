import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";
import audit from "../assets/audit-illustration.png";

const Login = () => {
  const [loginWith, setLoginWith] = useState("email");
  const [authMode, setAuthMode] = useState("password");

  return (
    <div className="login-wrapper">

      {/* LEFT SECTION */}
      <div className="left-section">
        <h1 className="title">Digitally Streamline the Audit Process</h1>
        <p className="subtitle">Ensure accuracy, transparency, and effortless compliance.</p>

        <img src={audit} alt="Audit Illustration" className="audit-img" />
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <img src={logo} alt="Logo" className="company-logo" />

        <div className="login-box">
          <h2 className="signin-title">Sign in to your account</h2>

          <div className="tab-buttons">
            <button
              className={loginWith === "email" ? "active" : ""}
              onClick={() => setLoginWith("email")}
            >
              Email
            </button>
            <button
              className={loginWith === "mobile" ? "active" : ""}
              onClick={() => setLoginWith("mobile")}
            >
              Mobile
            </button>
          </div>

          {/* Email / Mobile Field */}
          <input
            type={loginWith === "email" ? "email" : "number"}
            className="input-field"
            placeholder={
              loginWith === "email"
                ? "admin@edmeinsurance.com"
                : "Enter mobile number"
            }
          />

          {/* Password or OTP */}
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

          {authMode === "password" && (
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
            />
          )}

          {/* Forgot Password */}
          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button className="login-btn">Sign In</button>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2025 EDME Services Pvt Ltd.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms</a>
            <span>|</span>
            <a href="#">Contact Us</a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Login;
