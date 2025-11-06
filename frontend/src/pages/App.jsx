import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx"; // ✅ Make sure this file exists in the same folder
import Dashboard from "./Dashboard.jsx"; // Optional if you have one

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
