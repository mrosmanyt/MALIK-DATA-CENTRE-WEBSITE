/* ==========================================================================
   MALIK DATA CENTRE — Cart, Exit-Intent Popup & PWA registration
   ========================================================================== */
(function () {
    "use strict";

    const WA = "https://wa.me/923445739206?text=";
    let cart = []; // { id, name, price, duration, setup }

    /* ======================================================================
       BUILD UI (FAB + drawer + exit popup) once
       ====================================================================== */
    function buildUI() {
        const fab = document.createElement("button");
        fab.className = "mdc-cart-fab";
        fab.id = "mdc-cart-fab";
        fab.setAttribute("aria-label", "Open cart");
        fab.innerHTML = '<i class="fa-solid fa-cart-shopping"></i><span class="mdc-cart-count" id="mdc-cart-count">0</span>';
        document.body.appendChild(fab);

        const overlay = document.createElement("div");
        overlay.className = "mdc-cart-overlay";
        overlay.id = "mdc-cart-overlay";
        document.body.appendChild(overlay);

        const drawer = document.createElement("aside");
        drawer.className = "mdc-cart-drawer";
        drawer.id = "mdc-cart-drawer";
        drawer.setAttribute("aria-label", "Shopping cart");
        drawer.innerHTML =
            '<div class="mdc-cart-head">' +
                '<h3><i class="fa-solid fa-cart-shopping"></i> Your Order</h3>' +
                '<button class="mdc-cart-close" id="mdc-cart-close" aria-label="Close cart"><i class="fa-solid fa-xmark"></i></button>' +
            '</div>' +
            '<div class="mdc-cart-items" id="mdc-cart-items"></div>' +
            '<div class="mdc-cart-foot">' +
                '<div class="mdc-cart-total"><span>Total</span><b id="mdc-cart-total">Rs 0</b></div>' +
                '<a class="mdc-cart-checkout" id="mdc-cart-checkout" href="#" target="_blank"><i class="fa-brands fa-whatsapp"></i> Order All on WhatsApp</a>' +
                '<div class="mdc-cart-note">Aap ko payment details aur setup steps WhatsApp par mil jayenge.</div>' +
            '</div>';
        document.body.appendChild(drawer);

        // events
        fab.addEventListener("click", openCart);
        overlay.addEventListener("click", closeCart);
        drawer.querySelector("#mdc-cart-close").addEventListener("click", closeCart);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeCart();
        });
    }

    function openCart() {
        document.getElementById("mdc-cart-overlay").classList.add("open");
        document.getElementById("mdc-cart-drawer").classList.add("open");
    }
    function closeCart() {
        document.getElementById("mdc-cart-overlay").classList.remove("open");
        document.getElementById("mdc-cart-drawer").classList.remove("open");
    }

    /* ======================================================================
       CART LOGIC
       ====================================================================== */
    function addToCart(data) {
        if (cart.some((i) => i.id === data.id)) return false; // already in cart
        cart.push(data);
        renderCart();
        bumpFab();
        return true;
    }
    function removeFromCart(id) {
        cart = cart.filter((i) => i.id !== id);
        renderCart();
        // un-mark any add buttons
        document.querySelectorAll('.btn-addcart[data-id="' + CSS.escape(id) + '"]').forEach((b) => {
            b.classList.remove("added");
            b.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
            b.setAttribute("aria-label", "Add to cart");
        });
    }

    function bumpFab() {
        const fab = document.getElementById("mdc-cart-fab");
        fab.classList.add("mdc-cart-bump");
        setTimeout(() => fab.classList.remove("mdc-cart-bump"), 400);
    }

    function buildOrderText() {
        let msg = "Hello MALIK DATA CENTRE! Main yeh order karna chahta/chahti hoon:\n\n";
        let total = 0;
        cart.forEach((item, idx) => {
            msg += (idx + 1) + ") " + item.name + " — " + item.duration + " — Rs " + item.price.toLocaleString() + "\n";
            total += item.price;
        });
        msg += "\nTotal: Rs " + total.toLocaleString() + "\n\n";
        msg += "Please payment details (EasyPaisa/JazzCash/Bank) aur setup steps share karein.\nSource: malikdatacentre.store";
        return msg;
    }

    function renderCart() {
        const countEl = document.getElementById("mdc-cart-count");
        const fab = document.getElementById("mdc-cart-fab");
        const itemsEl = document.getElementById("mdc-cart-items");
        const totalEl = document.getElementById("mdc-cart-total");
        const checkout = document.getElementById("mdc-cart-checkout");

        countEl.textContent = cart.length;
        if (cart.length > 0) fab.classList.add("visible");
        else fab.classList.remove("visible");

        if (cart.length === 0) {
            itemsEl.innerHTML =
                '<div class="mdc-cart-empty"><i class="fa-solid fa-cart-shopping"></i>' +
                '<p>Aapka cart khaali hai.<br>Tools par <b>+</b> dabaa kar add karein.</p></div>';
            totalEl.textContent = "Rs 0";
            checkout.style.opacity = "0.5";
            checkout.style.pointerEvents = "none";
            checkout.setAttribute("href", "#");
            return;
        }

        let total = 0;
        itemsEl.innerHTML = cart.map((item) => {
            total += item.price;
            return (
                '<div class="mdc-cart-item">' +
                    '<div class="mdc-cart-item-info">' +
                        '<div class="mdc-cart-item-name">' + item.name + '</div>' +
                        '<div class="mdc-cart-item-dur">' + item.duration + ' · ' + item.setup + '</div>' +
                        '<div class="mdc-cart-item-price">Rs ' + item.price.toLocaleString() + '</div>' +
                    '</div>' +
                    '<button class="mdc-cart-item-remove" data-remove="' + item.id + '" aria-label="Remove"><i class="fa-solid fa-trash-can"></i></button>' +
                '</div>'
            );
        }).join("");
        totalEl.textContent = "Rs " + total.toLocaleString();
        checkout.style.opacity = "1";
        checkout.style.pointerEvents = "auto";
        checkout.setAttribute("href", WA + encodeURIComponent(buildOrderText()));

        itemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
            btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-remove")));
        });
    }

    /* ======================================================================
       HOOK add-to-cart buttons (rendered by index.js, may re-render)
       ====================================================================== */
    function bindGrid() {
        const grid = document.getElementById("tools-grid");
        if (!grid) return;
        grid.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-addcart");
            if (!btn) return;
            e.preventDefault();
            const data = {
                id: btn.getAttribute("data-id"),
                name: btn.getAttribute("data-name"),
                price: parseInt(btn.getAttribute("data-price"), 10) || 0,
                duration: btn.getAttribute("data-duration") || "",
                setup: btn.getAttribute("data-setup") || ""
            };
            if (cart.some((i) => i.id === data.id)) {
                removeFromCart(data.id);
            } else if (addToCart(data)) {
                btn.classList.add("added");
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                btn.setAttribute("aria-label", "Added to cart");
            }
        });
    }

    /* ======================================================================
       EXIT-INTENT DISCOUNT POPUP
       ====================================================================== */
    function buildExitPopup() {
        const overlay = document.createElement("div");
        overlay.className = "mdc-exit-overlay";
        overlay.id = "mdc-exit-overlay";
        const waLink = WA + encodeURIComponent(
            "Hello MALIK DATA CENTRE! Main WAIT5 coupon (5% off) use karna chahta hoon. Mujhe details bhejein."
        );
        overlay.innerHTML =
            '<div class="mdc-exit-card">' +
                '<button class="mdc-exit-close" id="mdc-exit-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
                '<div class="mdc-exit-emoji">🎁</div>' +
                '<h2>Ruko! <span>5% OFF</span> le jao</h2>' +
                '<p>Jaane se pehle yeh exclusive coupon claim karein — aaj hi apna premium subscription order karein.</p>' +
                '<div class="mdc-exit-code"><b id="mdc-exit-code-text">WAIT5</b>' +
                    '<button class="mdc-exit-copy" id="mdc-exit-copy">Copy</button></div>' +
                '<a class="mdc-exit-cta" href="' + waLink + '" target="_blank"><i class="fa-brands fa-whatsapp"></i> Claim on WhatsApp</a>' +
            '</div>';
        document.body.appendChild(overlay);

        const close = () => overlay.classList.remove("open");
        overlay.querySelector("#mdc-exit-close").addEventListener("click", close);
        overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
        overlay.querySelector("#mdc-exit-copy").addEventListener("click", function () {
            const text = "WAIT5";
            if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
            this.textContent = "Copied!";
            setTimeout(() => { this.textContent = "Copy"; }, 1800);
        });

        // trigger logic: once per session, on mouse leaving toward top
        let shown = false;
        try { shown = sessionStorage.getItem("mdc_exit_shown") === "1"; } catch (e) {}

        function trigger() {
            if (shown) return;
            shown = true;
            try { sessionStorage.setItem("mdc_exit_shown", "1"); } catch (e) {}
            overlay.classList.add("open");
        }

        document.addEventListener("mouseout", (e) => {
            if (!e.relatedTarget && e.clientY <= 0) trigger();
        });
        // mobile / fallback: after 45s of browsing
        setTimeout(() => { if (!shown) trigger(); }, 45000);
    }

    /* ======================================================================
       VIDEO SHOWCASE — click to play with sound, pause others
       ====================================================================== */
    function initVideos() {
        const btns = document.querySelectorAll(".video-play-btn");
        if (!btns.length) return;
        const allVideos = document.querySelectorAll(".mdc-video");

        btns.forEach((btn) => {
            const vid = document.getElementById(btn.getAttribute("data-target"));
            if (!vid) return;

            btn.addEventListener("click", () => {
                if (vid.paused) {
                    // pause others
                    allVideos.forEach((v) => { if (v !== vid) { v.pause(); v.muted = true; } });
                    document.querySelectorAll(".video-play-btn").forEach((b) => {
                        b.classList.remove("playing");
                        b.innerHTML = '<i class="fa-solid fa-play"></i>';
                    });
                    vid.muted = false;
                    vid.play().catch(() => { vid.muted = true; vid.play().catch(() => {}); });
                    btn.classList.add("playing");
                    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                } else {
                    vid.pause();
                    btn.classList.remove("playing");
                    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
                }
            });

            vid.addEventListener("ended", () => {
                btn.classList.remove("playing");
                btn.innerHTML = '<i class="fa-solid fa-play"></i>';
            });
        });
    }

    /* ======================================================================
       PWA — register service worker (only on http/https, not file://)
       ====================================================================== */
    function registerSW() {
        if (!("serviceWorker" in navigator)) return;
        if (location.protocol !== "http:" && location.protocol !== "https:") return;
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js").catch(() => {});
        });
    }

    /* ======================================================================
       INIT
       ====================================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        buildUI();
        bindGrid();
        renderCart();
        buildExitPopup();
        initVideos();
        registerSW();
    });
})();
