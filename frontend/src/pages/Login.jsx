import React, { useState } from "react";
import "../styles/PremiumLogin.css";
import logo from "../assets/logo.png";

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("admin@edmeinsurance.com"); // default for quick test
  const [password, setPassword] = useState("Edme@123");         // default for quick test
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

      // If backend returns non-json body at 500 it will throw — handle generically
      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (!response.ok) {
        setError(data.detail || data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user?.first_login) {
        window.location.href = `/reset-password?user_id=${data.user.id}`;
        return;
      }
      window.location.href = data.user?.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} className="premium-logo" alt="Edme logo" />

          <h1 className="premium-title">Welcome back</h1>
          <p className="premium-sub">Sign in to continue to FAT-EIBL</p>

          {error && <div className="premium-error" role="alert">{error}</div>}

          <form onSubmit={handleLogin} className="premium-form">
            <input
              className="premium-input"
              type="email"
              placeholder="Email"
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

        <div className="premium-right" aria-hidden>
          <h3>Secure Access</h3>
          <p>Industry-grade encryption & audit-ready protection.</p>
        </div>
      </div>
    </div>
  );
}
