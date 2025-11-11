import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ OTP sent to ${email}. Please check your inbox.`);
        // Optionally redirect to reset page:
        // setTimeout(() => (window.location.href = "/reset-password"), 2000);
      } else {
        setError(data.detail || "Email not found");
      }
    } catch {
      setError("⚠️ Unable to connect to server. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f4f8ff, #dce8ff)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px 35px",
          borderRadius: "16px",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.08)",
          width: "360px",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Edme Logo"
          style={{ width: "120px", marginBottom: "15px" }}
        />

        <h2
          style={{
            color: "#004aad",
            fontSize: "1.6rem",
            marginBottom: "10px",
            fontWeight: 600,
          }}
        >
          Forgot Password
        </h2>

        <p
          style={{
            color: "#555",
            fontSize: "0.9rem",
            marginBottom: "25px",
          }}
        >
          Enter your registered email address to receive an OTP for password
          reset.
        </p>

        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "0.95rem",
              textAlign: "center",
            }}
          />

          {error && (
            <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "10px" }}>
              {error}
            </p>
          )}
          {message && (
            <p
              style={{
                color: "green",
                fontSize: "0.9rem",
                marginBottom: "10px",
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#7aa2f7" : "#004aad",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "0.3s",
            }}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p
          style={{
            color: "#004aad",
            fontSize: "0.9rem",
            marginTop: "20px",
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
