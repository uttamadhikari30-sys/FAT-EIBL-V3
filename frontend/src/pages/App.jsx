// frontend/src/pages/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import SetPassword from "./SetPassword.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  console.log("App.jsx loaded");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* User sets password from invite */}
        <Route path="/set-password" element={<SetPassword />} />

        {/* Forgot password flow */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all route */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
