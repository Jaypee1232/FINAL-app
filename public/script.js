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
  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
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
  if (isOffline()) throw new Error("You are offline. Connect to the internet to upload photos, videos and GIFs.");
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

/* ---------- OFFLINE MODE ----------
   - The last feed + your login are kept on this device, so the app still opens and you can
     read everything you already loaded while offline.
   - Text changes (comments, reactions, posts without new uploads, edits) are kept on the
     device and sent automatically the moment you are back online.
   - Photos / videos / GIF uploads need a connection (they go to Cloudinary).
   - A red "You are offline" bar shows at the top whenever there is no connection. */
const OFFLINE_STATE_KEY = "nbh_offline_state_v1";
const OFFLINE_SESSION_KEY = "nbh_offline_session_v1";
const OFFLINE_DIRTY_KEY = "nbh_offline_dirty_v1";
let netOffline = typeof navigator !== "undefined" && navigator.onLine === false;
let pendingSync = false;   // changes made offline that haven't reached the server yet
let netProbeTimer = null;

function isOffline() { return netOffline; }

function offlineWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
}
function offlineRead(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}
function offlineClearAll() {
  try { [OFFLINE_STATE_KEY, OFFLINE_SESSION_KEY, OFFLINE_DIRTY_KEY].forEach(k => localStorage.removeItem(k)); } catch (e) {}
  pendingSync = false;
}
function offlineCacheState() {
  if (!session || !session.username) return;
  offlineWrite(OFFLINE_STATE_KEY, { owner: session.username, data });
}

function ensureNetBanner() {
  let el = document.getElementById("netBanner");
  if (el || !document.body) return el;
  el = document.createElement("div");
  el.id = "netBanner";
  el.className = "net-banner";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = '<span class="net-dot"></span><span class="net-text"><b>You are offline</b><small></small></span>';
  document.body.appendChild(el);
  return el;
}

function updateNetBanner() {
  const el = ensureNetBanner();
  document.documentElement.classList.toggle("is-offline", netOffline);
  if (!el) return;
  const sub = el.querySelector("small");
  if (sub) {
    sub.textContent = pendingSync
      ? "Your changes are saved on this device and will sync when you reconnect."
      : "You can still read what's already loaded. New activity appears when you reconnect.";
  }
  el.classList.toggle("show", netOffline);
}

async function probeConnection() {
  try {
    await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
    setOffline(false);
  } catch (e) { /* still offline */ }
}

function setOffline(value) {
  value = !!value;
  if (value === netOffline) return;
  netOffline = value;
  updateNetBanner();
  if (netOffline) {
    clearInterval(netProbeTimer);
    netProbeTimer = setInterval(probeConnection, 5000);
  } else {
    clearInterval(netProbeTimer);
    netProbeTimer = null;
    showMessage(pendingSync ? "Back online — syncing your changes…" : "Back online");
    syncAfterReconnect();
  }
}

async function syncAfterReconnect() {
  if (!session) return;
  if (pendingSync) {
    pendingSync = false;
    offlineWrite(OFFLINE_DIRTY_KEY, false);
    saveData();
    try { await saveChain; } catch (e) {}
    updateNetBanner();
  }
  if (!pendingSync && typeof refreshFeed === "function") refreshFeed({ quiet: true });
}

window.addEventListener("offline", () => setOffline(true));
window.addEventListener("online", () => { probeConnection(); });
if (document.body) updateNetBanner(); else window.addEventListener("DOMContentLoaded", updateNetBanner);

async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      method: options.method || "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      credentials: "include",
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (networkError) {
    // fetch() only throws when the request never reached the server.
    setOffline(true);
    const failure = new Error("You are offline.");
    failure.offline = true;
    throw failure;
  }
  if (netOffline) setOffline(false);

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
  // Keep a copy of the login and the latest feed so the app can open offline.
  if (!options.method || options.method === "GET") {
    if (path === "/api/auth/me" && payload) offlineWrite(OFFLINE_SESSION_KEY, payload);
    else if (path === "/api/state" && payload && session && !pendingSync) {
      offlineWrite(OFFLINE_STATE_KEY, { owner: session.username, data: payload });
    }
  }
  return payload;
}

/* =========================================================
   STATE
========================================================= */

// `data` mirrors what used to be stored in localStorage, minus
// anything session-specific (currentUser is tracked separately
// below as `session`, since it's per-browser, not shared).
let data = { users: [], posts: [], social: {} };

// The logged-in member for THIS browser/session. Set after a
// successful login or a valid session cookie check.
let session = null;

let activePostId = null;
let activeAlbumId = null;
let composerImages = [];
let composerVideo = null;
let composerMusic = null;
let composerTags = [];
let previewKey = null;
let activeProfileTab = "posts";
let viewingUsername = null;
let adminOverview = { users: [], posts: [] };

/* =========================================================
   STORAGE (now synced to the server instead of localStorage)
========================================================= */

function ensureSocialFor(username) {
  if (!username) {
    return { notifications: [], albums: [], reposts: [], savedPostIds: [], myReactions: {} };
  }
  if (!data.social) data.social = {};
  if (!data.social[username]) {
    data.social[username] = { notifications: [], albums: [], reposts: [], savedPostIds: [], myReactions: {} };
  }
  const social = data.social[username];
  if (!Array.isArray(social.notifications)) social.notifications = [];
  if (!Array.isArray(social.albums)) social.albums = [];
  if (!Array.isArray(social.reposts)) social.reposts = [];
  // These are PER-MEMBER by design: which emoji *this* member picked for a
  // post, and whether *this* member saved it. They must never be a single
  // field on the shared post object — that used to mean one member's
  // reaction/save silently applied to (and overwrote) every other member's view.
  if (!Array.isArray(social.savedPostIds)) social.savedPostIds = [];
  if (!social.myReactions || typeof social.myReactions !== "object") social.myReactions = {};
  return social;
}

// Saves run one at a time so they always reach the server in order.
let saveChain = Promise.resolve();
let savesInFlight = 0;
let lastSaveOk = true; // did the most recent save reach the server? (publishPost waits on this)

function saveData() {
  savesInFlight++;
  saveChain = saveChain.then(() => attemptSave(3));
  return true;
}

async function attemptSave(retriesLeft) {
  try {
    const sentDeletes = Array.isArray(data.deletedPostIds) ? data.deletedPostIds.slice() : [];
    const sentCommentDeletes = Array.isArray(data.deletedComments) ? data.deletedComments.slice() : [];
    const result = await api("/api/state", { method: "POST", body: data });
    lastSaveOk = true;
    if (result && typeof result.rev === "number") data.rev = result.rev;
    if (savesInFlight === 1) { offlineCacheState(); offlineWrite(OFFLINE_DIRTY_KEY, false); }
    // Adopt the server's true reaction/share totals (only when no newer save is queued).
    if (result && Array.isArray(result.posts) && savesInFlight === 1) {
      let changed = false;
      result.posts.forEach(sp => {
        const lp = data.posts.find(p => p.id === sp.id);
        if (lp && (JSON.stringify(lp.reactions || {}) !== JSON.stringify(sp.reactions) || (lp.shares || 0) !== sp.shares
            || JSON.stringify(lp.reactors || []) !== JSON.stringify(sp.reactors || []))) {
          lp.reactions = sp.reactions;
          lp.shares = sp.shares;
          if (Array.isArray(sp.reactors)) lp.reactors = sp.reactors;
          changed = true;
        }
      });
      if (changed) refreshAfterSync();
    }
    if (sentCommentDeletes.length && Array.isArray(data.deletedComments)) {
      data.deletedComments = data.deletedComments.filter(d => !sentCommentDeletes.some(s => s.postId === d.postId && s.commentId === d.commentId));
    }
    if (sentDeletes.length && Array.isArray(data.deletedPostIds)) {
      data.deletedPostIds = data.deletedPostIds.filter(id => !sentDeletes.includes(id));
    }
  } catch (error) {
    if (error.offline) {
      // No connection: keep the change on this device and send it when we're back online.
      pendingSync = true;
      lastSaveOk = true;
      offlineCacheState();
      offlineWrite(OFFLINE_DIRTY_KEY, true);
      updateNetBanner();
      showMessage("Saved on this device — it will sync when you're back online.");
      return;
    }
    const freshState = error.status === 409 && error.payload && error.payload.state;
    if (freshState && typeof freshState.rev === "number" && retriesLeft > 0) {
      // Someone else saved first (even just another member logging in bumps
      // the revision). The server only ever changes fields a member is
      // actually allowed to touch and merges the rest (see server.js), so
      // it's safe to simply retry with the latest revision number rather
      // than throwing away whatever was just clicked.
      data.rev = freshState.rev;
      await attemptSave(retriesLeft - 1);
      return;
    }
    if (freshState) {
      // Repeated conflicts — fall back to at least showing the freshest feed.
      data = freshState;
      lastSaveOk = false;
      renderEverything();
      showMessage("Couldn't save your last change. Please try again.");
    } else {
      lastSaveOk = false;
      console.error("Could not save data to the server.", error);
      showMessage("Couldn't save — check your connection and try again.");
    }
  } finally {
    savesInFlight--;
  }
}

/* =========================================================
   LIVE SYNC
   Polls the server every few seconds so members see each
   other's new posts, comments, and reactions without having
   to refresh. Skipped while a modal (like the composer) is
   open so it never overwrites something being typed.
========================================================= */

let pollTimer = null;

function anyModalOpen() {
  // Only pause live sync while the member is typing/editing. Viewing a photo or
  // reading comments must keep updating so reactions stay in sync.
  return ["composerModal", "editModal", "changePasswordModal", "albumModal"].some(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("hidden");
  });
}

function refreshAfterSync() {
  renderFeed();
  const pv = document.getElementById("postViewModal");
  if (pv && !pv.classList.contains("hidden")) refreshPostView();
  const cm = document.getElementById("commentsModal");
  if (cm && !cm.classList.contains("hidden") && typeof renderCommentsList === "function") renderCommentsList();
  if (typeof refreshLightbox === "function") refreshLightbox();
}

async function pollState() {
  if (!session || anyModalOpen() || savesInFlight > 0 || netOffline || pendingSync) return;
  try {
    const fresh = await api("/api/state");
    if (savesInFlight > 0) return; // a save started while we were fetching; don't overwrite it
    if (JSON.stringify(fresh) === JSON.stringify(data)) return;
    // If someone else posted while you're scrolled down reading, don't shove the
    // feed around under your thumb. Show a "N new posts" button instead.
    const knownIds = new Set(data.posts.map(p => p.id));
    const newCount = fresh.posts.filter(p => !knownIds.has(p.id) && !(p.username && usernamesMatch(p.username, session.username))).length;
    if (newCount > 0 && window.scrollY > 200) {
      showNewPostsButton(newCount);
      return;
    }
    hideNewPostsButton();
    data = fresh;
    renderEverything();
    refreshAfterSync();
  } catch (error) {
    // Session probably expired — quietly stop polling; the next
    // user action will surface a proper "please log in again".
    console.error("Live sync paused.", error);
  }
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(pollState, 7000);
  // Keep "7 minutes ago" labels ticking forward without needing new data.
  if (!window.__stampTimer) {
    window.__stampTimer = setInterval(() => {
      if (!session || anyModalOpen()) return;
      renderFeed();
      const cm = document.getElementById("commentsModal");
      if (cm && !cm.classList.contains("hidden")) renderCommentsList();
    }, 60000);
  }
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

/* =========================================================
   HELPERS
========================================================= */

function currentUser() {
  if (!session) return null;
  return data.users.find(user => user.username === session.username);
}

function showMessage(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showMessage._timer);
  showMessage._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function avatarLetter(name) {
  return name ? name.charAt(0).toUpperCase() : "N";
}

// Relative time like "7 hours ago". Older items that only have the text
// "Just now" / "2h ago" (no saved timestamp) keep showing that text.
function plural(n, word) {
  return n + " " + word + (n === 1 ? "" : "s") + " ago";
}

function formatStamp(createdAt, fallback) {
  if (typeof createdAt !== "number" || !isFinite(createdAt)) return fallback || "";
  const seconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));
  if (seconds < 45) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return plural(Math.max(1, minutes), "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return plural(hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 7) return plural(days, "day");
  const weeks = Math.floor(days / 7);
  if (days < 30) return plural(weeks, "week");
  return new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// Full date + time, shown when hovering/long-pressing the relative time.
function fullStamp(createdAt) {
  if (typeof createdAt !== "number" || !isFinite(createdAt)) return "";
  const d = new Date(createdAt);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
    " \u00b7 " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

function usernamesMatch(username1, username2) {
  if (!username1 || !username2) return false;
  return String(username1).trim().toLowerCase() === String(username2).trim().toLowerCase();
}

function findUser(username) {
  if (!username) return null;
  return data.users.find(user => usernamesMatch(user.username, username)) || null;
}

/* =========================================================
   COMMUNITY MEMBERS
   Every account is automatically connected to every other
   account — there is no friend request system anymore.
========================================================= */

function otherMembers(excludeUsername) {
  return data.users.filter(user => !usernamesMatch(user.username, excludeUsername));
}

function ensureSocial() {
  const user = currentUser();
  return ensureSocialFor(user ? user.username : null);
}

/* =========================================================
   NORMALIZE SERVER DATA
   Fills in any missing fields on data just fetched from the
   server, same idea as the old "upgrade saved data" step —
   just no longer needs to seed default users, since the
   server already owns that.
========================================================= */

function upgradeData() {
  if (!Array.isArray(data.users)) data.users = [];
  if (!Array.isArray(data.posts)) data.posts = [];
  if (!data.social || typeof data.social !== "object") data.social = {};

  data.users.forEach(user => ensureSocialFor(user.username));

  data.posts.forEach(post => {
    if (!post.reactions) post.reactions = {};
    if (!Array.isArray(post.commentsList)) post.commentsList = [];
    if (typeof post.comments !== "number") post.comments = post.commentsList.length;
    if (typeof post.shares !== "number") post.shares = 0;
    // `userReaction` / `saved` used to live directly on the (shared) post
    // object, which meant one member's reaction or save leaked into every
    // other member's view. They're per-member now (see ensureSocialFor),
    // so any leftover legacy fields on the post itself are just noise —
    // drop them rather than let old data confuse anything.
    delete post.userReaction;
    delete post.saved;
  });
}

/* =========================================================
   FILE HELPERS
========================================================= */

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function compressImageFile(file, maxDimension = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    readFileAsDataURL(file).then(rawDataUrl => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
          } else {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = rawDataUrl;
    }).catch(reject);
  });
}

/* =========================================================
   AUTH
========================================================= */

function showWelcome() {
  document.getElementById("welcomePage")?.classList.remove("hidden");
  document.getElementById("loginPage")?.classList.add("hidden");
}

function showLogin() {
  document.getElementById("welcomePage")?.classList.add("hidden");
  document.getElementById("loginPage")?.classList.remove("hidden");
  setLoginError("");
}

function setLoginError(message) {
  const el = document.getElementById("loginError");
  if (!el) return;
  if (!message) {
    el.classList.add("hidden");
    el.textContent = "";
  } else {
    el.classList.remove("hidden");
    el.textContent = message;
  }
}

