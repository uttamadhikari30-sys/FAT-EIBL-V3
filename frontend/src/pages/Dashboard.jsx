import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "https://fat-eibl-backend.onrender.com";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error("Failed to load tasks");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error loading tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [API_URL]);

  return (
    <div style={{ textAlign: "center", marginTop: "60px", fontFamily: "Arial" }}>
      <h1 style={{ color: "#0047AB" }}>Finance Audit Dashboard</h1>
      <h3 style={{ color: "#666" }}>Edme Insurance Brokers Limited</h3>
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            margin: "30px auto",
            borderCollapse: "collapse",
            width: "80%",
            background: "#f9f9f9",
          }}
        >
          <thead>
            <tr style={{ background: "#0047AB", color: "white" }}>
              <th>ID</th>
              <th>Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
