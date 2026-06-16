/* ==========================================================================
   MALIK DATA CENTRE — UX Engine
   Scroll-spy nav highlight, back-to-top button, cookie consent bar
   ========================================================================== */
(function () {
    "use strict";

    /* ======================================================================
       SCROLL-SPY — highlight active nav link
       ====================================================================== */
    function initScrollSpy() {
        const map = [
            { id: "catalog-section", link: "nav-link-catalog" },
            { id: "how-section", link: "nav-link-how" },
            { id: "video-section", link: "nav-link-videos" },
            { id: "why-us-section", link: "nav-link-why-us" },
            { id: "reviews-section", link: "nav-link-reviews" },
            { id: "faq-section", link: "nav-link-faq" }
        ].filter((m) => document.getElementById(m.id) && document.getElementById(m.link));
        if (!map.length || !("IntersectionObserver" in window)) return;

        const setActive = (linkId) => {
            map.forEach((m) => {
                const l = document.getElementById(m.link);
                if (l) l.classList.toggle("active", m.link === linkId);
            });
        };

        const obs = new IntersectionObserver((entries) => {
            // pick the most visible intersecting section
            let best = null;
            entries.forEach((e) => {
                if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
            });
            if (best) {
                const m = map.find((x) => x.id === best.target.id);
                if (m) setActive(m.link);
            }
        }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] });

        map.forEach((m) => obs.observe(document.getElementById(m.id)));
    }

    /* ======================================================================
       BACK TO TOP
       ====================================================================== */
    function initBackToTop() {
        const btn = document.createElement("button");
        btn.className = "mdc-top-btn";
        btn.id = "mdc-top-btn";
        btn.setAttribute("aria-label", "Back to top");
        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        document.body.appendChild(btn);

        const onScroll = () => {
            if (window.scrollY > 600) btn.classList.add("show");
            else btn.classList.remove("show");
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        onScroll();
    }

    /* ======================================================================
       COOKIE CONSENT
       ====================================================================== */
    function initCookie() {
        let done = false;
        try { done = localStorage.getItem("mdc_cookie") !== null; } catch (e) {}
        if (done) return;

        const bar = document.createElement("div");
        bar.className = "mdc-cookie";
        bar.id = "mdc-cookie";
        bar.setAttribute("role", "dialog");
        bar.setAttribute("aria-label", "Cookie consent");
        bar.innerHTML =
            '<p><i class="fa-solid fa-cookie-bite"></i> Hum aapke experience ko behtar banane ke liye basic cookies use karte hain. ' +
            'Tafseel ke liye <a href="privacy.html">Privacy Policy</a> dekhein.</p>' +
            '<div class="mdc-cookie-actions">' +
                '<button class="mdc-cookie-decline" id="mdc-cookie-decline">Decline</button>' +
                '<button class="mdc-cookie-accept" id="mdc-cookie-accept">Accept</button>' +
            '</div>';
        document.body.appendChild(bar);

        setTimeout(() => bar.classList.add("show"), 1500);

        const dismiss = (val) => {
            try { localStorage.setItem("mdc_cookie", val); } catch (e) {}
            bar.classList.remove("show");
            setTimeout(() => bar.remove(), 600);
        };
        bar.querySelector("#mdc-cookie-accept").addEventListener("click", () => dismiss("accepted"));
        bar.querySelector("#mdc-cookie-decline").addEventListener("click", () => dismiss("declined"));
    }

    /* ====================================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        initScrollSpy();
        initBackToTop();
        initCookie();
    });
})();
