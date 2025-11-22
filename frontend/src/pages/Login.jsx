import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Login.css"; // make sure CSS is created

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
    setError("");
    setLoading(true);

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
    } catch (e) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-box animate-fade">
        <img src={logo} alt="logo" className="login-logo" />

        <h2 className="login-title">Password Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-box"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-box"
          />

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p onClick={() => (window.location.href = "/otp-login")} className="link">
          Login with OTP
        </p>

        <p
          onClick={() => (window.location.href = "/forgot-password")}
          className="link"
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
