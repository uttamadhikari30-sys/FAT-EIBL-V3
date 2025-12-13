import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";
import audit from "../assets/audit-illustration.png";
import axios from "axios";

const Login = () => {
  const [loginWith, setLoginWith] = useState("email");
  const [authMode, setAuthMode] = useState("password");

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const BASE_URL = "https://fat-eibl-backend-x1sp.onrender.com";

  // -----------------------------
  // LOGIN FUNCTION
  // -----------------------------
  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      let payload = {};
      let url = "";

      // EMAIL or MOBILE
      if (loginWith === "email") payload.email = emailOrMobile;
      if (loginWith === "mobile") payload.mobile = emailOrMobile;

      // PASSWORD LOGIN
      if (authMode === "password") {
        payload.password = password;
        url = "/auth/login";
      }

      // OTP LOGIN
      if (authMode === "otp") {
        payload.otp = otp;
        url = "/auth/login-otp";
      }

      const res = await axios.post(BASE_URL + url, payload);

      if (res.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setErrorMsg("Invalid login credentials");
    }

    setLoading(false);
  };

  // -----------------------------
  // SEND OTP
  // -----------------------------
  const handleSendOtp = async () => {
    setErrorMsg("");
    if (!emailOrMobile) {
      setErrorMsg("Enter email/mobile first.");
      return;
    }

    try {
      await axios.post(BASE_URL + "/auth/generate-otp", {
        email: loginWith === "email" ? emailOrMobile : undefined,
        mobile: loginWith === "mobile" ? emailOrMobile : undefined,
      });

      alert("OTP sent successfully!");
    } catch (err) {
      setErrorMsg("Failed to send OTP.");
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SECTION */}
      <div className="left-section">
        <h1 className="main-heading">Digitally Streamline the Audit Process</h1>
        <p className="sub-heading">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img src={audit} alt="Audit Illustration" className="audit-image" />
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <img src={logo} alt="Company Logo" className="company-logo" />

        <div className="login-box">
          <h2 className="signin-heading">Sign in to your account</h2>

          {/* TAB BUTTONS */}
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

          {/* EMAIL / MOBILE INPUT */}
          <input
            type={loginWith === "email" ? "email" : "number"}
            className="input-field"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            placeholder={
              loginWith === "email"
                ? "admin@edmeinsurance.com"
                : "Enter mobile number"
            }
          />

          {/* PASSWORD / OTP */}
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

          {/* PASSWORD FIELD */}
          {authMode === "password" && (
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          )}

          {/* OTP FIELD */}
          {authMode === "otp" && (
            <>
              <input
                type="text"
                className="input-field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />

              <button className="otp-btn" onClick={handleSendOtp}>
                Send OTP
              </button>
            </>
          )}

          {/* ERROR MESSAGE */}
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {/* FORGOT PASSWORD */}
          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          {/* LOGIN BUTTON */}
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
