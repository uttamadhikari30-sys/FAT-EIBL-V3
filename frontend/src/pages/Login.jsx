import React, { useState } from "react";
import "../styles/PremiumLogin.css";
import logo from "../assets/logo.png";

export default function Login() {
  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Invalid login");
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
      setError("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} className="premium-logo" />

          <h1 className="premium-title">Welcome Back</h1>
          <p className="premium-sub">Login to FAT-EIBL</p>

          {error && <div className="premium-error">{error}</div>}

          <form className="premium-form" onSubmit={handleLogin}>
            <input
              className="premium-input"
              type="email"
              placeholder="admin@edmeinsurance.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="premium-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="premium-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="premium-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/otp-login")}
              >
                Login with OTP
              </button>
            </div>
          </form>
        </div>

        <div className="premium-right">
          <h3>Secure Access</h3>
          <p>Industry-grade encryption for your login session.</p>
        </div>
      </div>
    </div>
  );
}
