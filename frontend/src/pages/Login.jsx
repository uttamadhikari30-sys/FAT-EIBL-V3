import React, { useState } from "react";
import "./NewLogin.css";
import logo from "../assets/logo.png";

export default function NewLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-wrapper">
      {/* LEFT SECTION */}
      <div className="left-panel">
        <h1 className="title">
          Simplify, Secure and <br /> Streamline Your <br /> Employee Benefits
        </h1>
        <p className="subtext">
          Go digital with us to insure your family health care and hassle-free
          access to various wellness benefits.
        </p>

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/woman-using-mobile-phone-8291914-6677110.png"
          alt="illustration"
          className="illustration"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="right-panel">
        <img src={logo} className="login-logo" alt="logo" />

        <h2 className="login-heading">Sign in to your account</h2>

        <div className="tab-row">
          <button className="active-tab">Email</button>
          <button className="tab">Mobile</button>
          <button className="tab">Employee Code</button>
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
          <label><input type="radio" name="type" defaultChecked /> Password</label>
          <label><input type="radio" name="type" /> OTP</label>
        </div>

        <div className="input-box">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn">Sign In</button>

        <div className="links-row">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
