import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";
import audit from "../assets/audit-illustration.png";
import axios from "axios";

const BASE_URL = "https://fat-eibl-backend-x1sp.onrender.com";

const Login = () => {
  const [loginWith, setLoginWith] = useState("email"); // email | mobile
  const [authMode, setAuthMode] = useState("password"); // password | otp

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // -------------------------
  // SEND OTP
  // -------------------------
  const handleSendOtp = async () => {
    setErrorMsg("");

    if (!emailOrMobile) {
      setErrorMsg("Please enter email or mobile first");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/auth/generate-otp`, {
        email: loginWith === "email" ? emailOrMobile : undefined,
        mobile: loginWith === "mobile" ? emailOrMobile : undefined,
      });

      setOtpSent(true);
      alert("OTP sent successfully");
    } catch (error) {
      setErrorMsg("Failed to send OTP");
    }
  };

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      let payload = {};

      if (loginWith === "email") payload.email = emailOrMobile;
      if (loginWith === "mobile") payload.mobile = emailOrMobile;

      if (authMode === "password") {
        payload.password = password;
      } else {
        payload.otp = otp;
      }

      const url =
        authMode === "password" ? "/auth/login" : "/auth/login-otp";

      const res = await axios.post(`${BASE_URL}${url}`, payload);

      // ✅ TOKEN (backend uses access_token)
      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/dashboard"; // change if needed
      } else {
        setErrorMsg("Login failed. Token not received.");
      }
    } catch (error) {
      setErrorMsg("Invalid email / password / OTP");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* LEFT */}
      <div className="left-section">
        <h1 className="main-heading">
          Digitally Streamline the Audit Process
        </h1>
        <p className="sub-heading">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img src={audit} alt="Audit Illustration" className="audit-image" />
      </div>

      {/* RIGHT */}
      <div className="right-section">
        <img src={logo} alt="EDME Logo" className="company-logo" />

        <div className="login-box">
          <h2 className="signin-heading">Sign in to your account</h2>

          {/* EMAIL / MOBILE */}
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
            type={loginWith === "email" ? "email" : "text"}
            className="input-field"
            placeholder={
              loginWith === "email"
                ? "admin@edmeinsurance.com"
                : "Enter mobile number"
            }
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />

          {/* PASSWORD / OTP TOGGLE */}
          <div className="auth-type">
            <label>
              <input
                type="radio"
                checked={authMode === "password"}
                onChange={() => {
                  setAuthMode("password");
                  setOtpSent(false);
                }}
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

          {/* PASSWORD */}
          {authMode === "password" && (
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {/* OTP */}
          {authMode === "otp" && (
            <>
              <input
                type="text"
                className="input-field"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {!otpSent && (
                <button className="otp-btn" onClick={handleSendOtp}>
                  Send OTP
                </button>
              )}
            </>
          )}

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          © 2025 Edme Insurance Brokers Limited.
        </div>
        <div className="footer-right">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms">Terms</a>
          <span>|</span>
          <a href="/contact-support">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
