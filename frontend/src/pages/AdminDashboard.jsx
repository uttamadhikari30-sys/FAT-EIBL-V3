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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dropdownRef = useRef(null);

  // Handle input
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

  // Dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-collapse sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      } else if (window.scrollY < 80 && sidebarCollapsed) {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* === SIDEBAR === */}
      <aside
        style={{
          ...styles.sidebar,
          width: sidebarCollapsed ? "70px" : "220px",
        }}
      >
        <div style={styles.sidebarHeader}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              ...styles.sidebarLogo,
              width: sidebarCollapsed ? "36px" : "42px",
            }}
          />
          {!sidebarCollapsed && <h2 style={styles.sidebarTitle}>FAT-EIBL</h2>}
        </div>

        <div style={styles.sidebarLinks}>
          {["Dashboard", "Users", "Departments", "Reports", "Settings"].map(
            (item) => (
              <div
                key={item}
                style={styles.sidebarItem}
                title={sidebarCollapsed ? item : ""}
              >
                <span style={styles.sidebarIcon}>📘</span>
                {!sidebarCollapsed && <span>{item}</span>}
              </div>
            )
          )}
        </div>

        <button
          style={styles.collapseBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? "»" : "«"}
        </button>
      </aside>

      {/* === MAIN CONTENT === */}
      <div style={styles.mainWrapper}>
        {/* === NAVBAR === */}
        <nav style={styles.navbar}>
          <div style={styles.navTitle}>Admin Dashboard</div>
          <div style={styles.userSection} ref={dropdownRef}>
            <div
              style={styles.userWrapper}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
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

        {/* === CONTENT === */}
        <main style={styles.main}>
          <p style={styles.subtitle}>
            Manage users, departments, and system access.
          </p>

          {/* CREATE USER */}
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
              <p style={{ textAlign: "center", color: "#777" }}>
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
    </div>
  );
}

//
// STYLES
//
const styles = {
  container: { display: "flex", minHeight: "100vh", background: "#f6f9fc" },
  sidebar: {
    backgroundColor: "#003b80",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "width 0.3s ease",
    position: "sticky",
    top: 0,
    height: "100vh",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px",
  },
  sidebarLogo: {
    borderRadius: "8px",
    background: "#fff",
    padding: "4px",
  },
  sidebarTitle: { fontSize: "1.2rem", fontWeight: "700" },
  sidebarLinks: { display: "flex", flexDirection: "column", padding: "10px" },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  sidebarItemHover: { background: "#004aad" },
  sidebarIcon: { fontSize: "1.2rem" },
  collapseBtn: {
    background: "#004aad",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "0 8px 8px 0",
  },
  mainWrapper: { flex: 1, display: "flex", flexDirection: "column" },
  navbar: {
    position: "sticky",
    top: 0,
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    zIndex: 1000,
  },
  navTitle: { fontSize: "1.3rem", fontWeight: 700, color: "#003b80" },
  userSection: { position: "relative" },
  userWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  avatar: { width: "40px", height: "40px", borderRadius: "50%" },
  userName: { fontWeight: 500, color: "#003b80" },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    minWidth: "150px",
  },
  dropdownItem: { padding: "10px 15px", margin: 0 },
  dropdownDivider: { margin: 0 },
  logoutBtn: {
    width: "100%",
    border: "none",
    background: "none",
    textAlign: "left",
    padding: "10px 15px",
    color: "#e11d48",
    cursor: "pointer",
  },
  main: { padding: "30px" },
  subtitle: { color: "#6b7a99", marginBottom: "25px" },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    color: "#004aad",
    borderBottom: "2px solid #004aad",
    display: "inline-block",
    marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "flex", gap: "15px" },
  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d0d7e2",
    borderRadius: "8px",
  },
  select: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d0d7e2",
    borderRadius: "8px",
  },
  button: {
    background: "#004aad",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #004aad" },
  td: { padding: "10px", color: "#333" },
  rowAlt: { backgroundColor: "#f9faff" },
  rowNormal: { backgroundColor: "white" },
};
