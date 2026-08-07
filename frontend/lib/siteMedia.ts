/**
 * Resolve media/logo URLs for public site shell (T14).
 *
 * - Absolute http(s)/data URLs → unchanged (except /uploads → relative)
 * - Frontend public assets under /demo/ → same-origin (Next.js `public/`)
 * - /uploads/* → keep relative so next.config rewrite proxies to the API
 *   (also works as direct API origin fallback when needed)
 */
import { getApiOrigin } from "@/lib/apiOrigin";

/** Platform placeholder logos that must not override a tenant site logo. */
const PLACEHOLDER_LOGO_RE = /seeklogo\.com|corehead-logo-0a288e3e34/i;

/**
 * Pull a URL from common media upload API response shapes.
 */
export function extractUploadedMediaUrl(uploaded: unknown): string | null {
  if (uploaded == null) return null;
  if (typeof uploaded === "string") {
    const s = uploaded.trim();
    return s || null;
  }
  if (typeof uploaded !== "object") return null;
  const obj = uploaded as Record<string, unknown>;
  const media =
    obj.media && typeof obj.media === "object"
      ? (obj.media as Record<string, unknown>)
      : null;
  const raw =
    (typeof media?.url === "string" && media.url) ||
    (typeof obj.url === "string" && obj.url) ||
    (typeof media?.path === "string" && media.path) ||
    (typeof obj.path === "string" && obj.path) ||
    null;
  return raw ? String(raw).trim() || null : null;
}

/**
 * Normalize stored media paths so the browser can load them.
 * - blob: URLs are session-only previews → treat as missing for public use
 * - absolute http(s) that point at /uploads/* → relative path (Next rewrite)
 */
export function normalizeMediaPath(path?: string | null): string | null {
  if (!path) return null;
  const value = String(path).trim();
  if (!value) return null;

  // Object URLs only work in the tab that created them — never use on public site
  if (value.startsWith("blob:")) return null;

  if (value.startsWith("data:")) return value;

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

  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  // Bare upload filename sometimes stored without folder
  if (/^\d+-\d+-/.test(value) || value.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
    if (!value.includes("/") && !value.startsWith("demo")) {
      // ambiguous — leave as-is; resolveMediaUrl will prefix API origin
      return value;
    }
  }

  return value;
}

/** True if this is a platform placeholder, not a real tenant logo. */
export function isPlaceholderLogo(path?: string | null): boolean {
  if (!path) return true;
  const value = String(path).trim();
  if (!value || value.startsWith("blob:")) return true;
  return PLACEHOLDER_LOGO_RE.test(value);
}

/** Prefer a real logo URL; skip placeholders and empty values. */
export function usableLogoUrl(path?: string | null): string | null {
  if (isPlaceholderLogo(path)) return null;
  return normalizeMediaPath(path);
}

export function resolveMediaUrl(path?: string | null): string | null {
  const value = normalizeMediaPath(path);
  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  // Next.js `public/demo/*` — same origin
  if (value.startsWith("/demo/") || value.startsWith("demo/")) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  // Prefer relative /uploads so Next rewrite → backend (avoids broken absolute hosts)
  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  const origin = getApiOrigin();
  return `${origin}${value.startsWith("/") ? "" : "/"}${value}`;
}
