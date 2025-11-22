import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Login.css";

  export default function OtpLogin() { ... }
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to send OTP");
      } else {
        setOtpSent(true);
      }
    } catch (e) {
      setError("Unable to send OTP. Try again later.");
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Invalid OTP");
        setLoading(false);
        return;
      }
      const user = data.user || data;
      localStorage.setItem("user", JSON.stringify(user));
      if (user?.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }
      window.location.href = user?.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (e) {
      setError("Unable to verify OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} alt="Edme Logo" className="premium-logo" />
          <h1 className="premium-title">OTP Login</h1>
          <p className="premium-sub">Quick access via one-time-password</p>

          <form className="premium-form" onSubmit={verifyOtp}>
            {error && <div className="premium-error">{error}</div>}

            <input
              className="premium-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            {!otpSent ? (
              <button className="premium-btn" type="button" onClick={sendOtp} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  className="premium-input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="premium-btn" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            <div className="premium-actions">
              <button type="button" className="link-btn" onClick={() => (window.location.href = "/")}>
                Login with Password
              </button>
            </div>
          </form>
        </div>

        <div className="premium-right" aria-hidden>
          <div className="promo">
            <h3>OTP Security</h3>
            <p>OTP expires quickly for secure logins. Check your inbox/spam.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
