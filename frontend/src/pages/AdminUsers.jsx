import React, { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "auditee",
    manager_email: "",
  });

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/users/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Invite email sent to user!");
        setForm({ name: "", email: "", department: "", role: "auditee", manager_email: "" });
        loadUsers();
      } else {
        const err = await res.json().catch(()=>({detail:res.statusText}));
        alert("Failed to send invite: " + (err.detail || res.statusText));
      }
    } catch (err) {
      console.error(err); alert("Network error sending invite");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Users</h2>
      <p>Create and manage users.</p>

      <form onSubmit={createUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <input placeholder="Full Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Department" value={form.department} onChange={(e)=>setForm({...form,department:e.target.value})}/>
        <input placeholder="Manager Email" value={form.manager_email} onChange={(e)=>setForm({...form,manager_email:e.target.value})}/>
        <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="auditee">Auditee</option>
          <option value="auditor">Auditor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ gridColumn:"span 2", padding:12, background:"#004aad", color:"white", borderRadius:8, border:"none" }}>
          Create User (Send Invite)
        </button>
      </form>

      <h3>Registered Users</h3>
      <table border="1" cellPadding={8} width="100%">
        <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Manager</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.department}</td><td>{u.role}</td><td>{u.manager_email}</td>
              <td><button onClick={()=>deleteUser(u.id)}>❌ Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
