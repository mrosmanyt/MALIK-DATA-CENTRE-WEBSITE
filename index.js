// Malik Data Centre - Application Script

// Comprehensive 34-item AI Tools & Premium Software Subscriptions Database
const TOOLS_DATABASE = [
    {
        id: "chatgpt-go-6m",
        name: "ChatGPT Go",
        category: "ai-chat",
        duration: "6 Months Plan",
        price: 2200,
        originalPrice: 5000,
        setup: "Shared Premium Account",
        desc: "Access OpenAI's advanced GPT-4o model with deep reasoning, web search, custom GPT creators, and data analysis tools.",
        specs: ["Full Warranty Support", "GPT-4o & GPT-4 Access", "Advanced Data Analysis", "Custom GPTs"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #10a37f"><path d="M21.74 11.23a4.91 4.91 0 0 0-.42-1.92 4.92 4.92 0 0 0-2.85-2.85 4.88 4.88 0 0 0-3-.12 4.93 4.93 0 0 0-3.66-3.66 4.9 4.9 0 0 0-3.84 1 4.9 4.9 0 0 0-2.85 2.85 4.93 4.93 0 0 0-.12 3 4.93 4.93 0 0 0-3.66 3.66 4.9 4.9 0 0 0 1 3.84 4.9 4.9 0 0 0 2.85 2.85 4.93 4.93 0 0 0 3 .12 4.93 4.93 0 0 0 3.66 3.66 4.9 4.9 0 0 0 3.84-1 4.9 4.9 0 0 0 2.85-2.85 4.93 4.93 0 0 0 .12-3 4.93 4.93 0 0 0 3.66-3.66 4.89 4.89 0 0 0-.61-1.92zm-9.74 8.64a3 3 0 0 1-1.46-.38l.08-.05 3.93-2.27a.58.58 0 0 0 .29-.5v-5.54l1.64.95a.08.08 0 0 1 .04.06v4.67a3.06 3.06 0 0 1-4.52 2.66zm-5.83-3.37a3 3 0 0 1-.38-1.46v-4.55l.08.05 3.93 2.27a.58.58 0 0 0 .58 0l4.8-2.77v1.9a.08.08 0 0 1-.04.07l-4.05 2.34a3.06 3.06 0 0 1-4.92-1.35zm-1.85-6.72a3 3 0 0 1 1.08-1l.08.05 3.93 2.27a.58.58 0 0 0 .58-.33v-5.54l-1.64.95a.08.08 0 0 1-.04.07V11a3.06 3.06 0 0 1-3.99 1.22zM12 9.22l-1.64-.95a.08.08 0 0 1-.04-.07V3.53a3.06 3.06 0 0 1 4.52-2.66l.08.05-3.93 2.27a.58.58 0 0 0-.29.5zm5.83 3.37v4.55l-.08-.05-3.93-2.27a.58.58 0 0 0-.58 0l-4.8 2.77v-1.9a.08.08 0 0 1 .04-.07l4.05-2.34a3.06 3.06 0 0 1 4.92 1.35zm1.85 6.72a3 3 0 0 1-1.08 1l-.08-.05-3.93-2.27a.58.58 0 0 0-.58.33V22.2l1.64-.95a.08.08 0 0 1 .04-.07v-4.66a3.06 3.06 0 0 1 3.99-1.21z"/></svg>`
    },
    {
        id: "gemini-18m",
        name: "Gemini Advanced",
        category: "ai-chat",
        duration: "18 Months Plan",
        price: 1200,
        originalPrice: 2400,
        setup: "Activated on Client Email",
        desc: "Access Google's state-of-the-art Gemini 1.5 Pro model. Features massive 1M token context, high-speed coding assistance, and seamless Google Workspace integrations.",
        specs: ["Full Warranty & Private", "Gemini 1.5 Pro Access", "1M Token Context Window", "Google Docs/Gmail Sync"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #4285f4"><path d="M12 2v20M2 12h20" stroke-linecap="round"/><path d="M12 2c3.5 4 6.5 7 10 10-3.5 3-6.5 6-10 10C8.5 19 5.5 16 2 12c3.5-3 6.5-6 10-10z" fill="currentColor" fill-opacity="0.1" stroke-linejoin="round"/></svg>`
    },
    {
        id: "google-ai-pro",
        name: "Google AI Pro",
        category: "ai-chat",
        duration: "12 Months Plan",
        price: 6200,
        originalPrice: 12400,
        setup: "Activated on Client Email",
        desc: "Google AI Pro yearly access — advanced Gemini models and Google AI features on your account.",
        specs: ["Full Warranty & Private", "Gemini Model Access", "Priority Features", "12 Months Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #4285f4"><path d="M12 2v20M2 12h20" stroke-linecap="round"/><path d="M12 2c3.5 4 6.5 7 10 10-3.5 3-6.5 6-10 10C8.5 19 5.5 16 2 12c3.5-3 6.5-6 10-10z" fill="currentColor" fill-opacity="0.1" stroke-linejoin="round"/></svg>`
    },
    {
        id: "grok-3m",
        name: "Super Grok + X Premium+",
        category: "ai-chat",
        duration: "3 Months Account",
        price: 3500,
        originalPrice: 8000,
        setup: "Activated on Client Email",
        desc: "Get X (formerly Twitter) Premium+ access with a Blue Verification Tick and access to Grok AI chatbot with real-time X search data.",
        specs: ["Official Blue Tick Badge", "Grok AI Assistant Access", "Full Ad-Free X Experience", "2x Reply Boost & Monetization"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #e2e8f0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    {
        id: "grok-6m",
        name: "Super Grok + X Premium+",
        category: "ai-chat",
        duration: "6 Months Account",
        price: 6300,
        originalPrice: 15000,
        setup: "Activated on Client Email",
        desc: "Double the duration. Includes X Premium+ features, Blue Tick verification, and access to Grok AI with no ads.",
        specs: ["Official Blue Tick Badge", "Grok AI Assistant Access", "Full Ad-Free X Experience", "6 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #cbd5e1"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    {
        id: "grok-12m",
        name: "Super Grok + X Premium+",
        category: "ai-chat",
        duration: "12 Months Account",
        price: 9500,
        originalPrice: 28000,
        setup: "Activated on Client Email",
        desc: "Best yearly deal. Get X Premium+ features, blue verified badge, and Grok AI access activated directly on your email.",
        specs: ["Official Blue Tick Badge", "Grok AI Assistant Access", "Full Ad-Free X Experience", "1 Year Warranty Protection"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #94a3b8"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    {
        id: "capcut-pro",
        name: "CapCut Pro",
        category: "video-audio",
        duration: "Monthly Access",
        price: 820,
        originalPrice: 1600,
        setup: "Private Activation",
        desc: "Unlock advanced AI video filters, keyframe animation tools, speech-to-text auto-captions, and premium editing assets on desktop & mobile.",
        specs: ["Remove Video Watermarks", "Exclusive Pro Effects & Transitions", "AI Voiceover & Subtitles", "4K Ultra-HD Exports"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff3c88"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
        id: "capcut-pro-6m",
        name: "CapCut Pro",
        category: "video-audio",
        duration: "6 Months Plan",
        price: 4550,
        originalPrice: 9000,
        setup: "Private Activation",
        desc: "Six months of CapCut Pro — AI filters, keyframes, captions, and premium assets on desktop & mobile.",
        specs: ["Remove Video Watermarks", "Exclusive Pro Effects & Transitions", "AI Voiceover & Subtitles", "6 Months Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff3c88"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
        id: "grok-super-7d",
        name: "Super Grok + X Premium+",
        category: "ai-chat",
        duration: "7 Days Access",
        price: 1800,
        originalPrice: 3600,
        setup: "Activated on Client Email",
        desc: "Short-term Super Grok + X Premium+ access with blue verification — ideal for trials and urgent work.",
        specs: ["Official Blue Tick Badge", "Grok AI Assistant Access", "Ad-Free X Experience", "7 Days Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #e2e8f0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    {
        id: "runway-pro",
        name: "Runway Pro",
        category: "video-audio",
        duration: "12 Months Plan",
        price: 11850,
        originalPrice: 23700,
        setup: "Private Account",
        desc: "Runway Pro for a full year — generative video credits and pro creative tools for content teams.",
        specs: ["Full Warranty Support", "Pro Video Generation", "Monthly Credits Pack", "12 Months Access"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #22c55e"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></svg>`
    },
    {
        id: "heygen-200",
        name: "HeyGen Creator Plan",
        category: "video-audio",
        duration: "200 Credits Plan",
        price: 5800,
        originalPrice: 12000,
        setup: "Private Account",
        desc: "Create professional AI videos using realistic talking avatars, high-fidelity voice cloning, and text-to-video generation.",
        specs: ["200 Video Credits Included", "80+ Realistic AI Avatars", "Voice Cloning Capabilities", "1080p Full-HD Rendering"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #7c3aed"><rect x="2" y="3" width="20" height="14" rx="2" stroke-linejoin="round"/><path d="M8 21h8M12 17v4" stroke-linecap="round"/><path d="M10 8l5 3-5 3V8z" fill="currentColor"/></svg>`
    },
    {
        id: "kling-std",
        name: "Kling AI Standard Plan",
        category: "video-audio",
        duration: "660 Credits Monthly",
        price: 1300,
        originalPrice: 4000,
        setup: "Premium Account",
        desc: "Leading-edge video generation AI tool. Allows you to generate highly photorealistic, high-frame-rate videos from text prompts.",
        specs: ["660 Credits Pack", "Realistic Physics Engine", "High Definition Video Outputs", "Fast Queue Priority Processing"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #3b82f6"><circle cx="12" cy="12" r="10"/><path d="M9 17l6-5-6-5v10z" fill="currentColor"/></svg>`
    },
    {
        id: "lovable-200",
        name: "Lovable Pro Monthly",
        category: "ai-coding",
        duration: "200 Credits Plan",
        price: 7200,
        originalPrice: 14400,
        setup: "Activated on Client Email",
        desc: "Build complete, production-ready full-stack web applications from raw text descriptions. Fast prototyping & direct GitHub deployments.",
        specs: ["200 Premium Build Credits", "Private App Development", "One-Click Deploy & GitHub Sync", "Client Email Custom Setup"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ec4899"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
    },
    {
        id: "lovable-400",
        name: "Lovable Pro Monthly",
        category: "ai-coding",
        duration: "400 Credits Plan",
        price: 10800,
        originalPrice: 21600,
        setup: "Activated on Client Email",
        desc: "Mid-tier builder plan offering 400 credits. Best for active developers constructing mid-scale full-stack projects.",
        specs: ["400 Premium Build Credits", "Custom Domain Mapping Support", "One-Click Deploy & GitHub Sync", "Full 30-Day Project Support"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #db2777"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
    },
    {
        id: "lovable-600",
        name: "Lovable Pro Monthly",
        category: "ai-coding",
        duration: "600 Credits Plan",
        price: 14400,
        originalPrice: 28800,
        setup: "Activated on Client Email",
        desc: "Ultimate builder tier. 600 credits for agency-level builders and advanced SaaS applications creation.",
        specs: ["600 Premium Build Credits", "Custom Domains & API Access", "Priority Dedicated Support", "Client Email Activation"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #be185d"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
    },
    {
        id: "canva-yearly",
        name: "Canva Pro Yearly",
        category: "creative",
        duration: "12 Months Plan",
        price: 720,
        originalPrice: 1500,
        setup: "Activated on Client Email",
        desc: "Access Canva's complete asset catalog. Features magic AI design tools, brand kits, background removers, and premium font sets.",
        specs: ["Full 1-Year Access", "Magic Resize & AI Design Studio", "Millions of Stock Images & Templates", "Private Canvas Settings"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #00c4cc"><circle cx="12" cy="12" r="10"/><path d="M8 12c2.5-1 5.5-1 8 0" stroke-linecap="round"/></svg>`
    },
    {
        id: "manus-pro",
        name: "Manus Pro AI",
        category: "ai-chat",
        duration: "12 Months Plan",
        price: 15450,
        originalPrice: 30900,
        setup: "Private Account",
        desc: "Unleash Manus Pro - the advanced autonomous AI agent that controls browsers, performs automated market research, and codes scripts for you.",
        specs: ["12 Months Full Pro Access", "Unrestricted Browser Actions", "Autonomous Multi-Step Workflows", "API Integrations Support"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f59e0b"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4" stroke-linecap="round"/></svg>`
    },
    {
        id: "gamma-pro",
        name: "Gamma Pro Yearly",
        category: "creative",
        duration: "12 Months Plan",
        price: 9250,
        originalPrice: 18500,
        setup: "Private Account",
        desc: "Generate stunning presentations, pitch decks, dynamic reports, and landing pages in seconds using interactive AI layout prompts.",
        specs: ["Unlimited AI Credits", "Custom Fonts & Style Kits", "Advanced View Analytics", "Export to PDF & Powerpoint"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ec4899"><path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18l-8-4-8 4z" stroke-linejoin="round"/></svg>`
    },
    {
        id: "replit-core",
        name: "Replit Core Yearly",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 12000,
        originalPrice: 32000,
        setup: "Private Account",
        desc: "Code, build, and deploy software within a high-performance cloud IDE. Includes Replit AI Assistant, cloud server resources, and workspace integrations.",
        specs: ["12 Months Core Access", "Unlimited AI Autocomplete & Chat", "Boosted Cloud VMs for Projects", "Collaborative Workspaces"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f97316"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>`
    },
    {
        id: "warp-build",
        name: "Warp Build CI/CD",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 2550,
        originalPrice: 5100,
        setup: "Premium Plan",
        desc: "Lightning-fast runners designed to accelerate GitHub Actions builds and software CI pipelines. Save up to 50% build time.",
        specs: ["High-Performance VM Runners", "Seamless GitHub Actions Sync", "Pre-Installed Packages Support", "Full 1 Year Warranty Support"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #a855f7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fill-opacity="0.1"/></svg>`
    },
    {
        id: "n8n-starter",
        name: "n8n Starter Cloud",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 5650,
        originalPrice: 11000,
        setup: "Private Account",
        desc: "Integrate APIs, automate data pipelines, and connect chat interfaces using n8n's node-based automation tools. Cloud hosting included.",
        specs: ["5 active workflows", "20,000 execution credits/mo", "Advanced Webhooks & API Connectors", "12 Months Duration Support"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff6c37"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6M18 9v6M9 6h6M9 18h6" stroke-linecap="round"/></svg>`
    },
    {
        id: "wispr-flow",
        name: "Wispr Flow Pro",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 6430,
        originalPrice: 12800,
        setup: "Writing Assistant",
        desc: "Dictate documents, codes, or emails in real-time. Wispr Flow Pro processes speaking patterns and edits formatting automatically.",
        specs: ["High-Fidelity Voice Transcription", "Smart Editing & Formatting", "Works across any desktop application", "Private dictation workspace"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ec4899"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8" stroke-linecap="round"/></svg>`
    },
    {
        id: "canva-admin",
        name: "Canva Admin Panel",
        category: "creative",
        duration: "12 Months Plan",
        price: 1960,
        originalPrice: 3900,
        setup: "Admin Panel Access",
        desc: "Get an enterprise-level admin dashboard supporting up to 500 premium student/team seats. Ideal for resellers or business managers.",
        specs: ["500 Premium Brand Seats", "Seat Allocation Dashboard", "Brand Kits & Custom Fonts Control", "Full Yearly Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #06b6d4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V9M15 17v-4" stroke-linecap="round"/></svg>`
    },
    {
        id: "elevenlabs-creator",
        name: "ElevenLabs Creator",
        category: "video-audio",
        duration: "12 Months Plan",
        price: 12850,
        originalPrice: 25500,
        setup: "Private Account",
        desc: "Convert text to high-fidelity audio streams. Access professional voice actors, advanced voice design sliders, and cloning suites.",
        specs: ["100,000 monthly text characters", "Access 30+ default premium voices", "Custom Instant Voice Cloning", "Commercial distribution license"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981"><path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" stroke-linecap="round"/></svg>`
    },
    {
        id: "youtube-12m",
        name: "YouTube Premium",
        category: "entertainment",
        duration: "12 Months Plan",
        price: 6200,
        originalPrice: 12000,
        setup: "Activated on Client Email",
        desc: "Remove commercials and banner ads from videos. Play videos in the background and download high-quality videos for offline access.",
        specs: ["12 Months Duration Guarantee", "YouTube Music Premium access", "Background Picture-in-Picture play", "No-ads across TV, Mobile, Desktop"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ff0000"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        id: "youtube-3m",
        name: "YouTube Premium",
        category: "entertainment",
        duration: "3 Months Plan",
        price: 880,
        originalPrice: 1800,
        setup: "Activated on Client Email",
        desc: "Enjoy video content without interruptions. Includes high-fidelity YouTube Music access activated directly on your email.",
        specs: ["3 Months Duration Guarantee", "YouTube Music Premium access", "Offline download options", "Ad-Free visual interface"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ef4444"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        id: "youtube-1m",
        name: "YouTube Premium",
        category: "entertainment",
        duration: "Monthly Access",
        price: 500,
        originalPrice: 1200,
        setup: "Activated on Client Email",
        desc: "Get monthly premium access to video and music without ads. Activated instantly on client email.",
        specs: ["1 Month Duration Guarantee", "Ad-free experience", "Offline background play", "YouTube Music Included"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #b91c1c"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        id: "xbox-code",
        name: "Xbox Gift Code",
        category: "entertainment",
        duration: "Random Voucher",
        price: 600,
        originalPrice: 1500,
        setup: "Digital Code Delivery",
        desc: "Receive random Xbox balance or game vouchers. Redeem codes directly inside the Microsoft Store dashboard.",
        specs: ["Instant Delivery", "Usable globally on Xbox console", "Secure unused voucher codes", "Full redemption warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #107c10"><path d="M12.016 0C5.378 0 0 5.379 0 12.016c0 6.637 5.378 12.016 12.016 12.016 6.637 0 12.016-5.379 12.016-12.016C24.032 5.379 18.653 0 12.016 0zM12 1.58a10.38 10.38 0 0 1 5.926 1.838c-1.42 1.488-3.41 2.656-5.926 3.486-2.516-.83-4.506-1.998-5.926-3.486A10.38 10.38 0 0 1 12 1.58zm-7.058 3.12c1.393 1.399 3.298 2.502 5.666 3.284C8.423 8.71 6.136 9.605 3.75 9.77a10.354 10.354 0 0 1 1.192-5.07zm14.116 0A10.354 10.354 0 0 1 20.25 9.77c-2.386-.165-4.673-1.06-6.858-1.786 2.368-.782 4.273-1.885 5.666-3.284zM12 9.206c2.404.793 4.887 1.769 7.424 2.1a10.463 10.463 0 0 1-.225 3.324c-1.636-1.502-3.87-2.906-7.199-3.799-3.329.893-5.563 2.297-7.199 3.799.145-1.127.07-2.261-.225-3.324 2.537-.331 5.02-1.307 7.424-2.1zm-7.464 6.727c1.34-1.026 3.178-2.148 5.918-2.943v8.528A10.392 10.392 0 0 1 4.536 15.933zm14.928 0a10.392 10.392 0 0 1-5.918 5.603v-8.528c2.74.795 4.578 1.917 5.918 2.943z"/></svg>`
    },
    {
        id: "linkedin-career",
        name: "LinkedIn Career",
        category: "creative",
        duration: "3 Months Plan",
        price: 520,
        originalPrice: 1000,
        setup: "Professional Premium",
        desc: "Boost your job application search. Includes competitive applicant analytics, profile highlights, and 5 InMail messages per month.",
        specs: ["5 Premium InMail Credits/mo", "See who viewed your profile", "LinkedIn Learning Access", "Advanced applicant statistics"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #0077b5"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/></svg>`
    },
    {
        id: "hotmail-verified",
        name: "Verified Hotmail Account",
        category: "vpn-security",
        duration: "Aged Outlook Profile",
        price: 50,
        originalPrice: 200,
        setup: "Account Delivery",
        desc: "Aged, PVA verified Hotmail/Outlook email profiles. Clean registration history, perfect for signing up to third party services.",
        specs: ["Aged & Active email profile", "Verified phone recovery status", "IMAP/SMTP enabled access", "Full replacement warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #0078d4"><path d="M0 3.449L9.75 2.1v9.9H0v-8.55zm0 17.102l9.75 1.349v-9.9H0v8.551zm11.25 1.556l12.75 1.893V12h-12.75v10.107zM11.25.002V12h12.75V3.889L11.25.002z"/></svg>`
    },
    {
        id: "nordvpn-monthly",
        name: "Nord VPN",
        category: "vpn-security",
        duration: "Monthly Access",
        price: 2500,
        originalPrice: 4500,
        setup: "Activated on Client Email",
        desc: "Unlock secure virtual networks. Features high-speed server tunnels, Threat Protection malware blocking, and access on up to 10 devices.",
        specs: ["Activated on Client Email", "6,000+ Fast Servers Access", "Advanced threat block engine", "Private double-hop VPN"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #4687ff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.111 8.529c.356.924.364 2.167-.323 3.018l-3.327 3.996a.82.82 0 0 1-.95.234l-2.072-.94a.52.52 0 0 0-.46.042l-1.393.978a.4.4 0 0 1-.606-.412l.643-3.486a.54.54 0 0 0-.168-.488l-1.92-1.764c-.38-.349-.185-1.026.34-.143l2.845 2.502a.5.5 0 0 0 .61.042l2.378-1.576a.56.56 0 0 1 .64.048l2.003 1.554c.25.194.615.11.758-.17l1.782-3.483a.4.4 0 0 1 .632-.143z"/></svg>`
    },
    {
        id: "surfshark-monthly",
        name: "Surfshark VPN",
        category: "vpn-security",
        duration: "Monthly Access",
        price: 1130,
        originalPrice: 2200,
        setup: "Shared Premium Account",
        desc: "High-speed browsing VPN featuring unlimited simultaneous device installations, CleanWeb advertisement block, and strict no-logs protocols.",
        specs: ["Fast Shared Account Profile", "CleanWeb ads blocking utility", "3,200+ secure server locations", "Unlimited device connections"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #00d2c4"><path d="M12 0C5.373 0 0 5.373 0 12c0 3.738 1.705 7.079 4.382 9.294l.006-.006c2.476-2.585 5.617-4.148 9.06-4.636V12.18c-1.893-.306-3.328-1.954-3.328-3.94 0-2.206 1.794-4 4-4s4 1.794 4 4c0 1.986-1.435 3.634-3.328 3.94v4.472c3.443.488 6.584 2.051 9.06 4.636l.006.006C22.295 19.079 24 15.738 24 12c0-6.627-5.373-12-12-12zm.8 6.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`
    },
    {
        id: "adobe-12m",
        name: "Adobe Full Bundle Plan",
        category: "creative",
        duration: "12 Months Plan",
        price: 12000,
        originalPrice: 45000,
        setup: "Creative Cloud Suite",
        desc: "Unlock access to 20+ desktop & mobile apps including Photoshop, Illustrator, Premiere Pro, and Acrobat. Activated directly on client email.",
        specs: ["Photoshop, Illustrator, Premiere", "Adobe Firefly Generative AI", "100GB Cloud Storage Sync", "Full 1 Year Warranty Protection"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ff0000"><path d="M13.9 2H22v20h-8.1zM9.5 2H2v20h7.5zM12 7.5l4.8 11.5h-2.5l-1.3-3.2H9l-1.3 3.2H5.2z"/></svg>`
    },
    {
        id: "adobe-3m",
        name: "Adobe Full Bundle Plan",
        category: "creative",
        duration: "3 Months Plan",
        price: 1540,
        originalPrice: 3100,
        setup: "Creative Cloud Suite",
        desc: "Short duration bundle. Access Photoshop, Premiere, and all major Adobe apps with high-speed cloud sync.",
        specs: ["20+ Adobe creative utilities", "Firefly AI generative credits", "High-speed cloud cloud backup", "3 Months Duration Guarantee"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ef4444"><path d="M13.9 2H22v20h-8.1zM9.5 2H2v20h7.5zM12 7.5l4.8 11.5h-2.5l-1.3-3.2H9l-1.3 3.2H5.2z"/></svg>`
    },
    {
        id: "adobe-6m",
        name: "Adobe Full Bundle Plan",
        category: "creative",
        duration: "6 Months Plan",
        price: 7000,
        originalPrice: 26000,
        setup: "Creative Cloud Suite",
        desc: "Mid-term bundle. 6 months complete Creative Cloud access activated on client email with full warranty.",
        specs: ["Complete Creative Cloud suite", "Acrobat PDF editor included", "Mobile & Tablet apps support", "6 Months Duration Guarantee"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #dc2626"><path d="M13.9 2H22v20h-8.1zM9.5 2H2v20h7.5zM12 7.5l4.8 11.5h-2.5l-1.3-3.2H9l-1.3 3.2H5.2z"/></svg>`
    },
    {
        id: "yt-otp",
        name: "YouTube Verification OTP",
        category: "vpn-security",
        duration: "One-Time OTP",
        price: 300,
        originalPrice: 1000,
        setup: "Virtual Verification Number",
        desc: "Secure online bypass for phone number locks. Access virtual numbers to verify YouTube channels without using personal phone numbers.",
        specs: ["Instant OTP delivery", "Suited for YouTube Channel validation", "Secure virtual gateway", "Fresh unused number pool"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f59e0b"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01" stroke-linecap="round"/></svg>`
    },
    {
        id: "cursor-pro",
        name: "Cursor Pro Monthly",
        category: "ai-coding",
        duration: "1 Month Plan",
        price: 2575,
        originalPrice: 5150,
        setup: "Private Account",
        desc: "Get premium Cursor editor capabilities. Access high-speed inline edits, full codebase indices, and fast calls to Claude 3.5 Sonnet & GPT-4o.",
        specs: ["Fast Claude 3.5 & GPT-4o access", "Full codebase indexing capacity", "Inline edits & terminal chat", "Private account environment"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #06b6d4"><path d="M5 3l14 9-14 9V3z" fill="currentColor" fill-opacity="0.1"/></svg>`
    },
    {
        id: "higgsfield-plus",
        name: "Higgsfield Plus Plan",
        category: "video-audio",
        duration: "1K Credits Monthly",
        price: 33450,
        originalPrice: 65000,
        setup: "Creator Account",
        desc: "AI video generation app optimized for creators. Animate characters, apply physical control actions, and generate high-fidelity stories.",
        specs: ["1,000 monthly visual credits", "Premium character animator access", "Advanced physics & motion curves", "Full creator support warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981"><path d="M12 2L2 22h20L12 2z" stroke-linejoin="round"/></svg>`
    }
];

// Official WhatsApp contact number
const WHATSAPP_NUMBER = "+923445739206";

// Tools flagged as Best Seller / Popular (shown with ribbons + boosted in popularity sort)
const BESTSELLER_IDS = ["grok-3m", "chatgpt-go-6m"];
const POPULAR_IDS = ["gemini-18m", "canva-yearly", "capcut-pro", "adobe-12m", "youtube-12m", "cursor-pro"];
// Order used by the "Most Popular" sort
const POPULARITY_ORDER = [
    "grok-3m", "chatgpt-go-6m", "gemini-18m", "canva-yearly", "capcut-pro",
    "adobe-12m", "youtube-12m", "cursor-pro", "lovable-200", "grok-6m",
    "elevenlabs-creator", "heygen-200"
];

// State Management
let currentCategory = "all";
let searchQuery = "";
let sortBy = "popular";

// DOM Elements
const toolsGrid = document.getElementById("tools-grid");
const categoryTabs = document.getElementById("catalog-category-tabs");
const navbarSearch = document.getElementById("navbar-search");
const heroSearchInput = document.getElementById("hero-search-input");
const heroSearchBtn = document.getElementById("hero-search-btn");
const drawerSearch = document.getElementById("drawer-search");
const filterResultsInfo = document.getElementById("filter-results-info");
const emptyState = document.getElementById("catalog-empty-state");
const resetBtn = document.getElementById("reset-catalog-btn");

// Mobile Drawer Elements
const mobileToggle = document.getElementById("mobile-menu-toggle");
const mobileDrawer = document.getElementById("mobile-navigation-drawer");
const drawerClose = document.getElementById("mobile-drawer-close");
const drawerLinks = document.querySelectorAll(".drawer-link");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    // Render initial database (sorted by popularity)
    filterAndRender();

    // Sort dropdown listener
    const sortSelect = document.getElementById("catalog-sort");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            sortBy = e.target.value;
            filterAndRender();
        });
    }

    // Setup Category Tab Listeners
    if (categoryTabs) {
        categoryTabs.addEventListener("click", (e) => {
            const button = e.target.closest(".tab-btn");
            if (!button) return;

            // Remove active classes
            categoryTabs.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
            
            // Add active class
            button.classList.add("active");
            currentCategory = button.getAttribute("data-category");
            
            // Filter
            filterAndRender();
        });
    }

    // Sync Search Inputs
    const syncSearch = (value) => {
        searchQuery = value.toLowerCase().trim();
        
        if (navbarSearch) navbarSearch.value = value;
        if (heroSearchInput) heroSearchInput.value = value;
        if (drawerSearch) drawerSearch.value = value;

        filterAndRender();
    };

    if (navbarSearch) {
        navbarSearch.addEventListener("input", (e) => syncSearch(e.target.value));
    }
    if (heroSearchInput) {
        heroSearchInput.addEventListener("input", (e) => syncSearch(e.target.value));
    }
    if (drawerSearch) {
        drawerSearch.addEventListener("input", (e) => syncSearch(e.target.value));
    }
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener("click", () => {
            if (heroSearchInput) {
                syncSearch(heroSearchInput.value);
                // Scroll to catalog section
                const catalogSection = document.getElementById("catalog-section");
                if (catalogSection) {
                    catalogSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }

    // Reset Filters Button
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            syncSearch("");
            // Set category to all
            currentCategory = "all";
            categoryTabs.querySelectorAll(".tab-btn").forEach(btn => {
                btn.classList.remove("active");
                if (btn.getAttribute("data-category") === "all") {
                    btn.classList.add("active");
                }
            });
            filterAndRender();
        });
    }

    // Setup FAQ Accordion Toggles
    const faqWrapper = document.getElementById("faq-accordion-wrapper");
    if (faqWrapper) {
        faqWrapper.addEventListener("click", (e) => {
            const questionBtn = e.target.closest(".faq-question");
            if (!questionBtn) return;

            const faqItem = questionBtn.closest(".faq-item");
            const answer = faqItem.querySelector(".faq-answer");
            const isExpanded = questionBtn.getAttribute("aria-expanded") === "true";

            // Toggle current FAQ
            questionBtn.setAttribute("aria-expanded", !isExpanded);
            answer.hidden = isExpanded;
        });
    }

    // Setup Mobile Menu Drawer Listeners
    if (mobileToggle && mobileDrawer && drawerClose) {
        mobileToggle.addEventListener("click", () => {
            mobileDrawer.classList.add("open");
        });

        drawerClose.addEventListener("click", () => {
            mobileDrawer.classList.remove("open");
        });

        // Close drawer when links are clicked
        drawerLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileDrawer.classList.remove("open");
            });
        });
    }

    // ==========================================
    // CUSTOMER REVIEWS LIGHTBOX FUNCTIONALITY
    // ==========================================
    const reviewsSection = document.getElementById("reviews-section");
    const lightbox = document.getElementById("reviews-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close-btn");

    if (reviewsSection && lightbox && lightboxImg) {
        // Event delegation for clicking review thumbnails
        reviewsSection.addEventListener("click", (e) => {
            const wrapper = e.target.closest(".review-image-wrapper");
            if (!wrapper) return;

            const thumbnailImg = wrapper.querySelector(".review-thumbnail");
            if (thumbnailImg) {
                lightboxImg.src = thumbnailImg.src;
                lightboxImg.alt = thumbnailImg.alt;
                lightbox.classList.add("active");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden"; // Prevent background scrolling
            }
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // Re-enable background scrolling
            setTimeout(() => {
                lightboxImg.src = "";
            }, 350);
        };

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        // Close on clicking overlay outside the image
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    // ==========================================
    // STAGGERED SCROLL ENTRANCE ANIMATIONS
    // ==========================================
    const reviewCards = document.querySelectorAll(".review-card");
    if (reviewCards.length > 0) {
        if ("IntersectionObserver" in window) {
            const observerOptions = {
                root: null,
                rootMargin: "0px 0px -50px 0px", // Trigger slightly before element is in full view
                threshold: 0.1
            };

            const reviewsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            reviewCards.forEach(card => {
                reviewsObserver.observe(card);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            reviewCards.forEach(card => card.classList.add("revealed"));
        }
    }
});

// Render Tools helper
function renderTools(tools = TOOLS_DATABASE) {
    if (!toolsGrid) return;

    if (tools.length === 0) {
        toolsGrid.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        if (filterResultsInfo) filterResultsInfo.textContent = "No items match filter";
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    // Populate Results Info Text
    if (filterResultsInfo) {
        const catLabel = getCategoryLabel(currentCategory);
        if (searchQuery) {
            filterResultsInfo.textContent = `Search results for "${searchQuery}" in ${catLabel} (${tools.length} found)`;
        } else {
            filterResultsInfo.textContent = `Showing all items in ${catLabel} (${tools.length} found)`;
        }
    }

    const cardsHTML = tools.map(tool => {
        // Construct the predefined WhatsApp checkout message
        const waText = encodeURIComponent(
            `Hello MALIK DATA CENTRE! I want to buy:\n\n` +
            `🛍️ Tool: ${tool.name}\n` +
            `⏱️ Plan: ${tool.duration}\n` +
            `💰 Price: Rs. ${tool.price.toLocaleString()}\n` +
            `⚙️ Setup: ${tool.setup}\n\n` +
            `Please share payment details (EasyPaisa/JazzCash/Bank) and setup instructions.\n` +
            `Source: malikdatacentre.store`
        );
        const checkoutURL = `https://wa.me/923445739206?text=${waText}`;

        const badgeClass = `badge-${tool.category}`;
        const specsHTML = tool.specs.map(spec => `<li><i class="fa-solid fa-circle-check"></i> ${spec}</li>`).join("");

        // Calculate estimated savings
        const discountAmount = tool.originalPrice - tool.price;
        const discountPercentage = Math.round((discountAmount / tool.originalPrice) * 100);

        // Best Seller / Popular ribbon
        let ribbonHTML = "";
        if (BESTSELLER_IDS.includes(tool.id)) {
            ribbonHTML = `<div class="tool-ribbon ribbon-bestseller"><i class="fa-solid fa-fire"></i> Best Seller</div>`;
        } else if (POPULAR_IDS.includes(tool.id)) {
            ribbonHTML = `<div class="tool-ribbon ribbon-popular"><i class="fa-solid fa-star"></i> Popular</div>`;
        }

        const saveBadgeHTML = discountPercentage > 0
            ? `<span class="tool-save-badge">SAVE ${discountPercentage}%</span>`
            : "";

        return `
            <article class="glass-card tool-card" id="tool-${tool.id}">
                ${ribbonHTML}
                ${saveBadgeHTML}
                <div class="tool-card-top">
                    <div class="tool-card-header">
                        <span class="tool-badge ${badgeClass}">${getCategoryLabel(tool.category)}</span>
                        <div class="tool-icon-box" aria-hidden="true">
                            ${tool.icon}
                        </div>
                    </div>
                    <div class="tool-card-body">
                        <h3 class="tool-title">${tool.name}</h3>
                        <div class="tool-duration">${tool.duration}</div>
                        <p class="tool-desc">${tool.desc}</p>
                        <ul class="tool-specs">
                            <li><i class="fa-solid fa-shield-halved" style="color: var(--primary)"></i> <strong>${tool.setup}</strong></li>
                            ${specsHTML}
                        </ul>
                    </div>
                </div>
                <div class="tool-card-footer">
                    <div class="tool-price-wrapper">
                        <span class="tool-original-price">Rs ${tool.originalPrice.toLocaleString()}</span>
                        <span class="tool-price">Rs ${tool.price.toLocaleString()}</span>
                    </div>
                    <a href="${checkoutURL}" target="_blank" class="btn btn-success btn-buy" id="btn-order-${tool.id}">
                        <i class="fa-brands fa-whatsapp"></i> Buy Now
                    </a>
                    <button class="btn-addcart" id="addcart-${tool.id}"
                        data-id="${tool.id}"
                        data-name="${tool.name.replace(/"/g, '&quot;')}"
                        data-price="${tool.price}"
                        data-duration="${tool.duration.replace(/"/g, '&quot;')}"
                        data-setup="${tool.setup.replace(/"/g, '&quot;')}"
                        aria-label="Add ${tool.name.replace(/"/g, '&quot;')} to cart" title="Add to cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </article>
        `;
    }).join("");

    toolsGrid.innerHTML = cardsHTML;
}

// Filter core engine
function filterAndRender() {
    let filtered = TOOLS_DATABASE;

    // Filter by Category
    if (currentCategory !== "all") {
        filtered = filtered.filter(tool => tool.category === currentCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
        filtered = filtered.filter(tool => {
            return (
                tool.name.toLowerCase().includes(searchQuery) ||
                tool.desc.toLowerCase().includes(searchQuery) ||
                tool.setup.toLowerCase().includes(searchQuery) ||
                tool.duration.toLowerCase().includes(searchQuery)
            );
        });
    }

    // Sort
    filtered = sortTools(filtered.slice());

    renderTools(filtered);
}

// Sort engine
function sortTools(list) {
    if (sortBy === "price-low") {
        list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
        const disc = (t) => (t.originalPrice - t.price) / t.originalPrice;
        list.sort((a, b) => disc(b) - disc(a));
    } else {
        // popular (default): featured order first, then the rest as-is
        list.sort((a, b) => {
            const ia = POPULARITY_ORDER.indexOf(a.id);
            const ib = POPULARITY_ORDER.indexOf(b.id);
            const ra = ia === -1 ? 999 : ia;
            const rb = ib === -1 ? 999 : ib;
            return ra - rb;
        });
    }
    return list;
}

// Translate raw category IDs to readable English tags
function getCategoryLabel(categoryId) {
    const categories = {
        "all": "All Categories",
        "ai-chat": "AI Chat & Assistants",
        "ai-coding": "AI Coding & Dev",
        "creative": "Design & Creative",
        "video-audio": "AI Video & Audio",
        "vpn-security": "VPNs & Security",
        "entertainment": "Entertainment"
    };
    return categories[categoryId] || categoryId;
}
