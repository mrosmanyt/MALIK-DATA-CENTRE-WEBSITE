/* Postly Design Studio: ad tools
   1) Product mockups (phone, laptop, T-shirt, mug, box, tote bag, framed poster)
   2) AI ad variations from one product photo
   3) Carousel builder (+ seamless panorama split)
   4) Facebook & Instagram ad preview (feed, story) with text-coverage check   */
(function () {
  const S = window.MDC_STUDIO; if (!S) return;
  const c = S.canvas, F = window.MDC_FEATURES || {}, KIT = window.MDC_PRO_KIT || {};
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const blobToURL = b => new Promise((r, j) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = j; fr.readAsDataURL(b); });
  const loadImg = src => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { if (!btn.dataset.html) btn.dataset.html = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${esc(label || "Working…")}`; }
    else { btn.disabled = false; if (btn.dataset.html) { btn.innerHTML = btn.dataset.html; delete btn.dataset.html; } }
  }
  function dialog(id, html, wide = true) {
    const d = document.createElement("dialog"); d.className = "ds-dialog" + (wide ? " wide" : ""); d.id = id; d.innerHTML = html;
    document.querySelector(".ds-app").appendChild(d);
    d.addEventListener("click", e => { if (e.target.closest("[data-close]")) d.close(); });
    return d;
  }
  const open = d => d.open || (d.showModal ? d.showModal() : d.setAttribute("open", ""));
  const pageIsEmpty = () => S.userObjects().length === 0;
  const newPage = () => new Promise(r => (F.addPage ? F.addPage(null, r) : r()));
  function visibleCanvas(o) {
    const el = o._originalElement || o.getElement();
    const cv = document.createElement("canvas"); cv.width = Math.round(o.width); cv.height = Math.round(o.height);
    cv.getContext("2d").drawImage(el, o.cropX || 0, o.cropY || 0, o.width, o.height, 0, 0, o.width, o.height);
    return cv;
  }

  /* ======================================================================
     1) PRODUCT MOCKUPS
     ====================================================================== */
  function roundRect(ctx, l, t, w, h, r) {
    ctx.beginPath(); ctx.moveTo(l + r, t); ctx.arcTo(l + w, t, l + w, t + h, r); ctx.arcTo(l + w, t + h, l, t + h, r); ctx.arcTo(l, t + h, l, t, r); ctx.arcTo(l, t, l + w, t, r); ctx.closePath();
  }
  // draw src into a box: "cover" fills it, "contain" fits inside
  function place(ctx, src, l, t, w, h, mode) {
    const s = mode === "cover" ? Math.max(w / src.width, h / src.height) : Math.min(w / src.width, h / src.height);
    const dw = src.width * s, dh = src.height * s; ctx.drawImage(src, l + (w - dw) / 2, t + (h - dh) / 2, dw, dh);
    return { l: l + (w - dw) / 2, t: t + (h - dh) / 2, w: dw, h: dh };
  }
  const fit = (src, w, h) => Math.abs(src.width / src.height - w / h) < 0.18 ? "cover" : "contain";
  function avgColor(src) {
    const cv = document.createElement("canvas"); cv.width = cv.height = 16; const x = cv.getContext("2d"); x.drawImage(src, 0, 0, 16, 16);
    const d = x.getImageData(0, 0, 16, 16).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    return [r / 256 | 0, g / 256 | 0, b / 256 | 0];
  }
  const shade = ([r, g, b], k) => `rgb(${Math.min(255, r * k) | 0},${Math.min(255, g * k) | 0},${Math.min(255, b * k) | 0})`;
  const lumHex = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
  let noisePat = null;
  function noise(ctx) {
    if (!noisePat) { const cv = document.createElement("canvas"); cv.width = cv.height = 96; const x = cv.getContext("2d"), im = x.createImageData(96, 96);
      for (let i = 0; i < im.data.length; i += 4) { const v = 110 + Math.random() * 40; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 40; } x.putImageData(im, 0, 0); noisePat = cv; }
    return ctx.createPattern(noisePat, "repeat");
  }
  function shadowEllipse(ctx, cx, cy, rx, ry, a = 0.28) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx); ctx.translate(-cx, -cy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  const MOCKS = {
    phone: { name: "Phone", w: 1400, h: 1400, draw(ctx, src) {
      const h = 1240, w = 610, l = (1400 - w) / 2, t = 80;
      shadowEllipse(ctx, 700, 1345, 380, 34, 0.3);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 60; ctx.shadowOffsetY = 30;
      const g = ctx.createLinearGradient(l, 0, l + w, 0); g.addColorStop(0, "#3a3a42"); g.addColorStop(0.5, "#16161b"); g.addColorStop(1, "#33333b");
      roundRect(ctx, l, t, w, h, 96); ctx.fillStyle = g; ctx.fill(); ctx.restore();
      ctx.fillStyle = "#2a2a30"; [[l - 6, t + 230, 8, 90], [l - 6, t + 350, 8, 150], [l + w - 2, t + 300, 8, 180]].forEach(b => { roundRect(ctx, ...b, 4); ctx.fill(); });
      const sl = l + 22, st = t + 22, sw = w - 44, sh = h - 44;
      ctx.save(); roundRect(ctx, sl, st, sw, sh, 76); ctx.clip(); ctx.fillStyle = "#000"; ctx.fillRect(sl, st, sw, sh);
      place(ctx, src, sl, st, sw, sh, fit(src, sw, sh));
      const gl = ctx.createLinearGradient(sl, st, sl + sw, st + sh); gl.addColorStop(0, "rgba(255,255,255,.14)"); gl.addColorStop(0.45, "rgba(255,255,255,0)"); ctx.fillStyle = gl; ctx.fillRect(sl, st, sw, sh);
      ctx.restore();
      roundRect(ctx, 700 - 82, st + 22, 164, 46, 23); ctx.fillStyle = "#000"; ctx.fill();
    } },
    laptop: { name: "Laptop", w: 1600, h: 1100, draw(ctx, src) {
      shadowEllipse(ctx, 800, 965, 760, 40, 0.3);
      const l = 250, t = 110, w = 1100, h = 720;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
      roundRect(ctx, l, t, w, h, 34); ctx.fillStyle = "#18181c"; ctx.fill(); ctx.restore();
      const sl = l + 26, st = t + 26, sw = w - 52, sh = h - 64;
      ctx.save(); ctx.beginPath(); ctx.rect(sl, st, sw, sh); ctx.clip(); ctx.fillStyle = "#000"; ctx.fillRect(sl, st, sw, sh); place(ctx, src, sl, st, sw, sh, fit(src, sw, sh));
      const gl = ctx.createLinearGradient(sl, st, sl + sw * 0.7, st + sh); gl.addColorStop(0, "rgba(255,255,255,.10)"); gl.addColorStop(0.5, "rgba(255,255,255,0)"); ctx.fillStyle = gl; ctx.fillRect(sl, st, sw, sh); ctx.restore();
      ctx.fillStyle = "#333"; ctx.beginPath(); ctx.arc(800, t + 13, 5, 0, 7); ctx.fill();
      const g = ctx.createLinearGradient(0, 830, 0, 905); g.addColorStop(0, "#e4e6ea"); g.addColorStop(1, "#a3a7af");
      ctx.beginPath(); ctx.moveTo(180, 830); ctx.lineTo(1420, 830); ctx.lineTo(1530, 890); ctx.quadraticCurveTo(1540, 905, 1515, 908); ctx.lineTo(85, 908); ctx.quadraticCurveTo(60, 905, 70, 890); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      roundRect(ctx, 700, 830, 200, 14, 7); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fill();
    } },
    tshirt: { name: "T-shirt", w: 1400, h: 1400, color: true, def: "#ffffff", draw(ctx, src, col) {
      const P = [[38, 8], [62, 8], [80, 12], [98, 32], [88, 45], [76, 37], [76, 96], [24, 96], [24, 37], [12, 45], [2, 32], [20, 12]];
      const X = v => 150 + v * 11, Y = v => 110 + v * 12;
      const path = () => { ctx.beginPath(); ctx.moveTo(X(38), Y(8)); ctx.quadraticCurveTo(X(50), Y(19), X(62), Y(8)); P.slice(2).forEach(([a, b]) => ctx.lineTo(X(a), Y(b))); ctx.lineTo(X(20), Y(12)); ctx.closePath(); };
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; path(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
      ctx.save(); path(); ctx.clip();
      const pw = 11 * 30, ph = 12 * 32, pl = X(35), pt = Y(22);
      ctx.globalCompositeOperation = lumHex(col) > 0.6 ? "multiply" : "source-over";
      place(ctx, src, pl, pt, pw, ph, "contain");
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createRadialGradient(700, 700, 120, 700, 700, 760); g.addColorStop(0, "rgba(255,255,255,.08)"); g.addColorStop(1, "rgba(0,0,0,.28)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1400, 1400);
      ctx.fillStyle = "rgba(0,0,0,.07)"; [[X(30), Y(45), 40, 500], [X(64), Y(55), 34, 420]].forEach(([x, y, w, h]) => { ctx.beginPath(); ctx.ellipse(x, y + h / 2, w / 2, h / 2, 0.06, 0, 7); ctx.fill(); });
      ctx.fillStyle = noise(ctx); ctx.globalAlpha = 0.5; ctx.fillRect(0, 0, 1400, 1400); ctx.globalAlpha = 1;
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(X(38), Y(8)); ctx.quadraticCurveTo(X(50), Y(19), X(62), Y(8)); ctx.lineWidth = 16; ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.stroke();
    } },
    mug: { name: "Mug", w: 1400, h: 1400, color: true, def: "#ffffff", draw(ctx, src, col) {
      const cx = 650, R = 360, top = 330, bot = 1130, ry = 60;
      shadowEllipse(ctx, 700, bot + 30, 520, 50, 0.3);
      ctx.lineWidth = 70; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(cx + R - 10, 500); ctx.bezierCurveTo(cx + R + 260, 470, cx + R + 260, 930, cx + R - 10, 900); ctx.stroke();
      ctx.lineWidth = 70; ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.stroke();
      const body = () => { ctx.beginPath(); ctx.moveTo(cx - R, top); ctx.lineTo(cx - R, bot); ctx.ellipse(cx, bot, R, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + R, top); ctx.closePath(); };
      ctx.save(); body(); ctx.fillStyle = col; ctx.fill(); ctx.clip();
      // wrap the design around the curve
      const ph = 520, pt = 470, maxA = 62 * Math.PI / 180, srcAsp = src.width / src.height, arcW = 2 * R * Math.sin(maxA);
      const useH = Math.min(ph, arcW / srcAsp), y0 = pt + (ph - useH) / 2, N = 160;
      ctx.globalCompositeOperation = lumHex(col) > 0.6 ? "multiply" : "source-over";
      for (let i = 0; i < N; i++) {
        const a0 = -maxA + 2 * maxA * i / N, a1 = -maxA + 2 * maxA * (i + 1) / N;
        const x0 = cx + R * Math.sin(a0), x1 = cx + R * Math.sin(a1);
        ctx.drawImage(src, src.width * i / N, 0, src.width / N + 0.5, src.height, x0, y0, x1 - x0 + 0.6, useH);
      }
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      g.addColorStop(0, "rgba(0,0,0,.32)"); g.addColorStop(0.18, "rgba(0,0,0,.06)"); g.addColorStop(0.35, "rgba(255,255,255,.22)"); g.addColorStop(0.5, "rgba(255,255,255,0)"); g.addColorStop(0.82, "rgba(0,0,0,.1)"); g.addColorStop(1, "rgba(0,0,0,.38)");
      ctx.fillStyle = g; ctx.fillRect(cx - R, top - ry, 2 * R, bot - top + 2 * ry); ctx.restore();
      ctx.beginPath(); ctx.ellipse(cx, top, R, ry, 0, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, top + 6, R - 26, ry - 12, 0, 0, Math.PI * 2); const gi = ctx.createLinearGradient(0, top - ry, 0, top + ry); gi.addColorStop(0, "rgba(0,0,0,.45)"); gi.addColorStop(1, "rgba(0,0,0,.12)"); ctx.fillStyle = gi; ctx.fill();
    } },
    box: { name: "Box", w: 1400, h: 1400, draw(ctx, src) {
      const av = avgColor(src), l = 250, t = 560, s = 620, dx = 300, dy = -190;
      shadowEllipse(ctx, l + s / 2 + dx / 2 + 40, t + s + 20, 560, 60, 0.3);
      ctx.beginPath(); ctx.moveTo(l, t); ctx.lineTo(l + dx, t + dy); ctx.lineTo(l + s + dx, t + dy); ctx.lineTo(l + s, t); ctx.closePath(); ctx.fillStyle = shade(av, 1.25); ctx.fill();
      ctx.beginPath(); ctx.moveTo(l + s, t); ctx.lineTo(l + s + dx, t + dy); ctx.lineTo(l + s + dx, t + dy + s); ctx.lineTo(l + s, t + s); ctx.closePath(); ctx.fillStyle = shade(av, 0.62); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(l, t, s, s); ctx.clip(); ctx.fillStyle = "#fff"; ctx.fillRect(l, t, s, s); place(ctx, src, l, t, s, s, "cover");
      const g = ctx.createLinearGradient(l, t, l + s, t + s); g.addColorStop(0, "rgba(255,255,255,.1)"); g.addColorStop(1, "rgba(0,0,0,.12)"); ctx.fillStyle = g; ctx.fillRect(l, t, s, s); ctx.restore();
      ctx.strokeStyle = "rgba(0,0,0,.18)"; ctx.lineWidth = 3; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(l, t); ctx.lineTo(l + s, t); ctx.lineTo(l + s, t + s); ctx.moveTo(l + s, t); ctx.lineTo(l + s + dx, t + dy); ctx.stroke();
    } },
    tote: { name: "Tote bag", w: 1400, h: 1400, color: true, def: "#eadfca", draw(ctx, src, col) {
      const handles = () => { ctx.beginPath(); ctx.moveTo(480, 540); ctx.bezierCurveTo(480, 180, 640, 180, 640, 540); ctx.moveTo(760, 540); ctx.bezierCurveTo(760, 180, 920, 180, 920, 540); };
      ctx.lineWidth = 38; ctx.lineCap = "round"; ctx.strokeStyle = col; handles(); ctx.stroke(); ctx.strokeStyle = "rgba(0,0,0,.16)"; handles(); ctx.stroke();
      const body = () => { ctx.beginPath(); ctx.moveTo(330, 520); ctx.lineTo(1070, 520); ctx.lineTo(1110, 1210); ctx.quadraticCurveTo(1112, 1240, 1080, 1240); ctx.lineTo(320, 1240); ctx.quadraticCurveTo(288, 1240, 290, 1210); ctx.closePath(); };
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16; body(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
      ctx.save(); body(); ctx.clip();
      ctx.globalCompositeOperation = lumHex(col) > 0.55 ? "multiply" : "source-over";
      place(ctx, src, 440, 640, 520, 500, "contain"); ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = noise(ctx); ctx.fillRect(0, 0, 1400, 1400);
      const g = ctx.createLinearGradient(290, 0, 1110, 0); g.addColorStop(0, "rgba(0,0,0,.14)"); g.addColorStop(0.5, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.18)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1400, 1400);
      ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(290, 520, 830, 26); ctx.restore();
    } },
    poster: { name: "Framed poster", w: 1400, h: 1400, draw(ctx, src) {
      const asp = src.width / src.height, maxW = 780, maxH = 1000;
      let w = maxW, h = w / asp; if (h > maxH) { h = maxH; w = h * asp; }
      const mat = 60, fr = 34, W = w + 2 * (mat + fr), H = h + 2 * (mat + fr), l = (1400 - W) / 2, t = (1400 - H) / 2 - 10;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 50; ctx.shadowOffsetX = 14; ctx.shadowOffsetY = 26;
      ctx.fillStyle = "#151515"; ctx.fillRect(l, t, W, H); ctx.restore();
      ctx.fillStyle = "#f7f5f0"; ctx.fillRect(l + fr, t + fr, W - 2 * fr, H - 2 * fr);
      ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.lineWidth = 4; ctx.strokeRect(l + fr + mat - 2, t + fr + mat - 2, w + 4, h + 4);
      ctx.drawImage(src, l + fr + mat, t + fr + mat, w, h);
      const g = ctx.createLinearGradient(l, t, l + W, t + H); g.addColorStop(0, "rgba(255,255,255,.12)"); g.addColorStop(0.4, "rgba(255,255,255,0)"); ctx.fillStyle = g; ctx.fillRect(l + fr, t + fr, W - 2 * fr, H - 2 * fr);
    } }
  };
  function drawMockup(type, src, col, scale = 1, bg) {
    const m = MOCKS[type], cv = document.createElement("canvas");
    cv.width = Math.round(m.w * scale); cv.height = Math.round(m.h * scale);
    const ctx = cv.getContext("2d"); ctx.scale(scale, scale);
    if (bg) { const g = ctx.createLinearGradient(0, 0, 0, m.h); g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, m.w, m.h); }
    m.draw(ctx, src, col || m.def || "#ffffff");
    return cv;
  }

  const dMock = dialog("dlg-mock", `<h3>Product mockups</h3>
    <p class="ds-hint">Put your design on a real-looking product. Great for shops, merch and app ads.</p>
    <div class="ds-row" style="gap:10px;flex-wrap:wrap;justify-content:flex-start">
      <label class="ds-row" style="gap:6px">Design <select id="mk-src" class="ds-input" style="width:auto"><option value="page">This page</option><option value="sel">Selected photo</option></select></label>
      <label class="ds-row" style="gap:6px" id="mk-col-wrap">Colour <input type="color" id="mk-col" value="#ffffff"></label>
      <label class="ds-check" style="margin:0"><input type="checkbox" id="mk-bg" checked> Soft background</label>
    </div>
    <div class="ds-mock-grid" id="mk-grid"></div>
    <div class="ds-mock-big"><canvas id="mk-big"></canvas></div>
    <div class="ds-row" style="justify-content:flex-end;gap:8px;flex-wrap:wrap">
      <button class="ds-btn ghost sm" id="mk-dl" type="button"><i class="fa-solid fa-download"></i> Download PNG</button>
      <button class="ds-btn primary sm" id="mk-page" type="button"><i class="fa-regular fa-file-image"></i> Add as new page</button>
      <button class="ds-btn ghost sm" data-close type="button">Close</button></div>`);
  let mkType = "phone", mkSrc = null;
  const BG = ["#f4f2ee", "#dedad3"];
  function mockSource() {
    const a = c.getActiveObject();
    if ($("#mk-src").value === "sel" && a && a.type === "image") return visibleCanvas(a);
    const [W, H] = S.size; return S.renderToCanvas(Math.min(2, 1400 / Math.max(W, H)));
  }
  function renderMocks() {
    mkSrc = mockSource();
    const col = $("#mk-col").value;
    $("#mk-grid").innerHTML = "";
    Object.keys(MOCKS).forEach(k => {
      const b = document.createElement("button"); b.type = "button"; b.className = "ds-mock" + (k === mkType ? " on" : ""); b.dataset.mock = k;
      const cv = drawMockup(k, mkSrc, MOCKS[k].color ? col : null, 0.12, BG); b.appendChild(cv);
      const s = document.createElement("span"); s.textContent = MOCKS[k].name; b.appendChild(s); $("#mk-grid").appendChild(b);
    });
    renderBig();
  }
  function renderBig() {
    const m = MOCKS[mkType], big = drawMockup(mkType, mkSrc, m.color ? $("#mk-col").value : null, 0.5, $("#mk-bg").checked ? BG : null);
    const cv = $("#mk-big"); cv.width = big.width; cv.height = big.height; cv.getContext("2d").drawImage(big, 0, 0);
    $("#mk-col-wrap").style.visibility = m.color ? "visible" : "hidden";
  }
  $("#mk-grid").addEventListener("click", e => {
    const b = e.target.closest("[data-mock]"); if (!b) return; mkType = b.dataset.mock;
    $$("#mk-grid .ds-mock").forEach(x => x.classList.toggle("on", x === b));
    if (MOCKS[mkType].color) $("#mk-col").value = MOCKS[mkType].def;
    renderBig();
  });
  $("#mk-col").addEventListener("input", () => { clearTimeout(renderMocks.t); renderMocks.t = setTimeout(renderMocks, 120); });
  $("#mk-src").addEventListener("change", renderMocks);
  $("#mk-bg").addEventListener("change", renderBig);
  function finalMock() { const m = MOCKS[mkType]; return drawMockup(mkType, mkSrc, m.color ? $("#mk-col").value : null, 1, $("#mk-bg").checked ? BG : null); }
  $("#mk-dl").onclick = () => { const cv = finalMock(); cv.toBlob(b => { S.saveBlob(b, `postly-mockup-${mkType}.png`); S.toast("Mockup downloaded ✔" + ($("#mk-bg").checked ? "" : " (transparent background)")); }, "image/png"); };
  $("#mk-page").onclick = async () => {
    const cv = finalMock(), url = cv.toDataURL("image/png"); dMock.close();
    await newPage(); S.setSize(1080, 1080, false); S.setBackground({ g: [180, [BG[0], 0], [BG[1], 1]] });
    await new Promise(r => fabric.Image.fromURL(url, img => {
      const s = Math.min(1080 / img.width, 1080 / img.height); img.set({ scaleX: s, scaleY: s, left: (1080 - img.width * s) / 2, top: (1080 - img.height * s) / 2, name: MOCKS[mkType].name + " mockup" });
      img.mdcType = "image"; c.add(img); c.setActiveObject(img); c.requestRenderAll(); r();
    }));
    S.saveState(); S.toast("Mockup added as a new page ✔ Add a headline and price to turn it into an ad.", 5000);
  };
  function openMockups() {
    const a = c.getActiveObject();
    $("#mk-src").value = a && a.type === "image" ? "sel" : "page";
    $("#mk-src [value=sel]").disabled = !(a && a.type === "image");
    open(dMock); renderMocks();
  }

  /* ======================================================================
     2) AI AD VARIATIONS FROM ONE PHOTO
     ====================================================================== */
  const dVar = dialog("dlg-var", `<h3>AI ad variations</h3>
    <p class="ds-hint">Add one product photo and a few words. Postly writes 5 different ads (benefit, offer, trust, urgency, lifestyle) and builds them in every size you pick.</p>
    <div class="ds-var-form">
      <label class="ds-btn ghost sm ds-file-btn"><i class="fa-regular fa-image"></i> <span id="var-photo-name">Product photo</span><input type="file" id="var-photo" accept="image/*" hidden></label>
      <input id="var-name" class="ds-input" maxlength="60" placeholder="Product or service name, e.g. Wireless Earbuds Pro">
      <textarea id="var-desc" class="ds-input" rows="2" maxlength="300" placeholder="What makes it great? Offer? e.g. 40-hour battery, noise cancelling, 20% off this week"></textarea>
      <div class="ds-row" style="gap:8px">
        <input id="var-price" class="ds-input" maxlength="16" placeholder="Price (optional)" style="flex:1;min-width:0">
        <select id="var-cta" class="ds-input" style="flex:1;min-width:0"><option>SHOP NOW</option><option>ORDER NOW</option><option>BUY NOW</option><option>GET OFFER</option><option>LEARN MORE</option><option>BOOK NOW</option><option>SIGN UP</option><option>DOWNLOAD</option></select>
      </div>
      <div class="ds-row" style="gap:12px;flex-wrap:wrap;justify-content:flex-start">
        <label class="ds-check" style="margin:0"><input type="checkbox" value="1080x1080" class="var-size" checked> Feed 1:1</label>
        <label class="ds-check" style="margin:0"><input type="checkbox" value="1080x1350" class="var-size"> Feed 4:5</label>
        <label class="ds-check" style="margin:0"><input type="checkbox" value="1080x1920" class="var-size"> Story 9:16</label>
      </div>
      <label class="ds-check"><input type="checkbox" id="var-cut"> Remove the photo background first <small>(best for products on a plain background)</small></label>
    </div>
    <div class="ds-row" style="justify-content:flex-end;gap:8px"><button class="ds-btn ghost sm" data-close type="button">Cancel</button>
      <button class="ds-btn primary sm" id="var-go" type="button"><i class="fa-solid fa-wand-magic-sparkles"></i> Make 5 ad variations</button></div>`, false);
  let varPhoto = "";
  $("#var-photo").addEventListener("change", async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { varPhoto = await S.readImage(f); $("#var-photo-name").textContent = f.name.length > 30 ? f.name.slice(0, 27) + "…" : f.name; } catch (err) { S.toast("Could not read that photo."); }
  });
  const VAR_STYLE = [
    { angle: "benefit", layout: "product", pal: "shopWhite" },
    { angle: "offer", layout: "product", pal: "shopDark" },
    { angle: "trust", layout: "lead", pal: "royal" },
    { angle: "urgency", layout: "product", pal: "sunset" },
    { angle: "lifestyle", layout: "product", pal: "cream" }
  ];
  function localCopy(name, desc, price, cta) {
    const bits = desc.split(/[,.;\n]+/).map(s => s.trim()).filter(Boolean);
    const b1 = bits[0] || "Made to last", b2 = bits[1] || "Loved by our customers", b3 = bits[2] || "Easy returns";
    return [
      { k: "NEW", t: name, s: bits.slice(0, 2).join(" · ") || "Quality you can feel", cta, trust: ["Fast delivery", "Easy returns"] },
      { k: "LIMITED OFFER", t: price ? `${name} for ${price}` : `Special price on ${name}`, s: b1, cta, trust: ["Offer ends soon"] },
      { k: "WHY CHOOSE US", t: `Why people pick ${name}`, list: [b1, b2, b3].map(x => x.length > 34 ? x.slice(0, 33) + "…" : x), cta },
      { k: "LAST CHANCE", t: "Don't miss out", s: `${name}: ${b1}`, cta, trust: ["While stocks last"] },
      { k: "MADE FOR YOU", t: `Upgrade your everyday with ${name}`, s: b2, cta, trust: ["Gift ready"] }
    ];
  }
  async function aiCopy(name, desc, price, cta) {
    const AI = window.MDC_AI; if (!AI) return null;
    const msg = `You write Facebook and Instagram ad creatives. Product: "${name}". Details: "${desc}". ${price ? "Price: " + price + "." : ""}
Return ONLY a JSON array of 5 ads, in this order of angle: benefit, offer, trust, urgency, lifestyle.
Each ad: {"k":"badge, max 3 words, CAPS","t":"headline, max 7 words","s":"one short supporting line, max 9 words","list":["3 short benefit bullets, max 4 words each"]}.
Rules: plain words, no made-up numbers, ratings, reviews or claims that are not in the details. No emojis. No quotes inside the text.`;
    const out = await AI.aiText([{ role: "user", content: msg }]);
    const m = String(out).match(/\[[\s\S]*\]/); if (!m) return null;
    let arr; try { arr = JSON.parse(m[0]); } catch (e) { return null; }
    if (!Array.isArray(arr) || arr.length < 3) return null;
    return arr.slice(0, 5).map(a => ({ k: String(a.k || "").toUpperCase().slice(0, 24), t: String(a.t || name).slice(0, 60), s: String(a.s || "").slice(0, 70), list: Array.isArray(a.list) ? a.list.slice(0, 3).map(x => String(x).slice(0, 34)) : [], cta }));
  }
  // put a cut-out product inside a frame without cropping it
  function containInFrame(frame, url) {
    return new Promise(res => fabric.Image.fromURL(url, img => {
      const fw = frame.mdcFrame.w * frame.scaleX, fh = frame.mdcFrame.h * frame.scaleY, s = Math.min(fw / img.width, fh / img.height) * 0.92;
      img.set({ scaleX: s, scaleY: s, left: frame.left + (fw - img.width * s) / 2, top: frame.top + (fh - img.height * s) / 2, name: "Product photo",
        shadow: new fabric.Shadow({ color: "rgba(0,0,0,.25)", blur: 40, offsetX: 0, offsetY: 18 }) });
      img.mdcType = "image"; const i = c.getObjects().indexOf(frame); c.remove(frame); c.insertAt(img, i); res(img);
    }));
  }
  async function makeVariations() {
    const name = $("#var-name").value.trim(), desc = $("#var-desc").value.trim(), price = $("#var-price").value.trim(), cta = $("#var-cta").value;
    const sizes = $$(".var-size:checked").map(i => i.value.split("x").map(Number));
    if (!name) { S.toast("Type the product name."); $("#var-name").focus(); return; }
    if (!sizes.length) { S.toast("Pick at least one size."); return; }
    const btn = $("#var-go"); busy(btn, true, "Writing ads…");
    try {
      let photo = varPhoto;
      const a = c.getActiveObject(); if (!photo && a && a.type === "image") photo = visibleCanvas(a).toDataURL("image/png");
      let cut = false;
      if (photo && $("#var-cut").checked) {
        try { busy(btn, false); busy(btn, true, "Removing background…"); const blob = await (await fetch(photo)).blob(); photo = await blobToURL(await S.removeBgBlob(blob, m => { busy(btn, false); busy(btn, true, m); })); cut = true; }
        catch (e) { console.warn(e); S.toast("Could not remove the background. Using the photo as it is.", 4000); }
      }
      let copy = null, usedAI = false;
      try { copy = await aiCopy(name, desc, price, cta); usedAI = !!copy; } catch (e) { console.warn(e); }
      if (!copy) copy = localCopy(name, desc, price, cta);
      while (copy.length < 5) copy.push(localCopy(name, desc, price, cta)[copy.length]);
      dVar.close();
      const total = sizes.length * 5; let n = 0, firstPage = null;
      for (const [W, H] of sizes) {
        for (let v = 0; v < 5; v++) {
          n++; busy(btn, false); busy(btn, true, `Building ${n} of ${total}…`); S.toast(`Building ad ${n} of ${total}…`, 1500);
          const st = VAR_STYLE[v], cp = Object.assign({}, copy[v]);
          if (st.layout === "lead") { if (!cp.list || !cp.list.length) cp.list = [cp.s].filter(Boolean); }
          else { delete cp.list; if (price && (v === 0 || v === 1 || v === 3)) cp.price = price.replace(/\s+/, "\n"); if (!cp.trust) cp.trust = ["Fast delivery", "Easy returns"]; }
          const tpl = KIT.makeAd(st.layout, [W, H], st.pal, cp, `ai-ad-${v}`); tpl.name = `Ad ${v + 1}: ${st.angle}`;
          if (n > 1 || !pageIsEmpty()) await newPage();
          if (firstPage == null) firstPage = F.cur;
          await S.loadTemplate(tpl);
          if (photo) {
            const fr = c.getObjects().find(o => o.mdcType === "frame");
            if (fr) { if (cut && st.layout !== "lead") await containInFrame(fr, photo); else { c.setActiveObject(fr); await S.addImageURL(photo); } }
          }
          c.discardActiveObject(); c.requestRenderAll(); S.saveState(); await sleep(120);
        }
      }
      S.toast(`${total} ad variations ready (pages ${firstPage + 1}–${firstPage + total})${usedAI ? "" : ", written without AI"}. Download all as a ZIP, or animate the best one.`, 7000);
    } catch (e) { console.error(e); S.toast("Could not make the variations. Please try again."); }
    busy(btn, false);
  }
  $("#var-go").onclick = makeVariations;
  function openVariations() {
    const a = c.getActiveObject();
    if (!varPhoto && a && a.type === "image") $("#var-photo-name").textContent = "Using the selected photo";
    open(dVar); setTimeout(() => $("#var-name").focus(), 50);
  }

  /* ======================================================================
     3) CAROUSEL BUILDER
     ====================================================================== */
  const dCar = dialog("dlg-car", `<h3>Carousel builder</h3>
    <p class="ds-hint">Make a swipeable Instagram / LinkedIn carousel: a cover, content slides and a final call to action. Each slide becomes a page; download them all as a ZIP or PDF.</p>
    <div class="ds-tabs" id="car-tabs"><button type="button" class="on" data-car="ai">Write with AI</button><button type="button" data-car="own">Use my text</button></div>
    <div id="car-ai"><input id="car-topic" class="ds-input" maxlength="120" placeholder="Topic, e.g. 5 ways to get more customers from Instagram">
      <label class="ds-row">Slides <input type="range" id="car-n" min="3" max="10" value="6"><span id="car-n-v">6</span></label></div>
    <div id="car-own" hidden><textarea id="car-text" class="ds-input" rows="7" placeholder="First block = cover title.&#10;&#10;Leave an empty line between slides.&#10;First line of each slide = heading, the rest = text.&#10;&#10;Last block = your call to action."></textarea></div>
    <div class="ds-row" style="gap:8px;flex-wrap:wrap;justify-content:flex-start;margin-top:8px">
      <input id="car-handle" class="ds-input" maxlength="30" placeholder="@yourbrand" style="flex:1;min-width:120px">
      <select id="car-size" class="ds-input" style="width:auto"><option value="1080x1350">Portrait 4:5</option><option value="1080x1080">Square 1:1</option></select>
      <select id="car-style" class="ds-input" style="width:auto"><option value="light">Clean light</option><option value="dark">Bold dark</option><option value="warm">Warm</option><option value="brand">My brand colours</option></select>
    </div>
    <div class="ds-row" style="justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:6px">
      <div class="ds-row" style="gap:6px"><button class="ds-btn ghost sm" id="car-pano" type="button" title="A wide canvas you design across, then split into slides"><i class="fa-solid fa-panorama"></i> Seamless panorama</button>
        <button class="ds-btn ghost sm" id="car-split" type="button"><i class="fa-solid fa-scissors"></i> Split this page</button></div>
      <div class="ds-row" style="gap:6px"><button class="ds-btn ghost sm" data-close type="button">Cancel</button><button class="ds-btn primary sm" id="car-go" type="button"><i class="fa-solid fa-layer-group"></i> Make carousel</button></div>
    </div>`, false);
  let carMode = "ai";
  $("#car-tabs").addEventListener("click", e => { const b = e.target.closest("[data-car]"); if (!b) return; carMode = b.dataset.car; $$("#car-tabs button").forEach(x => x.classList.toggle("on", x === b)); $("#car-ai").hidden = carMode !== "ai"; $("#car-own").hidden = carMode !== "own"; });
  $("#car-n").addEventListener("input", () => { $("#car-n-v").textContent = $("#car-n").value; });
  const CAR_STYLES = {
    light: { bg: "#ffffff", tx: "#111827", mu: "#4b5563", a: "#2563eb", on: "#ffffff", soft: "#eff4ff" },
    dark: { bg: { g: [150, ["#111827", 0], ["#030712", 1]] }, tx: "#ffffff", mu: "#cbd5e1", a: "#facc15", on: "#111827", soft: "rgba(255,255,255,.06)" },
    warm: { bg: { g: [150, ["#fff7ed", 0], ["#ffedd5", 1]] }, tx: "#431407", mu: "#7c2d12", a: "#ea580c", on: "#ffffff", soft: "rgba(234,88,12,.08)" }
  };
  function carStyle() {
    const v = $("#car-style").value;
    if (v === "brand") {
      const b = (window.MDC_FEATURES && window.MDC_FEATURES.brand) || {}, cols = (b.colors || b.colours || []).filter(Boolean);
      if (cols.length >= 2) { const dark = lumHex(cols[0]) < 0.5; return { bg: cols[0], tx: dark ? "#ffffff" : "#111111", mu: dark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)", a: cols[1], on: lumHex(cols[1]) > 0.6 ? "#111111" : "#ffffff", soft: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)" }; }
      S.toast("No brand colours saved yet (Brand tab). Using Clean light.", 4000);
    }
    return CAR_STYLES[v] || CAR_STYLES.light;
  }
  function parseOwn(text) {
    const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    if (blocks.length < 2) return null;
    const head = b => b.split("\n")[0].trim(), body = b => b.split("\n").slice(1).join(" ").trim();
    return { cover: head(blocks[0]), sub: body(blocks[0]), slides: blocks.slice(1, -1).map(b => ({ h: head(b), b: body(b) })), cta: head(blocks[blocks.length - 1]), ctaSub: body(blocks[blocks.length - 1]) };
  }
  function localCarousel(topic, n) {
    const k = Math.max(1, n - 2);
    return { cover: topic, sub: "Swipe to learn more", slides: Array.from({ length: k }, (_, i) => ({ h: `Point ${i + 1}`, b: "Write your tip here. Keep it short: one idea per slide." })), cta: "Found this useful?", ctaSub: "Save this post and follow for more." };
  }
  async function aiCarousel(topic, n) {
    const AI = window.MDC_AI; if (!AI) return null;
    const msg = `Write an Instagram carousel about: "${topic}". Total slides: ${n} (1 cover + ${n - 2} content + 1 call to action).
Return ONLY JSON: {"cover":"hook title, max 8 words","sub":"cover subtitle, max 8 words","slides":[{"h":"heading, max 6 words","b":"body, max 22 words"}],"cta":"final slide title, max 6 words","ctaSub":"max 12 words"}.
Make it practical and specific. No emojis, no hashtags, no made-up statistics.`;
    const out = await AI.aiText([{ role: "user", content: msg }]);
    const m = String(out).match(/\{[\s\S]*\}/); if (!m) return null;
    let d; try { d = JSON.parse(m[0]); } catch (e) { return null; }
    if (!d || !Array.isArray(d.slides) || !d.slides.length || !d.cover) return null;
    d.slides = d.slides.slice(0, n - 2).map(s => ({ h: String(s.h || ""), b: String(s.b || "") }));
    return d;
  }
  // slide layouts (template specs, 1080 wide)
  function slideSpec(kind, d, i, total, W, H, st, handle) {
    const u = W / 1080, m = 90 * u, cw = W - 2 * m, o = [];
    const dots = () => { const n = total, g = 22 * u, w0 = n * g; for (let k = 0; k < n; k++) o.push({ t: "circle", l: W - m - w0 + k * g, top: H - 70 * u, r: 6 * u, fill: k === i ? st.a : st.mu, opacity: k === i ? 1 : 0.35 }); };
    if (handle) o.push({ t: "text", text: handle, l: m, top: H - 82 * u, w: cw * 0.6, size: 30 * u, font: "Poppins", fill: st.mu, weight: 600, align: "left" });
    if (kind === "cover") {
      o.push({ t: "rect", l: m, top: 150 * u, w: 120 * u, h: 14 * u, rx: 7 * u, fill: st.a });
      o.push({ t: "text", text: d.cover, l: m, top: 210 * u, w: cw, size: 112 * u, font: "Montserrat", fill: st.tx, weight: 900, align: "left", lh: 1.04, name: "Cover title" });
      if (d.sub) o.push({ t: "text", text: d.sub, l: m, top: H * 0.66, w: cw, size: 44 * u, font: "Poppins", fill: st.mu, weight: 500, align: "left", lh: 1.3, name: "Cover subtitle" });
      o.push({ t: "rect", l: W - m - 250 * u, top: H - 190 * u, w: 250 * u, h: 76 * u, rx: 38 * u, fill: st.a });
      o.push({ t: "text", text: "Swipe  →", l: W - m - 250 * u, top: H - 172 * u, w: 250 * u, size: 34 * u, font: "Poppins", fill: st.on, weight: 700, align: "center" });
    } else if (kind === "slide") {
      o.push({ t: "text", text: String(i).padStart(2, "0"), l: m, top: 120 * u, w: 300 * u, size: 150 * u, font: "Anton", fill: st.a, weight: "normal", align: "left", lh: 1 });
      o.push({ t: "text", text: d.h, l: m, top: 330 * u, w: cw, size: 76 * u, font: "Montserrat", fill: st.tx, weight: 900, align: "left", lh: 1.08, name: "Slide heading" });
      if (d.b) o.push({ t: "text", text: d.b, l: m, top: H * 0.5, w: cw, size: 44 * u, font: "Poppins", fill: st.mu, weight: 500, align: "left", lh: 1.4, name: "Slide text" });
      dots();
    } else {
      o.push({ t: "rect", l: m, top: H * 0.2 - 30 * u, w: cw, h: H * 0.56, rx: 40 * u, fill: st.soft });
      o.push({ t: "text", text: d.cta, l: m + 50 * u, top: H * 0.2 + 30 * u, w: cw - 100 * u, size: 92 * u, font: "Montserrat", fill: st.tx, weight: 900, align: "center", lh: 1.06, name: "CTA title" });
      if (d.ctaSub) o.push({ t: "text", text: d.ctaSub, l: m + 50 * u, top: H * 0.46, w: cw - 100 * u, size: 42 * u, font: "Poppins", fill: st.mu, weight: 500, align: "center", lh: 1.35, name: "CTA text" });
      o.push({ t: "rect", l: W / 2 - 220 * u, top: H * 0.62, w: 440 * u, h: 96 * u, rx: 48 * u, fill: st.a });
      o.push({ t: "text", text: handle ? `Follow ${handle}` : "Save & share", l: W / 2 - 220 * u, top: H * 0.62 + 24 * u, w: 440 * u, size: 38 * u, font: "Poppins", fill: st.on, weight: 700, align: "center" });
      dots();
    }
    return { id: "car-" + kind + i, name: "Carousel slide " + (i + 1), cat: "Social", w: W, h: H, bg: st.bg, objects: o };
  }
  // shrink texts so each stays above the next element and inside the page
  function settleTexts() {
    const [W, H] = S.size, texts = S.userObjects().filter(o => o.type === "textbox").sort((a, b) => a.top - b.top);
    texts.forEach((o, k) => {
      const next = texts.slice(k + 1).find(x => x.top > o.top + 4 && x.left < o.left + o.getScaledWidth() && x.left + x.getScaledWidth() > o.left);
      const limit = Math.min(next ? next.top - 18 * W / 1080 : H - 110 * W / 1080, H * 0.98);
      let n = 0; while (n++ < 40 && o.fontSize > 18 && o.top + o.getScaledHeight() > limit) { o.set({ fontSize: o.fontSize * 0.94 }); o.initDimensions(); o.setCoords(); }
    });
  }
  async function makeCarousel() {
    const [W, H] = $("#car-size").value.split("x").map(Number), st = carStyle();
    let handle = $("#car-handle").value.trim(); if (handle && !handle.startsWith("@")) handle = "@" + handle;
    const btn = $("#car-go"); busy(btn, true, "Writing slides…");
    try {
      let d = null, usedAI = false;
      if (carMode === "own") { d = parseOwn($("#car-text").value); if (!d) { S.toast("Write at least a cover and one more block, separated by an empty line."); busy(btn, false); return; } }
      else {
        const topic = $("#car-topic").value.trim(); if (topic.length < 3) { S.toast("Type the carousel topic."); busy(btn, false); return; }
        const n = +$("#car-n").value;
        try { d = await aiCarousel(topic, n); usedAI = !!d; } catch (e) { console.warn(e); }
        if (!d) d = localCarousel(topic, n);
      }
      dCar.close();
      const specs = [slideSpec("cover", d, 0, d.slides.length + 2, W, H, st, handle)];
      d.slides.forEach((s, i) => specs.push(slideSpec("slide", s, i + 1, d.slides.length + 2, W, H, st, handle)));
      specs.push(slideSpec("cta", d, d.slides.length + 1, d.slides.length + 2, W, H, st, handle));
      let first = null;
      for (let i = 0; i < specs.length; i++) {
        busy(btn, false); busy(btn, true, `Slide ${i + 1} of ${specs.length}…`);
        if (i > 0 || !pageIsEmpty()) await newPage();
        if (first == null) first = F.cur;
        await S.loadTemplate(specs[i]); settleTexts(); c.requestRenderAll(); S.saveState(); await sleep(100);
      }
      S.toast(`Carousel ready: ${specs.length} slides (pages ${first + 1}–${first + specs.length})${carMode === "ai" && !usedAI ? ". AI was not available, so edit the placeholder text" : ""}. Download → ZIP gives you every slide.`, 7000);
    } catch (e) { console.error(e); S.toast("Could not make the carousel. Please try again."); }
    busy(btn, false);
  }
  $("#car-go").onclick = makeCarousel;
  $("#car-pano").onclick = async () => {
    const n = Math.max(2, Math.min(10, +$("#car-n").value || 3)), [w, h] = $("#car-size").value.split("x").map(Number);
    dCar.close(); await newPage(); S.setSize(w * n, h, false); S.setBackground("#ffffff"); S.saveState();
    const g = window.MDC_FEATURES; void g;
    S.toast(`Panorama ready: ${n} slides wide (${w * n}×${h}). Design across the whole canvas (photos can cross the joins), then tap Split this page.`, 8000);
  };
  function splitPage() {
    const [W, H] = S.size, ratios = [[1, 1], [0.8, 1]];
    let sw = 0, n = 0;
    for (const [rw] of ratios) { const w = H * rw, k = W / w; if (Math.abs(k - Math.round(k)) < 0.02 && Math.round(k) >= 2) { sw = w; n = Math.round(k); break; } }
    if (!n) { S.toast("This page isn't a panorama. Make one with Seamless panorama first (e.g. 3240×1080 = 3 square slides)."); return; }
    const base = JSON.parse(S.snapshot()), out = [];
    for (let i = 0; i < n; i++) {
      const d = JSON.parse(JSON.stringify(base)); d.w = Math.round(sw); d.h = H;
      d.json.objects.forEach(o => { if (o.mdcType === "bg") { o.left -= i * sw; } else o.left -= i * sw; });
      out.push(JSON.stringify(d));
    }
    dCar.close();
    (async () => { for (const s of out) await new Promise(r => F.addPage(s, r)); S.toast(`Split into ${n} slides ✔ They are the ${n} pages right after this one. Download → ZIP to post them in order.`, 6000); })();
  }
  $("#car-split").onclick = splitPage;
  function openCarousel() { open(dCar); setTimeout(() => (carMode === "ai" ? $("#car-topic") : $("#car-text")).focus(), 50); }

  /* ======================================================================
     4) FACEBOOK & INSTAGRAM AD PREVIEW
     ====================================================================== */
  const dPrev = dialog("dlg-adprev", `<h3>Facebook &amp; Instagram ad preview</h3>
    <div class="ds-row ds-adp-ctl">
      <input id="adp-page" class="ds-input" maxlength="40" value="Your Brand" placeholder="Page name">
      <select id="adp-cta" class="ds-input"><option>Shop now</option><option>Order now</option><option>Learn more</option><option>Sign up</option><option>Book now</option><option>Get offer</option><option>Download</option><option>Send message</option></select>
      <input id="adp-head" class="ds-input" maxlength="60" placeholder="Headline (under the image)" value="Free delivery today">
      <textarea id="adp-text" class="ds-input" rows="2" maxlength="500" placeholder="Primary text">New arrivals are here. Order today and get it delivered to your door.</textarea>
    </div>
    <div id="adp-check"></div>
    <div class="ds-adp-wrap" id="adp-wrap"></div>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`);
  let adImg = "", adRatio = 1;
  function textCoverage() {
    const d = JSON.parse(S.snapshot()), W = d.w, H = d.h; let area = 0;
    d.json.objects.filter(o => o.type === "textbox" && o.visible !== false && /[\p{L}\p{N}]/u.test(o.text || "")).forEach(o => {
      const w = Math.min(W, o.width * (o.scaleX || 1)), h = Math.min(H, (o.height || o.fontSize) * (o.scaleY || 1));
      // use the real text width per line, not the box width
      const lines = String(o.text).split("\n"), longest = Math.max(...lines.map(l => l.length)), est = Math.min(w, longest * o.fontSize * (o.scaleX || 1) * 0.56);
      area += est * h;
    });
    return Math.min(100, Math.round(area / (W * H) * 100));
  }
  function renderAdPreview() {
    const page = esc($("#adp-page").value || "Your Brand"), cta = esc($("#adp-cta").value), head = esc($("#adp-head").value), txt = esc($("#adp-text").value);
    const short = txt.length > 125 ? txt.slice(0, 125) + "… <span class='adp-more'>See more</span>" : txt;
    const feedR = Math.max(1, Math.min(1.25, 1 / adRatio)), storyFits = Math.abs(adRatio - 9 / 16) < 0.04;
    const feedImg = `<div class="adp-media" style="aspect-ratio:${1 / feedR}"><img src="${adImg}" alt="" style="object-fit:cover"></div>`;
    const av = `<span class="adp-av">${page.slice(0, 1)}</span>`;
    $("#adp-wrap").innerHTML = `
      <div class="adp-col"><p class="yp-label">Facebook feed</p><div class="adp-fb">
        <div class="adp-head">${av}<div><b>${page}</b><small>Sponsored · <i class="fa-solid fa-earth-americas"></i></small></div><span class="adp-dots">···</span></div>
        <p class="adp-text">${short}</p>${feedImg}
        <div class="adp-bar"><div><small>${esc(location.hostname || "yourshop.com").toUpperCase()}</small><b>${head}</b></div><span class="adp-cta">${cta}</span></div>
        <div class="adp-actions"><span><i class="fa-regular fa-thumbs-up"></i> Like</span><span><i class="fa-regular fa-comment"></i> Comment</span><span><i class="fa-solid fa-share"></i> Share</span></div></div></div>
      <div class="adp-col"><p class="yp-label">Instagram feed</p><div class="adp-ig">
        <div class="adp-head">${av}<div><b>${page.toLowerCase().replace(/\s+/g, "")}</b><small>Sponsored</small></div><span class="adp-dots">···</span></div>
        ${feedImg}<div class="adp-igcta">${cta}<i class="fa-solid fa-chevron-right"></i></div>
        <div class="adp-igicons"><i class="fa-regular fa-heart"></i><i class="fa-regular fa-comment"></i><i class="fa-regular fa-paper-plane"></i><i class="fa-regular fa-bookmark" style="margin-left:auto"></i></div>
        <p class="adp-text"><b>${page.toLowerCase().replace(/\s+/g, "")}</b> ${short}</p></div></div>
      <div class="adp-col"><p class="yp-label">Stories &amp; Reels</p><div class="adp-story">
        ${storyFits ? `<img src="${adImg}" alt="" class="adp-story-img">` : `<img src="${adImg}" alt="" class="adp-story-blur"><img src="${adImg}" alt="" class="adp-story-fit">`}
        <div class="adp-story-top"><span class="adp-bars"><i></i></span><div class="adp-head">${av}<div><b>${page}</b><small>Sponsored</small></div></div></div>
        <div class="adp-story-cta"><i class="fa-solid fa-chevron-up"></i><span>${cta}</span></div></div></div>`;
  }
  function adChecks() {
    const [W, H] = S.size, r = W / H, cov = textCoverage(), out = [];
    if (Math.abs(r - 1) < 0.02 || Math.abs(r - 0.8) < 0.02) out.push(["good", "Right shape for feeds", r < 0.9 ? "4:5 takes the most space in the feed." : "1:1 works everywhere. 4:5 takes more space on phones."]);
    else if (Math.abs(r - 9 / 16) < 0.03) out.push(["ok", "Story/Reels size", "In the feed it will be cropped to 4:5 (the middle part). Make a 1:1 or 4:5 version too: YT & Ads → Make Facebook & Instagram ad set."]);
    else out.push(["bad", "Unusual size", "Use 1080×1080, 1080×1350 or 1080×1920 for Facebook and Instagram ads."]);
    if (cov <= 20) out.push(["good", `Text covers about ${cov}% of the image`, "Good. Images with little text usually reach more people for the same budget."]);
    else if (cov <= 35) out.push(["ok", `Text covers about ${cov}% of the image`, "Meta recommends less text. Move details into the primary text."]);
    else out.push(["bad", `Text covers about ${cov}% of the image`, "That's a lot of text. Ads with less text on the image usually get cheaper reach."]);
    const t = $("#adp-text").value.trim().length, h = $("#adp-head").value.trim().length;
    out.push(t <= 125 ? ["good", "Primary text fits", "It shows in full without “See more”."] : ["ok", `Primary text is ${t} characters`, "Only the first ~125 show before “See more”. Put the hook first."]);
    if (h > 40) out.push(["ok", `Headline is ${h} characters`, "Headlines over 40 characters get cut on phones."]);
    const I = { good: "fa-circle-check", ok: "fa-circle-exclamation", bad: "fa-circle-xmark" };
    $("#adp-check").innerHTML = `<ul class="ds-score-list ds-adp-list">${out.map(([s, a, b]) => `<li class="${s}"><i class="fa-solid ${I[s]}"></i><div><b>${esc(a)}</b><small>${esc(b)}</small></div></li>`).join("")}</ul>`;
  }
  function openAdPreview() {
    const [W, H] = S.size; adRatio = W / H;
    adImg = S.renderToCanvas(Math.min(1, 720 / Math.max(W, H))).toDataURL("image/jpeg", 0.9);
    renderAdPreview(); adChecks(); open(dPrev);
  }
  ["#adp-page", "#adp-cta", "#adp-head", "#adp-text"].forEach(s => $(s).addEventListener("input", () => { renderAdPreview(); adChecks(); }));

  /* ---------------- wire up the panel ---------------- */
  $("#ad-mockups").onclick = openMockups;
  $("#ad-variations").onclick = openVariations;
  $("#ad-carousel").onclick = openCarousel;
  $("#ad-preview").onclick = openAdPreview;
  window.MDC_ADTOOLS = { drawMockup, MOCKS, openMockups, openVariations, makeVariations, localCopy, openCarousel, makeCarousel, splitPage, parseOwn, openAdPreview, textCoverage };
})();
