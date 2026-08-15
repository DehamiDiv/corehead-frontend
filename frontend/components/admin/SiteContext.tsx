"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type SiteSummary } from "@/lib/api";
import {
  getCurrentSite,
  getCurrentSiteId,
  notifySiteChanged,
  setCurrentSite,
  type StoredSite,
} from "@/lib/siteStorage";

type SiteContextValue = {
  sites: SiteSummary[];
  currentSite: StoredSite | null;
  currentSiteId: number | null;
  loading: boolean;
  error: string | null;
  accessDeniedSite: boolean;
  accessDeniedSiteSlug: string | null;
  setSite: (site: SiteSummary | StoredSite) => void;
  refreshSites: () => Promise<void>;
};

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

function toStored(site: SiteSummary | StoredSite): StoredSite {
  return {
    id: site.id,
    name: site.name,
    slug: site.slug,
    status: site.status,
    logo: site.logo ?? null,
    ownerId: "ownerId" in site ? site.ownerId : undefined,
  };
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<SiteSummary[]>([]);
  const [currentSite, setCurrentSiteState] = useState<StoredSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDeniedSite, setAccessDeniedSite] = useState(false);
  const [accessDeniedSiteSlug, setAccessDeniedSiteSlug] = useState<string | null>(null);

  const refreshSites = useCallback(async () => {
    setError(null);
    try {
      const data = await api.getMySites();
      const list: SiteSummary[] = Array.isArray(data?.sites)
        ? data.sites
        : Array.isArray(data)
          ? data
          : [];

      setSites(list);

      // Prefer ?site=slug or ?siteId= from public "Dashboard" link (tenant-scoped)
      let queryMatch: SiteSummary | undefined;
      let requestedSite = false;
      let requestedSiteSlug: string | null = null;
      if (typeof window !== "undefined") {
        const qs = new URLSearchParams(window.location.search);
        const siteSlug = qs.get("site") || qs.get("siteSlug");
        const siteIdRaw = qs.get("siteId");
        if (siteSlug) {
          requestedSite = true;
          requestedSiteSlug = siteSlug;
          queryMatch = list.find(
            (s) => s.slug.toLowerCase() === siteSlug.toLowerCase()
          );
        } else if (siteIdRaw) {
          requestedSite = true;
          const sid = parseInt(siteIdRaw, 10);
          if (Number.isFinite(sid)) {
            queryMatch = list.find((s) => s.id === sid);
          }
        }
      }

      // An explicit tenant deep link is a security boundary. Never silently
      // replace an unauthorized target with the user's first available site.
      if (requestedSite && !queryMatch) {
        setAccessDeniedSite(true);
        setAccessDeniedSiteSlug(requestedSiteSlug);
        setCurrentSite(null);
        setCurrentSiteState(null);
        return;
      }

      setAccessDeniedSite(false);
      setAccessDeniedSiteSlug(null);

      const savedId = getCurrentSiteId();
      const saved = getCurrentSite();
      const match =
        queryMatch ||
        list.find((s) => s.id === savedId) ||
        (saved ? list.find((s) => s.id === saved.id) : undefined) ||
        list[0] ||
        null;

      if (match) {
        const stored = toStored(match);
        setCurrentSite(stored);
        setCurrentSiteState(stored);
        // Clean query so refresh doesn't re-fight switcher
        if (queryMatch && typeof window !== "undefined") {
          const url = new URL(window.location.href);
          if (url.searchParams.has("site") || url.searchParams.has("siteId") || url.searchParams.has("siteSlug")) {
            url.searchParams.delete("site");
            url.searchParams.delete("siteId");
            url.searchParams.delete("siteSlug");
            window.history.replaceState({}, "", url.pathname + url.search + url.hash);
          }
        }
      } else {
        setCurrentSite(null);
        setCurrentSiteState(null);
      }
    } catch (err: any) {
      console.error("Failed to load sites:", err);
      setError(err?.message || "Failed to load sites");
      // Fall back to whatever is in localStorage so headers still work mid-session
      setCurrentSiteState(getCurrentSite());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      setLoading(false);
      return;
    }
    // Hydrate from storage immediately for first API calls
    setCurrentSiteState(getCurrentSite());
    refreshSites();
  }, [refreshSites]);

  const setSite = useCallback((site: SiteSummary | StoredSite) => {
    const stored = toStored(site);
    setCurrentSite(stored);
    setCurrentSiteState(stored);
    notifySiteChanged(stored);
    // Ensure lists/pages refetch with the new X-Site-Id
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      sites,
      currentSite,
      currentSiteId: currentSite?.id ?? null,
      loading,
      error,
      accessDeniedSite,
      accessDeniedSiteSlug,
      setSite,
      refreshSites,
    }),
    [sites, currentSite, loading, error, accessDeniedSite, accessDeniedSiteSlug, setSite, refreshSites]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return ctx;
}

/** Safe hook when provider may be missing (e.g. public pages). */
export function useOptionalSite() {
  return useContext(SiteContext);
}
