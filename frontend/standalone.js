const STORAGE_KEY = "fat-audit-standalone-state";

const roles = [
  { id: "cfo", icon: "👑", name: "CFO", note: "Full access" },
  { id: "ceo", icon: "🎯", name: "CEO", note: "Executive" },
  { id: "head", icon: "📊", name: "Business Head", note: "Vertical" },
  { id: "finance", icon: "📋", name: "Finance", note: "MIS & reports" },
];

const seedState = {
  currentUser: null,
  users: [
    {
      id: 1,
      name: "Audit Administrator",
      email: "admin@edmeinsurance.com",
      department: "Internal Audit",
      reportingManager: "CFO Office",
      role: "Admin",
      password: "Admin@123",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@edmeinsurance.com",
      department: "Finance",
      reportingManager: "Rakesh Nair",
      role: "Auditee",
      password: "Welcome@123",
    },
    {
      id: 3,
      name: "Rahul Menon",
      email: "rahul.menon@edmeinsurance.com",
      department: "Operations",
      reportingManager: "Sonal Deshpande",
      role: "Auditor",
      password: "Welcome@123",
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Validate premium reconciliation",
      description: "Review February premium statements against the ledger and flag variances above 2%.",
      status: "In Progress",
      priority: "High",
      dueDate: "2026-04-30",
      ownerId: 2,
    },
    {
      id: 2,
      title: "Refresh control testing plan",
      description: "Update control owners, evidence frequency, and escalation notes for Q2 walkthroughs.",
      status: "Open",
      priority: "Medium",
      dueDate: "2026-05-04",
      ownerId: 3,
    },
  ],
  requirements: [
    {
      id: 1,
      title: "Upload premium reconciliation workbook",
      department: "Finance",
      auditArea: "Revenue Assurance",
      requestDetails: "Share ledger-to-banker reconciliation with commentary for all unexplained differences above INR 50,000.",
      status: "Pending Response",
      priority: "High",
      requestedById: 3,
      auditeeId: 2,
      dueDate: "2026-05-03",
      responseNote: "",
      evidenceName: "Pending",
    },
    {
      id: 2,
      title: "Clarify prepaid insurance schedule variance",
      department: "Finance",
      auditArea: "Prepaids",
      requestDetails: "Explain mismatch between prepaid register and monthly expense release for fleet insurance.",
      status: "Query Raised",
      priority: "High",
      requestedById: 3,
      auditeeId: 2,
      dueDate: "2026-05-01",
      responseNote: "Need one more supporting journal and policy copy.",
      evidenceName: "Fleet_Insurance_Schedule.pdf",
    },
  ],
  prepaids: [
    {
      id: 1,
      voucherNo: "JV24001",
      partyName: "Secure Brokers Services",
      expenseHead: "Insurance",
      amountPaid: 360000,
      prepaidOpening: 360000,
      apr25: 30000,
      may25: 30000,
      jun25: 30000,
    },
    {
      id: 2,
      voucherNo: "JV24008",
      partyName: "Orbit Technologies",
      expenseHead: "Software Maintenance",
      amountPaid: 120000,
      prepaidOpening: 120000,
      apr25: 10000,
      may25: 10000,
      jun25: 10000,
    },
  ],
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return structuredClone(seedState);
  }
  return JSON.parse(raw);
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function byId(items) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function render() {
  const state = loadState();
  const app = document.getElementById("app");
  app.innerHTML = "";
  if (!state.currentUser) {
    renderLogin(app, state);
    return;
  }
  renderDashboard(app, state);
}

