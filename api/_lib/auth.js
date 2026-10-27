// Staff accounts, passwords (scrypt), signed session cookies and role permissions.
const crypto = require("crypto");
const { redis, pairs, parse } = require("./redis");
const { cookies } = require("./http");

const COOKIE = "mdc_admin";
const HOURS = 12;

/* ---------------- roles & permissions (checked on the server for every call) ---------------- */
const PERMS = {
  owner: ["*"],
  admin: ["dashboard", "leads.view", "leads.edit", "leads.delete", "leads.export", "orders.view", "orders.edit", "content.view", "content.edit", "content.publish",
          "tools.edit", "coupons.edit", "blog.edit", "seo.edit", "uploads", "pro.manage", "users.manage", "activity.view", "backup.download", "settings.manage"],
  editor: ["dashboard", "content.view", "content.edit", "content.publish", "blog.edit", "seo.edit", "uploads", "tools.edit"],
  sales: ["dashboard", "leads.view", "leads.edit", "leads.export", "orders.view", "orders.edit", "coupons.edit", "pro.manage", "content.view"],
  viewer: ["dashboard", "leads.view", "orders.view", "content.view", "activity.view"]
};
const ROLE_NAMES = { owner: "Owner", admin: "Administrator", editor: "Content Editor", sales: "Sales & Orders", viewer: "Viewer" };
function can(user, perm) {
  if (!user) return false;
  const list = PERMS[user.role] || [];
  return list.includes("*") || list.includes(perm);
}

/* ---------------- passwords ---------------- */
function hashPassword(pw, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(pw), salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return { salt, hash };
}
function checkPassword(pw, user) {
  if (!user || !user.hash || !user.salt) return false;
  const a = Buffer.from(hashPassword(pw, user.salt).hash, "hex"), b = Buffer.from(user.hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function passwordProblem(pw) {
  pw = String(pw || "");
  if (pw.length < 10) return "Use at least 10 characters.";
  if (pw.length > 200) return "That password is too long.";
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return "Use letters and numbers.";
  return null;
}

/* ---------------- users (Redis hash "users": username → JSON) ---------------- */
async function getUser(u) { return parse(await redis("HGET", "users", String(u || "").toLowerCase())); }
async function saveUser(user) { user.u = user.u.toLowerCase(); await redis("HSET", "users", user.u, JSON.stringify(user)); return user; }
async function allUsers() { return Object.values(pairs(await redis("HGETALL", "users"))).map(s => parse(s)).filter(Boolean); }
const publicUser = u => ({ u: u.u, name: u.name || u.u, role: u.role, roleName: ROLE_NAMES[u.role] || u.role, disabled: !!u.disabled, mustChange: !!u.mustChange, lastLogin: u.lastLogin || null, created: u.created || null, perms: PERMS[u.role] || [] });

/* ---------------- signed session tokens ---------------- */
function secret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  // derived from secrets only the server knows
  return crypto.createHash("sha256").update("mdc-cms|" + (process.env.ADMIN_PASSWORD || "") + "|" + (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "")).digest("hex");
}
const sign = s => crypto.createHmac("sha256", secret()).update(s).digest("base64url");
function makeToken(user) {
  const payload = Buffer.from(JSON.stringify({ u: user.u, v: user.v || 1, exp: Date.now() + HOURS * 3600e3 })).toString("base64url");
  return payload + "." + sign(payload);
}
function readToken(tok) {
  if (!tok || tok.indexOf(".") < 0) return null;
  const [p, s] = tok.split(".");
  const want = sign(p);
  if (!s || s.length !== want.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(want))) return null;
  const d = parse(Buffer.from(p, "base64url").toString());
  if (!d || !d.exp || d.exp < Date.now()) return null;
  return d;
}
function setCookie(res, value, maxAge) {
  const secure = process.env.COOKIE_INSECURE === "1" ? "" : " Secure;";
  res.setHeader("Set-Cookie", `${COOKIE}=${value}; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAge}`);
}
const startSession = (res, user) => setCookie(res, makeToken(user), HOURS * 3600);
const endSession = res => setCookie(res, "", 0);
// returns the signed-in user or null (checks token version + disabled flag every time)
async function current(req) {
  const t = readToken(cookies(req)[COOKIE]);
  if (!t) return null;
  const user = await getUser(t.u);
  if (!user || user.disabled || (user.v || 1) !== t.v) return null;
  return user;
}

module.exports = { PERMS, ROLE_NAMES, can, hashPassword, checkPassword, passwordProblem, getUser, saveUser, allUsers, publicUser, startSession, endSession, current };
