/* ==========================================================================
   MALIK DATA CENTRE admin panel (vanilla JS single-page app, no build step)
   Talks only to /api/admin/* (signed HttpOnly cookie + x-mdc-admin header).
   ========================================================================== */
(function () {
  "use strict";
  var SCHEMA = window.MDC_SCHEMA || {}, GROUPS = window.MDC_GROUPS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function ago(t) { var s = (Date.now() - t) / 1000; if (s < 60) return "just now"; if (s < 3600) return Math.round(s / 60) + " min ago"; if (s < 86400) return Math.round(s / 3600) + " h ago"; if (s < 7 * 86400) return Math.round(s / 86400) + " days ago"; return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function dt(t) { return new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
  function rs(n) { return "Rs " + Number(n || 0).toLocaleString("en-US"); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function digits(p) { var d = String(p || "").replace(/\D/g, ""); if (/^03\d{9}$/.test(d)) d = "92" + d.slice(1); return d; }

  /* ---------------- API ---------------- */
  var ME = null, ROLES = {}, SERVICES = {}, STAFF = [];
  async function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || "GET", credentials: "same-origin", headers: { "x-mdc-admin": "1" } };
    if (opts.body !== undefined) { init.headers["Content-Type"] = "application/json"; init.body = JSON.stringify(opts.body); }
    var r;
    try { r = await fetch("/api/admin/" + path, init); } catch (e) { throw new Error("No connection. Check your internet."); }
    var data = null; try { data = await r.json(); } catch (e) {}
    if (r.status === 401 && path !== "auth/login") { showLogin(); throw new Error("Please sign in again."); }
    if (r.status === 403 && data && /new password/.test(data.error || "")) { showNewPass(); throw new Error(data.error); }
    if (!r.ok) throw new Error((data && data.error) || "Something went wrong (" + r.status + ")");
    return data || {};
  }
  function can(p) { if (!ME) return false; return ME.perms.indexOf("*") >= 0 || ME.perms.indexOf(p) >= 0; }

  /* ---------------- toasts & confirm ---------------- */
  function toast(msg, kind) {
    var t = document.createElement("div"); t.className = "ad-toast " + (kind || "ok");
    t.innerHTML = '<i class="fa-solid ' + (kind === "err" ? "fa-circle-exclamation" : "fa-circle-check") + '"></i><span>' + esc(msg) + "</span>";
    $("#toasts").appendChild(t); setTimeout(function () { t.remove(); }, kind === "err" ? 6000 : 3200);
  }
  function confirmBox(title, text, yes) {
    return new Promise(function (res) {
      var d = $("#confirm"); $("#confirm-title").textContent = title; $("#confirm-text").textContent = text || ""; $("#confirm-yes").textContent = yes || "Yes";
      d.returnValue = ""; d.showModal(); d.addEventListener("close", function h() { d.removeEventListener("close", h); res(d.returnValue === "yes"); });
    });
  }
  async function run(btn, label, fn) {
    var html = btn ? btn.innerHTML : ""; if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner ad-spin"></i> ' + esc(label || "Working…"); }
    try { return await fn(); } catch (e) { toast(e.message, "err"); } finally { if (btn) { btn.disabled = false; btn.innerHTML = html; } }
  }

  /* ---------------- sign in ---------------- */
  function showLogin() { $("#app").hidden = true; $("#newpass").hidden = true; $("#login").hidden = false; setTimeout(function () { $("#login-u").focus(); }, 50); }
  function showNewPass() { $("#app").hidden = true; $("#login").hidden = true; $("#newpass").hidden = false; setTimeout(function () { $("#np-cur").focus(); }, 50); }
  $$("[data-eye]").forEach(function (b) { b.onclick = function () { var i = document.getElementById(b.getAttribute("data-eye")); i.type = i.type === "password" ? "text" : "password"; }; });
  $("#login-form").addEventListener("submit", async function (e) {
    e.preventDefault(); $("#login-err").textContent = "";
    await run($("#login-btn"), "Signing in…", async function () {
      try { var d = await api("auth/login", { method: "POST", body: { u: $("#login-u").value.trim(), p: $("#login-p").value } }); $("#login-p").value = ""; ME = d.user; await boot(); }
      catch (err) { $("#login-err").textContent = err.message; }
    });
  });
  $("#newpass-form").addEventListener("submit", async function (e) {
    e.preventDefault(); var err = $("#np-err"); err.textContent = "";
    if ($("#np-new").value !== $("#np-new2").value) { err.textContent = "The two new passwords are different."; return; }
    try { await api("auth/password", { method: "POST", body: { current: $("#np-cur").value, next: $("#np-new").value } }); $$("#newpass-form input").forEach(function (i) { i.value = ""; }); toast("Password saved"); await boot(); }
    catch (ex) { err.textContent = ex.message; }
  });

  /* ---------------- layout ---------------- */
  var NAV = [
    { id: "dashboard", label: "Dashboard", icon: "fa-solid fa-chart-line", perm: "dashboard" },
    { id: "leads", label: "Enquiries", icon: "fa-solid fa-inbox", perm: "leads.view" },
    { id: "orders", label: "Orders", icon: "fa-solid fa-bag-shopping", perm: "orders.view" },
    { group: "Website" },
    { id: "home", label: "Homepage", icon: "fa-solid fa-house", perm: "content.view" },
    { id: "content/tools", label: "Tools & prices", icon: "fa-solid fa-tags", perm: "content.view" },
    { id: "content/coupons", label: "Coupons", icon: "fa-solid fa-ticket", perm: "content.view" },
    { id: "content/blog", label: "Blog", icon: "fa-solid fa-newspaper", perm: "content.view" },
    { id: "site", label: "Pages & contact", icon: "fa-regular fa-file-lines", perm: "content.view" },
    { id: "content/announcement", label: "Announcement bar", icon: "fa-solid fa-bullhorn", perm: "content.view" },
    { id: "content/popup", label: "Popup", icon: "fa-regular fa-window-restore", perm: "content.view" },
    { id: "content/seo", label: "Google & sharing", icon: "fa-brands fa-google", perm: "content.view" },
    { group: "Business" },
    { id: "pro", label: "Postly Pro", icon: "fa-solid fa-crown", perm: "pro.manage" },
    { group: "Admin" },
    { id: "staff", label: "Staff & roles", icon: "fa-solid fa-user-shield", perm: "users.manage" },
    { id: "activity", label: "Activity log", icon: "fa-solid fa-clock-rotate-left", perm: "activity.view" },
    { id: "backup", label: "Backup & restore", icon: "fa-solid fa-box-archive", perm: "backup.download" },
    { id: "settings", label: "Settings", icon: "fa-solid fa-gear", perm: "dashboard" }
  ];
  function renderNav() {
    var html = "", pendingGroup = null;
    NAV.forEach(function (n) {
      if (n.group) { pendingGroup = n.group; return; }
      if (!can(n.perm)) return;
      if (pendingGroup) { html += '<div class="ad-nav-group">' + esc(pendingGroup) + "</div>"; pendingGroup = null; }
      html += '<a class="ad-navlink" href="#' + n.id + '" data-nav="' + n.id + '"><i class="' + n.icon + '"></i> ' + esc(n.label) + (n.id === "leads" ? '<span class="ad-count" id="lead-count" hidden></span>' : "") + "</a>";
    });
    $("#nav").innerHTML = html;
  }
  function setActive(id) {
    var base = id.split("/")[0], hit = NAV.filter(function (n) { return n.id && (n.id === id || n.id === base); })[0];
    if (!hit && base === "content") { var s = SCHEMA[id.split("/")[1]]; hit = NAV.filter(function (n) { return n.id === (s && s.group === "home" ? "home" : "site"); })[0]; }
    $$("#nav .ad-navlink").forEach(function (a) { a.classList.toggle("on", hit && a.getAttribute("data-nav") === hit.id); });
  }
  $("#menu-btn").onclick = function () { $("#app").classList.toggle("menu"); };
  $("#scrim").onclick = function () { $("#app").classList.remove("menu"); };
  $("#nav").addEventListener("click", function () { $("#app").classList.remove("menu"); });
  $("#theme-toggle").onclick = function () {
    var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next); try { localStorage.setItem("mdc_admin_theme", next); } catch (e) {}
  };
  $("#logout-btn").onclick = async function () { try { await api("auth/logout", { method: "POST" }); } catch (e) {} ME = null; showLogin(); };

  var dirty = false;
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
  async function route() {
    if (!ME) return;
    var id = (location.hash || "#dashboard").slice(1) || "dashboard";
    if (dirty && !(await confirmBox("Leave without saving?", "You have changes that are not saved yet.", "Leave"))) { history.replaceState(null, "", "#" + route.last); return; }
    dirty = false; route.last = id; closeDrawer();
    setActive(id);
    var v = $("#view"); v.innerHTML = '<div class="ad-loading"><i class="fa-solid fa-spinner ad-spin"></i> Loading…</div>';
    window.scrollTo(0, 0);
    var parts = id.split("/");
    try {
      if (parts[0] === "dashboard") await pageDashboard(v);
      else if (parts[0] === "leads") { await pageLeads(v, parts[1]); refreshLeadCount(); }
      else if (parts[0] === "orders") await pageOrders(v, parts[1]);
      else if (parts[0] === "home") await pageGroup(v, "home", "Homepage", "Edit any section of the homepage. Changes stay as a draft until you press Publish.");
      else if (parts[0] === "site") await pageGroup(v, "site", "Pages & contact", "Contact details, page headings and site-wide settings.", ["contact", "pages", "extras"]);
      else if (parts[0] === "content" && SCHEMA[parts[1]]) await pageEditor(v, parts[1]);
      else if (parts[0] === "pro") await pagePro(v);
      else if (parts[0] === "staff") await pageStaff(v);
      else if (parts[0] === "activity") await pageActivity(v);
      else if (parts[0] === "backup") await pageBackup(v);
      else if (parts[0] === "settings") await pageSettings(v);
      else { location.hash = "#dashboard"; }
    } catch (e) { v.innerHTML = '<div class="ad-callout red"><i class="fa-solid fa-triangle-exclamation"></i><div>' + esc(e.message) + "</div></div>"; }
  }
  window.addEventListener("hashchange", route);
  function title(t) { $("#page-title").textContent = t; document.title = t + " · MALIK DATA CENTRE Admin"; }

  async function boot() {
    try { var d = await api("auth/me"); ME = d.user; ROLES = d.roles || {}; SERVICES = d.services || {}; STAFF = d.staff || []; }
    catch (e) { if (/new password/.test(e.message)) return; showLogin(); return; }
    if (ME.mustChange) { showNewPass(); return; }
    $("#login").hidden = true; $("#newpass").hidden = true; $("#app").hidden = false;
    $("#user-name").textContent = ME.name || ME.u; $("#user-role").textContent = ME.roleName; $("#user-av").textContent = (ME.name || ME.u).charAt(0).toUpperCase();
    renderNav(); route(); refreshLeadCount();
  }
  async function refreshLeadCount() {
    if (!can("leads.view")) return;
    try { var d = await api("leads"); var n = d.leads.filter(function (l) { return l.status === "new"; }).length; var b = $("#lead-count"); if (b) { b.textContent = n; b.hidden = !n; } } catch (e) {}
  }

  /* ======================================================================
     DASHBOARD
     ====================================================================== */
  function lineChart(dates, series) {
    var W = 640, H = 190, pad = 26, n = dates.length, max = Math.max(4, Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.values); }, [])));
    var x = function (i) { return pad + (W - pad - 8) * (n < 2 ? 0 : i / (n - 1)); }, y = function (v) { return H - 22 - (H - 40) * v / max; };
    var grid = [0, 0.5, 1].map(function (f) { var v = Math.round(max * f); return '<line x1="' + pad + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="currentColor" opacity=".08"/><text x="0" y="' + (y(v) + 3) + '">' + v + "</text>"; }).join("");
    var lines = series.map(function (s) {
      var pts = s.values.map(function (v, i) { return x(i) + "," + y(v); }).join(" ");
      return (s.fill ? '<polygon points="' + x(0) + "," + y(0) + " " + pts + " " + x(n - 1) + "," + y(0) + '" fill="' + s.color + '" opacity=".1"/>' : "") + '<polyline points="' + pts + '" fill="none" stroke="' + s.color + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
    }).join("");
    var labels = [0, Math.floor((n - 1) / 2), n - 1].map(function (i) { return '<text x="' + x(i) + '" y="' + (H - 4) + '" text-anchor="middle">' + dates[i].slice(5).replace("-", "/") + "</text>"; }).join("");
    return '<svg class="ad-chart" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" role="img" aria-label="Chart">' + grid + lines + labels + "</svg>";
  }
  function barChart(dates, values, color) {
    var W = 640, H = 130, n = values.length, max = Math.max(3, Math.max.apply(null, values)), bw = W / n, total = values.reduce(function (a, b) { return a + b; }, 0);
    return '<svg class="ad-chart" style="height:130px" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" role="img" aria-label="Enquiries per day">' +
      '<line x1="0" x2="' + W + '" y1="' + (H - 1) + '" y2="' + (H - 1) + '" stroke="currentColor" opacity=".12"/>' +
      values.map(function (v, i) { var h = (H - 8) * v / max; return '<rect x="' + (i * bw + 1) + '" y="' + (H - 1 - h) + '" width="' + Math.max(1, bw - 3) + '" height="' + h + '" rx="2" fill="' + color + '"><title>' + dates[i] + ": " + v + "</title></rect>"; }).join("") +
      '</svg><div class="ad-chart-foot"><span>' + dates[0].slice(5).replace("-", "/") + "</span><span>" + total + " in total · busiest day " + max + "</span><span>" + dates[n - 1].slice(5).replace("-", "/") + "</span></div>";
  }
  function bars(list, unit) {
    if (!list || !list.length) return '<p class="ad-empty">No data yet.</p>';
    var max = list[0][1] || 1;
    return '<div class="ad-bars">' + list.map(function (r) { return '<div class="ad-bar"><span>' + esc(r[0]) + "</span><b>" + r[1] + (unit || "") + '</b><em><i style="width:' + Math.max(2, 100 * r[1] / max) + '%"></i></em></div>'; }).join("") + "</div>";
  }
  var STATUS = { new: "New", contacted: "Contacted", payment: "Payment pending", won: "Delivered / won", lost: "Not interested" };
  async function pageDashboard(v) {
    title("Dashboard");
    var days = +(sessionStorage.getItem("dash_days") || 30), d = await api("dashboard?days=" + days);
    var k = function (cls, ico, val, lbl) { return '<div class="ad-kpi ' + cls + '"><i class="' + ico + '"></i><b>' + val + "</b><span>" + lbl + "</span></div>"; };
    var html = '<div class="ad-toolbar"><div class="ad-tabs" style="margin:0">' + [7, 30, 90].map(function (n) { return '<button class="ad-tab' + (n === days ? " on" : "") + '" data-days="' + n + '">Last ' + n + " days</button>"; }).join("") + "</div></div>";
    html += '<div class="ad-grid k" style="margin-bottom:16px">' + k("blue", "fa-solid fa-eye", d.totals.views.toLocaleString(), "Page views") + k("", "fa-solid fa-user", d.totals.visitors.toLocaleString(), "Visitors (daily unique)");
    if (d.newLeads !== undefined) html += k("green", "fa-solid fa-inbox", d.newLeads, "New enquiries") + k(d.followDue.length ? "warn" : "", "fa-solid fa-bell", d.followDue.length, "Follow-ups due");
    if (d.orders && !d.orders.error) html += k("warn", "fa-solid fa-hourglass-half", d.orders.pending, "Orders waiting") + k("green", "fa-solid fa-sack-dollar", rs(d.orders.revenue), "Completed sales");
    html += "</div>";
    html += '<div class="ad-card"><h3>Visitors <small>' + days + ' days</small></h3><div class="ad-legend"><span><i style="background:#0284c7"></i>Page views</span><span><i style="background:#16a34a"></i>Visitors</span></div>' +
      lineChart(d.dates, [{ values: d.views, color: "#0284c7", fill: true }, { values: d.visitors, color: "#16a34a" }]) + "</div>";
    html += '<div class="ad-grid two">';
    if (d.leadsPerDay) html += '<div class="ad-card"><h3>Enquiries per day</h3>' + barChart(d.dates, d.leadsPerDay, "#16a34a") + "</div>" +
      '<div class="ad-card"><h3>Enquiry pipeline</h3>' + bars(d.pipeline.map(function (p) { return [STATUS[p[0]], p[1]]; })) + "</div>";
    if (d.followDue) html += '<div class="ad-card"><h3><i class="fa-solid fa-bell" style="color:var(--warn)"></i> Follow-ups due</h3>' + (d.followDue.length ? d.followDue.map(function (f) {
      return '<a class="ad-lead due" href="#leads/' + esc(f.id) + '" style="text-decoration:none;grid-template-columns:1fr auto"><div><b>' + esc(f.name || f.phone || "Enquiry") + "</b><p>" + esc(f.phone || "") + '</p></div><span class="ad-pill ' + (f.overdue ? "red" : "warn") + '">' + (f.overdue ? "Overdue · " : "Today · ") + esc(f.followUp) + "</span></a>";
    }).join("") : '<p class="ad-empty">Nothing due. 🎉</p>') + "</div>";
    html += '<div class="ad-card"><h3>Top pages</h3>' + bars(d.topPages) + "</div>";
    html += '<div class="ad-card"><h3>Devices</h3>' + bars(d.devices) + "</div>";
    html += '<div class="ad-card"><h3>Where visitors came from</h3>' + bars(d.referrers) + '<p class="ad-hint">Visits that came from other websites (Google, Facebook, YouTube…). Typing the address or using bookmarks is not counted here.</p></div>';
    html += '<div class="ad-card"><h3>Quick links</h3><div class="ad-row">' +
      (can("leads.view") ? '<a class="ad-btn" href="#leads"><i class="fa-solid fa-inbox"></i> Enquiries</a>' : "") + (can("orders.view") ? '<a class="ad-btn" href="#orders"><i class="fa-solid fa-bag-shopping"></i> Orders</a>' : "") +
      (can("content.view") ? '<a class="ad-btn" href="#content/tools"><i class="fa-solid fa-tags"></i> Prices</a><a class="ad-btn" href="#content/announcement"><i class="fa-solid fa-bullhorn"></i> Announcement</a><a class="ad-btn" href="#content/blog"><i class="fa-solid fa-pen"></i> New blog post</a>' : "") +
      '<a class="ad-btn" href="/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Website</a></div></div>';
    html += "</div>";
    if (d.orders && d.orders.error) html = '<div class="ad-callout warn"><i class="fa-solid fa-plug-circle-exclamation"></i><div>Orders could not be loaded from the store database.</div></div>' + html;
    v.innerHTML = html;
    $$("[data-days]", v).forEach(function (b) { b.onclick = function () { sessionStorage.setItem("dash_days", b.getAttribute("data-days")); route(); }; });
  }

  /* ======================================================================
     ENQUIRIES (LEADS)
     ====================================================================== */
  var LEADS = [], LTYPES = {}, LF = { status: "all", type: "", q: "", from: "", to: "", due: false };
  var TYPE_ICON = { contact: "fa-solid fa-envelope", "tool-request": "fa-solid fa-magnifying-glass-plus", service: "fa-solid fa-briefcase", "api-credits": "fa-solid fa-plug", order: "fa-solid fa-bag-shopping", other: "fa-solid fa-message" };
  function leadMatch(l) {
    if (LF.status !== "all" && l.status !== LF.status) return false;
    if (LF.type && l.type !== LF.type) return false;
    if (LF.from && l.ts < Date.parse(LF.from)) return false;
    if (LF.to && l.ts >= Date.parse(LF.to) + 86400000) return false;
    if (LF.due && !(l.followUp && l.followUp <= today() && ["won", "lost"].indexOf(l.status) < 0)) return false;
    if (LF.q) { var hay = [l.name, l.phone, l.email, l.message, l.page, JSON.stringify(l.fields), (l.notes || []).map(function (n) { return n.text; }).join(" ")].join(" ").toLowerCase(); if (hay.indexOf(LF.q.toLowerCase()) < 0) return false; }
    return true;
  }
  async function pageLeads(v, openId) {
    title("Enquiries");
    var d = await api("leads"); LEADS = d.leads; LTYPES = d.types;
    var counts = { all: LEADS.length }; Object.keys(STATUS).forEach(function (s) { counts[s] = LEADS.filter(function (l) { return l.status === s; }).length; });
    v.innerHTML = '<div class="ad-callout"><i class="fa-solid fa-circle-info"></i><div>Every message sent through the website forms lands here (they still open WhatsApp for the customer). Store orders are under <a href="#orders">Orders</a>.</div></div>' +
      '<div class="ad-tabs" id="lt-tabs">' + ["all"].concat(Object.keys(STATUS)).map(function (s) { return '<button class="ad-tab' + (LF.status === s ? " on" : "") + '" data-st="' + s + '">' + (s === "all" ? "All" : STATUS[s]) + "<b>" + counts[s] + "</b></button>"; }).join("") + "</div>" +
      '<div class="ad-toolbar"><input class="ad-search" id="lt-q" placeholder="Search name, phone, message…" value="' + esc(LF.q) + '">' +
      '<select id="lt-type"><option value="">All types</option>' + Object.keys(LTYPES).map(function (k) { return '<option value="' + k + '"' + (LF.type === k ? " selected" : "") + ">" + esc(LTYPES[k]) + "</option>"; }).join("") + "</select>" +
      '<input type="date" id="lt-from" value="' + LF.from + '" title="From"><input type="date" id="lt-to" value="' + LF.to + '" title="To">' +
      '<label class="ad-toggle" style="font-weight:500"><input type="checkbox" id="lt-due"' + (LF.due ? " checked" : "") + "> Follow-ups due</label>" +
      (can("leads.export") ? '<a class="ad-btn" id="lt-export" href="#"><i class="fa-solid fa-file-excel"></i> Download Excel (CSV)</a>' : "") + "</div><div id=\"lt-list\"></div>";
    function draw() {
      var list = LEADS.filter(leadMatch), td = today();
      $("#lt-list").innerHTML = list.length ? list.map(function (l) {
        var due = l.followUp && l.followUp <= td && ["won", "lost"].indexOf(l.status) < 0;
        return '<div class="ad-lead' + (due ? " due" : "") + '" data-lead="' + esc(l.id) + '"><span class="ico"><i class="' + (TYPE_ICON[l.type] || TYPE_ICON.other) + '"></i></span><div><b>' + esc(l.name || l.phone || l.email || "No name") + '</b> <span class="ad-pill st-' + l.status + '">' + esc(STATUS[l.status] || l.status) + "</span>" +
          (l.assigned ? ' <span class="ad-pill"><i class="fa-solid fa-user"></i> ' + esc(staffName(l.assigned)) + "</span>" : "") + "<p>" + esc(l.message || Object.values(l.fields || {}).join(" · ") || LTYPES[l.type]) + '</p></div><div class="when">' + esc(ago(l.ts)) + "<br><small>" + esc(LTYPES[l.type] || "") + "</small>" + (due ? '<br><span class="ad-pill warn">Follow up</span>' : "") + "</div></div>";
      }).join("") : '<div class="ad-card ad-empty">No enquiries match.</div>';
      var ex = $("#lt-export"); if (ex) ex.href = "/api/admin/leads/export?" + new URLSearchParams({ from: LF.from, to: LF.to, type: LF.type, status: LF.status === "all" ? "" : LF.status }).toString();
    }
    draw();
    $$("#lt-tabs [data-st]").forEach(function (b) { b.onclick = function () { LF.status = b.getAttribute("data-st"); $$("#lt-tabs .ad-tab").forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); }; });
    $("#lt-q").oninput = function (e) { LF.q = e.target.value; draw(); };
    $("#lt-type").onchange = function (e) { LF.type = e.target.value; draw(); };
    $("#lt-from").onchange = function (e) { LF.from = e.target.value; draw(); };
    $("#lt-to").onchange = function (e) { LF.to = e.target.value; draw(); };
    $("#lt-due").onchange = function (e) { LF.due = e.target.checked; draw(); };
    $("#lt-list").onclick = function (e) { var r = e.target.closest("[data-lead]"); if (r) location.hash = "#leads/" + r.getAttribute("data-lead"); };
    if (openId) openLead(openId);
  }
  function staffName(u) { var s = STAFF.filter(function (x) { return x.u === u; })[0]; return s ? s.name : u; }
  var drawer = null;
  function closeDrawer() { if (drawer) { drawer.d.remove(); drawer.s.remove(); drawer = null; } }
  function openDrawer(html) {
    closeDrawer();
    var s = document.createElement("div"); s.className = "ad-drawer-scrim"; var d = document.createElement("aside"); d.className = "ad-drawer"; d.innerHTML = html;
    document.body.appendChild(s); document.body.appendChild(d); requestAnimationFrame(function () { d.classList.add("open"); });
    var close = function () { closeDrawer(); if (/^#leads\//.test(location.hash)) { history.replaceState(null, "", "#leads"); route(); } };
    s.onclick = close; d.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
    drawer = { d: d, s: s }; return d;
  }
  function openLead(id) {
    var l = LEADS.filter(function (x) { return x.id === id; })[0]; if (!l) { toast("Enquiry not found", "err"); return; }
    var ph = digits(l.phone), edit = can("leads.edit");
    var greet = "Assalam-o-Alaikum " + (l.name || "") + "! This is MALIK DATA CENTRE about your message on our website.";
    var fields = Object.keys(l.fields || {}).map(function (k) { return "<dt>" + esc(k) + "</dt><dd>" + esc(l.fields[k]) + "</dd>"; }).join("");
    var d = openDrawer('<div class="ad-row between"><span class="ad-pill">' + esc(LTYPES[l.type] || l.type) + '</span><button class="ad-icon-btn" data-close aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div>' +
      '<h3 style="margin-top:10px">' + esc(l.name || l.phone || "Enquiry") + '</h3><p class="ad-muted">' + esc(dt(l.ts)) + " · " + esc(l.page || "") + "</p>" +
      '<div class="ad-contact-btns">' + (ph ? '<a class="ad-btn wa" target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(greet) + '"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a><a class="ad-btn" href="tel:+' + ph + '"><i class="fa-solid fa-phone"></i> Call</a>' : '<span></span><span></span>') +
      (l.email ? '<a class="ad-btn" href="mailto:' + esc(l.email) + '"><i class="fa-solid fa-envelope"></i> Email</a>' : "<span></span>") + "</div>" +
      '<dl class="ad-kv"><dt>Phone / WhatsApp</dt><dd>' + esc(l.phone || "—") + "</dd><dt>Email</dt><dd>" + esc(l.email || "—") + "</dd><dt>Message</dt><dd>" + esc(l.message || "—") + "</dd>" + fields + "</dl>" +
      '<div class="ad-fields"><div class="ad-field half"><label>Status</label><select id="ld-status"' + (edit ? "" : " disabled") + ">" + Object.keys(STATUS).map(function (s) { return '<option value="' + s + '"' + (l.status === s ? " selected" : "") + ">" + STATUS[s] + "</option>"; }).join("") + "</select></div>" +
      '<div class="ad-field half"><label>Follow up on</label><input type="date" id="ld-follow" value="' + esc(l.followUp || "") + '"' + (edit ? "" : " disabled") + "></div>" +
      '<div class="ad-field"><label>Assigned to</label><select id="ld-assign"' + (edit ? "" : " disabled") + '><option value="">Nobody</option>' + STAFF.map(function (s) { return '<option value="' + esc(s.u) + '"' + (l.assigned === s.u ? " selected" : "") + ">" + esc(s.name) + "</option>"; }).join("") + "</select></div></div>" +
      '<h4 style="margin:18px 0 6px">Notes</h4><div class="ad-notes">' + ((l.notes || []).map(function (n) { return '<div class="ad-note"><small>' + esc(staffName(n.u)) + " · " + esc(dt(n.t)) + "</small>" + esc(n.text) + "</div>"; }).join("") || '<p class="ad-hint">No notes yet.</p>') + "</div>" +
      (edit ? '<div class="ad-row" style="margin-top:8px"><input id="ld-note" class="ad-grow" placeholder="Add a private note…"><button class="ad-btn" id="ld-note-btn">Add</button></div>' : "") +
      ((l.history || []).length ? '<ul class="ad-history">' + l.history.slice().reverse().map(function (h) { return "<li>" + esc(dt(h.t)) + " · " + esc(staffName(h.u)) + ": " + esc(h.c) + "</li>"; }).join("") + "</ul>" : "") +
      (can("leads.delete") ? '<div class="ad-row" style="margin-top:20px"><button class="ad-btn ghost" id="ld-del" style="color:var(--red)"><i class="fa-regular fa-trash-can"></i> Delete enquiry</button></div>' : ""));
    async function patch(body, msg) {
      try { var r = await api("leads/" + id, { method: "PATCH", body: body }); var i = LEADS.indexOf(l); LEADS[i] = r.lead; l = r.lead; toast(msg || "Saved"); refreshLeadCount(); return r.lead; } catch (e) { toast(e.message, "err"); }
    }
    if (edit) {
      $("#ld-status", d).onchange = function (e) { patch({ status: e.target.value }, "Status: " + STATUS[e.target.value]); };
      $("#ld-follow", d).onchange = function (e) { patch({ followUp: e.target.value }, e.target.value ? "Follow-up set" : "Follow-up cleared"); };
      $("#ld-assign", d).onchange = function (e) { patch({ assigned: e.target.value }, "Assigned"); };
      $("#ld-note-btn", d).onclick = async function () { var t = $("#ld-note", d).value.trim(); if (!t) return; if (await patch({ note: t }, "Note added")) openLead(id); };
    }
    var del = $("#ld-del", d); if (del) del.onclick = async function () {
      if (!(await confirmBox("Delete this enquiry?", "This can't be undone.", "Delete"))) return;
      try { await api("leads/" + id, { method: "DELETE" }); toast("Enquiry deleted"); closeDrawer(); location.hash = "#leads"; route(); } catch (e) { toast(e.message, "err"); }
    };
  }

  /* ======================================================================
     ORDERS (store database)
     ====================================================================== */
  var OSTATUS = { pending: ["Waiting for payment", "warn"], paid: ["Paid", "blue"], completed: ["Completed", "green"], rejected: ["Rejected", "red"] };
  function itemsSummary(items) {
    try { if (typeof items === "string") items = JSON.parse(items); } catch (e) { return String(items || ""); }
    if (!Array.isArray(items)) return "";
    return items.map(function (i) { return (i.qty > 1 ? i.qty + "× " : "") + (i.name || i.id || "Item") + (i.duration ? " (" + i.duration + ")" : ""); }).join(", ");
  }
  async function pageOrders(v, tab) {
    title("Orders");
    if (!SERVICES.supabase) { v.innerHTML = '<div class="ad-callout warn"><i class="fa-solid fa-plug"></i><div><b>Orders are not connected yet.</b><br>Add <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel → Settings → Environment Variables, then redeploy. Steps are in ADMIN-SETUP.md.</div></div>'; return; }
    tab = tab || "orders";
    var head = '<div class="ad-tabs"><a class="ad-tab' + (tab === "orders" ? " on" : "") + '" href="#orders">Orders</a><a class="ad-tab' + (tab === "customers" ? " on" : "") + '" href="#orders/customers">Customers</a>' + (can("tools.edit") ? '<a class="ad-tab' + (tab === "prices" ? " on" : "") + '" href="#orders/prices">Database prices</a>' : "") + "</div>";
    if (tab === "prices") return ordersPrices(v, head);
    var d = await api("orders"), orders = d.orders || [];
    if (tab === "customers") {
      var c = {}; orders.forEach(function (o) { var k = digits(o.customer_phone) || o.customer_name; if (!k) return; c[k] = c[k] || { name: o.customer_name, phone: o.customer_phone, n: 0, spent: 0, last: 0 }; c[k].n++; if (o.status === "completed") c[k].spent += Number(o.total) || 0; c[k].last = Math.max(c[k].last, Date.parse(o.created_at)); });
      var list = Object.values(c).sort(function (a, b) { return b.spent - a.spent || b.n - a.n; });
      v.innerHTML = head + '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>Customer</th><th>Orders</th><th>Spent (completed)</th><th>Last order</th><th></th></tr></thead><tbody>' +
        (list.map(function (x) { var ph = digits(x.phone); return "<tr><td><b>" + esc(x.name || "—") + "</b><br><small>" + esc(x.phone || "") + "</small></td><td>" + x.n + "</td><td>" + rs(x.spent) + "</td><td>" + esc(ago(x.last)) + "</td><td>" + (ph ? '<a class="ad-btn sm wa" target="_blank" rel="noopener" href="https://wa.me/' + ph + '"><i class="fa-brands fa-whatsapp"></i></a>' : "") + "</td></tr>"; }).join("") || '<tr><td colspan="5" class="ad-empty">No customers yet.</td></tr>') + "</tbody></table></div>";
      return;
    }
    var f = { st: sessionStorage.getItem("ord_st") || "pending", q: "" };
    v.innerHTML = head + '<div class="ad-tabs" id="os-tabs">' + ["pending", "paid", "completed", "rejected", "all"].map(function (s) { var n = s === "all" ? orders.length : orders.filter(function (o) { return o.status === s; }).length; return '<button class="ad-tab' + (f.st === s ? " on" : "") + '" data-os="' + s + '">' + (s === "all" ? "All" : OSTATUS[s][0]) + "<b>" + n + "</b></button>"; }).join("") + "</div>" +
      '<div class="ad-toolbar"><input class="ad-search" id="os-q" placeholder="Search order number, name, phone, tool…"><button class="ad-btn" id="os-refresh"><i class="fa-solid fa-rotate"></i> Refresh</button></div><div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody id="os-body"></tbody></table></div>';
    function draw() {
      var q = f.q.toLowerCase(), list = orders.filter(function (o) { return (f.st === "all" || o.status === f.st) && (!q || [o.order_no, o.customer_name, o.customer_phone, itemsSummary(o.items), o.coupon, o.city].join(" ").toLowerCase().indexOf(q) >= 0); });
      $("#os-body").innerHTML = list.map(function (o) {
        var ph = digits(o.customer_phone), st = OSTATUS[o.status] || [o.status, ""];
        var msg = "Assalam-o-Alaikum! 🎉 Your MALIK DATA CENTRE order #" + o.order_no + " is confirmed and activated. Details: " + itemsSummary(o.items) + ". Thank you!";
        var acts = can("orders.edit") ? (o.status === "pending" ? '<button class="ad-btn sm" data-oa="paid" data-oid="' + esc(o.id) + '">Paid</button>' : "") + (o.status !== "completed" ? '<button class="ad-btn sm green" data-oa="completed" data-oid="' + esc(o.id) + '"><i class="fa-solid fa-check"></i> Complete</button>' : "") + (o.status === "pending" || o.status === "paid" ? '<button class="ad-btn sm" data-oa="rejected" data-oid="' + esc(o.id) + '" style="color:var(--red)">Reject</button>' : "") : "";
        return "<tr><td><b>#" + esc(o.order_no) + "</b><br><small>" + esc(dt(Date.parse(o.created_at))) + "</small></td><td>" + esc(o.customer_name || "—") + "<br><small>" + esc(o.customer_phone || "") + (o.city ? " · " + esc(o.city) : "") + "</small></td><td style=\"max-width:260px\">" + esc(itemsSummary(o.items)) + (o.coupon ? ' <span class="ad-pill warn">' + esc(o.coupon) + "</span>" : "") + (o.referral ? ' <span class="ad-pill">ref: ' + esc(o.referral) + "</span>" : "") + "</td><td><b>" + rs(o.total) + '</b></td><td><span class="ad-pill ' + st[1] + '">' + esc(st[0]) + '</span></td><td><div class="ad-row" style="gap:6px">' + acts + (ph ? '<a class="ad-btn sm wa" target="_blank" rel="noopener" title="Send confirmation on WhatsApp" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msg) + '"><i class="fa-brands fa-whatsapp"></i></a>' : "") + "</div></td></tr>";
      }).join("") || '<tr><td colspan="6" class="ad-empty">No orders here.</td></tr>';
    }
    draw();
    $$("#os-tabs [data-os]").forEach(function (b) { b.onclick = function () { f.st = b.getAttribute("data-os"); sessionStorage.setItem("ord_st", f.st); $$("#os-tabs .ad-tab").forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); }; });
    $("#os-q").oninput = function (e) { f.q = e.target.value; draw(); };
    $("#os-refresh").onclick = function () { route(); };
    $("#os-body").onclick = async function (e) {
      var b = e.target.closest("[data-oa]"); if (!b) return;
      var st = b.getAttribute("data-oa"), id = b.getAttribute("data-oid");
      if (st === "rejected" && !(await confirmBox("Reject this order?", "The customer is not told automatically. Message them on WhatsApp.", "Reject"))) return;
      await run(b, "", async function () { var r = await api("orders/" + id, { method: "PATCH", body: { status: st } }); orders.forEach(function (o, i) { if (o.id === id && r.order) orders[i] = r.order; }); toast("Order marked " + OSTATUS[st][0].toLowerCase()); draw(); });
    };
  }
  async function ordersPrices(v, head) {
    var d = await api("products"), list = d.products || [];
    v.innerHTML = head + '<div class="ad-callout"><i class="fa-solid fa-circle-info"></i><div>These are the prices saved in the store database (used for order records). The prices customers <b>see</b> on the website are edited in <a href="#content/tools">Tools &amp; prices</a>.</div></div>' +
      '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>Product</th><th>Price (Rs)</th><th></th></tr></thead><tbody>' + (list.map(function (p) { return "<tr><td><b>" + esc(p.name || p.id) + "</b><br><small>" + esc(p.id) + '</small></td><td><input type="number" min="0" value="' + esc(p.price) + '" data-pp="' + esc(p.id) + '" style="max-width:140px"></td><td><button class="ad-btn sm" data-ps="' + esc(p.id) + '">Save</button></td></tr>'; }).join("") || '<tr><td colspan="3" class="ad-empty">No products in the database.</td></tr>') + "</tbody></table></div>";
    v.onclick = async function (e) { var b = e.target.closest("[data-ps]"); if (!b) return; var id = b.getAttribute("data-ps"), inp = $('[data-pp="' + CSS.escape(id) + '"]', v); await run(b, "", async function () { await api("products/" + encodeURIComponent(id), { method: "PATCH", body: { price: +inp.value } }); toast("Price saved"); }); };
  }

  /* ======================================================================
     CONTENT
     ====================================================================== */
  var CONTENT = null;
  async function loadContent(force) { if (!CONTENT || force) CONTENT = await api("content"); return CONTENT; }
  function seedOf(key) { return clone((CONTENT.seed || {})[key]) || {}; }
  function listField(key) { return (SCHEMA[key].fields || []).filter(function (f) { return f.type === "list" && f.diffBy; })[0]; }
  // saved value (may be a diff) + original → full working copy
  function fullValue(key, saved) {
    var seed = seedOf(key), lf = listField(key);
    if (saved == null) return seed;
    if (!lf) return Object.assign({}, seed, clone(saved));
    var out = Object.assign({}, seed, clone(saved)), by = lf.diffBy, map = {};
    (saved[lf.k] || []).forEach(function (it) { if (it && it[by] != null) map[it[by]] = it; });
    var items = (seed[lf.k] || []).map(function (s) { return map[s[by]] ? Object.assign({}, s, map[s[by]]) : s; });
    (saved[lf.k] || []).forEach(function (it) { if (it && (it.isNew || !(seed[lf.k] || []).some(function (s) { return s[by] === it[by]; }))) items.push(Object.assign({}, it)); });
    out[lf.k] = items;
    return out;
  }
  // full working copy → what we store (lists with diffBy keep only changed items/fields)
  function storedValue(key, full) {
    var lf = listField(key); if (!lf) return full;
    var seed = seedOf(key), by = lf.diffBy, smap = {}; (seed[lf.k] || []).forEach(function (s) { smap[s[by]] = s; });
    var out = Object.assign({}, full);
    out[lf.k] = (full[lf.k] || []).map(function (it) {
      var s = smap[it[by]]; if (!s || it.isNew) return it;
      var diff = {}; diff[by] = it[by]; var changed = false;
      Object.keys(it).forEach(function (k) { if (k !== by && !same(it[k], s[k]) && !(it[k] === "" && s[k] === undefined)) { diff[k] = it[k]; changed = true; } });
      return changed ? diff : null;
    }).filter(Boolean);
    return out;
  }
  function sectionState(key) {
    var c = CONTENT, d = c.draft[key], p = c.pub[key], m = c.meta[key] || {};
    if (d == null && p == null) return { label: "Original website content", cls: "", live: false };
    if (p != null && same(d, p)) return { label: "Live · published " + (m.pubAt ? ago(m.pubAt) + " by " + staffName(m.pubBy) : ""), cls: "green", live: true };
    if (p == null) return { label: "Draft saved " + (m.draftAt ? ago(m.draftAt) : "") + " · not on the website yet", cls: "warn", live: false, draft: true };
    return { label: "Draft has changes that are not live yet", cls: "warn", live: true, draft: true };
  }
  async function pageGroup(v, group, heading, intro, only) {
    title(heading); await loadContent(true);
    var keys = Object.keys(SCHEMA).filter(function (k) { return only ? only.indexOf(k) >= 0 : SCHEMA[k].group === group; });
    v.innerHTML = '<p class="ad-muted" style="margin-bottom:14px">' + esc(intro) + '</p><div class="ad-sections">' + keys.map(function (k) {
      var s = SCHEMA[k], st = sectionState(k), hid = (CONTENT.pub[k] || {})._hidden;
      return '<a class="ad-sec-card" href="#content/' + k + '" style="text-decoration:none"><i class="' + s.icon + '"></i><div><b>' + esc(s.label) + "</b>" + (hid ? '<span class="ad-pill red">Hidden</span> ' : "") + '<span class="ad-pill ' + st.cls + '">' + (st.draft ? "Draft" : st.live ? "Edited · live" : "Original") + "</span></div></a>";
    }).join("") + "</div>";
  }

  /* ---------- form building ---------- */
  function fieldOptions(f) {
    if (f.optionsFrom === "categories") return ((CONTENT.seed.tools || {}).categories || []).map(function (c) { return [c.id, c.label]; });
    return f.options || [];
  }
  function slugify(s) { return String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70); }
  // builds inputs for `fields` editing `obj` in place; onChange() after every edit
  function buildFields(box, fields, obj, onChange, ctx) {
    ctx = ctx || {};
    var wrap = document.createElement("div"); wrap.className = "ad-fields";
    fields.forEach(function (f) {
      if (f.type === "list") { wrap.appendChild(buildList(f, obj, onChange, ctx)); return; }
      var cell = document.createElement("div"); cell.className = "ad-field" + (f.half ? " half" : ""); cell.setAttribute("data-k", f.k);
      var id = "f" + Math.random().toString(36).slice(2, 9), val = obj[f.k];
      var ro = ctx.readonly || f.readonly || (f.readonlyExisting && !obj.isNew);
      var lab = f.type === "toggle" ? "" : '<label for="' + id + '">' + esc(f.label) + (f.counter ? '<span class="ad-counter" data-ctr></span>' : "") + "</label>";
      var input = "";
      switch (f.type) {
        case "textarea": case "rich": input = '<textarea id="' + id + '" rows="' + (f.rows || 3) + '"' + (f.big ? ' style="min-height:300px;font-family:ui-monospace,Menlo,monospace;font-size:.86rem"' : "") + ">" + esc(val) + "</textarea>"; break;
        case "toggle": input = '<label class="ad-toggle"><input type="checkbox" id="' + id + '"' + (val ? " checked" : "") + "> " + esc(f.label) + "</label>"; break;
        case "select": input = '<select id="' + id + '">' + fieldOptions(f).map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(val == null ? "" : val) === String(o[0]) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>"; break;
        case "color": input = '<div class="ad-row"><input type="color" id="' + id + '" value="' + esc(/^#[0-9a-f]{6}$/i.test(val || "") ? val : "#111827") + '"><input data-hex value="' + esc(val || "") + '" style="max-width:120px" placeholder="#111827"></div>'; break;
        case "date": input = '<input type="date" id="' + id + '" value="' + esc(val || "") + '">'; break;
        case "number": input = '<input type="number" inputmode="numeric" id="' + id + '" value="' + esc(val == null ? "" : val) + '"' + (f.min != null ? ' min="' + f.min + '"' : "") + (f.max != null ? ' max="' + f.max + '"' : "") + ">"; break;
        case "image": input = '<div class="ad-img"><span class="ad-img-prev" data-prev></span><input id="' + id + '" value="' + esc(val || "") + '" placeholder="Picture address (https://…)">' + (ro ? "" : '<button type="button" class="ad-btn sm" data-up><i class="fa-solid fa-upload"></i> Upload</button><button type="button" class="ad-btn sm ghost" data-lib title="Choose an uploaded picture"><i class="fa-regular fa-images"></i></button><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden data-file>') + "</div>"; break;
        case "icon": input = '<div class="ad-row" style="flex-wrap:nowrap"><span class="ad-icon-prev"><i data-iprev class="' + esc(val || "") + '"></i></span><input id="' + id + '" value="' + esc(val || "") + '" placeholder="fa-solid fa-bolt"></div>'; break;
        default: input = '<input id="' + id + '" value="' + esc(val == null ? "" : val) + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : "") + (f.type === "url" ? ' inputmode="url"' : "") + ">";
      }
      cell.innerHTML = lab + input + (f.type === "rich" ? '<p class="ad-hint">' + esc(f.hint || "Use **bold**, [link text](https://…) and lines starting with \"- \" for a list. An empty line starts a new paragraph.") + "</p>" : f.hint ? '<p class="ad-hint">' + esc(f.hint) + "</p>" : "");
      var el = cell.querySelector("#" + id);
      if (ro) { $$("input, textarea, select", cell).forEach(function (i) { if (i.type === "checkbox" || i.tagName === "SELECT" || i.type === "color" || i.type === "date") i.disabled = true; else i.readOnly = true; }); }
      var ctr = cell.querySelector("[data-ctr]");
      var paint = function () {
        if (ctr) { var n = String(obj[f.k] || "").length; ctr.textContent = n + " / " + f.counter; ctr.classList.toggle("over", n > f.counter); }
        if (f.type === "image") { var p = cell.querySelector("[data-prev]"), u = obj[f.k] || ""; p.style.backgroundImage = u && /^(https:\/\/|\/|assets\/)/.test(u) ? 'url("' + (u.indexOf("assets/") === 0 ? "/" + u : u).replace(/"/g, "%22") + '")' : ""; p.innerHTML = u ? "" : '<i class="fa-regular fa-image"></i>'; }
        if (f.type === "icon") cell.querySelector("[data-iprev]").className = obj[f.k] || "";
      };
      var set = function (v) {
        if (f.type === "number") v = v === "" ? "" : Number(v);
        if (f.upper) v = String(v).toUpperCase().replace(/\s+/g, "");
        obj[f.k] = v; paint(); onChange(f.k);
      };
      if (f.type === "toggle") el.onchange = function () { set(el.checked); };
      else if (f.type === "color") { var hex = cell.querySelector("[data-hex]"); el.oninput = function () { hex.value = el.value; set(el.value); }; hex.oninput = function () { if (/^#[0-9a-f]{6}$/i.test(hex.value)) el.value = hex.value; set(hex.value); }; }
      else el.addEventListener(f.type === "select" || f.type === "date" ? "change" : "input", function () { if (f.upper) { var p = el.selectionStart; el.value = el.value.toUpperCase().replace(/\s+/g, ""); try { el.setSelectionRange(p, p); } catch (e) {} } set(el.value); });
      if (f.type === "slug") {
        el.addEventListener("input", function () { el.value = slugify(el.value); obj[f.k] = el.value; obj._slugEdited = true; onChange(f.k); });
        ctx.slugs = ctx.slugs || []; ctx.slugs.push({ el: el, f: f });
      }
      if (f.type === "image" && !ro) {
        var file = cell.querySelector("[data-file]");
        cell.querySelector("[data-up]").onclick = function () { file.click(); };
        file.onchange = async function () { var fl = file.files[0]; file.value = ""; if (!fl) return; var b = cell.querySelector("[data-up]"); await run(b, "Uploading…", async function () { var url = await uploadImage(fl); el.value = url; set(url); toast("Picture uploaded"); }); };
        cell.querySelector("[data-lib]").onclick = function () { pickMedia(function (url) { el.value = url; set(url); }); };
      }
      paint();
      wrap.appendChild(cell);
    });
    box.appendChild(wrap);
    return wrap;
  }

  function itemTitle(f, it) {
    var t = it[f.titleKey] || "(no title)"; if (f.titleKey === "path" && t === "/") t = "Homepage";
    return esc(String(t).slice(0, 90)) + (f.subKey && it[f.subKey] ? "<small>" + esc(String(it[f.subKey]).slice(0, 60)) + "</small>" : "") + (it.isNew ? '<span class="ad-badge-new">new</span>' : "");
  }
  function buildList(f, obj, onChange, ctx) {
    if (!Array.isArray(obj[f.k])) obj[f.k] = [];
    var arr = obj[f.k], box = document.createElement("div"); box.className = "ad-list";
    var ro = ctx.readonly, seedMap = {};
    if (f.diffBy) (ctx.seedList || []).forEach(function (s) { seedMap[s[f.diffBy]] = s; });
    box.innerHTML = '<div class="ad-list-head"><label>' + esc(f.label) + ' <small class="ad-muted" data-n></small></label>' + (arr.length > 6 ? '<input type="search" placeholder="Search…" data-q>' : "") + '</div><div class="ad-items"></div>' +
      (ro || f.noAdd ? "" : '<button type="button" class="ad-btn ad-add" data-add><i class="fa-solid fa-plus"></i> ' + esc(f.addLabel || "Add") + "</button>");
    var list = box.querySelector(".ad-items"), q = "", openSet = {};
    function changedVsSeed(it) { if (!f.diffBy || it.isNew) return false; var s = seedMap[it[f.diffBy]]; return s && Object.keys(it).some(function (k) { return k !== "_open" && !same(it[k], s[k]) && !(it[k] === "" && s[k] === undefined); }); }
    function draw() {
      box.querySelector("[data-n]").textContent = "(" + arr.length + ")";
      list.innerHTML = "";
      arr.forEach(function (it, i) {
        if (q && JSON.stringify(it).toLowerCase().indexOf(q) < 0) return;
        var row = document.createElement("div"); row.className = "ad-item" + (it._hidden ? " hidden-item" : "") + (changedVsSeed(it) ? " changed" : ""); row.dataset.i = i;
        var compact = (f.compact || []).map(function (k) {
          var sub = f.item.filter(function (x) { return x.k === k; })[0]; if (!sub) return "";
          if (sub.type === "select") return '<select data-ck="' + k + '" title="' + esc(sub.label) + '"' + (ro ? " disabled" : "") + ">" + fieldOptions(sub).map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(it[k]) === String(o[0]) ? " selected" : "") + ">" + esc(String(o[1]).split(" (")[0]) + "</option>"; }).join("") + "</select>";
          return '<input type="number" data-ck="' + k + '" value="' + esc(it[k] == null ? "" : it[k]) + '" title="' + esc(sub.label) + '" placeholder="' + esc(sub.label) + '"' + (ro ? " readonly" : "") + ">";
        }).join("");
        row.innerHTML = '<div class="ad-item-head">' + (ro || q ? "" : '<span class="ad-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></span>') +
          '<span class="ad-item-title">' + itemTitle(f, it) + "</span>" + (compact ? '<span class="ad-item-compact">' + compact + "</span>" : "") +
          (ro ? "" : '<span class="ad-item-btns">' + (q ? "" : '<button type="button" class="ad-icon-btn" data-act="up" title="Move up"><i class="fa-solid fa-arrow-up"></i></button><button type="button" class="ad-icon-btn" data-act="down" title="Move down"><i class="fa-solid fa-arrow-down"></i></button>') +
            '<button type="button" class="ad-icon-btn" data-act="hide" title="' + (it._hidden ? "Show on the website" : "Hide from the website") + '"><i class="fa-regular ' + (it._hidden ? "fa-eye-slash" : "fa-eye") + '"></i></button>' +
            (f.noDelete && !it.isNew ? "" : '<button type="button" class="ad-icon-btn danger" data-act="del" title="Delete"><i class="fa-regular fa-trash-can"></i></button>') + "</span>") +
          '<i class="fa-solid fa-chevron-down" style="color:var(--tx3);font-size:.8rem"></i></div><div class="ad-item-body" hidden></div>';
        list.appendChild(row);
        if (openSet[i]) openItem(row, it);
      });
      if (!list.children.length) list.innerHTML = '<p class="ad-empty">' + (q ? "Nothing matches." : "No items yet.") + "</p>";
    }
    function openItem(row, it) {
      var body = row.querySelector(".ad-item-body"); body.hidden = false; openSet[+row.dataset.i] = true;
      if (body.dataset.built) return; body.dataset.built = "1";
      var c2 = { readonly: ro };
      buildFields(body, f.item, it, function (k) {
        if (k === f.titleKey || k === f.subKey) row.querySelector(".ad-item-title").innerHTML = itemTitle(f, it);
        // keep the blog web address in step with the title until it is edited by hand
        f.item.forEach(function (sf) { if (sf.type === "slug" && sf.from === k && !it._slugEdited && (it.isNewPost || !it[sf.k] || it[sf.k] === slugify(it._prevTitle || ""))) { it[sf.k] = slugify(it[k]); var inp = body.querySelector('[data-k="' + sf.k + '"] input'); if (inp) inp.value = it[sf.k]; } });
        if (k === f.titleKey) it._prevTitle = it[k];
        row.classList.toggle("changed", changedVsSeed(it));
        onChange();
      }, c2);
    }
    list.addEventListener("click", function (e) {
      var row = e.target.closest(".ad-item"); if (!row) return;
      var i = +row.dataset.i, it = arr[i], act = e.target.closest("[data-act]");
      if (e.target.closest("[data-ck]")) return;
      if (act) {
        var a = act.getAttribute("data-act");
        if (a === "up" && i > 0) { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); swapOpen(i, i - 1); }
        else if (a === "down" && i < arr.length - 1) { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); swapOpen(i, i + 1); }
        else if (a === "hide") { if (it._hidden) delete it._hidden; else it._hidden = true; }
        else if (a === "del") { confirmBox("Delete this item?", "It is removed when you save. Until you publish, the website doesn't change.", "Delete").then(function (ok) { if (ok) { arr.splice(i, 1); openSet = {}; draw(); onChange(); } }); return; }
        else return;
        draw(); onChange(); return;
      }
      if (e.target.closest(".ad-item-head")) { var body = row.querySelector(".ad-item-body"); if (!body.hidden) { body.hidden = true; delete openSet[i]; } else openItem(row, it); }
    });
    function swapOpen(a, b) { var x = openSet[a]; openSet[a] = openSet[b]; openSet[b] = x; }
    list.addEventListener("input", function (e) { var c = e.target.closest("[data-ck]"); if (!c) return; var it = arr[+c.closest(".ad-item").dataset.i], k = c.getAttribute("data-ck"); it[k] = c.tagName === "SELECT" ? c.value : (c.value === "" ? "" : Number(c.value)); c.closest(".ad-item").classList.toggle("changed", changedVsSeed(it)); onChange(); });
    // drag to reorder (mouse + touch via the handle)
    var dragI = null;
    list.addEventListener("pointerdown", function (e) { var h = e.target.closest(".ad-handle"); if (!h) return; var row = h.closest(".ad-item"); dragI = +row.dataset.i; row.classList.add("drag"); h.setPointerCapture(e.pointerId); e.preventDefault(); });
    list.addEventListener("pointermove", function (e) {
      if (dragI === null) return;
      var over = document.elementFromPoint(e.clientX, e.clientY), row = over && over.closest && over.closest(".ad-item");
      $$(".ad-item.over", list).forEach(function (x) { x.classList.remove("over"); }); if (row && +row.dataset.i !== dragI) row.classList.add("over");
    });
    list.addEventListener("pointerup", function (e) {
      if (dragI === null) return;
      var over = document.elementFromPoint(e.clientX, e.clientY), row = over && over.closest && over.closest(".ad-item"), to = row ? +row.dataset.i : dragI;
      if (to !== dragI) { arr.splice(to, 0, arr.splice(dragI, 1)[0]); openSet = {}; onChange(); }
      dragI = null; draw();
    });
    var add = box.querySelector("[data-add]");
    if (add) add.onclick = function () {
      var it = Object.assign({}, clone(f.newItem) || {});
      f.item.forEach(function (sf) { if (it[sf.k] === undefined) it[sf.k] = sf.type === "toggle" ? false : sf.type === "number" ? "" : sf.type === "select" ? (fieldOptions(sf)[0] || [""])[0] : ""; });
      if (f.diffBy === "id") { it.isNew = true; it.id = ""; }
      if (f.k === "posts") { it.date = today(); it.published = true; it.isNewPost = true; }
      arr.push(it); q = ""; var s = box.querySelector("[data-q]"); if (s) s.value = "";
      openSet = {}; openSet[arr.length - 1] = true; draw(); onChange();
      var last = list.lastElementChild; if (last && last.scrollIntoView) last.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    var qs = box.querySelector("[data-q]"); if (qs) qs.oninput = function () { q = qs.value.trim().toLowerCase(); draw(); };
    draw();
    return box;
  }

  /* ---------- uploads ---------- */
  function readAsDataURL(blob) { return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = rej; fr.readAsDataURL(blob); }); }
  async function uploadImage(file) {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error("Choose a JPG, PNG, WebP or GIF picture.");
    if (file.size > 25 * 1024 * 1024) throw new Error("That picture is too big (max 25 MB before compression).");
    var data;
    if (file.type === "image/gif") { if (file.size > 3 * 1024 * 1024) throw new Error("GIFs must be under 3 MB."); data = await readAsDataURL(file); }
    else {
      // resize to max 1600 px and compress in the browser before uploading
      var img = await new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { rej(new Error("This picture can't be opened.")); }; i.src = URL.createObjectURL(file); });
      var s = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), cv = document.createElement("canvas");
      cv.width = Math.round(img.naturalWidth * s); cv.height = Math.round(img.naturalHeight * s);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      var type = file.type === "image/png" ? "image/webp" : "image/jpeg", q = 0.85;
      var blob = await new Promise(function (r) { cv.toBlob(r, type, q); });
      if (!blob || blob.type !== type) { type = "image/jpeg"; blob = await new Promise(function (r) { cv.toBlob(r, type, q); }); }
      while (blob.size > 2.8 * 1024 * 1024 && q > 0.4) { q -= 0.1; blob = await new Promise(function (r) { cv.toBlob(r, type, q); }); }
      data = await readAsDataURL(blob);
    }
    var r = await api("upload", { method: "POST", body: { name: file.name, data: data } });
    return r.url;
  }
  async function pickMedia(cb) {
    var d = document.createElement("dialog"); d.className = "ad-dialog wide";
    d.innerHTML = '<h3>Uploaded pictures</h3><div class="ad-media"><p class="ad-loading">Loading…</p></div><div class="ad-row end" style="margin-top:12px"><button class="ad-btn" data-x>Close</button></div>';
    document.body.appendChild(d); d.showModal(); d.addEventListener("close", function () { d.remove(); });
    d.querySelector("[data-x]").onclick = function () { d.close(); };
    try {
      var m = await api("media"), box = d.querySelector(".ad-media");
      box.innerHTML = m.media.length ? m.media.map(function (x) { return '<button type="button" data-u="' + esc(x.url) + '" title="' + esc(x.name) + '"><img src="' + esc(x.url) + '" alt="" loading="lazy"></button>'; }).join("") : '<p class="ad-empty">No pictures uploaded yet.</p>';
      box.onclick = function (e) { var b = e.target.closest("[data-u]"); if (b) { cb(b.getAttribute("data-u")); d.close(); } };
    } catch (e) { toast(e.message, "err"); }
  }

  /* ---------- the section editor ---------- */
  async function pageEditor(v, key) {
    var S = SCHEMA[key]; title(S.label); await loadContent(true);
    var editPerm = { contact: "settings.manage", payments: "settings.manage", tools: "tools.edit", coupons: "coupons.edit", blog: "blog.edit", seo: "seo.edit" }[key] || "content.edit";
    var canEdit = can(editPerm), canPub = canEdit && (can("content.publish") || ["tools.edit", "coupons.edit", "blog.edit", "seo.edit", "settings.manage"].indexOf(editPerm) >= 0);
    var work = fullValue(key, CONTENT.draft[key] != null ? CONTENT.draft[key] : CONTENT.pub[key]);
    var lf = listField(key);
    v.innerHTML = '<div class="ad-ed-head"><h3><i class="' + S.icon + '"></i> ' + esc(S.label) + "</h3>" + (S.view ? '<a class="ad-btn sm" href="' + esc(S.view) + '" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> View on website</a>' : "") + "</div>" +
      (S.hint ? '<p class="ad-muted" style="margin-bottom:12px">' + esc(S.hint) + "</p>" : "") +
      (!canEdit ? '<div class="ad-callout warn"><i class="fa-solid fa-lock"></i><div>Your role can view this section but not change it.</div></div>' : "") +
      '<div class="ad-ed-bar"><span class="ad-status" id="ed-status"></span>' +
      (canEdit ? '<button class="ad-btn" id="ed-save"><i class="fa-regular fa-floppy-disk"></i> Save draft</button>' : "") +
      (canPub ? '<button class="ad-btn green" id="ed-pub"><i class="fa-solid fa-rocket"></i> Publish</button>' : "") +
      (canEdit ? '<button class="ad-icon-btn" id="ed-more" title="More"><i class="fa-solid fa-ellipsis"></i></button>' : "") + "</div>" +
      '<div class="ad-card" id="ed-more-box" hidden><div class="ad-row">' +
      '<button class="ad-btn sm" id="ed-discard"><i class="fa-solid fa-rotate-left"></i> Undo unpublished changes</button>' +
      (canPub ? '<button class="ad-btn sm" id="ed-restore" style="color:var(--red)"><i class="fa-solid fa-clock-rotate-left"></i> Restore original website content</button>' : "") +
      (S.canHide && canPub ? '<label class="ad-toggle" style="margin-left:auto"><input type="checkbox" id="ed-hide"' + (work._hidden ? " checked" : "") + "> Hide this whole section</label>" : "") + "</div></div>" +
      '<div class="ad-card" id="ed-form"></div>';
    function status() {
      var st = sectionState(key), el = $("#ed-status");
      el.innerHTML = (dirty ? '<span class="ad-pill warn">Unsaved changes</span> ' : "") + '<span class="ad-pill ' + st.cls + '">' + esc(st.label) + "</span>";
      var dis = $("#ed-discard"); if (dis) dis.disabled = !st.draft;
    }
    buildFields($("#ed-form"), S.fields, work, function () { dirty = true; status(); }, { readonly: !canEdit, seedList: lf ? (seedOf(key)[lf.k] || []) : [] });
    status();
    function validate() {
      if (key === "tools") {
        var ids = {};
        for (var i = 0; i < work.items.length; i++) {
          var t = work.items[i];
          if (t.isNew) { if (!t.name) throw new Error("A new tool needs a name."); if (!t.id) t.id = slugify(t.name + " " + (t.duration || "")); t.id = slugify(t.id); if (!(+t.price > 0)) throw new Error('Give "' + t.name + '" a price.'); }
          if (ids[t.id]) throw new Error('Two tools use the ID "' + t.id + '". Change one of them.'); ids[t.id] = 1;
          if (t.price !== "" && !(+t.price >= 0)) throw new Error('Check the price of "' + t.name + '".');
        }
      }
      if (key === "blog") {
        var slugs = {};
        work.posts.forEach(function (p) { if (!p.title) throw new Error("Every post needs a title."); p.slug = slugify(p.slug || p.title); if (slugs[p.slug]) throw new Error('Two posts use the address "' + p.slug + '".'); slugs[p.slug] = 1; if (p.published && !p.date) p.date = today(); });
      }
      if (key === "coupons") work.items.forEach(function (c) { if (!/^[A-Z0-9_-]{3,20}$/.test(c.code || "")) throw new Error("Coupon codes: 3–20 letters or numbers, no spaces (" + (c.code || "empty") + ")."); });
      if (key === "contact") ["orderWhatsapp", "supportWhatsapp"].forEach(function (k) { work[k] = String(work[k] || "").replace(/\D/g, ""); if (!/^\d{10,15}$/.test(work[k])) throw new Error("WhatsApp numbers need the country code, e.g. 923489057646."); });
    }
    function clean(o) { return JSON.parse(JSON.stringify(o, function (k, val) { return k === "_open" || k === "_slugEdited" || k === "_prevTitle" || k === "isNewPost" ? undefined : val; })); }
    async function save() {
      validate();
      var val = clean(storedValue(key, work));
      var r = await api("content/" + key, { method: "PUT", body: { value: val } });
      CONTENT.draft[key] = val; CONTENT.meta[key] = r.meta; dirty = false; status();
    }
    var sb = $("#ed-save"); if (sb) sb.onclick = function () { run(sb, "Saving…", async function () { await save(); toast("Draft saved. The website hasn't changed yet."); }); };
    var pb = $("#ed-pub"); if (pb) pb.onclick = function () {
      run(pb, "Publishing…", async function () {
        if (dirty || CONTENT.draft[key] == null) await save();
        var r = await api("content/" + key + "/publish", { method: "POST" });
        CONTENT.pub[key] = clone(CONTENT.draft[key]); CONTENT.meta[key] = r.meta; status();
        toast("Published! The website updates within about 30 seconds.");
      });
    };
    var mb = $("#ed-more"); if (mb) mb.onclick = function () { $("#ed-more-box").hidden = !$("#ed-more-box").hidden; };
    var db = $("#ed-discard"); if (db) db.onclick = async function () {
      if (!(await confirmBox("Undo unpublished changes?", "The editor goes back to what is live on the website now.", "Undo"))) return;
      run(db, "", async function () { await api("content/" + key + "/discard", { method: "POST" }); dirty = false; toast("Changes undone"); route(); });
    };
    var rb = $("#ed-restore"); if (rb) rb.onclick = async function () {
      if (!(await confirmBox("Restore the original content?", "All edits to \"" + S.label + "\" are removed and the website shows its original built-in content again.", "Restore original"))) return;
      run(rb, "", async function () { await api("content/" + key + "/restore", { method: "POST" }); dirty = false; toast("Original content restored"); route(); });
    };
    var hb = $("#ed-hide"); if (hb) hb.onchange = function () { if (hb.checked) work._hidden = true; else delete work._hidden; dirty = true; status(); toast(hb.checked ? "Section will be hidden when you publish" : "Section will show when you publish"); };
  }

  /* ======================================================================
     POSTLY PRO
     ====================================================================== */
  async function pagePro(v) {
    title("Postly Pro");
    if (!SERVICES.supabase) { v.innerHTML = '<div class="ad-callout warn"><i class="fa-solid fa-plug"></i><div>Add <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel to manage Postly Pro (see ADMIN-SETUP.md).</div></div>'; return; }
    var d = await api("pro");
    v.innerHTML = '<div class="ad-card"><h3><i class="fa-solid fa-crown" style="color:var(--gold)"></i> Switch on Pro</h3><p class="ad-muted" style="margin-bottom:10px">After the customer has paid on WhatsApp, enter their Postly account email.</p>' +
      '<div class="ad-row"><input id="pro-email" type="email" class="ad-grow" placeholder="customer@email.com" style="min-width:220px"><select id="pro-days" style="width:auto"><option value="30">1 month</option><option value="365">1 year</option><option value="7">7 days (trial)</option></select><button class="ad-btn green" id="pro-go"><i class="fa-solid fa-check"></i> Activate</button></div><p class="ad-hint" id="pro-msg"></p></div>' +
      '<div class="ad-card"><h3>Requests</h3><div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>Email</th><th>Plan</th><th>Status</th><th>When</th><th></th></tr></thead><tbody>' +
      ((d.requests || []).map(function (r) { return "<tr><td>" + esc(r.email || "") + "</td><td>" + esc(r.plan) + '</td><td><span class="ad-pill ' + (r.status === "done" ? "green" : r.status === "pending" ? "warn" : "") + '">' + esc(r.status) + "</span></td><td>" + esc(ago(Date.parse(r.created_at))) + "</td><td>" + (r.status === "pending" ? '<button class="ad-btn sm" data-fill="' + esc(r.email || "") + '" data-days="' + (r.plan === "yearly" ? 365 : 30) + '">Use</button>' : "") + "</td></tr>"; }).join("") || '<tr><td colspan="5" class="ad-empty">No requests yet.</td></tr>') + "</tbody></table></div></div>" +
      '<div class="ad-card"><h3>Pro members</h3><div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>Email</th><th>Pro until</th></tr></thead><tbody>' +
      ((d.pros || []).map(function (p) { var exp = p.pro_until && Date.parse(p.pro_until) < Date.now(); return "<tr><td>" + esc(p.email || "") + "</td><td>" + (p.pro_until ? esc(new Date(p.pro_until).toLocaleDateString("en-GB")) : "No end date") + (exp ? ' <span class="ad-pill red">Expired</span>' : "") + "</td></tr>"; }).join("") || '<tr><td colspan="2" class="ad-empty">No Pro members yet.</td></tr>') + "</tbody></table></div></div>";
    v.onclick = function (e) { var b = e.target.closest("[data-fill]"); if (b) { $("#pro-email").value = b.getAttribute("data-fill"); $("#pro-days").value = b.getAttribute("data-days"); $("#pro-email").focus(); } };
    $("#pro-go").onclick = function () { var b = $("#pro-go"); run(b, "Activating…", async function () { var r = await api("pro/activate", { method: "POST", body: { email: $("#pro-email").value.trim(), days: +$("#pro-days").value } }); $("#pro-msg").textContent = r.message; toast(r.message); }); };
  }

  /* ======================================================================
     STAFF & ROLES
     ====================================================================== */
  var PERM_LABELS = [["dashboard", "See the dashboard"], ["leads.view", "See enquiries"], ["leads.edit", "Update enquiries"], ["leads.delete", "Delete enquiries"], ["leads.export", "Download enquiries"],
    ["orders.view", "See orders"], ["orders.edit", "Change order status"], ["content.edit", "Edit website content"], ["content.publish", "Publish content"], ["tools.edit", "Change prices & stock"],
    ["coupons.edit", "Manage coupons"], ["blog.edit", "Write blog posts"], ["seo.edit", "Google & sharing"], ["uploads", "Upload pictures"], ["pro.manage", "Activate Postly Pro"],
    ["users.manage", "Manage staff"], ["activity.view", "See activity log"], ["backup.download", "Download backups"], ["settings.manage", "Contact numbers & settings"]];
  async function pageStaff(v) {
    title("Staff & roles");
    var d = await api("users"), isOwner = ME.role === "owner";
    var roleOpts = function (sel) { return Object.keys(d.roles).filter(function (r) { return r !== "owner" || isOwner; }).map(function (r) { return '<option value="' + r + '"' + (r === sel ? " selected" : "") + ">" + esc(d.roles[r]) + "</option>"; }).join(""); };
    v.innerHTML = '<div class="ad-card"><h3>Add a staff member</h3><div class="ad-fields"><div class="ad-field half"><label>Username</label><input id="nu-u" autocapitalize="none" placeholder="e.g. ali"></div><div class="ad-field half"><label>Name</label><input id="nu-name" placeholder="e.g. Ali Raza"></div>' +
      '<div class="ad-field half"><label>Role</label><select id="nu-role">' + roleOpts("sales") + '</select></div><div class="ad-field half"><label>Temporary password</label><input id="nu-pass" placeholder="At least 10 characters, letters and numbers"><p class="ad-hint">They must change it at first sign-in. Share it privately.</p></div></div>' +
      '<div class="ad-row" style="margin-top:12px"><button class="ad-btn primary" id="nu-go"><i class="fa-solid fa-user-plus"></i> Add staff member</button><button class="ad-btn ghost" id="nu-gen" type="button">Make a password</button></div></div>' +
      '<div class="ad-table-wrap" style="margin-bottom:16px"><table class="ad-table"><thead><tr><th>Person</th><th>Role</th><th>Last sign-in</th><th>Actions</th></tr></thead><tbody>' + d.users.map(function (u) {
        var self = u.u === ME.u, lock = u.role === "owner" && !isOwner;
        return '<tr data-u="' + esc(u.u) + '"><td><b>' + esc(u.name) + "</b><br><small>" + esc(u.u) + (self ? " · you" : "") + (u.disabled ? ' · <span class="ad-pill red">Disabled</span>' : "") + (u.mustChange ? ' · <span class="ad-pill warn">Must set password</span>' : "") + "</small></td>" +
          "<td>" + (self || lock ? esc(u.roleName) : '<select data-role style="width:auto">' + roleOpts(u.role) + "</select>") + "</td><td>" + (u.lastLogin ? esc(ago(u.lastLogin)) : "Never") + "</td>" +
          '<td><div class="ad-row" style="gap:6px">' + (lock ? "" : '<button class="ad-btn sm" data-ua="pass">Reset password</button><button class="ad-btn sm" data-ua="out">Sign out everywhere</button>' + (self ? "" : '<button class="ad-btn sm" data-ua="toggle">' + (u.disabled ? "Enable" : "Disable") + '</button><button class="ad-icon-btn danger" data-ua="del" title="Remove"><i class="fa-regular fa-trash-can"></i></button>')) + "</div></td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ad-card"><h3>What each role can do</h3><div class="ad-table-wrap"><table class="ad-table ad-perm-table"><thead><tr><th></th>' + Object.keys(d.roles).map(function (r) { return "<th>" + esc(d.roles[r]) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      PERM_LABELS.map(function (p) { return "<tr><td>" + esc(p[1]) + "</td>" + Object.keys(d.roles).map(function (r) { var ok = d.perms[r].indexOf("*") >= 0 || d.perms[r].indexOf(p[0]) >= 0; return "<td>" + (ok ? '<i class="fa-solid fa-check" style="color:var(--acc)"></i>' : '<span style="color:var(--tx3)">–</span>') + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div></div>";
    function genPass() { var c = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789", a = new Uint32Array(12), s = ""; crypto.getRandomValues(a); a.forEach(function (n) { s += c[n % c.length]; }); return s.slice(0, 8) + "-" + (a[0] % 90 + 10) + s.slice(8); }
    $("#nu-gen").onclick = function () { $("#nu-pass").value = genPass(); };
    $("#nu-go").onclick = function () { var b = $("#nu-go"); run(b, "Adding…", async function () { await api("users", { method: "POST", body: { u: $("#nu-u").value.trim(), name: $("#nu-name").value.trim(), role: $("#nu-role").value, password: $("#nu-pass").value } }); toast("Staff member added"); STAFF = (await api("auth/me")).staff || STAFF; route(); }); };
    v.addEventListener("change", function (e) { var s = e.target.closest("[data-role]"); if (!s) return; var u = s.closest("[data-u]").getAttribute("data-u"); api("users/" + u, { method: "PATCH", body: { role: s.value } }).then(function () { toast("Role changed. They are signed out so the change applies now."); }).catch(function (er) { toast(er.message, "err"); route(); }); });
    v.addEventListener("click", async function (e) {
      var b = e.target.closest("[data-ua]"); if (!b) return;
      var u = b.closest("[data-u]").getAttribute("data-u"), a = b.getAttribute("data-ua");
      try {
        if (a === "pass") { var p = genPass(); if (!(await confirmBox("Reset password for " + u + "?", "New temporary password: " + p + "\nCopy it now and send it to them privately. They will choose their own at sign-in.", "Reset"))) return; await api("users/" + u, { method: "PATCH", body: { password: p } }); try { await navigator.clipboard.writeText(p); toast("Password reset and copied"); } catch (er) { toast("Password reset: " + p); } }
        if (a === "out") { await api("users/" + u, { method: "PATCH", body: { signOut: true } }); toast(u === ME.u ? "Signed out on all devices" : "Signed out on all their devices"); if (u === ME.u) { showLogin(); return; } }
        if (a === "toggle") { var dis = b.textContent.trim() === "Disable"; if (dis && !(await confirmBox("Disable " + u + "?", "They are signed out right away and can't sign in until you enable them.", "Disable"))) return; await api("users/" + u, { method: "PATCH", body: { disabled: dis } }); toast(dis ? "Disabled" : "Enabled"); }
        if (a === "del") { if (!(await confirmBox("Remove " + u + "?", "Their account is deleted. Their past activity stays in the log.", "Remove"))) return; await api("users/" + u, { method: "DELETE" }); toast("Removed"); }
        route();
      } catch (er) { toast(er.message, "err"); }
    });
  }

  /* ======================================================================
     ACTIVITY, BACKUP, SETTINGS
     ====================================================================== */
  async function pageActivity(v) {
    title("Activity log");
    var d = await api("activity");
    v.innerHTML = '<div class="ad-toolbar"><input class="ad-search" id="ac-q" placeholder="Search person or action…"></div><div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>When</th><th>Who</th><th>What</th></tr></thead><tbody id="ac-body"></tbody></table></div>';
    function draw(q) { $("#ac-body").innerHTML = d.log.filter(function (x) { return !q || (x.u + " " + x.a + " " + x.d).toLowerCase().indexOf(q) >= 0; }).map(function (x) { return "<tr><td>" + esc(dt(x.t)) + "<br><small>" + esc(ago(x.t)) + "</small></td><td>" + esc(x.u === "-" ? "—" : staffName(x.u)) + "</td><td><b>" + esc(x.a) + "</b>" + (x.d ? "<br><small>" + esc(x.d) + "</small>" : "") + "</td></tr>"; }).join("") || '<tr><td colspan="3" class="ad-empty">Nothing yet.</td></tr>'; }
    draw(""); $("#ac-q").oninput = function (e) { draw(e.target.value.toLowerCase()); };
  }
  async function pageBackup(v) {
    title("Backup & restore");
    v.innerHTML = '<div class="ad-card"><h3><i class="fa-solid fa-download"></i> Download a backup</h3><p class="ad-muted" style="margin-bottom:12px">One file with all website content (drafts and published)' + (can("leads.view") ? ", settings and every enquiry" : " and settings") + '. Keep it somewhere safe, e.g. once a month.</p><a class="ad-btn primary" href="/api/admin/backup" download><i class="fa-solid fa-box-archive"></i> Download backup</a></div>' +
      (ME.role === "owner" ? '<div class="ad-card"><h3><i class="fa-solid fa-upload"></i> Restore content from a backup</h3><p class="ad-muted" style="margin-bottom:12px">Replaces all website content (drafts and published) with the content in the file. Enquiries, staff and settings are not changed.</p><input type="file" id="rs-file" accept="application/json,.json" style="max-width:360px"> <button class="ad-btn danger" id="rs-go" style="margin-top:10px"><i class="fa-solid fa-rotate-left"></i> Restore</button></div>' : '<div class="ad-callout"><i class="fa-solid fa-lock"></i><div>Only an Owner can restore a backup.</div></div>');
    var g = $("#rs-go"); if (g) g.onclick = async function () {
      var f = $("#rs-file").files[0]; if (!f) { toast("Choose a backup file first", "err"); return; }
      var data; try { data = JSON.parse(await f.text()); } catch (e) { toast("That file is not a backup.", "err"); return; }
      if (!(await confirmBox("Restore this backup?", "Backup from " + (data.created || "unknown date") + ". Current website content will be replaced and the website updates within 30 seconds.", "Restore"))) return;
      run(g, "Restoring…", async function () { var r = await api("restore", { method: "POST", body: data }); CONTENT = null; toast("Backup restored (" + r.sections + " sections)"); });
    };
  }
  async function pageSettings(v) {
    title("Settings");
    var s = await api("settings"), al = (s.settings && s.settings.alerts) || { on: false, to: [] };
    var svc = function (ok, name, hint) { return '<div class="ad-row" style="margin:6px 0"><span class="ad-pill ' + (ok ? "green" : "warn") + '">' + (ok ? "Connected" : "Not set up") + "</span> <b>" + name + '</b> <span class="ad-hint" style="margin:0">' + hint + "</span></div>"; };
    v.innerHTML = '<div class="ad-grid two"><div class="ad-card"><h3><i class="fa-solid fa-key"></i> Change your password</h3><div class="ad-fields"><div class="ad-field"><label>Current password</label><input type="password" id="cp-cur" autocomplete="current-password"></div><div class="ad-field"><label>New password</label><input type="password" id="cp-new" autocomplete="new-password"><p class="ad-hint">At least 10 characters, with letters and numbers.</p></div></div><div class="ad-row" style="margin-top:12px"><button class="ad-btn primary" id="cp-go">Save password</button><button class="ad-btn ghost" id="cp-out">Sign out on all devices</button></div></div>' +
      '<div class="ad-card"><h3><i class="fa-solid fa-plug"></i> Connected services</h3>' + svc(true, "Database", "Upstash Redis") + svc(SERVICES.blob, "Picture uploads", "Vercel Blob") + svc(SERVICES.supabase, "Orders & Postly", "Supabase server key") + svc(SERVICES.email, "Email alerts", "Resend") + '<p class="ad-hint">How to connect each one is in ADMIN-SETUP.md.</p></div>' +
      (can("settings.manage") ? '<div class="ad-card"><h3><i class="fa-solid fa-envelope"></i> Email alerts</h3><p class="ad-muted" style="margin-bottom:10px">Get an email for every new enquiry from the website.</p>' +
        (s.email ? "" : '<div class="ad-callout warn"><i class="fa-solid fa-triangle-exclamation"></i><div>Add RESEND_API_KEY in Vercel to send emails (see ADMIN-SETUP.md).</div></div>') +
        '<label class="ad-toggle"><input type="checkbox" id="al-on"' + (al.on ? " checked" : "") + '> Send email alerts</label><div class="ad-field" style="margin-top:12px"><label>Send to (one email per line)</label><textarea id="al-to" rows="3">' + esc((al.to || []).join("\n")) + '</textarea></div><div class="ad-row" style="margin-top:12px"><button class="ad-btn primary" id="al-save">Save</button><button class="ad-btn ghost" id="al-test"' + (s.email ? "" : " disabled") + ">Send a test email</button></div></div>" : "") + "</div>";
    $("#cp-go").onclick = function () { var b = $("#cp-go"); run(b, "Saving…", async function () { await api("auth/password", { method: "POST", body: { current: $("#cp-cur").value, next: $("#cp-new").value } }); $("#cp-cur").value = $("#cp-new").value = ""; toast("Password changed"); }); };
    $("#cp-out").onclick = async function () { if (!(await confirmBox("Sign out on all devices?", "You will need to sign in again here too.", "Sign out"))) return; try { await api("auth/logout-all", { method: "POST" }); } catch (e) {} showLogin(); };
    var as = $("#al-save"); if (as) as.onclick = function () { run(as, "Saving…", async function () { await api("settings", { method: "PUT", body: { alerts: { on: $("#al-on").checked, to: $("#al-to").value.split(/[\s,;]+/).filter(Boolean) } } }); toast("Email alerts saved"); }); };
    var at = $("#al-test"); if (at) at.onclick = function () { run(at, "Sending…", async function () { await api("settings/test-email", { method: "POST" }); toast("Test email sent"); }); };
  }

  boot();
})();
