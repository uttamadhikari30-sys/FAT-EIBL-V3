import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: new URLSearchParams({
            email,
            otp,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Password successfully reset! Redirecting to login...");
        setTimeout(() => (window.location.href = "/"), 2500);
      } else {
        setError(data.detail || data.error || "Invalid OTP or expired link");
      }
    } catch (err) {
      setError("Unable to connect to server. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f0f6ff, #dce8ff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "340px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Edme Logo"
          style={{ width: "100px", marginBottom: "10px" }}
        />
        <h2 style={{ color: "#004aad", marginBottom: "10px" }}>
          Reset Your Password
        </h2>
        <p style={{ color: "#444", fontSize: "0.9rem", marginBottom: "20px" }}>
          Enter your email, OTP, and new password to reset access.
        </p>

        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && <p style={errorStyle}>{error}</p>}
          {message && <p style={messageStyle}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: loading ? "#7aa2f7" : "#004aad",
            }}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#004aad",
            marginTop: "15px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => (window.location.href = "/")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "0.95rem",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s ease",
};

const errorStyle = {
  color: "red",
  fontSize: "0.9rem",
  marginBottom: "10px",
};

const messageStyle = {
  color: "green",
  fontSize: "0.9rem",
  marginBottom: "10px",
};
