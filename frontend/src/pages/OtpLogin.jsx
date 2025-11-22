import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css";

export default function OtpLogin() {
  const API = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // SEND OTP
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
        setError(data.detail || "Unable to send OTP");
      } else {
        setOtpSent(true);
      }
    } catch {
      setError("Server error. Try again.");
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

      window.location.href =
        user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch {
      setError("Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <form className="login-card" onSubmit={verifyOtp}>
        <img src={logo} className="login-logo" />

        <h2>OTP Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!otpSent && (
          <button type="button" onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <p
          className="switch-link"
          onClick={() => (window.location.href = "/")}
        >
          Login with Password
        </p>
      </form>
    </div>
  );
}
