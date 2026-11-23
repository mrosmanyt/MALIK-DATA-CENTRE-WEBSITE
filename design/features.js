/* ==========================================================================
   Postly Design Studio — extra free features (no API keys, no cost)
   Pages · PDF/ZIP export · Resize for other sizes · Smart guides · Grid
   Group/ungroup · Pinch zoom · Free photos · Icons · QR codes
   Crop & shape masks · Brand kit · Print order · "Design it for me"
   ========================================================================== */
(function () {
  "use strict";
  const S = window.MDC_STUDIO;
  if (!S) return;
  const c = S.canvas;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const WA = "923445739206";
  ["mdcMask", "mdcCrop", "mdcGroup", "mdcIcon", "mdcQR", "mdcCredit"].forEach(p => { if (!S.PROPS.includes(p)) S.PROPS.push(p); });
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const active = () => c.getActiveObject();
  const scripts = {};
  function loadScript(url) {
    if (!scripts[url]) scripts[url] = new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = url; s.async = true; s.onload = res; s.onerror = () => { delete scripts[url]; rej(new Error("Could not load " + url)); };
      document.head.appendChild(s);
    });
    return scripts[url];
  }
  const LIBS = {
    jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    qr: "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"
  };
  function openDialog(id) { const d = $(id); if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }
  function closeDialog(d) { if (d.close) d.close(); else d.removeAttribute("open"); }
  $$(".ds-dialog [data-close]").forEach(b => b.addEventListener("click", () => closeDialog(b.closest("dialog"))));
  function closeMenus() { $$(".ds-menu").forEach(x => x.classList.remove("open")); }
  const blobToDataURL = blob => new Promise((r, j) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = j; fr.readAsDataURL(blob); });
  async function fetchImageDataURL(url) {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const blob = await res.blob();
    if (!/^image\//.test(blob.type)) throw new Error("Not an image");
    return S.readImage(new File([blob], "photo", { type: blob.type }), 2000);
  }
  const isDarkColor = col => { try { const [r, g, b, a] = new fabric.Color(col).getSource(); return a !== 0 && (0.299 * r + 0.587 * g + 0.114 * b) < 140; } catch (e) { return false; } };

  /* ======================================================================
     1) PAGES
     ====================================================================== */
  const PAGES_KEY = "mdc_pages_v1";
  let pages = [], cur = 0, thumbs = [], pageTimer = null;
  // Thumbnails are drawn off-screen from the saved page, so the editor's selection and text editing are never disturbed
  function refreshThumb(i) {
    const str = pages[i]; if (!str) return;
    let d; try { d = JSON.parse(str); } catch (e) { return; }
    renderSnapshot(d, Math.min(1, 140 / Math.max(d.w, d.h))).then(el => { if (pages[i] === str) { thumbs[i] = el.toDataURL("image/jpeg", 0.7); renderPages(); } }).catch(() => {});
  }
  function persistPages() {
    pages[cur] = S.snapshot();
    if (!store.set(PAGES_KEY, { pages, cur })) {
      if (!persistPages.warned) { persistPages.warned = true; S.toast("Too many pages to auto-save in the browser. Use File → Save project."); }
    }
  }
  function schedulePages() {
    if (S.restoring) return;
    clearTimeout(pageTimer);
    pageTimer = setTimeout(() => { persistPages(); refreshThumb(cur); }, 700);
  }
  ["object:added", "object:removed", "object:modified", "text:changed"].forEach(ev => c.on(ev, schedulePages));
  document.addEventListener("mdc:saved", schedulePages);   // also after templates, undo and size changes
  function renderPages() {
    $("#pages-list").innerHTML = pages.map((_, i) => `<button class="ds-page${i === cur ? " cur" : ""}" data-page="${i}" title="Page ${i + 1}">${thumbs[i] ? `<img src="${thumbs[i]}" alt="">` : '<span style="display:block;width:52px"></span>'}<b>${i + 1}</b></button>`).join("");
    $("#page-del").disabled = pages.length < 2;
  }
  function fixBackgroundSize() {
    const bg = S.bgObj(); const [W, H] = S.size;
    if (bg && (Math.round(bg.width) !== W || Math.round(bg.height) !== H)) S.setBackground(bg.mdcBg || "#ffffff");
  }
  function goToPage(i, done) {
    if (i < 0 || i >= pages.length) return;
    if (i !== cur && cur >= 0) { pages[cur] = S.snapshot(); refreshThumb(cur); }
    cur = i;
    S.loadSnapshot(pages[i], () => {
      fixBackgroundSize(); S.autoFit = true; S.fit(); S.resetHistory();
      store.set("mdc_design_v1", pages[i]); persistPages(); renderPages(); refreshThumb(cur); done && done();
    });
  }
  function blankSnapshot(w, h) {
    const W = w || S.size[0], H = h || S.size[1];
    return JSON.stringify({ v: 1, w: W, h: H, json: { version: fabric.version, objects: [{ type: "rect", left: 0, top: 0, width: W, height: H, fill: "#ffffff", selectable: false, evented: false, hasControls: false, hasBorders: false, name: "Background", mdcType: "bg", mdcBg: "#ffffff", strokeWidth: 0 }] } });
  }
  $("#pages-list").addEventListener("click", e => { const b = e.target.closest("[data-page]"); if (b) goToPage(+b.dataset.page); });
  // add a page after the current one (blank, or from a saved snapshot) and open it
  function addPage(str, done) { pages[cur] = S.snapshot(); pages.splice(cur + 1, 0, str || blankSnapshot()); thumbs.splice(cur + 1, 0, ""); goToPage(cur + 1, done); }
  // replace every page (opening a cloud design)
  function replacePages(list, at, done) {
    if (!Array.isArray(list) || !list.length) return;
    pages = list.slice(); thumbs = pages.map(() => ""); cur = -1;
    goToPage(Math.min(Math.max(0, at || 0), pages.length - 1), () => { pages.forEach((_, i) => refreshThumb(i)); done && done(); });
  }
  $("#page-add").onclick = () => { pages[cur] = S.snapshot(); pages.splice(cur + 1, 0, blankSnapshot()); thumbs.splice(cur + 1, 0, ""); goToPage(cur + 1, () => S.toast(`Page ${cur + 1} added`)); };
  $("#page-dup").onclick = () => { pages[cur] = S.snapshot(); pages.splice(cur + 1, 0, pages[cur]); thumbs.splice(cur + 1, 0, thumbs[cur]); goToPage(cur + 1, () => S.toast("Page duplicated")); };
  $("#page-del").onclick = () => {
    if (pages.length < 2) return;
    pages.splice(cur, 1); thumbs.splice(cur, 1);
    const next = Math.min(cur, pages.length - 1); cur = -1; goToPage(next, () => S.toast("Page deleted"));
  };
  function initPages() {
    const saved = store.get(PAGES_KEY, null);
    let latest = null; try { latest = localStorage.getItem("mdc_design_v1"); } catch (e) {}
    if (saved && Array.isArray(saved.pages) && saved.pages.length) {
      pages = saved.pages; cur = Math.min(saved.cur || 0, pages.length - 1);
      if (latest) pages[cur] = latest;   // the studio's own auto-save holds the newest version of the open page
    } else { pages = [latest || S.snapshot()]; cur = 0; }
    thumbs = pages.map(() => "");
    renderPages();
    pages.forEach((p, i) => {
      let d; try { d = JSON.parse(p); } catch (e) { return; }
      renderSnapshot(d, Math.min(1, 140 / Math.max(d.w, d.h))).then(el => { thumbs[i] = el.toDataURL("image/jpeg", 0.7); renderPages(); }).catch(() => {});
    });
  }
  // Render any saved page without touching the editor
  function renderSnapshot(str, mult = 1) {
    return new Promise((resolve, reject) => {
      let data; try { data = typeof str === "string" ? JSON.parse(str) : str; } catch (e) { return reject(e); }
      const fonts = [...new Set((data.json.objects || []).filter(o => o.fontFamily).map(o => o.fontFamily))];
      Promise.all(fonts.map(f => S.fontLoad(f))).then(() => {
        const sc = new fabric.StaticCanvas(null, { width: data.w, height: data.h, enableRetinaScaling: false, renderOnAddRemove: false });
        sc.loadFromJSON(data.json, () => {
          sc.getObjects().forEach(o => { if (o.mdcType === "frame") o.visible = false; });
          const bg = sc.getObjects().find(o => o.mdcType === "bg");
          if (bg && (bg.width !== data.w || bg.height !== data.h)) bg.set({ width: data.w, height: data.h, fill: S.makeFill(bg.mdcBg || "#ffffff", data.w, data.h) });
          sc.renderAll();
          const el = sc.toCanvasElement(mult); sc.dispose(); resolve(el);
        });
      });
    });
  }

  /* ======================================================================
     2) EXPORT: PDF and ZIP (all pages)
     ====================================================================== */
  async function allPageCanvases(mult = 1) {
    pages[cur] = S.snapshot();
    const out = [];
    for (let i = 0; i < pages.length; i++) out.push(i === cur ? S.renderToCanvas(mult) : await renderSnapshot(pages[i], mult));
    return out;
  }
  async function exportPDF() {
    try {
      S.toast("Preparing PDF…", 6000);
      await loadScript(LIBS.jspdf);
      const { jsPDF } = window.jspdf;
      const els = await allPageCanvases(1);
      let doc = null;
      els.forEach(el => {
        const w = el.width, h = el.height, o = w > h ? "l" : "p";
        if (!doc) doc = new jsPDF({ orientation: o, unit: "px", format: [w, h], hotfixes: ["px_scaling"], compress: true });
        else doc.addPage([w, h], o);
        doc.addImage(el.toDataURL("image/jpeg", 0.93), "JPEG", 0, 0, w, h);
      });
      S.saveBlob(doc.output("blob"), `postly-design-${els.length}-page${els.length > 1 ? "s" : ""}.pdf`);
      S.toast(`PDF downloaded ✔ (${els.length} page${els.length > 1 ? "s" : ""})`);
    } catch (e) { console.error(e); S.toast("Could not make the PDF. Check your internet and try again."); }
  }
  async function exportZIP() {
    try {
      S.toast("Preparing images…", 6000);
      await loadScript(LIBS.jszip);
      const els = await allPageCanvases(1);
      const zip = new JSZip();
      for (let i = 0; i < els.length; i++) {
        const blob = await new Promise(r => els[i].toBlob(r, "image/png"));
        zip.file(`page-${String(i + 1).padStart(2, "0")}-${els[i].width}x${els[i].height}.png`, blob);
      }
      S.saveBlob(await zip.generateAsync({ type: "blob" }), "postly-design-pages.zip");
      S.toast(`ZIP downloaded ✔ (${els.length} images)`);
    } catch (e) { console.error(e); S.toast("Could not make the ZIP file. Please try again."); }
  }
  $$('[data-dl="pdf"]').forEach(b => b.onclick = () => { closeMenus(); exportPDF(); });
  $$('[data-dl="zip"]').forEach(b => b.onclick = () => { closeMenus(); exportZIP(); });

  /* ======================================================================
     3) RESIZE FOR OTHER SIZES (adds each size as a new page)
     ====================================================================== */
  function scaledSnapshot(str, nw, nh) {
    const d = JSON.parse(str), W = d.w, H = d.h;
    const s = Math.min(nw / W, nh / H), ox = (nw - W * s) / 2, oy = (nh - H * s) / 2;
    d.json.objects.forEach(o => {
      if (o.mdcType === "bg") { o.width = nw; o.height = nh; return; }
      // a photo that covered the whole design keeps covering it
      if (o.type === "image" && Math.abs(o.width * o.scaleX - W) < 4 && Math.abs(o.height * o.scaleY - H) < 4 && Math.abs(o.left) < 4 && Math.abs(o.top) < 4) {
        const cs = Math.max(nw / W, nh / H);
        o.scaleX *= cs; o.scaleY *= cs; o.left = (nw - W * cs) / 2; o.top = (nh - H * cs) / 2; return;
      }
      o.left = o.left * s + ox; o.top = o.top * s + oy; o.scaleX = (o.scaleX || 1) * s; o.scaleY = (o.scaleY || 1) * s;
    });
    d.w = nw; d.h = nh;
    return JSON.stringify(d);
  }
  $("#magic-grid").innerHTML = MDC_SIZES.map(s => `<label><input type="checkbox" value="${s.id}"><span>${esc(s.name)}<small>${s.w} × ${s.h}</small></span></label>`).join("");
  function openMagic() {
    closeMenus();
    const [W, H] = S.size;
    $$("#magic-grid input").forEach(i => { const s = MDC_SIZES.find(x => x.id === i.value); i.checked = false; i.disabled = s.w === W && s.h === H; });
    openDialog("#dlg-magic");
  }
  $$('[data-act="magic"]').forEach(b => b.addEventListener("click", openMagic));
  $("#magic-go").onclick = () => {
    const picked = $$("#magic-grid input:checked").map(i => MDC_SIZES.find(x => x.id === i.value));
    if (!picked.length) { S.toast("Pick at least one size."); return; }
    pages[cur] = S.snapshot();
    const base = pages[cur], at = cur + 1;
    picked.forEach((s, k) => { pages.splice(at + k, 0, scaledSnapshot(base, s.w, s.h)); thumbs.splice(at + k, 0, ""); });
    closeDialog($("#dlg-magic"));
    goToPage(at, () => S.toast(`${picked.length} new page${picked.length > 1 ? "s" : ""} created. Adjust each one, then download all as PDF or ZIP.`, 5000));
  };
  // a button for it inside the size dialog too
  const sizeDlg = $("#dlg-size");
  if (sizeDlg) {
    const b = document.createElement("button");
    b.className = "ds-btn ghost sm"; b.style.marginTop = "10px"; b.style.marginLeft = "6px";
    b.innerHTML = '<i class="fa-solid fa-wand-magic"></i> Make copies in several sizes';
    b.onclick = () => { closeDialog(sizeDlg); openMagic(); };
    $("#size-close").after(b);
  }

  /* ======================================================================
     4) SMART GUIDES, GRID, GROUP
     ====================================================================== */
  let snapOn = store.get("mdc_snap", true), others = [];
  const guides = $("#ds-guides");
  $("#btn-snap").classList.toggle("on", snapOn);
  $("#btn-snap").onclick = () => { snapOn = !snapOn; store.set("mdc_snap", snapOn); $("#btn-snap").classList.toggle("on", snapOn); S.toast(snapOn ? "Smart guides on" : "Smart guides off"); };
  c.on("mouse:down", () => {
    others = S.userObjects().filter(o => o.visible !== false && o !== active() && !(active() && active().type === "activeSelection" && active().contains(o)))
      .map(o => o.getBoundingRect(true, true));
  });
  function showGuides(xs, ys) {
    const z = S.zoom;
    guides.innerHTML = xs.map(x => `<i class="v" style="left:${x * z}px"></i>`).join("") + ys.map(y => `<i class="h" style="top:${y * z}px"></i>`).join("");
  }
  c.on("object:moving", e => {
    if (!snapOn) { guides.innerHTML = ""; return; }
    const o = e.target, [W, H] = S.size, th = 7 / S.zoom;
    const r = o.getBoundingRect(true, true);
    const xs = [0, W / 2, W], ys = [0, H / 2, H];
    others.forEach(b => { xs.push(b.left, b.left + b.width / 2, b.left + b.width); ys.push(b.top, b.top + b.height / 2, b.top + b.height); });
    const mine = { x: [r.left, r.left + r.width / 2, r.left + r.width], y: [r.top, r.top + r.height / 2, r.top + r.height] };
    let bestX = null, bestY = null;
    mine.x.forEach(m => xs.forEach(t => { const d = t - m; if (Math.abs(d) < th && (!bestX || Math.abs(d) < Math.abs(bestX.d))) bestX = { d, t }; }));
    mine.y.forEach(m => ys.forEach(t => { const d = t - m; if (Math.abs(d) < th && (!bestY || Math.abs(d) < Math.abs(bestY.d))) bestY = { d, t }; }));
    if (bestX) o.left += bestX.d;
    if (bestY) o.top += bestY.d;
    o.setCoords();
    showGuides(bestX ? [bestX.t] : [], bestY ? [bestY.t] : []);
  });
  ["mouse:up", "selection:cleared", "object:modified"].forEach(ev => c.on(ev, () => { guides.innerHTML = ""; }));

  let gridOn = store.get("mdc_grid", false);
  const grid = $("#grid-overlay");
  function drawGrid() {
    grid.hidden = !gridOn; $("#btn-grid").classList.toggle("on", gridOn);
    if (!gridOn) return;
    const [W, H] = S.size, step = Math.min(W, H) / 12 * S.zoom;
    grid.style.backgroundImage = "linear-gradient(rgba(124,92,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,.35) 1px, transparent 1px)";
    grid.style.backgroundSize = `${step}px ${step}px`;
    grid.style.backgroundPosition = `${(W * S.zoom / 2) % step}px ${(H * S.zoom / 2) % step}px`;
  }
  $("#btn-grid").onclick = () => { gridOn = !gridOn; store.set("mdc_grid", gridOn); drawGrid(); };
  let lastZ = 0;
  c.on("after:render", () => { if (gridOn && S.zoom !== lastZ) { lastZ = S.zoom; drawGrid(); } });
  drawGrid();

  const gBtn = $("#p-group");
  function updateGroupBtn() {
    const o = active();
    const multi = o && o.type === "activeSelection", grp = o && o.type === "group" && o.mdcType !== "frame";
    gBtn.hidden = !(multi || grp);
    if (multi) gBtn.innerHTML = '<i class="fa-regular fa-object-group"></i> <span class="hide-xs">Group</span>';
    if (grp) gBtn.innerHTML = '<i class="fa-regular fa-object-ungroup"></i> <span class="hide-xs">Ungroup</span>';
    $("#p-mask").hidden = !(o && o.type === "image");
  }
  ["selection:created", "selection:updated", "selection:cleared"].forEach(ev => c.on(ev, () => setTimeout(updateGroupBtn, 0)));
  gBtn.onclick = () => {
    const o = active(); if (!o) return;
    if (o.type === "activeSelection") { const g = o.toGroup(); g.set({ name: "Group" }); g.mdcGroup = true; g.mdcType = "shape"; c.setActiveObject(g); }
    else if (o.type === "group") { o.toActiveSelection(); }
    c.requestRenderAll(); S.saveState(); S.updateCtx(); updateGroupBtn();
  };
  document.addEventListener("keydown", e => {
    const typing = /input|select|textarea/i.test(document.activeElement.tagName) || (active() && active().isEditing);
    if (typing || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "g") return;
    const o = active(); if (!o) return; e.preventDefault();
    if (e.shiftKey ? o.type === "group" : o.type === "activeSelection") gBtn.onclick();
  });

  /* ======================================================================
     5) MOBILE: pinch to zoom, bigger handles
     ====================================================================== */
  if (window.matchMedia && matchMedia("(pointer: coarse)").matches) {
    fabric.Object.prototype.set({ cornerSize: 22, touchCornerSize: 34, padding: 8 });
  }
  const stage = $("#ds-stage");
  let pinch = null;
  const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  stage.addEventListener("touchstart", e => {
    if (e.touches.length === 2) { pinch = { d: dist(e.touches), z: S.zoom }; c.discardActiveObject(); c.selection = false; c.requestRenderAll(); }
  }, { passive: true, capture: true });
  stage.addEventListener("touchmove", e => {
    if (pinch && e.touches.length === 2) { e.preventDefault(); e.stopPropagation(); S.autoFit = false; S.applyZoom(pinch.z * dist(e.touches) / pinch.d); if (gridOn) drawGrid(); }
  }, { passive: false, capture: true });
  stage.addEventListener("touchend", e => { if (pinch && e.touches.length < 2) { pinch = null; setTimeout(() => { c.selection = true; }, 50); } }, { capture: true });
  // Ctrl + mouse wheel zoom on desktop
  stage.addEventListener("wheel", e => { if (!e.ctrlKey) return; e.preventDefault(); S.autoFit = false; S.applyZoom(S.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1)); if (gridOn) drawGrid(); }, { passive: false });

  /* ======================================================================
     6) FREE PHOTOS (Openverse, commercial-use licences)
     ====================================================================== */
  const PHOTO_TAGS = ["Food", "Mosque", "Business", "Nature", "Technology", "Fashion", "Wedding", "Office", "Coffee", "City", "Gym", "Flowers"];
  $("#photo-chips").innerHTML = PHOTO_TAGS.map(t => `<button type="button" data-q="${t}">${t}</button>`).join("");
  let photoResults = [];
  async function searchPhotos(q) {
    q = (q || "").trim(); if (!q) return;
    const st = $("#photo-status"); st.textContent = "Searching free photos…";
    $("#photo-grid").innerHTML = "";
    try {
      const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=24&license_type=commercial&mature=false`;
      const res = await fetch(url); if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      photoResults = data.results || [];
      $("#photo-grid").innerHTML = photoResults.map((r, i) => `<button type="button" data-ph="${i}" title="${esc(r.title || "Photo")} — ${esc(r.creator || "unknown")}"><img src="${esc(r.thumbnail || r.url)}" alt="" loading="lazy"></button>`).join("");
      st.textContent = photoResults.length ? "Tap a photo to add it. Licences allow commercial use; credit the photographer when you can." : "No photos found. Try another word.";
    } catch (e) { console.warn(e); st.textContent = "Photo search is not available right now. Please try again in a minute."; }
  }
  $("#photo-form").addEventListener("submit", e => { e.preventDefault(); searchPhotos($("#photo-q").value); });
  $("#photo-chips").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (b) { $("#photo-q").value = b.dataset.q; searchPhotos(b.dataset.q); } });
  $("#photo-grid").addEventListener("click", async e => {
    const b = e.target.closest("[data-ph]"); if (!b || b.classList.contains("busy")) return;
    const r = photoResults[+b.dataset.ph]; if (!r) return;
    b.classList.add("busy");
    let url = null;
    try { url = await fetchImageDataURL(r.url); } catch (e1) { try { url = await fetchImageDataURL(r.thumbnail); } catch (e2) { url = null; } }
    b.classList.remove("busy");
    if (!url) { S.toast("This photo could not be loaded. Please pick another one."); return; }
    const img = await S.addImageURL(url, (r.title || "Photo").slice(0, 40));
    const credit = `${r.title || "Photo"} by ${r.creator || "unknown"} (${(r.license || "").toUpperCase()} ${r.license_version || ""})`.trim();
    if (img) { img.mdcCredit = credit; S.saveState(); }
    S.toast("Added ✔ Credit: " + credit, 5000);
  });
  let photosOpened = false;
  $$('.ds-rail [data-panel="photos"]').forEach(b => b.addEventListener("click", () => { if (!photosOpened) { photosOpened = true; $("#photo-q").value = "background"; searchPhotos("background"); } }));

  /* ======================================================================
     7) ICONS (Iconify, 200,000+ free icons)
     ====================================================================== */
  async function searchIcons(q) {
    q = (q || "").trim(); if (!q) return;
    const grid = $("#icon-grid"); grid.innerHTML = '<p class="ds-hint" style="grid-column:1/-1">Searching…</p>';
    try {
      const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(q)}&limit=60`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const icons = (data.icons || []).filter(n => /^[a-z0-9-]+:[a-z0-9-]+$/.test(n));
      grid.innerHTML = icons.length ? icons.map(n => { const [p, i] = n.split(":"); return `<button type="button" data-icon="${n}" title="${i.replace(/-/g, " ")}"><img src="https://api.iconify.design/${p}/${i}.svg?height=40" alt="" loading="lazy"></button>`; }).join("")
        : '<p class="ds-hint" style="grid-column:1/-1">No icons found.</p>';
    } catch (e) { grid.innerHTML = '<p class="ds-hint" style="grid-column:1/-1">Icon search is not available right now.</p>'; }
  }
  $("#icon-form").addEventListener("submit", e => { e.preventDefault(); searchIcons($("#icon-q").value); });
  $("#icon-grid").addEventListener("click", async e => {
    const b = e.target.closest("[data-icon]"); if (!b) return;
    const [p, i] = b.dataset.icon.split(":");
    try {
      const color = (S.bgObj() && isDarkColor(typeof S.bgObj().mdcBg === "string" ? S.bgObj().mdcBg : (S.bgObj().mdcBg && S.bgObj().mdcBg.g ? S.bgObj().mdcBg.g[1][0] : "#fff"))) ? "#ffffff" : "#111111";
      const res = await fetch(`https://api.iconify.design/${p}/${i}.svg?color=${encodeURIComponent(color)}&height=240`);
      const svg = await res.text();
      fabric.loadSVGFromString(svg, (objs, opts) => {
        if (!objs || !objs.length) { S.toast("This icon could not be added."); return; }
        const g = fabric.util.groupSVGElements(objs, opts);
        const [W, H] = S.size; g.scaleToWidth(Math.min(W, H) * 0.22);
        g.set({ name: "Icon: " + i.replace(/-/g, " ") }); g.mdcType = "shape"; g.mdcIcon = true;
        S.centerAdd(g); S.saveState();
      });
    } catch (err) { S.toast("This icon could not be added. Check your internet."); }
  });
  let iconsLoaded = false;
  $$('.ds-rail [data-panel="elements"]').forEach(b => b.addEventListener("click", () => { if (!iconsLoaded) { iconsLoaded = true; $("#icon-q").value = "star"; searchIcons("star"); } }));
  // colour picker also recolours icons and QR codes (they are groups of paths)
  $("#p-fill").addEventListener("input", e => {
    const v = e.target.value, o = active(); if (!o) return;
    const apply = x => {
      if (x.mdcQR && x.type === "group") { const p = x.getObjects()[1]; if (p) p.set({ fill: v }); }
      else if (x.type === "group" && (x.mdcIcon || x.mdcGroup)) x.getObjects().forEach(ch => { if (ch.fill && ch.fill !== "none") ch.set({ fill: v }); if (ch.stroke && ch.stroke !== "none" && !ch.fill) ch.set({ stroke: v }); });
    };
    if (o.type === "activeSelection") o.getObjects().forEach(apply); else apply(o);
    c.requestRenderAll();
  });

  /* ======================================================================
     8) QR CODE
     ====================================================================== */
  const qrHints = { wa: ["e.g. 923001234567 (country code + number)", true], url: ["e.g. www.yourshop.com", false], tel: ["e.g. 923001234567", false], text: ["Any text", false] };
  function updateQrForm() { const [ph, msg] = qrHints[$("#qr-type").value]; $("#qr-value").placeholder = ph; $("#qr-msg").hidden = !msg; }
  $("#qr-type").addEventListener("change", updateQrForm); updateQrForm();
  $("#qr-add").onclick = async () => {
    const type = $("#qr-type").value, raw = $("#qr-value").value.trim();
    if (!raw) { S.toast("Enter a number, link or text first."); $("#qr-value").focus(); return; }
    let data = raw;
    if (type === "wa") { const d = raw.replace(/\D/g, "").replace(/^0/, "92"); if (d.length < 8) { S.toast("Enter the full WhatsApp number with country code."); return; } data = `https://wa.me/${d}` + ($("#qr-msg").value.trim() ? `?text=${encodeURIComponent($("#qr-msg").value.trim())}` : ""); }
    if (type === "url" && !/^https?:\/\//i.test(raw)) data = "https://" + raw;
    if (type === "tel") data = "tel:+" + raw.replace(/\D/g, "").replace(/^0/, "92");
    try {
      await loadScript(LIBS.qr);
      if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs["UTF-8"]) qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
      const qr = qrcode(0, "M"); qr.addData(data); qr.make();
      const n = qr.getModuleCount(), m = 10, q = 3; let d = "";
      for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (qr.isDark(r, col)) d += `M${(col + q) * m} ${(r + q) * m}h${m}v${m}h-${m}z`;
      const size = (n + 2 * q) * m;
      const bgRect = new fabric.Rect({ left: 0, top: 0, width: size, height: size, fill: "#ffffff", rx: m, ry: m });
      const path = new fabric.Path(d, { fill: $("#qr-color").value, left: q * m, top: q * m });
      const g = new fabric.Group([bgRect, path], { name: "QR code" });
      const [W, H] = S.size; g.scaleToWidth(Math.min(W, H) * 0.3);
      g.mdcType = "shape"; g.mdcQR = true;
      S.centerAdd(g); S.saveState();
      S.toast("QR code added ✔ Test it with your phone camera before printing.", 4000);
    } catch (e) { console.error(e); S.toast("Could not make the QR code. Check your internet and try again."); }
  };

  /* ======================================================================
     9) CROP & SHAPE MASKS for photos
     ====================================================================== */
  const MASKS = {
    none:    { svg: '<rect x="12" y="20" width="76" height="60" fill="none" stroke="#aaa" stroke-width="6" stroke-dasharray="8 6"/>' },
    rounded: { svg: '<rect x="12" y="12" width="76" height="76" rx="18" fill="#aaa"/>', make: (w, h) => new fabric.Rect({ width: w, height: h, rx: Math.min(w, h) * 0.12, ry: Math.min(w, h) * 0.12 }) },
    circle:  { svg: '<circle cx="50" cy="50" r="40" fill="#aaa"/>', make: (w, h) => new fabric.Circle({ radius: Math.min(w, h) / 2 }) },
    ellipse: { svg: '<ellipse cx="50" cy="50" rx="42" ry="30" fill="#aaa"/>', make: (w, h) => new fabric.Ellipse({ rx: w / 2, ry: h / 2 }) },
    heart:   { svg: '<path d="M50 88S10 62 10 35a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 27-40 53-40 53z" fill="#aaa"/>', d: "M50 88S10 62 10 35a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 27-40 53-40 53z", square: true },
    star:    { svg: '<polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" fill="#aaa"/>', d: "M50 6L61 38H95L67 58L78 92L50 72L22 92L33 58L5 38H39Z", square: true },
    hexagon: { svg: '<polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="#aaa"/>', d: "M50 5L90 27V73L50 95L10 73V27Z", square: true },
    arch:    { svg: '<path d="M15 92V45a35 35 0 0 1 70 0v47z" fill="#aaa"/>', d: "M15 92V45a35 35 0 0 1 70 0v47z" },
    tilt:    { svg: '<polygon points="22,10 92,18 78,90 8,82" fill="#aaa"/>', d: "M22 10L92 18L78 90L8 82Z" },
    blob:    { svg: '<path d="M70 12c16 8 24 28 18 46s-22 32-42 30S10 72 10 52 22 18 38 12s20-8 32 0z" fill="#aaa"/>', d: "M70 12c16 8 24 28 18 46s-22 32-42 30S10 72 10 52 22 18 38 12s20-8 32 0z" }
  };
  $("#mask-grid").innerHTML = Object.entries(MASKS).map(([k, m]) => `<button type="button" data-mask="${k}" title="${k === "none" ? "No shape" : k}"><svg viewBox="0 0 100 100">${m.svg}</svg></button>`).join("");
  function buildMask(o, key) {
    const m = MASKS[key]; if (!m || key === "none") return null;
    const w = o.width, h = o.height;
    let shape;
    if (m.make) shape = m.make(w, h);
    else {
      shape = new fabric.Path(m.d);
      const sw = m.square ? Math.min(w, h) : w, sh = m.square ? Math.min(w, h) : h;
      shape.set({ scaleX: sw / shape.width, scaleY: sh / shape.height });
    }
    shape.set({ originX: "center", originY: "center", left: 0, top: 0 });
    return shape;
  }
  function applyMask(o, key) {
    o.mdcMask = key === "none" ? null : key;
    o.clipPath = buildMask(o, key) || undefined;
    o.dirty = true; c.requestRenderAll();
  }
  function applyCrop(o, z, x, y) {
    const el = o._originalElement || o.getElement(); if (!el) return;
    const nw = el.naturalWidth || el.width, nh = el.naturalHeight || el.height;
    const DW = o.width * o.scaleX, DH = o.height * o.scaleY, a = DW / DH;
    let bw, bh; if (nw / nh > a) { bh = nh; bw = nh * a; } else { bw = nw; bh = nw / a; }
    const vw = bw / z, vh = bh / z;
    o.set({ cropX: (nw - vw) / 2 * (1 + x), cropY: (nh - vh) / 2 * (1 + y), width: vw, height: vh, scaleX: DW / vw, scaleY: DH / vh });
    o.mdcCrop = { z, x, y };
    if (o.mdcMask) applyMask(o, o.mdcMask);
    o.setCoords(); c.requestRenderAll();
  }
  function syncMaskPop() {
    const o = active(); if (!o || o.type !== "image") return;
    $$("#mask-grid [data-mask]").forEach(b => b.classList.toggle("on", (o.mdcMask || "none") === b.dataset.mask));
    const cr = o.mdcCrop || { z: 1, x: 0, y: 0 };
    $("#m-zoom").value = Math.round(cr.z * 100); $("#m-x").value = Math.round(cr.x * 100); $("#m-y").value = Math.round(cr.y * 100);
  }
  $("#p-mask").onclick = () => {
    const p = $("#pop-mask"), show = p.hidden;
    $$(".ds-pop").forEach(x => { if (x !== p) x.hidden = true; });
    p.hidden = !show; if (show) syncMaskPop();
  };
  $("#mask-grid").addEventListener("click", e => {
    const b = e.target.closest("[data-mask]"); const o = active(); if (!b || !o || o.type !== "image") return;
    applyMask(o, b.dataset.mask); syncMaskPop(); S.saveState();
  });
  const cropInput = () => { const o = active(); if (!o || o.type !== "image") return; applyCrop(o, +$("#m-zoom").value / 100, +$("#m-x").value / 100, +$("#m-y").value / 100); };
  ["#m-zoom", "#m-x", "#m-y"].forEach(s => { $(s).addEventListener("input", cropInput); $(s).addEventListener("change", () => S.saveState()); });
  $("#m-reset").onclick = () => { $("#m-zoom").value = 100; $("#m-x").value = 0; $("#m-y").value = 0; cropInput(); S.saveState(); };
  document.addEventListener("click", e => { if (!e.target.closest("#pop-mask") && !e.target.closest("#p-mask") && !e.target.closest(".canvas-container")) $("#pop-mask").hidden = true; });

  /* ======================================================================
     10) BRAND KIT
     ====================================================================== */
  const BRAND_KEY = "mdc_brand_v1";
  const brand = Object.assign({ logo: "", colors: ["#111827", "#f59e0b", "#ffffff", "#2563eb", "#16a34a"], fh: "Montserrat", fb: "Poppins", name: "", phone: "", web: "" }, store.get(BRAND_KEY, {}));
  const saveBrand = () => { if (!store.set(BRAND_KEY, brand)) S.toast("Logo is too large to save. Try a smaller image."); };
  const fontOpts = S.FONTS.map(f => `<option value="${f}">${f}</option>`).join("");
  $("#brand-font-h").innerHTML = fontOpts; $("#brand-font-b").innerHTML = fontOpts;
  function renderBrand() {
    $("#brand-logo").innerHTML = brand.logo ? `<img src="${brand.logo}" alt="Your logo">` : "<span>No logo yet</span>";
    $("#brand-colors").innerHTML = brand.colors.map((col, i) => `<div class="sw"><input type="color" value="${col}" data-bc="${i}" aria-label="Brand colour ${i + 1}"><button type="button" data-use="${i}" title="Apply to selected">Use</button></div>`).join("");
    $("#brand-font-h").value = brand.fh; $("#brand-font-b").value = brand.fb;
    $("#brand-name").value = brand.name; $("#brand-phone").value = brand.phone; $("#brand-web").value = brand.web;
  }
  renderBrand();
  $("#brand-logo-file").addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    brand.logo = await S.readImage(f, 600); saveBrand(); renderBrand(); S.toast("Logo saved in your brand kit ✔");
  });
  $("#brand-logo-add").onclick = async () => {
    if (!brand.logo) { S.toast("Upload your logo first."); return; }
    c.discardActiveObject();
    const img = await S.addImageURL(brand.logo, "Logo");
    const [W, H] = S.size; const s = Math.min(W, H) * 0.18 / Math.max(img.width, img.height);
    img.set({ scaleX: s, scaleY: s, left: W * 0.05, top: H * 0.04 }); img.setCoords(); c.requestRenderAll(); S.saveState();
  };
  $("#brand-colors").addEventListener("input", e => { const i = e.target.dataset.bc; if (i == null) return; brand.colors[+i] = e.target.value; saveBrand(); });
  $("#brand-colors").addEventListener("click", e => {
    const b = e.target.closest("[data-use]"); if (!b) return;
    const v = brand.colors[+b.dataset.use], o = active();
    if (!o) { S.setBackground(v); S.saveState(); S.toast("Background colour applied"); return; }
    const each = x => { if (x.type === "line") x.set({ stroke: v }); else if (x.type !== "image" && x.mdcType !== "frame") x.set({ fill: v }); };
    if (o.type === "activeSelection") o.getObjects().forEach(each); else each(o);
    c.requestRenderAll(); S.saveState();
  });
  ["#brand-font-h", "#brand-font-b"].forEach(s => $(s).addEventListener("change", () => { brand.fh = $("#brand-font-h").value; brand.fb = $("#brand-font-b").value; saveBrand(); }));
  ["#brand-name", "#brand-phone", "#brand-web"].forEach(s => $(s).addEventListener("change", () => { brand.name = $("#brand-name").value.trim(); brand.phone = $("#brand-phone").value.trim(); brand.web = $("#brand-web").value.trim(); saveBrand(); }));
  const contrast = (a, b) => {
    const L = col => { const [r, g, bb] = new fabric.Color(col).getSource().slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * bb; };
    try { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); } catch (e) { return 21; }
  };
  $("#brand-apply").onclick = async () => {
    const objs = S.userObjects();
    if (!objs.length) { S.toast("Add a template or some text first."); return; }
    await Promise.all([S.fontLoad(brand.fh), S.fontLoad(brand.fb)]);
    // fonts: the biggest texts get the heading font, the rest the body font (Urdu text is left as it is)
    const texts = objs.filter(o => o.type === "textbox" && !S.isRTL(o.text));
    const max = Math.max(0, ...texts.map(t => t.fontSize * t.scaleY));
    const DISPLAY = ["Anton", "Bebas Neue", "Pacifico", "Lobster"];
    texts.forEach(t => {
      const head = t.fontSize * t.scaleY >= max * 0.6, f = head ? brand.fh : brand.fb;
      t.set({ fontFamily: f, fontWeight: DISPLAY.includes(f) ? "normal" : head ? 800 : (+t.fontWeight >= 600 || t.fontWeight === "bold" ? 600 : "normal") });
      t.initDimensions(); t.setCoords();
    });
    // colours: background → colour 1, the most used shape colours → colours 2, 4, 5
    const newBg = brand.colors[0];
    const counts = {};
    objs.forEach(o => { if (o.type !== "textbox" && o.type !== "image" && o.mdcType !== "frame" && typeof o.fill === "string" && o.fill !== "rgba(0,0,0,0)" && o.fill !== "transparent") counts[o.fill] = (counts[o.fill] || 0) + 1; });
    const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const map = {}; [1, 3, 4].forEach((ci, k) => { if (ranked[k]) map[ranked[k]] = brand.colors[ci]; });
    objs.forEach(o => { if (map[o.fill] && o.type !== "textbox") o.set({ fill: map[o.fill] }); if (o.stroke && map[o.stroke]) o.set({ stroke: map[o.stroke] }); });
    S.setBackground(newBg);
    // keep text readable on the new background
    texts.concat(objs.filter(o => o.type === "textbox" && S.isRTL(o.text))).forEach(t => {
      if (typeof t.fill === "string" && contrast(t.fill, newBg) < 2.2) t.set({ fill: isDarkColor(newBg) ? brand.colors[2] && !isDarkColor(brand.colors[2]) ? brand.colors[2] : "#ffffff" : "#111111" });
    });
    c.requestRenderAll(); S.saveState();
    S.toast("Brand applied ✔ Not quite right? Press Ctrl+Z to undo.", 4000);
  };
  $("#brand-contact").onclick = async () => {
    const parts = [brand.phone && "📞 " + brand.phone, brand.web].filter(Boolean);
    const line = [brand.name, parts.join("  ·  ")].filter(Boolean).join("   |   ");
    if (!line) { S.toast("Fill in your business name, phone or website first."); return; }
    await S.fontLoad(brand.fb, line);
    const [W, H] = S.size, m = Math.min(W, H) / 1080;
    const bg = S.bgObj(), dark = bg && typeof bg.fill === "string" ? isDarkColor(bg.fill) : false;
    const t = S.makeObj({ t: "text", text: line, size: Math.round(34 * m), font: brand.fb, weight: 600, w: W * 0.9, align: "center", fill: dark ? "#ffffff" : "#111111" });
    t.name = "Contact line"; c.add(t); t.set({ left: W * 0.05, top: H - t.height - H * 0.04 }); t.setCoords(); c.setActiveObject(t); c.requestRenderAll(); S.saveState();
  };

  /* ======================================================================
     11) PRINT ORDER and "DESIGN IT FOR ME"
     ====================================================================== */
  const openWA = text => window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  $$('[data-act="print"]').forEach(b => b.addEventListener("click", () => { closeMenus(); openDialog("#dlg-print"); }));
  $$('[data-act="designforme"]').forEach(b => b.addEventListener("click", () => { closeMenus(); openDialog("#dlg-dfm"); }));
  $("#print-form").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target), [W, H] = S.size;
    if (pages.length > 1) exportPDF(); else S.download("png2");
    openWA(["Hello MALIK DATA CENTRE! I want to order prints from Postly Design Studio.", "",
      `Product: ${f.get("product")}`, `Quantity: ${f.get("qty")}`, `City: ${f.get("city")}`, `Name: ${f.get("name")}`,
      f.get("notes") ? `Notes: ${f.get("notes")}` : "", `Design: ${W} × ${H} px, ${pages.length} page(s)`, "",
      "I have downloaded my design and will attach it here."].filter(x => x !== "").join("\n"));
    closeDialog($("#dlg-print"));
    S.toast("Your design was downloaded. Attach it in the WhatsApp chat that just opened.", 6000);
  });
  $("#dlg-dfm form").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (f.get("attach") && S.userObjects().length) S.download("png");
    openWA(["Hello MALIK DATA CENTRE! Please design this for me.", "", `Type: ${f.get("type")}`, `Details: ${f.get("details")}`,
      f.get("deadline") ? `Needed by: ${f.get("deadline")}` : "", f.get("attach") && S.userObjects().length ? "I'll attach my draft from Postly Design Studio." : ""].filter(Boolean).join("\n"));
    closeDialog($("#dlg-dfm"));
  });

  /* ---------------- start ---------------- */
  initPages();
  window.MDC_FEATURES = { get pages() { return pages; }, get cur() { return cur; }, goToPage, addPage, replacePages, exportPDF, exportZIP, renderSnapshot, scaledSnapshot, applyMask, applyCrop, searchPhotos, searchIcons, brand };
})();