function renderLogin(app, state) {
  const shell = document.createElement("div");
  shell.className = "app-shell login-shell";
  shell.innerHTML = `
    <section class="login-brand">
      <div class="brand-block">
        <p class="brand-kicker">FAT-EIBL Workspace</p>
        <h1 class="brand-title">FINMIND <span>AI</span></h1>
        <p class="brand-copy">Audit management software for raising requirements, following auditee responses, monitoring department pendency, and maintaining the prepaid chart in one place.</p>
        <div class="brand-badges">
          <span>FY 2025-26</span>
          <span>Department-wise dashboard</span>
          <span>Audit requirement workflow</span>
          <span>Prepaid chart module</span>
        </div>
      </div>
    </section>
    <section class="login-panel">
      <div class="login-card">
        <div class="card-logo">AI</div>
        <h1 class="card-title">Welcome Back</h1>
        <p class="card-subtitle">Edme Insurance Brokers Limited · audit operations console</p>
        <div class="role-grid"></div>
        <p class="field-label">Email address</p>
        <div class="field-shell"><span>👤</span><input id="login-email" value="admin@edmeinsurance.com" placeholder="Email" /></div>
        <p class="field-label">Password</p>
        <div class="field-shell"><span>🔒</span><input id="login-password" type="password" value="Admin@123" placeholder="Password" /></div>
        <div class="helper-row">
          <span>Demo access is prefilled</span>
          <span>256-bit SSL protected</span>
        </div>
        <button class="primary-btn" id="login-submit">Sign in to FINMIND AI →</button>
        <p class="footer-note">Use demo login: admin@edmeinsurance.com / Admin@123</p>
      </div>
    </section>
  `;
  const roleGrid = shell.querySelector(".role-grid");
  roles.forEach((role, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `role-card ${index === 0 ? "active" : ""}`;
    card.innerHTML = `<div>${role.icon}</div><strong>${role.name}</strong><small>${role.note}</small>`;
    card.addEventListener("click", () => {
      roleGrid.querySelectorAll(".role-card").forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
    });
    roleGrid.appendChild(card);
  });
  shell.querySelector("#login-submit").addEventListener("click", () => {
    const email = shell.querySelector("#login-email").value.trim().toLowerCase();
    const password = shell.querySelector("#login-password").value;
    const user = state.users.find((item) => item.email.toLowerCase() === email && item.password === password);
    if (!user) {
      alert("Invalid email or password.");
      return;
    }
    state.currentUser = { id: user.id, name: user.name, role: user.role };
    saveState(state);
    render();
  });
  app.appendChild(shell);
}

function renderDashboard(app, state) {
  const usersById = byId(state.users);
  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">Audit software</p>
        <h1>Finance audit management workspace</h1>
        <p class="topbar-copy">Raise audit requirements, track auditee responses, manage department users, and maintain the prepaid chart from a single live dashboard.</p>
      </div>
      <div class="row-between">
        <div class="user-chip">
          <strong>${state.currentUser.name}</strong>
          <span>${state.currentUser.role}</span>
        </div>
        <button class="secondary-btn" id="logout-btn">Sign out</button>
      </div>
    </header>
    <nav class="workspace-tabs">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="requirements">Requirements</button>
      <button class="tab-btn" data-tab="prepaid">Prepaid Chart</button>
      <button class="tab-btn" data-tab="team">Team</button>
    </nav>
    <div class="status-banner">Live local demo loaded successfully. Changes you make here are saved in your browser.</div>
    <section id="tab-overview"></section>
    <section id="tab-requirements" class="hidden"></section>
    <section id="tab-prepaid" class="hidden"></section>
    <section id="tab-team" class="hidden"></section>
  `;
  shell.querySelector("#logout-btn").addEventListener("click", () => {
    state.currentUser = null;
    saveState(state);
    render();
  });
  shell.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      shell.querySelectorAll(".tab-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      ["overview", "requirements", "prepaid", "team"].forEach((tab) => {
        shell.querySelector(`#tab-${tab}`).classList.toggle("hidden", tab !== button.dataset.tab);
      });
    });
  });
  renderOverview(shell.querySelector("#tab-overview"), state, usersById);
  renderRequirements(shell.querySelector("#tab-requirements"), state, usersById);
  renderPrepaids(shell.querySelector("#tab-prepaid"), state);
  renderTeam(shell.querySelector("#tab-team"), state);
  app.appendChild(shell);
}

