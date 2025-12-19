const API_BASE = "https://fliperlabbackend-production.up.railway.app";
const API_V1 = `${API_BASE}/api/v1`;

// small helper to reduce repeat
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

// -------- Projects --------
async function loadProjects() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;
  container.innerHTML = "<p>Loading projects...</p>";

  try {
    const data = await apiRequest(`${API_V1}/projects`);

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No projects found.</p>";
      return;
    }

    container.innerHTML = "";
    data.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const safeImage = project.imageUrl || "https://via.placeholder.com/400x300";
      const safeName = project.name || "Untitled project";
      const safeDesc = project.description || "";

      card.innerHTML = `
        <img src="${safeImage}" alt="${safeName}" />
        <div class="project-content">
          <h3 class="project-title">${safeName}</h3>
          <p class="project-desc">${safeDesc}</p>
          <button class="project-readmore" type="button">Read More</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Projects error:", err);
    container.innerHTML = `<p>Failed to load projects: ${err.message}</p>`;
  }
}

// -------- Clients --------
async function loadClients() {
  const container = document.getElementById("clientsContainer");
  if (!container) return;
  container.innerHTML = "<p>Loading clients...</p>";

  try {
    const data = await apiRequest(`${API_V1}/clients`);

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No clients found.</p>";
      return;
    }

    container.innerHTML = "";
    data.forEach((client) => {
      const card = document.createElement("div");
      card.className = "client-card";

      const safeImage = client.imageUrl || "https://via.placeholder.com/80";
      const safeName = client.name || "Client";
      const safeDesc = client.description || "";
      const safeRole = client.designation || "";

      card.innerHTML = `
        <img class="client-avatar" src="${safeImage}" alt="${safeName}" />
        <div class="client-main">
          <p class="client-name">${safeName}</p>
          <p class="client-text">"${safeDesc}"</p>
          <p class="client-role">${safeRole}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Clients error:", err);
    container.innerHTML = `<p>Failed to load clients: ${err.message}</p>`;
  }
}

// -------- Contact form --------
function initContactForm() {
  const form = document.getElementById("contactForm");
  const messageEl = document.getElementById("contactMessage");
  if (!form || !messageEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "Submitting...";
    messageEl.className = "form-message";

    const payload = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      mobile: form.mobile.value.trim(),
      city: form.city.value.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.mobile || !payload.city) {
      messageEl.textContent = "Please fill all fields.";
      messageEl.classList.add("error");
      return;
    }

    try {
      const data = await apiRequest(`${API_V1}/contacts`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      messageEl.textContent = data.message || "Submitted successfully!";
      messageEl.classList.add("success");
      form.reset();
    } catch (err) {
      console.error("Contact error:", err);
      messageEl.textContent = err.message || "Something went wrong.";
      messageEl.classList.add("error");
    }
  });
}

// -------- Newsletter (hero section) --------
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const messageEl = document.getElementById("newsletterMessage");
  if (!form || !emailInput || !messageEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      messageEl.textContent = "Please enter your email.";
      messageEl.className = "form-message error";
      return;
    }

    messageEl.textContent = "Subscribing...";
    messageEl.className = "form-message";

    try {
      const data = await apiRequest(`${API_V1}/subscriptions`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      messageEl.textContent = data.message || "Subscribed!";
      messageEl.classList.add("success");
      emailInput.value = "";
    } catch (err) {
      console.error("Subscription error:", err);
      messageEl.textContent = err.message || "Something went wrong.";
      messageEl.classList.add("error");
    }
  });
}

// -------- Footer newsletter (optional) --------
function initFooterNewsletter() {
  const form = document.getElementById("footerNewsletterForm");
  const emailInput = document.getElementById("footerNewsletterEmail");
  if (!form || !emailInput) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    try {
      await apiRequest(`${API_V1}/subscriptions`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      emailInput.value = "";
    } catch (err) {
      console.error("Footer subscription error:", err);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadClients();
  initContactForm();
  initNewsletterForm();
  initFooterNewsletter();
});
