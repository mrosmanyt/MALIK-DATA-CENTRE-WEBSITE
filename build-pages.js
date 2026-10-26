#!/usr/bin/env node
/* ==========================================================================
   MALIK DATA CENTRE — Static page generator
   --------------------------------------------------------------------------
   Run after changing prices in index.js or text in site-content/:
       node build-pages.js
   It (re)writes:
     tools/                     all tool guides + /tools/<slug>/ pages
     comparisons/               compare hub + compare pages
     about-us/ contact-us/ refund-policy/ delivery-policy/
     frequently-asked-questions/ social-media-services/
     ai-automation-services/ enterprise-ai-api-credits/
     tool-links.js              (catalog "Full details" links + tool finder data)
     sitemap.xml, llms.txt
     blog/<slug>.html           from site-content/blog/*.md (Markdown posts)
     blog/index.html, blog/feed.xml
     index.html                 (only the block between MDC:GUIDES markers)
   No npm packages needed. Node 16+.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SITE = "https://www.malikdatacentre.store";
const BRAND = "MALIK DATA CENTRE";
const WA1 = "923445739206";
const WA2 = "923489057646";
const EMAIL = "support@malikdatacentre.store";
const CHANNEL = "https://whatsapp.com/channel/0029Vb8Hycp3gvWclMCHv02Z";
const COMMUNITY = "https://chat.whatsapp.com/FA4CLYGdoZn1PXhENEAMGJ";
const SOCIAL = {
  youtube: "https://www.youtube.com/@MalikDataCentre0",
  facebook: "https://www.facebook.com/people/Malik-Data-Centre-Pro/61566733492225/",
  x: "https://x.com/realmickeyai"
};
const TODAY = new Date().toISOString().slice(0, 10);
const TODAY_HUMAN = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const CAT = {
  "ai-chat": "AI Chat & Assistants",
  "ai-coding": "AI Coding & Dev",
  "creative": "Design & Creative",
  "video-audio": "AI Video & Audio",
  "vpn-security": "Software, VPN & Security",
  "entertainment": "Entertainment & Learning"
};
const CAT_ICON = {
  "ai-chat": "fa-solid fa-comments", "ai-coding": "fa-solid fa-code", "creative": "fa-solid fa-palette",
  "video-audio": "fa-solid fa-film", "vpn-security": "fa-solid fa-shield-halved", "entertainment": "fa-solid fa-tv"
};

/* ---------- Load catalog + blog posts ---------- */
const CONTENTLIB = require("./scripts/content.js");
const MD = require("./scripts/markdown.js");
const loadTools = CONTENTLIB.loadTools;
const TOOLS = loadTools();
const FAMILIES = require("./site-content/families.js");
const CONTENT = require("./site-content/pages-content.js");
const FAM = {};
FAMILIES.forEach(f => { FAM[f.slug] = f; });
const POSTS = CONTENTLIB.loadPosts().filter(p => CONTENTLIB.isPublished(p, TODAY) && p.slug)
  .sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));

