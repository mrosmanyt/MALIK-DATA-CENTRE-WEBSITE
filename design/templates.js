/* ==========================================================================
   Postly Design Studio — template library
   Each template is plain data. Coordinates are in design pixels.
   Object types: text, rect, circle, tri, star, line, photo (image frame)
   Gradient fill: { g: [angleDeg, ["#c1", 0], ["#c2", 1]] }
   To add a template: copy one block, change it, reload the page.
   ========================================================================== */
window.MDC_SIZES = [
  { id: "ig", name: "Instagram post", w: 1080, h: 1080, cat: "Instagram" },
  { id: "ig45", name: "Instagram portrait", w: 1080, h: 1350, cat: "Instagram" },
  { id: "story", name: "Story / WhatsApp status", w: 1080, h: 1920, cat: "Status" },
  { id: "yt", name: "YouTube thumbnail", w: 1280, h: 720, cat: "YouTube" },
  { id: "fb", name: "Facebook post", w: 1200, h: 630, cat: "Facebook" },
  { id: "fbcover", name: "Facebook cover", w: 1640, h: 624, cat: "Facebook" },
  { id: "ytbanner", name: "YouTube banner", w: 2560, h: 1440, cat: "YouTube" },
  { id: "a4", name: "Flyer / poster (A4)", w: 1240, h: 1754, cat: "Print" },
  { id: "card", name: "Business card", w: 1050, h: 600, cat: "Print" },
  { id: "logo", name: "Logo", w: 1000, h: 1000, cat: "Brand" },
  { id: "pres", name: "Presentation (16:9)", w: 1920, h: 1080, cat: "Other" },
  { id: "linkedin", name: "LinkedIn post", w: 1200, h: 1200, cat: "Other" }
];

