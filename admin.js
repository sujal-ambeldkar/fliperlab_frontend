const API_BASE = "http://localhost:5000/api";

// ------- Navigation between sections -------
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
    document.getElementById(targetId).classList.add("visible");
  });
});

// ------- Projects: list + create -------
async function loadProjectsAdmin() {
  const tbody = document.getElementById("projectsTableBody");
  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>No projects yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${p.imageUrl}" alt="${p.name}" /></td>
        <td>${p.name}</td>
        <td>${p.description}</td>
        <td>${new Date(p.createdAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='4'>Failed to load projects.</td></tr>";
  }
}

function initProjectForm() {
  const form = document.getElementById("projectForm");
  const msg = document.getElementById("projectMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Saving...";
    msg.className = "form-message";

    const formData = new FormData(form);
    const payload = {
      imageUrl: formData.get("imageUrl").trim(),
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        msg.textContent = "Project added.";
        msg.classList.add("success");
        form.reset();
        loadProjectsAdmin();
      } else {
        msg.textContent = data.message || "Failed to add project.";
        msg.classList.add("error");
      }
    } catch (err) {
      console.error(err);
      msg.textContent = "Something went wrong.";
      msg.classList.add("error");
    }
  });
}

// ------- Clients: list + create -------
async function loadClientsAdmin() {
  const tbody = document.getElementById("clientsTableBody");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_BASE}/clients`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No clients yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${c.imageUrl}" alt="${c.name}" /></td>
        <td>${c.name}</td>
        <td>${c.designation}</td>
        <td>${c.description}</td>
        <td>${new Date(c.createdAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='5'>Failed to load clients.</td></tr>";
  }
}

function initClientForm() {
  const form = document.getElementById("clientForm");
  const msg = document.getElementById("clientMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Saving...";
    msg.className = "form-message";

    const formData = new FormData(form);
    const payload = {
      imageUrl: formData.get("imageUrl").trim(),
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      designation: formData.get("designation").trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        msg.textContent = "Client added.";
        msg.classList.add("success");
        form.reset();
        loadClientsAdmin();
      } else {
        msg.textContent = data.message || "Failed to add client.";
        msg.classList.add("error");
      }
    } catch (err) {
      console.error(err);
      msg.textContent = "Something went wrong.";
      msg.classList.add("error");
    }
  });
}

// ------- Contacts: list only -------
async function loadContactsAdmin() {
  const tbody = document.getElementById("contactsTableBody");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_BASE}/contacts`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No contact submissions yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.fullName}</td>
        <td>${c.email}</td>
        <td>${c.mobile}</td>
        <td>${c.city}</td>
        <td>${new Date(c.createdAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      "<tr><td colspan='5'>Failed to load contact submissions.</td></tr>";
  }
}

// ------- Subscribers: list only -------
async function loadSubsAdmin() {
  const tbody = document.getElementById("subsTableBody");
  tbody.innerHTML = "<tr><td colspan='2'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_BASE}/subscriptions`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='2'>No subscribers yet.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((s) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.email}</td>
        <td>${new Date(s.createdAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      "<tr><td colspan='2'>Failed to load subscribers.</td></tr>";
  }
}

// ------- Init -------
document.addEventListener("DOMContentLoaded", () => {
  initProjectForm();
  initClientForm();

  loadProjectsAdmin();
  loadClientsAdmin();
  loadContactsAdmin();
  loadSubsAdmin();
});
