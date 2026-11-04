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
            } else {
                this.currentCurrency = this.detect();
            }
        } catch (e) {
            this.currentCurrency = this.detect();
        }
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
    // First visit: pick the visitor's currency from their time zone (no network call, no tracking).
    detect: function () {
        try {
            var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
            var map = {
                "Asia/Karachi": "PKR", "Asia/Kolkata": "INR", "Asia/Calcutta": "INR", "Asia/Dhaka": "BDT",
                "Asia/Colombo": "LKR", "Asia/Tashkent": "UZS", "Asia/Samarkand": "UZS", "Asia/Kuala_Lumpur": "MYR",
                "Asia/Jakarta": "IDR", "Europe/Istanbul": "TRY", "Asia/Riyadh": "SAR", "Asia/Dubai": "AED",
                "Asia/Kuwait": "KWD", "Asia/Qatar": "QAR", "Asia/Muscat": "OMR", "Europe/London": "GBP"
            };
            if (map[tz]) return map[tz];
            var euro = ["Amsterdam","Athens","Berlin","Bratislava","Brussels","Dublin","Helsinki","Lisbon","Ljubljana","Luxembourg","Madrid","Malta","Monaco","Paris","Riga","Rome","Tallinn","Vienna","Vilnius","Zagreb","Nicosia"];
            if (tz.indexOf("Europe/") === 0 && euro.indexOf(tz.slice(7)) > -1) return "EUR";
            return tz ? "USD" : "PKR";
        } catch (e) { return "USD"; }
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
        icon: `<svg width="24" height="24" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`
    },
    {
        id: "gemini-pro-12m",
        name: "Gemini Pro 1 Year",
        category: "ai-chat",
        duration: "12 Months Plan",
        price: 1500,
        originalPrice: 3000,
        setup: "Activated on Client Email",
        desc: "Google AI Pro (Gemini Pro) for 1 year, activated on your own Google email. Use the Gemini app with Pro features and Google Workspace integration.",
        specs: ["Activated on Your Email", "Google AI Pro / Gemini Pro Access", "12 Months Validity", "Gmail & Google Docs Integration"],
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Google Gemini"><defs><linearGradient id="mdcGemGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4285F4"/><stop offset=".55" stop-color="#9B72CB"/><stop offset="1" stop-color="#D96570"/></linearGradient></defs><path fill="url(#mdcGemGrad)" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#4285F4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`
    },
    {
        id: "google-veo3-ultra-20x",
        name: "Google Veo 3 Ultra (Flow Ultra 20x Plan)",
        category: "ai-chat",
        duration: "1 Month Plan",
        price: 29999,
        originalPrice: 29999,
        setup: "Delivered on WhatsApp",
        desc: "Google's Flow Ultra 20x plan 🚀 — Veo 3 video generation with 20x Flow usage, Google Antigravity, Gemini Ultra and all Google AI Ultra features.",
        specs: ["Flow Ultra 20x Usage", "Veo 3 Video Generation", "Google Antigravity Included", "Gemini Ultra & All Ultra Features"],
        icon: `<svg width="24" height="24" fill="#4285F4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#4285F4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`
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
        icon: `<img src="/assets/logos/capcut.webp" alt="CapCut Pro 1 Month logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/capcut.webp" alt="CapCut Pro 3 Months logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/capcut.webp" alt="CapCut Pro 6 Months logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "vidiq-max",
        name: "vidIQ Max",
        category: "video-audio",
        duration: "1 Month Plan",
        price: 1500,
        originalPrice: 1500,
        setup: "Delivered on WhatsApp",
        desc: "vidIQ's top plan for YouTube creators: keyword research, AI video ideas, title and tag tools, competitor tracking and channel analytics.",
        specs: ["vidIQ Max Plan Features", "Keyword Research & SEO Scores", "Daily AI Video Ideas", "Competitor & Trend Tracking"],
        icon: `<img src="/assets/logos/vidiq.webp" alt="vidIQ Max logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "grok-1m",
        name: "Grok Premium",
        category: "ai-chat",
        duration: "1 Month Plan",
        price: 3500,
        originalPrice: 8333,
        originalLabel: "$30",
        setup: "Activated on Client Email",
        desc: "One month of Grok Premium on X: the Grok AI assistant with real-time X search, the blue verification badge and an ad-free X experience.",
        specs: ["Grok AI Assistant Access", "Official Blue Tick Badge", "Full Ad-Free X Experience", "25 Days Full Warranty"],
        icon: `<svg viewBox="0 0 36 36" width="24" height="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grok"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.71428C0 3.4538 3.4538 0 7.71429 0H28.2857C32.5462 0 36 3.4538 36 7.71429V28.2857C36 32.5462 32.5462 36 28.2857 36H7.71428C3.4538 36 0 32.5462 0 28.2857V7.71428ZM7.00488 14.6445L18.0771 30.4574H22.9984L11.9258 14.6445H7.00488ZM7 30.4575L11.9226 23.4272L14.3848 26.944L11.9246 30.4575H7ZM24.1238 6L15.6143 18.1529L18.0765 21.6693L29.0483 6H24.1238ZM25.0156 30.457V13.5188L29.0496 7.75793V30.457H25.0156Z" fill="currentColor"/></svg>`
    },
    {
        id: "grok-bot-premium-1m",
        name: "Grok Bot + Grok Premium",
        category: "ai-chat",
        duration: "Monthly Plan",
        price: 4999,
        originalPrice: 4999,
        setup: "Activated on Client Email",
        desc: "Grok AI bot plus Grok Premium for one month: chat with Grok, use real-time X search and get the premium features on your own account.",
        specs: ["Grok AI Bot Access", "Grok Premium Features", "Real-Time X Search in Grok", "Setup Help on WhatsApp"],
        icon: `<svg viewBox="0 0 36 36" width="24" height="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grok"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.71428C0 3.4538 3.4538 0 7.71429 0H28.2857C32.5462 0 36 3.4538 36 7.71429V28.2857C36 32.5462 32.5462 36 28.2857 36H7.71428C3.4538 36 0 32.5462 0 28.2857V7.71428ZM7.00488 14.6445L18.0771 30.4574H22.9984L11.9258 14.6445H7.00488ZM7 30.4575L11.9226 23.4272L14.3848 26.944L11.9246 30.4575H7ZM24.1238 6L15.6143 18.1529L18.0765 21.6693L29.0483 6H24.1238ZM25.0156 30.457V13.5188L29.0496 7.75793V30.457H25.0156Z" fill="currentColor"/></svg>`
    },
    {
        id: "grok-heavy-1m",
        name: "Grok Heavy",
        category: "ai-chat",
        duration: "1 Month Plan",
        price: 19999,
        originalPrice: 19999,
        setup: "Activated on Client Email",
        desc: "Grok Heavy, xAI's most powerful Grok plan, for heavy research, coding and analysis with the highest Grok usage limits.",
        specs: ["Grok Heavy Model Access", "Highest Grok Usage Limits", "Real-Time X Search in Grok", "Setup Help on WhatsApp"],
        icon: `<svg viewBox="0 0 36 36" width="24" height="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grok"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.71428C0 3.4538 3.4538 0 7.71429 0H28.2857C32.5462 0 36 3.4538 36 7.71429V28.2857C36 32.5462 32.5462 36 28.2857 36H7.71428C3.4538 36 0 32.5462 0 28.2857V7.71428ZM7.00488 14.6445L18.0771 30.4574H22.9984L11.9258 14.6445H7.00488ZM7 30.4575L11.9226 23.4272L14.3848 26.944L11.9246 30.4575H7ZM24.1238 6L15.6143 18.1529L18.0765 21.6693L29.0483 6H24.1238ZM25.0156 30.457V13.5188L29.0496 7.75793V30.457H25.0156Z" fill="currentColor"/></svg>`
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
        icon: `<img src="/assets/logos/capcut.webp" alt="CapCut Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/heygen.webp" alt="HeyGen Creator Plan logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/kling.webp" alt="Kling AI Standard Plan logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/lovable.webp" alt="Lovable Pro Monthly logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/lovable.webp" alt="Lovable Pro Monthly logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<img src="/assets/logos/lovable.webp" alt="Lovable Pro Monthly logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<svg width="24" height="24" fill="#00C4CC" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z"/></svg>`
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
        icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="5.05263" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.3269 6.97196C7.10886 7.41969 7.29244 7.96069 7.73694 8.18031C8.37539 8.49577 8.92943 8.80682 9.47799 9.42979C9.80652 9.80287 10.3731 9.83706 10.7435 9.50615C11.1139 9.17524 11.1478 8.60453 10.8193 8.23145C10.0376 7.34372 9.23299 6.90799 8.52654 6.55894C8.08204 6.33932 7.54494 6.52423 7.3269 6.97196Z" fill="#34322D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.1721 4.34285C11.6918 4.4638 11.3998 4.95405 11.5198 5.43786C11.6037 5.77586 11.682 6.06488 11.7536 6.32945C11.8907 6.83585 12.0035 7.25269 12.0854 7.75209C12.166 8.24413 12.6274 8.57716 13.1159 8.49593C13.6044 8.4147 13.935 7.94998 13.8543 7.45795C13.7576 6.8677 13.607 6.30922 13.4558 5.74868C13.3888 5.50045 13.3218 5.25183 13.2592 4.99985C13.1391 4.51605 12.6524 4.2219 12.1721 4.34285Z" fill="#34322D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.2966 4.89837C16.8734 4.63967 16.322 4.77558 16.0652 5.20193C15.5888 5.99281 15.3383 6.77154 15.1057 7.70876C14.9856 8.19256 15.2777 8.68282 15.758 8.80377C16.2383 8.92472 16.725 8.63057 16.8451 8.14676C17.0607 7.27804 17.2585 6.70232 17.598 6.13875C17.8548 5.7124 17.7199 5.15706 17.2966 4.89837Z" fill="#34322D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.8669 27.2046C23.6053 26.0937 24.8072 20.1356 24.5428 18.3615C24.5428 18.3615 24.2673 17.409 23.595 17.4089C23.0798 17.4089 22.7952 17.8277 22.6902 18.0236C22.5994 17.99 22.507 17.9596 22.4337 17.9359C22.3942 17.9232 22.3388 17.9056 22.2868 17.889L22.1883 17.8576C22.1079 17.8318 22.0321 17.807 21.9608 17.7824L21.961 17.7571C21.9641 17.1813 21.9056 16.2826 21.3091 15.3463C21.2137 15.1965 21.1236 15.0625 21.0466 14.9489L20.9983 14.8777C20.941 14.7933 20.896 14.7271 20.8528 14.661C20.7466 14.4989 20.7176 14.4364 20.7064 14.4076L20.7058 14.4063C20.7014 14.3951 20.6925 14.3724 20.69 14.3031C20.687 14.2179 20.6943 14.0567 20.7495 13.7747L21.0366 12.6274L21.0377 12.6215C21.0566 12.5161 21.0737 12.4215 21.0829 12.2673C21.0915 12.1254 21.0932 11.9192 21.0572 11.6801C20.9889 11.227 20.727 10.3683 19.8038 9.87044C19.5782 9.74879 19.308 9.67596 19.0416 9.64113C18.8625 9.61771 18.6231 9.60169 18.3451 9.62317C17.7779 9.66697 17.0336 9.8712 16.371 10.4787L16.206 10.6522C15.8209 11.1174 15.4141 11.6934 15.1055 12.2031C14.1686 11.762 13.0657 11.2557 12.2951 10.9835C11.4494 10.6847 10.5055 10.4347 9.61848 10.4669C8.63612 10.5025 7.53162 10.9143 6.95339 12.08C6.71585 12.5588 6.61449 13.1181 6.73647 13.7009C6.85304 14.2579 7.14133 14.6839 7.41667 14.9811C7.92789 15.5329 8.61265 15.8748 9.09526 16.082C9.46477 16.2407 9.84444 16.3727 10.1806 16.4795C10.1451 16.5438 10.1095 16.6103 10.0752 16.6778C9.97358 16.8776 9.85198 17.145 9.77193 17.4509C9.6921 17.756 9.62915 18.1907 9.74295 18.681C9.85975 19.1843 10.0909 19.5773 10.3662 19.8779C10.3558 20.0342 10.3519 20.1989 10.3577 20.3694C10.3964 21.5079 11.0916 22.2669 11.7031 22.6973C12.2857 23.1073 12.9718 23.359 13.5265 23.5282C14.0622 23.6916 14.6278 23.8213 15.0874 23.9267L15.1858 23.9492C15.6756 24.0617 16.1597 24.1919 16.6439 24.3221C17.1932 24.4698 17.7427 24.6176 18.301 24.7397C18.4837 24.7797 18.6611 24.8179 18.8243 24.8527L18.8838 25.0077C19.6081 26.8585 20.5752 28.0302 21.8669 27.2046ZM15.249 19.6293C15.1499 19.589 15.093 19.5623 15.0425 19.5369C14.6038 19.3086 14.0642 19.4807 13.836 19.9221C13.6073 20.3645 13.7784 20.91 14.2176 21.1403C14.2536 21.1591 14.2901 21.1768 14.3268 21.1941C14.3883 21.2231 14.474 21.2617 14.5784 21.3041C14.7841 21.3877 15.0766 21.4918 15.4083 21.5627C15.9969 21.6884 17.0848 21.7843 17.8224 20.9328C18.1765 20.524 18.3468 19.9868 18.4114 19.4846C18.478 18.9672 18.4448 18.3995 18.3148 17.8471C18.0587 16.7587 17.3808 15.5678 16.1149 15.003C15.0302 14.5191 13.9583 14.4053 13.0544 14.5074C12.4509 14.5756 11.8743 14.7466 11.4111 15.0073V14.9873C10.2785 14.6615 8.0244 14.0131 8.57949 12.8941C9.00028 12.0459 10.1531 12.116 11.7168 12.6684C12.352 12.8928 13.2346 13.2926 14.0671 13.6825C14.3251 13.8034 14.5784 13.9233 14.8179 14.0367C15.1671 14.202 15.7509 14.4743 15.7509 14.4743C16.4149 13.6717 16.6727 13.2296 16.9002 12.8393C17.0567 12.5709 17.1989 12.3271 17.4491 12.0074C17.8032 11.5548 18.3756 11.2752 18.9628 11.4389C19.372 11.6596 19.268 12.217 19.268 12.217L18.9836 13.3534C18.7121 14.6909 19.0126 15.1335 19.5079 15.8629C19.5949 15.991 19.688 16.1281 19.785 16.2803C20.18 16.9004 20.1617 17.4967 20.1468 17.9833C20.1373 18.2963 20.1291 18.564 20.2331 18.7635C20.4474 19.1743 21.2494 19.4291 21.7753 19.5961C21.9016 19.6363 22.012 19.6714 22.0945 19.7023L22.1508 19.7246C22.0767 19.9561 22.0094 20.1958 21.9421 20.4352C21.643 21.4999 21.3452 22.5598 20.4574 22.8774C19.3368 23.2782 18.2162 22.8989 18.2162 22.8989C18.0142 22.8395 17.8086 22.7934 17.6029 22.7474C17.3465 22.69 17.09 22.6326 16.8405 22.5492C16.4926 22.4191 16.0054 22.3073 15.4759 22.1858C14.215 21.8966 12.7144 21.5523 12.2847 20.7751C12.2123 20.6442 12.1703 20.501 12.1649 20.3437C12.1406 19.6291 12.3892 18.9892 12.3892 18.9892C12.3892 18.9892 12.0037 18.9908 11.7333 18.7288C11.6325 18.6312 11.5478 18.4969 11.5049 18.3122C11.4193 17.9434 11.4928 17.4088 11.941 16.9573L12.1656 16.7317C12.2791 16.6174 12.6155 16.3742 13.2542 16.3021C13.8604 16.2336 14.6109 16.3072 15.3887 16.6542C15.9854 16.9204 16.3979 17.5312 16.5702 18.2635C16.6544 18.6214 16.6699 18.9689 16.6334 19.2524C16.5949 19.551 16.5103 19.7007 16.4714 19.7455C16.4232 19.8012 16.2532 19.8971 15.7804 19.796C15.5813 19.7535 15.3922 19.6875 15.249 19.6293Z" fill="#34322D"/>
</svg>`
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
        icon: `<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_108_317)">
