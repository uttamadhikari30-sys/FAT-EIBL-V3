import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

export default function OtpLogin() {
  const API = import.meta.env.VITE_API_URL;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to send OTP");
      } else {
        setOtpSent(true);
      }
    } catch (e) {
      setError("Unable to send OTP");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Invalid OTP");
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
    } catch (e) {
      setError("Failed to verify OTP");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} className="premium-logo" />

          <h1 className="premium-title">OTP Login</h1>
          <p className="premium-sub">Sign in using one-time password</p>

          {error && <div className="premium-error">{error}</div>}

          <form className="premium-form" onSubmit={verifyOtp}>
            <input
              className="premium-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!otpSent && (
              <button
                type="button"
                className="premium-btn"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send OTP"}
              </button>
            )}

            {otpSent && (
              <>
                <input
                  className="premium-input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <button className="premium-btn" disabled={loading}>
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
              </>
            )}

            <div className="premium-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/")}
              >
                Login with Password
              </button>
            </div>
          </form>
        </div>

        <div className="premium-right">
          <h3>Secure OTP</h3>
          <p>OTP is valid for a few minutes only.</p>
        </div>
      </div>
    </div>
  );
}
