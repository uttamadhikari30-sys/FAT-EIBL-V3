import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
import AIChat from "./AIChat";

export default function App(){
  return (
    <div>
      <div className="appbar">
        <img src="/public/logo.png" alt="logo" />
        <div className="brand">FAT-EIBL</div>
        <nav style={{marginLeft:"auto"}}>
          <Link to="/">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/ai">Hey Vani</Link>
        </nav>
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ai" element={<AIChat />} />
        </Routes>
      </div>
    </div>
  );
}
