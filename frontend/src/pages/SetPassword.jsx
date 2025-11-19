import React, { useState, useEffect } from "react";

export default function SetPassword() {
  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email"));
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/users/complete-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          token: token,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Failed to set password");
      } else {
        setMessage("Password set successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err) {
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f9ff",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          width: "350px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          Set Your Password
        </h2>

        <p style={{ fontSize: "14px", marginBottom: "10px" }}>
          Email: <strong>{email}</strong>
        </p>

        <input
          type="password"
          placeholder="Enter New Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {message && (
          <p style={{ color: "red", marginBottom: "10px" }}>{message}</p>
        )}

        <button
          type="submit"
          style={{
            background: "#004aad",
            color: "white",
            padding: "12px",
            width: "100%",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
