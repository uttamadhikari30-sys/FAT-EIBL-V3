// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard"); // "dashboard" | "users" | ...
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

  // Build public logo path, check existence and fallback
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
      if (data.ok && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // If API responds ok:false, still clear or show nothing
        setUsers([]);
      }
    } catch (e) {
      console.error("fetchUsers error:", e);
      setUsers([]);
    }
  };

  useEffect(() => {
    // Only fetch users initially so table has data when user opens Users tab
    fetchUsers();
  }, []);

  // scroll compact navbar
  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // click outside to close dropdown
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

  // Create user
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
        // refresh users list
        fetchUsers();
      } else {
        setMessage(`❌ ${data.detail || "Failed to create user"}`);
      }
    } catch (err) {
      console.error("create user error:", err);
      setMessage("⚠️ Unable to connect to server.");
    }
    // auto-hide message after 4s
    setTimeout(() => setMessage(""), 4000);
  };

  // Delete user helper (optional)
  const handleDelete = async (userId) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(
        `https://fat-eibl-backend-x1sp.onrender.com/users/${userId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.ok) {
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (e) {
      alert("Error deleting user");
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* NAV */}
      <header
        style={{
          ...styles.navbar,
          padding: isCompact ? "6px 24px" : "14px 40px",
          transition: "all 220ms ease",
          boxShadow: isCompact
            ? "0 4px 14px rgba(0,0,0,0.12)"
            : "0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div style={styles.navLeft}>
          <img
            src={logoSrc}
            alt="Edme"
            style={{
              ...styles.logo,
              width: isCompact ? 36 : 46,
              height: isCompact ? 36 : 46,
            }}
            onError={(e) =>
              (e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/6/6f/No_image_3x4.svg")
            }
          />
          <span style={styles.brand}>FAT-EIBL</span>
        </div>

        <nav style={styles.navCenter}>
          <button
            onClick={() => setTab("dashboard")}
            style={tab === "dashboard" ? styles.activeNavBtn : styles.navBtn}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab("users")}
            style={tab === "users" ? styles.activeNavBtn : styles.navBtn}
          >
            Users
          </button>
          <button
            onClick={() => setTab("departments")}
            style={tab === "departments" ? styles.activeNavBtn : styles.navBtn}
          >
            Departments
          </button>
          <button
            onClick={() => setTab("reports")}
            style={tab === "reports" ? styles.activeNavBtn : styles.navBtn}
          >
            Reports
          </button>
          <button
            onClick={() => setTab("settings")}
            style={tab === "settings" ? styles.activeNavBtn : styles.navBtn}
          >
            Settings
          </button>
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

      {/* PAGE */}
      <main style={styles.main}>
        {tab === "dashboard" && (
          <>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>
              Manage users, departments, and system access.
            </p>
            <div style={styles.summaryRow}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryNumber}>{users.length}</div>
                <div style={styles.summaryLabel}>Registered users</div>
              </div>
              {/* Add more summary cards as needed */}
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <h1 style={styles.title}>Users</h1>
            <p style={styles.subtitle}>Create and manage users.</p>

            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              {/* Create user form */}
              <div style={{ flex: 1, minWidth: 360 }}>
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
                        type="password"
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

                    <button type="submit" style={styles.button}>
                      Create User
                    </button>

                    {message && (
                      <div
                        style={{
                          marginTop: 12,
                          color:
                            message.startsWith("✅")
                              ? "green"
                              : message.startsWith("⚠️")
                              ? "#c27b00"
                              : "red",
                        }}
                      >
                        {message}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Users list */}
              <div style={{ flex: 1.1, minWidth: 420 }}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Registered Users</h2>
                  {users.length === 0 ? (
                    <div style={{ padding: 24, color: "#6b7a99" }}>
                      No users found.
                    </div>
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
                            <td>{u.name || "-"}</td>
                            <td>{u.email}</td>
                            <td>{u.department || "-"}</td>
                            <td>{u.role || "-"}</td>
                            <td>
                              <button
                                style={styles.smallBtn}
                                onClick={() =>
                                  alert(
                                    `Edit not implemented yet for ${u.email}`
                                  )
                                }
                              >
                                Edit
                              </button>
                              <button
                                style={{ ...styles.smallBtn, ...styles.dangerBtn }}
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

        {tab === "departments" && (
          <>
            <h1 style={styles.title}>Departments</h1>
            <p style={styles.subtitle}>Department management coming soon.</p>
          </>
        )}

        {tab === "reports" && (
          <>
            <h1 style={styles.title}>Reports</h1>
            <p style={styles.subtitle}>Reports coming soon.</p>
          </>
        )}

        {tab === "settings" && (
          <>
            <h1 style={styles.title}>Settings</h1>
            <p style={styles.subtitle}>Application settings.</p>
          </>
        )}
      </main>
    </div>
  );
}

// === STYLES (inline) ===
const styles = {
  container: { background: "#f7f9fc", minHeight: "100vh", fontFamily: "'Inter', Arial, sans-serif" },
  navbar: { position: "sticky", top: 0, zIndex: 999, background: "#003b80", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { borderRadius: 10, background: "#fff", padding: 6, objectFit: "contain" },
  brand: { color: "#fff", fontWeight: 700, fontSize: 18, marginLeft: 6 },
  navCenter: { display: "flex", gap: 18, alignItems: "center" },
  navBtn: { background: "transparent", border: "none", color: "#dce7ff", fontWeight: 600, cursor: "pointer", padding: "8px 12px" },
  activeNavBtn: { background: "transparent", border: "none", color: "#fff", fontWeight: 800, textDecoration: "underline", padding: "8px 12px" },
  userMenu: { position: "relative" },
  userWrapper: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  avatar: { width: 40, height: 40, borderRadius: "50%", border: "2px solid #fff" },
  userName: { color: "#fff", fontWeight: 600 },
  dropdown: { position: "absolute", right: 0, top: 50, background: "#fff", color: "#003b80", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.12)", minWidth: 160 },
  dropdownItem: { padding: "10px 14px", margin: 0 },
  dropdownDivider: { margin: 0, borderColor: "#eee" },
  logoutBtn: { width: "100%", padding: "10px 14px", border: "none", background: "transparent", color: "#e11d48", textAlign: "left", cursor: "pointer" },

  main: { padding: "34px 48px" },
  title: { fontSize: 36, color: "#0b4a86", margin: "6px 0 6px" },
  subtitle: { color: "#6b7a99", marginBottom: 18 },

  summaryRow: { display: "flex", gap: 18, marginBottom: 20 },
  summaryCard: { background: "#fff", padding: 18, borderRadius: 10, minWidth: 160, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" },
  summaryNumber: { fontSize: 22, fontWeight: 700, color: "#003b80" },
  summaryLabel: { color: "#6b7a99", marginTop: 6 },

  card: { background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 24px rgba(16,24,40,0.06)" },
  cardTitle: { color: "#004aad", borderBottom: "2px solid #004aad", display: "inline-block", marginBottom: 12, paddingBottom: 6 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  input: { flex: 1, padding: "11px 12px", borderRadius: 8, border: "1px solid #d7dee8", fontSize: 15, minWidth: 160 },
  select: { flex: 1, padding: "11px 12px", borderRadius: 8, border: "1px solid #d7dee8", fontSize: 15, minWidth: 160 },
  button: { background: "#004aad", color: "#fff", border: "none", padding: "12px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer", marginTop: 6 },

  table: { width: "100%", borderCollapse: "collapse", marginTop: 6 },
  smallBtn: { marginRight: 8, padding: "6px 10px", borderRadius: 6, border: "1px solid #ccd7ef", background: "#fff", cursor: "pointer" },
  dangerBtn: { background: "#ffecec", borderColor: "#ffb3b3", color: "#c0392b" },
};
