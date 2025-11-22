import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

export default function Login() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      window.location.href =
        user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} className="premium-logo" alt="Logo" />
          <h1 className="premium-title">Welcome back</h1>
          <p className="premium-sub">Sign in to continue to FAT-EIBL</p>

          {error && <div className="premium-error">{error}</div>}

          <form className="premium-form" onSubmit={handleLogin}>
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
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="premium-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="premium-actions">
            <button
              className="link-btn"
              onClick={() => (window.location.href = "/otp-login")}
            >
              Use OTP
            </button>

            <button
              className="link-btn"
              onClick={() => (window.location.href = "/forgot-password")}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="premium-right">
          <h3>Secure Access</h3>
          <p>Industry-grade encryption & audit-ready protection.</p>
        </div>
      </div>
    </div>
  );
}
