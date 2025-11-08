import React, { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "auditee",
    manager_email: "",
  });

  const loadUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    const res = await fetch(`${API}/users`, { method: "POST", body: fd });
    if (res.ok) {
      alert("User created");
      loadUsers();
    } else alert("Error creating user");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Admin – User Management</h2>
      <form onSubmit={createUser} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Department" onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <input placeholder="Manager Email" onChange={(e) => setForm({ ...form, manager_email: e.target.value })} />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="auditee">Auditee</option>
          <option value="auditor">Auditor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button>Create User</button>
      </form>

      <h3 style={{ marginTop: "20px" }}>User List</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Role</th>
            <th>Manager</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.department}</td>
              <td>{u.role}</td>
              <td>{u.manager_email}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
