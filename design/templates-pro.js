/* ==========================================================================
   Postly Design Studio — pro pack: YouTube thumbnails & ad creatives
   Uses the helpers exported by templates-more.js (window.MDC_TPL_KIT).
   Add a template by adding one line to THUMBS or ADS at the bottom.
   ========================================================================== */
(function () {
  "use strict";
  const K = window.MDC_TPL_KIT; if (!K) return;
  const { g, alpha, T, fitSize, pill, star } = K;

  /* ---------------- extra sizes (ads) ---------------- */
  const AD_SIZES = [
    { id: "ad-fbfeed", name: "Facebook/Instagram feed ad", w: 1080, h: 1080, cat: "Ads" },
    { id: "ad-fb45", name: "Feed ad portrait (4:5)", w: 1080, h: 1350, cat: "Ads" },
    { id: "ad-story", name: "Stories / Reels / TikTok ad", w: 1080, h: 1920, cat: "Ads" },
    { id: "ad-link", name: "Facebook / LinkedIn link ad", w: 1200, h: 628, cat: "Ads" },
    { id: "ad-mrec", name: "Google ad 300×250 (Medium rectangle)", w: 300, h: 250, cat: "Ads" },
    { id: "ad-lrec", name: "Google ad 336×280 (Large rectangle)", w: 336, h: 280, cat: "Ads" },
    { id: "ad-leader", name: "Google ad 728×90 (Leaderboard)", w: 728, h: 90, cat: "Ads" },
    { id: "ad-billboard", name: "Google ad 970×250 (Billboard)", w: 970, h: 250, cat: "Ads" },
    { id: "ad-halfpage", name: "Google ad 300×600 (Half page)", w: 300, h: 600, cat: "Ads" },
    { id: "ad-sky", name: "Google ad 160×600 (Skyscraper)", w: 160, h: 600, cat: "Ads" },
    { id: "ad-mobile", name: "Google ad 320×50 (Mobile banner)", w: 320, h: 50, cat: "Ads" },
    { id: "x-post", name: "X / Twitter post", w: 1600, h: 900, cat: "Social" },
    { id: "pin", name: "Pinterest pin", w: 1000, h: 1500, cat: "Social" }
  ];
  AD_SIZES.forEach(s => { if (!MDC_SIZES.some(x => x.id === s.id)) MDC_SIZES.push(s); });
  window.MDC_AD_SETS = {
    meta: ["ad-fbfeed", "ad-fb45", "ad-story", "ad-link"],
    google: ["ad-mrec", "ad-lrec", "ad-leader", "ad-billboard", "ad-halfpage", "ad-sky", "ad-mobile"],
    social: ["ig", "ig45", "story", "fb", "linkedin", "x-post", "pin"]
  };

  /* ---------------- palettes ---------------- */
  const P = {
    red:    { bg: g(135, "#ff1744", "#6d0019"), a: "#ffe600", a2: "#ffffff", tx: "#ffffff", mu: "#ffd6dc", bt: "#111111" },
    blue:   { bg: g(135, "#0066ff", "#001a66"), a: "#ffe600", a2: "#00e5ff", tx: "#ffffff", mu: "#cfe3ff", bt: "#111111" },
    black:  { bg: g(135, "#1b1b1f", "#000000"), a: "#ffd400", a2: "#ff2d55", tx: "#ffffff", mu: "#c9c9d1", bt: "#111111" },
    money:  { bg: g(135, "#0b3d1e", "#03140a"), a: "#39ff7a", a2: "#ffe600", tx: "#ffffff", mu: "#b8f5cc", bt: "#03140a" },
    neon:   { bg: g(135, "#2a0a5e", "#07001a"), a: "#00f0ff", a2: "#ff2bd6", tx: "#ffffff", mu: "#d8c9ff", bt: "#07001a" },
    orange: { bg: g(135, "#ff7a00", "#b3001b"), a: "#fff200", a2: "#ffffff", tx: "#ffffff", mu: "#ffe2c4", bt: "#111111" },
    clean:  { bg: "#f4f4f5", a: "#ff2d2d", a2: "#111111", tx: "#111111", mu: "#52525b", bt: "#ffffff" },
    teal:   { bg: g(135, "#00b3a4", "#003d4d"), a: "#ffe600", a2: "#ffffff", tx: "#ffffff", mu: "#c9fff8", bt: "#003d4d" },
    // ad palettes
    shopWhite: { bg: "#ffffff", a: "#ff3b30", a2: "#111827", tx: "#111827", mu: "#4b5563", bt: "#ffffff", soft: "#fff1f0" },
    shopDark:  { bg: g(160, "#111827", "#030712"), a: "#facc15", a2: "#ffffff", tx: "#ffffff", mu: "#d1d5db", bt: "#111827", soft: "#1f2937" },
    fresh:     { bg: g(160, "#ecfdf5", "#d1fae5"), a: "#059669", a2: "#064e3b", tx: "#064e3b", mu: "#047857", bt: "#ffffff", soft: "#ffffff" },
    royal:     { bg: g(150, "#312e81", "#1e1b4b"), a: "#f59e0b", a2: "#ffffff", tx: "#ffffff", mu: "#c7d2fe", bt: "#1e1b4b", soft: "#3730a3" },
    blush:     { bg: g(150, "#fff1f2", "#ffe4e6"), a: "#e11d48", a2: "#881337", tx: "#4c0519", mu: "#9f1239", bt: "#ffffff", soft: "#ffffff" },
    sky:       { bg: g(150, "#e0f2fe", "#bae6fd"), a: "#0369a1", a2: "#0c4a6e", tx: "#0c4a6e", mu: "#075985", bt: "#ffffff", soft: "#ffffff" },
    sunset:    { bg: g(135, "#f97316", "#db2777"), a: "#ffffff", a2: "#fde047", tx: "#ffffff", mu: "#ffe4e6", bt: "#db2777", soft: "rgba(255,255,255,.15)" },
    mono:      { bg: "#0a0a0a", a: "#ffffff", a2: "#a3e635", tx: "#ffffff", mu: "#a1a1aa", bt: "#0a0a0a", soft: "#18181b" },
    cream:     { bg: "#faf6ef", a: "#1f2937", a2: "#b45309", tx: "#1f2937", mu: "#57534e", bt: "#ffffff", soft: "#ffffff" }
  };

  /* ---------------- shared bits ---------------- */
  const ANTON = "Anton", MONT = "Montserrat", POP = "Poppins";
  const ARROW = "M6 74C22 40 52 22 80 28L76 14L98 40L68 56L72 42C50 38 30 52 20 80Z";
  const hard = (k, col = "rgba(0,0,0,.9)") => ({ c: col, b: 0, x: 7 * k, y: 7 * k });
  const big = (text, x, y, w, max, lines, fill, k, o = {}) => T(text, x, y, w, fitSize(text, w, max, lines, ANTON), ANTON, fill,
    Object.assign({ align: "left", lh: 0.98, weight: "normal", stroke: "#000000", sw: 9 * k, shadow: hard(k) }, o));
  const frame = (l, top, w, h, name, extra = {}) => Object.assign({ t: "photo", l, top, w, h, name }, extra);
  const arrow = (x, y, size, fill, angle = 0) => ({ t: "path", d: ARROW, l: x, top: y, size, fill, stroke: "#000000", sw: 3, angle, name: "Arrow" });
  const ring = (x, y, w, h, color, sw) => ({ t: "path", d: `M${w / 2} 0A${w / 2} ${h / 2} 0 1 1 ${w / 2 - 0.1} 0`, l: x, top: y, fill: "rgba(0,0,0,0)", stroke: color, sw, name: "Highlight circle" });
  const tag = (text, x, y, k, bg, fg, angle = -3) => {
    const s = 40 * k, w = Math.max(160 * k, text.length * s * 0.5 + 50 * k), h = 66 * k;
    return [{ t: "rect", l: x, top: y, w, h, rx: 10 * k, fill: bg, angle, shadow: { c: "rgba(0,0,0,.35)", b: 10 * k, x: 0, y: 5 * k } },
            T(text, x + 8 * k, y + (h - s * 1.16) / 2, w - 16 * k, s, "Bebas Neue", fg, { angle, weight: "normal" })];
  };
  const btn = (text, cx, y, u, bg, fg, wMin = 380) => {
    const s = 40 * u, w = Math.max(wMin * u, text.length * s * 0.7 + 110 * u), h = 100 * u;
    return [{ t: "rect", l: cx - w / 2, top: y, w, h, rx: h / 2, fill: bg, shadow: { c: "rgba(0,0,0,.22)", b: 16 * u, x: 0, y: 8 * u } },
            T(text, cx - w / 2, y + (h - s * 1.16) / 2, w, s, MONT, fg, { weight: 800 })];
  };

  /* ======================================================================
     YOUTUBE THUMBNAIL LAYOUTS (1280×720, k = 1 at 720 px height)
     ====================================================================== */
  const TH = {};
  // Face on the right, two-colour hook text on the left, arrow and emoji
  TH.face = (W, H, c, p, k) => {
    const o = [];
    o.push({ t: "circle", l: W * 0.58, top: H * 0.02, r: H * 0.5, fill: alpha(p.a, 0.22), name: "Glow" });
    o.push(frame(W * 0.53, H * 0.04, W * 0.45, H * 0.96, "Your face (cut-out)"));
    if (c.k) o.push(...tag(c.k, W * 0.035, H * 0.06, k, p.a2 === "#ffffff" ? "#ff1744" : p.a2, "#ffffff"));
    const y0 = H * (c.k ? 0.2 : 0.1), room = H * 0.95 - y0;
    let f = 1, t1, t2;
    do {
      t1 = big(c.t1, W * 0.035, y0, W * 0.53, 150 * k * f, 2, p.tx, k);
      t2 = c.t2 ? big(c.t2, W * 0.035, y0 + t1.h + 4 * k, W * 0.53, 175 * k * f, 2, p.a, k) : null;
      f -= 0.06;
    } while (f > 0.4 && t1.h + 4 * k + (t2 ? t2.h : 0) > room);
    o.push(t1); if (t2) o.push(t2);
    if (c.arrow) o.push(arrow(W * 0.42, H * 0.6, 200 * k, p.a, -8));
    if (c.em) o.push(T(c.em, W * 0.49, H * 0.06, 150 * k, 120 * k, "Inter", "#000"));
    return o;
  };
  // Two things compared
  TH.vs = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(W * 0.03, H * 0.24, W * 0.43, H * 0.72, "Left photo", { rx: 22 * k }));
    o.push(frame(W * 0.54, H * 0.24, W * 0.43, H * 0.72, "Right photo", { rx: 22 * k }));
    o.push({ t: "circle", l: W / 2 - 95 * k, top: H * 0.5 - 95 * k, r: 95 * k, fill: p.a, stroke: "#000000", sw: 8 * k });
    o.push(T("VS", W / 2 - 95 * k, H * 0.5 - 62 * k, 190 * k, 110 * k, ANTON, "#000000", { weight: "normal" }));
    o.push(big(c.t1, W * 0.03, H * 0.035, W * 0.94, 120 * k, 1, p.tx, k, { align: "center" }));
    if (c.l) o.push(...tag(c.l, W * 0.05, H * 0.82, k, "#000000", p.a, 0));
    if (c.r) o.push(...tag(c.r, W * 0.56, H * 0.82, k, "#000000", p.a, 0));
    return o;
  };
  // Big number list ("TOP 10", "7 TIPS")
  TH.list = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(W * 0.62, 0, W * 0.38, H, "Your photo"));
    o.push({ t: "rect", l: W * 0.6, top: 0, w: 16 * k, h: H, fill: p.a });
    o.push(T(c.num, W * 0.03, H * 0.08, W * 0.3, fitSize(c.num, W * 0.3, 420 * k, 2, ANTON), ANTON, p.a, { align: "center", lh: 0.85, weight: "normal", stroke: "#000", sw: 10 * k, shadow: hard(k) }));
    o.push(big(c.t1, W * 0.33, H * 0.18, W * 0.26, 110 * k, 4, p.tx, k));
    if (c.k) o.push(...tag(c.k, W * 0.34, H * 0.78, k, p.a2 === "#ffffff" ? "#ff1744" : p.a2, "#ffffff", 0));
    return o;
  };
  // Before / after
  TH.beforeAfter = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(0, 0, W / 2, H, "Before photo"));
    o.push(frame(W / 2, 0, W / 2, H, "After photo"));
    o.push({ t: "rect", l: W / 2 - 6 * k, top: 0, w: 12 * k, h: H, fill: "#ffffff" });
    o.push(...tag("BEFORE", W * 0.04, H * 0.78, k, "#ef4444", "#ffffff", 0));
    o.push(...tag("AFTER", W * 0.54, H * 0.78, k, "#22c55e", "#ffffff", 0));
    o.push(arrow(W / 2 - 110 * k, H * 0.4, 220 * k, p.a, 0));
    if (c.t1) o.push(big(c.t1, W * 0.04, H * 0.05, W * 0.92, 120 * k, 1, p.tx, k, { align: "center" }));
    return o;
  };
  // Clean light style with one highlighted word
  TH.minimal = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(W * 0.66, H * 0.18, H * 0.7, H * 0.7, "Your photo", { shape: "circle" }));
    let y = H * 0.16;
    const t1 = T(c.t1, W * 0.05, y, W * 0.6, fitSize(c.t1, W * 0.6, 120 * k, 2, MONT), MONT, p.tx, { align: "left", weight: 900, lh: 1.02 }); o.push(t1); y += t1.h + 14 * k;
    if (c.t2) {
      const s = fitSize(c.t2, W * 0.58, 110 * k, 1, MONT), w = Math.min(W * 0.6, c.t2.length * s * 0.76 + 50 * k);
      o.push({ t: "rect", l: W * 0.045, top: y - 6 * k, w, h: s * 1.3, rx: 12 * k, fill: p.a, angle: -1.5 });
      o.push(T(c.t2, W * 0.05 + 20 * k, y, w - 30 * k, s, MONT, "#ffffff", { align: "left", weight: 900, angle: -1.5 })); y += s * 1.3 + 30 * k;
    }
    if (c.k) o.push(T(c.k, W * 0.05, Math.max(y, H * 0.78), W * 0.55, 36 * k, POP, p.mu, { align: "left", weight: 600 }));
    return o;
  };
  // Money / results number
  TH.money = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(W * 0.57, H * 0.05, W * 0.42, H * 0.95, "Your face (cut-out)"));
    if (c.k) o.push(...tag(c.k, W * 0.04, H * 0.07, k, "#000000", p.a, -2));
    o.push(T(c.num, W * 0.03, H * 0.2, W * 0.58, fitSize(c.num, W * 0.58, 230 * k, 1, ANTON), ANTON, p.a, { align: "left", weight: "normal", stroke: "#000", sw: 8 * k, shadow: { c: alpha(p.a, 0.9), b: 40 * k, x: 0, y: 0 } }));
    o.push(big(c.t1, W * 0.04, H * 0.58, W * 0.55, 90 * k, 2, p.tx, k));
    if (c.em) o.push(T(c.em, W * 0.47, H * 0.08, 140 * k, 110 * k, "Inter", "#000"));
    return o;
  };
  // Full photo with a circled detail and arrow ("look at this")
  TH.react = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(0, 0, W, H, "Background photo"));
    o.push({ t: "rect", l: 0, top: H * 0.45, w: W, h: H * 0.55, fill: { g: [180, ["rgba(0,0,0,0)", 0], ["rgba(0,0,0,.85)", 1]] } });
    o.push(ring(W * 0.58, H * 0.12, W * 0.3, H * 0.36, "#ff1744", 12 * k));
    o.push(arrow(W * 0.42, H * 0.3, 200 * k, "#ff1744", 0));
    o.push(big(c.t1, W * 0.04, H * 0.62, W * 0.8, 130 * k, 2, p.a, k));
    return o;
  };
  // Podcast / interview
  TH.podcast = (W, H, c, p, k) => {
    const o = [];
    o.push(frame(W * 0.05, H * 0.1, H * 0.62, H * 0.62, "Host photo", { shape: "circle" }));
    o.push(frame(W * 0.95 - H * 0.62, H * 0.1, H * 0.62, H * 0.62, "Guest photo", { shape: "circle" }));
    o.push(...pill(c.k || "PODCAST", W / 2, H * 0.12, 30 * k, p.a, "#000000"));
    o.push(T("🎙️", W / 2 - 80 * k, H * 0.25, 160 * k, 120 * k, "Inter", "#000"));
    o.push({ t: "rect", l: 0, top: H * 0.76, w: W, h: H * 0.24, fill: "rgba(0,0,0,.75)" });
    o.push(big(c.t1, W * 0.04, H * 0.79, W * 0.92, 100 * k, 1, "#ffffff", k, { align: "center", sw: 0, shadow: null }));
    return o;
  };
  // Tutorial: screen frame + step badge
  TH.tutorial = (W, H, c, p, k) => {
    const o = [];
    o.push({ t: "rect", l: W * 0.47, top: H * 0.12, w: W * 0.5, h: H * 0.62, rx: 18 * k, fill: "#0b0b0f", stroke: p.a, sw: 6 * k });
    o.push(frame(W * 0.485, H * 0.145, W * 0.47, H * 0.56, "Screenshot", { rx: 10 * k }));
    o.push(frame(W * 0.74, H * 0.5, W * 0.26, H * 0.5, "Your face (cut-out)"));
    if (c.k) o.push(...tag(c.k, W * 0.035, H * 0.08, k, p.a, "#000000", -2));
    const t1 = big(c.t1, W * 0.035, H * 0.24, W * 0.42, 130 * k, 3, p.tx, k); o.push(t1);
    if (c.t2) o.push(T(c.t2, W * 0.04, Math.min(H * 0.24 + t1.h + 16 * k, H * 0.86), W * 0.42, 44 * k, "Bebas Neue", p.a, { align: "left", weight: "normal", cs: 60 }));
    return o;
  };

  /* ======================================================================
     AD LAYOUTS (any size; u = 1 at 1080 px)
     ====================================================================== */
  const AD = {};
  const trustRow = (items, x, y, w, u, color) => T(items.map(i => "✓ " + i).join("     "), x, y, w, fitSize(items.join("     ") + "      ", w, 30 * u, 1, POP), POP, color, { weight: 600 });
  // Product ad: headline, product, price burst, CTA, trust row
  AD.product = (W, H, c, p, u) => {
    const o = [], m = W * 0.07, cw = W - 2 * m, cx = W / 2, tall = H / W > 1.25;
    let y = H * 0.06;
    if (c.k) { o.push(...pill(c.k, cx, y, 26 * u, p.a, p.bt)); y += 80 * u; }
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, (tall ? 120 : 96) * u, 2, MONT), MONT, p.tx, { weight: 900, lh: 1.05 }); o.push(t); y += t.h + 12 * u;
    if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 38 * u, 2, POP), POP, p.mu, { weight: 500, lh: 1.3 }); o.push(s); y += s.h + 24 * u; }
    const bottom = H - (c.trust ? 90 : 40) * u - 100 * u - 40 * u;
    const ph = Math.max(140 * u, bottom - y - 10 * u), pw = Math.min(cw, ph * 1.25);
    o.push({ t: "rect", l: cx - pw / 2 - 12 * u, top: y - 6 * u, w: pw + 24 * u, h: ph + 12 * u, rx: 34 * u, fill: p.soft || alpha(p.a, 0.08) });
    o.push(frame(cx - pw / 2, y, pw, ph, "Product photo", { rx: 28 * u }));
    if (c.price) {
      const r = Math.min(150 * u, ph * 0.32);
      o.push(star(cx + pw / 2 - r * 1.3, y - r * 0.35, r, p.a, 18, 0.86));
      o.push(T(c.price, cx + pw / 2 - r * 1.3 + r * 0.15, y - r * 0.35 + r * 0.62, r * 1.7, r * 0.34, ANTON, p.bt === "#ffffff" ? "#ffffff" : "#111111", { lh: 0.95, weight: "normal" }));
    }
    if (c.cta) o.push(...btn(c.cta, cx, bottom + 20 * u, u, p.a, p.bt));
    if (c.trust) o.push(trustRow(c.trust, m, H - 80 * u, cw, u, p.mu));
    return o;
  };
  // Big discount + coupon code
  AD.offer = (W, H, c, p, u) => {
    const o = [], m = W * 0.08, cw = W - 2 * m, cx = W / 2;
    o.push({ t: "circle", l: -W * 0.2, top: -W * 0.2, r: W * 0.4, fill: alpha(p.a, 0.12) });
    o.push({ t: "circle", l: W * 0.7, top: H - W * 0.35, r: W * 0.35, fill: alpha(p.a, 0.12) });
    let y = H * 0.1;
    if (c.k) { o.push(T(c.k.toUpperCase(), m, y, cw, 40 * u, MONT, p.mu, { weight: 800, cs: 250 })); y += 80 * u; }
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, (H / W > 1.2 ? 260 : 210) * u, 2, ANTON), ANTON, p.a, { lh: 0.9, weight: "normal" }); o.push(t); y += t.h + 14 * u;
    if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 46 * u, 2, POP), POP, p.tx, { weight: 600, lh: 1.3 }); o.push(s); y += s.h + 40 * u; }
    if (c.code) {
      const txt = "CODE: " + c.code, w = Math.min(cw, 640 * u), h = 110 * u, fs = fitSize(txt + "  ", w - 60 * u, 50 * u, 1, MONT);
      o.push({ t: "rect", l: cx - w / 2, top: y, w, h, rx: 18 * u, fill: alpha(p.a, 0.1), stroke: p.a, sw: 5 * u, strokeDashArray: null });
      o.push(T(txt, cx - w / 2, y + (h - fs * 1.16) / 2, w, fs, MONT, p.tx, { weight: 900 })); y += h + 36 * u;
    }
    if (c.cta) o.push(...btn(c.cta, cx, Math.min(Math.max(y, H - 220 * u), H - (c.foot ? 190 : 140) * u), u, p.a, p.bt));
    if (c.foot) o.push(T(c.foot, m, H - 70 * u, cw, 28 * u, POP, p.mu, { weight: 500 }));
    return o;
  };
  // App / software ad with a phone mock-up
  AD.app = (W, H, c, p, u) => {
    const o = [], tall = H / W > 1.25;
    const pw = (tall ? 0.56 : 0.4) * W, ph = Math.min(H * (tall ? 0.52 : 0.8), pw * 2.05), px = tall ? (W - pw) / 2 : W * 0.55, py = tall ? H * 0.42 : (H - ph) / 2;
    o.push({ t: "rect", l: px, top: py, w: pw, h: ph, rx: pw * 0.13, fill: "#0b0b0f", stroke: "#3f3f46", sw: 6 * u, shadow: { c: "rgba(0,0,0,.35)", b: 40 * u, x: 0, y: 20 * u } });
    o.push(frame(px + pw * 0.05, py + pw * 0.05, pw * 0.9, ph - pw * 0.1, "App screenshot", { rx: pw * 0.09 }));
    const m = W * 0.07, tw = tall ? W - 2 * m : W * 0.45; let y = tall ? H * 0.06 : H * 0.12;
    if (c.k) { o.push(T(c.k.toUpperCase(), m, y, tw, 30 * u, MONT, p.a, { align: tall ? "center" : "left", weight: 800, cs: 200 })); y += 60 * u; }
    const t = T(c.t, m, y, tw, fitSize(c.t, tw, (tall ? 104 : 86) * u, 3, MONT), MONT, p.tx, { align: tall ? "center" : "left", weight: 900, lh: 1.05 }); o.push(t); y += t.h + 20 * u;
    if (!tall && c.list) c.list.forEach(it => { const t2 = T("✓  " + it, m, y, tw, 34 * u, POP, p.mu, { align: "left", weight: 600 }); o.push(t2); y += t2.h + 10 * u; });
    if (c.cta) o.push(...btn(c.cta, tall ? W / 2 : m + 210 * u, tall ? H * 0.42 - 130 * u : Math.max(y + 20 * u, H * 0.72), u, p.a, p.bt));
    return o;
  };
  // Lead generation / service
  AD.lead = (W, H, c, p, u) => {
    const o = [], tall = H / W > 1.25, wide = W / H > 1.5;
    if (wide) o.push(frame(W * 0.58, 0, W * 0.42, H, "Your photo"));
    else o.push(frame(0, H - H * (tall ? 0.36 : 0.3), W, H * (tall ? 0.36 : 0.3), "Your photo"));
    const m = W * 0.07, cw = (wide ? W * 0.5 : W - 2 * m); let y = H * 0.07;
    if (c.k) { o.push(...pill(c.k, m + Math.min(cw, c.k.length * 26 * u * 0.74 + 62 * u) / 2, y, 26 * u, p.a, p.bt)); y += 80 * u; }
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, (wide ? 70 : 100) * u, 3, MONT), MONT, p.tx, { align: "left", weight: 900, lh: 1.05 }); o.push(t); y += t.h + 20 * u;
    (c.list || []).forEach(it => { const t2 = T("✓  " + it, m, y, cw, (wide ? 30 : 38) * u, POP, p.tx, { align: "left", weight: 600 }); o.push(t2); y += t2.h + 10 * u; });
    if (c.cta) o.push(...btn(c.cta, m + 200 * u, y + 20 * u, u * (wide ? 0.8 : 1), p.a, p.bt));
    return o;
  };
  // Testimonial / review
  AD.review = (W, H, c, p, u) => {
    const o = [], m = W * 0.09, cw = W - 2 * m, cx = W / 2;
    o.push(T("★★★★★", m, H * 0.08, cw, 80 * u, "Inter", "#f5b301"));
    const q = T("“" + c.t + "”", m, H * 0.2, cw, fitSize(c.t, cw, 70 * u, 5, "Playfair Display"), "Playfair Display", p.tx, { weight: 700, lh: 1.25 }); o.push(q);
    let y = H * 0.2 + q.h + 40 * u;
    o.push(frame(cx - 80 * u, y, 160 * u, 160 * u, "Customer photo", { shape: "circle" })); y += 180 * u;
    if (c.s) o.push(T(c.s, m, y, cw, 36 * u, POP, p.mu, { weight: 600 }));
    if (c.cta) o.push(...btn(c.cta, cx, H - 170 * u, u, p.a, p.bt));
    return o;
  };
  // Us vs them comparison
  AD.compare = (W, H, c, p, u) => {
    const o = [], m = W * 0.06, cw = W - 2 * m, col = cw / 2 - 10 * u;
    o.push(T(c.t, m, H * 0.06, cw, fitSize(c.t, cw, 90 * u, 2, MONT), MONT, p.tx, { weight: 900 }));
    const top = H * 0.24;
    o.push({ t: "rect", l: m, top, w: col, h: H * 0.6, rx: 24 * u, fill: alpha("#ef4444", 0.12), stroke: "#ef4444", sw: 3 * u });
    o.push({ t: "rect", l: m + col + 20 * u, top, w: col, h: H * 0.6, rx: 24 * u, fill: alpha("#22c55e", 0.14), stroke: "#22c55e", sw: 4 * u });
    o.push(T(c.l || "Others", m, top + 26 * u, col, 44 * u, MONT, "#ef4444", { weight: 900 }));
    o.push(T(c.r || "Us", m + col + 20 * u, top + 26 * u, col, 44 * u, MONT, "#16a34a", { weight: 900 }));
    (c.rows || []).forEach((r, i) => {
      const y = top + 110 * u + i * 90 * u, [bad, good] = r.split("|");
      o.push(T("✗ " + bad, m + 24 * u, y, col - 40 * u, 32 * u, POP, p.tx, { align: "left", weight: 500 }));
      o.push(T("✓ " + good, m + col + 44 * u, y, col - 40 * u, 32 * u, POP, p.tx, { align: "left", weight: 700 }));
    });
    if (c.cta) o.push(...btn(c.cta, W / 2, H * 0.87, u, p.a, p.bt));
    return o;
  };
  // Countdown / urgency
  AD.countdown = (W, H, c, p, u) => {
    const o = [], m = W * 0.08, cw = W - 2 * m, cx = W / 2;
    let y = H * 0.1;
    if (c.k) { o.push(...pill(c.k, cx, y, 28 * u, p.a, p.bt)); y += 100 * u; }
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, 170 * u, 2, ANTON), ANTON, p.tx, { lh: 0.95, weight: "normal" }); o.push(t); y += t.h + 40 * u;
    const bw = Math.min(220 * u, cw / 3.4), gap = 26 * u, x0 = cx - (bw * 3 + gap * 2) / 2;
    (c.time || ["02", "45", "10"]).forEach((v, i) => {
      const x = x0 + i * (bw + gap);
      o.push({ t: "rect", l: x, top: y, w: bw, h: bw * 1.05, rx: 22 * u, fill: p.soft || alpha(p.a, 0.15), stroke: alpha(p.a, 0.6), sw: 3 * u });
      o.push(T(v, x, y + bw * 0.1, bw, bw * 0.55, ANTON, p.a, { weight: "normal" }));
      o.push(T(["HOURS", "MINS", "SECS"][i], x, y + bw * 0.72, bw, bw * 0.14, MONT, p.mu, { weight: 800, cs: 100 }));
    });
    y += bw * 1.05 + 40 * u;
    if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 40 * u, 2, POP), POP, p.mu, { weight: 600 }); o.push(s); y += s.h + 30 * u; }
    if (c.cta) o.push(...btn(c.cta, cx, Math.max(y, H - 190 * u), u, p.a, p.bt));
    return o;
  };
  // Wide display banners (728×90, 970×250, 320×50, 1200×628)
  AD.banner = (W, H, c, p) => {
    const o = [], k = H / 250, small = H < 120;
    const ph = small ? H : H * 0.84, pw = Math.min(W * 0.3, ph * 1.3);
    o.push(frame(small ? 0 : H * 0.08, small ? 0 : H * 0.08, pw, ph, "Product photo", { rx: small ? 0 : 14 * k }));
    const x = pw + (small ? H * 0.2 : 30 * k), bw = small ? Math.min(W * 0.24, H * 2.3) : Math.min(W * 0.26, 260 * k), tw = W - x - bw - (small ? H * 0.3 : 40 * k);
    const ts = fitSize(c.t, tw, small ? H * 0.4 : 64 * k, small ? 1 : 2, MONT, 9);
    const t = T(c.t, x, small ? (H - ts * 1.2) / 2 : H * 0.18, tw, ts, MONT, p.tx, { align: "left", weight: 900, lh: 1.05 }); o.push(t);
    if (c.s && !small) o.push(T(c.s, x, H * 0.18 + t.h + 8 * k, tw, fitSize(c.s, tw, 30 * k, 2, POP, 9), POP, p.mu, { align: "left", weight: 500 }));
    const bh = small ? H * 0.62 : 70 * k, by = (H - bh) / 2, bx = W - bw - (small ? H * 0.15 : 30 * k), fs = Math.min(bh * 0.42, fitSize(c.cta || "Shop now", bw - bh * 0.4, small ? bh * 0.42 : 30 * k, 1, MONT, 8));
    o.push({ t: "rect", l: bx, top: by, w: bw, h: bh, rx: bh / 2, fill: p.a });
    o.push(T(c.cta || "Shop now", bx, by + (bh - fs * 1.16) / 2, bw, fs, MONT, p.bt, { weight: 800 }));
    return o;
  };
  // Tall skyscrapers (160×600, 300×600)
  AD.sky = (W, H, c, p) => {
    const o = [], k = W / 300, m = W * 0.08, cw = W - 2 * m;
    let y = H * 0.05;
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, 50 * k, 4, MONT, 10), MONT, p.tx, { weight: 900, lh: 1.05 }); o.push(t); y += t.h + 10 * k;
    if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 22 * k, 3, POP, 9), POP, p.mu, { weight: 500 }); o.push(s); y += s.h + 12 * k; }
    const ph = Math.min(cw * 1.2, H - y - (c.price ? 150 : 100) * k);
    o.push(frame(m, y, cw, ph, "Product photo", { rx: 14 * k })); y += ph + 20 * k;
    if (c.price) o.push(T(c.price, m, y, cw, fitSize(c.price, cw, 44 * k, 1, ANTON, 10), ANTON, p.a, { weight: "normal" }));
    const bh = 54 * k, fs = fitSize(c.cta || "Shop now", cw - 10 * k, 24 * k, 1, MONT, 8);
    o.push({ t: "rect", l: m, top: H - bh - 22 * k, w: cw, h: bh, rx: bh / 2, fill: p.a });
    o.push(T(c.cta || "Shop now", m, H - bh - 22 * k + (bh - fs * 1.16) / 2, cw, fs, MONT, p.bt, { weight: 800 }));
    return o;
  };
  // Pick a sensible ad layout for odd sizes
  const autoAd = (W, H) => W / H >= 2.4 ? "banner" : H / W >= 2.4 ? "sky" : null;

  /* ---------------- content ---------------- */
  const THUMBS = [
    ["th-face-shock", "Face + hook: shock", "face", "red", { k: "NEW", t1: "I DIDN'T", t2: "EXPECT THIS!", arrow: true, em: "😱" }],
    ["th-face-money", "Face + hook: earning", "face", "money", { k: "PROOF", t1: "HOW I MADE", t2: "$5,000 ONLINE", arrow: true, em: "💸" }],
    ["th-face-truth", "Face + hook: truth", "face", "black", { t1: "THE TRUTH", t2: "NOBODY TELLS YOU", arrow: true }],
    ["th-face-challenge", "Face + hook: challenge", "face", "orange", { k: "24 HOURS", t1: "SURVIVING ON", t2: "RS 500 ONLY", em: "🔥" }],
    ["th-face-tech", "Face + hook: tech", "face", "neon", { k: "REVIEW", t1: "DON'T BUY", t2: "BEFORE WATCHING", arrow: true, em: "📱" }],
    ["th-face-mistake", "Face + hook: mistakes", "face", "blue", { t1: "STOP DOING", t2: "THIS MISTAKE", arrow: true, em: "❌" }],
    ["th-face-secret", "Face + hook: secret", "face", "teal", { k: "SECRET", t1: "THIS TRICK", t2: "CHANGED EVERYTHING", em: "🤫" }],
    ["th-face-cricket", "Face + hook: cricket", "face", "money", { k: "LIVE", t1: "WHAT A", t2: "MATCH!", arrow: true, em: "🏏" }],
    ["th-vs-phones", "Versus: phones", "vs", "black", { t1: "WHICH ONE SHOULD YOU BUY?", l: "PHONE A", r: "PHONE B" }],
    ["th-vs-cheap", "Versus: cheap vs expensive", "vs", "red", { t1: "CHEAP VS EXPENSIVE", l: "RS 2,000", r: "RS 20,000" }],
    ["th-vs-ai", "Versus: AI tools", "vs", "neon", { t1: "CHATGPT VS GEMINI", l: "CHATGPT", r: "GEMINI" }],
    ["th-list-top10", "List: top 10", "list", "red", { num: "TOP\n10", t1: "AI TOOLS YOU MUST TRY", k: "2026" }],
    ["th-list-tips", "List: tips", "list", "blue", { num: "7", t1: "TIPS TO GROW ON YOUTUBE", k: "FAST" }],
    ["th-list-places", "List: places", "list", "teal", { num: "5", t1: "PLACES TO VISIT THIS SUMMER", k: "TRAVEL" }],
    ["th-ba-glowup", "Before & after: glow up", "beforeAfter", "black", { t1: "30 DAY TRANSFORMATION" }],
    ["th-ba-room", "Before & after: makeover", "beforeAfter", "orange", { t1: "ROOM MAKEOVER UNDER RS 10K" }],
    ["th-ba-edit", "Before & after: photo edit", "beforeAfter", "neon", { t1: "EDIT LIKE A PRO" }],
    ["th-min-course", "Minimal: course", "minimal", "clean", { t1: "Learn Excel in", t2: "1 Hour", k: "Beginner to advanced · free course" }],
    ["th-min-explainer", "Minimal: explainer", "minimal", "clean", { t1: "How AI really", t2: "Works", k: "Explained simply" }],
    ["th-min-finance", "Minimal: finance", "minimal", "clean", { t1: "Save your first", t2: "Rs 1 Lakh", k: "A simple monthly plan" }],
    ["th-money-income", "Money: income proof", "money", "money", { k: "MY INCOME", num: "$12,450", t1: "IN 30 DAYS WITH AI", em: "🤑" }],
    ["th-money-views", "Money: views", "money", "red", { k: "RESULTS", num: "1M VIEWS", t1: "WITH ONE SHORT VIDEO", em: "🚀" }],
    ["th-react-look", "React: look at this", "react", "red", { t1: "LOOK WHAT\nI FOUND!" }],
    ["th-react-nature", "React: travel moment", "react", "teal", { t1: "WE SAW THIS\nIN HUNZA" }],
    ["th-podcast", "Podcast episode", "podcast", "black", { k: "EP. 24", t1: "FROM ZERO TO A 7-FIGURE BUSINESS" }],
    ["th-podcast-2", "Interview", "podcast", "neon", { k: "INTERVIEW", t1: "THE FREELANCING TRUTH" }],
    ["th-tut-howto", "Tutorial: how to", "tutorial", "blue", { k: "STEP BY STEP", t1: "MAKE A WEBSITE WITH AI", t2: "NO CODING NEEDED" }],
    ["th-tut-excel", "Tutorial: software", "tutorial", "money", { k: "TUTORIAL", t1: "CAPCUT PRO EDITING", t2: "IN 10 MINUTES" }],
    ["th-tut-mobile", "Tutorial: phone trick", "tutorial", "orange", { k: "HIDDEN FEATURE", t1: "ANDROID TRICK", t2: "YOU DIDN'T KNOW" }]
  ];
  const ADS = [
    // product / ecommerce
    ["ad-product-sneaker", "Product ad: shoes", "fbfeed", "product", "shopWhite", { k: "NEW DROP", t: "Run Lighter. Run Further.", s: "Breathable everyday sneakers in 6 colours", price: "Rs\n4,999", cta: "SHOP NOW", trust: ["Free delivery", "Cash on delivery", "7-day returns"] }],
    ["ad-product-dark", "Product ad: dark", "fbfeed", "product", "shopDark", { k: "LIMITED STOCK", t: "Wireless Earbuds Pro", s: "40-hour battery · Noise cancelling", price: "$29", cta: "ORDER NOW", trust: ["Free shipping", "1-year warranty"] }],
    ["ad-product-beauty", "Product ad: beauty", "fb45", "product", "blush", { k: "BESTSELLER", t: "Glow Serum for Every Skin", s: "Vitamin C + hyaluronic acid", price: "30%\nOFF", cta: "SHOP NOW", trust: ["Dermatologist tested", "Cash on delivery"] }],
    ["ad-product-fresh", "Product ad: grocery", "fbfeed", "product", "fresh", { k: "FARM FRESH", t: "Organic Fruit Box Delivered", s: "Hand-picked every morning", price: "Rs\n1,499", cta: "ORDER TODAY", trust: ["Same-day delivery", "Pay on delivery"] }],
    ["ad-product-story", "Product ad: story", "story", "product", "sunset", { k: "TRENDING", t: "The Bag Everyone Is Asking About", s: "Vegan leather · 5 colours", price: "Rs\n3,499", cta: "SWIPE UP", trust: ["Free delivery", "Easy returns"] }],
    ["ad-product-cream", "Product ad: home decor", "fb45", "product", "cream", { k: "NEW COLLECTION", t: "Handmade Ceramic Vases", s: "Each piece is one of a kind", price: "From\n$19", cta: "SHOP THE COLLECTION", trust: ["Gift wrapping", "Free returns"] }],
    // offers
    ["ad-offer-code", "Offer: coupon code", "fbfeed", "offer", "shopDark", { k: "This weekend only", t: "40% OFF", s: "Everything in store, online and offline", code: "SAVE40", cta: "SHOP NOW", foot: "Valid until Sunday midnight. T&C apply." }],
    ["ad-offer-first", "Offer: first order", "fbfeed", "offer", "royal", { k: "New customers", t: "FLAT 20% OFF", s: "On your first order", code: "WELCOME20", cta: "CLAIM OFFER" }],
    ["ad-offer-story", "Offer: story", "story", "offer", "sunset", { k: "Flash sale", t: "UP TO 70% OFF", s: "Thousands of products. Today only.", code: "FLASH70", cta: "SWIPE UP" }],
    ["ad-offer-bogo", "Offer: buy 1 get 1", "fb45", "offer", "shopWhite", { k: "Limited time", t: "BUY 1 GET 1 FREE", s: "On all pizzas, every Wednesday", cta: "ORDER NOW", foot: "Dine-in and delivery" }],
    // countdown
    ["ad-count-sale", "Countdown: sale ends", "fbfeed", "countdown", "shopDark", { k: "HURRY", t: "SALE ENDS TONIGHT", s: "Up to 50% off sitewide", cta: "SHOP BEFORE IT ENDS" }],
    ["ad-count-webinar", "Countdown: webinar", "fb45", "countdown", "royal", { k: "FREE WEBINAR", t: "STARTS SOON", time: ["01", "30", "00"], s: "Grow your business with AI tools", cta: "SAVE MY SEAT" }],
    ["ad-count-story", "Countdown: story", "story", "countdown", "sunset", { k: "LAST CHANCE", t: "ONLY HOURS LEFT", s: "Free gift with every order", cta: "SWIPE UP" }],
    // app / software
    ["ad-app-feed", "App ad", "fbfeed", "app", "royal", { k: "Free app", t: "Track Every Rupee You Spend", list: ["Auto expense tracking", "Monthly budget alerts", "Works offline"], cta: "DOWNLOAD FREE" }],
    ["ad-app-story", "App ad: story", "story", "app", "mono", { k: "New", t: "Learn English in 10 Minutes a Day", cta: "INSTALL NOW" }],
    ["ad-saas-link", "Software ad: link", "link", "app", "sky", { k: "Free 14-day trial", t: "Invoices in One Click", list: ["Send in PKR, USD or AED", "Get paid faster"], cta: "START FREE" }],
    // services / lead gen
    ["ad-lead-agency", "Lead ad: agency", "fbfeed", "lead", "shopDark", { k: "FREE AUDIT", t: "Is Your Website Losing Customers?", list: ["Free SEO check", "Speed & mobile report", "Action plan in 48 hours"], cta: "GET FREE AUDIT" }],
    ["ad-lead-clinic", "Lead ad: clinic", "fb45", "lead", "sky", { k: "BOOK TODAY", t: "Painless Dental Care for the Whole Family", list: ["Same-day appointments", "Cleaning, braces, implants"], cta: "BOOK NOW" }],
    ["ad-lead-course", "Lead ad: course", "fbfeed", "lead", "royal", { k: "ENROLL NOW", t: "Become a Freelancer in 60 Days", list: ["Live classes + recordings", "Certificate included", "Pay in installments"], cta: "RESERVE SEAT" }],
    ["ad-lead-realestate", "Lead ad: real estate", "link", "lead", "cream", { k: "NEW PROJECT", t: "Apartments on Easy Installments", list: ["2 & 3 bedrooms", "10% down payment"], cta: "GET BROCHURE" }],
    ["ad-lead-gym", "Lead ad: gym", "story", "lead", "mono", { k: "7-DAY FREE PASS", t: "Your Strongest Year Starts Here", list: ["Personal trainers", "Ladies timing", "Open 6 AM – 11 PM"], cta: "CLAIM FREE PASS" }],
    // reviews & comparisons
    ["ad-review", "Review ad", "fbfeed", "review", "cream", { t: "Best purchase this year. Delivery was fast and the quality is amazing!", s: "Sana K. · Verified buyer", cta: "SHOP NOW" }],
    ["ad-review-dark", "Review ad: dark", "fb45", "review", "shopDark", { t: "I doubled my sales in a month with their ads. Highly recommended.", s: "Usman, store owner", cta: "GET STARTED" }],
    ["ad-compare", "Us vs them", "fbfeed", "compare", "shopWhite", { t: "Why Customers Switch to Us", l: "Others", r: "Us", rows: ["Late delivery|Delivery in 24 hours", "Hidden charges|One clear price", "No support|WhatsApp support", "No warranty|1-year warranty"], cta: "TRY US TODAY" }],
    ["ad-compare-dark", "Us vs them: dark", "fb45", "compare", "shopDark", { t: "Old Way vs Smart Way", l: "Old way", r: "Smart way", rows: ["Manual records|Automatic reports", "Lost invoices|Everything in the cloud", "Hours of work|Done in minutes"], cta: "SEE HOW" }],
    // display network banners
    ["ad-g-leader", "Google 728×90: sale", "leader", "banner", "shopDark", { t: "Big Sale: Up to 50% Off", cta: "Shop now" }],
    ["ad-g-leader-2", "Google 728×90: service", "leader", "banner", "sky", { t: "Free Website Audit in 48 Hours", cta: "Get audit" }],
    ["ad-g-billboard", "Google 970×250: product", "billboard", "banner", "shopWhite", { t: "Wireless Earbuds Pro", s: "40-hour battery · Noise cancelling · Free shipping", cta: "Order now" }],
    ["ad-g-mrec", "Google 300×250: offer", "mrec", "product", "shopDark", { t: "40% Off Everything", price: "40%\nOFF", cta: "SHOP NOW" }],
    ["ad-g-lrec", "Google 336×280: course", "lrec", "product", "royal", { t: "Learn Freelancing", s: "Live classes · Certificate", cta: "ENROLL NOW" }],
    ["ad-g-halfpage", "Google 300×600: product", "halfpage", "sky", "shopWhite", { t: "New Season Sneakers", s: "Free delivery on all orders", price: "Rs 4,999", cta: "Shop now" }],
    ["ad-g-sky", "Google 160×600: app", "sky", "sky", "royal", { t: "Track Your Money", s: "Free app", cta: "Download" }],
    ["ad-g-mobile", "Google 320×50: mobile", "mobile", "banner", "shopDark", { t: "50% Off Today Only", cta: "Shop" }],
    ["ad-link-sale", "Link ad 1200×628: sale", "link", "banner", "sunset", { t: "Weekend Mega Sale", s: "Up to 50% off fashion, shoes and bags", cta: "Shop now" }]
  ];
  const SZ = { fbfeed: [1080, 1080], fb45: [1080, 1350], story: [1080, 1920], link: [1200, 628], mrec: [300, 250], lrec: [336, 280], leader: [728, 90], billboard: [970, 250], halfpage: [300, 600], sky: [160, 600], mobile: [320, 50] };

  const out = [];
  THUMBS.forEach(([id, name, layout, pal, c]) => {
    const W = 1280, H = 720, p = P[pal];
    try { out.push({ id, name, cat: "YouTube", w: W, h: H, bg: p.bg, objects: TH[layout](W, H, c, p, H / 720) }); } catch (e) { console.warn(id, e); }
  });
  ADS.forEach(([id, name, size, layout, pal, c]) => {
    const [W, H] = SZ[size], p = P[pal], lay = autoAd(W, H) || layout;
    try { out.push({ id, name, cat: "Ads", w: W, h: H, bg: p.bg, objects: AD[lay](W, H, c, p, Math.min(W, H) / 1080) }); } catch (e) { console.warn(id, e); }
  });
  out.forEach(t => t.objects.forEach(o => { if (o.t === "text") delete o.h; }));
  // Thumbnails and ads go first in the library: they are the most used.
  window.MDC_TEMPLATES = out.concat(window.MDC_TEMPLATES || []);
  window.MDC_PRO_KIT = { ARROW, P };
})();
