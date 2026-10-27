// ============================================================================
// MALIK DATA CENTRE: the ONE serverless function behind every /api/* route.
// vercel.json rewrites /api/:path* → /api/router?__path=:path* so we stay inside
// the Hobby plan function limit. Helpers live in api/_lib/.
//
//   Public:  content.js · track · forms · ai · yt · blogpage/<slug> · sitemap-cms.xml
//   Admin:   admin/... (signed cookie session + role permission + CSRF header)
// ============================================================================
const crypto = require("crypto");
const { redis, pipe, getJSON, setJSON, parse, pairs, configured: dbReady } = require("./_lib/redis");
const H = require("./_lib/http");
const A = require("./_lib/auth");
const SB = require("./_lib/supabase");
const aiHandler = require("./_lib/ai");
const ytHandler = require("./_lib/yt");
let SEED = {}; try { SEED = require("../data/seed.json"); } catch (e) { SEED = {}; }
let SHELL = ""; try { SHELL = require("fs").readFileSync(require("path").join(__dirname, "../data/page-shell.html"), "utf8"); } catch (e) { SHELL = ""; }

const SITE = "https://www.malikdatacentre.store";
const DAY = 86400;

/* ---------------- which content sections exist, and who may edit them ---------------- */
const SECTIONS = {
  contact: "settings.manage", payments: "settings.manage",
  announcement: "content.edit", popup: "content.edit", extras: "content.edit", pages: "content.edit",
  hero: "content.edit", how: "content.edit", why: "content.edit", services: "content.edit", videos: "content.edit",
  reviews: "content.edit", refund: "content.edit", faq: "content.edit", referral: "content.edit",
  seo: "seo.edit", tools: "tools.edit", coupons: "coupons.edit", blog: "blog.edit"
};
const MAX_SECTION = { blog: 1500000, reviews: 400000, tools: 400000 };

