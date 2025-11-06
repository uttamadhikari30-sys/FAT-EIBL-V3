import React from "react";
import logo from "../assets/logo.png";

export default function Login() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        fontFamily: "Arial, sans-serif",
        color: "#0047AB",
      }}
    >
      {/* ✅ Logo */}
      <img
        src={logo}
        alt="Edme Insurance Logo"
        style={{ width: "120px", height: "auto", marginBottom: "20px" }}
      />

      <h1>Welcome to FAT-EIBL</h1>
      <p>Finance Audit Tracker – Edme Insurance Brokers Limited</p>
    </div>
  );
}
