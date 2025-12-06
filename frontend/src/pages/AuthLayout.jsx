import React from "react";
import "./NewLogin.css";
import audit from "../assets/audit-illustration.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="login-container">

      {/* LEFT BLOCK */}
      <div className="left-section">
        <h1 className="left-title">Digitally Streamline the Audit Process</h1>
        <p className="left-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>

        <img src={audit} alt="Audit Illustration" className="audit-image" />
      </div>

      {/* RIGHT BLOCK (dynamic form content) */}
      <div className="right-section">{children}</div>
      
    </div>
  );
};

export default AuthLayout;
