/**
 * Turn a site name into a URL-safe slug (matches backend slug rules).
 * e.g. "Acme Foods!" → "acme-foods"
 */
export function slugifySiteName(name: string): string {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 100);
}

/** Backend-compatible slug validation */
export function isValidSiteSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 100;
}
