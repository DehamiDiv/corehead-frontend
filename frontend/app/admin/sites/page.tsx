"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  Globe2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, type SiteSummary } from "@/lib/api";
import { useSite } from "@/components/admin/SiteContext";
import EmptyState from "@/components/ui/EmptyState";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { siteBlogPath, siteHomePath } from "@/lib/publicSite";

/**
 * T8 — My Sites: list, switch, open public, create another.
 */
export default function MySitesPage() {
  const { sites, currentSite, currentSiteId, loading, error, setSite, refreshSites } =
    useSite();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Ensure list is fresh when landing on this page
    refreshSites().catch(() => {});
  }, [refreshSites]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setActionError(null);
    try {
      await refreshSites();
    } catch (e: any) {
      setActionError(e?.message || "Failed to refresh sites");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSwitch = (site: SiteSummary) => {
    if (site.id === currentSiteId) return;
    setSite(site); // persists + reloads admin for new X-Site-Id
  };

  const handleDelete = useCallback(
    async (site: SiteSummary) => {
      if (
        !confirm(
          `Delete site “${site.name}”? This permanently removes the site and its content (posts, media, etc.).`
        )
      ) {
        return;
      }

      setBusyId(site.id);
      setActionError(null);
      try {
        const wasActive = site.id === currentSiteId;
        await api.deleteSite(site.id);
        const data = await api.getMySites();
        const remaining: SiteSummary[] = Array.isArray(data?.sites)
          ? data.sites
          : Array.isArray(data)
            ? data
            : [];

        if (wasActive) {
          if (remaining.length > 0) {
            setSite(remaining[0]);
            return; // setSite reloads
          }
          if (typeof window !== "undefined") {
            window.location.href = "/onboarding/create-site";
            return;
          }
        }
        await refreshSites();
      } catch (e: any) {
        setActionError(e?.message || "Failed to delete site");
      } finally {
        setBusyId(null);
      }
    },
    [currentSiteId, refreshSites, setSite]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
            Workspaces
          </p>
          <h1 className="admin-title">
            My Sites
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Switch the site you manage, open its public URL, or create another.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="h-11 px-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            Refresh
          </button>
          <Link
            href="/onboarding/create-site"
            className="h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200/50"
          >
            <Plus className="w-4 h-4" />
            Create site
          </Link>
        </div>
      </div>

      {(error || actionError) && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
          {actionError || error}
        </div>
      )}

      {currentSite && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0">
              {currentSite.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Active site
              </p>
              <p className="font-bold text-slate-900 truncate">{currentSite.name}</p>
              <p className="text-xs text-slate-500 truncate">/s/{currentSite.slug}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/posts"
              className="h-10 px-4 inline-flex items-center rounded-xl bg-white border border-blue-100 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Manage posts
            </Link>
            <a
              href={siteHomePath(currentSite.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
            >
              Visit site
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {loading && sites.length === 0 ? (
        <div className="py-24 flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Loading your sites…</p>
        </div>
      ) : sites.length === 0 ? (
        <EmptyState
          icon={Globe2}
          title="No sites yet"
          description="Create a site to start writing posts and publishing a public blog."
          actions={[
            {
              label: "Create your site",
              href: "/onboarding/create-site",
            },
          ]}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sites.map((site) => {
            const active = site.id === currentSiteId;
            const logo = resolveMediaUrl(site.logo);
            const busy = busyId === site.id;

            return (
              <li
                key={site.id}
                className={cn(
                  "rounded-2xl border bg-white p-5 shadow-sm transition-all",
                  active
                    ? "border-blue-200 ring-2 ring-blue-100"
                    : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-3">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shrink-0">
                      {site.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-slate-900 truncate text-lg">
                        {site.name}
                      </h2>
                      {active && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      {site.status && site.status !== "active" && (
                        <span className="text-[11px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          {site.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">
                      /s/{site.slug}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      ID {site.id}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {!active ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleSwitch(site)}
                      className="h-10 px-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Switch to this site
                    </button>
                  ) : (
                    <Link
                      href="/admin/posts"
                      className="h-10 px-3 inline-flex items-center rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
                    >
                      Open dashboard
                    </Link>
                  )}
                  <a
                    href={siteHomePath(site.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Public site
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={siteBlogPath(site.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-3 inline-flex items-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Blog
                  </a>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(site)}
                    className="h-10 px-3 inline-flex items-center gap-1.5 rounded-xl border border-red-100 text-red-600 text-sm font-bold hover:bg-red-50 disabled:opacity-50 ml-auto"
                    title="Delete site"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
