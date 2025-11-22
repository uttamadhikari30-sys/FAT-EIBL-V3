import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

export default function OtpLogin() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend-x1sp.onrender.com";

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
      setError("Unable to send OTP. Server offline.");
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

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href =
        user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (e) {
      setError("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} alt="Logo" className="premium-logo" />
          <h1 className="premium-title">OTP Login</h1>

          {error && <div className="premium-error">{error}</div>}

          {!otpSent ? (
            <>
              <input
                className="premium-input"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="premium-btn" onClick={sendOtp}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <form className="premium-form" onSubmit={verifyOtp}>
              <input
                className="premium-input"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button className="premium-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
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
        </div>

        <div className="premium-right" aria-hidden>
          <h3>OTP Security</h3>
          <p>Fast, secure, and reliable login via one-time-password.</p>
        </div>
      </div>
    </div>
  );
}