/* ---------------- small helpers ---------------- */
// fixed-window rate limit: true when this IP/user did more than `max` calls in the window
async function limit(key, max, seconds) {
  const k = key + ":" + Math.floor(Date.now() / (seconds * 1000));
  const [n] = await pipe([["INCR", k], ["EXPIRE", k, seconds]]);
  return n > max;
}
async function log(user, action, detail) {
  try { await pipe([["LPUSH", "log", JSON.stringify({ t: Date.now(), u: user ? user.u : "-", a: action, d: String(detail || "").slice(0, 300) })], ["LTRIM", "log", 0, 1999]]); } catch (e) {}
}
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// CSV cell safe for Excel (no formula injection)
function csvCell(v) {
  let s = String(v == null ? "" : v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}
function fail(res, status, message) { return H.json(res, status, { error: message }); }

/* ======================================================================
   PUBLIC ROUTES
   ====================================================================== */
async function publishedContent() {
  const pub = pairs(await redis("HGETALL", "cms:pub"));
  const out = {};
  for (const k in pub) {
    const v = parse(pub[k]); if (!v) continue;
    if (k === "blog") out.blog = { posts: (v.posts || []).filter(p => p.published !== false && p.slug).map(p => ({ title: p.title, slug: p.slug, date: p.date, description: p.description, cover: p.cover, category: p.category || "Guide" })) };
    else out[k] = v;
  }
  return out;
}
async function contentJS(req, res) {
  let data = null;
  try { if (dbReady()) data = await publishedContent(); } catch (e) { data = null; }
  if (data && !Object.keys(data).length) data = null;   // nothing published: the site stays exactly as built
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=20, stale-while-revalidate=120");
  // JSON is valid JS; "<" is escaped so content can never close a <script> tag
  res.end("window.SITE_CMS=" + JSON.stringify(data).replace(/</g, "\\u003c") + ";");
}

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|curl|wget|python|monitor/i;
async function track(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const ua = String(req.headers["user-agent"] || "");
  if (!dbReady() || BOT.test(ua)) return H.json(res, 200, { ok: true });
  const b = await H.body(req);
  let p = H.clean(b.p, 120).split("?")[0].split("#")[0] || "/";
  if (!/^\/[\w\-./%]*$/.test(p)) p = "/other";
  p = p.replace(/index\.html$/, "");
  const ip = H.ip(req), day = H.today();
  if (await limit("rl:t:" + ip, 120, 60)) return H.json(res, 200, { ok: true });
  const salt = crypto.createHash("sha256").update(day + "|" + (process.env.SESSION_SECRET || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "salt")).digest("hex");
  const visitor = crypto.createHash("sha256").update(salt + "|" + ip + "|" + ua).digest("hex").slice(0, 24);
  const device = /ipad|tablet/i.test(ua) ? "Tablet" : /mobi|android|iphone/i.test(ua) ? "Phone" : "Computer";
  let ref = "";
  try { const r = new URL(String(b.r || "")); if (!/malikdatacentre\.(store|online)$/i.test(r.hostname)) ref = r.hostname.replace(/^www\./, "").slice(0, 60); } catch (e) {}
  const ttl = 400 * DAY, cmds = [["HINCRBY", "pv:" + day, p, 1], ["INCR", "pvt:" + day], ["PFADD", "uv:" + day, visitor], ["HINCRBY", "dev:" + day, device, 1],
    ["EXPIRE", "pv:" + day, ttl], ["EXPIRE", "pvt:" + day, ttl], ["EXPIRE", "uv:" + day, ttl], ["EXPIRE", "dev:" + day, ttl]];
  if (ref) cmds.push(["HINCRBY", "ref:" + day, ref, 1], ["EXPIRE", "ref:" + day, ttl]);
  await pipe(cmds);
  return H.json(res, 200, { ok: true });
}

const FORM_TYPES = { contact: "Contact message", "tool-request": "Tool request", service: "Service enquiry", "api-credits": "API credits quote", order: "Order", other: "Other" };
async function forms(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return fail(res, 405, "Use POST");
  if (!dbReady()) return fail(res, 503, "Not available");
  const b = await H.body(req);
  if (b.website || b.hp) return H.json(res, 200, { ok: true }); // honeypot: bots fill hidden fields
  const ip = H.ip(req);
  if (await limit("rl:f:" + ip, 8, 600)) return fail(res, 429, "Too many messages. Please wait a few minutes or message us on WhatsApp.");
  const lead = {
    id: H.id(8), ts: Date.now(), type: FORM_TYPES[b.type] ? b.type : "other",
    page: H.clean(b.page, 160), name: H.clean(b.name, 80), phone: H.clean(b.phone, 40).replace(/[^\d+\s()-]/g, ""), email: H.clean(b.email, 120),
    message: H.clean(b.message, 2000), fields: {}, status: "new", notes: [], followUp: "", assigned: "", history: []
  };
  if (b.fields && typeof b.fields === "object") Object.keys(b.fields).slice(0, 15).forEach(k => { const key = H.clean(k, 40); if (key) lead.fields[key] = H.clean(b.fields[k], 400); });
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) lead.email = "";
  if (!lead.message && !lead.phone && !lead.name && !Object.keys(lead.fields).length) return fail(res, 400, "Please fill in the form.");
  await pipe([["SET", "lead:" + lead.id, JSON.stringify(lead)], ["ZADD", "leads:z", lead.ts, lead.id]]);
  alertNewLead(lead).catch(() => {});
  return H.json(res, 200, { ok: true });
}
async function alertNewLead(lead, force) {
  const s = await getJSON("settings", {});
  if (!s.alerts || (!s.alerts.on && !force) || !process.env.RESEND_API_KEY) return;
  const to = (s.alerts.to || []).filter(x => /^\S+@\S+\.\S+$/.test(x)).slice(0, 10); if (!to.length) return;
  const rows = [["Type", FORM_TYPES[lead.type]], ["Name", lead.name], ["Phone / WhatsApp", lead.phone], ["Email", lead.email], ["Page", lead.page], ["Message", lead.message]]
    .concat(Object.entries(lead.fields)).filter(r => r[1]).map(([k, v]) => `<tr><td style="padding:6px 10px;color:#6b7280">${esc(k)}</td><td style="padding:6px 10px">${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("");
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.NOTIFY_FROM || "MALIK DATA CENTRE <onboarding@resend.dev>", to, subject: `New ${FORM_TYPES[lead.type]}${lead.name ? " from " + lead.name : ""}`,
      html: `<div style="font-family:Arial,sans-serif"><h2 style="margin:0 0 10px">New enquiry on malikdatacentre.store</h2><table style="border-collapse:collapse">${rows}</table><p><a href="${SITE}/admin.html#leads">Open the Enquiries inbox</a></p></div>` }) });
}

/* ---------------- CMS blog posts: real pages in the site design ---------------- */
function mdToHtml(md) {
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|\W)\*(.+?)\*(?=\W|$)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => /^(https?:\/\/|\/|#|mailto:)/i.test(u.replace(/&amp;/g, "&")) ? `<a href="${u}"${/^https?:/i.test(u) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${t}</a>` : t);
  const out = []; let list = null;
  String(md || "").replace(/\r/g, "").split("\n").forEach(line => {
    const l = line.trim();
    const li = l.match(/^[-*]\s+(.+)/), ol = l.match(/^\d+[.)]\s+(.+)/);
    if (li || ol) { const t = li ? "ul" : "ol"; if (!list || list.t !== t) { if (list) out.push(`</${list.t}>`); list = { t }; out.push(`<${t}>`); } out.push(`<li>${inline((li || ol)[1])}</li>`); return; }
    if (list) { out.push(`</${list.t}>`); list = null; }
    if (!l) return;
    const h = l.match(/^(#{2,3})\s+(.+)/);
    if (h) { const id = h[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); out.push(`<h${h[1].length} id="${id}">${inline(h[2])}</h${h[1].length}>`); return; }
    const img = l.match(/^!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)$/);
    if (img) { out.push(`<figure><img src="${esc(img[2])}" alt="${esc(img[1])}" loading="lazy"></figure>`); return; }
    if (l.startsWith(">")) { out.push(`<blockquote>${inline(l.replace(/^>\s?/, ""))}</blockquote>`); return; }
    out.push(`<p>${inline(l)}</p>`);
  });
  if (list) out.push(`</${list.t}>`);
  return out.join("\n");
}
async function blogPage(req, res, slug) {
  slug = String(slug || "").replace(/\/$/, "").toLowerCase();
  let post = null;
  try { const b = parse(await redis("HGET", "cms:pub", "blog")); post = b && (b.posts || []).find(p => p.slug === slug && p.published !== false); } catch (e) {}
  if (!post || !SHELL) {
    res.statusCode = 404; res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.end(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Not found</title><p style="font-family:sans-serif;padding:40px">This article was not found. <a href="/blog/">See all articles</a></p>`);
  }
  const url = `${SITE}/blog/p/${slug}/`;
  const date = post.date || "";
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description || "", datePublished: date, dateModified: post.updated || date, mainEntityOfPage: url,
    image: post.cover || `${SITE}/assets/logo.png`, author: { "@type": "Organization", name: "MALIK DATA CENTRE" }, publisher: { "@type": "Organization", name: "MALIK DATA CENTRE", logo: { "@type": "ImageObject", url: `${SITE}/assets/logo.png` } } };
  const body = `<div class="pg-wrap"><nav class="pg-crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <a href="/blog/">Blog</a> <span>/</span> <span>${esc(post.title)}</span></nav>
  <article class="article">
    <header class="pg-hero"><p class="pg-eyebrow">${esc(post.category || "Guide")}${date ? " · " + esc(date) : ""}</p><h1>${esc(post.title)}</h1>${post.description ? `<p class="pg-lead">${esc(post.description)}</p>` : ""}</header>
    ${post.cover ? `<figure class="article-cover"><img src="${esc(post.cover)}" alt="${esc(post.title)}" style="width:100%;border-radius:16px"></figure>` : ""}
    <div class="article-body">${mdToHtml(post.body)}</div>
    <div class="pg-cta" style="margin:30px 0"><h2>Need help choosing?</h2><p>Ask our team on WhatsApp. We reply with the right plan for your budget.</p>
      <div class="pg-cta-btns"><a class="btn btn-success" target="_blank" rel="noopener noreferrer" href="https://wa.me/923489057646?text=${encodeURIComponent(`Hello MALIK DATA CENTRE! I read "${post.title}" and need help.`)}"><i class="fa-brands fa-whatsapp"></i> Ask on WhatsApp</a><a class="btn btn-outline" href="/tools/">Browse all tools</a></div></div>
  </article></div>`;
  const title = `${post.seoTitle || post.title} | MALIK DATA CENTRE`, desc = post.description || "";
  const html = SHELL.split("__CMS_TITLE__").join(esc(title)).split("__CMS_DESC__").join(esc(desc)).split("__CMS_URL__").join(esc(url))
    .split("__CMS_IMAGE__").join(esc(post.cover || `${SITE}/assets/logo.png`))
    .replace("<!--CMS_JSONLD-->", `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`)
    .replace("<!--CMS_BODY-->", body);
  res.statusCode = 200; res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  res.end(html);
}
async function sitemapCMS(req, res) {
  let posts = [];
  try { const b = parse(await redis("HGET", "cms:pub", "blog")); posts = ((b && b.posts) || []).filter(p => p.slug && p.published !== false); } catch (e) {}
  res.statusCode = 200; res.setHeader("Content-Type", "application/xml; charset=utf-8"); res.setHeader("Cache-Control", "public, s-maxage=600");
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${posts.map(p => `  <url><loc>${SITE}/blog/p/${esc(p.slug)}/</loc>${p.updated || p.date ? `<lastmod>${esc(p.updated || p.date)}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`);
}

/* ======================================================================
   ADMIN ROUTES
   ====================================================================== */
async function adminRoute(req, res, parts) {
  H.noStore(res);
  if (!dbReady()) return fail(res, 503, "The database is not connected yet. Follow ADMIN-SETUP.md step 1 (Upstash Redis).");
  const method = req.method, write = method !== "GET" && method !== "HEAD";
  if (write && req.headers["x-mdc-admin"] !== "1") return fail(res, 403, "Blocked (missing security header).");
  const [area, sub, sub2] = parts;

  /* ---------- sign in / out ---------- */
  if (area === "auth" && sub === "login" && method === "POST") return login(req, res);
  const me = await A.current(req);
  if (!me) return fail(res, 401, "Please sign in.");
  if (area === "auth" && sub === "me") return H.json(res, 200, { user: A.publicUser(me), roles: A.ROLE_NAMES, staff: (await A.allUsers()).filter(u => !u.disabled).map(u => ({ u: u.u, name: u.name || u.u })), services: { supabase: SB.configured(), blob: !!process.env.BLOB_READ_WRITE_TOKEN, email: !!process.env.RESEND_API_KEY } });
  if (area === "auth" && sub === "logout") { A.endSession(res); await log(me, "Signed out"); return H.json(res, 200, { ok: true }); }
  if (area === "auth" && sub === "password" && method === "POST") {
    const b = await H.body(req);
    if (!A.checkPassword(b.current, me)) return fail(res, 400, "Your current password is wrong.");
    const prob = A.passwordProblem(b.next); if (prob) return fail(res, 400, prob);
    if (b.next === process.env.ADMIN_PASSWORD) return fail(res, 400, "Choose a password that is different from the setup password.");
    Object.assign(me, A.hashPassword(b.next), { mustChange: false, v: (me.v || 1) + 1 });
    await A.saveUser(me); A.startSession(res, me); await log(me, "Changed password");
    return H.json(res, 200, { ok: true });
  }
  if (me.mustChange) return fail(res, 403, "Please set a new password first.");
  if (area === "auth" && sub === "logout-all" && method === "POST") {
    me.v = (me.v || 1) + 1; await A.saveUser(me); A.endSession(res); await log(me, "Signed out everywhere"); return H.json(res, 200, { ok: true });
  }
  const need = perm => { if (!A.can(me, perm)) { fail(res, 403, "Your role is not allowed to do this."); return false; } return true; };

  /* ---------- dashboard ---------- */
  if (area === "dashboard") { if (!need("dashboard")) return; return H.json(res, 200, await dashboard(me, +(req.query && req.query.days) || 30)); }

  /* ---------- enquiries / leads ---------- */
  if (area === "leads") {
    if (method === "GET" && sub === "export") { if (!need("leads.export")) return; return exportLeads(req, res, me); }
    if (method === "GET") { if (!need("leads.view")) return; return H.json(res, 200, { leads: await allLeads(), types: FORM_TYPES }); }
    const lead = sub && parse(await redis("GET", "lead:" + sub));
    if (!lead) return fail(res, 404, "Enquiry not found.");
    if (method === "DELETE") { if (!need("leads.delete")) return; await pipe([["DEL", "lead:" + sub], ["ZREM", "leads:z", sub]]); await log(me, "Deleted enquiry", lead.name || lead.phone || sub); return H.json(res, 200, { ok: true }); }
    if (method === "PATCH") {
      if (!need("leads.edit")) return;
      const b = await H.body(req), changes = [];
      if (b.status && ["new", "contacted", "payment", "won", "lost"].includes(b.status) && b.status !== lead.status) { changes.push(`status ${lead.status} → ${b.status}`); lead.status = b.status; }
      if (b.followUp !== undefined) { lead.followUp = /^\d{4}-\d{2}-\d{2}$/.test(b.followUp) ? b.followUp : ""; changes.push("follow-up " + (lead.followUp || "cleared")); }
      if (b.assigned !== undefined) { lead.assigned = H.clean(b.assigned, 40).toLowerCase(); changes.push("assigned to " + (lead.assigned || "nobody")); }
      if (b.note) { lead.notes.push({ t: Date.now(), u: me.u, text: H.clean(b.note, 1000) }); changes.push("note added"); }
      lead.history = (lead.history || []).concat(changes.map(c => ({ t: Date.now(), u: me.u, c }))).slice(-50);
      await redis("SET", "lead:" + sub, JSON.stringify(lead)); await log(me, "Updated enquiry", (lead.name || lead.phone) + ": " + changes.join(", "));
      return H.json(res, 200, { lead });
    }
  }

  /* ---------- store orders + product prices (Supabase, server-side key) ---------- */
  if (area === "orders" || area === "products") {
    if (!SB.configured()) return fail(res, 503, "Orders are not connected yet. Add SUPABASE_SERVICE_ROLE_KEY in Vercel (see ADMIN-SETUP.md).");
    try {
      if (area === "orders" && method === "GET") { if (!need("orders.view")) return; return H.json(res, 200, { orders: await SB.sb("/rest/v1/orders?select=*&order=created_at.desc&limit=2000") }); }
      if (area === "orders" && method === "PATCH") {
        if (!need("orders.edit")) return;
        const b = await H.body(req); if (!["pending", "paid", "completed", "rejected"].includes(b.status)) return fail(res, 400, "Unknown status");
        const r = await SB.sb(`/rest/v1/orders?id=eq.${encodeURIComponent(sub)}`, { method: "PATCH", body: { status: b.status }, prefer: "return=representation" });
        await log(me, "Order status", `#${(r[0] && r[0].order_no) || sub} → ${b.status}`); return H.json(res, 200, { order: r[0] || null });
      }
      if (area === "products" && method === "GET") { if (!need("orders.view")) return; return H.json(res, 200, { products: await SB.sb("/rest/v1/products?select=*&order=sort_order.asc") }); }
      if (area === "products" && method === "PATCH") {
        if (!need("tools.edit")) return;
        const b = await H.body(req), price = Math.round(Number(b.price)); if (!(price >= 0 && price < 10000000)) return fail(res, 400, "Enter a valid price");
        const r = await SB.sb(`/rest/v1/products?id=eq.${encodeURIComponent(sub)}`, { method: "PATCH", body: { price }, prefer: "return=representation" });
        await log(me, "Database price", `${(r[0] && (r[0].name || r[0].id)) || sub} → ${price}`); return H.json(res, 200, { product: r[0] || null });
      }
    } catch (e) { return fail(res, 502, e.message); }
  }

  /* ---------- Postly Pro activations ---------- */
  if (area === "pro") {
    if (!need("pro.manage")) return;
    if (!SB.configured()) return fail(res, 503, "Add SUPABASE_SERVICE_ROLE_KEY in Vercel to manage Postly Pro.");
    try {
      if (method === "GET") {
        const [reqs, pros] = await Promise.all([SB.sb("/rest/v1/postly_pro_requests?select=*&order=created_at.desc&limit=200"), SB.sb("/rest/v1/postly_profiles?select=email,plan,pro_until&plan=eq.pro&order=pro_until.desc&limit=500")]);
        return H.json(res, 200, { requests: reqs, pros });
      }
      if (method === "POST" && sub === "activate") {
        const b = await H.body(req), days = Math.max(1, Math.min(800, parseInt(b.days, 10) || 30)), email = H.clean(b.email, 160);
        if (!/^\S+@\S+\.\S+$/.test(email)) return fail(res, 400, "Enter the customer's account email.");
        const msg = await SB.sb("/rest/v1/rpc/postly_activate_pro", { method: "POST", body: { user_email: email, days } });
        await log(me, "Postly Pro", `${email} +${days} days: ${msg}`); return H.json(res, 200, { message: msg });
      }
    } catch (e) { return fail(res, 502, /postly_|PGRST20/.test(e.message) ? "Postly tables are not set up yet (run supabase/postly-setup.sql)." : e.message); }
  }

  /* ---------- content: draft → publish → restore original ---------- */
  if (area === "content") {
    if (method === "GET") {
      if (!need("content.view")) return;
      const [d, p, m] = await pipe([["HGETALL", "cms:draft"], ["HGETALL", "cms:pub"], ["HGETALL", "cms:meta"]]);
      const map = o => { const x = pairs(o); for (const k in x) x[k] = parse(x[k]); return x; };
      return H.json(res, 200, { draft: map(d), pub: map(p), meta: map(m), seed: SEED, sections: SECTIONS });
    }
    const key = sub;
    if (!SECTIONS[key]) return fail(res, 404, "Unknown section");
    if (!need(SECTIONS[key])) return;
    const meta = parse(await redis("HGET", "cms:meta", key), {}) || {};
    if (method === "PUT" && !sub2) {
      const b = await H.body(req), str = JSON.stringify(b.value);
      if (!b.value || typeof b.value !== "object") return fail(res, 400, "Nothing to save");
      if (str.length > (MAX_SECTION[key] || 200000)) return fail(res, 413, "This section is too large. Remove some items or use shorter text.");
      Object.assign(meta, { draftAt: Date.now(), draftBy: me.u });
      await pipe([["HSET", "cms:draft", key, str], ["HSET", "cms:meta", key, JSON.stringify(meta)]]);
      await log(me, "Saved draft", key); return H.json(res, 200, { meta });
    }
    // publishing needs "content.publish", except sections owned by their own permission (prices, coupons, blog, SEO, contact)
    const canPublish = A.can(me, "content.publish") || ["tools.edit", "coupons.edit", "blog.edit", "seo.edit", "settings.manage"].includes(SECTIONS[key]);
    if (method === "POST" && (sub2 === "publish" || sub2 === "restore") && !canPublish) return fail(res, 403, "Your role is not allowed to publish.");
    if (method === "POST" && sub2 === "publish") {
      const draft = await redis("HGET", "cms:draft", key);
      if (!draft) return fail(res, 400, "Save a draft first.");
      Object.assign(meta, { pubAt: Date.now(), pubBy: me.u });
      await pipe([["HSET", "cms:pub", key, draft], ["HSET", "cms:meta", key, JSON.stringify(meta)]]);
      await log(me, "Published", key); return H.json(res, 200, { meta });
    }
    if (method === "POST" && sub2 === "discard") {
      const pub = await redis("HGET", "cms:pub", key);
      await (pub ? redis("HSET", "cms:draft", key, pub) : redis("HDEL", "cms:draft", key));
      delete meta.draftAt; await redis("HSET", "cms:meta", key, JSON.stringify(meta));
      await log(me, "Discarded draft", key); return H.json(res, 200, { meta });
    }
    if (method === "POST" && sub2 === "restore") {
      await pipe([["HDEL", "cms:pub", key], ["HDEL", "cms:draft", key], ["HDEL", "cms:meta", key]]);
      await log(me, "Restored original", key); return H.json(res, 200, { ok: true });
    }
  }

  /* ---------- photo uploads (Vercel Blob) ---------- */
  if (area === "upload" && method === "POST") {
    if (!need("uploads")) return;
    if (!process.env.BLOB_READ_WRITE_TOKEN) return fail(res, 503, "Photo uploads are not connected yet (create a Blob store in Vercel → Storage).");
    if (await limit("rl:u:" + me.u, 60, 3600)) return fail(res, 429, "Too many uploads. Try again in an hour.");
    const b = await H.body(req), m = String(b.data || "").match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
    if (!m) return fail(res, 400, "Only JPG, PNG, WebP or GIF images can be uploaded.");
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > 3 * 1024 * 1024) return fail(res, 413, "The photo is too large (max 3 MB after compression).");
    // check the real file signature, not just the name
    const sig = buf.slice(0, 12).toString("hex");
    const okSig = { "image/jpeg": /^ffd8ff/, "image/png": /^89504e47/, "image/gif": /^47494638/, "image/webp": /^52494646.{8}57454250/ }[m[1]];
    if (!okSig.test(sig)) return fail(res, 400, "That file is not a real image.");
    const ext = m[1].split("/")[1].replace("jpeg", "jpg"), name = (H.clean(b.name, 60).toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo");
    const { put } = require("@vercel/blob");
    const blob = await put(`cms/${H.today()}/${name}.${ext}`, buf, { access: "public", contentType: m[1], addRandomSuffix: true, token: process.env.BLOB_READ_WRITE_TOKEN });
    await pipe([["LPUSH", "media", JSON.stringify({ url: blob.url, t: Date.now(), u: me.u, name, size: buf.length })], ["LTRIM", "media", 0, 499]]);
    await log(me, "Uploaded photo", name); return H.json(res, 200, { url: blob.url });
  }
  if (area === "media" && method === "GET") { if (!need("content.view")) return; return H.json(res, 200, { media: (await redis("LRANGE", "media", 0, 199)).map(s => parse(s)).filter(Boolean) }); }

  /* ---------- staff & roles ---------- */
  if (area === "users") {
    if (!need("users.manage")) return;
    const isOwner = me.role === "owner";
    if (method === "GET") return H.json(res, 200, { users: (await A.allUsers()).map(A.publicUser), roles: A.ROLE_NAMES, perms: A.PERMS });
    const b = await H.body(req);
    if (method === "POST") {
      const u = H.clean(b.u, 30).toLowerCase();
      if (!/^[a-z0-9._-]{3,30}$/.test(u)) return fail(res, 400, "Username: 3–30 letters, numbers, dots or dashes.");
      if (await A.getUser(u)) return fail(res, 400, "That username is taken.");
      if (!A.PERMS[b.role] || (b.role === "owner" && !isOwner)) return fail(res, 400, "Choose a role.");
      const prob = A.passwordProblem(b.password); if (prob) return fail(res, 400, "Temporary password: " + prob);
      await A.saveUser(Object.assign({ u, name: H.clean(b.name, 60) || u, role: b.role, v: 1, mustChange: true, created: Date.now() }, A.hashPassword(b.password)));
      await log(me, "Added staff", `${u} (${b.role})`); return H.json(res, 200, { ok: true });
    }
    const target = await A.getUser(sub);
    if (!target) return fail(res, 404, "User not found.");
    if (target.role === "owner" && !isOwner) return fail(res, 403, "Only an Owner can change an Owner.");
    const owners = (await A.allUsers()).filter(x => x.role === "owner" && !x.disabled);
    if (method === "DELETE") {
      if (target.u === me.u) return fail(res, 400, "You can't delete yourself.");
      if (target.role === "owner" && owners.length < 2) return fail(res, 400, "Keep at least one Owner.");
      await redis("HDEL", "users", target.u); await log(me, "Removed staff", target.u); return H.json(res, 200, { ok: true });
    }
    if (method === "PATCH") {
      const ch = [];
      if (b.name !== undefined) { target.name = H.clean(b.name, 60) || target.u; ch.push("name"); }
      if (b.role && b.role !== target.role) {
        if (!A.PERMS[b.role] || (b.role === "owner" && !isOwner)) return fail(res, 400, "Choose a role.");
        if (target.role === "owner" && owners.length < 2) return fail(res, 400, "Keep at least one Owner.");
        if (target.u === me.u) return fail(res, 400, "You can't change your own role.");
        target.role = b.role; target.v = (target.v || 1) + 1; ch.push("role " + b.role);
      }
      if (b.disabled !== undefined && !!b.disabled !== !!target.disabled) {
        if (target.u === me.u) return fail(res, 400, "You can't disable yourself.");
        if (b.disabled && target.role === "owner" && owners.length < 2) return fail(res, 400, "Keep at least one Owner.");
        target.disabled = !!b.disabled; target.v = (target.v || 1) + 1; ch.push(b.disabled ? "disabled" : "enabled");
      }
      if (b.password) { const prob = A.passwordProblem(b.password); if (prob) return fail(res, 400, prob); Object.assign(target, A.hashPassword(b.password), { mustChange: true, v: (target.v || 1) + 1 }); ch.push("password reset"); }
      if (b.signOut) { target.v = (target.v || 1) + 1; ch.push("signed out everywhere"); }
      await A.saveUser(target); await log(me, "Updated staff", `${target.u}: ${ch.join(", ")}`); return H.json(res, 200, { user: A.publicUser(target) });
    }
  }

  /* ---------- activity log ---------- */
  if (area === "activity") { if (!need("activity.view")) return; return H.json(res, 200, { log: (await redis("LRANGE", "log", 0, 499)).map(s => parse(s)).filter(Boolean) }); }

  /* ---------- settings (email alerts) ---------- */
  if (area === "settings") {
    if (method === "GET") { if (!need("dashboard")) return; return H.json(res, 200, { settings: await getJSON("settings", {}), email: !!process.env.RESEND_API_KEY, from: process.env.NOTIFY_FROM || "" }); }
    if (method === "PUT") {
      if (!need("settings.manage")) return;
      const b = await H.body(req), s = await getJSON("settings", {});
      if (b.alerts) s.alerts = { on: !!b.alerts.on, to: (Array.isArray(b.alerts.to) ? b.alerts.to : []).map(x => H.clean(x, 120)).filter(x => /^\S+@\S+\.\S+$/.test(x)).slice(0, 10) };
      await setJSON("settings", s); await log(me, "Changed settings", "email alerts " + (s.alerts && s.alerts.on ? "on" : "off")); return H.json(res, 200, { settings: s });
    }
    if (method === "POST" && sub === "test-email") {
      if (!need("settings.manage")) return;
      if (!process.env.RESEND_API_KEY) return fail(res, 400, "Add RESEND_API_KEY in Vercel first.");
      await alertNewLead({ type: "other", name: "Test", message: "This is a test alert from your admin panel.", fields: {}, phone: "", email: "", page: "/admin" }, true);
      return H.json(res, 200, { ok: true });
    }
  }

  /* ---------- backup & restore ---------- */
  if (area === "backup" && method === "GET") {
    if (!need("backup.download")) return;
    const [d, p, m] = await pipe([["HGETALL", "cms:draft"], ["HGETALL", "cms:pub"], ["HGETALL", "cms:meta"]]);
    const out = { kind: "mdc-cms-backup", version: 1, created: new Date().toISOString(), by: me.u, content: { draft: pairs(d), pub: pairs(p), meta: pairs(m) }, settings: await getJSON("settings", {}) };
    if (A.can(me, "leads.view")) out.leads = await allLeads();
    await log(me, "Downloaded backup");
    res.setHeader("Content-Disposition", `attachment; filename="mdc-backup-${H.today()}.json"`);
    return H.json(res, 200, out);
  }
  if (area === "restore" && method === "POST") {
    if (me.role !== "owner") return fail(res, 403, "Only an Owner can restore a backup.");
    const b = await H.body(req);
    if (!b || b.kind !== "mdc-cms-backup" || !b.content) return fail(res, 400, "This is not a backup file from this admin panel.");
    const cmds = [["DEL", "cms:draft"], ["DEL", "cms:pub"], ["DEL", "cms:meta"]];
    for (const h of ["draft", "pub", "meta"]) for (const k in (b.content[h] || {})) if (SECTIONS[k] && typeof b.content[h][k] === "string") cmds.push(["HSET", "cms:" + h, k, b.content[h][k]]);
    await pipe(cmds); await log(me, "Restored backup", b.created || ""); return H.json(res, 200, { ok: true, sections: cmds.length - 3 });
  }

  return fail(res, 404, "Not found");
}

