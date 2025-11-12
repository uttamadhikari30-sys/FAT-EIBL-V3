import React, { useState, useEffect, useRef } from "react";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle form change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit new user
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
        setMessage(`❌ ${data.detail || "Failed to create user"}`);
      }
    } catch {
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
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Dropdown click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* ===== NAVBAR ===== */}
      <nav style={styles.navbar}>
        <div style={styles.logoSection}>
          <img
            src="/logo.png"
            alt="FAT-EIBL Logo"
            style={styles.logo}
          />
          <span style={styles.logoText}>FAT-EIBL</span>
        </div>

        <div style={styles.navLinks}>
          <a href="#" style={{ ...styles.navLink, ...styles.activeLink }}>
            Dashboard
          </a>
          <a href="#" style={styles.navLink}>Users</a>
          <a href="#" style={styles.navLink}>Departments</a>
          <a href="#" style={styles.navLink}>Reports</a>
          <a href="#" style={styles.navLink}>Settings</a>
        </div>

        <div style={styles.userSection} ref={dropdownRef}>
          <div style={styles.userWrapper} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="User Avatar"
              style={styles.avatar}
            />
            <span style={styles.userName}>Admin</span>
          </div>

          {dropdownOpen && (
            <div style={styles.dropdown}>
              <p style={styles.dropdownItem}>👤 Admin</p>
              <hr style={styles.dropdownDivider} />
              <button style={styles.logoutBtn} onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main style={styles.main}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage users, departments, and system access.</p>

        {/* CREATE USER CARD */}
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
                marginTop: "15px",
                textAlign: "center",
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

        {/* USERS TABLE */}
        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>Registered Users</h3>
          {users.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>No users found.</p>
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
                  <tr
                    key={i}
                    style={i % 2 === 0 ? styles.rowNormal : styles.rowAlt}
                  >
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

//
// =======================
//   STYLES
// =======================
const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f5f8fc",
    minHeight: "100vh",
  },
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#003a85",
    color: "#fff",
    padding: "10px 40px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    backgroundColor: "#fff",
    padding: "4px",
    objectFit: "contain",
  },
  logoText: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#fff",
  },
  navLinks: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  navLink: {
    color: "#dbe9ff",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "color 0.2s ease",
  },
  activeLink: {
    color: "#ffffff",
    fontWeight: "700",
    textDecoration: "underline",
  },
  userSection: {
    position: "relative",
  },
  userWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 6px rgba(255,255,255,0.6)",
  },
  userName: {
    color: "#fff",
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    backgroundColor: "white",
    color: "#003b80",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
    minWidth: "150px",
    zIndex: 2000,
  },
  dropdownItem: {
    padding: "10px 15px",
    margin: 0,
    fontSize: "0.95rem",
  },
  dropdownDivider: {
    margin: 0,
    borderColor: "#eee",
  },
  logoutBtn: {
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
    padding: "10px 15px",
    color: "#e11d48",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  main: {
    padding: "40px 80px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#003b80",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#6b7a99",
    fontSize: "1rem",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  cardTitle: {
    color: "#004aad",
    fontWeight: "600",
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
  },
  button: {
    backgroundColor: "#004aad",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableCard: {
    backgroundColor: "white",
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
  rowAlt: {
    backgroundColor: "#f9faff",
  },
  rowNormal: {
    backgroundColor: "white",
  },
};
