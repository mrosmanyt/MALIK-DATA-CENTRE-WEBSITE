# MALIK DATA CENTRE: Admin panel setup

The admin panel lets you and your staff change the website, answer enquiries and manage orders without touching code.

- **Address:** https://www.malikdatacentre.store/admin
- **The website looks exactly the same as before until you press Publish** on something. Every section also has **Restore original**, which puts back the built-in version.
- Works on phones, in light or dark mode.

---

## 1. One-time setup in Vercel (about 15 minutes)

Do these steps in order. "Project" means your website project in Vercel.

### Step 1: Put the new code online
Push the code to GitHub as usual. Vercel builds the website automatically.

### Step 2: Create the database (Upstash Redis)
1. In Vercel, open your **Project → Storage**.
2. Click **Create Database**, then choose **Upstash → Redis** (the free plan is enough).
3. Click **Connect to project**, tick all environments, and confirm.

Vercel adds the database keys for you (`KV_REST_API_URL` and `KV_REST_API_TOKEN`). You don't need to copy anything.

### Step 3: Create the photo storage (Vercel Blob)
1. In **Project → Storage**, click **Create Database**, choose **Blob**, and create it.
2. Click **Connect to project**.

Vercel adds `BLOB_READ_WRITE_TOKEN` for you.

### Step 4: Choose the setup password
1. Open **Project → Settings → Environment Variables**.
2. Add **`ADMIN_PASSWORD`** with a strong password of at least 12 characters, using letters and numbers.
   - You use it only once, for the very first sign-in.
3. (Recommended) Add **`SESSION_SECRET`**: any long random text, 40 or more characters. It keeps sign-ins secure.

### Step 5: Connect your orders (Supabase)
1. In **Supabase**, open **Project Settings → API Keys** and copy the **Secret key** (it starts with `sb_secret_`).
2. In Vercel, add it as **`SUPABASE_SERVICE_ROLE_KEY`**.

> ⚠️ This key is like a master key. Only ever paste it into Vercel. Never put it in any website file, never send it on WhatsApp, and never give it to Grok or any other AI.

### Step 6: Redeploy
Go to **Project → Deployments**, click **⋯** on the newest deployment, then **Redeploy**. New settings only apply after a redeploy.

### Step 7: First sign-in
1. Open **/admin**.
2. Username: **admin**. Password: the **ADMIN_PASSWORD** from step 4.
3. The panel asks you to choose your own new password. From now on, use that one.

The setup password stops working once you have your own.

### Step 8: Lock the orders table (important)
Your old admin panel let *any* Supabase login read orders. The new panel reads orders on the server, so you can now lock the table.

1. In the admin panel, open **Orders** and check that your orders are there.
2. In **Supabase → SQL Editor**, open **New query**, paste the whole file `supabase/lock-store-tables.sql`, and click **Run**.
   - If it says **STOPPED**, nothing was changed. Send the message to your developer.
3. Place one small test order on the website and check that it appears in **Orders**.

After this, you can switch Postly accounts back on: in `design/cloud-config.js`, set `enabled: true`.

### Step 9: Add your staff
In **Staff & roles**, add each person with a role and a temporary password, then send it to them privately. They choose their own password at their first sign-in.

### Step 10 (optional): Email alerts for new enquiries
1. Create a free account at **resend.com** and verify your domain (`malikdatacentre.store`).
2. Create an API key and add it in Vercel as **`RESEND_API_KEY`**.
3. Add **`NOTIFY_FROM`**, for example `MALIK DATA CENTRE <alerts@malikdatacentre.store>`.
4. Redeploy.
5. In **Settings → Email alerts**, switch alerts on, add your email, and press **Send a test email**.

### Step 11 (optional): Postly Pro
If you haven't already, run `supabase/postly-setup.sql` once in the Supabase SQL Editor. Then you can activate Pro members in **Postly Pro**.

---

## 2. What each section does

