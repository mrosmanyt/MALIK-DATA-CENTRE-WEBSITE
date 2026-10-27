/* Postly client approval page: view pages, pin comments, approve or request changes (no account needed). */
(function () {
  const CFG = window.POSTLY_CLOUD || {}, $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const token = (new URLSearchParams(location.search).get("t") || "").replace(/[^a-f0-9]/gi, "");
  const NAME_KEY = "postly_review_name";
  const getName = () => { try { return localStorage.getItem(NAME_KEY) || ""; } catch (e) { return ""; } };
  const setName = v => { try { localStorage.setItem(NAME_KEY, v); } catch (e) {} };
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 3500); }
  const STATUS = { pending: "Waiting for your answer", approved: "Approved", changes: "Changes requested" };
  function fail(icon, title, text) { $("#title").textContent = "Design review"; $("#app").innerHTML = `<div class="msg"><i class="fa-solid ${icon}"></i><h2>${esc(title)}</h2><p>${esc(text)}</p></div>`; }
  if (!token) return fail("fa-link-slash", "This link is not complete", "Please ask for the full review link again.");
  if (!window.supabase || !CFG.url) return fail("fa-wifi", "Can't load the review", "Check your internet and refresh the page.");
  const sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: false, autoRefreshToken: false } });
  let review = null, pin = null;

  async function load() {
    const { data, error } = await sb.rpc("postly_get_review", { t: token });
    if (error) { console.warn(error); return fail("fa-triangle-exclamation", "Can't load the review", "Please refresh the page in a minute."); }
    if (!data) return fail("fa-clock", "This link has expired or was removed", "Ask the designer to send you a new link.");
    review = data; render();
  }
  function render() {
    const r = review, cms = r.comments || [];
    document.title = `${r.title} | Review`;
    $("#title").textContent = r.title;
    const st = $("#status"); st.hidden = false; st.className = "badge " + r.status; st.textContent = STATUS[r.status] + (r.decided_by && r.status !== "pending" ? ` · ${r.decided_by}` : "");
    const pinsFor = i => cms.map((c, k) => ({ c, k })).filter(({ c }) => c.page === i && c.x != null && c.y != null)
      .map(({ c, k }) => `<div class="pin" style="left:${c.x * 100}%;top:${c.y * 100}%" title="${esc(c.name)}: ${esc(c.body)}"><span>${k + 1}</span></div>`).join("");
    $("#app").innerHTML = `<main>
      <section><p class="hint"><i class="fa-regular fa-hand-pointer"></i> Click anywhere on a design to leave a comment on that spot.</p>
        ${r.pages.map((src, i) => `<div class="page"><p class="lbl">Page ${i + 1} of ${r.pages.length}</p><div class="shot" data-page="${i}"><img src="${esc(src)}" alt="Page ${i + 1}">${pinsFor(i)}${pin && pin.page === i ? `<div class="pin new" style="left:${pin.x * 100}%;top:${pin.y * 100}%"><span>+</span></div>` : ""}</div></div>`).join("")}
      </section>
      <aside><h2>Comments (${cms.length})</h2>
        ${cms.length ? cms.map((c, k) => `<div class="cm"><span class="n">${k + 1}</span><b>${esc(c.name)}</b> <small>· page ${c.page + 1}</small><p>${esc(c.body)}</p></div>`).join("") : '<p class="hint">No comments yet.</p>'}
        <form id="cf"><input id="cf-name" maxlength="60" placeholder="Your name" value="${esc(getName())}" required>
          <textarea id="cf-body" maxlength="1000" placeholder="${pin ? `Comment on page ${pin.page + 1} (pinned spot)` : "Write a comment, or click on the design first"}" required></textarea>
          <button class="primary" type="submit"><i class="fa-regular fa-comment"></i> Add comment</button></form>
      </aside></main>
      <div class="bar"><button class="ch" id="b-ch" type="button"><i class="fa-solid fa-pen"></i> Request changes</button><button class="ok" id="b-ok" type="button"><i class="fa-solid fa-check"></i> Approve</button></div>`;
    document.querySelectorAll(".shot").forEach(el => el.addEventListener("click", e => {
      const r2 = el.getBoundingClientRect();
      pin = { page: +el.dataset.page, x: Math.min(1, Math.max(0, (e.clientX - r2.left) / r2.width)), y: Math.min(1, Math.max(0, (e.clientY - r2.top) / r2.height)) };
      const keep = { name: $("#cf-name").value, body: $("#cf-body").value };
      render(); $("#cf-name").value = keep.name; $("#cf-body").value = keep.body; $("#cf-body").focus();
    }));
    $("#cf").addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#cf-name").value.trim(), body = $("#cf-body").value.trim(); if (!name || !body) return;
      setName(name);
      const p = pin || { page: 0, x: null, y: null };
      const { data, error } = await sb.rpc("postly_add_comment", { t: token, who: name, pg: p.page, px: p.x, py: p.y, msg: body });
      if (error || !data) return toast("Could not send the comment. Please try again.");
      pin = null; toast("Comment sent ✔"); load();
    });
    const decide = async d => {
      let name = $("#cf-name").value.trim() || getName();
      if (!name) { $("#cf-name").focus(); return toast("Type your name first (in the comment box)."); }
      setName(name);
      if (d === "changes" && !(review.comments || []).length && !$("#cf-body").value.trim()) { $("#cf-body").focus(); return toast("Tell the designer what to change: add a comment first."); }
      if (d === "changes" && $("#cf-body").value.trim()) { const p = pin || { page: 0, x: null, y: null }; await sb.rpc("postly_add_comment", { t: token, who: name, pg: p.page, px: p.x, py: p.y, msg: $("#cf-body").value.trim() }); pin = null; }
      const { data, error } = await sb.rpc("postly_decide", { t: token, who: name, decision: d });
      if (error || !data) return toast("Could not save your answer. Please try again.");
      toast(d === "approved" ? "Approved ✔ The designer can see it now." : "Sent ✔ The designer will make the changes."); load();
    };
    $("#b-ok").onclick = () => decide("approved");
    $("#b-ch").onclick = () => decide("changes");
  }
  load();
})();
