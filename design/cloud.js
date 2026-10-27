/* Postly Design Studio: accounts (Supabase Auth), My designs (cloud saves), Postly Pro, client approval links */
(function () {
  const S = window.MDC_STUDIO, CFG = window.POSTLY_CLOUD; if (!S || !CFG) return;
  if (!CFG.enabled) { const b = document.querySelector("#btn-account"); if (b) b.closest(".ds-menu-wrap").hidden = true; return; }
  const F = window.MDC_FEATURES || {}, c = S.canvas;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { if (!btn.dataset.html) btn.dataset.html = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${esc(label || "Working…")}`; }
    else { btn.disabled = false; if (btn.dataset.html) { btn.innerHTML = btn.dataset.html; delete btn.dataset.html; } }
  }
  function dialog(id, html, wide) {
    const d = document.createElement("dialog"); d.className = "ds-dialog" + (wide ? " wide" : ""); d.id = id; d.innerHTML = html;
    document.querySelector(".ds-app").appendChild(d);
    d.addEventListener("click", e => { if (e.target.closest("[data-close]")) d.close(); });
    return d;
  }
  const open = d => d.open || (d.showModal ? d.showModal() : d.setAttribute("open", ""));
  const ago = t => { const s = (Date.now() - new Date(t)) / 1000; return s < 60 ? "just now" : s < 3600 ? Math.round(s / 60) + " min ago" : s < 86400 ? Math.round(s / 3600) + " h ago" : new Date(t).toLocaleDateString(); };

  /* ---------------- Supabase client ---------------- */
  let sb = null, user = null, profile = null, loading = null;
  function lib() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (!loading) loading = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"; s.onload = res; s.onerror = () => { loading = null; rej(new Error("lib")); }; document.head.appendChild(s); });
    return loading;
  }
  async function client() {
    if (sb) return sb;
    if (!CFG.enabled) throw new Error("disabled");
    await lib();
    sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "postly-auth" } });
    sb.auth.onAuthStateChange((ev, session) => {
      user = session ? session.user : null;
      if (ev === "PASSWORD_RECOVERY") openAuth("newpass");
      if (ev === "SIGNED_IN" || ev === "SIGNED_OUT" || ev === "INITIAL_SESSION") { loadProfile().then(paint); }
    });
    return sb;
  }
  function friendly(e) {
    const m = String((e && (e.message || e.error_description || e.msg)) || e || "");
    if (/POSTLY_LIMIT/.test(m)) return `You've reached the ${CFG.limits.free.designs}-design limit of the Free plan. Delete an old design or upgrade to Pro.`;
    if (/POSTLY_TOO_BIG/.test(m)) return "This design is too big to save (large photos). Try smaller photos, or upgrade to Pro for bigger designs.";
    if (/POSTLY_REVIEW_LIMIT/.test(m)) return "The Free plan has 1 open approval link. Wait for the client's answer, delete the old link, or upgrade to Pro.";
    if (/Invalid login/i.test(m)) return "Wrong email or password.";
    if (/Email not confirmed/i.test(m)) return "Please confirm your email first. Check your inbox (and spam folder).";
    if (/already registered|already exists/i.test(m)) return "This email already has an account. Sign in instead.";
    if (/Password should be/i.test(m)) return "Use a password with at least 6 characters.";
    if (/rate limit|too many/i.test(m)) return "Too many tries. Please wait a few minutes.";
    if (/relation .* does not exist|PGRST20|schema cache|42P01|404/i.test(m)) return "Cloud saving is not switched on yet. Please try again later.";
    if (/lib|Failed to fetch|NetworkError|disabled/i.test(m)) return "Can't reach the cloud. Check your internet and try again.";
    return "Something went wrong. Please try again.";
  }
  async function loadProfile() {
    profile = null;
    if (!user) return;
    try { const { data } = await sb.from("postly_profiles").select("plan,pro_until").eq("id", user.id).maybeSingle(); profile = data || { plan: "free" }; }
    catch (e) { profile = { plan: "free" }; }
  }
  const isPro = () => !!profile && profile.plan === "pro" && (!profile.pro_until || new Date(profile.pro_until) > new Date());
  function paint() {
    const pro = isPro();
    $("#acct-label").textContent = user ? (pro ? "Pro" : "Account") : "Sign in";
    $("#btn-account").classList.toggle("pro", pro);
    $("#acct-email").textContent = user ? user.email + (pro ? " · Pro" : " · Free plan") : "Not signed in";
    $("#acct-out").hidden = !user;
    $("#acct-pro-label").textContent = pro ? `Pro until ${profile.pro_until ? new Date(profile.pro_until).toLocaleDateString() : "—"}` : "Upgrade to Pro";
    if (window.MDC_AI && window.MDC_AI.setDailyLimit) window.MDC_AI.setDailyLimit(pro ? CFG.limits.pro.ai : CFG.limits.free.ai);
    $$(".ds-promo").forEach(p => { p.hidden = pro; });
    if (dDesigns && dDesigns.open) listDesigns();
  }

  /* ---------------- sign in / sign up ---------------- */
  const dAuth = dialog("dlg-auth", `<h3 id="au-title">Sign in to Postly</h3>
    <p class="ds-hint" id="au-hint">Save your designs to the cloud and open them on any device. Free.</p>
    <div class="ds-tabs" id="au-tabs"><button type="button" class="on" data-au="in">Sign in</button><button type="button" data-au="up">Create account</button></div>
    <form id="au-form" class="ds-var-form" autocomplete="on">
      <input id="au-email" class="ds-input" type="email" placeholder="Email" autocomplete="email" required>
      <input id="au-pass" class="ds-input" type="password" placeholder="Password (6+ characters)" autocomplete="current-password" minlength="6">
      <button class="ds-btn primary" id="au-go" type="submit">Sign in</button>
      <div class="ds-row" style="justify-content:space-between;gap:8px;flex-wrap:wrap">
        <button class="ds-link" type="button" id="au-magic">Email me a sign-in link instead</button>
        <button class="ds-link" type="button" id="au-forgot">Forgot password?</button>
      </div>
      <p class="ds-au-msg" id="au-msg"></p>
    </form>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`);
  let auMode = "in";
  function setAuMode(m) {
    auMode = m;
    $$("#au-tabs button").forEach(b => b.classList.toggle("on", b.dataset.au === m));
    $("#au-tabs").hidden = m === "newpass";
    $("#au-email").hidden = m === "newpass";
    $("#au-title").textContent = m === "up" ? "Create your free account" : m === "newpass" ? "Choose a new password" : "Sign in to Postly";
    $("#au-go").textContent = m === "up" ? "Create account" : m === "newpass" ? "Save new password" : "Sign in";
    $("#au-pass").autocomplete = m === "in" ? "current-password" : "new-password";
    $("#au-pass").placeholder = m === "newpass" ? "New password (6+ characters)" : "Password (6+ characters)";
    $("#au-magic").hidden = $("#au-forgot").hidden = m === "newpass";
    $("#au-msg").textContent = ""; $("#au-msg").className = "ds-au-msg";
  }
  const say = (m, ok) => { $("#au-msg").textContent = m; $("#au-msg").className = "ds-au-msg " + (ok ? "ok" : "err"); };
  $("#au-tabs").addEventListener("click", e => { const b = e.target.closest("[data-au]"); if (b) setAuMode(b.dataset.au); });
  const redirect = () => location.origin + location.pathname;
  $("#au-form").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("#au-email").value.trim(), pass = $("#au-pass").value, btn = $("#au-go");
    if (auMode !== "newpass" && !/^\S+@\S+\.\S+$/.test(email)) return say("Type a valid email.");
    if (pass.length < 6) return say("Use a password with at least 6 characters.");
    busy(btn, true, "Please wait…");
    try {
      const a = (await client()).auth;
      if (auMode === "in") { const { error } = await a.signInWithPassword({ email, password: pass }); if (error) throw error; afterSignIn(); }
      else if (auMode === "up") {
        const { data, error } = await a.signUp({ email, password: pass, options: { emailRedirectTo: redirect() } }); if (error) throw error;
        if (data.session) afterSignIn(); else say("Almost done! We sent you an email. Click the link in it to confirm your account, then sign in.", true);
      } else { const { error } = await a.updateUser({ password: pass }); if (error) throw error; say("Password changed ✔", true); setTimeout(() => dAuth.close(), 900); }
    } catch (err) { console.warn(err); say(friendly(err)); }
    busy(btn, false);
  });
  $("#au-magic").onclick = async () => {
    const email = $("#au-email").value.trim(); if (!/^\S+@\S+\.\S+$/.test(email)) return say("Type your email first.");
    try { const { error } = await (await client()).auth.signInWithOtp({ email, options: { emailRedirectTo: redirect() } }); if (error) throw error; say("Check your email and click the sign-in link.", true); }
    catch (err) { say(friendly(err)); }
  };
  $("#au-forgot").onclick = async () => {
    const email = $("#au-email").value.trim(); if (!/^\S+@\S+\.\S+$/.test(email)) return say("Type your email first.");
    try { const { error } = await (await client()).auth.resetPasswordForEmail(email, { redirectTo: redirect() }); if (error) throw error; say("We sent you a link to choose a new password.", true); }
    catch (err) { say(friendly(err)); }
  };
  let after = null;
  function afterSignIn() { dAuth.close(); S.toast(`Signed in ✔ ${user ? user.email : ""}`); const f = after; after = null; if (f) setTimeout(f, 300); }
  function openAuth(mode, then) { setAuMode(mode || "in"); if (then) after = then; open(dAuth); setTimeout(() => (mode === "newpass" ? $("#au-pass") : $("#au-email")).focus(), 50); }
  async function needUser(then) {
    try { await client(); const { data } = await sb.auth.getSession(); user = data.session ? data.session.user : null; } catch (e) { S.toast(friendly(e)); return false; }
    if (user) { if (!profile) await loadProfile(); return true; }
    openAuth("in", then); return false;
  }

  /* ---------------- My designs ---------------- */
  const dDesigns = dialog("dlg-designs", `<h3>My designs</h3>
    <div class="ds-row ds-cloud-bar">
      <input id="cd-title" class="ds-input" maxlength="80" placeholder="Design name">
      <button class="ds-btn primary sm" id="cd-save" type="button"><i class="fa-solid fa-cloud-arrow-up"></i> Save</button>
      <button class="ds-btn ghost sm" id="cd-new" type="button" title="Save as a new copy"><i class="fa-regular fa-copy"></i> Save as new</button>
    </div>
    <label class="ds-check"><input type="checkbox" id="cd-auto"> Auto-save this design to the cloud while I work</label>
    <p class="ds-hint" id="cd-usage"></p>
    <div class="ds-cloud-grid" id="cd-grid"></div>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`, true);
  let cloudId = store.get("postly_cloud_id"), dirty = false;
  function currentData() {
    const pages = (F.pages ? F.pages.slice() : [S.snapshot()]), cur = F.cur || 0;
    pages[cur] = S.snapshot();
    return { pages, cur };
  }
  function thumbOf() { const [W, H] = S.size; return S.renderToCanvas(Math.min(1, 320 / Math.max(W, H))).toDataURL("image/jpeg", 0.72); }
  function guessTitle() {
    const t = S.userObjects().filter(o => o.type === "textbox").sort((a, b) => b.fontSize * b.scaleY - a.fontSize * a.scaleY)[0];
    return t ? t.text.replace(/\s+/g, " ").trim().slice(0, 60) : "Untitled design";
  }
  async function saveCloud(asNew, quiet) {
    if (!user) return false;
    const title = ($("#cd-title").value.trim() || store.get("postly_cloud_title") || guessTitle()).slice(0, 80);
    const row = { title, data: currentData(), thumb: thumbOf() };
    let res;
    if (cloudId && !asNew) res = await sb.from("postly_designs").update(row).eq("id", cloudId).select("id").maybeSingle();
    if (!res || (!res.error && !res.data)) res = await sb.from("postly_designs").insert(row).select("id").single();
    if (res.error) { if (!quiet) S.toast(friendly(res.error), 6000); else console.warn(res.error); return false; }
    cloudId = res.data.id; store.set("postly_cloud_id", cloudId); store.set("postly_cloud_title", title); dirty = false;
    if (!quiet) S.toast(`Saved to the cloud ✔ “${title}”`);
    return true;
  }
  async function listDesigns() {
    const grid = $("#cd-grid"); grid.innerHTML = '<p class="ds-hint">Loading…</p>';
    const { data, error } = await sb.from("postly_designs").select("id,title,thumb,updated_at").order("updated_at", { ascending: false });
    if (error) { grid.innerHTML = `<p class="ds-hint">${esc(friendly(error))}</p>`; return; }
    const lim = isPro() ? CFG.limits.pro.designs : CFG.limits.free.designs;
    $("#cd-usage").textContent = `${data.length} of ${lim} designs saved (${isPro() ? "Pro" : "Free plan"}).`;
    grid.innerHTML = data.length ? data.map(d => `<div class="ds-cloud-card${d.id === cloudId ? " cur" : ""}" data-id="${d.id}">
        <button class="ds-cloud-thumb" data-cd="open" type="button">${d.thumb ? `<img src="${esc(d.thumb)}" alt="">` : ""}</button>
        <input class="ds-cloud-name" value="${esc(d.title)}" maxlength="80" aria-label="Design name">
        <small>${d.id === cloudId ? "Open now · " : ""}${esc(ago(d.updated_at))}</small>
        <button class="ds-cloud-del" data-cd="del" type="button" title="Delete"><i class="fa-regular fa-trash-can"></i></button></div>`).join("")
      : '<p class="ds-hint">No designs saved yet. Name this design and press Save.</p>';
  }
  $("#cd-grid").addEventListener("change", async e => {
    const inp = e.target.closest(".ds-cloud-name"); if (!inp) return;
    const id = inp.closest("[data-id]").dataset.id, title = inp.value.trim() || "Untitled design";
    const { error } = await sb.from("postly_designs").update({ title }).eq("id", id);
    if (error) S.toast(friendly(error)); else { if (id === cloudId) { store.set("postly_cloud_title", title); $("#cd-title").value = title; } S.toast("Renamed ✔"); }
  });
  $("#cd-grid").addEventListener("click", async e => {
    const b = e.target.closest("[data-cd]"); if (!b) return;
    const card = b.closest("[data-id]"), id = card.dataset.id;
    if (b.dataset.cd === "del") {
      if (!b.classList.contains("sure")) { b.classList.add("sure"); b.innerHTML = "Delete?"; setTimeout(() => { b.classList.remove("sure"); b.innerHTML = '<i class="fa-regular fa-trash-can"></i>'; }, 3000); return; }
      const { error } = await sb.from("postly_designs").delete().eq("id", id);
      if (error) return S.toast(friendly(error));
      if (id === cloudId) { cloudId = null; store.set("postly_cloud_id", null); }
      S.toast("Design deleted."); listDesigns(); return;
    }
    if (b.dataset.cd === "open") {
      const hasWork = S.userObjects().length > 0 && id !== cloudId;
      if (hasWork && !card.classList.contains("sure")) { $$(".ds-cloud-card.sure").forEach(x => x.classList.remove("sure")); card.classList.add("sure"); S.toast("Click again to open it. Your current pages will be replaced (save them first if you need them).", 5000); return; }
      card.classList.add("loading");
      const { data, error } = await sb.from("postly_designs").select("id,title,data").eq("id", id).single();
      card.classList.remove("loading");
      if (error || !data || !data.data || !Array.isArray(data.data.pages)) return S.toast(error ? friendly(error) : "This design could not be opened.");
      F.replacePages ? F.replacePages(data.data.pages, data.data.cur || 0) : S.loadSnapshot(data.data.pages[0], () => S.fit());
      cloudId = data.id; store.set("postly_cloud_id", cloudId); store.set("postly_cloud_title", data.title); $("#cd-title").value = data.title; dirty = false;
      dDesigns.close(); S.toast(`Opened “${data.title}” ✔`);
    }
  });
  $("#cd-save").onclick = async e => { const b = e.currentTarget; busy(b, true, "Saving…"); if (await saveCloud(false)) listDesigns(); busy(b, false); };
  $("#cd-new").onclick = async e => { const b = e.currentTarget; busy(b, true, "Saving…"); if (await saveCloud(true)) listDesigns(); busy(b, false); };
  $("#cd-auto").checked = store.get("postly_cloud_auto") === "1";
  $("#cd-auto").addEventListener("change", e => { store.set("postly_cloud_auto", e.target.checked ? "1" : null); if (e.target.checked && !cloudId) saveCloud(false).then(ok => ok && listDesigns()); });
  document.addEventListener("mdc:saved", () => { dirty = true; });
  setInterval(() => { if (dirty && user && cloudId && store.get("postly_cloud_auto") === "1" && !document.hidden) saveCloud(false, true); }, 60000);
  async function openDesigns() {
    if (!(await needUser(openDesigns))) return;
    $("#cd-title").value = (cloudId && store.get("postly_cloud_title")) || guessTitle();
    open(dDesigns); listDesigns();
  }
  async function quickSave() {
    if (!(await needUser(quickSave))) return;
    if (!cloudId) return openDesigns();
    await saveCloud(false);
  }

  /* ---------------- client approval links ---------------- */
  const dReview = dialog("dlg-review", `<h3>Send for client approval</h3>
    <p class="ds-hint">Your client gets a link to view the pages, pin comments and press Approve or Request changes. No account needed for them. Links work for 30 days.</p>
    <div class="ds-row ds-cloud-bar"><input id="rv-title" class="ds-input" maxlength="80" placeholder="Title for your client, e.g. Eid sale post – v2">
      <button class="ds-btn primary sm" id="rv-make" type="button"><i class="fa-solid fa-link"></i> Create link</button></div>
    <div id="rv-new"></div>
    <h4 style="margin-top:14px">Your approval links</h4>
    <div id="rv-list" class="ds-rv-list"></div>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`, true);
  const reviewURL = t => `${location.origin}${location.pathname.replace(/[^/]*$/, "")}review/?t=${t}`;
  async function renderPagesJPEG(max) {
    const { pages, cur } = currentData(), out = [];
    for (let i = 0; i < pages.length; i++) {
      const d = JSON.parse(pages[i]), m = Math.min(1, max / Math.max(d.w, d.h));
      const el = i === cur ? S.renderToCanvas(m) : await F.renderSnapshot(d, m);
      const flat = document.createElement("canvas"); flat.width = el.width; flat.height = el.height;
      const x = flat.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, flat.width, flat.height); x.drawImage(el, 0, 0);
      out.push(flat.toDataURL("image/jpeg", 0.82));
    }
    return out;
  }
  function shareBox(t, title) {
    const url = reviewURL(t), msg = `Hi! Please review "${title}" and approve it or leave comments here: ${url}`;
    return `<div class="ds-rv-share"><input class="ds-input" readonly value="${esc(url)}">
      <button class="ds-btn ghost sm" type="button" data-copy="${esc(url)}"><i class="fa-regular fa-copy"></i> Copy</button>
      <a class="ds-btn sm ds-wa" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a></div>`;
  }
  const STATUS = { pending: ["Waiting", "fa-hourglass-half"], approved: ["Approved", "fa-circle-check"], changes: ["Changes requested", "fa-pen"] };
  async function listReviews() {
    const box = $("#rv-list"); box.innerHTML = '<p class="ds-hint">Loading…</p>';
    const { data, error } = await sb.from("postly_reviews").select("id,token,title,status,decided_by,created_at,expires_at,postly_review_comments(count)").order("created_at", { ascending: false }).limit(50);
    if (error) { box.innerHTML = `<p class="ds-hint">${esc(friendly(error))}</p>`; return; }
    box.innerHTML = data.length ? data.map(r => {
      const n = (r.postly_review_comments && r.postly_review_comments[0] && r.postly_review_comments[0].count) || 0, [st, ic] = STATUS[r.status] || STATUS.pending, old = new Date(r.expires_at) < new Date();
      return `<div class="ds-rv-item ${r.status}" data-rv="${r.id}" data-t="${r.token}"><i class="fa-solid ${ic}"></i>
        <div><b>${esc(r.title)}</b><small>${old ? "Expired" : esc(st)}${r.decided_by ? " by " + esc(r.decided_by) : ""} · ${n} comment${n === 1 ? "" : "s"} · ${esc(ago(r.created_at))}</small></div>
        <button class="ds-btn ghost sm" data-rva="show" type="button">${n ? "Comments" : "Link"}</button>
        <button class="ds-btn ghost sm" data-rva="del" type="button" title="Delete"><i class="fa-regular fa-trash-can"></i></button></div><div class="ds-rv-more" hidden></div>`;
    }).join("") : '<p class="ds-hint">No links yet.</p>';
  }
  $("#rv-make").onclick = async e => {
    const btn = e.currentTarget, title = ($("#rv-title").value.trim() || guessTitle()).slice(0, 80);
    busy(btn, true, "Preparing pages…");
    try {
      const pages = await renderPagesJPEG(isPro() ? 1600 : 1200);
      busy(btn, false); busy(btn, true, "Uploading…");
      const { data, error } = await sb.from("postly_reviews").insert({ title, pages }).select("token").single();
      if (error) throw error;
      $("#rv-new").innerHTML = `<p class="ds-hint ok">Link ready ✔ Send it to your client:</p>${shareBox(data.token, title)}`;
      listReviews();
    } catch (err) { console.warn(err); S.toast(friendly(err), 6000); }
    busy(btn, false);
  };
  dReview.addEventListener("click", async e => {
    const cp = e.target.closest("[data-copy]");
    if (cp) { try { await navigator.clipboard.writeText(cp.dataset.copy); S.toast("Link copied ✔"); } catch (err) { const i = cp.parentElement.querySelector("input"); i.select(); document.execCommand && document.execCommand("copy"); S.toast("Link copied ✔"); } return; }
    const a = e.target.closest("[data-rva]"); if (!a) return;
    const item = a.closest("[data-rv]"), more = item.nextElementSibling;
    if (a.dataset.rva === "del") {
      if (!a.classList.contains("sure")) { a.classList.add("sure"); a.textContent = "Delete?"; return; }
      const { error } = await sb.from("postly_reviews").delete().eq("id", item.dataset.rv); if (error) return S.toast(friendly(error)); listReviews(); return;
    }
    if (!more.hidden) { more.hidden = true; return; }
    const { data } = await sb.from("postly_review_comments").select("name,page,body,created_at").eq("review_id", item.dataset.rv).order("created_at");
    const title = item.querySelector("b").textContent;
    more.innerHTML = shareBox(item.dataset.t, title) + ((data || []).length ? `<ul class="ds-rv-comments">${data.map(cm => `<li><b>${esc(cm.name)}</b> <small>page ${cm.page + 1} · ${esc(ago(cm.created_at))}</small><p>${esc(cm.body)}</p></li>`).join("")}</ul>` : '<p class="ds-hint">No comments yet.</p>');
    more.hidden = false;
  });
  async function openReview() {
    if (!(await needUser(openReview))) return;
    $("#rv-title").value = store.get("postly_cloud_title") || guessTitle(); $("#rv-new").innerHTML = "";
    open(dReview); listReviews();
  }

  /* ---------------- Postly Pro ---------------- */
  const L = CFG.limits;
  const dPro = dialog("dlg-pro", `<h3><i class="fa-solid fa-crown" style="color:#f5b942"></i> Postly Pro</h3>
    <p class="ds-hint">Everything stays free. Pro is for creators and agencies who make designs every day.</p>
    <table class="ds-pro-table"><thead><tr><th></th><th>Free</th><th>Pro</th></tr></thead><tbody>
      <tr><td>Templates, tools, downloads, no watermark</td><td>✓</td><td>✓</td></tr>
      <tr><td>AI uses per day</td><td>${L.free.ai}</td><td>${L.pro.ai}</td></tr>
      <tr><td>Designs saved in the cloud</td><td>${L.free.designs}</td><td>${L.pro.designs}</td></tr>
      <tr><td>Open client approval links</td><td>${L.free.reviews}</td><td>${L.pro.reviews}</td></tr>
      <tr><td>Bigger designs & sharper review images</td><td>–</td><td>✓</td></tr>
      <tr><td>Priority help on WhatsApp</td><td>–</td><td>✓</td></tr>
    </tbody></table>
    <div id="pro-state"></div>
    <div class="ds-pro-plans">
      <button class="ds-pro-plan" data-plan="monthly" type="button"><b>Monthly</b><span>${esc(CFG.price.monthly)}</span></button>
      <button class="ds-pro-plan best" data-plan="yearly" type="button"><em>Best value</em><b>Yearly</b><span>${esc(CFG.price.yearly)}</span></button>
    </div>
    <p class="ds-hint">Tap a plan: WhatsApp opens with your account email. We reply with the payment details and switch on Pro as soon as the payment arrives.</p>
    <div class="ds-row" style="justify-content:flex-end"><button class="ds-btn ghost sm" data-close type="button">Close</button></div>`);
  async function proState() {
    const box = $("#pro-state");
    if (isPro()) { box.innerHTML = `<p class="ds-hint ok">You're on Pro until ${new Date(profile.pro_until).toLocaleDateString()} ✔ Tap a plan to extend it.</p>`; return; }
    const { data } = await sb.from("postly_pro_requests").select("plan,status,created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(1);
    box.innerHTML = data && data.length ? `<p class="ds-hint">Your ${esc(data[0].plan)} request from ${esc(ago(data[0].created_at))} is waiting for payment confirmation. Message us on WhatsApp if you've already paid.</p>` : "";
  }
  $$("#dlg-pro [data-plan]").forEach(b => b.onclick = async () => {
    const plan = b.dataset.plan;
    const msg = `Hi! I want Postly Pro (${plan}, ${plan === "monthly" ? CFG.price.monthly : CFG.price.yearly}).\nMy Postly account email: ${user.email}\nPlease send me the payment details.`;
    const w = window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    const { error } = await sb.from("postly_pro_requests").insert({ plan, email: user.email });
    if (error) console.warn(error);
    if (!w) S.toast("Open WhatsApp and message us: " + CFG.whatsapp, 6000);
    proState();
  });
  async function openPro() {
    if (!(await needUser(openPro))) return;
    await loadProfile(); paint(); open(dPro); proState();
  }

  /* ---------------- menu ---------------- */
  $("#btn-account").onclick = async e => {
    e.stopPropagation();
    const m = $("#menu-account"), on = !m.classList.contains("open");
    $$(".ds-menu").forEach(x => x.classList.remove("open"));
    if (!user && on) {   // not signed in: go straight to the sign-in form
      try { await client(); const { data } = await sb.auth.getSession(); user = data.session ? data.session.user : null; } catch (err) { /* offline */ }
      if (!user) { openAuth("in"); return; }
      await loadProfile(); paint();
    }
    m.classList.toggle("open", on);
  };
  $("#menu-account").addEventListener("click", async e => {
    const b = e.target.closest("[data-acct]"); if (!b) return;
    $("#menu-account").classList.remove("open");
    const a = b.dataset.acct;
    if (a === "designs") openDesigns();
    if (a === "save") quickSave();
    if (a === "review") openReview();
    if (a === "pro") openPro();
    if (a === "out") { await sb.auth.signOut(); user = null; profile = null; cloudId = null; store.set("postly_cloud_id", null); paint(); S.toast("Signed out."); }
  });
  document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "S" || e.key === "s")) { e.preventDefault(); quickSave(); } });

  // restore a session quietly (only loads the library if this browser signed in before, or arrives from an email link)
  const hasSession = store.get("postly-auth") || /access_token|type=recovery|code=/.test(location.hash + location.search);
  if (hasSession && CFG.enabled) client().then(() => sb.auth.getSession()).then(({ data }) => { user = data.session ? data.session.user : null; return loadProfile(); }).then(paint).catch(() => {});
  paint();
  window.POSTLY_ACCOUNT = { client, openAuth, openDesigns, openReview, openPro, saveCloud, get user() { return user; }, get profile() { return profile; }, isPro };
})();
