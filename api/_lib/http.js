// Small request/response helpers shared by every route.
const crypto = require("crypto");

function ip(req) {
  return String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || (req.socket && req.socket.remoteAddress) || "0.0.0.0").split(",")[0].trim();
}
function json(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const k in headers) res.setHeader(k, headers[k]);
  res.end(JSON.stringify(data));
}
function noStore(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
}
// Vercel parses JSON bodies into req.body; fall back to reading the stream (local tests)
async function body(req) {
  let b; try { b = req.body; } catch (e) { return {}; }   // Vercel throws on broken JSON
  if (b !== undefined && b !== null && typeof b === "object" && !Buffer.isBuffer(b)) return b;
  if (typeof b === "string") { try { return JSON.parse(b || "{}"); } catch (e) { return {}; } }
  return await new Promise(resolve => {
    let s = "", n = 0;
    req.on("data", c => { n += c.length; if (n > 6 * 1024 * 1024) { req.destroy(); return resolve({}); } s += c; });
    req.on("end", () => { try { resolve(JSON.parse(s || "{}")); } catch (e) { resolve({}); } });
    req.on("error", () => resolve({}));
  });
}
function cookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach(p => { const i = p.indexOf("="); if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return out;
}
// plain text with a length limit (null/undefined → "")
function clean(v, max = 500) { return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max); }
const id = (n = 10) => crypto.randomBytes(n).toString("base64url");
const today = (d = new Date()) => d.toISOString().slice(0, 10);

module.exports = { ip, json, noStore, body, cookies, clean, id, today };
