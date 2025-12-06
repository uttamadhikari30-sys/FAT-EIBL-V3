import React from "react";
import Footer from "./Footer";
import "./AuthLayout.css";

import auditImg from "../assets/audit-illustration.png";
import logo from "../assets/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout-container">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <h1 className="auth-title">Digitally Streamline the Audit Process</h1>

        <p className="auth-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img src={auditImg} alt="Audit Illustration" className="auth-illustration" />
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <img src={logo} alt="Company Logo" className="auth-logo" />

        {children}
      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;
