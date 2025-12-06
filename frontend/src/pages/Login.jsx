import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import logo from "../assets/logo.png";

const Login = () => {
  const [loginWith, setLoginWith] = useState("email");
  const [authMode, setAuthMode] = useState("password");

  return (
    <AuthLayout>
      <img src={logo} className="company-logo" alt="logo" />

      <div className="login-box">
        <h2>Sign in to your account</h2>

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

        <input
          type={loginWith === "email" ? "email" : "number"}
          className="input-field"
          placeholder={
            loginWith === "email" ? "admin@edmeinsurance.com" : "Enter mobile number"
          }
        />

        <div className="auth-type">
          <label>
            <input
              type="radio"
              checked={authMode === "password"}
              onChange={() => setAuthMode("password")}
            />
            Password
          </label>

          <label>
            <input
              type="radio"
              checked={authMode === "otp"}
              onChange={() => setAuthMode("otp")}
            />
            OTP
          </label>
        </div>

        {authMode === "password" && (
          <input type="password" className="input-field" placeholder="Enter password" />
        )}

        <div className="forgot-link">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button className="login-btn">Sign In</button>
      </div>
    </AuthLayout>
  );
};

export default Login;
