import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Login.css"; // use central styles folder

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
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
        setError(data.detail || data.message || "Invalid credentials");
        setLoading(false);
        return;
      }
      // data.user expected from backend auth.login
      const user = data.user || data;
      localStorage.setItem("user", JSON.stringify(user));
      // redirect handling
      if (user?.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }
      window.location.href = user?.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Unable to reach server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} alt="Edme Logo" className="premium-logo" />
          <h1 className="premium-title">FAT • EIBL</h1>
          <p className="premium-sub">Finance Audit Tracker — Edme Insurance Brokers</p>
          <form className="premium-form" onSubmit={submit} noValidate>
            {error && <div className="premium-error">{error}</div>}
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
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="premium-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/otp-login")}
              >
                Login with OTP
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
          <div className="promo">
            <h3>Secure • Fast • Audit-ready</h3>
            <p>Secure login, single sign-on ready. Track audit tasks and performance easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
