// Server-only access to the store's Supabase project (orders, product prices, Postly Pro).
// Needs SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables.
// The key never leaves the server.
const URL_ = () => (process.env.SUPABASE_URL || "https://fxlqaqocsszrbdyrcdgj.supabase.co").replace(/\/$/, "");
const KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
const configured = () => !!KEY();

async function sb(path, { method = "GET", body, prefer } = {}) {
  if (!configured()) { const e = new Error("Supabase is not connected (SUPABASE_SERVICE_ROLE_KEY missing)"); e.code = "NO_SB"; throw e; }
  const headers = { apikey: KEY(), "Content-Type": "application/json" };
  // new-style "sb_secret_" keys go only in apikey; legacy JWT service keys also as Bearer
  if (!KEY().startsWith("sb_")) headers.Authorization = "Bearer " + KEY();
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(URL_() + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await r.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!r.ok) { const e = new Error("Supabase " + r.status + ": " + (data && (data.message || data.hint) || text).toString().slice(0, 200)); e.status = r.status; throw e; }
  return data;
}
module.exports = { sb, configured };
