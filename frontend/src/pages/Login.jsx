import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ TEMP ADMIN LOGIN (for testing)
  const ADMIN_ID = "admin@edmeinsurance.com";
  const ADMIN_PASS = "Admin@123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Step 1: Local hardcoded admin check (for testing)
    if (username === ADMIN_ID && password === ADMIN_PASS) {
      alert("Admin login successful!");
      localStorage.setItem("role", "admin");
      window.location.href = "/dashboard";
      setLoading(false);
      return;
    }

    // ✅ Step 2: (optional) Try backend login if not admin
    try {
      const response = await fetch(
        "https://fat-eibl-backend.onrender.com/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/user-dashboard";
        }
      } else {
        alert(data.detail || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot Password feature coming soon. Please contact Admin.");
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
      <img
        src={logo}
        alt="Company Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />
      <h1 style={{ color: "#004aad" }}>Welcome to FAT-EIBL</h1>
      <p style={{ color: "#003b80", marginBottom: "30px" }}>
        Finance Audit Tracker – Edme Insurance Brokers Limited
      </p>

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
        <input
          type="text"
          placeholder="Enter Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          required
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#004aad",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={handleForgotPassword}
          style={{
            color: "#004aad",
            marginTop: "15px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
