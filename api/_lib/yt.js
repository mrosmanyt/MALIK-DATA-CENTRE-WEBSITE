// Moved into api/_lib so every /api/* route runs through ONE function (api/router.js). Logic unchanged.
// Vercel serverless function: YouTube video import for Postly Design Studio.
//   GET /api/yt?id=VIDEO_ID   → { id, title, author, image: "/api/yt?img=VIDEO_ID" }
//   GET /api/yt?img=VIDEO_ID  → the video's thumbnail (JPG), served from this site so the editor can use it
// No API key needed: it uses YouTube's public oEmbed endpoint and thumbnail images.

const DEFAULT_ORIGINS = ["https://www.malikdatacentre.store", "https://malikdatacentre.store", "http://localhost:8765"];
const ID = /^[A-Za-z0-9_-]{11}$/;

function allowed(req) {
  const list = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const origins = list.length ? list : DEFAULT_ORIGINS;
  const o = req.headers.origin || "", ref = req.headers.referer || "";
  // same-origin <img>/fetch requests may send no Origin header; they still send a Referer from our pages
  return { ok: !o && !ref ? false : origins.includes(o) || origins.some(x => ref.startsWith(x + "/")), origin: origins.includes(o) ? o : origins[0] };
}

module.exports = async (req, res) => {
  const a = allowed(req);
  res.setHeader("Access-Control-Allow-Origin", a.origin);
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!a.ok) return res.status(403).json({ error: "Only works on the MALIK DATA CENTRE website." });
  try {
    const img = String(req.query.img || ""), id = String(req.query.id || "");
    if (img) {
      if (!ID.test(img)) return res.status(400).json({ error: "Bad video id" });
      for (const name of ["maxresdefault", "sddefault", "hqdefault"]) {
        const r = await fetch(`https://i.ytimg.com/vi/${img}/${name}.jpg`);
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 2000) continue; // YouTube's grey "no image" placeholder
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.status(200).send(buf);
      }
      return res.status(404).json({ error: "No thumbnail found" });
    }
    if (!ID.test(id)) return res.status(400).json({ error: "Bad video id" });
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent("https://www.youtube.com/watch?v=" + id)}`);
    if (!r.ok) return res.status(r.status === 401 || r.status === 403 ? 403 : 404).json({ error: "Video not found or private" });
    const d = await r.json();
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).json({ id, title: d.title || "", author: d.author_name || "", image: `/api/yt?img=${id}` });
  } catch (e) {
    return res.status(500).json({ error: "Could not reach YouTube" });
  }
};
