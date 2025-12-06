import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function checkStrength(pwd) {
    if (pwd.length >= 12) return "Strong";
    if (pwd.length >= 8) return "Medium";
    if (pwd.length > 0) return "Weak";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!password || !confirm) return alert("Enter both fields");
    if (password !== confirm) return alert("Passwords do not match");
    // TODO: call API to update password
    alert("Password updated successfully");
    navigate("/");
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="left-title">Digitally Streamline the Audit Process</h1>
        <p className="left-subtitle">Ensure accuracy, transparency, and effortless compliance.</p>
      </div>

      <div className="auth-right">
        <img src={logo} alt="logo" className="company-logo" />
        <div className="auth-card">
          <h2 className="auth-title">Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <label className="field-label">New Password</label>
            <div className="pwd-row">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                className="show-btn"
                onClick={() => setShow((s) => !s)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>

            <div className="strength">Strength: {checkStrength(password)}</div>

            <label className="field-label">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field"
              placeholder="Re-enter password"
              required
            />

            <button className="primary-btn" type="submit">Update Password</button>

            <div className="small-row">
              <Link to="/">Back to Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
