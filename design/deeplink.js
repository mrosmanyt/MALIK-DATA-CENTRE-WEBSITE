/* ==========================================================================
   Postly Design Studio — links from the tool pages + phone sharing
   /design/?tool=thumbnail|ads|banner|qr|bgremove|instagram|eid|wedding|flyer|menu|card|aiimage
   /design/?tpl=TEMPLATE_ID   (opens that template on a new page)
   ========================================================================== */
(function () {
  "use strict";
  const S = window.MDC_STUDIO; if (!S) return;
  const c = S.canvas;
  const $ = s => document.querySelector(s);

  /* ---------------- share (Web Share API) ---------------- */
  async function share() {
    document.querySelectorAll(".ds-menu").forEach(x => x.classList.remove("open"));
    const [W, H] = S.size, el = S.renderToCanvas(1);
    const blob = await new Promise(r => el.toBlob(r, "image/png"));
    const file = new File([blob], `postly-design-${W}x${H}.png`, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "My design", text: "Made with Postly Design Studio" }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    S.saveBlob(blob, file.name);
    S.toast("Sharing isn't available in this browser, so the image was downloaded. Open WhatsApp or Instagram and attach it.", 5500);
  }
  document.querySelectorAll('[data-act="share"]').forEach(b => b.addEventListener("click", share));

  /* ---------------- deep links ---------------- */
  const q = new URLSearchParams(location.search);
  const tool = (q.get("tool") || "").toLowerCase(), tpl = q.get("tpl"), ytLink = q.get("yt"), title = (q.get("title") || "").slice(0, 140);
  if (!tool && !tpl && !ytLink && !title) { window.MDC_SHARE = share; return; }
  const hasWork = () => S.userObjects().length > 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function freshPage() {
    if (!hasWork()) return;
    const add = $("#page-add"); if (!add) return;
    add.click(); await wait(500);
  }
  async function openTemplate(id) {
    const t = MDC_TEMPLATES.find(x => x.id === id); if (!t) return false;
    await freshPage(); await S.loadTemplate(t); return true;
  }
  function searchTemplates(words, cat) {
    S.openPanel("templates");
    const chip = document.querySelector(`#tpl-filter [data-cat="${cat || "All"}"]`); if (chip) chip.click();
    const box = $("#tpl-search"); if (box) { box.value = words || ""; box.dispatchEvent(new Event("input")); }
  }
  const focus = (sel, panel) => { S.openPanel(panel); setTimeout(() => { const el = $(sel); if (el) { el.scrollIntoView({ block: "center" }); el.focus && el.focus(); } }, 150); };
  const ACTIONS = {
    thumbnail: async () => { focus("#th-title", "kit"); S.toast("Type your video title and tap “Make 3 thumbnail ideas”, or pick a layout under Thumbnail templates.", 6000); },
    ads: async () => { searchTemplates("", "Ads"); S.toast("Pick an ad template. Then make every size in YT & Ads, or turn it into a video in Animate.", 6000); },
    banner: async () => { await openTemplate("kit-banner-bold"); if (window.MDC_PRO) window.MDC_PRO.setSafe(true); searchTemplates("kit-", "YouTube"); S.toast("Keep your channel name and text inside the green safe area.", 5000); },
    qr: async () => { focus("#qr-value", "elements"); S.toast("Enter your WhatsApp number or link, then tap Add QR code.", 5000); },
    bgremove: async () => { S.openPanel("uploads"); S.toast("Upload a photo, select it, then tap Remove BG in the toolbar.", 6000); },
    instagram: async () => { searchTemplates("sale|reel|quote|giveaway|arrivals|thank", "All"); },
    eid: async () => { searchTemplates("eid|ramadan|jumma|iftar", "All"); },
    wedding: async () => { searchTemplates("", "Wedding"); },
    flyer: async () => { searchTemplates("admission|opening|camp|plots|webinar|hiring|clinic|tuition", "All"); },
    menu: async () => { searchTemplates("menu|deal|price|pizza", "All"); },
    card: async () => { searchTemplates("", "Cards"); },
    animate: async () => { S.openPanel("animate"); S.toast("Pick a one-click style, press Preview, then download a video or GIF.", 6000); },
    aiimage: async () => { focus("#ai-img-q", "ai"); }
  };
  // run after the studio has restored the last design
  setTimeout(async () => {
    try {
      if (tpl) await openTemplate(tpl);
      if (ACTIONS[tool]) await ACTIONS[tool]();
      if (title || ytLink) {
        S.openPanel("kit");
        if (title) { const t = $("#th-title"); if (t) t.value = title; }
        if (ytLink) { const l = $("#yt-link"); if (l) { l.value = ytLink; const b = $("#yt-import"); if (b) b.click(); } }
        else focus("#th-make", "kit");
      }
    } catch (e) { console.warn(e); }
    // keep the address clean so a refresh doesn't repeat the action
    if (history.replaceState) history.replaceState(null, "", location.pathname);
  }, 1200);
  window.MDC_SHARE = share;
})();
