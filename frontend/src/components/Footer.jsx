import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="auth-footer">
      <div className="footer-left">© 2025 EDME Services Pvt Ltd.</div>

      <div className="footer-right">
        <a href="#">Privacy Policy</a>
        <span>|</span>
        <a href="#">Terms</a>
        <span>|</span>
        <a href="#">Contact Support</a>
      </div>
    </footer>
  );
};

export default Footer;
