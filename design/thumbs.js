/* Postly Design Studio: thumbnail tools
   1) Thumbnail ideas from a video title (AI, with an offline fallback)
   2) Import a YouTube video (title + current thumbnail)
   3) Thumbnail score (text size, word count, contrast, subject, colour)
   4) A/B compare two pages (or your design vs the imported thumbnail)
   5) One-click pop and "blur behind me" for photos                      */
(function () {
  const S = window.MDC_STUDIO; if (!S) return;
  const c = S.canvas, F = window.MDC_FEATURES || {}, KIT = window.MDC_PRO_KIT || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const blobToURL = b => new Promise((r, j) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = j; fr.readAsDataURL(b); });
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.html = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${esc(label || "Working…")}`; }
    else { btn.disabled = false; if (btn.dataset.html) btn.innerHTML = btn.dataset.html; }
  }
  function dialog(id, html, wide = true) {
    const d = document.createElement("dialog"); d.className = "ds-dialog" + (wide ? " wide" : ""); d.id = id; d.innerHTML = html;
    document.querySelector(".ds-app").appendChild(d);
    d.addEventListener("click", e => { if (e.target.closest("[data-close]")) d.close(); });
    return d;
  }
  const open = d => d.showModal ? d.showModal() : d.setAttribute("open", "");
  const pageIsEmpty = () => S.userObjects().length === 0;
  const newPage = () => new Promise(r => (F.addPage ? F.addPage(null, r) : r()));

  /* ======================================================================
     1) THUMBNAIL IDEAS FROM A TITLE
     ====================================================================== */
  const STOP = new Set("a an the and or but of to in on at for with from by is are was were be been i my me we our you your it this that these those how what why when who which do does did can will just very so as into about after before than then there here have has had get got make made".split(" "));
  const up = s => String(s || "").replace(/\s+/g, " ").trim().toUpperCase();
  const cap = s => String(s || "").toLowerCase().replace(/\s+/g, " ").trim().replace(/^./, ch => ch.toUpperCase());
  const LAYOUTS = ["face", "vs", "list", "money", "tutorial", "react", "beforeAfter", "minimal", "podcast"];
  const ALT = { face: ["money", "react"], vs: ["face", "react"], list: ["face", "minimal"], money: ["face", "react"], tutorial: ["face", "minimal"],
    react: ["face", "minimal"], beforeAfter: ["face", "react"], minimal: ["face", "react"], podcast: ["face", "minimal"] };
  const PALS = ["red", "black", "neon", "blue", "orange", "money", "teal"];

  // Works without AI: picks a layout from the title and writes short hooks from its key words.
  function localPlan(title) {
    const t = title.toLowerCase();
    const num = (title.match(/[$€£₹]\s?\d[\d,.]*\s?[km]?|\d[\d,.]*\s?(k|m|%|lakh|crore|dollars?)\b|\b\d+\b/i) || [""])[0].trim();
    const kw = (title.match(/[\p{L}\p{N}$%'’]+/gu) || []).filter(w => !STOP.has(w.toLowerCase()) && w.length > 1 && w !== num).map(w => w.toUpperCase());
    const vs = title.split(/\s+(?:vs\.?|versus)\s+/i);
    let type = "face";
    if (vs.length === 2) type = "vs";
    else if (/[$€£₹]|\b(earn|earned|money|income|profit|made|salary|rich)\b/.test(t)) type = "money";
    else if (num && /\b(top|best|tips|ways|things|tools|mistakes|apps|ideas|reasons|places|steps)\b/.test(t)) type = "list";
    else if (/\b(how to|tutorial|guide|learn|step by step|beginners?|course)\b/.test(t)) type = "tutorial";
    else if (/\b(before|after|transformation|glow up|makeover)\b/.test(t)) type = "beforeAfter";
    const a = kw.slice(0, 2).join(" ") || "WATCH THIS", b = kw.slice(2, 4).join(" ") || "NOW!";
    const ideas = [
      { t1: a, t2: b + (/[!?]$/.test(b) ? "" : "!"), k: "NEW", em: "😱", num },
      { t1: "THE TRUTH", t2: "ABOUT " + (kw[0] || "THIS"), k: "MUST WATCH", em: "🤯", num },
      { t1: "DON'T MISS", t2: kw.slice(0, 2).join(" ") || "THIS", k: new Date().getFullYear() + "", em: "🔥", num }
    ];
    if (type === "vs") ideas.forEach(i => { i.l = up(vs[0]).split(" ").slice(-2).join(" "); i.r = up(vs[1]).split(" ").slice(0, 2).join(" "); });
    return { type, ideas, scene: `${title}, dramatic cinematic background, vibrant colours, high contrast, no text, no people` };
  }
  async function aiPlan(title) {
    const AI = window.MDC_AI; if (!AI) return null;
    const msg = `You are an expert YouTube thumbnail designer. Video title: "${title}".
Return ONLY JSON with this shape:
{"type":"face|vs|list|money|tutorial|react|beforeAfter|minimal|podcast","ideas":[{"t1":"","t2":"","k":"","num":"","l":"","r":"","em":""},{...},{...}],"scene":""}
Rules: give 3 different thumbnail ideas. t1 = first line (1-3 words), t2 = second line (1-3 words, the most emotional part). Together max 5 words, ALL CAPS, must NOT repeat the title, must create curiosity.
k = small badge (1-2 words). num = a big number or amount if the title has one, else "". l and r = the two things compared, only for type vs. em = one emoji.
scene = a short description of a background picture that fits the video (no text, no people, no logos).`;
    const out = await AI.aiText([{ role: "user", content: msg }]);
    const m = String(out).match(/\{[\s\S]*\}/); if (!m) return null;
    let d; try { d = JSON.parse(m[0]); } catch (e) { return null; }
    if (!d || !Array.isArray(d.ideas) || !d.ideas.length) return null;
    d.ideas = d.ideas.filter(i => i && (i.t1 || i.t2)).slice(0, 3);
    if (!LAYOUTS.includes(d.type)) d.type = "face";
    return d.ideas.length ? d : null;
  }
  function contentFor(layout, i, title) {
    const t1 = up(i.t1), t2 = up(i.t2), both = (t1 + " " + t2).trim(), k = up(i.k), em = (i.em || "").slice(0, 4);
    switch (layout) {
      case "money": {
        const num = up(i.num) || t2, rest = both.replace(num, "").replace(/\s+/g, " ").trim();
        let line = rest;
        if (rest.split(" ").length < 3) {   // e.g. "I MADE" → use the words after the amount in the title
          const at = title.toUpperCase().indexOf(num);
          const tail = at >= 0 ? title.slice(at + num.length).match(/[\p{L}\p{N}$%'’]+/gu) || [] : [];
          if (tail.length >= 2) line = tail.slice(0, 4).join(" ").toUpperCase();
        }
        return { k: k || "RESULTS", num, t1: line || "IN 30 DAYS", em };
      }
      case "list": return { num: up(i.num) || "5", t1: both, k };
      case "vs": return { t1: both, l: up(i.l) || "THIS", r: up(i.r) || "THAT" };
      case "tutorial": return { k: k || "STEP BY STEP", t1: t1 || both, t2 };
      case "react": return { t1: both };
      case "minimal": return { t1: cap(i.t1), t2: cap(i.t2) || cap(t1), k: title.length > 60 ? title.slice(0, 57) + "…" : title };
      case "beforeAfter": return { t1: both };
      case "podcast": return { k: k || "PODCAST", t1: both };
      default: return { k, t1: t1 || "WATCH THIS", t2, em, arrow: true };
    }
  }
  function pickLayouts(plan) {
    const hasNum = plan.ideas.some(i => i.num), hasVs = plan.ideas.some(i => i.l && i.r);
    const ok = l => (l !== "list" || hasNum) && (l !== "vs" || hasVs);
    const out = [plan.type, ...(ALT[plan.type] || ALT.face), "face", "react", "minimal"].filter(ok);
    return [...new Set(out)].slice(0, 3);
  }
  // full-bleed photo behind everything, darkened so the hook stays readable
  function addBackdrop(url) {
    return new Promise(res => fabric.Image.fromURL(url, img => {
      const [W, H] = S.size, s = Math.max(W / img.width, H / img.height), vw = W / s, vh = H / s;
      img.set({ left: 0, top: 0, cropX: (img.width - vw) / 2, cropY: (img.height - vh) / 2, width: vw, height: vh, scaleX: s, scaleY: s, name: "Background photo" });
      img.mdcType = "image";
      const shade = new fabric.Rect({ left: 0, top: 0, width: W, height: H, name: "Darken background", strokeWidth: 0,
        fill: new fabric.Gradient({ type: "linear", coords: { x1: 0, y1: 0, x2: W, y2: 0 }, colorStops: [{ offset: 0, color: "rgba(0,0,0,.72)" }, { offset: 0.6, color: "rgba(0,0,0,.35)" }, { offset: 1, color: "rgba(0,0,0,.15)" }] }) });
      shade.mdcType = "shape";
      c.insertAt(img, 1); c.insertAt(shade, 2); c.requestRenderAll(); res(img);
    }, { crossOrigin: "anonymous" }));
  }
  async function fillFrameWith(re, url) {
    const fr = c.getObjects().filter(o => o.mdcType === "frame");
    const f = fr.find(o => re.test(o.name || "")) || fr[0]; if (!f) return false;
    c.setActiveObject(f); await S.addImageURL(url); c.discardActiveObject(); return true;
  }
  // shrink any text that runs off the bottom/right of the page (long AI hooks)
  function fitInside() {
    const [W, H] = S.size;
    S.userObjects().filter(o => o.type === "textbox").forEach(o => {
      let n = 0;
      while (n++ < 30 && o.fontSize > 16) {
        const r = o.getBoundingRect(true, true);
        if (r.top + r.height <= H * 0.985 && r.left + r.width <= W * 1.0) break;
        o.set({ fontSize: o.fontSize * 0.93 }); if (o.strokeWidth) o.set({ strokeWidth: o.strokeWidth * 0.93 }); o.initDimensions(); o.setCoords();
      }
    });
  }
  let photoURL = "";
  $("#th-photo").addEventListener("change", async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { photoURL = await S.readImage(f); $("#th-photo-name").textContent = f.name.length > 28 ? f.name.slice(0, 25) + "…" : f.name; }
    catch (err) { S.toast("Could not read that photo."); }
  });
  async function makeIdeas() {
    const title = $("#th-title").value.replace(/\s+/g, " ").trim();
    if (title.length < 4) { S.toast("Type your video title first."); $("#th-title").focus(); return; }
    if (!KIT.makeThumb) return;
    const btn = $("#th-make"); busy(btn, true, "Writing hooks…");
    try {
      let plan = null;
      try { plan = await aiPlan(title); } catch (e) { console.warn(e); }
      const usedAI = !!plan;
      if (!plan) plan = localPlan(title);
      const layouts = pickLayouts(plan), first = F.cur, wantBg = $("#th-ai-bg").checked;
      let bgFailed = false;
      for (let n = 0; n < 3; n++) {
        busy(btn, false); busy(btn, true, `Building idea ${n + 1} of 3…`);
        const idea = plan.ideas[n] || plan.ideas[n % plan.ideas.length], layout = layouts[n] || "face";
        const pal = layout === "minimal" ? "clean" : PALS[(n * 2 + title.length) % PALS.length];
        const tpl = KIT.makeThumb(layout, pal, contentFor(layout, idea, title), "ai-idea-" + n);
        tpl.name = `Idea ${n + 1}`;
        if (n > 0 || !pageIsEmpty()) await newPage();
        await S.loadTemplate(tpl);
        fitInside();
        if (photoURL) await fillFrameWith(/face|your photo|host|left|before|background/i, photoURL);
        if (wantBg && !bgFailed && window.MDC_AI) {
          busy(btn, false); busy(btn, true, `AI background ${n + 1} of 3…`);
          try {
            const blob = await window.MDC_AI.aiImage(`${plan.scene || title}, YouTube thumbnail background, vibrant, high contrast, no text`, 1024, 576, Math.floor(Math.random() * 1e6));
            const url = await blobToURL(blob);
            if (layout === "react" && !photoURL) await fillFrameWith(/background/i, url); else await addBackdrop(url);
          } catch (e) { console.warn(e); bgFailed = true; S.toast("AI background could not be made right now. The ideas are ready without it.", 4000); }
        }
        c.discardActiveObject(); c.requestRenderAll(); S.saveState();
        await sleep(150);
      }
      const p1 = (F.cur || 0) - 1;
      S.toast(`3 thumbnail ideas ready on pages ${p1}–${p1 + 2}${usedAI ? "" : " (made without AI)"}. Add your photo, then use A/B compare to pick the best.`, 6500);
      lastIdeas = [p1 - 1, p1, p1 + 1];
      void first;
    } catch (e) { console.error(e); S.toast("Could not make the ideas. Please try again."); }
    busy(btn, false);
  }
  let lastIdeas = null;
  $("#th-make").onclick = makeIdeas;

  /* ======================================================================
     2) IMPORT A YOUTUBE VIDEO
     ====================================================================== */
  let yt = null;   // { id, title, author, img (data URL or remote URL), safe (usable on the canvas) }
  function videoId(s) {
    s = String(s || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/|\/v\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  async function fetchImage(url) {
    const r = await fetch(url); if (!r.ok) throw new Error("img " + r.status);
    const b = await r.blob(); if (!/^image\//.test(b.type) || b.size < 2000) throw new Error("not image");
    return blobToURL(b);
  }
  async function importVideo(id) {
    let d = null;
    try {   // 1) our own Vercel function (works on the live site)
      const r = await fetch(`/api/yt?id=${id}`);
      if (r.ok && /json/.test(r.headers.get("content-type") || "")) {
        const j = await r.json();
        d = { id, title: j.title, author: j.author, img: null, safe: false };
        try { d.img = await fetchImage(j.image); d.safe = true; } catch (e) {}
      }
    } catch (e) {}
    if (!d) {   // 2) public fallbacks
      d = { id, title: "", author: "", img: null, safe: false };
      try { const r = await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v=" + id)}`); const j = await r.json(); if (!j.error) { d.title = j.title || ""; d.author = j.author_name || ""; } } catch (e) {}
    }
    if (!d.img) {
      for (const n of ["maxresdefault", "hqdefault"]) { try { d.img = await fetchImage(`https://i.ytimg.com/vi/${id}/${n}.jpg`); d.safe = true; break; } catch (e) {} }
      if (!d.img) d.img = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;   // can be shown, not edited
    }
    return d;
  }
  function renderYT() {
    const box = $("#yt-out");
    if (!yt) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="ds-yt-card">
      <img src="${esc(yt.img)}" alt="">
      <div><b>${esc(yt.title || "YouTube video")}</b><small>${esc(yt.author)}</small></div>
      <div class="ds-grid2">
        <button class="ds-btn primary sm" data-yt="ideas" ${yt.title ? "" : "disabled"}><i class="fa-solid fa-bolt"></i> Better ideas</button>
        <button class="ds-btn ghost sm" data-yt="ab"><i class="fa-solid fa-code-compare"></i> Compare</button>
        <button class="ds-btn ghost sm" data-yt="page" ${yt.safe ? "" : "disabled title='This thumbnail can only be previewed here'"}><i class="fa-regular fa-file-image"></i> Open as page</button>
        <button class="ds-btn ghost sm" data-yt="score" ${yt.safe ? "" : "disabled"}><i class="fa-solid fa-gauge-high"></i> Score it</button>
      </div></div>`;
  }
  $("#yt-import").onclick = async () => {
    const id = videoId($("#yt-link").value);
    if (!id) { S.toast("Paste a YouTube video link, e.g. https://youtu.be/abc123XYZ00"); return; }
    const btn = $("#yt-import"); busy(btn, true, "");
    try {
      yt = await importVideo(id); renderYT();
      if (yt.title) { if (!$("#th-title").value.trim()) $("#th-title").value = yt.title; const t = $("#yp-title"); if (t) t.value = yt.title; }
      if (yt.author) { const ch = $("#yp-channel"); if (ch) ch.value = yt.author; }
      S.toast(yt.title ? "Video imported ✔ Make better ideas, or compare it with your design." : "Thumbnail imported. The title could not be read, type it above.", 4500);
    } catch (e) { console.warn(e); S.toast("Could not import that video. Check the link and your internet."); }
    busy(btn, false);
  };
  $("#yt-link").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); $("#yt-import").click(); } });
  async function ytAsPage() {
    if (!yt || !yt.safe) return;
    if (!pageIsEmpty()) await newPage();
    S.setSize(1280, 720, false); S.setBackground("#000000");
    await addBackdropPlain(yt.img);
    S.saveState(); S.toast("Imported thumbnail opened as a page. Add text or effects on top of it.");
  }
  function addBackdropPlain(url) {
    return new Promise(res => fabric.Image.fromURL(url, img => {
      const [W, H] = S.size, s = Math.max(W / img.width, H / img.height), vw = W / s, vh = H / s;
      img.set({ left: 0, top: 0, cropX: (img.width - vw) / 2, cropY: (img.height - vh) / 2, width: vw, height: vh, scaleX: s, scaleY: s, name: "Imported thumbnail" });
      img.mdcType = "image"; c.insertAt(img, 1); c.requestRenderAll(); res(img);
    }));
  }
  $("#yt-out").addEventListener("click", async e => {
    const b = e.target.closest("[data-yt]"); if (!b || !yt) return;
    const a = b.dataset.yt;
    if (a === "ideas") { $("#th-title").value = yt.title; $("#th-make").click(); }
    if (a === "ab") openAB("yt");
    if (a === "page") ytAsPage();
    if (a === "score") showScore(await scoreImage(yt.img), "Imported thumbnail");
  });

  /* ======================================================================
     3) THUMBNAIL SCORE
     ====================================================================== */
  const cx = document.createElement("canvas").getContext("2d");
  function rgbOf(col) {
    if (!col || typeof col !== "string") return null;
    cx.fillStyle = "#000"; cx.fillStyle = col; const v = cx.fillStyle;
    if (v[0] === "#") return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1];
    const m = v.match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2], m[3] == null ? 1 : +m[3]] : null;
  }
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => { const x = Math.max(a, b), y = Math.min(a, b); return (x + 0.05) / (y + 0.05); };
  function areaStats(el, x, y, w, h) {
    const X = Math.max(0, Math.floor(x)), Y = Math.max(0, Math.floor(y)), R = Math.min(el.width, Math.ceil(x + w)), B = Math.min(el.height, Math.ceil(y + h));
    if (R - X < 1 || B - Y < 1) return null;
    const d = el.getContext("2d").getImageData(X, Y, R - X, B - Y).data;
    let L = 0, n = 0; for (let i = 0; i < d.length; i += 4) { L += lum([d[i], d[i + 1], d[i + 2]]); n++; }
    return L / n;
  }
  function colourStats(el) {
    const d = el.getContext("2d").getImageData(0, 0, el.width, el.height).data;
    let sat = 0, L = 0, L2 = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) {
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      sat += mx ? (mx - mn) / mx : 0; const l = 0.2126 * r + 0.7152 * g + 0.0722 * b; L += l; L2 += l * l; n++;
    }
    const mean = L / n; return { sat: sat / n, std: Math.sqrt(Math.max(0, L2 / n - mean * mean)) };
  }
  const hasLetters = s => /[\p{L}\p{N}]/u.test(s || "");
  const item = (state, title, tip, pts, max) => ({ state, title, tip, pts, max });
  function snapshotOf(i) { return i === F.cur || F.pages == null ? S.snapshot() : F.pages[i]; }
  async function render(d, mult) { return F.renderSnapshot ? F.renderSnapshot(d, mult) : S.renderToCanvas(mult); }

  async function scoreSnapshot(str) {
    const d = typeof str === "string" ? JSON.parse(str) : str;
    const W = d.w, H = d.h, objs = d.json.objects || [], m = 320 / W;
    const full = await render(d, m);
    const hidden = JSON.parse(JSON.stringify(d)); hidden.json.objects.forEach(o => { if (o.type === "textbox") o.visible = false; });
    const bare = await render(hidden, m);
    const items = []; let total = 0;
    const add = it => { items.push(it); total += it.pts; };
    const texts = objs.filter(o => o.type === "textbox" && o.visible !== false && hasLetters(o.text)).map(o => {
      const sx = o.scaleX || 1, sy = o.scaleY || 1, w = (o.width || 0) * sx, h = (o.height || o.fontSize * 1.2) * sy;
      const l = o.originX === "center" ? o.left - w / 2 : o.left, t = o.originY === "center" ? o.top - h / 2 : o.top;
      return { o, fs: o.fontSize * sy, l, t, w, h };
    }).sort((a, b) => b.fs - a.fs);
    const SIDE = 168 / W;   // the smallest place a thumbnail is shown (suggested videos)

    // a) how many words
    const words = texts.filter(x => x.fs >= texts[0].fs * 0.4).reduce((n, x) => n + (x.o.text.match(/[\p{L}\p{N}$%'’]+/gu) || []).length, 0);
    if (!texts.length) add(item("bad", "No text yet", "Add a 2–4 word hook. Thumbnails with a short, big text usually get more clicks.", 4, 20));
    else if (words <= 5) add(item("good", `Short text (${words} words)`, "Great: people can read it in a second.", 20, 20));
    else if (words <= 8) add(item("ok", `${words} words of text`, "Try to cut it down to 5 words or fewer. Let the title tell the rest.", 13, 20));
    else add(item("bad", `Too much text (${words} words)`, "Use 2–5 big words. Long sentences can't be read on a phone.", 4, 20));

    // b) readable on a phone
    if (texts.length) {
      const px = texts[0].fs * SIDE;
      if (px >= 14) add(item("good", "Big, readable text", "Your main text stays readable even in the small 'suggested videos' list.", 20, 20));
      else if (px >= 9) add(item("ok", "Text could be bigger", "Make your main text bigger so it can be read on phones.", 12, 20));
      else add(item("bad", "Text is too small", "On phones this text will be a few pixels tall. Make it much bigger.", 4, 20));
      const tiny = texts.filter(x => x.fs * SIDE < 4.2 && x.o.text.length > 3);
      if (tiny.length) { const t = tiny[0].o.text.replace(/\s+/g, " ").slice(0, 24); items.push(item("ok", "Some text is tiny", `“${t}” can't be read at small sizes. Make it bigger or remove it.`, 0, 0)); total -= 3; }
    } else add(item("bad", "Readable text", "Add a big hook text.", 0, 20));

    // c) contrast of the main texts against what is behind them
    if (texts.length) {
      let worst = 99;
      texts.slice(0, 3).forEach(x => {
        const fill = rgbOf(typeof x.o.fill === "string" ? x.o.fill : null); if (!fill) return;
        const bgL = areaStats(bare, x.l * m, x.t * m, x.w * m, x.h * m); if (bgL == null) return;
        let r = ratio(lum(fill), bgL);
        const st = rgbOf(x.o.stroke);
        if (st && (x.o.strokeWidth || 0) >= x.o.fontSize * 0.03 && ratio(lum(fill), lum(st)) >= 3) r = Math.max(r, 5);
        else if (x.o.shadow && typeof x.o.shadow === "object" && (x.o.shadow.blur || 0) <= 2 && Math.abs(x.o.shadow.offsetX || 0) > 0) r = Math.max(r, Math.min(r + 1.5, 4.5));
        worst = Math.min(worst, r);
      });
      if (worst === 99) add(item("ok", "Contrast", "Could not check the text colours (gradient text).", 13, 20));
      else if (worst >= 3) add(item("good", "Strong contrast", "Your text stands out from the background.", 20, 20));
      else if (worst >= 2.2) add(item("ok", "Contrast could be stronger", "Add a thick outline or shadow to the text (Text effects → Thumbnail).", 13, 20));
      else add(item("bad", "Text blends into the background", "Use a brighter text colour, a darker background, or add an outline.", 4, 20));
    } else add(item("bad", "Contrast", "Add a text first.", 0, 20));

    // d) a face or clear subject
    const imgs = objs.filter(o => o.type === "image" && o.mdcType !== "bg" && o.visible !== false).map(o => {
      const w = Math.min(W, o.width * (o.scaleX || 1)), h = Math.min(H, o.height * (o.scaleY || 1)); return w * h / (W * H);
    }).filter(a => a < 0.97).sort((a, b) => b - a);   // a full-size photo is a background, not a subject
    const frames = objs.filter(o => o.mdcType === "frame" && o.visible !== false);
    if (frames.length && !imgs.length) add(item("bad", "Empty photo frame", "Click the empty frame and add your photo. A face that shows emotion gets more clicks.", 0, 20));
    else if (imgs[0] >= 0.18) add(item("good", "Clear subject", "Your main photo is big enough to see on a phone.", 20, 20));
    else if (imgs[0] >= 0.08) add(item("ok", "Subject is a bit small", "Make your face or product bigger. It should fill about a third of the thumbnail.", 12, 20));
    else if (imgs.length) add(item("bad", "Subject is too small", "Make your main photo much bigger.", 5, 20));
    else add(item("ok", "No face or product photo", "Thumbnails with a face or a clear object usually get more clicks.", 8, 20));

    // e) colour and pop
    const cs = colourStats(full);
    const cp = (cs.sat >= 0.35 ? 10 : cs.sat >= 0.2 ? 6 : 2) + (cs.std >= 0.2 ? 10 : cs.std >= 0.13 ? 6 : 2);
    add(item(cp >= 17 ? "good" : cp >= 10 ? "ok" : "bad", cp >= 17 ? "Bright, eye-catching colours" : "Colours could pop more",
      cp >= 17 ? "Strong colours and light/dark contrast help it stand out in the feed." : "Use brighter, more saturated colours and more light/dark contrast. Try One-click pop on your photo.", cp, 20));

    // f) the video length badge covers the bottom-right corner
    const r16 = Math.abs(W / H - 16 / 9) < 0.05;
    if (r16 && texts.some(x => x.l + x.w > W * 0.84 && x.t + x.h > H * 0.85)) { items.push(item("ok", "Text in the bottom-right corner", "YouTube puts the video length there. Move that text away.", 0, 0)); total -= 5; }
    if (!r16) items.push(item("ok", "Not a 16:9 thumbnail", "The score is made for YouTube thumbnails (1280×720).", 0, 0));
    return { score: Math.max(0, Math.min(100, Math.round(total))), items, img: full.toDataURL("image/jpeg", 0.85) };
  }
  // score for an image only (an imported thumbnail): colour only
  async function scoreImage(url) {
    const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = url; });
    const el = document.createElement("canvas"); el.width = 320; el.height = Math.round(320 * img.height / img.width); el.getContext("2d").drawImage(img, 0, 0, el.width, el.height);
    const cs = colourStats(el), cp = (cs.sat >= 0.35 ? 10 : cs.sat >= 0.2 ? 6 : 2) + (cs.std >= 0.2 ? 10 : cs.std >= 0.13 ? 6 : 2);
    return { score: null, colour: cp, img: url, items: [item(cp >= 17 ? "good" : cp >= 10 ? "ok" : "bad", cp >= 17 ? "Bright, eye-catching colours" : "Colours could pop more", "Only colours can be checked on an imported image. Open it as a page to edit it.", cp, 20)] };
  }
  const grade = s => s >= 80 ? ["Great", "good"] : s >= 60 ? ["Good", "ok"] : ["Needs work", "bad"];
  const ICON = { good: "fa-circle-check", ok: "fa-circle-exclamation", bad: "fa-circle-xmark" };
  const itemsHTML = items => `<ul class="ds-score-list">${items.map(i => `<li class="${i.state}"><i class="fa-solid ${ICON[i.state]}"></i><div><b>${esc(i.title)}</b><small>${esc(i.tip)}</small></div>${i.max ? `<span>${i.pts}/${i.max}</span>` : ""}</li>`).join("")}</ul>`;
  const ring = s => { if (s == null) return `<div class="ds-score-ring na"><b>–</b><small>colour only</small></div>`; const [g, cl] = grade(s); return `<div class="ds-score-ring ${cl}" style="--p:${s}"><b>${s}</b><small>${g}</small></div>`; };

  const dScore = dialog("dlg-thscore", `<h3>Thumbnail score</h3><div id="ths-body"></div>
    <div class="ds-row" style="justify-content:flex-end;gap:8px;flex-wrap:wrap">
      <button class="ds-btn ghost sm" id="ths-outline" type="button"><i class="fa-solid fa-font"></i> Add outline to all text</button>
      <button class="ds-btn ghost sm" id="ths-pop" type="button"><i class="fa-solid fa-sun"></i> Pop my photo</button>
      <button class="ds-btn primary sm" data-close type="button">Close</button></div>`, false);
  function showScore(r, label) {
    $("#ths-body").innerHTML = `<div class="ds-score-head"><img src="${esc(r.img)}" alt="">${ring(r.score)}</div>
      ${label ? `<p class="ds-hint">${esc(label)}</p>` : ""}${itemsHTML(r.items)}`;
    const live = !label;
    $("#ths-outline").hidden = $("#ths-pop").hidden = !live;
    if (!dScore.open) open(dScore);
  }
  async function scoreCurrent() { showScore(await scoreSnapshot(S.snapshot())); }
  $("#th-score").onclick = async () => { const b = $("#th-score"); busy(b, true, "Checking…"); try { await scoreCurrent(); } catch (e) { console.error(e); S.toast("Could not check this design."); } busy(b, false); };
  $("#ths-outline").onclick = async () => {
    S.userObjects().filter(o => o.type === "textbox" && hasLetters(o.text)).forEach(o => {
      const s = o.fontSize; o.set({ stroke: "#000000", strokeWidth: s * 0.08, paintFirst: "stroke", strokeLineJoin: "round", shadow: new fabric.Shadow({ color: "rgba(0,0,0,.9)", blur: 0, offsetX: s * 0.05, offsetY: s * 0.05 }) });
    });
    c.requestRenderAll(); S.saveState(); await scoreCurrent(); S.toast("Outline added to all text ✔ Ctrl+Z to undo.");
  };
  $("#ths-pop").onclick = async () => { if (pop(true)) await scoreCurrent(); };

  /* ======================================================================
     4) A/B COMPARE
     ====================================================================== */
  const dAB = dialog("dlg-ab", `<h3>A/B compare thumbnails</h3>
    <p class="ds-hint">Pick two versions and see them side by side, the way viewers will. For a real click test, upload both in YouTube Studio → Test &amp; compare.</p>
    <div class="ds-row ds-ab-ctl">
      <label>A <select id="ab-a" class="ds-input"></select></label>
      <label>B <select id="ab-b" class="ds-input"></select></label>
      <input id="ab-title" class="ds-input" placeholder="Video title">
      <button class="ds-btn ghost sm" id="ab-theme" type="button"><i class="fa-solid fa-circle-half-stroke"></i></button>
    </div>
    <div class="yp-wrap dark ds-ab" id="ab-wrap"></div>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`);
  const cache = new Map();
  async function sideData(v) {
    if (v === "yt") { if (!yt) return null; const k = "yt" + yt.id; if (!cache.has(k)) cache.set(k, await scoreImage(yt.img).catch(() => ({ score: null, img: yt.img, items: [] }))); return Object.assign({ label: "Imported from YouTube" }, cache.get(k)); }
    const i = +v, str = snapshotOf(i); if (!str) return null;
    if (!cache.has(str)) cache.set(str, await scoreSnapshot(str));
    return Object.assign({ label: "Page " + (i + 1) }, cache.get(str));
  }
  async function renderAB() {
    const [A, B] = await Promise.all([sideData($("#ab-a").value), sideData($("#ab-b").value)]);
    const t = esc($("#ab-title").value || "Your video title"), ch = esc(($("#yp-channel") || {}).value || "Your Channel");
    const col = (d, tag) => !d ? "" : `<div class="ds-ab-col">
      <p class="yp-label">${tag} · ${esc(d.label)}</p>
      <div class="yp-card" style="width:100%"><div class="yp-thumb"><img src="${esc(d.img)}" alt=""><span class="yp-dur">12:34</span></div>
        <div class="yp-meta"><span class="yp-av"></span><div><b>${t}</b><small>${ch} · 128K views</small></div></div></div>
      <div class="yp-side" style="margin-top:12px"><div class="yp-thumb" style="width:168px"><img src="${esc(d.img)}" alt=""><span class="yp-dur">12:34</span></div><div class="yp-sm"><b>${t}</b><small>${ch}</small></div></div>
      <div class="ds-ab-score">${ring(d.score)}${itemsHTML(d.items.filter(i => i.state !== "good").slice(0, 3))}</div></div>`;
    let verdict = "";
    if (A && B && A.score != null && B.score != null) verdict = A.score === B.score ? "Both score the same. Ask a friend which one they would click." : `<b>${A.score > B.score ? "A" : "B"}</b> scores higher (${Math.max(A.score, B.score)} vs ${Math.min(A.score, B.score)}). Scores check readability, not how interesting the idea is, so trust your eyes too.`;
    $("#ab-wrap").innerHTML = col(A, "A") + col(B, "B") + (verdict ? `<p class="ds-ab-verdict">${verdict}</p>` : "");
  }
  function openAB(pref) {
    cache.clear();
    const n = F.pages ? F.pages.length : 1, cur = F.cur || 0;
    const opts = Array.from({ length: n }, (_, i) => `<option value="${i}">Page ${i + 1}${i === cur ? " (open)" : ""}</option>`).join("") + (yt ? `<option value="yt">Imported: ${esc((yt.title || "YouTube video").slice(0, 40))}</option>` : "");
    $("#ab-a").innerHTML = opts; $("#ab-b").innerHTML = opts;
    let a = cur, b = pref === "yt" && yt ? "yt" : n > 1 ? (cur + 1 < n ? cur + 1 : cur - 1) : (yt ? "yt" : cur);
    if (pref !== "yt" && lastIdeas && lastIdeas.includes(cur)) { a = lastIdeas[0]; b = lastIdeas[1]; }
    $("#ab-a").value = String(a); $("#ab-b").value = String(b);
    if (!$("#ab-title").value) $("#ab-title").value = $("#th-title").value.trim() || (yt && yt.title) || "";
    if (n < 2 && !yt) S.toast("Tip: make a second version (Pages → Duplicate) or import a YouTube video to compare.", 5000);
    open(dAB); $("#ab-wrap").innerHTML = '<p class="yp-label">Rendering…</p>'; renderAB();
  }
  $("#th-ab").onclick = () => openAB();
  ["#ab-a", "#ab-b"].forEach(s => $(s).addEventListener("change", renderAB));
  $("#ab-title").addEventListener("input", () => { clearTimeout(renderAB.t); renderAB.t = setTimeout(renderAB, 250); });
  $("#ab-theme").onclick = () => $("#ab-wrap").classList.toggle("dark");

  /* ======================================================================
     5) ONE-CLICK POP + BLUR BEHIND ME
     ====================================================================== */
  function targetImage(quiet) {
    const a = c.getActiveObject();
    if (a && a.type === "image") return a;
    const [W, H] = S.size;
    const imgs = S.userObjects().filter(o => o.type === "image").sort((x, y) => y.getScaledWidth() * y.getScaledHeight() - x.getScaledWidth() * x.getScaledHeight());
    if (!imgs.length) { if (!quiet) S.toast("Add a photo first (Uploads or Photos), then try again."); return null; }
    void W; void H; c.setActiveObject(imgs[0]); return imgs[0];
  }
  const SHARPEN = [0, -0.6, 0, -0.6, 3.4, -0.6, 0, -0.6, 0];
  function setFilters(o, f, sharpen) {
    const Fl = fabric.Image.filters, list = [];
    if (f.b) list.push(new Fl.Brightness({ brightness: f.b / 100 }));
    if (f.c) list.push(new Fl.Contrast({ contrast: f.c / 100 }));
    if (f.s) list.push(new Fl.Saturation({ saturation: f.s / 100 }));
    if (f.bl) list.push(new Fl.Blur({ blur: f.bl / 100 }));
    if (sharpen) list.push(new Fl.Convolute({ matrix: SHARPEN }));
    o.mdcF = Object.assign({ g: false, sp: false }, f); o.filters = list; o.applyFilters();
  }
  function pop(fromScore) {
    const o = targetImage(fromScore); if (!o) return false;
    const was = o.mdcF || {};
    setFilters(o, { b: Math.max(was.b || 0, 4), c: Math.max(was.c || 0, 18), s: Math.max(was.s || 0, 32), bl: was.bl || 0 }, true);
    c.requestRenderAll(); S.saveState(); S.updateCtx && S.updateCtx();
    S.toast("Popped ✔ brighter colours, more contrast and sharper detail. Ctrl+Z to undo.");
    return true;
  }
  $("#th-pop").onclick = () => pop(false);
  function visibleCanvas(o) {
    const el = o._originalElement || o.getElement();
    const cv = document.createElement("canvas"); cv.width = Math.round(o.width); cv.height = Math.round(o.height);
    cv.getContext("2d").drawImage(el, o.cropX || 0, o.cropY || 0, o.width, o.height, 0, 0, o.width, o.height);
    return cv;
  }
  $("#th-blur").onclick = async () => {
    const o = targetImage(); if (!o) return;
    if (o.name === "Subject (cut-out)") { S.toast("Select the photo behind you, not the cut-out."); return; }
    const btn = $("#th-blur"); const say = m => { busy(btn, false); busy(btn, true, m); };
    say("Finding you… (first time ~40 MB)");
    try {
      const src = visibleCanvas(o);
      const blob = await new Promise(r => src.toBlob(r, "image/png"));
      const out = await S.removeBgBlob(blob, say);
      const url = await blobToURL(out);
      const cut = await new Promise(r => fabric.Image.fromURL(url, r));
      const k = (o.width * o.scaleX) / cut.width;
      cut.set({ left: o.left, top: o.top, angle: o.angle, scaleX: k, scaleY: k * (o.scaleY / o.scaleX), originX: o.originX, originY: o.originY, flipX: o.flipX, flipY: o.flipY, name: "Subject (cut-out)" });
      cut.mdcType = "image";
      if (o.clipPath) cut.clipPath = await new Promise(r => o.clipPath.clone(r));
      const was = o.mdcF || {};
      setFilters(o, { b: -6, c: was.c || 0, s: was.s || 0, bl: 28 }, false);
      c.insertAt(cut, c.getObjects().indexOf(o) + 1);
      cut.set({ shadow: new fabric.Shadow({ color: "rgba(0,0,0,.35)", blur: 24, offsetX: 0, offsetY: 6 }) });
      c.setActiveObject(cut); c.requestRenderAll(); S.saveState();
      S.toast("Done ✔ the background is blurred and you stay sharp. Ctrl+Z to undo.", 4500);
    } catch (e) {
      console.warn(e);
      setFilters(o, Object.assign({}, o.mdcF || {}, { bl: 22 }), false); c.requestRenderAll(); S.saveState();
      S.toast("Could not find the person (needs internet the first time). The whole photo was blurred instead; Ctrl+Z to undo.", 6000);
    }
    busy(btn, false);
  };

  window.MDC_THUMBS = { localPlan, contentFor, pickLayouts, videoId, scoreSnapshot, scoreCurrent, openAB, pop, makeIdeas, get yt() { return yt; }, set yt(v) { yt = v; renderYT(); } };
})();
