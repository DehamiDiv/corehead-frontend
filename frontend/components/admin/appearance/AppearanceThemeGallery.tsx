"use client";

import { CheckCircle2, Loader2, Palette, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  THEME_OPTIONS,
  getThemePreset,
} from "@/lib/themePresets";

type Props = {
  activeTheme: string;
  busyThemeId?: string | null;
  disabled?: boolean;
  onActivate: (themeId: string) => void;
  onCustomize: (themeId: string) => void;
};

function ThemeTokenPreview({ themeId }: { themeId: string }) {
  const preset = getThemePreset(themeId);
  return (
    <div
      className="h-44 overflow-hidden rounded-xl border border-black/5"
      style={{ background: preset.colours.background }}
      aria-hidden="true"
    >
      <div
        className="flex h-8 items-center gap-2 px-3"
        style={{
          background: preset.header.headerBg,
          color: preset.header.headerFont,
        }}
      >
        <span className="h-2.5 w-16 rounded-full bg-current opacity-80" />
        <span className="ml-auto h-4 w-10 rounded-full bg-current opacity-20" />
        <span
          className="h-5 w-12 rounded-full"
          style={{ background: preset.header.ctaBg }}
        />
      </div>
      <div className="grid grid-cols-5 gap-2 p-3">
        <div className="col-span-3 space-y-2 pt-2">
          <span
            className="block h-2 w-16 rounded-full"
            style={{ background: preset.colours.accent }}
          />
          <span
            className="block h-4 w-full rounded-full"
            style={{ background: preset.colours.foreground }}
          />
          <span
            className="block h-4 w-4/5 rounded-full opacity-70"
            style={{ background: preset.colours.foreground }}
          />
          <span
            className="mt-3 block h-6 w-20 rounded-full"
            style={{ background: preset.colours.primary }}
          />
        </div>
        <div
          className="col-span-2 h-24 rounded-xl shadow-sm"
          style={{ background: preset.colours.card }}
        />
      </div>
      <div className="flex gap-1.5 px-3">
        {[preset.colours.primary, preset.colours.accent, preset.colours.card].map(
          (colour) => (
            <span
              key={colour}
              className="h-4 flex-1 rounded-full"
              style={{ background: colour }}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default function AppearanceThemeGallery({
  activeTheme,
  busyThemeId,
  disabled,
  onActivate,
  onCustomize,
}: Props) {
  return (
    <section className="space-y-5" aria-labelledby="appearance-themes-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
            <Palette className="h-3.5 w-3.5" />
            Visual styling
          </div>
          <h2 id="appearance-themes-title" className="text-xl font-black text-slate-900">
            Themes
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Themes change colours, typography, header, and footer styling. Your
            selected homepage layout and its content remain unchanged.
          </p>
        </div>
        <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          Theme and homepage are independent
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {THEME_OPTIONS.map((theme) => {
          const active = theme.id === activeTheme;
          const busy = busyThemeId === theme.id;
          return (
            <article
              key={theme.id}
              className={cn(
                "rounded-2xl border-2 bg-white p-3 shadow-sm transition",
                active
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-100 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg",
              )}
            >
              <ThemeTokenPreview themeId={theme.id} />
              <div className="p-2 pb-1 pt-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900">{theme.name}</h3>
                  {active && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>
                <p className="mt-1 min-h-10 text-xs leading-relaxed text-slate-500">
                  {theme.description}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={disabled || busy}
                    onClick={() => onCustomize(theme.id)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Settings2 className="h-3.5 w-3.5" /> Customize
                  </button>
                  <button
                    type="button"
                    disabled={disabled || busy || active}
                    onClick={() => onActivate(theme.id)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {active ? "Selected" : "Use theme"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