/* "Prices updated" date only changes when the catalog actually changes */
const STATE_FILE = path.join(ROOT, "site-content", ".build-state.json");
const PRICE_DATE = (() => {
  const hash = require("crypto").createHash("sha1").update(JSON.stringify(TOOLS.list.map(({ icon, ...r }) => r))).digest("hex");
  let st = {};
  try { st = JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch (e) {}
  if (st.catalogHash !== hash) { st = { catalogHash: hash, pricesDate: TODAY }; fs.writeFileSync(STATE_FILE, JSON.stringify(st, null, 2) + "\n"); }
  return st.pricesDate;
})();
const human = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const PRICE_HUMAN = human(PRICE_DATE);

/* ---------- helpers ---------- */
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rs = n => "Rs " + Number(n).toLocaleString("en-US");
// USD rate is read from index.js so the site's currency switcher and these pages always agree.
const USD_RATE = Number((fs.readFileSync(path.join(__dirname, "index.js"), "utf8").match(/USD:\s*([0-9.]+)/) || [])[1]) || 0.0036;
const usd = n => "$" + (Number(n) * USD_RATE).toFixed(2).replace(/\.00$/, "");
const both = n => `${usd(n)} (${rs(n)})`;
const pct = (p, o) => (o > p ? Math.round(((o - p) / o) * 100) : 0);
const waLink = (text, num = WA1) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
const wa = (num = WA1) => `https://wa.me/${num}`;

function access(setup) {
  const s = (setup || "").toLowerCase();
  if (s.includes("shared")) return { cls: "shared", label: setup };
  if (s.includes("client email") || s.includes("private") || s.includes("on your")) return { cls: "private", label: setup };
  return { cls: "", label: setup };
}
function warrantyOf(t) {
  const w = (t.specs || []).find(x => /warranty/i.test(x));
  return w ? w.replace(/full warranty support/i, "Full plan warranty") : "Full plan warranty";
}
function plansFor(f) {
  const seen = new Set();
  const out = [];
  f.ids.forEach(id => {
    const t = TOOLS.byId[id];
    if (!t) { console.warn(`  ! ${f.slug}: catalog id "${id}" not found in index.js — skipped`); return; }
    const key = `${t.duration}|${t.price}|${t.setup}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(t);
  });
  return out;
}
function famStats(f) {
  const plans = plansFor(f);
  if (!plans.length) return null;
  const min = plans.reduce((a, b) => (b.price < a.price ? b : a));
  const max = Math.max(...plans.map(p => p.price));
  return { plans, min, max, save: Math.max(...plans.map(p => pct(p.price, p.originalPrice))) };
}

/* ---------- layout ---------- */
function header(rel, active) {
  const a = k => (active === k ? ' class="active"' : "");
  return `
<header class="pg-header">
  <div class="pg-header-inner">
    <a href="${rel}index.html" class="logo" aria-label="${BRAND} home">
      <span class="logo-icon logo-icon-img"><img src="${rel}assets/logo.webp" alt="${BRAND} logo" width="36" height="36"></span>
      <span class="logo-text">MALIK DATA <span class="logo-highlight">CENTRE</span></span>
    </a>
    <nav class="pg-nav" aria-label="Main">
      <a href="${rel}index.html#catalog-section">Store</a>
      <a href="${rel}tools/"${a("tools")}>All Tools</a>
      <a href="${rel}comparisons/"${a("compare")}>Compare</a>
      <a href="${rel}design/">Design Studio <span class="pg-save" style="margin-left:2px">Free</span></a>
      <div class="pg-dd">
        <button type="button" aria-haspopup="true">Services <i class="fa-solid fa-chevron-down" style="font-size:.65rem"></i></button>
        <div class="pg-dd-menu">
          <a href="${rel}social-media-services/"><i class="fa-solid fa-hashtag"></i> Social Media Services</a>
          <a href="${rel}ai-automation-services/"><i class="fa-solid fa-robot"></i> AI Automation</a>
          <a href="${rel}enterprise-ai-api-credits/"><i class="fa-solid fa-plug"></i> Enterprise API Credits</a>
        </div>
      </div>
      <a href="${rel}blog/index.html"${a("blog")}>Blog</a>
      <a href="${rel}about-us/"${a("about")}>About</a>
      <a href="${rel}refund-policy/"${a("safety")}>Buyer Safety</a>
    </nav>
    <div class="pg-head-cta">
      <a href="${wa(WA1)}" target="_blank" rel="noopener noreferrer" class="btn btn-success pg-hide-sm"><i class="fa-brands fa-whatsapp"></i> Order on WhatsApp</a>
      <button class="pg-burger" type="button" aria-label="Open menu" aria-expanded="false" data-pg-burger><i class="fa-solid fa-bars"></i></button>
    </div>
  </div>
  <div class="pg-mobile" data-pg-mobile>
    <a href="${rel}index.html#catalog-section">Store &amp; Catalog</a>
    <a href="${rel}tools/">All Tool Guides</a>
    <a href="${rel}comparisons/">Compare Tools</a>
    <a href="${rel}design/">Free Design Studio</a>
    <div class="pg-mobile-label">Services</div>
    <a href="${rel}social-media-services/">Social Media Services</a>
    <a href="${rel}ai-automation-services/">AI Automation</a>
    <a href="${rel}enterprise-ai-api-credits/">Enterprise API Credits</a>
    <div class="pg-mobile-label">Company</div>
    <a href="${rel}blog/index.html">Blog</a>
    <a href="${rel}about-us/">About Us</a>
    <a href="${rel}contact-us/">Contact Us</a>
    <a href="${rel}frequently-asked-questions/">FAQ</a>
    <a href="${rel}refund-policy/">Refund Policy</a>
    <a href="${wa(WA1)}" target="_blank" rel="noopener noreferrer" class="btn btn-success" style="margin-top:12px;justify-content:center;color:#fff"><i class="fa-brands fa-whatsapp"></i> Order on WhatsApp</a>
  </div>
</header>`;
}

function footer(rel) {
  const top = ["chatgpt-go", "super-grok", "google-ai-ultra", "gemini-pro", "capcut-pro", "canva-pro", "adobe-creative-cloud", "cursor-pro"];
  return `
<footer class="pg-footer">
  <div class="pg-wrap">
    <div class="pg-footer-grid">
      <div>
        <a href="${rel}index.html" class="logo">
          <span class="logo-icon logo-icon-img"><img src="${rel}assets/logo.webp" alt="${BRAND} logo" width="36" height="36"></span>
          <span class="logo-text">MALIK DATA <span class="logo-highlight">CENTRE</span></span>
        </a>
        <p class="pg-foot-about">AI tools and software subscriptions for customers worldwide, with USDT and local payments, WhatsApp support and a written warranty.</p>
        <div class="footer-socials">
          <a href="${wa(WA1)}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="${CHANNEL}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="WhatsApp Channel"><i class="fa-solid fa-bullhorn"></i></a>
          <a href="${SOCIAL.youtube}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          <a href="${SOCIAL.facebook}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
          <a href="${SOCIAL.x}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
      <div>
        <h4>Popular tools</h4>
        <ul>${top.filter(s => FAM[s]).map(s => `<li><a href="${rel}tools/${s}/">${esc(FAM[s].name)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>Store</h4>
        <ul>
          <li><a href="${rel}index.html#catalog-section">Catalog</a></li>
          <li><a href="${rel}tools/">All tool guides</a></li>
          <li><a href="${rel}comparisons/">Comparisons</a></li>
          <li><a href="${rel}design/">Free Design Studio</a></li>
          <li><a href="${rel}social-media-services/">Social media services</a></li>
          <li><a href="${rel}ai-automation-services/">AI automation</a></li>
          <li><a href="${rel}enterprise-ai-api-credits/">API credits</a></li>
          <li><a href="${rel}blog/index.html">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4>Policies</h4>
        <ul>
          <li><a href="${rel}refund-policy/">Refund &amp; warranty</a></li>
          <li><a href="${rel}delivery-policy/">Delivery policy</a></li>
          <li><a href="${rel}frequently-asked-questions/">FAQ</a></li>
          <li><a href="${rel}privacy.html">Privacy policy</a></li>
          <li><a href="${rel}terms.html">Terms &amp; conditions</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="${wa(WA1)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> +92 344 5739206</a></li>
          <li><a href="${wa(WA2)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> +92 348 9057646</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li><a href="${rel}about-us/">About us</a></li>
          <li><a href="${rel}contact-us/">Contact us</a></li>
        </ul>
      </div>
    </div>
    <div class="pg-footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.</span>
      <span>${BRAND} is an independent reseller. Product names and logos belong to their owners; no official partnership is implied.</span>
    </div>
  </div>
</footer>
<a href="${wa(WA1)}" target="_blank" rel="noopener noreferrer" class="pg-fab" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
}

function page({ urlPath, title, desc, body, active, jsonld = [], ogType = "website", checkout = false, keywords = "", extraCss = [], file = null }) {
  const depth = urlPath.split("/").filter(Boolean).length - (urlPath.endsWith(".html") ? 1 : 0);
  const rel = "../".repeat(depth);
  const canonical = SITE + "/" + urlPath;
  const ld = jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ""}
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0a0a0f">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@realmickeyai">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="icon" type="image/png" href="${rel}assets/logo-96.png">
<link rel="manifest" href="${rel}manifest.json">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="${rel}index.css">
${checkout ? `<link rel="stylesheet" href="${rel}advanced.css">` : ""}
<link rel="stylesheet" href="${rel}pages.css">
<link rel="stylesheet" href="${rel}theme.css?v=2.2">
${extraCss.map(c => `<link rel="stylesheet" href="${rel}${c}">`).join("\n")}
${ld}
</head>
<body>
<div class="bg-glow bg-glow-1"></div>
${header(rel, active)}
<main class="pg-main">
${body(rel)}
</main>
${footer(rel)}
<script src="${rel}tool-links.js" defer></script>
<script src="${rel}pages.js" defer></script>
${checkout ? `<script src="${rel}store-backend.js" defer></script>` : ""}
</body>
</html>
`;
}

function write(urlPath, html) {
  const file = urlPath.endsWith(".html") ? path.join(ROOT, urlPath) : path.join(ROOT, urlPath, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  BUILT.push(urlPath);
}
const BUILT = [];

const crumbLd = items => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + "/" + url }))
});
const faqLd = faqs => faqs.length ? ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
}) : null;
const faqHtml = faqs => `<div class="pg-faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>`;
const crumbHtml = (rel, items) => `<nav class="pg-crumb" aria-label="Breadcrumb">${items.map(([n, u], i) =>
  i === items.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${rel}${u}">${esc(n)}</a><span>/</span>`).join("")}</nav>`;

const COMMON_FAQS = [
  ["Can I buy from outside Pakistan?", "Yes. We deliver worldwide, because every plan is activated online on your email or with login details sent on WhatsApp. Customers in the UK, USA, UAE, Saudi Arabia, Europe, India and elsewhere pay with USDT (Binance, BEP20 or TRC20). The exact amount in your currency is confirmed on WhatsApp before you pay."],
  ["How do I pay?", "Worldwide: USDT via Binance (BEP20 or TRC20). In Pakistan: EasyPaisa, JazzCash, NayaPay, UPaisa, Meezan Bank or bank transfer. Payment details are shared on WhatsApp when you order."],
  ["How long does delivery take?", "Usually 5 to 30 minutes after payment is confirmed. You receive setup steps on WhatsApp."],
  ["What if something stops working?", "Send a screenshot to WhatsApp support during the warranty period. We fix or replace the plan, and refund the remaining value if we cannot."]
];

function familyCard(rel, f) {
  const st = famStats(f);
  if (!st) return "";
  return `<a class="pg-card" href="${rel}tools/${f.slug}/" data-cat="${f.cat}" data-name="${esc((f.name + " " + f.slug).toLowerCase())}">
    <div class="pg-card-top"><div class="pg-card-icon"><i class="${f.icon}"></i></div>
      <div><div class="pg-card-cat">${esc(CAT[f.cat] || f.cat)}</div><h3>${esc(f.name)}</h3></div></div>
    <p>${esc(f.intro.split(". ")[0].replace(/\.$/, ""))}.</p>
    <div class="pg-card-price"><span class="pg-from">From</span> <b>${rs(st.min.price)}</b>${st.min.originalPrice > st.min.price ? `<s>${rs(st.min.originalPrice)}</s>` : ""}${st.save ? ` <span class="pg-save">Up to ${st.save}% off</span>` : ""}</div>
    <span class="pg-card-more">${st.plans.length} plan${st.plans.length > 1 ? "s" : ""} &middot; View price &amp; details <i class="fa-solid fa-arrow-right"></i></span>
  </a>`;
}

/* ======================================================================
   1) TOOL PAGES
   ====================================================================== */
function planRow(t, f) {
  const ac = access(t.setup);
  const off = pct(t.price, t.originalPrice);
  const msg =
    `Hello MALIK DATA CENTRE! I want to buy:\n\n` +
    `🛍️ Tool: ${t.name}\n⏱️ Plan: ${t.duration}\n💰 Price: Rs ${t.price.toLocaleString("en-US")}\n⚙️ Setup: ${t.setup}\n\n` +
    `Please share payment details and setup instructions.\nSource: malikdatacentre.store/tools/${f.slug}/`;
  return `<article class="pg-plan tool-card" id="plan-${t.id}">
    <div>
      <div class="pg-plan-name tool-title">${esc(t.name)} &middot; <span class="tool-duration">${esc(t.duration)}</span></div>
      <div class="pg-plan-sub">
        <span class="pg-chip ${ac.cls}"><i class="fa-solid fa-user-shield"></i> ${esc(ac.label)}</span>
        <span class="pg-chip"><i class="fa-solid fa-shield-halved"></i> ${esc(warrantyOf(t))}</span>
        ${off ? `<span class="pg-chip private">Save ${off}%</span>` : ""}
      </div>
    </div>
    <div class="tool-card-footer">
      <div class="tool-price-wrapper">
        ${t.originalPrice > t.price ? `<span class="tool-original-price">${rs(t.originalPrice)}</span>` : ""}
        <span class="tool-price">${rs(t.price)}</span>
        <span class="pg-usd">≈ ${usd(t.price)}</span>
      </div>
      <a href="${waLink(msg)}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-buy"><i class="fa-brands fa-whatsapp"></i> Buy Now</a>
      <button class="btn-addcart" type="button" tabindex="-1" aria-hidden="true" data-id="${esc(t.id)}" data-name="${esc(t.name)}" data-price="${t.price}" data-duration="${esc(t.duration)}" data-setup="${esc(t.setup)}"></button>
    </div>
  </article>`;
}

function buildToolPage(f) {
  const st = famStats(f);
  if (!st) return;
  const url = `tools/${f.slug}/`;
  const faqs = [...(f.faqs || []), ...COMMON_FAQS];
  const title = `Buy ${f.name} Online (${new Date().getFullYear()}) | From ${usd(st.min.price)} | ${BRAND}`;
  const desc = `Buy ${f.name} online from ${usd(st.min.price)} (${rs(st.min.price)}). ${st.plans.length} plan${st.plans.length > 1 ? "s" : ""}, worldwide delivery, USDT or local payment, 5–30 min activation on WhatsApp and full plan warranty.`;
  const related = (f.related || []).map(s => FAM[s]).filter(Boolean);
  const accessTypes = [...new Set(st.plans.map(p => p.setup))];

  const jsonld = [
    {
      "@context": "https://schema.org", "@type": "Product",
      name: f.name, description: f.intro, image: `${SITE}/assets/logo.png`, category: CAT[f.cat],
      brand: { "@type": "Brand", name: f.name.split(" ")[0] },
      offers: {
        "@type": "AggregateOffer", priceCurrency: "PKR", lowPrice: st.min.price, highPrice: st.max, offerCount: st.plans.length,
        availability: "https://schema.org/InStock", url: SITE + "/" + url,
        seller: { "@type": "Organization", name: BRAND, url: SITE }
      }
    },
    crumbLd([["Home", ""], ["All Tools", "tools/"], [f.name, url]]),
    faqLd(faqs)
  ].filter(Boolean);

  const body = rel => `
