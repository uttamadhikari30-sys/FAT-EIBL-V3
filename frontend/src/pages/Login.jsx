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

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      let payload = {};
      let url = "";

      if (loginWith === "email") payload.email = emailOrMobile;
      if (loginWith === "mobile") payload.mobile = emailOrMobile;

      if (authMode === "password") {
        payload.password = password;
        url = "/auth/login";
      }

      if (authMode === "otp") {
        payload.otp = otp;
        url = "/auth/login-otp";
      }

      const res = await axios.post(BASE_URL + url, payload);

      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/dashboard";
      } else {
        setErrorMsg("Login failed. Token not received.");
      }
    } catch (err) {
      setErrorMsg("Invalid email or password");
    }

    setLoading(false);
  };

  // ---------------- SEND OTP ----------------
  const handleSendOtp = async () => {
    setErrorMsg("");
    try {
      await axios.post(BASE_URL + "/auth/generate-otp", {
        email: loginWith === "email" ? emailOrMobile : undefined,
        mobile: loginWith === "mobile" ? emailOrMobile : undefined,
      });
      alert("OTP sent successfully");
    } catch {
      setErrorMsg("Failed to send OTP");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT */}
      <div className="left-section">
        <h1 className="main-heading">Digitally Streamline the Audit Process</h1>
        <p className="sub-heading">
          Ensure accuracy, transparency, and effortless compliance.
        </p>
        <img src={audit} alt="Audit" className="audit-image" />
      </div>

      {/* RIGHT */}
      <div className="right-section">
        <img src={logo} alt="Logo" className="company-logo" />

        <div className="login-box">
          <h2 className="signin-heading">Sign in to your account</h2>

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
            className="input-field"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            placeholder="admin@edmeinsurance.com"
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
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          )}

          {authMode === "otp" && (
            <>
              <input
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

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div>© 2025 Edme Insurance Brokers Limited.</div>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy</a> |
          <a href="/terms"> Terms</a> |
          <a href="/contact-support"> Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
