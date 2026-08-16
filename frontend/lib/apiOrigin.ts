/**
 * Shared API / media origin helpers.
 * Prefer env; fall back to local dev defaults only.
 */

const DEV_API = "http://localhost:5000/api";
const DEV_ORIGIN = "http://localhost:5000";

/** Backend API base including `/api` */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return DEV_API;
}

/**
 * Backend host origin (no `/api`).
 * Uses NEXT_PUBLIC_MEDIA_ORIGIN, else strips `/api` from API URL.
 */
export function getApiOrigin(): string {
  const media = process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.trim();
  if (media) return media.replace(/\/$/, "");
  const api = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (api) return api.replace(/\/api\/?$/, "").replace(/\/$/, "") || DEV_ORIGIN;
  return DEV_ORIGIN;
}

/**
 * Resolve relative media/avatar paths for admin UI.
 * Absolute http(s)/data left unchanged (except /uploads → relative);
 * `/demo` stays same-origin.
 */
export function resolveAdminMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  let value = String(path).trim();
  if (!value) return null;

  // blob: only works in the creating tab
  if (value.startsWith("blob:")) return value;

  if (value.startsWith("data:")) return value;

  // Absolute backend upload URLs → relative for Next rewrite
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const u = new URL(value);
      if (u.pathname.includes("/uploads/")) {
        return u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
      }
      return value;
    } catch {
      return value;
    }
  }

  if (value.startsWith("/demo/") || value.startsWith("demo/")) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  // Prefer relative uploads (Next rewrite) when path is under /uploads
  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  const origin = getApiOrigin();
  return `${origin}${value.startsWith("/") ? "" : "/"}${value}`;
}
