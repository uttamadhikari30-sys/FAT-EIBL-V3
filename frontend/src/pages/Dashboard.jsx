import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const emptyTask = {
  title: "",
  description: "",
  status: "Open",
  priority: "Medium",
  due_date: "",
  owner_id: "",
};

const emptyUser = {
  name: "",
  email: "",
  department: "",
  reporting_manager: "",
  role: "Auditee",
  password: "",
};

const emptyRequirement = {
  title: "",
  department: "Finance",
  audit_area: "",
  request_details: "",
  priority: "Medium",
  requested_by_id: "",
  auditee_id: "",
  due_date: "",
  evidence_name: "",
};

const emptyPrepaid = {
  voucher_no: "",
  addition_date: "",
  party_code: "",
  party_name: "",
  prepaid_ledger_code: "",
  prepaid_ledger_name: "",
  expense_code: "",
  expense_head: "",
  amount_paid: "",
  period_from: "",
  period_to: "",
  prepaid_opening: "",
  apr_25: "",
  may_25: "",
  jun_25: "",
};

const requirementStatuses = ["Pending Response", "Submitted", "Query Raised", "Closed"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [prepaids, setPrepaids] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [userForm, setUserForm] = useState(emptyUser);
  const [requirementForm, setRequirementForm] = useState(emptyRequirement);
  const [prepaidForm, setPrepaidForm] = useState(emptyPrepaid);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const currentUser = JSON.parse(localStorage.getItem("fatUser") || "{}");

  async function loadData() {
    const [
      summaryRes,
      tasksRes,
      usersRes,
      requirementsRes,
      prepaidsRes,
      departmentsRes,
    ] = await Promise.all([
      fetch(`${API_URL}/dashboard/summary`),
      fetch(`${API_URL}/tasks`),
      fetch(`${API_URL}/users`),
      fetch(`${API_URL}/requirements`),
      fetch(`${API_URL}/prepaids`),
      fetch(`${API_URL}/dashboard/departments`),
    ]);

    const [
      summaryData,
      tasksData,
      usersData,
      requirementsData,
      prepaidData,
      departmentsData,
    ] = await Promise.all([
      summaryRes.json(),
      tasksRes.json(),
      usersRes.json(),
      requirementsRes.json(),
      prepaidsRes.json(),
      departmentsRes.json(),
    ]);

    setSummary(summaryData);
    setTasks(tasksData);
    setUsers(usersData);
    setRequirements(requirementsData);
    setPrepaids(prepaidData);
    setDepartments(departmentsData);
  }

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load audit workspace data."));
  }, []);

  async function submitJson(url, payload, successMessage, resetter) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.detail || "Action failed.");
      return;
    }
    if (resetter) {
      resetter();
    }
    setMessage(successMessage);
    await loadData();
  }

  async function handleTaskSubmit(event) {
    event.preventDefault();
    await submitJson(
      `${API_URL}/tasks`,
      { ...taskForm, owner_id: taskForm.owner_id ? Number(taskForm.owner_id) : null },
      "Task created successfully.",
      () => setTaskForm(emptyTask)
    );
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    await submitJson(`${API_URL}/users`, userForm, "Team member added successfully.", () =>
      setUserForm(emptyUser)
    );
  }

  async function handleRequirementSubmit(event) {
    event.preventDefault();
    await submitJson(
      `${API_URL}/requirements`,
      {
        ...requirementForm,
        requested_by_id: Number(requirementForm.requested_by_id),
        auditee_id: Number(requirementForm.auditee_id),
      },
      "Audit requirement raised successfully.",
      () => setRequirementForm(emptyRequirement)
    );
  }

  async function handlePrepaidSubmit(event) {
    event.preventDefault();
    await submitJson(
      `${API_URL}/prepaids`,
      {
        ...prepaidForm,
        amount_paid: Number(prepaidForm.amount_paid || 0),
        prepaid_opening: Number(prepaidForm.prepaid_opening || 0),
        apr_25: Number(prepaidForm.apr_25 || 0),
        may_25: Number(prepaidForm.may_25 || 0),
        jun_25: Number(prepaidForm.jun_25 || 0),
      },
      "Prepaid chart entry added.",
      () => setPrepaidForm(emptyPrepaid)
    );
  }

  async function updateTaskStatus(taskId, status) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setMessage(`Task moved to ${status}.`);
      await loadData();
    }
  }

  async function updateRequirement(item, status) {
    const response = await fetch(`${API_URL}/requirements/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        response_note: item.response_note || "",
        evidence_name: item.evidence_name || "",
      }),
    });
    if (response.ok) {
      setMessage(`Requirement updated to ${status}.`);
      await loadData();
    }
  }

  async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, { method: "DELETE" });
    if (response.ok) {
      setMessage("Team member removed.");
      await loadData();
    }
  }

  const overviewCards = useMemo(() => {
    if (!summary) {
      return [];
    }
    return [
      { label: "Requirements", value: summary.requirements_total, tone: "blue" },
      { label: "Pending reply", value: summary.requirements_pending, tone: "amber" },
      { label: "Submitted", value: summary.requirements_submitted, tone: "teal" },
      { label: "Closed", value: summary.requirements_closed, tone: "green" },
      { label: "Action items", value: summary.total_tasks, tone: "navy" },
      { label: "Prepaid entries", value: summary.prepaid_entries, tone: "rose" },
    ];
  }, [summary]);

  function logout() {
    localStorage.removeItem("fatToken");
    localStorage.removeItem("fatUser");
    navigate("/");
  }

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Audit software</p>
          <h1>Finance audit management workspace</h1>
          <p className="topbar-copy">
            Raise requirements, follow auditee responses, monitor department pendency,
            and manage the prepaid chart in one place.
          </p>
        </div>
        <div className="topbar-actions">
          <div className="user-chip">
            <strong>{currentUser.name || "Audit User"}</strong>
            <span>{currentUser.role || "User"}</span>
          </div>
          <button className="secondary-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="workspace-tabs">
        {[
          ["overview", "Overview"],
          ["requirements", "Requirements"],
          ["prepaid", "Prepaid Chart"],
          ["team", "Team"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={activeTab === id ? "workspace-tab active" : "workspace-tab"}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {message ? <p className="status-banner">{message}</p> : null}

      {activeTab === "overview" ? (
        <>
          <section className="stats-grid">
            {overviewCards.map((card) => (
              <article key={card.label} className={`stat-card stat-${card.tone}`}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </section>

          <section className="overview-grid">
            <div className="panel panel-wide">
              <div className="panel-heading">
                <h2>Department pendency</h2>
                <p>Graphical drill view for pending and completed audit requirements.</p>
              </div>
              <div className="department-bars">
                {departments.map((item) => {
                  const total = item.pending + item.completed || 1;
                  const completeWidth = `${(item.completed / total) * 100}%`;
                  return (
                    <article className="dept-card" key={item.department}>
                      <div className="dept-head">
                        <div>
                          <h3>{item.department}</h3>
                          <p>{item.high_priority} high-priority items</p>
                        </div>
                        <strong>{item.pending} pending</strong>
                      </div>
                      <div className="dept-progress">
                        <span style={{ width: completeWidth }} />
                      </div>
                      <div className="dept-foot">
                        <span>{item.completed} completed</span>
                        <span>{total} total</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h2>Create action item</h2>
                <p>Track internal follow-ups and audit closure work.</p>
              </div>
              <form className="stack-form" onSubmit={handleTaskSubmit}>
                <input
                  placeholder="Task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
                <textarea
                  rows="4"
                  placeholder="Task description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  required
                />
                <div className="dual-field">
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                  required
                />
                <select
                  value={taskForm.owner_id}
                  onChange={(e) => setTaskForm({ ...taskForm, owner_id: e.target.value })}
                >
                  <option value="">Assign owner</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button className="primary-btn" type="submit">
                  Save action item
                </button>
              </form>
            </div>

            <div className="panel panel-wide">
              <div className="panel-heading">
                <h2>Open action tracker</h2>
                <p>Quick movement of audit tasks between open, in progress, and complete.</p>
              </div>
              <div className="task-list">
                {tasks.map((task) => (
                  <article className="task-card" key={task.id}>
                    <div className="task-card-header">
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                      </div>
                      <span className={`pill pill-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-meta">
                      <span>Owner: {task.owner_name}</span>
                      <span>Due: {task.due_date}</span>
                    </div>
                    <div className="task-actions">
                      {["Open", "In Progress", "Completed"].map((status) => (
                        <button
                          key={status}
                          className={task.status === status ? "filter-chip active" : "filter-chip"}
                          onClick={() => updateTaskStatus(task.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "requirements" ? (
        <section className="content-grid">
          <div className="panel panel-wide">
            <div className="panel-heading">
              <h2>Audit requirement register</h2>
              <p>Auditors can raise points, monitor responses, and close or reopen items.</p>
            </div>
            <div className="requirement-list">
              {requirements.map((item) => (
                <article className="requirement-card" key={item.id}>
                  <div className="requirement-head">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.audit_area}</p>
                    </div>
                    <span className={`pill pill-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="requirement-copy">{item.request_details}</p>
                  <div className="task-meta">
                    <span>Department: {item.department}</span>
                    <span>Auditor: {item.requested_by_name}</span>
                    <span>Auditee: {item.auditee_name}</span>
                    <span>Due: {item.due_date}</span>
                  </div>
                  <div className="response-box">
                    <strong>Response / evidence</strong>
                    <p>{item.response_note || "Waiting for auditee response."}</p>
                    <span>{item.evidence_name || "No file noted yet"}</span>
                  </div>
                  <div className="task-actions">
                    {requirementStatuses.map((status) => (
                      <button
                        key={status}
                        className={item.status === status ? "filter-chip active" : "filter-chip"}
                        onClick={() => updateRequirement(item, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h2>Raise requirement</h2>
              <p>Create a department-wise audit request with due date and owner.</p>
            </div>
            <form className="stack-form" onSubmit={handleRequirementSubmit}>
              <input
                placeholder="Requirement title"
                value={requirementForm.title}
                onChange={(e) =>
                  setRequirementForm({ ...requirementForm, title: e.target.value })
                }
                required
              />
              <input
                placeholder="Audit area"
                value={requirementForm.audit_area}
                onChange={(e) =>
                  setRequirementForm({ ...requirementForm, audit_area: e.target.value })
                }
                required
              />
              <select
                value={requirementForm.department}
                onChange={(e) =>
                  setRequirementForm({ ...requirementForm, department: e.target.value })
                }
              >
                {["Finance", "Operations", "IT", "Claims"].map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
              <textarea
                rows="5"
                placeholder="Requirement details"
                value={requirementForm.request_details}
                onChange={(e) =>
                  setRequirementForm({
                    ...requirementForm,
                    request_details: e.target.value,
                  })
                }
                required
              />
              <div className="dual-field">
                <select
                  value={requirementForm.priority}
                  onChange={(e) =>
                    setRequirementForm({ ...requirementForm, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <input
                  type="date"
                  value={requirementForm.due_date}
                  onChange={(e) =>
                    setRequirementForm({ ...requirementForm, due_date: e.target.value })
                  }
                  required
                />
              </div>
              <select
                value={requirementForm.requested_by_id}
                onChange={(e) =>
                  setRequirementForm({
                    ...requirementForm,
                    requested_by_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Select auditor</option>
                {users
                  .filter((user) => user.role === "Auditor" || user.role === "Admin")
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
              <select
                value={requirementForm.auditee_id}
                onChange={(e) =>
                  setRequirementForm({ ...requirementForm, auditee_id: e.target.value })
                }
                required
              >
                <option value="">Select auditee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Initial evidence filename (optional)"
                value={requirementForm.evidence_name}
                onChange={(e) =>
                  setRequirementForm({
                    ...requirementForm,
                    evidence_name: e.target.value,
                  })
                }
              />
              <button className="primary-btn" type="submit">
                Raise requirement
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {activeTab === "prepaid" ? (
        <section className="content-grid">
          <div className="panel panel-wide">
            <div className="panel-heading">
              <h2>Prepaid chart</h2>
              <p>Track prepaid opening, monthly amortisation, and residual balance.</p>
            </div>
            <div className="prepaid-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Voucher</th>
                    <th>Party</th>
                    <th>Expense Head</th>
                    <th>Amount Paid</th>
                    <th>Opening</th>
                    <th>Apr-25</th>
                    <th>May-25</th>
                    <th>Jun-25</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {prepaids.map((item) => (
                    <tr key={item.id}>
                      <td>{item.voucher_no}</td>
                      <td>{item.party_name}</td>
                      <td>{item.expense_head}</td>
                      <td>{item.amount_paid.toLocaleString()}</td>
                      <td>{item.prepaid_opening.toLocaleString()}</td>
                      <td>{item.apr_25.toLocaleString()}</td>
                      <td>{item.may_25.toLocaleString()}</td>
                      <td>{item.jun_25.toLocaleString()}</td>
                      <td>{item.prepaid_balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h2>Add prepaid entry</h2>
              <p>Capture new prepaid schedules from the finance register.</p>
            </div>
            <form className="stack-form" onSubmit={handlePrepaidSubmit}>
              <input
                placeholder="Voucher number"
                value={prepaidForm.voucher_no}
                onChange={(e) => setPrepaidForm({ ...prepaidForm, voucher_no: e.target.value })}
                required
              />
              <input
                type="date"
                value={prepaidForm.addition_date}
                onChange={(e) =>
                  setPrepaidForm({ ...prepaidForm, addition_date: e.target.value })
                }
                required
              />
              <input
                placeholder="Party code"
                value={prepaidForm.party_code}
                onChange={(e) => setPrepaidForm({ ...prepaidForm, party_code: e.target.value })}
                required
              />
              <input
                placeholder="Party name"
                value={prepaidForm.party_name}
                onChange={(e) => setPrepaidForm({ ...prepaidForm, party_name: e.target.value })}
                required
              />
              <input
                placeholder="Prepaid ledger code"
                value={prepaidForm.prepaid_ledger_code}
                onChange={(e) =>
                  setPrepaidForm({ ...prepaidForm, prepaid_ledger_code: e.target.value })
                }
                required
              />
              <input
                placeholder="Prepaid ledger name"
                value={prepaidForm.prepaid_ledger_name}
                onChange={(e) =>
                  setPrepaidForm({ ...prepaidForm, prepaid_ledger_name: e.target.value })
                }
                required
              />
              <input
                placeholder="Expense code"
                value={prepaidForm.expense_code}
                onChange={(e) =>
                  setPrepaidForm({ ...prepaidForm, expense_code: e.target.value })
                }
                required
              />
              <input
                placeholder="Expense head"
                value={prepaidForm.expense_head}
                onChange={(e) =>
                  setPrepaidForm({ ...prepaidForm, expense_head: e.target.value })
                }
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount paid"
                value={prepaidForm.amount_paid}
                onChange={(e) =>
                  setPrepaidForm({ ...prepaidForm, amount_paid: e.target.value })
                }
                required
              />
              <div className="dual-field">
                <input
                  type="date"
                  value={prepaidForm.period_from}
                  onChange={(e) =>
                    setPrepaidForm({ ...prepaidForm, period_from: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  value={prepaidForm.period_to}
                  onChange={(e) =>
                    setPrepaidForm({ ...prepaidForm, period_to: e.target.value })
                  }
                  required
                />
              </div>
              <div className="dual-field">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prepaid opening"
                  value={prepaidForm.prepaid_opening}
                  onChange={(e) =>
                    setPrepaidForm({ ...prepaidForm, prepaid_opening: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Apr-25"
                  value={prepaidForm.apr_25}
                  onChange={(e) => setPrepaidForm({ ...prepaidForm, apr_25: e.target.value })}
                  required
                />
              </div>
              <div className="dual-field">
                <input
                  type="number"
                  step="0.01"
                  placeholder="May-25"
                  value={prepaidForm.may_25}
                  onChange={(e) => setPrepaidForm({ ...prepaidForm, may_25: e.target.value })}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Jun-25"
                  value={prepaidForm.jun_25}
                  onChange={(e) => setPrepaidForm({ ...prepaidForm, jun_25: e.target.value })}
                  required
                />
              </div>
              <button className="primary-btn" type="submit">
                Add prepaid entry
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {activeTab === "team" ? (
        <section className="content-grid">
          <div className="panel panel-wide">
            <div className="panel-heading">
              <h2>Department-wise user control</h2>
              <p>Create users, assign reporting managers, and maintain audit roles.</p>
            </div>
            <div className="team-list">
              {users.map((user) => (
                <article className="team-card" key={user.id}>
                  <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="team-meta">
                    <span>{user.department}</span>
                    <span>{user.role}</span>
                    <span>Manager: {user.reporting_manager || "Not assigned"}</span>
                  </div>
                  {user.email !== "admin@edmeinsurance.com" ? (
                    <button className="secondary-btn" onClick={() => deleteUser(user.id)}>
                      Remove
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h2>Add team member</h2>
              <p>Create department-wise users with role and reporting manager.</p>
            </div>
            <form className="stack-form" onSubmit={handleUserSubmit}>
              <input
                placeholder="Full name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
              <input
                placeholder="Department"
                value={userForm.department}
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                required
              />
              <input
                placeholder="Reporting manager"
                value={userForm.reporting_manager}
                onChange={(e) =>
                  setUserForm({ ...userForm, reporting_manager: e.target.value })
                }
              />
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option>Auditee</option>
                <option>Auditor</option>
                <option>Admin</option>
              </select>
              <input
                type="password"
                placeholder="Temporary password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
              />
              <button className="primary-btn" type="submit">
                Add member
              </button>
            </form>
          </div>
        </section>
      ) : null}
    </div>
  );
}
