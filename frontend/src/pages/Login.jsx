// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Login.css";

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({ email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        // show server message if present, else fallback
        setError(payload.detail || payload.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // backend returns user inside payload.user (per backend code)
      const user = payload.user || payload;

      // persist user minimally
      localStorage.setItem("user", JSON.stringify(user));

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      window.location.href = user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Unable to connect to server. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="auth-wrap">
        <div className="auth-left">
          <div className="logo-wrap">
            <img src={logo} alt="Edme Logo" className="logo-img" />
          </div>
          <h1 className="auth-title">FAT - Edme Insurance Brokers</h1>
          <p className="auth-sub">Finance Audit Tracker — secure access</p>

          <div className="feature-list">
            <div>• Audit tasks & tracking</div>
            <div>• Role-based dashboards</div>
            <div>• Secure OTP & password login</div>
          </div>

          <div className="decorative-cards">
            <div className="card small-card" />
            <div className="card large-card" />
          </div>
        </div>

        <div className="auth-card">
          <form className="form-inner" onSubmit={handleSubmit}>
            <h2 className="form-title">Sign in</h2>
            <p className="form-sub">Welcome back — please sign in to continue</p>

            {error && <div className="alert error">{String(error)}</div>}

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                autoComplete="username"
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                autoComplete="current-password"
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button className="btn primary-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="form-links">
              <button
                type="button"
                className="link-button"
                onClick={() => (window.location.href = "/otp-login")}
              >
                Sign in with OTP
              </button>

              <button
                type="button"
                className="link-button"
                onClick={() => (window.location.href = "/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <div className="footer-note">Admin: admin@edmeinsurance.com — PW: Edme@123 (for testing)</div>
          </form>
        </div>
      </div>

      {/* subtle floating particles */}
      <div className="bg-particles" />
    </div>
  );
}
