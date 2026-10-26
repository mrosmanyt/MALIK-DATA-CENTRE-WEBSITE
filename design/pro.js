/* ==========================================================================
   Postly Design Studio — YouTube thumbnail & ad creative tools
   Text effects · photo effects (outline, glow, face cut-out) · arrows,
   buttons & badges · video feed preview · safe zones · YouTube export
   (under 2 MB) · one-click ad sets
   ========================================================================== */
(function () {
  "use strict";
  const S = window.MDC_STUDIO; if (!S) return;
  const c = S.canvas, F = window.MDC_FEATURES || {};
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const active = () => c.getActiveObject();
  const unit = () => Math.min(...S.size) / 1080;
  const DISPLAY = ["Anton", "Bebas Neue", "Pacifico", "Lobster"];

  /* ---------------- quick start ---------------- */
  function openTemplates(cat) {
    S.openPanel("templates");
    const chip = $(`#tpl-filter [data-cat="${cat}"]`); if (chip) chip.click();
    $("#ds-panel").scrollTop = 0;
  }
  function newBlank(w, h, bg, msg) {
    if (F.goToPage && F.pages) { $("#page-add").click(); }
    setTimeout(() => { S.setSize(w, h, false); S.setBackground(bg); S.saveState(); S.toast(msg, 4000); }, 350);
  }
  $("#kit-new-thumb").onclick = () => newBlank(1280, 720, { g: [135, ["#ff1744", 0], ["#6d0019", 1]] }, "New 1280×720 thumbnail page. Add a face cut-out and a 2–4 word hook.");
  $("#kit-new-ad").onclick = () => newBlank(1080, 1080, "#ffffff", "New 1080×1080 ad page. Tip: use a template from Ad templates.");
  $("#kit-tpl-thumb").onclick = () => openTemplates("YouTube");
  $("#kit-tpl-ads").onclick = () => openTemplates("Ads");

  /* ---------------- text effects ---------------- */
  const FX = [
    { id: "classic", name: "Thumbnail", prev: "color:#ffe600;-webkit-text-stroke:2px #000;text-shadow:3px 3px 0 #000;font-family:Anton", fn: (o, s) => o.set({ stroke: "#000000", strokeWidth: s * 0.09, paintFirst: "stroke", strokeLineJoin: "round", shadow: new fabric.Shadow({ color: "rgba(0,0,0,.9)", blur: 0, offsetX: s * 0.06, offsetY: s * 0.06 }) }) },
    { id: "white", name: "White outline", prev: "color:#111;-webkit-text-stroke:2px #fff;text-shadow:0 0 0 #fff;font-family:Anton;background:#e11d48", fn: (o, s) => o.set({ stroke: "#ffffff", strokeWidth: s * 0.1, paintFirst: "stroke", strokeLineJoin: "round", shadow: new fabric.Shadow({ color: "rgba(0,0,0,.45)", blur: s * 0.15, offsetX: 0, offsetY: s * 0.04 }) }) },
    { id: "neon", name: "Neon glow", prev: "color:#fff;text-shadow:0 0 6px #00f0ff,0 0 12px #00f0ff;font-family:Anton;background:#0b0b1a", fn: (o, s) => o.set({ stroke: null, strokeWidth: 0, fill: "#ffffff", shadow: new fabric.Shadow({ color: "#00f0ff", blur: s * 0.45, offsetX: 0, offsetY: 0 }) }) },
    { id: "hard3d", name: "3D", prev: "color:#ffe600;text-shadow:2px 2px 0 #b45309,4px 4px 0 #78350f;font-family:Anton", fn: (o, s) => o.set({ stroke: "#78350f", strokeWidth: s * 0.03, paintFirst: "stroke", shadow: new fabric.Shadow({ color: "#78350f", blur: 0, offsetX: s * 0.08, offsetY: s * 0.08 }) }) },
    { id: "gold", name: "Gold", prev: "background:linear-gradient(#fff7ad,#ffa600);-webkit-background-clip:text;color:transparent;font-family:Anton;-webkit-text-stroke:1px #7c2d12", fn: (o, s) => o.set({ fill: new fabric.Gradient({ type: "linear", gradientUnits: "percentage", coords: { x1: 0, y1: 0, x2: 0, y2: 1 }, colorStops: [{ offset: 0, color: "#fff7ad" }, { offset: 0.55, color: "#ffc93c" }, { offset: 1, color: "#ff8a00" }] }), stroke: "#5a1d00", strokeWidth: s * 0.05, paintFirst: "stroke", shadow: new fabric.Shadow({ color: "rgba(0,0,0,.7)", blur: 0, offsetX: s * 0.05, offsetY: s * 0.05 }) }) },
    { id: "fire", name: "Hot", prev: "background:linear-gradient(#ffe600,#ff1744);-webkit-background-clip:text;color:transparent;font-family:Anton;-webkit-text-stroke:1px #000", fn: (o, s) => o.set({ fill: new fabric.Gradient({ type: "linear", gradientUnits: "percentage", coords: { x1: 0, y1: 0, x2: 0, y2: 1 }, colorStops: [{ offset: 0, color: "#ffe600" }, { offset: 1, color: "#ff1744" }] }), stroke: "#000000", strokeWidth: s * 0.08, paintFirst: "stroke", shadow: new fabric.Shadow({ color: "rgba(0,0,0,.9)", blur: 0, offsetX: s * 0.05, offsetY: s * 0.05 }) }) },
    { id: "box", name: "Red box", prev: "color:#fff;background:#ff1744;padding:0 4px;font-family:Anton", fn: (o) => o.set({ fill: "#ffffff", textBackgroundColor: "#ff1744", stroke: null, strokeWidth: 0, shadow: null }) },
    { id: "yellowbox", name: "Yellow box", prev: "color:#111;background:#ffe600;padding:0 4px;font-family:Anton", fn: (o) => o.set({ fill: "#111111", textBackgroundColor: "#ffe600", stroke: null, strokeWidth: 0, shadow: null }) },
    { id: "soft", name: "Soft shadow", prev: "color:#fff;text-shadow:0 3px 8px rgba(0,0,0,.6);font-family:Montserrat;font-weight:900;background:#3b82f6", fn: (o, s) => o.set({ stroke: null, strokeWidth: 0, shadow: new fabric.Shadow({ color: "rgba(0,0,0,.55)", blur: s * 0.3, offsetX: 0, offsetY: s * 0.06 }) }) },
    { id: "clear", name: "No effect", prev: "color:#111;font-family:Montserrat;font-weight:800;background:#e5e7eb", fn: (o) => o.set({ stroke: null, strokeWidth: 0, shadow: null, textBackgroundColor: "" }) }
  ];
  $("#kit-text-fx").innerHTML = FX.map(f => `<button type="button" data-fx="${f.id}" title="${f.name}"><span style="${f.prev}">Aa</span><small>${f.name}</small></button>`).join("");
  $("#kit-text-fx").addEventListener("click", e => {
    const b = e.target.closest("[data-fx]"); if (!b) return;
    const sel = active(); const list = !sel ? [] : sel.type === "activeSelection" ? sel.getObjects() : [sel];
    const texts = list.filter(o => o.type === "textbox");
    if (!texts.length) { S.toast("Select a text on your design first."); return; }
    const fx = FX.find(f => f.id === b.dataset.fx);
    texts.forEach(o => { if (fx.id !== "gold" && fx.id !== "fire" && o.fill && typeof o.fill === "object") o.set({ fill: "#ffffff" }); fx.fn(o, o.fontSize); o.dirty = true; });
    c.requestRenderAll(); S.saveState();
  });

  /* ---------------- photo effects ---------------- */
  function selectedImage() { const o = active(); if (!o || o.type !== "image") { S.toast("Select a photo on your design first."); return null; } return o; }
  // the part of the photo that is visible on the design, at full resolution
  function visibleCanvas(o) {
    const el = o._originalElement || o.getElement();
    const cv = document.createElement("canvas"); cv.width = Math.round(o.width); cv.height = Math.round(o.height);
    cv.getContext("2d").drawImage(el, o.cropX || 0, o.cropY || 0, o.width, o.height, 0, 0, o.width, o.height);
    return cv;
  }
  function outlineCanvas(src, color, t) {
    const pad = Math.ceil(t) + 2, out = document.createElement("canvas");
    out.width = src.width + pad * 2; out.height = src.height + pad * 2;
    const ctx = out.getContext("2d"), steps = Math.max(16, Math.round(t * 1.5));
    for (let i = 0; i < steps; i++) { const a = (i / steps) * Math.PI * 2; ctx.drawImage(src, pad + Math.cos(a) * t, pad + Math.sin(a) * t); }
    ctx.globalCompositeOperation = "source-in"; ctx.fillStyle = color; ctx.fillRect(0, 0, out.width, out.height);
    ctx.globalCompositeOperation = "source-over"; ctx.drawImage(src, pad, pad);
    return { cv: out, pad };
  }
  // put a new picture into the image object, keeping it in the same place on the design
  function replaceVisible(o, cv, padPx) {
    return new Promise(res => {
      const el = new Image();
      el.onload = () => {
        const sx = o.scaleX, sy = o.scaleY, ang = fabric.util.degreesToRadians(o.angle || 0);
        const dx = -padPx * sx, dy = -padPx * sy;
        const left = o.left + dx * Math.cos(ang) - dy * Math.sin(ang), top = o.top + dx * Math.sin(ang) + dy * Math.cos(ang);
        o.setElement(el);
        o.set({ cropX: 0, cropY: 0, width: cv.width, height: cv.height, scaleX: sx, scaleY: sy, left, top });
        o.clipPath = undefined; o.mdcMask = null; o.mdcCrop = null;
        o.filters = []; o.mdcF = null;
        o.setCoords(); c.requestRenderAll(); S.saveState(); res();
      };
      el.src = cv.toDataURL("image/png");
    });
  }
  $("#kit-outline").onclick = async () => {
    const o = selectedImage(); if (!o) return;
    const src = visibleCanvas(o);
    const t = (+$("#kit-ol-size").value) * Math.max(src.width, src.height) / 1000;
    const { cv, pad } = outlineCanvas(src, $("#kit-ol-color").value, t);
    await replaceVisible(o, cv, pad);
    S.toast("Outline added ✔ Press Ctrl+Z to undo.");
  };
  function trimCanvas(cv) {
    const ctx = cv.getContext("2d"), d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
    for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) if (d[(y * cv.width + x) * 4 + 3] > 16) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    if (x1 < 0) return cv;
    const t = document.createElement("canvas"); t.width = x1 - x0 + 2; t.height = y1 - y0 + 2;
    t.getContext("2d").drawImage(cv, x0, y0, t.width, t.height, 0, 0, t.width, t.height); return t;
  }
  $("#kit-face").onclick = async () => {
    const o = selectedImage(); if (!o) return;
    const btn = $("#kit-face"), html = btn.innerHTML; btn.disabled = true;
    const say = m => { btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${esc(m)}`; };
    try {
      say("Removing background… (first time downloads ~40 MB)");
      const src = visibleCanvas(o);
      const blob = await new Promise(r => src.toBlob(r, "image/png"));
      const out = await S.removeBgBlob(blob, say);
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(out); });
      const cut = document.createElement("canvas"); cut.width = img.width; cut.height = img.height; cut.getContext("2d").drawImage(img, 0, 0);
      const trimmed = trimCanvas(cut);
      say("Adding outline…");
      const t = Math.max(trimmed.width, trimmed.height) * 0.018;
      const { cv } = outlineCanvas(trimmed, $("#kit-ol-color").value, t);
      // keep the same height on the design, sitting on the same bottom line
      const dispH = o.height * o.scaleY, bottom = o.top + dispH, s = dispH / cv.height;
      await replaceVisible(o, cv, 0);
      o.set({ scaleX: s, scaleY: s, top: bottom - cv.height * s, name: "Face cut-out" }); o.setCoords();
      o.set({ shadow: new fabric.Shadow({ color: "rgba(0,0,0,.45)", blur: 30, offsetX: 0, offsetY: 10 }) });
      c.requestRenderAll(); S.saveState();
      S.toast("Face cut-out ready ✔ Move it so it overlaps the edge of the thumbnail.", 5000);
    } catch (e) { console.error(e); S.toast("Could not cut out the photo. Check your internet and try a smaller photo."); }
    btn.disabled = false; btn.innerHTML = html;
  };
  const shadowFx = (o, sh) => { o.set({ shadow: sh }); c.requestRenderAll(); S.saveState(); };
  $("#kit-glow").onclick = () => { const o = selectedImage(); if (o) shadowFx(o, new fabric.Shadow({ color: $("#kit-ol-color").value === "#ffffff" ? "#ffe600" : $("#kit-ol-color").value, blur: 60 / (o.scaleX || 1) * unit(), offsetX: 0, offsetY: 0 })); };
  $("#kit-shadow").onclick = () => { const o = selectedImage(); if (o) shadowFx(o, new fabric.Shadow({ color: "rgba(0,0,0,.55)", blur: 40 / (o.scaleX || 1) * unit(), offsetX: 0, offsetY: 18 / (o.scaleX || 1) * unit() })); };
  $("#kit-border").onclick = () => { const o = selectedImage(); if (!o) return; o.set({ stroke: $("#kit-ol-color").value, strokeWidth: 12 / (o.scaleX || 1) * unit(), strokeUniform: false }); c.requestRenderAll(); S.saveState(); };
  $("#kit-fx-clear").onclick = () => { const o = selectedImage(); if (!o) return; o.set({ shadow: null, stroke: null, strokeWidth: 0 }); c.requestRenderAll(); S.saveState(); };

  /* ---------------- arrows, highlights, buttons, badges ---------------- */
  const ARROW = (window.MDC_PRO_KIT && window.MDC_PRO_KIT.ARROW) || "M6 74C22 40 52 22 80 28L76 14L98 40L68 56L72 42C50 38 30 52 20 80Z";
  const SHAPES = [
    { n: "Curved arrow (red)", svg: `<path d="${ARROW}" fill="#ff1744" stroke="#000" stroke-width="3"/>`, spec: () => ({ t: "path", d: ARROW, fill: "#ff1744", stroke: "#000000", sw: 3, size: 300 * unit(), name: "Arrow" }) },
    { n: "Curved arrow (yellow)", svg: `<path d="${ARROW}" fill="#ffe600" stroke="#000" stroke-width="3"/>`, spec: () => ({ t: "path", d: ARROW, fill: "#ffe600", stroke: "#000000", sw: 3, size: 300 * unit(), name: "Arrow" }) },
    { n: "Straight arrow", svg: '<path d="M8 40h56V22l30 28-30 28V60H8z" fill="#ff1744" stroke="#000" stroke-width="3"/>', spec: () => ({ t: "path", d: "M8 40h56V22l30 28-30 28V60H8z", fill: "#ff1744", stroke: "#000000", sw: 3, size: 320 * unit(), name: "Arrow" }) },
    { n: "Down arrow", svg: '<path d="M40 8h20v50h18L50 92 22 58h18z" fill="#ffe600" stroke="#000" stroke-width="3"/>', spec: () => ({ t: "path", d: "M40 8h20v50h18L50 92 22 58h18z", fill: "#ffe600", stroke: "#000000", sw: 3, size: 200 * unit(), name: "Arrow" }) },
    { n: "Circle highlight", svg: '<ellipse cx="50" cy="50" rx="42" ry="30" fill="none" stroke="#ff1744" stroke-width="7"/>', spec: () => ({ t: "path", d: "M100 0A100 70 0 1 1 99.9 0", fill: "rgba(0,0,0,0)", stroke: "#ff1744", sw: 9, size: 420 * unit(), name: "Highlight circle" }) },
    { n: "Scribble underline", svg: '<path d="M8 60c20-12 30 8 46-4s28-6 38-2" fill="none" stroke="#ffe600" stroke-width="8" stroke-linecap="round"/>', spec: () => ({ t: "path", d: "M8 60c20-12 30 8 46-4s28-6 38-2", fill: "rgba(0,0,0,0)", stroke: "#ffe600", sw: 6, size: 520 * unit(), name: "Underline" }) },
    { n: "Box highlight", svg: '<rect x="10" y="22" width="80" height="56" rx="6" fill="none" stroke="#22c55e" stroke-width="7"/>', spec: () => ({ t: "rect", w: 420 * unit(), h: 280 * unit(), rx: 18 * unit(), fill: "rgba(0,0,0,0)", stroke: "#22c55e", sw: 12 * unit(), name: "Highlight box" }) },
    { n: "Cross (wrong)", svg: '<path d="M20 30l10-10 20 20 20-20 10 10-20 20 20 20-10 10-20-20-20 20-10-10 20-20z" fill="#ef4444" stroke="#000" stroke-width="3"/>', spec: () => ({ t: "path", d: "M20 30l10-10 20 20 20-20 10 10-20 20 20 20-10 10-20-20-20 20-10-10 20-20z", fill: "#ef4444", stroke: "#000000", sw: 3, size: 200 * unit(), name: "Cross" }) },
    { n: "Tick (right)", svg: '<path d="M14 52l12-12 16 16 34-34 12 12-46 46z" fill="#22c55e" stroke="#000" stroke-width="3"/>', spec: () => ({ t: "path", d: "M14 52l12-12 16 16 34-34 12 12-46 46z", fill: "#22c55e", stroke: "#000000", sw: 3, size: 200 * unit(), name: "Tick" }) },
    { n: "Burst", svg: '<polygon points="50,4 58,30 86,18 72,44 98,52 70,60 84,86 58,72 50,98 42,72 16,86 30,60 2,52 28,44 14,18 42,30" fill="#ffe600" stroke="#000" stroke-width="3"/>', spec: () => ({ t: "star", r: 160 * unit(), points: 12, inner: 0.62, fill: "#ffe600", stroke: "#000000", sw: 6 * unit(), name: "Burst" }) },
    { n: "Play button", svg: '<rect x="12" y="24" width="76" height="52" rx="14" fill="#ff1744"/><polygon points="42,38 62,50 42,62" fill="#fff"/>', group: () => [{ t: "rect", w: 300, h: 210, rx: 56, fill: "#ff1744" }, { t: "tri", w: 90, h: 100, fill: "#ffffff", angle: 90 }] },
    { n: "Emoji: shocked", svg: '<text x="50" y="68" font-size="56" text-anchor="middle">😱</text>', spec: () => ({ t: "text", text: "😱", size: 220 * unit(), font: "Inter", fill: "#000", w: 300 * unit(), align: "center", name: "Emoji" }) }
  ];
  $("#kit-arrows").innerHTML = SHAPES.map((s, i) => `<button class="ds-el" data-ks="${i}" title="${s.n}"><svg viewBox="0 0 100 100">${s.svg}</svg></button>`).join("");
  function addGroup(specs, name) {
    const u = unit();
    const objs = specs.map(sp => { const s2 = Object.assign({}, sp); ["w", "h", "r", "size", "sw", "rx"].forEach(k => { if (s2[k]) s2[k] *= u; }); return S.makeObj(s2); });
    objs.forEach(o => { o.set({ originX: "center", originY: "center", left: 0, top: 0 }); });
    const g = new fabric.Group(objs, { name }); g.mdcType = "shape"; g.mdcGroup = true;
    S.centerAdd(g); S.saveState(); return g;
  }
  $("#kit-arrows").addEventListener("click", e => {
    const b = e.target.closest("[data-ks]"); if (!b) return; const s = SHAPES[+b.dataset.ks];
    if (s.group) addGroup(s.group(), s.n); else { S.centerAdd(S.makeObj(s.spec())); S.saveState(); }
  });
  const BADGES = [
    ["SHOP NOW", "#ff1744", "#ffffff", "pill"], ["LEARN MORE", "#2563eb", "#ffffff", "pill"], ["SIGN UP FREE", "#16a34a", "#ffffff", "pill"], ["BOOK NOW", "#111827", "#ffffff", "pill"],
    ["DOWNLOAD", "#7c3aed", "#ffffff", "pill"], ["ORDER ON WHATSAPP", "#25d366", "#ffffff", "pill"], ["SUBSCRIBE", "#ff0033", "#ffffff", "pill"], ["LIMITED OFFER", "#ffe600", "#111111", "tag"],
    ["NEW", "#ff1744", "#ffffff", "tag"], ["VIRAL", "#111111", "#ffe600", "tag"], ["LIVE", "#ef4444", "#ffffff", "tag"], ["HOT 🔥", "#f97316", "#ffffff", "tag"],
    ["✓ Free delivery", "#ecfdf5", "#065f46", "trust"], ["✓ Cash on delivery", "#eff6ff", "#1e40af", "trust"], ["✓ 100% original", "#fefce8", "#854d0e", "trust"], ["✓ Money-back guarantee", "#fdf2f8", "#9d174d", "trust"],
    ["★★★★★ 4.9/5", "#111827", "#fde047", "trust"], ["Rs 1,999", "#ffe600", "#111111", "price"], ["50% OFF", "#ff1744", "#ffffff", "price"], ["FREE", "#16a34a", "#ffffff", "price"]
  ];
  $("#kit-badges").innerHTML = BADGES.map(([t, bg, fg, kind], i) => `<button type="button" data-kb="${i}" style="background:${bg};color:${fg};${kind === "pill" ? "border-radius:99px" : kind === "price" ? "border-radius:50%;aspect-ratio:1;" : "border-radius:6px"}">${esc(t)}</button>`).join("");
  $("#kit-badges").addEventListener("click", async e => {
    const b = e.target.closest("[data-kb]"); if (!b) return;
    const [text, bg, fg, kind] = BADGES[+b.dataset.kb];
    const font = kind === "tag" || kind === "price" ? "Anton" : "Montserrat";
    await S.fontLoad(font, text);
    const size = kind === "price" ? 84 : kind === "trust" ? 38 : kind === "tag" ? 64 : 44;
    const w = kind === "price" ? 330 : Math.max(280, text.length * size * (font === "Anton" ? 0.55 : 0.72) + 110), h = kind === "price" ? 330 : size * 2.1;
    const shape = kind === "price" ? { t: "star", r: 165, points: 16, inner: 0.84, fill: bg } : { t: "rect", w, h, rx: kind === "pill" ? h / 2 : kind === "trust" ? 18 : 10, fill: bg, stroke: kind === "trust" ? fg : null, sw: kind === "trust" ? 3 : 0 };
    const txt = { t: "text", text: kind === "price" ? text.replace(" ", "\n") : text, size, font, weight: font === "Anton" ? "normal" : 800, fill: fg, w: (kind === "price" ? 260 : w - 30), align: "center", lh: kind === "price" ? 0.95 : 1.1 };
    addGroup([shape, txt], text);
  });

  /* ---------------- video feed preview ---------------- */
  const dlg = document.createElement("dialog");
  dlg.className = "ds-dialog wide"; dlg.id = "dlg-ytprev";
  dlg.innerHTML = `<h3>Preview in a video feed</h3>
    <p class="ds-hint">See your thumbnail at the sizes people actually see it. If the text is hard to read at the small size, make it bigger or shorter.</p>
    <div class="ds-row" style="gap:8px;flex-wrap:wrap;justify-content:flex-start">
      <input id="yp-title" class="ds-input" style="flex:1;min-width:200px" value="I tried this for 30 days and here's what happened">
      <input id="yp-channel" class="ds-input" style="width:180px" value="Your Channel">
      <button class="ds-btn ghost sm" id="yp-theme" type="button"><i class="fa-solid fa-circle-half-stroke"></i> Light / dark</button>
    </div>
    <div class="yp-wrap dark" id="yp-wrap"></div>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`;
  document.querySelector(".ds-app").appendChild(dlg);
  dlg.querySelector("[data-close]").onclick = () => dlg.close();
  let ypImg = "";
  function renderPreview() {
    const t = esc($("#yp-title").value), ch = esc($("#yp-channel").value), img = ypImg;
    const card = (w, cls) => `<div class="yp-card ${cls}" style="width:${w}px"><div class="yp-thumb"><img src="${img}" alt=""><span class="yp-dur">12:34</span></div>
      <div class="yp-meta"><span class="yp-av"></span><div><b>${t}</b><small>${ch}<br>128K views · 2 days ago</small></div></div></div>`;
    $("#yp-wrap").innerHTML = `<div class="yp-col"><p class="yp-label">Home feed (desktop)</p>${card(360, "home")}</div>
      <div class="yp-col"><p class="yp-label">Suggested videos (sidebar)</p>
        <div class="yp-side"><div class="yp-thumb" style="width:168px"><img src="${img}" alt=""><span class="yp-dur">12:34</span></div><div class="yp-sm"><b>${t}</b><small>${ch}<br>128K views</small></div></div>
        <div class="yp-side yp-fake"><div class="yp-thumb" style="width:168px"></div><div class="yp-sm"><b>Another video title in the list</b><small>Other channel</small></div></div>
        <p class="yp-label" style="margin-top:14px">Phone</p>${card(300, "phone")}</div>`;
  }
  $("#kit-preview").onclick = () => {
    const [W, H] = S.size;
    if (Math.abs(W / H - 16 / 9) > 0.03) S.toast("This design is not 16:9. YouTube thumbnails should be 1280×720.", 4000);
    ypImg = S.renderToCanvas(640 / W).toDataURL("image/jpeg", 0.9);
    renderPreview(); dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  };
  ["#yp-title", "#yp-channel"].forEach(s => dlg.querySelector(s).addEventListener("input", renderPreview));
  dlg.querySelector("#yp-theme").onclick = () => $("#yp-wrap").classList.toggle("dark");

  /* ---------------- safe zones ---------------- */
  const safe = document.createElement("div"); safe.className = "ds-safe"; safe.hidden = true;
  $("#ds-canvas-wrap").appendChild(safe);
  let safeOn = false;
  function drawSafe() {
    safe.hidden = !safeOn; $("#kit-safe").classList.toggle("on", safeOn);
    if (!safeOn) return;
    const [W, H] = S.size, r = W / H, z = S.zoom, box = (l, t, w, h, label) => `<div style="left:${l * z}px;top:${t * z}px;width:${w * z}px;height:${h * z}px"><span>${label}</span></div>`;
    let html = "";
    if (Math.abs(r - 16 / 9) < 0.05) html = box(W * 0.84, H * 0.85, W * 0.14, H * 0.11, "Video length covers this") + box(W * 0.02, H * 0.02, W * 0.96, H * 0.96, "");
    else if (r < 0.6) html = box(0, 0, W, H * 0.14, "Profile name & buttons cover this") + box(0, H * 0.8, W, H * 0.2, "Caption & call-to-action cover this") + box(W * 0.86, H * 0.4, W * 0.14, H * 0.4, "Like / share buttons");
    else html = box(W * 0.05, H * 0.05, W * 0.9, H * 0.9, "Keep important text inside this line");
    safe.innerHTML = html; safe.className = "ds-safe" + (Math.abs(r - 16 / 9) < 0.05 ? " yt" : r < 0.6 ? " story" : " feed");
  }
  $("#kit-safe").onclick = () => { safeOn = !safeOn; drawSafe(); };
  let lastKey = "";
  c.on("after:render", () => { if (!safeOn) return; const k = S.zoom + "|" + S.size.join("x"); if (k !== lastKey) { lastKey = k; drawSafe(); } });

  /* ---------------- YouTube export (JPG, 1280×720, < 2 MB) ---------------- */
  $("#kit-yt-dl").onclick = async () => {
    const [W, H] = S.size;
    if (Math.abs(W / H - 16 / 9) > 0.03) { S.toast("Make the design 1280×720 first (size button at the top), or use Resize → YouTube thumbnail.", 5000); return; }
    const el = S.renderToCanvas(1280 / W);
    const out = document.createElement("canvas"); out.width = 1280; out.height = 720;
    const x = out.getContext("2d"); x.fillStyle = "#000"; x.fillRect(0, 0, 1280, 720); x.drawImage(el, 0, 0, 1280, 720);
    let q = 0.95, blob;
    do { blob = await new Promise(r => out.toBlob(r, "image/jpeg", q)); q -= 0.07; } while (blob.size > 1.9 * 1024 * 1024 && q > 0.4);
    S.saveBlob(blob, "youtube-thumbnail-1280x720.jpg");
    S.toast(`Downloaded ✔ 1280×720 JPG, ${(blob.size / 1024).toFixed(0)} KB, ready to upload to YouTube.`, 4500);
  };

  /* ---------------- ad sets (uses the resize dialog) ---------------- */
  function presetSizes(set) {
    const ids = set === "none" ? [] : (window.MDC_AD_SETS || {})[set] || [];
    const [W, H] = S.size;
    $$("#magic-grid input").forEach(i => { const s = MDC_SIZES.find(x => x.id === i.value); i.checked = ids.includes(i.value) && !(s.w === W && s.h === H); });
  }
  $$("#dlg-magic [data-set]").forEach(b => b.onclick = () => presetSizes(b.dataset.set));
  $$("[data-adset]").forEach(b => b.onclick = () => {
    const m = $('[data-act="magic"]'); if (m) m.click();
    setTimeout(() => presetSizes(b.dataset.adset), 50);
  });
})();