(function () {
  const A = "Anton", B = "Bebas Neue", O = "Outfit", M = "Montserrat", P = "Poppins", PF = "Playfair Display",
        PC = "Pacifico", L = "Lobster", U = "Noto Nastaliq Urdu", AM = "Amiri", I = "Inter";
  const sh = (c = "rgba(0,0,0,.55)", b = 18, x = 0, y = 6) => ({ c, b, x, y });

  window.MDC_TEMPLATES = [
    /* ---------------- YouTube ---------------- */
    {
      id: "yt-challenge", name: "Challenge thumbnail", cat: "YouTube", w: 1280, h: 720,
      bg: { g: [120, ["#ff1e3c", 0], ["#5b0012", 1]] },
      objects: [
        { t: "circle", l: 840, top: 40, r: 330, fill: "rgba(255,255,255,.08)" },
        { t: "photo", l: 760, top: 70, w: 480, h: 620, rx: 24, name: "Your photo" },
        { t: "text", text: "I TRIED IT\nFOR 30 DAYS", l: 50, top: 120, w: 760, size: 128, font: A, fill: "#ffe600", stroke: "#000", sw: 10, lh: 0.95, shadow: sh("rgba(0,0,0,.6)", 0, 8, 8) },
        { t: "rect", l: 54, top: 470, w: 330, h: 88, fill: "#000", rx: 14, angle: -3 },
        { t: "text", text: "SHOCKING!", l: 70, top: 478, w: 300, size: 66, font: B, fill: "#fff", align: "center", angle: -3 }
      ]
    },
    {
      id: "yt-tutorial", name: "Tutorial thumbnail", cat: "YouTube", w: 1280, h: 720,
      bg: { g: [135, ["#0f172a", 0], ["#1e3a8a", 1]] },
      objects: [
        { t: "photo", l: 0, top: 0, w: 560, h: 720, name: "Your photo" },
        { t: "rect", l: 560, top: 0, w: 720, h: 720, fill: { g: [90, ["rgba(15,23,42,.0)", 0], ["#0f172a", 0.25]] } },
        { t: "rect", l: 600, top: 120, w: 250, h: 60, fill: "#22c55e", rx: 30 },
        { t: "text", text: "STEP BY STEP", l: 600, top: 131, w: 250, size: 34, font: B, fill: "#04130a", align: "center" },
        { t: "text", text: "HOW TO EARN\nONLINE IN 2026", l: 600, top: 205, w: 640, size: 96, font: A, fill: "#fff", lh: 1.0, shadow: sh() },
        { t: "text", text: "Beginner friendly · No investment", l: 604, top: 455, w: 620, size: 38, font: P, fill: "#93c5fd", weight: 600 }
      ]
    },
    {
      id: "yt-versus", name: "Versus / review", cat: "YouTube", w: 1280, h: 720,
      bg: { g: [90, ["#6d28d9", 0], ["#db2777", 1]] },
      objects: [
        { t: "photo", l: 60, top: 160, w: 470, h: 400, rx: 28, name: "Left photo" },
        { t: "photo", l: 750, top: 160, w: 470, h: 400, rx: 28, name: "Right photo" },
        { t: "circle", l: 540, top: 260, r: 100, fill: "#facc15", stroke: "#000", sw: 8 },
        { t: "text", text: "VS", l: 540, top: 292, w: 200, size: 120, font: A, fill: "#000", align: "center" },
        { t: "text", text: "WHICH ONE IS BETTER?", l: 40, top: 40, w: 1200, size: 86, font: A, fill: "#fff", align: "center", stroke: "#000", sw: 6 },
        { t: "text", text: "HONEST REVIEW", l: 40, top: 600, w: 1200, size: 58, font: B, fill: "#fde047", align: "center", cs: 200 }
      ]
    },

    /* ---------------- Instagram / business ---------------- */
    {
      id: "ig-sale", name: "Mega sale post", cat: "Business", w: 1080, h: 1080,
      bg: "#0d0d12",
      objects: [
        { t: "photo", l: 540, top: 380, w: 500, h: 620, rx: 30, name: "Product photo" },
        { t: "text", text: "MEGA", l: 60, top: 70, w: 900, size: 120, font: A, fill: "#fff", cs: 60 },
        { t: "text", text: "SALE", l: 52, top: 170, w: 900, size: 250, font: A, fill: "#ff3d57", lh: 0.9 },
        { t: "circle", l: 80, top: 480, r: 175, fill: "#ffd60a" },
        { t: "text", text: "UP TO\n50%\nOFF", l: 80, top: 545, w: 350, size: 74, font: A, fill: "#111", align: "center", lh: 0.95 },
        { t: "text", text: "Limited time only · Order on WhatsApp", l: 60, top: 880, w: 460, size: 34, font: P, fill: "#d4d4d8", weight: 600, lh: 1.3 },
        { t: "text", text: "03XX-XXXXXXX", l: 60, top: 980, w: 460, size: 44, font: O, fill: "#ffd60a", weight: 800 }
      ]
    },
    {
      id: "ig-launch", name: "New product launch", cat: "Business", w: 1080, h: 1080,
      bg: { g: [160, ["#fdf2f8", 0], ["#e0e7ff", 1]] },
      objects: [
        { t: "circle", l: 290, top: 210, r: 250, fill: "#ffffff", shadow: sh("rgba(99,102,241,.25)", 60, 0, 20) },
        { t: "photo", l: 340, top: 260, w: 400, h: 400, shape: "circle", name: "Product photo" },
        { t: "text", text: "NEW ARRIVAL", l: 0, top: 80, w: 1080, size: 40, font: M, fill: "#6366f1", weight: 900, align: "center", cs: 500 },
        { t: "text", text: "Your Product Name", l: 0, top: 760, w: 1080, size: 82, font: PF, fill: "#1e1b4b", weight: 900, align: "center" },
        { t: "text", text: "Short line about what makes it special", l: 140, top: 870, w: 800, size: 34, font: P, fill: "#4c4f6b", align: "center" },
        { t: "rect", l: 390, top: 950, w: 300, h: 74, fill: "#1e1b4b", rx: 37 },
        { t: "text", text: "SHOP NOW", l: 390, top: 966, w: 300, size: 36, font: M, fill: "#fff", weight: 700, align: "center", cs: 200 }
      ]
    },
    {
      id: "ig-food", name: "Food deal post", cat: "Business", w: 1080, h: 1080,
      bg: { g: [180, ["#7c2d12", 0], ["#1c0a04", 1]] },
      objects: [
        { t: "photo", l: 90, top: 300, w: 900, h: 520, rx: 36, name: "Food photo" },
        { t: "text", text: "Weekend Deal", l: 0, top: 70, w: 1080, size: 96, font: L, fill: "#fde68a", align: "center", shadow: sh() },
        { t: "text", text: "Zinger Burger + Fries + Drink", l: 0, top: 195, w: 1080, size: 44, font: P, fill: "#fff", weight: 600, align: "center" },
        { t: "star", l: 790, top: 230, r: 140, points: 14, inner: 0.82, fill: "#ef4444", stroke: "#fde68a", sw: 6 },
        { t: "text", text: "ONLY\nRs 999", l: 800, top: 300, w: 260, size: 56, font: A, fill: "#fff", align: "center", lh: 1 },
        { t: "text", text: "📞 03XX-XXXXXXX   ·   🛵 Free home delivery", l: 0, top: 880, w: 1080, size: 36, font: P, fill: "#fde68a", weight: 600, align: "center" },
        { t: "text", text: "Your Restaurant Name", l: 0, top: 960, w: 1080, size: 46, font: O, fill: "#fff", weight: 800, align: "center" }
      ]
    },
    {
      id: "ig-property", name: "Property for sale", cat: "Business", w: 1080, h: 1350,
      bg: "#f8fafc",
      objects: [
        { t: "photo", l: 0, top: 0, w: 1080, h: 760, name: "Property photo" },
        { t: "rect", l: 60, top: 680, w: 520, h: 140, fill: "#0f766e", rx: 10 },
        { t: "text", text: "FOR SALE", l: 60, top: 700, w: 520, size: 96, font: A, fill: "#fff", align: "center" },
        { t: "text", text: "10 Marla House · DHA Phase 6", l: 60, top: 870, w: 960, size: 56, font: O, fill: "#0f172a", weight: 800 },
        { t: "text", text: "🛏 5 Beds    🛁 6 Baths    🚗 2 Cars", l: 60, top: 960, w: 960, size: 40, font: P, fill: "#334155" },
        { t: "line", x1: 60, y1: 1050, x2: 1020, y2: 1050, stroke: "#cbd5e1", sw: 3 },
        { t: "text", text: "Call / WhatsApp: 03XX-XXXXXXX", l: 60, top: 1090, w: 960, size: 44, font: P, fill: "#0f766e", weight: 800 },
        { t: "text", text: "Your Agency Name", l: 60, top: 1170, w: 960, size: 36, font: M, fill: "#64748b", weight: 700 }
      ]
    },
    {
      id: "ig-hiring", name: "We are hiring", cat: "Business", w: 1080, h: 1080,
      bg: { g: [135, ["#111827", 0], ["#1f2937", 1]] },
      objects: [
        { t: "rect", l: 0, top: 0, w: 1080, h: 18, fill: "#f59e0b" },
        { t: "text", text: "WE ARE", l: 80, top: 110, w: 900, size: 90, font: A, fill: "#fff" },
        { t: "text", text: "HIRING!", l: 76, top: 205, w: 900, size: 190, font: A, fill: "#f59e0b", lh: 0.9 },
        { t: "text", text: "• Graphic Designer\n• Video Editor\n• Social Media Manager", l: 84, top: 470, w: 900, size: 52, font: P, fill: "#e5e7eb", weight: 600, lh: 1.45 },
        { t: "rect", l: 80, top: 800, w: 920, h: 170, fill: "rgba(245,158,11,.12)", rx: 20, stroke: "#f59e0b", sw: 3 },
        { t: "text", text: "Send your CV: jobs@yourcompany.com\nLahore · Full time · Apply by 30 Nov", l: 110, top: 828, w: 860, size: 40, font: P, fill: "#fff", lh: 1.4 }
      ]
    },
    {
      id: "ig-webinar", name: "Free class / webinar", cat: "Education", w: 1080, h: 1080,
      bg: { g: [145, ["#042f2e", 0], ["#0e7490", 1]] },
      objects: [
        { t: "circle", l: 700, top: -120, r: 300, fill: "rgba(255,255,255,.06)" },
        { t: "rect", l: 80, top: 100, w: 300, h: 64, fill: "#fbbf24", rx: 32 },
        { t: "text", text: "FREE WEBINAR", l: 80, top: 113, w: 300, size: 36, font: B, fill: "#111", align: "center", cs: 120 },
        { t: "text", text: "Learn AI Tools\nfor Freelancing", l: 80, top: 210, w: 920, size: 104, font: O, fill: "#fff", weight: 900, lh: 1.02 },
        { t: "photo", l: 640, top: 560, w: 360, h: 360, shape: "circle", name: "Speaker photo" },
        { t: "text", text: "📅 Sunday, 30 Nov\n⏰ 8:00 PM (PKT)\n💻 Live on Zoom", l: 84, top: 560, w: 520, size: 46, font: P, fill: "#ccfbf1", weight: 600, lh: 1.5 },
        { t: "text", text: "Register: link in bio", l: 84, top: 900, w: 520, size: 40, font: O, fill: "#fbbf24", weight: 800 }
      ]
    },

    /* ---------------- Islamic & occasions ---------------- */
    {
      id: "jumma", name: "Jumma Mubarak", cat: "Islamic", w: 1080, h: 1080,
      bg: { g: [180, ["#064e3b", 0], ["#022c22", 1]] },
      objects: [
        { t: "circle", l: 140, top: 140, r: 400, fill: "rgba(0,0,0,0)", stroke: "rgba(234,179,8,.45)", sw: 3 },
        { t: "circle", l: 180, top: 180, r: 360, fill: "rgba(0,0,0,0)", stroke: "rgba(234,179,8,.25)", sw: 2 },
        { t: "star", l: 510, top: 150, r: 30, points: 8, inner: 0.5, fill: "#eab308" },
        { t: "text", text: "جمعہ مبارک", l: 0, top: 300, w: 1080, size: 150, font: U, fill: "#fde68a", align: "center", lh: 1.6, shadow: sh("rgba(0,0,0,.4)", 20, 0, 4) },
        { t: "text", text: "JUMMA MUBARAK", l: 0, top: 640, w: 1080, size: 54, font: PF, fill: "#fff", align: "center", cs: 400, weight: 700 },
        { t: "text", text: "May Allah bless you and your family", l: 140, top: 740, w: 800, size: 34, font: P, fill: "#a7f3d0", align: "center" },
        { t: "text", text: "Your Name / Business", l: 0, top: 960, w: 1080, size: 30, font: P, fill: "#eab308", align: "center", weight: 600 }
      ]
    },
    {
      id: "eid", name: "Eid Mubarak", cat: "Islamic", w: 1080, h: 1350,
      bg: { g: [180, ["#1e1b4b", 0], ["#0b0a24", 1]] },
      objects: [
        { t: "circle", l: 640, top: 90, r: 150, fill: "#fcd34d" },
        { t: "circle", l: 590, top: 60, r: 150, fill: "#1e1b4b" },
        { t: "star", l: 330, top: 160, r: 22, points: 5, inner: 0.45, fill: "#fde68a" },
        { t: "star", l: 860, top: 400, r: 16, points: 5, inner: 0.45, fill: "#fde68a" },
        { t: "star", l: 160, top: 460, r: 14, points: 5, inner: 0.45, fill: "#fde68a" },
        { t: "text", text: "عید مبارک", l: 0, top: 470, w: 1080, size: 170, font: AM, fill: "#fcd34d", align: "center", weight: 700 },
        { t: "text", text: "Eid Mubarak", l: 0, top: 760, w: 1080, size: 120, font: PC, fill: "#fff", align: "center", shadow: sh("rgba(252,211,77,.35)", 30, 0, 0) },
        { t: "text", text: "Wishing you joy, peace and blessings", l: 140, top: 950, w: 800, size: 38, font: P, fill: "#c7d2fe", align: "center" },
        { t: "text", text: "From: Your Name", l: 0, top: 1180, w: 1080, size: 36, font: P, fill: "#fcd34d", align: "center", weight: 600 }
      ]
    },
    {
      id: "birthday", name: "Happy birthday", cat: "Occasions", w: 1080, h: 1350,
      bg: { g: [150, ["#fce7f3", 0], ["#fbcfe8", 1]] },
      objects: [
        { t: "photo", l: 290, top: 300, w: 500, h: 500, shape: "circle", name: "Photo" },
        { t: "circle", l: 270, top: 280, r: 270, fill: "rgba(0,0,0,0)", stroke: "#ec4899", sw: 10 },
        { t: "text", text: "🎉 🎈 🎂", l: 0, top: 110, w: 1080, size: 110, font: I, fill: "#000", align: "center" },
        { t: "text", text: "Happy Birthday", l: 0, top: 880, w: 1080, size: 120, font: PC, fill: "#be185d", align: "center" },
        { t: "text", text: "NAME HERE", l: 0, top: 1070, w: 1080, size: 70, font: M, fill: "#831843", align: "center", weight: 900, cs: 300 }
      ]
    },

    /* ---------------- Status / quotes ---------------- */
    {
      id: "status-quote", name: "Quote status", cat: "Status", w: 1080, h: 1920,
      bg: { g: [160, ["#0f0c29", 0], ["#302b63", 0.55], ["#24243e", 1]] },
      objects: [
        { t: "text", text: "“", l: 80, top: 330, w: 300, size: 400, font: PF, fill: "rgba(255,255,255,.12)" },
        { t: "text", text: "Success doesn't come from what you do occasionally. It comes from what you do consistently.", l: 110, top: 640, w: 860, size: 78, font: PF, fill: "#fff", weight: 700, lh: 1.25 },
        { t: "rect", l: 112, top: 1260, w: 120, h: 8, fill: "#a78bfa" },
        { t: "text", text: "@yourname", l: 110, top: 1300, w: 860, size: 44, font: P, fill: "#c4b5fd", weight: 600 }
      ]
    },
    {
      id: "status-urdu", name: "Urdu poetry status", cat: "Status", w: 1080, h: 1920,
      bg: { g: [180, ["#3b0764", 0], ["#0f0518", 1]] },
      objects: [
        { t: "circle", l: 240, top: 260, r: 300, fill: "rgba(250,204,21,.07)" },
        { t: "text", text: "یہاں اپنا شعر لکھیں\nدوسری سطر یہاں", l: 60, top: 720, w: 960, size: 84, font: U, fill: "#fef3c7", align: "center", lh: 2.1 },
        { t: "line", x1: 390, y1: 1260, x2: 690, y2: 1260, stroke: "#facc15", sw: 3 },
        { t: "text", text: "شاعر کا نام", l: 60, top: 1300, w: 960, size: 46, font: U, fill: "#facc15", align: "center", lh: 2 }
      ]
    },
    {
      id: "ig-motivation", name: "Bold motivation", cat: "Status", w: 1080, h: 1080,
      bg: "#facc15",
      objects: [
        { t: "text", text: "DON'T\nSTOP\nUNTIL\nYOU'RE\nPROUD.", l: 80, top: 80, w: 920, size: 172, font: A, fill: "#111", lh: 0.86 },
        { t: "rect", l: 820, top: 900, w: 180, h: 100, fill: "#111" },
        { t: "text", text: "@you", l: 820, top: 925, w: 180, size: 40, font: O, fill: "#facc15", align: "center", weight: 800 }
      ]
    },

    /* ---------------- Print ---------------- */
    {
      id: "flyer-business", name: "Business flyer (A4)", cat: "Print", w: 1240, h: 1754,
      bg: "#ffffff",
      objects: [
        { t: "rect", l: 0, top: 0, w: 1240, h: 700, fill: { g: [135, ["#1d4ed8", 0], ["#7c3aed", 1]] } },
        { t: "photo", l: 640, top: 140, w: 520, h: 640, rx: 30, name: "Photo" },
        { t: "text", text: "YOUR BUSINESS", l: 80, top: 120, w: 560, size: 40, font: M, fill: "#c7d2fe", weight: 900, cs: 300 },
        { t: "text", text: "Grow your\nbrand\nwith us", l: 80, top: 200, w: 540, size: 112, font: O, fill: "#fff", weight: 900, lh: 1 },
        { t: "text", text: "OUR SERVICES", l: 80, top: 860, w: 1080, size: 44, font: M, fill: "#1d4ed8", weight: 900, cs: 200 },
        { t: "text", text: "✔  Social media management\n✔  Logo & brand design\n✔  Website development\n✔  Video editing & ads", l: 80, top: 940, w: 1080, size: 50, font: P, fill: "#1f2937", lh: 1.6 },
        { t: "rect", l: 80, top: 1440, w: 1080, h: 200, fill: "#eef2ff", rx: 24 },
        { t: "text", text: "📞 03XX-XXXXXXX     ✉ hello@yourbusiness.com\n📍 Your address, City", l: 120, top: 1480, w: 1000, size: 44, font: P, fill: "#1e1b4b", weight: 600, lh: 1.5 }
      ]
    },
    {
      id: "card-modern", name: "Business card", cat: "Print", w: 1050, h: 600,
      bg: "#0f172a",
      objects: [
        { t: "rect", l: 0, top: 0, w: 22, h: 600, fill: "#22d3ee" },
        { t: "text", text: "Your Name", l: 90, top: 150, w: 800, size: 76, font: O, fill: "#fff", weight: 800 },
        { t: "text", text: "Designation · Company", l: 92, top: 250, w: 800, size: 36, font: P, fill: "#22d3ee", weight: 600 },
        { t: "text", text: "📞 03XX-XXXXXXX\n✉ name@company.com\n🌐 yourwebsite.com", l: 92, top: 340, w: 800, size: 32, font: P, fill: "#cbd5e1", lh: 1.45 }
      ]
    }
  ];

  window.MDC_TEXT_STYLES = [
    { label: "SALE", t: "text", text: "SALE", size: 160, font: A, fill: "#ff3d57", stroke: "#000", sw: 6, preview: "font-family:Anton;color:#ff3d57;font-size:30px;-webkit-text-stroke:1px #000" },
    { label: "Thumbnail", t: "text", text: "WOW!", size: 150, font: A, fill: "#ffe600", stroke: "#000", sw: 10, shadow: { c: "rgba(0,0,0,.7)", b: 0, x: 8, y: 8 }, preview: "font-family:Anton;color:#ffe600;font-size:28px;-webkit-text-stroke:1px #000;text-shadow:2px 2px 0 #000" },
    { label: "Elegant", t: "text", text: "Elegant", size: 110, font: PF, fill: "#111", weight: 900, style: "italic", preview: "font-family:'Playfair Display';font-style:italic;font-weight:900;font-size:24px;color:#eee" },
    { label: "Script", t: "text", text: "Thank you", size: 110, font: PC, fill: "#ec4899", preview: "font-family:Pacifico;color:#ec4899;font-size:20px" },
    { label: "Highlight", t: "text", text: " BREAKING ", size: 80, font: B, fill: "#fff", hl: "#e11d48", preview: "font-family:'Bebas Neue';background:#e11d48;color:#fff;padding:2px 6px;font-size:24px" },
    { label: "Neon", t: "text", text: "NEON", size: 140, font: M, weight: 900, fill: "#fff", shadow: { c: "#22d3ee", b: 40, x: 0, y: 0 }, preview: "font-family:Montserrat;font-weight:900;color:#fff;font-size:24px;text-shadow:0 0 8px #22d3ee" },
    { label: "Urdu", t: "text", text: "خوش آمدید", size: 110, font: U, fill: "#111", lh: 2, preview: "font-family:'Noto Nastaliq Urdu';font-size:18px;color:#eee;line-height:1.9" },
    { label: "Arabic", t: "text", text: "بسم الله", size: 120, font: AM, fill: "#b45309", weight: 700, preview: "font-family:Amiri;font-weight:700;font-size:24px;color:#f59e0b" },
    { label: "Spaced", t: "text", text: "MINIMAL", size: 64, font: M, fill: "#111", weight: 700, cs: 600, preview: "font-family:Montserrat;font-weight:700;letter-spacing:5px;font-size:14px;color:#eee" },
    { label: "Retro", t: "text", text: "RETRO", size: 140, font: L, fill: "#f97316", stroke: "#7c2d12", sw: 4, shadow: { c: "#7c2d12", b: 0, x: 7, y: 7 }, preview: "font-family:Lobster;color:#f97316;font-size:26px;text-shadow:2px 2px 0 #7c2d12" }
  ];

  window.MDC_HEADLINES = {
    sale: ["MEGA SALE · UP TO 50% OFF", "FLASH SALE — TODAY ONLY", "BUY 1 GET 1 FREE", "Limited Stock · Order Now", "Season End Sale", "Free Delivery All Over Pakistan"],
    youtube: ["I TRIED THIS FOR 30 DAYS", "DON'T MAKE THIS MISTAKE!", "THIS CHANGED EVERYTHING", "WATCH BEFORE YOU BUY", "100% HONEST REVIEW", "THE TRUTH ABOUT…"],
    food: ["Weekend Deal 🍔", "Family Platter Special", "Hot & Fresh — Order Now", "Taste That Brings You Back", "Midnight Deal Is Live", "Free Drink With Every Meal"],
    course: ["Learn AI Tools for Freelancing", "Free Webinar This Sunday", "Admissions Open", "Start Earning Online in 30 Days", "Beginner to Pro — Step by Step", "Limited Seats Available"],
    hiring: ["WE ARE HIRING!", "Join Our Team", "Now Hiring: Remote Positions", "Interns Wanted", "Grow Your Career With Us", "Apply Before Seats Fill"],
    islamic: ["جمعہ مبارک", "Jumma Mubarak", "عید مبارک", "Eid Mubarak", "رمضان مبارک", "Ramadan Kareem"],
    motivation: ["Don't stop until you're proud.", "Small steps every day.", "Dream big. Work hard.", "Your only limit is you.", "Consistency beats talent.", "Make it happen."]
  };
})();
