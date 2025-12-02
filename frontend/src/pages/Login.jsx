import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";

export default function Login() {
  const [tab, setTab] = useState("email"); // email | mobile
  const [loginType, setLoginType] = useState("password"); // password | otp

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = () => {
    if (tab === "email" && loginType === "password") {
      console.log("Email + Password Login:", email, password);
    } else if (tab === "email" && loginType === "otp") {
      console.log("Email + OTP Login:", email, otp);
    } else if (tab === "mobile" && loginType === "password") {
      console.log("Mobile + Password Login:", mobile, password);
    } else {
      console.log("Mobile + OTP Login:", mobile, otp);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1 className="title">Digitally Streamline the Audit Process</h1>
        <p className="subtext">
          Ensure accuracy, transparency, and effortless compliance.
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

        {/* TABS */}
        <div className="tab-row">
          <button
            className={tab === "email" ? "active-tab" : "tab"}
            onClick={() => setTab("email")}
          >
            Email
          </button>
          <button
            className={tab === "mobile" ? "active-tab" : "tab"}
            onClick={() => setTab("mobile")}
          >
            Mobile
          </button>
        </div>

        {/* INPUT FIELD BASED ON TAB */}
        {tab === "email" ? (
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
            />{" "}
            Password
          </label>

          <label>
            <input
              type="radio"
              name="type"
              value="otp"
              checked={loginType === "otp"}
              onChange={() => setLoginType("otp")}
            />{" "}
            OTP
          </label>
        </div>

        {/* PASSWORD OR OTP INPUT */}
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
