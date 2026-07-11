/**
 * R1-1 / R1-2 — Single source of truth for admin UI access.
 *
 * Platform admin  → everything including Users
 * Site operator   → any logged-in user who manages content
 *                 → full site CMS (posts, media, categories, appearance, …)
 *                 → NOT platform Users management
 *
 * Site membership is enforced by SiteProvider + API X-Site-Id (not only role string).
 */

export type AppUserLike = {
  role?: string | null;
  id?: number | string;
  email?: string;
};

export function normalizeRole(role?: string | null): string {
  return String(role || "").trim().toLowerCase();
}

/** CoreHead platform super-user (not the same as site OWNER). */
export function isPlatformAdmin(role?: string | null): boolean {
  const r = normalizeRole(role);
  return r === "admin" || r === "administrator";
}

/**
 * Roles that may enter the admin shell and use site CMS tools
 * once they have (or create) a site.
 */
export function canAccessSiteCms(role?: string | null): boolean {
  if (isPlatformAdmin(role)) return true;
  const r = normalizeRole(role);
  return (
    r === "author" ||
    r === "editor" ||
    r === "user" ||
    r === "owner" ||
    r === "" // unknown/empty role after signup edge cases
  );
}

/** Platform-only admin paths (not site-owner CMS). */
export const PLATFORM_ADMIN_ONLY_PATHS = ["/admin/users"] as const;

export function isPlatformAdminOnlyPath(pathname: string): boolean {
  return PLATFORM_ADMIN_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

/**
 * Can this user open this admin path in the UI?
 * (API still enforces site membership separately.)
 */
export function canAccessAdminPath(
  pathname: string,
  role?: string | null
): boolean {
  if (!canAccessSiteCms(role)) return false;
  if (isPlatformAdminOnlyPath(pathname)) {
    return isPlatformAdmin(role);
  }
  return true;
}
