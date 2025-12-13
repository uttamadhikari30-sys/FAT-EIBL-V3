import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";
import audit from "../assets/audit-illustration.png";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://fat-eibl-backend-x1sp.onrender.com";

  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/admin-dashboard";
      } else {
        setErrorMsg("Login failed");
      }
    } catch {
      setErrorMsg("Invalid email or password");
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

        <img src={audit} className="audit-image" alt="Audit" />
      </div>

      {/* RIGHT */}
      <div className="right-section">
        <img src={logo} className="company-logo" alt="EDME" />

        <div className="login-box">
          <h2 className="signin-heading">Sign in to your account</h2>

          <input
            className="input-field"
            placeholder="admin@edmeinsurance.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="input-field"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
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
