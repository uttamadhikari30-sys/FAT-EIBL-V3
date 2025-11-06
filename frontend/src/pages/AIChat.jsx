import React, { useState, useRef } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AIChat(){
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const recRef = useRef(null);

  const ask = async ()=>{
    const form = new FormData();
    form.append("prompt", prompt);
    const res = await fetch(`${API}/ai/chat`, { method:"POST", body: form });
    const data = await res.json();
    setReply(data.reply || "No response");
  };

  const startVoice = ()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) { alert("Speech recognition not supported in this browser."); return; }
    const rec = new SR();
    rec.lang = "en-US"; // can be extended to hi-IN, mr-IN
    rec.onresult = (e)=>{
      const text = e.results[0][0].transcript;
      setPrompt(text);
    };
    rec.start();
    recRef.current = rec;
  };

  return (
    <div>
      <h1>Hey Vani (AI Assistant)</h1>
      <p className="muted">Ask in English / Hindi / Marathi. Requires OPENAI_API_KEY in backend.</p>
      <div style={{display:"flex", gap:8}}>
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ask: Show pending tasks this week" style={{flex:1}}/>
        <button className="btn" onClick={ask}>Ask</button>
        <button className="btn" onClick={startVoice}>🎤 Speak</button>
      </div>
      <div className="card" style={{marginTop:12}}>
        <strong>Vani:</strong>
        <div>{reply}</div>
      </div>
    </div>
  );
}
