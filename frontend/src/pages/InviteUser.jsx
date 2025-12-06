import React from "react";
import AuthLayout from "../components/AuthLayout";
import "./FormPage.css";

const InviteUser = () => {
  return (
    <AuthLayout>
      <div className="form-box">
        <h2>Invite User</h2>

        <input type="email" className="input-field" placeholder="Enter user email" />

        <button className="login-btn">Send Invite</button>

        <div className="back-link">
          <a href="/admin-dashboard">Back to Dashboard</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default InviteUser;