/* =========================================================
   LOGIN FORM
   Real authentication now happens on the server: the browser
   never sees anyone's password hash, and the server sets an
   httpOnly session cookie once the username/password check
   out. (The old version let anyone in by typing "admin" with
   no password at all — that's fixed; admin now logs in the
   same way as everyone else.)
========================================================= */

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    setLoginError("");
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const submitButton = loginForm.querySelector("button[type='submit']");

    if (submitButton) submitButton.disabled = true;
    try {
      const result = await api("/api/auth/login", { method: "POST", body: { username, password } });
      session = result;
      markTabAlive();
      await loadStateAndEnter();
    } catch (error) {
      setLoginError(error.message || "Incorrect username or password.");
      showMessage(error.message || "Incorrect username or password.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

/* =========================================================
   ENTER APP
========================================================= */

async function loadStateAndEnter() {
  // Changes made offline in an earlier visit: re-send them first (the server merges them safely).
  const saved = offlineRead(OFFLINE_DIRTY_KEY) ? offlineRead(OFFLINE_STATE_KEY) : null;
  if (saved && saved.data && session && saved.owner === session.username) {
    data = saved.data;
    upgradeData();
    enterApplication();
    offlineWrite(OFFLINE_DIRTY_KEY, false);
    showMessage("Syncing your offline changes…");
    saveData();
    saveChain.then(() => { if (!pendingSync) refreshFeed({ quiet: true }); });
    return;
  }
  data = await api("/api/state");
  upgradeData();
  enterApplication();
}

// No connection at startup: open the app from the copy saved on this device.
function enterOfflineFromCache() {
  const cachedSession = offlineRead(OFFLINE_SESSION_KEY);
  const cached = offlineRead(OFFLINE_STATE_KEY);
  if (!cachedSession || !cached || !cached.data || cached.owner !== cachedSession.username) return false;
  if (cachedSession.logoutOnExit && !tabWasAlive()) return false;
  session = cachedSession;
  data = cached.data;
  pendingSync = !!offlineRead(OFFLINE_DIRTY_KEY);
  upgradeData();
  markTabAlive();
  enterApplication();
  updateNetBanner();
  showMessage("You are offline — showing your saved feed.");
  return true;
}

function enterApplication() {
  document.getElementById("authScreen")?.classList.add("hidden");
  document.getElementById("app")?.classList.remove("hidden");
  renderEverything();
  updateAdminNavigation();
  openPage("home");
  startPolling();
  initPush();
  openPostFromUrl();
}

function updateAdminNavigation() {
  const show = !!session?.isAdmin;
  document.getElementById("adminNavButton")?.classList.toggle("hidden", !show);
  document.getElementById("adminMobileNav")?.classList.toggle("hidden", !show);
  document.getElementById("adminPage")?.classList.toggle("hidden", !show && document.getElementById("adminPage")?.classList.contains("active"));
}

async function loadAdminPanel() {
  if (!session?.isAdmin) return;
  try {
    const result = await api("/api/admin/overview");
    adminOverview = result;
    document.getElementById("adminUserCount").textContent = result.users.length;
    document.getElementById("adminPostCount").textContent = result.posts.length;
    renderAdminUsers();
    renderAdminPosts();
    loadAdminBirthdays();
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      showMessage("Admin session is no longer active.");
      openPage("home");
      return;
    }
    showMessage(error.message || "Could not load the admin panel.");
  }
}

function renderAdminUsers() {
  const container = document.getElementById("adminUsersList");
  if (!container) return;
  const search = String(document.getElementById("adminUserSearch")?.value || "").toLowerCase().trim();
  const users = (adminOverview.users || []).filter(u =>
    !search || `${u.name} ${u.username}`.toLowerCase().includes(search)
  );
  if (!users.length) {
    container.innerHTML = `<p class="no-results">No accounts found.</p>`;
    return;
  }
  container.innerHTML = users.map(u => `
    <div class="admin-user-row">
      <div class="avatar">${u.avatarImage ? `<img src="${escapeHTML(u.avatarImage)}" alt="${escapeHTML(u.name || u.username)}">` : escapeHTML(u.avatar || "U")}</div>
      <div class="admin-user-info">
        <strong>${escapeHTML(u.name || u.username)}</strong>
        <span>@${escapeHTML(u.username)} · ${u.postCount} post${u.postCount === 1 ? "" : "s"}</span>
      </div>
      <div class="admin-user-actions">
        ${u.isAdmin ? `<span class="admin-badge">Admin</span>` : `<span class="admin-badge member">Member</span>`}
        ${u.disabled ? `<span class="admin-badge disabled">Disabled</span>` : ""}
        ${u.username.toLowerCase() === String(session.username).toLowerCase() ? `<span class="admin-current">You</span>` : `
          <button class="soft-button small-admin-btn" onclick="adminRenameUser('${encodeURIComponent(u.username)}', '${escapeHTML((u.name || '').replace(/'/g, "&#39;"))}')">Rename</button>
          <button class="soft-button small-admin-btn" onclick="adminResetPassword('${encodeURIComponent(u.username)}')">Reset Password</button>
          <button class="soft-button small-admin-btn" onclick="adminToggleDisabled('${encodeURIComponent(u.username)}', ${u.disabled ? 'true' : 'false'})">${u.disabled ? 'Enable' : 'Disable'}</button>
          <button class="soft-button small-admin-btn" onclick="adminToggleRole('${encodeURIComponent(u.username)}', ${u.isAdmin ? 'true' : 'false'})">${u.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>
          <button class="danger-button" onclick="deleteAdminUser('${encodeURIComponent(u.username)}')">Delete</button>`}
      </div>
    </div>
  `).join("");
}

function renderAdminPosts() {
  const grid = document.getElementById("adminPostsGrid");
  if (!grid) return;
  const posts = adminOverview.posts || [];
  if (!posts.length) {
    grid.innerHTML = `<p class="no-results">No posts yet.</p>`;
    return;
  }
  grid.innerHTML = posts.map(post => {
    const user = (adminOverview.users || []).find(u => u.username.toLowerCase() === String(post.username || "").toLowerCase());
    const author = user?.name || post.name || post.username || "Unknown member";
    const media = post.video
      ? `<video class="admin-post-media" src="${escapeHTML(post.video)}" controls preload="metadata"></video>`
      : post.image
        ? `<img class="admin-post-media" src="${escapeHTML(post.image)}" alt="Posted by ${escapeHTML(author)}" loading="lazy">`
        : Array.isArray(post.images) && post.images.length
          ? `<div class="admin-post-gallery">${post.images.slice(0, 10).map(src => `<img class="admin-post-media" src="${escapeHTML(src)}" alt="Posted by ${escapeHTML(author)}" loading="lazy">`).join("")}</div>`
          : `<div class="admin-no-media">Text post</div>`;
    return `<article class="admin-post-card">
      ${media}
      <div class="admin-post-body">
        <strong>${escapeHTML(author)}</strong>
        <span>@${escapeHTML(post.username || "unknown")}</span>
        ${post.text ? `<p>${escapeHTML(post.text).replace(/\n/g, "<br>")}</p>` : ""}
        <button class="danger-button admin-delete-post" onclick="deleteAdminPost('${encodeURIComponent(String(post.id))}')">Delete Post</button>
      </div>
    </article>`;
  }).join("");
}

async function createAdminUser(event) {
  event.preventDefault();
  const button = event.target.querySelector("button[type='submit']");
  const body = {
    name: document.getElementById("adminNewName").value.trim(),
    username: document.getElementById("adminNewUsername").value.trim(),
    password: document.getElementById("adminNewPassword").value
  };
  button.disabled = true;
  try {
    await api("/api/admin/users", { method: "POST", body });
    event.target.reset();
    showMessage("Account created.");
    await loadAdminPanel();
  } catch (error) {
    showMessage(error.message || "Could not create account.");
  } finally {
    button.disabled = false;
  }
}

async function adminRenameUser(encodedUsername, currentName) {
  const username = decodeURIComponent(encodedUsername);
  const name = await appPrompt(`New name for ${username}:`, { title: "Rename Account", defaultValue: currentName || "", okLabel: "Save" });
  if (name === null) return;
  if (!name.trim()) return showMessage("Name cannot be empty.");
  try {
    await api(`/api/admin/users/${encodeURIComponent(username)}`, { method: "PATCH", body: { action: "rename", name: name.trim() } });
    showMessage("Account name updated.");
    await loadAdminPanel();
  } catch (error) { showMessage(error.message || "Could not rename account."); }
}

async function adminResetPassword(encodedUsername) {
  const username = decodeURIComponent(encodedUsername);
  const password = await appPrompt(`Enter a new password for ${username}:`, { title: "Reset Password", inputType: "password", okLabel: "Reset Password" });
  if (password === null) return;
  if (password.length < 6) return showMessage("Password must be at least 8 characters.");
  try {
    await api(`/api/admin/users/${encodeURIComponent(username)}/reset-password`, { method: "POST", body: { password } });
    showMessage("Password reset successfully.");
  } catch (error) { showMessage(error.message || "Could not reset password."); }
}

async function adminToggleDisabled(encodedUsername, disabled) {
  const username = decodeURIComponent(encodedUsername);
  const action = disabled ? "enable" : "disable";
  const confirmed = await appConfirm(`${disabled ? "Enable" : "Disable"} ${username}'s account?`, {
    title: disabled ? "Enable Account" : "Disable Account",
    okLabel: disabled ? "Enable" : "Disable",
    danger: !disabled
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/users/${encodeURIComponent(username)}`, { method: "PATCH", body: { action } });
    showMessage(`Account ${disabled ? "enabled" : "disabled"}.`);
    await loadAdminPanel();
  } catch (error) { showMessage(error.message || "Could not update account."); }
}

async function adminToggleRole(encodedUsername, isAdmin) {
  const username = decodeURIComponent(encodedUsername);
  const action = isAdmin ? "demote" : "promote";
  const confirmed = await appConfirm(`${isAdmin ? "Remove admin access from" : "Make"} ${username} ${isAdmin ? "?" : "an admin?"}`, {
    title: "Admin Access",
    okLabel: isAdmin ? "Remove Admin" : "Make Admin",
    danger: isAdmin
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/users/${encodeURIComponent(username)}`, { method: "PATCH", body: { action } });
    showMessage(isAdmin ? "Admin access removed." : "Admin access granted.");
    await loadAdminPanel();
  } catch (error) { showMessage(error.message || "Could not change admin access."); }
}

async function deleteAdminPost(encodedPostId) {
  const postId = decodeURIComponent(encodedPostId);
  const confirmed = await appConfirm("Delete this post for everyone? This cannot be undone.", { title: "Delete Post", okLabel: "Delete", danger: true });
  if (!confirmed) return;
  try {
    await api(`/api/admin/posts/${encodeURIComponent(postId)}`, { method: "DELETE" });
    showMessage("Post deleted.");
    await loadAdminPanel();
    await loadStateAndEnter();
    openPage("admin");
  } catch (error) { showMessage(error.message || "Could not delete post."); }
}

async function deleteAdminUser(encodedUsername) {
  const username = decodeURIComponent(encodedUsername);
  const confirmed = await appConfirm(`Delete the account ${username}? Their posts will also be removed.`, { title: "Delete Account", okLabel: "Delete", danger: true });
  if (!confirmed) return;
  try {
    await api(`/api/admin/users/${encodeURIComponent(username)}`, { method: "DELETE" });
    showMessage("Account deleted.");
    await loadAdminPanel();
    await loadStateAndEnter();
    openPage("admin");
  } catch (error) {
    showMessage(error.message || "Could not delete account.");
  }
}

const adminCreateForm = document.getElementById("adminCreateForm");
if (adminCreateForm) adminCreateForm.addEventListener("submit", createAdminUser);

/* =========================================================
   LOGOUT ON EXIT
   When the server has LOGOUT_ON_EXIT on (the default), a member
   is signed out whenever they exit the site/app: closing the tab
   or app, or staying away longer than LOGOUT_AFTER_AWAY_SECONDS.
   A page refresh does NOT sign anyone out. Push alerts keep working
   after an exit-logout; only the Log Out button turns them off.
========================================================= */

const LOGOUT_AFTER_AWAY_SECONDS = 180; // set to 0 to only log out when the tab/app is closed
const TAB_ALIVE_KEY = "nbh_tab_alive";
let hiddenSince = null;

function markTabAlive() {
  try { sessionStorage.setItem(TAB_ALIVE_KEY, "1"); } catch (e) { /* ignore */ }
}

function clearTabAlive() {
  try { sessionStorage.removeItem(TAB_ALIVE_KEY); } catch (e) { /* ignore */ }
}

function tabWasAlive() {
  try { return sessionStorage.getItem(TAB_ALIVE_KEY) === "1"; } catch (e) { return true; }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hiddenSince = Date.now();
    return;
  }
  const away = hiddenSince ? Date.now() - hiddenSince : 0;
  hiddenSince = null;
  if (session && session.logoutOnExit && LOGOUT_AFTER_AWAY_SECONDS > 0 && away > LOGOUT_AFTER_AWAY_SECONDS * 1000) {
    logout({ keepPush: true, message: "You were signed out because you left the app. Please log in again." });
  }
});

async function logout(options = {}) {
  stopPolling();
  clearTabAlive();
  if (!options.keepPush) await disablePushForThisDevice();
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout request failed.", error);
  }

  session = null;
  offlineClearAll();
  updateNetBanner();
  data = { users: [], posts: [], social: {} };

  activePostId = null;
  activeAlbumId = null;
  composerImages = [];
  composerVideo = null;
  composerMusic = null;
  viewingUsername = null;

  document.getElementById("app")?.classList.add("hidden");
  document.getElementById("authScreen")?.classList.remove("hidden");
  document.getElementById("loginForm")?.reset();

  showWelcome();
  showMessage(options.message || "You've been logged out.");
}

/* =========================================================
   NAVIGATION
   Keeps the mobile bottom nav and the desktop sidebar rail
   in sync — both call the same openPage(), just styled
   differently by screen size.
========================================================= */

function openPage(page) {
  document.querySelectorAll(".page").forEach(section => section.classList.remove("active"));
  const target = document.getElementById(page + "Page");
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
  const nav = document.querySelector(`.nav-item[onclick="openPage('${page}')"]`);
  if (nav) nav.classList.add("active");

  document.querySelectorAll(".rail-item").forEach(btn => btn.classList.remove("active"));
  const rail = document.querySelector(`.rail-item[data-rail="${page}"]`);
  if (rail) rail.classList.add("active");

  if (page === "friends") {
    renderFriends();
  }
  if (page === "admin") {
    if (!session?.isAdmin) {
      openPage("home");
      return;
    }
    loadAdminPanel();
  }
  if (page === "notifications") {
    const social = ensureSocial();
    social.notifications.forEach(n => { n.unread = false; });
    saveData();
    renderNotifications();
    updateNotificationDot();
  }
}

/* =========================================================
   PROFILE HEADER
========================================================= */

function applyProfileCover(user) {
  const cover = document.getElementById("profileCover");
  if (!cover) return;
  cover.style.backgroundImage = user.bannerImage ? `url("${user.bannerImage}")` : "";
}

function renderUser() {
  const user = currentUser();
  if (!user) return;
  ["headerAvatar", "homeAvatar", "modalAvatar", "profileAvatar", "sidebarAvatar"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (user.avatarImage) {
      el.innerHTML = `<img src="${escapeHTML(user.avatarImage)}" alt="${escapeHTML(user.name)}">`;
    } else {
      el.textContent = user.avatar || avatarLetter(user.name);
    }
  });
  document.getElementById("modalName")?.replaceChildren(document.createTextNode(user.name));
  const profileName = document.getElementById("profileName");
  if (profileName) profileName.textContent = user.name;
  const profileUsername = document.getElementById("profileUsername");
  if (profileUsername) profileUsername.textContent = user.username;
  const profileBio = document.getElementById("profileBio");
  if (profileBio) profileBio.textContent = user.bio;
  const sidebarName = document.getElementById("sidebarName");
  if (sidebarName) sidebarName.textContent = user.name;
  const sidebarUsername = document.getElementById("sidebarUsername");
  if (sidebarUsername) sidebarUsername.textContent = user.username;
  applyProfileCover(user);
}

/* =========================================================
   AVATAR UPLOAD
========================================================= */

function triggerAvatarUpload() {
  document.getElementById("avatarInput")?.click();
}

const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
  avatarInput.addEventListener("change", async function () {
    const file = this.files && this.files[0];
    this.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showMessage("Please choose an image file.");
      return;
    }
    try {
      await openAvatarEditor(file, "avatar");
    } catch (error) {
      console.error(error);
      showMessage("Couldn't open that image.");
    }
  });
}

/* ---------------------------------------------------------
   PROFILE PICTURE EDITOR — move, zoom and rotate the photo
   inside a round frame before it is saved.
--------------------------------------------------------- */
const AE = { img: null, rot: 0, zoom: 1, minZoom: 1, x: 0, y: 0, W: 600, H: 600, mode: "avatar", saving: false, pointers: new Map(), pinch: 0 };
const AE_MODES = {
  avatar: { W: 600, H: 600, outW: 500, outH: 500, title: "Edit Profile Picture", done: "Profile picture updated!" },
  banner: { W: 900, H: 300, outW: 1500, outH: 500, title: "Adjust Cover Photo", done: "Cover photo updated!" }
};

function aeCanvas() { return document.getElementById("avatarCropCanvas"); }
function aeDims() {
  const turned = AE.rot % 2 === 1;
  return { w: turned ? AE.img.height : AE.img.width, h: turned ? AE.img.width : AE.img.height };
}
// "Cover" fit: the photo always fills the whole frame (no empty bars); zoom only goes in from there.
function aeScale() { const d = aeDims(); return Math.max(AE.W / d.w, AE.H / d.h) * AE.zoom; }
// Zoom value at which the WHOLE photo is visible inside the frame (bars may appear at the sides).
function aeFitZoom() {
  const d = aeDims();
  return Math.min(AE.W / d.w, AE.H / d.h) / Math.max(AE.W / d.w, AE.H / d.h);
}
function aeUpdateMinZoom() {
  AE.minZoom = AE.mode === "banner" ? Math.min(1, aeFitZoom()) : 1;
  const slider = document.getElementById("avatarZoom");
  if (slider) slider.min = String(AE.minZoom);
}
function aeClamp() {
  const d = aeDims(), sc = aeScale();
  const maxX = Math.max(0, (d.w * sc - AE.W) / 2);
  const maxY = Math.max(0, (d.h * sc - AE.H) / 2);
  AE.x = Math.min(maxX, Math.max(-maxX, AE.x));
  AE.y = Math.min(maxY, Math.max(-maxY, AE.y));
}
function aeRender(ctx, outW) {
  const k = outW / AE.W;
  ctx.fillStyle = AE.mode === "banner" ? "#0f172a" : "#ffffff";
  ctx.fillRect(0, 0, AE.W * k, AE.H * k);
  if (AE.mode === "banner" && AE.zoom < 1.0001) {
    // Behind a photo that doesn't fill the banner, show a soft blurred copy instead of plain bars.
    const d = aeDims();
    const cs = Math.max(AE.W / d.w, AE.H / d.h) * 1.15 * k;
    ctx.save();
    ctx.translate(AE.W * k / 2, AE.H * k / 2);
    ctx.scale(cs, cs);
    ctx.rotate(AE.rot * Math.PI / 2);
    if ("filter" in ctx) ctx.filter = "blur(" + Math.round(18 * k) + "px) brightness(.7)";
    ctx.drawImage(AE.img, -AE.img.width / 2, -AE.img.height / 2);
    ctx.restore();
  }
  ctx.save();
  ctx.translate(AE.W * k / 2 + AE.x * k, AE.H * k / 2 + AE.y * k);
  ctx.scale(aeScale() * k, aeScale() * k);
  ctx.rotate(AE.rot * Math.PI / 2);
  ctx.drawImage(AE.img, -AE.img.width / 2, -AE.img.height / 2);
  ctx.restore();
}
function aeDraw() {
  const c = aeCanvas();
  if (!c || !AE.img) return;
  aeClamp();
  aeRender(c.getContext("2d"), AE.W);
}
function aeSetZoom(z) {
  AE.zoom = Math.min(4, Math.max(AE.minZoom || 1, z));
  const slider = document.getElementById("avatarZoom");
  if (slider) slider.value = String(AE.zoom);
  aeDraw();
}

async function openAvatarEditor(file, mode) {
  mode = AE_MODES[mode] ? mode : "avatar";
  const dataUrl = await readFileAsDataURL(file);
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = dataUrl;
  });
  const cfg = AE_MODES[mode];
  AE.img = img; AE.rot = 0; AE.zoom = 1; AE.x = 0; AE.y = 0; AE.saving = false;
  AE.mode = mode; AE.W = cfg.W; AE.H = cfg.H;
  AE.pointers.clear(); AE.pinch = 0;
  aeUpdateMinZoom();
  // Cover photos open showing the whole picture; zoom in to crop tighter.
  if (mode === "banner") AE.zoom = AE.minZoom;
  const fitBtn = document.getElementById("avatarFitBtn");
  if (fitBtn) fitBtn.hidden = mode !== "banner";
  const c = aeCanvas();
  c.width = AE.W; c.height = AE.H;
  const frame = document.getElementById("avatarCrop");
  if (frame) frame.classList.toggle("banner", mode === "banner");
  const title = document.getElementById("avatarEditTitle");
  if (title) title.textContent = cfg.title;
  const slider = document.getElementById("avatarZoom");
  if (slider) slider.value = String(AE.zoom);
  const btn = document.getElementById("avatarSaveBtn");
  if (btn) { btn.disabled = false; btn.textContent = "Save"; }
  document.getElementById("avatarEditModal")?.classList.remove("hidden");
  aeDraw();
}

// "Choose another" inside the editor keeps whichever mode (profile picture / cover) is open.
function aeChooseAnother() {
  document.getElementById(AE.mode === "banner" ? "bannerInput" : "avatarInput")?.click();
}

function cancelAvatarEdit() {
  if (AE.saving) return;
  document.getElementById("avatarEditModal")?.classList.add("hidden");
  AE.img = null;
}
// Puts the photo back in the middle of the frame (keeps the current zoom and rotation).
function centerAvatarEdit() {
  if (!AE.img) return;
  AE.x = 0; AE.y = 0;
  aeDraw();
}
function rotateAvatarEdit() {
  if (!AE.img) return;
  AE.rot = (AE.rot + 1) % 4;
  AE.x = 0; AE.y = 0;
  aeUpdateMinZoom();
  aeSetZoom(AE.mode === "banner" ? AE.minZoom : AE.zoom);
}
function resetAvatarEdit() {
  if (!AE.img) return;
  AE.rot = 0; AE.x = 0; AE.y = 0;
  aeUpdateMinZoom();
  aeSetZoom(AE.mode === "banner" ? AE.minZoom : 1);
}
function fitAvatarEdit() {
  if (!AE.img) return;
  AE.x = 0; AE.y = 0;
  aeUpdateMinZoom();
  aeSetZoom(AE.minZoom);
}

