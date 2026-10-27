// Upstash Redis over its REST API (plain fetch, no extra packages).
// Works with the variables Vercel adds when you connect Upstash from Vercel → Storage:
//   KV_REST_API_URL + KV_REST_API_TOKEN   or   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

const BASE = () => (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
const TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

function configured() { return !!(BASE() && TOKEN()); }

async function call(path, body) {
  if (!configured()) { const e = new Error("Database is not connected (Upstash Redis variables missing)"); e.code = "NO_DB"; throw e; }
  const r = await fetch(BASE() + path, { method: "POST", headers: { Authorization: "Bearer " + TOKEN(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) { const e = new Error("Database error " + r.status + (data && data.error ? ": " + data.error : "")); e.code = "DB"; throw e; }
  return data;
}

// one command: redis("HSET", "key", "field", "value")
async function redis(...args) {
  const d = await call("", args.map(a => (typeof a === "number" ? String(a) : a)));
  if (d.error) throw new Error(d.error);
  return d.result;
}

// many commands in one round trip: pipe([["GET","a"],["INCR","b"]]) → [resultA, resultB]
async function pipe(cmds) {
  if (!cmds.length) return [];
  const d = await call("/pipeline", cmds.map(c => c.map(a => (typeof a === "number" ? String(a) : a))));
  return d.map(x => { if (x.error) throw new Error(x.error); return x.result; });
}

const parse = (s, fallback = null) => { if (s == null) return fallback; try { return JSON.parse(s); } catch (e) { return fallback; } };
async function getJSON(key, fallback = null) { return parse(await redis("GET", key), fallback); }
async function setJSON(key, val) { return redis("SET", key, JSON.stringify(val)); }
// HGETALL comes back as a flat array [field, value, field, value, ...]
function pairs(arr) { const o = {}; for (let i = 0; arr && i < arr.length; i += 2) o[arr[i]] = arr[i + 1]; return o; }

module.exports = { redis, pipe, getJSON, setJSON, parse, pairs, configured };
