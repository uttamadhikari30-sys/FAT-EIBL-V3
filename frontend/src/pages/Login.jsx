// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import "../styles/PremiumLogin.css";
import logo from "../assets/logo.png";

export default function Login() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.first_login) {
        window.location.href = `/reset-password?user_id=${data.user.id}`;
        return;
      }

      window.location.href =
        data.user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Failed to connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} className="premium-logo" alt="Edme Logo" />

          <h1 className="premium-title">Welcome back</h1>
          <p className="premium-sub">Sign in to continue to FAT-EIBL</p>

          {error && <div className="premium-error">{error}</div>}

          <form onSubmit={handleLogin} className="premium-form">
            <input
              className="premium-input"
              type="email"
              placeholder="admin@edmeinsurance.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="premium-input"
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="premium-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="premium-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/otp-login")}
              >
                Use OTP
              </button>

              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>

        <div className="premium-right">
          <h3>Secure Access</h3>
          <p>Industry-grade encryption & audit-ready protection.</p>
        </div>
      </div>
    </div>
  );
}
