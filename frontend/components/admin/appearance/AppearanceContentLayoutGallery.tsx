"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LayoutGrid,
  Loader2,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import classification from "../../../../../contracts/template-classification-v1.js";
import {
  groupContentLayouts,
  globalLayoutFor,
  publishedContentLayouts,
  type ContentLayoutKind,
  type ContentLayoutOption,
} from "@/lib/contentLayoutAssignments";
import ContentLayoutMiniPreview from "@/components/admin/appearance/ContentLayoutMiniPreview";

const { layoutKindFromTemplate } = classification;

type LayoutKind = ContentLayoutKind;
type LayoutOption = ContentLayoutOption;

function kindCopy(kind: LayoutKind) {
  return kind === "single-post"
    ? {
        title: "Single post layout",
        description: "Controls article title, cover, metadata, content, and supporting sections.",
        icon: FileText,
      }
    : {
        title: "Blog archive layout",
        description: "Controls the published-post listing on your public journal page.",
        icon: LayoutGrid,
      };
}

export default function AppearanceContentLayoutGallery({
  siteId,
}: {
  siteId?: number | null;
}) {
  const [layouts, setLayouts] = useState<LayoutOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeKind, setActiveKind] = useState<LayoutKind>("single-post");

  const loadLayouts = useCallback(async () => {
    if (!siteId) {
      setLayouts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const raw = await api.getTemplates();
      setLayouts(publishedContentLayouts(raw));
    } catch (err: any) {
      setError(err?.message || "Failed to load published layouts.");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    void loadLayouts();
  }, [loadLayouts]);

  const byKind = useMemo(() => groupContentLayouts(layouts), [layouts]);
  const activeByKind = useMemo(
    () => ({
      "single-post": globalLayoutFor(layouts, "single-post"),
      "blog-archive": globalLayoutFor(layouts, "blog-archive"),
    }),
    [layouts],
  );

  const assignDefault = async (layout: LayoutOption, kind: LayoutKind) => {
    setBusyId(layout.id);
    setError(null);
    setMessage(null);
    try {
      await api.assignTemplate(String(layout.id), { isGlobalDefault: true });
      setLayouts((current) =>
        current.map((candidate) => {
          if (layoutKindFromTemplate(candidate) !== kind) return candidate;
          return {
            ...candidate,
            category:
              candidate.id === layout.id
                ? "global_default"
                : candidate.category === "global_default"
                  ? null
                  : candidate.category,
          };
        }),
      );
      setMessage(`${layout.name} is now the default ${kindCopy(kind).title.toLowerCase()}.`);
    } catch (err: any) {
      setError(err?.message || "Failed to assign the selected layout.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-semibold text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading published layouts
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Content layouts</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Select published manual or AI layouts for the public blog. Layout structure remains
            independent from the active theme and homepage layout.
          </p>
        </div>
        <Link
          href="/admin/layouts"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Manage layouts
        </Link>
      </div>

      {message ? (
        <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      ) : null}

      <div
        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:grid-cols-2"
        role="tablist"
        aria-label="Content layout type"
      >
        {(["single-post", "blog-archive"] as LayoutKind[]).map((kind) => {
          const copy = kindCopy(kind);
          const Icon = copy.icon;
          const selected = activeKind === kind;
          const activeLayout = activeByKind[kind];
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`appearance-${kind}-panel`}
              onClick={() => setActiveKind(kind)}
              className={cn(
                "rounded-xl border px-4 py-4 text-left transition",
                selected
                  ? "border-blue-500 bg-white shadow-sm ring-2 ring-blue-100"
                  : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white/70",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Icon className={cn("h-4 w-4", selected ? "text-blue-600" : "text-slate-400")} />
                {copy.title}
              </span>
              <span className="mt-2 block truncate text-xs font-semibold text-slate-500">
                {activeLayout ? `Active: ${activeLayout.name}` : "No default selected"}
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {byKind[kind].length} published option{byKind[kind].length === 1 ? "" : "s"}
              </span>
            </button>
          );
        })}
      </div>

      {([activeKind] as LayoutKind[]).map((kind) => {
        const copy = kindCopy(kind);
        const Icon = copy.icon;
        const options = byKind[kind];
        return (
          <section
            key={kind}
            id={`appearance-${kind}-panel`}
            role="tabpanel"
            className="space-y-4"
            aria-labelledby={`appearance-${kind}`}
          >
            <div>
              <h4 id={`appearance-${kind}`} className="flex items-center gap-2 font-black text-slate-900">
                <Icon className="h-4 w-4 text-blue-600" /> {copy.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">{copy.description}</p>
            </div>

            {options.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                No published {copy.title.toLowerCase()} is available. Create or promote a layout,
                publish it, and it will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {options.map((layout) => {
                  const selected = layout.category === "global_default";
                  const origin = layout.layoutJson?.metadata?.origin || "manual";
                  const busy = busyId === layout.id;
                  return (
                    <article
                      key={layout.id}
                      className={cn(
                        "rounded-2xl border-2 bg-white p-4 shadow-sm transition",
                        selected
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-slate-100 hover:border-slate-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        {selected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : null}
                      </div>
                      <h5 className="mt-4 font-black text-slate-900">{layout.name}</h5>
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        {origin === "ai" ? <Sparkles className="h-3 w-3 text-violet-500" /> : null}
                        {origin === "ai" ? "AI generated" : "Manual"}
                        <span>•</span>
                        {layout.layoutJson?.blocks?.length || 0} blocks
                      </div>
                      <ContentLayoutMiniPreview
                        blocks={layout.layoutJson?.blocks}
                        selected={selected}
                      />
                      <button
                        type="button"
                        disabled={!siteId || selected || busyId !== null}
                        onClick={() => void assignDefault(layout, kind)}
                        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        {selected ? "Selected" : "Use layout"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <p className="text-xs text-slate-500">
        Advanced global and category-specific assignments remain available in{" "}
        <Link href="/admin/template-assignment" className="font-bold text-blue-600 hover:underline">
          Template Assignment
        </Link>
        .
      </p>
    </div>
  );
}
