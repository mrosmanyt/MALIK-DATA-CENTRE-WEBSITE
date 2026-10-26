/* ==========================================================================
   MALIK DATA CENTRE — Advanced Engine
   AI chat assistant (rule-based, catalog-aware) + referral/affiliate system
   ========================================================================== */
(function () {
    "use strict";

    var WA = "https://wa.me/923489057646?text=";
    function getTools() {
        try { if (typeof TOOLS_DATABASE !== "undefined" && Array.isArray(TOOLS_DATABASE)) return TOOLS_DATABASE; }
        catch (e) {}
        return [];
    }
    function waLink(text) { return WA + encodeURIComponent(text); }

    /* ======================================================================
       REFERRAL / AFFILIATE
       ====================================================================== */
    function initReferral() {
        // capture ?ref=
        try {
            var ref = new URLSearchParams(location.search).get("ref");
            if (ref) localStorage.setItem("mdc_ref", ref.slice(0, 40));
        } catch (e) {}

        // attribution: append referral to any WhatsApp order link
        document.addEventListener("click", function (e) {
            var r = "";
            try { r = localStorage.getItem("mdc_ref") || ""; } catch (e2) {}
            if (!r) return;
            var link = e.target.closest('a[href*="wa.me/923489057646?text="], a[href*="wa.me/923445739206?text="]');
            if (!link) return;
            var href = link.getAttribute("href");
            if (!href || href.indexOf("Referral") !== -1) return;
            link.setAttribute("href", href + encodeURIComponent("\n\u{1F465} Referral: " + r));
        }, true);

        // generator UI
        var gen = document.getElementById("mdc-ref-gen");
        var input = document.getElementById("mdc-ref-name");
        var out = document.getElementById("mdc-ref-output");
        var copy = document.getElementById("mdc-ref-copy");
        if (gen && input && out) {
            gen.addEventListener("click", function () {
                var name = (input.value || "").trim().replace(/\s+/g, "-").replace(/[^A-Za-z0-9_-]/g, "");
                if (!name) { out.value = "Please enter your name or ID first."; return; }
                out.value = "https://www.malikdatacentre.store/?ref=" + encodeURIComponent(name);
            });
            if (copy) copy.addEventListener("click", function () {
                if (out.value.indexOf("http") === 0 && navigator.clipboard) {
                    navigator.clipboard.writeText(out.value).catch(function () {});
                    copy.textContent = "Copied!";
                    setTimeout(function () { copy.textContent = "Copy"; }, 1600);
                }
            });
        }
    }

    /* ======================================================================
       AI CHAT ASSISTANT
       ====================================================================== */
    function initAssistant() {
        // launcher
        var launcher = document.createElement("button");
        launcher.className = "mdc-ai-launcher";
        launcher.id = "mdc-ai-launcher";
        launcher.setAttribute("aria-label", "Open AI assistant");
        launcher.innerHTML = '<span class="ai-ico"><i class="fa-solid fa-robot"></i></span> Ask AI <span class="ai-dot"></span>';
        document.body.appendChild(launcher);

        // panel
        var panel = document.createElement("div");
        panel.className = "mdc-ai-panel";
        panel.id = "mdc-ai-panel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-label", "Malik AI Assistant");
        panel.innerHTML =
            '<div class="mdc-ai-head">' +
                '<div class="ai-av"><i class="fa-solid fa-robot"></i></div>' +
                '<div class="ai-meta"><div class="ai-title">Malik AI Assistant</div>' +
                '<div class="ai-status"><span class="d"></span> Online · instant replies</div></div>' +
                '<button class="mdc-ai-close" id="mdc-ai-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
            '</div>' +
            '<div class="mdc-ai-body" id="mdc-ai-body"></div>' +
            '<div class="mdc-ai-chips" id="mdc-ai-chips"></div>' +
            '<form class="mdc-ai-input" id="mdc-ai-form">' +
                '<input type="text" id="mdc-ai-text" placeholder="Type your question..." autocomplete="off">' +
                '<button class="mdc-ai-send" type="submit" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>' +
            '</form>';
        document.body.appendChild(panel);

        var body = panel.querySelector("#mdc-ai-body");
        var chipsWrap = panel.querySelector("#mdc-ai-chips");
        var form = panel.querySelector("#mdc-ai-form");
        var textIn = panel.querySelector("#mdc-ai-text");

        var QUICK = [
            "Best deals?",
            "Payment methods?",
            "Warranty & refund?",
            "How to order?",
            "Coupon codes?"
        ];

        function renderChips() {
            chipsWrap.innerHTML = "";
            QUICK.forEach(function (q) {
                var c = document.createElement("span");
                c.className = "mdc-ai-chip";
                c.textContent = q;
                c.addEventListener("click", function () { handleUser(q); });
                chipsWrap.appendChild(c);
            });
        }

        function addMsg(html, who) {
            var m = document.createElement("div");
            m.className = "mdc-ai-msg " + who;
            m.innerHTML = html;
            body.appendChild(m);
            body.scrollTop = body.scrollHeight;
            return m;
        }

        function typing() {
            var t = addMsg('<span class="mdc-ai-typing"><span></span><span></span><span></span></span>', "bot");
            return t;
        }

        function esc(s) { return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

        // ---- intent engine ----
        function findTools(q) {
            var tools = getTools();
            var ql = q.toLowerCase();
            var scored = tools.map(function (t) {
                var hay = (t.name + " " + t.desc + " " + t.duration + " " + t.category).toLowerCase();
                var score = 0;
                ql.split(/\s+/).forEach(function (w) {
                    if (w.length > 2 && hay.indexOf(w) !== -1) score += 1;
                });
                if (t.name.toLowerCase().indexOf(ql) !== -1) score += 3;
                return { t: t, score: score };
            }).filter(function (x) { return x.score > 0; });
            scored.sort(function (a, b) { return b.score - a.score; });
            return scored.slice(0, 3).map(function (x) { return x.t; });
        }

        function toolReply(matches) {
            return matches.map(function (t) {
                var priceStr = window.currencyConverter ? window.currencyConverter.format(t.price) : "Rs " + t.price.toLocaleString();
                var originalPriceStr = window.currencyConverter ? window.currencyConverter.format(t.originalPrice) : "Rs " + t.originalPrice.toLocaleString();
                
                var checkoutPriceStr = priceStr;
                if (window.currencyConverter && window.currencyConverter.currentCurrency !== "PKR") {
                    checkoutPriceStr += " (Rs. " + t.price.toLocaleString() + ")";
                }
                
                var msg = "Hello MALIK DATA CENTRE! I want to buy:\n\n\u{1F6CD}️ Tool: " + t.name +
                    "\n⏱️ Plan: " + t.duration + "\n\u{1F4B0} Price: " + checkoutPriceStr +
                    "\n\nPlease share payment & setup details.\nSource: malikdatacentre.store";
                return '<div style="margin-bottom:8px"><b>' + esc(t.name) + '</b> (' + esc(t.duration) + ')<br>' +
                    '<span style="color:#10b981;font-weight:700">' + priceStr + '</span> ' +
                    '<span style="text-decoration:line-through;color:#888;font-size:.8em">' + originalPriceStr + '</span>' +
                    '<br><a class="ai-wa" href="' + waLink(msg) + '" target="_blank"><i class="fa-brands fa-whatsapp"></i> Order Now</a></div>';
            }).join("");
        }

        function respond(q) {
            var ql = q.toLowerCase();
            // greetings
            if (/^(hi|hello|hey|salam|asalam|aoa|assalam)/i.test(ql.trim()))
                return "Hello! \u{1F44B} I'm the Malik AI Assistant. Which premium tool or subscription are you interested in? (ChatGPT, Grok, Canva, Adobe, YouTube, VPN...)";
            // payment
            if (/(payment|pay|easypaisa|jazz|bank|kaise.*paise|how.*pay)/i.test(ql))
                return "We accept: ✅ EasyPaisa, ✅ JazzCash, ✅ Meezan Bank, ✅ Bank Transfer, and USDT for overseas buyers. Payment details are shared on WhatsApp when you order. Ready to order? <a class='ai-wa' href='" + waLink("Hello! I need payment details for my order.") + "' target='_blank'><i class='fa-brands fa-whatsapp'></i> WhatsApp</a>";
            // warranty / refund
            if (/(warranty|refund|guarantee|wapsi|paise wapas)/i.test(ql))
                return "Every purchase comes with a <b>full-duration warranty</b>. If your subscription has a problem, we fix or replace it, and if we can't, you get a <b>refund</b>. \u{1F6E1}️";
            // how / setup / activation
            if (/(how.*order|how.*work|setup|activat|kaise|order kaise|process)/i.test(ql))
                return "It's easy, just 3 steps: <br>1️⃣ Choose a tool<br>2️⃣ Tap \"Buy Now\" to order and pay via WhatsApp<br>3️⃣ Your account is ready in 5–30 minutes ⚡";
            // coupon / discount
            if (/(coupon|discount|promo|code|sasta|kam price)/i.test(ql))
                return "Active coupons: \u{1F3F7}️ <b>MALIK10</b> = 10% off, <b>WAIT5</b> = 5% off. It's applied to your WhatsApp order message at checkout.";
            // contact / human
            if (/(human|agent|talk|contact|baat|rabta|whatsapp|number)/i.test(ql))
                return "Our team is available 24/7. \u{1F4F1} <a class='ai-wa' href='" + waLink("Hello MALIK DATA CENTRE! I need help.") + "' target='_blank'><i class='fa-brands fa-whatsapp'></i> Chat on WhatsApp</a> or call: +92 344 5739206";
            // best / popular / deals
            if (/(best|popular|deal|top|recommend|sasta|trending)/i.test(ql)) {
                var tools = getTools();
                var picks = tools.filter(function (t) { return ["grok-10d", "chatgpt-go-6m", "canva-yearly", "gemini-18m"].indexOf(t.id) !== -1; });
                if (picks.length) return "Our most popular deals: " + toolReply(picks);
            }
            // private vs shared
            if (/(private|shared|personal|email par)/i.test(ql))
                return "We offer both. Plans marked \"On client email\" are <b>private</b> and activated on your own email. Shared accounts are clearly labelled and cost less.";
            // product search
            var matches = findTools(q);
            if (matches.length) return "Here's what I found for you: " + toolReply(matches);
            // fallback
            return "The best way to get an answer is to message our team directly — we reply quickly. <a class='ai-wa' href='" + waLink("Hello! My question: " + q) + "' target='_blank'><i class='fa-brands fa-whatsapp'></i> Ask on WhatsApp</a><br><br>Or try one of the options below \u{1F447}";
        }

        function handleUser(text) {
            text = (text || "").trim();
            if (!text) return;
            addMsg(esc(text), "user");
            textIn.value = "";
            var t = typing();
            setTimeout(function () {
                t.remove();
                addMsg(respond(text), "bot");
            }, 500 + Math.random() * 400);
        }

        // open/close
        var greeted = false;
        function open() {
            panel.classList.add("open");
            launcher.classList.add("hidden");
            if (!greeted) {
                greeted = true;
                renderChips();
                setTimeout(function () {
                    addMsg("Hello! \u{1F44B} I'm the <b>Malik AI Assistant</b>. Ask me anything about premium AI tools, prices, warranty or ordering.", "bot");
                }, 250);
            }
        }
        function close() { panel.classList.remove("open"); launcher.classList.remove("hidden"); }

        launcher.addEventListener("click", open);
        panel.querySelector("#mdc-ai-close").addEventListener("click", close);
        form.addEventListener("submit", function (e) { e.preventDefault(); handleUser(textIn.value); });
    }

    /* ====================================================================== */
    document.addEventListener("DOMContentLoaded", function () {
        initReferral();
        initAssistant();
    });
})();
