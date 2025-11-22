import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css";

export default function Login() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Construct user object
      const user = {
        id: data.user_id,
        role: data.role,
        first_login: data.first_login,
        email,
      };

      localStorage.setItem("user", JSON.stringify(user));

      // First login → redirect
      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      // Redirect by role
      if (user.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Unable to connect to server. Try again later.");
    } finally {
      setLoading(false);
    }
  };

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
      {/* Logo */}
      <img
        src={logo}
        alt="Company Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />

      <h1 style={{ color: "#004aad", marginBottom: "10px" }}>
        Welcome to FAT-EIBL
      </h1>
      <p style={{ color: "#003b80", marginBottom: "30px", textAlign: "center" }}>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}

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
