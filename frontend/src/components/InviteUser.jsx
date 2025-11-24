import React, { useState } from "react";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  async function sendInvite(e) {
    e.preventDefault();

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/invite/send`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      }
    );

    const data = await res.json();
    setMessage(data.message || data.detail);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "30px auto" }}>
      <h2>Send User Invite</h2>

      <form onSubmit={sendInvite}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Send Invite</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
