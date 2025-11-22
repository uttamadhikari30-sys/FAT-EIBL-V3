import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function Login() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return setError(data.detail || "Invalid email or password");

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      window.location.href =
        user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Server connection error");
    }

    setLoading(false);
  };

  return (
    <div className="login-container premium-bg">
      <form className="login-card premium-card" onSubmit={submit}>
        <img src={logo} className="login-logo premium-logo" alt="Logo" />

        <h2 className="premium-title">Welcome Back</h2>
        <p className="premium-subtitle">Finance Audit Tracker</p>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="premium-button">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="switch-link"
          onClick={() => (window.location.href = "/otp-login")}
        >
          Login with OTP
        </p>

        <p
          className="switch-link"
          onClick={() => (window.location.href = "/forgot-password")}
        >
          Forgot password?
        </p>
      </form>
    </div>
  );
}
