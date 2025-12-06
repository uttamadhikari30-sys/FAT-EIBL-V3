import React from "react";
import AuthLayout from "../components/AuthLayout";
import "./FormPage.css";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <div className="form-box">
        <h2>Forgot Password</h2>

        <p className="form-text">
          Enter your registered email. We will send a reset link or OTP.
        </p>

        <input type="email" className="input-field" placeholder="Email address" />

        <button className="login-btn">Send Reset Link</button>

        <div className="back-link">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
