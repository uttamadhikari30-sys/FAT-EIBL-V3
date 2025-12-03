import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔐 Updated Login UI Page
import LoginPage from "./pages/LoginPage";

// Existing Pages
import OtpLogin from "./pages/OtpLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";

// ⭐ INVITE SYSTEM (NEW IMPORTS)
import InviteUser from "./components/InviteUser";
import AcceptInvite from "./components/AcceptInvite";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ⭐ UPDATED LOGIN ROUTE (New UI Page) */}
        <Route path="/" element={<LoginPage />} />

        {/* EXISTING ROUTES */}
        <Route path="/otp-login" element={<OtpLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ⭐ NEW ROUTES FOR INVITE SYSTEM */}
        <Route path="/admin/invite" element={<InviteUser />} />
        <Route path="/invite/accept" element={<AcceptInvite />} />

      </Routes>
    </BrowserRouter>
  );
}
