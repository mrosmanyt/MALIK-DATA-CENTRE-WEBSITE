/* ==========================================================================
   MALIK DATA CENTRE — Content for comparisons, policies and service pages.
   Edit text here, then run:  node build-pages.js
   ========================================================================== */

// Change this date whenever you edit refund / delivery / FAQ / about / contact text
exports.policiesUpdated = "2026-10-25";

// Change when the Design Studio (/design/) gets a notable update
exports.designUpdated = "2026-10-26";

// Hand-written blog articles that already exist as HTML in /blog/ (listed on the blog index)
exports.legacyPosts = [
  { file: "chatgpt-vs-super-grok-pakistan-guide.html", title: "ChatGPT vs Super Grok vs Gemini: Which AI Subscription Should You Buy in Pakistan?", description: "A side-by-side comparison of price, features, and warranty to help you pick the right AI chatbot subscription for your budget and use case.", category: "AI Chat Tools", icon: "fa-solid fa-comments", date: "2026-09-21", readMin: 7 },
  { file: "canva-pro-vs-adobe-creative-cloud.html", title: "Canva Pro vs Adobe Creative Cloud: Which Design Tool Is Right for You in 2026?", description: "From quick social media graphics to professional photo editing — how to choose between Canva Pro and the full Adobe Creative Cloud suite.", category: "Design & Creative", icon: "fa-solid fa-palette", date: "2026-09-21", readMin: 6 },
  { file: "is-it-safe-to-buy-cheap-ai-subscriptions-pakistan.html", title: "Is It Safe to Buy Cheap AI Tool Subscriptions in Pakistan? A Complete Buyer's Guide", description: "How shared and private AI subscriptions actually work, what makes a reseller trustworthy, and the red flags to avoid before you pay.", category: "Buying Guide", icon: "fa-solid fa-shield-halved", date: "2026-09-21", readMin: 8 },
  { file: "capcut-pro-review.html", title: "CapCut Pro Review 2026: Features, Pricing & Is It Worth It?", description: "An honest look at CapCut Pro's editing tools, export quality, and pricing plans — and who should (and shouldn't) upgrade from the free version.", category: "AI Video & Audio", icon: "fa-solid fa-video", date: "2026-09-21", readMin: 6 }
];