async function saveAvatarEdit() {
  if (!AE.img || AE.saving) return;
  const user = currentUser();
  if (!user) return;
  if (isOffline()) { showMessage("You are offline. Connect to the internet to change your photo."); return; }
  AE.saving = true;
  const cfg = AE_MODES[AE.mode];
  const btn = document.getElementById("avatarSaveBtn");
  if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
  try {
    const out = document.createElement("canvas");
    out.width = cfg.outW; out.height = cfg.outH;
    aeClamp();
    aeRender(out.getContext("2d"), cfg.outW);
    const url = await uploadMedia(out.toDataURL("image/jpeg", 0.88), "image");
    if (AE.mode === "banner") user.bannerImage = url; else user.avatarImage = url;
    if (saveData()) {
      AE.saving = false;
      cancelAvatarEdit();
      renderEverything();
      showMessage(cfg.done);
    } else {
      AE.saving = false;
      if (btn) { btn.disabled = false; btn.textContent = "Save"; }
    }
  } catch (error) {
    console.error(error);
    AE.saving = false;
    if (btn) { btn.disabled = false; btn.textContent = "Save"; }
    showMessage((error && error.message) || "Couldn't save that photo.");
  }
}

(function wireAvatarEditor() {
  const frame = document.getElementById("avatarCrop");
  const slider = document.getElementById("avatarZoom");
  if (!frame) return;
  const toCanvasUnits = () => AE.W / frame.getBoundingClientRect().width;
  const pinchDist = () => {
    const pts = [...AE.pointers.values()];
    return pts.length < 2 ? 0 : Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  };
  frame.addEventListener("pointerdown", e => {
    if (!AE.img) return;
    frame.setPointerCapture(e.pointerId);
    AE.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    AE.pinch = pinchDist();
  });
  frame.addEventListener("pointermove", e => {
    const prev = AE.pointers.get(e.pointerId);
    if (!prev || !AE.img) return;
    AE.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (AE.pointers.size >= 2) {
      const d = pinchDist();
      if (AE.pinch && d) aeSetZoom(AE.zoom * (d / AE.pinch));
      AE.pinch = d;
    } else {
      const k = toCanvasUnits();
      AE.x += (e.clientX - prev.x) * k;
      AE.y += (e.clientY - prev.y) * k;
      aeDraw();
    }
  });
  const end = e => { AE.pointers.delete(e.pointerId); AE.pinch = pinchDist(); };
  frame.addEventListener("pointerup", end);
  frame.addEventListener("pointercancel", end);
  frame.addEventListener("wheel", e => {
    if (!AE.img) return;
    e.preventDefault();
    aeSetZoom(AE.zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08));
  }, { passive: false });
  if (slider) slider.addEventListener("input", () => aeSetZoom(parseFloat(slider.value) || 1));
})();

/* =========================================================
   COVER UPLOAD
========================================================= */

function triggerBannerUpload() {
  document.getElementById("bannerInput")?.click();
}

const bannerInput = document.getElementById("bannerInput");
if (bannerInput) {
  bannerInput.addEventListener("change", async function () {
    const file = this.files && this.files[0];
    this.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showMessage("Please choose an image file.");
      return;
    }
    // Opens the cover editor: the photo is already fitted to the banner shape;
    // the member can drag, zoom and rotate it, then Save (same as the profile picture).
    try {
      await openAvatarEditor(file, "banner");
    } catch (error) {
      console.error(error);
      showMessage("Couldn't open that image.");
    }
  });
}

/* =========================================================
   POST CARD HTML
========================================================= */

function postCardHTML(post, options = {}) {
  // Which emoji (if any) the CURRENTLY LOGGED-IN member picked for this
  // post — per-member state, so it never shows another member's reaction
  // as if it were yours (see ensureSocialFor).
  const myReaction = (ensureSocial().myReactions || {})[post.id];
  const reactionButtons = REACTIONS.map(emoji => `    <button class="reaction-btn ${myReaction === emoji ? "active" : ""}" onclick="toggleReaction(${post.id}, '${emoji}')">
      ${emoji}
      ${post.reactions && post.reactions[emoji] ? ` ${post.reactions[emoji]}` : ""}
    </button>
  `).join("");

  let mediaHTML = "";

  if (post.video) {
    mediaHTML = `
      <video class="post-video" src="${escapeHTML(post.video)}" controls playsinline></video>
    `;
  } else if (post.images && post.images.length) {
    mediaHTML = `
      <div class="post-album">
        ${post.images.map(src => `<img src="${escapeHTML(src)}" alt="Album image">`).join("")}
      </div>
    `;
  } else if (post.image) {
    mediaHTML = `
      <img class="post-image" src="${escapeHTML(post.image)}" alt="Post image">
    `;
  }

  const author = findUser(post.username) || {
    name: post.name,
    avatar: post.avatar,
    avatarImage: post.avatarImage
  };
  const authorAvatarHTML = author.avatarImage
    ? `<img src="${escapeHTML(author.avatarImage)}" alt="${escapeHTML(author.name)}">`
    : escapeHTML(author.avatar || avatarLetter(author.name));

  const repostTag = options.repostedBy
    ? `<div class="repost-tag">${iconSVG("repeat")} ${escapeHTML(options.repostedBy)} reposted</div>`
    : "";

  // Whether the CURRENTLY LOGGED-IN member has saved this post — also
  // per-member state, not a field on the shared post (see ensureSocialFor).
  const saved = ensureSocial().savedPostIds.includes(post.id);

  return `
    <article class="post-card" data-post-id="${post.id}">
      ${repostTag}
      <div class="post-header">
        <div class="avatar ${post.username ? "clickable" : ""}" ${post.username ? `onclick="openUserProfile('${escapeHTML(post.username)}')"` : ""}>
          ${authorAvatarHTML}
        </div>
        <div class="post-user" ${post.username ? `onclick="openUserProfile('${escapeHTML(post.username)}')"` : ""}>
          <strong>${escapeHTML(author.name)}</strong>
          <small title="${escapeHTML(fullStamp(post.createdAt))}">${escapeHTML(typeof post.createdAt === "number" ? "Posted " + formatStamp(post.createdAt) : post.time)} · Community</small>
        </div>
        <button onclick="openPostMenu(${post.id})" aria-label="Post options"><span class="icon">${iconSVG("moreHorizontal")}</span></button>
      </div>
      ${postTagsHTML(post)}
      <div class="post-text">${richTextHTML(post.text)}</div>
      ${mediaHTML}
      ${post.music && post.music.previewUrl ? musicBarHTML(post.music, false) : ""}
      <div class="reaction-bar">${reactionButtons}</div>
      <div class="post-actions">
        <button onclick="openComments(${post.id})"><span class="icon">${iconSVG("messageCircle")}</span> ${post.comments || 0}</button>
        <button class="${isRepostedByCurrentUser(post.id) ? "shared" : ""}" onclick="sharePost(${post.id})"><span class="icon">${iconSVG("repeat")}</span> ${post.shares || 0}</button>
        <button class="save-button" onclick="savePost(${post.id})" aria-label="${saved ? "Remove from saved" : "Save post"}"><span class="icon">${iconSVG("bookmark", { filled: saved })}</span></button>
      </div>
      ${totalReactions(post) > 0
        ? `<button type="button" class="post-reactions post-reactions-link" onclick="openReactors(${post.id})">${totalReactions(post)} ${totalReactions(post) === 1 ? "person" : "people"} reacted to this post</button>`
        : `<div class="post-reactions">Be the first to react</div>`}
    </article>
  `;
}

/* =========================================================
   FEED
   One shared community feed — every member's posts show up
   here for everyone, newest first.
========================================================= */

function renderFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;
  if (!data.posts.length) {
    feed.innerHTML = `<p class="no-results">No posts yet. Be the first to share something!</p>`;
    return;
  }
  feed.innerHTML = data.posts.map(post => postCardHTML(post)).join("");
}

function totalReactions(post) {
  if (!post.reactions) return 0;
  return Object.values(post.reactions).reduce((total, count) => total + count, 0);
}

/* =========================================================
   REACTIONS
========================================================= */

function toggleReaction(id, emoji) {
  const post = data.posts.find(p => p.id === id);
  if (!post) return;
  if (!post.reactions) post.reactions = {};

  const user = currentUser();
  const social = ensureSocial();
  const previousReaction = social.myReactions[id] || null;
  const wasReacting = previousReaction === emoji;

  if (wasReacting) {
    post.reactions[emoji] = Math.max(0, (post.reactions[emoji] || 0) - 1);
    delete social.myReactions[id];
  } else {
    if (previousReaction) {
      post.reactions[previousReaction] = Math.max(0, (post.reactions[previousReaction] || 0) - 1);
    }
    post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;
    social.myReactions[id] = emoji;
  }

  // Keep the "who reacted" list in step right away (the server confirms it on save).
  if (user) {
    post.reactors = (Array.isArray(post.reactors) ? post.reactors : []).filter(r => !usernamesMatch(r.username, user.username));
    if (social.myReactions[id]) post.reactors.push({ username: user.username, emoji: social.myReactions[id] });
  }



  saveData();
  renderFeed();
  renderProfile();
  if (activePostId === id) refreshPostView();
  refreshLightbox();
  refreshReactorsSheet();
}

/* =========================================================
   SHARE / REPOST
========================================================= */

function isRepostedByCurrentUser(postId) {
  const social = ensureSocial();
  return social.reposts.some(r => r.postId === postId);
}

function sharePost(id) {
  const post = data.posts.find(p => p.id === id);
  if (!post) return;
  const user = currentUser();
  if (!user) return;

  const social = ensureSocial();
  const alreadyReposted = social.reposts.some(r => r.postId === id);

  if (alreadyReposted) {
    social.reposts = social.reposts.filter(r => r.postId !== id);
    post.shares = Math.max(0, (post.shares || 0) - 1);
    saveData();
    renderFeed();
    renderProfile();
    if (activePostId === id) refreshPostView();
    showMessage("Repost removed.");
    return;
  }

  social.reposts.unshift({
    postId: id,
    time: "Just now"
  });
  post.shares = (post.shares || 0) + 1;



  saveData();
  renderFeed();
  renderProfile();
  if (activePostId === id) refreshPostView();
  showMessage("Reposted to your profile!");
}

/* =========================================================
   SAVE
========================================================= */

function savePost(id) {
  const post = data.posts.find(p => p.id === id);
  if (!post) return;
  const social = ensureSocial();
  const index = social.savedPostIds.indexOf(id);
  const nowSaved = index === -1;
  if (nowSaved) social.savedPostIds.push(id);
  else social.savedPostIds.splice(index, 1);
  saveData();
  renderFeed();
  renderProfile();
  if (activePostId === id) refreshPostView();
  showMessage(nowSaved ? "Post saved." : "Post removed from saved.");
}

/* =========================================================
   POST MENU
========================================================= */

function openPostMenu(id) {
  const post = data.posts.find(p => p.id === id);
  if (!post) return;
  activePostId = id;
  const user = currentUser();
  const isOwner = user && post.username && usernamesMatch(post.username, user.username);
  const isAdmin = user && user.isAdmin;
  const options = document.getElementById("postMenuOptions");
  if (!options) return;
  options.innerHTML = `
    ${isOwner || isAdmin ? `
      <button class="menu-option danger" onclick="confirmDeletePost(${id})">🗑 Delete Post</button>
    ` : `
      <p class="no-results">Only the post owner can delete this post.</p>
    `}
    <button class="menu-option" onclick="closeModal('postMenuModal')">Cancel</button>
  `;
  document.getElementById("postMenuModal")?.classList.remove("hidden");
}

/* =========================================================
   DELETE POST
========================================================= */

function confirmDeletePost(id) {
  if (!confirm("Delete this post? This can't be undone.")) return;
  deletePost(id);
}

function deletePost(id) {
  const index = data.posts.findIndex(p => p.id === id);
  if (index === -1) return;
  data.posts.splice(index, 1);
  data.deletedPostIds = Array.isArray(data.deletedPostIds) ? data.deletedPostIds : [];
  data.deletedPostIds.push(id);
  if (data.social) {
    Object.values(data.social).forEach(social => {
      if (Array.isArray(social.reposts)) {
        social.reposts = social.reposts.filter(r => r.postId !== id);
      }
      if (Array.isArray(social.savedPostIds)) {
        social.savedPostIds = social.savedPostIds.filter(savedId => savedId !== id);
      }
      if (social.myReactions && typeof social.myReactions === "object") {
        delete social.myReactions[id];
      }
    });
  }
  saveData();
  closeModal("postMenuModal");
  closeModal("postViewModal");
  closeModal("commentsModal");
  if (activePostId === id) activePostId = null;
  renderEverything();
  showMessage("Post deleted.");
}

/* =========================================================
   COMMENTS
========================================================= */

function openComments(id) {
  activePostId = id;
  renderCommentsList();
  const input = document.getElementById("commentInput");
  if (input) input.value = "";
  document.getElementById("commentsModal")?.classList.remove("hidden");
  input?.focus();
}

function renderCommentsList(keepScroll) {
  const post = data.posts.find(p => p.id === activePostId);
  const container = document.getElementById("commentsList");
  if (!post || !container) return;
  const list = post.commentsList || [];
  if (!list.length) {
    container.innerHTML = `<p class="no-results">No comments yet. Be the first to comment!</p>`;
    return;
  }
  const me = session && session.username;
  container.innerHTML = list.map(comment => {
    const wroteIt = comment.username ? usernamesMatch(comment.username, me) : (currentUser() && comment.name === currentUser().name);
    const canDelete = !!comment.id && (wroteIt || usernamesMatch(post.username, me) || (session && session.isAdmin));
    const likes = Array.isArray(comment.likes) ? comment.likes : [];
    const iLiked = !!me && likes.some(u => usernamesMatch(u, me));
    const likeBtn = comment.id
      ? `<button type="button" class="comment-like ${iLiked ? "liked" : ""}" onclick="toggleCommentLike(${post.id}, '${escapeHTML(comment.id)}')" aria-label="${iLiked ? "Unlike" : "Like"} comment">${iLiked ? "\u2764\uFE0F" : "\uD83E\uDD0D"}${likes.length ? " " + likes.length : ""}</button>`
      : "";
    return `
    <div class="comment-item">
      <div class="avatar">
        ${comment.avatarImage ? `<img src="${escapeHTML(comment.avatarImage)}" alt="${escapeHTML(comment.name)}">` : escapeHTML(comment.avatar || avatarLetter(comment.name))}
      </div>
      <div class="comment-body">
        <strong>${escapeHTML(comment.name)}</strong>
        ${comment.text ? `<span>${richTextHTML(comment.text)}</span>` : ""}
        ${comment.sticker ? `<div class="comment-sticker" role="img" aria-label="Sticker">${escapeHTML(comment.sticker)}</div>` : ""}
        ${comment.image ? `<img class="comment-image" src="${escapeHTML(comment.image)}" alt="Photo or GIF in comment" loading="lazy">` : ""}
        ${comment.music && comment.music.previewUrl ? musicBarHTML(comment.music, false) : ""}
        <small title="${escapeHTML(fullStamp(comment.createdAt))}">${escapeHTML(formatStamp(comment.createdAt, comment.time))}</small>
        ${likeBtn}
      </div>
      ${canDelete ? `<button type="button" class="comment-delete" aria-label="Delete comment" title="Delete comment" onclick="deleteComment(${post.id}, '${escapeHTML(comment.id)}')">&times;</button>` : ""}
    </div>
  `;
  }).join("");
  if (!keepScroll) container.scrollTop = container.scrollHeight;
}

function deleteComment(postId, commentId) {
  const post = data.posts.find(p => p.id === postId);
  if (!post || !Array.isArray(post.commentsList)) return;
  if (!confirm("Delete this comment?")) return;
  post.commentsList = post.commentsList.filter(c => c.id !== commentId);
  post.comments = post.commentsList.length;
  data.deletedComments = Array.isArray(data.deletedComments) ? data.deletedComments : [];
  data.deletedComments.push({ postId, commentId });
  saveData();
  renderCommentsList();
  renderFeed();
  const pv = document.getElementById("postViewModal");
  if (pv && !pv.classList.contains("hidden")) refreshPostView();
  showMessage("Comment deleted.");
}

/* =========================================================
   COMMENT FORM
========================================================= */

let commentPhotoDataUrl = null;   // a photo/GIF picked from the device (uploaded when you press Post)
let commentGifUrl = null;         // a GIF picked from the GIF search (already hosted, nothing to upload)
let commentSticker = null;        // a big emoji sticker
let commentMusic = null;          // a 30-second song preview

const COMMENT_STICKERS = [
  "😀","😂","🤣","😍","🥰","😘","😎","🤩","🥳","😭","😢","😡","😱","🤔","🙄","😴","🤗","😇","🤪","😜",
  "👍","👎","👏","🙌","🙏","💪","👀","🔥","💯","✨","🎉","🎂","🎁","💖","💔","❤️","🧡","💛","💚","💙",
  "💜","🌹","🌈","☀️","🌙","⭐","🐴","🐶","🐱","🦄","🍕","🍔","🍰","☕","🎶","🎵","🚀","💩","🤝","🫶"
];

function showCommentPhotoPreview() {
  const box = document.getElementById("commentPhotoPreview");
  if (!box) return;
  const parts = [];
  const photoSrc = commentPhotoDataUrl || commentGifUrl;
  if (photoSrc) parts.push(`<div class="cp-item"><img src="${escAttr(photoSrc)}" alt="Selected photo or GIF"><button type="button" aria-label="Remove photo" onclick="clearCommentPhoto()">&times;</button></div>`);
  if (commentSticker) parts.push(`<div class="cp-item cp-sticker">${escapeHTML(commentSticker)}<button type="button" aria-label="Remove sticker" onclick="clearCommentSticker()">&times;</button></div>`);
  if (commentMusic) parts.push(musicBarHTML(commentMusic, "comment"));
  if (!parts.length) { box.classList.add("hidden"); box.innerHTML = ""; return; }
  box.innerHTML = parts.join("");
  box.classList.remove("hidden");
}

function clearCommentPhoto() { commentPhotoDataUrl = null; commentGifUrl = null; showCommentPhotoPreview(); }
function clearCommentSticker() { commentSticker = null; showCommentPhotoPreview(); }
function clearCommentMusic() { commentMusic = null; stopPreview(false); showCommentPhotoPreview(); }
function clearCommentAttachments() { commentPhotoDataUrl = null; commentGifUrl = null; commentSticker = null; commentMusic = null; showCommentPhotoPreview(); }

const commentPhotoInput = document.getElementById("commentPhotoInput");
if (commentPhotoInput) {
  commentPhotoInput.addEventListener("change", () => {
    const file = commentPhotoInput.files && commentPhotoInput.files[0];
    commentPhotoInput.value = "";
    if (!file) return;
    if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) { showMessage("Please choose a PNG, JPG, GIF or WebP image."); return; }
    if (file.size > 8 * 1024 * 1024) { showMessage("That image is too large (max 8MB)."); return; }
    const reader = new FileReader();
    reader.onload = () => { commentGifUrl = null; commentSticker = null; commentPhotoDataUrl = reader.result; showCommentPhotoPreview(); };
    reader.readAsDataURL(file);
  });
}

function addCommentMusic() {
  if (isOffline()) { showMessage("You are offline. Music search needs a connection."); return; }
  addMusic(track => { commentMusic = track; showCommentPhotoPreview(); });
}


/* ---- Bottom sheet used by the music and GIF pickers ----
   Dim page behind, rounded sheet that slides up, a handle you can drag down to close. */
