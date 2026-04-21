# Deploy Guide — shoaibramani.com

Everything you need to take this project from zip file to live site. Budget ~45 minutes.

All services have a free tier that covers this site comfortably.

---

## 0. Prerequisites

- Node.js 18.18+ (check with `node -v`)
- A GitHub account (push the code here before deploying)
- Accounts (create if you don't have them):
  - [Vercel](https://vercel.com) — hosting
  - [Neon](https://neon.tech) — Postgres database (or use the Vercel–Neon integration)
  - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — file uploads (resume PDF, images)
  - [Resend](https://resend.com) — transactional email (OTP, contact form)

---

## 1. Local sanity check

```bash
cd shoaibramani
npm install
cp .env.example .env.local
# fill in .env.local with real values (see section 3 for each)
npm run dev
```

Open `http://localhost:3000`. The public pages will render empty until the DB is seeded (section 5).

---

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<you>/shoaibramani.git
git push -u origin main
```

---

## 3. Provision cloud services

### 3a. Neon Postgres

**Option A — via Vercel (recommended):** In your Vercel project (created in step 4), Storage → Create → Neon Postgres. Vercel automatically injects `DATABASE_URL` into every environment.

**Option B — directly:** Sign in at [neon.tech](https://neon.tech), create a project, copy the **pooled** connection string (ends with `?sslmode=require`). This is your `DATABASE_URL`.

### 3b. Vercel Blob

In the Vercel project → Storage → Create → Blob. After creation, Vercel auto-adds `BLOB_READ_WRITE_TOKEN` to the environment.

### 3c. Resend

1. [resend.com](https://resend.com) → API Keys → Create API Key. Copy to `RESEND_API_KEY`.
2. Domains → Add your domain (e.g. `shoaibramani.com`) and add the DNS records Resend shows. Once verified, your `RESEND_FROM` can be `Shoaib Ramani <hello@shoaibramani.com>`.
3. Before your domain is verified, for testing you can use `onboarding@resend.dev` as `RESEND_FROM` — but Resend will only deliver to the account owner's email.

### 3d. `NEXTAUTH_SECRET`

Generate a 32+ char random string:

```bash
openssl rand -base64 48
```

---

## 4. Deploy to Vercel

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Root directory: project root.
3. Environment Variables — add all of these (also see `.env.example`):

| Variable                | Example                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL`          | `postgres://…?sslmode=require` (auto from Neon integration)                  |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_rw_…` (auto from Blob integration)                              |
| `RESEND_API_KEY`        | `re_…`                                                                       |
| `RESEND_FROM`           | `Shoaib Ramani <hello@shoaibramani.com>`                                     |
| `ADMIN_EMAIL`           | `shoaibramani1@gmail.com` (where OTPs + contact notifications are sent)      |
| `NEXTAUTH_SECRET`       | random 48+ char string                                                       |
| `NEXT_PUBLIC_SITE_URL`  | `https://shoaibramani.com` (or your Vercel URL until custom domain is ready) |
| `SEED_ADMIN_EMAIL`      | `shoaibramani1@gmail.com`                                                    |
| `SEED_ADMIN_PASSWORD`   | `ChangeMe#2026!` (change after first login)                                  |

4. Click **Deploy**. First build will succeed, but the site will have no content until the DB is migrated + seeded.

---

## 5. Migrate the database & seed initial content

Run these locally from the project root, with `.env.local` populated to match your Vercel environment (copy `DATABASE_URL` from Vercel into `.env.local`):

```bash
# 1. Push the schema to Neon
npm run db:push

# 2. Seed the database with the admin account + all resume content
npm run db:seed
```

You should see `Seed complete.` Your admin account is now:

- Email: `shoaibramani1@gmail.com`
- Password: `ChangeMe#2026!`

Redeploy Vercel (or just refresh) — the site is now live with content.

---

## 6. First login & change password

1. Visit `https://your-site.com/admin/login`
2. Enter admin email + password → you'll be redirected to `/admin/verify-otp`.
3. A 6-digit code arrives at `ADMIN_EMAIL` — enter it within 10 minutes.
4. Once in the dashboard, go to **Account** → change the password immediately.

Session cookie lives for 8 hours. 3 wrong OTPs trigger a 30-minute lockout. Resend OTP available after 60s.

---

## 7. Custom domain

In Vercel → Project → Settings → Domains → add `shoaibramani.com`. Follow the DNS instructions (A record or CNAME). Once verified, update `NEXT_PUBLIC_SITE_URL` in the env and redeploy.

Also update Resend DNS for the same domain if you haven't already (section 3c).

---

## 8. Post-launch checklist

- [ ] `/admin/*` redirects to login when unauthenticated (test in an incognito window)
- [ ] `robots.txt` blocks `/admin/*` → visit `https://your-site.com/robots.txt`
- [ ] `sitemap.xml` lists all public pages → `https://your-site.com/sitemap.xml`
- [ ] Contact form sends an email to `ADMIN_EMAIL` and an auto-reply to the sender
- [ ] Resume download at `/resume` serves the file uploaded from `/admin/resume`
- [ ] Hero headshot and about headshot render (upload from `/admin/hero` and `/admin/about`)
- [ ] Run Lighthouse (Chrome DevTools) on home, about, experience, blog, resume, contact — aim for 90+ everywhere
- [ ] Preview `/blog/[slug]` share card: https://www.linkedin.com/post-inspector/ and https://opengraph.xyz

---

## 9. Ongoing maintenance

- **New blog post:** `/admin/blog/new` → write → publish.
- **Update a role:** `/admin/experience/[id]` → edit → save.
- **Swap resume PDF:** `/admin/resume` → upload → auto-published at `/resume`.
- **Edit homepage copy:** `/admin/hero` → save.
- **Change nav links:** `/admin/nav` → save.
- **Schema changes:** edit `lib/db/schema.ts` → `npm run db:generate` → `npm run db:push`.

---

## 10. Troubleshooting

**Can't log in / "Unknown admin":** The seed didn't run against the same `DATABASE_URL` the deploy uses. Re-run `npm run db:seed` with the correct env.

**OTP never arrives:** Check the Resend dashboard logs. Likely causes: `RESEND_FROM` domain not verified, or `RESEND_API_KEY` wrong.

**Image upload fails:** `BLOB_READ_WRITE_TOKEN` missing or the Vercel Blob store was deleted. Re-create it.

**Build fails with "DATABASE_URL not set":** add the env var in Vercel (Preview + Production + Development scopes).

**Static pages show empty content after deploy:** That's a stale ISR cache — trigger a redeploy, or edit any field in `/admin/settings` and save (every write calls `revalidatePath`).

---

Shipped. Go build.
