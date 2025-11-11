import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/forgot-password",
        {
          method: "POST",
          body: new URLSearchParams({ email }),
        }
      );

      const data = await response.json();
      if (response.ok && data.ok) {
        setMessage(`✅ OTP sent to ${email}. Please check your inbox.`);
      } else {
        setMessage(`❌ ${data.detail || data.error || "Email not registered."}`);
      }
    } catch {
      setMessage("⚠️ Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(180deg, #f6f9ff 0%, #e7efff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
          width: "380px",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Edme Logo"
          style={{ width: "120px", marginBottom: "20px" }}
        />
        <h2 style={{ color: "#004aad", marginBottom: "10px" }}>
          Forgot Password
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "25px",
          }}
        >
          Enter your registered email and we’ll send an OTP to reset your
          password.
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
              borderRadius: "8px",
              border: "1px solid #ccc",
              outlineColor: "#004aad",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: loading ? "#7a9be6" : "#004aad",
              color: "white",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: message.includes("✅")
                ? "green"
                : message.includes("⚠️")
                ? "#e67e22"
                : "red",
              fontSize: "14px",
              marginTop: "15px",
              lineHeight: "1.5",
            }}
          >
            {message}
          </p>
        )}

        <p
          onClick={() => (window.location.href = "/")}
          style={{
            color: "#004aad",
            marginTop: "25px",
            fontSize: "14px",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
}
