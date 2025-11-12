import React, { useState } from "react";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    manager_email: "",
    role: "auditee",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Creating user...");
    try {
      const res = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/",
        {
          method: "POST",
          body: new URLSearchParams(formData),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setMessage("✅ User created successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          department: "",
          manager_email: "",
          role: "auditee",
        });
      } else {
        setMessage(`❌ ${data.detail || data.error || "Failed to create user"}`);
      }
    } catch (err) {
      setMessage("⚠️ Network error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f7faff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#004aad", fontSize: "2rem", fontWeight: 700 }}>
          👨‍💼 Admin Dashboard
        </h1>
        <p style={{ color: "#5a6a85", fontSize: "1rem" }}>
          Manage users and assign departments efficiently.
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: "white",
          padding: "40px 30px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "550px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "0.3s ease-in-out",
        }}
      >
        <h2
          style={{
            color: "#004aad",
            marginBottom: "25px",
            fontSize: "1.3rem",
            borderBottom: "2px solid #004aad",
            display: "inline-block",
            paddingBottom: "5px",
          }}
        >
          Create New User
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              name="manager_email"
              placeholder="Manager Email"
              value={formData.manager_email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                ...inputStyle,
                cursor: "pointer",
                backgroundColor: "#fff",
              }}
            >
              <option value="auditee">Auditee</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#004aad",
              color: "white",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#003b85")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#004aad")}
          >
            Create User
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: message.startsWith("✅")
                ? "green"
                : message.startsWith("⚠️")
                ? "#c27b00"
                : "red",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Footer */}
      <p style={{ marginTop: "40px", color: "#7c8ca5", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Edme Insurance Brokers Ltd | Finance Audit Tracker
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "1rem",
  transition: "border 0.3s ease",
};
