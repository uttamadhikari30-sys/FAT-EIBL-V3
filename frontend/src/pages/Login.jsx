import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
  const [useOtp, setUseOtp] = useState(false);

  return (
    <div className="login-root">
      {/* LEFT PANEL */}
      <div className="login-left">
        <img
          src="/assets/audit-3d.png"
          alt="Audit Illustration"
          className="login-hero-image"
        />

        <h1 className="login-title">
          Digitally Streamline the Audit Process
        </h1>

        <p className="login-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-right-inner">
          <img
            src="/assets/edme-logo.png"
            alt="Edme Logo"
            className="login-logo"
          />

          <div className="login-card">
            <h2 className="login-heading">Sign in to your account</h2>

            {/* Email / Mobile tabs (optional) */}
            <div className="login-tabs">
              <button className="login-tab active">Email</button>
              <button className="login-tab">Mobile</button>
            </div>

            {/* Email input */}
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="admin@edmeinsurance.com"
            />

            {/* Password / OTP toggle */}
            <div className="login-toggle-row">
              <span className={!useOtp ? "toggle-label active" : "toggle-label"}>
                Password
              </span>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={useOtp}
                  onChange={() => setUseOtp(!useOtp)}
                />
                <span className="toggle-slider" />
              </label>

              <span className={useOtp ? "toggle-label active" : "toggle-label"}>
                OTP
              </span>
            </div>

            {/* Password / OTP field */}
            <label className="login-label">
              {useOtp ? "Enter OTP" : "Password"}
            </label>
            <input
              type={useOtp ? "text" : "password"}
              className="login-input"
              placeholder={useOtp ? "Enter 6-digit OTP" : "********"}
            />

            {/* Forgot password */}
            <div className="login-forgot-row">
              <button className="forgot-link" type="button">
                Forgot Password?
              </button>
            </div>

            {/* Sign In button */}
            <button className="login-button" type="button">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
