import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css";

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
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      const data = await res.json();
      if (!res.ok) setError(data.detail);
      else setOtpSent(true);
    } catch {
      setError("Cannot send OTP. Try again.");
    }

    setLoading(false);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail);
        setLoading(false);
        return;
      }

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href =
        user.first_login
          ? `/reset-password?user_id=${user.id}`
          : user.role === "admin"
          ? "/admin-dashboard"
          : "/dashboard";
    } catch {
      setError("Unable to verify OTP");
    }

    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-box animate-fade">
        <img src={logo} alt="logo" className="login-logo" />

        <h2 className="login-title">OTP Login</h2>

        {error && <p className="error-msg">{error}</p>}

        {!otpSent && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp} className="btn-login">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {otpSent && (
          <form onSubmit={verifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input-box"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p onClick={() => (window.location.href = "/")} className="link">
          Login with Password
        </p>
      </div>
    </div>
  );
}
