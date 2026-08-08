/**
 * Client-side storage for multi-tenant site context (T7).
 * Used by API client (headers) and SiteProvider (UI).
 */

export const SITE_STORAGE_KEYS = {
  currentSiteId: "currentSiteId",
  currentSite: "currentSite",
} as const;

export type StoredSite = {
  id: number;
  name: string;
  slug: string;
  status?: string;
  logo?: string | null;
  ownerId?: number;
};

const isBrowser = () => typeof window !== "undefined";

export function getCurrentSiteId(): number | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(SITE_STORAGE_KEYS.currentSiteId);
  if (!raw) return null;
  const id = parseInt(raw, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function getCurrentSite(): StoredSite | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(SITE_STORAGE_KEYS.currentSite);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSite;
    if (parsed && typeof parsed.id === "number") return parsed;
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export function setCurrentSite(site: StoredSite | null): void {
  if (!isBrowser()) return;
  if (!site) {
    localStorage.removeItem(SITE_STORAGE_KEYS.currentSiteId);
    localStorage.removeItem(SITE_STORAGE_KEYS.currentSite);
    return;
  }
  localStorage.setItem(SITE_STORAGE_KEYS.currentSiteId, String(site.id));
  localStorage.setItem(
    SITE_STORAGE_KEYS.currentSite,
    JSON.stringify({
      id: site.id,
      name: site.name,
      slug: site.slug,
      status: site.status,
      logo: site.logo ?? null,
      ownerId: site.ownerId,
    })
  );
}

export function clearCurrentSite(): void {
  setCurrentSite(null);
}

/** Headers for site-scoped API calls */
export function getSiteHeader(): Record<string, string> {
  const siteId = getCurrentSiteId();
  return siteId ? { "X-Site-Id": String(siteId) } : {};
}

export const SITE_CHANGED_EVENT = "corehead:site-changed";

export function notifySiteChanged(site: StoredSite | null): void {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent(SITE_CHANGED_EVENT, { detail: site })
  );
}
