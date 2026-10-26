// Vercel serverless function: AI proxy for Postly Design Studio.
// Keeps the secret API key on the server. Only used when design/ai-config.js has mode: "proxy".
// Environment variables (Vercel → Settings → Environment Variables):
//   POLLINATIONS_API_KEY = sk_...   (text + images through Pollinations)
//   OPENAI_API_KEY       = sk-...   (optional: text through OpenAI instead)
//   ALLOWED_ORIGINS      = https://www.malikdatacentre.store,https://malikdatacentre.store (optional)

const DEFAULT_ORIGINS = ["https://www.malikdatacentre.store", "https://malikdatacentre.store", "http://localhost:8765"];
const hits = new Map(); // best-effort per-IP limit (resets when the function instance restarts)

function allowed(req) {
  const list = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const origins = list.length ? list : DEFAULT_ORIGINS;
  const o = req.headers.origin || "";
  const ref = req.headers.referer || "";
  return { ok: origins.includes(o) || origins.some(x => ref.startsWith(x + "/")), origin: origins.includes(o) ? o : origins[0] };
}
function limited(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const day = new Date().toISOString().slice(0, 10), key = ip + day;
  const n = (hits.get(key) || 0) + 1; hits.set(key, n);
  if (hits.size > 5000) hits.clear();
  return n > Number(process.env.DAILY_LIMIT_PER_IP || 60);
}
const clamp = (v, lo, hi, d) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };

module.exports = async (req, res) => {
  const a = allowed(req);
  res.setHeader("Access-Control-Allow-Origin", a.origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!a.ok) return res.status(403).json({ error: "This AI service only works on the MALIK DATA CENTRE website." });
  if (limited(req)) return res.status(429).json({ error: "Daily AI limit reached. Please try again tomorrow." });

  const pkey = process.env.POLLINATIONS_API_KEY, okey = process.env.OPENAI_API_KEY;
  try {
    // ---- image ----
    if (req.method === "GET" && req.query.type === "image") {
      if (!pkey) return res.status(503).json({ error: "AI images are not set up yet." });
      const prompt = String(req.query.prompt || "").slice(0, 900);
      if (!prompt) return res.status(400).json({ error: "Missing prompt" });
      const w = clamp(req.query.width, 256, 1536, 1024), h = clamp(req.query.height, 256, 1536, 1024), seed = clamp(req.query.seed, 0, 1e9, 1);
      const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&model=${encodeURIComponent(req.query.model || "flux")}&nologo=true`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${pkey}` } });
      if (!r.ok) return res.status(r.status).json({ error: "Image service error", status: r.status });
      res.setHeader("Content-Type", r.headers.get("content-type") || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.status(200).send(Buffer.from(await r.arrayBuffer()));
    }
    // ---- text ----
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const messages = Array.isArray(body.messages) ? body.messages.slice(-8).map(m => ({ role: m.role === "system" ? "system" : m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 4000) })) : [];
      if (!messages.length) return res.status(400).json({ error: "Missing messages" });
      let r;
      if (okey) {
        r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${okey}` },
          body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages, max_tokens: 600 }) });
      } else if (pkey) {
        r = await fetch("https://gen.pollinations.ai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${pkey}` },
          body: JSON.stringify({ model: body.model || "openai", messages }) });
      } else return res.status(503).json({ error: "AI text is not set up yet." });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return res.status(r.status).json({ error: "Text service error", status: r.status });
      const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "";
      return res.status(200).json({ choices: [{ message: { role: "assistant", content } }] });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "AI request failed" });
  }
};
