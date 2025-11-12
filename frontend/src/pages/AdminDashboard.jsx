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

  // handle inputs
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/all"
      );
      const data = await res.json();
      if (data.ok) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>💼 FAT-EIBL</div>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.active}>Dashboard</li>
            <li>Users</li>
            <li>Departments</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Manage users, departments, and system access.
          </p>
        </header>

        {/* Create User Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create New User</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.row}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <input
                type="email"
                name="manager_email"
                placeholder="Manager Email"
                value={formData.manager_email}
                onChange={handleChange}
                style={styles.input}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="auditee">Auditee</option>
                <option value="auditor">Auditor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" style={styles.button}>
              Create User
            </button>
          </form>

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.startsWith("✅")
                  ? "green"
                  : message.startsWith("⚠️")
                  ? "#c27b00"
                  : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* User Table */}
        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>Registered Users</h3>
          {users.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center" }}>
              No users found.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} style={i % 2 ? styles.rowAlt : styles.rowNormal}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.department || "-"}</td>
                    <td style={styles.td}>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

// ====== STYLES =======
const styles = {
  container: {
    display: "flex",
    backgroundColor: "#f4f7fb",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: "220px",
    background: "#004aad",
    color: "white",
    padding: "20px 15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    fontWeight: 700,
    fontSize: "1.3rem",
    marginBottom: "40px",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    width: "100%",
    textAlign: "left",
  },
  active: {
    background: "#003b80",
    borderRadius: "8px",
    padding: "10px 15px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "40px 60px",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "2rem",
    color: "#003b80",
    fontWeight: "700",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#6b7a99",
    fontSize: "1rem",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  cardTitle: {
    color: "#004aad",
    borderBottom: "2px solid #004aad",
    display: "inline-block",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d0d7e2",
    fontSize: "1rem",
  },
  select: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d0d7e2",
    fontSize: "1rem",
    backgroundColor: "white",
  },
  button: {
    background: "#004aad",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  tableCard: {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },
  tableTitle: {
    color: "#004aad",
    borderBottom: "2px solid #004aad",
    display: "inline-block",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    color: "#003b80",
    fontWeight: "600",
    borderBottom: "2px solid #004aad",
  },
  td: {
    padding: "10px",
    color: "#333",
    fontSize: "0.95rem",
  },
  rowAlt: { backgroundColor: "#f9faff" },
  rowNormal: { backgroundColor: "white" },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
};
