"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, LayoutTemplate, Loader2, Pencil, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import ContentLayoutMiniPreview from "@/components/admin/appearance/ContentLayoutMiniPreview";
import classification from "../../../contracts/template-classification-v1.js";
import {
  HOME_LAYOUT_OPTIONS,
  getHomeLayoutPalette,
} from "@/lib/themePresets";
import type { HomeStyle } from "@/lib/appearanceModel";

type Props = {
  activeLayout: HomeStyle;
  siteId?: number | null;
  disabled?: boolean;
  onSelect: (layout: (typeof HOME_LAYOUT_OPTIONS)[number]) => void | Promise<void>;
  onEdit: (layoutId: HomeStyle) => void;
};

type CustomHomeLayout = {
  id: number;
  name: string;
  type: string;
  status: string;
  category?: string | null;
  layoutJson?: { kind?: string; blocks?: any[]; metadata?: { origin?: string } };
};

const { isPublishedTemplate, layoutKindFromTemplate } = classification;

function LayoutPreview({
  id,
  palette,
}: {
  id: HomeStyle;
  palette: ReturnType<typeof getHomeLayoutPalette>;
}) {
  const { colours, header, footer } = palette;
  const block = { background: colours.card };

  if (id === "nature") {
    return <><div className="h-5" style={{ background: header.headerBg }} /><div className="m-2 flex flex-1 flex-col rounded-lg p-2" style={{ background: colours.primary }}><span className="mx-auto mb-1 h-2 w-2/3 rounded bg-white/70" /><span className="flex-1 rounded bg-white/35" /></div><div className="h-3" style={{ background: footer.footerBg }} /></>;
  }
  if (id === "bloom") {
    return <><div className="h-5" style={{ background: header.headerBg }} /><div className="grid flex-1 grid-cols-2 gap-2 p-2"><div className="space-y-1.5 pt-2"><span className="block h-2 w-1/2 rounded-full" style={{ background: colours.accent }} /><span className="block h-3 w-full rounded" style={{ background: colours.primary }} /><span className="block h-2 w-4/5 rounded bg-black/10" /></div><span className="rounded-[45%]" style={{ background: colours.primary }} /></div><div className="mx-2 mb-2 grid grid-cols-3 gap-1">{[0,1,2].map(i => <span key={i} className="h-4 rounded-full" style={block} />)}</div></>;
  }
  if (id === "portals") {
    return <><div className="h-5 bg-black" /><div className="grid flex-1 grid-cols-2 gap-2 bg-black p-3"><div className="space-y-2"><span className="block h-2 w-1/2 rounded bg-white/30" /><span className="block h-4 w-full rounded bg-white/80" /><span className="block h-2 w-4/5 rounded bg-white/20" /><span className="block h-3 w-1/2 rounded-full" style={{ background: colours.primary }} /></div><div className="m-auto h-12 w-12 rounded-full border-4" style={{ borderColor: colours.primary, boxShadow: `0 0 16px ${colours.primary}` }} /></div><div className="h-3 bg-black" /></>;
  }
  if (id === "bento") {
    return <><div className="h-5" style={{ background: header.headerBg }} /><div className="grid flex-1 grid-cols-4 grid-rows-2 gap-1.5 p-2"><span className="col-span-2 row-span-2 rounded-lg" style={{ background: colours.primary }} /><span className="row-span-2 rounded-lg" style={block} /><span className="rounded-lg" style={{ background: colours.accent }} /><span className="rounded-lg" style={block} /></div><div className="h-3" style={{ background: footer.footerBg }} /></>;
  }
  if (id === "studio") {
    return <><div className="relative flex flex-1 items-end p-3" style={{ background: `linear-gradient(145deg, ${colours.primary}, ${colours.foreground})` }}><div className="w-2/3 space-y-1.5"><span className="block h-2 w-1/2 bg-white/50" /><span className="block h-4 w-full bg-white/90" /></div></div><div className="grid h-7 grid-cols-3 gap-1 bg-black p-1"><span className="bg-white/40" /><span className="bg-white/20" /><span className="bg-white/50" /></div></>;
  }
  if (id === "paper") {
    return <><div className="px-2 pt-2 text-center"><span className="mx-auto block h-3 w-3/4 border-y" style={{ borderColor: colours.foreground }} /></div><div className="grid flex-1 grid-cols-3 gap-2 p-2"><span className="col-span-2 rounded-sm" style={{ background: colours.primary }} /><div className="space-y-1">{[0,1,2,3,4].map(i => <span key={i} className="block h-1 bg-black/20" />)}</div></div><div className="h-3" style={{ background: footer.footerBg }} /></>;
  }
  if (id === "glass") {
    return <><div className="relative flex flex-1 items-center justify-center overflow-hidden p-3"><span className="absolute -right-2 -top-2 h-12 w-12 rounded-full opacity-50" style={{ background: colours.accent }} /><div className="relative w-3/4 rounded-xl border border-white/70 bg-white/55 p-3 shadow-md backdrop-blur"><span className="mx-auto block h-3 w-3/4 rounded" style={{ background: colours.primary }} /><span className="mx-auto mt-2 block h-2 w-full rounded bg-black/10" /><span className="mx-auto mt-2 block h-3 w-1/2 rounded-full" style={{ background: colours.accent }} /></div></div><div className="h-3" style={{ background: footer.footerBg }} /></>;
  }

  return <><div className="h-5" style={{ background: header.headerBg }} /><div className="grid flex-1 grid-cols-3 gap-2 p-2"><div className="col-span-2 flex flex-col justify-end rounded-lg p-2" style={{ background: colours.primary }}><span className="h-2 w-2/3 rounded bg-white/70" /></div><div className="flex flex-col gap-1.5"><span className="flex-1 rounded" style={block} /><span className="flex-1 rounded" style={{ background: colours.accent }} /></div></div><div className="h-3" style={{ background: footer.footerBg }} /></>;
}

