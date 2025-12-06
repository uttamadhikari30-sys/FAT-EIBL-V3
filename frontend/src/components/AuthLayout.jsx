import React from "react";
import "../pages/NewLogin.css";
import audit from "../assets/audit-illustration.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="login-container">
      <div className="left-section">
        <h1 className="left-title">Digitally Streamline the Audit Process</h1>
        <p className="left-subtitle">
          Ensure accuracy, transparency, and effortless compliance.
        </p>
        <div className="audit-wrapper">
          <img src={audit} alt="Audit Illustration" className="audit-image" />
        </div>
      </div>

      <div className="right-section">{children}</div>
    </div>
  );
};

export default AuthLayout;