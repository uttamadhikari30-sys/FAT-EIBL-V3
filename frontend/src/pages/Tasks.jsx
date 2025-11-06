import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Uploader({ taskId, onDone }){
  const [file, setFile] = useState(null);
  const upload = async () => {
    if(!file) return alert("Select a file");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/upload/${taskId}`, { method:"POST", body: form });
    if(res.ok){ setFile(null); onDone && onDone(); alert("Uploaded!"); } else alert("Upload failed");
  };
  return (
    <div style={{display:"flex", gap:8}}>
      <input type="file" onChange={e=>setFile(e.target.files[0])}/>
      <button className="btn" onClick={upload}>Upload</button>
    </div>
  );
}

export default function Tasks(){
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title:"", department:"", assignee:"", status:"Pending", priority:"" });

  const load = async ()=>{
    const res = await fetch(`${API}/tasks`);
    setTasks(await res.json());
  };
  useEffect(()=>{ load(); },[]);

  const create = async (e)=>{
    e.preventDefault();
    const res = await fetch(`${API}/tasks`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
    if(res.ok){ setForm({ title:"", department:"", assignee:"", status:"Pending", priority:"" }); load(); }
  };

  const seed = async ()=>{ await fetch(`${API}/seed`); load(); };

  return (
    <div>
      <h1>Work Task Listing</h1>
      <div style={{display:"flex", gap:10}}>
        <button className="btn" onClick={seed}>Seed Sample</button>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      <h3>Create Task</h3>
      <form onSubmit={create} style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8}}>
        <input placeholder="Title" required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
        <input placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})}/>
        <input placeholder="Assignee" value={form.assignee} onChange={e=>setForm({...form, assignee:e.target.value})}/>
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option>Pending</option><option>In Progress</option><option>Done</option>
        </select>
        <input placeholder="Priority" value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}/>
        <button className="btn" type="submit" style={{gridColumn:"span 5"}}>Add Task</button>
      </form>

      <h3>Tasks</h3>
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Dept</th><th>Assignee</th><th>Status</th><th>Priority</th><th>Attachment</th><th>Upload</th></tr></thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td><td>{t.title}</td><td>{t.department||""}</td><td>{t.assignee||""}</td>
              <td>{t.status}</td><td>{t.priority||""}</td><td>{t.attachment||"-"}</td>
              <td><Uploader taskId={t.id} onDone={load}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