| Section | What it controls |
|---|---|
| **Dashboard** | Page views, visitors (no cookies), top pages, devices, where visitors came from, enquiries per day, the enquiry pipeline, follow-ups due today or overdue, orders waiting, completed sales |
| **Enquiries** | Every message sent through the website forms (contact, "request a tool", services, API credits). For each one: a status, private notes, a follow-up date, who it's assigned to, and one-tap WhatsApp, call and email. Search, filters, an Excel (CSV) download and delete. The forms still open WhatsApp for the customer as before, and now also ask for the customer's WhatsApp number (optional), so the WhatsApp and Call buttons work for every enquiry. |
| **Orders** | Store orders from checkout. Mark them Paid, Completed or Rejected, and send the WhatsApp confirmation. **Customers** shows each customer's total spending. **Database prices** are the prices saved with order records. |
| **Homepage** | Every homepage section: top banner, how it works, why choose us, services, videos (YouTube link or MP4), customer reviews, refund promise, FAQ, payment methods, refer & earn. You can add, edit, delete, drag to reorder, or hide items, upload photos, or hide a whole section. |
| **Tools & prices** | The price, old price, stock (sold out disables the Buy button), ribbon (Best Seller, Popular or your own text), category, description and features of every tool. You can hide a tool or add a new one. Changes show on the homepage catalog and on the tool guide pages. |
| **Coupons** | Coupon codes, their discount, an expiry date, and whether they show as a quick button |
| **Blog** | Write new articles. Each one gets its own page at `/blog/p/your-title/` in the site design, appears at the top of the blog list and is added to Google's sitemap. |
| **Pages & contact** | WhatsApp numbers and social links (they update every button on the site), the footer text, page headings and intros, and the "someone just bought" pop-ups and timers |
| **Announcement bar** | A thin bar on top of every page: text, colour, button, and start and end dates |
| **Popup** | A picture or offer box: which pages it shows on, how often, the delay, and start and end dates |
| **Google & sharing** | The title, description and share picture for every page |
| **Postly Pro** | Pro requests from Postly users, a one-click Activate, and the list of Pro members |
| **Staff & roles** | Add or remove staff, change roles, reset passwords, disable someone instantly, sign them out everywhere |
| **Activity log** | Who signed in, edited, published, deleted or changed what, and when |
| **Backup & restore** | Download everything (content, settings and enquiries) as one file, and restore content from a backup (Owner only) |
| **Settings** | Change your password, sign out on all devices, email alerts, and which services are connected |

### How publishing works
1. Edit a section and press **Save draft**. Nothing changes on the website yet.
2. Press **Publish**. The website updates within about 30 seconds.
3. **⋯ → Undo unpublished changes** goes back to what is live now.
4. **⋯ → Restore original website content** removes all your edits to that section.

### Roles

| Can do | Owner | Administrator | Content Editor | Sales & Orders | Viewer |
|---|:-:|:-:|:-:|:-:|:-:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| See and update enquiries | ✓ | ✓ | – | ✓ | see only |
| Delete enquiries | ✓ | ✓ | – | – | – |
| Orders | ✓ | ✓ | – | ✓ | see only |
| Edit and publish website content, blog, Google | ✓ | ✓ | ✓ | – | – |
| Prices and stock | ✓ | ✓ | ✓ | – | – |
| Coupons, Postly Pro | ✓ | ✓ | – | ✓ | – |
| Contact numbers and payment methods | ✓ | ✓ | – | – | – |
| Staff, backups, settings | ✓ | ✓ (not Owners) | – | – | – |
| Restore a backup | ✓ | – | – | – | – |

Every permission is checked on the server, not just hidden in the menu.

---

## 3. Security (already built in)
- **Passwords:** stored only as scrypt hashes. Everyone must choose their own password, at least 10 characters with letters and numbers.
- **Sign-in:** a signed, HttpOnly, Secure, SameSite=Strict cookie that lasts 12 hours.
  - Disabling a person, changing their role, or "sign out everywhere" takes effect immediately.
