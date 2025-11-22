import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css";

export default function Login() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://fat-eibl-backend-x1sp.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid email or password");
        setLoading(false);
        return;
      }

      const user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.first_login) {
        window.location.href = `/reset-password?user_id=${user.id}`;
        return;
      }

      window.location.href =
        user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError("Unable to connect to server. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="login-logo" />

        <h2>Password Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Email"
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

        <button type="submit" disabled={loading}>
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
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
