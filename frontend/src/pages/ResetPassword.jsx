import React from "react";
import AuthLayout from "../components/AuthLayout";
import "./FormPage.css";

const ResetPassword = () => {
  return (
    <AuthLayout>
      <div className="form-box">
        <h2>Reset Password</h2>

        <input type="password" className="input-field" placeholder="New Password" />
        <input type="password" className="input-field" placeholder="Confirm Password" />

        <button className="login-btn">Reset Password</button>

        <div className="back-link">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