exports.comparisons = [
  {
    slug: "gemini-pro-vs-google-ai-ultra",
    title: "Gemini Pro vs Google AI Ultra: Which Google AI Plan Should You Buy?",
    short: "Gemini Pro vs Google AI Ultra",
    lead: "Both plans run on Google's Gemini models. The real difference is how much video generation and usage you need, and how much you want to spend each month.",
    cols: ["gemini-pro", "google-ai-ultra"],
    rows: [
      ["Best for", "Study, research, writing and Google Workspace", "Heavy AI video (Veo, Flow) and top usage limits"],
      ["Gemini model", "Gemini Pro", "Gemini Ultra plus all Pro features"],
      ["Video generation", "Limited (with plan credits)", "Veo in Gemini and Flow, much higher limits"],
      ["Cloud storage", "Included (see plan)", "Included on official family plans"],
      ["Typical duration", "Long-term (18 months)", "1 month"],
      ["Access options", "Your own Google account", "Shared base, family invitation or dedicated slot"]
    ],
    verdict: [
      ["Students, writers and office users", "gemini-pro"],
      ["Video creators and agencies", "google-ai-ultra"],
      ["Trying Ultra video features on a budget", "google-ai-ultra"]
    ],
    faqs: [
      ["Kya main Pro se Ultra par baad mein upgrade kar sakta hoon?", "Yes. Start with Gemini Pro and message us on WhatsApp when you need Ultra. We will suggest the right Ultra option for your usage."]
    ]
  },
  {
    slug: "cursor-vs-replit-vs-lovable",
    title: "Cursor vs Replit vs Lovable: Best AI Coding Tool in Pakistan",
    short: "Cursor vs Replit vs Lovable",
    lead: "All three let AI write code for you, but they suit very different people. Here is how to choose without wasting a month's subscription.",
    cols: ["cursor-pro", "replit-core", "lovable-pro"],
    rows: [
      ["Who it is for", "Developers working on their own codebase", "Coders who want everything in the browser", "Non-coders and founders building apps from prompts"],
      ["Where it runs", "Desktop editor (VS Code based)", "Browser IDE with hosting", "Browser, prompt-to-app builder"],
      ["Coding knowledge needed", "Yes", "Some", "Little to none"],
      ["Hosting and deploy", "Bring your own", "Built in", "Built in, one-click publish"],
      ["Pricing model", "Monthly or yearly plan", "Yearly plan or $100 credit account", "Monthly credit packs (200 to 600)"]
    ],
    verdict: [
      ["Professional developers and CS students", "cursor-pro"],
      ["Learning to code or coding from any device", "replit-core"],
      ["Launching an MVP or client website fast", "lovable-pro"]
    ],
    faqs: [
      ["Kya main do tools saath use kar sakta hoon?", "Many builders design the first version in Lovable, then continue in Cursor once the project grows. Start with one and add the other when you need it."]
    ]
  },
  {
    slug: "elevenlabs-vs-heygen",
    title: "ElevenLabs vs HeyGen: AI Voice or AI Avatar Videos?",
    short: "ElevenLabs vs HeyGen",
    lead: "ElevenLabs makes voices. HeyGen makes presenter videos with avatars. Faceless YouTube channels often use one or both, so pick based on what your content actually needs.",
    cols: ["elevenlabs-creator", "heygen"],
    rows: [
      ["Main output", "Voiceovers, narration, dubbing", "Talking-avatar videos, video translation"],
      ["Best for", "Faceless channels, audiobooks, ads", "Courses, explainers, multilingual ads"],
      ["Voice cloning", "Yes (professional cloning on Creator)", "Yes, with avatar"],
      ["Video editing needed", "Yes, add voice to your own edit", "Less, video is generated for you"],
      ["Plan duration", "12 months", "Credit-based plan"]
    ],
    verdict: [
      ["Narration-based faceless YouTube", "elevenlabs-creator"],
      ["Courses and presenter-style videos", "heygen"]
    ],
    faqs: []
  },
  {
    slug: "nordvpn-vs-surfshark",
    title: "NordVPN vs Surfshark: Which VPN Should You Buy in Pakistan?",
    short: "NordVPN vs Surfshark",
    lead: "Both are well-known premium VPNs. The choice usually comes down to budget and whether you want the account on your own email.",
    cols: ["nordvpn", "surfshark-vpn"],
    rows: [
      ["Access type", "Activated on your own email", "Shared premium account"],
      ["Best for", "Privacy-focused users and freelancers", "Lowest-cost premium VPN"],
      ["Devices", "Several devices", "Many devices"],
      ["Duration", "Monthly", "Monthly"]
    ],
    verdict: [
      ["Freelancers who want their own account", "nordvpn"],
      ["Budget buyers", "surfshark-vpn"]
    ],
    faqs: []
  }
];

// Existing blog articles that also act as comparisons (linked from the hub)
exports.blogComparisons = [
  ["ChatGPT vs SuperGrok: Pakistan buying guide", "blog/chatgpt-vs-super-grok-pakistan-guide.html"],
  ["Canva Pro vs Adobe Creative Cloud", "blog/canva-pro-vs-adobe-creative-cloud.html"]
];

exports.faqs = [
  { cat: "Ordering & delivery", items: [
    ["Order kaise karein?", "Choose a plan in the catalog or on any tool page and tap Buy Now. Enter your name and WhatsApp number, then send the payment screenshot on WhatsApp. We confirm and activate your plan."],
    ["Activation kitni der mein hoti hai?", "Most activations finish 5 to 30 minutes after we confirm your payment. Email activations and family invitations are sent as soon as we receive your email address on WhatsApp."],
    ["Setup guide milti hai?", "Yes. Every delivery comes with step-by-step setup instructions (text, screenshots or video) on WhatsApp."],
    ["Kya main ek se zyada tools ek saath order kar sakta hoon?", "Yes. Add several tools to the cart on the homepage and check out once. The full order is sent to us together."]
  ]},
  { cat: "Payments", items: [
    ["Payment kin tareeqon se hoti hai?", "In Pakistan: EasyPaisa, JazzCash, NayaPay, UPaisa, Meezan Bank and bank transfer. Outside Pakistan: USDT via Binance (BEP20 or TRC20)."],
    ["International customers kaise pay karein?", "Tell our team on WhatsApp that you want to pay in USDT. We share the PKR to USDT amount and the official wallet address. Always choose the correct network, because coins sent on the wrong network cannot be recovered."],
    ["Coupon code kaise lagta hai?", "Enter the code in the coupon box above the catalog. The discount is applied to your cart total and included in your WhatsApp order message."]
  ]},
  { cat: "Privacy & accounts", items: [
    ["Private aur shared account mein kya farq hai?", "Private (on client email) plans are activated on your own email, so your chats, files and history stay with you. Shared plans are lower-cost logins used by more than one buyer. Every plan is labelled so you can choose before paying."],
    ["Kya aap mera email password maangte hain?", "No. We never need your email password. For email activations we only need your email address, and invitations arrive in your inbox."],
    ["Shared account par kya dhyan rakhna chahiye?", "Do not change the password or account details, and do not store private or confidential work on a shared login. Back up important files to your own device."]
  ]},
  { cat: "Warranty & refunds", items: [
    ["Warranty kaise claim karein?", "Send a screenshot of the error to our WhatsApp support during the warranty period. We fix or replace the account, usually within 10 to 30 minutes."],
    ["Refund kab milta hai?", "If we cannot deliver your plan, you get a full refund. If an active plan develops an issue during warranty that we cannot fix or replace, we refund the remaining value. See the Refund Policy for details."],
    ["Warranty kitne din ki hoti hai?", "Each plan shows its warranty period. Most plans are covered for their full duration."]
  ]}
];