export default function AppearanceHomeLayoutGallery({
  activeLayout,
  siteId,
  disabled,
  onSelect,
  onEdit,
}: Props) {
  const [customLayouts, setCustomLayouts] = useState<CustomHomeLayout[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | "preset" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCustomLayouts = useCallback(async () => {
    if (!siteId) {
      setCustomLayouts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTemplates();
      const rows = Array.isArray(response) ? response : response?.templates || [];
      setCustomLayouts(rows.filter(
        (template: CustomHomeLayout) =>
          isPublishedTemplate(template) && layoutKindFromTemplate(template) === "home-page",
      ));
    } catch (err: any) {
      setError(err?.message || "Failed to load custom Home Page layouts.");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    void loadCustomLayouts();
  }, [loadCustomLayouts]);

  const activeCustom = useMemo(
    () => customLayouts.find((layout) => layout.category === "global_default") || null,
    [customLayouts],
  );

  const selectCustom = async (layout: CustomHomeLayout) => {
    setBusyId(layout.id);
    setError(null);
    setMessage(null);
    try {
      await api.assignTemplate(String(layout.id), { isGlobalDefault: true });
      setCustomLayouts((current) => current.map((item) => ({
        ...item,
        category: item.id === layout.id ? "global_default" : item.category === "global_default" ? null : item.category,
      })));
      setMessage(`${layout.name} is now the public Home Page layout.`);
    } catch (err: any) {
      setError(err?.message || "Failed to select the custom Home Page layout.");
    } finally {
      setBusyId(null);
    }
  };

  const selectPreset = async (layout: (typeof HOME_LAYOUT_OPTIONS)[number]) => {
    setBusyId("preset");
    setError(null);
    setMessage(null);
    try {
      if (activeCustom) {
        await api.assignTemplate(String(activeCustom.id), { isGlobalDefault: false });
        setCustomLayouts((current) => current.map((item) => item.id === activeCustom.id ? { ...item, category: null } : item));
      }
      await onSelect(layout);
      setMessage(`${layout.name} preset is now the public Home Page layout.`);
    } catch (err: any) {
      setError(err?.message || "Failed to select the Home Page preset.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
        <LayoutTemplate className="h-3.5 w-3.5" />
        Page structure
      </div>
      {message ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">{error}</p> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {HOME_LAYOUT_OPTIONS.map((layout) => {
          const selected = !activeCustom && activeLayout === layout.id;
          const palette = getHomeLayoutPalette(layout.id);
          return (
            <article
              key={layout.id}
              className={cn(
                "relative flex flex-col rounded-2xl border-2 bg-white p-4 transition-all",
                selected
                  ? "border-emerald-600 shadow-md shadow-emerald-100"
                  : "border-slate-100 shadow-sm hover:border-slate-200",
              )}
            >
              {selected && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              )}
              <div
                className="mb-3 flex h-24 flex-col overflow-hidden rounded-xl border border-black/5"
                style={{ background: palette.colours.background }}
                aria-hidden="true"
              >
                <LayoutPreview id={layout.id} palette={palette} />
              </div>
              <h4 className="pr-14 text-sm font-bold text-slate-900">{layout.name}</h4>
              <p className="mt-1 flex-1 text-[11px] leading-relaxed text-slate-500">
                {layout.description}
              </p>
              <p className="mt-2 text-[10px] font-semibold text-slate-400">
                Best for: {layout.suitableFor.join(", ")}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={disabled || selected || busyId !== null}
                  onClick={() => void selectPreset(layout)}
                  className="h-9 flex-1 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {selected ? "Selected" : "Use layout"}
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onEdit(layout.id)}
                  aria-label={`Edit ${layout.name} content`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-t border-slate-200 pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900">Published custom layouts</h4>
            <p className="mt-1 text-xs text-slate-500">Home Page layouts created manually or by AI appear here after publication.</p>
          </div>
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : null}
        </div>
        {!loading && customLayouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            No published custom Home Page layout yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {customLayouts.map((layout) => {
              const selected = layout.id === activeCustom?.id;
              const busy = busyId === layout.id;
              const origin = layout.layoutJson?.metadata?.origin || "manual";
              return (
                <article key={layout.id} className={cn("rounded-2xl border-2 bg-white p-4", selected ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-100")}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      {origin === "ai" ? <Sparkles className="h-3 w-3 text-violet-500" /> : <LayoutTemplate className="h-3 w-3" />}
                      {origin === "ai" ? "AI generated" : "Manual"}
                    </span>
                    {selected ? <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase text-white">Active</span> : null}
                  </div>
                  <h5 className="mt-3 text-sm font-black text-slate-900">{layout.name}</h5>
                  <ContentLayoutMiniPreview blocks={layout.layoutJson?.blocks} selected={selected} />
                  <button
                    type="button"
                    disabled={disabled || selected || busyId !== null}
                    onClick={() => void selectCustom(layout)}
                    className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {selected ? "Selected" : "Use custom layout"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
