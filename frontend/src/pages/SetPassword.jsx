import React, { useState } from "react";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  const token = urlParams.get("token");

  // Submit password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    const response = await fetch(`${API}/users/complete-invite`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: email,
        token: token,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.detail || "Something went wrong");
    } else {
      setMessage("Password set successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "50px auto" }}>
      <h2>Set Your Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#004aad",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Set Password
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 10, color: "red", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}
