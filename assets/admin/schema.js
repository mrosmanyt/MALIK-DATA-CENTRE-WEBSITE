/* Admin panel: what every content editor shows. Field keys match the data-cms markers on the site.
   type: text · textarea · rich (supports **bold**, [link](url), "- " lists) · url · image · color · toggle · select · date · number · icon · list */
(function () {
  var COLORS = [["color-purple", "Purple"], ["color-green", "Green"], ["color-blue", "Blue"], ["color-orange", "Orange"], ["color-pink", "Pink"]];
  var ICON_HINT = "Font Awesome icon name, e.g. fa-solid fa-bolt or fa-brands fa-whatsapp. Browse icons at fontawesome.com/icons.";
  var VIEW_HOME = "/index.html";

  window.MDC_SCHEMA = {
    /* ===================== HOMEPAGE ===================== */
    hero: { group: "home", label: "Top banner (hero)", icon: "fa-solid fa-star", view: VIEW_HOME + "#hero-banner-section",
      hint: "The first thing visitors see on the homepage.",
      fields: [
        { k: "eyebrow", label: "Small line above the title", type: "text" },
        { k: "brand", label: "Brand line", type: "text" },
        { k: "title", label: "Big title", type: "text" },
        { k: "lead", label: "Intro paragraph", type: "textarea", rows: 4 },
        { k: "btn1Text", label: "Main button text", type: "text", half: true }, { k: "btn1Link", label: "Main button link", type: "url", half: true },
        { k: "btn2Text", label: "Second button text", type: "text", half: true }, { k: "btn2Link", label: "Second button link", type: "url", half: true, hint: "#catalog-section jumps to the catalog." },
        { k: "facts", label: "Facts strip", type: "list", titleKey: "num", addLabel: "Add a fact", item: [{ k: "num", label: "Bold part", type: "text", half: true }, { k: "text", label: "Rest of the line", type: "text", half: true }] },
        { k: "image", label: "Picture on the right (optional)", type: "image", hint: "Shown on big screens instead of the decorative cards. Leave empty to keep the current look." }
      ] },
    how: { group: "home", label: "How it works", icon: "fa-solid fa-list-ol", view: VIEW_HOME + "#how-section", canHide: true,
      fields: [
        { k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { k: "steps", label: "Steps", type: "list", titleKey: "title", addLabel: "Add a step", item: [
          { k: "title", label: "Step title", type: "text" }, { k: "text", label: "Step text", type: "textarea", rows: 2 },
          { k: "icon", label: "Icon", type: "icon", half: true, hint: ICON_HINT }, { k: "color", label: "Icon colour", type: "select", options: COLORS, half: true }] }
      ] },
    why: { group: "home", label: "Why choose us", icon: "fa-solid fa-award", view: VIEW_HOME + "#why-us-section", canHide: true,
      fields: [
        { k: "title", label: "Title", type: "text" }, { k: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { k: "cards", label: "Cards", type: "list", titleKey: "title", addLabel: "Add a card", item: [
          { k: "title", label: "Title", type: "text" }, { k: "text", label: "Text", type: "textarea", rows: 3 },
          { k: "icon", label: "Icon", type: "icon", half: true, hint: ICON_HINT }, { k: "color", label: "Icon colour", type: "select", options: COLORS, half: true }] }
      ] },
    services: { group: "home", label: "Services strip", icon: "fa-solid fa-briefcase", view: VIEW_HOME + "#services-strip", canHide: true,
      fields: [
        { k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title (first part)", type: "text", half: true }, { k: "highlight", label: "Title (coloured part)", type: "text", half: true },
        { k: "cards", label: "Service cards", type: "list", titleKey: "title", addLabel: "Add a service", item: [
          { k: "title", label: "Title", type: "text" }, { k: "text", label: "Text", type: "textarea", rows: 2 },
          { k: "link", label: "Link", type: "url", half: true }, { k: "more", label: "Link text", type: "text", half: true }, { k: "icon", label: "Icon", type: "icon", hint: ICON_HINT }] }
      ] },
    videos: { group: "home", label: "Videos", icon: "fa-solid fa-circle-play", view: VIEW_HOME + "#video-section", canHide: true,
      fields: [
        { k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { k: "items", label: "Videos", type: "list", titleKey: "caption", addLabel: "Add a video", item: [
          { k: "video", label: "YouTube link or MP4 file address", type: "url", hint: "Paste a YouTube link (watch, youtu.be or Shorts). An MP4 must already be online, e.g. assets/videos/ad-1.mp4." },
          { k: "poster", label: "Cover picture (for MP4)", type: "image" }, { k: "caption", label: "Caption", type: "text" }] }
      ] },
    reviews: { group: "home", label: "Customer reviews", icon: "fa-solid fa-comment-dots", view: VIEW_HOME + "#reviews-section", canHide: true, search: true,
      hint: "Only add reviews from real customers. Proof screenshots open full-size when clicked.",
      fields: [
        { k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { k: "items", label: "Reviews", type: "list", titleKey: "name", subKey: "purchase", addLabel: "Add a review", item: [
          { k: "name", label: "Customer name", type: "text", half: true }, { k: "purchase", label: "What they bought", type: "text", half: true },
          { k: "text", label: "Review", type: "textarea", rows: 3 },
          { k: "rating", label: "Stars", type: "select", options: [[5, "★★★★★"], [4, "★★★★"], [3, "★★★"]], half: true }, { k: "color", label: "Avatar colour", type: "select", options: COLORS, half: true },
          { k: "image", label: "Proof screenshot", type: "image" },
          { k: "date", label: "Date shown", type: "text", half: true, ph: "June 15, 2026" }, { k: "badge", label: "Badge text", type: "text", half: true, ph: "Setup Done" }] }
      ] },
    refund: { group: "home", label: "Refund promise", icon: "fa-solid fa-handshake-angle", view: VIEW_HOME + "#refund-policy-section", canHide: true,
      fields: [
        { k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "desc", label: "Text", type: "rich", rows: 3 },
        { k: "steps", label: "Steps", type: "list", titleKey: "title", addLabel: "Add a step", item: [{ k: "title", label: "Title", type: "text" }, { k: "text", label: "Text", type: "text" }, { k: "icon", label: "Icon", type: "icon", hint: ICON_HINT }] },
        { k: "note", label: "Note under the steps", type: "text" }
      ] },
    faq: { group: "home", label: "FAQ", icon: "fa-solid fa-circle-question", view: VIEW_HOME + "#faq-section", canHide: true, search: true,
      fields: [
        { k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { k: "items", label: "Questions", type: "list", titleKey: "q", addLabel: "Add a question", item: [
          { k: "q", label: "Question", type: "text" }, { k: "a", label: "Answer", type: "rich", rows: 4 },
          { k: "category", label: "Filter tab", type: "select", options: [["delivery", "Delivery & Setup"], ["warranty", "Warranty & Refunds"], ["payment", "Payment & USDT"], ["privacy", "Account Privacy"]], half: true },
          { k: "icon", label: "Icon", type: "icon", half: true, hint: ICON_HINT }] }
      ] },
    payments: { group: "home", label: "Payment methods", icon: "fa-solid fa-credit-card", view: VIEW_HOME + "#payments-section", canHide: true, owner: true,
      hint: "Only names are shown here. Account numbers are never put on the website: they are sent on WhatsApp.",
      fields: [
        { k: "title", label: "Title", type: "text" },
        { k: "items", label: "Methods", type: "list", titleKey: "name", addLabel: "Add a method", item: [
          { k: "name", label: "Name", type: "text", half: true },
          { k: "style", label: "Colour style", type: "select", half: true, options: [["pay-easypaisa", "Green (EasyPaisa)"], ["pay-jazzcash", "Red (JazzCash)"], ["pay-meezan", "Purple (Meezan)"], ["pay-bank", "Blue (Bank)"], ["pay-binance", "Gold (Binance)"]] },
          { k: "icon", label: "Icon", type: "icon", hint: ICON_HINT }] },
        { k: "note", label: "Note", type: "text" }
      ] },
    referral: { group: "home", label: "Refer & earn", icon: "fa-solid fa-gift", view: VIEW_HOME + "#referral-section", canHide: true,
      fields: [{ k: "badge", label: "Small badge", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "text", label: "Text", type: "textarea", rows: 3 }] },

    /* ===================== STORE ===================== */
    tools: { group: "store", label: "Tools & prices", icon: "fa-solid fa-tags", view: "/index.html#catalog-section", search: true,
      hint: "Changes show on the homepage catalog and on each tool's guide page. Prices are in Pakistani rupees (other currencies are converted automatically).",
      fields: [{ k: "items", label: "Tools", type: "list", titleKey: "name", subKey: "duration", addLabel: "Add a new tool", compact: ["price", "originalPrice", "stock"], diffBy: "id", newItem: { isNew: true, stock: "in", ribbon: "", specs: "" },
        item: [
          { k: "name", label: "Tool name", type: "text", half: true }, { k: "duration", label: "Plan / duration", type: "text", half: true },
          { k: "price", label: "Price (Rs)", type: "number", half: true }, { k: "originalPrice", label: "Old price (crossed out, Rs)", type: "number", half: true, hint: "Leave equal to the price, or 0, to hide it." },
          { k: "stock", label: "Stock", type: "select", options: [["in", "In stock"], ["out", "Out of stock (Buy button disabled)"]], half: true },
          { k: "ribbon", label: "Ribbon", type: "select", options: [["", "None"], ["bestseller", "Best Seller"], ["popular", "Popular"], ["custom", "My own text…"]], half: true },
          { k: "badge", label: "Ribbon text (when 'My own text')", type: "text", ph: "e.g. New, Limited, Eid offer" },
          { k: "category", label: "Category", type: "select", optionsFrom: "categories" },
          { k: "setup", label: "Account type", type: "text", ph: "e.g. Activated on Client Email" },
          { k: "desc", label: "Short description", type: "textarea", rows: 2 },
          { k: "specs", label: "Features (one per line)", type: "textarea", rows: 4 },
          { k: "image", label: "Logo / picture (new tools)", type: "image", hint: "Optional. Existing tools keep their built-in logo unless you add a picture." },
          { k: "id", label: "Tool ID", type: "text", readonlyExisting: true, hint: "Short unique name, e.g. notebooklm-pro-1m. It can't be changed later." }] }] },
    coupons: { group: "store", label: "Coupons", icon: "fa-solid fa-ticket", view: "/index.html#catalog-section",
      hint: "Codes customers type in the coupon box. The discount is added to their WhatsApp order message.",
      fields: [{ k: "items", label: "Coupon codes", type: "list", titleKey: "code", addLabel: "Add a coupon", newItem: { active: true, chip: false, percent: 10 }, item: [
        { k: "code", label: "Code", type: "text", half: true, upper: true, ph: "EID20" }, { k: "percent", label: "Discount %", type: "number", half: true, min: 1, max: 90 },
        { k: "active", label: "Active", type: "toggle", half: true }, { k: "chip", label: "Show as a quick button under the box", type: "toggle", half: true },
        { k: "expires", label: "Expires on (optional)", type: "date", half: true }, { k: "note", label: "Private note", type: "text", half: true }] }] },

    /* ===================== SITE-WIDE ===================== */
    contact: { group: "site", label: "Contact & social links", icon: "fa-solid fa-address-book", owner: true,
      hint: "Changing a number updates every WhatsApp button on the website, including order buttons.",
      fields: [
        { k: "orderWhatsapp", label: "Orders WhatsApp number", type: "text", half: true, hint: "With country code, no + or spaces, e.g. 923489057646" },
        { k: "supportWhatsapp", label: "Support WhatsApp number", type: "text", half: true, hint: "With country code, e.g. 923445739206" },
        { k: "channel", label: "WhatsApp channel link", type: "url" }, { k: "community", label: "WhatsApp community link", type: "url" },
        { k: "youtube", label: "YouTube", type: "url", half: true }, { k: "facebook", label: "Facebook", type: "url", half: true }, { k: "x", label: "X (Twitter)", type: "url", half: true },
        { k: "footerNote", label: "Footer text", type: "textarea", rows: 2 }
      ] },
    announcement: { group: "site", label: "Announcement bar", icon: "fa-solid fa-bullhorn", view: "/",
      hint: "A thin bar at the top of every page, e.g. for a sale or holiday hours.",
      fields: [
        { k: "on", label: "Show the bar", type: "toggle" }, { k: "text", label: "Message", type: "text", ph: "Eid sale: 20% off all Canva and CapCut plans!" },
        { k: "linkText", label: "Button text", type: "text", half: true }, { k: "link", label: "Button link", type: "url", half: true },
        { k: "bg", label: "Background colour", type: "color", half: true }, { k: "color", label: "Text colour", type: "color", half: true },
        { k: "start", label: "Start date (optional)", type: "date", half: true }, { k: "end", label: "End date (optional)", type: "date", half: true },
        { k: "dismissible", label: "Visitors can close it", type: "toggle" }
      ] },
    popup: { group: "site", label: "Popup", icon: "fa-regular fa-window-restore", view: "/",
      hint: "A box that opens after a few seconds. Use it sparingly so it doesn't annoy visitors.",
      fields: [
        { k: "on", label: "Show the popup", type: "toggle" }, { k: "image", label: "Picture", type: "image" },
        { k: "title", label: "Title", type: "text" }, { k: "text", label: "Text", type: "textarea", rows: 2 },
        { k: "buttonText", label: "Button text", type: "text", half: true }, { k: "link", label: "Button link", type: "url", half: true },
        { k: "pages", label: "Show on", type: "select", half: true, options: [["home", "Homepage only"], ["all", "Every page"], ["tools", "Tool guide pages"], ["blog", "Blog"], ["home,tools", "Homepage + tool pages"]] },
        { k: "frequency", label: "How often", type: "select", half: true, options: [["session", "Once per visit"], ["day", "Once a day"], ["week", "Once a week"], ["once", "Only once ever"]] },
        { k: "delay", label: "Wait before showing (seconds)", type: "number", half: true, min: 0, max: 60 },
        { k: "start", label: "Start date (optional)", type: "date", half: true }, { k: "end", label: "End date (optional)", type: "date", half: true }
      ] },
    extras: { group: "site", label: "Shop extras", icon: "fa-solid fa-sliders",
      hint: "Switch the homepage sales widgets on or off.",
      fields: [
        { k: "toasts", label: "\"Someone just bought…\" pop-ups", type: "toggle", hint: "These show sample names, not live orders. Turn them off if you prefer to show only real activity." },
        { k: "counter", label: "Live buyers counter", type: "toggle" }, { k: "countdown", label: "Deal countdown timer", type: "toggle" }
      ] },
    pages: { group: "site", label: "Page headings", icon: "fa-regular fa-file-lines", search: true,
      hint: "The big heading and intro at the top of each page.",
      fields: [{ k: "items", label: "Pages", type: "list", titleKey: "path", subKey: "heading", noAdd: true, noDelete: true, diffBy: "path", item: [
        { k: "path", label: "Page", type: "text", readonly: true }, { k: "heading", label: "Heading", type: "text" }, { k: "intro", label: "Intro", type: "rich", rows: 3 }] }] },
    seo: { group: "site", label: "Google & sharing", icon: "fa-brands fa-google", search: true,
      hint: "What Google and WhatsApp/Facebook show for each page. Titles around 50–60 characters and descriptions around 150 work best.",
      fields: [{ k: "items", label: "Pages", type: "list", titleKey: "path", subKey: "title", noAdd: true, noDelete: true, diffBy: "path", item: [
        { k: "path", label: "Page", type: "text", readonly: true }, { k: "title", label: "Title in Google", type: "text", counter: 60 },
        { k: "description", label: "Description in Google", type: "textarea", rows: 3, counter: 160 }, { k: "image", label: "Share picture (1200×630)", type: "image" }] }] },

    /* ===================== BLOG ===================== */
    blog: { group: "blog", label: "Blog posts", icon: "fa-solid fa-newspaper", view: "/blog/",
      hint: "New articles get their own page at /blog/p/your-slug/ in the site design, appear at the top of the blog and in the sitemap.",
      fields: [{ k: "posts", label: "Posts", type: "list", titleKey: "title", subKey: "date", addLabel: "Write a new post", newItem: { published: true, category: "Guide" }, item: [
        { k: "title", label: "Title", type: "text" },
        { k: "slug", label: "Web address", type: "slug", from: "title", hint: "Letters, numbers and dashes. The post will be at /blog/p/<this>/" },
        { k: "date", label: "Date", type: "date", half: true }, { k: "category", label: "Category", type: "text", half: true, ph: "Guide, News, Comparison…" },
        { k: "description", label: "Short summary (also used by Google)", type: "textarea", rows: 2, counter: 160 },
        { k: "cover", label: "Cover picture", type: "image" },
        { k: "body", label: "Article", type: "rich", rows: 16, big: true, hint: "## Heading · **bold** · [link text](https://…) · - bullet list · ![picture](https://…) on its own line" },
        { k: "published", label: "Published (visible on the site)", type: "toggle" }] }] }
  };

  window.MDC_GROUPS = [
    { id: "home", label: "Homepage", icon: "fa-solid fa-house" },
    { id: "store", label: "Store", icon: "fa-solid fa-store" },
    { id: "site", label: "Site-wide", icon: "fa-solid fa-globe" },
    { id: "blog", label: "Blog", icon: "fa-solid fa-newspaper" }
  ];
})();
