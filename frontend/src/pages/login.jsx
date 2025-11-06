import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Replace these with your admin credentials
    if (email === "Uttam.singh@edmeinsurance.com" && password === "123") {
      localStorage.setItem("user", email);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        background: "linear-gradient(to right, #f7faff, #eaf2ff)",
      }}
    >
      <img src="/logo.png" alt="logo" style={{ height: 70, marginBottom: 20 }} />
      <h2 style={{ color: "#004aad" }}>Welcome to FAT-EIBL</h2>
      <p style={{ marginBottom: 20, color: "#555" }}>
        Finance Audit Tracker – Edme Insurance Brokers Limited
      </p>
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minWidth: 300,
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
