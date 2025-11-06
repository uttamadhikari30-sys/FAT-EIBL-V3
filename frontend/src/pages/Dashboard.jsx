import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL (Render)
  const API_URL = import.meta.env.VITE_API_URL || "https://fat-eibl-backend-x1sp.onrender.com";

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`${API_URL}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [API_URL]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fc", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "#0047AB", textAlign: "center" }}>Finance Audit Dashboard</h1>
      <h3 style={{ textAlign: "center", color: "#555" }}>
        Edme Insurance Brokers Limited
      </h3>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading tasks...</p>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <table
            style={{
              borderCollapse: "collapse",
              margin: "0 auto",
              width: "90%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#0047AB", color: "white" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Task Title</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td style={{ padding: "10px", textAlign: "center" }}>{task.id}</td>
                    <td style={{ padding: "10px" }}>{task.title}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{task.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