function renderOverview(root, state, usersById) {
  const pendingRequirements = state.requirements.filter((item) => item.status !== "Closed" && item.status !== "Submitted").length;
  const submitted = state.requirements.filter((item) => item.status === "Submitted").length;
  const closed = state.requirements.filter((item) => item.status === "Closed").length;
  const departments = [...new Set(state.requirements.map((item) => item.department))].map((department) => {
    const items = state.requirements.filter((item) => item.department === department);
    return {
      department,
      pending: items.filter((item) => item.status !== "Closed" && item.status !== "Submitted").length,
      completed: items.filter((item) => item.status === "Closed" || item.status === "Submitted").length,
      high: items.filter((item) => item.priority === "High").length,
    };
  });

  root.innerHTML = `
    <div class="stats-grid">
      ${[
        ["Requirements", state.requirements.length],
        ["Pending reply", pendingRequirements],
        ["Submitted", submitted],
        ["Closed", closed],
        ["Action items", state.tasks.length],
        ["Prepaid entries", state.prepaids.length],
      ]
        .map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`)
        .join("")}
    </div>
    <div class="layout-grid">
      <div class="panel">
        <h2>Department pendency</h2>
        <p class="panel-copy">Graphical drill view for pending and completed audit requirements.</p>
        <div class="dept-list">
          ${departments
            .map((item) => {
              const total = item.pending + item.completed || 1;
              return `
                <article class="dept-card">
                  <div class="row-between">
                    <div>
                      <strong>${item.department}</strong>
                      <div class="muted">${item.high} high-priority items</div>
                    </div>
                    <strong>${item.pending} pending</strong>
                  </div>
                  <div class="progress-track"><div class="progress-bar" style="width:${(item.completed / total) * 100}%"></div></div>
                  <div class="meta-row" style="margin-top:10px">
                    <span class="muted">${item.completed} completed</span>
                    <span class="muted">${total} total</span>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Create action item</h2>
        <p class="panel-copy">Track internal follow-ups and closure work.</p>
        <form id="task-form" class="stack">
          <div><p class="field-label">Task title</p><div class="field-shell"><span>📝</span><input name="title" required /></div></div>
          <div><p class="field-label">Description</p><div class="field-shell"><span>📄</span><textarea name="description" required></textarea></div></div>
          <div class="grid-2">
            <div><p class="field-label">Priority</p><div class="field-shell"><select name="priority"><option>Low</option><option selected>Medium</option><option>High</option></select></div></div>
            <div><p class="field-label">Status</p><div class="field-shell"><select name="status"><option selected>Open</option><option>In Progress</option><option>Completed</option></select></div></div>
          </div>
          <div><p class="field-label">Due date</p><div class="field-shell"><input type="date" name="dueDate" required /></div></div>
          <div><p class="field-label">Owner</p><div class="field-shell"><select name="ownerId">${state.users.map((user) => `<option value="${user.id}">${user.name}</option>`).join("")}</select></div></div>
          <button class="primary-btn" type="submit">Save action item</button>
        </form>
      </div>
      <div class="panel" style="grid-column: span 2;">
        <h2>Open action tracker</h2>
        <p class="panel-copy">Quick movement of audit tasks between open, in progress, and complete.</p>
        <div class="card-list">
          ${state.tasks
            .map(
              (task) => `
                <article class="data-card requirement-card">
                  <div class="row-between">
                    <div>
                      <strong>${task.title}</strong>
                      <div class="muted">${task.description}</div>
                    </div>
                    <span class="pill ${task.priority.toLowerCase()}">${task.priority}</span>
                  </div>
                  <div class="meta-row" style="margin:12px 0;">
                    <span class="muted">Owner: ${usersById[task.ownerId]?.name || "Unassigned"}</span>
                    <span class="muted">Due: ${task.dueDate}</span>
                  </div>
                  <div class="chip-row">
                    ${["Open", "In Progress", "Completed"]
                      .map(
                        (status) =>
                          `<button class="chip-btn ${task.status === status ? "active" : ""}" data-task-id="${task.id}" data-task-status="${status}">${status}</button>`
                      )
                      .join("")}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  root.querySelector("#task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.tasks.unshift({
      id: nextId(state.tasks),
      title: form.get("title"),
      description: form.get("description"),
      priority: form.get("priority"),
      status: form.get("status"),
      dueDate: form.get("dueDate"),
      ownerId: Number(form.get("ownerId")),
    });
    saveState(state);
    render();
  });

  root.querySelectorAll("[data-task-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find((item) => item.id === Number(button.dataset.taskId));
      task.status = button.dataset.taskStatus;
      saveState(state);
      render();
    });
  });
}

