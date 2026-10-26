/* ==========================================================================
   Postly Design Studio — extra template library (100+)
   Every template is built from: a layout function + a colour palette + content.
   To add a template, add one line to CONTENT at the bottom of this file.
   ========================================================================== */
(function () {
  "use strict";
  const SIZES = {
    sq: [1080, 1080], pt: [1080, 1350], st: [1080, 1920], yt: [1280, 720],
    a4: [1240, 1754], fb: [1200, 630], bc: [1050, 600]
  };

  /* ---------------- palettes ---------------- */
  const g = (deg, c1, c2, c3) => ({ g: c3 ? [deg, [c1, 0], [c2, 0.5], [c3, 1]] : [deg, [c1, 0], [c2, 1]] });
  const P = {
    greenGold:  { bg: g(160, "#065f46", "#022c22"), a: "#e0b54a", a2: "#fef3c7", tx: "#ffffff", mu: "#a7f3d0", bt: "#022c22" },
    navyGold:   { bg: g(160, "#13274f", "#050b18"), a: "#e0b54a", a2: "#fde68a", tx: "#ffffff", mu: "#cbd5e1", bt: "#050b18" },
    pakGreen:   { bg: "#01411c", a: "#ffffff", a2: "#bbf7d0", tx: "#ffffff", mu: "#d1fae5", bt: "#01411c" },
    blackRed:   { bg: "#0d0d12", a: "#ff3d57", a2: "#ffd60a", tx: "#ffffff", mu: "#d4d4d8", bt: "#ffffff" },
    blackYellow:{ bg: "#111111", a: "#ffd60a", a2: "#ffffff", tx: "#ffffff", mu: "#d4d4d8", bt: "#111111" },
    whiteBlue:  { bg: "#ffffff", a: "#2563eb", a2: "#dbeafe", tx: "#0f172a", mu: "#475569", bt: "#ffffff" },
    clinic:     { bg: g(160, "#ecfeff", "#cffafe"), a: "#0e7490", a2: "#a5f3fc", tx: "#083344", mu: "#155e75", bt: "#ffffff" },
    salon:      { bg: "#fdf2f8", a: "#db2777", a2: "#fbcfe8", tx: "#500724", mu: "#9d174d", bt: "#ffffff" },
    gym:        { bg: g(160, "#1f2937", "#030712"), a: "#a3e635", a2: "#ecfccb", tx: "#ffffff", mu: "#d1d5db", bt: "#111827" },
    school:     { bg: "#fffbeb", a: "#f59e0b", a2: "#1e3a8a", tx: "#1e293b", mu: "#475569", bt: "#1e293b" },
    estate:     { bg: g(160, "#0f172a", "#020617"), a: "#f59e0b", a2: "#fde68a", tx: "#ffffff", mu: "#cbd5e1", bt: "#0f172a" },
    food:       { bg: g(160, "#7f1d1d", "#3b0a0a"), a: "#fbbf24", a2: "#fef3c7", tx: "#ffffff", mu: "#fecaca", bt: "#3b0a0a" },
    cream:      { bg: "#fbf7f0", a: "#b08d57", a2: "#7a1f2b", tx: "#3b2f2f", mu: "#8a7560", bt: "#ffffff" },
    maroon:     { bg: g(160, "#6b1020", "#2b0509"), a: "#e9c46a", a2: "#fff8e7", tx: "#fff8e7", mu: "#f5d0c5", bt: "#2b0509" },
    mehndi:     { bg: g(160, "#4d7c0f", "#1a2e05"), a: "#facc15", a2: "#fef9c3", tx: "#fefce8", mu: "#d9f99d", bt: "#1a2e05" },
    tech:       { bg: g(135, "#1e1b4b", "#0f0a2e"), a: "#a78bfa", a2: "#22d3ee", tx: "#ffffff", mu: "#c7d2fe", bt: "#0f0a2e" },
    ytOrange:   { bg: g(120, "#f97316", "#b91c1c"), a: "#ffe600", a2: "#000000", tx: "#ffffff", mu: "#ffedd5", bt: "#000000" },
    mint:       { bg: "#ecfdf5", a: "#059669", a2: "#a7f3d0", tx: "#064e3b", mu: "#047857", bt: "#ffffff" },
    mono:       { bg: "#fafafa", a: "#111827", a2: "#e5e7eb", tx: "#111827", mu: "#6b7280", bt: "#ffffff" },
    bf:         { bg: "#000000", a: "#ffffff", a2: "#ff2d55", tx: "#ffffff", mu: "#a1a1aa", bt: "#000000" },
    elevenEleven:{ bg: g(135, "#ff512f", "#dd2476"), a: "#fff200", a2: "#ffffff", tx: "#ffffff", mu: "#ffe4e6", bt: "#9d174d" },
    muharram:   { bg: g(170, "#1f2937", "#030712"), a: "#9ca3af", a2: "#e5e7eb", tx: "#f9fafb", mu: "#9ca3af", bt: "#111827" },
    xmas:       { bg: g(160, "#166534", "#052e16"), a: "#ef4444", a2: "#fef3c7", tx: "#ffffff", mu: "#bbf7d0", bt: "#ffffff" },
    newYear:    { bg: g(160, "#111936", "#050816"), a: "#fbbf24", a2: "#fde68a", tx: "#ffffff", mu: "#c7d2fe", bt: "#050816" },
    sky:        { bg: g(135, "#0ea5e9", "#1e3a8a"), a: "#fde047", a2: "#e0f2fe", tx: "#ffffff", mu: "#e0f2fe", bt: "#1e3a8a" },
    peach:      { bg: g(135, "#fde2e4", "#fff1e6"), a: "#e76f51", a2: "#264653", tx: "#264653", mu: "#6d6875", bt: "#ffffff" },
    coffee:     { bg: "#2b1d16", a: "#d4a373", a2: "#faedcd", tx: "#faedcd", mu: "#d6ccc2", bt: "#2b1d16" },
    kashmir:    { bg: g(160, "#14532d", "#052e16"), a: "#ffffff", a2: "#dc2626", tx: "#ffffff", mu: "#bbf7d0", bt: "#14532d" }
  };
  const alpha = (hex, a) => {
    const h = hex.replace("#", ""); const n = parseInt(h.length === 3 ? h.split("").map(x => x + x).join("") : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };

  /* ---------------- text fitting ---------------- */
  const KF = { Anton: 0.52, "Bebas Neue": 0.44, Outfit: 0.62, Montserrat: 0.74, Poppins: 0.65, Inter: 0.6, "Playfair Display": 0.62,
    Pacifico: 0.64, Lobster: 0.54, "Noto Nastaliq Urdu": 0.42, Amiri: 0.44 };
  // Greedy word wrap, the same way a Fabric text box breaks lines
  const lineCount = (text, w, size, font) => {
    const k = (KF[font] || 0.6) * size * 1.04;
    return String(text).split("\n").reduce((n, para) => {
      let lines = 1, cur = 0;
      para.split(/\s+/).filter(Boolean).forEach(word => {
        const ww = word.length * k, add = cur ? ww + k * 0.55 : ww;
        if (cur && cur + add > w) { lines++; cur = ww; } else cur += add;
      });
      return n + lines;
    }, 0);
  };
  // the longest single word must fit on one line, because a text box never breaks inside a word
  const wordFits = (text, w, size, font) => Math.max(...String(text).split(/\s+/).map(x => x.length)) * size * (KF[font] || 0.6) * 1.04 <= w;
  const fitSize = (text, w, max, maxLines, font, min = 16) => {
    let s = max; while (s > min && (lineCount(text, w, s, font) > maxLines || !wordFits(text, w, s, font))) s = Math.floor(s * 0.94); return s;
  };
  function T(text, x, y, w, size, font, fill, o = {}) {
    const urdu = font === "Noto Nastaliq Urdu" || font === "Amiri";
    const lh = o.lh || (urdu ? (font === "Amiri" ? 1.5 : 1.9) : 1.15);
    const spec = Object.assign({ t: "text", text, l: x, top: y, w, size: Math.round(size), font, fill, align: o.align || "center", lh }, o);
    // Fabric gives every line `lineHeight` except the last, which is ~1.13 × font size
    spec.h = (lineCount(text, w, size, font) - 1) * size * lh + size * 1.2;
    return spec;
  }
  const pill = (txt, cx, y, size, bg, fg, font = "Montserrat") => {
    const w = Math.round(txt.length * size * (KF[font] || 0.6) + size * 2.4), h = Math.round(size * 2.1);
    return [{ t: "rect", l: cx - w / 2, top: y, w, h, rx: h / 2, fill: bg },
            { t: "text", text: txt, l: cx - w / 2, top: y + (h - size * 1.16) / 2, w, size: Math.round(size), font, fill: fg, align: "center", weight: 800 }];
  };
  const button = (txt, cx, y, u, bg, fg) => {
    const size = 40 * u, w = Math.round(Math.max(380 * u, txt.length * size * 0.66 + 120 * u)), h = Math.round(104 * u);
    return [{ t: "rect", l: cx - w / 2, top: y, w, h, rx: h / 2, fill: bg, shadow: { c: "rgba(0,0,0,.25)", b: 18 * u, x: 0, y: 8 * u } },
            { t: "text", text: txt, l: cx - w / 2, top: y + (h - size * 1.16) / 2, w, size: Math.round(size), font: "Montserrat", fill: fg, align: "center", weight: 800 }];
  };
  const crescent = (x, y, size, fill) => ({ t: "path", d: "M50 10A40 40 0 0 0 50 90A26 40 0 0 1 50 10Z", l: x, top: y, fill, size, name: "Crescent" });
  const star = (x, y, r, fill, pts = 5, inner = 0.45) => ({ t: "star", l: x, top: y, r, points: pts, inner, fill, name: "Star" });
  const isDarkBg = p => { const c = typeof p.bg === "string" ? p.bg : p.bg.g[1][0]; const n = parseInt(c.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) < 140; };

  /* ---------------- layouts ---------------- */
  // Each returns an array of object specs. W/H = size, c = content, p = palette, u = scale unit.
  const L = {};

  // Centered poster: kicker, (urdu), title, sub, optional photo, CTA and phone
  L.poster = (W, H, c, p, u0) => {
    for (let f = 1; f > 0.55; f -= 0.06) {
      const o = posterOnce(W, H, c, p, u0, f);
      if (o.fits || f - 0.06 <= 0.55) return o.objs;
    }
  };
  function posterOnce(W, H, c, p, u, f) {
    const o = [], m = W * 0.08, cw = W - 2 * m, cx = W / 2, tall = H / W > 1.2;
    o.push({ t: "circle", l: -W * 0.18, top: -W * 0.18, r: W * 0.32, fill: alpha(p.a, 0.12) });
    o.push({ t: "circle", l: W * 0.72, top: H - W * 0.3, r: W * 0.3, fill: alpha(p.a, 0.1) });
    o.push({ t: "rect", l: W * 0.035, top: W * 0.035, w: W * 0.93, h: H - W * 0.07, rx: 22 * u, fill: "rgba(0,0,0,0)", stroke: alpha(p.a, 0.45), sw: 3 * u, name: "Border" });
    let y = H * (tall ? 0.1 : 0.09);
    if (c.em) { o.push(T(c.em, cx - 100 * u, y, 200 * u, 110 * u * f, "Inter", p.tx)); y += 150 * u * f; }
    if (c.k) { o.push(...pill(c.k, cx, y, 26 * u, p.a, p.bt)); y += 95 * u; }
    if (c.u) { const s = fitSize(c.u, cw, 96 * u, 1, "Noto Nastaliq Urdu"); const t = T(c.u, m, y, cw, s, "Noto Nastaliq Urdu", p.a, { weight: "normal" }); o.push(t); y += t.h + 6 * u; }
    const tf = (c.f && c.f[0]) || "Anton";
    const ts = fitSize(c.t, cw, (tall ? 165 : 140) * u * f, c.photo ? 2 : 3, tf);
    const tt = T(c.t, m, y, cw, ts, tf, p.tx, { lh: tf === "Anton" || tf === "Bebas Neue" ? 1.0 : 1.12, weight: tf === "Anton" ? "normal" : 900 });
    o.push(tt); y += tt.h + 22 * u;
    if (c.s) { const ss = fitSize(c.s, cw * 0.9, 44 * u * Math.max(f, 0.8), 3, "Poppins"); const st = T(c.s, m + cw * 0.05, y, cw * 0.9, ss, "Poppins", p.mu, { weight: 500, lh: 1.35 }); o.push(st); y += st.h + 34 * u; }
    const bottom = H - W * 0.08 - (c.ph ? 70 * u : 0) - 104 * u;
    if (c.photo) {
      const ph = Math.min(bottom - y - 40 * u, cw * 0.78);
      if (ph > 160 * u) {
        const circ = c.photo === "circle";
        o.push({ t: "photo", l: cx - (circ ? ph : ph * 1.15) / 2, top: y, w: circ ? ph : ph * 1.15, h: ph, rx: circ ? 0 : 28 * u, shape: circ ? "circle" : "rect", name: "Your photo" });
        y += ph + 36 * u;
      }
    }
    if (c.list) {
      const ls = 38 * u; c.list.forEach(it => { const t = T("✓  " + it, m + cw * 0.12, y, cw * 0.76, ls, "Poppins", p.tx, { align: "left", weight: 600 }); o.push(t); y += t.h + 12 * u; });
      y += 20 * u;
    }
    const by = Math.max(y, bottom);
    if (c.cta) o.push(...button(c.cta, cx, by, u, p.a, p.bt));
    if (c.ph) o.push(T(c.ph, m, by + 124 * u, cw, 40 * u, "Outfit", p.a2 && isDarkBg(p) ? p.a2 : p.tx, { weight: 800 }));
    return { objs: o, fits: y <= bottom + 4 };
  }

  // Photo on one side, text on the other (stacks vertically on tall sizes)
  L.split = (W, H, c, p, u) => {
    const o = [], tall = H / W > 1.15;
    if (tall) {
      const ph = H * (H / W > 1.5 ? 0.48 : 0.4);
      o.push({ t: "photo", l: 0, top: 0, w: W, h: ph, name: "Your photo" });
      o.push({ t: "rect", l: 0, top: ph - 8 * u, w: W, h: 16 * u, fill: p.a });
      const m = W * 0.08, cw = W - 2 * m; let y = ph + 60 * u;
      if (c.k) { o.push(T(c.k.toUpperCase(), m, y, cw, 30 * u, "Montserrat", p.a, { align: "left", weight: 800, cs: 150 })); y += 60 * u; }
      const tf = (c.f && c.f[0]) || "Montserrat";
      const ts = fitSize(c.t, cw, 120 * u, 3, tf); const t = T(c.t, m, y, cw, ts, tf, p.tx, { align: "left", weight: 900, lh: 1.05 }); o.push(t); y += t.h + 24 * u;
      if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 42 * u, 3, "Poppins"), "Poppins", p.mu, { align: "left", weight: 500, lh: 1.35 }); o.push(s); y += s.h + 36 * u; }
      if (c.list) c.list.forEach(it => { const t2 = T("•  " + it, m, y, cw, 36 * u, "Poppins", p.tx, { align: "left", weight: 600 }); o.push(t2); y += t2.h + 8 * u; });
      const by = Math.min(Math.max(y + 24 * u, H - 230 * u), H - 200 * u);
      if (c.cta) o.push(...button(c.cta, m + 220 * u, by, u, p.a, p.bt));
      if (c.ph) o.push(T(c.ph, m, by + 130 * u, cw, 40 * u, "Outfit", p.tx, { align: "left", weight: 800 }));
      return o;
    }
    const pw = W * 0.44, m = W * 0.06, tx = pw + m, cw = W - tx - m;
    o.push({ t: "photo", l: 0, top: 0, w: pw, h: H, name: "Your photo" });
    o.push({ t: "rect", l: pw, top: 0, w: 14 * u, h: H, fill: p.a });
    let y = H * 0.12;
    if (c.k) { o.push(T(c.k.toUpperCase(), tx, y, cw, 26 * u, "Montserrat", p.a, { align: "left", weight: 800, cs: 150 })); y += 54 * u; }
    const tf = (c.f && c.f[0]) || "Montserrat";
    const t = T(c.t, tx, y, cw, fitSize(c.t, cw, 96 * u, 3, tf), tf, p.tx, { align: "left", weight: 900, lh: 1.05 }); o.push(t); y += t.h + 20 * u;
    if (c.s) { const s = T(c.s, tx, y, cw, fitSize(c.s, cw, 36 * u, 3, "Poppins"), "Poppins", p.mu, { align: "left", weight: 500, lh: 1.35 }); o.push(s); y += s.h + 26 * u; }
    if (c.list) c.list.forEach(it => { const t2 = T("•  " + it, tx, y, cw, 30 * u, "Poppins", p.tx, { align: "left", weight: 600 }); o.push(t2); y += t2.h + 6 * u; });
    const by = Math.max(y + 16 * u, H - 190 * u);
    if (c.cta) o.push(...button(c.cta, tx + 200 * u, Math.min(by, H - 150 * u), u * 0.9, p.a, p.bt));
    if (c.ph) o.push(T(c.ph, tx, H - 52 * u - 30 * u, cw, 34 * u, "Outfit", p.tx, { align: "left", weight: 800 }));
    return o;
  };

  // Big sale: huge word, discount burst, product frame, footer bar
  L.sale = (W, H, c, p, u) => {
    const o = [], m = W * 0.07, tall = H / W > 1.15, wide = W / H > 1.3;
    if (wide) {
      o.push({ t: "photo", l: W * 0.56, top: H * 0.1, w: W * 0.38, h: H * 0.8, rx: 26 * u, name: "Product photo" });
      let y = H * 0.1;
      if (c.k) { o.push(T(c.k, m, y, W * 0.48, 40 * u, "Montserrat", p.tx, { align: "left", weight: 900, cs: 120 })); y += 60 * u; }
      const t = T(c.t, m, y, W * 0.5, fitSize(c.t, W * 0.5, 190 * u, 2, "Anton"), "Anton", p.a, { align: "left", lh: 0.95, weight: "normal" }); o.push(t); y += t.h + 10 * u;
      if (c.s) o.push(T(c.s, m, y, W * 0.48, 34 * u, "Poppins", p.mu, { align: "left", weight: 600 }));
      if (c.badge) { o.push(star(W * 0.44, H * 0.04, 120 * u, p.a2, 14, 0.8)); o.push(T(c.badge, W * 0.44 + 20 * u, H * 0.04 + 70 * u, 200 * u, 50 * u, "Anton", "#111", { lh: 0.95, weight: "normal" })); }
      if (c.ph) o.push(T(c.ph, m, H - 90 * u, W * 0.5, 40 * u, "Outfit", p.a2, { align: "left", weight: 800 }));
      return o;
    }
    let y = H * 0.07;
    if (c.k) { o.push(T(c.k, m, y, W - 2 * m, 54 * u, "Montserrat", p.tx, { align: "left", weight: 900, cs: 100 })); y += 76 * u; }
    const t = T(c.t, m - 6 * u, y, W - 2 * m, fitSize(c.t, W - 2 * m, (tall ? 240 : 200) * u, 2, "Anton"), "Anton", p.a, { align: "left", lh: 0.9, weight: "normal" });
    o.push(t); y += t.h + 10 * u;
    if (c.s) { const s = T(c.s, m, y, W * 0.6, fitSize(c.s, W * 0.6, 40 * u, 3, "Poppins"), "Poppins", p.mu, { align: "left", weight: 600, lh: 1.3 }); o.push(s); y += s.h + 30 * u; }
    const footer = 150 * u, ph = H - footer - y - 50 * u;
    o.push({ t: "photo", l: W * 0.4, top: y + 10 * u, w: W * 0.54, h: Math.max(200 * u, ph), rx: 30 * u, name: "Product photo" });
    if (c.badge) {
      const r = Math.max(110 * u, Math.min(175 * u, (H - footer - y - 40 * u) / 2.1)), by = y + 20 * u;
      o.push(star(m * 0.6, by, r, p.a2, 16, 0.84));
      const bs = r * 0.36; o.push(T(c.badge, m * 0.6 + r * 0.2, by + r - bs * 1.05, r * 1.6, bs, "Anton", "#111111", { lh: 0.95, weight: "normal" }));
    }
    o.push({ t: "rect", l: 0, top: H - footer, w: W, h: footer, fill: p.a });
    o.push(T((c.cta ? c.cta + "   " : "") + (c.ph || ""), m, H - footer + (footer - 46 * u) / 2, W - 2 * m, 42 * u, "Montserrat", p.bt, { weight: 900 }));
    return o;
  };

  // Islamic: arch, crescent, stars, big Urdu/Arabic line
  L.islamic = (W, H, c, p, u) => {
    const o = [], cx = W / 2, m = W * 0.1, cw = W - 2 * m, tall = H / W > 1.2;
    const aw = W * 0.74, ah = Math.min(H * 0.8, aw * (tall ? 1.7 : 1.15)), ax = cx - aw / 2, ay = (H - ah) / 2;
    o.push({ t: "path", d: `M0 ${ah}V${aw / 2}A${aw / 2} ${aw / 2} 0 0 1 ${aw} ${aw / 2}V${ah}Z`, l: ax, top: ay, fill: "rgba(0,0,0,0)", stroke: p.a, sw: 5 * u, name: "Arch" });
    o.push({ t: "path", d: `M0 ${ah}V${aw / 2}A${aw / 2} ${aw / 2} 0 0 1 ${aw} ${aw / 2}V${ah}Z`, l: ax + 22 * u, top: ay + 22 * u, fill: alpha(p.a, 0.06), stroke: alpha(p.a, 0.5), sw: 2 * u, size: aw - 44 * u, name: "Arch inner" });
    o.push(crescent(cx - 45 * u, ay + 40 * u, 66 * u, p.a));
    o.push(star(cx + 22 * u, ay + 70 * u, 14 * u, p.a));
    [[0.12, 0.1], [0.86, 0.14], [0.08, 0.7], [0.9, 0.78], [0.2, 0.9]].forEach(([fx, fy], i) => o.push(star(W * fx, H * fy, (8 + i * 3) * u, alpha(p.a, 0.7))));
    let y = ay + 200 * u;
    if (c.u) { const s = fitSize(c.u, aw * 0.86, (tall ? 140 : 96) * u, 2, "Noto Nastaliq Urdu"); const t = T(c.u, cx - aw * 0.43, y, aw * 0.86, s, "Noto Nastaliq Urdu", p.a, { weight: "normal" }); o.push(t); y += t.h + 10 * u; }
    const tf = (c.f && c.f[0]) || "Playfair Display";
    const t = T(c.t, cx - aw * 0.42, y, aw * 0.84, fitSize(c.t, aw * 0.84, (tall ? 100 : 80) * u, 2, tf), tf, p.tx, { weight: 700, lh: 1.1 }); o.push(t); y += t.h + 20 * u;
    if (c.s) { const room = ay + ah - 40 * u - y; let ss = fitSize(c.s, aw * 0.8, (tall ? 40 : 34) * u, 3, "Poppins"); while (ss > 16 && T(c.s, 0, 0, aw * 0.8, ss, "Poppins", "", { lh: 1.4 }).h > room) ss -= 2;
      o.push(T(c.s, cx - aw * 0.4, y, aw * 0.8, ss, "Poppins", p.mu, { weight: 500, lh: 1.4 })); }
    if (c.ph) o.push(T(c.ph, m, H - 90 * u, cw, 34 * u, "Outfit", p.a, { weight: 700 }));
    return o;
  };

  // Menu / price list
  L.menu = (W, H, c, p, u) => {
    const o = [], m = W * 0.08, cw = W - 2 * m;
    o.push({ t: "rect", l: 0, top: 0, w: W, h: H * 0.2, fill: p.a });
    o.push(T(c.t, m, H * 0.045, cw, fitSize(c.t, cw, 110 * u, 1, "Anton"), "Anton", p.bt, { weight: "normal" }));
    if (c.k) o.push(T(c.k, m, H * 0.13, cw, 34 * u, "Poppins", p.bt, { weight: 600 }));
    const items = c.list || [], rows = items.length, top = H * 0.25, rowH = Math.min(118 * u, (H * 0.6) / Math.max(rows, 1));
    items.forEach((it, i) => {
      const [name, price] = it.split("|"); const y = top + i * rowH, fs = Math.min(44 * u, rowH * 0.42);
      o.push(T(name, m, y, cw * 0.7, fs, "Poppins", p.tx, { align: "left", weight: 700 }));
      o.push(T(price || "", m + cw * 0.7, y, cw * 0.3, fs, "Montserrat", p.a, { align: "right", weight: 900 }));
      o.push({ t: "line", x1: m, y1: y + rowH * 0.78, x2: m + cw, y2: y + rowH * 0.78, stroke: alpha(p.a, 0.35), sw: 2 * u });
    });
    if (c.s) o.push(T(c.s, m, H * 0.87, cw, 34 * u, "Poppins", p.mu, { weight: 500 }));
    if (c.ph) o.push(T(c.ph, m, H * 0.92, cw, 44 * u, "Outfit", p.a, { weight: 800 }));
    return o;
  };

  // YouTube thumbnail
  L.thumb = (W, H, c, p, u) => {
    const o = [], m = W * 0.045;
    o.push({ t: "photo", l: W * 0.56, top: 0, w: W * 0.44, h: H, name: "Your photo" });
    o.push({ t: "rect", l: W * 0.5, top: 0, w: W * 0.12, h: H, fill: { g: [90, [typeof p.bg === "string" ? p.bg : p.bg.g[2][0], 0], ["rgba(0,0,0,0)", 1]] } });
    let y = H * 0.12;
    if (c.k) { o.push({ t: "rect", l: m, top: y, w: Math.max(260 * u, c.k.length * 34 * u * 0.5 + 60 * u), h: 70 * u, rx: 12 * u, fill: p.a, angle: -2 });
      o.push(T(c.k, m + 10 * u, y + 12 * u, Math.max(240 * u, c.k.length * 34 * u * 0.5 + 40 * u), 44 * u, "Bebas Neue", p.bt, { angle: -2, weight: "normal" })); y += 100 * u; }
    const t = T(c.t, m, y, W * 0.56, fitSize(c.t, W * 0.56, 150 * u, 3, "Anton"), "Anton", p.tx, { align: "left", lh: 0.98, stroke: "#000000", sw: 8 * u, weight: "normal", shadow: { c: "rgba(0,0,0,.55)", b: 0, x: 7 * u, y: 7 * u } });
    o.push(t); y += t.h + 16 * u;
    if (c.s) o.push(T(c.s, m, Math.min(y, H - 90 * u), W * 0.52, 44 * u, "Bebas Neue", p.a, { align: "left", weight: "normal", cs: 60 }));
    return o;
  };

  // Elegant: thin double frame, script kicker, serif title (weddings, quotes, invites)
  L.elegant = (W, H, c, p, u) => {
    const o = [], m = W * 0.1, cw = W - 2 * m, cx = W / 2;
    o.push({ t: "rect", l: W * 0.04, top: W * 0.04, w: W * 0.92, h: H - W * 0.08, fill: "rgba(0,0,0,0)", stroke: p.a, sw: 4 * u });
    o.push({ t: "rect", l: W * 0.06, top: W * 0.06, w: W * 0.88, h: H - W * 0.12, fill: "rgba(0,0,0,0)", stroke: alpha(p.a, 0.5), sw: 2 * u });
    [[W * 0.04, W * 0.04], [W * 0.96, W * 0.04], [W * 0.04, H - W * 0.04], [W * 0.96, H - W * 0.04]].forEach(([x, y]) => o.push({ t: "circle", l: x - 14 * u, top: y - 14 * u, r: 14 * u, fill: p.a }));
    let y = H * 0.12;
    if (c.u) { const t = T(c.u, m, y, cw, fitSize(c.u, cw, 60 * u, 1, "Noto Nastaliq Urdu"), "Noto Nastaliq Urdu", p.a, { weight: "normal" }); o.push(t); y += t.h + 10 * u; }
    if (c.k) { const t = T(c.k, m, y, cw, fitSize(c.k, cw, 76 * u, 1, "Pacifico"), "Pacifico", p.a, { weight: "normal", lh: 1.4 }); o.push(t); y += t.h + 18 * u; }
    const tf = (c.f && c.f[0]) || "Playfair Display";
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, 120 * u, 3, tf), tf, p.tx, { weight: 700, lh: 1.1 }); o.push(t); y += t.h + 26 * u;
    o.push({ t: "line", x1: cx - 120 * u, y1: y, x2: cx + 120 * u, y2: y, stroke: p.a, sw: 3 * u }); y += 40 * u;
    if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 40 * u, 4, "Poppins"), "Poppins", p.mu, { weight: 500, lh: 1.45 }); o.push(s); y += s.h + 30 * u; }
    if (c.list) c.list.forEach(it => { const t2 = T(it, m, y, cw, 38 * u, "Playfair Display", p.tx, { weight: 700 }); o.push(t2); y += t2.h + 10 * u; });
    if (c.photo) { const ph = Math.min(H * 0.86 - y - 120 * u, cw * 0.6); if (ph > 150 * u) { o.push({ t: "photo", l: cx - ph / 2, top: y + 10 * u, w: ph, h: ph, shape: "circle", name: "Photo" }); y += ph + 30 * u; } }
    if (c.cta) o.push(T(c.cta, m, Math.max(y, H * 0.82), cw, 36 * u, "Montserrat", p.a, { weight: 800, cs: 120 }));
    if (c.ph) o.push(T(c.ph, m, H * 0.88, cw, 32 * u, "Poppins", p.mu, { weight: 600 }));
    return o;
  };

  // Business card
  L.card = (W, H, c, p, u) => {
    const o = [], m = W * 0.07;
    o.push({ t: "rect", l: 0, top: 0, w: W * 0.36, h: H, fill: p.a });
    o.push({ t: "photo", l: W * 0.18 - 110 * u, top: H / 2 - 110 * u, w: 220 * u, h: 220 * u, shape: "circle", name: "Logo" });
    const x = W * 0.36 + m, cw = W - x - m;
    o.push(T(c.t, x, H * 0.14, cw, fitSize(c.t, cw, 64 * u, 1, "Montserrat"), "Montserrat", p.tx, { align: "left", weight: 900 }));
    if (c.k) o.push(T(c.k, x, H * 0.3, cw, 32 * u, "Poppins", p.a, { align: "left", weight: 600 }));
    (c.list || []).forEach((it, i) => o.push(T(it, x, H * 0.48 + i * 58 * u, cw, 28 * u, "Poppins", p.mu, { align: "left", weight: 500 })));
    return o;
  };

  // Reels / Shorts / story cover: full photo + gradient + big title
  L.cover = (W, H, c, p, u) => {
    const o = [], m = W * 0.08, cw = W - 2 * m;
    o.push({ t: "photo", l: 0, top: 0, w: W, h: H, name: "Background photo" });
    o.push({ t: "rect", l: 0, top: H * 0.45, w: W, h: H * 0.55, fill: { g: [180, ["rgba(0,0,0,0)", 0], ["rgba(0,0,0,.85)", 1]] } });
    let y = H * 0.62;
    if (c.k) { o.push(...pill(c.k, W / 2, y, 30 * u, p.a, p.bt)); y += 100 * u; }
    const t = T(c.t, m, y, cw, fitSize(c.t, cw, 150 * u, 3, "Anton"), "Anton", "#ffffff", { lh: 1, weight: "normal", shadow: { c: "rgba(0,0,0,.6)", b: 20 * u, x: 0, y: 6 * u } });
    o.push(t); y += t.h + 20 * u;
    if (c.s) o.push(T(c.s, m, y, cw, 42 * u, "Poppins", p.a, { weight: 700 }));
    return o;
  };

  // Pakistan national days: white band + green with crescent & star
  L.flag = (W, H, c, p, u) => {
    const o = [], tall = H / W > 1.15;
    if (tall) {
      o.push({ t: "rect", l: 0, top: 0, w: W, h: H * 0.16, fill: "#ffffff" });
      o.push({ t: "rect", l: 0, top: H * 0.16, w: W, h: H * 0.84, fill: "#01411c" });
    } else {
      o.push({ t: "rect", l: 0, top: 0, w: W * 0.22, h: H, fill: "#ffffff" });
    }
    const gx = tall ? 0 : W * 0.22, gw = W - gx, gy = tall ? H * 0.16 : 0, cx = gx + gw / 2;
    o.push(crescent(cx - 80 * u, gy + 50 * u, 120 * u, "#ffffff"));
    o.push(star(cx + 40 * u, gy + 100 * u, 36 * u, "#ffffff"));
    const m = gw * 0.08, cw = gw - 2 * m; let y = gy + 400 * u;
    if (c.u) { const t = T(c.u, gx + m, y, cw, fitSize(c.u, cw, 100 * u, 1, "Noto Nastaliq Urdu"), "Noto Nastaliq Urdu", "#ffffff", { weight: "normal" }); o.push(t); y += t.h; }
    const t = T(c.t, gx + m, y, cw, fitSize(c.t, cw, 120 * u, 2, "Anton"), "Anton", "#ffffff", { lh: 1, weight: "normal" }); o.push(t); y += t.h + 20 * u;
    if (c.s) o.push(T(c.s, gx + m, y, cw, fitSize(c.s, cw, 40 * u, 3, "Poppins"), "Poppins", "#d1fae5", { weight: 500, lh: 1.4 }));
    if (c.ph) o.push(T(c.ph, gx + m, H - 90 * u, cw, 36 * u, "Outfit", "#ffffff", { weight: 800 }));
    return o;
  };

  // Announcement: icon circle, title, details rows (date / time / place)
  L.announce = (W, H, c, p, u) => {
    const o = [], m = W * 0.08, cw = W - 2 * m, cx = W / 2;
    let y = H * 0.06; const head = [];
    if (c.k) { head.push(T(c.k.toUpperCase(), m, y, cw, 32 * u, "Montserrat", p.bt, { weight: 800, cs: 200 })); y += 60 * u; }
    const tt = T(c.t, m, y, cw, fitSize(c.t, cw, 110 * u, 2, "Montserrat"), "Montserrat", p.bt, { weight: 900, lh: 1.05 }); head.push(tt);
    const band = Math.max(H * 0.3, y + tt.h + 130 * u);
    o.push({ t: "rect", l: 0, top: 0, w: W, h: band, fill: p.a }); o.push(...head);
    o.push({ t: "circle", l: cx - 90 * u, top: band - 90 * u, r: 90 * u, fill: isDarkBg(p) ? "#ffffff" : p.tx, stroke: p.a, sw: 10 * u });
    if (c.em) o.push(T(c.em, cx - 90 * u, band - 62 * u, 180 * u, 90 * u, "Inter", "#000"));
    y = band + 120 * u;
    if (c.s) { const s = T(c.s, m, y, cw, fitSize(c.s, cw, 40 * u, 3, "Poppins"), "Poppins", p.mu, { weight: 500, lh: 1.4 }); o.push(s); y += s.h + 30 * u; }
    (c.list || []).forEach(it => {
      o.push({ t: "rect", l: m, top: y, w: cw, h: 86 * u, rx: 18 * u, fill: alpha(p.a, 0.1), stroke: alpha(p.a, 0.4), sw: 2 * u });
      o.push(T(it, m + 30 * u, y + 22 * u, cw - 60 * u, 36 * u, "Poppins", p.tx, { align: "left", weight: 600 })); y += 104 * u;
    });
    const by = Math.min(Math.max(y + 20 * u, H - 250 * u), H - (c.ph ? 200 : 140) * u);
    if (c.cta) o.push(...button(c.cta, cx, by, u, p.a, p.bt));
    if (c.ph) o.push(T(c.ph, m, by + 120 * u, cw, 38 * u, "Outfit", p.tx, { weight: 800 }));
    return o;
  };

  // Quote
  L.quote = (W, H, c, p, u) => {
    const o = [], m = W * 0.11, cw = W - 2 * m;
    const urdu = /[؀-ۿ]/.test(c.t);
    o.push(T("“", m - 20 * u, H * 0.1, 300 * u, 300 * u, "Playfair Display", alpha(p.a, 0.8), { align: "left", lh: 1 }));
    const f = urdu ? "Noto Nastaliq Urdu" : ((c.f && c.f[0]) || "Playfair Display");
    const t = T(c.t, m, H * 0.3, cw, fitSize(c.t, cw, (urdu ? 90 : 84) * u, 6, f), f, p.tx, { weight: urdu ? "normal" : 700, lh: urdu ? 2 : 1.25 });
    o.push(t);
    const y = H * 0.3 + t.h + 40 * u;
    o.push({ t: "rect", l: W / 2 - 60 * u, top: y, w: 120 * u, h: 6 * u, fill: p.a });
    if (c.s) o.push(T(c.s, m, y + 36 * u, cw, 40 * u, "Poppins", p.mu, { weight: 600 }));
    if (c.ph) o.push(T(c.ph, m, H - 100 * u, cw, 32 * u, "Outfit", p.mu, { weight: 600 }));
    return o;
  };

  /* ---------------- content (one line per template) ----------------
     [id, name, category, size, layout, palette, content]
     content keys: k kicker · t title · s subtitle · u Urdu line · cta button · ph phone/handle
                   list items · photo true|"circle" · badge burst text · em emoji · f [titleFont]  */
  const PH = "📞 03XX-XXXXXXX";
  const CONTENT = [
    // ---- Islamic & religious ----
    ["ramadan-kareem", "Ramadan Kareem", "Islamic", "sq", "islamic", "navyGold", { u: "رمضان کریم", t: "Ramadan Kareem", s: "May this holy month bring peace, blessings and forgiveness to you and your family." }],
    ["ramadan-story", "Ramadan status", "Islamic", "st", "islamic", "greenGold", { u: "رمضان مبارک", t: "Ramadan Mubarak", s: "Wishing you a blessed month of fasting and prayer." }],
    ["iftar-timing", "Sehri & Iftar timings", "Islamic", "pt", "announce", "greenGold", { k: "Ramadan 1448", t: "Sehri & Iftar Timings", em: "🌙", list: ["Sehri ends: 04:12 AM", "Iftar: 06:48 PM", "City: Your city"], ph: "Share with family" }],
    ["iftar-deal", "Iftar deal", "Islamic", "sq", "sale", "food", { k: "IFTAR SPECIAL", t: "IFTAR DEAL", s: "Pakoray, samosay, fruit chaat & drink for 4 people", badge: "ONLY\nRs 1,999", cta: "ORDER NOW", ph: PH }],
    ["eid-fitr", "Eid ul Fitr Mubarak", "Islamic", "sq", "islamic", "greenGold", { u: "عید مبارک", t: "Eid ul Fitr Mubarak", s: "May Allah accept your fasts and prayers. Happy Eid to you and your loved ones!" }],
    ["eid-fitr-story", "Eid Mubarak status", "Islamic", "st", "islamic", "maroon", { u: "عید مبارک", t: "Eid Mubarak", s: "From our family to yours" }],
    ["eid-adha", "Eid ul Adha Mubarak", "Islamic", "sq", "islamic", "navyGold", { u: "عید الاضحیٰ مبارک", t: "Eid ul Adha Mubarak", s: "May your sacrifices be accepted and your home be filled with blessings." }],
    ["eid-sale", "Eid sale", "Sale", "pt", "sale", "maroon", { k: "EID COLLECTION", t: "EID SALE", s: "New arrivals for the whole family", badge: "UP TO\n40% OFF", cta: "SHOP NOW", ph: PH }],
    ["qurbani-booking", "Qurbani booking", "Islamic", "sq", "announce", "greenGold", { k: "Eid ul Adha", t: "Qurbani Booking Open", em: "🐐", list: ["Goat / sheep: full share", "Cow: 1/7 share available", "Home delivery of meat"], cta: "BOOK NOW", ph: PH }],
    ["jumma", "Jumma Mubarak", "Islamic", "sq", "islamic", "greenGold", { u: "جمعہ مبارک", t: "Jumma Mubarak", s: "Don't forget to recite Surah Al-Kahf and send Durood today." }],
    ["jumma-story", "Jumma status", "Islamic", "st", "islamic", "navyGold", { u: "جمعہ مبارک", t: "Jumma Mubarak", s: "May this blessed Friday bring you peace" }],
    ["muharram", "Muharram / Ashura", "Islamic", "sq", "islamic", "muharram", { u: "یا حسینؑ", t: "Muharram ul Haram", s: "Remembering the sacrifice of Imam Hussain (AS) and the martyrs of Karbala." }],
    ["rabi-ul-awal", "12 Rabi ul Awal", "Islamic", "sq", "islamic", "greenGold", { u: "عید میلاد النبی مبارک", t: "12 Rabi ul Awal", s: "Celebrating the birth of the Holy Prophet Muhammad ﷺ" }],
    ["shab-e-barat", "Shab-e-Barat", "Islamic", "sq", "islamic", "navyGold", { u: "شب برات مبارک", t: "Shab-e-Barat Mubarak", s: "Remember us in your prayers on this night of forgiveness." }],
    ["umrah-package", "Umrah package", "Travel", "pt", "split", "greenGold", { k: "Umrah 2026", t: "Umrah Packages", s: "Visa, flights, hotels near Haram and transport included", list: ["15 days economy", "21 days premium", "Family packages"], cta: "BOOK NOW", ph: PH }],
    ["hajj-mubarak", "Hajj Mubarak", "Islamic", "sq", "islamic", "navyGold", { u: "حج مبارک", t: "Hajj Mubarak", s: "May Allah accept your Hajj and grant you a safe return." }],
    ["dua-request", "Dua request", "Islamic", "sq", "quote", "greenGold", { t: "Remember us in your prayers.", s: "Jazak Allah Khair" }],
    ["inna-lillahi", "Condolence", "Islamic", "sq", "islamic", "muharram", { u: "إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", t: "Inna Lillahi wa Inna Ilayhi Raji'un", s: "With deep sorrow we announce the passing of our beloved [Name]. Please remember them in your prayers.", f: ["Playfair Display"] }],

    // ---- Pakistan days ----
    ["14-august", "14 August", "Pakistan", "sq", "flag", "pakGreen", { u: "پاکستان زندہ باد", t: "Happy Independence Day", s: "14 August · Celebrating the land we love" }],
    ["14-august-story", "Azadi status", "Pakistan", "st", "flag", "pakGreen", { u: "جشنِ آزادی مبارک", t: "14 August", s: "Pakistan Zindabad 🇵🇰" }],
    ["azadi-sale", "Azadi sale", "Sale", "sq", "sale", "pakGreen", { k: "14 AUGUST", t: "AZADI SALE", s: "Celebrate freedom with special prices", badge: "14%\nOFF", cta: "SHOP NOW", ph: PH }],
    ["23-march", "23 March Pakistan Day", "Pakistan", "sq", "flag", "pakGreen", { u: "یومِ پاکستان", t: "Pakistan Day", s: "23 March · Remembering the Lahore Resolution of 1940" }],
    ["6-september", "6 September Defence Day", "Pakistan", "sq", "flag", "pakGreen", { u: "یومِ دفاع", t: "Defence Day", s: "6 September · Salute to the brave defenders of Pakistan" }],
    ["kashmir-day", "Kashmir Solidarity Day", "Pakistan", "sq", "poster", "kashmir", { k: "5 FEBRUARY", u: "کشمیر بنے گا پاکستان", t: "Kashmir Solidarity Day", s: "Standing with the people of Kashmir" }],
    ["iqbal-day", "Iqbal Day", "Pakistan", "sq", "quote", "navyGold", { t: "خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے", s: "Allama Muhammad Iqbal · 9 November" }],
    ["quaid-day", "Quaid Day 25 December", "Pakistan", "sq", "elegant", "navyGold", { k: "25 December", t: "Quaid-e-Azam Day", s: "\"Unity, Faith, Discipline\" — Muhammad Ali Jinnah", f: ["Playfair Display"] }],
    ["cricket-match", "Cricket match day", "Events", "yt", "thumb", "pakGreen", { k: "MATCH DAY", t: "PAKISTAN\nWILL WIN!", s: "Who's watching tonight?", em: "🏏" }],

    // ---- Weddings & family ----
    ["shaadi-card", "Shaadi invitation", "Wedding", "pt", "elegant", "cream", { u: "بسم اللہ الرحمن الرحیم", k: "Wedding Invitation", t: "Ahmed & Ayesha", s: "With the blessings of Allah, we request the pleasure of your company at the wedding of our children.", list: ["Saturday, 12 December 2026", "Royal Palace Marquee, Lahore"], cta: "RSVP: 03XX-XXXXXXX" }],
    ["barat", "Barat invitation", "Wedding", "pt", "elegant", "maroon", { k: "Barat", t: "Ali weds Fatima", s: "Join us as we celebrate the Barat ceremony", list: ["Friday, 11 December · 7:00 PM", "Grand Marquee, Karachi"] }],
    ["mehndi", "Mehndi night", "Wedding", "pt", "elegant", "mehndi", { u: "مہندی کی رات", k: "Mehndi Night", t: "Sara & Bilal", s: "Dholki, songs, colours and dance. Come dressed in yellow and green!", list: ["Thursday, 10 December · 8:00 PM"] }],
    ["walima", "Walima reception", "Wedding", "pt", "elegant", "cream", { k: "Walima", t: "Hamza & Zainab", s: "Request the honour of your presence at the Walima reception", list: ["Sunday, 13 December · 1:00 PM", "Pearl Continental, Islamabad"] }],
    ["nikah", "Nikah ceremony", "Wedding", "sq", "elegant", "cream", { u: "نکاح", k: "Alhamdulillah", t: "Our Nikah", s: "Usman & Hira · 5 November 2026" }],
    ["engagement", "Engagement", "Wedding", "sq", "elegant", "maroon", { k: "We're engaged", t: "Daniyal & Mehak", s: "Alhamdulillah! Thank you for all your love and duas", photo: "circle" }],
    ["save-the-date", "Save the date", "Wedding", "st", "elegant", "cream", { k: "Save the Date", t: "12 · 12 · 2026", s: "Ahmed & Ayesha are getting married. Formal invitation to follow.", photo: "circle" }],
    ["baby-aqiqah", "Aqiqah / new baby", "Family", "sq", "elegant", "peach", { k: "Alhamdulillah", t: "It's a Baby Girl!", s: "We are blessed with a daughter. Please join us for the Aqiqah.", photo: "circle" }],
    ["birthday", "Birthday wishes", "Family", "sq", "poster", "elevenEleven", { em: "🎂", k: "CELEBRATE", t: "Happy Birthday!", s: "Wishing you a year full of happiness, health and success", photo: "circle" }],
    ["anniversary", "Anniversary", "Family", "sq", "elegant", "maroon", { k: "Happy Anniversary", t: "10 Years Together", s: "Thank you for every beautiful moment", photo: "circle" }],
    ["congrats", "Congratulations", "Family", "sq", "poster", "sky", { em: "🎉", k: "CONGRATULATIONS", t: "Well Done, Ali!", s: "On passing your exams with distinction. We are so proud of you!" }],

    // ---- Sales ----
    ["black-friday", "Black Friday", "Sale", "sq", "sale", "bf", { k: "BLACK FRIDAY", t: "MEGA SALE", s: "Biggest discounts of the year. This weekend only!", badge: "UP TO\n70% OFF", cta: "SHOP NOW", ph: PH }],
    ["black-friday-story", "Black Friday story", "Sale", "st", "sale", "bf", { k: "BLACK FRIDAY", t: "70% OFF", s: "Online and in store. Limited stock!", badge: "TODAY\nONLY", cta: "SWIPE UP", ph: "@yourstore" }],
    ["eleven-eleven", "11.11 sale", "Sale", "sq", "sale", "elevenEleven", { k: "SINGLES DAY", t: "11.11 SALE", s: "Free delivery on all orders", badge: "11%\nEXTRA", cta: "ORDER NOW", ph: PH }],
    ["cyber-monday", "Cyber Monday", "Sale", "sq", "sale", "tech", { k: "CYBER MONDAY", t: "TECH DEALS", s: "Laptops, phones and gadgets at the lowest prices", badge: "50%\nOFF", cta: "SHOP NOW", ph: PH }],
    ["flash-sale", "Flash sale", "Sale", "sq", "sale", "blackYellow", { k: "24 HOURS ONLY", t: "FLASH SALE", s: "Hurry, offer ends at midnight", badge: "40%\nOFF", cta: "BUY NOW", ph: PH }],
    ["clearance", "Clearance sale", "Sale", "pt", "sale", "blackRed", { k: "FINAL", t: "CLEARANCE", s: "Everything must go. Prices slashed on all stock", badge: "FLAT\n60% OFF", cta: "VISIT TODAY", ph: PH }],
    ["bogo", "Buy 1 Get 1", "Sale", "sq", "sale", "ytOrange", { k: "LIMITED OFFER", t: "BUY 1 GET 1", s: "On all items this week", badge: "FREE", cta: "ORDER NOW", ph: PH }],
    ["new-arrivals", "New arrivals", "Sale", "pt", "split", "mono", { k: "Just landed", t: "New Arrivals", s: "Fresh styles for the new season. Limited pieces available.", cta: "SHOP NOW", ph: PH, f: ["Playfair Display"] }],
    ["summer-sale", "Summer sale", "Sale", "sq", "sale", "sky", { k: "SUMMER", t: "BIG SALE", s: "Lawn, cotton and more", badge: "30%\nOFF", cta: "SHOP NOW", ph: PH }],
    ["winter-sale", "Winter sale", "Sale", "sq", "sale", "navyGold", { k: "WINTER COLLECTION", t: "SALE", s: "Shawls, jackets and sweaters", badge: "UP TO\n50% OFF", cta: "SHOP NOW", ph: PH }],
    ["sale-yt-banner", "Sale banner (Facebook)", "Sale", "fb", "sale", "blackRed", { k: "WEEKEND", t: "MEGA SALE", s: "Up to 50% off on everything", badge: "50%\nOFF", ph: PH }],
    ["free-delivery", "Free delivery", "Sale", "sq", "poster", "mint", { em: "🚚", k: "THIS WEEK", t: "FREE DELIVERY", s: "On all orders above Rs 2,000 anywhere in Pakistan", cta: "ORDER NOW", ph: PH }],
    ["giveaway", "Giveaway", "Social", "sq", "poster", "elevenEleven", { em: "🎁", k: "GIVEAWAY", t: "WIN THIS!", s: "Follow us, like this post and tag 3 friends to enter", photo: true, ph: "Winner announced Friday" }],
    ["christmas-sale", "Christmas sale", "Sale", "sq", "sale", "xmas", { k: "MERRY CHRISTMAS", t: "XMAS SALE", s: "Gifts for everyone you love", badge: "25%\nOFF", cta: "SHOP NOW", ph: PH }],
    ["new-year", "Happy New Year", "Events", "sq", "poster", "newYear", { em: "✨", k: "WELCOME 2027", t: "Happy New Year!", s: "Thank you for being with us. Here's to a great year ahead!" }],

    // ---- Business & services ----
    ["real-estate-sale", "House for sale", "Real estate", "pt", "split", "estate", { k: "For sale", t: "10 Marla Modern House", s: "DHA Phase 6, Lahore", list: ["5 beds · 6 baths", "Double storey · Corner", "Demand: Rs 4.2 Crore"], cta: "CALL NOW", ph: PH }],
    ["real-estate-rent", "Flat for rent", "Real estate", "sq", "split", "whiteBlue", { k: "For rent", t: "2 Bed Apartment", s: "Bahria Town, Karachi", list: ["Furnished · Lift · Parking", "Rent: Rs 65,000 / month"], cta: "BOOK VISIT", ph: PH }],
    ["plots-booking", "Plots booking", "Real estate", "sq", "poster", "estate", { k: "BOOKING OPEN", t: "Residential Plots on Easy Installments", s: "5, 10 and 20 Marla · Possession in 2 years", cta: "BOOK NOW", ph: PH }],
    ["open-house", "Open house", "Real estate", "st", "announce", "estate", { k: "This Sunday", t: "Open House", em: "🏠", s: "Visit our new project and meet the team", list: ["Sunday · 11 AM – 5 PM", "Gulberg Greens, Islamabad"], cta: "GET LOCATION", ph: PH }],
    ["salon-offer", "Salon offer", "Beauty", "sq", "split", "salon", { k: "Beauty salon", t: "Bridal Makeover", s: "Makeup, hair styling, mehndi and party looks", list: ["Free trial with bridal booking", "Home service available"], cta: "BOOK NOW", ph: PH }],
    ["salon-price", "Salon price list", "Beauty", "pt", "menu", "salon", { t: "SALON PRICES", k: "Women's beauty salon", list: ["Haircut & blow dry|Rs 1,500", "Facial (whitening)|Rs 2,500", "Manicure & pedicure|Rs 2,000", "Party makeup|Rs 5,000", "Bridal makeup|Rs 25,000", "Mehndi (both hands)|Rs 1,500"], s: "Prices may vary by hair length and products", ph: PH }],
    ["barber", "Barber shop", "Beauty", "sq", "poster", "coffee", { em: "💈", k: "GENTS SALON", t: "Fresh Cut, Fresh Start", s: "Haircut · Beard styling · Facial · Hair colour", cta: "WALK IN TODAY", ph: PH }],
    ["gym-join", "Gym membership", "Fitness", "sq", "poster", "gym", { em: "💪", k: "NEW YEAR, NEW YOU", t: "JOIN NOW", s: "Get 30% off on annual membership. Personal trainers available.", cta: "START TODAY", ph: PH }],
    ["gym-story", "Gym story", "Fitness", "st", "cover", "gym", { k: "NO EXCUSES", t: "TRAIN HARD.\nSTAY STRONG.", s: "Join the strongest gym in town" }],
    ["gym-plans", "Gym plans", "Fitness", "pt", "menu", "gym", { t: "MEMBERSHIP", k: "Choose your plan", list: ["Monthly|Rs 4,000", "3 months|Rs 10,500", "6 months|Rs 19,000", "Annual|Rs 33,000", "Personal trainer|Rs 8,000"], s: "Separate timings for ladies", ph: PH }],
    ["admissions", "School admissions", "Education", "pt", "announce", "school", { k: "Session 2026–27", t: "Admissions Open", em: "🎓", s: "Playgroup to Matric · Qualified teachers · Safe campus", list: ["Free admission test", "Transport available"], cta: "APPLY NOW", ph: PH }],
    ["admissions-sq", "Admissions (square)", "Education", "sq", "poster", "sky", { em: "🏫", k: "ADMISSIONS OPEN", t: "Enroll Your Child Today", s: "Montessori, primary and secondary classes", cta: "VISIT CAMPUS", ph: PH }],
    ["tuition", "Tuition academy", "Education", "sq", "split", "school", { k: "Academy", t: "Home & Online Tuition", s: "Maths, Physics, Chemistry, English", list: ["Grade 6 to A Levels", "Experienced tutors"], cta: "BOOK FREE DEMO", ph: PH }],
    ["course-launch", "Online course", "Education", "sq", "poster", "tech", { em: "💻", k: "NEW COURSE", t: "Learn Freelancing in 30 Days", s: "Fiverr, Upwork, client handling and payments. Live classes + recordings.", cta: "ENROLL NOW", ph: PH }],
    ["webinar", "Webinar / workshop", "Events", "sq", "announce", "tech", { k: "Free webinar", t: "AI Tools for Business", em: "🤖", list: ["Saturday · 8:00 PM", "Live on Zoom"], cta: "REGISTER FREE", ph: "Limited seats" }],
    ["result-day", "Result announcement", "Education", "sq", "poster", "school", { em: "🏆", k: "BOARD RESULT", t: "Congratulations Toppers!", s: "Proud of our students who scored A+ this year", photo: true }],
    ["clinic", "Doctor clinic", "Health", "pt", "split", "clinic", { k: "Family clinic", t: "Dr. Ahmed Khan", s: "MBBS, FCPS (Medicine) · 15 years experience", list: ["Mon–Sat · 5 PM – 10 PM", "Diabetes, BP, general medicine"], cta: "BOOK APPOINTMENT", ph: PH }],
    ["dental", "Dental clinic", "Health", "sq", "poster", "clinic", { em: "🦷", k: "DENTAL CARE", t: "Smile With Confidence", s: "Scaling, whitening, braces, implants and root canal", cta: "BOOK CHECK-UP", ph: PH }],
    ["free-camp", "Free medical camp", "Health", "pt", "announce", "mint", { k: "Free for everyone", t: "Free Medical Camp", em: "🩺", list: ["Sunday · 9 AM – 2 PM", "Free check-up & medicines", "Community hall, Main Bazar"], ph: "All are welcome" }],
    ["pharmacy", "Pharmacy delivery", "Health", "sq", "poster", "mint", { em: "💊", k: "24/7 PHARMACY", t: "Medicines at Your Door", s: "Send your prescription on WhatsApp and get delivery in 1 hour", cta: "ORDER ON WHATSAPP", ph: PH }],
    ["mobile-shop", "Mobile shop", "Shop", "sq", "sale", "tech", { k: "MOBILE ZONE", t: "NEW PHONES", s: "PTA approved · Installments available", badge: "EASY\nINSTALLMENTS", cta: "VISIT SHOP", ph: PH }],
    ["mobile-repair", "Mobile repair", "Shop", "sq", "poster", "blackYellow", { em: "🔧", k: "MOBILE REPAIR", t: "Screen, Battery & Software", s: "All brands repaired in 1 hour with warranty", cta: "VISIT TODAY", ph: PH }],
    ["laptop-shop", "Laptop shop", "Shop", "sq", "split", "whiteBlue", { k: "Laptop store", t: "Used & New Laptops", s: "Dell, HP, Lenovo, MacBook", list: ["Checking warranty", "Free bag & mouse"], cta: "SEE STOCK", ph: PH }],
    ["restaurant-menu", "Restaurant menu", "Food", "a4", "menu", "food", { t: "OUR MENU", k: "Desi & fast food", list: ["Chicken Karahi (full)|Rs 2,400", "Mutton Karahi (full)|Rs 3,800", "Chicken Biryani|Rs 450", "Beef Nihari|Rs 550", "Zinger Burger|Rs 520", "Chicken Pizza (L)|Rs 1,650", "Fresh Lime|Rs 180", "Kheer|Rs 250"], s: "Free home delivery within 5 km", ph: PH }],
    ["cafe-menu", "Cafe menu", "Food", "pt", "menu", "coffee", { t: "CAFE MENU", k: "Coffee · Tea · Snacks", list: ["Espresso|Rs 450", "Cappuccino|Rs 650", "Caramel latte|Rs 750", "Doodh patti|Rs 180", "Club sandwich|Rs 850", "Brownie|Rs 400"], ph: PH }],
    ["burger-deal", "Burger deal", "Food", "sq", "sale", "food", { k: "DEAL OF THE DAY", t: "BURGER DEAL", s: "2 Zinger burgers + fries + 2 drinks", badge: "ONLY\nRs 1,299", cta: "ORDER NOW", ph: PH }],
    ["pizza-offer", "Pizza offer", "Food", "sq", "poster", "ytOrange", { em: "🍕", k: "WEEKEND OFFER", t: "Large Pizza Rs 1,499", s: "Any flavour · Free drink · Free delivery", cta: "ORDER NOW", ph: PH }],
    ["bakery", "Bakery / cakes", "Food", "sq", "split", "peach", { k: "Home bakery", t: "Custom Cakes", s: "Birthday, wedding and theme cakes made to order", list: ["Order 24 hours before", "Delivery available"], cta: "ORDER NOW", ph: PH }],
    ["home-food", "Home-made food", "Food", "sq", "poster", "cream", { em: "🍲", k: "HOME CHEF", t: "Ghar Ka Khana", s: "Fresh, hygienic home-made food for offices and students. Monthly packages available.", cta: "ORDER ON WHATSAPP", ph: PH }],
    ["grocery", "Grocery delivery", "Shop", "sq", "poster", "mint", { em: "🛒", k: "GROCERY DELIVERY", t: "Fresh Fruits & Vegetables", s: "Order before 12 PM, get it the same day", cta: "ORDER NOW", ph: PH }],
    ["boutique", "Clothing boutique", "Shop", "pt", "split", "cream", { k: "Boutique", t: "Luxury Pret Collection", s: "Stitched and unstitched · Sizes XS to XL", cta: "SHOP NOW", ph: PH, f: ["Playfair Display"] }],
    ["jewellery", "Jewellery", "Shop", "sq", "split", "navyGold", { k: "Bridal jewellery", t: "Gold Plated Sets", s: "Kundan, polki and zircon sets for brides", cta: "VIEW COLLECTION", ph: PH, f: ["Playfair Display"] }],
    ["furniture", "Furniture", "Shop", "sq", "split", "coffee", { k: "Furniture", t: "Sofa Sets on Order", s: "Custom sizes and fabrics · 1 year warranty", cta: "GET A QUOTE", ph: PH }],
    ["cleaning", "Cleaning service", "Services", "sq", "poster", "sky", { em: "🧽", k: "HOME SERVICES", t: "Deep Cleaning", s: "Sofa, carpet, kitchen and water tank cleaning", list: ["Trained staff", "Same-day booking"], cta: "BOOK NOW", ph: PH }],
    ["electrician", "Electrician / plumber", "Services", "sq", "poster", "blackYellow", { em: "⚡", k: "AT YOUR DOORSTEP", t: "Electrician & Plumber", s: "Wiring, UPS, solar, geyser and leakage repair", cta: "CALL NOW", ph: PH }],
    ["solar", "Solar installation", "Services", "sq", "split", "sky", { k: "Go solar", t: "Cut Your Bill by 80%", s: "5 kW to 20 kW solar systems with net metering", list: ["Tier-1 panels", "10 year warranty"], cta: "FREE SURVEY", ph: PH }],
    ["car-rental", "Car rental", "Travel", "fb", "split", "blackYellow", { k: "Rent a car", t: "With or Without Driver", s: "Corolla, Civic, Prado and vans for weddings and tours", ph: PH }],
    ["travel-tour", "Northern areas tour", "Travel", "pt", "split", "sky", { k: "Tour package", t: "Hunza & Skardu", s: "6 days · Hotels, transport and meals included", list: ["Departure every Friday", "Family & couple packages"], cta: "BOOK SEAT", ph: PH }],
    ["freelancer", "Freelancer services", "Services", "sq", "split", "tech", { k: "Hire me", t: "Logo & Social Media Design", s: "Fast delivery, unlimited revisions", list: ["Logos from $15", "Posts from $5 each"], cta: "DM ME", ph: "@yourname" }],
    ["agency", "Digital marketing agency", "Services", "sq", "poster", "tech", { em: "📈", k: "GROW YOUR BUSINESS", t: "Digital Marketing That Sells", s: "Facebook ads, SEO, websites and content for small businesses", cta: "FREE CONSULTATION", ph: PH }],
    ["hiring", "We're hiring", "Jobs", "sq", "announce", "whiteBlue", { k: "Join our team", t: "We're Hiring!", em: "💼", list: ["Sales executive (2)", "Graphic designer (1)", "Office boy (1)"], cta: "SEND CV", ph: "jobs@yourcompany.com" }],
    ["hiring-story", "Hiring story", "Jobs", "st", "announce", "tech", { k: "Remote job", t: "Hiring: Video Editor", em: "🎬", s: "Full-time remote · Premiere Pro or CapCut", list: ["Salary: Rs 60k – 90k", "Send portfolio on WhatsApp"], cta: "APPLY NOW", ph: PH }],
    ["grand-opening", "Grand opening", "Events", "sq", "poster", "maroon", { em: "🎊", k: "GRAND OPENING", t: "We're Open!", s: "Visit us this Saturday for opening day discounts and gifts", cta: "GET LOCATION", ph: PH }],
    ["coming-soon", "Coming soon", "Events", "sq", "poster", "mono", { k: "STAY TUNED", t: "Coming Soon", s: "Something new is on its way. Follow us so you don't miss it.", f: ["Playfair Display"] }],
    ["closed-notice", "Shop closed notice", "Events", "sq", "announce", "mono", { k: "Notice", t: "Closed Today", em: "📢", s: "Our shop will remain closed on Friday due to a public holiday. We will reopen on Saturday at 10 AM.", ph: "Thank you for understanding" }],
    ["testimonial", "Customer review", "Social", "sq", "quote", "mono", { t: "Fast delivery and the quality is even better than the pictures. Highly recommended!", s: "Ayesha K. · Lahore ★★★★★" }],
    ["thank-you", "Thank you customers", "Social", "sq", "poster", "peach", { em: "💖", k: "THANK YOU", t: "10K Happy Customers", s: "Thank you for trusting us. More good things are coming!" }],
    ["price-list", "Price list", "Shop", "pt", "menu", "whiteBlue", { t: "PRICE LIST", k: "Printing services", list: ["Visiting cards (1000)|Rs 1,800", "Flyers A5 (1000)|Rs 4,500", "Panaflex per sq ft|Rs 45", "Letterhead (500)|Rs 3,500", "Sticker printing|Rs 15 each"], s: "Design free with bulk orders", ph: PH }],

    // ---- YouTube ----
    ["yt-tech", "Tech review", "YouTube", "yt", "thumb", "tech", { k: "HONEST REVIEW", t: "WORTH IT\nIN 2026?", s: "after 30 days of use", em: "📱" }],
    ["yt-vlog", "Vlog", "YouTube", "yt", "thumb", "sky", { k: "VLOG", t: "OUR TRIP TO\nHUNZA!", s: "best views ever", em: "🏔️" }],
    ["yt-gaming", "Gaming", "YouTube", "yt", "thumb", "elevenEleven", { k: "PUBG / FREE FIRE", t: "1 VS 4\nCLUTCH!", s: "insane ending", em: "🎮" }],
    ["yt-cooking", "Cooking", "YouTube", "yt", "thumb", "food", { k: "EASY RECIPE", t: "DHABA STYLE\nKARAHI", s: "in just 30 minutes", em: "🍛" }],
    ["yt-earn", "Earn online", "YouTube", "yt", "thumb", "greenGold", { k: "STEP BY STEP", t: "EARN $500\nONLINE", s: "no investment needed", em: "💸" }],
    ["yt-news", "News / update", "YouTube", "yt", "thumb", "blackRed", { k: "BREAKING", t: "BIG NEWS\nFOR YOU!", s: "watch till the end", em: "📢" }],
    ["yt-podcast", "Podcast", "YouTube", "yt", "thumb", "coffee", { k: "PODCAST EP. 12", t: "THE TRUTH\nABOUT SUCCESS", s: "with a special guest", em: "🎙️" }],
    ["yt-islamic", "Islamic lecture", "YouTube", "yt", "thumb", "greenGold", { k: "BAYAN", t: "POWER OF\nDUA", s: "must watch", em: "🤲" }],

    // ---- Reels & Shorts covers ----
    ["reel-food", "Reel cover: food", "Reels", "st", "cover", "food", { k: "FOOD VLOG", t: "BEST BIRYANI\nIN KARACHI?", s: "We tried 5 places" }],
    ["reel-tips", "Reel cover: tips", "Reels", "st", "cover", "tech", { k: "3 QUICK TIPS", t: "SAVE BATTERY\nON ANDROID", s: "Part 1" }],
    ["reel-fashion", "Reel cover: fashion", "Reels", "st", "cover", "salon", { k: "OUTFIT IDEAS", t: "EID LOOKS\nUNDER 5K", s: "Shop the look" }],
    ["reel-travel", "Reel cover: travel", "Reels", "st", "cover", "sky", { k: "TRAVEL", t: "NARAN\nKAGHAN", s: "Budget trip guide" }],
    ["reel-fitness", "Reel cover: fitness", "Reels", "st", "cover", "gym", { k: "HOME WORKOUT", t: "10 MIN\nFAT BURN", s: "No equipment" }],
    ["reel-business", "Reel cover: business", "Reels", "st", "cover", "estate", { k: "BUSINESS IDEA", t: "START WITH\nRs 50,000", s: "Full plan inside" }],

    // ---- Quotes ----
    ["quote-motivation", "Motivation quote", "Quotes", "sq", "quote", "mono", { t: "Success is the sum of small efforts, repeated day in and day out.", s: "Robert Collier" }],
    ["quote-dark", "Quote (dark)", "Quotes", "sq", "quote", "navyGold", { t: "Don't stop when you're tired. Stop when you're done.", s: "@yourhandle" }],
    ["quote-urdu", "Urdu poetry", "Quotes", "sq", "quote", "cream", { t: "ستاروں سے آگے جہاں اور بھی ہیں", s: "علامہ اقبال" }],
    ["quote-story", "Quote story", "Quotes", "st", "quote", "peach", { t: "Be patient. Good things take time.", s: "Good morning ☀️" }],
    ["quote-islamic", "Islamic quote", "Quotes", "sq", "quote", "greenGold", { t: "Verily, with hardship comes ease.", s: "Surah Ash-Sharh 94:6" }],

    // ---- Business cards ----
    ["card-dark", "Business card (dark)", "Cards", "bc", "card", "estate", { t: "Usman Tariq", k: "Real Estate Consultant", list: ["📞 03XX-XXXXXXX", "✉️ usman@email.com", "📍 DHA, Lahore"] }],
    ["card-blue", "Business card (blue)", "Cards", "bc", "card", "whiteBlue", { t: "Ayesha Khan", k: "Graphic Designer", list: ["📞 03XX-XXXXXXX", "🌐 ayesha.design", "📍 Karachi"] }],
    ["card-green", "Business card (green)", "Cards", "bc", "card", "mint", { t: "Dr. Sana Ali", k: "Dental Surgeon, BDS", list: ["📞 03XX-XXXXXXX", "🕐 Mon–Sat 5–9 PM", "📍 Blue Area, Islamabad"] }],
    ["card-gold", "Business card (gold)", "Cards", "bc", "card", "navyGold", { t: "Malik Traders", k: "Wholesale & Retail", list: ["📞 03XX-XXXXXXX", "✉️ info@maliktraders.pk", "📍 Main Bazar, Faisalabad"] }]
  ];

  const out = [];
  CONTENT.forEach(([id, name, cat, size, layout, pal, c]) => {
    const [W, H] = SIZES[size], p = P[pal];
    // text scale per format: stories, thumbnails and cards need bigger text than a square post
    const u = Math.min(W, H) / 1080 * ({ st: 1.3, yt: 1.35, bc: 1.7, fb: 1.25 }[size] || 1);
    let objects;
    try { objects = L[layout](W, H, c, p, u); } catch (e) { console.warn("template", id, e); return; }
    objects.forEach(o => { delete o.h0; if (o.t === "text") delete o.h; });
    out.push({ id: "x-" + id, name, cat, w: W, h: H, bg: p.bg, objects });
  });
  window.MDC_TEMPLATES = (window.MDC_TEMPLATES || []).concat(out);
  // shared helpers for other template packs (templates-pro.js)
  window.MDC_TPL_KIT = { P, g, alpha, T, fitSize, lineCount, pill, button, star, crescent, isDarkBg, SIZES };
})();
