import type { CSSProperties, ReactNode } from "react";
import type { PublicSite } from "@/lib/publicSite";
import PublicSiteHeader from "@/components/public/PublicSiteHeader";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import {
  brandingToCssVars,
  brandingFontStylesheetUrl,
  resolvePublicBranding,
} from "@/lib/siteBranding";

/**
 * T14 + R2-4 — Public site chrome with Appearance theme presets + CSS variables.
 */
export default function PublicSiteShell({
  site,
  children,
}: {
  site: PublicSite;
  children: ReactNode;
}) {
  const branding = resolvePublicBranding(site.branding);
  const themeVars = brandingToCssVars(branding) as CSSProperties;
  const fontHref = brandingFontStylesheetUrl(branding);
  const siteWithBranding: PublicSite = { ...site, branding };

  return (
    <div
      className="public-site-shell min-h-screen flex flex-col bg-[var(--site-bg)] text-[var(--site-ink)]"
      data-theme={branding.themeId || "default"}
      data-home-style={branding.homeStyle || "classic"}
      style={{
        ...themeVars,
        fontFamily: "var(--site-font, system-ui, sans-serif)",
      }}
    >
      {fontHref ? (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={fontHref} />
      ) : null}
      <PublicSiteHeader site={siteWithBranding} />
      <div className="flex-1 flex flex-col w-full">{children}</div>
      <PublicSiteFooter site={siteWithBranding} />
    </div>
  );
}
