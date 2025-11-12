import React, { useState, useEffect } from "react";

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
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create new user
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
        fetchUsers();
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

  // Fetch users for admin view
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/all"
      );
      const data = await res.json();
      if (data.ok) setUsers(data.users);
    } catch (e) {
      console.error("Failed to load users", e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #f5f9ff 0%, #ffffff 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "50px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.3rem",
            color: "#004aad",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          👨‍💼 Admin Dashboard
        </h1>
        <p style={{ color: "#5f6c85", fontSize: "1rem" }}>
          Manage users, departments, and system access.
        </p>
      </div>

      {/* FORM CARD */}
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            color: "#004aad",
            fontWeight: "600",
            marginBottom: "25px",
            borderBottom: "2px solid #004aad",
            display: "inline-block",
            paddingBottom: "5px",
          }}
        >
          Create New User
        </h2>

        <form onSubmit={handleSubmit}>
          {["name", "email", "password", "department", "manager_email"].map(
            (field, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  placeholder={
                    field === "manager_email"
                      ? "Manager Email"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== "manager_email"}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #d0d7e2",
                    backgroundColor: "#f8faff",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid #004aad")
                  }
                  onBlur={(e) => (e.target.style.border = "1px solid #d0d7e2")}
                />
              </div>
            )
          )}

          <div style={{ marginBottom: "20px" }}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "10px",
                border: "1px solid #d0d7e2",
                backgroundColor: "#f8faff",
                fontSize: "1rem",
                cursor: "pointer",
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
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#003b85")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#004aad")
            }
          >
            Create User
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
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

      {/* USER LIST */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#fff",
          padding: "25px 30px",
          borderRadius: "16px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h3
          style={{
            color: "#004aad",
            marginBottom: "15px",
            borderBottom: "2px solid #004aad",
            display: "inline-block",
            paddingBottom: "4px",
          }}
        >
          Registered Users
        </h3>
        {users.length === 0 ? (
          <p style={{ color: "#7d8ba1", textAlign: "center" }}>
            No users found.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f9ff" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #e5e9f2",
                    backgroundColor: i % 2 === 0 ? "#fafbff" : "white",
                  }}
                >
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.department || "-"}</td>
                  <td style={tdStyle}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <p style={{ marginTop: "40px", color: "#7c8ca5", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Edme Insurance Brokers Ltd | Finance Audit
        Tracker
      </p>
    </div>
  );
}

const thStyle = {
  padding: "10px 15px",
  color: "#003b80",
  fontWeight: "600",
  borderBottom: "2px solid #004aad",
};

const tdStyle = {
  padding: "10px 15px",
  color: "#333",
  fontSize: "0.95rem",
};
