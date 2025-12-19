
const API_BASE = "https://fliperlabbackend-production.up.railway.app";
const API_V1 = `${API_BASE}/api/v1`;


async function loadProjects() {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "<p>Loading projects...</p>";

  try {
    const res = await fetch(`${API_V1}/projects`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No projects found.</p>";
      return;
    }

    container.innerHTML = "";
    data.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.name}" />
        <div class="project-content">
          <h3 class="project-title">${project.name}</h3>
          <p class="project-desc">${project.description}</p>
          <button class="project-readmore">Read More</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Projects error:", err);
    container.innerHTML = "<p>Failed to load projects.</p>";
  }
}


async function loadClients() {
  const container = document.getElementById("clientsContainer");
  container.innerHTML = "<p>Loading clients...</p>";

  try {
    const res = await fetch(`${API_V1}/clients`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No clients found.</p>";
      return;
    }

    container.innerHTML = "";
    data.forEach((client) => {
      const card = document.createElement("div");
      card.className = "client-card";

      card.innerHTML = `
        <img class="client-avatar" src="${client.imageUrl}" alt="${client.name}" />
        <div class="client-main">
          <p class="client-name">${client.name}</p>
          <p class="client-text">"${client.description}"</p>
          <p class="client-role">${client.designation}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Clients error:", err);
    container.innerHTML = "<p>Failed to load clients.</p>";
  }
}


function initContactForm() {
  const form = document.getElementById("contactForm");
  const messageEl = document.getElementById("contactMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "Submitting...";
    messageEl.className = "form-message";

    const payload = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      mobile: form.mobile.value.trim(),
      city: form.city.value.trim()
    };

    try {
      const res = await fetch(`${API_V1}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        messageEl.textContent = data.message || "Submitted successfully!";
        messageEl.classList.add("success");
        form.reset();
      } else {
        messageEl.textContent = data.message || "Failed to submit.";
        messageEl.classList.add("error");
      }
    } catch (err) {
      console.error("Contact error:", err);
      messageEl.textContent = "Something went wrong.";
      messageEl.classList.add("error");
    }
  });
}


function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const messageEl = document.getElementById("newsletterMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "Subscribing...";
    messageEl.className = "form-message";

    const payload = { email: emailInput.value.trim() };

    try {
      const res = await fetch(`${API_V1}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        messageEl.textContent = data.message || "Subscribed!";
        messageEl.classList.add("success");
        emailInput.value = "";
      } else {
        messageEl.textContent = data.message || "Failed to subscribe.";
        messageEl.classList.add("error");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      messageEl.textContent = "Something went wrong.";
      messageEl.classList.add("error");
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadClients();
  initContactForm();
  initNewsletterForm();
});