<div class="pg-wrap">
  ${crumbHtml(rel, [["Home", "index.html"], ["All Tools", "tools/"], [f.name, ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="${CAT_ICON[f.cat]}"></i> ${esc(CAT[f.cat])}</span>
    <h1>Buy ${esc(f.name)} online</h1>
    <p class="pg-lead">${esc(f.intro)}</p>
    <div class="pg-meta">
      <span><i class="fa-regular fa-calendar"></i> Prices updated ${PRICE_HUMAN}</span>
      <span><i class="fa-solid fa-bolt"></i> 5–30 min activation</span>
      <span><i class="fa-solid fa-globe"></i> Worldwide delivery</span>
      <span><i class="fa-solid fa-wallet"></i> USDT · EasyPaisa · JazzCash · Bank</span>
    </div>
  </section>

  <div class="pg-product">
    <div>
      <section class="pg-section" id="plans" style="padding-top:0">
        <h2>Plans &amp; prices</h2>
        <p>Prices are set in Pakistani rupees (PKR), with an approximate US dollar price shown next to each plan. The exact amount in your currency is confirmed on WhatsApp. Tap <strong>Buy Now</strong>, enter your name and WhatsApp number, then send the payment screenshot on WhatsApp.</p>
        <div class="pg-plans">${st.plans.map(t => planRow(t, f)).join("")}</div>
      </section>

      <section class="pg-section pg-prose">
        <h2>Overview</h2>
        <p>${esc(f.intro)}</p>
        <p>Paying for ${esc(f.name)} directly usually needs an international credit card and full-price billing. With ${BRAND} you can buy from anywhere in the world: pay with USDT (Binance), or with a local wallet or bank in Pakistan, get setup help on WhatsApp, and keep a written warranty for the plan period.</p>
        ${f.official ? `<p>Official product website: <a href="${f.official}" target="_blank" rel="noopener nofollow">${esc(f.official.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a></p>` : ""}
      </section>

      <section class="pg-section">
        <h2>Best for</h2>
        <ul class="pg-checks">${f.bestFor.map(x => `<li><i class="fa-solid fa-circle-check"></i>${esc(x)}</li>`).join("")}</ul>
      </section>

      <section class="pg-section">
        <h2>What's included</h2>
        <ul class="pg-checks cols">${f.included.map(x => `<li><i class="fa-solid fa-circle-check"></i>${esc(x)}</li>`).join("")}</ul>
      </section>

      <section class="pg-section">
        <h2>Plan, access &amp; warranty</h2>
        <div class="pg-table-wrap"><table class="pg-table">
          <thead><tr><th>Plan</th><th>Duration</th><th>Access type</th><th>Warranty</th><th>Price</th></tr></thead>
          <tbody>${st.plans.map(t => `<tr><td>${esc(t.name)}</td><td>${esc(t.duration)}</td><td>${esc(t.setup)}</td><td>${esc(warrantyOf(t))}</td><td><strong style="color:var(--text-main)">${rs(t.price)}</strong><br><span class="pg-usd">≈ ${usd(t.price)}</span></td></tr>`).join("")}</tbody>
        </table></div>
        ${accessTypes.some(a => /shared/i.test(a)) ? `<div class="pg-note warn"><strong>Shared plans:</strong> the login is used by more than one buyer. Do not change the password or account details, and keep private work in your own account. Choose a plan marked private or "on client email" if you need full privacy.</div>` : ""}
        <p style="font-size:.88rem">Features and limits are set by the tool's owner and can change. Confirm the exact plan on WhatsApp before paying.</p>
      </section>

      <section class="pg-section">
        <h2>How activation works</h2>
        <ol class="pg-steps">
          <li><span><strong>Choose your plan</strong>Pick a duration above and tap Buy Now.</span></li>
          <li><span><strong>Place the order</strong>Enter your name and WhatsApp number. Your order number appears on screen.</span></li>
          <li><span><strong>Pay</strong>Send the amount with USDT from anywhere, or via EasyPaisa, JazzCash or bank in Pakistan, and share the screenshot on WhatsApp.</span></li>
          <li><span><strong>Get activated</strong>We activate on your email or send login details, usually within 5–30 minutes, with a setup guide.</span></li>
          <li><span><strong>Use your warranty</strong>Any problem during the warranty period? Message support with a screenshot.</span></li>
        </ol>
      </section>

      <section class="pg-section">
        <h2>Buyer safety checklist</h2>
        <ul class="pg-checks warn">
          <li><i class="fa-solid fa-triangle-exclamation"></i>Check the access type (private, invitation or shared) before paying.</li>
          <li><i class="fa-solid fa-triangle-exclamation"></i>Never share your email password. ${BRAND} will never ask for it.</li>
          <li><i class="fa-solid fa-triangle-exclamation"></i>Pay only to the account shown at checkout or on our official WhatsApp numbers.</li>
          <li><i class="fa-solid fa-triangle-exclamation"></i>Keep your payment screenshot and order number until the warranty ends.</li>
        </ul>
        <p class="pg-prose" style="margin-top:10px">Read our <a href="${rel}refund-policy/">refund &amp; warranty policy</a> and <a href="${rel}delivery-policy/">delivery policy</a>.</p>
      </section>

      <section class="pg-section">
        <h2>Frequently asked questions</h2>
        ${faqHtml(faqs)}
      </section>

      ${related.length ? `<section class="pg-section">
        <h2>Related tools</h2>
        <div class="pg-grid">${related.map(r => familyCard(rel, r)).join("")}</div>
      </section>` : ""}

      <p class="pg-disclaimer">${BRAND} is an independent reseller and is not affiliated with, endorsed by or an official partner of ${esc(f.name.split(" (")[0])} or its owner unless stated in writing. Product names are trademarks of their respective owners.</p>
    </div>

    <aside class="pg-buybox" aria-label="Price summary">
      <div class="pg-buybox-icon"><i class="${f.icon}"></i></div>
      <h2>${esc(f.name)}</h2>
      <div class="pg-from">Starting from</div>
      <div class="pg-from-price">${rs(st.min.price)}</div>
      <div class="pg-usd" style="margin-top:2px">≈ ${usd(st.min.price)} USD</div>
      <div>${st.min.originalPrice > st.min.price ? `<span class="pg-from-old">${rs(st.min.originalPrice)}</span>` : ""}${pct(st.min.price, st.min.originalPrice) ? `<span class="pg-save">Save ${pct(st.min.price, st.min.originalPrice)}%</span>` : ""}</div>
      <ul>
        <li><i class="fa-solid fa-check"></i> ${st.plans.length} plan${st.plans.length > 1 ? "s" : ""} available</li>
        <li><i class="fa-solid fa-check"></i> ${esc(accessTypes.join(" / "))}</li>
        <li><i class="fa-solid fa-check"></i> Activation in 5–30 minutes</li>
        <li><i class="fa-solid fa-check"></i> Delivered worldwide</li>
        <li><i class="fa-solid fa-check"></i> Warranty + refund if we can't fix it</li>
      </ul>
      <a href="#plans" class="btn btn-gradient"><i class="fa-solid fa-list"></i> Choose a plan</a>
      <a href="${waLink(`Hello MALIK DATA CENTRE! I have a question about ${f.name} (malikdatacentre.store/tools/${f.slug}/)`)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="margin-top:8px"><i class="fa-brands fa-whatsapp"></i> Ask a question</a>
      <p class="pg-small">Prices updated ${PRICE_HUMAN}. We never ask for your email password.</p>
    </aside>
  </div>
</div>`;

  write(url, page({ urlPath: url, title, desc, body, active: "tools", jsonld, ogType: "product", checkout: true,
    keywords: `buy ${f.name}, ${f.name} price, cheap ${f.name}, ${f.name} subscription, ${f.name} discount, ${f.name} USDT, ${f.name} worldwide, ${f.name} UK, ${f.name} USA, ${f.name} UAE, ${f.name} India, ${f.name} Pakistan` }));
}

/* ======================================================================
   2) /tools/  — all tool guides
   ====================================================================== */
function finderHtml() {
  return `<form class="pg-form" data-pg-finder>
    <div class="row">
      <div><label for="f-need">What do you need?</label>
        <select id="f-need" name="need">
          <option value="ai-chat">AI chat, writing &amp; research</option>
          <option value="ai-coding">Coding, apps &amp; automation</option>
          <option value="video-audio">AI video &amp; voice</option>
          <option value="creative">Design, docs &amp; productivity</option>
          <option value="entertainment">Streaming, learning &amp; meetings</option>
          <option value="vpn-security">Windows, Office &amp; VPN</option>
        </select></div>
      <div><label for="f-budget">Budget</label>
        <select id="f-budget" name="budget">
          <option value="1000">Under ${usd(1000)} (Rs 1,000)</option>
          <option value="5000" selected>Up to ${usd(5000)} (Rs 5,000)</option>
          <option value="999999">No limit</option>
        </select></div>
      <div><label for="f-privacy">Account type</label>
        <select id="f-privacy" name="privacy">
          <option value="any">Any (cheapest first)</option>
          <option value="private">Private / on my email</option>
        </select></div>
    </div>
    <button class="btn btn-gradient" type="submit" style="justify-self:start"><i class="fa-solid fa-wand-magic-sparkles"></i> Recommend tools</button>
    <div class="pg-finder-result pg-grid" data-pg-finder-result></div>
  </form>`;
}
function requestFormHtml() {
  return `<form class="pg-form" data-pg-waform data-intro="Hello MALIK DATA CENTRE! I want to request a tool that is not in your catalog:">
    <div class="row">
      <div><label for="r-tool">Tool name *</label><input id="r-tool" name="Tool" required placeholder="e.g. Midjourney, Perplexity Pro"></div>
      <div><label for="r-dur">Duration</label><input id="r-dur" name="Duration" placeholder="e.g. 1 month, 1 year"></div>
      <div><label for="r-acc">Account type</label><select id="r-acc" name="Account type"><option>Private / on my email</option><option>Shared is fine</option><option>Not sure</option></select></div>
    </div>
    <div><label for="r-note">Notes</label><textarea id="r-note" name="Notes" placeholder="Budget, usage, deadline..."></textarea></div>
    <button class="btn btn-success" type="submit" style="justify-self:start"><i class="fa-brands fa-whatsapp"></i> Send request on WhatsApp</button>
  </form>`;
}

function buildToolsIndex() {
  const url = "tools/";
  const fams = FAMILIES.filter(f => famStats(f));
  const minAll = Math.min(...fams.map(f => famStats(f).min.price));
  const body = rel => `
<div class="pg-wrap">
  ${crumbHtml(rel, [["Home", "index.html"], ["All Tools", ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="fa-solid fa-layer-group"></i> ${fams.length} tools &middot; from ${rs(minAll)}</span>
    <h1>AI tools &amp; subscriptions, worldwide</h1>
    <p class="pg-lead">Every tool we sell, with prices, access type, warranty and a full buying guide. Delivered worldwide: pay with USDT from any country, or EasyPaisa, JazzCash or bank in Pakistan, and get activated on WhatsApp in 5–30 minutes.</p>
  </section>

  <section class="pg-section" style="padding-top:0">
    <div class="pg-filter" data-pg-filter>
      <input type="search" placeholder="Search tools (ChatGPT, Canva, Cursor...)" aria-label="Search tools" data-pg-search>
      <button class="pg-pill active" data-cat="all" type="button">All</button>
      ${Object.entries(CAT).map(([k, v]) => `<button class="pg-pill" data-cat="${k}" type="button">${esc(v)}</button>`).join("")}
    </div>
    <div class="pg-grid" data-pg-cards>${fams.map(f => familyCard(rel, f)).join("")}</div>
    <p data-pg-empty hidden style="color:var(--text-muted);margin-top:16px">No tool found. Request it below and we will try to arrange it.</p>
  </section>

  <section class="pg-section" id="fast-order">
    <h2>Fast order list</h2>
    <p>Already know what you want? Order straight from this list.</p>
    <div class="pg-table-wrap"><table class="pg-table">
      <thead><tr><th>Tool</th><th>Category</th><th>From</th><th>Plans</th><th></th></tr></thead>
      <tbody>${fams.map(f => { const s = famStats(f); return `<tr><td><a href="${rel}tools/${f.slug}/">${esc(f.name)}</a></td><td>${esc(CAT[f.cat])}</td><td><strong style="color:var(--text-main)">${rs(s.min.price)}</strong></td><td>${s.plans.length}</td><td><a href="${rel}tools/${f.slug}/#plans">Order <i class="fa-solid fa-arrow-right"></i></a></td></tr>`; }).join("")}</tbody>
    </table></div>
  </section>

  <section class="pg-section" id="tool-finder">
    <h2>Tool finder</h2>
    <p>Not sure what to buy? Tell us what you need and your budget.</p>
    ${finderHtml()}
  </section>

  <section class="pg-section" id="request-tool">
    <h2>Can't find a tool? Request it</h2>
    <p>We arrange many tools that are not listed yet. Send the details and we will reply with price and availability.</p>
    ${requestFormHtml()}
  </section>
</div>`;
  write(url, page({
    urlPath: url, active: "tools",
    title: `Buy AI Tools & Subscriptions Online, Worldwide | ${BRAND}`,
    desc: `Compare ${fams.length} AI tools and software subscriptions from ${usd(minAll)}: ChatGPT, Gemini, Google AI Ultra, SuperGrok, Canva, Adobe, CapCut, Cursor and more. Worldwide delivery, USDT payment and WhatsApp activation.`,
    jsonld: [crumbLd([["Home", ""], ["All Tools", url]]), {
      "@context": "https://schema.org", "@type": "ItemList", name: "AI tools and subscriptions",
      itemListElement: fams.map((f, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/tools/${f.slug}/`, name: f.name }))
    }],
    body
  }));
}

