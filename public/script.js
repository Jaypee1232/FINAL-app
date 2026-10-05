/* =========================================
   NEA'S BOARDING HORSE — FRONTEND JAVASCRIPT
   (Community edition — everyone is automatically
   connected, one shared feed, notifications for all)

   FINAL MERGED VERSION
   This file combines and replaces both older copies of
   app.js. Only include THIS file in your HTML — loading
   more than one copy of this script on the same page
   causes "Identifier ... has already been declared" errors
   which silently break login and everything else.
========================================= */

/* =========================================================
   ICONS
   Small inline SVG set, applied to any element with a
   data-icon attribute. Keeps markup icon-agnostic and lets
   both the static HTML and the JS-generated post cards
   share one source of truth.
========================================================= */

const ICON_PATHS = {
  home: '<path d="M3 9.5L12 3l9 6.5"/><path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  video: '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  poll: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  moreHorizontal: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  messageCircle: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  repeat: '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  edit: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  shield: '<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/>'
};

function iconSVG(name, options = {}) {
  const filled = options.filled;
  const inner = ICON_PATHS[name] || "";
  const fill = filled ? "currentColor" : "none";
  return `<svg viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function applyStaticIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach(el => {
    const name = el.getAttribute("data-icon");
    if (ICON_PATHS[name]) {
      el.innerHTML = iconSVG(name);
    }
  });
}

/* =========================================================
   MEDIA UPLOAD
   Sends a compressed image/video (as a data URL) to the
   server, which forwards it to Cloudinary and hands back a
   normal https URL. That URL — not the file itself — is what
   gets saved into posts/albums/profiles from here on.
========================================================= */

async function uploadMedia(dataUrl, kind = "image") {
  const result = await api("/api/upload", { method: "POST", body: { dataUrl, kind } });
  return result.url;
}

/* =========================================================
   THEME (light / dark / system)
========================================================= */

const THEME_KEY = "neas_boarding_horse_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-icon]").forEach(el => {
    el.innerHTML = iconSVG(theme === "dark" ? "sun" : "moon");
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (error) {
    console.error("Could not save theme preference.", error);
  }
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (error) {
    console.error("Could not read theme preference.", error);
  }
  const prefersDark = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

/* =========================================================
   DATA
   The app's shared data (member profiles, posts, comments,
   notifications) now lives on the SERVER — every member who
   logs in sees the same community feed. This file talks to
   it through a small fetch() wrapper (see API below) instead
   of reading/writing localStorage directly.
========================================================= */

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

// Videos now go to Cloudinary instead of being embedded as
// base64 in Firestore, so this only needs to stay under the
// server's request body limit (see express.json limit in
// server.js), not under a "keep the JSON file small" limit.
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

/* =========================================================
   API
========================================================= */

async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = (payload && payload.error) || `Request failed (${response.status}).`;
    const failure = new Error(message);
    failure.status = response.status;
    failure.payload = payload;
    throw failure;
  }
  return payload;
}

/* =========================================================
   STATE
========================================================= */
