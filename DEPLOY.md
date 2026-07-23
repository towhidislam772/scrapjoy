# Deploying Scrapjoy 🚀

This walks you from local code → live website. Everything here uses **free** tiers.

---

## Part 1 — Set up Supabase (orders + photo uploads)

Until you do this, the site still works and takes orders via WhatsApp — this just
turns on the database, photo uploads, and the admin dashboard.

1. Go to **https://supabase.com** → sign in → **New project**. Pick a name and a
   strong database password. Wait ~2 min for it to provision.
2. Open the **SQL Editor** (left sidebar) → **New query** → paste the entire
   contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. Go to **Storage** → confirm a **`order-photos`** bucket exists and is **Public**
   (the SQL creates it; if not, create it manually, Public = ON).
4. Go to **Settings → API** and copy three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Test locally
1. Copy [`.env.example`](.env.example) to a new file named **`.env.local`**.
2. Paste your three Supabase values, and set `ADMIN_PASSWORD` to something strong.
3. Restart the dev server (`npm run dev`). Now:
   - The order form uploads photos and saves orders.
   - Visit **http://localhost:3000/admin** and log in to see orders.

---

## Part 2 — Put the code on GitHub

1. Create a free account at **https://github.com** if you don't have one.
2. Create a **new empty repository** (e.g. `scrapjoy`) — do **not** add a README.
3. In this folder, connect and push (replace `YOUR-NAME`):
   ```bash
   git remote add origin https://github.com/YOUR-NAME/scrapjoy.git
   git branch -M main
   git push -u origin main
   ```
   (`.env.local` is git-ignored, so your secrets are NOT uploaded — good.)

---

## Part 3 — Deploy on Vercel

1. Go to **https://vercel.com** → sign up **with your GitHub account**.
2. **Add New → Project** → import your `scrapjoy` repo. Vercel auto-detects Next.js.
3. Before deploying, open **Environment Variables** and add the same four keys from
   your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
4. Click **Deploy**. In ~1 minute you'll get a live URL like
   `https://scrapjoy.vercel.app`.

### Your own domain (optional)
Buy a domain (e.g. from Namecheap/GoDaddy), then in Vercel: **Project → Settings →
Domains → Add** and follow the DNS steps.

### Future updates
Every time you `git push` to `main`, Vercel redeploys automatically.

---

## Before you go live — checklist
- [ ] Real **WhatsApp number**, email, and socials in [`lib/brand.ts`](lib/brand.ts)
- [ ] Real **prices** in `lib/brand.ts`
- [ ] Your own **product photos** swapped into [`lib/images.ts`](lib/images.ts)
- [ ] Supabase keys + `ADMIN_PASSWORD` set in Vercel
- [ ] Test placing a real order and check it appears in `/admin`
- [ ] (Later) Register your business to enable SSLCommerz card/bKash payments —
      see [`lib/sslcommerz.ts`](lib/sslcommerz.ts)
