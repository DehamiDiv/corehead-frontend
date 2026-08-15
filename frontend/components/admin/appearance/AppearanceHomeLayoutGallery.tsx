"use client";

import { CheckCircle2, LayoutTemplate, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HOME_LAYOUT_OPTIONS,
  getHomeLayoutPalette,
} from "@/lib/themePresets";
import type { HomeStyle } from "@/lib/appearanceModel";

type Props = {
  activeLayout: HomeStyle;
  disabled?: boolean;
  onSelect: (layout: (typeof HOME_LAYOUT_OPTIONS)[number]) => void;
  onEdit: (layoutId: HomeStyle) => void;
};

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
  disabled,
  onSelect,
  onEdit,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
        <LayoutTemplate className="h-3.5 w-3.5" />
        Page structure
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {HOME_LAYOUT_OPTIONS.map((layout) => {
          const selected = activeLayout === layout.id;
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
                  disabled={disabled || selected}
                  onClick={() => onSelect(layout)}
                  className="h-9 flex-1 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
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
    </div>
  );
}
