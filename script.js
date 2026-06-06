/* ===== Data Kelas C - Sistem Informasi 2023 (data contoh, silakan diubah) ===== */

const pengurus = [
  { role: "Ketua Kelas", name: "Andri Mahendra" },
  { role: "Wakil Ketua", name: "Dania Muhammad Ikbal FR" },
  { role: "Sekretaris", name: "Eka Nurma Susilowati" },
  { role: "Bendahara", name: "Fatma Puspitasari" },
];

const anggota = [
  "Andri Mahendra",
  "Dania Muhammad Ikbal FR",
  "Eka Nurma Susilowati",
  "Elisabet Christina Endarwati",
  "Fatma Puspitasari",
  "Hani' Ibrahim",
  "Kurnia Ayu Anjani"
];

const FOTO_KAMPUS = "64eec4a2b474d537914047.jpg";

const galeri = [
  { title: "Kampus UDB Surakarta", img: FOTO_KAMPUS, span: true },
  { title: "Orientasi Mahasiswa", icon: "\u{1F393}" },
  { title: "Praktikum Lab", icon: "\u{1F4BB}" },
  { title: "Study Tour", icon: "\u{1F68C}" },
  { title: "Kerja Kelompok", icon: "\u{1F465}" },
  { title: "Seminar Teknologi", icon: "\u{1F399}\uFE0F" },
  { title: "Buka Bersama", icon: "\u{1F37D}\uFE0F" }
];

/* ===== Helpers ===== */
const avatarColors = [
  "#1e3a8a", "#3b82f6", "#6366f1", "#0891b2", "#0d9488",
  "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#dc2626"
];

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function colorFor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function gradientFor(str) {
  const c = colorFor(str);
  const c2 = avatarColors[(avatarColors.indexOf(c) + 3) % avatarColors.length];
  return `linear-gradient(135deg, ${c}, ${c2})`;
}

/* ===== Render Pengurus ===== */
function renderStructure() {
  const grid = document.getElementById("structureGrid");
  grid.innerHTML = pengurus.map((p) => `
    <div class="structure-card reveal">
      <div class="struct-avatar" style="background:${gradientFor(p.name)}">${getInitials(p.name)}</div>
      <p class="role">${p.role}</p>
      <p class="name">${p.name}</p>
    </div>
  `).join("");
}

/* ===== Render Anggota ===== */
function renderMembers(list) {
  const grid = document.getElementById("membersGrid");
  const noResult = document.getElementById("noResult");
  if (list.length === 0) {
    grid.innerHTML = "";
    noResult.hidden = false;
    return;
  }
  noResult.hidden = true;
  grid.innerHTML = list.map((name, i) => `
    <div class="member-card reveal">
      <div class="member-avatar" style="background:${gradientFor(name)}">${getInitials(name)}</div>
      <p class="m-name">${name}</p>
      <p class="m-npm">SI 2023 - Kelas C</p>
    </div>
  `).join("");
  setupReveal();
}

/* ===== Render Galeri ===== */
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = galeri.map((item) => {
    if (item.img) {
      return `
    <figure class="gallery-item gallery-photo${item.span ? " gallery-span" : ""}">
      <img src="${item.img}" alt="${item.title}" loading="lazy" />
      <figcaption>${item.title}</figcaption>
    </figure>`;
    }
    return `
    <figure class="gallery-item reveal" style="background:${gradientFor(item.title)}">
      <div class="gallery-icon">${item.icon}</div>
      <figcaption>${item.title}</figcaption>
    </figure>`;
  }).join("");
}

/* ===== Search ===== */
function setupSearch() {
  const input = document.getElementById("searchInput");
  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = anggota.filter((n) => n.toLowerCase().includes(q));
    renderMembers(filtered);
  });
}

/* ===== Navbar scroll + mobile toggle ===== */
function setupNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    document.getElementById("backToTop").classList.toggle("show", window.scrollY > 400);
  });

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ===== Back to top ===== */
function setupBackToTop() {
  document.getElementById("backToTop").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ===== Animated counters ===== */
function animateCounters() {
  const nums = document.querySelectorAll(".stat-num");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        current += step;
        if (current >= target) { el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => obs.observe(n));
}

/* ===== Scroll reveal ===== */
let revealObserver;
function setupReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
}

/* ===== Contact form ===== */
function setupForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message) {
      status.textContent = "Mohon lengkapi semua kolom.";
      status.className = "form-status err";
      return;
    }
    if (!emailOk) {
      status.textContent = "Format email tidak valid.";
      status.className = "form-status err";
      return;
    }
    status.textContent = `Terima kasih, ${name}! Pesanmu sudah terkirim.`;
    status.className = "form-status ok";
    form.reset();
  });
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderStructure();
  renderMembers(anggota);
  renderGallery();
  setupSearch();
  setupNavbar();
  setupBackToTop();
  setupForm();
  animateCounters();
  setupReveal();
});
