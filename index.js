// Malik Data Centre - Application Script

// Currency Converter Utility Configuration
window.currencyConverter = {
    currentCurrency: "PKR",
    rates: {
        PKR: 1.0,
        USD: 0.0036,
        EUR: 0.0033,
        GBP: 0.0028,
        INR: 0.30,
        BDT: 0.42,
        LKR: 1.08,
        UZS: 45.45,
        MYR: 0.017,
        IDR: 58.82,
        TRY: 0.12,
        SAR: 0.0135,
        AED: 0.0132,
        KWD: 0.0011,
        QAR: 0.0131,
        OMR: 0.0014
    },
    symbols: {
        PKR: "Rs",
        USD: "$",
        EUR: "€",
        GBP: "£",
        INR: "₹",
        BDT: "৳",
        LKR: "Rs",
        UZS: "soʻm",
        MYR: "RM",
        IDR: "Rp",
        TRY: "₺",
        SAR: "ر.س",
        AED: "د.إ",
        KWD: "KD",
        QAR: "ر.ق",
        OMR: "ر.ع."
    },
    init: function () {
        try {
            var stored = localStorage.getItem("mdc_currency");
            if (stored && this.rates[stored]) {
                this.currentCurrency = stored;
            }
        } catch (e) {}
        this.updateSelectors();
        
        var self = this;
        ["mdc-currency-select", "drawer-currency-select"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                el.value = self.currentCurrency;
                // Remove any old listeners by replacing or assigning onchange
                el.onchange = function (e) {
                    self.setCurrency(e.target.value);
                };
            }
        });
    },
    setCurrency: function (curr) {
        if (!this.rates[curr]) return;
        this.currentCurrency = curr;
        try {
            localStorage.setItem("mdc_currency", curr);
        } catch (e) {}
        this.updateSelectors();
        if (typeof window.filterAndRender === "function") {
            window.filterAndRender();
        } else if (typeof filterAndRender === "function") {
            filterAndRender();
        }
        var event = new CustomEvent("mdcCurrencyChanged", { detail: curr });
        window.dispatchEvent(event);
    },
    updateSelectors: function () {
        var self = this;
        ["mdc-currency-select", "drawer-currency-select"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.value = self.currentCurrency;
        });
    },
    convert: function (pkrAmount) {
        var rate = this.rates[this.currentCurrency] || 1.0;
        return pkrAmount * rate;
    },
    format: function (pkrAmount) {
        var converted = this.convert(pkrAmount);
        var symbol = this.symbols[this.currentCurrency] || "Rs";
        if (this.currentCurrency === "PKR") {
            return symbol + " " + Math.round(converted).toLocaleString();
        } else {
            return symbol + " " + converted.toFixed(2);
        }
    }
};

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
        price: 2200,
        originalPrice: 8500,
        setup: "Activated on Client Email",
        desc: "Access Google's state-of-the-art Gemini 1.5 Pro model. Features massive 1M token context, high-speed coding assistance, and seamless Google Workspace integrations.",
        specs: ["Full Warranty & Private", "Gemini 1.5 Pro Access", "1M Token Context Window", "Google Docs/Gmail Sync"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #4285f4"><path d="M12 2v20M2 12h20" stroke-linecap="round"/><path d="M12 2c3.5 4 6.5 7 10 10-3.5 3-6.5 6-10 10C8.5 19 5.5 16 2 12c3.5-3 6.5-6 10-10z" fill="currentColor" fill-opacity="0.1" stroke-linejoin="round"/></svg>`
    },
    {
        id: "google-ai-ultra-shared-1m",
        name: "Google AI Ultra Shared Base Unlimited",
        category: "ai-chat",
        duration: "1 Month Subscription",
        price: 2500,
        originalPrice: 6000,
        setup: "Shared Premium Account",
        desc: "Google AI Ultra Shared Base unlimited video generation, Antigravity, and all other premium features included.",
        specs: ["25 Days Full Warranty", "Unlimited Video Generation", "Google Antigravity & Veo Access", "All Premium AI Features"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #4285f4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
    },
    {
        id: "google-ai-ultra-family-1m",
        name: "Google AI Ultra Private Family Invitation",
        category: "ai-chat",
        duration: "1 Month Plan",
        price: 8500,
        originalPrice: 18000,
        setup: "Private Family Invitation",
        desc: "Google AI Ultra Family Invitation 🚀 — 25K AI Credits, Veo 3, Google Antigravity, Flow, Gemini Ultra & Premium AI Features with high usage limits.",
        specs: ["25K AI Credits Included", "Veo 3 & Google Antigravity", "Flow & Gemini Ultra Access", "25 Days Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ea4335"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`
    },
    {
        id: "google-ai-ultra-25k-slot",
        name: "Google AI Ultra 25k Credits Slot",
        category: "ai-chat",
        duration: "1 Month Subscription",
        price: 26000,
        originalPrice: 45000,
        setup: "Dedicated Slot",
        desc: "Google AI Ultra 25k Credits Slot with full access to Gemini Ultra, Veo 3, and high usage limit AI features.",
        specs: ["25K High Usage AI Credits", "28 Days Full Warranty", "Veo 3 & Gemini Ultra", "Manual Fast Delivery"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #fbbc04"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>`
    },
    {
        id: "gemini-pro-18m-private",
        name: "Gemini Pro 18 Months (Private 5TB)",
        category: "ai-chat",
        duration: "18 Months Subscription",
        price: 700,
        originalPrice: 3500,
        setup: "Full Private Code",
        desc: "Google AI Pro 18 Months — Full Private • 5TB Storage • 1,000 AI Credits • Premium AI Features • Instant Redeem.",
        specs: ["5TB Google Cloud Storage", "1,000 AI Credits Included", "Full Private Account", "1 Day Warranty / Instant Redeem"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #34a853"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>`
    },
    {
        id: "capcut-pro-1m",
        name: "CapCut Pro 1 Month",
        category: "creative",
        duration: "1 Month",
        price: 800,
        originalPrice: 2000,
        setup: "2 Devices Login",
        desc: "CapCut Pro 1 Month • 2 Devices • Premium Features • Instant Delivery • Warranty Available.",
        specs: ["2 Devices Supported", "25 Days Warranty", "Pro Video Effects & 4K Export", "Manual Fast Delivery"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #00f2fe"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8z"/></svg>`
    },
    {
        id: "capcut-pro-3m",
        name: "CapCut Pro 3 Months",
        category: "creative",
        duration: "3 Months",
        price: 2800,
        originalPrice: 5500,
        setup: "2 Devices Login",
        desc: "CapCut Pro 3 Months • 2 Devices • Premium Features • Instant Delivery • Warranty Available.",
        specs: ["2 Devices Supported", "90 Days Full Warranty", "Pro AI Video Tools & Templates", "Manual Fast Delivery"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #4facfe"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8z"/></svg>`
    },
    {
        id: "capcut-pro-6m",
        name: "CapCut Pro 6 Months",
        category: "creative",
        duration: "6 Months",
        price: 4800,
        originalPrice: 10000,
        setup: "2 Devices Login",
        desc: "CapCut Pro 6 Months • 2 Devices • Premium Features • Instant Delivery • Full Warranty.",
        specs: ["2 Devices Supported", "180 Days Full Warranty", "Pro Animation & Cloud Sync", "Manual Fast Delivery"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #00c6ff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8z"/></svg>`
    },
    {
        id: "grok-10d",
        name: "Super Grok + X Premium+",
        category: "ai-chat",
        duration: "10 Days Plan",
        price: 1500,
        originalPrice: 4000,
        setup: "Activated on Client Email",
        desc: "Get X (formerly Twitter) Premium+ access with a Blue Verification Tick and access to Grok AI chatbot with real-time X search data.",
        specs: ["Official Blue Tick Badge", "Grok AI Assistant Access", "7 Days Full Warranty", "Full Ad-Free X Experience"],
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
        price: 1250,
        originalPrice: 3500,
        setup: "Private Activation",
        desc: "Unlock advanced AI video filters, keyframe animation tools, speech-to-text auto-captions, and premium editing assets on desktop & mobile.",
        specs: ["Remove Video Watermarks", "Exclusive Pro Effects & Transitions", "AI Voiceover & Subtitles", "4K Ultra-HD Exports"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff3c88"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
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
        price: 3500,
        originalPrice: 9000,
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
        price: 5000,
        originalPrice: 15000,
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
        price: 6000,
        originalPrice: 20000,
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
        price: 400,
        originalPrice: 3000,
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
        price: 13000,
        originalPrice: 35000,
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
        price: 9500,
        originalPrice: 24000,
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
        id: "replit-core-100",
        name: "Replit Core $100 Topup",
        category: "ai-coding",
        duration: "$100 Credit Plan",
        price: 9500,
        originalPrice: 22000,
        setup: "Ready-Made Account",
        desc: "Official Replit Core ready-made account pre-loaded with $100 topup credits. Access Replit AI, custom deployments, and high-performance server power.",
        specs: ["$100 Loaded Credit Balance", "20 Days Full Warranty", "Ready-Made Private Account", "Replit AI Assistant & Fast VMs"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f97316"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>`
    },
    {
        id: "warp-build",
        name: "Warp Build CI/CD",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 6000,
        originalPrice: 18000,
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
        price: 7000,
        originalPrice: 20000,
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
        price: 7500,
        originalPrice: 22000,
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
        price: 4500,
        originalPrice: 15000,
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
        price: 12000,
        originalPrice: 38000,
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
        price: 2000,
        originalPrice: 3500,
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
        price: 800,
        originalPrice: 9000,
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
        price: 400,
        originalPrice: 1500,
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
        price: 4000,
        originalPrice: 15000,
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
        price: 4200,
        originalPrice: 8000,
        setup: "Private Account",
        desc: "Get premium Cursor editor capabilities. Access high-speed inline edits, full codebase indices, and fast calls to Claude 3.5 Sonnet & GPT-4o.",
        specs: ["Fast Claude 3.5 & GPT-4o access", "Full codebase indexing capacity", "Inline edits & terminal chat", "Private account environment"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #06b6d4"><path d="M5 3l14 9-14 9V3z" fill="currentColor" fill-opacity="0.1"/></svg>`
    },
    {
        id: "higgsfield-plus",
        name: "Higgsfield Plus Plan",
        category: "video-audio",
        duration: "1200 Credits Plan",
        price: 7500,
        originalPrice: 15000,
        setup: "Creator Account",
        desc: "AI video generation app optimized for creators. Animate characters, apply physical control actions, and generate high-fidelity stories.",
        specs: ["1,200 Visual Credits Pack", "20 Days Full Warranty", "Premium Character Animator", "Advanced Physics & Motion Curves"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981"><path d="M12 2L2 22h20L12 2z" stroke-linejoin="round"/></svg>`
    },
    {
        id: "xbox-random-1m",
        name: "Gift Xbox Random",
        category: "entertainment",
        duration: "1 Month Plan",
        price: 1800,
        originalPrice: 3500,
        setup: "Digital Code Delivery",
        desc: "Get a random Xbox Game Pass or subscription voucher code. Redeemable on Microsoft accounts.",
        specs: ["1 Month Validity", "Random Voucher Code", "Global Server Activation", "Full Warranty Support"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #107c10"><path d="M12.016 0C5.378 0 0 5.379 0 12.016c0 6.637 5.378 12.016 12.016 12.016 6.637 0 12.016-5.379 12.016-12.016C24.032 5.379 18.653 0 12.016 0zM12 1.58a10.38 10.38 0 0 1 5.926 1.838c-1.42 1.488-3.41 2.656-5.926 3.486-2.516-.83-4.506-1.998-5.926-3.486A10.38 10.38 0 0 1 12 1.58zm-7.058 3.12c1.393 1.399 3.298 2.502 5.666 3.284C8.423 8.71 6.136 9.605 3.75 9.77a10.354 10.354 0 0 1 1.192-5.07zm14.116 0A10.354 10.354 0 0 1 20.25 9.77c-2.386-.165-4.673-1.06-6.858-1.786 2.368-.782 4.273-1.885 5.666-3.284zM12 9.206c2.404.793 4.887 1.769 7.424 2.1a10.463 10.463 0 0 1-.225 3.324c-1.636-1.502-3.87-2.906-7.199-3.799-3.329.893-5.563 2.297-7.199 3.799.145-1.127.07-2.261-.225-3.324 2.537-.331 5.02-1.307 7.424-2.1zm-7.464 6.727c1.34-1.026 3.178-2.148 5.918-2.943v8.528A10.392 10.392 0 0 1 4.536 15.933zm14.928 0a10.392 10.392 0 0 1-5.918 5.603v-8.528c2.74.795 4.578 1.917 5.918 2.943z"/></svg>`
    },
    {
        id: "picsart-pro-11m",
        name: "Picsart Pro",
        category: "creative",
        duration: "11 Months Plan",
        price: 3500,
        originalPrice: 8000,
        setup: "Activated on Client Email",
        desc: "Unlock Picsart Pro advanced AI image generation, design templates, photo filters, custom fonts, and high-res exports.",
        specs: ["Full Premium assets access", "AI Design Studio Tools", "No ads or watermarks", "11 Months Duration Support"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff3c88"><circle cx="12" cy="12" r="10"/><path d="M8 12c2.5-1 5.5-1 8 0" stroke-linecap="round"/></svg>`
    },
    {
        id: "key-hma",
        name: "HMA VPN Key",
        category: "vpn-security",
        duration: "Yearly License Key",
        price: 5500,
        originalPrice: 12000,
        setup: "License Key Delivery",
        desc: "Official HideMyAss (HMA) VPN subscription activation retail license key. Access global high-speed servers.",
        specs: ["Secure encryption tunnels", "Access 1100+ servers", "Supports up to 5 devices", "12 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #4687ff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.111 8.529c.356.924.364 2.167-.323 3.018l-3.327 3.996a.82.82 0 0 1-.95.234l-2.072-.94a.52.52 0 0 0-.46.042l-1.393.978a.4.4 0 0 1-.606-.412l.643-3.486a.54.54 0 0 0-.168-.488l-1.92-1.764c-.38-.349-.185-1.026.34-.143l2.845 2.502a.5.5 0 0 0 .61.042l2.378-1.576a.56.56 0 0 1 .64.048l2.003 1.554c.25.194.615.11.758-.17l1.782-3.483a.4.4 0 0 1 .632-.143z"/></svg>`
    },
    {
        id: "windows-activation-key",
        name: "Windows 10/11 Pro Key",
        category: "vpn-security",
        duration: "Lifetime License",
        price: 2000,
        originalPrice: 6000,
        setup: "Instant Retail Key",
        desc: "Official lifetime retail activation key for Windows 10 Professional or Windows 11 Professional.",
        specs: ["Lifetime activation key", "Support both Win 10 & 11 Pro", "Official Microsoft Updates", "Instant setup code"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #06b6d4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V9M15 17v-4" stroke-linecap="round"/></svg>`
    },
    {
        id: "zoom-pro-monthly",
        name: "Zoom Pro",
        category: "entertainment",
        duration: "Monthly Access",
        price: 1500,
        originalPrice: 4000,
        setup: "Premium Account Login",
        desc: "Host unlimited group meetings up to 30 hours, up to 100 participants per meeting, with cloud recording support.",
        specs: ["Host meetings up to 30 hours", "100 participants capacity", "Cloud meeting recordings", "Full Monthly Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #7c3aed"><rect x="2" y="3" width="20" height="14" rx="2" stroke-linejoin="round"/><path d="M8 21h8M12 17v4" stroke-linecap="round"/><path d="M10 8l5 3-5 3V8z" fill="currentColor"/></svg>`
    },
    {
        id: "linkedin-career-3m",
        name: "LinkedIn Career",
        category: "creative",
        duration: "3 Months Plan",
        price: 1800,
        originalPrice: 9000,
        setup: "Professional Premium",
        desc: "Get stand-out status for job applications, direct InMail credits, profile view insights, and LinkedIn Learning.",
        specs: ["5 InMail credits per month", "See who viewed your profile", "Full LinkedIn Learning access", "3 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #0077b5"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/></svg>`
    },
    {
        id: "ms-office-1y",
        name: "Microsoft Office 365",
        category: "vpn-security",
        duration: "12 Months Plan",
        price: 29900,
        originalPrice: 45000,
        setup: "Activated on Client Email",
        desc: "Premium access to Word, Excel, PowerPoint, Outlook, and OneDrive cloud storage up to 1TB.",
        specs: ["Word, Excel, PowerPoint Pro", "1TB OneDrive cloud storage", "Use on up to 5 devices", "1 Year Official Access"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff6c37"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linejoin="round"/><path d="M14 2v6h6" stroke-linejoin="round"/></svg>`
    },
    {
        id: "canva-pro-1y",
        name: "Canva Pro",
        category: "creative",
        duration: "12 Months Plan",
        price: 400,
        originalPrice: 3000,
        setup: "Activated on Client Email",
        desc: "Access Canva's full assets library, premium templates, magic AI design tools, and brand kits.",
        specs: ["Magic Resize & BG Remover", "Millions of premium stocks", "Collaborative brand workspace", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #00c4cc"><circle cx="12" cy="12" r="10"/><path d="M8 12c2.5-1 5.5-1 8 0" stroke-linecap="round"/></svg>`
    },
    {
        id: "adobe-cc-4m",
        name: "Adobe Creative Cloud",
        category: "creative",
        duration: "4 Months Plan",
        price: 3900,
        originalPrice: 16000,
        setup: "Activated on Client Email",
        desc: "Access 20+ Adobe desktop and mobile creative apps including Photoshop, Illustrator, Premiere Pro.",
        specs: ["Photoshop, Premiere, Illustrator", "Adobe Firefly AI credits", "100GB Cloud Storage sync", "4 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ff0000"><path d="M13.9 2H22v20h-8.1zM9.5 2H2v20h7.5zM12 7.5l4.8 11.5h-2.5l-1.3-3.2H9l-1.3 3.2H5.2z"/></svg>`
    },
    {
        id: "coursera-premium-12m",
        name: "Coursera Plus Premium",
        category: "entertainment",
        duration: "12 Months Plan",
        price: 3200,
        originalPrice: 12000,
        setup: "Private Activation",
        desc: "Unlimited access to 7,000+ courses, guided projects, and professional certificates from top universities.",
        specs: ["7,000+ courses & specializations", "Professional certificates included", "Learn at your own pace", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f59e0b"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linejoin="round"/></svg>`
    },
    {
        id: "replit-core-12m",
        name: "Replit Core",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 10700,
        originalPrice: 32000,
        setup: "Private Account",
        desc: "Write, build, and deploy software within a collaborative cloud IDE. Includes Replit AI Assistant.",
        specs: ["Replit AI Autocomplete & Chat", "Boosted workspace VM resources", "1-click cloud deployments", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f97316"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>`
    },
    {
        id: "warp-build-12m",
        name: "Warp Build CI/CD",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 4800,
        originalPrice: 18000,
        setup: "Premium Plan",
        desc: "High-speed runners to accelerate GitHub Actions builds and software CI pipelines. Save 50% build time.",
        specs: ["High performance runners", "GitHub Actions integration", "Pre-cached environments", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #a855f7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fill-opacity="0.1"/></svg>`
    },
    {
        id: "n8n-starter-12m",
        name: "n8n Starter Cloud",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 6500,
        originalPrice: 20000,
        setup: "Private Account",
        desc: "Integrate APIs, automate workflows, and sync databases. Includes starter tier cloud hosting.",
        specs: ["5 active cloud workflows", "20k monthly executions", "Node-based automation creator", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff6c37"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6M18 9v6M9 6h6M9 18h6" stroke-linecap="round"/></svg>`
    },
    {
        id: "whisper-flow-12m",
        name: "Wispr Flow Pro",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 7500,
        originalPrice: 22000,
        setup: "Writing Assistant",
        desc: "Fast real-time voice transcription tool. Automatically format dictations for emails and scripts.",
        specs: ["AI voice transcription engine", "Smart paragraph formatting", "Works in any writing editor", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ec4899"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8" stroke-linecap="round"/></svg>`
    },
    {
        id: "notion-business-12m",
        name: "Notion Business",
        category: "creative",
        duration: "12 Months Plan",
        price: 4600,
        originalPrice: 15000,
        setup: "Workspace Activation",
        desc: "Unlock collaborative workspaces, infinite page history, advanced block permissions, and Notion AI features.",
        specs: ["Collaborative workspace blocks", "Infinite page edits history", "Advanced export & print options", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff6c37"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linejoin="round"/><path d="M14 2v6h6" stroke-linejoin="round"/></svg>`
    },
    {
        id: "gumloop-pro-12m",
        name: "Gumloop Pro",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 4550,
        originalPrice: 18000,
        setup: "Activated on Client Email",
        desc: "Build custom AI web scrapers and data extraction pipelines visually. Run workflows autonomously.",
        specs: ["Visual AI agent pipeline builder", "Advanced web data extraction", "Schedule scraping operations", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #3b82f6"><circle cx="12" cy="12" r="10"/><path d="M8 12c2.5-1 5.5-1 8 0" stroke-linecap="round"/></svg>`
    },
    {
        id: "grammarly-pro-12m",
        name: "Grammarly Pro",
        category: "creative",
        duration: "12 Months Plan",
        price: 3500,
        originalPrice: 12000,
        setup: "Activated on Client Email",
        desc: "Access advanced grammar suggestions, tone adjustments, plagiarism checkers, and Grammarly AI assistance.",
        specs: ["Tone check & vocabulary builder", "Built-in plagiarism detector", "Grammarly AI writing credits", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ec4899"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8" stroke-linecap="round"/></svg>`
    },
    {
        id: "amazon-prime-6m",
        name: "Amazon Prime Video",
        category: "entertainment",
        duration: "6 Months Plan",
        price: 1500,
        originalPrice: 4000,
        setup: "Private Profile Login",
        desc: "Watch premium movies, TV shows, and Amazon Originals in 4K Ultra HD. Ad-free streaming.",
        specs: ["4K Ultra HD video playback", "Ad-free Prime Video streams", "Supports multi-device screens", "6 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ff0000"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        id: "linkedin-sales-nav-2m",
        name: "LinkedIn Sales Navigator",
        category: "creative",
        duration: "2 Months Plan",
        price: 1800,
        originalPrice: 22000,
        setup: "Core Account Upgrade",
        desc: "Target the right buyers, understand key insights, and engage with personalized InMail outreach.",
        specs: ["50 InMail messages monthly", "Advanced lead search filters", "Real-time buyer updates notifications", "2 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #0077b5"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/></svg>`
    },
    {
        id: "youtube-premium-3m",
        name: "YouTube Premium",
        category: "entertainment",
        duration: "3 Months Plan",
        price: 1200,
        originalPrice: 3500,
        setup: "Activated on Client Email",
        desc: "Remove all commercial advertisements from YouTube. Includes background play and YouTube Music.",
        specs: ["Ad-free video streaming", "Background picture-in-picture play", "YouTube Music premium access", "3 Months Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #ff0000"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        id: "cursor-pro-12m",
        name: "Cursor Pro Yearly",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 21000,
        originalPrice: 56000,
        setup: "Private Account",
        desc: "Get yearly premium Cursor editor access. Access unlimited fast queries to Claude 3.5 Sonnet & GPT-4o.",
        specs: ["Unlimited fast Claude & GPT-4o", "Full codebase indexing capability", "Interactive terminal chat tools", "1 Year Full Warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #06b6d4"><path d="M5 3l14 9-14 9V3z" fill="currentColor" fill-opacity="0.1"/></svg>`
    },
    {
        id: "claude-api-10m",
        name: "Claude 10M API Tokens",
        category: "ai-chat",
        duration: "API Key Pack",
        price: 1200,
        originalPrice: 4000,
        setup: "API Key Access",
        desc: "Access Anthropic's Claude 3.5 models through API keys. Fully loaded with 10 Million input/output tokens.",
        specs: ["10M input/output tokens pack", "High concurrency API keys", "Claude 3.5 Sonnet & Opus support", "Full warranty replacement"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="color: #e2e8f0"><path d="M12.016 0C5.378 0 0 5.379 0 12.016c0 6.637 5.378 12.016 12.016 12.016 6.637 0 12.016-5.379 12.016-12.016C24.032 5.379 18.653 0 12.016 0zM12 1.58a10.38 10.38 0 0 1 5.926 1.838c-1.42 1.488-3.41 2.656-5.926 3.486-2.516-.83-4.506-1.998-5.926-3.486A10.38 10.38 0 0 1 12 1.58zm-7.058 3.12c1.393 1.399 3.298 2.502 5.666 3.284C8.423 8.71 6.136 9.605 3.75 9.77a10.354 10.354 0 0 1 1.192-5.07zm14.116 0A10.354 10.354 0 0 1 20.25 9.77c-2.386-.165-4.673-1.06-6.858-1.786 2.368-.782 4.273-1.885 5.666-3.284zM12 9.206c2.404.793 4.887 1.769 7.424 2.1a10.463 10.463 0 0 1-.225 3.324c-1.636-1.502-3.87-2.906-7.199-3.799-3.329.893-5.563 2.297-7.199 3.799.145-1.127.07-2.261-.225-3.324 2.537-.331 5.02-1.307 7.424-2.1zm-7.464 6.727c1.34-1.026 3.178-2.148 5.918-2.943v8.528A10.392 10.392 0 0 1 4.536 15.933zm14.928 0a10.392 10.392 0 0 1-5.918 5.603v-8.528c2.74.795 4.578 1.917 5.918 2.943z"/></svg>`
    },
    {
        id: "cinem-ai-monthly",
        name: "Cinem AI Video",
        category: "video-audio",
        duration: "Monthly Access",
        price: 7000,
        originalPrice: 15000,
        setup: "Creator Account Portal",
        desc: "Leading-edge video generation AI software. Generate cinematic, high-definition videos from prompts.",
        specs: ["Cinematic photorealistic videos", "High frame-rate rendering options", "Creator tools subscription tier", "Full monthly warranty"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="color: #7c3aed"><rect x="2" y="3" width="20" height="14" rx="2" stroke-linejoin="round"/><path d="M8 21h8M12 17v4" stroke-linecap="round"/><path d="M10 8l5 3-5 3V8z" fill="currentColor"/></svg>`
    }
];

// Official WhatsApp contact numbers (Line 1 Primary & Line 2 Secondary)
const WHATSAPP_NUMBERS = ["923445739206", "923489057646"];
let waCounter = 0;
function getWhatsAppNumber() {
    const num = WHATSAPP_NUMBERS[waCounter % WHATSAPP_NUMBERS.length];
    waCounter++;
    return num;
}
const WHATSAPP_NUMBER = "+923445739206";
const WHATSAPP_NUMBER_2 = "+923489057646";

// Tools flagged as Best Seller / Popular (shown with ribbons + boosted in popularity sort)
const BESTSELLER_IDS = ["grok-10d", "chatgpt-go-6m", "google-ai-ultra-family-1m"];
const POPULAR_IDS = ["gemini-18m", "canva-yearly", "capcut-pro-1m", "adobe-12m", "youtube-12m", "cursor-pro", "google-ai-ultra-shared-1m"];
// Order used by the "Most Popular" sort
const POPULARITY_ORDER = [
    "grok-10d", "chatgpt-go-6m", "google-ai-ultra-family-1m", "google-ai-ultra-shared-1m",
    "gemini-18m", "capcut-pro-1m", "canva-yearly", "capcut-pro-3m", "capcut-pro-6m",
    "adobe-12m", "youtube-12m", "cursor-pro", "gemini-pro-18m-private", "google-ai-ultra-25k-slot",
    "lovable-200", "grok-6m", "elevenlabs-creator", "heygen-200"
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
    // Initialize Currency Converter
    if (window.currencyConverter) {
        window.currencyConverter.init();
    }

    // Initialize Multi-Language Selector
    if (typeof window.initLanguageSelector === "function") {
        window.initLanguageSelector();
    }

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
        // Format price based on active currency
        var priceDisplay = window.currencyConverter ? window.currencyConverter.format(tool.price) : `Rs ${tool.price.toLocaleString()}`;
        var originalPriceDisplay = window.currencyConverter ? window.currencyConverter.format(tool.originalPrice) : `Rs ${tool.originalPrice.toLocaleString()}`;
        
        // WhatsApp single-item checkout message (include converted price + original PKR reference if converted)
        var checkoutPriceStr = priceDisplay;
        if (window.currencyConverter && window.currencyConverter.currentCurrency !== "PKR") {
            checkoutPriceStr += ` (Rs. ${tool.price.toLocaleString()})`;
        }
        
        const waText = encodeURIComponent(
            `Hello MALIK DATA CENTRE! I want to buy:\n\n` +
            `🛍️ Tool: ${tool.name}\n` +
            `⏱️ Plan: ${tool.duration}\n` +
            `💰 Price: ${checkoutPriceStr}\n` +
            `⚙️ Setup: ${tool.setup}\n\n` +
            `Please share payment details (EasyPaisa/JazzCash/Bank) and setup instructions.\n` +
            `Source: malikdatacentre.store`
        );
        const checkoutURL = `https://wa.me/${getWhatsAppNumber()}?text=${waText}`;

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
                        <span class="tool-original-price">${originalPriceDisplay}</span>
                        <span class="tool-price">${priceDisplay}</span>
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
window.filterAndRender = filterAndRender;

// Helper to manage Google Translate cookies across domains
function setGoogleTranslateCookie(langCode) {
    var domain = window.location.hostname;
    var cookieVal = (langCode && langCode !== "en") ? ("/en/" + langCode) : "";
    var expires = (langCode && langCode !== "en") ? "; expires=Thu, 31 Dec 2037 23:59:59 GMT" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie = "googtrans=" + cookieVal + expires + "; path=/;";
    if (domain) {
        document.cookie = "googtrans=" + cookieVal + expires + "; path=/; domain=" + domain;
        if (domain.includes(".")) {
            document.cookie = "googtrans=" + cookieVal + expires + "; path=/; domain=." + domain.replace(/^www\./, "");
        }
    }
}

// Toggle a small "Translating..." busy state on both language dropdowns
function setLangSelectorsBusy(isBusy) {
    ["mdc-lang-select", "drawer-lang-select"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.disabled = !!isBusy;
    });
}

// Robust helper: waits (patiently) for Google's translate widget to be ready,
// then applies the chosen language. Used on page load AND on manual switch,
// so both paths behave the same way instead of one being fragile.
// maxWaitMs defaults to 8s — the widget can genuinely take a few seconds on
// slower mobile connections, so bailing out after ~1s (as before) was the
// main reason switching/reloading silently "did nothing".
function applyGoogleTranslate(langCode, maxWaitMs) {
    maxWaitMs = maxWaitMs || 8000;
    var startedAt = Date.now();
    setLangSelectorsBusy(true);

    function tryApply() {
        var combo = document.querySelector(".goog-te-combo");
        if (combo) {
            setLangSelectorsBusy(false);
            if (combo.value !== langCode) {
                combo.value = langCode;
                combo.dispatchEvent(new Event("change"));
            }
            return true;
        }
        if (Date.now() - startedAt >= maxWaitMs) {
            // Give up quietly — no forced reload (that just re-triggers the
            // same race on a slow connection and looks like a broken loop).
            // The cookie is already set, so a later reload/navigation will
            // pick the language up as soon as the widget becomes available.
            setLangSelectorsBusy(false);
            return false;
        }
        setTimeout(tryApply, 250);
    }
    tryApply();
}

// Global Multi-Language Switcher Manager
window.initLanguageSelector = function() {
    var savedLang = "en";
    try {
        savedLang = localStorage.getItem("mdc_language") || "en";
    } catch(e){}

    // Guarantee English by default: if this is a fresh visitor (nothing saved
    // yet) but a stale "googtrans" cookie exists from a previous test/session
    // on this browser, clear it so the page never opens pre-translated.
    if (savedLang === "en") {
        setGoogleTranslateCookie("en");
    }

    ["mdc-lang-select", "drawer-lang-select"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.value = savedLang;
            el.onchange = function(e) {
                window.changeSiteLanguage(e.target.value);
            };
        }
    });

    if (savedLang && savedLang !== "en") {
        setGoogleTranslateCookie(savedLang);
        applyGoogleTranslate(savedLang);
    }
};

window.changeSiteLanguage = function(langCode) {
    if (!langCode) return;

    try {
        localStorage.setItem("mdc_language", langCode);
    } catch(e){}

    setGoogleTranslateCookie(langCode);

    ["mdc-lang-select", "drawer-lang-select"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = langCode;
    });

    applyGoogleTranslate(langCode);
};

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
