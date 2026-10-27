/* Postly Design Studio: animated ads
   - per-element entrance + loop animations (saved on the object as mdcAnim)
   - one-click page presets
   - preview player, MP4/WebM video export (MediaRecorder) and GIF export (gifenc)  */
(function () {
  const S = window.MDC_STUDIO; if (!S) return;
  const c = S.canvas;
  if (!S.PROPS.includes("mdcAnim")) S.PROPS.push("mdcAnim");
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  /* ---------------- animation library ---------------- */
  const IN = [
    ["none", "None"], ["fade", "Fade in"], ["up", "Slide up"], ["down", "Slide down"], ["left", "Slide from right"], ["right", "Slide from left"],
    ["zoom", "Zoom in"], ["pop", "Pop"], ["drop", "Drop & bounce"], ["spin", "Spin in"], ["type", "Typewriter (text)"], ["blur", "Rise & fade"]
  ];
  const LOOP = [["none", "None"], ["pulse", "Pulse"], ["shake", "Shake"], ["float", "Float"], ["blink", "Blink"], ["wiggle", "Wiggle"], ["spin", "Rotate"]];
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const E = {
    out: p => 1 - Math.pow(1 - p, 3),
    back: p => { const s = 1.70158 * 1.3; p -= 1; return p * p * ((s + 1) * p + s) + 1; },
    bounce: p => { const n = 7.5625, d = 2.75; if (p < 1 / d) return n * p * p; if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75; if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375; return n * (p -= 2.625 / d) * p + 0.984375; }
  };
  // state = { dx, dy, s, a, o, text } changes relative to the object's design state
  function entrance(kind, p, W, H) {
    const e = E.out(p), st = { dx: 0, dy: 0, s: 1, a: 0, o: 1 };
    switch (kind) {
      case "fade": st.o = p; break;
      case "up": st.dy = (1 - e) * H * 0.12; st.o = clamp01(p * 1.6); break;
      case "down": st.dy = -(1 - e) * H * 0.12; st.o = clamp01(p * 1.6); break;
      case "left": st.dx = (1 - e) * W * 0.25; st.o = clamp01(p * 1.6); break;
      case "right": st.dx = -(1 - e) * W * 0.25; st.o = clamp01(p * 1.6); break;
      case "zoom": st.s = 0.4 + 0.6 * e; st.o = clamp01(p * 1.4); break;
      case "pop": st.s = Math.max(0.001, E.back(p)); st.o = clamp01(p * 3); break;
      case "drop": st.dy = -(1 - E.bounce(p)) * H * 0.6; break;
      case "spin": st.a = -(1 - e) * 200; st.s = 0.3 + 0.7 * e; st.o = clamp01(p * 2); break;
      case "blur": st.dy = (1 - e) * H * 0.04; st.s = 0.96 + 0.04 * e; st.o = e; break;
      case "type": st.typed = p; break;
    }
    return st;
  }
  function loop(kind, t, st, u) {
    const TAU = Math.PI * 2;
    switch (kind) {
      case "pulse": st.s *= 1 + 0.06 * (0.5 - 0.5 * Math.cos(TAU * t / 1.1)); break;
      case "shake": { const ph = t % 2.2; if (ph < 0.55) st.a += 5 * Math.sin(TAU * ph * 7) * (1 - ph / 0.55); break; }
      case "float": st.dy += 10 * u * Math.sin(TAU * t / 2.4); break;
      case "blink": st.o *= 0.55 + 0.45 * (0.5 + 0.5 * Math.cos(TAU * t / 1.2)); break;
      case "wiggle": st.a += 6 * Math.sin(TAU * t / 1.4); break;
      case "spin": st.a += (t * 90) % 360; break;
    }
    return st;
  }

  /* ---------------- panel UI ---------------- */
  const opt = list => list.map(([v, n]) => `<option value="${v}">${n}</option>`).join("");
  $("#anim-in").innerHTML = opt(IN);
  $("#anim-loop").innerHTML = opt(LOOP);
  const animated = () => S.userObjects().filter(o => o.mdcAnim && (o.mdcAnim.in !== "none" || o.mdcAnim.loop !== "none"));
  const label = o => o.type === "textbox" ? `“${(o.text || "").replace(/\s+/g, " ").slice(0, 22)}”` : (o.name || o.type);
  function renderList() {
    const list = animated();
    $("#anim-list").innerHTML = list.length ? list.map((o, i) => {
      const a = o.mdcAnim, n = (IN.find(x => x[0] === a.in) || IN[0])[1], l = (LOOP.find(x => x[0] === a.loop) || LOOP[0])[1];
      return `<button class="ds-anim-item" data-ai="${i}"><b>${esc(label(o))}</b><small>${a.in !== "none" ? esc(n) + " · " + a.d.toFixed(1) + "s" : ""}${a.loop !== "none" ? (a.in !== "none" ? " · " : "") + "loop: " + esc(l) : ""}</small></button>`;
    }).join("") : `<p class="ds-hint">Nothing is animated yet. Try a one-click style above, or select an element.</p>`;
    $("#anim-count").textContent = list.length ? `(${list.length})` : "";
  }
  $("#anim-list").addEventListener("click", e => { const b = e.target.closest("[data-ai]"); if (!b) return; const o = animated()[+b.dataset.ai]; if (o) { c.setActiveObject(o); c.requestRenderAll(); syncForm(); } });
  function syncForm() {
    const o = c.getActiveObject(), on = !!o && o.mdcType !== "bg" && o.type !== "activeSelection";
    $("#anim-el").hidden = !on;
    $("#anim-el-none").hidden = on;
    if (!on) return;
    const a = o.mdcAnim || { in: "none", d: 0, t: 0.7, loop: "none" };
    $("#anim-el-name").textContent = label(o);
    $("#anim-in").value = a.in; $("#anim-loop").value = a.loop;
    $("#anim-delay").value = a.d; $("#anim-dur").value = a.t;
    $("#anim-delay-v").textContent = (+a.d).toFixed(1) + "s"; $("#anim-dur-v").textContent = (+a.t).toFixed(1) + "s";
    $("#anim-in [value=type]").disabled = o.type !== "textbox";
  }
  function setAnim() {
    const o = c.getActiveObject(); if (!o) return;
    o.mdcAnim = { in: $("#anim-in").value, d: +$("#anim-delay").value, t: +$("#anim-dur").value, loop: $("#anim-loop").value };
    if (o.mdcAnim.in === "none" && o.mdcAnim.loop === "none") delete o.mdcAnim;
    $("#anim-delay-v").textContent = (+$("#anim-delay").value).toFixed(1) + "s"; $("#anim-dur-v").textContent = (+$("#anim-dur").value).toFixed(1) + "s";
    S.saveState(); renderList();
  }
  ["#anim-in", "#anim-loop"].forEach(s => $(s).addEventListener("change", setAnim));
  ["#anim-delay", "#anim-dur"].forEach(s => { $(s).addEventListener("input", () => { $(s + "-v").textContent = (+$(s).value).toFixed(1) + "s"; }); $(s).addEventListener("change", setAnim); });
  ["selection:created", "selection:updated", "selection:cleared"].forEach(ev => c.on(ev, () => { if (panelOpen()) syncForm(); }));
  const panelOpen = () => { const s = $('section[data-panel="animate"]'); return s && s.offsetParent !== null; };
  document.querySelector('.ds-rail [data-panel="animate"]').addEventListener("click", () => setTimeout(() => { syncForm(); renderList(); }, 30));
  document.addEventListener("mdc:saved", () => { if (panelOpen()) renderList(); });

  /* ---------------- one-click styles ---------------- */
  const CTA = /order|shop|buy|book|call|now|get|apply|join|register|download|install|subscribe|swipe|learn more|sign up|claim|visit|watch/i;
  function role(o, W, H) {
    const t = o.type === "group" ? (o.getObjects().find(x => x.type === "textbox" || x.type === "text") || {}).text || o.name || "" : o.type === "textbox" ? o.text : "";
    const area = o.getScaledWidth() * o.getScaledHeight() / (W * H);
    if (CTA.test(t) && t.length < 30) return "cta";
    if (o.type === "image" || o.mdcType === "frame") return area > 0.85 ? "backdrop" : "photo";
    if (o.type === "textbox") return o.fontSize * (o.scaleY || 1) >= Math.min(W, H) * 0.07 ? "headline" : "text";
    if (o.type === "group") return area < 0.12 ? "badge" : "shape";
    return area > 0.6 ? "backdrop" : "shape";
  }
  const STYLES = {
    smooth:   { backdrop: ["fade", 0.8], photo: ["zoom", 0.8], headline: ["up", 0.7], text: ["up", 0.6], badge: ["pop", 0.5], cta: ["up", 0.6, "pulse"], shape: ["fade", 0.6] },
    punchy:   { backdrop: ["zoom", 0.6], photo: ["pop", 0.6], headline: ["pop", 0.55], text: ["fade", 0.5], badge: ["spin", 0.6, "wiggle"], cta: ["pop", 0.5, "pulse"], shape: ["pop", 0.5] },
    slide:    { backdrop: ["fade", 0.6], photo: ["left", 0.8], headline: ["right", 0.7], text: ["right", 0.7], badge: ["drop", 0.9], cta: ["up", 0.6, "shake"], shape: ["fade", 0.6] },
    type:     { backdrop: ["fade", 0.6], photo: ["blur", 1], headline: ["type", 1.2], text: ["type", 1], badge: ["pop", 0.5], cta: ["fade", 0.6, "blink"], shape: ["fade", 0.6] },
    sale:     { backdrop: ["zoom", 0.7], photo: ["drop", 1], headline: ["pop", 0.6, "pulse"], text: ["up", 0.5], badge: ["spin", 0.7, "wiggle"], cta: ["pop", 0.5, "shake"], shape: ["fade", 0.5] }
  };
  function applyStyle(name) {
    const [W, H] = S.size, st = STYLES[name]; let d = 0.1, n = 0;
    const objs = S.userObjects();
    objs.forEach(o => {
      const r = role(o, W, H), [kind, t, lp] = st[r] || st.shape;
      const k = kind === "type" && o.type !== "textbox" ? "fade" : kind;
      o.mdcAnim = { in: k, d: +(r === "backdrop" ? 0 : d).toFixed(2), t, loop: lp || "none" };
      if (r !== "backdrop") { d += r === "headline" ? 0.35 : 0.22; n++; }
    });
    // keep the whole intro under ~3 s
    if (d > 3) objs.forEach(o => { o.mdcAnim.d = +(o.mdcAnim.d * 3 / d).toFixed(2); });
    S.saveState(); renderList(); syncForm();
    S.toast(`Animated ${objs.length} elements ✔ Press Preview to watch it.`);
  }
  $$("[data-anim-style]").forEach(b => b.onclick = () => applyStyle(b.dataset.animStyle));
  $("#anim-clear").onclick = () => { S.userObjects().forEach(o => { delete o.mdcAnim; }); S.saveState(); renderList(); syncForm(); S.toast("All animations removed."); };

  /* ---------------- frame renderer (off-screen, never touches the editor) ---------------- */
  async function buildStage(scale) {
    const str = S.snapshot(), d = JSON.parse(str);
    const fonts = [...new Set((d.json.objects || []).filter(o => o.fontFamily).map(o => o.fontFamily))];
    await Promise.all(fonts.map(f => S.fontLoad(f)));
    const sc = new fabric.StaticCanvas(null, { width: d.w, height: d.h, enableRetinaScaling: false, renderOnAddRemove: false });
    await new Promise(r => sc.loadFromJSON(d.json, r));
    sc.getObjects().forEach(o => { if (o.mdcType === "frame") o.visible = false; });
    const items = sc.getObjects().filter(o => o.mdcAnim).map(o => ({ o, a: o.mdcAnim, base: { left: o.left, top: o.top, scaleX: o.scaleX, scaleY: o.scaleY, angle: o.angle || 0, opacity: o.opacity == null ? 1 : o.opacity, text: o.text, center: o.getCenterPoint() } }));
    const W = d.w, H = d.h, u = Math.min(W, H) / 1080;
    const end = items.reduce((m, x) => Math.max(m, x.a.in !== "none" ? x.a.d + x.a.t : 0), 0);
    function draw(t) {
      items.forEach(({ o, a, base }) => {
        let st = { dx: 0, dy: 0, s: 1, a: 0, o: 1 };
        if (a.in !== "none") {
          const p = clamp01((t - a.d) / Math.max(0.05, a.t));
          st = entrance(a.in, p, W, H);
          if (t < a.d && a.in !== "type") st.o = 0;
        }
        if (a.loop !== "none") { const lt = Math.max(0, t - (a.in !== "none" ? a.d + a.t : 0)); if (lt > 0 || a.in === "none") st = loop(a.loop, lt, st, u); }
        if (o.type === "textbox" && base.text != null) {
          const want = st.typed == null ? base.text : base.text.slice(0, Math.round(base.text.length * st.typed));
          if (o.text !== want) { o.set({ text: want }); o.initDimensions(); }
          if (st.typed != null && t < a.d) st.o = 0;
        }
        o.set({ scaleX: base.scaleX * st.s, scaleY: base.scaleY * st.s, angle: base.angle + st.a, opacity: base.opacity * clamp01(st.o) });
        o.setPositionByOrigin(new fabric.Point(base.center.x + st.dx, base.center.y + st.dy), "center", "center");
      });
      sc.renderAll();
    }
    const el = sc.getElement();
    return { W, H, end, count: items.length, draw, el, dispose: () => sc.dispose(), scale };
  }

  /* ---------------- preview player ---------------- */
  const dlg = document.createElement("dialog");
  dlg.className = "ds-dialog wide"; dlg.id = "dlg-anim";
  dlg.innerHTML = `<h3>Animation preview</h3>
    <div class="ds-anim-stage"><canvas id="anim-cv"></canvas></div>
    <div class="ds-row" style="gap:8px;flex-wrap:wrap">
      <button class="ds-btn ghost sm" id="anim-replay" type="button"><i class="fa-solid fa-rotate-right"></i> Replay</button>
      <span class="ds-hint" id="anim-time" style="margin:0">0.0s</span>
      <span style="flex:1"></span>
      <button class="ds-btn ghost sm" id="anim-dl-gif2" type="button"><i class="fa-solid fa-film"></i> GIF</button>
      <button class="ds-btn primary sm" id="anim-dl-vid2" type="button"><i class="fa-solid fa-video"></i> Video</button>
      <button class="ds-btn ghost sm" data-close type="button">Close</button>
    </div>`;
  document.querySelector(".ds-app").appendChild(dlg);
  let player = null;
  function stopPlayer() { if (player) { cancelAnimationFrame(player.raf); player.stage.dispose(); player = null; } }
  dlg.addEventListener("close", stopPlayer);
  dlg.querySelector("[data-close]").onclick = () => dlg.close();
  const totalLen = () => +$("#anim-len").value;
  async function play() {
    stopPlayer();
    const stage = await buildStage(1);
    if (!stage.count) { stage.dispose(); S.toast("Nothing is animated yet. Pick a one-click style first."); return false; }
    const cv = $("#anim-cv"), mx = Math.min(1, 720 / Math.max(stage.W, stage.H));
    cv.width = Math.round(stage.W * mx); cv.height = Math.round(stage.H * mx);
    const ctx = cv.getContext("2d"), len = totalLen(), t0 = performance.now();
    if (stage.end > len) S.toast(`The animations take ${stage.end.toFixed(1)}s, longer than the video (${len}s). Make the video longer or start them sooner.`, 6000);
    player = { stage, raf: 0 };
    const tick = () => {
      if (!player || player.stage !== stage) return;
      const t = ((performance.now() - t0) / 1000) % len;
      stage.draw(t); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(stage.el, 0, 0, cv.width, cv.height);
      $("#anim-time").textContent = `${t.toFixed(1)}s / ${len}s`;
      player.raf = requestAnimationFrame(tick);
    };
    tick(); return true;
  }
  async function openPreview() { if (await play()) { if (!dlg.open) (dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "")); } }
  $("#anim-preview").onclick = openPreview;
  $("#anim-replay").onclick = play;

  /* ---------------- exports ---------------- */
  function exportSize(stage) {
    const want = +$("#anim-res").value, s = Math.min(1, want / Math.max(stage.W, stage.H));
    return [Math.round(stage.W * s / 2) * 2, Math.round(stage.H * s / 2) * 2];
  }
  function pickMime() {
    if (!window.MediaRecorder) return null;
    const list = ["video/mp4;codecs=avc1.42E01F", "video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    return list.find(m => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || null;
  }
  function progress(btn, pct, label) { btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${label} ${Math.round(pct)}%`; }
  let exporting = false;
  async function exportVideo(btn) {
    if (exporting) return; const mime = pickMime();
    if (!mime) { S.toast("Your browser can't record video. Try Chrome or Edge, or download a GIF."); return; }
    exporting = true; const html = btn.innerHTML; btn.disabled = true;
    let stage;
    try {
      stage = await buildStage(1);
      if (!stage.count) { S.toast("Nothing is animated yet. Pick a one-click style first."); return; }
      const [w, h] = exportSize(stage), out = document.createElement("canvas"); out.width = w; out.height = h;
      const ctx = out.getContext("2d"), len = totalLen(), fps = 30;
      stage.draw(0); ctx.drawImage(stage.el, 0, 0, w, h);
      const stream = out.captureStream(fps), rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Math.round(w * h * fps * 0.18) });
      const chunks = []; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      const done = new Promise(r => { rec.onstop = r; });
      rec.start(250);
      const t0 = performance.now();
      await new Promise(res => {
        const step = () => {
          const t = (performance.now() - t0) / 1000;
          if (t >= len) return res();
          stage.draw(t); ctx.drawImage(stage.el, 0, 0, w, h);
          progress(btn, t / len * 100, "Recording");
          setTimeout(step, 1000 / fps / 2);
        };
        step();
      });
      rec.stop(); await done;
      const type = mime.split(";")[0], ext = type === "video/mp4" ? "mp4" : "webm";
      const blob = new Blob(chunks, { type });
      S.saveBlob(blob, `postly-ad-${w}x${h}.${ext}`);
      S.toast(ext === "mp4" ? `Video downloaded ✔ ${w}×${h} MP4, ${(blob.size / 1048576).toFixed(1)} MB.` : `Video downloaded ✔ (WebM: your browser can't make MP4). Upload it as is, or convert it to MP4 free in CapCut.`, 6000);
      window.MDC_ANIM._last = { size: blob.size, ext, w, h };
    } catch (e) { console.error(e); S.toast("Could not make the video. Please try again in Chrome or Edge."); }
    finally { if (stage) stage.dispose(); exporting = false; btn.disabled = false; btn.innerHTML = html; }
  }
  let gifLib = null;
  async function loadGif() {
    if (!gifLib) gifLib = import("https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js");
    return gifLib;
  }
  async function exportGIF(btn) {
    if (exporting) return;
    exporting = true; const html = btn.innerHTML; btn.disabled = true;
    let stage;
    try {
      progress(btn, 0, "Loading");
      const { GIFEncoder, quantize, applyPalette } = await loadGif();
      stage = await buildStage(1);
      if (!stage.count) { S.toast("Nothing is animated yet. Pick a one-click style first."); return; }
      const mx = Math.min(1, Math.min(+$("#anim-res").value, 600) / Math.max(stage.W, stage.H));
      const w = Math.max(2, Math.round(stage.W * mx)), h = Math.max(2, Math.round(stage.H * mx));
      const out = document.createElement("canvas"); out.width = w; out.height = h;
      const ctx = out.getContext("2d", { willReadFrequently: true }), len = totalLen(), fps = 12, n = Math.round(len * fps);
      const gif = GIFEncoder(); let palette = null;
      for (let i = 0; i < n; i++) {
        stage.draw(i / fps); ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(stage.el, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        if (!palette || i % 12 === 0) palette = quantize(data, 256);
        gif.writeFrame(applyPalette(data, palette), w, h, { palette, delay: Math.round(1000 / fps) });
        if (i % 3 === 0) { progress(btn, i / n * 100, "Making GIF"); await new Promise(r => setTimeout(r, 0)); }
      }
      gif.finish();
      const blob = new Blob([gif.bytes()], { type: "image/gif" });
      S.saveBlob(blob, `postly-ad-${w}x${h}.gif`);
      S.toast(`GIF downloaded ✔ ${w}×${h}, ${(blob.size / 1048576).toFixed(1)} MB. For ads, video looks sharper and is smaller.`, 5500);
      window.MDC_ANIM._last = { size: blob.size, ext: "gif", w, h };
    } catch (e) { console.error(e); S.toast("Could not make the GIF. Check your internet and try again."); }
    finally { if (stage) stage.dispose(); exporting = false; btn.disabled = false; btn.innerHTML = html; }
  }
  $("#anim-dl-vid").onclick = e => exportVideo(e.currentTarget);
  $("#anim-dl-gif").onclick = e => exportGIF(e.currentTarget);
  $("#anim-dl-vid2").onclick = e => { stopPlayer(); dlg.close(); exportVideo($("#anim-dl-vid")); };
  $("#anim-dl-gif2").onclick = e => { stopPlayer(); dlg.close(); exportGIF($("#anim-dl-gif")); };
  $("#anim-len").addEventListener("input", () => { $("#anim-len-v").textContent = $("#anim-len").value + "s"; });
  if (!pickMime()) $("#anim-dl-vid").title = "Video export needs Chrome, Edge or a recent Safari/Firefox";

  window.MDC_ANIM = { applyStyle, buildStage, play, openPreview, exportVideo, exportGIF, pickMime, IN, LOOP, _last: null };
  renderList();
})();
