const API_BASE = "https://fliperlabbackend-production.up.railway.app";
const API_V1 = `${API_BASE}/api/v1`;

// ---------- Helper for JSON (GET etc.) ----------
async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg = data.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ---------- Sidebar navigation ----------
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-link")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const targetId = btn.getAttribute("data-target");
    document.querySelectorAll(".section").forEach((sec) => {
      sec.classList.remove("visible");
    });
    const target = document.getElementById(targetId);
    if (target) target.classList.add("visible");
  });
});

// ---------- Projects (table) ----------
async function loadProjectsAdmin() {
  const tbody = document.getElementById("projectsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const data = await apiRequest(`${API_V1}/projects`);

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>No projects yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((p) => {
      const tr = document.createElement("tr");
      const safeImg = p.imageUrl || "https://via.placeholder.com/80x60";
      const safeName = p.name || "Untitled";
      const safeDesc = p.description || "";
      const created = p.createdAt
        ? new Date(p.createdAt).toLocaleString()
        : "-";

      tr.innerHTML = `
        <td><img src="${safeImg}" alt="${safeName}" /></td>
        <td>${safeName}</td>
        <td>${safeDesc}</td>
        <td>${created}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Projects admin error:", err);
    tbody.innerHTML = `<tr><td colspan='4'>Failed to load projects: ${err.message}</td></tr>`;
  }
}

// ---------- Project form (Cloudinary upload) ----------
function initProjectForm() {
  const form = document.getElementById("projectForm");
  const msg = document.getElementById("projectMessage");
  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Saving...";
    msg.className = "form-message";

    const formData = new FormData(form); // includes file + fields

    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();
    const file = formData.get("image");

    if (!file || !file.name || !name || !description) {
      msg.textContent = "Please fill all fields and choose an image.";
      msg.classList.add("error");
      return;
    }

    try {
      const res = await fetch(`${API_V1}/projects`, {
        method: "POST",
        body: formData, // multipart/form-data
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add project.");

      msg.textContent = "Project added.";
      msg.classList.add("success");
      form.reset();
      loadProjectsAdmin();
    } catch (err) {
      console.error("Project form error:", err);
      msg.textContent = err.message || "Failed to add project.";
      msg.classList.add("error");
    }
  });
}

// ---------- Clients (table) ----------
async function loadClientsAdmin() {
  const tbody = document.getElementById("clientsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const data = await apiRequest(`${API_V1}/clients`);

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No clients yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((c) => {
      const tr = document.createElement("tr");
      const safeImg = c.imageUrl || "https://via.placeholder.com/80x60";
      const safeName = c.name || "Client";
      const safeRole = c.designation || "";
      const safeDesc = c.description || "";
      const created = c.createdAt
        ? new Date(c.createdAt).toLocaleString()
        : "-";

      tr.innerHTML = `
        <td><img src="${safeImg}" alt="${safeName}" /></td>
        <td>${safeName}</td>
        <td>${safeRole}</td>
        <td>${safeDesc}</td>
        <td>${created}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Clients admin error:", err);
    tbody.innerHTML = `<tr><td colspan='5'>Failed to load clients: ${err.message}</td></tr>`;
  }
}

// ---------- Client form (Cloudinary upload) ----------
function initClientForm() {
  const form = document.getElementById("clientForm");
  const msg = document.getElementById("clientMessage");
  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Saving...";
    msg.className = "form-message";

    const formData = new FormData(form);

    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();
    const designation = formData.get("designation")?.trim();
    const file = formData.get("image");

    if (!file || !file.name || !name || !description || !designation) {
      msg.textContent = "Please fill all fields and choose an image.";
      msg.classList.add("error");
      return;
    }

    try {
      const res = await fetch(`${API_V1}/clients`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add client.");

      msg.textContent = "Client added.";
      msg.classList.add("success");
      form.reset();
      loadClientsAdmin();
    } catch (err) {
      console.error("Client form error:", err);
      msg.textContent = err.message || "Failed to add client.";
      msg.classList.add("error");
    }
  });
}

// ---------- Contacts (table) ----------
async function loadContactsAdmin() {
  const tbody = document.getElementById("contactsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const data = await apiRequest(`${API_V1}/contacts`);

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='5'>No contact submissions yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((c) => {
      const tr = document.createElement("tr");
      const created = c.createdAt
        ? new Date(c.createdAt).toLocaleString()
        : "-";

      tr.innerHTML = `
        <td>${c.fullName || ""}</td>
        <td>${c.email || ""}</td>
        <td>${c.mobile || ""}</td>
        <td>${c.city || ""}</td>
        <td>${created}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Contacts admin error:", err);
    tbody.innerHTML =
      `<tr><td colspan='5'>Failed to load contact submissions: ${err.message}</td></tr>`;
  }
}

// ---------- Subscriptions (table) ----------
async function loadSubsAdmin() {
  const tbody = document.getElementById("subsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='2'>Loading...</td></tr>";

  try {
    const data = await apiRequest(`${API_V1}/subscriptions`);

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='2'>No subscribers yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((s) => {
      const tr = document.createElement("tr");
      const created = s.createdAt
        ? new Date(s.createdAt).toLocaleString()
        : "-";

      tr.innerHTML = `
        <td>${s.email || ""}</td>
        <td>${created}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Subscribers admin error:", err);
    tbody.innerHTML =
      `<tr><td colspan='2'>Failed to load subscribers: ${err.message}</td></tr>`;
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initProjectForm();
  initClientForm();

  loadProjectsAdmin();
  loadClientsAdmin();
  loadContactsAdmin();
  loadSubsAdmin();
});
