/**
 * Resolve media/logo URLs for public site shell (T14).
 *
 * - Absolute http(s)/data URLs → unchanged
 * - Frontend public assets under /demo/ → same-origin (Next.js `public/`)
 * - /uploads/* → keep relative so next.config rewrite proxies to the API
 *   (also works as direct API origin fallback when needed)
 */
import { getApiOrigin } from "@/lib/apiOrigin";

export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  const value = String(path).trim();
  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  // Next.js `public/demo/*` or `/logo.png` — same origin
  if (
    value.startsWith("/demo/") ||
    value.startsWith("demo/") ||
    value === "/logo.png" ||
    value === "logo.png"
  ) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  // Prefer relative /uploads so Next rewrite → backend (avoids broken absolute hosts)
  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  const origin = getApiOrigin();
  return `${origin}${value.startsWith("/") ? "" : "/"}${value}`;
}
