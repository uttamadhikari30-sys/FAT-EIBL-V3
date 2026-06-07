import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import auditArt from "../assets/audit-illustration.png";
import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const roles = [
  { id: "cfo", icon: "👑", name: "CFO", note: "Full access" },
  { id: "ceo", icon: "🎯", name: "CEO", note: "Executive" },
  { id: "head", icon: "📊", name: "Business Head", note: "My vertical" },
  { id: "finance", icon: "📋", name: "Finance", note: "MIS & reports" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@edmeinsurance.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("cfo");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to sign in");
      }

      localStorage.setItem("fatToken", data.access_token);
      localStorage.setItem("fatUser", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell premium-auth-shell">
      <section className="auth-hero premium-auth-hero">
        <div className="hero-inner">
          <img className="hero-logo" src={logo} alt="Edme" />
          <div className="hero-title-lockup">
            <p className="hero-product-kicker">FAT-EIBL</p>
            <h1>
              FINMIND <span>AI</span>
            </h1>
            <p className="hero-copy">
              Intelligent MIS and finance audit workspace for faster reviews,
              sharper follow-ups, and cleaner accountability across departments.
            </p>
          </div>
          <div className="hero-illustration-wrap">
            <img className="hero-illustration" src={auditArt} alt="Audit workspace" />
          </div>
          <div className="hero-divider" />
          <div className="hero-company">
            <strong>Edme Insurance Brokers Limited</strong>
            <p>
              Enterprise-grade audit coordination with real-time task visibility,
              role-based access, and premium operational reporting.
            </p>
          </div>
          <div className="hero-band premium-hero-band">
            <div>
              <strong>FY 2025-26</strong>
              <span>Audit cycle</span>
            </div>
            <div>
              <strong>v8.0</strong>
              <span>Workspace build</span>
            </div>
            <div>
              <strong>15 Verticals</strong>
              <span>Connected teams</span>
            </div>
            <div>
              <strong>Role-based</strong>
              <span>Access control</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel premium-auth-panel">
        <form className="auth-card premium-auth-card" onSubmit={handleSubmit}>
          <img className="card-logo" src={logo} alt="Edme" />
          <p className="eyebrow premium-eyebrow">Welcome back</p>
          <h2>Sign in to your audit workspace</h2>
          <p className="card-subtitle">
            Edme Insurance Brokers Limited · premium finance operations console
          </p>

          <div className="card-divider" />

          <div className="role-picker">
            <span className="field-label">Select your role</span>
            <div className="role-grid">
              {roles.map((role) => (
                <button
                  key={role.id}
                  className={
                    selectedRole === role.id ? "role-card active" : "role-card"
                  }
                  onClick={() => setSelectedRole(role.id)}
                  type="button"
                >
                  <span className="role-icon">{role.icon}</span>
                  <strong>{role.name}</strong>
                  <small>{role.note}</small>
                </button>
              ))}
            </div>
          </div>

          <label className="field premium-field">
            <span className="field-label">Email address</span>
            <div className="input-shell">
              <span className="input-icon">👤</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@edmeinsurance.com"
              />
            </div>
          </label>

          <label className="field premium-field">
            <span className="field-label">Password</span>
            <div className="input-shell">
              <span className="input-icon">🔒</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
              <span className="input-trailing">◌</span>
            </div>
          </label>

          <div className="login-help-row">
            <span>Demo access is prefilled for review.</span>
            <span>256-bit SSL protected</span>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-btn premium-login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to FINMIND AI →"}
          </button>

          <p className="login-footer-note">
            Secure sign-in for Edme Insurance Brokers Limited · strictly confidential
          </p>
        </form>
      </section>
    </div>
  );
}
