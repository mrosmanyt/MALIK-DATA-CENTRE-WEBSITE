/* ==========================================================================
   MDC Design Studio — editor engine (Fabric.js 5)
   Runs fully in the browser. No server needed.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.fabric) { document.body.innerHTML = '<p style="padding:24px;color:#fff;font-family:sans-serif">Editor could not load. Please check your internet connection and refresh.</p>'; return; }

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const FONTS = ["Outfit", "Inter", "Poppins", "Montserrat", "Anton", "Bebas Neue", "Playfair Display", "Pacifico", "Lobster", "Noto Nastaliq Urdu", "Amiri", "Arial", "Georgia", "Impact", "Courier New"];
  const PROPS = ["mdcType", "mdcBg", "mdcF", "mdcFrame", "name", "lockedByUser", "selectable", "evented", "hasControls", "hasBorders",
    "lockMovementX", "lockMovementY", "lockScalingX", "lockScalingY", "lockRotation", "editable", "direction"];
  const STORE_KEY = "mdc_design_v1";
  const isRTL = s => /[؀-ۿݐ-ݿ]/.test(s || "");

  fabric.Object.prototype.set({
    transparentCorners: false, cornerColor: "#ffffff", cornerStrokeColor: "#7c5cff", borderColor: "#7c5cff",
    cornerStyle: "circle", cornerSize: 13, padding: 4, borderScaleFactor: 2
  });
  fabric.Textbox.prototype.set({ splitByGrapheme: false });

  /* ---------------- state ---------------- */
  let W = 1080, H = 1080, zoom = 1, autoFit = true;
  let history = [], hIndex = -1, restoring = false, saveTimer = null, storeTimer = null;
  let clipboard = null, pendingFrame = null;
  const uploads = [];

  const canvas = new fabric.Canvas("ds-canvas", {
    preserveObjectStacking: true, backgroundColor: "transparent", stopContextMenu: true, fireRightClick: false,
    selectionColor: "rgba(124,92,255,.12)", selectionBorderColor: "#7c5cff", selectionLineWidth: 1.5
  });

  /* ---------------- helpers ---------------- */
  function toast(msg, ms = 2600) {
    const t = $("#ds-toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
  }
  function makeFill(spec, w, h) {
    if (!spec || typeof spec === "string") return spec || "#ffffff";
    const [deg, ...stops] = spec.g;
    const a = (deg * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a);
    const L = Math.abs((w / 2) * dx) + Math.abs((h / 2) * dy);
    return new fabric.Gradient({
      type: "linear", gradientUnits: "pixels",
      coords: { x1: w / 2 - dx * L, y1: h / 2 - dy * L, x2: w / 2 + dx * L, y2: h / 2 + dy * L },
      colorStops: stops.map(([color, offset]) => ({ color, offset }))
    });
  }
  function firstColor(spec) { return !spec ? "#ffffff" : typeof spec === "string" ? spec : spec.g[1][0]; }
  function isDark(color) {
    const c = new fabric.Color(color); const [r, g, b, a] = c.getSource();
    if (a === 0) return false;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
  }
  function shadowOf(s) { return s ? new fabric.Shadow({ color: s.c, blur: s.b, offsetX: s.x || 0, offsetY: s.y || 0 }) : null; }
  function bgObj(c = canvas) { return c.getObjects().find(o => o.mdcType === "bg"); }
  function userObjects() { return canvas.getObjects().filter(o => o.mdcType !== "bg"); }
  function fontLoad(font, text) {
    if (!document.fonts || !font) return Promise.resolve();
    return document.fonts.load(`40px "${font}"`, text || "Aa").catch(() => {});
  }
  function starPoints(r, n, inner) {
    const pts = []; const step = Math.PI / n;
    for (let i = 0; i < 2 * n; i++) { const rr = i % 2 ? r * inner : r; const a = i * step - Math.PI / 2; pts.push({ x: r + rr * Math.cos(a), y: r + rr * Math.sin(a) }); }
    return pts;
  }

  /* ---------------- object factory ---------------- */
  function makeFrame(spec) {
    const w = spec.w, h = spec.h, isC = spec.shape === "circle";
    const base = isC ? new fabric.Circle({ radius: Math.min(w, h) / 2, originX: "center", originY: "center" })
                     : new fabric.Rect({ width: w, height: h, rx: spec.rx || 0, ry: spec.rx || 0, originX: "center", originY: "center" });
    base.set({ fill: "rgba(148,163,184,.28)", stroke: "rgba(148,163,184,.9)", strokeWidth: Math.max(3, w / 160), strokeDashArray: [18, 12] });
    const icon = new fabric.Text("＋", { fontSize: Math.min(w, h) * 0.22, fill: "rgba(226,232,240,.95)", originX: "center", originY: "center", top: -Math.min(w, h) * 0.06, fontFamily: "Inter" });
    const label = new fabric.Text(spec.name || "Add photo", { fontSize: Math.max(18, Math.min(w, h) * 0.075), fill: "rgba(226,232,240,.95)", originX: "center", originY: "center", top: Math.min(w, h) * 0.12, fontFamily: "Inter", fontWeight: 600 });
    const g = new fabric.Group([base, icon, label], { left: spec.l, top: spec.top, subTargetCheck: false });
    g.set({ mdcType: "frame", mdcFrame: { w, h, rx: spec.rx || 0, shape: spec.shape || "rect" }, name: spec.name || "Photo frame" });
    return g;
  }

  function makeObj(spec) {
    let o;
    const common = { left: spec.l || 0, top: spec.top || 0, angle: spec.angle || 0, opacity: spec.opacity == null ? 1 : spec.opacity };
    switch (spec.t) {
      case "text": {
        const rtl = isRTL(spec.text);
        o = new fabric.Textbox(spec.text, Object.assign({}, common, {
          width: spec.w || 600, fontSize: spec.size || 60, fontFamily: spec.font || "Outfit", fill: spec.fill || "#111",
          fontWeight: spec.weight || (["Anton", "Bebas Neue", "Pacifico", "Lobster"].includes(spec.font) ? "normal" : "bold"),
          fontStyle: spec.style || "normal", textAlign: spec.align || (rtl ? "right" : "left"),
          lineHeight: spec.lh || (rtl ? 2 : 1.16), charSpacing: spec.cs || 0,
          stroke: spec.stroke || null, strokeWidth: spec.sw || 0, paintFirst: "stroke", strokeLineJoin: "round",
          textBackgroundColor: spec.hl || "", shadow: shadowOf(spec.shadow), direction: rtl ? "rtl" : "ltr",
          name: spec.name || "Text"
        }));
        o.mdcType = "text";
        break;
      }
      case "rect":
        o = new fabric.Rect(Object.assign({}, common, { width: spec.w, height: spec.h, rx: spec.rx || 0, ry: spec.rx || 0,
          fill: makeFill(spec.fill, spec.w, spec.h), stroke: spec.stroke || null, strokeWidth: spec.sw || 0, shadow: shadowOf(spec.shadow), name: spec.name || "Rectangle" }));
        o.mdcType = "shape"; break;
      case "circle":
        o = new fabric.Circle(Object.assign({}, common, { radius: spec.r, fill: makeFill(spec.fill, spec.r * 2, spec.r * 2),
          stroke: spec.stroke || null, strokeWidth: spec.sw || 0, shadow: shadowOf(spec.shadow), name: spec.name || "Circle" }));
        o.mdcType = "shape"; break;
      case "tri":
        o = new fabric.Triangle(Object.assign({}, common, { width: spec.w, height: spec.h, fill: makeFill(spec.fill, spec.w, spec.h), stroke: spec.stroke || null, strokeWidth: spec.sw || 0, name: "Triangle" }));
        o.mdcType = "shape"; break;
      case "star":
        o = new fabric.Polygon(starPoints(spec.r, spec.points || 5, spec.inner || 0.45), Object.assign({}, common, {
          fill: makeFill(spec.fill, spec.r * 2, spec.r * 2), stroke: spec.stroke || null, strokeWidth: spec.sw || 0, strokeLineJoin: "round", name: spec.name || "Star" }));
        o.mdcType = "shape"; break;
      case "path":
        o = new fabric.Path(spec.d, Object.assign({}, common, { fill: spec.fill || "#7c5cff", stroke: spec.stroke || null, strokeWidth: spec.sw || 0, name: spec.name || "Shape" }));
        if (spec.size) o.scaleToWidth(spec.size);
        o.mdcType = "shape"; break;
      case "line":
        o = new fabric.Line([spec.x1, spec.y1, spec.x2, spec.y2], { stroke: spec.stroke || "#111", strokeWidth: spec.sw || 6, strokeLineCap: "round", name: "Line" });
        o.mdcType = "shape"; break;
      case "photo":
        o = makeFrame(spec); break;
      default: return null;
    }
    return o;
  }

  function setBackground(spec, c = canvas, w = W, h = H) {
    let bg = bgObj(c);
    if (!bg) {
      bg = new fabric.Rect({ left: 0, top: 0, selectable: false, evented: false, hasControls: false, hasBorders: false, name: "Background" });
      bg.mdcType = "bg"; c.add(bg); c.sendToBack(bg);
    }
    bg.set({ width: w, height: h, fill: makeFill(spec, w, h) });
    bg.mdcBg = spec;
    bg.setCoords();
    c.requestRenderAll();
  }

  async function buildTemplate(c, tpl) {
    const fonts = [...new Set(tpl.objects.filter(o => o.t === "text").map(o => o.font || "Outfit"))];
    await Promise.all(fonts.map(f => fontLoad(f, tpl.objects.filter(o => o.font === f).map(o => o.text).join(" "))));
    c.clear();
    setBackground(tpl.bg, c, tpl.w, tpl.h);
    tpl.objects.forEach(s => { const o = makeObj(s); if (o) c.add(o); });
    c.requestRenderAll();
  }

  /* ---------------- sizing / zoom ---------------- */
  function applyZoom(z) {
    zoom = Math.max(0.05, Math.min(4, z));
    canvas.setDimensions({ width: Math.round(W * zoom), height: Math.round(H * zoom) });
    canvas.setZoom(zoom);
    $("#zoom-label").textContent = Math.round(zoom * 100) + "%";
    canvas.requestRenderAll();
  }
  function fit() {
    const st = $("#ds-stage"); const pad = window.innerWidth < 860 ? 28 : 64;
    const z = Math.min((st.clientWidth - pad) / W, (st.clientHeight - pad) / H);
    autoFit = true; applyZoom(z > 0 ? z : 0.3);
  }
  function setSize(w, h, scaleContent) {
    const oldW = W, oldH = H;
    W = Math.round(w); H = Math.round(h);
    if (scaleContent) {
      const s = Math.min(W / oldW, H / oldH), ox = (W - oldW * s) / 2, oy = (H - oldH * s) / 2;
      userObjects().forEach(o => {
        o.set({ left: o.left * s + ox, top: o.top * s + oy, scaleX: o.scaleX * s, scaleY: o.scaleY * s }); o.setCoords();
      });
    }
    const bg = bgObj(); setBackground(bg ? bg.mdcBg : "#ffffff");
    $("#size-label").textContent = `${W} × ${H}`;
    fit();
  }

  /* ---------------- history & autosave ---------------- */
  function snapshot() { return JSON.stringify({ v: 1, w: W, h: H, json: canvas.toJSON(PROPS) }); }
  function saveState() {
    if (restoring) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const s = snapshot();
      if (history[hIndex] === s) return;
      history = history.slice(0, hIndex + 1); history.push(s);
      if (history.length > 60) history.shift();
      hIndex = history.length - 1;
      updateUndo(); refreshLayers();
      clearTimeout(storeTimer);
      storeTimer = setTimeout(() => {
        try { localStorage.setItem(STORE_KEY, s); }
        catch (e) { if (!saveState._warned) { saveState._warned = true; toast("Design is too large to auto-save. Use Download → Save project."); } }
      }, 800);
    }, 250);
  }
  function loadSnapshot(str, cb) {
    let data; try { data = typeof str === "string" ? JSON.parse(str) : str; } catch (e) { toast("Could not open this file."); return; }
    if (!data || !data.json) { toast("This is not an MDC design file."); return; }
    restoring = true;
    W = data.w; H = data.h; $("#size-label").textContent = `${W} × ${H}`;
    const fonts = (data.json.objects || []).filter(o => o.fontFamily).map(o => o.fontFamily);
    Promise.all([...new Set(fonts)].map(f => fontLoad(f))).then(() => {
      canvas.loadFromJSON(data.json, () => {
        const bg = bgObj(); if (bg) bg.set({ selectable: false, evented: false });
        canvas.getObjects().forEach(o => { if (o.lockedByUser) applyLock(o, true); });
        if (autoFit) fit(); else applyZoom(zoom);
        canvas.requestRenderAll(); restoring = false; refreshLayers(); updateCtx(); cb && cb();
      });
    });
  }
  function undo() { if (hIndex > 0) { hIndex--; loadSnapshot(history[hIndex], updateUndo); } }
  function redo() { if (hIndex < history.length - 1) { hIndex++; loadSnapshot(history[hIndex], updateUndo); } }
  function updateUndo() { $("#btn-undo").disabled = hIndex <= 0; $("#btn-redo").disabled = hIndex >= history.length - 1; }

  canvas.on("object:added", saveState);
  canvas.on("object:removed", saveState);
  canvas.on("object:modified", saveState);
  canvas.on("text:changed", saveState);
  canvas.on("text:editing:exited", e => {
    const o = e.target; if (!o) return;
    const rtl = isRTL(o.text);
    if (rtl && o.direction !== "rtl") { o.set({ direction: "rtl", textAlign: "right" }); }
    if (!o.text.trim()) canvas.remove(o);
    canvas.requestRenderAll(); saveState();
  });

  /* ---------------- adding things ---------------- */
  function bgIsDark() { const bg = bgObj(); return isDark(firstColor(bg && bg.mdcBg)); }
  function centerAdd(o, select = true) {
    canvas.add(o);
    o.setCoords();
    const br = o.getBoundingRect(true, true);
    o.set({ left: o.left + (W / 2 - (br.left + br.width / 2)), top: o.top + (H / 2 - (br.top + br.height / 2)) });
    o.setCoords();
    if (select) { canvas.setActiveObject(o); }
    canvas.requestRenderAll();
    closeMobilePanel();
    return o;
  }
  async function addText(kind, textOverride) {
    const light = bgIsDark() ? "#ffffff" : "#111111";
    const m = Math.min(W, H) / 1080;
    const map = {
      heading: { text: "Add a heading", size: 110 * m, font: "Outfit", weight: 900, w: W * 0.8 },
      subheading: { text: "Add a subheading", size: 62 * m, font: "Outfit", weight: 600, w: W * 0.7 },
      body: { text: "Add a little bit of body text", size: 38 * m, font: "Inter", weight: "normal", w: W * 0.6 },
      urdu: { text: "یہاں اپنا متن لکھیں", size: 84 * m, font: "Noto Nastaliq Urdu", weight: "normal", w: W * 0.8 }
    };
    const s = Object.assign({}, map[kind] || map.heading);
    if (textOverride) { s.text = textOverride; if (isRTL(textOverride)) { s.font = "Noto Nastaliq Urdu"; s.weight = "normal"; } }
    await fontLoad(s.font, s.text);
    const o = makeObj({ t: "text", text: s.text, size: Math.round(s.size), font: s.font, weight: s.weight, w: s.w, fill: light, align: isRTL(s.text) ? "right" : "center" });
    centerAdd(o);
  }
  async function addStyled(st) {
    await fontLoad(st.font, st.text);
    const m = Math.min(W, H) / 1080;
    const spec = Object.assign({}, st, { size: Math.round(st.size * m), w: W * 0.8, align: isRTL(st.text) ? "right" : "center" });
    if (spec.fill === "#111" && bgIsDark()) spec.fill = "#ffffff";
    centerAdd(makeObj(spec));
  }

  const SHAPES = [
    { n: "Square", svg: '<rect x="10" y="10" width="80" height="80" fill="#7c5cff"/>', s: () => ({ t: "rect", w: 400, h: 400, fill: "#7c5cff" }) },
    { n: "Rounded", svg: '<rect x="10" y="10" width="80" height="80" rx="20" fill="#22c55e"/>', s: () => ({ t: "rect", w: 400, h: 400, rx: 70, fill: "#22c55e" }) },
    { n: "Circle", svg: '<circle cx="50" cy="50" r="40" fill="#f59e0b"/>', s: () => ({ t: "circle", r: 200, fill: "#f59e0b" }) },
    { n: "Triangle", svg: '<polygon points="50,10 90,90 10,90" fill="#ef4444"/>', s: () => ({ t: "tri", w: 400, h: 360, fill: "#ef4444" }) },
    { n: "Star", svg: '<polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" fill="#facc15"/>', s: () => ({ t: "star", r: 200, points: 5, inner: 0.45, fill: "#facc15" }) },
    { n: "Burst", svg: '<polygon points="' + starPoints(45, 12, 0.78).map(p => `${p.x + 5},${p.y + 5}`).join(" ") + '" fill="#ec4899"/>', s: () => ({ t: "star", r: 200, points: 12, inner: 0.78, fill: "#ec4899" }) },
    { n: "Line", svg: '<line x1="10" y1="50" x2="90" y2="50" stroke="#e5e7eb" stroke-width="8" stroke-linecap="round"/>', s: () => ({ t: "line", x1: 0, y1: 0, x2: 500, y2: 0, stroke: bgIsDark() ? "#ffffff" : "#111111", sw: 10 }) },
    { n: "Arrow", svg: '<path d="M10 42h55V25l25 25-25 25V58H10z" fill="#38bdf8"/>', s: () => ({ t: "path", d: "M10 42h55V25l25 25-25 25V58H10z", fill: "#38bdf8", size: 400 }) },
    { n: "Heart", svg: '<path d="M50 88S10 62 10 35a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 27-40 53-40 53z" fill="#f43f5e"/>', s: () => ({ t: "path", d: "M50 88S10 62 10 35a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 27-40 53-40 53z", fill: "#f43f5e", size: 380 }) },
    { n: "Speech", svg: '<path d="M15 15h70a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H45L25 88V71H15a8 8 0 0 1-8-8V23a8 8 0 0 1 8-8z" fill="#ffffff"/>', s: () => ({ t: "path", d: "M15 15h70a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H45L25 88V71H15a8 8 0 0 1-8-8V23a8 8 0 0 1 8-8z", fill: "#ffffff", size: 420 }) },
    { n: "Ribbon", svg: '<path d="M5 30h90l-10 20 10 20H5l10-20z" fill="#e11d48"/>', s: () => ({ t: "path", d: "M5 30h90l-10 20 10 20H5l10-20z", fill: "#e11d48", size: 600 }) },
    { n: "Photo frame", svg: '<rect x="10" y="18" width="80" height="64" rx="8" fill="none" stroke="#94a3b8" stroke-width="5" stroke-dasharray="9 6"/><text x="50" y="58" font-size="26" text-anchor="middle" fill="#94a3b8">+</text>', s: () => ({ t: "photo", w: Math.round(W * 0.5), h: Math.round(W * 0.5), rx: 24, name: "Photo frame" }) },
    { n: "Circle frame", svg: '<circle cx="50" cy="50" r="38" fill="none" stroke="#94a3b8" stroke-width="5" stroke-dasharray="9 6"/><text x="50" y="58" font-size="26" text-anchor="middle" fill="#94a3b8">+</text>', s: () => ({ t: "photo", w: Math.round(W * 0.45), h: Math.round(W * 0.45), shape: "circle", name: "Circle frame" }) }
  ];
  const BADGES = [
    { n: "50% OFF", svg: '<polygon points="' + starPoints(45, 14, 0.82).map(p => `${p.x + 5},${p.y + 5}`).join(" ") + '" fill="#facc15"/><text x="50" y="47" font-size="15" font-weight="900" text-anchor="middle" fill="#111">50%</text><text x="50" y="64" font-size="13" font-weight="900" text-anchor="middle" fill="#111">OFF</text>',
      add: () => badge([{ t: "star", r: 170, points: 14, inner: 0.82, fill: "#facc15" }, { t: "text", text: "50%\nOFF", size: 92, font: "Anton", fill: "#111", align: "center", w: 300, lh: 0.95 }]) },
    { n: "NEW", svg: '<circle cx="50" cy="50" r="40" fill="#ef4444"/><text x="50" y="58" font-size="22" font-weight="900" text-anchor="middle" fill="#fff">NEW</text>',
      add: () => badge([{ t: "circle", r: 130, fill: "#ef4444" }, { t: "text", text: "NEW", size: 96, font: "Anton", fill: "#fff", align: "center", w: 240 }]) },
    { n: "SALE", svg: '<rect x="8" y="30" width="84" height="40" rx="6" fill="#111"/><text x="50" y="58" font-size="22" font-weight="900" text-anchor="middle" fill="#facc15">SALE</text>',
      add: () => badge([{ t: "rect", w: 420, h: 170, rx: 20, fill: "#111111" }, { t: "text", text: "SALE", size: 130, font: "Anton", fill: "#facc15", align: "center", w: 400 }]) },
    { n: "FREE DELIVERY", svg: '<rect x="5" y="34" width="90" height="32" rx="16" fill="#22c55e"/><text x="50" y="55" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">FREE DELIVERY</text>',
      add: () => badge([{ t: "rect", w: 560, h: 110, rx: 55, fill: "#22c55e" }, { t: "text", text: "FREE DELIVERY", size: 56, font: "Montserrat", weight: 900, fill: "#fff", align: "center", w: 540 }]) },
    { n: "LIMITED", svg: '<rect x="5" y="34" width="90" height="32" rx="4" fill="none" stroke="#f43f5e" stroke-width="4"/><text x="50" y="55" font-size="12" font-weight="800" text-anchor="middle" fill="#f43f5e">LIMITED</text>',
      add: () => badge([{ t: "rect", w: 520, h: 120, rx: 10, fill: "rgba(0,0,0,0)", stroke: "#f43f5e", sw: 8 }, { t: "text", text: "LIMITED OFFER", size: 60, font: "Montserrat", weight: 900, fill: "#f43f5e", align: "center", w: 500 }]) },
    { n: "Rating", svg: '<text x="50" y="58" font-size="17" text-anchor="middle" fill="#facc15">★★★★★</text>',
      add: () => centerAdd(makeObj({ t: "text", text: "★★★★★", size: 110, font: "Inter", fill: "#facc15", align: "center", w: 700 })) },
    { n: "Order now", svg: '<rect x="8" y="34" width="84" height="32" rx="16" fill="#7c5cff"/><text x="50" y="55" font-size="11" font-weight="800" text-anchor="middle" fill="#fff">ORDER NOW</text>',
      add: () => badge([{ t: "rect", w: 460, h: 120, rx: 60, fill: "#7c5cff" }, { t: "text", text: "ORDER NOW", size: 62, font: "Montserrat", weight: 900, fill: "#fff", align: "center", w: 440 }]) },
    { n: "WhatsApp", svg: '<rect x="5" y="34" width="90" height="32" rx="16" fill="#25d366"/><text x="50" y="55" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">📞 03XX-XXXXXXX</text>',
      add: () => badge([{ t: "rect", w: 600, h: 110, rx: 55, fill: "#25d366" }, { t: "text", text: "📞 03XX-XXXXXXX", size: 58, font: "Poppins", weight: 800, fill: "#fff", align: "center", w: 580 }]) }
  ];
  async function badge(specs) {
    const m = Math.min(W, H) / 1080;
    await Promise.all(specs.filter(s => s.font).map(s => fontLoad(s.font, s.text)));
    const objs = specs.map(s => {
      const sp = Object.assign({}, s);
      ["r", "w", "h", "size", "sw"].forEach(k => { if (sp[k]) sp[k] = sp[k] * m; });
      return makeObj(sp);
    });
    // center every piece on the same point
    objs.forEach(o => { canvas.add(o); o.setCoords(); const br = o.getBoundingRect(true, true);
      o.set({ left: o.left + (W / 2 - (br.left + br.width / 2)), top: o.top + (H / 2 - (br.top + br.height / 2)) }); o.setCoords(); });
    const sel = new fabric.ActiveSelection(objs, { canvas });
    canvas.setActiveObject(sel); canvas.requestRenderAll(); closeMobilePanel();
  }
  const EMOJI = ["🔥", "⭐", "✨", "💯", "✅", "❌", "👉", "👇", "❤️", "😍", "😱", "🤯", "😂", "👍", "🎉", "🎁", "🛒", "💰", "💸", "📞", "📍", "🚚", "🕌", "🌙", "☪️", "🌹", "🍔", "🍕", "☕", "📚", "🎓", "💼", "🏠", "🚗", "📱", "💻"];

  /* ---------------- images ---------------- */
  function readImage(file, maxSide = 2000) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const s = Math.min(1, maxSide / Math.max(img.width, img.height));
          if (s === 1 && file.size < 1.5e6) return resolve(fr.result);
          const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          const png = /png|webp|gif/.test(file.type);
          resolve(c.toDataURL(png ? "image/png" : "image/jpeg", 0.9));
        };
        img.onerror = reject; img.src = fr.result;
      };
      fr.onerror = reject; fr.readAsDataURL(file);
    });
  }
  function fillFrame(frame, url) {
    return new Promise(res => fabric.Image.fromURL(url, img => {
      const f = frame.mdcFrame; const fw = f.w * frame.scaleX, fh = f.h * frame.scaleY;
      const iw = img.width, ih = img.height, s = Math.max(fw / iw, fh / ih);
      const vw = fw / s, vh = fh / s;
      img.set({ cropX: (iw - vw) / 2, cropY: (ih - vh) / 2, width: vw, height: vh, scaleX: s, scaleY: s,
        left: frame.left, top: frame.top, angle: frame.angle, name: frame.name || "Photo" });
      if (f.shape === "circle") img.clipPath = new fabric.Circle({ radius: Math.min(vw, vh) / 2, originX: "center", originY: "center" });
      else if (f.rx) img.clipPath = new fabric.Rect({ width: vw, height: vh, rx: f.rx / s * frame.scaleX, ry: f.rx / s * frame.scaleX, originX: "center", originY: "center" });
      img.mdcType = "image";
      const idx = canvas.getObjects().indexOf(frame);
      canvas.remove(frame); canvas.insertAt(img, idx); canvas.setActiveObject(img); canvas.requestRenderAll();
      res(img);
    }));
  }
  function addImageURL(url, name) {
    const act = canvas.getActiveObject();
    const target = pendingFrame || (act && act.mdcType === "frame" ? act : null);
    pendingFrame = null;
    if (target) return fillFrame(target, url);
    return new Promise(res => fabric.Image.fromURL(url, img => {
      const s = Math.min((W * 0.6) / img.width, (H * 0.6) / img.height, 1.5);
      img.set({ scaleX: s, scaleY: s, name: name || "Photo" }); img.mdcType = "image";
      centerAdd(img); res(img);
    }));
  }
  async function handleFiles(files) {
    const list = Array.from(files || []).filter(f => f.type.startsWith("image/"));
    if (!list.length) return;
    for (const f of list) {
      try {
        const url = await readImage(f);
        uploads.unshift({ url, name: f.name });
        await addImageURL(url, f.name.replace(/\.[^.]+$/, ""));
      } catch (e) { toast("Could not read " + f.name); }
    }
    renderUploads();
  }
  function renderUploads() {
    $("#up-grid").innerHTML = uploads.slice(0, 30).map((u, i) => `<button data-up="${i}" title="Add again"><img src="${u.url}" alt=""></button>`).join("");
  }

  /* ---------------- selection UI ---------------- */
  function kindOf(o) {
    if (!o) return null;
    if (o.type === "activeSelection") return "multi";
    if (o.mdcType === "frame") return "frame";
    if (o.type === "image") return "image";
    if (o.type === "textbox" || o.type === "i-text" || o.type === "text") return "text";
    return "shape";
  }
  function updateCtx() {
    const o = canvas.getActiveObject(); const k = kindOf(o); const bar = $("#ds-ctx");
    closePops();
    if (!o) { bar.hidden = true; refreshLayers(); return; }
    bar.hidden = false;
    $$('#ds-ctx [data-for="text"]').forEach(g => g.hidden = k !== "text");
    $$('#ds-ctx [data-for="fill"]').forEach(g => g.hidden = !(k === "text" || k === "shape"));
    $$('#ds-ctx [data-for="image"]').forEach(g => g.hidden = !(k === "image" || k === "frame"));
    $("#p-filters").hidden = k !== "image"; $("#p-removebg").hidden = k !== "image"; $("#p-flip").hidden = k !== "image";
    if (k === "frame") { $$('#ds-ctx [data-for="image"]').forEach(g => { g.hidden = false; }); }
    if (k === "text") {
      $("#p-font").value = o.fontFamily; $("#p-size").value = Math.round(o.fontSize * (o.scaleY || 1));
      $("#p-bold").classList.toggle("on", o.fontWeight === "bold" || +o.fontWeight >= 600);
      $("#p-italic").classList.toggle("on", o.fontStyle === "italic");
      $("#p-underline").classList.toggle("on", !!o.underline);
      $("#p-align").innerHTML = `<i class="fa-solid fa-align-${o.textAlign === "justify" ? "justify" : o.textAlign}"></i>`;
    }
    if (k === "text" || k === "shape") {
      const f = o.type === "line" ? o.stroke : o.fill;
      $("#p-fill").value = typeof f === "string" && f.startsWith("#") && f.length === 7 ? f : (typeof f === "string" ? new fabric.Color(f).toHex().replace(/^/, "#") : "#000000");
    }
    $("#p-lock").innerHTML = o.lockedByUser ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>';
    $("#p-lock").classList.toggle("on", !!o.lockedByUser);
    refreshLayers();
  }
  canvas.on("selection:created", updateCtx);
  canvas.on("selection:updated", updateCtx);
  canvas.on("selection:cleared", updateCtx);
  canvas.on("mouse:dblclick", e => { if (e.target && e.target.mdcType === "frame") { pendingFrame = e.target; $("#file-input").click(); } });

  function active() { return canvas.getActiveObject(); }
  function eachActive(fn) {
    const o = active(); if (!o) return;
    if (o.type === "activeSelection") o.getObjects().forEach(fn); else fn(o);
    canvas.requestRenderAll(); saveState();
  }
  function setText(props) {
    eachActive(o => { if (o.type === "textbox") { o.set(props); o.initDimensions && o.initDimensions(); o.setCoords(); } });
  }

  /* ---------------- context toolbar wiring ---------------- */
  $("#p-font").innerHTML = FONTS.map(f => `<option value="${f}" style="font-family:'${f}'">${f}</option>`).join("");
  $("#p-font").addEventListener("change", async e => {
    const f = e.target.value; await fontLoad(f, active() && active().text); fabric.util.clearFabricFontCache(f);
    const isDisplay = ["Anton", "Bebas Neue", "Pacifico", "Lobster", "Noto Nastaliq Urdu"].includes(f);
    setText(Object.assign({ fontFamily: f }, isDisplay ? { fontWeight: "normal" } : {}, f === "Noto Nastaliq Urdu" ? { lineHeight: 2 } : {}));
  });
  $("#p-size").addEventListener("change", e => { const v = +e.target.value; if (v > 0) eachActive(o => { if (o.type === "textbox") { o.set({ fontSize: v / (o.scaleY || 1) }); o.initDimensions(); o.setCoords(); } }); });
  $("#p-bold").onclick = () => { const o = active(); if (!o) return; const b = o.fontWeight === "bold" || +o.fontWeight >= 600; setText({ fontWeight: b ? "normal" : "bold" }); updateCtx(); };
  $("#p-italic").onclick = () => { const o = active(); if (!o) return; setText({ fontStyle: o.fontStyle === "italic" ? "normal" : "italic" }); updateCtx(); };
  $("#p-underline").onclick = () => { const o = active(); if (!o) return; setText({ underline: !o.underline }); updateCtx(); };
  $("#p-align").onclick = () => { const o = active(); if (!o) return; const order = ["left", "center", "right"]; setText({ textAlign: order[(order.indexOf(o.textAlign) + 1) % 3] }); updateCtx(); };
  $("#p-case").onclick = () => { const o = active(); if (!o || o.type !== "textbox") return; setText({ text: o.text === o.text.toUpperCase() ? o.text.toLowerCase() : o.text.toUpperCase() }); };
  $("#p-fill").addEventListener("input", e => { const v = e.target.value; eachActive(o => { if (o.type === "line") o.set({ stroke: v }); else if (o.type !== "image" && o.mdcType !== "frame") o.set({ fill: v }); }); });
  $("#p-dup").onclick = duplicate;
  $("#p-del").onclick = removeActive;
  $("#p-lock").onclick = () => { const o = active(); if (!o) return; applyLock(o, !o.lockedByUser); canvas.requestRenderAll(); saveState(); updateCtx(); };
  $("#p-flip").onclick = () => eachActive(o => o.set({ flipX: !o.flipX }));
  $("#p-removebg").onclick = removeBg;

  function applyLock(o, on) {
    o.lockedByUser = on;
    o.set({ lockMovementX: on, lockMovementY: on, lockScalingX: on, lockScalingY: on, lockRotation: on, hasControls: !on, editable: !on });
  }
  function duplicate() {
    const o = active(); if (!o) return;
    o.clone(c => {
      canvas.discardActiveObject();
      c.set({ left: c.left + 30, top: c.top + 30, evented: true });
      if (c.type === "activeSelection") { c.canvas = canvas; c.forEachObject(x => canvas.add(x)); c.setCoords(); }
      else canvas.add(c);
      canvas.setActiveObject(c); canvas.requestRenderAll(); saveState();
    }, PROPS);
  }
  function removeActive() {
    const o = active(); if (!o || o.isEditing) return;
    if (o.type === "activeSelection") o.getObjects().forEach(x => canvas.remove(x)); else canvas.remove(o);
    canvas.discardActiveObject(); canvas.requestRenderAll(); saveState();
  }

  /* popovers */
  function closePops(except) { $$(".ds-pop").forEach(p => { if (p !== except) p.hidden = true; }); }
  function togglePop(id) { const p = $(id); const show = p.hidden; closePops(p); p.hidden = !show; if (show) syncPop(id); }
  $("#p-effects").onclick = () => togglePop("#pop-effects");
  $("#p-position").onclick = () => togglePop("#pop-position");
  $("#p-filters").onclick = () => togglePop("#pop-filters");

  function syncPop(id) {
    const o = active(); if (!o) return; const k = kindOf(o);
    if (id === "#pop-effects") {
      $("#e-opacity").value = Math.round((o.opacity == null ? 1 : o.opacity) * 100);
      $$(".ds-only-text").forEach(x => x.hidden = k !== "text");
      $$(".ds-only-shape").forEach(x => x.hidden = k !== "shape");
      $$(".ds-only-rect").forEach(x => x.hidden = o.type !== "rect");
      if (k === "text") {
        $("#e-strokew").value = o.strokeWidth || 0; if (o.stroke && o.stroke.startsWith && o.stroke.startsWith("#")) $("#e-stroke").value = o.stroke;
        $("#e-hl-on").checked = !!o.textBackgroundColor; $("#e-spacing").value = o.charSpacing || 0; $("#e-lh").value = Math.round((o.lineHeight || 1.16) * 100);
      }
      if (k === "shape") { $("#e-sstrokew").value = o.strokeWidth || 0; $("#e-radius").value = o.rx || 0; }
      $("#e-shadow").checked = !!o.shadow;
      if (o.shadow) { $("#e-shblur").value = o.shadow.blur; }
    }
    if (id === "#pop-filters") {
      const f = o.mdcF || {};
      $("#f-bright").value = f.b || 0; $("#f-contrast").value = f.c || 0; $("#f-sat").value = f.s || 0; $("#f-blur").value = f.bl || 0;
      $("#f-gray").checked = !!f.g; $("#f-sepia").checked = !!f.sp;
    }
  }
  const live = (sel, fn) => $(sel).addEventListener("input", fn);
  live("#e-opacity", e => eachActive(o => o.set({ opacity: e.target.value / 100 })));
  live("#e-stroke", e => setText({ stroke: e.target.value, strokeWidth: Math.max(+$("#e-strokew").value, 2), paintFirst: "stroke", strokeLineJoin: "round" }));
  live("#e-strokew", e => setText({ strokeWidth: +e.target.value, stroke: $("#e-stroke").value, paintFirst: "stroke", strokeLineJoin: "round" }));
  live("#e-hl", () => { if ($("#e-hl-on").checked) setText({ textBackgroundColor: $("#e-hl").value }); });
  $("#e-hl-on").addEventListener("change", e => setText({ textBackgroundColor: e.target.checked ? $("#e-hl").value : "" }));
  live("#e-spacing", e => setText({ charSpacing: +e.target.value }));
  live("#e-lh", e => setText({ lineHeight: e.target.value / 100 }));
  live("#e-sstroke", e => eachActive(o => o.set({ stroke: e.target.value, strokeWidth: Math.max(+$("#e-sstrokew").value, 4) })));
  live("#e-sstrokew", e => eachActive(o => { if (o.type !== "line") o.set({ strokeWidth: +e.target.value, stroke: $("#e-sstroke").value }); else o.set({ strokeWidth: Math.max(1, +e.target.value) }); }));
  live("#e-radius", e => eachActive(o => { if (o.type === "rect") o.set({ rx: +e.target.value, ry: +e.target.value }); }));
  function applyShadow() {
    const on = $("#e-shadow").checked; const b = +$("#e-shblur").value;
    eachActive(o => o.set({ shadow: on ? new fabric.Shadow({ color: $("#e-shcolor").value + "aa", blur: b, offsetX: 0, offsetY: Math.round(b / 3) }) : null }));
  }
  $("#e-shadow").addEventListener("change", applyShadow); live("#e-shblur", applyShadow); live("#e-shcolor", applyShadow);

  $$("#pop-position [data-pos]").forEach(b => b.onclick = () => {
    const o = active(); if (!o) return; const p = b.dataset.pos; const bg = bgObj();
    if (p === "front") o.bringToFront(); if (p === "back") { o.sendToBack(); bg && bg.sendToBack(); }
    if (p === "up") o.bringForward(); if (p === "down") { o.sendBackwards(); bg && bg.sendToBack(); }
    const br = o.getBoundingRect(true, true);
    if (p === "ch") o.set({ left: o.left + (W / 2 - (br.left + br.width / 2)) });
    if (p === "cv") o.set({ top: o.top + (H / 2 - (br.top + br.height / 2)) });
    if (p === "left") o.set({ left: o.left - br.left + W * 0.04 });
    if (p === "right") o.set({ left: o.left + (W * 0.96 - (br.left + br.width)) });
    if (p === "top") o.set({ top: o.top - br.top + H * 0.04 });
    if (p === "bottom") o.set({ top: o.top + (H * 0.96 - (br.top + br.height)) });
    o.setCoords(); canvas.requestRenderAll(); saveState();
  });

  function applyFilters() {
    const o = active(); if (!o || o.type !== "image") return;
    const f = { b: +$("#f-bright").value, c: +$("#f-contrast").value, s: +$("#f-sat").value, bl: +$("#f-blur").value, g: $("#f-gray").checked, sp: $("#f-sepia").checked };
    const F = fabric.Image.filters, list = [];
    if (f.b) list.push(new F.Brightness({ brightness: f.b / 100 }));
    if (f.c) list.push(new F.Contrast({ contrast: f.c / 100 }));
    if (f.s) list.push(new F.Saturation({ saturation: f.s / 100 }));
    if (f.bl) list.push(new F.Blur({ blur: f.bl / 100 }));
    if (f.g) list.push(new F.Grayscale());
    if (f.sp) list.push(new F.Sepia());
    o.mdcF = f; o.filters = list; o.applyFilters(); canvas.requestRenderAll(); saveState();
  }
  ["#f-bright", "#f-contrast", "#f-sat", "#f-blur"].forEach(s => $(s).addEventListener("change", applyFilters));
  ["#f-gray", "#f-sepia"].forEach(s => $(s).addEventListener("change", applyFilters));
  $("#f-reset").onclick = () => { ["#f-bright", "#f-contrast", "#f-sat", "#f-blur"].forEach(s => $(s).value = 0); $("#f-gray").checked = $("#f-sepia").checked = false; applyFilters(); };

  /* ---------------- AI: background removal (in browser) ---------------- */
  let bgLib = null;
  async function removeBg() {
    const o = active();
    const status = $("#ai-bg-status");
    if (!o || o.type !== "image") { toast("Select a photo on your design first."); status.textContent = "Select a photo on your design first."; return; }
    const say = m => { status.textContent = m; toast(m, 4000); };
    try {
      say("Preparing AI… the first time downloads the AI model (about 40 MB).");
      if (!bgLib) bgLib = await import("https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/+esm");
      const src = o._originalElement || o.getElement();
      const c = document.createElement("canvas"); c.width = src.naturalWidth || src.width; c.height = src.naturalHeight || src.height;
      c.getContext("2d").drawImage(src, 0, 0);
      const blob = await new Promise(r => c.toBlob(r, "image/png"));
      say("Removing background… please wait.");
      const out = await bgLib.removeBackground(blob, {
        progress: (key, cur, total) => { if (total && /fetch/.test(key)) status.textContent = `Downloading AI model… ${Math.round((cur / total) * 100)}%`; }
      });
      const url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(out); });
      const el = new Image();
      el.onload = () => { o.setElement(el); if (o.filters && o.filters.length) o.applyFilters(); canvas.requestRenderAll(); saveState(); say("Background removed ✔"); };
      el.src = url;
    } catch (e) {
      console.error(e);
      say("Background removal failed. Please check your internet and try a smaller photo.");
    }
  }
  $("#ai-bg-remove").onclick = removeBg;

  /* ---------------- layers ---------------- */
  function refreshLayers() {
    const list = $("#layers-list"); if (!list) return;
    const objs = userObjects().slice().reverse(); const act = active();
    const sel = act ? (act.type === "activeSelection" ? act.getObjects() : [act]) : [];
    const icon = o => ({ text: "fa-font", image: "fa-image", frame: "fa-square-plus" }[kindOf(o)] || "fa-shapes");
    list.innerHTML = objs.length ? objs.map((o, i) => {
      const label = o.type === "textbox" ? (o.text || "").replace(/\s+/g, " ").slice(0, 30) : (o.name || o.type);
      return `<div class="ds-layer${sel.includes(o) ? " sel" : ""}" data-li="${objs.length - 1 - i}"><i class="fa-solid ${icon(o)} k"></i><span class="nm">${label.replace(/</g, "&lt;")}</span>
        <button class="act" data-vis title="Show/hide"><i class="fa-regular ${o.visible === false ? "fa-eye-slash" : "fa-eye"}"></i></button>
        <button class="act" data-lk title="Lock"><i class="fa-solid ${o.lockedByUser ? "fa-lock" : "fa-lock-open"}"></i></button></div>`;
    }).join("") : '<p class="ds-hint">No layers yet. Add text, shapes or photos.</p>';
  }
  $("#layers-list").addEventListener("click", e => {
    const row = e.target.closest(".ds-layer"); if (!row) return;
    const o = userObjects()[+row.dataset.li]; if (!o) return;
    if (e.target.closest("[data-vis]")) { o.visible = o.visible === false; canvas.discardActiveObject(); }
    else if (e.target.closest("[data-lk]")) applyLock(o, !o.lockedByUser);
    else if (o.visible !== false) canvas.setActiveObject(o);
    canvas.requestRenderAll(); saveState(); updateCtx();
  });

  /* ---------------- panels ---------------- */
  function openPanel(name) {
    $$(".ds-rail button").forEach(b => b.classList.toggle("active", b.dataset.panel === name));
    $$(".ds-panel section").forEach(s => s.classList.toggle("active", s.dataset.panel === name));
    $("#ds-panel").classList.add("open");
    if (name === "layers") refreshLayers();
  }
  function closeMobilePanel() { if (window.innerWidth < 860) $("#ds-panel").classList.remove("open"); }
  $$(".ds-rail button").forEach(b => b.onclick = () => {
    const mobileOpen = window.innerWidth < 860 && b.classList.contains("active") && $("#ds-panel").classList.contains("open");
    if (mobileOpen) closeMobilePanel(); else openPanel(b.dataset.panel);
  });
  $("#panel-close").onclick = closeMobilePanel;

  /* templates panel */
  const thumbCache = {};
  const cats = ["All", ...new Set(MDC_TEMPLATES.map(t => t.cat))];
  $("#tpl-filter").innerHTML = cats.map((c, i) => `<button class="${i ? "" : "active"}" data-cat="${c}">${c}</button>`).join("");
  function renderTemplates(cat) {
    const list = MDC_TEMPLATES.filter(t => cat === "All" || t.cat === cat);
    $("#tpl-grid").innerHTML = list.map(t => `<button class="ds-tpl" data-tpl="${t.id}" title="${t.name}">
      <div class="thumb" style="aspect-ratio:${t.w}/${t.h}">${thumbCache[t.id] ? `<img src="${thumbCache[t.id]}" alt="">` : '<i class="fa-solid fa-spinner fa-spin" style="color:#555"></i>'}</div><span>${t.name}</span></button>`).join("");
  }
  $("#tpl-filter").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("#tpl-filter button").forEach(x => x.classList.toggle("active", x === b)); renderTemplates(b.dataset.cat);
  });
  $("#tpl-grid").addEventListener("click", e => {
    const b = e.target.closest("[data-tpl]"); if (!b) return;
    const tpl = MDC_TEMPLATES.find(t => t.id === b.dataset.tpl); loadTemplate(tpl);
  });
  async function loadTemplate(tpl) {
    restoring = true;
    W = tpl.w; H = tpl.h; $("#size-label").textContent = `${W} × ${H}`;
    await buildTemplate(canvas, tpl);
    fit(); restoring = false; saveState(); updateCtx(); closeMobilePanel();
    toast(`"${tpl.name}" loaded. Tap any text to edit · Ctrl+Z to undo`);
  }
  async function makeThumbs() {
    for (const t of MDC_TEMPLATES) {
      if (thumbCache[t.id]) continue;
      const el = document.createElement("canvas");
      const sc = new fabric.StaticCanvas(el, { width: t.w, height: t.h, renderOnAddRemove: false, enableRetinaScaling: false });
      await buildTemplate(sc, t);
      sc.renderAll();
      thumbCache[t.id] = sc.toDataURL({ format: "jpeg", quality: 0.8, multiplier: 300 / t.w });
      sc.dispose();
      const img = document.querySelector(`[data-tpl="${t.id}"] .thumb`);
      if (img) img.innerHTML = `<img src="${thumbCache[t.id]}" alt="">`;
      await new Promise(r => setTimeout(r, 0));
    }
  }

  /* text panel */
  $$("[data-text]").forEach(b => b.onclick = () => addText(b.dataset.text));
  $("#text-styles").innerHTML = MDC_TEXT_STYLES.map((s, i) => `<button class="ds-style" data-style="${i}" title="${s.label}"><span style="${s.preview}">${s.text.trim()}</span></button>`).join("");
  $("#text-styles").addEventListener("click", e => { const b = e.target.closest("[data-style]"); if (b) addStyled(MDC_TEXT_STYLES[+b.dataset.style]); });

  /* elements panel */
  $("#el-shapes").innerHTML = SHAPES.map((s, i) => `<button class="ds-el" data-shape="${i}" title="${s.n}"><svg viewBox="0 0 100 100">${s.svg}</svg></button>`).join("");
  $("#el-shapes").addEventListener("click", e => {
    const b = e.target.closest("[data-shape]"); if (!b) return;
    const spec = SHAPES[+b.dataset.shape].s(); const m = Math.min(W, H) / 1080;
    if (spec.t !== "photo") ["r", "w", "h", "size", "x2"].forEach(k => { if (spec[k]) spec[k] *= m; });
    centerAdd(makeObj(spec));
  });
  $("#el-badges").innerHTML = BADGES.map((s, i) => `<button class="ds-el" data-badge="${i}" title="${s.n}"><svg viewBox="0 0 100 100" font-family="Arial">${s.svg}</svg></button>`).join("");
  $("#el-badges").addEventListener("click", e => { const b = e.target.closest("[data-badge]"); if (b) BADGES[+b.dataset.badge].add(); });
  $("#el-emoji").innerHTML = EMOJI.map(x => `<button data-emoji="${x}">${x}</button>`).join("");
  $("#el-emoji").addEventListener("click", e => {
    const b = e.target.closest("[data-emoji]"); if (!b) return;
    const o = makeObj({ t: "text", text: b.dataset.emoji, size: Math.round(220 * Math.min(W, H) / 1080), font: "Inter", fill: "#000", w: 320 * Math.min(W, H) / 1080, align: "center" });
    o.name = "Sticker"; centerAdd(o);
  });

  /* uploads */
  $("#file-input").addEventListener("change", e => { handleFiles(e.target.files); e.target.value = ""; });
  $("#up-grid").addEventListener("click", e => { const b = e.target.closest("[data-up]"); if (b) addImageURL(uploads[+b.dataset.up].url, uploads[+b.dataset.up].name); });
  ["#drop-zone", "#ds-stage"].forEach(sel => {
    const z = $(sel);
    z.addEventListener("dragover", e => { e.preventDefault(); z.classList.add("over"); });
    z.addEventListener("dragleave", () => z.classList.remove("over"));
    z.addEventListener("drop", e => { e.preventDefault(); z.classList.remove("over"); handleFiles(e.dataTransfer.files); });
  });
  document.addEventListener("paste", e => {
    if (active() && active().isEditing) return;
    const files = Array.from(e.clipboardData && e.clipboardData.files || []);
    if (files.length) { e.preventDefault(); handleFiles(files); }
  });

  /* background panel */
  const BG_COLORS = ["#ffffff", "#f8fafc", "#000000", "#0f172a", "#111827", "#ef4444", "#f97316", "#facc15", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#fde68a", "#fce7f3", "#dcfce7", "#e0f2fe", "#064e3b", "#7c2d12", "#3b0764"];
  const BG_GRADS = [
    { g: [135, ["#667eea", 0], ["#764ba2", 1]] }, { g: [135, ["#f093fb", 0], ["#f5576c", 1]] }, { g: [135, ["#4facfe", 0], ["#00f2fe", 1]] }, { g: [135, ["#43e97b", 0], ["#38f9d7", 1]] },
    { g: [135, ["#fa709a", 0], ["#fee140", 1]] }, { g: [180, ["#0f0c29", 0], ["#302b63", 0.5], ["#24243e", 1]] }, { g: [120, ["#ff1e3c", 0], ["#5b0012", 1]] }, { g: [180, ["#064e3b", 0], ["#022c22", 1]] },
    { g: [135, ["#f6d365", 0], ["#fda085", 1]] }, { g: [135, ["#1e3a8a", 0], ["#0f172a", 1]] }, { g: [160, ["#fdf2f8", 0], ["#e0e7ff", 1]] }, { g: [135, ["#111827", 0], ["#4b5563", 1]] }
  ];
  const cssGrad = s => `linear-gradient(${s.g[0]}deg, ${s.g.slice(1).map(([c, o]) => `${c} ${o * 100}%`).join(", ")})`;
  $("#bg-colors").innerHTML = BG_COLORS.map(c => `<button data-bg="${c}" style="background:${c}" title="${c}"></button>`).join("");
  $("#bg-grads").innerHTML = BG_GRADS.map((g, i) => `<button data-grad="${i}" style="background:${cssGrad(g)}"></button>`).join("");
  $("#bg-colors").addEventListener("click", e => { const b = e.target.closest("[data-bg]"); if (b) { setBackground(b.dataset.bg); saveState(); } });
  $("#bg-grads").addEventListener("click", e => { const b = e.target.closest("[data-grad]"); if (b) { setBackground(BG_GRADS[+b.dataset.grad]); saveState(); } });
  $("#bg-custom").addEventListener("input", e => { setBackground(e.target.value); saveState(); });
  $("#bg-file").addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    const url = await readImage(f, 2400);
    fabric.Image.fromURL(url, img => {
      const s = Math.max(W / img.width, H / img.height); const vw = W / s, vh = H / s;
      img.set({ left: 0, top: 0, cropX: (img.width - vw) / 2, cropY: (img.height - vh) / 2, width: vw, height: vh, scaleX: s, scaleY: s, name: "Background photo" });
      img.mdcType = "image";
      canvas.add(img); canvas.moveTo(img, 1); canvas.setActiveObject(img); canvas.requestRenderAll(); saveState();
    });
  });

  /* AI headline ideas */
  function renderIdeas() {
    const list = MDC_HEADLINES[$("#ai-head-type").value] || [];
    $("#ai-ideas").innerHTML = list.map(h => `<button data-idea="${h.replace(/"/g, "&quot;")}" style="${isRTL(h) ? "direction:rtl;text-align:right;font-family:'Noto Nastaliq Urdu';line-height:2" : ""}">${h}</button>`).join("");
  }
  $("#ai-head-type").addEventListener("change", renderIdeas);
  $("#ai-ideas").addEventListener("click", e => { const b = e.target.closest("[data-idea]"); if (b) addText("heading", b.dataset.idea); });
  renderIdeas();

  /* ---------------- top bar ---------------- */
  $("#btn-undo").onclick = undo; $("#btn-redo").onclick = redo;
  $("#btn-zoom-in").onclick = () => { autoFit = false; applyZoom(zoom * 1.2); };
  $("#btn-zoom-out").onclick = () => { autoFit = false; applyZoom(zoom / 1.2); };
  $("#btn-zoom-fit").onclick = fit;
  function toggleMenu(id) { const m = $(id); const open = !m.classList.contains("open"); $$(".ds-menu").forEach(x => x.classList.remove("open")); m.classList.toggle("open", open); }
  $("#btn-download").onclick = e => { e.stopPropagation(); toggleMenu("#menu-download"); };
  $("#btn-file").onclick = e => { e.stopPropagation(); toggleMenu("#menu-file"); };
  document.addEventListener("click", e => {
    if (!e.target.closest(".ds-menu-wrap")) $$(".ds-menu").forEach(x => x.classList.remove("open"));
    if (!e.target.closest(".ds-pop") && !e.target.closest(".ds-ctx") && !e.target.closest(".canvas-container")) closePops();
  });
  $$("[data-dl]").forEach(b => b.onclick = () => { $$(".ds-menu").forEach(x => x.classList.remove("open")); download(b.dataset.dl); });
  $$("[data-act]").forEach(b => b.onclick = () => {
    $$(".ds-menu").forEach(x => x.classList.remove("open"));
    const a = b.dataset.act;
    if (a === "new") { restoring = true; canvas.clear(); setBackground("#ffffff"); restoring = false; fit(); saveState(); toast("New blank design · Ctrl+Z to undo"); }
    if (a === "save") {
      const blob = new Blob([snapshot()], { type: "application/json" });
      saveBlob(blob, `mdc-design-${W}x${H}.mdc`); toast("Project saved. Open it later with File → Open project.");
    }
    if (a === "open") $("#open-input").click();
  });
  $("#open-input").addEventListener("change", e => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader(); fr.onload = () => loadSnapshot(fr.result, () => { autoFit = true; fit(); saveState(); toast("Project opened."); }); fr.readAsText(f);
  });
  function saveBlob(blob, name) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function download(kind) {
    canvas.discardActiveObject();
    const frames = canvas.getObjects().filter(o => o.mdcType === "frame" && o.visible !== false);
    const bg = bgObj(); const transparent = kind === "pngt";
    frames.forEach(o => o.visible = false);
    if (transparent && bg) bg.visible = false;
    const vpt = canvas.viewportTransform.slice();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const mult = kind === "png2" ? 2 : 1;
    const el = canvas.toCanvasElement(mult, { left: 0, top: 0, width: W, height: H });
    canvas.setViewportTransform(vpt);
    frames.forEach(o => o.visible = true);
    if (bg) bg.visible = true;
    canvas.requestRenderAll();
    const jpg = kind === "jpg";
    let out = el;
    if (jpg) { out = document.createElement("canvas"); out.width = el.width; out.height = el.height; const x = out.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, out.width, out.height); x.drawImage(el, 0, 0); }
    out.toBlob(b => { saveBlob(b, `mdc-design-${W * mult}x${H * mult}.${jpg ? "jpg" : "png"}`); toast("Downloaded ✔ Made with MDC Design Studio"); }, jpg ? "image/jpeg" : "image/png", 0.92);
    if (frames.length) setTimeout(() => toast("Tip: empty photo frames were left out of the download."), 2800);
  }

  /* size dialog */
  const dlg = $("#dlg-size");
  $("#size-grid").innerHTML = MDC_SIZES.map(s => `<button data-size="${s.id}"><b>${s.name}</b><small>${s.w} × ${s.h}</small></button>`).join("");
  $("#btn-resize").onclick = () => { $("#size-w").value = W; $("#size-h").value = H; dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", ""); };
  $("#size-close").onclick = () => dlg.close ? dlg.close() : dlg.removeAttribute("open");
  $("#size-grid").addEventListener("click", e => {
    const b = e.target.closest("[data-size]"); if (!b) return; const s = MDC_SIZES.find(x => x.id === b.dataset.size);
    setSize(s.w, s.h, $("#size-scale").checked); saveState(); dlg.close ? dlg.close() : dlg.removeAttribute("open"); toast(`Size: ${s.name}`);
  });
  $("#size-apply").onclick = () => {
    const w = +$("#size-w").value, h = +$("#size-h").value;
    if (w >= 50 && h >= 50 && w <= 5000 && h <= 5000) { setSize(w, h, $("#size-scale").checked); saveState(); dlg.close ? dlg.close() : dlg.removeAttribute("open"); }
    else toast("Width and height must be between 50 and 5000 px.");
  };

  /* keyboard */
  document.addEventListener("keydown", e => {
    const o = active(); const typing = /input|select|textarea/i.test(document.activeElement.tagName) || (o && o.isEditing);
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "z" && !typing) { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && e.key.toLowerCase() === "y" && !typing) { e.preventDefault(); redo(); return; }
    if (typing) return;
    if ((e.key === "Delete" || e.key === "Backspace") && o) { e.preventDefault(); removeActive(); }
    if (mod && e.key.toLowerCase() === "d" && o) { e.preventDefault(); duplicate(); }
    if (mod && e.key.toLowerCase() === "c" && o) { o.clone(c => { clipboard = c; }, PROPS); }
    if (mod && e.key.toLowerCase() === "v" && clipboard) {
      clipboard.clone(c => { canvas.discardActiveObject(); c.set({ left: c.left + 30, top: c.top + 30, evented: true });
        if (c.type === "activeSelection") { c.canvas = canvas; c.forEachObject(x => canvas.add(x)); c.setCoords(); } else canvas.add(c);
        clipboard.left += 30; clipboard.top += 30; canvas.setActiveObject(c); canvas.requestRenderAll(); }, PROPS);
    }
    const step = e.shiftKey ? 10 : 1;
    const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (mv && o && !o.lockedByUser) { e.preventDefault(); o.set({ left: o.left + mv[0], top: o.top + mv[1] }); o.setCoords(); canvas.requestRenderAll(); saveState(); }
    if (e.key === "Escape") { canvas.discardActiveObject(); canvas.requestRenderAll(); closePops(); }
  });

  window.addEventListener("resize", () => { if (autoFit) fit(); });
  if (document.fonts) document.fonts.addEventListener && document.fonts.addEventListener("loadingdone", () => {
    canvas.getObjects().forEach(o => { if (o.type === "textbox") { fabric.util.clearFabricFontCache(o.fontFamily); o.initDimensions(); o.setCoords(); } });
    canvas.requestRenderAll();
  });

  /* ---------------- start ---------------- */
  renderTemplates("All");
  openPanel("templates");
  let saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  const startBlank = () => { restoring = true; setBackground("#ffffff"); restoring = false; fit(); saveState(); };
  if (saved) loadSnapshot(saved, () => { autoFit = true; fit(); history = [snapshot()]; hIndex = 0; updateUndo(); toast("Welcome back! Your last design was restored."); });
  else startBlank();
  updateUndo();
  setTimeout(makeThumbs, 300);

  // Expose a small API for testing / future AI features
  window.MDC_STUDIO = { canvas, loadTemplate: id => loadTemplate(MDC_TEMPLATES.find(t => t.id === id)), addText, setSize, download, get size() { return [W, H]; } };
})();