- **Limits:** too many wrong passwords from one place are blocked for 15 minutes. Website forms are also limited and have a hidden anti-spam field.
- **Requests:** every change needs a special header, so other websites can't make changes in your name.
- **Website content:** everything is escaped before it's shown, and `javascript:` links are blocked.
- **Excel download:** protected against formula tricks.
- **Admin pages:** not shown in Google, can't be put inside other sites (X-Frame-Options DENY and a strict CSP), and never cached.
  - The offline service worker skips the admin panel and the API.
- **Photos:** only JPG, PNG, WebP or GIF, checked by their real file type, at most 3 MB after compression in the browser.
- **Secret keys:** live only in Vercel. The browser never sees them.

---

## 4. File map

| File | What it is |
|---|---|
| `admin.html` | The admin panel page (also opens at `/admin`) |
| `assets/admin/admin.js` · `admin.css` · `schema.js` · `theme-init.js` | The admin panel app, its design, the list of editable fields, and light/dark mode |
| `api/router.js` | The **one** server function behind every `/api/*` address (keeps you inside Vercel's free-plan function limit) |
| `api/_lib/redis.js` | Database (Upstash Redis over its REST API) |
| `api/_lib/auth.js` | Staff accounts, passwords, sessions, roles and permissions |
| `api/_lib/http.js` | Small request helpers |
| `api/_lib/supabase.js` | Server-only access to orders, prices and Postly |
| `api/_lib/ai.js` · `yt.js` | Postly's AI and YouTube helpers (moved here, unchanged) |
| `assets/js/cms.js` | Loaded on every page. Applies published content, counts page views (no cookies), and sends form enquiries to the inbox. |
| `data/seed.json` | The original content read from the website. Editors start from it, and "Restore original" goes back to it. |
| `data/page-shell.html` | The site design used for new blog posts (made by `build-pages.js`) |
| `scripts/cms-seed.js` | Rebuilds `data/seed.json` |
| `supabase/lock-store-tables.sql` | Step 8 above |
| `supabase/postly-setup.sql` | Postly accounts, cloud saves, Pro and approval links |
| `vercel.json` | Sends `/api/*` to the router, `/admin` to the panel, and `/blog/p/…` to blog posts, and sets the security headers |
| `package.json` | Needed for photo uploads (`@vercel/blob`) |
| `admin/` | The old panel. It now just redirects to `/admin.html`, and the old files in it are empty. |

### Notes for developers
- Editable parts of the HTML are marked with `data-cms="section.field"`, `data-cms-list`, `data-cms-item` and `data-cms-f-*` attributes. `cms.js` reads and writes them.
- After changing HTML text or running `build-pages.js`, run `node scripts/cms-seed.js` (it needs Playwright) so "Restore original" stays accurate.
- Lists for tools, pages and SEO save only what you changed. This means price changes made later in `index.js` still show for tools you haven't edited in the panel.
- Automation tools (e.g. Grok) must never edit `api/`, `admin.html`, `assets/admin/`, `data/`, `store-backend.js`, `supabase/` or any secret. Keep them on a separate bot account with pull-request-only access.

---

## 5. Problems?

| You see | Do this |
|---|---|
| "The database is not connected yet" | Do step 2, then redeploy |
| "Photo uploads are not connected yet" | Do step 3, then redeploy |
| "Orders are not connected yet" | Do step 5, then redeploy |
| You forgot your password | Another Owner or Administrator can reset it in **Staff & roles**. If you're the only Owner, use the emergency steps below. |
| A change doesn't show on the website | Wait 30 seconds and refresh. Check that you pressed **Publish**, not only Save draft. |

### Emergency: the only Owner forgot the password
1. In Vercel, add **`ADMIN_RECOVERY`** with the value **`1`**. Make sure **`ADMIN_PASSWORD`** is a password you know, and redeploy.
2. Sign in as **admin** with that ADMIN_PASSWORD, then choose a new password.
3. **Delete `ADMIN_RECOVERY`** in Vercel and redeploy again. Don't skip this step.
