import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/PremiumLogin.css";

export default function OtpLogin() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend.onrender.com";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SEND OTP
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
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // VERIFY OTP
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

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      window.location.href =
        user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (e) {
      setError("Unable to verify OTP");
    }

    setLoading(false);
  };

  return (
    <div className="premium-bg">
      <div className="premium-card">
        <div className="premium-left">
          <img src={logo} className="premium-logo" />
          <h1 className="premium-title">OTP Login</h1>
          <p className="premium-sub">Quick secure login using OTP</p>

          {error && <div className="premium-error">{error}</div>}

          <form onSubmit={verifyOtp} className="premium-form">
            <input
              className="premium-input"
              type="email"
              placeholder="Enter Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            {!otpSent ? (
              <button
                className="premium-btn"
                type="button"
                onClick={sendOtp}
                disabled={loading}
              >
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

                <button
                  className="premium-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            <div className="premium-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => (window.location.href = "/")}
              >
                ← Login With Password
              </button>
            </div>
          </form>
        </div>

        <div className="premium-right">
          <h3>Secure Access</h3>
          <p>OTP expires within minutes. Check your inbox/spam.</p>
        </div>
      </div>
    </div>
  );
}