function openPickerSheet(extraClass, innerHTML, onClose) {
  const ov = document.createElement("div");
  ov.className = "sheet-overlay " + (extraClass || "");
  ov.innerHTML = `<div class="sheet" role="dialog"><div class="sheet-handle" aria-label="Drag down to close"><span></span></div>${innerHTML}</div>`;
  document.body.appendChild(ov);
  const sheet = ov.querySelector(".sheet");
  const handle = ov.querySelector(".sheet-handle");
  requestAnimationFrame(() => ov.classList.add("open"));
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    if (onClose) onClose();
    ov.classList.remove("open");
    setTimeout(() => ov.remove(), 200);
  };
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  let startY = null, dy = 0;
  handle.addEventListener("touchstart", e => { startY = e.touches[0].clientY; dy = 0; sheet.style.transition = "none"; }, { passive: true });
  handle.addEventListener("touchmove", e => {
    if (startY == null) return;
    dy = Math.max(0, e.touches[0].clientY - startY);
    sheet.style.transform = "translateY(" + dy + "px)";
  }, { passive: true });
  handle.addEventListener("touchend", () => {
    if (startY == null) return;
    startY = null;
    sheet.style.transition = "";
    if (dy > 90) close(); else sheet.style.transform = "";
  });
  handle.addEventListener("click", close);
  return { ov, sheet, close };
}

/* ---- GIF + sticker picker for comments (GIPHY-style sheet) ---- */
function openCommentPicker(startTab) {
  if (document.querySelector(".sheet-overlay.gif-sheet")) return;
  const gifMode = startTab === "gifs";
  const { ov, close } = openPickerSheet("gif-sheet", gifMode
    ? `<div class="gs-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input class="cp-search" type="search" placeholder="Search GIPHY" autocomplete="off" autocapitalize="off" enterkeyhint="search"></div>
       <div class="gs-body"></div>`
    : `<div class="gs-title">Stickers</div><div class="gs-body"></div>`);
  const body = ov.querySelector(".gs-body");
  const search = ov.querySelector(".cp-search");
  let token = 0, timer = null, gifs = [], offset = 0, loading = false, done = false, cols = null, heights = [0, 0];

  const finish = () => { close(); showCommentPhotoPreview(); document.getElementById("commentInput")?.focus(); };

  function drawStickers() {
    body.className = "gs-body cp-sticker-grid";
    body.innerHTML = COMMENT_STICKERS.map(e => `<button type="button" class="cp-sticker-btn" data-sticker="${escAttr(e)}" aria-label="Sticker ${escAttr(e)}">${escapeHTML(e)}</button>`).join("");
  }

  function addGifs(list) {
    list.forEach(g => {
      const i = gifs.push(g) - 1;
      const ratio = (g.width && g.height) ? g.height / g.width : 1;
      const c = heights[0] <= heights[1] ? 0 : 1;
      heights[c] += ratio;
      const b = document.createElement("button");
      b.type = "button"; b.className = "cp-gif-btn"; b.dataset.gif = i;
      b.style.aspectRatio = g.width && g.height ? g.width + " / " + g.height : "1 / 1";
      const img = document.createElement("img");
      img.src = g.preview; img.alt = g.title || "GIF"; img.loading = "lazy";
      b.appendChild(img);
      cols[c].appendChild(b);
    });
  }

  async function loadGifs(reset) {
    if (reset) { token++; gifs = []; offset = 0; done = false; heights = [0, 0]; }
    if (loading && !reset) return;
    if (done) return;
    const mine = token;
    if (isOffline()) { body.innerHTML = `<p class="mp-empty">You are offline. GIFs need a connection.</p>`; return; }
    loading = true;
    if (reset) { body.innerHTML = `<p class="mp-empty">Loading…</p>`; }
    try {
      const res = await api("/api/gifs/search?q=" + encodeURIComponent(search.value.trim()) + "&offset=" + offset);
      if (mine !== token) return;
      if (res && res.configured === false) {
        ov.querySelector(".gs-search").classList.add("hidden");
        body.innerHTML = `<p class="mp-empty">GIF search isn't switched on for this site yet.<br>You can still add a GIF from your device:</p>
          <p style="text-align:center"><button type="button" class="soft-button" data-a="device">Choose a GIF from my device</button></p>`;
        done = true;
        return;
      }
      const list = (res && res.results) || [];
      if (reset) {
        if (!list.length) { body.innerHTML = `<p class="mp-empty">No GIFs found. Try another search.</p>`; done = true; return; }
        body.innerHTML = `<div class="gs-cols"><div class="gs-col"></div><div class="gs-col"></div></div><p class="cp-credit">Powered by GIPHY</p>`;
        cols = body.querySelectorAll(".gs-col");
      }
      if (!list.length) done = true;
      offset += list.length;
      addGifs(list);
    } catch (err) {
      if (mine !== token) return;
      if (reset) body.innerHTML = `<p class="mp-empty">${escapeHTML((err && err.message) || "Couldn't load GIFs.")}</p>`;
    } finally {
      if (mine === token) loading = false;
    }
  }

  if (gifMode) {
    body.className = "gs-body";
    body.addEventListener("scroll", () => {
      if (body.scrollTop + body.clientHeight > body.scrollHeight - 400) loadGifs(false);
    }, { passive: true });
    search.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => loadGifs(true), 400); });
    loadGifs(true);
  } else {
    drawStickers();
  }

  ov.addEventListener("click", event => {
    const t = event.target.closest("button");
    if (!t) return;
    if (t.dataset.a === "device") { close(); document.getElementById("commentPhotoInput")?.click(); return; }
    if (t.dataset.sticker) {
      commentSticker = t.dataset.sticker; commentPhotoDataUrl = null; commentGifUrl = null;
      return finish();
    }
    if (t.dataset.gif != null) {
      const g = gifs[Number(t.dataset.gif)];
      if (!g) return;
      commentGifUrl = g.url; commentPhotoDataUrl = null; commentSticker = null;
      finish();
    }
  });
}

const commentForm = document.getElementById("commentForm");
if (commentForm) {
  commentForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const input = document.getElementById("commentInput");
    const text = input.value.trim();
    const postId = activePostId;
    if ((!text && !commentPhotoDataUrl && !commentGifUrl && !commentSticker && !commentMusic) || !postId) return;
    const user = currentUser();
    if (!user) return;
    const submitBtn = commentForm.querySelector('button[type="submit"]');

    let imageUrl = commentGifUrl || null;
    if (commentPhotoDataUrl) {
      try {
        if (submitBtn) submitBtn.disabled = true;
        imageUrl = await uploadMedia(commentPhotoDataUrl, "image");
      } catch (error) {
        showMessage((error && error.message) || "Couldn't upload that photo.");
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      if (submitBtn) submitBtn.disabled = false;
    }

    // Look the post up again: the feed may have refreshed while the upload ran.
    const post = data.posts.find(p => p.id === postId);
    if (!post) return;
    if (!post.commentsList) post.commentsList = [];
    post.commentsList.push({
      name: user.name,
      avatar: user.avatar,
      avatarImage: user.avatarImage || null,
      text: text,
      image: imageUrl,
      sticker: commentSticker || null,
      music: commentMusic ? { ...commentMusic } : null,
      time: "Just now",
      createdAt: Date.now()
    });
    post.comments = post.commentsList.length;

    saveData();
    input.value = "";
    stopPreview(false);
    clearCommentAttachments();
    renderCommentsList();
    renderFeed();

    const postViewModal = document.getElementById("postViewModal");
    if (postViewModal && !postViewModal.classList.contains("hidden")) {
      refreshPostView();
    }
  });
}

/* =========================================================
   POST VIEW
========================================================= */

function openPostView(id) {
  const post = data.posts.find(p => p.id === id);
  if (!post) return;
  activePostId = id;
  const content = document.getElementById("postViewContent");
  if (!content) return;
  content.innerHTML = postCardHTML(post);
  document.getElementById("postViewModal")?.classList.remove("hidden");
}

function refreshPostView() {
  const post = data.posts.find(p => p.id === activePostId);
  const content = document.getElementById("postViewContent");
  if (!post || !content) return;
  content.innerHTML = postCardHTML(post);
}

/* =========================================================
   FULL-SCREEN PHOTO VIEWER (lightbox)
   Tap a photo -> full screen. Swipe left/right (or use the arrows /
   keyboard) to move between photos in the same post, swipe down or
   tap X to close. Shows who reacted and lets you react from here.
========================================================= */

const lightboxState = { postId: null, images: [], index: 0 };
let lightboxEl = null;

function postImageList(post) {
  if (!post) return [];
  if (Array.isArray(post.images) && post.images.length) return post.images.slice();
  return post.image ? [post.image] : [];
}

function buildLightbox() {
  if (lightboxEl) return lightboxEl;
  const el = document.createElement("div");
  el.id = "lightbox";
  el.className = "lightbox hidden";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "Photo viewer");
  el.innerHTML = `
    <div class="lightbox-top">
      <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
      <span class="lightbox-counter"></span>
      <span class="lightbox-spacer"></span>
    </div>
    <div class="lightbox-stage"><div class="lightbox-track"></div></div>
    <button type="button" class="lightbox-nav prev" aria-label="Previous photo">&#8249;</button>
    <button type="button" class="lightbox-nav next" aria-label="Next photo">&#8250;</button>
    <div class="lightbox-bottom">
      <div class="lightbox-caption"></div>
      <button type="button" class="lightbox-who"></button>
      <div class="lightbox-reactions"></div>
    </div>`;
  document.body.appendChild(el);
  lightboxEl = el;

  el.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  el.querySelector(".lightbox-nav.prev").addEventListener("click", () => lightboxGo(-1));
  el.querySelector(".lightbox-nav.next").addEventListener("click", () => lightboxGo(1));
  el.querySelector(".lightbox-who").addEventListener("click", () => openReactors(lightboxState.postId));

  // ---- swipe handling (finger follows; release snaps to next/prev/close) ----
  const stage = el.querySelector(".lightbox-stage");
  const track = el.querySelector(".lightbox-track");
  let startX = 0, startY = 0, dx = 0, dy = 0, startT = 0, dragging = false, axis = null;

  stage.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true; axis = null; dx = 0; dy = 0;
    startX = e.clientX; startY = e.clientY; startT = Date.now();
    track.style.transition = "none";
    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
  });

  stage.addEventListener("pointermove", e => {
    if (!dragging) return;
    dx = e.clientX - startX; dy = e.clientY - startY;
    if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    const last = lightboxState.images.length - 1;
    if (axis === "x") {
      let shown = dx;
      if ((lightboxState.index === 0 && dx > 0) || (lightboxState.index === last && dx < 0)) shown = dx * 0.35; // rubber-band at the ends
      track.style.transform = `translate3d(calc(${-lightboxState.index * 100}% + ${shown}px), 0, 0)`;
    } else if (axis === "y") {
      track.style.transform = `translate3d(${-lightboxState.index * 100}%, ${dy}px, 0)`;
      el.style.background = `rgba(0,0,0,${Math.max(0.35, 0.96 - Math.abs(dy) / 500)})`;
    }
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    el.style.background = "";
    const width = stage.clientWidth || 1;
    const fast = Math.abs(dx) / Math.max(1, Date.now() - startT) > 0.45; // px per ms
    if (axis === "x" && e.type !== "pointercancel" && (Math.abs(dx) > width * 0.2 || (fast && Math.abs(dx) > 30))) {
      lightboxGo(dx < 0 ? 1 : -1);
    } else if (axis === "y" && e.type !== "pointercancel" && Math.abs(dy) > 110) {
      closeLightbox();
      return;
    } else if (!axis && e.type === "pointerup") {
      el.classList.toggle("chrome-hidden"); // plain tap: hide/show the controls
    }
    lightboxPosition();
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  return el;
}

function lightboxPosition() {
  const track = lightboxEl && lightboxEl.querySelector(".lightbox-track");
  if (track) track.style.transform = `translate3d(${-lightboxState.index * 100}%, 0, 0)`;
  const total = lightboxState.images.length;
  const counter = lightboxEl.querySelector(".lightbox-counter");
  counter.textContent = total > 1 ? `${lightboxState.index + 1} / ${total}` : "";
  lightboxEl.querySelector(".lightbox-nav.prev").classList.toggle("hidden", lightboxState.index <= 0);
  lightboxEl.querySelector(".lightbox-nav.next").classList.toggle("hidden", lightboxState.index >= total - 1);
}

function lightboxGo(step) {
  const next = lightboxState.index + step;
  if (next < 0 || next > lightboxState.images.length - 1) { lightboxPosition(); return; }
  lightboxState.index = next;
  lightboxPosition();
}

function openLightbox(postId, index) {
  const post = data.posts.find(p => p.id === postId);
  const images = postImageList(post);
  if (!post || !images.length) return;
  buildLightbox();
  lightboxState.postId = postId;
  lightboxState.images = images;
  lightboxState.index = Math.min(Math.max(0, index || 0), images.length - 1);
  lightboxEl.querySelector(".lightbox-track").innerHTML = images
    .map(src => `<div class="lightbox-slide"><img src="${escapeHTML(src)}" alt="Photo" draggable="false"></div>`)
    .join("");
  lightboxEl.classList.remove("hidden", "chrome-hidden");
  document.body.classList.add("lightbox-open");
  lightboxPosition();
  refreshLightbox();
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.add("hidden");
  document.body.classList.remove("lightbox-open");
  closeModal("reactorsModal");
  lightboxState.postId = null;
}

// Re-draws the caption, reaction summary and reaction buttons (e.g. after a sync or a tap).
function refreshLightbox() {
  if (!lightboxEl || lightboxEl.classList.contains("hidden")) return;
  const post = data.posts.find(p => p.id === lightboxState.postId);
  if (!post) { closeLightbox(); return; } // the post was deleted while viewing

  const author = findUser(post.username) || { name: post.name };
  const caption = lightboxEl.querySelector(".lightbox-caption");
  caption.innerHTML = `<strong>${escapeHTML(author.name || "")}</strong>${post.text ? " " + richTextHTML(post.text) : ""}`;

  const total = totalReactions(post);
  const top = REACTIONS.filter(e => post.reactions && post.reactions[e] > 0)
    .sort((a, b) => post.reactions[b] - post.reactions[a]).slice(0, 3).join("");
  const who = lightboxEl.querySelector(".lightbox-who");
  who.textContent = total > 0 ? `${top} ${total} · See who reacted` : "No reactions yet";
  who.disabled = total === 0;

  const mine = (ensureSocial().myReactions || {})[post.id];
  lightboxEl.querySelector(".lightbox-reactions").innerHTML = REACTIONS.map(emoji =>
    `<button type="button" class="${mine === emoji ? "active" : ""}" onclick="toggleReaction(${post.id}, '${emoji}')" aria-label="React ${emoji}">${emoji}</button>`
  ).join("");
}

window.addEventListener("keydown", event => {
  if (!lightboxEl || lightboxEl.classList.contains("hidden")) return;
  const sheetOpen = !document.getElementById("reactorsModal")?.classList.contains("hidden");
  if (event.key === "Escape") {
    if (sheetOpen) { closeModal("reactorsModal"); event.stopImmediatePropagation(); }
    else closeLightbox();
  } else if (!sheetOpen && event.key === "ArrowLeft") lightboxGo(-1);
  else if (!sheetOpen && event.key === "ArrowRight") lightboxGo(1);
}, true);

/* =========================================================
   WHO REACTED (list of members + their emoji)
========================================================= */

let reactorsPostId = null;
let reactorsFilter = "all";

function openReactors(postId) {
  const post = data.posts.find(p => p.id === postId);
  if (!post) return;
  reactorsPostId = postId;
  reactorsFilter = "all";
  renderReactorsSheet();
  document.getElementById("reactorsModal")?.classList.remove("hidden");
}

function refreshReactorsSheet() {
  const modal = document.getElementById("reactorsModal");
  if (modal && !modal.classList.contains("hidden")) renderReactorsSheet();
}

function renderReactorsSheet() {
  const content = document.getElementById("reactorsContent");
  const post = data.posts.find(p => p.id === reactorsPostId);
  if (!content || !post) return;

  const all = (Array.isArray(post.reactors) ? post.reactors : []).filter(r => REACTIONS.includes(r.emoji));
  if (!all.length) {
    content.innerHTML = `<p class="no-results">${totalReactions(post) > 0 ? "Loading who reacted…" : "No reactions yet."}</p>`;
    return;
  }
  if (reactorsFilter !== "all" && !all.some(r => r.emoji === reactorsFilter)) reactorsFilter = "all";

  const chips = [`<button type="button" class="${reactorsFilter === "all" ? "active" : ""}" onclick="setReactorsFilter('all')">All ${all.length}</button>`]
    .concat(REACTIONS.filter(e => all.some(r => r.emoji === e)).map(e =>
      `<button type="button" class="${reactorsFilter === e ? "active" : ""}" onclick="setReactorsFilter('${e}')">${e} ${all.filter(r => r.emoji === e).length}</button>`));

  const me = currentUser();
  const rows = all
    .filter(r => reactorsFilter === "all" || r.emoji === reactorsFilter)
    .sort((a, b) => (usernamesMatch(b.username, me && me.username) ? 1 : 0) - (usernamesMatch(a.username, me && me.username) ? 1 : 0))
    .map(r => {
      const u = findUser(r.username) || { name: r.username, avatar: avatarLetter(r.username) };
      const isMe = usernamesMatch(r.username, me && me.username);
      const avatar = u.avatarImage ? `<img src="${escapeHTML(u.avatarImage)}" alt="">` : escapeHTML(u.avatar || avatarLetter(u.name));
      return `<button type="button" class="reactor-row" onclick="openReactorProfile('${escapeHTML(r.username)}')">
        <span class="avatar">${avatar}</span>
        <span class="reactor-name">${escapeHTML(u.name)}${isMe ? " (You)" : ""}</span>
        <span class="reactor-emoji">${r.emoji}</span>
      </button>`;
    }).join("");

  content.innerHTML = `<div class="reactor-chips">${chips.join("")}</div><div class="reactor-list">${rows}</div>`;
}

function setReactorsFilter(emoji) {
  reactorsFilter = emoji;
  renderReactorsSheet();
}

function openReactorProfile(username) {
  closeModal("reactorsModal");
  closeLightbox();
  closeModal("postViewModal");
  openUserProfile(username);
}

/* =========================================================
   COMPOSER
========================================================= */

function openComposer() {
  const user = currentUser();
  if (!user) return;
  const modalName = document.getElementById("modalName");
  if (modalName) modalName.textContent = user.name;
  const modalAvatar = document.getElementById("modalAvatar");
  if (modalAvatar) {
    if (user.avatarImage) {
      modalAvatar.innerHTML = `<img src="${escapeHTML(user.avatarImage)}" alt="${escapeHTML(user.name)}">`;
    } else {
      modalAvatar.textContent = user.avatar;
    }
  }
  document.getElementById("composerModal")?.classList.remove("hidden");
  document.getElementById("postText")?.focus();
}

/* Loading state while posting: photos/videos still uploading, and the post itself being saved. */
let composerPending = 0;   // photos/videos still uploading
let composerGen = 0;       // bumps when the composer closes so late uploads are ignored
let postingNow = false;

function updateComposerBusy() {
  const btn = document.getElementById("publishButton");
  if (btn) {
    btn.disabled = postingNow || composerPending > 0;
    btn.textContent = postingNow ? "Posting…" : (composerPending > 0 ? "Uploading…" : "Post");
  }
  document.getElementById("postingOverlay")?.classList.toggle("hidden", !postingNow);
}

function closeComposer() {
  if (postingNow) return; // don't close while the post is being saved
  composerGen++;
  composerPending = 0;
  updateComposerBusy();
  document.getElementById("composerModal")?.classList.add("hidden");
  const postText = document.getElementById("postText");
  if (postText) postText.value = "";
  composerImages = [];
  composerVideo = null;
  composerMusic = null;
  composerTags = [];
  stopPreview();
  renderComposerPreview();
  renderMusicPreview();
  renderTagPreview();
}

function addPhoto() {
  document.getElementById("postPhotoInput")?.click();
}

function addAlbum() {
  document.getElementById("postPhotoInput")?.click();
}

function addVideo() {
  document.getElementById("postVideoInput")?.click();
}

/* =========================================================
   PHOTO INPUT
========================================================= */

const postPhotoInput = document.getElementById("postPhotoInput");
if (postPhotoInput) {
  postPhotoInput.addEventListener("change", async function () {
    const files = Array.from(this.files || []);
    this.value = "";
    if (!files.length) return;
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      showMessage("Please choose image files.");
      return;
    }
    const gen = composerGen;
    let started = 0;
    try {
      // Each photo opens in the editor first; uploads run in the background while you edit the next one.
      const uploads = [];
      for (const file of imageFiles) {
        let edited;
        try {
          edited = await openPhotoEditor(file);
        } catch (editorError) {
          console.warn("Photo editor unavailable, using the original.", editorError);
          edited = await compressImageFile(file, 1600, 0.82);
        }
        if (!edited) continue; // cancelled this photo
        showMessage("Adding photo…");
        composerPending++; started++;
        updateComposerBusy();
        renderComposerPreview();
        uploads.push(uploadMedia(edited, "image"));
      }
      if (!uploads.length) return;
      const urls = await Promise.all(uploads);
      if (gen === composerGen) {
        composerImages.push(...urls);
        composerVideo = null;
      }
    } catch (error) {
      console.error(error);
      showMessage((error && error.message) || "Couldn't add one of those photos.");
    } finally {
      if (gen === composerGen) {
        composerPending = Math.max(0, composerPending - started);
        updateComposerBusy();
        renderComposerPreview();
      }
    }
  });
}

