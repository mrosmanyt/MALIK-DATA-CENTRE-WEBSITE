/* ==========================================================================
   MALIK DATA CENTRE — tiny, safe Markdown → HTML converter (no dependencies)
   Supports: front matter, ## / ### headings, paragraphs, - lists, 1. lists,
   > quotes, | tables |, **bold**, *italic*, `code`, [links](url).
   Raw HTML is NOT allowed: everything is escaped (prevents script injection).
   ========================================================================== */
"use strict";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function parseFrontMatter(src) {
  const text = src.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text, hasFrontMatter: false };
  const data = {};
  m[1].split("\n").forEach(line => {
    const mm = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!mm) return;
    let v = mm[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v === "true") v = true; else if (v === "false") v = false;
    data[mm[1].toLowerCase()] = v;
  });
  return { data, body: m[2], hasFrontMatter: true };
}

const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

function inline(s, opts) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, url) => {
    const u = url.replace(/&amp;/g, "&");
    if (!/^(https?:\/\/|\/|#|mailto:)/.test(u)) return t; // drop unsafe links (javascript: etc.)
    const internal = u.startsWith("/") || u.startsWith("#") || u.includes("malikdatacentre.store");
    let href = u;
    if (internal && u.startsWith("/") && opts && opts.rel != null) href = opts.rel + u.replace(/^\//, "");
    if (opts && opts.links) opts.links.push(u);
    return `<a href="${esc(href)}"${internal ? "" : ' target="_blank" rel="noopener nofollow"'}>${t}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return out;
}

/** Convert markdown body. Returns { html, headings:[{id,text}], faqs:[[q,a]], text, links } */
function render(md, opts = {}) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const headings = [];
  const faqs = [];
  const links = [];
  const o = { rel: opts.rel, links };
  let i = 0;
  let inFaq = false;
  let faqQ = null, faqA = [];
  const flushFaq = () => { if (faqQ) faqs.push([faqQ, faqA.join(" ").trim()]); faqQ = null; faqA = []; };
  const plain = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "");

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    let m;
    if ((m = line.match(/^##\s+(.+)$/)) && !line.startsWith("###")) {
      flushFaq();
      const t = m[1].trim();
      inFaq = /^(faq|faqs|frequently asked questions)\b/i.test(t);
      const id = slugify(t);
      headings.push({ id, text: plain(t) });
      html.push(`<h2 id="${id}">${inline(t, o)}</h2>`);
      i++; continue;
    }
    if ((m = line.match(/^###\s+(.+)$/))) {
      if (inFaq) { flushFaq(); faqQ = plain(m[1].trim()); }
      html.push(`<h3>${inline(m[1].trim(), o)}</h3>`);
      i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      html.push(`<ul>${items.map(x => `<li>${inline(x, o)}</li>`).join("")}</ul>`);
      if (faqQ) faqA.push(items.map(plain).join("; "));
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      html.push(`<ol>${items.map(x => `<li>${inline(x, o)}</li>`).join("")}</ol>`);
      if (faqQ) faqA.push(items.map(plain).join("; "));
      continue;
    }
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      html.push(`<blockquote>${inline(q.join(" "), o)}</blockquote>`);
      continue;
    }
    if (/^\|.*\|\s*$/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = r => r.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const body = rows.filter(r => !/^\|[\s:|-]+\|\s*$/.test(r));
      const head = cells(body[0] || "");
      html.push(`<div class="article-table-wrap"><table class="article-table"><thead><tr>${head.map(c => `<th>${inline(c, o)}</th>`).join("")}</tr></thead><tbody>${body.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${inline(c, o)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    // paragraph
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\s*[-*]\s+|\s*\d+[.)]\s+|>|\|)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
    if (!para.length) { para.push(line.replace(/^#+\s*/, "")); i++; }
    const p = para.join(" ");
    html.push(`<p>${inline(p, o)}</p>`);
    if (faqQ) faqA.push(plain(p));
  }
  flushFaq();
  const text = md.replace(/[#>*`|_-]/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return { html: html.join("\n"), headings, faqs, text, links };
}

const wordCount = s => (String(s).match(/[A-Za-z0-9؀-ۿ']+/g) || []).length;

module.exports = { parseFrontMatter, render, slugify, wordCount, esc };
