"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe2, Check, Loader2 } from "lucide-react";
import { useOptionalSite } from "@/components/admin/SiteContext";
import { cn } from "@/lib/utils";

export default function SiteSwitcher() {
  const siteCtx = useOptionalSite();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!siteCtx) return null;

  const { sites, currentSite, loading, setSite } = siteCtx;

  if (loading && !currentSite) {
    return (
      <div className="flex items-center gap-2 px-3 h-10 w-full rounded-xl bg-white/80 border border-slate-200/80 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        <span className="truncate">Loading…</span>
      </div>
    );
  }

  if (!currentSite && sites.length === 0) {
    return (
      <a
        href="/onboarding/create-site"
        className="flex items-center gap-2 px-3 h-10 w-full rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-sm"
        title="You need a site before creating posts"
      >
        <Globe2 className="w-4 h-4 shrink-0" />
        <span className="truncate">Create site</span>
      </a>
    );
  }

  return (
    <div className="relative w-full min-w-0" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 h-10 w-full rounded-xl border text-sm font-semibold transition-all",
          "bg-white/90 border-slate-200/80 text-slate-700 hover:bg-white hover:border-blue-200 hover:shadow-sm"
        )}
        title="Switch site"
      >
        <Globe2 className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="truncate flex-1 text-left">
          {currentSite?.name || "Select site"}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-64 min-w-[200px] bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 py-1 z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Your sites
            </p>
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {sites.map((site) => {
              const active = currentSite?.id === site.id;
              return (
                <li key={site.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!active) setSite(site);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{site.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        /s/{site.slug}/blog
                      </p>
                    </div>
                    {active && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-slate-50 p-1 space-y-0.5">
            {currentSite?.slug && (
              <a
                href={`/s/${currentSite.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Open public site ↗
              </a>
            )}
            <a
              href="/admin/sites"
              className="block w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Manage all sites
            </a>
            <a
              href="/onboarding/create-site"
              className="block w-full px-3 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              + Create another site
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