<g clip-path="url(#clip1_108_317)">
<path d="M96 192C149.019 192 192 149.019 192 96C192 42.9807 149.019 0 96 0C42.9807 0 0 42.9807 0 96C0 149.019 42.9807 192 96 192Z" fill="url(#paint0_linear_108_317)"/>
<path d="M54.599 49.5358C54.599 49.5233 54.5843 49.5163 54.5744 49.524C45.8956 56.3275 39.3699 64.8603 35.2502 74.875C31.1267 84.8996 29.8579 95.419 31.6342 106.248C33.4105 117.015 37.8511 126.73 45.0198 135.021C52.1247 143.313 61.006 149.439 71.4736 153.337C81.9408 157.236 93.0425 158.226 104.525 156.493L150.153 149.44C150.599 149.371 150.903 148.953 150.83 148.508L139.228 77.0929C139.156 76.6529 138.744 76.3531 138.303 76.4206L85.9852 84.4657C85.5395 84.5342 85.2352 84.9531 85.3075 85.3982L89.1705 109.166C89.2419 109.606 89.6547 109.906 90.095 109.838L113.88 106.184C114.32 106.117 114.733 106.416 114.804 106.856L117.906 125.861C117.978 126.305 117.675 126.724 117.229 126.794L100.972 129.328C94.8822 130.257 89.0457 129.638 83.4633 127.472C77.8806 125.306 73.1228 121.903 69.3801 117.386C65.5737 112.869 63.1631 107.547 62.2115 101.669C61.2598 95.7281 61.8944 89.9736 64.0512 84.5281C66.208 79.083 69.6339 74.442 74.2646 70.6673C78.8956 66.9547 84.288 64.5412 90.3145 63.6132L135.056 56.684C135.501 56.6152 135.805 56.1969 135.733 55.7524L131.615 30.2521C131.543 29.8116 131.13 29.5111 130.689 29.5792L85.0492 36.634C73.5776 38.4267 63.3091 42.7518 54.6233 49.5476C54.6134 49.5553 54.599 49.5483 54.599 49.5358Z" fill="#002253"/>
</g>
</g>
<defs>
<linearGradient id="paint0_linear_108_317" x1="96" y1="-28.0875" x2="96" y2="243.913" gradientUnits="userSpaceOnUse">
<stop offset="0.104815" stop-color="white"/>
<stop offset="0.405" stop-color="#F5FBFF"/>
<stop offset="0.699247" stop-color="#B2E6FF"/>
<stop offset="1" stop-color="#6BCAFF"/>
</linearGradient>
<clipPath id="clip0_108_317">
<rect width="192" height="192" fill="white"/>
</clipPath>
<clipPath id="clip1_108_317">
<rect width="192" height="192" fill="white"/>
</clipPath>
</defs>
</svg>`
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
        icon: `<svg width="24" height="24" fill="#F26207" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#F26207" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#01A4FF" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.035 2.723h9.253A2.712 2.712 0 0 1 24 5.435v10.529a2.712 2.712 0 0 1-2.712 2.713H8.047Zm-1.681 2.6L6.766 19.677h5.598l-.399 1.6H2.712A2.712 2.712 0 0 1 0 18.565V8.036a2.712 2.712 0 0 1 2.712-2.712Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#EA4B71" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/></svg>`
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
        icon: `<img src="/assets/logos/wispr-flow.webp" alt="Wispr Flow Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<svg width="24" height="24" fill="#00C4CC" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z"/></svg>`
    },
    {
        id: "elevenlabs-creator-1m",
        name: "ElevenLabs Creator",
        category: "video-audio",
        duration: "1 Month Plan",
        price: 2300,
        originalPrice: 6200,
        setup: "Private Account",
        desc: "ElevenLabs Creator plan for 1 month with 131k credits for text-to-speech, voice cloning and dubbing.",
        specs: ["131k Credits", "1 Month Validity", "Creator Plan Features", "Setup Help on WhatsApp"],
        icon: `<svg width="24" height="24" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#FF0000" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#FF0000" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#FF0000" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#107C10" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.002 17.48 24 14.861 24 12.004c0-3.34-1.365-6.362-3.57-8.536 0 0-.027-.022-.082-.042-.063-.022-.152-.045-.281-.045-.592 0-1.985.434-4.805 3.246zM3.654 3.426c-.057.02-.082.041-.086.042C1.365 5.642 0 8.664 0 12.004c0 2.854.998 5.473 2.661 7.533-1.401-2.605 3.579-9.951 6.08-12.91-2.82-2.813-4.216-3.245-4.806-3.245-.131 0-.223.021-.281.046v-.002zM12 3.551S9.055 1.828 6.755 1.746c-.903-.033-1.454.295-1.521.339C7.379.646 9.659 0 11.984 0H12c2.334 0 4.605.646 6.766 2.085-.068-.046-.615-.372-1.52-.339C14.946 1.828 12 3.545 12 3.545v.006z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#0A66C2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#0078D4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#4687FF" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.2838 21.5414A11.9866 11.9866 0 010 14.4832C0 7.8418 5.3727 2.4586 12 2.4586c6.6279 0 12 5.3832 12 12.0246a11.9853 11.9853 0 01-2.2838 7.0582l-5.7636-9.3783-.5565.9419.5645 2.6186L12 8.9338l-2.45 4.1447.5707 2.6451-2.0764-3.5555-5.7605 9.3733z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#1EBFBF" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.47 0C7.815.2 6.3 2.293 5.872 3.43c-1.615 4.866-3.127 14.325-3.33 15.662-.201 1.31-.228 2.119-.228 2.119 0 .328.026.705.102 1.059.454 1.286 1.792 2.37 4.768 1.287a192.353 192.353 0 0 0 9.533-4.44c1.387-.807 3.227-2.32 4.236-4.312.404-.807.682-1.716.733-2.65v-.452c-.026-2.295-.052-4.692-.204-7.013 0 0-.125-1.488-.2-2.017-.076-.53-.177-.733-.177-.733C20.626.906 19.693.38 18.71.126 18.23.026 17.7.024 17.095 0Zm4.692 4.44h.252c.277 0 .48.2.48.452V6.53c0 .252-.203.455-.48.455h-.252c-1.589 0-2.875 1.26-2.875 2.8v2.498c0 2.976-2.472 5.37-5.498 5.37h-.254c-.277 0-.478-.2-.478-.452v-1.64c0-.253.226-.454.478-.454h.254c1.589 0 2.875-1.262 2.875-2.8V9.81c0-2.977 2.472-5.373 5.498-5.373z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#DA1F26" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.782 3.153c-.231.02-.472.04-.703.07a8.453 8.453 0 0 0-2.832.834 8.951 8.951 0 0 0-2.46 1.777c-.03.04-.09.06-.141.05a7.44 7.44 0 0 0-1.496-.07 7.424 7.424 0 0 0-2.932.763c-1.768.884-3.013 2.26-3.736 4.108a7.089 7.089 0 0 0-.462 2.139c0 .05-.01.09-.02.13v.773c.02.201.05.392.07.593.1.813.332 1.596.703 2.33.824 1.646 2.089 2.851 3.786 3.594a7.127 7.127 0 0 0 2.45.593c.032 0 .06.004.086.01h8.576c.183-.017.362-.035.547-.06a8.344 8.344 0 0 0 2.811-.834 8.836 8.836 0 0 0 3.646-3.304 8.187 8.187 0 0 0 1.184-3.093c.05-.34.08-.692.121-1.034 0-.05.01-.09.02-.13v-.794c-.02-.23-.05-.452-.05-.662a8.345 8.345 0 0 0-.834-2.812 8.952 8.952 0 0 0-3.324-3.645 8.245 8.245 0 0 0-3.072-1.175c-.362-.06-.713-.09-1.075-.13-.05 0-.09-.01-.14-.02zm.369 1.693c2.126.005 3.93.826 5.395 2.455a6.93 6.93 0 0 1 1.616 3.323c.15.764.181 1.547.07 2.32-.19 1.346-.702 2.55-1.576 3.605a7.082 7.082 0 0 1-3.997 2.45 7.297 7.297 0 0 1-2.56.1c-1.095-.14-2.099-.501-3.003-1.154a5.2 5.2 0 0 1-.672-.573c-1.226-1.205-2.44-2.42-3.666-3.625-.301-.3-.321-.632-.18-.934a.822.822 0 0 1 .863-.472c.21.02.372.141.522.292 1.105 1.114 2.2 2.209 3.304 3.324a5.263 5.263 0 0 0 3.093 1.536c1.948.261 3.605-.341 4.92-1.798.713-.793 1.145-1.747 1.326-2.811.26-1.587-.11-3.013-1.095-4.268-.873-1.115-2.018-1.808-3.404-2.059-1.416-.25-2.751.02-3.966.794-.03.02-.1.03-.131.01a9.04 9.04 0 0 0-1.406-.854s-.01-.01-.02-.03a6.603 6.603 0 0 1 1.255-.823 6.646 6.646 0 0 1 2.641-.784 8.45 8.45 0 0 1 .67-.024zM7.546 7.509c1.455-.024 2.791.525 3.982 1.63.854.802 1.637 1.636 2.46 2.47.231.23.281.522.171.833-.11.311-.362.462-.683.512a.722.722 0 0 1-.632-.23c-.784-.784-1.567-1.557-2.34-2.35-.633-.653-1.386-1.025-2.27-1.186-1.958-.351-3.936.784-4.639 2.641-.904 2.36.522 5.031 2.982 5.594.482.11.995.11 1.497.1.14-.01.22.04.32.13.483.473.995.945 1.497 1.416.03.03.07.06.1.09-.06 0-.1.01-.14.01h-2.3a5.833 5.833 0 0 1-5.693-4.568c-.653-2.942 1.034-5.925 3.926-6.798a6.33 6.33 0 0 1 1.762-.294Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#DA1F26" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.782 3.153c-.231.02-.472.04-.703.07a8.453 8.453 0 0 0-2.832.834 8.951 8.951 0 0 0-2.46 1.777c-.03.04-.09.06-.141.05a7.44 7.44 0 0 0-1.496-.07 7.424 7.424 0 0 0-2.932.763c-1.768.884-3.013 2.26-3.736 4.108a7.089 7.089 0 0 0-.462 2.139c0 .05-.01.09-.02.13v.773c.02.201.05.392.07.593.1.813.332 1.596.703 2.33.824 1.646 2.089 2.851 3.786 3.594a7.127 7.127 0 0 0 2.45.593c.032 0 .06.004.086.01h8.576c.183-.017.362-.035.547-.06a8.344 8.344 0 0 0 2.811-.834 8.836 8.836 0 0 0 3.646-3.304 8.187 8.187 0 0 0 1.184-3.093c.05-.34.08-.692.121-1.034 0-.05.01-.09.02-.13v-.794c-.02-.23-.05-.452-.05-.662a8.345 8.345 0 0 0-.834-2.812 8.952 8.952 0 0 0-3.324-3.645 8.245 8.245 0 0 0-3.072-1.175c-.362-.06-.713-.09-1.075-.13-.05 0-.09-.01-.14-.02zm.369 1.693c2.126.005 3.93.826 5.395 2.455a6.93 6.93 0 0 1 1.616 3.323c.15.764.181 1.547.07 2.32-.19 1.346-.702 2.55-1.576 3.605a7.082 7.082 0 0 1-3.997 2.45 7.297 7.297 0 0 1-2.56.1c-1.095-.14-2.099-.501-3.003-1.154a5.2 5.2 0 0 1-.672-.573c-1.226-1.205-2.44-2.42-3.666-3.625-.301-.3-.321-.632-.18-.934a.822.822 0 0 1 .863-.472c.21.02.372.141.522.292 1.105 1.114 2.2 2.209 3.304 3.324a5.263 5.263 0 0 0 3.093 1.536c1.948.261 3.605-.341 4.92-1.798.713-.793 1.145-1.747 1.326-2.811.26-1.587-.11-3.013-1.095-4.268-.873-1.115-2.018-1.808-3.404-2.059-1.416-.25-2.751.02-3.966.794-.03.02-.1.03-.131.01a9.04 9.04 0 0 0-1.406-.854s-.01-.01-.02-.03a6.603 6.603 0 0 1 1.255-.823 6.646 6.646 0 0 1 2.641-.784 8.45 8.45 0 0 1 .67-.024zM7.546 7.509c1.455-.024 2.791.525 3.982 1.63.854.802 1.637 1.636 2.46 2.47.231.23.281.522.171.833-.11.311-.362.462-.683.512a.722.722 0 0 1-.632-.23c-.784-.784-1.567-1.557-2.34-2.35-.633-.653-1.386-1.025-2.27-1.186-1.958-.351-3.936.784-4.639 2.641-.904 2.36.522 5.031 2.982 5.594.482.11.995.11 1.497.1.14-.01.22.04.32.13.483.473.995.945 1.497 1.416.03.03.07.06.1.09-.06 0-.1.01-.14.01h-2.3a5.833 5.833 0 0 1-5.693-4.568c-.653-2.942 1.034-5.925 3.926-6.798a6.33 6.33 0 0 1 1.762-.294Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#DA1F26" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.782 3.153c-.231.02-.472.04-.703.07a8.453 8.453 0 0 0-2.832.834 8.951 8.951 0 0 0-2.46 1.777c-.03.04-.09.06-.141.05a7.44 7.44 0 0 0-1.496-.07 7.424 7.424 0 0 0-2.932.763c-1.768.884-3.013 2.26-3.736 4.108a7.089 7.089 0 0 0-.462 2.139c0 .05-.01.09-.02.13v.773c.02.201.05.392.07.593.1.813.332 1.596.703 2.33.824 1.646 2.089 2.851 3.786 3.594a7.127 7.127 0 0 0 2.45.593c.032 0 .06.004.086.01h8.576c.183-.017.362-.035.547-.06a8.344 8.344 0 0 0 2.811-.834 8.836 8.836 0 0 0 3.646-3.304 8.187 8.187 0 0 0 1.184-3.093c.05-.34.08-.692.121-1.034 0-.05.01-.09.02-.13v-.794c-.02-.23-.05-.452-.05-.662a8.345 8.345 0 0 0-.834-2.812 8.952 8.952 0 0 0-3.324-3.645 8.245 8.245 0 0 0-3.072-1.175c-.362-.06-.713-.09-1.075-.13-.05 0-.09-.01-.14-.02zm.369 1.693c2.126.005 3.93.826 5.395 2.455a6.93 6.93 0 0 1 1.616 3.323c.15.764.181 1.547.07 2.32-.19 1.346-.702 2.55-1.576 3.605a7.082 7.082 0 0 1-3.997 2.45 7.297 7.297 0 0 1-2.56.1c-1.095-.14-2.099-.501-3.003-1.154a5.2 5.2 0 0 1-.672-.573c-1.226-1.205-2.44-2.42-3.666-3.625-.301-.3-.321-.632-.18-.934a.822.822 0 0 1 .863-.472c.21.02.372.141.522.292 1.105 1.114 2.2 2.209 3.304 3.324a5.263 5.263 0 0 0 3.093 1.536c1.948.261 3.605-.341 4.92-1.798.713-.793 1.145-1.747 1.326-2.811.26-1.587-.11-3.013-1.095-4.268-.873-1.115-2.018-1.808-3.404-2.059-1.416-.25-2.751.02-3.966.794-.03.02-.1.03-.131.01a9.04 9.04 0 0 0-1.406-.854s-.01-.01-.02-.03a6.603 6.603 0 0 1 1.255-.823 6.646 6.646 0 0 1 2.641-.784 8.45 8.45 0 0 1 .67-.024zM7.546 7.509c1.455-.024 2.791.525 3.982 1.63.854.802 1.637 1.636 2.46 2.47.231.23.281.522.171.833-.11.311-.362.462-.683.512a.722.722 0 0 1-.632-.23c-.784-.784-1.567-1.557-2.34-2.35-.633-.653-1.386-1.025-2.27-1.186-1.958-.351-3.936.784-4.639 2.641-.904 2.36.522 5.031 2.982 5.594.482.11.995.11 1.497.1.14-.01.22.04.32.13.483.473.995.945 1.497 1.416.03.03.07.06.1.09-.06 0-.1.01-.14.01h-2.3a5.833 5.833 0 0 1-5.693-4.568c-.653-2.942 1.034-5.925 3.926-6.798a6.33 6.33 0 0 1 1.762-.294Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#FF0000" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg>`
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
        icon: `<img src="/assets/logos/higgsfield.webp" alt="Higgsfield Plus Plan logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<svg width="24" height="24" fill="#107C10" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.002 17.48 24 14.861 24 12.004c0-3.34-1.365-6.362-3.57-8.536 0 0-.027-.022-.082-.042-.063-.022-.152-.045-.281-.045-.592 0-1.985.434-4.805 3.246zM3.654 3.426c-.057.02-.082.041-.086.042C1.365 5.642 0 8.664 0 12.004c0 2.854.998 5.473 2.661 7.533-1.401-2.605 3.579-9.951 6.08-12.91-2.82-2.813-4.216-3.245-4.806-3.245-.131 0-.223.021-.281.046v-.002zM12 3.551S9.055 1.828 6.755 1.746c-.903-.033-1.454.295-1.521.339C7.379.646 9.659 0 11.984 0H12c2.334 0 4.605.646 6.766 2.085-.068-.046-.615-.372-1.52-.339C14.946 1.828 12 3.545 12 3.545v.006z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#C209C1" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.999 0h-.012c-2.21 0-4.3.863-5.888 2.432-.15.148-.428.458-.428.458-.096.11-.188.22-.276.334l-.036.047a8.683 8.683 0 0 0-1.836 5.016v15.41a.32.32 0 0 0 .05.17.304.304 0 0 0 .254.133h2.881a.303.303 0 0 0 .305-.304v-7.843c0-.054.037-.08.053-.087a.1.1 0 0 1 .104.008 8.293 8.293 0 0 0 4.815 1.525c1.32 0 2.547-.305 3.68-.86 2.847-1.392 4.812-4.356 4.812-7.793 0-4.78-3.796-8.645-8.478-8.645zm-.013 13.994c-2.841 0-5.152-2.396-5.152-5.34 0-2.946 2.31-5.342 5.152-5.342 2.841 0 5.152 2.396 5.152 5.341 0 2.945-2.31 5.341-5.152 5.341z"/></svg>`
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
        icon: `<img src="/assets/logos/hma.webp" alt="HMA VPN Key logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<svg width="24" height="24" fill="#0078D4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0,0H11.377V11.372H0ZM12.623,0H24V11.372H12.623ZM0,12.623H11.377V24H0Zm12.623,0H24V24H12.623"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#0B5CFF" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#0A66C2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#D83B01" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.53 4.306v15.363q0 .807-.472 1.433-.472.627-1.253.85l-6.888 1.974q-.136.037-.29.055-.156.019-.293.019-.396 0-.72-.105-.321-.106-.656-.292l-4.505-2.544q-.248-.137-.391-.366-.143-.23-.143-.515 0-.434.304-.738.304-.305.739-.305h5.831V4.964l-4.38 1.563q-.533.187-.856.658-.322.472-.322 1.03v8.078q0 .496-.248.912-.25.416-.683.651l-2.072 1.13q-.286.148-.571.148-.497 0-.844-.347-.348-.347-.348-.844V6.563q0-.62.33-1.19.328-.571.874-.881L11.07.285q.248-.136.534-.21.285-.075.57-.075.211 0 .38.031.166.031.364.093l6.888 1.899q.384.11.7.329.317.217.547.52.23.305.353.67.125.367.125.764zm-1.588 15.363V4.306q0-.273-.16-.478-.163-.204-.423-.28l-3.388-.93q-.397-.111-.794-.23-.397-.117-.794-.216v19.68l4.976-1.427q.26-.074.422-.28.161-.204.161-.477z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#00C4CC" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#DA1F26" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.782 3.153c-.231.02-.472.04-.703.07a8.453 8.453 0 0 0-2.832.834 8.951 8.951 0 0 0-2.46 1.777c-.03.04-.09.06-.141.05a7.44 7.44 0 0 0-1.496-.07 7.424 7.424 0 0 0-2.932.763c-1.768.884-3.013 2.26-3.736 4.108a7.089 7.089 0 0 0-.462 2.139c0 .05-.01.09-.02.13v.773c.02.201.05.392.07.593.1.813.332 1.596.703 2.33.824 1.646 2.089 2.851 3.786 3.594a7.127 7.127 0 0 0 2.45.593c.032 0 .06.004.086.01h8.576c.183-.017.362-.035.547-.06a8.344 8.344 0 0 0 2.811-.834 8.836 8.836 0 0 0 3.646-3.304 8.187 8.187 0 0 0 1.184-3.093c.05-.34.08-.692.121-1.034 0-.05.01-.09.02-.13v-.794c-.02-.23-.05-.452-.05-.662a8.345 8.345 0 0 0-.834-2.812 8.952 8.952 0 0 0-3.324-3.645 8.245 8.245 0 0 0-3.072-1.175c-.362-.06-.713-.09-1.075-.13-.05 0-.09-.01-.14-.02zm.369 1.693c2.126.005 3.93.826 5.395 2.455a6.93 6.93 0 0 1 1.616 3.323c.15.764.181 1.547.07 2.32-.19 1.346-.702 2.55-1.576 3.605a7.082 7.082 0 0 1-3.997 2.45 7.297 7.297 0 0 1-2.56.1c-1.095-.14-2.099-.501-3.003-1.154a5.2 5.2 0 0 1-.672-.573c-1.226-1.205-2.44-2.42-3.666-3.625-.301-.3-.321-.632-.18-.934a.822.822 0 0 1 .863-.472c.21.02.372.141.522.292 1.105 1.114 2.2 2.209 3.304 3.324a5.263 5.263 0 0 0 3.093 1.536c1.948.261 3.605-.341 4.92-1.798.713-.793 1.145-1.747 1.326-2.811.26-1.587-.11-3.013-1.095-4.268-.873-1.115-2.018-1.808-3.404-2.059-1.416-.25-2.751.02-3.966.794-.03.02-.1.03-.131.01a9.04 9.04 0 0 0-1.406-.854s-.01-.01-.02-.03a6.603 6.603 0 0 1 1.255-.823 6.646 6.646 0 0 1 2.641-.784 8.45 8.45 0 0 1 .67-.024zM7.546 7.509c1.455-.024 2.791.525 3.982 1.63.854.802 1.637 1.636 2.46 2.47.231.23.281.522.171.833-.11.311-.362.462-.683.512a.722.722 0 0 1-.632-.23c-.784-.784-1.567-1.557-2.34-2.35-.633-.653-1.386-1.025-2.27-1.186-1.958-.351-3.936.784-4.639 2.641-.904 2.36.522 5.031 2.982 5.594.482.11.995.11 1.497.1.14-.01.22.04.32.13.483.473.995.945 1.497 1.416.03.03.07.06.1.09-.06 0-.1.01-.14.01h-2.3a5.833 5.833 0 0 1-5.693-4.568c-.653-2.942 1.034-5.925 3.926-6.798a6.33 6.33 0 0 1 1.762-.294Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#0056D2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.374 23.977c-4.183-.21-8.006-2.626-9.959-6.347-2.097-3.858-1.871-8.864.732-12.454C4.748 1.338 9.497-.698 14.281.23c4.583.857 8.351 4.494 9.358 8.911 1.122 4.344-.423 9.173-3.925 12.04-2.289 1.953-5.295 2.956-8.34 2.797zm7.705-8.05a588.737 588.737 0 0 0-3.171-1.887c-.903 1.483-2.885 2.248-4.57 1.665-2.024-.639-3.394-2.987-2.488-5.134.801-2.009 2.79-2.707 4.357-2.464a4.19 4.19 0 0 1 2.623 1.669c1.077-.631 2.128-1.218 3.173-1.855-2.03-3.118-6.151-4.294-9.656-2.754-3.13 1.423-4.89 4.68-4.388 7.919.54 3.598 3.73 6.486 7.716 6.404a7.664 7.664 0 0 0 6.404-3.563z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#F26207" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#01A4FF" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.035 2.723h9.253A2.712 2.712 0 0 1 24 5.435v10.529a2.712 2.712 0 0 1-2.712 2.713H8.047Zm-1.681 2.6L6.766 19.677h5.598l-.399 1.6H2.712A2.712 2.712 0 0 1 0 18.565V8.036a2.712 2.712 0 0 1 2.712-2.712Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#EA4B71" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/></svg>`
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
        icon: `<img src="/assets/logos/wispr-flow.webp" alt="Wispr Flow Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<svg width="24" height="24" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>`
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
        icon: `<img src="/assets/logos/gumloop.webp" alt="Gumloop Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
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
        icon: `<svg width="24" height="24" fill="#027E6F" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 24H.032V12c0-3.314 1.341-6.314 3.504-8.486C5.703 1.344 8.694 0 12 0c3.305 0 6.297 1.344 8.463 3.514 2.164 2.172 3.505 5.172 3.505 8.486s-1.338 6.314-3.505 8.486C18.297 22.656 15.305 24 12 24m2.889-13.137-1.271 2.205h4.418c-.505 2.882-3.018 5.078-6.036 5.078-3.38 0-6.132-2.757-6.132-6.146S8.618 5.854 12 5.854c1.821 0 3.458.801 4.584 2.069l1.143-1.988c-1.493-1.418-3.506-2.29-5.725-2.29-4.6 0-8.332 3.74-8.332 8.355s3.73 8.354 8.332 8.354c4.603 0 8.332-3.739 8.332-8.354 0-.387-.029-.765-.079-1.137z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#00A8E1" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 9.508c0-.043.01-.073.028-.09.018-.017.047-.025.086-.025h.329c.07 0 .112.034.127.101l.032.119c.091-.088.202-.159.33-.21a1.04 1.04 0 0 1 .396-.079c.294 0 .528.109.7.326.171.217.257.51.257.88 0 .254-.042.475-.127.665-.086.19-.201.335-.347.437a.85.85 0 0 1-.502.154c-.125 0-.243-.02-.355-.06a.857.857 0 0 1-.288-.164v1.003c0 .043-.008.073-.025.09-.017.016-.046.025-.09.025H.115c-.04 0-.068-.009-.086-.025-.019-.017-.028-.047-.028-.09zm1.113.32a.868.868 0 0 0-.447.124v1.206a.834.834 0 0 0 .447.124c.17 0 .296-.058.376-.174.081-.117.121-.3.121-.55 0-.254-.04-.439-.118-.555-.08-.116-.206-.174-.379-.174zm2.248-.087c.121-.134.236-.23.344-.286a.733.733 0 0 1 .345-.085h.063c.043 0 .073.009.092.025.018.017.027.047.027.09v.385c0 .04-.008.068-.025.087-.017.018-.046.027-.089.027a.923.923 0 0 1-.082-.004 1.369 1.369 0 0 0-.383.025c-.1.02-.186.045-.256.076v1.54c0 .04-.008.069-.025.087-.016.018-.046.028-.089.028h-.437c-.04 0-.069-.01-.087-.028-.018-.018-.028-.047-.028-.087V9.508c0-.043.01-.073.028-.09.018-.017.047-.025.087-.025h.328c.07 0 .112.034.128.1zm1.526-.71a.396.396 0 0 1-.278-.096.338.338 0 0 1-.105-.262c0-.11.035-.197.105-.26a.395.395 0 0 1 .278-.097c.116 0 .208.032.278.096.07.064.105.151.105.261a.34.34 0 0 1-.105.262.396.396 0 0 1-.278.096zm-.333.477c0-.043.01-.073.027-.09.019-.017.048-.025.087-.025h.438c.043 0 .072.008.089.025s.025.047.025.09v2.113c0 .04-.008.069-.025.087-.017.018-.046.028-.09.028h-.437c-.04 0-.068-.01-.087-.028-.018-.018-.027-.047-.027-.087zm1.837.11c.161-.107.306-.183.435-.227.13-.045.263-.067.4-.067.273 0 .466.098.579.294.155-.104.3-.18.438-.225.137-.046.278-.069.424-.069.213 0 .377.06.495.179.117.12.175.286.175.5v1.618c0 .04-.008.069-.025.087-.017.019-.046.027-.089.027h-.438c-.04 0-.068-.008-.086-.027-.018-.018-.028-.047-.028-.087V10.15c0-.208-.092-.312-.278-.312-.164 0-.33.04-.497.119v1.664c0 .04-.008.069-.025.087-.017.019-.046.027-.09.027h-.437c-.04 0-.068-.008-.086-.027-.019-.018-.028-.047-.028-.087V10.15c0-.208-.093-.312-.278-.312-.17 0-.337.04-.502.123v1.66c0 .04-.008.069-.025.087-.017.019-.046.027-.089.027h-.438c-.039 0-.068-.008-.086-.027-.018-.018-.027-.047-.027-.087V9.508c0-.043.009-.073.027-.09.018-.017.047-.025.086-.025h.329c.07 0 .112.034.128.101zm4.387 1.16a1.81 1.81 0 0 1-.451-.05c.018.204.08.35.185.44.105.088.263.132.476.132.085 0 .168-.005.249-.016a3.08 3.08 0 0 0 .362-.078.143.143 0 0 1 .023-.002c.052 0 .078.035.078.105v.211c0 .049-.007.083-.02.103a.169.169 0 0 1-.08.053 1.953 1.953 0 0 1-.708.128c-.377 0-.666-.103-.868-.312-.203-.207-.304-.505-.304-.893 0-.398.104-.71.31-.935.207-.227.494-.34.862-.34.283 0 .504.069.664.206a.69.69 0 0 1 .24.55c0 .23-.087.403-.258.52-.172.119-.425.177-.76.177zm.064-.99c-.292 0-.46.18-.506.54.122.025.257.037.406.037.155 0 .267-.024.337-.071.07-.047.105-.12.105-.218 0-.193-.114-.289-.342-.289zm2.948 1.946a.21.21 0 0 1-.075-.011.119.119 0 0 1-.05-.037.274.274 0 0 1-.038-.071l-.777-2.04a1.863 1.863 0 0 1-.023-.063.162.162 0 0 1-.009-.05c0-.047.03-.07.091-.07h.454c.049 0 .084.01.107.028.023.018.04.049.052.092l.468 1.622.477-1.622a.175.175 0 0 1 .052-.092c.023-.018.058-.027.107-.027h.44c.061 0 .091.022.091.068a.16.16 0 0 1-.009.05l-.022.065-.777 2.039a.274.274 0 0 1-.039.07.122.122 0 0 1-.047.038.207.207 0 0 1-.078.01zm2.02-2.703a.393.393 0 0 1-.277-.097.338.338 0 0 1-.105-.26c0-.11.035-.198.105-.262a.393.393 0 0 1 .277-.096c.115 0 .207.032.277.096.07.064.104.151.104.261 0 .11-.034.197-.104.261a.393.393 0 0 1-.277.097zm-.218 2.703c-.04 0-.068-.01-.086-.028-.019-.018-.028-.047-.028-.087V9.507c0-.043.01-.072.028-.09.018-.016.047-.024.086-.024h.436c.042 0 .072.008.089.025.016.017.024.046.024.09v2.111c0 .04-.008.07-.024.087-.017.019-.047.028-.09.028zm1.948.05a.869.869 0 0 1-.513-.153.97.97 0 0 1-.334-.426 1.6 1.6 0 0 1-.116-.63c0-.38.09-.682.268-.91a.856.856 0 0 1 .709-.341.98.98 0 0 1 .622.206V8.458c0-.043.01-.073.027-.09.018-.016.047-.025.087-.025h.436c.042 0 .071.009.088.025.017.017.025.047.025.09v3.161c0 .04-.008.07-.025.087-.017.019-.046.028-.088.028h-.364a.135.135 0 0 1-.084-.023.137.137 0 0 1-.043-.078l-.027-.105a.958.958 0 0 1-.668.256zm.218-.504a.762.762 0 0 0 .418-.128v-1.21a.872.872 0 0 0-.45-.114c-.16 0-.28.06-.358.18-.08.121-.118.304-.118.548 0 .245.041.426.124.546.084.119.212.178.384.178zm2.588-.51c-.169 0-.315-.016-.44-.05.018.201.078.345.18.432.103.087.257.13.465.13.083 0 .164-.005.242-.016a2.997 2.997 0 0 0 .354-.076.135.135 0 0 1 .022-.002c.05 0 .075.035.075.103v.207c0 .048-.007.082-.02.101a.165.165 0 0 1-.077.052 1.895 1.895 0 0 1-.69.126c-.367 0-.65-.102-.846-.306-.197-.204-.296-.496-.296-.876 0-.39.1-.695.302-.917.202-.222.482-.333.84-.333.276 0 .492.068.647.203a.678.678 0 0 1 .234.539c0 .225-.084.395-.251.51-.168.115-.415.173-.74.173zm.063-.97c-.285 0-.45.176-.494.53.119.024.25.036.396.036.15 0 .26-.024.329-.07.068-.046.102-.117.102-.213 0-.19-.111-.284-.333-.284zm2.442 2.003c-.36 0-.642-.11-.845-.328-.203-.218-.304-.523-.304-.914 0-.388.101-.691.304-.91.203-.218.485-.327.845-.327s.642.109.845.327c.203.219.304.522.304.91 0 .39-.101.696-.304.914-.203.218-.485.328-.845.328zm0-.514c.318 0 .477-.242.477-.728 0-.483-.16-.724-.477-.724-.318 0-.477.241-.477.724 0 .486.16.728.477.728zm-6.844 1.886c.405-.306.944-.408 1.39-.408.418 0 .756.09.828.185.15.2-.039 1.584-.775 2.244-.112.102-.22.047-.17-.087.166-.442.536-1.436.36-1.677-.175-.242-1.158-.115-1.6-.058-.068.008-.107-.02-.112-.061v-.023c.004-.036.03-.078.079-.115zm-10.184-.172a.105.105 0 0 1 .106-.091c.027 0 .057.009.089.028a11.778 11.778 0 0 0 6.194 1.772c1.52 0 3.19-.34 4.726-1.043.232-.105.426.164.2.346-1.371 1.09-3.359 1.67-5.07 1.67-2.397 0-4.557-.956-6.191-2.547a.173.173 0 0 1-.054-.097Z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#0A66C2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#FF0000" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
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
        icon: `<svg width="24" height="24" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg>`
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
        icon: `<svg width="24" height="24" fill="#D97757" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>`
    },
    {
        id: "muse-ai-1b",
        name: "Muse AI 1B Tokens",
        category: "ai-chat",
        duration: "1B Tokens Pack",
        price: 300,
        originalPrice: 300,
        setup: "API Key Access",
        desc: "Muse AI token pack with 1 billion (1B) tokens. Delivery and setup details are shared on WhatsApp after ordering.",
        specs: ["1B Muse AI tokens", "Token pack", "Paid once in PKR", "Setup help on WhatsApp"],
        icon: `<svg width="24" height="24" role="img" aria-label="Muse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.6257 16.1214C28.2365 16.1214 30.8187 18.9408 30.8187 23.3643C30.8185 27.7868 30.1055 31.7765 28.9225 40.2466C28.0743 46.1813 26.62 55.2418 26.0132 59.0088C27.1782 56.7815 29.9074 51.5757 30.3914 50.5982C36.1081 39.061 42.0657 28.7544 43.7826 26.0254C46.0594 22.382 48.062 20.9229 51.1597 20.9229C52.7685 20.923 54.6826 21.7357 55.6315 22.819C56.9178 24.2895 57.1859 26.6602 57.1411 29.244C57.0738 33.2073 56.5599 39.5264 55.8553 46.5698C55.5416 49.7057 54.9365 56.1066 54.5288 60.4004C58.1883 53.8532 64.9609 41.8109 67.6921 37.6058C70.0727 33.9402 72.466 31.5797 75.6836 31.5796C78.4595 31.5796 81.8809 33.5416 81.6772 38.7573C81.3774 46.4556 80.2673 63.2232 79.7607 70.7479C83.1662 65.7913 87.6377 58.4543 89.3148 55.6966C91.0104 52.908 92.75 50.6542 95.3898 50.5778C98.0987 50.4995 99.913 52.341 99.9959 55.1839C100.078 58.0277 98.3835 61.2256 96.1344 64.856C93.6937 68.7957 90.9621 73.0123 87.6383 76.9491C84.3148 80.8856 81.2604 83.8782 76.5991 83.8786C72.4243 83.8786 69.4869 81.1043 69.283 76.0254C69.1768 73.364 69.6804 67.6405 70.0602 63.1673C70.5 57.9875 71.0315 52.9861 71.403 49.6786C67.7337 56.3979 60.0101 70.4676 56.5348 75.9603C53.1343 81.3339 51.4774 83.2269 47.8882 83.2275C44.2977 83.2275 42.7226 80.6416 42.6717 76.7497C42.6142 72.5285 45.7852 47.1821 46.8587 38.737C45.1183 42.4616 40.839 51.6056 38.1551 57.0435C35.5587 62.3055 31.204 71.3978 28.0436 76.6357C25.7668 80.4094 23.2092 83.2273 19.4173 83.2275C15.6252 83.2275 13.4847 80.6784 13.4847 76.5788C13.4847 72.4794 14.6716 65.6492 15.9465 57.1777C16.5839 53.0781 17.3108 48.6133 18.1315 43.8761C18.7324 40.448 19.7764 34.4169 20.4183 30.7129C17.502 35.2539 12.2536 43.4278 10.6567 45.8903C8.88113 48.6291 7.28747 50.626 4.64681 50.6266C1.7329 50.6266 0.000532901 48.3522 0 45.7113C0 43.0703 1.34323 41.0344 3.52376 37.4512C6.32403 32.8465 11.3578 26.57 14.1154 23.2747C17.3656 19.3912 20.6139 16.1219 24.6257 16.1214Z" fill="url(#mdcMuseGrad)"/> <defs> <linearGradient id="mdcMuseGrad" x1="133.245" y1="109.046" x2="24.9203" y2="-12.5565" gradientUnits="userSpaceOnUse"> <stop offset="0.254808" stop-color="#0082FB" style="stop-color:#0082FB;stop-color:color(display-p3 0.0000 0.5098 0.9843);stop-opacity:1;"/> <stop offset="0.697115" stop-color="#0064E0" style="stop-color:#0064E0;stop-color:color(display-p3 0.0000 0.3922 0.8784);stop-opacity:1;"/> <stop offset="1" stop-color="#0040DC" style="stop-color:#0040DC;stop-color:color(display-p3 0.0000 0.2510 0.8627);stop-opacity:1;"/> </linearGradient> </defs> </svg>`
    },
    {
        id: "muse-ai-31b",
        name: "Muse AI 31B Tokens",
        category: "ai-chat",
        duration: "31B Tokens Pack",
        price: 1500,
        originalPrice: 1500,
        setup: "API Key Access",
        desc: "Muse AI token pack with 31 billion (31B) tokens. Delivery and setup details are shared on WhatsApp after ordering.",
        specs: ["31B Muse AI tokens", "Token pack", "Paid once in PKR", "Setup help on WhatsApp"],
        icon: `<svg width="24" height="24" role="img" aria-label="Muse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.6257 16.1214C28.2365 16.1214 30.8187 18.9408 30.8187 23.3643C30.8185 27.7868 30.1055 31.7765 28.9225 40.2466C28.0743 46.1813 26.62 55.2418 26.0132 59.0088C27.1782 56.7815 29.9074 51.5757 30.3914 50.5982C36.1081 39.061 42.0657 28.7544 43.7826 26.0254C46.0594 22.382 48.062 20.9229 51.1597 20.9229C52.7685 20.923 54.6826 21.7357 55.6315 22.819C56.9178 24.2895 57.1859 26.6602 57.1411 29.244C57.0738 33.2073 56.5599 39.5264 55.8553 46.5698C55.5416 49.7057 54.9365 56.1066 54.5288 60.4004C58.1883 53.8532 64.9609 41.8109 67.6921 37.6058C70.0727 33.9402 72.466 31.5797 75.6836 31.5796C78.4595 31.5796 81.8809 33.5416 81.6772 38.7573C81.3774 46.4556 80.2673 63.2232 79.7607 70.7479C83.1662 65.7913 87.6377 58.4543 89.3148 55.6966C91.0104 52.908 92.75 50.6542 95.3898 50.5778C98.0987 50.4995 99.913 52.341 99.9959 55.1839C100.078 58.0277 98.3835 61.2256 96.1344 64.856C93.6937 68.7957 90.9621 73.0123 87.6383 76.9491C84.3148 80.8856 81.2604 83.8782 76.5991 83.8786C72.4243 83.8786 69.4869 81.1043 69.283 76.0254C69.1768 73.364 69.6804 67.6405 70.0602 63.1673C70.5 57.9875 71.0315 52.9861 71.403 49.6786C67.7337 56.3979 60.0101 70.4676 56.5348 75.9603C53.1343 81.3339 51.4774 83.2269 47.8882 83.2275C44.2977 83.2275 42.7226 80.6416 42.6717 76.7497C42.6142 72.5285 45.7852 47.1821 46.8587 38.737C45.1183 42.4616 40.839 51.6056 38.1551 57.0435C35.5587 62.3055 31.204 71.3978 28.0436 76.6357C25.7668 80.4094 23.2092 83.2273 19.4173 83.2275C15.6252 83.2275 13.4847 80.6784 13.4847 76.5788C13.4847 72.4794 14.6716 65.6492 15.9465 57.1777C16.5839 53.0781 17.3108 48.6133 18.1315 43.8761C18.7324 40.448 19.7764 34.4169 20.4183 30.7129C17.502 35.2539 12.2536 43.4278 10.6567 45.8903C8.88113 48.6291 7.28747 50.626 4.64681 50.6266C1.7329 50.6266 0.000532901 48.3522 0 45.7113C0 43.0703 1.34323 41.0344 3.52376 37.4512C6.32403 32.8465 11.3578 26.57 14.1154 23.2747C17.3656 19.3912 20.6139 16.1219 24.6257 16.1214Z" fill="url(#mdcMuseGrad2)"/> <defs> <linearGradient id="mdcMuseGrad2" x1="133.245" y1="109.046" x2="24.9203" y2="-12.5565" gradientUnits="userSpaceOnUse"> <stop offset="0.254808" stop-color="#0082FB" style="stop-color:#0082FB;stop-color:color(display-p3 0.0000 0.5098 0.9843);stop-opacity:1;"/> <stop offset="0.697115" stop-color="#0064E0" style="stop-color:#0064E0;stop-color:color(display-p3 0.0000 0.3922 0.8784);stop-opacity:1;"/> <stop offset="1" stop-color="#0040DC" style="stop-color:#0040DC;stop-color:color(display-p3 0.0000 0.2510 0.8627);stop-opacity:1;"/> </linearGradient> </defs> </svg>`
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
    },
    {
        id: "vidiq-boost-1m",
        name: "vidIQ Boost",
        category: "video-audio",
        duration: "1 Month Plan",
        price: 700,
        originalPrice: 700,
        setup: "Delivered on WhatsApp",
        desc: "vidIQ Boost plan for YouTube creators: keyword research, AI video ideas, SEO scores and competitor tracking at a lower price than Max.",
        specs: ["vidIQ Boost Plan Features","Keyword Research & SEO Scores","AI Video Ideas","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/vidiq.webp" alt="vidIQ Boost logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "gamma-pro-1m",
        name: "Gamma Pro Monthly",
        category: "creative",
        duration: "1 Month Plan",
        price: 2400,
        originalPrice: 2400,
        setup: "Private Account",
        desc: "Gamma Pro for 1 month: create presentations, documents and websites from a prompt with no Gamma branding and PDF/PowerPoint export.",
        specs: ["Gamma Pro Features","No Gamma Branding","PDF & PowerPoint Export","1 Month Validity"],
        icon: `<img src="/assets/logos/gamma.svg" alt="Gamma Pro Monthly logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "elevenlabs-creator-3m",
        name: "ElevenLabs Creator",
        category: "video-audio",
        duration: "3 Months Plan",
        price: 3600,
        originalPrice: 3600,
        setup: "Private Account",
        desc: "ElevenLabs Creator plan for 3 months with 131k credits per month for text-to-speech, voice cloning and dubbing.",
        specs: ["131k Credits Monthly","3 Months Validity","Creator Plan Features","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/elevenlabs.svg" alt="ElevenLabs Creator logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "envato-core-1m",
        name: "Envato Core",
        category: "creative",
        duration: "1 Month Plan",
        price: 2000,
        originalPrice: 2000,
        setup: "Ready-Made Account",
        desc: "Envato subscription (Core plan) for 1 month: unlimited downloads of stock video, music, graphics, templates and fonts.",
        specs: ["Unlimited Downloads","Video, Music & Graphic Templates","Commercial Licence","1 Month Validity"],
        icon: `<img src="/assets/logos/envato.webp" alt="Envato Core logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "envato-core-12m",
        name: "Envato Core",
        category: "creative",
        duration: "12 Months Plan",
        price: 8300,
        originalPrice: 8300,
        setup: "Ready-Made Account",
        desc: "Envato subscription (Core plan) for 12 months: unlimited downloads of stock video, music, graphics, templates and fonts.",
        specs: ["Unlimited Downloads","Video, Music & Graphic Templates","Commercial Licence","12 Months Validity"],
        icon: `<img src="/assets/logos/envato.webp" alt="Envato Core logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "higgsfield-pro-610",
        name: "Higgsfield Pro Plan",
        category: "video-audio",
        duration: "610 Credits Plan",
        price: 6400,
        originalPrice: 6400,
        setup: "Creator Account",
        desc: "Higgsfield Pro plan with 610 credits for AI video and image generation with cinematic camera controls.",
        specs: ["610 Credits","Cinematic Camera Presets","Multiple AI Video Models","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/higgsfield.webp" alt="Higgsfield Pro Plan logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "stealthgpt-pro",
        name: "StealthGPT Pro",
        category: "creative",
        duration: "Pro Plan",
        price: 2400,
        originalPrice: 2400,
        setup: "Ready-Made Account",
        desc: "StealthGPT Pro: AI writing and humanizer tool that rewrites AI-generated text to read naturally.",
        specs: ["Pro Plan Features","AI Text Humanizer","AI Essay & Content Writer","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/stealthgpt.webp" alt="StealthGPT Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "lovable-pro-100-1m",
        name: "Lovable Pro 100 Credits",
        category: "ai-coding",
        duration: "1 Month Plan",
        price: 2200,
        originalPrice: 2200,
        setup: "Ready-Made Account",
        desc: "Lovable Pro with 100 monthly credits for 1 month. Build full web apps from plain-English prompts.",
        specs: ["100 Credits Monthly","Lovable Pro Features","1 Month Validity","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/lovable.webp" alt="Lovable Pro 100 Credits logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "lovable-pro-100-3m",
        name: "Lovable Pro 100 Credits",
        category: "ai-coding",
        duration: "3 Months Plan",
        price: 4650,
        originalPrice: 4650,
        setup: "Ready-Made Account",
        desc: "Lovable Pro with 100 monthly credits for 3 months. Build full web apps from plain-English prompts.",
        specs: ["100 Credits Monthly","Lovable Pro Features","3 Months Validity","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/lovable.webp" alt="Lovable Pro 100 Credits logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "lovable-lite-12m",
        name: "Lovable Lite 300 Credits",
        category: "ai-coding",
        duration: "12 Months Plan",
        price: 2400,
        originalPrice: 2400,
        setup: "Ready-Made Account",
        desc: "Lovable Lite yearly plan with 300 credits, for lighter app building with Lovable.",
        specs: ["300 Credits","Lovable Lite Plan","12 Months Validity","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/lovable.webp" alt="Lovable Lite 300 Credits logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "storyblocks-unlimited-1m",
        name: "Storyblocks Unlimited",
        category: "creative",
        duration: "1 Month Plan",
        price: 3400,
        originalPrice: 3400,
        setup: "Ready-Made Account",
        desc: "Storyblocks Unlimited for 1 month: unlimited downloads of royalty-free stock video, audio and images.",
        specs: ["Unlimited Downloads","Stock Video, Audio & Images","Royalty-Free Licence","1 Month Validity"],
        icon: `<img src="/assets/logos/storyblocks.webp" alt="Storyblocks Unlimited logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "academi-cx-pro-1m",
        name: "Academi.cx Pro",
        category: "creative",
        duration: "1 Month Plan",
        price: 3200,
        originalPrice: 3200,
        setup: "Ready-Made Account",
        desc: "Academi.cx Pro for 1 month: AI tools for academic research and writing.",
        specs: ["Pro Plan Features","AI Research & Writing Tools","1 Month Validity","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/academi.webp" alt="Academi.cx Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "linkedin-career-duo-2m",
        name: "LinkedIn Career Premium Duo",
        category: "creative",
        duration: "2 Months Voucher",
        price: 3200,
        originalPrice: 3200,
        setup: "Voucher on Your Account",
        desc: "LinkedIn Premium Career voucher for 2 months, redeemed on your own LinkedIn profile.",
        specs: ["Premium Career Features","InMail Credits","Who Viewed Your Profile","2 Months Validity"],
        icon: `<img src="/assets/logos/linkedin.svg" alt="LinkedIn Career Premium Duo logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "linkedin-business-duo-2m",
        name: "LinkedIn Business Premium Duo",
        category: "creative",
        duration: "2 Months Voucher",
        price: 3700,
        originalPrice: 3700,
        setup: "Voucher on Your Account",
        desc: "LinkedIn Premium Business voucher for 2 months, redeemed on your own LinkedIn profile.",
        specs: ["Premium Business Features","InMail Credits","Business Insights","2 Months Validity"],
        icon: `<img src="/assets/logos/linkedin.svg" alt="LinkedIn Business Premium Duo logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "linkedin-sales-nav-adv-1m",
        name: "LinkedIn Sales Navigator Advanced",
        category: "creative",
        duration: "1 Month Voucher",
        price: 5200,
        originalPrice: 5200,
        setup: "Voucher on Your Account",
        desc: "LinkedIn Sales Navigator Advanced voucher for 1 month, redeemed on your own LinkedIn profile.",
        specs: ["Sales Navigator Advanced","Advanced Lead Search","InMail Credits","1 Month Validity"],
        icon: `<img src="/assets/logos/linkedin.svg" alt="LinkedIn Sales Navigator Advanced logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "kling-std-750",
        name: "Kling AI Standard Plan",
        category: "video-audio",
        duration: "750 Credits Plan",
        price: 2400,
        originalPrice: 2400,
        setup: "Premium Account",
        desc: "Kling AI Standard plan with 750 credits for text-to-video and image-to-video generation.",
        specs: ["750 Credits","Standard Plan Features","HD Video Output","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/kling.webp" alt="Kling AI Standard Plan logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "genspark-plus-1m",
        name: "Genspark Plus",
        category: "ai-chat",
        duration: "1 Month Plan",
        price: 5300,
        originalPrice: 5300,
        setup: "Ready-Made Account",
        desc: "Genspark Plus for 1 month: AI agent workspace for research, slides, documents and more.",
        specs: ["Plus Plan Features","AI Agents & Super Agent","Slides, Docs & Research","1 Month Validity"],
        icon: `<img src="/assets/logos/genspark.webp" alt="Genspark Plus logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "capcut-team-1m",
        name: "CapCut Pro Team",
        category: "creative",
        duration: "1 Month Plan",
        price: 650,
        originalPrice: 650,
        setup: "Team Invite",
        desc: "CapCut Pro through a team workspace for 1 month: Pro effects, AI tools and high-resolution exports.",
        specs: ["Pro Features via Team","AI Editing Tools","High-Resolution Exports","1 Month Validity"],
        icon: `<img src="/assets/logos/capcut.webp" alt="CapCut Pro Team logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "capcut-team-6m",
        name: "CapCut Pro Team",
        category: "creative",
        duration: "6 Months Plan",
        price: 4100,
        originalPrice: 4100,
        setup: "Team Invite",
        desc: "CapCut Pro through a team workspace for 6 months: Pro effects, AI tools and high-resolution exports.",
        specs: ["Pro Features via Team","AI Editing Tools","High-Resolution Exports","6 Months Validity"],
        icon: `<img src="/assets/logos/capcut.webp" alt="CapCut Pro Team logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "ideogram-plus",
        name: "Ideogram Plus",
        category: "creative",
        duration: "Plus Plan",
        price: 2400,
        originalPrice: 2400,
        setup: "Ready-Made Account",
        desc: "Ideogram Plus: AI image generator known for accurate text inside images, logos and posters.",
        specs: ["Plus Plan Features","Accurate Text in Images","Private Generations","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/ideogram.webp" alt="Ideogram Plus logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "artlist-pro",
        name: "Artlist Pro",
        category: "creative",
        duration: "Pro Plan",
        price: 3500,
        originalPrice: 3500,
        setup: "Ready-Made Account",
        desc: "Artlist Pro: royalty-free music, sound effects and stock footage for video creators.",
        specs: ["Pro Plan Features","Royalty-Free Music & SFX","Stock Footage","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/artlist.webp" alt="Artlist Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "cursor-grok-bundle",
        name: "Cursor Pro + Grok Premium",
        category: "ai-coding",
        duration: "Bundle",
        price: 4900,
        originalPrice: 4900,
        setup: "Delivered on WhatsApp",
        desc: "Bundle of Cursor Pro (AI code editor) and Grok Premium in one order.",
        specs: ["Cursor Pro","Grok Premium","One Combined Order","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/cursor.svg" alt="Cursor Pro + Grok Premium logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "quillbot-premium-1m",
        name: "QuillBot Premium",
        category: "creative",
        duration: "1 Month Plan",
        price: 1800,
        originalPrice: 1800,
        setup: "Ready-Made Account",
        desc: "QuillBot Premium for 1 month: unlimited paraphrasing, grammar checker, summarizer and plagiarism checker.",
        specs: ["Unlimited Paraphrasing","Grammar Checker & Summarizer","Plagiarism Checker","1 Month Validity"],
        icon: `<img src="/assets/logos/quillbot.webp" alt="QuillBot Premium logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "wink-standard-1m",
        name: "Wink Standard",
        category: "video-audio",
        duration: "1 Month Plan",
        price: 2100,
        originalPrice: 2100,
        setup: "Ready-Made Account",
        desc: "Wink Standard plan for 1 month: AI video and photo enhancement, retouching and quality upscaling.",
        specs: ["Standard Plan Features","AI Video Quality Enhancer","Retouch & Editing Tools","1 Month Validity"],
        icon: `<img src="/assets/logos/wink.webp" alt="Wink Standard logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "dreamface-1m",
        name: "DreamFace",
        category: "video-audio",
        duration: "1 Month Plan",
        price: 1400,
        originalPrice: 1400,
        setup: "Ready-Made Account",
        desc: "DreamFace for 1 month: AI avatars, talking photos and lip-sync videos.",
        specs: ["Premium Features","AI Talking Photos","Lip-Sync Videos","1 Month Validity"],
        icon: `<img src="/assets/logos/dreamface.webp" alt="DreamFace logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "dreamface-12m",
        name: "DreamFace",
        category: "video-audio",
        duration: "12 Months Plan",
        price: 4200,
        originalPrice: 4200,
        setup: "Ready-Made Account",
        desc: "DreamFace for 12 months: AI avatars, talking photos and lip-sync videos.",
        specs: ["Premium Features","AI Talking Photos","Lip-Sync Videos","12 Months Validity"],
        icon: `<img src="/assets/logos/dreamface.webp" alt="DreamFace logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "grammarly-pro-1m",
        name: "Grammarly Pro",
        category: "creative",
        duration: "1 Month Plan",
        price: 1400,
        originalPrice: 1400,
        setup: "Activated on Client Email",
        desc: "Grammarly Pro for 1 month: advanced grammar, clarity and tone suggestions, AI rewrites and plagiarism checks.",
        specs: ["Tone & Clarity Suggestions","AI Rewrites","Plagiarism Checker","1 Month Validity"],
        icon: `<img src="/assets/logos/grammarly.svg" alt="Grammarly Pro logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "kalakar-editor",
        name: "Kalakar Editor",
        category: "video-audio",
        duration: "Editor Plan",
        price: 1400,
        originalPrice: 1400,
        setup: "Ready-Made Account",
        desc: "Kalakar.io Editor plan: AI tools for creating and editing videos.",
        specs: ["Editor Plan Features","AI Video Tools","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/kalakar.webp" alt="Kalakar Editor logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    },
    {
        id: "kalakar-creator",
        name: "Kalakar Creator",
        category: "video-audio",
        duration: "Creator Plan",
        price: 2100,
        originalPrice: 2100,
        setup: "Ready-Made Account",
        desc: "Kalakar.io Creator plan: AI tools for creating and editing videos, with higher limits than Editor.",
        specs: ["Creator Plan Features","AI Video Tools","Higher Limits than Editor","Setup Help on WhatsApp"],
        icon: `<img src="/assets/logos/kalakar.webp" alt="Kalakar Creator logo" width="24" height="24" loading="lazy" style="width:24px;height:24px;object-fit:contain;border-radius:5px">`
    }
];

// Admin panel (CMS): apply published prices, stock, badges, hidden and new tools
if (window.MDC_CMS && typeof window.MDC_CMS.tools === "function") { try { window.MDC_CMS.tools(TOOLS_DATABASE); } catch (e) { console.warn(e); } }

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
const BESTSELLER_IDS = ["chatgpt-go-6m"];
const POPULAR_IDS = ["gemini-pro-12m", "canva-yearly", "capcut-pro-1m", "adobe-12m", "youtube-12m", "cursor-pro", "google-ai-ultra-shared-1m"];
if (window.MDC_CMS && typeof window.MDC_CMS.ribbons === "function") { try { window.MDC_CMS.ribbons(BESTSELLER_IDS, POPULAR_IDS); } catch (e) { console.warn(e); } }
// Order used by the "Most Popular" sort
const POPULARITY_ORDER = [
    "vidiq-max", "chatgpt-go-6m", "google-veo3-ultra-20x", "google-ai-ultra-shared-1m",
    "gemini-pro-12m", "capcut-pro-1m", "canva-yearly", "capcut-pro-3m", "capcut-pro-6m",
    "adobe-12m", "youtube-12m", "cursor-pro", "google-ai-ultra-25k-slot",
    "lovable-200", "grok-1m", "grok-bot-premium-1m", "elevenlabs-creator", "heygen-200"
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

    // Setup FAQ Accordion Toggles, Search & Category Filters
    const faqWrapper = document.getElementById("faq-accordion-wrapper");
    const faqSearchInput = document.getElementById("faq-search-input");
    const faqSearchClear = document.getElementById("faq-search-clear");
    const faqChips = document.querySelectorAll(".faq-chip");
    const faqEmptyState = document.getElementById("faq-empty-state");

    let currentFaqCategory = "all";

    function filterFaqs() {
        if (!faqWrapper) return;
        const query = (faqSearchInput ? faqSearchInput.value.trim().toLowerCase() : "");
        const items = faqWrapper.querySelectorAll(".faq-item");
        let visibleCount = 0;

        items.forEach(item => {
            const cat = item.getAttribute("data-category") || "all";
            const matchesCat = (currentFaqCategory === "all" || cat === currentFaqCategory);

            const qText = item.querySelector(".faq-question")?.textContent.toLowerCase() || "";
            const aText = item.querySelector(".faq-answer")?.textContent.toLowerCase() || "";
            const matchesQuery = !query || qText.includes(query) || aText.includes(query);

            if (matchesCat && matchesQuery) {
                item.classList.remove("hidden-faq");
                visibleCount++;
            } else {
                item.classList.add("hidden-faq");
            }
        });

        if (faqEmptyState) {
            faqEmptyState.style.display = (visibleCount === 0) ? "block" : "none";
        }
    }

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

    if (faqChips.length > 0) {
        faqChips.forEach(chip => {
            chip.addEventListener("click", () => {
                faqChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                currentFaqCategory = chip.getAttribute("data-category") || "all";
                filterFaqs();
            });
        });
    }

    if (faqSearchInput) {
        faqSearchInput.addEventListener("input", () => {
            if (faqSearchClear) {
                faqSearchClear.style.display = faqSearchInput.value ? "block" : "none";
            }
            filterFaqs();
        });
    }

    if (faqSearchClear) {
        faqSearchClear.addEventListener("click", () => {
            if (faqSearchInput) faqSearchInput.value = "";
            faqSearchClear.style.display = "none";
            filterFaqs();
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
        var originalPriceDisplay = tool.originalLabel ? tool.originalLabel : window.currencyConverter ? window.currencyConverter.format(tool.originalPrice) : `Rs ${tool.originalPrice.toLocaleString()}`;
        
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
        if (tool.cmsBadge) {
            ribbonHTML = `<div class="tool-ribbon ribbon-popular"><i class="fa-solid fa-tag"></i> ${tool.cmsBadge}</div>`;
        } else if (BESTSELLER_IDS.includes(tool.id)) {
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
                        ${(window.MDC_TOOL_PAGES && window.MDC_TOOL_PAGES[tool.id]) ? `<a class="tool-details-link" href="${window.MDC_TOOL_PAGES[tool.id]}">Full price, plans &amp; details <i class="fa-solid fa-arrow-right"></i></a>` : ""}
                        <ul class="tool-specs">
                            <li><i class="fa-solid fa-shield-halved" style="color: var(--primary)"></i> <strong>${tool.setup}</strong></li>
                            ${specsHTML}
                        </ul>
                    </div>
                </div>
                <div class="tool-card-footer">
                    <div class="tool-price-wrapper">
                        ${tool.originalPrice > tool.price ? `<span class="tool-original-price">${originalPriceDisplay}</span>` : ""}
                        <span class="tool-price">${priceDisplay}</span>
                    </div>
                    ${tool.cmsSoldOut ? `<span class="btn btn-outline" aria-disabled="true" style="opacity:.6;cursor:not-allowed">Out of stock</span>` : `<a href="${checkoutURL}" target="_blank" class="btn btn-success btn-buy" id="btn-order-${tool.id}">
                        <i class="fa-brands fa-whatsapp"></i> Buy Now
                    </a>`}
                    ${tool.cmsSoldOut ? "" : `<button class="btn-addcart" id="addcart-${tool.id}"
                        data-id="${tool.id}"
                        data-name="${tool.name.replace(/"/g, '&quot;')}"
                        data-price="${tool.price}"
                        data-duration="${tool.duration.replace(/"/g, '&quot;')}"
                        data-setup="${tool.setup.replace(/"/g, '&quot;')}"
                        aria-label="Add ${tool.name.replace(/"/g, '&quot;')} to cart" title="Add to cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>`}
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
