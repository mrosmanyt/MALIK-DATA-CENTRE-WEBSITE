/* ==========================================================================
   MALIK DATA CENTRE — Store Backend (Supabase order capture)
   Saves every order to the database (status: pending) via the secure
   place_order RPC, then opens WhatsApp so the customer can send payment proof.
   No payment gateway needed — owner approves/rejects in the admin panel.
   ========================================================================== */
(function () {
    "use strict";

    var SUPABASE_URL = "https://fxlqaqocsszrbdyrcdgj.supabase.co";
    var SUPABASE_KEY = "sb_publishable_yulV5o_-xOxCXW_oItHH5A_yCvKjziy";

    var sb = null;
    function client() {
        if (!sb && window.supabase && window.supabase.createClient) {
            sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return sb;
    }

    function money(t) { return "Rs " + Number(t || 0).toLocaleString(); }

    /* ---- build checkout modal ---- */
    var modal, form, successBox, formBox;
    function buildModal() {
        modal = document.createElement("div");
        modal.className = "mdc-co-overlay";
        modal.id = "mdc-co-overlay";
        modal.innerHTML =
            '<div class="mdc-co-card">' +
                '<button class="mdc-co-close" id="mdc-co-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
                '<div class="mdc-co-form" id="mdc-co-form-box">' +
                    '<div class="mdc-co-head"><i class="fa-solid fa-bag-shopping"></i> Complete Your Order</div>' +
                    '<div class="mdc-co-summary" id="mdc-co-summary"></div>' +
                    '<form id="mdc-co-form">' +
                        '<label>Aapka Naam *</label>' +
                        '<input type="text" id="mdc-co-name" placeholder="Full name" required>' +
                        '<label>WhatsApp Number *</label>' +
                        '<input type="tel" id="mdc-co-phone" placeholder="03XX XXXXXXX" required>' +
                        '<label>City (optional)</label>' +
                        '<input type="text" id="mdc-co-city" placeholder="e.g. Lahore">' +
                        '<div class="mdc-co-err" id="mdc-co-err"></div>' +
                        '<button type="submit" class="mdc-co-submit" id="mdc-co-submit"><i class="fa-solid fa-circle-check"></i> Place Order</button>' +
                        '<div class="mdc-co-note"><i class="fa-solid fa-shield-halved"></i> Order save hone ke baad WhatsApp par payment details aur proof bhejein. Hum 5-30 min mein approve kar dete hain.</div>' +
                    '</form>' +
                '</div>' +
                '<div class="mdc-co-success" id="mdc-co-success" hidden>' +
                    '<div class="mdc-co-tick"><i class="fa-solid fa-circle-check"></i></div>' +
                    '<h3>Order Placed! ✅</h3>' +
                    '<div class="mdc-co-orderno" id="mdc-co-orderno"></div>' +
                    '<p>Neeche diye account par payment bhejein, phir WhatsApp par screenshot bhejein. Hum 5-30 minute mein activate kar denge.</p>' +
                    '<div class="mdc-co-pay">' +
                        '<div class="mdc-co-pay-title"><i class="fa-solid fa-wallet"></i> Payment yahan bhejein</div>' +
                        '<div class="mdc-co-pay-methods">EasyPaisa &middot; JazzCash &middot; NayaPay &middot; UPaisa</div>' +
                        '<div class="mdc-co-pay-acc">' +
                            '<div class="mdc-co-pay-item"><small>Account Number</small><div class="mdc-co-pay-val"><b id="mdc-co-accnum">0336 3337895</b><button class="mdc-co-copy" data-copy="03363337895">Copy</button></div></div>' +
                            '<div class="mdc-co-pay-item"><small>Account Title</small><b>MALIK AMIR USMAN</b></div>' +
                        '</div>' +
                    '</div>' +
                    '<a class="mdc-co-wa" id="mdc-co-wa" href="#" target="_blank"><i class="fa-brands fa-whatsapp"></i> Send Payment Proof on WhatsApp</a>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);
        formBox = modal.querySelector("#mdc-co-form-box");
        successBox = modal.querySelector("#mdc-co-success");
        form = modal.querySelector("#mdc-co-form");

        modal.querySelector("#mdc-co-close").addEventListener("click", closeModal);
        modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
        // copy account number
        modal.addEventListener("click", function (e) {
            var cp = e.target.closest(".mdc-co-copy");
            if (!cp) return;
            var val = cp.getAttribute("data-copy");
            if (navigator.clipboard) navigator.clipboard.writeText(val).catch(function () {});
            cp.textContent = "Copied!";
            setTimeout(function () { cp.textContent = "Copy"; }, 1500);
        });
    }

    function openModal() { modal.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; }

    /* ---- parse helpers ---- */
    function parseFromHref(href) {
        var txt = "";
        try { txt = decodeURIComponent((href.split("text=")[1] || "")); } catch (e) {}
        var coupon = (txt.match(/Coupon:\s*([A-Z0-9]+)/i) || [])[1] || "";
        var referral = (txt.match(/Referral:\s*([^\n]+)/i) || [])[1] || "";
        return { coupon: coupon, referral: referral.trim() };
    }
    function num(s) { return parseInt(String(s).replace(/[^\d]/g, ""), 10) || 0; }

    /* ---- gather order context ---- */
    function fromBuyButton(btn) {
        var footer = btn.closest(".tool-card-footer") || btn.closest(".tool-card");
        var add = footer ? footer.querySelector(".btn-addcart") : null;
        var item;
        if (add) {
            item = { id: add.getAttribute("data-id"), name: add.getAttribute("data-name"), duration: add.getAttribute("data-duration"), setup: add.getAttribute("data-setup"), price: num(add.getAttribute("data-price")) };
        } else {
            var card = btn.closest(".tool-card");
            item = { name: card ? (card.querySelector(".tool-title") || {}).textContent : "Item", duration: card ? (card.querySelector(".tool-duration") || {}).textContent : "", price: card ? num((card.querySelector(".tool-price") || {}).textContent) : 0 };
        }
        return { items: [item], total: item.price };
    }
    function fromCart() {
        var rows = document.querySelectorAll("#mdc-cart-drawer .mdc-cart-item");
        var items = [], total = 0;
        rows.forEach(function (r) {
            var name = (r.querySelector(".mdc-cart-item-name") || {}).textContent || "";
            var dur = (r.querySelector(".mdc-cart-item-dur") || {}).textContent || "";
            var price = num((r.querySelector(".mdc-cart-item-price") || {}).textContent);
            items.push({ name: name, duration: dur.split(" · ")[0] || dur, price: price });
            total += price;
        });
        return { items: items, total: total };
    }

    /* ---- main flow ---- */
    var ctx = null;
    function startCheckout(context, baseHref) {
        ctx = context;
        ctx.meta = parseFromHref(baseHref || "");
        ctx.baseHref = baseHref || "https://wa.me/923445739206";
        // summary
        var sum = ctx.items.map(function (i) {
            return '<div class="mdc-co-line"><span>' + (i.name || "Item") + (i.duration ? ' <small>(' + i.duration + ')</small>' : '') + '</span><b>' + money(i.price) + '</b></div>';
        }).join("");
        sum += '<div class="mdc-co-total"><span>Total</span><b>' + money(ctx.total) + '</b></div>';
        if (ctx.meta.coupon) sum += '<div class="mdc-co-coupon">🎟️ Coupon: ' + ctx.meta.coupon + '</div>';
        modal.querySelector("#mdc-co-summary").innerHTML = sum;
        // reset
        formBox.hidden = false; successBox.hidden = true;
        modal.querySelector("#mdc-co-err").textContent = "";
        openModal();
    }

    function buildWaUrl(orderNo) {
        var base = ctx.baseHref;
        var extra = encodeURIComponent("\n\n\u{1F9FE} Order #" + orderNo + " (website)\nMaine payment ka screenshot bhej raha/rahi hoon.");
        if (base.indexOf("text=") === -1) base += (base.indexOf("?") === -1 ? "?text=" : "&text=") + encodeURIComponent("Order #" + orderNo);
        else base += extra;
        return base;
    }

    function initForm() {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            var name = modal.querySelector("#mdc-co-name").value.trim();
            var phone = modal.querySelector("#mdc-co-phone").value.trim();
            var city = modal.querySelector("#mdc-co-city").value.trim();
            var err = modal.querySelector("#mdc-co-err");
            var submit = modal.querySelector("#mdc-co-submit");
            if (!name || !phone) { err.textContent = "Naam aur WhatsApp number zaroori hai."; return; }
            err.textContent = "";
            submit.disabled = true; submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            var orderNo = null;
            try {
                var c = client();
                if (c) {
                    var res = await c.rpc("place_order", {
                        p_name: name, p_phone: phone, p_city: city,
                        p_items: ctx.items, p_total: ctx.total,
                        p_coupon: ctx.meta.coupon || "", p_referral: ctx.meta.referral || ""
                    });
                    if (!res.error && res.data) orderNo = res.data;
                }
            } catch (e2) {}
            // fallback id if DB unreachable — never block the sale
            if (!orderNo) orderNo = "W" + Date.now().toString().slice(-6);

            modal.querySelector("#mdc-co-orderno").textContent = "Order #" + orderNo;
            modal.querySelector("#mdc-co-wa").setAttribute("href", buildWaUrl(orderNo));
            formBox.hidden = true; successBox.hidden = false;
            submit.disabled = false; submit.innerHTML = '<i class="fa-solid fa-circle-check"></i> Place Order';
        });
    }

    /* ---- intercept buy + cart-checkout clicks (runs last, href already final) ---- */
    function initIntercept() {
        document.addEventListener("click", function (e) {
            var buy = e.target.closest("a.btn-buy");
            var cart = e.target.closest("#mdc-cart-checkout");
            if (!buy && !cart) return;
            var href = (buy || cart).getAttribute("href") || "";
            if (href.indexOf("wa.me/923445739206") === -1) return; // safety
            e.preventDefault();
            e.stopPropagation();
            var context = buy ? fromBuyButton(buy) : fromCart();
            if (!context.items.length) { window.open(href, "_blank"); return; }
            startCheckout(context, href);
        }, true);
    }

    document.addEventListener("DOMContentLoaded", function () {
        buildModal();
        initForm();
        initIntercept();
    });
})();
