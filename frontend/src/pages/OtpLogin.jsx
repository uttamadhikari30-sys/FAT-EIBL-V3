import React from "react";
import AuthLayout from "../components/AuthLayout";
import "./FormPage.css";

const OtpLogin = () => {
  return (
    <AuthLayout>
      <div className="form-box">
        <h2>OTP Login</h2>

        <input type="number" className="input-field" placeholder="Enter mobile number" />

        <button className="login-btn">Send OTP</button>

        <div className="back-link">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OtpLogin;
