import React, { useState, useEffect, useRef } from "react";

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
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
  const [isCompact, setIsCompact] = useState(false);
  const [logoSrc, setLogoSrc] = useState("");
  const dropdownRef = useRef(null);

  // Load logo
  useEffect(() => {
    const logoPath = `${import.meta.env.BASE_URL || "/"}edme_logo.png`;
    fetch(logoPath, { method: "HEAD" })
      .then((r) => {
        if (r.ok) setLogoSrc(logoPath);
        else throw new Error("not found");
      })
      .catch(() =>
        setLogoSrc(
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/No_image_3x4.svg"
        )
      );
  }, []);

  // Fetch users list
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/all"
      );
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else if (Array.isArray(data.users)) setUsers(data.users);
      else setUsers([]);
    } catch (error) {
      console.error("fetchUsers error:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Compact navbar
  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (evt) => {
      if (dropdownRef.current && !dropdownRef.current.contains(evt.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        fetchUsers();
      } else {
        setMessage(`❌ ${data.detail || "Failed to create user"}`);
      }
    } catch (err) {
      console.error("create user error:", err);
      setMessage("⚠️ Unable to connect to server.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(
        `https://fat-eibl-backend-x1sp.onrender.com/users/${id}`,
        { method: "DELETE" }
      );
      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <header
        style={{
          ...styles.navbar,
          padding: isCompact ? "6px 24px" : "14px 40px",
          boxShadow: isCompact
            ? "0 4px 14px rgba(0,0,0,0.12)"
            : "0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div style={styles.navLeft}>
          <img
            src={logoSrc}
            alt="Logo"
            style={{
              width: isCompact ? 36 : 46,
              height: isCompact ? 36 : 46,
              ...styles.logo,
            }}
          />
          <span style={styles.brand}>FAT-EIBL</span>
        </div>

        <nav style={styles.navCenter}>
          {["dashboard", "users", "departments", "reports", "settings"].map(
            (t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={tab === t ? styles.activeNavBtn : styles.navBtn}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            )
          )}
        </nav>

        <div style={styles.userMenu} ref={dropdownRef}>
          <div
            style={styles.userWrapper}
            onClick={() => setDropdownOpen((s) => !s)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="user"
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
      </header>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {tab === "dashboard" && (
          <>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage system and users.</p>

            <div style={styles.summaryRow}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryNumber}>{users.length}</div>
                <div style={styles.summaryLabel}>Registered Users</div>
              </div>
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <h1 style={styles.title}>Manage Users</h1>

            <div style={{ display: "flex", gap: 24 }}>
              {/* Create User */}
              <div style={{ flex: 1 }}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Create New User</h2>

                  <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                      <input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                      />
                      <input
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
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                      />
                      <input
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.row}>
                      <input
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
                        <option value="Manager">Manager</option>
                        <option value="CFO">CFO</option>
                        <option value="Partner">Partner</option>
                      </select>
                    </div>

                    <button style={styles.button}>Create User</button>

                    {message && (
                      <p
                        style={{
                          marginTop: 10,
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
                  </form>
                </div>
              </div>

              {/* Users Table */}
              <div style={{ flex: 1.2 }}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Registered Users</h2>

                  {users.length === 0 ? (
                    <p style={{ padding: 20, color: "#777" }}>
                      No users found.
                    </p>
                  ) : (
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Dept</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id || u.email}>
                            <td>
                              {typeof u.name === "string" ? u.name : "-"}
                            </td>
                            <td>{u.email}</td>
                            <td>
                              {typeof u.department === "string"
                                ? u.department
                                : "-"}
                            </td>
                            <td>
                              {typeof u.role === "string" ? u.role : "-"}
                            </td>

                            <td>
                              <button
                                style={styles.smallBtn}
                                onClick={() =>
                                  alert(`Edit not implemented for ${u.email}`)
                                }
                              >
                                Edit
                              </button>
                              <button
                                style={{
                                  ...styles.smallBtn,
                                  ...styles.dangerBtn,
                                }}
                                onClick={() => handleDelete(u.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ----------------------
// STYLES (inline)
// ----------------------
const styles = {
  container: {
    background: "#f7f9fc",
    minHeight: "100vh",
    fontFamily: "'Inter', Arial, sans-serif",
  },

  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#003b80",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navLeft: { display: "flex", alignItems: "center", gap: 12 },

  logo: {
    borderRadius: 8,
    background: "#fff",
    padding: 4,
  },

  brand: { color: "#fff", fontWeight: 700, fontSize: 20 },

  navCenter: { display: "flex", gap: 16 },

  navBtn: {
    border: "none",
    background: "transparent",
    color: "#cde0ff",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },

  activeNavBtn: {
    color: "#fff",
    fontWeight: 800,
    borderBottom: "3px solid white",
    padding: "8px 12px",
    background: "transparent",
    borderRadius: 0,
  },

  userMenu: { position: "relative" },
  userWrapper: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },

  avatar: { width: 36, height: 36, borderRadius: "50%", border: "2px solid #fff" },

  userName: { fontWeight: 600 },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 48,
    background: "#fff",
    color: "#003b80",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: 160,
    zIndex: 99,
  },

  dropdownItem: { padding: "10px" },
  dropdownDivider: { margin: 0, borderColor: "#eee" },

  logoutBtn: {
    padding: "10px",
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#e11d48",
    cursor: "pointer",
    textAlign: "left",
  },

  main: { padding: "40px" },

  title: { fontSize: 32, fontWeight: 700, color: "#003b80" },

  subtitle: { color: "#667", marginBottom: 20 },

  summaryRow: { display: "flex", gap: 20 },

  summaryCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    minWidth: 160,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  summaryNumber: { fontSize: 24, fontWeight: 700, color: "#003b80" },
  summaryLabel: { color: "#667" },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: 20,
    color: "#004aad",
    marginBottom: 12,
    borderBottom: "2px solid #004aad",
    paddingBottom: 6,
    display: "inline-block",
  },

  form: { display: "flex", flexDirection: "column", gap: 14 },

  row: { display: "flex", gap: 14, flexWrap: "wrap" },

  input: {
    flex: 1,
    minWidth: 160,
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #dbe2ea",
  },

  select: {
    flex: 1,
    minWidth: 160,
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #dbe2ea",
  },

  button: {
    padding: "12px",
    background: "#004aad",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },

  table: {
    width: "100%",
    marginTop: 10,
    borderCollapse: "collapse",
  },

  smallBtn: {
    padding: "6px 10px",
    marginRight: 6,
    borderRadius: 6,
    background: "#fff",
    border: "1px solid #ccd7ef",
    cursor: "pointer",
  },

  dangerBtn: {
    background: "#ffe5e5",
    borderColor: "#ffb3b3",
    color: "#c0392b",
  },
};