/* =========================================================
   VIDEO INPUT
========================================================= */

const postVideoInput = document.getElementById("postVideoInput");
if (postVideoInput) {
  postVideoInput.addEventListener("change", async function () {
    const file = this.files && this.files[0];
    this.value = "";
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      showMessage("Please choose a video file.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      showMessage("That video is too large. Please choose one under 15MB.");
      return;
    }
    showMessage("Adding video…");
    const gen = composerGen;
    composerPending++;
    updateComposerBusy();
    renderComposerPreview();
    try {
      const dataUrl = await readFileAsDataURL(file);
      const url = await uploadMedia(dataUrl, "video");
      if (gen === composerGen) {
        composerVideo = url;
        composerImages = [];
      }
    } catch (error) {
      console.error(error);
      showMessage((error && error.message) || "Couldn't add that video.");
    } finally {
      if (gen === composerGen) {
        composerPending = Math.max(0, composerPending - 1);
        updateComposerBusy();
        renderComposerPreview();
      }
    }
  });
}

/* =========================================================
   COMPOSER PREVIEW
========================================================= */

function removeComposerImage(index) {
  composerImages.splice(index, 1);
  renderComposerPreview();
}

function removeComposerVideo() {
  composerVideo = null;
  renderComposerPreview();
}

function renderComposerPreview() {
  const preview = document.getElementById("imagePreview");
  if (!preview) return;
  const spinners = Array.from({ length: composerPending }, () =>
    `<div class="preview-item preview-loading"><div class="spinner"></div></div>`).join("");
  let items = "";
  if (composerVideo) {
    items = `
      <div class="preview-item">
        <video src="${escapeHTML(composerVideo)}" controls playsinline></video>
        <button type="button" class="remove-preview" onclick="removeComposerVideo()">×</button>
      </div>
    `;
  } else if (composerImages.length) {
    items = composerImages.map((src, index) => `
      <div class="preview-item">
        <img src="${escapeHTML(src)}" alt="Selected photo">
        <button type="button" class="remove-preview" onclick="removeComposerImage(${index})">×</button>
      </div>
    `).join("");
  }
  if (!items && !spinners) {
    preview.innerHTML = "";
    preview.classList.add("hidden");
    return;
  }
  preview.innerHTML = items + spinners;
  preview.classList.remove("hidden");
}

/* =========================================================
   POLL
========================================================= */

function createPoll() {
  const question = prompt("What is your poll question?");
  if (!question || !question.trim()) return;
  const postText = document.getElementById("postText");
  if (!postText) return;
  postText.value = `📊 ${question.trim()}\n\n• Yes\n• Maybe\n• No`;
}

/* =========================================================
   PUBLISH POST
========================================================= */

async function publishPost() {
  if (postingNow) return;
  if (composerPending > 0) {
    showMessage("Hang on — your photo/video is still uploading.");
    return;
  }
  const postText = document.getElementById("postText");
  const text = postText ? postText.value.trim() : "";
  if (!text && composerImages.length === 0 && !composerVideo) {
    showMessage("Write something, or add a photo or video first.");
    return;
  }
  const user = currentUser();
  if (!user) return;
  const newPost = {
    id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
    name: user.name,
    username: user.username,
    avatar: user.avatar || avatarLetter(user.name),
    avatarImage: user.avatarImage || null,
    text: text || "Shared a moment ✨",
    reactions: {},
    comments: 0,
    commentsList: [],
    shares: 0,
    time: "Just now",
    createdAt: Date.now()
  };
  if (composerVideo) {
    newPost.video = composerVideo;
  } else if (composerImages.length > 1) {
    newPost.images = composerImages.slice();
  } else if (composerImages.length === 1) {
    newPost.image = composerImages[0];
  }
  if (composerMusic) newPost.music = { ...composerMusic };
  if (composerTags.length) newPost.tags = composerTags.slice();
  data.posts.unshift(newPost);
  // Show the loading state until the server confirms the post is saved.
  postingNow = true;
  updateComposerBusy();
  lastSaveOk = true;
  saveData();
  try { await saveChain; } catch (e) { lastSaveOk = false; }
  postingNow = false;
  updateComposerBusy();
  if (!lastSaveOk) {
    // Not saved: take it back out of the feed but keep the composer open so nothing typed is lost.
    data.posts = data.posts.filter(p => p.id !== newPost.id);
    return;
  }
  if (postText) {
    postText.value = "";
  }
  composerImages = [];
  composerVideo = null;
  composerMusic = null;
  composerTags = [];
  renderComposerPreview();
  closeComposer();
  renderEverything();
  openPage("home");
  showMessage(pendingSync ? "Post saved on this device — it will go live when you're back online." : "Your post is live and saved! ✨");
}

/* =========================================================
   COMMUNITY MEMBERS PAGE
   (Formerly "Friends" — everyone is automatically connected,
   so this is now a simple member directory. There is no add,
   accept/decline, or remove flow anymore.)
========================================================= */

// A member counts as "new" for 1 day after the admin creates their account.
const NEW_MEMBER_DAYS = 1;
function isNewMember(member) {
  const joined = Number(member && member.joinedAt) || 0;
  return joined > 0 && (Date.now() - joined) < NEW_MEMBER_DAYS * 24 * 60 * 60 * 1000;
}

// Everyone follows everyone automatically, so following/followers are simply
// "every other member" — a brand-new account is instantly included both ways.
function followCounts(username) {
  const n = otherMembers(username).length;
  return { following: n, followers: n };
}

function memberCardHTML(member, showNewBadge) {
  return `
    <div class="friend-card" onclick="openUserProfile('${escapeHTML(member.username)}')">
      <div class="avatar">
        ${member.avatarImage ? `<img src="${escapeHTML(member.avatarImage)}" alt="${escapeHTML(member.name)}">` : escapeHTML(member.avatar || avatarLetter(member.name))}
      </div>
      <div class="friend-info">
        <strong>${escapeHTML(member.name)} ${showNewBadge && isNewMember(member) ? `<span class="new-badge">New</span>` : ""}</strong>
        <small>${escapeHTML(member.username)}</small>
        <small class="follow-line">Following &middot; Follows you</small>
      </div>
    </div>`;
}

function renderNewMembers() {
  const box = document.getElementById("newMembersSection");
  if (!box) return;
  const current = currentUser();
  const fresh = current ? otherMembers(current.username).filter(isNewMember)
    .sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0)) : [];
  if (!fresh.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `
    <h2 class="section-title">New in the community</h2>
    <div class="friends-list">${fresh.map(m => memberCardHTML(m, true)).join("")}</div>
    <h2 class="section-title">Everyone</h2>`;
}

function renderFriends(filter = "") {
  renderNewMembers();
  const container = document.getElementById("friendsList");
  if (!container) return;
  const current = currentUser();
  if (!current) {
    container.innerHTML = "";
    return;
  }
  const term = filter.trim().toLowerCase();
  let members = otherMembers(current.username);
  if (term) {
    members = members.filter(member =>
      String(member.name || "").toLowerCase().includes(term) ||
      String(member.username || "").toLowerCase().includes(term)
    );
  }
  members.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  if (!members.length) {
    container.innerHTML = term
      ? `<p class="no-results">No members match "${escapeHTML(filter)}".</p>`
      : `<p class="no-results">No other members yet.</p>`;
    return;
  }
  container.innerHTML = members.map(member => memberCardHTML(member, true)).join("");
}

function filterFriends() {
  const input = document.getElementById("friendSearchInput");
  renderFriends(input ? input.value : "");
}

function renderSidebarMembers() {
  const container = document.getElementById("sidebarMembersList");
  if (!container) return;
  const current = currentUser();
  if (!current) {
    container.innerHTML = "";
    return;
  }
  const members = otherMembers(current.username)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
    .slice(0, 6);
  if (!members.length) {
    container.innerHTML = `<p class="no-results">No other members yet.</p>`;
    return;
  }
  container.innerHTML = members.map(member => `
    <div class="sidebar-member" onclick="openUserProfile('${escapeHTML(member.username)}')">
      <div class="avatar">
        ${member.avatarImage ? `<img src="${escapeHTML(member.avatarImage)}" alt="${escapeHTML(member.name)}">` : escapeHTML(member.avatar || avatarLetter(member.name))}
      </div>
      <strong>${escapeHTML(member.name)}</strong>
    </div>
  `).join("");
}

// Kept as a no-op redirect so any old bookmark or shortcut that
// still calls openFriendsModal() doesn't break — there's no
// add-friend flow anymore since every account is already
// connected to every other account.
function openFriendsModal() {
  openPage("friends");
  showMessage("Everyone at Nea's Boarding Horse is already connected — no need to add anyone!");
}

/* =========================================================
   VIEW ANOTHER MEMBER'S PROFILE
   Every member can always see every other member's profile
   and posts — there's no locked/friends-only state anymore.
========================================================= */

function openUserProfile(username) {
  const current = currentUser();
  if (!current) return;

  if (usernamesMatch(username, current.username)) {
    closeModal("userProfileModal");
    openPage("profile");
    return;
  }

  const person = findUser(username);
  if (!person) {
    showMessage("Member not found.");
    return;
  }

  viewingUsername = person.username;
  renderUserProfileModal();
  document.getElementById("userProfileModal")?.classList.remove("hidden");
}

function renderUserProfileModal() {
  const content = document.getElementById("userProfileContent");
  if (!content) return;
  const person = findUser(viewingUsername);
  if (!person) return;

  const avatarHTML = person.avatarImage
    ? `<img src="${escapeHTML(person.avatarImage)}" alt="${escapeHTML(person.name)}">`
    : escapeHTML(person.avatar || avatarLetter(person.name));

  const coverStyle = person.bannerImage
    ? `style="background-image:url('${escapeHTML(person.bannerImage)}');background-size:100% 100%;background-position:center;background-repeat:no-repeat;"`
    : "";

  const ownPosts = data.posts.filter(post => post.username && usernamesMatch(post.username, person.username));
  const fc = followCounts(person.username);

  content.innerHTML = `
    <div class="profile-cover" ${coverStyle}></div>
    <div class="user-profile-header">
      <div class="avatar large">${avatarHTML}</div>
      <div>
        <h2>${escapeHTML(person.name)}</h2>
        <p>${escapeHTML(person.username)}</p>
        <span class="privacy">Community Member</span>
        ${isNewMember(person) ? `<span class="new-badge">New</span>` : ""}
        ${memberSinceText(person) ? `<span class="since-badge">${escapeHTML(memberSinceText(person))}</span>` : ""}
      </div>
    </div>
    <p class="user-profile-bio">${escapeHTML(person.bio || "")}</p>
    <div class="profile-stats mini">
      <div><strong>${ownPosts.length}</strong><span>Posts</span></div>
      <div><strong>${fc.following}</strong><span>Following</span></div>
      <div><strong>${fc.followers}</strong><span>Followers</span></div>
    </div>
    <div class="profile-grid">
      ${mediaTilesHTML(ownPosts, "closeModal('userProfileModal'); ")}
    </div>
  `;
}

/* =========================================================
   PUSH NOTIFICATIONS
   - Android app (Capacitor): Firebase Cloud Messaging token.
   - Browser / installed web app: Web Push subscription.
   Both are registered with the server, which sends the pushes
   when someone reacts, comments, reposts or posts something new.
========================================================= */

const PUSH_TOKEN_KEY = "nbh_push_token";
let nativePushListenersAdded = false;

function isNativeApp() {
  try {
    return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform());
  } catch (e) {
    return false;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function subscribeWebPush() {
  if (isNativeApp()) return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || typeof Notification === "undefined") return false;
  if (Notification.permission !== "granted") return false;
  const cfg = await api("/api/push/config");
  if (!cfg || !cfg.webPublicKey) return false; // server has no VAPID keys yet
  const reg = await navigator.serviceWorker.ready;
  const key = urlBase64ToUint8Array(cfg.webPublicKey);
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    } catch (err) {
      // An older subscription made with different keys blocks a new one — clear it and retry once.
      const old = await reg.pushManager.getSubscription();
      if (old) await old.unsubscribe();
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    }
  }
  await api("/api/push/subscribe", { method: "POST", body: { type: "web", subscription: sub.toJSON() } });
  return true;
}

async function setupNativePush() {
  const PN = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications;
  if (!PN) return false; // the APK was built without the push plugin
  if (!nativePushListenersAdded) {
    nativePushListenersAdded = true;
    PN.addListener("registration", async token => {
      try { localStorage.setItem(PUSH_TOKEN_KEY, token.value); } catch (e) { /* ignore */ }
      try {
        await api("/api/push/subscribe", { method: "POST", body: { type: "fcm", token: token.value } });
      } catch (err) {
        console.warn("Could not register this device for push.", err);
      }
    });
    PN.addListener("registrationError", err => console.warn("Push registration error.", err));
    PN.addListener("pushNotificationActionPerformed", action => {
      const id = Number(action && action.notification && action.notification.data && action.notification.data.postId);
      if (id && data.posts.some(p => p.id === id)) openPostView(id);
    });
  }
  let perm = await PN.checkPermissions();
  if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") perm = await PN.requestPermissions();
  if (perm.receive !== "granted") return false;
  await PN.register();
  return true;
}

function initPush() {
  const run = isNativeApp() ? setupNativePush() : subscribeWebPush();
  run.catch(err => console.warn("Push setup skipped.", err));
}

// Stop sending this phone/browser the previous member's alerts after logout.
async function disablePushForThisDevice() {
  try {
    if (isNativeApp()) {
      let token = null;
      try { token = localStorage.getItem(PUSH_TOKEN_KEY); } catch (e) { /* ignore */ }
      if (token) await api("/api/push/unsubscribe", { method: "POST", body: { token } });
    } else if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg && reg.pushManager ? await reg.pushManager.getSubscription() : null;
      if (sub) await api("/api/push/unsubscribe", { method: "POST", body: { endpoint: sub.endpoint } });
    }
  } catch (err) {
    console.warn("Could not unregister push on logout.", err);
  }
}

// Tapping a push opens that post (link form /?post=123, or a message from the service worker).
function openPostFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("post"));
    if (id && data.posts.some(p => p.id === id)) openPostView(id);
    if (params.has("post")) history.replaceState(null, "", window.location.pathname);
  } catch (e) { /* ignore */ }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    const msg = event.data || {};
    if (msg.type === "open-post" && session && msg.postId != null && data.posts.some(p => p.id === msg.postId)) {
      openPostView(msg.postId);
    }
  });
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function notifyUser(username, notification) {
  const social = ensureSocialFor(username);
  social.notifications.unshift(notification);
  maybeShowSystemNotification(username, notification);
}

function renderNotifications() {
  const list = document.getElementById("notificationsList");
  if (!list) return;
  const social = ensureSocial();

  const permissionBanner = renderNotificationPermissionBanner();

  if (!social.notifications.length) {
    list.innerHTML = `${permissionBanner}<p class="no-results">You're all caught up.</p>`;
    return;
  }
  list.innerHTML = permissionBanner + social.notifications.map((n, index) => `
    <div class="notification" onclick="handleNotificationClick(${index})" role="button" tabindex="0">
      <div class="avatar">
        ${escapeHTML(n.avatar || avatarLetter(n.name))}
      </div>
      <div class="notification-info">
        <strong>${escapeHTML(n.name)}</strong>
        ${escapeHTML(n.text)}
        <br>
        <small title="${escapeHTML(fullStamp(n.createdAt))}">${escapeHTML(formatStamp(n.createdAt, n.time))}</small>
      </div>
      ${n.unread ? `<i class="notification-dot"></i>` : ""}
    </div>
  `).join("");
}

function renderNotificationPermissionBanner() {
  if (isNativeApp()) return "";
  if (typeof Notification === "undefined") {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    return `
    <div class="notification-permission-banner">
      <span>${isIOS
        ? "Notifications aren't available in this view. On iPhone: tap Share, then Add to Home Screen, then open the app from the new Home Screen icon (not Safari)."
        : "This browser doesn't support notifications. Try Chrome, or install this site as an app."}</span>
    </div>`;
  }
  if (Notification.permission === "denied") {
    return `
    <div class="notification-permission-banner">
      <span>Notifications are blocked for this app. Open your phone's Settings, then Notifications, find this app, and turn on Allow Notifications.</span>
    </div>`;
  }
  if (Notification.permission === "granted") return "";
  return `
    <div class="notification-permission-banner">
      <span>Turn on alerts to get notifications the moment something happens, even in another tab.</span>
      <button onclick="requestNotificationPermission()">Turn On</button>
    </div>
  `;
}

function requestNotificationPermission() {
  if (typeof Notification === "undefined") {
    showMessage("Your browser doesn't support notifications.");
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      showMessage("Notifications turned on!");
      subscribeWebPush().catch(err => console.warn("Push subscribe failed.", err));
    } else {
      showMessage("Notifications are off. You can turn them on later from your browser settings.");
    }
    renderNotifications();
  });
}

function maybeShowSystemNotification(username, notification) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (!session || !usernamesMatch(username, session.username)) return;
  try {
    new Notification(`${notification.name} — Nea's Boarding Horse`, {
      body: notification.text,
      tag: "nbh-notification"
    });
  } catch (error) {
    console.error("Could not show system notification.", error);
  }
}

function handleNotificationClick(index) {
  const social = ensureSocial();
  const notification = social.notifications[index];
  if (!notification) return;

  notification.unread = false;
  saveData();
  updateNotificationDot();

  if (notification.postId != null && data.posts.some(p => p.id === notification.postId)) {
    openPostView(notification.postId);
  } else {
    renderNotifications();
  }
}