async function login(req, res) {
  const b = await H.body(req), ip = H.ip(req), u = H.clean(b.u, 30).toLowerCase(), pw = String(b.p || "");
  if (await limit("rl:l:" + ip, 10, 900) || await limit("rl:lu:" + u, 20, 3600)) return fail(res, 429, "Too many tries. Wait 15 minutes and try again.");
  let user = await A.getUser(u);
  // first sign-in: "admin" + the ADMIN_PASSWORD from Vercel creates the first Owner
  // emergency recovery: ADMIN_RECOVERY=1 in Vercel lets "admin" + ADMIN_PASSWORD reset the admin Owner account
  const recovery = process.env.ADMIN_RECOVERY === "1" && u === "admin";
  if ((!user || recovery) && u === "admin" && process.env.ADMIN_PASSWORD && (recovery || Number(await redis("HLEN", "users")) === 0)) {
    const a = Buffer.from(crypto.createHash("sha256").update(pw).digest("hex")), c = Buffer.from(crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD).digest("hex"));
    if (crypto.timingSafeEqual(a, c)) {
      user = await A.saveUser(Object.assign({ u: "admin", name: (user && user.name) || "Owner", role: "owner", v: ((user && user.v) || 0) + 1, mustChange: true, created: (user && user.created) || Date.now() }, A.hashPassword(pw)));
      await log(user, recovery ? "Owner account recovered with ADMIN_PASSWORD" : "First sign-in (Owner account created)");
    }
  }
  if (!user || user.disabled || !A.checkPassword(pw, user)) { await log(null, "Failed sign-in", u + " from " + ip); return fail(res, 401, "Wrong username or password."); }
  user.lastLogin = Date.now(); await A.saveUser(user);
  A.startSession(res, user); await log(user, "Signed in");
  return H.json(res, 200, { user: A.publicUser(user) });
}

