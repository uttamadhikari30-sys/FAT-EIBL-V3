import React from "react";
import AuthLayout from "../components/AuthLayout";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <img src={logo} className="company-logo" alt="logo" />

      <div className="login-box">
        <h2>Forgot Password</h2>

        <label className="label-text">Enter your registered email</label>

        <input
          type="email"
          className="input-field"
          placeholder="admin@edmeinsurance.com"
        />

        <p className="subtitle-small">
          We'll send a link or OTP to your email to reset the password.
        </p>

        <button className="login-btn">Send Reset Link</button>

        <div className="forgot-link">
          <a href="/">Back to Sign In</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
