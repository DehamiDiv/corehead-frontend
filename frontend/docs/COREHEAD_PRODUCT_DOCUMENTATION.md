# CoreHead — Product & Feature Documentation

**Version:** Multi-tenant MVP (as implemented)  
**Audience:** Developers, product owners, demos, examiners  
**Stack:** Next.js frontend + Express/Prisma backend + PostgreSQL  

This document explains **what CoreHead is**, **what the platform does**, and **every major feature** available in the current codebase.

---

## 1. What is CoreHead?

**CoreHead** is an **AI-assisted blog / CMS platform** where:

1. A **user (e.g. company owner)** creates an account.
2. They create **their own site (workspace)**.
3. They manage **posts, media, categories**, etc. in an **admin dashboard**.
4. They **publish** content.
5. **Readers** view that content on a **public branded site** at `/s/{site-slug}`.

### In one sentence

> CoreHead lets each company own a separate website workspace: create posts, publish them, and show them on a public site — all from one shared product.

### What it is *not* (yet)

| Not yet | Notes |
|---------|--------|
| Fully separate admin URL per company | One shared `/admin`, scoped by **active site** |
| Custom domains (`www.acme.com`) | **R6 MVP** — store + verify domain; host rewrite to `/s/{slug}` (Premium+) |
| Full WordPress multi-theme on public | Default public shell (T14); Appearance themes mostly admin-side |
| Team invites UI | **Done (R1-3)** — `/admin/team` + `/invite/{token}` |

---

