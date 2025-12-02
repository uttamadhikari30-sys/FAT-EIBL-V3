import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";

export default function Login() {
  const [loginType, setLoginType] = useState("password"); // password | otp
  const [activeTab, setActiveTab] = useState("email"); // email | mobile
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = () => {
    if (activeTab === "email" && loginType === "password") {
      console.log("Login with Email & Password:", email, password);
      // Call /auth/login API here
    } else if (activeTab === "email" && loginType === "otp") {
      console.log("Login with Email & OTP:", email, otp);
      // Call /auth/login-otp API here
    } else {
      console.log("Login with Mobile & OTP:", mobile, otp);
      // Call mobile login API
    }
  };

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE PANEL */}
      <div className="left-panel">
        <h1 className="title">
          Digitally Streamline the Audit Process
        </h1>

        <p className="subtext">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/woman-using-mobile-phone-8291914-6677110.png"
          alt="illustration"
          className="illustration"
        />
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="right-panel">
        <img src={logo} className="login-logo" alt="logo" />

        <h2 className="login-heading">Sign in to your account</h2>

        {/* TAB SWITCH */}
        <div className="tab-row">
          <button
            className={activeTab === "email" ? "active-tab" : "tab"}
            onClick={() => setActiveTab("email")}
          >
            Email
          </button>

          <button
            className={activeTab === "mobile" ? "active-tab" : "tab"}
            onClick={() => setActiveTab("mobile")}
          >
            Mobile
          </button>
        </div>

        {/* INPUT FIELDS */}
        {activeTab === "email" ? (
          <div className="input-box">
            <span className="icon">✉</span>
            <input
              type="email"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="input-box">
            <span className="icon">📱</span>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        )}

        {/* LOGIN TYPE */}
        <div className="login-type">
          <label>
            <input
              type="radio"
              name="type"
              value="password"
              checked={loginType === "password"}
              onChange={() => setLoginType("password")}
              disabled={activeTab === "mobile"}
            />
            Password
          </label>

          <label>
            <input
              type="radio"
              name="type"
              value="otp"
              checked={loginType === "otp"}
              onChange={() => setLoginType("otp")}
            />
            OTP
          </label>
        </div>

        {/* PASSWORD OR OTP BOX */}
        {loginType === "password" ? (
          <div className="input-box">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={activeTab === "mobile"}
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

        {/* LOGIN BUTTON */}
        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>

        <div className="links-row">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
