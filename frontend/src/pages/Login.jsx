// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css"; // assume you created this

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stringifyError = async (res) => {
    try {
      const body = await res.json();
      if (body && body.detail) return String(body.detail);
      return JSON.stringify(body);
    } catch {
      return `${res.status} ${res.statusText || ""}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await stringifyError(res);
        setError(msg || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }
      window.location.href = user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} alt="Edme logo" className="premium-logo" />
          <h1 className="premium-title">Welcome back</h1>
          <p className="premium-sub">Sign in to continue to FAT-EIBL</p>

          <form className="premium-form" onSubmit={handleSubmit}>
            {error && <div className="premium-error">{error}</div>}

            <input className="premium-input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <input className="premium-input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

            <button className="premium-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="premium-actions">
              <button type="button" className="link-btn" onClick={()=> window.location.href="/otp-login"}>Use OTP</button>
              <button type="button" className="link-btn" onClick={()=> window.location.href="/forgot-password"}>Forgot password?</button>
            </div>
          </form>
        </div>

        <div className="premium-right" aria-hidden>
          <div className="promo">
            <h3>Secure Access</h3>
            <p>Two ways to login — Password or OTP. Safe & fast.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
