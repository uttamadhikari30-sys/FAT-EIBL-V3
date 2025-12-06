import React from "react";
import AuthLayout from "../components/AuthLayout";
import logo from "../assets/logo.png";

const InviteUser = () => {
  return (
    <AuthLayout>
      <img src={logo} className="company-logo" alt="logo" />

      <div className="login-box">
        <h2>Invite User</h2>

        <label className="label-text">User Name</label>
        <input type="text" className="input-field" placeholder="Enter full name" />

        <label className="label-text">Email Address</label>
        <input type="email" className="input-field" placeholder="Enter user's email" />

        <button className="login-btn">Send Invite</button>

        <div className="forgot-link">
          <a href="/admin-dashboard">Back to Dashboard</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default InviteUser;
