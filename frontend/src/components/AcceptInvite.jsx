import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function AcceptInvite() {
  const [query] = useSearchParams();
  const email = query.get("email");
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submitForm(e) {
    e.preventDefault();

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/invite/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password })
      }
    );

    const data = await res.json();
    setMessage(data.message || data.detail);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "30px auto" }}>
      <h2>Create Password</h2>

      <p>Email: <b>{email}</b></p>

      <form onSubmit={submitForm}>
        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create Account</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
