import React from "react";
import AuthLayout from "../components/AuthLayout";
import "./FormPage.css";

const AcceptInvite = () => {
  return (
    <AuthLayout>
      <div className="form-box">
        <h2>Accept Invitation</h2>

        <p className="form-text">Create your password to activate your account.</p>

        <input type="password" className="input-field" placeholder="Create Password" />
        <input type="password" className="input-field" placeholder="Confirm Password" />

        <button className="login-btn">Activate Account</button>

        <div className="back-link">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AcceptInvite;
