import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard(){
  const [stats, setStats] = useState({ total: 0, pending: 0, done: 0 });

  useEffect(()=>{
    fetch(`${API}/tasks`).then(r=>r.json()).then(list=>{
      const total = list.length;
      const done = list.filter(x=>x.status === "Done").length;
      const pending = list.filter(x=>x.status !== "Done").length;
      setStats({ total, done, pending });
    });
  },[]);

  return (
    <div>
      <h1>Welcome to FAT-EIBL</h1>
      <p className="muted">Finance Audit Tracker – Edme Insurance Brokers Limited</p>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12}}>
        <div className="card"><h3>Total Tasks</h3><div style={{fontSize:30}}>{stats.total}</div></div>
        <div className="card"><h3>Pending</h3><div style={{fontSize:30}}>{stats.pending}</div></div>
        <div className="card"><h3>Done</h3><div style={{fontSize:30}}>{stats.done}</div></div>
      </div>
    </div>
  );
}
