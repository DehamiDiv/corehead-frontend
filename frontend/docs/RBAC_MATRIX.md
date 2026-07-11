# RBAC matrix (R1-1 / R1-2)

| Capability | Platform admin | Site operator (author/editor/user who has a site) | Logged out |
|------------|----------------|-----------------------------------------------------|------------|
| Create site | ✅ | ✅ | ❌ |
| My Sites, Posts, Media, Layouts, Builder | ✅ | ✅ | ❌ |
| Team (invite site members) | ✅ | ✅ Owner only (API) | ❌ |
| Custom domain + plan change | ✅ | ✅ Owner only (API) | ❌ |
| Categories, Comments, Pages, Appearance | ✅ | ✅ | ❌ |
| Users (invite platform users) | ✅ | ❌ | ❌ |
| Accept `/invite/{token}` | ✅ | ✅ (email match) | Preview only |
| Data scope | Any site (API admin bypass) | Sites they own / are member of (`X-Site-Id`) | — |
| No sites yet | Onboarding | Onboarding (or invite accept) | Login |

## Enforcement points

| Layer | File | Rule |
|-------|------|------|
| Cookie gate | `middleware.ts` | Token required; only `/admin/users` platform-admin |
| Admin shell | `app/admin/layout.tsx` | `canAccessSiteCms` + `canAccessAdminPath` |
| Sidebar | `components/admin/Sidebar.tsx` | Hide `platformAdminOnly` (Users) |
| Shared helpers | `lib/rbac.ts` | Single source of truth |
| API | Backend `requireSite` | Membership / owner / platform admin |

## Notes

- Platform role `admin` ≠ site role `OWNER` (site role is in `site_members`).
- Self-signup default backend role is often `author` — they still get full **site CMS** after creating a site.
