import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Login function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/login",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new URLSearchParams({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid credentials");
      } else {
        alert(`Welcome ${data.user.name}!`);
        // ✅ Save user info for session
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot password redirect (no Outlook)
  const handleForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f9ff",
      }}
    >
      {/* ✅ Logo */}
      <img
        src={logo}
        alt="Company Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />

      {/* ✅ Title */}
      <h1 style={{ color: "#004aad", marginBottom: "10px" }}>
        Welcome to FAT-EIBL
      </h1>
      <p style={{ color: "#003b80", marginBottom: "30px", textAlign: "center" }}>
        Finance Audit Tracker – Edme Insurance Brokers Limited
      </p>

      {/* ✅ Login form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          width: "320px",
          textAlign: "center",
        }}
      >
        {/* Email field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          required
        />

        {/* Password field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          required
        />

        {/* Error message */}
        {error && (
          <p
            style={{
              color: "red",
              fontSize: "0.9rem",
              marginBottom: "10px",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#7a9be6" : "#004aad",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ✅ Forgot password redirect */}
        <p
          onClick={handleForgotPassword}
          style={{
            color: "#004aad",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginTop: "12px",
            textDecoration: "underline",
          }}
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
