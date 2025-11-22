// frontend/src/pages/OtpLogin.jsx
import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

export default function OtpLogin() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
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

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const msg = await stringifyError(res);
        setError(msg || "Failed to send OTP");
      } else {
        setOtpSent(true);
      }
    } catch (e) {
      setError("Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const msg = await stringifyError(res);
        setError(msg || "Invalid OTP");
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
    } catch (e) {
      setError("Unable to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} alt="Logo" className="premium-logo" />
          <h1 className="premium-title">OTP Login</h1>
          <p className="premium-sub">Quick access using a one-time password</p>

          <form onSubmit={verifyOtp} className="premium-form">
            {error && <div className="premium-error">{error}</div>}

            <input className="premium-input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />

            {!otpSent ? (
              <button className="premium-btn" type="button" onClick={sendOtp} disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
            ) : (
              <>
                <input className="premium-input" type="text" placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} required />
                <button className="premium-btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
              </>
            )}

            <div className="premium-actions">
              <button type="button" className="link-btn" onClick={()=>window.location.href="/"}>Login with Password</button>
            </div>
          </form>
        </div>

        <div className="premium-right" aria-hidden>
          <div className="promo">
            <h3>Fast & Secure</h3>
            <p>OTP sent to your registered email. Expires quickly for safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
