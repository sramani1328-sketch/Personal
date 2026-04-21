# Shoaib Ramani — Personal Brand & CMS

Custom Next.js 14 personal brand site with a full self-hosted admin panel. Every headline, bullet, image, and nav link on the public site is editable from `/admin` without touching code.

## Stack

- **Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS
- **Database:** Neon Postgres via Drizzle ORM
- **Storage:** Vercel Blob (resume PDF, headshots, cover images)
- **Email:** Resend (OTP 2FA + contact form)
- **Auth:** Custom email + password + 6-digit OTP 2FA, JWT sessions (8h, `jose`)
- **Editor:** TipTap rich-text for blog posts
- **Deploy:** Vercel

## Quick start (local)

```bash
npm install
cp .env.example .env.local          # fill in the values
npm run db:push                     # migrate schema
npm run db:seed                     # create admin + seed resume content
npm run dev                         # http://localhost:3000
```

Default admin: `shoaibramani1@gmail.com` / `ChangeMe#2026!` (change on first login).

## Deploy

See [DEPLOY.md](./DEPLOY.md) for a full walkthrough: Neon, Vercel Blob, Resend, Vercel deploy, custom domain, and post-launch checklist.

## Project structure

```
app/
  (public)/            # public site — home, about, experience, skills, blog, resume, contact
  admin/               # auth + dashboard + every CMS editor
  api/                 # contact form, sitemap, posts, admin auth
components/
  public/              # hero, nav, footer, service cards, …
  admin/               # AdminUI primitives, TipTap, ImageUploader, Sidebar
  ui/                  # Monogram, Button, Reveal, Counter, TypingCycle
lib/
  db/schema.ts         # Drizzle schema (single source of truth)
  db/seed.ts           # seeds admin + all resume content
  auth/                # session + OTP libraries
  email/               # Resend templates
  admin/actions.ts     # all server actions (CRUD + uploads)
  content.ts           # public data fetchers
```

## Editing content

| What                                    | Where            |
| --------------------------------------- | ---------------- |
| Title, SEO, socials, contact info       | `/admin/settings`|
| Header menu links                       | `/admin/nav`     |
| Hero copy, CTAs, headshot, stats, words | `/admin/hero`    |
| Bio, philosophy, quick facts, services  | `/admin/about`   |
| Roles + bullet points                   | `/admin/experience` |
| Skills / Certs / Education              | `/admin/skills`  |
| Blog posts (TipTap editor)              | `/admin/blog`    |
| Resume PDF                              | `/admin/resume`  |
| Contact submissions                     | `/admin/messages`|
| Admin email / password / sessions       | `/admin/account` |

## Security

- `middleware.ts` blocks every `/admin/*` route (except `/login` and `/verify-otp`) when no session cookie is present.
- Session cookie is HTTP-only, `Secure` in production, SameSite=Lax.
- OTP codes are bcrypt-hashed with a 10-minute expiry; 3 wrong codes → 30-minute lockout.
- `/admin/*` is served with `X-Robots-Tag: noindex, nofollow` and blocked in `robots.txt`.