## 2. High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  • Marketing site (/, /pricing, /guides, …)                  │
│  • Auth (login, signup, verify)                              │
│  • Admin (/admin/…) — JWT + current site (X-Site-Id)         │
│  • Public tenant sites (/s/{slug}/…)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP JSON API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CoreHead-Backend (Express, port 5000)                       │
│  • Auth (JWT access + refresh)                               │
│  • Sites API                                                 │
│  • Posts, media, categories, settings, templates, comments   │
│  • Site middleware (membership + X-Site-Id)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL (Prisma)                                         │
│  • users, sites, site_members                                │
│  • posts, media, categories, settings, templates, …          │
│  • Content rows carry siteId for isolation                   │
└─────────────────────────────────────────────────────────────┘
```

### Key repos / folders

| Path | Role |
|------|------|
| `corehead-frontend/frontend` | Next.js app (this project) |
| `CoreHead-Backend` | Express API + Prisma |
| `lib/api.ts` | Frontend API client (+ `X-Site-Id`) |
| `lib/siteStorage.ts` | Active site in `localStorage` |
| `app/admin/*` | Admin dashboard pages |
| `app/s/[siteSlug]/*` | Public multi-tenant site |
| `app/onboarding/create-site` | Create-site wizard |

---

## 3. Core concept: Site (workspace)

A **Site** is the unit of multi-tenancy.

| Field | Meaning |
|-------|---------|
| `name` | Display name (e.g. “Acme Foods”) |
| `slug` | Unique public path key (e.g. `acme-foods`) |
| `ownerId` | User who owns the site |
| `status` | Usually `active` |
| `logo` | Optional branding image |

**Public URL pattern:**

| Page | URL |
|------|-----|
| Home | `/s/{slug}` |
| Blog list | `/s/{slug}/blog` |
| Single post | `/s/{slug}/blog/{postSlug}` |

**Admin:** always `/admin/...`, but API calls send:

```http
Authorization: Bearer <accessToken>
X-Site-Id: <currentSiteId>
```

So **posts/media/settings of Site A never mix with Site B** when the header is set correctly.

---

## 4. End-to-end user journeys

### 4.1 Company owner — first time

```
Signup → Verify email → Login
  → (no sites) Create Site wizard
  → Admin dashboard (site active)
  → Create post → Draft or Publish
  → Public: /s/{slug}/blog
```

### 4.2 Returning owner

```
Login → has sites → Admin
  → Site switcher / My Sites
  → Manage posts for active site
  → Visit public site
```

### 4.3 Reader (public)

```
Open /s/acme-foods
  → Branded home (site name + logo + latest posts)
  → Blog list (Published only)
  → Single post
```

**Draft / Unpublished posts are never shown publicly.**

---

## 5. Feature catalog (what the product does)

### 5.1 Marketing / landing (platform brand)

| Route | Purpose |
|-------|---------|
| `/` | CoreHead marketing home (Hero, features, etc.) |
| `/pricing` | Pricing page |
| `/guides` | Guides |
| `/blog` | **Platform** blog (legacy/global path — not the same as tenant `/s/.../blog`) |

These pages sell **CoreHead the product**.  
Company content lives under **`/s/{slug}`**, not the main marketing blog.

---

### 5.2 Authentication

| Route | Feature |
|-------|---------|
| `/signup` | Register (name, email, password rules) |
| `/verify-email` | OTP email verification |
| `/login` | Login; stores tokens + cookies; **routes by sites** (T5) |
| `/forgot-password` | Request reset |
| `/reset-password` | Set new password |

**After login:**

- **0 sites** → `/onboarding/create-site`
- **Has sites** → `/admin` (admin role) or `/admin/builder` (author-style roles)

**Tokens:**

- `localStorage`: `accessToken`, `refreshToken`, `user`
- Cookies: `auth_token`, `user_role` (for Next middleware)
- Auto-refresh on 401 in `lib/api.ts`

**Protected by middleware:** `/admin`, `/onboarding`, `/builder`, `/ai-prompt`, …

---

### 5.3 Onboarding — Create Site (T6)

**Route:** `/onboarding/create-site`

| Field | Behavior |
|-------|----------|
| Site name | Required |
| Slug | Auto from name; editable; lowercase + hyphens |
| Preview | Shows `/s/{slug}` |

**On success:**

- Site created via `POST /api/sites`
- Owner `SiteMember` with role `OWNER`
- `currentSiteId` saved
- Redirect to admin

**Without a site, admin content APIs cannot work** (require `X-Site-Id`).

---

### 5.4 Admin dashboard (shared shell, site-scoped data)

**Base:** `/admin`  
**Layout:** sidebar + header (except pure dashboard/builder chrome variants)

#### Site context (T7)

| Piece | Role |
|-------|------|
| `SiteProvider` | Loads `GET /api/sites`, sets current site |
| Site switcher (header) | Switch active site (reload) |
| **Visit site** | Opens public `/s/{slug}` |
| `lib/api.ts` | Attaches `X-Site-Id` on content APIs |

#### My Sites (T8)

**Route:** `/admin/sites`

| Action | What it does |
|--------|----------------|
| List sites | All sites you own/belong to |
| Active banner | Current workspace highlight |
| Switch | Make site active (admin data switches) |
| Public site / Blog | Open reader URLs |
| Create site | Go to wizard |
| Delete site | Cascade-related content; switch or re-onboard |

#### Posts (CMS core + T11)

| Route | Feature |
|-------|---------|
| `/admin/posts` | List, filter, publish/unpublish, delete |
| `/admin/posts/create` | Create post — **Save as Draft** or **Publish** |
| `/admin/posts/edit/[id]` | Edit, Publish/Unpublish, Save & Publish |

**Statuses:**

| Status | Public? |
|--------|---------|
| `Draft` | No |
| `Unpublished` | No |
| `Published` | Yes |

**Empty state (T16):** “Create your first post” with CTA.

#### Categories

**Route:** `/admin/categories`  
CRUD for categories **per site** (name, slug, description).  
Used when organizing posts.

#### Media library

**Route:** `/admin/media`  
Upload, library, trash/restore/permanent delete — **scoped to current site**.

#### Comments / Interactions

**Route:** `/admin/comments`  
Moderate comments on posts of the **current site** only.

#### Users (platform admin)

**Route:** `/admin/users`  
Invite/manage **platform** users (super-admin only).

#### Team (per site) — R1-3

| Route | Feature |
|-------|---------|
| `/admin/team` | List members, invite by email (EDITOR/AUTHOR), pending invites, revoke, role change, remove |
| `/invite/{token}` | Accept invite (login/signup with invited email) |

- Existing CoreHead users are **added immediately** as `SiteMember`
- Unknown emails get a **pending invite** + shareable link (14-day expiry)
- Site **OWNER** (or platform admin) can manage; cannot remove/change the site owner

#### Pages (custom HTML, site-scoped — R3-1)

**Admin:** `/admin/pages`  
**Public:** `/s/{siteSlug}/p/{pageSlug}` (Published only)  
Static page management (legacy areas may be less multi-tenant complete than posts).

#### Layouts & templates

| Route | Feature |
|-------|---------|
| `/admin/layouts` | List/create/edit template layouts (JSON / publish) |
| `/admin/layouts/new` | Create layout (schema editor) |
| `/admin/layouts/[id]/edit` | Edit layout JSON |
| `/admin/blog-templates` | Blog template management |
| `/admin/template-assignment` | Assign templates (global/category) |

Layouts define **page structure as JSON blocks** (Heading, Image, Collection List, …).  
**Note:** Full live apply of every template to public tenant pages is still partial; public tenant pages use a **default shell + post list/detail**.

#### Visual Builder (canonical)

| Route | Feature |
|-------|---------|
| `/admin/builder` | **Canonical** visual block builder (canvas, toolbox, AI chat) |
| `/admin/builder/preview` | Live preview via `PublicPageRenderer` + current site posts |
| `/admin/builder/draft` | Draft-save confirmation (real template meta) |
| `/admin/builder/publish` | Publish confirmation + public site URL |
| `/admin/builder/settings` | Builder settings |
| `/admin/builder/taxonomy` | Taxonomy-related builder UI |
| `/builder` | **Deprecated** — redirects to `/admin/builder` (R4-1) |

**Save flow (R4-2):** Save → backend template (`draft` / `published`) → success page.  
**Preview:** reads canvas from `localStorage`, binds site posts (`getPreviewPosts` + `X-Site-Id`), same renderer as public `/s/{slug}` pages.

#### Binding

**Route:** `/admin/binding`  
Map CMS fields (e.g. `post.title`) into layout blocks for dynamic rendering.

#### Settings

| Route | Feature |
|-------|---------|
| `/admin/settings` | Settings hub |
| `/admin/settings/appearance` | Themes, header/footer/colors/fonts (stored as settings keys) |
| `/admin/settings/website` | Website settings |
| `/admin/settings/profile` | Profile |
| `/admin/settings/domain` | **R6** custom domain (Premium+): save, DNS TXT, verify |
| `/admin/settings/billing` | **R6** plan Free / Premium / Enterprise (demo, no Stripe) |

**Appearance (R2-4 — live on public):**  
- Admin **Settings → Appearance** saves `active_theme` + per-theme colours/header/footer/font (site-scoped).  
- Activating a theme **seeds presets** so public updates even before manual colour save.  
- Public `/s/{slug}` shell merges DB settings with **theme presets**, applies CSS variables, Google fonts, and theme-aware home layouts (`classic` / `dark` / `magazine` / `minimal` / `nature`).

**Custom domain (R6):** verified domains resolve via `GET /api/sites/by-domain/:host`; Next.js middleware rewrites that host to `/s/{slug}`.

#### Other admin utilities

| Route | Feature |
|-------|---------|
| `/admin/snippets` | Snippets manager |
| `/admin/resolver-test` | Resolver testing |
| `/admin/blogs` | Rewrite alias → posts |

---

### 5.5 AI features

| Route | Feature |
|-------|---------|
| `/ai-prompt` | AI layout / content generation entry |
| `/ai-templates` | AI templates UI |
| `/ai-options` | Options |
| `/ai-history` | Generation history |

Also: AI generate inside builder / modals (`generateLayout` API).  
Requires auth; site header attached when available.

---

### 5.6 Public tenant site (T12–T14)

**Not** CoreHead marketing chrome — **tenant branding**.

| Feature | Description |
|---------|-------------|
| Shell | Header (logo/name, Home, Blog) + Footer |
| Home `/s/{slug}` | Hero + site identity + recent published posts |
| Blog list | Grid of published posts for that site only |
| Single post | Full content; drafts 404 |
| 404 | Unknown slug / inactive site |

**Isolation rules:**

- Site resolved by public slug API (`/api/sites/by-slug/:slug`)
- Posts fetched with `siteId`
- Only `Published` posts

---

### 5.7 Auth / security (T4 + T15)

| Rule | Behavior |
|------|----------|
| Admin content APIs | JWT **and** `X-Site-Id` |
| Wrong site membership | **403** |
| No token | **401** |
| Preview/list posts without siteId | **400** (no cross-tenant dump) |
| Public post slug without siteId | **400** |
| Draft public slug | **404** |
| Comments admin | Site-scoped via post.siteId |
| Inactive site | Not manageable / not public |

---

## 6. What happens when you use “the site” — product meaning

When we say **“this site”** after create:

| Layer | Meaning |
|-------|---------|
| **Database** | A `sites` row + you as `OWNER` member |
| **Admin** | All CMS data you create is tagged with that `siteId` |
| **API** | Requests include `X-Site-Id` so backend filters |
| **Public** | Readers open `/s/{slug}`; only that site’s published content |
| **Switch site** | You change workspace; same UI, different dataset |

So CoreHead is a **multi-tenant CMS**: one product, many company websites.

---

## 7. Data isolation model

```
User
 └── owns Site A ── posts, media, categories, settings, templates (siteId=A)
 └── owns Site B ── posts, media, ... (siteId=B)

Public /s/A  → only A published posts
Public /s/B  → only B published posts
```

**Cascade:** deleting a site removes related site-scoped content (DB relations with `onDelete: Cascade` where defined).

---

## 8. Important URLs cheat sheet

### Platform

| URL | Purpose |
|-----|---------|
| `/` | Marketing home |
| `/signup` `/login` | Auth |
| `/onboarding/create-site` | New site wizard |
| `/admin` | Admin home |
| `/admin/sites` | My Sites |
| `/admin/posts` | Posts CMS |
| `/admin/media` | Media |
| `/admin/builder` | Visual builder |
| `/admin/settings/*` | Settings |

### Tenant public

| URL | Purpose |
|-----|---------|
| `/s/{slug}` | Tenant home |
| `/s/{slug}/blog` | Tenant blog |
| `/s/{slug}/blog/{postSlug}` | Tenant article |

### Backend API (default)

`http://localhost:5000/api`

| Area | Examples |
|------|----------|
| Auth | `/auth/login`, `/auth/register`, … |
| Sites | `GET/POST /sites`, `GET /sites/by-slug/:slug` |
| Posts | `/posts`, `/posts/:id/publish`, `/posts/slug/:slug?siteId=` |
| Preview | `/preview/posts?siteId=` |
| Media, categories, settings, templates, comments | under `/api/...` |

---

## 9. Roles (simplified)

| Role | Typical access |
|------|----------------|
| **Platform admin** | Full admin UI; can use any site context if admin bypass applies |
| **Site OWNER** | Full control of their site content |
| **Site EDITOR / AUTHOR** (membership) | Content access on that site (API supports roles) |
| **Self-registered user** | After verify → create site → use admin for their site |
| **Public reader** | No login; public `/s/...` only |

Frontend also restricts some sidebar items as `adminOnly` (platform admin role string).

---

## 10. Layout vs Appearance vs Public shell

| Feature | What it controls | Live on public tenant site? |
|---------|------------------|-----------------------------|
| **Layouts / Builder** | Block structure of pages (JSON) | Public uses resolved templates + PublicPageRenderer on blog; home has themed shell |
| **Appearance settings** | Themes, header/footer colors, fonts | **Live on public** via presets + CSS vars (R2-4) |
| **Custom pages** | HTML pages per site | **Done (R3-1)** `/s/{slug}/p/{page}` |
| **Public shell (T14)** | Default header/footer + home/blog | **Yes** — name, logo, navigation |

---

## 11. Empty states (T16)

| Situation | UX |
|-----------|-----|
| No sites | Force / guide to create-site wizard |
| No posts | “Create your first post” CTA |
| No categories / media / comments | Friendly empty + action |
| No published posts (public) | “Check back soon” messaging |

---

## 12. How to run a full demo

### Prerequisites

1. PostgreSQL with backend `.env` `DATABASE_URL`
2. Backend: `cd CoreHead-Backend && node src/server.js` → `:5000`
3. Frontend: `cd frontend && npm run dev` → `:3000`

### Demo script

1. Open `/signup` → register → verify OTP  
2. Login → create site **“Demo Co”** / `demo-co`  
3. Admin → **Posts** → **Create** → write content → **Publish**  
4. **Visit site** or open `/s/demo-co/blog`  
5. Confirm post visible  
6. **Unpublish** → confirm disappears from public  
7. **My Sites** → create second site → switch → posts list empty/different  

---

## 13. Implementation ticket map (MVP)

| Ticket | Topic | Status |
|--------|--------|--------|
| T1 | Site + SiteMember DB | Done |
| T2 | siteId on content | Done |
| T3 | Site APIs | Done |
| T4 | X-Site-Id + membership | Done |
| T5 | Post-login routing | Done |
| T6 | Create site wizard | Done |
| T7 | Frontend site context | Done |
| T8 | My Sites page | Done |
| T11 | Publish / unpublish | Done |
| T12–T14 | Public site + shell | Done |
| T15 | Auth audit | Done |
| T16 | Empty states | Done |

**Roadmap leftovers:** real Stripe checkout; full per-theme HTML page templates (beyond shell + home variants).

| Ticket | Topic | Status |
|--------|--------|--------|
| R1-3 | Team invites | Done |
| R3-1 | Site-scoped Pages | **Done** — `/admin/pages` + public `/s/{slug}/p/{page}` |
| R4 | Builder unify + draft/preview/publish | Done |
| R2-4 | Appearance → public themes | Done |
| R6 | Domain + billing | Done (+ live DNS TXT + force demo) |

**Builder (R4):** canonical `/admin/builder`; legacy `/builder` redirects; draft/preview/publish wired to real template save + public renderer.

**Team (R1-3):** per-site invites via `SiteInvite` + `SiteMember`; admin Team page; accept at `/invite/{token}`.

**Domain & billing (R6):** site `plan` (free/premium/enterprise), custom domain (Premium+), live DNS TXT verify + force-demo, middleware host rewrite.

**Pages (R3-1):** `Page` model with `siteId`; auth + `X-Site-Id`; public published pages at `/s/{site}/p/{slug}`.

---

## 14. Glossary

| Term | Meaning |
|------|---------|
| **Platform** | CoreHead product (marketing + shared admin app) |
| **Site / Tenant** | One company workspace |
| **Slug** | URL key for a site or post |
| **Publish** | Make post visible on public site |
| **Draft** | Saved but not public |
| **X-Site-Id** | Header selecting which site an admin API call targets |
| **Public shell** | Default branded header/footer for `/s/{slug}` |

---

## 15. Summary — “මේ site එකෙන් වෙන්නේ මොකද්ද?”

**CoreHead** එකෙන්:

1. **ගිණුමක්** හදාගන්නවා  
2. **තමන්ගේ website workspace (Site)** එකක් හදනවා  
3. **Admin** එකෙන් posts, media, categories, builder, settings manage කරනවා  
4. **Publish** කරලා content **public** කරනවා  
5. Readers **`/s/your-slug`** එකෙන් ඒ company එකේ blog බලනවා  
6. **වෙන site** එකක content **මිශ්‍ර වෙන්නේ නැහැ**

ඒක **company owner කෙනෙක්ට own site + blog + publish** කරන්න ඉඩ දෙන **multi-tenant CMS / blog builder** එකකි.

---

*Document generated from the implemented multi-tenant MVP. For API security details see backend `docs/T15_AUTH_AUDIT.md`.*
