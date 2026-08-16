"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  globalLayoutFor,
  groupContentLayouts,
  publishedContentLayouts,
  type ContentLayoutOption,
} from "@/lib/contentLayoutAssignments";
import ContentLayoutMiniPreview from "@/components/admin/appearance/ContentLayoutMiniPreview";

export default function PostLayoutSelector({
  siteId,
  value,
  onChange,
}: {
  siteId?: number | null;
  value: number | null;
  onChange: (layoutTemplateId: number | null) => void;
}) {
  const [layouts, setLayouts] = useState<ContentLayoutOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!siteId) {
      setLayouts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api.getTemplates()
      .then((raw) => {
        if (!active) return;
        const published = publishedContentLayouts(raw);
        setLayouts(groupContentLayouts(published)["single-post"]);
      })
      .catch((err: any) => {
        if (active) setError(err?.message || "Failed to load post layouts.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [siteId]);

  const siteDefault = useMemo(
    () => globalLayoutFor(layouts, "single-post"),
    [layouts],
  );
  const selectedLayout = layouts.find((layout) => layout.id === value) || null;
  const defaultSelected = value == null || (!loading && value != null && !selectedLayout);

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading published post layouts
      </div>
    );
  }

  return (
    <section className="space-y-5" aria-labelledby="post-layout-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="post-layout-heading" className="text-xl font-bold text-slate-900">
            Post layout
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Use the site-wide Appearance default, or override it for this post only.
          </p>
        </div>
        <Link
          href="/admin/settings/appearance"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Open Appearance
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {value != null && !selectedLayout ? (
        <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          The previous override is no longer published. The site default will be used when you save.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={cn(
            "rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition",
            defaultSelected
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-slate-100 hover:border-slate-300",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </span>
            {defaultSelected ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> : null}
          </div>
          <h3 className="mt-4 font-black text-slate-900">Use site default</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {siteDefault
              ? `Currently ${siteDefault.name} from Appearance.`
              : "Uses the professional CoreHead reading layout until an Appearance default is assigned."}
          </p>
          <ContentLayoutMiniPreview
            blocks={siteDefault?.layoutJson?.blocks}
            selected={defaultSelected}
          />
        </button>

        {layouts.map((layout) => {
          const selected = selectedLayout?.id === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onChange(layout.id)}
              className={cn(
                "rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition",
                selected
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-100 hover:border-slate-300",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <FileText className="h-5 w-5" />
                </span>
                {selected ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> : null}
              </div>
              <h3 className="mt-4 font-black text-slate-900">{layout.name}</h3>
              <p className="mt-1 text-xs text-slate-500">
                Override for this post · {layout.layoutJson?.blocks?.length || 0} blocks
              </p>
              <ContentLayoutMiniPreview
                blocks={layout.layoutJson?.blocks}
                selected={selected}
              />
            </button>
          );
        })}
      </div>

      {layouts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          No published Single Post layouts are available yet. The site default remains active.
        </p>
      ) : null}
    </section>
  );
}
