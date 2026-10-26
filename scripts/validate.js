#!/usr/bin/env node
/* ==========================================================================
   MALIK DATA CENTRE — content validator
   Run:  node scripts/validate.js
   Fails (exit code 1) when the catalog or a blog post would publish broken,
   thin or risky content. GitHub Actions runs it before every build.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const { ROOT, loadTools, loadPosts, md } = require("./content.js");

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`✖ ${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`⚠ ${where}: ${msg}`);
const today = new Date().toISOString().slice(0, 10);
const CATS = ["ai-chat", "ai-coding", "creative", "video-audio", "vpn-security", "entertainment"];

/* ---------------- 1) Catalog (index.js TOOLS_DATABASE) ---------------- */
let tools;
try { tools = loadTools(); } catch (e) { err("index.js", "TOOLS_DATABASE could not be read: " + e.message); }
const prices = new Set();
if (tools) {
  const ids = new Set();
  tools.list.forEach((t, i) => {
    const w = `index.js item ${i + 1} (${t.id || "no id"})`;
    ["id", "name", "category", "duration", "setup", "desc"].forEach(k => { if (!t[k] || typeof t[k] !== "string") err(w, `missing text field "${k}"`); });
    if (!/^[a-z0-9-]+$/.test(t.id || "")) err(w, "id must be lowercase letters, numbers and dashes");
    if (ids.has(t.id)) err(w, "duplicate id"); ids.add(t.id);
    if (!(Number.isInteger(t.price) && t.price > 0)) err(w, "price must be a whole number above 0");
    if (!(Number.isInteger(t.originalPrice) && t.originalPrice >= t.price)) err(w, "originalPrice must be a whole number >= price");
    if (t.originalPrice > t.price * 15) warn(w, "originalPrice is more than 15x price — looks like a fake discount");
    if (!CATS.includes(t.category)) err(w, `category must be one of: ${CATS.join(", ")}`);
    if (!Array.isArray(t.specs) || !t.specs.length) err(w, "specs must be a non-empty array");
    if (!t.icon) warn(w, "no icon svg");
    prices.add(t.price); prices.add(t.originalPrice);
  });
  // families
  try {
    const fams = require(path.join(ROOT, "site-content", "families.js"));
    const slugs = new Set();
    const covered = new Set();
    fams.forEach(f => {
      const w = `families.js (${f.slug})`;
      if (slugs.has(f.slug)) err(w, "duplicate slug"); slugs.add(f.slug);
      ["slug", "name", "cat", "icon", "intro"].forEach(k => { if (!f[k]) err(w, `missing "${k}"`); });
      if (!CATS.includes(f.cat)) err(w, "cat is not a valid category");
      (f.ids || []).concat(f.aliases || []).forEach(id => { if (!tools.byId[id]) err(w, `catalog id "${id}" does not exist in index.js`); covered.add(id); });
      (f.related || []).forEach(r => { if (!fams.some(x => x.slug === r)) warn(w, `related "${r}" is not a family slug`); });
    });
    tools.list.forEach(t => { if (!covered.has(t.id)) warn(`index.js (${t.id})`, "no tool page — add this id to a family in site-content/families.js"); });
  } catch (e) { err("families.js", e.message); }
}

