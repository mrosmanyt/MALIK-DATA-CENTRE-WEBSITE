// Builds data/seed.json: the ORIGINAL content of the website, read from the HTML with the same
// reader the live site uses (assets/js/cms.js → MDC_CMS.extract). Every admin editor starts from it,
// and "Restore original" goes back to it.
//
// Run after changing the HTML or running build-pages.js:
//   node scripts/cms-seed.js            (needs: npm i -g playwright  or a local playwright install)
// It starts a tiny local web server, opens the homepage in headless Chromium and reads it.
const fs = require("fs"), path = require("path"), http = require("http");
const ROOT = path.join(__dirname, "..");
const SITE = "https://www.malikdatacentre.store";
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { console.error("Install Playwright first: npm i playwright"); process.exit(1); }

const TYPES = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, r) => {
      let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
    }).listen(0, () => res(srv));
  });
}
const pick = (html, re) => { const m = html.match(re); return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim() : ""; };

(async () => {
  const srv = await serve(), port = srv.address().port;
  const b = await chromium.launch(), page = await b.newPage();
  await page.route(/googletagmanager|translate\.google|fonts\.g|cdnjs|jsdelivr/, r => r.abort());
  await page.goto(`http://localhost:${port}/index.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.MDC_CMS && typeof TOOLS_DATABASE !== "undefined");
  const home = await page.evaluate(() => {
    const out = MDC_CMS.extract();
    const label = id => (typeof getCategoryLabel === "function" ? getCategoryLabel(id) : id);
    out.tools = {
      categories: [...new Set(TOOLS_DATABASE.map(t => t.category))].map(id => ({ id, label: label(id) })),
      items: TOOLS_DATABASE.map(t => ({ id: t.id, name: t.name, category: t.category, duration: t.duration, price: t.price, originalPrice: t.originalPrice, setup: t.setup,
        desc: t.desc, specs: t.specs.join("\n"), stock: "in", ribbon: BESTSELLER_IDS.includes(t.id) ? "bestseller" : POPULAR_IDS.includes(t.id) ? "popular" : "", badge: "", image: "" }))
    };
    out.coupons = { items: [...document.querySelectorAll(".mdc-coupon-chip")].map(c => c.getAttribute("data-code")).filter(Boolean).map(code => ({ code, percent: { MALIK10: 10, WAIT5: 5 }[code] || 10, active: true, chip: true, expires: "", note: "" })) };
    if (!out.coupons.items.length) out.coupons.items = [{ code: "MALIK10", percent: 10, active: true, chip: true, expires: "", note: "" }, { code: "WAIT5", percent: 5, active: true, chip: true, expires: "", note: "" }];
    return out;
  });
  await b.close(); srv.close();

  // every page: Google title + description (SEO editor) and page heading + intro (Pages editor)
  const seo = [], pages = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f), rel = "/" + path.relative(ROOT, full).replace(/\\/g, "/");
      if (/^\/(node_modules|admin|api|assets|data|design\/review|scripts|site-content|supabase|\.)/.test(rel)) continue;
      if (fs.statSync(full).isDirectory()) { walk(full); continue; }
      if (!f.endsWith(".html") || f === "404.html" || rel === "/admin.html") continue;
      const html = fs.readFileSync(full, "utf8"), url = rel.replace(/index\.html$/, "");
      if (/name="robots" content="noindex/i.test(html)) continue;
      seo.push({ path: url, title: pick(html, /<title>([^<]*)<\/title>/), description: pick(html, /<meta name="description" content="([^"]*)"/), image: "" });
      const h1 = pick(html, /<section class="pg-hero">[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/), lead = pick(html, /<section class="pg-hero">[\s\S]*?<p class="pg-lead">([\s\S]*?)<\/p>/);
      if (h1) pages.push({ path: url, heading: h1.replace(/<[^>]+>/g, ""), intro: lead.replace(/<[^>]+>/g, "") });
    }
  }
  walk(ROOT);
  seo.sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)));
  pages.sort((a, b) => a.path.localeCompare(b.path));

  const seed = Object.assign({}, home, {
    contact: Object.assign({ orderWhatsapp: "923489057646", supportWhatsapp: "923445739206", channel: "https://whatsapp.com/channel/0029Vb8Hycp3gvWclMCHv02Z", community: "https://chat.whatsapp.com/FA4CLYGdoZn1PXhENEAMGJ",
      youtube: "https://www.youtube.com/@MalikDataCentre0", facebook: "https://www.facebook.com/people/Malik-Data-Centre-Pro/61566733492225/", x: "https://x.com/realmickeyai" }, home.contact || {}),
    announcement: { on: false, text: "", link: "", linkText: "Shop now", bg: "#111827", color: "#ffffff", start: "", end: "", dismissible: true },
    popup: { on: false, image: "", title: "", text: "", link: "", buttonText: "See offer", pages: "home", frequency: "day", delay: 5, start: "", end: "" },
    extras: { toasts: true, counter: true, countdown: true },
    seo: { items: seo }, pages: { items: pages }, blog: { posts: [] }
  });
  seed.hero = Object.assign({ image: "" }, seed.hero);
  seed._generated = new Date().toISOString();
  fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "data", "seed.json"), JSON.stringify(seed, null, 1));
  console.log("data/seed.json written:", Object.keys(seed).join(", "), `| ${seed.tools.items.length} tools, ${seo.length} pages`);
})();