/* ---------------- leads helpers ---------------- */
async function allLeads() {
  const ids = await redis("ZREVRANGE", "leads:z", 0, 4999);
  const out = [];
  for (let i = 0; i < ids.length; i += 200) {
    const vals = await redis("MGET", ...ids.slice(i, i + 200).map(x => "lead:" + x));
    vals.forEach(v => { const l = parse(v); if (l) out.push(l); });
  }
  return out;
}
async function exportLeads(req, res, me) {
  const q = req.query || {}, from = q.from ? Date.parse(q.from) : 0, to = q.to ? Date.parse(q.to) + DAY * 1000 : Infinity;
  const list = (await allLeads()).filter(l => l.ts >= from && l.ts < to && (!q.type || l.type === q.type) && (!q.status || l.status === q.status));
  const extra = [...new Set(list.flatMap(l => Object.keys(l.fields || {})))];
  const head = ["Date", "Type", "Status", "Name", "Phone / WhatsApp", "Email", "Message", "Page", "Follow-up", "Assigned", "Notes", ...extra];
  const rows = list.map(l => [new Date(l.ts).toISOString().replace("T", " ").slice(0, 16), FORM_TYPES[l.type] || l.type, l.status, l.name, l.phone, l.email, l.message, l.page, l.followUp, l.assigned,
    (l.notes || []).map(n => `${n.u}: ${n.text}`).join(" | "), ...extra.map(k => (l.fields || {})[k] || "")]);
  await log(me, "Downloaded enquiries", list.length + " rows");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="enquiries-${H.today()}.csv"`);
  res.end("\uFEFF" + [head, ...rows].map(r => r.map(csvCell).join(",")).join("\r\n"));
}

/* ---------------- dashboard ---------------- */
async function dashboard(me, days) {
  days = Math.max(7, Math.min(90, days));
  const dates = []; for (let i = days - 1; i >= 0; i--) dates.push(H.today(new Date(Date.now() - i * DAY * 1000)));
  const cmds = [];
  dates.forEach(d => cmds.push(["GET", "pvt:" + d], ["PFCOUNT", "uv:" + d], ["HGETALL", "pv:" + d], ["HGETALL", "dev:" + d], ["HGETALL", "ref:" + d]));
  const r = await pipe(cmds);
  const views = [], visitors = [], pages = {}, devices = {}, refs = {};
  const add = (into, obj) => { const o = pairs(obj); for (const k in o) into[k] = (into[k] || 0) + Number(o[k]); };
  dates.forEach((d, i) => { views.push(Number(r[i * 5]) || 0); visitors.push(Number(r[i * 5 + 1]) || 0); add(pages, r[i * 5 + 2]); add(devices, r[i * 5 + 3]); add(refs, r[i * 5 + 4]); });
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const out = { dates, views, visitors, topPages: top(pages), devices: top(devices), referrers: top(refs), totals: { views: views.reduce((a, b) => a + b, 0), visitors: visitors.reduce((a, b) => a + b, 0) } };
  if (A.can(me, "leads.view")) {
    const leads = await allLeads(), start = Date.parse(dates[0]), td = H.today();
    out.leadsPerDay = dates.map(d => leads.filter(l => H.today(new Date(l.ts)) === d).length);
    out.pipeline = ["new", "contacted", "payment", "won", "lost"].map(s => [s, leads.filter(l => l.status === s).length]);
    out.followDue = leads.filter(l => l.followUp && l.followUp <= td && !["won", "lost"].includes(l.status)).map(l => ({ id: l.id, name: l.name, phone: l.phone, followUp: l.followUp, overdue: l.followUp < td })).slice(0, 30);
    out.newLeads = leads.filter(l => l.ts >= start).length;
  }
  if (A.can(me, "orders.view") && SB.configured()) {
    try {
      const since = new Date(Date.now() - days * DAY * 1000).toISOString();
      const orders = await SB.sb(`/rest/v1/orders?select=total,status,created_at&created_at=gte.${encodeURIComponent(since)}&limit=5000`);
      out.orders = { count: orders.length, pending: orders.filter(o => o.status === "pending").length, revenue: orders.filter(o => o.status === "completed").reduce((s, o) => s + (Number(o.total) || 0), 0) };
    } catch (e) { out.orders = { error: true }; }
  }
  return out;
}

/* ======================================================================
   ENTRY POINT
   ====================================================================== */
module.exports = async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (!req.query) req.query = Object.fromEntries(url.searchParams);
  let path = String(req.query.__path || url.searchParams.get("__path") || "").replace(/^\/+|\/+$/g, "");
  if (Array.isArray(req.query.__path)) path = req.query.__path.join("/");
  const parts = path.split("/").filter(Boolean);
  try {
    if (path === "content.js") return await contentJS(req, res);
    if (path === "track") return await track(req, res);
    if (path === "forms") return await forms(req, res);
    if (path === "ai") return await aiHandler(req, res);
    if (path === "yt") return await ytHandler(req, res);
    if (parts[0] === "blogpage") return await blogPage(req, res, parts[1]);
    if (path === "sitemap-cms.xml") return await sitemapCMS(req, res);
    if (parts[0] === "admin") return await adminRoute(req, res, parts.slice(1));
    return fail(res, 404, "Not found");
  } catch (e) {
    console.error(e);
    if (e.code === "NO_DB") return fail(res, 503, "The database is not connected yet.");
    if (!res.headersSent) return fail(res, 500, "Something went wrong. Please try again.");
  }
};