function renderRequirements(root, state, usersById) {
  root.innerHTML = `
    <div class="layout-grid">
      <div class="panel">
        <h2>Audit requirement register</h2>
        <p class="panel-copy">Auditors can raise points, monitor responses, and close or reopen items.</p>
        <div class="card-list">
          ${state.requirements
            .map(
              (item) => `
                <article class="requirement-card">
                  <div class="row-between">
                    <div>
                      <strong>${item.title}</strong>
                      <div class="muted">${item.auditArea}</div>
                    </div>
                    <span class="pill ${item.priority.toLowerCase()}">${item.priority}</span>
                  </div>
                  <p class="muted">${item.requestDetails}</p>
                  <div class="meta-row">
                    <span class="muted">Department: ${item.department}</span>
                    <span class="muted">Auditor: ${usersById[item.requestedById]?.name || "-"}</span>
                    <span class="muted">Auditee: ${usersById[item.auditeeId]?.name || "-"}</span>
                    <span class="muted">Due: ${item.dueDate}</span>
                  </div>
                  <div class="member-card" style="margin-top:12px;">
                    <strong>Response / evidence</strong>
                    <div class="muted" style="margin-top:6px;">${item.responseNote || "Waiting for auditee response."}</div>
                    <div class="muted">${item.evidenceName || "No file noted yet"}</div>
                  </div>
                  <div class="chip-row" style="margin-top:12px;">
                    ${["Pending Response", "Submitted", "Query Raised", "Closed"]
                      .map(
                        (status) =>
                          `<button class="chip-btn ${item.status === status ? "active" : ""}" data-requirement-id="${item.id}" data-requirement-status="${status}">${status}</button>`
                      )
                      .join("")}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Raise requirement</h2>
        <p class="panel-copy">Create a department-wise audit request with due date and owner.</p>
        <form id="requirement-form" class="stack">
          <div><p class="field-label">Requirement title</p><div class="field-shell"><span>📌</span><input name="title" required /></div></div>
          <div><p class="field-label">Audit area</p><div class="field-shell"><span>🔎</span><input name="auditArea" required /></div></div>
          <div><p class="field-label">Department</p><div class="field-shell"><select name="department"><option>Finance</option><option>Operations</option><option>IT</option><option>Claims</option></select></div></div>
          <div><p class="field-label">Requirement details</p><div class="field-shell"><span>🗂️</span><textarea name="requestDetails" required></textarea></div></div>
          <div class="grid-2">
            <div><p class="field-label">Priority</p><div class="field-shell"><select name="priority"><option>Low</option><option selected>Medium</option><option>High</option></select></div></div>
            <div><p class="field-label">Due date</p><div class="field-shell"><input type="date" name="dueDate" required /></div></div>
          </div>
          <div><p class="field-label">Auditor</p><div class="field-shell"><select name="requestedById">${state.users.filter((user) => user.role === "Auditor" || user.role === "Admin").map((user) => `<option value="${user.id}">${user.name}</option>`).join("")}</select></div></div>
          <div><p class="field-label">Auditee</p><div class="field-shell"><select name="auditeeId">${state.users.map((user) => `<option value="${user.id}">${user.name}</option>`).join("")}</select></div></div>
          <div><p class="field-label">Evidence name</p><div class="field-shell"><span>📎</span><input name="evidenceName" /></div></div>
          <button class="primary-btn" type="submit">Raise requirement</button>
        </form>
      </div>
    </div>
  `;

  root.querySelector("#requirement-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.requirements.unshift({
      id: nextId(state.requirements),
      title: form.get("title"),
      department: form.get("department"),
      auditArea: form.get("auditArea"),
      requestDetails: form.get("requestDetails"),
      status: "Pending Response",
      priority: form.get("priority"),
      requestedById: Number(form.get("requestedById")),
      auditeeId: Number(form.get("auditeeId")),
      dueDate: form.get("dueDate"),
      responseNote: "",
      evidenceName: form.get("evidenceName"),
    });
    saveState(state);
    render();
  });

  root.querySelectorAll("[data-requirement-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.requirements.find((entry) => entry.id === Number(button.dataset.requirementId));
      item.status = button.dataset.requirementStatus;
      saveState(state);
      render();
    });
  });
}

function renderPrepaids(root, state) {
  root.innerHTML = `
    <div class="layout-grid">
      <div class="panel">
        <h2>Prepaid chart</h2>
        <p class="panel-copy">Track prepaid opening, monthly amortisation, and balance.</p>
        <div class="table-wrap">
          <table>
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
              ${state.prepaids
                .map((item) => {
                  const balance = item.amountPaid - item.apr25 - item.may25 - item.jun25;
                  return `
                    <tr>
                      <td>${item.voucherNo}</td>
                      <td>${item.partyName}</td>
                      <td>${item.expenseHead}</td>
                      <td>${item.amountPaid.toLocaleString()}</td>
                      <td>${item.prepaidOpening.toLocaleString()}</td>
                      <td>${item.apr25.toLocaleString()}</td>
                      <td>${item.may25.toLocaleString()}</td>
                      <td>${item.jun25.toLocaleString()}</td>
                      <td>${balance.toLocaleString()}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <h2>Add prepaid entry</h2>
        <p class="panel-copy">Capture new prepaid schedules from the finance register.</p>
        <form id="prepaid-form" class="stack">
          <div><p class="field-label">Voucher number</p><div class="field-shell"><span>🧾</span><input name="voucherNo" required /></div></div>
          <div><p class="field-label">Party name</p><div class="field-shell"><span>🏢</span><input name="partyName" required /></div></div>
          <div><p class="field-label">Expense head</p><div class="field-shell"><span>📚</span><input name="expenseHead" required /></div></div>
          <div><p class="field-label">Amount paid</p><div class="field-shell"><span>₹</span><input type="number" name="amountPaid" required /></div></div>
          <div><p class="field-label">Prepaid opening</p><div class="field-shell"><span>₹</span><input type="number" name="prepaidOpening" required /></div></div>
          <div class="grid-2">
            <div><p class="field-label">Apr-25</p><div class="field-shell"><input type="number" name="apr25" required /></div></div>
            <div><p class="field-label">May-25</p><div class="field-shell"><input type="number" name="may25" required /></div></div>
          </div>
          <div><p class="field-label">Jun-25</p><div class="field-shell"><input type="number" name="jun25" required /></div></div>
          <button class="primary-btn" type="submit">Add prepaid entry</button>
        </form>
      </div>
    </div>
  `;

  root.querySelector("#prepaid-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.prepaids.unshift({
      id: nextId(state.prepaids),
      voucherNo: form.get("voucherNo"),
      partyName: form.get("partyName"),
      expenseHead: form.get("expenseHead"),
      amountPaid: Number(form.get("amountPaid")),
      prepaidOpening: Number(form.get("prepaidOpening")),
      apr25: Number(form.get("apr25")),
      may25: Number(form.get("may25")),
      jun25: Number(form.get("jun25")),
    });
    saveState(state);
    render();
  });
}

