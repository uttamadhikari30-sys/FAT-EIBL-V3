import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";
import audit from "../assets/audit-illustration.png";

const Login = () => {
  const [loginWith, setLoginWith] = useState("email");
  const [authMode, setAuthMode] = useState("password");

  return (
    <>
      <div className="login-wrapper">

        {/* LEFT SECTION */}
        <div className="left-section">
          <h1 className="main-heading">
            Digitally Streamline the Audit Process
          </h1>

          <p className="sub-heading">
            Ensure accuracy, transparency, and effortless compliance.
          </p>

          <img src={audit} alt="Audit Illustration" className="audit-image" />
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <img src={logo} alt="Company Logo" className="company-logo" />

          <div className="login-box">
            <h2 className="login-title">Sign in to your account</h2>

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

            {/* Email / Mobile Input */}
            <input
              type={loginWith === "email" ? "email" : "number"}
              className="input-field"
              placeholder={
                loginWith === "email"
                  ? "admin@edmeinsurance.com"
                  : "Enter mobile number"
              }
            />

            {/* Auth Mode */}
            <div className="auth-type">
              <label>
                <input
                  type="radio"
                  checked={authMode === "password"}
                  onChange={() => setAuthMode("password")}
                />
                Password
              </label>

              <label style={{ marginLeft: "20px" }}>
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
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="footer-bar">
        <span className="footer-bar-left">
          © 2025 EDME Services Pvt Ltd.
        </span>

        <span className="footer-bar-right">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms</a>
          <a href="/contact-support">Contact Support</a>
        </span>
      </div>
    </>
  );
};

export default Login;