function clearNotifications() {
  const social = ensureSocial();
  social.notifications.forEach(n => { n.unread = false; });
  saveData();
  renderNotifications();
  updateNotificationDot();
  showMessage("Notifications cleared.");
}

function updateNotificationDot() {
  const social = ensureSocial();
  const unread = social.notifications.some(n => n.unread);
  ["notificationDot", "notificationDotRail"].forEach(id => {
    const dot = document.getElementById(id);
    if (dot) dot.style.display = unread ? "block" : "none";
  });
}

/* =========================================================
   PROFILE
========================================================= */

function switchProfileTab(tab) {
  activeProfileTab = tab;
  document.getElementById("postsTabButton")?.classList.toggle("active", tab === "posts");
  document.getElementById("repostsTabButton")?.classList.toggle("active", tab === "reposts");
  document.getElementById("profileGrid")?.classList.toggle("hidden", tab !== "posts");
  document.getElementById("repostsGrid")?.classList.toggle("hidden", tab !== "reposts");
  document.getElementById("albumsHeader")?.classList.toggle("hidden", tab !== "posts");
  document.getElementById("albumsGrid")?.classList.toggle("hidden", tab !== "posts");
}

// Photo AND video tiles for a profile's Posts grid (newest first, no 9-item cap).
function mediaTilesHTML(posts, beforeOpen) {
  const media = posts.filter(p => p.video || p.image || (p.images && p.images.length));
  if (!media.length) return `<p class="no-results">No photos or videos yet.</p>`;
  return media.map(p => {
    const thumb = p.image || (p.images && p.images[0]);
    const inner = thumb
      ? `<img src="${escapeHTML(thumb)}" alt="Post">${p.video ? `<span class="video-badge">&#9654;</span>` : ""}`
      : `<video src="${escapeHTML(p.video)}#t=0.1" preload="metadata" muted playsinline></video><span class="video-badge">&#9654;</span>`;
    return `<div onclick="${beforeOpen}openPostView(${p.id})">${inner}</div>`;
  }).join("");
}