function renderTeam(root, state) {
  root.innerHTML = `
    <div class="team-grid">
      <div class="panel">
        <h2>Department-wise user control</h2>
        <p class="panel-copy">Create users, assign reporting managers, and maintain audit roles.</p>
        <div class="member-list">
          ${state.users
            .map(
              (user) => `
                <article class="member-card">
                  <div class="row-between">
                    <div>
                      <strong>${user.name}</strong>
                      <div class="muted">${user.email}</div>
                    </div>
                    ${user.email !== "admin@edmeinsurance.com" ? `<button class="mini-btn" data-delete-user="${user.id}">Remove</button>` : ""}
                  </div>
                  <div class="meta-row" style="margin-top:10px;">
                    <span class="muted">${user.department}</span>
                    <span class="muted">${user.role}</span>
                    <span class="muted">Manager: ${user.reportingManager || "Not assigned"}</span>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Add team member</h2>
        <p class="panel-copy">Create department-wise users with role and reporting manager.</p>
        <form id="user-form" class="stack">
          <div><p class="field-label">Full name</p><div class="field-shell"><span>👤</span><input name="name" required /></div></div>
          <div><p class="field-label">Email address</p><div class="field-shell"><span>✉️</span><input name="email" required /></div></div>
          <div><p class="field-label">Department</p><div class="field-shell"><span>🏷️</span><input name="department" required /></div></div>
          <div><p class="field-label">Reporting manager</p><div class="field-shell"><span>🧭</span><input name="reportingManager" /></div></div>
          <div><p class="field-label">Role</p><div class="field-shell"><select name="role"><option>Auditee</option><option>Auditor</option><option>Admin</option></select></div></div>
          <div><p class="field-label">Temporary password</p><div class="field-shell"><span>🔒</span><input name="password" required /></div></div>
          <button class="primary-btn" type="submit">Add member</button>
        </form>
      </div>
    </div>
  `;

  root.querySelector("#user-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.users.push({
      id: nextId(state.users),
      name: form.get("name"),
      email: form.get("email"),
      department: form.get("department"),
      reportingManager: form.get("reportingManager"),
      role: form.get("role"),
      password: form.get("password"),
    });
    saveState(state);
    render();
  });

  root.querySelectorAll("[data-delete-user]").forEach((button) => {
    button.addEventListener("click", () => {
      state.users = state.users.filter((user) => user.id !== Number(button.dataset.deleteUser));
      saveState(state);
      render();
    });
  });
}

render();
