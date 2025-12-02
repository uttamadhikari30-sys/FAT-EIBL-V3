import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";

export default function Login() {
  const [loginType, setLoginType] = useState("password"); // password | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = () => {
    if (loginType === "password") {
      console.log("Login with Email & Password:", email, password);
      // Call /auth/login API
    } else {
      console.log("Login with OTP:", email, otp);
      // Call /auth/login-otp API
    }
  };

  return (
    <div className="login-wrapper">

      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1 className="title">
          Simplify, Secure and <br /> Streamline Your <br /> Employee Benefits
        </h1>
        <p className="subtext">
          Digitally streamline the audit process for accuracy, transparency,
          and effortless compliance.
        </p>

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/woman-using-mobile-phone-8291914-6677110.png"
          alt="illustration"
          className="illustration"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <img src={logo} className="login-logo" alt="logo" />

        <h2 className="login-heading">Sign in to your account</h2>

        <div className="tab-row">
          <button className="active-tab">Email</button>
          <button className="tab">Mobile</button>
        </div>

        <div className="input-box">
          <span className="icon">✉</span>
          <input
            type="email"
            placeholder="Enter Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-type">
          <label>
            <input
              type="radio"
              name="type"
              value="password"
              checked={loginType === "password"}
              onChange={() => setLoginType("password")}
            /> Password
          </label>

          <label>
            <input
              type="radio"
              name="type"
              value="otp"
              checked={loginType === "otp"}
              onChange={() => setLoginType("otp")}
            /> OTP
          </label>
        </div>

        {loginType === "password" ? (
          <div className="input-box">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        ) : (
          <div className="input-box">
            <span className="icon">🔢</span>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        <button className="login-btn" onClick={handleLogin}>Sign In</button>

        <div className="links-row">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
