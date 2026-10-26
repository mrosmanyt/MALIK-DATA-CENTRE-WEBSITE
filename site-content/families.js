/* ==========================================================================
   MALIK DATA CENTRE — Tool page content
   Each "family" becomes one page at /tools/<slug>/
   Prices, durations and access types are NOT written here: they are read
   live from TOOLS_DATABASE in index.js (single source of truth).
   To add a new tool page: add its catalog ids to a family below (or create a
   new family), then run:  node build-pages.js
   "aliases" = older/duplicate catalog ids that should link to the page but are
   not shown in its plan table.
   ========================================================================== */

module.exports = [
  {
    slug: "chatgpt-go", name: "ChatGPT Go", cat: "ai-chat", icon: "fa-solid fa-comments",
    ids: ["chatgpt-go-6m"], official: "https://chatgpt.com/",
    intro: "ChatGPT Go is OpenAI's lower-cost paid plan, with higher message, upload and image limits than the free tier. We set it up for you without an international credit card, wherever you are.",
    bestFor: ["Students writing assignments, notes and summaries", "Freelancers drafting proposals, emails and client copy", "Anyone who keeps hitting the free-plan limit"],
    included: ["Higher daily message limits than ChatGPT Free", "More file uploads and image generations", "Longer memory and context for ongoing work", "Custom GPTs and Projects", "Setup guide sent on WhatsApp after activation"],
    faqs: [
      ["What is the difference between ChatGPT Go and ChatGPT Plus?", "Go is the budget tier: generous limits for everyday writing, study and research. Plus adds higher limits and more advanced models. For most students and freelancers, Go is enough."],
      ["Is this plan shared or private?", "Check the access type shown in the plan table above before ordering. If you need a private setup, ask on WhatsApp and we will confirm what is available today."]
    ],
    related: ["super-grok", "gemini-pro", "google-ai-ultra"]
  },
  {
    slug: "gemini-pro", name: "Gemini Pro (Google AI Pro)", cat: "ai-chat", icon: "fa-solid fa-star-of-life",
    ids: ["gemini-pro-18m-private", "gemini-18m"], official: "https://gemini.google.com/",
    intro: "Google's Gemini Pro plan bundles a stronger Gemini model with Google Drive storage and Gemini inside Gmail, Docs and Sheets. Our long-duration plans are one of the lowest monthly cost ways to use Google AI.",
    bestFor: ["Students and researchers who live in Google Docs and Drive", "Anyone who needs large file and long-document analysis", "Families who also want extra cloud storage"],
    included: ["Gemini Pro model access in the Gemini app", "Gemini in Gmail, Docs, Sheets and Slides", "Deep Research and long-context file analysis", "Google One cloud storage (see plan for size)", "AI credits for image and video tools (see plan)"],
    faqs: [
      ["Is it activated on my own Gmail?", "Yes. Both Gemini plans are activated on your own Google account, so your chats and files stay in your account."],
      ["Why is the 18-month plan so affordable?", "These are promotional long-term plans redeemed on your account. Ask on WhatsApp for current availability, because promotional stock changes often."]
    ],
    related: ["google-ai-ultra", "chatgpt-go", "notion-business"]
  },
  {
    slug: "google-ai-ultra", name: "Google AI Ultra", cat: "ai-chat", icon: "fa-brands fa-google",
    ids: ["google-ai-ultra-shared-1m", "google-ai-ultra-family-1m", "google-ai-ultra-25k-slot"], official: "https://one.google.com/about/google-ai-plans/",
    intro: "Google AI Ultra is Google's top AI tier: Gemini Ultra, Veo video generation, Flow and the highest usage limits. We offer three ways in, from a budget shared base to a private family invitation with credits on your own account.",
    bestFor: ["Video creators who need Veo and Flow for ads, reels and shorts", "Agencies producing AI video at volume", "Power users who need the highest Gemini limits"],
    included: ["Gemini Ultra and the highest Gemini usage limits", "Veo video generation inside Gemini and Flow", "Google Antigravity and other Ultra features", "AI credits (amount depends on the plan you pick)", "Full warranty for the stated plan period"],
    faqs: [
      ["What is the difference between Shared Base, Family Invitation and the 25k Slot?", "Shared Base is the cheapest way to try Ultra features on a shared account. Family Invitation is sent to your own Gmail with 25K credits. The 25k Credits Slot is a dedicated slot for very heavy usage."],
      ["How does the invitation work?", "We send an official Google family invitation to your email. Once you accept it, Ultra features and credits appear on your own account."]
    ],
    related: ["gemini-pro", "higgsfield", "kling-ai"]
  },
  {
    slug: "super-grok", name: "SuperGrok + X Premium+", cat: "ai-chat", icon: "fa-brands fa-x-twitter",
    ids: ["grok-10d", "grok-6m", "grok-12m"], official: "https://x.ai/grok",
    intro: "X Premium+ includes SuperGrok, xAI's assistant with real-time X search, plus the blue verification badge and an ad-free X experience. Choose a short 10-day plan to try it or a 6 to 12 month plan for the best monthly rate.",
    bestFor: ["Creators and brands growing on X", "Anyone who wants Grok with live X search", "Users who want the blue badge and ad-free timeline"],
    included: ["SuperGrok assistant access", "Blue verification badge on X", "Ad-free X experience", "Activated on your own X account", "Warranty for the stated plan period"],
    faqs: [
      ["When does the blue badge appear?", "The badge depends on X's own review after Premium+ is active, which usually completes within a short time. We will guide you on WhatsApp if your profile needs changes first."],
      ["Do I need to share my X password?", "Activation is done on your account. We never need your email password. Follow the setup steps we send on WhatsApp."]
    ],
    related: ["chatgpt-go", "gemini-pro", "linkedin-premium"]
  },
  {
    slug: "capcut-pro", name: "CapCut Pro", cat: "creative", icon: "fa-solid fa-scissors",
    ids: ["capcut-pro-1m", "capcut-pro-3m", "capcut-pro-6m", "capcut-pro"], official: "https://www.capcut.com/",
    intro: "CapCut Pro unlocks premium effects, AI editing tools and higher-quality exports in the most popular short-video editor. Our plans run on 2 devices, so you can edit on your phone and PC.",
    bestFor: ["TikTok, Reels and YouTube Shorts creators", "Freelance video editors on a budget", "Small businesses making product videos"],
    included: ["Pro effects, filters and transitions", "AI tools such as auto captions and background removal", "High-resolution exports", "2 devices on the shared-login plans", "Warranty for the stated plan period"],
    faqs: [
      ["How many devices does CapCut Pro work on?", "The 1, 3 and 6 month plans work on 2 devices (phone, PC or tablet). The private monthly activation is set up on your own account."],
      ["Will my existing projects stay safe?", "On the private activation, yes. On shared-login plans, export or back up important projects to your device."]
    ],
    related: ["canva-pro", "adobe-creative-cloud", "picsart-pro"]
  },
  {
    slug: "canva-pro", name: "Canva Pro", cat: "creative", icon: "fa-solid fa-palette",
    ids: ["canva-yearly", "canva-pro-1y", "canva-admin"], official: "https://www.canva.com/",
    intro: "Canva Pro gives you premium templates, the full stock library, brand kits, background remover and Canva's AI tools. Our yearly plan is activated on your own email, and the Admin Panel option lets resellers and teams add members.",
    bestFor: ["Social media managers and small businesses", "Students making presentations and posters", "Teams and resellers who need to manage many members"],
    included: ["Premium templates, photos, videos and elements", "Background remover and Magic resize", "Brand Kit with your logos, colours and fonts", "Canva AI tools (Magic Studio)", "Activated on your own email (yearly plan)"],
    faqs: [
      ["What is the Canva Admin Panel?", "It gives you admin access to a Canva team so you can invite and manage members. It suits agencies, institutes and resellers."],
      ["Will my designs stay private?", "Yes. On the yearly plan you join on your own email, and your designs stay in your own Canva account."]
    ],
    related: ["adobe-creative-cloud", "capcut-pro", "gamma-pro"]
  },
  {
    slug: "adobe-creative-cloud", name: "Adobe Creative Cloud", cat: "creative", icon: "fa-solid fa-pen-nib",
    ids: ["adobe-3m", "adobe-cc-4m", "adobe-6m", "adobe-12m"], official: "https://www.adobe.com/creativecloud.html",
    intro: "The full Adobe Creative Cloud bundle includes Photoshop, Illustrator, Premiere Pro, After Effects, Acrobat and Firefly AI. Pick a 3, 4, 6 or 12 month plan instead of paying Adobe's full dollar price every month.",
    bestFor: ["Graphic designers and video editors", "Design students learning industry tools", "Agencies that need Photoshop and Premiere daily"],
    included: ["Photoshop, Illustrator, InDesign and Lightroom", "Premiere Pro and After Effects", "Acrobat Pro PDF editing", "Firefly generative AI features", "Desktop and mobile apps"],
    faqs: [
      ["Do I get all Adobe apps?", "The full bundle plans include the complete Creative Cloud app suite. Confirm the exact plan on WhatsApp if you need a specific app."],
      ["Which duration should I choose?", "If you use Adobe every day, the 12-month plan gives the lowest monthly cost. For a single project, start with 3 or 4 months."]
    ],
    related: ["canva-pro", "capcut-pro", "picsart-pro"]
  },
  {
    slug: "cursor-pro", name: "Cursor Pro", cat: "ai-coding", icon: "fa-solid fa-code",
    ids: ["cursor-pro", "cursor-pro-12m"], official: "https://cursor.com/",
    intro: "Cursor is an AI code editor built on VS Code, with agent mode, codebase-aware chat and smart autocomplete. Cursor Pro raises the usage limits so you can code with AI all day.",
    bestFor: ["Software developers and freelancers", "CS students building projects", "Startups shipping fast with a small team"],
    included: ["Higher agent and chat usage limits", "Unlimited tab autocomplete", "Access to frontier coding models", "Works with your existing VS Code extensions", "Private account"],
    faqs: [
      ["Monthly or yearly?", "Try the monthly plan first. If Cursor becomes your main editor, the yearly plan costs much less per month."],
      ["Will my code stay private?", "Yes. It is a private account, so your projects and chat history are only visible to you."]
    ],
    related: ["replit-core", "lovable-pro", "claude-api-tokens"]
  },
  {
    slug: "lovable-pro", name: "Lovable Pro", cat: "ai-coding", icon: "fa-solid fa-heart",
    ids: ["lovable-200", "lovable-400", "lovable-600"], official: "https://lovable.dev/",
    intro: "Lovable builds full web apps from plain-English prompts, with a database, login and one-click publishing. Our Pro plans come with 200, 400 or 600 credits and are activated on your own email.",
    bestFor: ["Founders building an MVP without a dev team", "Freelancers delivering client websites fast", "Non-coders turning ideas into working apps"],
    included: ["Monthly Lovable Pro credits (200, 400 or 600)", "Private projects and custom domains", "Supabase database and auth integration", "GitHub sync", "Activated on your own email"],
    faqs: [
      ["How many credits do I need?", "Small landing pages need roughly 200 credits a month. Full apps with many revisions are better on 400 or 600."],
      ["Credits khatam ho jayein to?", "Message us on WhatsApp and we will suggest a top-up or a higher plan."]
    ],
    related: ["cursor-pro", "replit-core", "n8n-starter"]
  },
  {
    slug: "replit-core", name: "Replit Core", cat: "ai-coding", icon: "fa-solid fa-terminal",
    ids: ["replit-core-12m", "replit-core-100"], aliases: ["replit-core"], official: "https://replit.com/",
    intro: "Replit Core gives you the Replit Agent, more compute and private deployments in a browser-based coding environment. Choose the yearly plan or a ready-made account pre-loaded with $100 of credits.",
    bestFor: ["Developers who code from any device in the browser", "Students learning to program", "Builders using Replit Agent to ship apps"],
    included: ["Replit Agent access", "More compute and storage", "Private apps and deployments", "Monthly usage credits", "Private or ready-made account (see plan)"],
    faqs: [
      ["What is the $100 top-up plan?", "It is a ready-made Replit account that already has $100 of credits loaded, which suits heavy Agent usage."],
      ["Replit or Cursor?", "Replit runs fully in the browser and deploys for you. Cursor is a desktop editor for working on your own codebase. See our comparison page."]
    ],
    related: ["cursor-pro", "lovable-pro", "warp-build"]
  },
  {
    slug: "n8n-starter", name: "n8n Starter Cloud", cat: "ai-coding", icon: "fa-solid fa-diagram-project",
    ids: ["n8n-starter-12m"], aliases: ["n8n-starter"], official: "https://n8n.io/",
    intro: "n8n is a workflow automation platform for connecting apps, APIs and AI agents. The Starter Cloud plan is hosted by n8n, so you build automations without managing a server.",
    bestFor: ["Agencies building WhatsApp, email and CRM automations", "Businesses automating lead capture and follow-ups", "Developers building AI agents"],
    included: ["Hosted n8n cloud workspace", "Visual workflow builder", "Hundreds of app integrations", "AI agent and LLM nodes", "Private account for 12 months"],
    faqs: [
      ["Can you build the automation for me?", "Yes. See our AI Automation Services page, or ask on WhatsApp for a quote."]
    ],
    related: ["gumloop-pro", "lovable-pro", "claude-api-tokens"]
  },
  {
    slug: "gumloop-pro", name: "Gumloop Pro", cat: "ai-coding", icon: "fa-solid fa-infinity",
    ids: ["gumloop-pro-12m"], official: "https://www.gumloop.com/",
    intro: "Gumloop is a no-code AI automation builder for scraping, data enrichment and AI workflows. The Pro plan is activated on your email for 12 months.",
    bestFor: ["Marketers automating research and lead lists", "Operations teams with repetitive data tasks", "No-code builders"],
    included: ["Pro workflow credits", "AI nodes for summarising, classifying and writing", "Web scraping and data enrichment", "Integrations with Sheets, Slack and more", "Activated on your own email"],
    faqs: [["Gumloop or n8n?", "Gumloop is easier for non-technical users. n8n is more flexible for developers and complex automations."]],
    related: ["n8n-starter", "manus-ai", "notion-business"]
  },
  {
    slug: "warp-build", name: "Warp Build CI/CD", cat: "ai-coding", icon: "fa-solid fa-gears",
    ids: ["warp-build-12m"], aliases: ["warp-build"], official: "https://www.warpbuild.com/",
    intro: "WarpBuild provides faster, cheaper GitHub Actions runners for CI/CD pipelines. The 12-month plan suits teams that want quicker builds and tests.",
    bestFor: ["Development teams on GitHub Actions", "Startups cutting CI build times", "DevOps engineers"],
    included: ["Faster GitHub Actions runners", "Linux, Windows and ARM runner options", "Caching for quicker builds", "12-month premium plan"],
    faqs: [["How is it set up?", "You point your GitHub Actions workflows to WarpBuild runners. We share the setup steps on WhatsApp after activation."]],
    related: ["cursor-pro", "replit-core", "n8n-starter"]
  },
  {
    slug: "wispr-flow", name: "Wispr Flow Pro", cat: "ai-coding", icon: "fa-solid fa-microphone-lines",
    ids: ["whisper-flow-12m"], aliases: ["wispr-flow"], official: "https://wisprflow.ai/",
    intro: "Wispr Flow turns your voice into clean, formatted text in any app, much faster than typing. Pro removes the weekly word limit.",
    bestFor: ["Writers and content creators", "Developers dictating prompts and docs", "Anyone who types for hours every day"],
    included: ["Unlimited dictation on Pro", "Works in any app on Mac, Windows and iPhone", "Auto-formatting and filler-word removal", "Multi-language dictation", "12-month plan"],
    faqs: [["Does it work in Urdu?", "Wispr Flow supports many languages. Test it on the free version with your language first, then upgrade."]],
    related: ["grammarly-pro", "chatgpt-go", "notion-business"]
  },
  {
    slug: "manus-ai", name: "Manus Pro", cat: "ai-chat", icon: "fa-solid fa-robot",
    ids: ["manus-pro"], official: "https://manus.im/",
    intro: "Manus is an autonomous AI agent that researches, browses, writes and builds deliverables for you from start to finish. The Pro plan is a private 12-month account.",
    bestFor: ["Researchers and analysts", "Business owners who delegate long research tasks", "Content teams producing reports"],
    included: ["Pro agent credits", "Web browsing and research tasks", "Reports, slides and file outputs", "Private account for 12 months"],
    faqs: [["Manus or ChatGPT?", "ChatGPT is a chat assistant. Manus works more like an agent that completes multi-step tasks on its own."]],
    related: ["chatgpt-go", "gumloop-pro", "gamma-pro"]
  },
  {
    slug: "gamma-pro", name: "Gamma Pro", cat: "creative", icon: "fa-solid fa-display",
    ids: ["gamma-pro"], official: "https://gamma.app/",
    intro: "Gamma creates presentations, documents and simple websites from a prompt, with modern design built in. Pro removes the watermark and unlocks more AI generation.",
    bestFor: ["Students preparing presentations", "Founders building pitch decks", "Trainers and teachers"],
    included: ["Unlimited AI generations on Pro", "No Gamma branding", "PDF and PowerPoint export", "Custom fonts and themes", "Private account for 12 months"],
    faqs: [["Can I export to PowerPoint?", "Yes. Gamma Pro exports to PDF and PowerPoint."]],
    related: ["canva-pro", "manus-ai", "notion-business"]
  },
  {
    slug: "notion-business", name: "Notion Business", cat: "creative", icon: "fa-solid fa-note-sticky",
    ids: ["notion-business-12m"], official: "https://www.notion.com/",
    intro: "Notion Business adds Notion AI, advanced permissions and team features to the all-in-one workspace for notes, docs, wikis and projects.",
    bestFor: ["Teams running projects and wikis", "Students organising notes", "Agencies managing clients"],
    included: ["Notion AI", "Unlimited pages and blocks", "Advanced sharing and permissions", "Workspace activation for 12 months"],
    faqs: [["Can my existing workspace be upgraded?", "Ask on WhatsApp before ordering. We will confirm whether we upgrade your workspace or set up a new one."]],
    related: ["gamma-pro", "grammarly-pro", "microsoft-office-365"]
  },
  {
    slug: "grammarly-pro", name: "Grammarly Pro", cat: "creative", icon: "fa-solid fa-spell-check",
    ids: ["grammarly-pro-12m"], official: "https://www.grammarly.com/",
    intro: "Grammarly Pro checks grammar, clarity, tone and plagiarism, and rewrites full sentences with AI. It works in your browser, Word, Gmail and most apps.",
    bestFor: ["Students writing essays and theses", "Freelancers writing for international clients", "Professionals writing English emails"],
    included: ["Advanced grammar and clarity suggestions", "Tone adjustments and full-sentence rewrites", "Plagiarism checker", "Generative AI prompts", "Activated on your own email for 12 months"],
    faqs: [["Does it work in both Word and Chrome?", "Yes. Grammarly works in the browser extension, desktop app, Microsoft Word and mobile keyboard."]],
    related: ["wispr-flow", "chatgpt-go", "coursera-plus"]
  },
  {
    slug: "elevenlabs-creator", name: "ElevenLabs Creator", cat: "video-audio", icon: "fa-solid fa-wave-square",
    ids: ["elevenlabs-creator"], official: "https://elevenlabs.io/",
    intro: "ElevenLabs is the leading AI voice platform for natural text-to-speech, voice cloning and dubbing. The Creator plan includes commercial use and professional voice cloning.",
    bestFor: ["YouTube faceless channels and narrators", "Ad and explainer video makers", "Audiobook and podcast creators"],
    included: ["Creator-tier monthly character credits", "Professional voice cloning", "Commercial usage rights", "AI dubbing in many languages", "Private account for 12 months"],
    faqs: [["Are Urdu or Hindi voices available?", "ElevenLabs supports many languages, including Hindi. Test your script in the free version first."]],
    related: ["heygen", "cinem-ai", "capcut-pro"]
  },
  {
    slug: "heygen", name: "HeyGen Creator", cat: "video-audio", icon: "fa-solid fa-user-astronaut",
    ids: ["heygen-200"], official: "https://www.heygen.com/",
    intro: "HeyGen creates talking-avatar videos from a script, translates videos with lip-sync and builds a digital twin of you. The Creator plan suits regular content production.",
    bestFor: ["Faceless YouTube and TikTok channels", "Course creators and trainers", "Marketers making multilingual ads"],
    included: ["Avatar video generation credits", "Video translation with lip-sync", "Custom avatar (digital twin)", "Private account"],
    faqs: [["How many videos can I make with 200 credits?", "It depends on video length and features. Share your planned usage on WhatsApp and we will suggest the right plan."]],
    related: ["elevenlabs-creator", "higgsfield", "kling-ai"]
  },
  {
    slug: "higgsfield", name: "Higgsfield Plus", cat: "video-audio", icon: "fa-solid fa-film",
    ids: ["higgsfield-plus"], official: "https://higgsfield.ai/",
    intro: "Higgsfield is an AI video studio with cinematic camera moves, effects and access to top video models in one place. The Plus plan comes with 1,200 credits.",
    bestFor: ["Creators making cinematic reels and ads", "Music video and fashion content", "Agencies testing many AI video models"],
    included: ["1,200 generation credits", "Cinematic camera controls and presets", "Access to multiple AI video and image models", "Creator account", "Warranty for the stated plan period"],
    faqs: [["Higgsfield or Google AI Ultra?", "Higgsfield gives you many models and camera presets in one studio. Ultra is best if you mainly want Veo inside Google's ecosystem."]],
    related: ["kling-ai", "google-ai-ultra", "cinem-ai"]
  },
  {
    slug: "kling-ai", name: "Kling AI", cat: "video-audio", icon: "fa-solid fa-clapperboard",
    ids: ["kling-std"], official: "https://klingai.com/",
    intro: "Kling AI is a popular text-to-video and image-to-video generator known for realistic motion. The Standard plan includes 660 monthly credits.",
    bestFor: ["Short-form video creators", "Product and ad animators", "Anyone animating still images"],
    included: ["660 monthly credits", "Text-to-video and image-to-video", "Higher-quality generations than free", "No watermark on paid generations"],
    faqs: [["Kitni videos ban sakti hain?", "It depends on length and quality settings. 660 credits is enough for regular short clips."]],
    related: ["higgsfield", "google-ai-ultra", "heygen"]
  },
  {
    slug: "cinem-ai", name: "Cinem AI Video", cat: "video-audio", icon: "fa-solid fa-video",
    ids: ["cinem-ai-monthly"], official: "",
    intro: "Cinem AI is a creator portal for generating AI video content. The monthly plan gives you access through a creator account.",
    bestFor: ["Creators producing AI video every week", "Agencies testing AI video tools"],
    included: ["Monthly creator access", "AI video generation tools", "Setup guide on WhatsApp"],
    faqs: [["How do I get access?", "After payment, we share portal access and a setup guide on WhatsApp."]],
    related: ["higgsfield", "kling-ai", "heygen"]
  },
  {
    slug: "picsart-pro", name: "Picsart Pro", cat: "creative", icon: "fa-solid fa-wand-magic-sparkles",
    ids: ["picsart-pro-11m"], official: "https://picsart.com/",
    intro: "Picsart Pro unlocks premium photo and video editing, AI tools and templates on mobile and web.",
    bestFor: ["Mobile editors and influencers", "Small shops editing product photos", "Students and hobbyists"],
    included: ["Premium filters, fonts and stickers", "AI background removal and enhance", "Ad-free editing", "Activated on your own email"],
    faqs: [["Does it work on both mobile and web?", "Yes. Your Pro account works on the Picsart mobile app and on the web."]],
    related: ["canva-pro", "capcut-pro", "adobe-creative-cloud"]
  },
  {
    slug: "youtube-premium", name: "YouTube Premium", cat: "entertainment", icon: "fa-brands fa-youtube",
    ids: ["youtube-1m", "youtube-premium-3m", "youtube-12m"], aliases: ["youtube-3m"], official: "https://www.youtube.com/premium",
    intro: "YouTube Premium removes ads, allows background play and downloads, and includes YouTube Music Premium. It is activated on your own Google account.",
    bestFor: ["Anyone tired of YouTube ads", "Students downloading lectures offline", "Music listeners who want YouTube Music"],
    included: ["Ad-free YouTube", "Background play and downloads", "YouTube Music Premium", "Activated on your own email"],
    faqs: [["Will I keep my watch history and subscriptions?", "Yes. Premium is activated on your own account, so nothing changes except the ads disappear."]],
    related: ["amazon-prime-video", "xbox-gift", "zoom-pro"]
  },
  {
    slug: "amazon-prime-video", name: "Amazon Prime Video", cat: "entertainment", icon: "fa-brands fa-amazon",
    ids: ["amazon-prime-6m"], official: "https://www.primevideo.com/",
    intro: "Prime Video gives you movies, series and Amazon Originals. Our 6-month plan comes with a private profile login.",
    bestFor: ["Movie and series fans", "Families on a budget"],
    included: ["6 months access", "Private profile", "HD streaming on phone, TV and laptop"],
    faqs: [["Private profile ka matlab?", "You get your own profile on the account, so your watch list and history are separate."]],
    related: ["youtube-premium", "xbox-gift", "coursera-plus"]
  },
  {
    slug: "xbox-gift", name: "Xbox Gift Codes", cat: "entertainment", icon: "fa-brands fa-xbox",
    ids: ["xbox-code", "xbox-random-1m"], official: "https://www.xbox.com/",
    intro: "Digital Xbox codes delivered on WhatsApp, including random vouchers and 1-month codes.",
    bestFor: ["Xbox and PC gamers", "Gift buyers"],
    included: ["Digital code delivery", "Redeem on your own Microsoft account"],
    faqs: [["What do I get with a random voucher?", "Ask on WhatsApp for the current voucher contents before ordering."]],
    related: ["youtube-premium", "amazon-prime-video", "windows-pro-key"]
  },
  {
    slug: "linkedin-premium", name: "LinkedIn Premium", cat: "creative", icon: "fa-brands fa-linkedin",
    ids: ["linkedin-career-3m", "linkedin-sales-nav-2m"], aliases: ["linkedin-career"], official: "https://premium.linkedin.com/",
    intro: "LinkedIn Premium Career helps job seekers stand out, and Sales Navigator helps sales teams find and contact leads. Both are applied as upgrades to your existing LinkedIn profile.",
    bestFor: ["Job seekers and fresh graduates", "Freelancers finding international clients", "B2B sales and lead generation"],
    included: ["InMail credits", "See who viewed your profile", "LinkedIn Learning (Career)", "Advanced lead search (Sales Navigator)", "Upgrade on your own profile"],
    faqs: [["Career or Sales Navigator?", "Career is for job hunting and personal growth. Sales Navigator is built for finding and contacting leads."]],
    related: ["coursera-plus", "grammarly-pro", "super-grok"]
  },
  {
    slug: "coursera-plus", name: "Coursera Plus", cat: "entertainment", icon: "fa-solid fa-graduation-cap",
    ids: ["coursera-premium-12m"], official: "https://www.coursera.org/courseraplus",
    intro: "Coursera Plus unlocks thousands of courses, professional certificates and guided projects from Google, IBM, Meta and top universities.",
    bestFor: ["Students building job-ready skills", "Freelancers earning certificates", "Career switchers"],
    included: ["Access to most Coursera courses", "Professional certificates", "Guided projects", "Private activation for 12 months"],
    faqs: [["Do I get a certificate?", "Yes. Certificates for completed courses included in Coursera Plus are issued on your profile."]],
    related: ["linkedin-premium", "grammarly-pro", "chatgpt-go"]
  },
  {
    slug: "zoom-pro", name: "Zoom Pro", cat: "entertainment", icon: "fa-solid fa-video",
    ids: ["zoom-pro-monthly"], official: "https://zoom.us/",
    intro: "Zoom Pro removes the 40-minute limit and adds cloud recording and AI Companion for meetings and online classes.",
    bestFor: ["Teachers and tutors", "Remote teams", "Webinar hosts"],
    included: ["Long meetings without the 40-minute cut-off", "Cloud recording", "Zoom AI Companion", "Monthly access"],
    faqs: [["How many participants?", "Zoom Pro supports up to 100 participants per meeting by default."]],
    related: ["microsoft-office-365", "notion-business", "youtube-premium"]
  },
  {
    slug: "microsoft-office-365", name: "Microsoft 365", cat: "vpn-security", icon: "fa-brands fa-microsoft",
    ids: ["ms-office-1y"], official: "https://www.microsoft.com/microsoft-365",
    intro: "Microsoft 365 includes Word, Excel, PowerPoint, Outlook and OneDrive cloud storage, activated on your own email for 12 months.",
    bestFor: ["Offices and accountants", "Students and teachers", "Anyone who needs genuine Office apps"],
    included: ["Word, Excel, PowerPoint and Outlook", "OneDrive cloud storage", "Desktop, web and mobile apps", "Activated on your own email"],
    faqs: [["Does it work on both PC and mobile?", "Yes. Sign in with your account on Windows, Mac, Android or iPhone."]],
    related: ["windows-pro-key", "notion-business", "zoom-pro"]
  },
  {
    slug: "windows-pro-key", name: "Windows 10/11 Pro Key", cat: "vpn-security", icon: "fa-brands fa-windows",
    ids: ["windows-activation-key"], official: "https://www.microsoft.com/windows",
    intro: "A Windows 10/11 Pro retail key for lifetime activation of your PC, delivered digitally.",
    bestFor: ["New PC builds", "Upgrading Windows Home to Pro", "Removing the Activate Windows watermark"],
    included: ["Windows 10/11 Pro retail key", "Lifetime activation", "Activation steps sent on WhatsApp"],
    faqs: [["Will it upgrade Windows Home to Pro?", "Yes. Enter the key in Settings > System > Activation and Windows upgrades to Pro."]],
    related: ["microsoft-office-365", "nordvpn", "xbox-gift"]
  },
  {
    slug: "nordvpn", name: "NordVPN", cat: "vpn-security", icon: "fa-solid fa-shield-halved",
    ids: ["nordvpn-monthly"], official: "https://nordvpn.com/",
    intro: "NordVPN encrypts your connection on public Wi-Fi and gives you fast servers in many countries, activated on your own email.",
    bestFor: ["Freelancers working on public Wi-Fi", "Privacy-conscious users", "Travellers"],
    included: ["Fast servers worldwide", "Threat Protection", "Multiple devices", "Activated on your own email"],
    faqs: [["How many devices?", "NordVPN supports several simultaneous devices on one account."]],
    related: ["surfshark-vpn", "hma-vpn", "windows-pro-key"]
  },
  {
    slug: "surfshark-vpn", name: "Surfshark VPN", cat: "vpn-security", icon: "fa-solid fa-water",
    ids: ["surfshark-monthly"], official: "https://surfshark.com/",
    intro: "Surfshark is a budget VPN that works on unlimited devices. Our monthly plan is the cheapest way to get a premium VPN.",
    bestFor: ["Budget buyers", "Families with many devices"],
    included: ["Monthly access", "Servers in many countries", "Shared premium account"],
    faqs: [["Is a shared account safe?", "A VPN account only stores your connection settings, not your files. For full privacy, choose NordVPN on your own email."]],
    related: ["nordvpn", "hma-vpn", "windows-pro-key"]
  },
  {
    slug: "hma-vpn", name: "HMA VPN", cat: "vpn-security", icon: "fa-solid fa-key",
    ids: ["key-hma"], official: "https://www.hidemyass.com/",
    intro: "HMA VPN yearly licence key, delivered digitally for activation in the HMA app.",
    bestFor: ["Users who want a full year of VPN", "Windows and Android users"],
    included: ["Yearly licence key", "Key delivered on WhatsApp", "Activation steps included"],
    faqs: [["Where do I enter the key?", "Open the HMA app, choose 'Already purchased' and enter the licence key."]],
    related: ["nordvpn", "surfshark-vpn", "windows-pro-key"]
  },
  {
    slug: "claude-api-tokens", name: "Claude API Tokens", cat: "ai-chat", icon: "fa-solid fa-plug",
    ids: ["claude-api-10m"], official: "https://www.anthropic.com/api",
    intro: "API token packs for developers who want to use Claude models inside their own apps, bots and automations. Contact us for larger volumes.",
    bestFor: ["Developers building chatbots", "Automation agencies", "SaaS builders"],
    included: ["10M token pack", "API key access", "Setup help on WhatsApp"],
    faqs: [["Need a larger volume?", "See our Enterprise API Credits page or ask on WhatsApp for a custom quote."]],
    related: ["cursor-pro", "n8n-starter", "lovable-pro"]
  }
];