function memberSinceText(member) {
  const joined = Number(member && member.joinedAt) || 0;
  if (!joined) return "";
  return "Member since " + new Date(joined).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function renderProfile() {
  const user = currentUser();
  if (!user) return;
  const sinceEl = document.getElementById("profileSince");
  if (sinceEl) sinceEl.textContent = memberSinceText(user);
  const social = ensureSocial();
  const ownPosts = data.posts.filter(post => post.username && usernamesMatch(post.username, user.username));
  const savedPosts = data.posts.filter(post => social.savedPostIds.includes(post.id));
  const postCount = document.getElementById("postCount");
  if (postCount) postCount.textContent = ownPosts.length;
  const fc = followCounts(user.username);
  const followingCount = document.getElementById("followingCount");
  if (followingCount) followingCount.textContent = fc.following;
  const followersCount = document.getElementById("followersCount");
  if (followersCount) followersCount.textContent = fc.followers;
  const updateCount = document.getElementById("updateCount");
  if (updateCount) updateCount.textContent = savedPosts.length;
  const reactionsCount = Object.keys(social.myReactions || {}).length;
  const reactionCount = document.getElementById("reactionCount");
  if (reactionCount) reactionCount.textContent = reactionsCount;
  const grid = document.getElementById("profileGrid");
  if (grid) grid.innerHTML = mediaTilesHTML(ownPosts, "");
  renderReposts(social);
  renderAlbums();
  renderSidebarMembers();
}

function renderReposts(social) {
  const grid = document.getElementById("repostsGrid");
  if (!grid) return;
  const reposts = (social.reposts || [])
    .map(r => ({ repost: r, post: data.posts.find(p => p.id === r.postId) }))
    .filter(entry => entry.post);

  if (!reposts.length) {
    grid.innerHTML = `<p class="no-results">You haven't reposted anything yet. Tap the repost icon on a post to repost it here.</p>`;
    return;
  }

  grid.innerHTML = reposts.map(({ post }) => {
    const thumb = post.image || (post.images && post.images[0]);
    return `
      <div onclick="closeModal('userProfileModal'); openPostView(${post.id})">
        <span class="repost-badge">Reposted</span>
        ${thumb
          ? `<img src="${escapeHTML(thumb)}" alt="Reposted post">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--pink-light);padding:8px;text-align:center;font-size:12px;color:var(--muted);">${escapeHTML((post.text || "").slice(0, 60))}</div>`
        }
      </div>
    `;
  }).join("");
}

function openEditProfile() {
  const user = currentUser();
  if (!user) return;
  const nameInput = document.getElementById("editName");
  if (nameInput) nameInput.value = user.name;
  const bioInput = document.getElementById("editBio");
  if (bioInput) bioInput.value = user.bio;
  loadMyBirthdayIntoForm();
  document.getElementById("editModal")?.classList.remove("hidden");
}

/* =========================================================
   PRIVATE BIRTHDAY
   A member's own birthday (set in Edit Profile). Only that member
   and the admin can ever see it — the server enforces this.
========================================================= */

let loadedBirthday = null; // what the server had when the form was opened

function birthdayFormEls() {
  return {
    month: document.getElementById("editBirthMonth"),
    day: document.getElementById("editBirthDay"),
    year: document.getElementById("editBirthYear")
  };
}

async function loadMyBirthdayIntoForm() {
  const els = birthdayFormEls();
  loadedBirthday = null;
  if (els.month) els.month.value = "";
  if (els.day) els.day.value = "";
  if (els.year) els.year.value = "";
  try {
    const b = await api("/api/me/birthday");
    if (!b) return;
    loadedBirthday = b;
    if (els.month) els.month.value = String(b.month);
    if (els.day) els.day.value = String(b.day);
    if (els.year) els.year.value = b.year ? String(b.year) : "";
  } catch (error) {
    /* leave the form empty — nothing will be saved unless the member fills it in */
  }
}

// Returns { skip: true }, { error: "..." } or { value: {month, day, year} }
function readBirthdayForm() {
  const els = birthdayFormEls();
  const month = els.month?.value || "";
  const day = els.day?.value || "";
  const year = els.year?.value || "";
  if (!month && !day && !year) return { skip: true };
  if (!month || !day) return { error: "Please choose both a month and a day for your birthday." };
  const value = { month: Number(month), day: Number(day), year: year ? Number(year) : null };
  if (loadedBirthday && loadedBirthday.month === value.month && loadedBirthday.day === value.day &&
      (loadedBirthday.year || null) === value.year) return { skip: true };
  return { value };
}

async function clearMyBirthday() {
  try {
    await api("/api/me/birthday", { method: "DELETE" });
    loadedBirthday = null;
    const els = birthdayFormEls();
    if (els.month) els.month.value = "";
    if (els.day) els.day.value = "";
    if (els.year) els.year.value = "";
    showMessage("Birthday removed.");
  } catch (error) {
    showMessage(error.message || "Could not remove your birthday.");
  }
}

const BIRTHDAY_MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function birthdayNextDate(month, day, year) {
  let d = day;
  // Feb 29 birthdays are celebrated on Feb 28 in non-leap years.
  if (month === 2 && day === 29 && new Date(year, 2, 0).getDate() === 28) d = 28;
  return new Date(year, month - 1, d);
}

function birthdayDaysUntil(month, day) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = birthdayNextDate(month, day, today.getFullYear());
  if (next < today) next = birthdayNextDate(month, day, today.getFullYear() + 1);
  return Math.round((next - today) / 86400000);
}

async function loadAdminBirthdays() {
  const container = document.getElementById("adminBirthdaysList");
  if (!container || !session?.isAdmin) return;
  try {
    const list = await api("/api/admin/birthdays");
    if (!list.length) {
      container.innerHTML = `<p class="no-results">No birthdays added yet.</p>`;
      return;
    }
    const rows = list
      .map(b => ({ ...b, daysUntil: birthdayDaysUntil(b.month, b.day) }))
      .sort((a, b) => a.daysUntil - b.daysUntil);
    container.innerHTML = rows.map(b => {
      const when = b.daysUntil === 0 ? "Today 🎂" : b.daysUntil === 1 ? "Tomorrow" : `in ${b.daysUntil} days`;
      const nextYear = new Date(Date.now() + b.daysUntil * 86400000).getFullYear();
      const turning = b.year ? ` · turns ${nextYear - b.year}` : "";
      return `
        <div class="admin-user-row">
          <div class="avatar">${b.avatarImage ? `<img src="${escapeHTML(b.avatarImage)}" alt="${escapeHTML(b.name)}">` : escapeHTML(b.avatar || "U")}</div>
          <div class="admin-user-info">
            <strong>${escapeHTML(b.name)}</strong>
            <span>@${escapeHTML(b.username)} · ${BIRTHDAY_MONTHS[b.month - 1]} ${b.day}${turning}</span>
          </div>
          <div class="admin-user-actions"><span class="admin-badge${b.daysUntil === 0 ? "" : " member"}">${when}</span></div>
        </div>`;
    }).join("");
  } catch (error) {
    container.innerHTML = `<p class="no-results">Could not load birthdays.</p>`;
  }
}

function saveProfile() {
  const user = currentUser();
  if (!user) return;
  const birthday = readBirthdayForm();
  if (birthday.error) { showMessage(birthday.error); return; }
  const name = document.getElementById("editName")?.value.trim();
  const bio = document.getElementById("editBio")?.value.trim();
  if (name) {
    user.name = name;
    user.avatar = avatarLetter(name);
  }
  if (bio !== undefined) {
    user.bio = bio;
  }
  saveData();
  renderEverything();
  closeModal("editModal");
  if (birthday.value) {
    api("/api/me/birthday", { method: "PUT", body: birthday.value })
      .then(() => { loadedBirthday = birthday.value; })
      .catch(error => showMessage(error.message || "Could not save your birthday."));
  }
  showMessage("Profile updated!");
}

/* =========================================================
   CHANGE PASSWORD
   Lets a logged-in member change their own password from the
   profile. Requires the current password to match (unless
   the account has none set, e.g. the admin account), then
   the new password twice for confirmation.
========================================================= */

function openChangePassword() {
  const user = currentUser();
  if (!user) return;
  ["currentPassword", "newPassword", "confirmNewPassword"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
  setChangePasswordError("");
  document.getElementById("changePasswordModal")?.classList.remove("hidden");
  document.getElementById("currentPassword")?.focus();
}

function closeChangePassword() {
  closeModal("changePasswordModal");
}

function setChangePasswordError(message) {
  const el = document.getElementById("changePasswordError");
  if (!el) return;
  if (!message) {
    el.classList.add("hidden");
    el.textContent = "";
  } else {
    el.classList.remove("hidden");
    el.textContent = message;
  }
}

const changePasswordForm = document.getElementById("changePasswordForm");
if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    setChangePasswordError("");

    const user = currentUser();
    if (!user) return;

    const currentPassword = document.getElementById("currentPassword")?.value || "";
    const newPassword = document.getElementById("newPassword")?.value || "";
    const confirmNewPassword = document.getElementById("confirmNewPassword")?.value || "";

    if (!newPassword || newPassword.length < 6) {
      setChangePasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword === currentPassword) {
      setChangePasswordError("New password must be different from your current password.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("New passwords don't match.");
      return;
    }

    const submitButton = changePasswordForm.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    try {
      await api("/api/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
      closeChangePassword();
      showMessage("Password updated!");
    } catch (error) {
      setChangePasswordError(error.message || "Could not update password.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

/* =========================================================
   ALBUMS
========================================================= */

function getAlbums() {
  return ensureSocial().albums;
}

function renderAlbums() {
  const container = document.getElementById("albumsGrid");
  if (!container) return;
  const albums = getAlbums();
  if (!albums.length) {
    container.innerHTML = `<p class="no-results">No albums yet. Create one to start collecting photos.</p>`;
    return;
  }
  container.innerHTML = albums.map(album => `
    <button type="button" class="album-card" onclick="openAlbum('${escapeHTML(album.id)}')">
      <div class="album-cover">
        ${album.images[0]
          ? `<img src="${escapeHTML(album.images[0])}" alt="${escapeHTML(album.name)}">`
          : `<div class="album-empty">🗂</div>`
        }
      </div>
      <strong>${escapeHTML(album.name)}</strong>
      <small>${album.images.length} photo${album.images.length === 1 ? "" : "s"}</small>
    </button>
  `).join("");
}

function createAlbum() {
  const name = prompt("Name your new album:");
  if (!name || !name.trim()) return;
  getAlbums().push({
    id: "album_" + Date.now(),
    name: name.trim(),
    images: []
  });
  saveData();
  renderAlbums();
  showMessage("Album created! Open it to start adding photos.");
}

function openAlbum(id) {
  activeAlbumId = id;
  const album = getAlbums().find(a => a.id === id);
  if (!album) return;
  const title = document.getElementById("albumModalTitle");
  if (title) title.textContent = album.name;
  renderAlbumModalGrid();
  document.getElementById("albumModal")?.classList.remove("hidden");
}

function renderAlbumModalGrid() {
  const album = getAlbums().find(a => a.id === activeAlbumId);
  const grid = document.getElementById("albumModalGrid");
  if (!album || !grid) return;
  if (!album.images.length) {
    grid.innerHTML = `<p class="no-results">No photos yet. Tap "+ Add" to add your first one.</p>`;
    return;
  }
  grid.innerHTML = album.images.map((src, index) => `
    <div class="album-photo">
      <img src="${escapeHTML(src)}" alt="${escapeHTML(album.name)} photo">
      <button onclick="removePhotoFromAlbum(${index})" aria-label="Remove photo">×</button>
    </div>
  `).join("");
}

function addPhotoToAlbum() {
  document.getElementById("albumPhotoInput")?.click();
}

const albumPhotoInput = document.getElementById("albumPhotoInput");
if (albumPhotoInput) {
  albumPhotoInput.addEventListener("change", async function () {
    const files = Array.from(this.files || []);
    this.value = "";
    if (!files.length) return;
    const album = getAlbums().find(a => a.id === activeAlbumId);
    if (!album) return;
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      showMessage("Please choose image files.");
      return;
    }
    showMessage(imageFiles.length > 1 ? "Adding photos…" : "Adding photo…");
    try {
      const compressed = await Promise.all(
        imageFiles.map(file => compressImageFile(file, 1400, 0.82))
      );
      const urls = await Promise.all(compressed.map(dataUrl => uploadMedia(dataUrl, "image")));
      album.images.push(...urls);
      if (saveData()) {
        renderAlbumModalGrid();
        renderAlbums();
        showMessage("Photo added to album!");
      }
    } catch (error) {
      console.error(error);
      showMessage((error && error.message) || "Couldn't add one of those photos.");
    }
  });
}

function removePhotoFromAlbum(index) {
  const album = getAlbums().find(a => a.id === activeAlbumId);
  if (!album) return;
  if (!confirm("Remove this photo from the album?")) return;
  album.images.splice(index, 1);
  saveData();
  renderAlbumModalGrid();
  renderAlbums();
}

/* =========================================================
   MODALS
========================================================= */

function closeModal(id) {
  document.getElementById(id)?.classList.add("hidden");
  if (id === "commentsModal" && typeof stopPreview === "function") stopPreview(false);
}

/* ---------------------------------------------------------
   In-app prompt/confirm — replaces window.prompt()/confirm().
   Native browser dialogs can't be styled (they render outside
   the page, as plain browser chrome), so admin actions like
   renaming an account or confirming a delete use this themed
   modal instead. Same call shape as the native versions:
   appPrompt() resolves to the entered string, or null if
   cancelled; appConfirm() resolves to true/false.
--------------------------------------------------------- */

let promptModalResolve = null;

function openPromptModal({ title, message, okLabel = "OK", cancelLabel = "Cancel", showInput = false, inputType = "text", defaultValue = "", danger = false }) {
  return new Promise(resolve => {
    // If one of these is already open, cancel it rather than leaving its
    // promise dangling forever.
    if (promptModalResolve) resolvePromptModal(showInput ? null : false);

    promptModalResolve = resolve;
    document.getElementById("promptModalTitle").textContent = title;
    document.getElementById("promptModalMessage").textContent = message;

    const inputWrap = document.getElementById("promptModalInputWrap");
    const input = document.getElementById("promptModalInput");
    inputWrap.classList.toggle("hidden", !showInput);
    if (showInput) {
      input.type = inputType;
      input.value = defaultValue;
    }

    const okButton = document.getElementById("promptModalOk");
    okButton.textContent = okLabel;
    okButton.classList.toggle("danger-button", danger);
    okButton.classList.toggle("primary-btn", !danger);
    document.getElementById("promptModalCancel").textContent = cancelLabel;

    document.getElementById("promptModal").classList.remove("hidden");
    if (showInput) {
      // Let the modal finish becoming visible before focusing.
      setTimeout(() => { input.focus(); input.select(); }, 0);
    }
  });
}

function resolvePromptModal(value) {
  document.getElementById("promptModal")?.classList.add("hidden");
  const resolve = promptModalResolve;
  promptModalResolve = null;
  if (resolve) resolve(value);
}

function appPrompt(message, { title = "Nea's Boarding Horse", okLabel = "OK", cancelLabel = "Cancel", defaultValue = "", inputType = "text" } = {}) {
  return openPromptModal({ title, message, okLabel, cancelLabel, showInput: true, inputType, defaultValue });
}

function appConfirm(message, { title = "Please confirm", okLabel = "Confirm", cancelLabel = "Cancel", danger = false } = {}) {
  return openPromptModal({ title, message, okLabel, cancelLabel, showInput: false, danger });
}

document.getElementById("promptModalOk")?.addEventListener("click", () => {
  const isPrompt = !document.getElementById("promptModalInputWrap")?.classList.contains("hidden");
  resolvePromptModal(isPrompt ? document.getElementById("promptModalInput").value : true);
});

document.getElementById("promptModalCancel")?.addEventListener("click", () => {
  const isPrompt = !document.getElementById("promptModalInputWrap")?.classList.contains("hidden");
  resolvePromptModal(isPrompt ? null : false);
});

document.getElementById("promptModalInput")?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("promptModalOk")?.click();
  }
});

// The app already hides any open .modal on a backdrop click or Escape
// (see the window "click"/"keydown" listeners below) — but that only
// toggles the CSS class, so a pending appPrompt()/appConfirm() promise
// needs to be resolved the same way those paths close the modal.
document.getElementById("promptModal")?.addEventListener("click", event => {
  if (event.target.id === "promptModal") {
    const isPrompt = !document.getElementById("promptModalInputWrap")?.classList.contains("hidden");
    resolvePromptModal(isPrompt ? null : false);
  }
});

window.addEventListener("keydown", event => {
  if (event.key === "Escape" && promptModalResolve && !document.getElementById("promptModal")?.classList.contains("hidden")) {
    const isPrompt = !document.getElementById("promptModalInputWrap")?.classList.contains("hidden");
    resolvePromptModal(isPrompt ? null : false);
  }
});

window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.add("hidden");
  }
});

window.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal:not(.hidden)").forEach(modal => modal.classList.add("hidden"));
});

/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function togglePassword(id) {
  const input = document.getElementById(id);
  if (!input) return;
  const button = document.getElementById(id + "Toggle");
  const showing = input.type === "password";
  input.type = showing ? "text" : "password";
  if (button) {
    button.innerHTML = `<span class="icon">${iconSVG(showing ? "eyeOff" : "eye")}</span>`;
    button.setAttribute("aria-label", showing ? "Hide password" : "Show password");
  }
}

/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {
  renderUser();
  renderFeed();
  renderFriends();
  renderNotifications();
  renderProfile();
  switchProfileTab(activeProfileTab);
  updateNotificationDot();
}

/* =========================================================
   STARTUP
   Checks whether the browser already has a valid session
   cookie (e.g. the member reloaded the page or came back
   later) before deciding whether to show the login screen
   or drop them straight into the app.
========================================================= */

async function startup() {
  initTheme();
  applyStaticIcons();

  try {
    session = await api("/api/auth/me");
    if (session.logoutOnExit && !tabWasAlive()) {
      // The site was exited since the last visit (tab/app closed): require a fresh login.
      try { await api("/api/auth/logout", { method: "POST" }); } catch (e) { /* ignore */ }
      session = null;
      showWelcome();
      showMessage("Please log in again.");
      return;
    }
    markTabAlive();
    await loadStateAndEnter();
  } catch (error) {
    if (error && error.offline && enterOfflineFromCache()) return;
    session = null;
    showWelcome();
  }
}

startup();

/* =========================================================
   PHOTO EDITOR  (crop / rotate / filters / adjust)
   Opens after choosing a photo in the composer. Everything runs
   in the phone's browser; only the finished JPEG is uploaded.
========================================================= */

const PHOTO_PRESETS = {
  Normal: {},
  Vivid: { sat: 35, con: 15 },
  Warm: { warm: 28, sat: 10 },
  Cool: { warm: -28, bri: 3 },
  "B&W": { gray: 1, con: 12 },
  Sepia: { sepia: 1 },
  Fade: { fade: 0.18, con: -10, sat: -15 },
  Drama: { con: 35, sat: -10, bri: -8 }
};
const PHOTO_ASPECTS = { Original: 0, "1:1": 1, "4:5": 0.8, "16:9": 16 / 9 };

function escAttr(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function photoCropGeom(st, src) {
  const rotated = st.rot % 2 === 1;
  const rw = rotated ? src.height : src.width;
  const rh = rotated ? src.width : src.height;
  const ratio = st.aspect || rw / rh;
  let cw, ch;
  if (rw / rh > ratio) { ch = rh; cw = rh * ratio; } else { cw = rw; ch = rw / ratio; }
  cw /= st.zoom;
  ch /= st.zoom;
  return { rw, rh, cw, ch, maxX: (rw - cw) / 2, maxY: (rh - ch) / 2 };
}

function applyPhotoLook(ctx, w, h, st) {
  const p = PHOTO_PRESETS[st.preset] || {};
  const bri = (st.bri + (p.bri || 0)) * 2.55;
  const conV = Math.max(-200, Math.min(200, (st.con + (p.con || 0)) * 2.55));
  const cf = (259 * (conV + 255)) / (255 * (259 - conV));
  const sat = 1 + (st.sat + (p.sat || 0)) / 100;
  const warm = p.warm || 0, gray = p.gray || 0, sepia = p.sepia || 0, fade = p.fade || 0;
  if (!bri && !conV && sat === 1 && !warm && !gray && !sepia && !fade) return;
  const image = ctx.getImageData(0, 0, w, h);
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] + bri, g = d[i + 1] + bri, b = d[i + 2] + bri;
    r = cf * (r - 128) + 128; g = cf * (g - 128) + 128; b = cf * (b - 128) + 128;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    r = l + (r - l) * sat; g = l + (g - l) * sat; b = l + (b - l) * sat;
    if (gray) { r += (l - r) * gray; g += (l - g) * gray; b += (l - b) * gray; }
    if (sepia) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;
      r += (sr - r) * sepia; g += (sg - g) * sepia; b += (sb - b) * sepia;
    }
    r += warm; b -= warm;
    if (fade) { r = r * (1 - fade) + 150 * fade; g = g * (1 - fade) + 150 * fade; b = b * (1 - fade) + 150 * fade; }
    d[i] = r; d[i + 1] = g; d[i + 2] = b; // Uint8ClampedArray clamps for us
  }
  ctx.putImageData(image, 0, 0);
}

function renderEditedPhoto(st, src, maxSide) {
  const g = photoCropGeom(st, src);
  const cx = st.px * g.maxX, cy = st.py * g.maxY; // crop centre offset from image centre
  const k = Math.min(1, maxSide / Math.max(g.cw, g.ch));
  const ow = Math.max(1, Math.round(g.cw * k));
  const oh = Math.max(1, Math.round(g.ch * k));
  const out = document.createElement("canvas");
  out.width = ow;
  out.height = oh;
  const ctx = out.getContext("2d");
  ctx.save();
  ctx.translate(ow / 2, oh / 2);
  ctx.scale(k, k);
  ctx.translate(-cx, -cy);
  ctx.rotate(st.rot * Math.PI / 2);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  ctx.restore();
  applyPhotoLook(ctx, ow, oh, st);
  return out;
}

// Resolves with an edited JPEG data URL, or null if the member cancelled this photo.
async function openPhotoEditor(file) {
  const rawUrl = await readFileAsDataURL(file);
  const img = await new Promise((ok, bad) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => bad(new Error("Could not read that image."));
    i.src = rawUrl;
  });
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const src = document.createElement("canvas");
  src.width = Math.max(1, Math.round(img.width * scale));
  src.height = Math.max(1, Math.round(img.height * scale));
  src.getContext("2d").drawImage(img, 0, 0, src.width, src.height);

  const st = { rot: 0, aspect: 0, zoom: 1, px: 0, py: 0, preset: "Normal", bri: 0, con: 0, sat: 0 };

  return new Promise(resolve => {
    const ov = document.createElement("div");
    ov.className = "pe-overlay";
    ov.innerHTML = `
      <div class="pe-top">
        <button type="button" data-a="cancel">Cancel</button>
        <strong>Edit photo</strong>
        <button type="button" class="pe-done" data-a="done">Done</button>
      </div>
      <div class="pe-stage"><canvas class="pe-canvas"></canvas></div>
      <div class="pe-tabs">
        <button type="button" data-tab="filters" class="active">Filters</button>
        <button type="button" data-tab="adjust">Adjust</button>
        <button type="button" data-tab="crop">Crop</button>
      </div>
      <div class="pe-panel" data-panel="filters">
        ${Object.keys(PHOTO_PRESETS).map(n => `<button type="button" class="pe-chip ${n === "Normal" ? "active" : ""}" data-preset="${escAttr(n)}">${escapeHTML(n)}</button>`).join("")}
      </div>
      <div class="pe-panel pe-hide" data-panel="adjust">
        <label>Brightness <input type="range" min="-60" max="60" value="0" data-adj="bri"></label>
        <label>Contrast <input type="range" min="-60" max="60" value="0" data-adj="con"></label>
        <label>Color <input type="range" min="-100" max="100" value="0" data-adj="sat"></label>
      </div>
      <div class="pe-panel pe-hide" data-panel="crop">
        ${Object.keys(PHOTO_ASPECTS).map(n => `<button type="button" class="pe-chip ${n === "Original" ? "active" : ""}" data-aspect="${escAttr(n)}">${escapeHTML(n)}</button>`).join("")}
        <button type="button" class="pe-chip" data-a="rotate">⟳ Rotate</button>
        <label class="pe-zoom">Zoom <input type="range" min="1" max="3" step="0.05" value="1" data-adj="zoom"></label>
        <small class="pe-hint">Drag the photo to move it.</small>
      </div>`;
    document.body.appendChild(ov);

    const canvas = ov.querySelector(".pe-canvas");
    let queued = false;
    const draw = () => {
      queued = false;
      const out = renderEditedPhoto(st, src, 720);
      canvas.width = out.width;
      canvas.height = out.height;
      canvas.getContext("2d").drawImage(out, 0, 0);
    };
    const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    const close = value => { ov.remove(); resolve(value); };
    schedule();

    ov.addEventListener("click", event => {
      const t = event.target.closest("button");
      if (!t) return;
      if (t.dataset.a === "cancel") return close(null);
      if (t.dataset.a === "done") {
        try {
          close(renderEditedPhoto(st, src, 1600).toDataURL("image/jpeg", 0.85));
        } catch (err) {
          console.error(err);
          showMessage("Couldn't save that edit.");
        }
        return;
      }
      if (t.dataset.a === "rotate") { st.rot = (st.rot + 1) % 4; st.px = 0; st.py = 0; return schedule(); }
      if (t.dataset.tab) {
        ov.querySelectorAll(".pe-tabs button").forEach(b => b.classList.toggle("active", b === t));
        ov.querySelectorAll(".pe-panel").forEach(p => p.classList.toggle("pe-hide", p.dataset.panel !== t.dataset.tab));
        return;
      }
      if (t.dataset.preset) {
        st.preset = t.dataset.preset;
        ov.querySelectorAll("[data-preset]").forEach(b => b.classList.toggle("active", b === t));
        return schedule();
      }
      if (t.dataset.aspect) {
        st.aspect = PHOTO_ASPECTS[t.dataset.aspect] || 0;
        st.px = 0; st.py = 0;
        ov.querySelectorAll("[data-aspect]").forEach(b => b.classList.toggle("active", b === t));
        schedule();
      }
    });

    ov.addEventListener("input", event => {
      const key = event.target && event.target.dataset ? event.target.dataset.adj : null;
      if (!key) return;
      st[key] = Number(event.target.value);
      if (key === "zoom") { st.px = Math.max(-1, Math.min(1, st.px)); st.py = Math.max(-1, Math.min(1, st.py)); }
      schedule();
    });

    let drag = null;
    canvas.addEventListener("pointerdown", e => {
      drag = { x: e.clientX, y: e.clientY, px: st.px, py: st.py };
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    canvas.addEventListener("pointermove", e => {
      if (!drag) return;
      const g = photoCropGeom(st, src);
      const unit = g.cw / Math.max(1, canvas.clientWidth); // source pixels per screen pixel
      if (g.maxX > 0) st.px = Math.max(-1, Math.min(1, drag.px - ((e.clientX - drag.x) * unit) / g.maxX));
      if (g.maxY > 0) st.py = Math.max(-1, Math.min(1, drag.py - ((e.clientY - drag.y) * unit) / g.maxY));
      schedule();
    });
    const endDrag = () => { drag = null; };
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
  });
}

/* =========================================================
   MUSIC  (30-second previews found through the server's /api/music/search)
========================================================= */

let previewAudio = null;
let previewSource = null;            // "feed" (a post's music) or "other" (picker / composer)
const autoplayBlocked = new Set();   // songs the member stopped, or that finished, while still in view
// No time cap: a post's music loops until the member pauses it or scrolls away.
// (Apple's previews are ~30-second clips, so "unlimited" means the clip repeats.)

function syncMusicButtons() {
  document.querySelectorAll(".post-music").forEach(box => {
    const btn = box.querySelector(".pm-play");
    if (btn) btn.textContent = (previewKey && box.dataset.preview === previewKey) ? "❚❚" : "▶";
  });
  document.querySelectorAll(".mp-row .pm-play").forEach(b => { if (!previewKey) b.textContent = "▶"; });
}

function stopPreview(block) {
  if (block && previewKey) autoplayBlocked.add(previewKey);
  if (previewAudio) previewAudio.pause();
  previewKey = null;
  previewSource = null;
  document.querySelectorAll(".pm-play").forEach(b => { b.textContent = "▶"; });
}

function startPreview(btn, url, start, auto) {
  if (!url) return;
  stopPreview(false);
  if (!previewAudio) previewAudio = new Audio();
  const from = Number(start) || 0;
  previewAudio.src = url;
  previewAudio.onended = () => {
    // Loop forever: jump back to the start point and keep playing.
    try { previewAudio.currentTime = from; } catch (e) {}
    previewAudio.play().catch(() => stopPreview(false));
  };
  previewAudio.onloadedmetadata = () => { if (from) previewAudio.currentTime = from; };
  previewAudio.ontimeupdate = null;
  previewKey = url;
  previewSource = (btn && btn.closest(".post-card")) ? "feed" : "other";
  if (btn) btn.textContent = "❚❚";
  previewAudio.play().catch(() => {
    stopPreview(false);
    if (!auto) showMessage("Couldn't play that clip.");
  });
}

function togglePreview(btn, url, start) {
  if (!url) return;
  if (previewKey === url) { stopPreview(true); return; }
  startPreview(btn, url, start, false);
}

/* Autoplay: a post's music starts by itself when that post's PHOTO is scrolled into view
   and stops when the photo scrolls away. Browsers (iPhone Safari especially) only allow
   sound after the member has touched the page once, so the first tap unlocks it. */
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
let audioUnlocked = false;
const musicVisible = new Map(); // post card -> how much of it is on screen

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (!previewAudio) previewAudio = new Audio();
  if (!previewKey) {
    previewAudio.src = SILENT_WAV;
    const p = previewAudio.play();
    if (p && p.then) p.then(() => { if (!previewKey) previewAudio.pause(); }).catch(() => {});
  }
  setTimeout(pickVisibleMusic, 60);
}
["pointerdown", "touchend", "click", "keydown"].forEach(evt =>
  window.addEventListener(evt, unlockAudio, { once: true, passive: true, capture: true }));

function musicUrlOf(card) {
  const box = card && card.querySelector(".post-music");
  return box ? box.dataset.preview : null;
}

function pickVisibleMusic() {
  if (document.visibilityState !== "visible") return;
  let best = null, bestScore = 0;
  for (const [card, score] of musicVisible) {
    if (!card.isConnected) { musicVisible.delete(card); continue; }
    if (score > bestScore) { best = card; bestScore = score; }
  }
  if (!best) {
    if (previewSource === "feed") stopPreview(false);
    return;
  }
  const url = musicUrlOf(best);
  if (!url) return;
  if (previewKey === url && previewAudio && !previewAudio.paused) { syncMusicButtons(); return; }
  if (autoplayBlocked.has(url)) return;
  if (previewKey && previewSource === "other") return; // don't interrupt the song picker
  const box = best.querySelector(".post-music");
  startPreview(box.querySelector(".pm-play"), url, Number(box.dataset.start) || 0, true);
}

const musicObserver = ("IntersectionObserver" in window)
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const card = entry.target.closest(".post-card"); // the observed element is the post's photo
        if (!card) return;
        const needed = Math.min(entry.boundingClientRect.height * 0.6, window.innerHeight * 0.5);
        if (entry.isIntersecting && entry.intersectionRect.height >= needed) {
          musicVisible.set(card, entry.intersectionRect.height);
        } else {
          musicVisible.delete(card);
          const url = musicUrlOf(card);
          if (url) autoplayBlocked.delete(url); // it can play again next time it scrolls in
        }
      });
      pickVisibleMusic();
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] })
  : null;

function observeMusicPosts() {
  if (!musicObserver) return;
  // Only the post's PHOTO is watched. Music autoplays while the photo is on screen and
  // never for posts without a photo (or with a video); those still have the play button.
  document.querySelectorAll(".post-card").forEach(card => {
    if (!card.querySelector(".post-music")) return;
    const photo = card.querySelector(".post-image, .post-album");
    if (!photo || photo._musicWatched) return;
    photo._musicWatched = true;
    musicObserver.observe(photo);
  });
}

let musicScanTimer = null;
new MutationObserver(() => {
  clearTimeout(musicScanTimer);
  musicScanTimer = setTimeout(observeMusicPosts, 120);
}).observe(document.body, { childList: true, subtree: true });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") { if (previewSource === "feed") stopPreview(false); }
  else pickVisibleMusic();
});

function togglePostMusic(btn) {
  const box = btn.closest(".post-music");
  if (!box) return;
  togglePreview(btn, box.dataset.preview, Number(box.dataset.start) || 0);
}

function musicBarHTML(music, removable) {
  const art = music.artwork
    ? `<img src="${escAttr(music.artwork)}" alt="">`
    : `<span class="pm-art-empty">♪</span>`;
  const playing = previewKey === music.previewUrl;
  return `
    <div class="post-music" data-preview="${escAttr(music.previewUrl)}" data-start="${Number(music.start) || 0}">
      ${art}
      <div class="pm-info"><strong>${escapeHTML(music.title)}</strong><small>${escapeHTML(music.artist)}</small></div>
      <button type="button" class="pm-play" onclick="togglePostMusic(this)" aria-label="Play music">${playing ? "❚❚" : "▶"}</button>
      ${removable ? `<button type="button" class="pm-x" onclick="${removable === "comment" ? "clearCommentMusic()" : "removeComposerMusic()"}" aria-label="Remove music">×</button>` : ""}
    </div>`;
}

function renderMusicPreview() {
  const el = document.getElementById("musicPreview");
  if (!el) return;
  if (!composerMusic) {
    el.innerHTML = "";
    el.classList.add("hidden");
    return;
  }
  el.innerHTML = musicBarHTML(composerMusic, true);
  el.classList.remove("hidden");
}

function removeComposerMusic() {
  composerMusic = null;
  stopPreview();
  renderMusicPreview();
}

/* Saved songs (the bookmark button) are kept on this device only. */
function getSavedSongs() {
  try { const v = JSON.parse(localStorage.getItem("nbh-saved-songs") || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function setSavedSongs(list) {
  try { localStorage.setItem("nbh-saved-songs", JSON.stringify(list.slice(0, 200))); } catch (e) { /* storage full or blocked */ }
}
function formatSongTime(sec) {
  sec = Math.round(Number(sec) || 0);
  if (!sec) return "";
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}

function addMusic(onUse) {
  const BOOKMARK = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>`;
  const { ov, close: closeSheet } = openPickerSheet("music-sheet", `
      <div class="gs-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input class="mp-input" type="search" placeholder="Search..." autocomplete="off" autocapitalize="off" enterkeyhint="search"></div>
      <div class="ms-chips">
        <button type="button" data-feed="foryou" class="on">For you</button>
        <button type="button" data-feed="trending">Trending</button>
        <button type="button" data-feed="saved">Saved</button>
      </div>
      <div class="ms-list gs-body"></div>`, () => stopPreview());

  const input = ov.querySelector(".mp-input");
  const list = ov.querySelector(".ms-list");
  const chips = ov.querySelectorAll("[data-feed]");
  let results = [];
  let feed = "foryou";
  let timer = null;
  let token = 0;
  let selected = -1;
  const feedCache = {};

  const close = () => { stopPreview(); closeSheet(); };
  const show = html => { list.innerHTML = html; };
  const isSaved = t => getSavedSongs().some(x => String(x.id) === String(t.id));

  function rows(items, withBanner) {
    results = items;
    selected = -1;
    let html = "";
    if (withBanner && items[0]) {
      const f = items[0];
      html += `<button type="button" class="ms-banner" data-row="0">
        ${f.artwork ? `<img src="${escAttr(f.artwork)}" alt="">` : `<span class="pm-art-empty">♪</span>`}
        <span class="ms-banner-text"><strong>${escapeHTML(f.title)}</strong><small>${escapeHTML(f.artist)}</small></span></button>`;
    }
    html += items.map((t, i) => {
      const meta = [t.artist, formatSongTime(t.duration)].filter(Boolean).join(" · ");
      return `<div class="ms-row" data-row="${i}">
        ${t.artwork ? `<img src="${escAttr(t.artwork)}" alt="" loading="lazy">` : `<span class="pm-art-empty">♪</span>`}
        <div class="pm-info"><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(meta)}</small></div>
        <button type="button" class="ms-use" data-use="${i}">Use</button>
        <button type="button" class="ms-save${isSaved(t) ? " on" : ""}" data-save="${i}" aria-label="Save song" aria-pressed="${isSaved(t)}">${BOOKMARK}</button>
      </div>`;
    }).join("");
    show(html);
  }

  async function loadFeed() {
    if (input.value.trim()) return search();
    if (feed === "saved") {
      const saved = getSavedSongs();
      if (!saved.length) { results = []; show(`<p class="mp-empty">No saved songs yet.<br>Tap the bookmark on a song to save it.</p>`); return; }
      return rows(saved, false);
    }
    if (feedCache[feed]) return rows(feedCache[feed], true);
    if (isOffline()) { show(`<p class="mp-empty">You are offline. Music needs a connection.</p>`); return; }
    const mine = ++token;
    show(`<p class="mp-empty">Loading…</p>`);
    try {
      const res = await api("/api/music/browse?feed=" + feed);
      if (mine !== token) return;
      feedCache[feed] = (res && res.results) || [];
      if (!feedCache[feed].length) { show(`<p class="mp-empty">No songs right now. Try searching.</p>`); return; }
      rows(feedCache[feed], true);
    } catch (err) {
      if (mine !== token) return;
      show(`<p class="mp-empty">${escapeHTML((err && err.message) || "Couldn't load songs.")}</p>`);
    }
  }

  async function search() {
    const q = input.value.trim();
    if (q.length < 2) { loadFeed(); return; }
    const mine = ++token;
    show(`<p class="mp-empty">Searching…</p>`);
    try {
      const res = await api("/api/music/search?q=" + encodeURIComponent(q));
      if (mine !== token) return;
      const found = (res && res.results) || [];
      if (!found.length) { show(`<p class="mp-empty">No songs found. Try another search.</p>`); results = []; return; }
      rows(found, false);
    } catch (err) {
      if (mine !== token) return;
      show(`<p class="mp-empty">${escapeHTML((err && err.message) || "Couldn't search right now.")}</p>`);
    }
  }

  function selectRow(i) {
    const track = results[i];
    if (!track) return;
    stopPreview(false);
    if (selected === i) { selected = -1; list.querySelectorAll(".ms-row").forEach(r => r.classList.remove("sel")); return; }
    selected = i;
    list.querySelectorAll(".ms-row").forEach(r => r.classList.toggle("sel", Number(r.dataset.row) === i));
    startPreview(null, track.previewUrl, 0, false);
  }

  chips.forEach(c => c.addEventListener("click", () => {
    feed = c.dataset.feed;
    chips.forEach(x => x.classList.toggle("on", x === c));
    stopPreview(false);
    loadFeed();
  }));
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => (input.value.trim().length >= 2 ? search() : loadFeed()), 400); });

  list.addEventListener("click", event => {
    const save = event.target.closest("[data-save]");
    if (save) {
      const track = results[Number(save.dataset.save)];
      if (!track) return;
      let saved = getSavedSongs();
      if (saved.some(x => String(x.id) === String(track.id))) saved = saved.filter(x => String(x.id) !== String(track.id));
      else saved.unshift({ id: track.id, title: track.title, artist: track.artist, artwork: track.artwork, previewUrl: track.previewUrl, duration: track.duration });
      setSavedSongs(saved);
      if (feed === "saved" && !input.value.trim()) loadFeed();
      else { save.classList.toggle("on"); save.setAttribute("aria-pressed", save.classList.contains("on")); }
      return;
    }
    const use = event.target.closest("[data-use]");
    if (use) {
      const track = results[Number(use.dataset.use)];
      if (!track) return;
      const picked = { id: track.id, title: track.title, artist: track.artist, artwork: track.artwork, previewUrl: track.previewUrl, start: 0 };
      close();
      if (typeof onUse === "function") { onUse(picked); return; }
      composerMusic = picked;
      renderMusicPreview();
      return;
    }
    const row = event.target.closest("[data-row]");
    if (row) selectRow(Number(row.dataset.row));
  });

  loadFeed();
}

