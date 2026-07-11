import { api, type SiteSummary } from "@/lib/api";
import type { SiteBranding } from "@/lib/siteBranding";

export type PublicSite = SiteSummary & {
  id: number;
  name: string;
  slug: string;
  branding?: SiteBranding | null;
};

/**
 * Resolve a public multi-tenant site by URL slug (T12).
 * Includes Appearance branding when saved for the site (R2-4).
 */
export async function resolvePublicSite(
  siteSlug: string
): Promise<PublicSite | null> {
  if (!siteSlug || !String(siteSlug).trim()) return null;

  try {
    const data = await api.getSiteBySlug(String(siteSlug).trim().toLowerCase());
    if (!data) return null;

    const site = (data as any).site ?? data;
    if (!site?.id || !site?.slug) return null;

    if (site.status && String(site.status).toLowerCase() !== "active") {
      return null;
    }

    return {
      id: site.id,
      name: site.name,
      slug: site.slug,
      status: site.status,
      logo: site.logo ?? null,
      ownerId: site.ownerId,
      branding: site.branding || null,
    };
  } catch (err) {
    console.error("resolvePublicSite failed:", err);
    return null;
  }
}

export function isPublishedPost(post: { status?: string; isPublished?: boolean }) {
  if (post.isPublished === true) return true;
  const status = String(post.status || "").toLowerCase();
  return status === "published";
}

export function siteBlogPath(siteSlug: string) {
  return `/s/${siteSlug}/blog`;
}

export function sitePostPath(siteSlug: string, postSlug: string) {
  return `/s/${siteSlug}/blog/${postSlug}`;
}

export function siteHomePath(siteSlug: string) {
  return `/s/${siteSlug}`;
}
