import React from "react";
import Footer from "./Footer";
import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout-container">
      <div className="auth-left">
        <h1 className="auth-title">Digitally Streamline the Audit Process</h1>
        <p className="auth-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>
        <img
          src="/audit-illustration.png"
          className="auth-illustration"
          alt="Audit Illustration"
        />
      </div>

      <div className="auth-right">{children}</div>

      <Footer />
    </div>
  );
};

export default AuthLayout;
