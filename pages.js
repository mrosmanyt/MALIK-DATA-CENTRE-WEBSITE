/* ==========================================================================
   MALIK DATA CENTRE — Inner page behaviour (also used on the homepage)
   Mobile menu, tool search/filter, tool finder, WhatsApp forms.
   ========================================================================== */
(function () {
    "use strict";
    var WA = "923445739206";

    function relRoot() {
        // works for /, /tools/, /tools/x/ and file:// previews
        var s = document.querySelector('script[src$="pages.js"]');
        return s ? s.getAttribute("src").replace(/pages\.js.*$/, "") : "";
    }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function rs(n) { var c = window.currencyConverter; return "Rs " + Number(n).toLocaleString("en-US") + (c && c.rates.USD ? " (≈ $" + (n * c.rates.USD).toFixed(2).replace(/\.00$/, "") + ")" : ""); }

    document.addEventListener("DOMContentLoaded", function () {
        /* Mobile menu */
        var burger = document.querySelector("[data-pg-burger]");
        var mobile = document.querySelector("[data-pg-mobile]");
        if (burger && mobile) {
            burger.addEventListener("click", function () {
                var open = mobile.classList.toggle("open");
                burger.setAttribute("aria-expanded", open ? "true" : "false");
                burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
            });
        }

        /* Tools page: search + category pills */
        var filter = document.querySelector("[data-pg-filter]");
        var cards = document.querySelector("[data-pg-cards]");
        if (filter && cards) {
            var search = filter.querySelector("[data-pg-search]");
            var empty = document.querySelector("[data-pg-empty]");
            var cat = "all";
            var apply = function () {
                var q = (search.value || "").trim().toLowerCase();
                var shown = 0;
                cards.querySelectorAll(".pg-card").forEach(function (c) {
                    var ok = (cat === "all" || c.getAttribute("data-cat") === cat) && (!q || (c.getAttribute("data-name") || "").indexOf(q) > -1);
                    c.style.display = ok ? "" : "none";
                    if (ok) shown++;
                });
                if (empty) empty.hidden = shown > 0;
            };
            search.addEventListener("input", apply);
            filter.querySelectorAll(".pg-pill").forEach(function (p) {
                p.addEventListener("click", function () {
                    filter.querySelectorAll(".pg-pill").forEach(function (x) { x.classList.remove("active"); });
                    p.classList.add("active");
                    cat = p.getAttribute("data-cat");
                    apply();
                });
            });
        }

        /* Tool finder */
        document.querySelectorAll("[data-pg-finder]").forEach(function (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                var out = form.querySelector("[data-pg-finder-result]");
                var fams = window.MDC_FAMILIES || [];
                var need = form.need.value, budget = Number(form.budget.value), priv = form.privacy.value === "private";
                var list = fams.filter(function (f) {
                    var price = priv ? f.privMin : f.min;
                    return f.cat === need && isFinite(price) && price <= budget;
                }).sort(function (a, b) { return (priv ? a.privMin - b.privMin : a.min - b.min); }).slice(0, 3);
                var root = relRoot();
                if (!list.length) {
                    out.innerHTML = '<p style="color:var(--text-muted)">No exact match in this budget. <a style="color:var(--primary);font-weight:700" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + WA + '?text=' + encodeURIComponent("Hello MALIK DATA CENTRE! Please suggest a tool for my need and budget.") + '">Ask us on WhatsApp</a> and we will suggest one.</p>';
                    return;
                }
                out.innerHTML = list.map(function (f) {
                    return '<a class="pg-card" href="' + root + 'tools/' + f.slug + '/"><div class="pg-card-top"><div class="pg-card-icon"><i class="' + esc(f.icon) + '"></i></div><h3>' + esc(f.name) + '</h3></div><p>' + esc(f.blurb) + '</p><div class="pg-card-price"><span class="pg-from">From</span> <b>' + rs(priv ? f.privMin : f.min) + '</b></div><span class="pg-card-more">View plans <i class="fa-solid fa-arrow-right"></i></span></a>';
                }).join("");
            });
        });

        /* Forms that open a pre-filled WhatsApp message */
        document.querySelectorAll("[data-pg-waform]").forEach(function (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                var lines = [form.getAttribute("data-intro") || "Hello MALIK DATA CENTRE!", ""];
                form.querySelectorAll("input, select, textarea").forEach(function (el) {
                    if (el.name && el.value.trim()) lines.push(el.name + ": " + el.value.trim());
                });
                lines.push("", "Source: " + location.href);
                window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
            });
        });
    });
})();

/* Homepage hero category chips → open the matching catalog tab */
document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-hero-cat]");
    if (!b) return;
    var tab = document.querySelector('.tab-btn[data-category="' + b.getAttribute("data-hero-cat") + '"]');
    if (tab) tab.click();
    var cat = document.getElementById("catalog-section");
    if (cat) cat.scrollIntoView({ behavior: "smooth" });
});
