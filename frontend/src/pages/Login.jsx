import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

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
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid email or password");
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
    } catch (e) {
      setError("Server unreachable. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} alt="Edme Logo" className="premium-logo" />

          <h1 className="premium-title">Welcome Back</h1>
          <p className="premium-sub">Login to FAT-EIBL secure portal</p>

          <form className="premium-form" onSubmit={handleSubmit}>
            {error && <div className="premium-error">{error}</div>}

            <input
              className="premium-input"
              type="email"
              placeholder="Enter email"
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

            <button className="premium-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="premium-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/otp-login")}
              >
                Login using OTP →
              </button>

              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        <div className="premium-right">
          <div className="promo">
            <h3>Finance Audit Tracker</h3>
            <p>
              Track, verify and audit operations securely using Edme’s official
              FAT-EIBL system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
