import React from "react";
import AuthLayout from "../components/AuthLayout";
import logo from "../assets/logo.png";

const AcceptInvite = () => {
  return (
    <AuthLayout>
      <img src={logo} className="company-logo" alt="logo" />

      <div className="login-box">
        <h2>Accept Invitation</h2>

        <label className="label-text">Create Password</label>
        <input type="password" className="input-field" placeholder="Enter password" />

        <label className="label-text">Confirm Password</label>
        <input type="password" className="input-field" placeholder="Confirm password" />

        <button className="login-btn">Activate Account</button>

        <div className="forgot-link">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AcceptInvite;