/* =========================================================
   TAGS + @MENTIONS
   - Tag: pick members in the composer ("with Nea and Axel"). They get a notification.
   - Mention: type @ in a post or comment, pick a member from the list. They get a
     notification too. @Handle is the part of the username before the "@".
========================================================= */

function mentionHandle(user) {
  return String((user && user.username) || "").split("@")[0];
}

function findUserByHandle(handle) {
  const h = String(handle || "").toLowerCase();
  return data.users.find(u => !u.disabled && mentionHandle(u).toLowerCase() === h) || null;
}

// Escapes the text, and turns @handles that match a real member into tappable links.
function richTextHTML(text) {
  const raw = String(text == null ? "" : text);
  const re = /(^|[^\w@])@([A-Za-z0-9_.-]{2,40})/g;
  let out = "", last = 0, m;
  while ((m = re.exec(raw)) !== null) {
    const handle = m[2].replace(/[.\-]+$/, "");
    const user = handle ? findUserByHandle(handle) : null;
    if (!user) continue;
    const atPos = m.index + m[1].length;
    out += escapeHTML(raw.slice(last, atPos)) +
      `<a class="mention" href="#" data-username="${escAttr(user.username)}">@${escapeHTML(handle)}</a>`;
    last = atPos + 1 + handle.length;
    re.lastIndex = last;
  }
  return out + escapeHTML(raw.slice(last));
}

function postTagsHTML(post) {
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const people = tags.map(u => findUser(u)).filter(Boolean);
  if (!people.length) return "";
  return `<div class="post-tagged">${iconSVG("tag")}<span>with ${people.map(u =>
    `<a class="mention" href="#" data-username="${escAttr(u.username)}">${escapeHTML(u.name)}</a>`).join(", ")}</span></div>`;
}

function openMention(username) {
  ["commentsModal", "postViewModal", "reactorsModal"].forEach(closeModal);
  closeLightbox();
  openUserProfile(username);
}

document.addEventListener("click", event => {
  const link = event.target.closest && event.target.closest("a.mention");
  if (!link) return;
  event.preventDefault();
  event.stopPropagation();
  openMention(link.dataset.username);
}, true);

/* ---- Composer: tag picker ---- */
function renderTagPreview() {
  const el = document.getElementById("tagPreview");
  if (!el) return;
  const people = composerTags.map(u => findUser(u)).filter(Boolean);
  if (!people.length) { el.innerHTML = ""; el.classList.add("hidden"); return; }
  el.innerHTML = `<span class="tag-label">${iconSVG("tag")} With</span>` + people.map(u =>
    `<button type="button" class="tag-chip" data-remove="${escAttr(u.username)}">${escapeHTML(u.name)} <b>×</b></button>`).join("");
  el.classList.remove("hidden");
}

document.addEventListener("click", event => {
  const chip = event.target.closest && event.target.closest(".tag-chip[data-remove]");
  if (!chip) return;
  composerTags = composerTags.filter(u => !usernamesMatch(u, chip.dataset.remove));
  renderTagPreview();
});

function addTags() {
  const me = currentUser();
  if (!me) return;
  const members = otherMembers(me.username).filter(u => !u.disabled);
  const picked = new Set(composerTags.map(u => String(u).toLowerCase()));
  const ov = document.createElement("div");
  ov.className = "mp-overlay";
  ov.innerHTML = `
    <div class="mp-box">
      <div class="pe-top">
        <button type="button" data-a="close" aria-label="Close">×</button>
        <strong>Tag people</strong>
        <button type="button" data-a="done" class="tag-done">Done</button>
      </div>
      <input class="mp-search" type="search" placeholder="Search members" autocomplete="off" autocapitalize="off">
      <div class="mp-list"></div>
    </div>`;
  document.body.appendChild(ov);
  const list = ov.querySelector(".mp-list");
  const input = ov.querySelector(".mp-search");

  const draw = () => {
    const q = input.value.trim().toLowerCase();
    const rows = members.filter(u => !q || u.name.toLowerCase().includes(q) || mentionHandle(u).toLowerCase().includes(q));
    if (!rows.length) { list.innerHTML = `<p class="mp-empty">No members found.</p>`; return; }
    list.innerHTML = rows.map(u => {
      const on = picked.has(u.username.toLowerCase());
      const av = u.avatarImage ? `<img src="${escAttr(u.avatarImage)}" alt="">` : `<span class="pm-art-empty">${escapeHTML(u.avatar || avatarLetter(u.name))}</span>`;
      return `<div class="mp-row" data-u="${escAttr(u.username)}">
        ${av}
        <div class="pm-info"><strong>${escapeHTML(u.name)}</strong><small>@${escapeHTML(mentionHandle(u))}</small></div>
        <button type="button" class="mp-use ${on ? "on" : ""}" data-pick="${escAttr(u.username)}">${on ? "Tagged ✓" : "Tag"}</button>
      </div>`;
    }).join("");
  };
  draw();
  input.addEventListener("input", draw);

  const finish = () => {
    composerTags = members.filter(u => picked.has(u.username.toLowerCase())).map(u => u.username).slice(0, 10);
    renderTagPreview();
    ov.remove();
  };
  ov.addEventListener("click", event => {
    const t = event.target.closest("button");
    if (!t) return;
    if (t.dataset.a === "close") return ov.remove();
    if (t.dataset.a === "done") return finish();
    if (t.dataset.pick) {
      const key = t.dataset.pick.toLowerCase();
      if (picked.has(key)) picked.delete(key);
      else if (picked.size < 10) picked.add(key);
      else showMessage("You can tag up to 10 people.");
      draw();
    }
  });
}

/* ---- @mention autocomplete for the post box and the comment box ---- */
const mentionBox = document.createElement("div");
mentionBox.className = "mention-box hidden";
document.body.appendChild(mentionBox);
let mentionTarget = null;

function hideMentionBox() { mentionBox.classList.add("hidden"); mentionBox.innerHTML = ""; }

function updateMentionBox(field) {
  const me = currentUser();
  if (!me) return hideMentionBox();
  const caret = field.selectionStart == null ? field.value.length : field.selectionStart;
  const before = field.value.slice(0, caret);
  const m = /(^|\s)@([A-Za-z0-9_.-]{0,40})$/.exec(before);
  if (!m) return hideMentionBox();
  const q = m[2].toLowerCase();
  // Match the start of the handle, or the start of any word in the member's name.
  const matches = otherMembers(me.username).filter(u => !u.disabled && (
    mentionHandle(u).toLowerCase().startsWith(q) ||
    String(u.name || "").toLowerCase().split(/\s+/).some(w => w.startsWith(q))
  )).slice(0, 8);
  if (!matches.length) return hideMentionBox();
  mentionTarget = { field, start: caret - q.length - 1, end: caret };
  mentionBox.innerHTML = matches.map(u => {
    const av = u.avatarImage ? `<img src="${escAttr(u.avatarImage)}" alt="">` : `<span class="mb-av">${escapeHTML(u.avatar || avatarLetter(u.name))}</span>`;
    return `<button type="button" data-handle="${escAttr(mentionHandle(u))}">${av}<span><strong>${escapeHTML(u.name)}</strong><small>@${escapeHTML(mentionHandle(u))}</small></span></button>`;
  }).join("");
  const r = field.getBoundingClientRect();
  mentionBox.style.left = Math.max(8, r.left) + "px";
  mentionBox.style.width = Math.min(r.width, window.innerWidth - 16) + "px";
  // On phones the keyboard shrinks the visual viewport, so measure from that, not the full window.
  const vv = window.visualViewport;
  const viewBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
  mentionBox.style.bottom = Math.max(8, window.innerHeight - Math.min(r.top, viewBottom) + 6) + "px";
  mentionBox.style.maxHeight = Math.max(120, Math.min(r.top, viewBottom) - 16) + "px";
  mentionBox.style.overflowY = "auto";
  mentionBox.classList.remove("hidden");
}

mentionBox.addEventListener("pointerdown", event => event.preventDefault()); // keep the keyboard open
mentionBox.addEventListener("click", event => {
  const b = event.target.closest("button[data-handle]");
  if (!b || !mentionTarget) return;
  const { field, start, end } = mentionTarget;
  const insert = "@" + b.dataset.handle + " ";
  field.value = field.value.slice(0, start) + insert + field.value.slice(end);
  const pos = start + insert.length;
  try { field.setSelectionRange(pos, pos); } catch (e) {}
  field.focus();
  hideMentionBox();
});

["postText", "commentInput"].forEach(id => {
  const field = document.getElementById(id);
  if (!field) return;
  field.addEventListener("input", () => updateMentionBox(field));
  field.addEventListener("keyup", event => { if (event.key.startsWith("Arrow")) updateMentionBox(field); });
  field.addEventListener("blur", () => setTimeout(hideMentionBox, 150));
});

/* =========================================================
   PWA: SERVICE WORKER REGISTRATION
   Lets the browser install this site as an app (Add to Home
   Screen / desktop install) and caches the static shell for
   fast reloads. Safe to leave in even if you never deploy
   over HTTPS locally — registration just silently no-ops on
   plain http://localhost in some browsers.
========================================================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}


/* =========================================================
   LOGO REFRESH, PULL-TO-REFRESH, "NEW POSTS" BUTTON
========================================================= */

let feedRefreshing = false;

// Tap the logo (or pull down at the top of the page) to fetch the newest posts.
// For a full browser reload instead, replace the body of this function with: location.reload();
async function refreshFeed(options) {
  if (!session || feedRefreshing) return;
  if (savesInFlight > 0) { showMessage("Saving… try again in a moment."); return; }
  feedRefreshing = true;
  hideNewPostsButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
  try {
    const fresh = await api("/api/state");
    data = fresh;
    renderEverything();
    refreshAfterSync();
    if (!(options && options.quiet)) showMessage("Feed refreshed");
  } catch (error) {
    showMessage("Couldn't refresh. Check your connection.");
  } finally {
    feedRefreshing = false;
  }
}

function showNewPostsButton(count) {
  let btn = document.getElementById("newPostsBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "newPostsBtn";
    btn.type = "button";
    btn.className = "new-posts-btn";
    btn.addEventListener("click", () => refreshFeed({ quiet: true }));
    document.body.appendChild(btn);
  }
  btn.textContent = "\u2191 " + count + (count === 1 ? " new post" : " new posts");
  btn.classList.add("show");
}

function hideNewPostsButton() {
  const btn = document.getElementById("newPostsBtn");
  if (btn) btn.classList.remove("show");
}

(function setupPullToRefresh() {
  const THRESHOLD = 110; // finger travel in px needed to trigger
  const indicator = document.createElement("div");
  indicator.className = "pull-indicator";
  indicator.setAttribute("aria-hidden", "true");
  document.body.appendChild(indicator);
  let startY = 0, dist = 0, pulling = false;

  function reset() {
    pulling = false; dist = 0;
    indicator.style.transform = "translate(-50%, -60px)";
    indicator.style.opacity = "0";
  }
  reset();

  window.addEventListener("touchstart", e => {
    if (!session || window.scrollY > 0 || document.querySelector(".modal:not(.hidden), .lightbox:not(.hidden)") || e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    pulling = true;
    dist = 0;
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (!pulling) return;
    dist = e.touches[0].clientY - startY;
    if (dist <= 0 || window.scrollY > 0) { reset(); return; }
    const shown = Math.min(dist * 0.5, 70);
    indicator.style.transform = "translate(-50%, " + (shown - 60) + "px)";
    indicator.style.opacity = String(Math.min(1, dist / THRESHOLD));
    indicator.textContent = dist >= THRESHOLD ? "Release to refresh" : "Pull to refresh";
  }, { passive: true });

  window.addEventListener("touchend", () => {
    const shouldRefresh = pulling && dist >= THRESHOLD;
    reset();
    if (shouldRefresh) refreshFeed();
  }, { passive: true });
  window.addEventListener("touchcancel", reset, { passive: true });
})();

/* =========================================================
   DOUBLE-TAP TO LIKE (+ HEART ANIMATION)
========================================================= */

function spawnHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "heart-pop";
  heart.textContent = REACTIONS[1]; // the red heart
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
}

function likeByDoubleTap(postId, x, y) {
  const post = data.posts.find(p => p.id === postId);
  if (!post) return;
  spawnHeart(x, y);
  // Like Instagram: double-tapping never un-likes. Only react if the heart isn't already yours.
  if (ensureSocial().myReactions[postId] !== REACTIONS[1]) toggleReaction(postId, REACTIONS[1]);
}

(function setupDoubleTapLike() {
  let lastTime = 0, lastX = 0, lastY = 0;
  let downX = 0, downY = 0;
  let openTimer = null;
  const PHOTO_SELECTOR = ".post-image, .post-album img";
  document.addEventListener("pointerdown", e => { downX = e.clientX; downY = e.clientY; });
  document.addEventListener("pointerup", e => {
    if (!session || (e.pointerType === "mouse" && e.button !== 0)) return;
    // A drag/scroll that ended on a photo is not a tap.
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY) > 12;
    // Photos always count; text only on touch (so double-click can still select words on desktop).
    const selector = e.pointerType === "mouse" ? ".post-image, .post-album img" : ".post-image, .post-album img, .post-text";
    const target = e.target.closest && e.target.closest(selector);
    const card = target && target.closest(".post-card");
    if (!card) { lastTime = 0; return; }
    const now = Date.now();
    const near = Math.hypot(e.clientX - lastX, e.clientY - lastY) < 40;
    if (moved) { lastTime = 0; return; }
    if (now - lastTime < 320 && near) {
      lastTime = 0;
      // Second tap of a double-tap: like it, and do NOT open the full-screen viewer.
      clearTimeout(openTimer); openTimer = null;
      likeByDoubleTap(Number(card.dataset.postId), e.clientX, e.clientY);
    } else {
      lastTime = now; lastX = e.clientX; lastY = e.clientY;
      // Single tap on a photo: open it full screen (after waiting to see if a 2nd tap follows).
      if (target.matches(PHOTO_SELECTOR)) {
        const postId = Number(card.dataset.postId);
        const album = Array.from(card.querySelectorAll(".post-album img"));
        const index = target.classList.contains("post-image") ? 0 : Math.max(0, album.indexOf(target));
        clearTimeout(openTimer);
        openTimer = setTimeout(() => { openTimer = null; openLightbox(postId, index); }, 300);
      }
    }
  });
})();

/* =========================================================
   COMMENT LIKES
========================================================= */

async function toggleCommentLike(postId, commentId) {
  const post = data.posts.find(p => p.id === postId);
  const comment = post && (post.commentsList || []).find(c => c.id === commentId);
  if (!comment || !session) return;
  const before = Array.isArray(comment.likes) ? comment.likes.slice() : [];
  const likes = before.slice();
  const at = likes.findIndex(u => usernamesMatch(u, session.username));
  if (at >= 0) likes.splice(at, 1); else likes.push(session.username);
  comment.likes = likes;          // update instantly, confirm with the server below
  renderCommentsList(true);
  try {
    const result = await api("/api/posts/" + postId + "/comments/" + encodeURIComponent(commentId) + "/like", { method: "POST", body: {} });
    if (result && Array.isArray(result.likes)) { comment.likes = result.likes; renderCommentsList(true); }
  } catch (error) {
    comment.likes = before;       // undo if the server said no
    renderCommentsList(true);
    showMessage("Couldn't update that like.");
  }
}
