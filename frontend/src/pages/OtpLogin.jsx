import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

export default function OtpLogin() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (!res.ok) setError(data.detail || "Unable to send OTP");
      else setOtpSent(true);
    } catch {
      setError("Server unreachable. Try again.");
    }

    setLoading(false);
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

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      window.location.href = user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch {
      setError("OTP verification failed.");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card animate">
        <img src={logo} alt="Logo" className="premium-logo-glow" />

        <h1 className="premium-title">OTP Login</h1>
        <p className="premium-sub">Quick access using One-Time Password</p>

        <form onSubmit={verifyOtp} className="premium-form">
          {error && <div className="premium-error">{error}</div>}

          <input
            className="premium-input"
            type="email"
            placeholder="Email ID"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!otpSent ? (
            <button className="premium-btn" type="button" disabled={loading} onClick={sendOtp}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                className="premium-input"
                type="text"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button className="premium-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          <div className="premium-actions">
            <span onClick={() => (window.location.href = "/")}>← Login with Password</span>
          </div>
        </form>
      </div>
    </div>
  );
}
