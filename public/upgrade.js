/* =========================================================
   upgrade.js — loaded AFTER script.js. Adds, without touching
   script.js: feed search + filters, gallery view, #hashtags,
   skeleton loading, "read more", copy-link, community pulse,
   scroll progress, back-to-top, offline banner, install button,
   keyboard shortcuts. Delete this file + its <script> tag to undo.
========================================================= */
(function () {
  "use strict";

  var S = { q: "", filter: "all", view: "feed" };
  var expanded = {};            // post ids whose long text the member expanded
  var firstPaint = true;
  var origRenderFeed = window.renderFeed;
  var origRichText = window.richTextHTML;
  var installEvent = null;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function str(x) { return x == null || x === false ? "" : String(x); }
  function esc(x) { return typeof escapeHTML === "function" ? escapeHTML(x) : str(x).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function safe(fn) { try { return fn(); } catch (e) { console.error("[upgrade]", e); } }

  /* ---------- #hashtags (wraps richTextHTML) ---------- */
  if (typeof origRichText === "function") {
    window.richTextHTML = function (text) {
      var html = origRichText(text);
      return html.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/g).map(function (part, i) {
        if (i % 2 === 1) return part;
        return part.replace(/(^|[\s(])#([A-Za-z][A-Za-z0-9_]{1,30})/g, function (m, pre, tag) {
          return pre + '<a class="hashtag" href="#" data-tag="' + tag + '">#' + tag + "</a>";
        });
      }).join("");
    };
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.hashtag");
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    ["commentsModal", "postViewModal", "reactorsModal", "userProfileModal"].forEach(function (id) { if (typeof closeModal === "function") closeModal(id); });
    if (typeof closeLightbox === "function") closeLightbox();
    if (typeof openPage === "function") openPage("home");
    setQuery("#" + a.dataset.tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, true);

  /* ---------- Filtering ---------- */
  function hasPhoto(p) { return !!(p.image || (p.images && p.images.length)); }

  function matches(p) {
    var me = typeof currentUser === "function" ? currentUser() : null;
    if (S.filter === "photos" && !hasPhoto(p)) return false;
    if (S.filter === "videos" && !p.video) return false;
    if (S.filter === "music" && !(p.music && p.music.previewUrl)) return false;
    if (S.filter === "mine" && !(me && p.username && usernamesMatch(p.username, me.username))) return false;
    if (S.filter === "saved" && !(ensureSocial().savedPostIds || []).includes(p.id)) return false;
    if (S.q) {
      var author = findUser(p.username) || {};
      var tagged = (p.tags || []).map(function (u) { var f = findUser(u); return f ? f.name : u; }).join(" ");
      var hay = [p.text, p.name, author.name, p.username, tagged, p.music && p.music.title, p.music && p.music.artist].map(str).join(" ").toLowerCase();
      if (hay.indexOf(S.q.toLowerCase()) === -1) return false;
    }
    return true;
  }
  function isFiltered() { return !!S.q || S.filter !== "all"; }

  function setQuery(q) {
    S.q = q;
    var input = $("#feedSearch");
    if (input) input.value = q;
    window.renderFeed();
  }

  /* ---------- Toolbar (greeting, search, chips, view toggle) ---------- */
  var CHIPS = [["all", "All"], ["photos", "Photos"], ["videos", "Videos"], ["music", "Music"], ["mine", "My posts"], ["saved", "Saved"]];

  function buildToolbar() {
    var home = $("#homePage"), feed = $("#feed");
    if (!home || !feed || $("#feedTools")) return;

    var greet = document.createElement("div");
    greet.className = "greeting";
    greet.id = "greeting";
    var mini = $(".create-mini", home);
    home.insertBefore(greet, mini || feed);

    var bar = document.createElement("div");
    bar.id = "feedTools";
    bar.className = "feed-tools";
    bar.innerHTML =
      '<label class="feed-search"><span class="icon" data-icon="search" aria-hidden="true"></span>' +
      '<input id="feedSearch" type="search" placeholder="Search posts, people, #tags" aria-label="Search posts" autocomplete="off">' +
      '<button type="button" id="feedSearchClear" aria-label="Clear search" hidden>×</button></label>' +
      '<div class="feed-row"><div class="chip-row" role="group" aria-label="Filter posts">' +
      CHIPS.map(function (c) { return '<button type="button" class="chip" data-filter="' + c[0] + '">' + c[1] + "</button>"; }).join("") +
      '</div><div class="view-toggle" role="group" aria-label="View">' +
      '<button type="button" data-view="feed">Feed</button><button type="button" data-view="gallery">Gallery</button></div></div>' +
      '<div class="feed-count" id="feedCount" hidden></div>';
    home.insertBefore(bar, feed);
    if (typeof applyStaticIcons === "function") applyStaticIcons(bar);

    var timer;
    var input = $("#feedSearch", bar);
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { S.q = input.value.trim(); window.renderFeed(); }, 150);
    });
    $("#feedSearchClear", bar).addEventListener("click", function () { setQuery(""); input.focus(); });
    bar.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-filter]");
      var view = e.target.closest("[data-view]");
      if (chip) { S.filter = chip.dataset.filter; window.renderFeed(); }
      if (view) { S.view = view.dataset.view; window.renderFeed(); }
    });
  }

  function updateToolbar(shown, total) {
    $$("#feedTools [data-filter]").forEach(function (b) { b.classList.toggle("active", b.dataset.filter === S.filter); b.setAttribute("aria-pressed", b.dataset.filter === S.filter); });
    $$("#feedTools [data-view]").forEach(function (b) { b.classList.toggle("active", b.dataset.view === S.view); b.setAttribute("aria-pressed", b.dataset.view === S.view); });
    var clear = $("#feedSearchClear");
    if (clear) clear.hidden = !S.q;
    var count = $("#feedCount");
    if (count) {
      if (isFiltered()) {
        count.hidden = false;
        count.innerHTML = "Showing " + shown + " of " + total + (total === 1 ? " post" : " posts") + '<button type="button" id="feedReset">Clear filters</button>';
        $("#feedReset").onclick = function () { S.filter = "all"; S.q = ""; var i = $("#feedSearch"); if (i) i.value = ""; window.renderFeed(); };
      } else count.hidden = true;
    }
  }

  function updateGreeting() {
    var el = $("#greeting"), me = typeof currentUser === "function" ? currentUser() : null;
    if (!el || !me) return;
    var h = new Date().getHours();
    var part = h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    var first = str(me.name).split(" ")[0] || "there";
    var weekAgo = Date.now() - 7 * 864e5;
    var fresh = data.posts.filter(function (p) { return typeof p.createdAt === "number" && p.createdAt > weekAgo; }).length;
    el.innerHTML = "<h2>" + esc(part + ", " + first) + "</h2><p>" +
      (fresh ? fresh + (fresh === 1 ? " new post" : " new posts") + " in the community this week" : "It's quiet this week — share something!") + "</p>";
  }

  /* ---------- Rendering: feed / gallery / empty ---------- */
  function skeletons(n) {
    var one = '<div class="skeleton-card" aria-hidden="true"><div class="sk-head"><div class="sk sk-av"></div><div style="flex:1"><div class="sk sk-line" style="width:40%"></div><div class="sk sk-line" style="width:25%;margin:0"></div></div></div><div class="sk sk-line" style="width:90%"></div><div class="sk sk-line" style="width:65%"></div><div class="sk sk-img"></div></div>';
    return new Array(n + 1).join(one);
  }

  function galleryHTML(posts) {
    var tiles = [];
    posts.forEach(function (p) {
      var who = esc((findUser(p.username) || {}).name || p.name || "");
      if (p.video) {
        tiles.push('<button type="button" class="g-tile" data-post="' + p.id + '" data-kind="video" aria-label="Open video by ' + who + '"><video src="' + esc(p.video) + '#t=0.1" preload="metadata" muted playsinline></video><span class="g-badge">▶ Video</span><span class="g-who">' + who + "</span></button>");
      } else {
        var imgs = typeof postImageList === "function" ? postImageList(p) : [];
        imgs.forEach(function (src, i) {
          tiles.push('<button type="button" class="g-tile" data-post="' + p.id + '" data-index="' + i + '" aria-label="Open photo by ' + who + '"><img src="' + esc(src) + '" alt="" loading="lazy" decoding="async"><span class="g-who">' + who + "</span></button>");
        });
      }
    });
    return tiles.length ? '<div class="gallery-grid">' + tiles.join("") + "</div>" : "";
  }

  function emptyHTML() {
    return '<div class="empty-state"><strong>Nothing matches</strong>Try a different word or filter.<br><button type="button" class="soft-button" id="emptyReset">Clear filters</button></div>';
  }

  function animateFeed(feed) {
    feed.classList.add("feed-animate");
    clearTimeout(animateFeed.t);
    animateFeed.t = setTimeout(function () { feed.classList.remove("feed-animate"); }, 900);
  }

  var lastSig = "";
  window.renderFeed = function () {
    var feed = $("#feed");
    if (!feed || !Array.isArray(data.posts)) return origRenderFeed && origRenderFeed();
    buildToolbar();

    var posts = data.posts.filter(matches);
    var sig = S.q + "|" + S.filter + "|" + S.view;

    if (!data.posts.length) {
      if (origRenderFeed) origRenderFeed();
    } else if (!posts.length) {
      feed.innerHTML = emptyHTML();
      var r = $("#emptyReset");
      if (r) r.onclick = function () { S.filter = "all"; S.q = ""; var i = $("#feedSearch"); if (i) i.value = ""; window.renderFeed(); };
    } else if (S.view === "gallery") {
      var g = galleryHTML(posts);
      feed.innerHTML = g || emptyHTML().replace("Nothing matches", "No photos or videos yet");
    } else {
      feed.innerHTML = posts.map(function (p) { return postCardHTML(p); }).join("");
    }

    updateToolbar(posts.length, data.posts.length);
    updateGreeting();
    safe(function () { decoratePosts(feed); });
    safe(renderPulse);
    if (firstPaint || sig !== lastSig) animateFeed(feed);
    firstPaint = false;
    lastSig = sig;
  };

  // Gallery tile clicks (event delegation on the feed container).
  document.addEventListener("click", function (e) {
    var tile = e.target.closest && e.target.closest(".g-tile");
    if (!tile) return;
    var id = Number(tile.dataset.post);
    if (tile.dataset.kind === "video") openPostView(id);
    else openLightbox(id, Number(tile.dataset.index) || 0);
  });

  /* ---------- Per-post decoration ---------- */
  function decoratePosts(feed) {
    var cards = $$(".post-card", feed);
    cards.forEach(function (card, idx) {
      $$("img", card).forEach(function (img) {
        if (img.closest(".post-header")) return;
        if (idx > 1) { img.loading = "lazy"; }
        img.decoding = "async";
        if (!img.complete) {
          img.classList.add("img-loading");
          var done = function () { img.classList.remove("img-loading"); };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      });

      var id = Number(card.dataset.postId);
      var text = $(".post-text", card);
      if (text && text.scrollHeight > 230 && !expanded[id]) {
        text.classList.add("clamped");
        var more = document.createElement("button");
        more.type = "button";
        more.className = "read-more";
        more.textContent = "Read more";
        more.onclick = function () { expanded[id] = true; text.classList.remove("clamped"); more.remove(); };
        text.insertAdjacentElement("afterend", more);
      }

      var actions = $(".post-actions", card);
      var canShare = !(typeof isNativeApp === "function" && isNativeApp()) && /^https?:$/.test(location.protocol);
      if (actions && canShare && !$(".link-btn", actions)) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "link-btn";
        btn.setAttribute("aria-label", "Copy link to post");
        btn.innerHTML = '<span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg></span>';
        btn.onclick = function () { copyLink(id); };
        var save = $(".save-button", actions);
        actions.insertBefore(btn, save || null);
      }
    });
  }

  function copyLink(id) {
    var url = location.origin + "/?post=" + id;
    if (navigator.share) {
      navigator.share({ title: "Nea's Boarding Horse", url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { showMessage("Link copied — members can open it after logging in"); }, function () { showMessage(url); });
    } else showMessage(url);
  }

  /* ---------- Community pulse (right sidebar) ---------- */
  function renderPulse() {
    var side = $(".sidebar-right");
    if (!side || !Array.isArray(data.posts)) return;
    var card = $("#pulseCard");
    if (!card) {
      card = document.createElement("div");
      card.id = "pulseCard";
      card.className = "sidebar-card";
      side.appendChild(card);
    }
    var week = Date.now() - 7 * 864e5;
    var members = (data.users || []).filter(function (u) { return !u.disabled; }).length;
    var recent = data.posts.filter(function (p) { return typeof p.createdAt === "number" && p.createdAt > week; });
    var photos = data.posts.reduce(function (n, p) { return n + (p.video ? 1 : (typeof postImageList === "function" ? postImageList(p).length : 0)); }, 0);
    var top = recent.slice().sort(function (a, b) { return totalReactions(b) - totalReactions(a); })[0];

    var counts = {};
    data.posts.forEach(function (p) { (str(p.text).match(/(^|[\s(])#([A-Za-z][A-Za-z0-9_]{1,30})/g) || []).forEach(function (m) { var t = m.trim().replace(/^\(/, "").toLowerCase(); counts[t] = (counts[t] || 0) + 1; }); });
    var tags = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);

    card.innerHTML =
      '<div class="sidebar-card-header"><h3>Community pulse</h3></div>' +
      '<div class="pulse-stats"><div><strong>' + members + "</strong><span>Members</span></div><div><strong>" + recent.length + "</strong><span>Posts / week</span></div><div><strong>" + photos + "</strong><span>Media</span></div></div>" +
      (top && totalReactions(top) > 0 ? '<button type="button" class="pulse-top" data-open="' + top.id + '"><small>🔥 Top post this week</small><span>' + esc(str(top.text).slice(0, 120) || "Photo post") + "</span></button>" : "") +
      (tags.length ? '<div class="tag-cloud">' + tags.map(function (t) { return '<button type="button" data-q="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div>" : "");
    var topBtn = $("[data-open]", card);
    if (topBtn) topBtn.onclick = function () { openPostView(Number(topBtn.dataset.open)); };
    $$("[data-q]", card).forEach(function (b) { b.onclick = function () { setQuery(b.dataset.q); window.scrollTo({ top: 0, behavior: "smooth" }); }; });
  }

  /* ---------- Skeleton while the first load is in flight ---------- */
  safe(function () {
    var feed = $("#feed");
    if (feed && !feed.children.length) feed.innerHTML = skeletons(3);
  });

  /* ---------- Scroll progress + back to top ---------- */
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.textContent = "↑";
  toTop.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
  document.body.appendChild(toTop);

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      toTop.classList.toggle("show", window.scrollY > 900);
      ticking = false;
    });
  }, { passive: true });

  /* Offline banner + offline mode now live in script.js (setOffline / updateNetBanner). */

  /* ---------- Install app button ---------- */
  /* Always offered (Profile page) unless already running as an installed app.
     Chrome/Edge/Android: native install prompt. iPhone/iPad Safari and other
     browsers: a short how-to, since they have no install prompt. */
  var isInstalled = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

  function installHelp() {
    var ua = navigator.userAgent || "";
    var ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var steps = ios
      ? ["Open this site in <b>Safari</b>", "Tap the <b>Share</b> button <span class=\"ih-ico\">\u2B06\uFE0E</span> at the bottom", "Scroll and choose <b>Add to Home Screen</b>", "Tap <b>Add</b> \u2014 done!"]
      : /Android/.test(ua)
        ? ["Open the browser menu <b>\u22EE</b>", "Tap <b>Install app</b> or <b>Add to Home screen</b>", "Confirm \u2014 done!"]
        : ["Click the install icon in the address bar, or open the browser menu", "Choose <b>Install Nea\u2019s Boarding Horse</b>"];
    if (!$("#installHelpStyle")) {
      var st = document.createElement("style");
      st.id = "installHelpStyle";
      st.textContent =
        "@keyframes ihIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}" +
        ".ih-back{position:fixed;inset:0;z-index:300;background:rgba(5,10,25,.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px}" +
        ".ih-card{background:var(--surface,#fff);color:var(--text,#202632);border:1px solid var(--border,#e8e9ed);max-width:380px;width:100%;border-radius:24px;padding:26px 22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.35);animation:ihIn .28s ease-out;text-align:center}" +
        ".ih-logo{width:68px;height:68px;border-radius:18px;margin:0 auto 14px;display:block;box-shadow:0 6px 18px rgba(0,0,0,.25)}" +
        ".ih-card h3{margin:0 0 4px;font-size:1.25rem;color:var(--text,#202632)}" +
        ".ih-sub{margin:0 0 18px;color:var(--muted,#7b818b);font-size:.92rem}" +
        ".ih-steps{list-style:none;counter-reset:s;padding:0;margin:0 0 20px;text-align:left}" +
        ".ih-steps li{counter-increment:s;display:flex;align-items:center;gap:12px;padding:11px 12px;margin-bottom:8px;border-radius:14px;background:var(--surface-alt,#f2f3f6);color:var(--text,#202632);line-height:1.35;font-size:.95rem}" +
        ".ih-steps li:before{content:counter(s);flex:none;width:28px;height:28px;border-radius:50%;background:var(--pink,#df5684);color:#fff;font-weight:700;font-size:.85rem;display:flex;align-items:center;justify-content:center}" +
        ".ih-ico{display:inline-block;padding:0 5px;border-radius:6px;background:var(--border,#e8e9ed)}" +
        ".ih-ok{width:100%;border:0;border-radius:14px;padding:14px;font:inherit;font-weight:700;font-size:1rem;color:#fff;background:var(--pink,#df5684);cursor:pointer}" +
        ".ih-ok:active{transform:scale(.98)}";
      document.head.appendChild(st);
    }
    var o = document.createElement("div");
    o.className = "ih-back";
    o.innerHTML = '<div class="ih-card" role="dialog" aria-modal="true" aria-label="Install the app">' +
      '<img class="ih-logo" src="/icons/icon-192.png" alt="">' +
      '<h3>Install Nea\u2019s Boarding Horse</h3>' +
      '<p class="ih-sub">Get it on your home screen like a real app.</p>' +
      '<ol class="ih-steps">' + steps.map(function (t) { return "<li><span>" + t + "</span></li>"; }).join("") + '</ol>' +
      '<button type="button" class="ih-ok">Got it</button></div>';
    o.onclick = function (e) { if (e.target === o || (e.target.classList && e.target.classList.contains("ih-ok"))) o.remove(); };
    document.body.appendChild(o);
  }

  function doInstall() {
    if (!installEvent) return installHelp();
    installEvent.prompt();
    installEvent.userChoice.then(function () { installEvent = null; });
  }

  function addInstallButton() {
    if (isInstalled) return;
    var actions = $("#profileActions");
    if (actions && !$("#installBtn")) {
      var b = document.createElement("button");
      b.type = "button";
      b.id = "installBtn";
      b.className = "soft-button";
      b.textContent = "Install app";
      b.onclick = doInstall;
      actions.insertBefore(b, actions.firstChild);
    }
    /* Header shortcut, handy on phones where the Profile page is a tap away */
    var top = document.querySelector(".top-actions");
    if (top && !$("#installTopBtn")) {
      var t = document.createElement("button");
      t.type = "button";
      t.id = "installTopBtn";
      t.className = "icon-button";
      t.setAttribute("aria-label", "Install app");
      t.title = "Install app";
      t.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';
      t.onclick = doInstall;
      top.insertBefore(t, top.firstChild);
    }
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installEvent = e;
    addInstallButton();
  });
  window.addEventListener("appinstalled", function () {
    installEvent = null;
    ["#installBtn", "#installTopBtn"].forEach(function (id) { var x = $(id); if (x) x.remove(); });
    showMessage("App installed");
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addInstallButton);
  else addInstallButton();

  /* ---------- Haptics + keyboard shortcuts ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".reaction-btn") && navigator.vibrate) navigator.vibrate(8);
  }, true);

  function typing(e) {
    var t = e.target;
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }
  window.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || typing(e) || typeof session === "undefined" || !session) return;
    if ($(".modal:not(.hidden)") || $(".lightbox:not(.hidden)")) return;
    if (e.key === "/") { var i = $("#feedSearch"); if (i) { e.preventDefault(); openPage("home"); i.focus(); } }
    else if (e.key === "n") { e.preventDefault(); openComposer(); }
    else if (e.key === "j" || e.key === "k") {
      var cards = $$("#feed .post-card");
      if (!cards.length) return;
      var mid = window.innerHeight * 0.25, next = null;
      if (e.key === "j") next = cards.find(function (c) { return c.getBoundingClientRect().top > mid + 4; });
      else { for (var n = cards.length - 1; n >= 0; n--) if (cards[n].getBoundingClientRect().top < mid - 4) { next = cards[n]; break; } }
      if (next) window.scrollTo({ top: window.scrollY + next.getBoundingClientRect().top - 84, behavior: "smooth" });
    }
  });

  // If data is already loaded by the time this file runs, paint with the new renderer right away.
  safe(function () { if (typeof session !== "undefined" && session && data.posts.length) window.renderFeed(); });
})();
