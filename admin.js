
const API_BASE = "https://fliperlabbackend-production.up.railway.app";
const API_V1 = `${API_BASE}/api/v1`;


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


async function loadProjectsAdmin() {
  const tbody = document.getElementById("projectsTableBody");
  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_V1}/projects`);
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
    console.error("Projects admin error:", err);
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
      const res = await fetch(`${API_V1}/projects`, {
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
      console.error("Project form error:", err);
      msg.textContent = "Something went wrong.";
      msg.classList.add("error");
    }
  });
}


async function loadClientsAdmin() {
  const tbody = document.getElementById("clientsTableBody");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_V1}/clients`);
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
    console.error("Clients admin error:", err);
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
      const res = await fetch(`${API_V1}/clients`, {
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
      console.error("Client form error:", err);
      msg.textContent = "Something went wrong.";
      msg.classList.add("error");
    }
  });
}


async function loadContactsAdmin() {
  const tbody = document.getElementById("contactsTableBody");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_V1}/contacts`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='5'>No contact submissions yet.</td></tr>";
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
    console.error("Contacts admin error:", err);
    tbody.innerHTML =
      "<tr><td colspan='5'>Failed to load contact submissions.</td></tr>";
  }
}


async function loadSubsAdmin() {
  const tbody = document.getElementById("subsTableBody");
  tbody.innerHTML = "<tr><td colspan='2'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_V1}/subscriptions`);
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
    console.error("Subscribers admin error:", err);
    tbody.innerHTML =
      "<tr><td colspan='2'>Failed to load subscribers.</td></tr>";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  initProjectForm();
  initClientForm();

  loadProjectsAdmin();
  loadClientsAdmin();
  loadContactsAdmin();
  loadSubsAdmin();
});
