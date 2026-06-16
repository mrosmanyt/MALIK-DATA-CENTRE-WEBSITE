/* ==========================================================================
   MALIK DATA CENTRE — Advanced Engine
   AI chat assistant (rule-based, catalog-aware) + referral/affiliate system
   ========================================================================== */
(function () {
    "use strict";

    var WA = "https://wa.me/923445739206?text=";
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
            var link = e.target.closest('a[href*="wa.me/923445739206?text="]');
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
                if (!name) { out.value = "Pehle apna naam ya ID likhein."; return; }
                out.value = "https://malikdatacentre.store/?ref=" + encodeURIComponent(name);
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
                '<input type="text" id="mdc-ai-text" placeholder="Apna sawal likhein..." autocomplete="off">' +
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
                var msg = "Hello MALIK DATA CENTRE! I want to buy:\n\n\u{1F6CD}️ Tool: " + t.name +
                    "\n⏱️ Plan: " + t.duration + "\n\u{1F4B0} Price: Rs. " + t.price.toLocaleString() +
                    "\n\nPlease share payment & setup details.\nSource: malikdatacentre.store";
                return '<div style="margin-bottom:8px"><b>' + esc(t.name) + '</b> (' + esc(t.duration) + ')<br>' +
                    '<span style="color:#10b981;font-weight:700">Rs ' + t.price.toLocaleString() + '</span> ' +
                    '<span style="text-decoration:line-through;color:#888;font-size:.8em">Rs ' + t.originalPrice.toLocaleString() + '</span>' +
                    '<br><a class="ai-wa" href="' + waLink(msg) + '" target="_blank"><i class="fa-brands fa-whatsapp"></i> Order Now</a></div>';
            }).join("");
        }

        function respond(q) {
            var ql = q.toLowerCase();
            // greetings
            if (/^(hi|hello|hey|salam|asalam|aoa|assalam)/i.test(ql.trim()))
                return "Assalam-o-Alaikum! \u{1F44B} Main Malik AI Assistant hoon. Aap kis premium tool ya subscription mein interested hain? (ChatGPT, Grok, Canva, Adobe, YouTube, VPN...)";
            // payment
            if (/(payment|pay|easypaisa|jazz|bank|kaise.*paise|how.*pay)/i.test(ql))
                return "Hum yeh payment methods accept karte hain: ✅ EasyPaisa, ✅ JazzCash, ✅ Meezan Bank, ✅ Bank Transfer. Order ke waqt details WhatsApp par milti hain. Order karna chahein? <a class='ai-wa' href='" + waLink("Hello! Payment details chahiye order ke liye.") + "' target='_blank'><i class='fa-brands fa-whatsapp'></i> WhatsApp</a>";
            // warranty / refund
            if (/(warranty|refund|guarantee|wapsi|paise wapas)/i.test(ql))
                return "Har purchase par <b>full-duration warranty</b> hoti hai. Agar subscription mein masla aaye, hum repair ya replace karte hain. Agar replace na ho saake to <b>full refund</b>. Aap 100% protected hain. \u{1F6E1}️";
            // how / setup / activation
            if (/(how.*order|how.*work|setup|activat|kaise|order kaise|process)/i.test(ql))
                return "Bohat asaan — 3 steps: <br>1️⃣ Tool chunein<br>2️⃣ \"Buy Now\" se WhatsApp par order + payment<br>3️⃣ 5-30 min mein account ready! ⚡";
            // coupon / discount
            if (/(coupon|discount|promo|code|sasta|kam price)/i.test(ql))
                return "Active coupons: \u{1F3F7}️ <b>MALIK10</b> = 10% off, <b>WAIT5</b> = 5% off. Checkout par WhatsApp message mein apply ho jata hai!";
            // contact / human
            if (/(human|agent|talk|contact|baat|rabta|whatsapp|number)/i.test(ql))
                return "Hamari team 24/7 available hai! \u{1F4F1} <a class='ai-wa' href='" + waLink("Hello MALIK DATA CENTRE! Mujhe help chahiye.") + "' target='_blank'><i class='fa-brands fa-whatsapp'></i> Chat on WhatsApp</a> ya call: +92 344 5739206";
            // best / popular / deals
            if (/(best|popular|deal|top|recommend|sasta|trending)/i.test(ql)) {
                var tools = getTools();
                var picks = tools.filter(function (t) { return ["grok-3m", "chatgpt-go-6m", "canva-yearly", "gemini-18m"].indexOf(t.id) !== -1; });
                if (picks.length) return "Hamare sabse popular deals: " + toolReply(picks);
            }
            // private vs shared
            if (/(private|shared|personal|email par)/i.test(ql))
                return "Hum dono offer karte hain. \"ON CLIENT EMAIL\" wale tools <b>100% private</b> hote hain (aapke apne email par). Shared accounts clearly labelled aur saste hote hain.";
            // product search
            var matches = findTools(q);
            if (matches.length) return "Yeh mil gaya aapke liye: " + toolReply(matches);
            // fallback
            return "Is baare mein behtareen tareeqa hai humse direct baat karein — hamari team foran reply degi. <a class='ai-wa' href='" + waLink("Hello! Mera sawal: " + q) + "' target='_blank'><i class='fa-brands fa-whatsapp'></i> Ask on WhatsApp</a><br><br>Ya neeche diye options try karein \u{1F447}";
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
                    addMsg("Assalam-o-Alaikum! \u{1F44B} Main <b>Malik AI Assistant</b> hoon. Premium AI tools, prices, warranty ya order ke baare mein kuch bhi poochein!", "bot");
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
