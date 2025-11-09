import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx"; // ✅ Import added

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default login page */}
        <Route path="/" element={<Login />} />

        {/* Regular user dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ Admin dashboard route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
