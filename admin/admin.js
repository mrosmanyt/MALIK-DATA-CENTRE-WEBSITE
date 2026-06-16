/* ==========================================================================
   MALIK DATA CENTRE — Admin Panel Engine (LIVE, Supabase-powered)
   Real auth + real orders/products/customers. Approve/Reject orders,
   send WhatsApp confirmation, edit prices, change password.
   ========================================================================== */
(function () {
    "use strict";

    var SUPABASE_URL = "https://fxlqaqocsszrbdyrcdgj.supabase.co";
    var SUPABASE_KEY = "sb_publishable_yulV5o_-xOxCXW_oItHH5A_yCvKjziy";
    var ADMIN_WA = "923445739206";

    var sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    var STATE = { orders: [], products: [] };
    var charts = {};

    function money(n) { return "Rs " + Number(n || 0).toLocaleString(); }
    function initials(name) { return String(name || "?").trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); }
    function esc(s) { return String(s == null ? "" : s).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function daysAgoOf(iso) { return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000); }
    function dayLabel(daysAgo) { var dt = new Date(); dt.setDate(dt.getDate() - daysAgo); return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
    function waNumber(phone) {
        var p = String(phone || "").replace(/[^\d]/g, "");
        if (p.indexOf("0") === 0) p = "92" + p.slice(1);
        else if (p.indexOf("92") !== 0 && p.length === 10) p = "92" + p;
        return p;
    }
    function itemsSummary(items) {
        if (!Array.isArray(items)) return "—";
        return items.map(function (i) { return i.name + (i.duration ? " (" + i.duration + ")" : ""); }).join(", ");
    }

    /* ====================== LOGIN ====================== */
    function initLogin() {
        var loginScreen = document.getElementById("admin-login");
        var app = document.getElementById("admin-app");
        var form = document.getElementById("login-form");
        var errEl = document.getElementById("login-error");
        var eye = document.getElementById("login-eye");
        var passIn = document.getElementById("login-password");

        eye.addEventListener("click", function () {
            var t = passIn.type === "password" ? "text" : "password";
            passIn.type = t;
            eye.innerHTML = t === "text" ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
        });

        function enterApp(session) {
            loginScreen.style.display = "none";
            app.hidden = false;
            bootApp(session);
        }

        if (!sb) { errEl.textContent = "Internet connection chahiye (Supabase load nahi hua)."; }

        // existing session?
        if (sb) sb.auth.getSession().then(function (r) {
            if (r.data && r.data.session) enterApp(r.data.session);
        });

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            errEl.textContent = "";
            if (!sb) { errEl.textContent = "Supabase load nahi hua. Internet check karein."; return; }
            var email = document.getElementById("login-email").value.trim();
            var pass = passIn.value;
            var btn = document.getElementById("login-btn");
            btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
            var res = await sb.auth.signInWithPassword({ email: email, password: pass });
            btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In';
            if (res.error) { errEl.textContent = "Galat email/password ya user mojood nahi. (" + res.error.message + ")"; return; }
            enterApp(res.data.session);
        });
    }

    /* ====================== APP ====================== */
    async function bootApp(session) {
        var email = session && session.user ? session.user.email : "Admin";
        document.getElementById("admin-date").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        document.getElementById("admin-user-name").textContent = email.split("@")[0];
        document.getElementById("admin-user-av").textContent = email[0].toUpperCase();

        initNav(); initSidebarToggle(); initOrdersFilter(); initLogout(); initSettings(email);

        await loadData();
    }

    async function loadData() {
        if (!sb) return;
        var o = await sb.from("orders").select("*").order("created_at", { ascending: false });
        var p = await sb.from("products").select("*").order("sort_order", { ascending: true });
        STATE.orders = (o.data || []);
        STATE.products = (p.data || []);
        renderDashboard();
        renderOrders("all");
        renderProducts();
        renderCustomers();
    }

    function computeStats() {
        var completed = STATE.orders.filter(function (o) { return o.status === "completed"; });
        var revenue = completed.reduce(function (s, o) { return s + (o.total || 0); }, 0);
        var custs = {}; STATE.orders.forEach(function (o) { if (o.customer_phone) custs[o.customer_phone] = 1; });
        var aov = completed.length ? Math.round(revenue / completed.length) : 0;
        return { revenue: revenue, total: STATE.orders.length, completed: completed.length, pending: STATE.orders.filter(function (o) { return o.status === "pending"; }).length, customers: Object.keys(custs).length, aov: aov };
    }

    function renderDashboard() {
        var s = computeStats();
        document.getElementById("kpi-grid").innerHTML =
            kpi("c1", "fa-sack-dollar", money(s.revenue), "Total Revenue") +
            kpi("c2", "fa-receipt", s.total, "Total Orders") +
            kpi("c3", "fa-clock", s.pending, "Pending Approval") +
            kpi("c4", "fa-users", s.customers, "Customers");
        var rt = document.getElementById("rev-tag"); if (rt) rt.textContent = "Completed: " + money(s.revenue);
        var recent = STATE.orders.slice(0, 6);
        document.getElementById("recent-orders").innerHTML = ordersTableHTML(recent, false);
        bindOrderActions(document.getElementById("recent-orders"));
        drawCharts();
    }
    function kpi(c, ico, val, label) {
        return '<div class="kpi"><div class="kpi-ico ' + c + '"><i class="fa-solid ' + ico + '"></i></div>' +
            '<div class="kpi-val">' + val + '</div><div class="kpi-label">' + label + '</div></div>';
    }

    function statusBadge(st) {
        var map = { completed: "Completed", pending: "Pending", rejected: "Rejected", paid: "Paid" };
        return '<span class="status-badge status-' + (st || "pending") + '">' + (map[st] || st) + '</span>';
    }

    function ordersTableHTML(list, withActions) {
        if (!list.length) return '<thead></thead><tbody><tr><td style="padding:30px;text-align:center;color:var(--a-muted)">Abhi koi order nahi. Jaise hi koi website se order karega, yahan live aa jayega.</td></tr></tbody>';
        var head = '<thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th>' + (withActions ? '<th>Action</th>' : '') + '</tr></thead>';
        var rows = list.map(function (o) {
            var actions = "";
            if (withActions) {
                var wa = "https://wa.me/" + waNumber(o.customer_phone) + "?text=" + encodeURIComponent("Assalam-o-Alaikum! \u{1F389} Aapka MALIK DATA CENTRE order #" + o.order_no + " confirm/activate ho gaya hai. Tafseel: " + itemsSummary(o.items) + ". Shukriya!");
                actions = '<td class="o-actions">';
                if (o.status === "pending") {
                    actions += '<button class="o-btn approve" data-act="completed" data-id="' + o.id + '" title="Approve"><i class="fa-solid fa-check"></i></button>' +
                               '<button class="o-btn reject" data-act="rejected" data-id="' + o.id + '" title="Reject"><i class="fa-solid fa-xmark"></i></button>';
                }
                actions += '<a class="o-btn wa" href="' + wa + '" target="_blank" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>';
                actions += '</td>';
            }
            return '<tr><td><b>#' + o.order_no + '</b></td>' +
                '<td><span class="t-av">' + initials(o.customer_name) + '</span>' + esc(o.customer_name || "—") + '<br><small style="color:var(--a-muted)">' + esc(o.customer_phone || "") + '</small></td>' +
                '<td style="max-width:240px;white-space:normal">' + esc(itemsSummary(o.items)) + (o.coupon ? ' <span style="color:var(--a-orange)">[' + esc(o.coupon) + ']</span>' : '') + '</td>' +
                '<td class="t-amount">' + money(o.total) + '</td>' +
                '<td>' + statusBadge(o.status) + '</td>' +
                '<td>' + new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + '</td>' +
                actions + '</tr>';
        }).join("");
        return head + '<tbody>' + rows + '</tbody>';
    }

    function bindOrderActions(scope) {
        scope.querySelectorAll(".o-btn[data-act]").forEach(function (btn) {
            btn.addEventListener("click", async function () {
                var id = btn.getAttribute("data-id");
                var act = btn.getAttribute("data-act");
                btn.disabled = true;
                var res = await sb.from("orders").update({ status: act }).eq("id", id);
                if (!res.error) {
                    var ord = STATE.orders.find(function (o) { return o.id === id; });
                    if (ord) ord.status = act;
                    renderDashboard();
                    var active = document.querySelector(".ofilter.active");
                    renderOrders(active ? active.getAttribute("data-status") : "all");
                } else { btn.disabled = false; alert("Update fail: " + res.error.message); }
            });
        });
    }

    var ordersFilter = "all";
    function renderOrders(filter) {
        ordersFilter = filter;
        var list = filter === "all" ? STATE.orders : STATE.orders.filter(function (o) { return o.status === filter; });
        var table = document.getElementById("orders-table");
        table.innerHTML = ordersTableHTML(list, true);
        bindOrderActions(table);
    }

    function renderProducts() {
        var head = '<thead><tr><th>Product</th><th>Category</th><th>Price (Rs)</th><th>Action</th></tr></thead>';
        var rows = STATE.products.map(function (p) {
            return '<tr><td><b>' + esc(p.name) + '</b><br><small style="color:var(--a-muted)">' + esc(p.duration || "") + '</small></td>' +
                '<td>' + esc(p.category) + '</td>' +
                '<td><input class="prod-price-input" type="number" value="' + p.price + '" data-id="' + p.id + '"></td>' +
                '<td><button class="prod-save" data-id="' + p.id + '">Save</button></td></tr>';
        }).join("");
        var table = document.getElementById("products-table");
        table.innerHTML = head + '<tbody>' + rows + '</tbody>';
        table.querySelectorAll(".prod-save").forEach(function (btn) {
            btn.addEventListener("click", async function () {
                var id = btn.getAttribute("data-id");
                var input = table.querySelector('.prod-price-input[data-id="' + id + '"]');
                var price = parseInt(input.value, 10) || 0;
                btn.disabled = true; btn.textContent = "...";
                var res = await sb.from("products").update({ price: price }).eq("id", id);
                btn.disabled = false;
                if (!res.error) { btn.textContent = "Saved!"; btn.classList.add("saved"); setTimeout(function () { btn.textContent = "Save"; btn.classList.remove("saved"); }, 1500); }
                else { btn.textContent = "Save"; alert("Fail: " + res.error.message); }
            });
        });
        var pc = document.getElementById("prod-count"); if (pc) pc.textContent = STATE.products.length + " products";
    }

    function renderCustomers() {
        var map = {};
        STATE.orders.forEach(function (o) {
            var key = o.customer_phone || o.customer_name; if (!key) return;
            if (!map[key]) map[key] = { name: o.customer_name, phone: o.customer_phone, city: o.city, orders: 0, spent: 0 };
            map[key].orders++;
            if (o.status === "completed") map[key].spent += (o.total || 0);
        });
        var list = Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return b.spent - a.spent; });
        var head = '<thead><tr><th>Customer</th><th>Phone</th><th>City</th><th>Orders</th><th>Spent</th></tr></thead>';
        var rows = list.length ? list.map(function (c) {
            return '<tr><td><span class="t-av">' + initials(c.name) + '</span>' + esc(c.name || "—") + '</td>' +
                '<td>' + esc(c.phone || "") + '</td><td>' + esc(c.city || "—") + '</td><td>' + c.orders + '</td><td class="t-amount">' + money(c.spent) + '</td></tr>';
        }).join("") : '<tr><td colspan="5" style="padding:30px;text-align:center;color:var(--a-muted)">Abhi koi customer nahi.</td></tr>';
        document.getElementById("customers-table").innerHTML = head + '<tbody>' + rows + '</tbody>';
        document.getElementById("cust-count").textContent = list.length + " customers";
    }

    function drawCharts() {
        if (typeof Chart === "undefined") return;
        var days = [], rev = [];
        for (var d = 13; d >= 0; d--) {
            days.push(dayLabel(d));
            var sum = STATE.orders.filter(function (o) { return o.status === "completed" && daysAgoOf(o.created_at) === d; }).reduce(function (s, o) { return s + (o.total || 0); }, 0);
            rev.push(sum);
        }
        var ctx = document.getElementById("revenueChart");
        if (ctx) {
            if (charts.rev) charts.rev.destroy();
            var g = ctx.getContext("2d").createLinearGradient(0, 0, 0, 240);
            g.addColorStop(0, "rgba(124,92,255,0.45)"); g.addColorStop(1, "rgba(124,92,255,0)");
            charts.rev = new Chart(ctx, { type: "line", data: { labels: days, datasets: [{ data: rev, borderColor: "#7c5cff", backgroundColor: g, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#a855f7", borderWidth: 2 }] },
                options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return "Rs " + c.parsed.y.toLocaleString(); } } } },
                scales: { x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#9ca3af", font: { size: 10 } } }, y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#9ca3af", font: { size: 10 }, callback: function (v) { return "Rs " + (v / 1000) + "k"; } } } } } });
        }
        var byStatus = { completed: 0, pending: 0, rejected: 0 };
        STATE.orders.forEach(function (o) { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
        var ctx2 = document.getElementById("categoryChart");
        if (ctx2) {
            if (charts.cat) charts.cat.destroy();
            charts.cat = new Chart(ctx2, { type: "doughnut",
                data: { labels: ["Completed", "Pending", "Rejected"], datasets: [{ data: [byStatus.completed || 0, byStatus.pending || 0, byStatus.rejected || 0], backgroundColor: ["#10b981", "#f97316", "#ef4444"], borderColor: "rgba(0,0,0,0.2)", borderWidth: 2 }] },
                options: { responsive: true, plugins: { legend: { position: "bottom", labels: { color: "#9ca3af", boxWidth: 12, padding: 12, font: { size: 11 } } } }, cutout: "62%" } });
        }
    }

    /* nav / misc */
    function initNav() {
        var titles = { dashboard: "Dashboard", orders: "Orders", products: "Products", customers: "Customers", settings: "Settings" };
        function go(view) {
            document.querySelectorAll(".snav").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-view") === view); });
            document.querySelectorAll(".admin-view").forEach(function (v) { v.classList.remove("active"); });
            var el = document.getElementById("view-" + view); if (el) el.classList.add("active");
            document.getElementById("admin-page-title").textContent = titles[view] || "Dashboard";
            var sb2 = document.getElementById("admin-sidebar"); if (sb2) sb2.classList.remove("open");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        document.querySelectorAll(".snav").forEach(function (b) { b.addEventListener("click", function () { go(b.getAttribute("data-view")); }); });
        document.querySelectorAll(".card-link[data-view]").forEach(function (l) { l.addEventListener("click", function () { go(l.getAttribute("data-view")); }); });
    }
    function initSidebarToggle() { var t = document.getElementById("admin-menu-toggle"), s = document.getElementById("admin-sidebar"); if (t && s) t.addEventListener("click", function () { s.classList.toggle("open"); }); }
    function initOrdersFilter() { document.querySelectorAll(".ofilter").forEach(function (b) { b.addEventListener("click", function () { document.querySelectorAll(".ofilter").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); renderOrders(b.getAttribute("data-status")); }); }); }
    function initLogout() { document.getElementById("logout-btn").addEventListener("click", async function () { if (sb) await sb.auth.signOut(); location.reload(); }); }
    function initSettings(email) {
        var form = document.getElementById("settings-form");
        var emailIn = document.getElementById("set-email");
        var msg = document.getElementById("set-msg");
        if (emailIn) { emailIn.value = email; emailIn.readOnly = true; }
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            var p1 = document.getElementById("set-pass").value, p2 = document.getElementById("set-pass2").value;
            if (!p1) { setMsg("Naya password likhein.", false); return; }
            if (p1.length < 6) { setMsg("Password kam az kam 6 characters.", false); return; }
            if (p1 !== p2) { setMsg("Passwords match nahi karte.", false); return; }
            var res = await sb.auth.updateUser({ password: p1 });
            if (res.error) setMsg("Fail: " + res.error.message, false);
            else { setMsg("✓ Password update ho gaya!", true); document.getElementById("set-pass").value = ""; document.getElementById("set-pass2").value = ""; }
        });
        function setMsg(t, ok) { msg.textContent = t; msg.className = "set-msg " + (ok ? "ok" : "err"); }
    }

    document.addEventListener("DOMContentLoaded", initLogin);
})();
