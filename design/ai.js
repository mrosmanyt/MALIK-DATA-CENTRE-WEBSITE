/* ==========================================================================
   Postly Design Studio — AI features
   Engine: Pollinations.ai (direct with a publishable key, or through /api/ai)
   Settings live in ai-config.js. Photo tools that run fully in the browser
   (Enhance 2×, Magic eraser) do not use the AI quota.
   ========================================================================== */
(function () {
  "use strict";
  const S = window.MDC_STUDIO; if (!S) return;
  const CFG = Object.assign({ mode: "direct", base: "https://gen.pollinations.ai", key: "", textModel: "openai", imageModel: "flux", proxyUrl: "/api/ai", dailyLimit: 20 }, window.MDC_AI_CONFIG || {});
  const c = S.canvas;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const active = () => c.getActiveObject();
  const OPENCV = "https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.10.0-release.1/dist/opencv.js";

  /* ---------------- daily quota (per browser) ---------------- */
  const QKEY = "mdc_ai_used";
  const today = () => new Date().toISOString().slice(0, 10);
  function used() { try { const q = JSON.parse(localStorage.getItem(QKEY) || "{}"); return q.d === today() ? q.n : 0; } catch (e) { return 0; } }
  function spend() { try { localStorage.setItem(QKEY, JSON.stringify({ d: today(), n: used() + 1 })); } catch (e) {} showQuota(); }
  function showQuota() { const left = Math.max(0, CFG.dailyLimit - used()); $("#ai-quota").textContent = `${left} of ${CFG.dailyLimit} free AI uses left today. Enhance and Magic eraser are unlimited.`; }
  function canSpend() { if (used() >= CFG.dailyLimit) { S.toast("You've used today's free AI. Come back tomorrow, or ask us to design it for you (Download → Ask us to design it)."); return false; } return true; }
  showQuota();

  class AIError extends Error { constructor(msg, status) { super(msg); this.status = status; } }
  function friendly(e) {
    const st = e && e.status;
    if (st === 401 || st === 402 || st === 403) return "AI is not switched on for this site yet. Please try again later.";
    if (st === 429) return "AI is busy right now. Please wait a minute and try again.";
    if (st >= 500) return "The AI service is having a problem. Please try again shortly.";
    return "AI could not finish. Check your internet and try again.";
  }

  /* ---------------- engine ---------------- */
  async function aiText(messages) {
    let res;
    if (CFG.mode === "proxy") {
      res = await fetch(CFG.proxyUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "text", model: CFG.textModel, messages }) });
    } else {
      const headers = { "Content-Type": "application/json" }; if (CFG.key) headers.Authorization = "Bearer " + CFG.key;
      res = await fetch(`${CFG.base}/v1/chat/completions`, { method: "POST", headers, body: JSON.stringify({ model: CFG.textModel, messages }) });
    }
    if (!res.ok) throw new AIError("text " + res.status, res.status);
    const data = await res.json();
    const out = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!out) throw new AIError("empty", 500);
    spend();
    return String(out).trim();
  }
  async function aiImage(prompt, w, h, seed) {
    const q = `width=${w}&height=${h}&seed=${seed}&model=${encodeURIComponent(CFG.imageModel)}&nologo=true`;
    const url = CFG.mode === "proxy"
      ? `${CFG.proxyUrl}?type=image&prompt=${encodeURIComponent(prompt)}&${q}`
      : `${CFG.base}/image/${encodeURIComponent(prompt)}?${q}${CFG.key ? "&key=" + encodeURIComponent(CFG.key) : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new AIError("image " + res.status, res.status);
    const blob = await res.blob();
    if (!/^image\//.test(blob.type)) throw new AIError("not image", 500);
    spend();
    return blob;
  }
  const blobToURL = b => new Promise((r, j) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = j; fr.readAsDataURL(b); });
  const loadImg = src => new Promise((r, j) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => r(i); i.onerror = j; i.src = src; });
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.html = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${label || "Working…"}`; }
    else { btn.disabled = false; if (btn.dataset.html) btn.innerHTML = btn.dataset.html; }
  }
  function aspectSize() { const [W, H] = S.size, s = 1024 / Math.max(W, H); return [Math.round(W * s / 8) * 8, Math.round(H * s / 8) * 8]; }

  /* ======================================================================
     1) MAGIC DESIGN: prompt → template + text
     ====================================================================== */
  const CATS = [...new Set(MDC_TEMPLATES.map(t => t.cat))];
  const words = s => String(s || "").toLowerCase().match(/[a-z0-9]+/g) || [];
  const SYN = { clothes: "boutique fashion sale", clothing: "boutique fashion sale", dress: "boutique fashion", shop: "sale shop", store: "sale shop", restaurant: "food menu restaurant", food: "food menu", biryani: "food", pizza: "pizza food", burger: "burger food", cafe: "cafe coffee menu",
    eid: "eid islamic", ramadan: "ramadan islamic iftar", jumma: "jumma islamic", friday: "jumma", independence: "14 august pakistan azadi", august: "14 august azadi pakistan", wedding: "wedding shaadi invitation", shaadi: "wedding shaadi", nikah: "nikah wedding", mehndi: "mehndi wedding",
    birthday: "birthday", school: "admissions education school", admission: "admissions education", tuition: "tuition education", course: "course education", doctor: "clinic health doctor", clinic: "clinic health", dentist: "dental health",
    gym: "gym fitness", fitness: "gym fitness", salon: "salon beauty", makeup: "salon beauty bridal", house: "real estate house", property: "real estate plots", plot: "plots real estate", rent: "rent real estate", hiring: "hiring jobs", job: "hiring jobs",
    youtube: "youtube thumbnail", thumbnail: "youtube thumbnail", reel: "reel reels cover", reels: "reels cover", story: "story status", status: "story status", quote: "quote quotes", card: "card business", mobile: "mobile shop phones", phone: "mobile shop", laptop: "laptop shop" };
  function pickTemplate(prompt, hint, category) {
    const p = (prompt || "").toLowerCase();
    let want = words(prompt + " " + (hint || "") + " " + (category || ""));
    want = want.concat(...want.map(w => (SYN[w] || "").split(" ").filter(Boolean)));
    const sizeWant = /story|status|reel|short|tiktok/.test(p) ? "tall" : /thumbnail|youtube|yt\b/.test(p) ? "wide" : /flyer|poster|a4|menu card|print/.test(p) ? "a4" : /visiting|business card/.test(p) ? "card" : null;
    let best = null, bestScore = -1;
    MDC_TEMPLATES.forEach(t => {
      const tw = words(t.name + " " + t.cat + " " + t.id.replace(/^x-/, "").replace(/-/g, " "));
      let sc = 0; want.forEach(w => { if (tw.includes(w)) sc += 3; else if (tw.some(x => x.startsWith(w) || w.startsWith(x))) sc += 1; });
      if (category && t.cat.toLowerCase() === String(category).toLowerCase()) sc += 4;
      const r = t.h / t.w;
      if (sizeWant === "tall" && r > 1.5) sc += 5; if (sizeWant === "wide" && r < 0.7) sc += 5; if (sizeWant === "a4" && Math.abs(r - 1.414) < 0.05) sc += 4; if (sizeWant === "card" && r < 0.6) sc += 5;
      if (!sizeWant && r > 1.5) sc -= 1;
      if (sc > bestScore) { bestScore = sc; best = t; }
    });
    return best || MDC_TEMPLATES[0];
  }
  function fillTexts(d) {
    const texts = S.userObjects().filter(o => o.type === "textbox");
    if (!texts.length) return;
    const sorted = texts.slice().sort((a, b) => b.fontSize * b.scaleY - a.fontSize * a.scaleY);
    const caseLike = (orig, txt) => orig === orig.toUpperCase() && /[A-Z]/.test(orig) ? txt.toUpperCase() : txt;
    const used = new Set();
    const setT = (o, txt) => { if (!o || !txt) return; o.set({ text: caseLike(o.text, txt) }); if (S.isRTL(txt)) o.set({ direction: "rtl", textAlign: "right" }); o.initDimensions(); o.setCoords(); used.add(o); };
    const ctaBox = texts.find(o => o.text.length < 26 && /order|shop|book|call|now|apply|visit|register|enroll|buy|get|send|swipe|dm/i.test(o.text));
    if (d.cta && ctaBox) setT(ctaBox, d.cta);
    const free = sorted.filter(o => !used.has(o) && !/03XX|📞|@|\.com/i.test(o.text) && !S.isRTL(o.text));
    const head = free[0];
    if (d.headline && head) setT(head, d.headline);
    // the sub-headline goes into the biggest sentence-like text (not into a short badge such as "UP TO 40% OFF")
    const sub = free.slice(1).find(o => o.text.replace(/\s+/g, " ").length >= 18 && o.text !== o.text.toUpperCase())
      || free.slice(1).find(o => o.text.replace(/\s+/g, " ").length >= 18);
    if (d.subheadline && sub) setT(sub, d.subheadline);
    if (d.phone) { const ph = texts.find(o => /03XX|📞/.test(o.text)); if (ph) setT(ph, "📞 " + d.phone); }
    c.requestRenderAll();
  }
  function parseJSON(s) { const m = String(s).match(/\{[\s\S]*\}/); if (!m) return null; try { return JSON.parse(m[0]); } catch (e) { return null; } }
  $("#ai-design-go").onclick = async () => {
    const q = $("#ai-design-q").value.trim(), btn = $("#ai-design-go");
    if (q.length < 4) { S.toast("Describe your design first, e.g. \"Eid sale post for my shoe shop\"."); return; }
    let d = null;
    busy(btn, true, "Designing…");
    if (canSpend()) {
      try {
        const out = await aiText([
          { role: "system", content: `You are a graphic design assistant for small businesses. Reply ONLY with JSON, no other text: {"category": one of ${JSON.stringify(CATS)}, "template_hint": "2-5 keywords", "headline": "max 6 words", "subheadline": "max 14 words", "cta": "max 3 words", "phone": ""}. Write in the same language as the request (English or Urdu). Do not invent phone numbers or prices.` },
          { role: "user", content: q }
        ]);
        d = parseJSON(out);
      } catch (e) { console.warn(e); S.toast(friendly(e) + " Using a matching template instead.", 4500); }
    }
    const tpl = pickTemplate(q, d && d.template_hint, d && d.category);
    await S.loadTemplate(tpl);
    if (d) { fillTexts(d); S.saveState(); S.toast(`Design ready from "${tpl.name}" ✔ Tap any text to edit.`, 4000); }
    busy(btn, false);
  };

  /* ======================================================================
     2) TEXT TO IMAGE
     ====================================================================== */
  const STYLES = { Photo: "realistic photo, professional photography, natural light", Illustration: "digital illustration, vibrant colours", "3D": "3D render, soft lighting, clay style", "Islamic art": "islamic geometric art, gold and emerald, elegant", Watercolor: "watercolor painting, soft texture", Flat: "flat vector illustration, simple shapes", Product: "product photography, studio lighting, clean background" };
  let imgStyle = "Photo";
  $("#ai-img-style").innerHTML = Object.keys(STYLES).map(k => `<button type="button" class="${k === imgStyle ? "active" : ""}" data-st="${k}">${k}</button>`).join("");
  $("#ai-img-style").addEventListener("click", e => { const b = e.target.closest("[data-st]"); if (!b) return; imgStyle = b.dataset.st; $$("#ai-img-style button").forEach(x => x.classList.toggle("active", x === b)); });
  const results = [];
  $("#ai-img-go").onclick = async () => {
    const q = $("#ai-img-q").value.trim(), btn = $("#ai-img-go");
    if (q.length < 3) { S.toast("Describe the image first."); return; }
    if (!canSpend()) return;
    busy(btn, true, "Creating image… (10–30 s)");
    try {
      const [w, h] = aspectSize();
      const blob = await aiImage(`${q}, ${STYLES[imgStyle]}, high quality, no text, no watermark`, w, h, Math.floor(Math.random() * 1e6));
      const url = await blobToURL(blob);
      results.unshift(url);
      $("#ai-img-out").innerHTML = results.slice(0, 6).map((u, i) => `<div class="res"><img src="${u}" alt="AI image ${i + 1}"><div class="ds-grid2"><button class="ds-btn ghost sm" data-add="${i}"><i class="fa-solid fa-plus"></i> Add</button><button class="ds-btn ghost sm" data-bgimg="${i}"><i class="fa-solid fa-panorama"></i> Background</button></div></div>`).join("");
      S.toast("Image ready ✔ Tap Add or Background.");
    } catch (e) { console.warn(e); S.toast(friendly(e), 5000); }
    busy(btn, false);
  };
  async function setAsBackground(url) {
    const img = await new Promise(r => fabric.Image.fromURL(url, r));
    const [W, H] = S.size, s = Math.max(W / img.width, H / img.height), vw = W / s, vh = H / s;
    img.set({ left: 0, top: 0, cropX: (img.width - vw) / 2, cropY: (img.height - vh) / 2, width: vw, height: vh, scaleX: s, scaleY: s, name: "Background photo" });
    img.mdcType = "image"; c.add(img); c.moveTo(img, 1); c.setActiveObject(img); c.requestRenderAll(); S.saveState();
  }
  $("#ai-img-out").addEventListener("click", async e => {
    const a = e.target.closest("[data-add]"), b = e.target.closest("[data-bgimg]");
    if (a) await S.addImageURL(results[+a.dataset.add], "AI image");
    if (b) await setAsBackground(results[+b.dataset.bgimg]);
  });

  /* ======================================================================
     3) AI WRITER
     ====================================================================== */
  const WRITE = {
    headline: q => `Write 6 short, catchy English headlines (max 7 words each) for a social media design about: ${q}. One per line, no numbering, no quotes, no emojis.`,
    urdu: q => `Write 6 short, catchy Urdu headlines in Urdu script (max 7 words each) for a social media design about: ${q}. One per line, no numbering, no quotes.`,
    caption: q => `Write 3 different engaging social media captions (2-3 sentences each, with a call to action and 1-2 emojis) for: ${q}. Separate captions with a line containing only ---.`,
    hashtags: q => `Give 20 relevant hashtags for a social media post about: ${q}. Mix popular and niche tags. Output them on one line separated by spaces.`,
    toUrdu: q => `Translate this into natural Urdu (Urdu script). Reply with the translation only:\n${q}`,
    toEnglish: q => `Translate this into natural English. Reply with the translation only:\n${q}`,
    ytTitle: q => `Write 8 click-worthy but honest YouTube video titles (max 60 characters each) for a video about: ${q}. Use curiosity, numbers or strong benefits. One per line, no numbering, no quotes.`,
    thumbText: q => `Write 8 short YouTube thumbnail texts (2 to 4 words each, punchy, ALL CAPS) for a video about: ${q}. They must not repeat the title, they should create curiosity. One per line, no numbering, no quotes.`,
    adPrimary: q => `Write 3 Facebook/Instagram ad primary texts for: ${q}. Use a hook in the first line, 2-3 short benefit lines with emojis, and a clear call to action. Keep each under 90 words. Separate ads with a line containing only ---.`,
    adHeadline: q => `Write 8 short ad headlines (max 40 characters) for: ${q}. Benefit-focused, clear, no clickbait. One per line, no numbering, no quotes.`,
    googleAds: q => `Write 10 Google Ads responsive search ad headlines for: ${q}. Each headline MUST be 30 characters or fewer including spaces. Include the main keyword in some. One per line, no numbering, no quotes.`
  };
  function updateWriteForm() {
    const t = $("#ai-write-type").value, tr = t === "toUrdu" || t === "toEnglish";
    $("#ai-write-q").placeholder = tr ? "Select a text on your design (or type text here)" : /yt|thumb/.test(t) ? "What is the video about? e.g. earning online with AI" : /ad|google/i.test(t) ? "Product or service + offer, e.g. organic honey, 20% off" : "What is it about? e.g. home bakery cakes";
  }
  $("#ai-write-type").addEventListener("change", updateWriteForm); updateWriteForm();
  let writeOut = [];
  $("#ai-write-go").onclick = async () => {
    const type = $("#ai-write-type").value, btn = $("#ai-write-go");
    const sel = active(), selText = sel && sel.type === "textbox" ? sel.text : "";
    let q = $("#ai-write-q").value.trim();
    if ((type === "toUrdu" || type === "toEnglish") && !q) q = selText;
    if (!q) { S.toast(type.startsWith("to") ? "Select a text on your design first." : "Type what your post is about."); return; }
    if (!canSpend()) return;
    busy(btn, true, "Writing…");
    try {
      const out = await aiText([{ role: "system", content: "You write short, clear marketing copy for small businesses. Never invent prices, phone numbers or facts." }, { role: "user", content: WRITE[type](q) }]);
      writeOut = type === "caption" || type === "adPrimary" ? out.split(/\n-{3,}\n|\n\s*\n/).map(s => s.trim()).filter(Boolean)
        : type === "hashtags" || type.startsWith("to") ? [out.trim()]
        : out.split("\n").map(s => s.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").replace(/^["“]|["”]$/g, "").trim()).filter(Boolean).slice(0, 8);
      const replace = type.startsWith("to") && sel && sel.type === "textbox";
      if (type === "googleAds") writeOut = writeOut.map(t => t.length > 30 ? t.slice(0, 30).replace(/\s+\S*$/, "") : t);
      const copyTypes = ["caption", "hashtags", "adPrimary", "ytTitle", "googleAds", "adHeadline"];
      $("#ai-write-out").innerHTML = writeOut.map((t, i) => `<button type="button" data-w="${i}" style="${S.isRTL(t) ? "direction:rtl;text-align:right;font-family:'Noto Nastaliq Urdu';line-height:2" : ""}">${esc(t)}${type === "googleAds" ? ` <small style="opacity:.6">(${t.length})</small>` : ""}</button>`).join("")
        + `<p class="ds-hint">${replace ? "Tap to replace the selected text." : copyTypes.includes(type) ? "Tap to copy." : "Tap to add to your design."}</p>`;
      $("#ai-write-out").dataset.mode = replace ? "replace" : copyTypes.includes(type) ? "copy" : "add";
    } catch (e) { console.warn(e); S.toast(friendly(e), 5000); }
    busy(btn, false);
  };
  $("#ai-write-out").addEventListener("click", async e => {
    const b = e.target.closest("[data-w]"); if (!b) return;
    const t = writeOut[+b.dataset.w], mode = $("#ai-write-out").dataset.mode, o = active();
    if (mode === "replace" && o && o.type === "textbox") {
      const rtl = S.isRTL(t);
      if (rtl) { await S.fontLoad("Noto Nastaliq Urdu", t); o.set({ fontFamily: "Noto Nastaliq Urdu", fontWeight: "normal", lineHeight: 2, direction: "rtl", textAlign: "right" }); }
      else if (o.direction === "rtl") o.set({ direction: "ltr", textAlign: "center", fontFamily: "Outfit", lineHeight: 1.16 });
      o.set({ text: t }); o.initDimensions(); o.setCoords(); c.requestRenderAll(); S.saveState(); S.toast("Text replaced ✔");
    } else if (mode === "copy") {
      try { await navigator.clipboard.writeText(t); S.toast("Copied ✔ Paste it into your post."); } catch (err) { S.toast("Select and copy the text manually."); }
    } else S.addText("heading", t);
  });

  /* ======================================================================
     4) PHOTO TOOLS
     ====================================================================== */
  function selectedImage() { const o = active(); if (!o || o.type !== "image") { S.toast("Select a photo on your design first."); return null; } return o; }
  function elementCanvas(o, maxSide) {
    const src = o._originalElement || o.getElement();
    const w = src.naturalWidth || src.width, h = src.naturalHeight || src.height, s = Math.min(1, (maxSide || 1e9) / Math.max(w, h));
    const cv = document.createElement("canvas"); cv.width = Math.round(w * s); cv.height = Math.round(h * s);
    cv.getContext("2d").drawImage(src, 0, 0, cv.width, cv.height); return cv;
  }
  // replace the picture inside an image object, keeping its size, crop area, mask and filters
  function swapElement(o, cv, ratio) {
    return new Promise(res => {
      const el = new Image();
      el.onload = () => {
        const DW = o.width * o.scaleX, DH = o.height * o.scaleY;
        const st = { cropX: (o.cropX || 0) * ratio, cropY: (o.cropY || 0) * ratio, width: o.width * ratio, height: o.height * ratio };
        o.setElement(el);
        o.set(st); o.set({ scaleX: DW / st.width, scaleY: DH / st.height });
        if (o.mdcMask && window.MDC_FEATURES) window.MDC_FEATURES.applyMask(o, o.mdcMask);
        if (o.filters && o.filters.length) o.applyFilters();
        o.setCoords(); c.requestRenderAll(); S.saveState(); res();
      };
      el.src = cv.toDataURL("image/png");
    });
  }

  // Enhance 2× — upscale with high-quality smoothing, then a gentle sharpen (runs in the browser)
  function sharpen(ctx, w, h, amount) {
    const src = ctx.getImageData(0, 0, w, h), dst = ctx.createImageData(w, h), s = src.data, d = dst.data;
    const k = [0, -amount, 0, -amount, 1 + 4 * amount, -amount, 0, -amount, 0];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) { d[i] = s[i]; d[i + 1] = s[i + 1]; d[i + 2] = s[i + 2]; d[i + 3] = s[i + 3]; continue; }
      for (let ch = 0; ch < 3; ch++) {
        let v = 0, n = 0;
        for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++) v += s[((y + ky) * w + (x + kx)) * 4 + ch] * k[n++];
        d[i + ch] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
      d[i + 3] = s[i + 3];
    }
    ctx.putImageData(dst, 0, 0);
  }
  $("#ai-upscale").onclick = async () => {
    const o = selectedImage(); if (!o) return;
    const src = elementCanvas(o);
    const f = Math.min(2, 4096 / Math.max(src.width, src.height));
    if (f < 1.2) { S.toast("This photo is already large and sharp enough."); return; }
    const btn = $("#ai-upscale"); busy(btn, true, "Enhancing…");
    await new Promise(r => setTimeout(r, 30));
    const out = document.createElement("canvas"); out.width = Math.round(src.width * f); out.height = Math.round(src.height * f);
    const ctx = out.getContext("2d"); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, out.width, out.height);
    sharpen(ctx, out.width, out.height, 0.35);
    await swapElement(o, out, out.width / src.width);
    busy(btn, false);
    S.toast(`Photo enhanced ✔ ${src.width}×${src.height} → ${out.width}×${out.height}`);
  };

  // Magic eraser — paint over an object, OpenCV fills it in from the surroundings
  let eraseTarget = null, eraseScale = 1, painting = false, cvReady = null;
  const dlgErase = $("#dlg-erase"), ei = $("#erase-img"), em = $("#erase-mask");
  function loadCV() {
    if (cvReady) return cvReady;
    cvReady = new Promise((resolve, reject) => {
      const s = document.createElement("script"); s.src = OPENCV; s.async = true;
      s.onload = async () => {
        try {
          let cv = window.cv;
          if (cv instanceof Promise) cv = (await cv.then(m => ({ m }))).m;
          // The OpenCV module is itself "thenable", so it must never be awaited or passed to resolve() directly
          await new Promise((r, j) => {
            if (cv && cv.Mat) return r();
            const t0 = Date.now(), iv = setInterval(() => { if (cv && cv.Mat) { clearInterval(iv); r(); } else if (Date.now() - t0 > 120000) { clearInterval(iv); j(new Error("opencv timeout")); } }, 150);
            if (cv) cv.onRuntimeInitialized = () => { clearInterval(iv); r(); };
          });
          resolve({ cv });
        } catch (e) { cvReady = null; reject(e); }
      };
      s.onerror = () => { cvReady = null; reject(new Error("opencv")); };
      document.head.appendChild(s);
    });
    return cvReady;
  }
  $("#ai-erase").onclick = () => {
    const o = selectedImage(); if (!o) return;
    eraseTarget = o;
    const full = elementCanvas(o, 1600);
    eraseScale = Math.min(1, 760 / Math.max(full.width, full.height));
    ei.width = full.width; ei.height = full.height; ei.getContext("2d").drawImage(full, 0, 0);
    em.width = full.width; em.height = full.height; em.getContext("2d").clearRect(0, 0, em.width, em.height);
    ei.style.width = Math.round(full.width * eraseScale) + "px";
    $("#erase-status").textContent = "";
    dlgErase.showModal ? dlgErase.showModal() : dlgErase.setAttribute("open", "");
  };
  function paintAt(e) {
    const r = em.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
    const x = (p.clientX - r.left) * em.width / r.width, y = (p.clientY - r.top) * em.height / r.height;
    const ctx = em.getContext("2d"), rad = +$("#erase-size").value * em.width / r.width / 2;
    ctx.fillStyle = "rgba(255,40,90,.55)"; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }
  em.addEventListener("pointerdown", e => { painting = true; em.setPointerCapture(e.pointerId); paintAt(e); });
  em.addEventListener("pointermove", e => { if (painting) paintAt(e); });
  ["pointerup", "pointercancel"].forEach(ev => em.addEventListener(ev, () => { painting = false; }));
  $("#erase-clear").onclick = () => em.getContext("2d").clearRect(0, 0, em.width, em.height);
  $("#erase-go").onclick = async () => {
    if (!eraseTarget) return;
    const st = $("#erase-status"), btn = $("#erase-go");
    const md = em.getContext("2d").getImageData(0, 0, em.width, em.height).data;
    let any = false; for (let i = 3; i < md.length; i += 4) if (md[i]) { any = true; break; }
    if (!any) { st.textContent = "Paint over what you want to remove first."; return; }
    busy(btn, true, "Erasing…");
    try {
      st.textContent = "Loading the eraser (about 10 MB, first time only)…";
      const { cv } = await loadCV();
      st.textContent = "Erasing…";
      await new Promise(r => setTimeout(r, 30));
      const src = cv.imread(ei), rgb = new cv.Mat(); cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
      const mask = new cv.Mat(em.height, em.width, cv.CV_8UC1);
      for (let i = 0, j = 3; i < mask.data.length; i++, j += 4) mask.data[i] = md[j] ? 255 : 0;
      const k = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(9, 9)); cv.dilate(mask, mask, k);
      const dst = new cv.Mat(); cv.inpaint(rgb, mask, dst, 7, cv.INPAINT_TELEA);
      const outRGBA = new cv.Mat(); cv.cvtColor(dst, outRGBA, cv.COLOR_RGB2RGBA);
      // keep the original transparency (for cut-out photos)
      for (let i = 3; i < outRGBA.data.length; i += 4) outRGBA.data[i] = src.data[i];
      const out = document.createElement("canvas"); out.width = ei.width; out.height = ei.height; cv.imshow(out, outRGBA);
      [src, rgb, mask, k, dst, outRGBA].forEach(m => m.delete());
      const orig = elementCanvas(eraseTarget);
      await swapElement(eraseTarget, out, out.width / orig.width);
      ei.getContext("2d").drawImage(out, 0, 0); em.getContext("2d").clearRect(0, 0, em.width, em.height);
      st.textContent = "Done ✔ Paint again to remove more, or close.";
    } catch (e) { console.error(e); st.textContent = "The eraser could not load. Check your internet and try again."; }
    busy(btn, false);
  };

  // Cut-out + new scene (used by "New background" and "Product photo")
  async function cutout(o, say) {
    const src = elementCanvas(o, 1600);
    const blob = await new Promise(r => src.toBlob(r, "image/png"));
    say("Removing the background… the first time downloads the AI model (about 40 MB).");
    const out = await S.removeBgBlob(blob, say);
    return loadImg(URL.createObjectURL(out));
  }
  function trim(img) {
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let x0 = cv.width, y0 = cv.height, x1 = 0, y1 = 0;
    for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) if (d[(y * cv.width + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    if (x1 <= x0 || y1 <= y0) return cv;
    const t = document.createElement("canvas"); t.width = x1 - x0 + 1; t.height = y1 - y0 + 1; t.getContext("2d").drawImage(cv, x0, y0, t.width, t.height, 0, 0, t.width, t.height); return t;
  }
  function composite(bgImg, fg, size, fill = 0.72, shadow = true) {
    const [w, h] = size, out = document.createElement("canvas"); out.width = w; out.height = h;
    const ctx = out.getContext("2d");
    if (bgImg) { const s = Math.max(w / bgImg.width, h / bgImg.height); ctx.drawImage(bgImg, (w - bgImg.width * s) / 2, (h - bgImg.height * s) / 2, bgImg.width * s, bgImg.height * s); }
    else { const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#f8fafc"); g.addColorStop(1, "#e2e8f0"); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
    const s = Math.min(w * fill / fg.width, h * fill / fg.height), fw = fg.width * s, fh = fg.height * s, x = (w - fw) / 2, y = h * 0.88 - fh;
    if (shadow) { ctx.save(); ctx.filter = `blur(${Math.round(w * 0.02)}px)`; ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(w / 2, h * 0.885, fw * 0.42, h * 0.025, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    ctx.drawImage(fg, x, y, fw, fh);
    return out;
  }
  async function replaceWithCanvas(o, cv) {
    const img = await new Promise(r => fabric.Image.fromURL(cv.toDataURL("image/jpeg", 0.92), r));
    const DW = o.width * o.scaleX, DH = o.height * o.scaleY, s = Math.max(DW / img.width, DH / img.height);
    img.set({ left: o.left, top: o.top, angle: o.angle, originX: o.originX, originY: o.originY, scaleX: s, scaleY: s, name: (o.name || "Photo") + " (studio)" });
    img.mdcType = "image";
    const idx = c.getObjects().indexOf(o); c.remove(o); c.insertAt(img, idx); c.setActiveObject(img); c.requestRenderAll(); S.saveState();
  }
  const status = m => { $("#ai-bg-status").textContent = m; };
  $("#ai-bg-change").onclick = async () => {
    const o = selectedImage(); if (!o) return;
    const q = $("#ai-img-q").value.trim() || "soft blurred natural background, bokeh, pleasant light";
    if (!canSpend()) return;
    const btn = $("#ai-bg-change"); busy(btn, true, "Working…");
    try {
      const fg = trim(await cutout(o, status));
      status("Creating the new background…");
      const ratio = (o.width * o.scaleX) / (o.height * o.scaleY), size = ratio >= 1 ? [1024, Math.round(1024 / ratio)] : [Math.round(1024 * ratio), 1024];
      const bg = await loadImg(URL.createObjectURL(await aiImage(`${q}, background only, no people, no text`, size[0], size[1], Math.floor(Math.random() * 1e6))));
      await replaceWithCanvas(o, composite(bg, fg, size, 0.9, false));
      status("New background added ✔ Press Ctrl+Z to undo.");
    } catch (e) { console.error(e); status(e instanceof AIError ? friendly(e) : "Could not change the background. Try a smaller photo."); }
    busy(btn, false);
  };
  const PROD = { "Studio white": "clean white studio backdrop, soft shadows, minimal", Marble: "white marble table top, soft window light, luxury", Pastel: "pastel pink and peach backdrop with soft shapes", Wooden: "warm wooden table, blurred cozy cafe background", Nature: "outdoor nature scene with green leaves, soft sunlight, shallow depth of field", "Luxury dark": "dark elegant backdrop with gold accents, dramatic lighting" };
  let prodStyle = "Studio white";
  $("#ai-prod-style").innerHTML = Object.keys(PROD).map(k => `<button type="button" class="${k === prodStyle ? "active" : ""}" data-ps="${k}">${k}</button>`).join("");
  $("#ai-prod-style").addEventListener("click", e => { const b = e.target.closest("[data-ps]"); if (!b) return; prodStyle = b.dataset.ps; $$("#ai-prod-style button").forEach(x => x.classList.toggle("active", x === b)); });
  $("#ai-prod-go").onclick = async () => {
    const o = selectedImage(); if (!o) return;
    if (!canSpend()) return;
    const btn = $("#ai-prod-go"); busy(btn, true, "Making studio photo…");
    try {
      const fg = trim(await cutout(o, status));
      status("Creating the studio scene…");
      const bg = await loadImg(URL.createObjectURL(await aiImage(`product photography backdrop, ${PROD[prodStyle]}, empty surface in the foreground, no product, no text, high quality`, 1024, 1024, Math.floor(Math.random() * 1e6))));
      await replaceWithCanvas(o, composite(bg, fg, [1080, 1080], 0.7, true));
      status("Studio photo ready ✔");
    } catch (e) { console.error(e); status(e instanceof AIError ? friendly(e) : "Could not make the studio photo. Try a smaller photo."); }
    busy(btn, false);
  };

  window.MDC_AI = { aiText, aiImage, pickTemplate, fillTexts, get used() { return used(); }, setDailyLimit(n) { CFG.dailyLimit = n; showQuota(); } };
})();
