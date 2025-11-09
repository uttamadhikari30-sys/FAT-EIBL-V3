import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "",
    manager_email: "",
  });
  const [message, setMessage] = useState("");

  // Fetch users list
  useEffect(() => {
    fetch("https://fat-eibl-backend-x1sp.onrender.com/users/")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setMessage("Failed to fetch users"));
  }, []);

  // Handle form input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle user creation
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("Creating user...");

    const body = new FormData();
    for (const key in form) body.append(key, form[key]);

    const res = await fetch(
      "https://fat-eibl-backend-x1sp.onrender.com/users/",
      {
        method: "POST",
        body,
      }
    );
    const data = await res.json();
    if (data.ok) {
      setMessage("✅ User created successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        department: "",
        role: "",
        manager_email: "",
      });
      const refreshed = await fetch(
        "https://fat-eibl-backend-x1sp.onrender.com/users/"
      ).then((r) => r.json());
      setUsers(refreshed);
    } else {
      setMessage("❌ Error: " + (data.error || "Could not create user"));
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await fetch(`https://fat-eibl-backend-x1sp.onrender.com/users/${id}`, {
      method: "DELETE",
    });
    const refreshed = await fetch(
      "https://fat-eibl-backend-x1sp.onrender.com/users/"
    ).then((r) => r.json());
    setUsers(refreshed);
  };

  return (
    <div style={{ padding: "40px", background: "#f8faff", minHeight: "100vh" }}>
      <h1 style={{ color: "#004aad", textAlign: "center" }}>
        👨‍💼 Admin Dashboard
      </h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Create and manage users by department
      </p>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "30px auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Create New User</h2>
        <form onSubmit={handleCreate}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            name="manager_email"
            placeholder="Manager Email"
            value={form.manager_email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="">Select Role</option>
            <option value="auditor">Auditor</option>
            <option value="auditee">Auditee</option>
            <option value="manager">Manager</option>
          </select>
          <button
            type="submit"
            style={{
              background: "#004aad",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Create User
          </button>
        </form>
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          maxWidth: "800px",
          margin: "30px auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Existing Users</h2>
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#004aad", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" align="center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.department}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