/* ======================================================================
   3) COMPARISONS
   ====================================================================== */
function buildComparisons() {
  CONTENT.comparisons.forEach(c => {
    const url = `comparisons/${c.slug}/`;
    const cols = c.cols.map(s => FAM[s]).filter(Boolean);
    const priceRow = ["Starting price", ...cols.map(f => { const s = famStats(f); return s ? both(s.min.price) : "—"; })];
    const body = rel => `
<div class="pg-narrow">
  ${crumbHtml(rel, [["Home", "index.html"], ["Compare", "comparisons/"], [c.short, ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="fa-solid fa-scale-balanced"></i> Comparison</span>
    <h1>${esc(c.title)}</h1>
    <p class="pg-lead">${esc(c.lead)}</p>
    <div class="pg-meta"><span><i class="fa-regular fa-calendar"></i> Prices updated ${PRICE_HUMAN}</span></div>
  </section>
  <section class="pg-section" style="padding-top:0">
    <h2>Side-by-side</h2>
    <div class="pg-table-wrap"><table class="pg-table">
      <thead><tr><th></th>${cols.map(f => `<th><a href="${rel}tools/${f.slug}/">${esc(f.name)}</a></th>`).join("")}</tr></thead>
      <tbody>${[priceRow, ...c.rows].map(r => `<tr><td><strong style="color:var(--text-main)">${esc(r[0])}</strong></td>${r.slice(1).map(v => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <p style="font-size:.85rem">Prices are ${BRAND} prices in PKR; USD is approximate. Features are set by each tool's owner and can change.</p>
  </section>
  <section class="pg-section">
    <h2>Which one should you buy?</h2>
    <div class="pg-grid">${c.verdict.map(([who, s]) => FAM[s] ? `<a class="pg-card" href="${rel}tools/${s}/"><div class="pg-card-cat">${esc(who)}</div><h3>${esc(FAM[s].name)}</h3><span class="pg-card-more">See plans <i class="fa-solid fa-arrow-right"></i></span></a>` : "").join("")}</div>
  </section>
  ${c.faqs.length ? `<section class="pg-section"><h2>FAQs</h2>${faqHtml(c.faqs)}</section>` : ""}
  <section class="pg-section"><h2>Plans</h2><div class="pg-grid">${cols.map(f => familyCard(rel, f)).join("")}</div></section>
  <div class="pg-cta"><h2>Still not sure?</h2><p>Tell us how you will use it and we will recommend the right plan.</p>
    <div class="pg-cta-btns"><a class="btn btn-success" target="_blank" rel="noopener noreferrer" href="${waLink(`Hello MALIK DATA CENTRE! Help me choose: ${c.short}`)}"><i class="fa-brands fa-whatsapp"></i> Ask on WhatsApp</a></div></div>
</div>`;
    write(url, page({ urlPath: url, active: "compare", title: `${c.title} | ${BRAND}`, desc: c.lead, ogType: "article",
      jsonld: [crumbLd([["Home", ""], ["Compare", "comparisons/"], [c.short, url]]), faqLd(c.faqs)].filter(Boolean), body }));
  });

  const url = "comparisons/";
  const body = rel => `
<div class="pg-wrap">
  ${crumbHtml(rel, [["Home", "index.html"], ["Compare", ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="fa-solid fa-scale-balanced"></i> Compare before you buy</span>
    <h1>AI tool comparisons</h1>
    <p class="pg-lead">Honest side-by-side guides with real prices, so you buy the right plan the first time.</p>
  </section>
  <section class="pg-section" style="padding-top:0">
    <div class="pg-grid three">
      ${CONTENT.comparisons.map(c => `<a class="pg-card" href="${rel}comparisons/${c.slug}/"><div class="pg-card-top"><div class="pg-card-icon"><i class="fa-solid fa-scale-balanced"></i></div><h3>${esc(c.short)}</h3></div><p>${esc(c.lead)}</p><span class="pg-card-more">Read comparison <i class="fa-solid fa-arrow-right"></i></span></a>`).join("")}
      ${CONTENT.blogComparisons.map(([t, u]) => `<a class="pg-card" href="${rel}${u}"><div class="pg-card-top"><div class="pg-card-icon"><i class="fa-solid fa-newspaper"></i></div><h3>${esc(t)}</h3></div><p>In-depth buying guide from our blog.</p><span class="pg-card-more">Read guide <i class="fa-solid fa-arrow-right"></i></span></a>`).join("")}
    </div>
  </section>
</div>`;
  write(url, page({ urlPath: url, active: "compare", title: `AI Tool Comparisons: Which Subscription Should You Buy? | ${BRAND}`,
    desc: "Compare Gemini Pro vs Google AI Ultra, Cursor vs Replit vs Lovable, ElevenLabs vs HeyGen and more, with prices in USD and PKR.",
    jsonld: [crumbLd([["Home", ""], ["Compare", url]])], body }));
}

/* ======================================================================
   4) TRUST & POLICY PAGES
   ====================================================================== */
function simplePage(url, { title, h1, eyebrow, icon, lead, desc, inner, active, faqs = [] }) {
  const body = rel => `
<div class="pg-narrow">
  ${crumbHtml(rel, [["Home", "index.html"], [h1, ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="${icon}"></i> ${esc(eyebrow)}</span>
    <h1>${esc(h1)}</h1>
    <p class="pg-lead">${lead}</p>
    <div class="pg-meta"><span><i class="fa-regular fa-calendar"></i> Last updated ${human(CONTENT.policiesUpdated || "2026-10-25")}</span></div>
  </section>
  <div class="pg-prose">${inner(rel)}</div>
  <div class="pg-cta"><h2>Need help?</h2><p>Our team replies on WhatsApp.</p>
    <div class="pg-cta-btns"><a class="btn btn-success" href="${wa(WA1)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> +92 344 5739206</a><a class="btn btn-outline" href="${wa(WA2)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> +92 348 9057646</a></div></div>
</div>`;
  write(url, page({ urlPath: url, active, title: `${title} | ${BRAND}`, desc,
    jsonld: [crumbLd([["Home", ""], [h1, url]]), faqLd(faqs)].filter(Boolean), body }));
}

function buildPolicies() {
  simplePage("refund-policy/", {
    title: "Refund & Warranty Policy", h1: "Refund & Warranty Policy", eyebrow: "Buyer safety", icon: "fa-solid fa-shield-halved", active: "safety",
    desc: `How ${BRAND} handles warranty replacements and refunds for AI tool and software subscriptions.`,
    lead: "If a plan stops working during its warranty period, we fix it or replace it. If we cannot, we refund you. This page explains exactly how.",
    inner: rel => `
<section class="pg-section"><h2>Our promise in 3 steps</h2>
<ol class="pg-steps">
  <li><span><strong>Report the issue</strong>Send your order number and a screenshot of the error to WhatsApp support.</span></li>
  <li><span><strong>Fix or replacement</strong>We fix the account or provide a replacement, usually within 10–30 minutes.</span></li>
  <li><span><strong>Refund if we can't</strong>If we cannot fix or replace it, we refund the remaining value of your plan.</span></li>
</ol></section>
<section class="pg-section"><h2>Before activation</h2>
<p>If we cannot deliver the plan you paid for (for example, it is out of stock or the confirmed terms cannot be met), you receive a <strong>full refund</strong> to the account you paid from.</p></section>
<section class="pg-section"><h2>After activation</h2>
<p>Each plan shows its warranty period on the catalog and on its tool page. During that period, support works first to restore access. When a fix or replacement is not possible, we issue a pro-rata refund for the unused part of the plan.</p></section>
<section class="pg-section"><h2>Not covered</h2>
<ul class="pg-checks warn">
  <li><i class="fa-solid fa-triangle-exclamation"></i>Changing the password, email or settings of a shared account.</li>
  <li><i class="fa-solid fa-triangle-exclamation"></i>Sharing login details with other people.</li>
  <li><i class="fa-solid fa-triangle-exclamation"></i>Breaking the tool's own terms of use (for example spam or abuse).</li>
  <li><i class="fa-solid fa-triangle-exclamation"></i>Change of mind after the plan has been activated.</li>
  <li><i class="fa-solid fa-triangle-exclamation"></i>Issues reported after the warranty period has ended.</li>
</ul></section>
<section class="pg-section"><h2>How to request a refund</h2>
<p>Message WhatsApp support with your order number, payment screenshot and the problem. Refunds are sent to the same wallet or bank account you paid from. See also our <a href="${rel}delivery-policy/">delivery policy</a> and <a href="${rel}terms.html">terms &amp; conditions</a>.</p></section>`
  });

  simplePage("delivery-policy/", {
    title: "Delivery Policy", h1: "Delivery Policy", eyebrow: "Digital delivery", icon: "fa-solid fa-truck-fast", active: "safety",
    desc: `How and when ${BRAND} delivers AI tools, subscriptions, licence keys and invitations after payment.`,
    lead: "All products are digital. Nothing is shipped by post. Most orders are activated within 5–30 minutes after payment is confirmed.",
    inner: rel => `
<section class="pg-section"><h2>Delivery methods</h2>
<div class="pg-table-wrap"><table class="pg-table">
<thead><tr><th>Type</th><th>How you receive it</th><th>Typical time</th></tr></thead>
<tbody>
<tr><td>Activated on your email</td><td>We upgrade or invite your own email; you accept in your inbox</td><td>5–30 min</td></tr>
<tr><td>Family / team invitation</td><td>Official invitation link sent to your email</td><td>5–30 min</td></tr>
<tr><td>Private or shared account</td><td>Login details and setup guide on WhatsApp</td><td>5–30 min</td></tr>
<tr><td>Licence keys &amp; gift codes</td><td>Code sent on WhatsApp with redeem steps</td><td>5–30 min</td></tr>
<tr><td>Services (automation, social media)</td><td>As agreed in the written quote</td><td>Per quote</td></tr>
</tbody></table></div></section>
<section class="pg-section"><h2>When the clock starts</h2>
<p>Delivery time starts after we confirm your payment. Bank transfers can take longer to show than wallet payments. During very busy periods or when a tool's owner has an outage, delivery may take longer; we will keep you updated on WhatsApp.</p></section>
<section class="pg-section"><h2>What we need from you</h2>
<ul class="pg-checks"><li><i class="fa-solid fa-circle-check"></i>Your order number and payment screenshot.</li><li><i class="fa-solid fa-circle-check"></i>The email address to activate (for email plans). Never your password.</li><li><i class="fa-solid fa-circle-check"></i>A WhatsApp number we can reach.</li></ul>
<p>If an order is not delivered, you are covered by our <a href="${rel}refund-policy/">refund policy</a>.</p></section>`
  });

  const allFaqs = CONTENT.faqs.flatMap(g => g.items);
  simplePage("frequently-asked-questions/", {
    title: "Frequently Asked Questions", h1: "Frequently Asked Questions", eyebrow: "Help centre", icon: "fa-solid fa-circle-question", active: "",
    desc: `Answers about ordering, payment, delivery, private vs shared accounts, warranty and refunds at ${BRAND}.`,
    lead: "Everything buyers usually ask before and after ordering. Can't find your answer? Message us on WhatsApp.",
    faqs: allFaqs,
    inner: () => CONTENT.faqs.map(g => `<section class="pg-section"><h2>${esc(g.cat)}</h2>${faqHtml(g.items)}</section>`).join("")
  });

  simplePage("about-us/", {
    title: "About Us", h1: `About ${BRAND}`, eyebrow: "Who we are", icon: "fa-solid fa-building", active: "about",
    desc: `${BRAND} sells AI tools and software subscriptions to customers worldwide, with USDT and local payments, fast activation and WhatsApp support.`,
    lead: `${BRAND} helps students, freelancers, creators and businesses get premium AI tools and software without needing an international card.`,
    inner: rel => `
<section class="pg-section"><h2>What we do</h2>
<p>We sell AI assistants, coding tools, AI video and voice tools, design software, productivity apps, VPNs and entertainment subscriptions, with clear prices and a written warranty, delivered worldwide. We also offer <a href="${rel}ai-automation-services/">AI automation</a>, <a href="${rel}social-media-services/">social media services</a> and <a href="${rel}enterprise-ai-api-credits/">API credits</a> for businesses.</p></section>
<section class="pg-section"><h2>How we work</h2>
<ul class="pg-checks">
<li><i class="fa-solid fa-circle-check"></i><span><strong style="color:var(--text-main)">Clear labels.</strong> Every plan shows its duration, access type (private, invitation or shared) and warranty before you pay.</span></li>
<li><i class="fa-solid fa-circle-check"></i><span><strong style="color:var(--text-main)">Pay from anywhere.</strong> USDT (Binance) worldwide, plus EasyPaisa, JazzCash, NayaPay, UPaisa, Meezan Bank and bank transfer in Pakistan.</span></li>
<li><i class="fa-solid fa-circle-check"></i><span><strong style="color:var(--text-main)">Fast WhatsApp support.</strong> Orders, setup help and warranty claims are handled by real people on WhatsApp.</span></li>
<li><i class="fa-solid fa-circle-check"></i><span><strong style="color:var(--text-main)">No passwords.</strong> We never ask for your email password.</span></li>
</ul></section>
<section class="pg-section"><h2>Who we serve</h2>
<p>Students preparing assignments and theses, freelancers working for international clients, YouTubers and content creators, developers and startups, and small businesses in Pakistan, the Gulf, the UK, Europe, North America and across Asia.</p></section>
<section class="pg-section"><h2>See our work</h2>
<p>We post completed setups and customer feedback on our <a href="${CHANNEL}" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a> and <a href="${SOCIAL.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>, and you can read customer screenshots in the <a href="${rel}index.html#reviews-section">reviews section</a>.</p></section>
<p class="pg-disclaimer">${BRAND} is an independent reseller. We are not an official partner of the software companies whose products we sell unless stated in writing. All product names are trademarks of their owners.</p>`
  });

  simplePage("contact-us/", {
    title: "Contact Us", h1: "Contact Us", eyebrow: "We reply on WhatsApp", icon: "fa-solid fa-headset", active: "",
    desc: `Contact ${BRAND} on WhatsApp (+92 344 5739206, +92 348 9057646) or email for orders, setup help and warranty claims.`,
    lead: "WhatsApp is the fastest way to reach us for orders, setup help and warranty claims.",
    inner: () => `
<section class="pg-section" style="padding-top:0"><div class="pg-contact-grid">
  <a class="pg-card" href="${wa(WA1)}" target="_blank" rel="noopener noreferrer"><div class="pg-card-icon"><i class="fa-brands fa-whatsapp"></i></div><h3>WhatsApp Line 1</h3><p>+92 344 5739206</p></a>
  <a class="pg-card" href="${wa(WA2)}" target="_blank" rel="noopener noreferrer"><div class="pg-card-icon"><i class="fa-brands fa-whatsapp"></i></div><h3>WhatsApp Line 2</h3><p>+92 348 9057646</p></a>
  <a class="pg-card" href="mailto:${EMAIL}"><div class="pg-card-icon"><i class="fa-solid fa-envelope"></i></div><h3>Email</h3><p>${EMAIL}</p></a>
  <a class="pg-card" href="${CHANNEL}" target="_blank" rel="noopener noreferrer"><div class="pg-card-icon"><i class="fa-solid fa-bullhorn"></i></div><h3>WhatsApp Channel</h3><p>Daily setups, offers and coupon codes</p></a>
  <a class="pg-card" href="${COMMUNITY}" target="_blank" rel="noopener noreferrer"><div class="pg-card-icon"><i class="fa-solid fa-users"></i></div><h3>Community</h3><p>Join other buyers and get updates</p></a>
  <a class="pg-card" href="${SOCIAL.youtube}" target="_blank" rel="noopener noreferrer"><div class="pg-card-icon"><i class="fa-brands fa-youtube"></i></div><h3>YouTube</h3><p>Setup guides and tutorials</p></a>
</div></section>
<section class="pg-section"><h2>Send us a message</h2>
<p>Fill this in and it opens WhatsApp with your message ready to send.</p>
<form class="pg-form" data-pg-waform data-intro="Hello MALIK DATA CENTRE!">
  <div class="row"><div><label for="c-name">Your name *</label><input id="c-name" name="Name" required></div>
  <div><label for="c-topic">Topic</label><select id="c-topic" name="Topic"><option>New order</option><option>Setup help</option><option>Warranty claim</option><option>Request a tool</option><option>Services / quote</option><option>Other</option></select></div>
  <div><label for="c-order">Order number (if any)</label><input id="c-order" name="Order #"></div></div>
  <div><label for="c-msg">Message *</label><textarea id="c-msg" name="Message" required></textarea></div>
  <button class="btn btn-success" type="submit" style="justify-self:start"><i class="fa-brands fa-whatsapp"></i> Open in WhatsApp</button>
</form>
<div class="pg-note warn" style="margin-top:18px"><strong>Stay safe:</strong> we only use the two WhatsApp numbers above. We never ask for your email password or OTP codes.</div></section>`
  });
}

/* ======================================================================
   5) SERVICE PAGES
   ====================================================================== */
const FIELD = {
  platform: `<div><label>Platform</label><select name="Platform"><option>YouTube</option><option>Facebook</option><option>Instagram</option><option>TikTok</option><option>WhatsApp</option><option>Several</option></select></div>`,
  goal: `<div><label>Goal</label><input name="Goal" placeholder="e.g. more sales, channel setup"></div>`,
  budget: `<div><label>Budget</label><input name="Budget" placeholder="e.g. $50 / month or Rs 15,000"></div>`,
  business: `<div><label>Business type</label><input name="Business" placeholder="e.g. clothing store, clinic"></div>`,
  task: `<div><label>What should be automated?</label><input name="Task" placeholder="e.g. WhatsApp replies, lead follow-up"></div>`,
  provider: `<div><label>Provider</label><select name="Provider"><option>Claude (Anthropic)</option><option>OpenAI</option><option>Gemini</option><option>DeepSeek</option><option>Several</option></select></div>`,
  volume: `<div><label>Monthly volume</label><input name="Monthly volume" placeholder="e.g. 50M tokens or $200"></div>`,
  usecase: `<div><label>Use case</label><input name="Use case" placeholder="e.g. support chatbot"></div>`
};
function buildServices() {
  Object.values(CONTENT.services).forEach(s => {
    const url = s.slug + "/";
    const body = rel => `
<div class="pg-wrap">
  ${crumbHtml(rel, [["Home", "index.html"], [s.title, ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="fa-solid fa-briefcase"></i> ${esc(s.eyebrow)}</span>
    <h1>${esc(s.title)}</h1>
    <p class="pg-lead">${esc(s.lead)}</p>
  </section>
  <section class="pg-section" style="padding-top:0">
    <h2>What we offer</h2>
    <div class="pg-grid three">${s.items.map(([ic, t, d]) => `<div class="pg-card"><div class="pg-card-top"><div class="pg-card-icon"><i class="${ic}"></i></div><h3>${esc(t)}</h3></div><p>${esc(d)}</p></div>`).join("")}</div>
  </section>
  ${s.steps ? `<section class="pg-section"><h2>How it works</h2><ol class="pg-steps">${s.steps.map(([a, b]) => `<li><span><strong>${esc(a)}</strong>${esc(b)}</span></li>`).join("")}</ol></section>` : ""}
  <section class="pg-section" id="quote">
    <h2>Get a quote</h2>
    <p>${esc(s.note || "Send your details and we will reply on WhatsApp with a written quote.")}</p>
    <form class="pg-form" data-pg-waform data-intro="Hello MALIK DATA CENTRE! I want a quote for ${esc(s.title)}:">
      <div class="row"><div><label>Your name *</label><input name="Name" required></div>${s.formFields.map(k => FIELD[k]).join("")}</div>
      <div><label>Details</label><textarea name="Details" placeholder="Tell us more..."></textarea></div>
      <button class="btn btn-success" type="submit" style="justify-self:start"><i class="fa-brands fa-whatsapp"></i> Request quote on WhatsApp</button>
    </form>
  </section>
  ${s.slug === "enterprise-ai-api-credits" && FAM["claude-api-tokens"] ? `<section class="pg-section"><h2>Ready-made packs</h2><div class="pg-grid">${familyCard(rel, FAM["claude-api-tokens"])}</div></section>` : ""}
  ${s.slug === "ai-automation-services" ? `<section class="pg-section"><h2>Prefer to build it yourself?</h2><div class="pg-grid">${["n8n-starter", "gumloop-pro", "lovable-pro"].map(k => FAM[k] ? familyCard(rel, FAM[k]) : "").join("")}</div></section>` : ""}
  ${s.slug === "social-media-services" ? `<section class="pg-section"><h2>Tools we use</h2><div class="pg-grid">${["canva-pro", "capcut-pro", "adobe-creative-cloud"].map(k => FAM[k] ? familyCard(rel, FAM[k]) : "").join("")}</div></section>` : ""}
</div>`;
    write(url, page({ urlPath: url, title: `${s.title} | ${BRAND}`, desc: s.lead,
      jsonld: [crumbLd([["Home", ""], [s.title, url]]), { "@context": "https://schema.org", "@type": "Service", name: s.title, description: s.lead, areaServed: "PK", provider: { "@type": "Organization", name: BRAND, url: SITE } }], body }));
  });
}

/* ======================================================================
   6) tool-links.js, homepage block, sitemap, llms.txt
   ====================================================================== */
function buildToolLinks() {
  const pages = {};
  const fams = [];
  FAMILIES.forEach(f => {
    const s = famStats(f);
    if (!s) return;
    s.plans.forEach(p => { pages[p.id] = `tools/${f.slug}/`; });
    f.ids.concat(f.aliases || []).forEach(id => { if (TOOLS.byId[id] && !pages[id]) pages[id] = `tools/${f.slug}/`; });
    fams.push({ slug: f.slug, name: f.name, cat: f.cat, icon: f.icon, min: s.min.price, private: s.plans.some(p => access(p.setup).cls === "private"),
      privMin: Math.min(...s.plans.filter(p => access(p.setup).cls === "private").map(p => p.price).concat([Infinity])),
      blurb: f.intro.split(". ")[0].replace(/\.$/, "") + "." });
  });
  const js = `/* Auto-generated by build-pages.js on ${TODAY}. Do not edit by hand. */\nwindow.MDC_TOOL_PAGES = ${JSON.stringify(pages)};\nwindow.MDC_FAMILIES = ${JSON.stringify(fams)};\n`;
  fs.writeFileSync(path.join(ROOT, "tool-links.js"), js);
}

function updateHomepage() {
  const file = path.join(ROOT, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const A = "<!-- MDC:GUIDES:START -->", B = "<!-- MDC:GUIDES:END -->";
  if (!html.includes(A)) { console.warn("  ! index.html has no MDC:GUIDES markers — homepage block not updated"); return; }
  const fams = FAMILIES.filter(f => famStats(f));
  const block = `${A}
        <section class="mdc-hp-section" id="product-guides">
            <div class="pg-wrap">
                <div class="section-header">
                    <span class="section-badge"><i class="fa-solid fa-book-open"></i> Buying guides</span>
                    <h2 class="section-title">Every tool, <span class="text-gradient">explained</span></h2>
                    <p class="section-subtitle">Full price, plans, access type and warranty for each tool before you order.</p>
                </div>
                <div class="pg-grid">${fams.slice(0, 12).map(f => familyCard("", f)).join("")}</div>
                <div style="text-align:center;margin-top:24px"><a href="tools/" class="btn btn-gradient"><i class="fa-solid fa-layer-group"></i> View all ${fams.length} tool guides</a> <a href="comparisons/" class="btn btn-outline" style="margin-left:6px"><i class="fa-solid fa-scale-balanced"></i> Compare tools</a></div>
            </div>
        </section>

        ${allBlogItems().length ? `<section class="mdc-hp-section" id="latest-guides">
            <div class="pg-wrap">
                <div class="section-header">
                    <span class="section-badge"><i class="fa-solid fa-newspaper"></i> Latest from the blog</span>
                    <h2 class="section-title">Fresh <span class="text-gradient">guides</span></h2>
                </div>
                <div class="pg-grid three">${allBlogItems().slice(0, 3).map(it => blogCard("", it)).join("")}</div>
                <div style="text-align:center;margin-top:22px"><a href="blog/index.html" class="btn btn-outline"><i class="fa-solid fa-newspaper"></i> All guides</a></div>
            </div>
        </section>` : ""}

        <section class="mdc-hp-section" id="design-studio-promo">
            <div class="pg-wrap">
                <a class="pg-card" href="design/" style="flex-direction:row;flex-wrap:wrap;align-items:center;gap:22px;padding:28px;background:linear-gradient(135deg,rgba(124,58,237,.22),rgba(236,72,153,.12));border-color:rgba(124,92,255,.45)">
                    <div class="pg-card-icon" style="width:64px;height:64px;font-size:1.7rem"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                    <div style="flex:1 1 320px">
                        <span class="pg-save">NEW · 100% FREE</span>
                        <h3 style="font-size:1.5rem;margin:8px 0 6px">MDC Design Studio: make thumbnails &amp; posts in your browser</h3>
                        <p>YouTube thumbnails, Instagram posts, WhatsApp status, sale posts, Jumma &amp; Eid designs and flyers. Urdu fonts, ready templates and an AI background remover. No signup.</p>
                    </div>
                    <span class="btn btn-gradient"><i class="fa-solid fa-palette"></i> Start designing</span>
                </a>
            </div>
        </section>

        <section class="mdc-hp-section" id="services-strip">
            <div class="pg-wrap">
                <div class="section-header">
                    <span class="section-badge"><i class="fa-solid fa-briefcase"></i> For businesses</span>
                    <h2 class="section-title">More than <span class="text-gradient">subscriptions</span></h2>
                </div>
                <div class="pg-grid three">
                    <a class="pg-card" href="ai-automation-services/"><div class="pg-card-top"><div class="pg-card-icon"><i class="fa-solid fa-robot"></i></div><h3>AI Automation Services</h3></div><p>WhatsApp AI chatbots, n8n workflows, lead follow-up and custom AI agents built for your business.</p><span class="pg-card-more">Get a quote <i class="fa-solid fa-arrow-right"></i></span></a>
                    <a class="pg-card" href="social-media-services/"><div class="pg-card-top"><div class="pg-card-icon"><i class="fa-solid fa-hashtag"></i></div><h3>Social Media Services</h3></div><p>Channel setup, thumbnails, page management and ad campaigns for YouTube, Facebook, Instagram and TikTok.</p><span class="pg-card-more">See services <i class="fa-solid fa-arrow-right"></i></span></a>
                    <a class="pg-card" href="enterprise-ai-api-credits/"><div class="pg-card-top"><div class="pg-card-icon"><i class="fa-solid fa-plug"></i></div><h3>Enterprise API Credits</h3></div><p>Claude, OpenAI, Gemini and DeepSeek API credits for apps and bots, with a custom quote in USD, USDT or PKR.</p><span class="pg-card-more">Request pricing <i class="fa-solid fa-arrow-right"></i></span></a>
                </div>
            </div>
        </section>

        <section class="mdc-hp-section" id="tool-finder">
            <div class="pg-wrap">
                <div class="mdc-hp-split">
                    <div class="glass-card" style="padding:26px">
                        <h2 style="font-size:1.4rem;margin-bottom:6px"><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--primary)"></i> Tool finder</h2>
                        <p style="color:var(--text-muted);margin-bottom:16px">Tell us what you need and your budget.</p>
                        ${finderHtml()}
                    </div>
                    <div class="glass-card" style="padding:26px" id="request-tool">
                        <h2 style="font-size:1.4rem;margin-bottom:6px"><i class="fa-solid fa-paper-plane" style="color:var(--primary)"></i> Request a tool</h2>
                        <p style="color:var(--text-muted);margin-bottom:16px">Tool not in the catalog? We can arrange many more.</p>
                        ${requestFormHtml()}
                    </div>
                </div>
            </div>
        </section>
        ${B}`;
  const i = html.indexOf(A), j = html.indexOf(B) + B.length;
  html = html.slice(0, i) + block + html.slice(j);
  fs.writeFileSync(file, html);
}

function buildSitemap() {
  const pol = CONTENT.policiesUpdated || PRICE_DATE;
  const items = allBlogItems();
  const latest = [PRICE_DATE, ...(items.length ? [items[0].date] : [])].sort().pop();
  const map = new Map();
  const add = (u, lastmod, freq, pri) => { if (!map.has(u)) map.set(u, [lastmod, freq, pri]); };
  add("", latest, "daily", "1.0");
  add("tools/", PRICE_DATE, "daily", "0.9");
  add("blog/", items.length ? items[0].date : pol, "daily", "0.8");
  add("design/", CONTENT.designUpdated || pol, "monthly", "0.8");
  BUILT.forEach(u => {
    if (u.startsWith("tools/")) add(u, PRICE_DATE, "weekly", "0.8");
    else if (u.startsWith("comparisons/")) add(u, PRICE_DATE, "monthly", "0.7");
    else if (!u.startsWith("blog/")) add(u, pol, "monthly", "0.6");
  });
  items.forEach(it => add(it.href, it.date, "monthly", "0.7"));
  add("privacy.html", pol, "yearly", "0.3"); add("terms.html", pol, "yearly", "0.3"); add("llms.txt", latest, "weekly", "0.5");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...map].map(([u, [l, c, pr]]) =>
    `  <url><loc>${SITE}/${u}</loc><lastmod>${l}</lastmod><changefreq>${c}</changefreq><priority>${pr}</priority></url>`).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
}

function buildLlms() {
  const fams = FAMILIES.filter(f => famStats(f));
  const lines = [
    `# ${BRAND}`, "",
    `> Online store for AI tools and software subscriptions, serving customers worldwide. Prices are set in PKR with approximate USD shown; payment by USDT (Binance) from any country, or EasyPaisa, JazzCash and bank transfer in Pakistan. WhatsApp activation in 5–30 minutes and a written warranty.`, "",
    `Website: ${SITE}/`, `WhatsApp: +92 344 5739206, +92 348 9057646`, `Email: ${EMAIL}`, `Prices last changed: ${PRICE_DATE}`, "",
    "## Tools and starting prices (PKR, approx. USD in brackets)", "",
    ...fams.map(f => { const s = famStats(f); return `- [${f.name}](${SITE}/tools/${f.slug}/): from Rs ${s.min.price.toLocaleString("en-US")} (${usd(s.min.price)}) — ${s.plans.map(p => `${p.duration} Rs ${p.price.toLocaleString("en-US")} / ${usd(p.price)} (${p.setup})`).join("; ")}`; }),
    "", "## Latest guides", "",
    ...allBlogItems().slice(0, 40).map(it => `- [${it.title}](${SITE}/${it.href}): ${it.description}`),
    "", "## Comparisons", "",
    ...CONTENT.comparisons.map(c => `- [${c.short}](${SITE}/comparisons/${c.slug}/)`),
    "", "## Free tools", "",
    `- [MDC Design Studio](${SITE}/design/): free browser design maker for YouTube thumbnails, Instagram posts, WhatsApp status, sale posts, Eid/Jumma designs and flyers, with Urdu fonts and an AI background remover.`,
    "", "## Services", "",
    ...Object.values(CONTENT.services).map(s => `- [${s.title}](${SITE}/${s.slug}/)`),
    "", "## Policies", "",
    `- [Refund & warranty](${SITE}/refund-policy/)`, `- [Delivery](${SITE}/delivery-policy/)`, `- [FAQ](${SITE}/frequently-asked-questions/)`, `- [About](${SITE}/about-us/)`, `- [Contact](${SITE}/contact-us/)`, ""
  ];
  fs.writeFileSync(path.join(ROOT, "llms.txt"), lines.join("\n"));
}


/* ======================================================================
   7) BLOG (Markdown posts in site-content/blog/*.md)
   ====================================================================== */
function allBlogItems() {
  const items = POSTS.map(p => ({ href: `blog/${p.slug}.html`, title: p.title, description: p.description, category: p.category, icon: p.icon, date: p.updated || p.date, readMin: p.readMin }));
  (CONTENT.legacyPosts || []).forEach(l => {
    if (fs.existsSync(path.join(ROOT, "blog", l.file))) items.push({ href: `blog/${l.file}`, title: l.title, description: l.description, category: l.category, icon: l.icon, date: l.date, readMin: l.readMin });
  });
  return items.sort((a, b) => b.date.localeCompare(a.date));
}
function blogCard(rel, it, small) {
  return `<a class="pg-card" href="${rel}${it.href}">
    <span class="blog-card-cat"><i class="${esc(it.icon)}"></i> ${esc(it.category)}</span>
    <h3 style="font-size:${small ? "1rem" : "1.08rem"};line-height:1.35">${esc(it.title)}</h3>
    ${small ? "" : `<p>${esc(it.description)}</p>`}
    <div class="blog-card-meta"><i class="fa-regular fa-calendar"></i> ${human(it.date)} &middot; ${it.readMin} min read</div>
    <span class="pg-card-more">Read guide <i class="fa-solid fa-arrow-right"></i></span>
  </a>`;
}

function buildBlog() {
  POSTS.forEach(p => {
    const url = `blog/${p.slug}.html`;
    const r = MD.render(p.body, { rel: "../" });
    const toolFams = p.tools.map(t => FAM[t]).filter(Boolean);
    const related = allBlogItems().filter(it => it.href !== url).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
    const jsonld = [
      {
        "@context": "https://schema.org", "@type": "BlogPosting",
        headline: p.title, description: p.description, keywords: p.keywords.join(", "),
        datePublished: p.date, dateModified: p.updated || p.date, inLanguage: "en",
        image: `${SITE}/assets/logo.png`, mainEntityOfPage: `${SITE}/${url}`,
        author: { "@type": "Organization", name: `${BRAND} Team`, url: `${SITE}/about-us/` },
        publisher: { "@type": "Organization", name: BRAND, logo: { "@type": "ImageObject", url: `${SITE}/assets/logo.png` } }
      },
      crumbLd([["Home", ""], ["Blog", "blog/"], [p.title, url]]),
      faqLd(r.faqs)
    ].filter(Boolean);
    const body = rel => `
<div class="pg-narrow">
  ${crumbHtml(rel, [["Home", "index.html"], ["Blog", "blog/index.html"], [p.title.length > 48 ? p.title.slice(0, 46) + "…" : p.title, ""]])}
  <article class="article-wrap" style="padding-left:0;padding-right:0">
    <span class="article-cat" style="margin-top:22px"><i class="${esc(p.icon)}"></i> ${esc(p.category)}</span>
    <h1>${esc(p.title)}</h1>
    <div class="article-meta">
      <span><i class="fa-regular fa-calendar"></i> ${p.updated && p.updated !== p.date ? `Updated ${human(p.updated)}` : `Published ${human(p.date)}`}</span>
      <span><i class="fa-regular fa-clock"></i> ${p.readMin} min read</span>
      <span><i class="fa-solid fa-building"></i> ${BRAND} Team</span>
    </div>
    ${p.answer ? `<div class="pg-note" id="quick-answer"><strong>Quick answer:</strong> ${esc(p.answer)}</div>` : ""}
    ${r.headings.length >= 3 ? `<nav class="pg-toc" aria-label="Contents"><strong>In this guide</strong><ol>${r.headings.map(h => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join("")}</ol></nav>` : ""}
    <div class="article-body">${r.html}</div>
    ${toolFams.length ? `<section class="pg-section"><h2>Tools in this guide</h2><div class="pg-grid">${toolFams.map(f => familyCard(rel, f)).join("")}</div></section>` : ""}
    <div class="pg-cta" style="margin-bottom:30px"><h2>Need help choosing?</h2><p>Ask our team on WhatsApp. We reply with the right plan for your budget.</p>
      <div class="pg-cta-btns"><a class="btn btn-success" target="_blank" rel="noopener noreferrer" href="${waLink(`Hello MALIK DATA CENTRE! I read "${p.title}" and need help.`)}"><i class="fa-brands fa-whatsapp"></i> Ask on WhatsApp</a><a class="btn btn-outline" href="${rel}tools/">Browse all tools</a></div></div>
    ${related.length ? `<section class="pg-section"><h2>Related guides</h2><div class="pg-grid">${related.map(it => blogCard(rel, it, true)).join("")}</div></section>` : ""}
    <p class="pg-disclaimer">Prices in this article are ${BRAND} store prices on the date shown and can change; the live price is always on the tool page. Product names are trademarks of their owners.</p>
  </article>
</div>`;
    write(url, page({ urlPath: url, active: "blog", title: `${p.title} | ${BRAND}`, desc: p.description, keywords: p.keywords.join(", "),
      ogType: "article", jsonld, extraCss: ["blog.css"], body }));
  });

  // Blog index
  const items = allBlogItems();
  const cats = [...new Set(items.map(i => i.category))];
  const url = "blog/";
  const body = rel => `
<div class="pg-wrap">
  ${crumbHtml(rel, [["Home", "index.html"], ["Blog", ""]])}
  <section class="pg-hero">
    <span class="pg-eyebrow"><i class="fa-solid fa-newspaper"></i> ${items.length} guides</span>
    <h1>AI tools guides &amp; reviews</h1>
    <p class="pg-lead">Buying guides, comparisons, setup tutorials and price updates for AI tools, written by the ${BRAND} team for buyers worldwide.</p>
  </section>
  <section class="pg-section" style="padding-top:0">
    <div class="pg-filter" data-pg-filter>
      <input type="search" placeholder="Search guides..." aria-label="Search guides" data-pg-search>
      <button class="pg-pill active" data-cat="all" type="button">All</button>
      ${cats.map(c => `<button class="pg-pill" data-cat="${esc(MD.slugify(c))}" type="button">${esc(c)}</button>`).join("")}
    </div>
    <div class="pg-grid three" data-pg-cards>${items.map(it => blogCard(rel, it).replace('<a class="pg-card"', `<a class="pg-card" data-cat="${esc(MD.slugify(it.category))}" data-name="${esc(it.title.toLowerCase())}"`)).join("")}</div>
    <p data-pg-empty hidden style="color:var(--text-muted);margin-top:16px">No guide found.</p>
  </section>
</div>`;
  // blog/index.html (keeps existing /blog/index.html links working)
  const html = page({ urlPath: "blog/index.html", active: "blog", title: `AI Tools Guides, Reviews & Comparisons | ${BRAND} Blog`,
    desc: "Buying guides, comparisons, setup tutorials and price updates for ChatGPT, Gemini, Grok, Canva, Adobe, CapCut, Cursor and more, for buyers worldwide.",
    extraCss: ["blog.css"], jsonld: [{ "@context": "https://schema.org", "@type": "Blog", name: `${BRAND} Blog`, url: `${SITE}/blog/`,
      blogPost: POSTS.slice(0, 20).map(p => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}.html`, datePublished: p.date })) },
      crumbLd([["Home", ""], ["Blog", url]])], body }).replace(`<link rel="canonical" href="${SITE}/blog/index.html">`, `<link rel="canonical" href="${SITE}/blog/">`);
  fs.writeFileSync(path.join(ROOT, "blog", "index.html"), html);
  BUILT.push("blog/");

  // RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${esc(BRAND)} Blog</title><link>${SITE}/blog/</link><description>AI tools guides, reviews and comparisons</description><language>en</language>
<atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items.slice(0, 30).map(it => `<item><title>${esc(it.title)}</title><link>${SITE}/${it.href}</link><guid>${SITE}/${it.href}</guid><pubDate>${new Date(it.date + "T05:00:00Z").toUTCString()}</pubDate><description>${esc(it.description)}</description></item>`).join("\n")}
</channel></rss>
`;
  fs.writeFileSync(path.join(ROOT, "blog", "feed.xml"), rss);
}

/* ---------- run ---------- */
console.log(`Building pages from ${TOOLS.list.length} catalog items and ${FAMILIES.length} tool families...`);
const covered = new Set(FAMILIES.flatMap(f => f.ids.concat(f.aliases || [])));
const uncovered = TOOLS.list.filter(t => !covered.has(t.id)).map(t => `${t.id} (${t.name}, ${t.duration}, Rs ${t.price})`);
FAMILIES.forEach(buildToolPage);
buildToolsIndex();
buildComparisons();
buildPolicies();
buildServices();
buildBlog();
buildToolLinks();
updateHomepage();
buildSitemap();
buildLlms();
console.log(`Done: ${BUILT.length} pages written.`);
if (uncovered.length) console.log(`Catalog items without a tool page (${uncovered.length}):\n  - ` + uncovered.join("\n  - "));