exports.services = {
  social: {
    slug: "social-media-services",
    title: "Social Media Services in Pakistan",
    eyebrow: "Growth & management",
    lead: "Content, channel setup, page management and ad campaigns for YouTube, Facebook, Instagram, TikTok and WhatsApp. Tell us your platform and goal, and we will send a clear quote on WhatsApp.",
    items: [
      ["fa-brands fa-youtube", "YouTube channel setup & SEO", "Channel branding, titles, descriptions, tags and playlists set up so your videos are easier to find."],
      ["fa-solid fa-image", "Thumbnails & post design", "Eye-catching thumbnails, reels covers and post creatives made with Canva Pro and Adobe."],
      ["fa-brands fa-facebook", "Facebook & Instagram page management", "Regular posting, captions and inbox handling for business pages."],
      ["fa-solid fa-bullhorn", "Meta ads campaign setup", "Targeting, creatives and budget setup for Facebook and Instagram ads that reach Pakistani buyers."],
      ["fa-brands fa-tiktok", "TikTok & Reels content", "Short-form video editing with CapCut Pro and AI tools for consistent posting."],
      ["fa-brands fa-whatsapp", "WhatsApp Channel & Business setup", "WhatsApp Business catalog, quick replies and channel setup for stores."]
    ],
    formFields: ["platform", "goal", "budget"],
    note: "We will confirm scope, timeline and price in writing on WhatsApp before you pay."
  },
  automation: {
    slug: "ai-automation-services",
    title: "AI Automation Services",
    eyebrow: "Done-for-you automation",
    lead: "We build AI chatbots and automations that save your team hours every week, using n8n, Gumloop, OpenAI, Claude and Gemini. You keep ownership of everything we build.",
    items: [
      ["fa-brands fa-whatsapp", "WhatsApp AI chatbot", "Answer customer questions, share prices and take orders automatically, 24/7."],
      ["fa-solid fa-diagram-project", "n8n workflow automation", "Connect forms, sheets, CRMs and email so data moves on its own."],
      ["fa-solid fa-user-plus", "Lead capture & follow-up", "Capture leads from ads and websites, qualify them with AI and follow up automatically."],
      ["fa-solid fa-pen-fancy", "AI content pipelines", "Generate drafts for posts, product descriptions and emails in your brand voice."],
      ["fa-solid fa-robot", "Custom GPTs & AI agents", "Assistants trained on your documents for support, sales or internal use."],
      ["fa-solid fa-globe", "AI-built websites & apps", "Landing pages and simple web apps built fast with Lovable and Cursor."]
    ],
    steps: [
      ["Free consultation", "Tell us what takes your team the most time."],
      ["Written proposal", "We send scope, tools, timeline and a fixed price."],
      ["Build & test", "We build the automation and test it with your real data."],
      ["Handover & support", "You get access, a short training video and support after launch."]
    ],
    formFields: ["business", "task", "budget"]
  },
  api: {
    slug: "enterprise-ai-api-credits",
    title: "Enterprise AI API Credits",
    eyebrow: "For developers & businesses",
    lead: "Need API access for Claude, OpenAI, Gemini or DeepSeek in your product, chatbot or automation? Tell us your monthly volume and we will send a custom quote in PKR or USDT.",
    items: [
      ["fa-solid fa-plug", "Claude API token packs", "Ready token packs for apps and bots. See our 10M token pack."],
      ["fa-solid fa-microchip", "OpenAI, Gemini & DeepSeek", "Volume credits for other major model providers on request."],
      ["fa-solid fa-file-invoice", "Local payment", "Pay in PKR via bank or wallets, or USDT for international teams."],
      ["fa-solid fa-headset", "Integration help", "Setup help for n8n, Python, Node and popular SDKs."]
    ],
    formFields: ["provider", "volume", "usecase"]
  }
};
