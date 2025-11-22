import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import SetPassword from "./SetPassword.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import Dashboard from "./Dashboard.jsx";
import AdminUsers from "./AdminUsers.jsx";

export default function App() {
  console.log("App.jsx loaded");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
