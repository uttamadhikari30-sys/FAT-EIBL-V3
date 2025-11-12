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
  const [isCompact, setIsCompact] = useState(false);
  const dropdownRef = useRef(null);

  // === Handle Input Change ===
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // === Handle Form Submit ===
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
      setMessage("⚠️ Unable to connect to server.");
    }
  };

  // === Fetch Users ===
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

  // === Handle Click Outside Dropdown ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === Compact Navbar on Scroll ===
  useEffect(() => {
    const handleScroll = () => setIsCompact(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* === NAVBAR === */}
      <header
        style={{
          ...styles.navbar,
          padding: isCompact ? "6px 30px" : "14px 40px",
          transition: "all 0.3s ease",
          boxShadow: isCompact
            ? "0 3px 10px rgba(0,0,0,0.2)"
            : "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div style={styles.navLeft}>
          <img
            src={`${process.env.PUBLIC_URL}/edme_logo.png`}
            alt="FAT-EIBL Logo"
            style={{
              ...styles.logo,
              width: isCompact ? "36px" : "46px",
              height: isCompact ? "36px" : "46px",
            }}
            onError={(e) => {
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
            }}
          />
          <span style={styles.brand}>FAT-EIBL</span>
        </div>

        <nav style={styles.navCenter}>
          {["Dashboard", "Users", "Departments", "Reports", "Settings"].map(
            (link, i) => (
              <a
                key={i}
                href="#"
                style={i === 0 ? styles.activeLink : styles.navLink}
              >
                {link}
              </a>
            )
          )}
        </nav>

        <div style={styles.userMenu} ref={dropdownRef}>
          <div
            style={styles.userWrapper}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="User"
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

      {/* === MAIN CONTENT === */}
      <main style={styles.main}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Manage users, departments, and system access.
        </p>

        {/* === CREATE USER CARD === */}
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
      </main>
    </div>
  );
}

//
// === INLINE STYLES ===
//
const styles = {
  container: {
    background: "#f7f9fc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    background: "#003b80",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  logo: {
    borderRadius: "6px",
    background: "#fff",
    padding: "4px",
    objectFit: "contain",
  },
  brand: { fontSize: "1.3rem", fontWeight: "700", color: "#fff" },
  navCenter: { display: "flex", gap: "25px" },
  navLink: {
    color: "#dce7ff",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  activeLink: {
    color: "#fff",
    fontWeight: "700",
    borderBottom: "2px solid white",
    paddingBottom: "2px",
  },
  userMenu: { position: "relative" },
  userWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
  userName: { color: "#fff", fontWeight: "500" },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    background: "#fff",
    color: "#003b80",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
    minWidth: "150px",
  },
  dropdownItem: { padding: "10px 15px", margin: 0 },
  dropdownDivider: { margin: 0, borderColor: "#eee" },
  logoutBtn: {
    width: "100%",
    border: "none",
    background: "none",
    textAlign: "left",
    padding: "10px 15px",
    color: "#e11d48",
    cursor: "pointer",
  },
  main: { padding: "40px 80px" },
  title: { fontSize: "2rem", fontWeight: "700", color: "#003b80" },
  subtitle: { color: "#6b7a99", fontSize: "1rem", marginBottom: "30px" },
  card: {
    background: "#fff",
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
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "flex", gap: "15px", flexWrap: "wrap" },
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
    background: "#004aad",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};
