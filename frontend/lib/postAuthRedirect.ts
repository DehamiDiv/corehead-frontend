import { api, type SiteSummary } from "@/lib/api";
import { getCurrentSiteId, setCurrentSite } from "@/lib/siteStorage";

export type PostAuthUser = {
  id?: number;
  role?: string;
  email?: string;
  name?: string;
};

function normalizeSites(data: any): SiteSummary[] {
  if (Array.isArray(data?.sites)) return data.sites;
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * After login/signup verification: pick redirect based on whether the user has a site.
 * T5 — no sites → onboarding; has sites → admin (or safe callback).
 */
export async function resolvePostAuthDestination(
  user: PostAuthUser,
  callbackUrl?: string | null
): Promise<string> {
  const callback = callbackUrl?.trim() || "";
  const safeCallback =
    callback.startsWith("/") &&
    !callback.startsWith("//") &&
    callback !== "/login" &&
    callback !== "/signup";

  // R1-3: invite accept links must work even when the user has zero sites yet
  if (safeCallback && callback.startsWith("/invite/")) {
    return callback;
  }

  let sites: SiteSummary[] = [];

  try {
    const data = await api.getMySites();
    sites = normalizeSites(data);
  } catch (err) {
    console.error("Failed to load sites after auth:", err);
    // If we cannot list sites, still send them to onboarding rather than a broken admin.
    return "/onboarding/create-site";
  }

  if (sites.length === 0) {
    return "/onboarding/create-site";
  }

  // Ensure a current site is selected for X-Site-Id (T7)
  const savedId = getCurrentSiteId();
  const match =
    sites.find((s) => s.id === savedId) || sites[0];

  if (match) {
    setCurrentSite({
      id: match.id,
      name: match.name,
      slug: match.slug,
      status: match.status,
      logo: match.logo ?? null,
      ownerId: match.ownerId,
    });
  }

  if (safeCallback) {
    if (callback.startsWith("/onboarding")) {
      return "/admin";
    }
    return callback;
  }

  // R1-1: all site operators land on admin dashboard (site-scoped CMS)
  return "/admin";
}
