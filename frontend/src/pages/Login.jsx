/* ================================
   MAIN GRID LAYOUT
================================ */
.login-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  height: 100vh;
  overflow: hidden;
}

/* ================================
   LEFT SIDE
================================ */
.left-section {
  background: #7a0000; /* deep premium red */
  padding: 70px 60px;
  color: white;
  position: relative;
}

/* overlay to make text readable */
.left-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 0;
}

.left-section h1 {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.left-section p {
  font-size: 22px;
  color: #000000;
  font-weight: 600;
  margin-bottom: 35px;
  position: relative;
  z-index: 2;
}

/* Illustration */
.audit-image {
  width: 88%;
  margin-top: 25px;
  border-radius: 12px;
  position: relative;
  z-index: 2;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Add spacing left & right */
.left-section .audit-image {
  padding-left: 10px;
  padding-right: 10px;
}

/* ================================
   RIGHT SIDE
================================ */
.right-section {
  background: #f6faff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding-top: 40px;
}

.company-logo {
  width: 120px;
  margin-bottom: 20px;
}

/* Login Box */
.login-box {
  background: #ffffff;
  width: 78%;
  padding: 40px;
  border-radius: 18px;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
}

.login-box h2 {
  text-align: center;
  color: #004cc7;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 25px;
}

/* ================================
   Email / Mobile Tab Buttons
================================ */
.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

.tab-buttons button {
  padding: 12px 30px;
  border-radius: 30px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  background: #dce8ff;
  color: #123a8f;
  font-weight: 600;
}

.tab-buttons .active {
  background: #004ce8;
  color: white;
}

/* ================================
   INPUT FIELDS
================================ */
.input-field {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: none;
  background: #e7f0ff;
  margin-bottom: 18px;
  font-size: 18px;
}

.input-field:focus {
  outline: 2px solid #005fff;
}

/* ================================
   RADIO OPTIONS
================================ */
.auth-type {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 18px;
  color: #000;
}

.auth-type input {
  margin-right: 8px;
}

/* ================================
   FORGOT PASSWORD
================================ */
.forgot-link {
  text-align: right;
  margin-bottom: 18px;
}

.forgot-link a {
  color: #004ce8;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
}

.forgot-link a:hover {
  text-decoration: underline;
}

/* ================================
   SIGN IN BUTTON
================================ */
.login-btn {
  width: 100%;
  padding: 16px;
  background: #004ce8;
  color: white;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 5px;
}

.login-btn:hover {
  background: #0037b8;
}

/* ================================
   RESPONSIVE
================================ */
@media (max-width: 1100px) {
  .login-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .left-section {
    padding: 40px;
    height: auto;
    text-align: center;
  }

  .audit-image {
    width: 70%;
  }

  .login-box {
    width: 90%;
  }
}
