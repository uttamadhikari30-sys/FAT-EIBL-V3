import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import SetPassword from "./SetPassword.jsx";   // Invite password page
import Dashboard from "./Dashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Login />} />

        {/* Auth routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* After login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
