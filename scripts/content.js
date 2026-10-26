/* Shared loaders for build-pages.js and scripts/validate.js */
"use strict";
const fs = require("fs");
const path = require("path");
const md = require("./markdown.js");

const ROOT = path.join(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "site-content", "blog");

function loadTools() {
  const src = fs.readFileSync(path.join(ROOT, "index.js"), "utf8");
  const start = src.indexOf("const TOOLS_DATABASE");
  const end = src.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error("TOOLS_DATABASE not found in index.js");
  const code = src.slice(start, end + 3).replace("const TOOLS_DATABASE", "module.exports");
  const m = { exports: null };
  new Function("module", code)(m);
  const byId = {};
  m.exports.forEach(t => { byId[t.id] = t; });
  return { list: m.exports, byId };
}

const list = v => (Array.isArray(v) ? v : String(v || "").replace(/^\[|\]$/g, "").split(",")).map(s => s.trim()).filter(Boolean);

/** Loads every site-content/blog/*.md file. Does not filter drafts/future posts. */
function loadPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".md") && !f.startsWith("_")).sort().map(file => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, body, hasFrontMatter } = md.parseFrontMatter(raw);
    const words = md.wordCount(body);
    return {
      file, raw, body, hasFrontMatter, data,
      slug: data.slug || "",
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      updated: data.updated || data.date || "",
      category: data.category || "Guides",
      icon: data.icon || "fa-solid fa-newspaper",
      keywords: list(data.keywords),
      tools: list(data.tools),
      answer: data.answer || "",
      draft: data.draft === true,
      words,
      readMin: Math.max(2, Math.round(words / 200))
    };
  });
}

function isPublished(p, today) {
  return !p.draft && p.date && p.date <= today;
}

module.exports = { ROOT, BLOG_DIR, loadTools, loadPosts, isPublished, md };
