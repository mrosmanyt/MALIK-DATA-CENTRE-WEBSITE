/* ==========================================================================
   MALIK DATA CENTRE: public CMS layer
   Applies content PUBLISHED in the admin panel (window.SITE_CMS, loaded from
   /api/content.js) to the page. If nothing is published, or the API is down,
   the page keeps its built-in HTML exactly as it is.

   HTML markers:  data-cms="sec.key"            text (icons inside are kept)
                  data-cms-rich="sec.key"        text with **bold**, [links](url), lists
                  data-cms-href / data-cms-src   link / image
                  data-cms-section="sec"         whole section (can be hidden)
                  data-cms-list="sec.key"        repeating items: children with data-cms-item,
                                                 separators data-cms-sep, fields data-cms-f-*
   Must load BEFORE index.js / pages.js / promo.js (they read MDC_CMS hooks).
   ========================================================================== */
(function () {
  "use strict";
  var C = window.SITE_CMS && typeof window.SITE_CMS === "object" ? window.SITE_CMS : null;

  /* ---------------- safe output helpers ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  // only http(s), relative, #anchor, mailto:, tel: (never javascript: or data:)
  function safeUrl(u, img) {
    u = String(u == null ? "" : u).trim();
    if (!u) return "";
    var low = u.replace(/[\s\u0000-\u001f]/g, "").toLowerCase();
    if (/^(javascript|vbscript|data|file):/.test(low)) return "";
    if (img && !/^(https:\/\/|http:\/\/localhost[:/]|\/|\.\.?\/|[a-z0-9_-]+\/)/i.test(u)) return "";
    return u;
  }
  // **bold**, *italic*, [text](url), "- " lists, blank line = new paragraph
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, u) { var s2 = safeUrl(u.replace(/&amp;/g, "&")); return s2 ? '<a href="' + esc(s2) + '"' + (/^https?:/i.test(s2) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + t + "</a>" : t; })
      .replace(/\n/g, "<br>");
  }
  function richHTML(md, block) {
    md = String(md == null ? "" : md).replace(/\r/g, "").trim();
    if (!block) return inline(md.replace(/\n\s*\n/g, "\n\n"));
    return md.split(/\n\s*\n/).map(function (para) {
      var lines = para.split("\n");
      if (lines.every(function (l) { return /^\s*[-*]\s+/.test(l); })) return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\s*[-*]\s+/, "")) + "</li>"; }).join("") + "</ul>";
      return "<p>" + inline(para) + "</p>";
    }).join("");
  }
  function toRich(el) {   // HTML → our simple text format (used to read the original content)
    var out = [];
    function walk(n, buf) {
      Array.prototype.forEach.call(n.childNodes, function (c) {
        if (c.nodeType === 3) buf.push(c.nodeValue.replace(/\s+/g, " "));
        else if (c.nodeType === 1) {
          var t = c.tagName;
          if (t === "STRONG" || t === "B") { var b = []; walk(c, b); buf.push("**" + b.join("").trim() + "**"); }
          else if (t === "EM") { var e = []; walk(c, e); buf.push("*" + e.join("").trim() + "*"); }
          else if (t === "A") { var a = []; walk(c, a); buf.push("[" + a.join("").trim() + "](" + c.getAttribute("href") + ")"); }
          else if (t === "BR") buf.push("\n");
          else if (t === "I" || t === "SVG" || t === "svg") { /* icons are part of the design */ }
          else walk(c, buf);
        }
      });
    }
    var blocks = el.querySelectorAll(":scope > p, :scope > ul");
    if (blocks.length) Array.prototype.forEach.call(blocks, function (b) {
      if (b.tagName === "UL") out.push(Array.prototype.map.call(b.querySelectorAll("li"), function (li) { var x = []; walk(li, x); return "- " + x.join("").trim(); }).join("\n"));
      else { var x = []; walk(b, x); out.push(x.join("").replace(/[ \t]+\n/g, "\n").trim()); }
    });
    else { var x = []; walk(el, x); out.push(x.join("").trim()); }
    return out.join("\n\n").replace(/ {2,}/g, " ");
  }
  // text of an element without its icons
  function getText(el) {
    var c = el.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll("i, svg, .tilt-glare"), function (x) { x.remove(); });
    return c.textContent.replace(/\s+/g, " ").trim();
  }
  // set text but keep icons (<i>, <svg>) where they are
  function setText(el, v) {
    v = String(v == null ? "" : v);
    var hasIcons = el.querySelector(":scope > i, :scope > svg, :scope > span.pay-ico");
    if (!hasIcons && !el.querySelector(":scope > *")) { el.textContent = v; return; }
    if (!hasIcons) { el.textContent = v; return; }
    var texts = Array.prototype.filter.call(el.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); });
    var firstEl = el.firstElementChild, iconFirst = firstEl && el.firstChild && (el.firstChild === firstEl || !el.firstChild.nodeValue || !el.firstChild.nodeValue.trim());
    if (texts.length) { texts[0].nodeValue = (iconFirst ? " " : "") + v + (iconFirst ? "" : " "); texts.slice(1).forEach(function (n) { n.remove(); }); }
    else el.appendChild(document.createTextNode(" " + v));
  }
  function getTail(el) { var s = ""; var after = false; Array.prototype.forEach.call(el.childNodes, function (n) { if (n.nodeType === 1) after = true; else if (after && n.nodeType === 3) s += n.nodeValue; }); return s.replace(/\s+/g, " ").trim(); }
  function setTail(el, v) { var after = false; Array.prototype.slice.call(el.childNodes).forEach(function (n) { if (n.nodeType === 1) after = true; else if (after && n.nodeType === 3) n.remove(); }); el.appendChild(document.createTextNode(" " + String(v == null ? "" : v))); }
  function getPath(obj, path) { return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj); }
  function iconClass(v) { return String(v || "").split(/\s+/).filter(function (c) { return /^fa-[a-z0-9-]+$/.test(c); }).join(" "); }
  function initials(name) { return String(name || "").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); }
  function ytId(u) { var m = String(u || "").match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : null; }

  /* ---------------- generic attribute engine (apply + read back) ---------------- */
  var FIELD_ATTRS = ["f", "f-rich", "f-href", "f-src", "f-alt", "f-icon", "f-color", "f-stars", "f-tail", "f-attr", "f-video", "f-poster", "f-show", "f-initials"];
  function fieldsIn(item) {
    var list = [];
    [item].concat(Array.prototype.slice.call(item.querySelectorAll("*"))).forEach(function (el) {
      // skip fields that belong to a nested list
      FIELD_ATTRS.forEach(function (a) { var v = el.getAttribute("data-cms-" + a); if (v != null) list.push({ el: el, kind: a, key: v }); });
      if (el.hasAttribute("data-cms-index")) list.push({ el: el, kind: "index" });
    });
    return list;
  }
  function readField(f) {
    var el = f.el;
    switch (f.kind) {
      case "f": return getText(el);
      case "f-rich": return toRich(el);
      case "f-href": return el.getAttribute("href") || "";
      case "f-src": return el.getAttribute("src") || "";
      case "f-alt": return el.getAttribute("alt") || "";
      case "f-icon": return iconClass(el.className);
      case "f-color": { var opts = (el.getAttribute("data-cms-colors") || "").split(/\s+/); for (var i = 0; i < opts.length; i++) if (opts[i] && el.classList.contains(opts[i])) return opts[i]; return ""; }
      case "f-stars": return el.querySelectorAll("i.fa-star").length;
      case "f-tail": return getTail(el);
      case "f-attr": { var p = f.key.split(":"); return el.getAttribute(p[0]) || ""; }
      case "f-video": { var s = el.querySelector("source"); return (s && s.getAttribute("src")) || ""; }
      case "f-poster": { var v = el.querySelector("video"); return (v && v.getAttribute("poster")) || ""; }
    }
    return undefined;
  }
  function keyOf(f) { return f.kind === "f-attr" ? f.key.split(":")[1] : f.key; }
  function writeField(f, item, idx) {
    var el = f.el, k = keyOf(f), v = item[k];
    switch (f.kind) {
      case "index": el.textContent = String(idx + 1); return;
      case "f": setText(el, v); return;
      case "f-rich": el.innerHTML = richHTML(v, el.tagName !== "P" && el.tagName !== "SPAN"); return;
      case "f-href": { var u = safeUrl(v); if (u) el.setAttribute("href", u); else el.removeAttribute("href"); return; }
      case "f-src": { var s = safeUrl(v, true); if (s) el.setAttribute("src", s); return; }
      case "f-alt": el.setAttribute("alt", String(v || "")); return;
      case "f-icon": { var ic = iconClass(v); if (!ic) return; Array.prototype.slice.call(el.classList).forEach(function (c) { if (/^fa-/.test(c) && !/^fa-q-icon$/.test(c)) el.classList.remove(c); }); ic.split(" ").forEach(function (c) { el.classList.add(c); }); return; }
      case "f-color": { (el.getAttribute("data-cms-colors") || "").split(/\s+/).forEach(function (c) { if (c) el.classList.remove(c); }); if (v && /^[a-z0-9-]+$/.test(v)) el.classList.add(v); return; }
      case "f-stars": { var n = Math.max(0, Math.min(5, parseInt(v, 10) || 0)); el.innerHTML = new Array(n + 1).join('<i class="fa-solid fa-star"></i>'); return; }
      case "f-tail": setTail(el, v); return;
      case "f-attr": { var name = f.key.split(":")[0]; if (/^(data-[a-z-]+|title|aria-label)$/.test(name)) el.setAttribute(name, String(v == null ? "" : v)); return; }
      case "f-show": el.hidden = !item[f.key]; if (!item[f.key]) el.style.display = "none"; return;
      case "f-initials": el.textContent = initials(item[f.key]); return;
      case "f-poster": { var vid = el.querySelector("video"), p = safeUrl(v, true); if (vid && p) vid.setAttribute("poster", p); return; }
      case "f-video": {
        var y = ytId(v);
        if (y) { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="Video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>'; el.style.position = "relative"; if (!el.style.aspectRatio) el.style.aspectRatio = "16/9"; return; }
        var src = safeUrl(v, true), so = el.querySelector("source"); if (so && src) so.setAttribute("src", src); return;
      }
    }
  }
  // give cloned items unique ids (faq-btn-1 → faq-btn-4) and fix references to them
  function renumber(node, idx) {
    [node].concat(Array.prototype.slice.call(node.querySelectorAll("[id],[aria-controls],[data-target],[for]"))).forEach(function (el) {
      ["id", "aria-controls", "data-target", "for", "aria-labelledby"].forEach(function (a) {
        var v = el.getAttribute(a); if (v && /-\d+$/.test(v)) el.setAttribute(a, v.replace(/-\d+$/, "-" + (idx + 1)));
      });
    });
  }
  function readList(box) {
    return Array.prototype.map.call(box.querySelectorAll(":scope > [data-cms-item]"), function (it) {
      var o = {}; fieldsIn(it).forEach(function (f) { if (f.kind === "index" || f.kind === "f-show" || f.kind === "f-initials") return; var r = readField(f); if (r !== undefined && o[keyOf(f)] === undefined) o[keyOf(f)] = r; });
      return o;
    });
  }
  function writeList(box, items) {
    var olds = box.querySelectorAll(":scope > [data-cms-item]");
    if (!olds.length || !Array.isArray(items)) return;
    var tpl = olds[0].cloneNode(true), sepEl = box.querySelector(":scope > [data-cms-sep]"), sepTpl = sepEl ? sepEl.cloneNode(true) : null;
    var last = olds[olds.length - 1], anchor = last.nextSibling;
    while (anchor && anchor.nodeType === 1 && anchor.hasAttribute("data-cms-sep")) anchor = anchor.nextSibling;
    Array.prototype.forEach.call(box.querySelectorAll(":scope > [data-cms-item], :scope > [data-cms-sep]"), function (n) { n.remove(); });
    var shown = items.filter(function (it) { return it && !it._hidden; });
    shown.forEach(function (it, i) {
      if (i && sepTpl) box.insertBefore(sepTpl.cloneNode(true), anchor);
      var node = tpl.cloneNode(true);
      renumber(node, i);
      fieldsIn(node).forEach(function (f) { writeField(f, it, i); });
      box.insertBefore(node, anchor);
    });
  }
  // read every marked section on this page into { section: { key: value } }
  function extract(root) {
    root = root || document;
    var out = {};
    function put(path, val) { var p = path.split("."); out[p[0]] = out[p[0]] || {}; out[p[0]][p[1]] = val; }
    Array.prototype.forEach.call(root.querySelectorAll("[data-cms]"), function (el) { put(el.getAttribute("data-cms"), getText(el)); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-cms-rich]"), function (el) { put(el.getAttribute("data-cms-rich"), toRich(el)); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-cms-href]"), function (el) { put(el.getAttribute("data-cms-href"), el.getAttribute("href") || ""); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-cms-src]"), function (el) { put(el.getAttribute("data-cms-src"), el.getAttribute("src") || ""); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-cms-tail]"), function (el) { put(el.getAttribute("data-cms-tail"), getTail(el)); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-cms-list]"), function (el) { put(el.getAttribute("data-cms-list"), readList(el)); });
    return out;
  }
  function applyMarked(content) {
    function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { var key = el.getAttribute(sel.slice(1, -1)); var v = getPath(content, key); if (v !== undefined && v !== null) fn(el, v); }); }
    each("[data-cms]", function (el, v) { setText(el, v); });
    each("[data-cms-rich]", function (el, v) { el.innerHTML = richHTML(v, el.tagName !== "P" && el.tagName !== "SPAN"); });
    each("[data-cms-tail]", function (el, v) { setTail(el, v); });
    each("[data-cms-href]", function (el, v) { var u = safeUrl(v); if (u) el.setAttribute("href", u); });
    each("[data-cms-src]", function (el, v) { var u = safeUrl(v, true); if (u) el.setAttribute("src", u); });
    each("[data-cms-list]", function (el, v) { writeList(el, v); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-cms-section]"), function (el) { var s = content[el.getAttribute("data-cms-section")]; if (s && s._hidden) el.style.display = "none"; });
  }

  /* ---------------- contact numbers & links: rewrite everywhere, even links built later ---------------- */
  var linkMap = [];
  function fmtNum(n) { n = String(n).replace(/\D/g, ""); return n.length === 12 && n.indexOf("92") === 0 ? "+92 " + n.slice(2, 5) + " " + n.slice(5) : "+" + n; }
  function buildLinkMap(ct) {
    var seed = { orderWhatsapp: "923489057646", supportWhatsapp: "923445739206", channel: "https://whatsapp.com/channel/0029Vb8Hycp3gvWclMCHv02Z", community: "https://chat.whatsapp.com/FA4CLYGdoZn1PXhENEAMGJ",
      youtube: "https://www.youtube.com/@MalikDataCentre0", facebook: "https://www.facebook.com/people/Malik-Data-Centre-Pro/61566733492225/", x: "https://x.com/realmickeyai" };
    ["orderWhatsapp", "supportWhatsapp"].forEach(function (k) {
      var nv = String(ct[k] || "").replace(/\D/g, "");
      if (nv && nv.length >= 8 && nv !== seed[k]) linkMap.push({ from: "wa.me/" + seed[k], to: "wa.me/" + nv, text: [fmtNum(seed[k]), fmtNum(nv)] });
    });
    ["channel", "community", "youtube", "facebook", "x"].forEach(function (k) {
      var nv = safeUrl(ct[k]); if (nv && /^https:\/\//.test(nv) && nv !== seed[k]) linkMap.push({ from: seed[k].replace(/\/$/, ""), to: nv, exact: true });
    });
  }
  function mapUrl(u) {
    if (!u || !linkMap.length) return u;
    linkMap.forEach(function (m) { if (u.indexOf(m.from) !== -1) u = m.exact ? (u.replace(/\/?#?$/, "").indexOf(m.from) === 0 ? m.to : u) : u.split(m.from).join(m.to); });
    return u;
  }
  function rewriteLinks(root) {
    if (!linkMap.length) return;
    Array.prototype.forEach.call((root || document).querySelectorAll("a[href]"), function (a) {
      var h = a.getAttribute("href"), n = mapUrl(h);
      if (n !== h) {
        a.setAttribute("href", n);
        // the number written inside the button too (e.g. "+92 344 5739206"), even in nested tags
        linkMap.forEach(function (m) {
          if (!m.text || a.textContent.indexOf(m.text[0]) === -1) return;
          var w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT), t;
          while ((t = w.nextNode())) if (t.nodeValue.indexOf(m.text[0]) !== -1) t.nodeValue = t.nodeValue.split(m.text[0]).join(m.text[1]);
        });
      }
    });
  }
  function hookLinks() {
    if (!linkMap.length) return;
    // bubble listener on window runs after the site's own click handlers and before the browser follows the link
    window.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest("a[href]"); if (a) { var h = a.getAttribute("href"), n = mapUrl(h); if (n !== h) a.setAttribute("href", n); } });
    var open = window.open;
    window.open = function (u) { var args = Array.prototype.slice.call(arguments); args[0] = mapUrl(String(u || "")); return open.apply(window, args); };
  }

  /* ---------------- announcement bar & popup ---------------- */
  function live(o) {
    if (!o || !o.on) return false;
    var now = Date.now();
    if (o.start && now < Date.parse(o.start)) return false;
    if (o.end && now > Date.parse(o.end) + 86400000) return false;
    return true;
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function css(text) { var s = document.createElement("style"); s.textContent = text; document.head.appendChild(s); }
  function announcement(a) {
    if (!live(a) || !a.text) return;
    var key = "cms_bar_" + String(a.text).length + "_" + (a.start || "");
    if (a.dismissible && store(key) === "x") return;
    var bg = /^#[0-9a-f]{3,8}$/i.test(a.bg || "") ? a.bg : "#111827", fg = /^#[0-9a-f]{3,8}$/i.test(a.color || "") ? a.color : "#ffffff";
    css(".cms-bar{position:fixed;left:0;right:0;top:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;gap:12px;padding:9px 44px;font:600 14px/1.35 Inter,system-ui,sans-serif;text-align:center}" +
      ".cms-bar a{color:inherit;text-decoration:underline;font-weight:700;white-space:nowrap}.cms-bar button{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:0;color:inherit;font-size:20px;line-height:1;cursor:pointer;opacity:.8}" +
      "@media(max-width:600px){.cms-bar{font-size:13px;padding:8px 38px;flex-wrap:wrap;gap:4px 10px}}");
    var bar = document.createElement("div"); bar.className = "cms-bar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Announcement");
    bar.style.background = bg; bar.style.color = fg;
    var u = safeUrl(a.link);
    bar.innerHTML = "<span>" + esc(a.text) + "</span>" + (u ? '<a href="' + esc(u) + '"' + (/^https?:/i.test(u) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + esc(a.linkText || "Learn more") + "</a>" : "") + (a.dismissible ? '<button type="button" aria-label="Close">×</button>' : "");
    document.body.insertBefore(bar, document.body.firstChild);
    // push the page and any fixed header down by the bar's height
    var shifted = [];
    function fit() {
      var h = bar.offsetHeight; document.body.style.paddingTop = h + "px";
      shifted.forEach(function (x) { x.el.style.setProperty("top", (x.top + h) + "px", "important"); });   // the theme uses !important
    }
    Array.prototype.forEach.call(document.querySelectorAll(".navbar, .pg-header, header"), function (el) {
      var cs = getComputedStyle(el); if (cs.position === "fixed" || cs.position === "sticky") shifted.push({ el: el, top: parseFloat(cs.top) || 0 });
    });
    fit(); window.addEventListener("resize", fit);
    var x = bar.querySelector("button"); if (x) x.onclick = function () { store(key, "x"); bar.remove(); document.body.style.paddingTop = ""; shifted.forEach(function (s) { s.el.style.removeProperty("top"); }); };
  }
  function pageMatches(spec) {
    var p = location.pathname.replace(/index\.html$/, "");
    if (!spec || spec === "all") return true;
    return String(spec).split(",").map(function (s) { return s.trim(); }).filter(Boolean).some(function (s) {
      if (s === "home") return p === "/" || p === "";
      if (s === "tools") return p.indexOf("/tools/") === 0;
      if (s === "blog") return p.indexOf("/blog/") === 0;
      if (s === "design") return p.indexOf("/design/") === 0 || /-maker\/|background-remover|ai-image-generator|free-design-tools/.test(p);
      return s.charAt(0) === "/" && p.indexOf(s.replace(/index\.html$/, "")) === 0;
    });
  }
  function popup(o) {
    if (!live(o) || !pageMatches(o.pages)) return;
    var key = "cms_pop_" + String((o.title || "") + (o.image || "")).length + "_" + (o.start || ""), last = +store(key) || 0, now = Date.now();
    var gap = { session: -1, day: 86400000, week: 7 * 86400000, once: Infinity }[o.frequency || "day"];
    if (gap === -1) { try { if (sessionStorage.getItem(key)) return; } catch (e) {} }
    else if (last && now - last < gap) return;
    setTimeout(function () {
      css(".cms-pop{position:fixed;inset:0;z-index:2147483001;background:rgba(17,24,39,.55);display:grid;place-items:center;padding:16px;animation:cmsfade .2s}" +
        ".cms-pop-card{position:relative;width:min(440px,100%);max-height:90vh;overflow:auto;background:#fff;color:#111827;border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.3);font-family:Inter,system-ui,sans-serif}" +
        ".cms-pop-card img{display:block;width:100%;height:auto;border-radius:18px 18px 0 0}.cms-pop-body{padding:18px 20px 20px}.cms-pop-body h3{margin:0 0 6px;font:800 1.25rem/1.25 Outfit,Inter,sans-serif}" +
        ".cms-pop-body p{margin:0 0 14px;color:#4b5563;line-height:1.5}.cms-pop-btn{display:inline-block;background:#111827;color:#fff;padding:11px 18px;border-radius:12px;font-weight:700;text-decoration:none}" +
        ".cms-pop-x{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.9);font-size:20px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15)}@keyframes cmsfade{from{opacity:0}}");
      var w = document.createElement("div"); w.className = "cms-pop"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true");
      var u = safeUrl(o.link), img = safeUrl(o.image, true);
      w.innerHTML = '<div class="cms-pop-card"><button class="cms-pop-x" type="button" aria-label="Close">×</button>' +
        (img ? (u ? '<a href="' + esc(u) + '">' : "") + '<img src="' + esc(img) + '" alt="' + esc(o.title || "") + '">' + (u ? "</a>" : "") : "") +
        (o.title || o.text || u ? '<div class="cms-pop-body">' + (o.title ? "<h3>" + esc(o.title) + "</h3>" : "") + (o.text ? "<p>" + esc(o.text) + "</p>" : "") + (u ? '<a class="cms-pop-btn" href="' + esc(u) + '"' + (/^https?:/i.test(u) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + esc(o.buttonText || "See offer") + "</a>" : "") + "</div>" : "") + "</div>";
      function close() { w.remove(); }
      w.addEventListener("click", function (e) { if (e.target === w || e.target.closest(".cms-pop-x")) close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      document.body.appendChild(w);
      store(key, String(Date.now())); try { sessionStorage.setItem(key, "1"); } catch (e) {}
    }, Math.max(0, Math.min(60, +o.delay || 0)) * 1000);
  }

  /* ---------------- per-page Google title / description / share image ---------------- */
  function setMeta(sel, attr, val) { var m = document.querySelector(sel); if (m && val) m.setAttribute(attr, val); }
  function seo(list) {
    if (!Array.isArray(list)) return;
    var p = location.pathname.replace(/index\.html$/, "") || "/";
    var hit = list.filter(function (x) { return x && x.path && !x._hidden && (x.path.replace(/index\.html$/, "") === p || (x.path === "/" && p === "/")); })[0];
    if (!hit) return;
    if (hit.title) { document.title = hit.title; setMeta('meta[property="og:title"]', "content", hit.title); setMeta('meta[name="twitter:title"]', "content", hit.title); }
    if (hit.description) { setMeta('meta[name="description"]', "content", hit.description); setMeta('meta[property="og:description"]', "content", hit.description); setMeta('meta[name="twitter:description"]', "content", hit.description); }
    var im = safeUrl(hit.image, true); if (im) { setMeta('meta[property="og:image"]', "content", im); setMeta('meta[name="twitter:image"]', "content", im); }
  }
  /* ---------------- page headings & intros (generated pages) ---------------- */
  function pages(list) {
    if (!Array.isArray(list)) return;
    var p = location.pathname.replace(/index\.html$/, "") || "/";
    list.forEach(function (x) {
      if (!x || x._hidden || !x.path || x.path.replace(/index\.html$/, "") !== p) return;
      var h = document.querySelector(".pg-hero h1"), l = document.querySelector(".pg-hero .pg-lead");
      if (h && x.heading) h.textContent = x.heading;
      if (l && x.intro) l.innerHTML = richHTML(x.intro, false);
    });
  }

  /* ---------------- tools: prices, stock, ribbons, hidden, new tools ---------------- */
  function rs(n) { return "Rs " + Number(n || 0).toLocaleString("en-US"); }
  function toolMap() { var m = {}; ((C && C.tools && C.tools.items) || []).forEach(function (t) { if (t && t.id) m[t.id] = t; }); return m; }
  // used by index.js on TOOLS_DATABASE (the homepage catalog)
  function applyTools(db) {
    if (!C || !C.tools || !Array.isArray(C.tools.items) || !Array.isArray(db)) return;
    var map = toolMap(), byId = {};
    db.forEach(function (t) { byId[t.id] = t; });
    C.tools.items.forEach(function (c) {
      if (!c || !c.id) return;
      var t = byId[c.id];
      if (!t && c.isNew && c.name) {   // a tool added in the admin panel
        t = { id: String(c.id).replace(/[^a-z0-9-]/gi, "").toLowerCase(), name: "", duration: "", setup: "", desc: "", category: c.category || "ai-chat", specs: [], icon: "", price: 0, originalPrice: 0 };
        db.push(t); byId[t.id] = t;
      }
      if (!t) return;
      if (c.name) t.name = esc(c.name);
      if (c.duration) t.duration = esc(c.duration);
      if (c.setup) t.setup = esc(c.setup);
      if (c.desc) t.desc = esc(c.desc);
      if (c.category && /^[a-z0-9-]+$/.test(c.category)) t.category = c.category;
      if (Array.isArray(c.specs) && c.specs.length) t.specs = c.specs.filter(Boolean).map(esc);
      else if (typeof c.specs === "string" && c.specs.trim()) t.specs = c.specs.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).map(esc);
      if (+c.price > 0) t.price = +c.price;
      if (+c.originalPrice > 0) t.originalPrice = +c.originalPrice; else if (c.originalPrice !== undefined && +c.originalPrice === 0 && t.originalPrice < t.price) t.originalPrice = t.price;
      if (!(t.originalPrice > 0)) t.originalPrice = t.price;
      var img = safeUrl(c.image, true); if (img) t.icon = '<img src="' + esc(img) + '" alt="" width="40" height="40" style="width:40px;height:40px;object-fit:contain;border-radius:8px">';
      if (!t.icon) t.icon = '<i class="fa-solid fa-cube" style="font-size:22px"></i>';
      t.cmsBadge = c.ribbon === "custom" && c.badge ? esc(c.badge) : "";
      t.cmsSoldOut = c.stock === "out";
    });
    for (var i = db.length - 1; i >= 0; i--) { var c2 = map[db[i].id]; if (c2 && c2._hidden) db.splice(i, 1); }
  }
  function applyRibbons(best, popular) {
    if (!C || !C.tools || !Array.isArray(C.tools.items)) return;
    C.tools.items.forEach(function (c) {
      if (!c || !c.id || c.ribbon === undefined) return;
      [best, popular].forEach(function (arr) { var i = arr.indexOf(c.id); if (i >= 0) arr.splice(i, 1); });
      if (c.ribbon === "bestseller") best.push(c.id); else if (c.ribbon === "popular") popular.push(c.id);
    });
  }
  // tool guide pages: each plan row is <article id="plan-ID">
  function toolPages() {
    var map = toolMap(); if (!Object.keys(map).length) return;
    Array.prototype.forEach.call(document.querySelectorAll('article[id^="plan-"]'), function (row) {
      var c = map[row.id.slice(5)]; if (!c) return;
      if (c._hidden) { row.style.display = "none"; return; }
      var pr = row.querySelector(".tool-price"), op = row.querySelector(".tool-original-price"), usd = row.querySelector(".pg-usd"), add = row.querySelector(".btn-addcart"), buy = row.querySelector(".btn-buy");
      var oldP = add ? +add.getAttribute("data-price") : 0, newP = +c.price > 0 ? +c.price : oldP;
      if (pr && newP !== oldP) {
        pr.textContent = rs(newP);
        if (usd && oldP) { var m = usd.textContent.match(/[\d.,]+/); if (m) usd.textContent = "≈ $" + Math.max(1, Math.round(parseFloat(m[0].replace(/,/g, "")) * newP / oldP)); }
        if (add) add.setAttribute("data-price", String(newP));
        if (buy) buy.setAttribute("href", buy.getAttribute("href").split(encodeURIComponent("Rs " + oldP.toLocaleString("en-US"))).join(encodeURIComponent("Rs " + newP.toLocaleString("en-US"))));
      }
      if (+c.originalPrice > newP) { if (op) op.textContent = rs(c.originalPrice); else if (pr) pr.insertAdjacentHTML("beforebegin", '<span class="tool-original-price">' + rs(c.originalPrice) + "</span>"); }
      else if (op && c.originalPrice !== undefined) op.remove();
      if (c.stock === "out" && buy) { buy.outerHTML = '<span class="btn btn-outline" aria-disabled="true" style="opacity:.6;cursor:not-allowed">Out of stock</span>'; if (add) add.remove(); }
    });
    // "From Rs …" on overview cards
    Array.prototype.forEach.call(document.querySelectorAll("[data-cms-from]"), function (box) {
      var ids = box.getAttribute("data-cms-from").split(","), min = null, minOld = 0;
      ids.forEach(function (id) {
        var c = map[id]; if (c && c._hidden) return;
        var base = +box.getAttribute("data-p-" + id) || 0, p = c && +c.price > 0 ? +c.price : base;
        if (p && (min === null || p < min)) { min = p; minOld = c && +c.originalPrice > 0 ? +c.originalPrice : (+box.getAttribute("data-o-" + id) || 0); }
      });
      var b = box.querySelector("b"); if (b && min) b.textContent = rs(min);
      var s = box.querySelector("s"); if (s) { if (minOld > min) s.textContent = rs(minOld); else s.remove(); }
    });
  }

  /* ---------------- coupons (used by promo.js) ---------------- */
  function coupons(defaults) {
    if (!C || !C.coupons || !Array.isArray(C.coupons.items)) return defaults;
    var out = {}, now = Date.now();
    C.coupons.items.forEach(function (c) {
      if (!c || c._hidden || !c.code || c.active === false) return;
      if (c.expires && now > Date.parse(c.expires) + 86400000) return;
      var p = Math.max(1, Math.min(90, parseInt(c.percent, 10) || 0)); if (p) out[String(c.code).trim().toUpperCase()] = p;
    });
    return out;
  }
  function couponChips() {
    if (!C || !C.coupons || !Array.isArray(C.coupons.items)) return;
    var chips = document.querySelectorAll(".mdc-coupon-chip"); if (!chips.length) return;
    var live = coupons({}), codes = Object.keys(live).filter(function (k) { return C.coupons.items.some(function (c) { return c && String(c.code).toUpperCase() === k && c.chip !== false; }); });
    var parent = chips[0].parentNode, tpl = chips[0].cloneNode(true);
    Array.prototype.forEach.call(chips, function (c) { c.remove(); });
    codes.slice(0, 4).forEach(function (code) { var n = tpl.cloneNode(true); n.setAttribute("data-code", code); n.textContent = code + " · " + live[code] + "% OFF"; parent.appendChild(n); });
  }

  /* ---------------- CMS blog posts on the blog list ---------------- */
  function blogList(b) {
    if (!b || !Array.isArray(b.posts) || !b.posts.length) return;
    if (!/^\/blog\/?(index\.html)?$/.test(location.pathname)) return;
    var grid = document.querySelector("[data-pg-cards]"); if (!grid) return;
    var html = b.posts.slice().sort(function (a, c) { return String(c.date || "").localeCompare(String(a.date || "")); }).map(function (p) {
      var slug = String(p.slug || "").replace(/[^a-z0-9-]/g, "");
      return '<a class="pg-card" data-cat="cms" data-name="' + esc(String(p.title || "").toLowerCase()) + '" href="/blog/p/' + slug + '/">' +
        '<span class="blog-card-cat"><i class="fa-solid fa-newspaper"></i> ' + esc(p.category || "Guide") + "</span>" +
        '<h3 style="font-size:1.08rem;line-height:1.35">' + esc(p.title) + "</h3>" + (p.description ? "<p>" + esc(p.description) + "</p>" : "") +
        (p.date ? '<div class="blog-card-meta"><i class="fa-regular fa-calendar"></i> ' + esc(p.date) + "</div>" : "") +
        '<span class="pg-card-more">Read guide <i class="fa-solid fa-arrow-right"></i></span></a>';
    }).join("");
    grid.insertAdjacentHTML("afterbegin", html);
  }

  /* ---------------- extras (social-proof pop-ups, countdown) ---------------- */
  function extra(name) { return !(C && C.extras && C.extras[name] === false); }

  /* ---------------- hero picture (optional) ---------------- */
  function heroImage(h) {
    var img = h && safeUrl(h.image, true), deco = document.querySelector(".mdc-hero-deco");
    if (!img || !deco) return;
    deco.innerHTML = '<img src="' + esc(img) + '" alt="" style="position:absolute;right:4%;top:50%;transform:translateY(-50%);width:min(34vw,460px);max-height:80%;object-fit:contain;border-radius:20px">';
  }

  /* ---------------- enquiry capture: every WhatsApp form also lands in the admin inbox ---------------- */
  function formType(form) {
    var p = location.pathname, intro = (form.getAttribute("data-intro") || "").toLowerCase();
    if (/request a tool|not in your catalog/.test(intro)) return "tool-request";
    if (/enterprise|api-credits/.test(p)) return "api-credits";
    if (/services/.test(p)) return "service";
    if (/contact/.test(p)) return "contact";
    return "other";
  }
  function captureForms() {
    document.addEventListener("submit", function (e) {
      var form = e.target; if (!form || !form.hasAttribute || !form.hasAttribute("data-pg-waform")) return;
      var data = { type: formType(form), page: location.pathname, fields: {}, website: "" };
      Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (el) {
        var n = el.name || el.id, v = (el.value || "").trim(); if (!n || !v) return;
        if (n === "website") { data.website = v; return; }
        if (/name/i.test(n) && !data.name) data.name = v;
        else if (/phone|whatsapp|mobile|number/i.test(n) && !/order/i.test(n) && !data.phone) data.phone = v;
        else if (/email/i.test(n) && !data.email) data.email = v;
        else if (/message|details|describe|requirement|tool|need/i.test(n) && !data.message) data.message = v;
        else data.fields[n] = v;
      });
      try { fetch("/api/forms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), keepalive: true }).catch(function () {}); } catch (err) {}
    }, true);
    // honeypot field (hidden from people, bots fill it)
    Array.prototype.forEach.call(document.querySelectorAll("form[data-pg-waform]"), function (f) {
      if (f.querySelector('[name="website"]')) return;
      var hp = document.createElement("input"); hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
      hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0"; f.appendChild(hp);
    });
  }

  /* ---------------- page views (no cookies) ---------------- */
  function track() {
    if (/^\/admin/.test(location.pathname) || navigator.webdriver && !window.__CMS_TRACK_TEST) return;
    var send = function () { try { fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ p: location.pathname, r: document.referrer }), keepalive: true }).catch(function () {}); } catch (e) {} };
    if (document.readyState === "complete") setTimeout(send, 300); else window.addEventListener("load", function () { setTimeout(send, 300); });
  }

  /* ---------------- run ---------------- */
  window.MDC_CMS = {
    content: C, extract: extract, esc: esc, safeUrl: safeUrl, richHTML: richHTML,
    tools: applyTools, ribbons: applyRibbons, coupons: coupons, extra: extra
  };
  captureForms();
  track();
  if (!C) return;
  try {
    applyMarked(C);
    if (C.contact) { buildLinkMap(C.contact); rewriteLinks(); hookLinks(); }
    if (C.hero) heroImage(C.hero);
    if (C.seo) seo(C.seo.items);
    if (C.pages) pages(C.pages.items);
    if (C.blog) blogList(C.blog);
    toolPages(); couponChips();
    var ready = function () { if (C.announcement) announcement(C.announcement); if (C.popup) popup(C.popup); };
    if (document.body) ready(); else document.addEventListener("DOMContentLoaded", ready);
  } catch (e) { if (window.console) console.warn("CMS:", e); }
})();
