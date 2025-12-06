import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OtpLogin.css";
import logo from "../assets/logo.png";

export default function OtpLogin() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const arr = [...otp];
    arr[index] = value.slice(-1);
    setOtp(arr);
    // auto focus next field
    if (value && index < otp.length - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const code = otp.join("");
    // TODO: validate OTP with API
    if (code.length === 4) {
      // simulate success
      navigate("/reset-password");
    } else {
      alert("Enter 4 digit OTP");
    }
  }

  function handleResend() {
    setTimer(120);
    setOtp(["", "", "", ""]);
    // TODO: call resend API
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="left-title">Digitally Streamline the Audit Process</h1>
        <p className="left-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>
      </div>

      <div className="auth-right">
        <img src={logo} alt="logo" className="company-logo" />
        <div className="auth-card">
          <h2 className="auth-title">Enter OTP</h2>

          <p className="otp-info">A 4-digit code was sent to your email.</p>

          <form onSubmit={handleSubmit}>
            <div className="otp-row">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="otp-input"
                  maxLength={1}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
              ))}
            </div>

            <div className="otp-meta">
              <div className="timer">Resend in: {timer}s</div>
              <div className="resend">
                <button
                  type="button"
                  className="link-btn"
                  onClick={handleResend}
                  disabled={timer > 0}
                >
                  Resend
                </button>
              </div>
            </div>

            <button className="primary-btn" type="submit">Verify OTP</button>

            <div className="small-row">
              <Link to="/">Back to Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