/* ---------------- 2) Blog posts (site-content/blog/*.md) ---------------- */
const famSlugs = (() => { try { return new Set(require(path.join(ROOT, "site-content", "families.js")).map(f => f.slug)); } catch (e) { return new Set(); } })();
const BANNED = [
  [/lorem ipsum|\[insert|\bTODO\b|\bTBD\b|xx+\b/i, "placeholder text"],
  [/as an ai( language)? model|i am grok|i'm grok|as grok\b|i cannot browse/i, "AI self-reference"],
  [/official (partner|reseller|distributor)|authori[sz]ed (partner|reseller)/i, "claims an official partnership"],
  [/100% (safe|legal|ban[- ]?proof)|never (get )?bann?ed|lifetime guarantee|guaranteed (ranking|results)/i, "unrealistic guarantee"],
  [/\b(crack(ed)?|keygen|nulled|carding|bin method)\b/i, "piracy / fraud wording"],
  [/<\s*(script|iframe|style|object|embed)|on(click|load|error)\s*=/i, "raw HTML / script is not allowed"],
  [/click here/i, "use descriptive link text instead of 'click here'"]
];
const legacy = new Set(fs.existsSync(path.join(ROOT, "blog")) ? fs.readdirSync(path.join(ROOT, "blog")).filter(f => f.endsWith(".html")) : []);
const posts = loadPosts();
const seenSlug = new Map(), seenTitle = new Map(), perDay = {};
posts.forEach(p => {
  const w = `site-content/blog/${p.file}`;
  if (!p.hasFrontMatter) { err(w, "missing front matter block (--- ... ---) at the top"); return; }
  const m = p.file.match(/^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/);
  if (!m) err(w, "file name must be YYYY-MM-DD-slug.md (lowercase, dashes)");
  ["title", "slug", "description", "date", "category", "answer", "keywords"].forEach(k => { if (!p.data[k]) err(w, `front matter "${k}" is required`); });
  if (m && p.slug && m[2] !== p.slug) err(w, `slug "${p.slug}" must match the file name part "${m[2]}"`);
  if (m && p.date && m[1] !== p.date) err(w, `date "${p.date}" must match the file name date "${m[1]}"`);
  if (p.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) err(w, "slug must be lowercase words joined by dashes");
  if (p.slug && p.slug.length > 75) err(w, "slug is too long (max 75 chars)");
  if (p.date && !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) err(w, "date must be YYYY-MM-DD");
  if (p.updated && p.date && p.updated < p.date) err(w, "updated cannot be before date");
  if (p.title && (p.title.length < 25 || p.title.length > 75)) err(w, `title must be 25–75 characters (now ${p.title.length})`);
  if (p.title && p.title.length > 65) warn(w, "title over 65 chars may be cut off in Google");
  if (p.description && (p.description.length < 110 || p.description.length > 170)) err(w, `description must be 110–170 characters (now ${p.description.length})`);
  const aw = md.wordCount(p.answer);
  if (p.answer && (aw < 25 || aw > 80)) err(w, `answer must be 25–80 words (now ${aw})`);
  if (p.keywords.length < 3 || p.keywords.length > 10) err(w, "keywords: give 3–10 comma-separated phrases");
  p.tools.forEach(t => { if (!famSlugs.has(t)) err(w, `tools: "${t}" is not a tool page slug (see /tools/)`); });
  if (!p.draft && p.date > today) warn(w, `scheduled for ${p.date} — it will publish automatically on that day`);
  if (p.draft) warn(w, "draft: true — not published");

  // body quality
  if (p.words < 700) err(w, `body is too short: ${p.words} words (minimum 700)`);
  if (p.words > 3500) warn(w, `body is very long: ${p.words} words`);
  const r = md.render(p.body, {});
  if (r.headings.length < 3) err(w, "needs at least 3 '## ' section headings");
  if (/^#\s/m.test(p.body)) err(w, "do not use a single '# ' heading in the body — the title is the H1");
  if (!r.faqs.length) err(w, "needs a '## FAQ' section with at least 2 '### question' entries");
  else if (r.faqs.length < 2) err(w, "FAQ needs at least 2 questions");
  const internal = r.links.filter(l => l.startsWith("/") || l.includes("malikdatacentre.store"));
  if (internal.length < 2) err(w, "needs at least 2 internal links, e.g. [Canva Pro](/tools/canva-pro/)");
  internal.forEach(l => {
    const u = l.replace(/^https?:\/\/(www\.)?malikdatacentre\.store/, "").split("#")[0];
    const tm = u.match(/^\/tools\/([^/]+)\/?$/);
    if (tm && !famSlugs.has(tm[1])) err(w, `link ${l} points to a tool page that does not exist`);
    if (u.startsWith("/") && !tm) {
      const f = path.join(ROOT, u.replace(/^\//, ""));
      const exists = u === "/" || fs.existsSync(f) || fs.existsSync(path.join(f, "index.html")) || fs.existsSync(f + ".html") ||
        (u.startsWith("/blog/") && posts.some(x => `/blog/${x.slug}.html` === u));
      if (!exists) err(w, `internal link ${l} does not exist`);
    }
  });
  BANNED.forEach(([re, why]) => { if (re.test(p.raw)) err(w, `contains ${why}`); });
  // Store prices: "Rs 1,234" must be a real catalog price
  (p.raw.match(/\bRs\.?\s?[\d,]+/g) || []).forEach(x => {
    const n = parseInt(x.replace(/[^\d]/g, ""), 10);
    if (!prices.has(n)) err(w, `"${x}" is not a price in index.js. Use "Rs" only for our store prices; write official prices as "PKR 1,400 (official)" or "$20 (official)"`);
  });
  // duplicates
  if (p.slug) { if (seenSlug.has(p.slug)) err(w, `duplicate slug (also in ${seenSlug.get(p.slug)})`); seenSlug.set(p.slug, p.file); }
  if (p.slug && legacy.has(p.slug + ".html") && !fs.readFileSync(path.join(ROOT, "blog", p.slug + ".html"), "utf8").includes("BlogPosting")) err(w, "slug clashes with an existing hand-written blog page");
  const nt = p.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (nt) { if (seenTitle.has(nt)) err(w, `same title as ${seenTitle.get(nt)}`); seenTitle.set(nt, p.file); }
  if (!p.draft && p.date) { perDay[p.date] = (perDay[p.date] || 0) + 1; }
});
Object.entries(perDay).forEach(([d, n]) => { if (n > 2) err("site-content/blog", `${n} posts dated ${d} — maximum is 2 per day`); });

/* ---------------- report ---------------- */
console.log(`Checked ${tools ? tools.list.length : 0} catalog items and ${posts.length} blog posts.`);
warnings.forEach(x => console.log(x));
if (errors.length) {
  errors.forEach(x => console.log(x));
  console.log(`\nFAILED: ${errors.length} error(s). Fix them and commit again.`);
  process.exit(1);
}
console.log("OK: no errors.");
