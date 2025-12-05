import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ⭐ Updated Premium Login UI Page
import LoginPage from "./pages/Login";

// Existing Pages
import OtpLogin from "./pages/OtpLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";

// ⭐ Invite System Pages
import InviteUser from "./components/InviteUser";
import AcceptInvite from "./components/AcceptInvite";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ⭐ DEFAULT ROUTE - Premium Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* AUTH ROUTES */}
        <Route path="/otp-login" element={<OtpLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PRIMARY DASHBOARD ROUTES */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ⭐ INVITE SYSTEM ROUTES */}
        <Route path="/admin/invite" element={<InviteUser />} />
        <Route path="/invite/accept" element={<AcceptInvite />} />
      </Routes>
    </BrowserRouter>
  );
}
