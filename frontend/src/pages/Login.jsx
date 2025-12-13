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

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const BASE_URL = "https://fat-eibl-backend-x1sp.onrender.com";

  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        email: loginWith === "email" ? emailOrMobile : undefined,
        mobile: loginWith === "mobile" ? emailOrMobile : undefined,
        password: password,
      };

      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        payload
      );

      // ✅ BACKEND RETURNS access_token
      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);

        // ✅ Redirect to Admin Dashboard
        window.location.href = "/admin-dashboard";
      } else {
        setErrorMsg("Login failed. Token not received.");
      }
    } catch (error) {
      setErrorMsg("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">

      {/* LEFT SECTION */}
      <div className="left-section">
        <h1 className="main-heading">
          Digitally Streamline the Audit Process
        </h1>
        <p className="sub-heading">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img
          src={audit}
          alt="Audit Illustration"
          className="audit-image"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <img
          src={logo}
          alt="Company Logo"
          className="company-logo"
        />

        <div className="login-box">
          <h2 className="signin-heading">
            Sign in to your account
          </h2>

          {/* LOGIN TYPE */}
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
            placeholder={
              loginWith === "email"
                ? "admin@edmeinsurance.com"
                : "Enter mobile number"
            }
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="auth-type">
            <label>
              <input type="radio" checked readOnly />
              Password
            </label>
          </div>

          <input
            type="password"
            className="input-field"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <p className="error-msg">{errorMsg}</p>
          )}

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
