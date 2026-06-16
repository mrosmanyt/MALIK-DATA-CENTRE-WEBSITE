/* ==========================================================================
   MALIK DATA CENTRE — Conversion / Promo Engine
   Live order toasts + counter, countdown deal timer, coupon code system.
   Self-contained; safe to load after index.js + effects.js.
   ========================================================================== */
(function () {
    "use strict";

    /* ======================================================================
       SHARED DATA
       ====================================================================== */
    const NAMES = [
        "Ahmed", "Bilal", "Usman", "Hamza", "Ali", "Faisal", "Zain", "Saad",
        "Hassan", "Kamran", "Noman", "Arsalan", "Yasir", "Shahbaz", "Imran",
        "Rashid", "Mubeen", "Anees", "Zubair", "Farhan", "Waqar", "Talha"
    ];
    const CITIES = [
        "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
        "Multan", "Peshawar", "Sialkot", "Gujranwala", "Quetta", "Hyderabad"
    ];
    // pull tool names from the catalog if available, else fallback list
    function getToolNames() {
        try {
            if (typeof TOOLS_DATABASE !== "undefined" && Array.isArray(TOOLS_DATABASE) && TOOLS_DATABASE.length) {
                return TOOLS_DATABASE.map((t) => t.name);
            }
        } catch (e) { /* not in scope; use fallback */ }
        return [
            "Super Grok + X Premium+", "ChatGPT Go", "Gemini Advanced",
            "Canva Pro Yearly", "CapCut Pro", "Adobe Full Bundle Plan",
            "YouTube Premium", "Cursor Pro Monthly", "ElevenLabs Creator",
            "Lovable Pro Monthly", "NordVPN", "HeyGen Creator Plan"
        ];
    }
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    /* ======================================================================
       1. LIVE ORDER TOASTS
       ====================================================================== */
    function initToasts() {
        const stack = document.createElement("div");
        stack.className = "mdc-toast-stack";
        stack.setAttribute("aria-hidden", "true");
        document.body.appendChild(stack);

        const tools = getToolNames();

        function showToast() {
            const name = rand(NAMES);
            const city = rand(CITIES);
            const tool = rand(tools);
            const mins = Math.floor(Math.random() * 14) + 1;

            const toast = document.createElement("div");
            toast.className = "mdc-toast";
            toast.innerHTML =
                '<div class="mdc-toast-avatar">' + initials(name) + '</div>' +
                '<div class="mdc-toast-body">' +
                    '<div class="mdc-toast-title">' + name + ' from ' + city + ' bought <b>' + tool + '</b></div>' +
                    '<div class="mdc-toast-sub"><span class="vd"></span> Verified purchase · ' + mins + ' min ago</div>' +
                '</div>';
            stack.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add("show"));

            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 600);
            }, 5500);
        }

        // first toast after 6s, then every 14-22s
        setTimeout(function loop() {
            showToast();
            setTimeout(loop, 14000 + Math.random() * 8000);
        }, 6000);
    }

    /* ======================================================================
       2. LIVE ORDER COUNTER (slowly increments through the day)
       ====================================================================== */
    function initLiveCounter() {
        const el = document.getElementById("mdc-orders-today");
        if (!el) return;
        // deterministic base for the day so it doesn't reset on refresh
        const now = new Date();
        const minutesIntoDay = now.getHours() * 60 + now.getMinutes();
        // ~ up to 60 orders across the day, plus small seeded jitter
        let count = 8 + Math.floor((minutesIntoDay / 1440) * 52);
        el.textContent = count;

        // gentle live ticks
        setInterval(() => {
            if (Math.random() < 0.5) {
                count++;
                el.textContent = count;
                el.style.transform = "scale(1.25)";
                setTimeout(() => { el.style.transform = ""; }, 250);
            }
        }, 22000);
        el.style.transition = "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)";
        el.style.display = "inline-block";
    }

    /* ======================================================================
       3. COUNTDOWN DEAL TIMER (counts down to local midnight, then rolls)
       ====================================================================== */
    function initCountdown() {
        const hEl = document.getElementById("mdc-cd-h");
        const mEl = document.getElementById("mdc-cd-m");
        const sEl = document.getElementById("mdc-cd-s");
        if (!hEl || !mEl || !sEl) return;
        const pad = (n) => String(n).padStart(2, "0");

        function tick() {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            let diff = Math.max(0, Math.floor((end - now) / 1000));
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            hEl.textContent = pad(h);
            mEl.textContent = pad(m);
            sEl.textContent = pad(s);
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ======================================================================
       4. COUPON CODE SYSTEM
       ====================================================================== */
    const COUPONS = {
        "MALIK10": 10,
        "WAIT5": 5
    };
    let activeCoupon = null; // { code, pct }

    function initCoupons() {
        const form = document.getElementById("mdc-coupon-form");
        const input = document.getElementById("mdc-coupon-input");
        const msg = document.getElementById("mdc-coupon-msg");
        const badge = document.getElementById("mdc-coupon-active");
        if (!form || !input) return;

        // click-to-fill chips
        document.querySelectorAll(".mdc-coupon-chip").forEach((chip) => {
            chip.addEventListener("click", () => {
                input.value = chip.getAttribute("data-code") || "";
                input.focus();
            });
        });

        function setMsg(text, ok) {
            if (!msg) return;
            msg.textContent = text;
            msg.className = "mdc-coupon-msg " + (ok ? "ok" : "err");
        }

        function showBadge() {
            if (!badge || !activeCoupon) return;
            badge.querySelector(".lbl").textContent =
                activeCoupon.code + " · " + activeCoupon.pct + "% OFF";
            badge.classList.add("show");
        }

        function apply(e) {
            if (e) e.preventDefault();
            const code = (input.value || "").trim().toUpperCase();
            if (!code) { setMsg("Pehle coupon code likhein.", false); return; }
            if (COUPONS[code]) {
                activeCoupon = { code: code, pct: COUPONS[code] };
                setMsg("✓ Coupon applied! " + COUPONS[code] + "% off — har order par apply hoga.", true);
                showBadge();
            } else {
                activeCoupon = null;
                if (badge) badge.classList.remove("show");
                setMsg("✗ Yeh coupon valid nahi hai. MALIK10 ya WAIT5 try karein.", false);
            }
        }

        form.addEventListener("submit", apply);
        const btn = document.getElementById("mdc-coupon-btn");
        if (btn) btn.addEventListener("click", apply);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") apply(e); });

        // remove active coupon
        if (badge) {
            const x = badge.querySelector(".x");
            if (x) x.addEventListener("click", () => {
                activeCoupon = null;
                badge.classList.remove("show");
                setMsg("Coupon hata diya gaya.", false);
            });
        }

        // Inject coupon line into WhatsApp order links on click (capture phase)
        document.addEventListener("click", (e) => {
            if (!activeCoupon) return;
            const link = e.target.closest('a.btn-buy, a[href*="wa.me/923445739206?text="]');
            if (!link) return;
            const href = link.getAttribute("href");
            if (!href || href.indexOf("wa.me/923445739206?text=") === -1) return;
            if (href.indexOf("Coupon") !== -1) return; // already added
            const extra = encodeURIComponent(
                "\n🎟️ Coupon: " + activeCoupon.code + " (" + activeCoupon.pct + "% OFF)"
            );
            link.setAttribute("href", href + extra);
        }, true);
    }

    /* ======================================================================
       INIT
       ====================================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        initToasts();
        initLiveCounter();
        initCountdown();
        initCoupons();
    });
})();
