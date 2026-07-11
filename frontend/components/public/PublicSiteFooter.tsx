import type { CSSProperties } from "react";
import Link from "next/link";
import type { PublicSite } from "@/lib/publicSite";
import { siteBlogPath, siteHomePath } from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { resolveFooterLogo } from "@/lib/siteBranding";
import {
  mapThemeNavHref,
  DEFAULT_THEME_FOOTER_LINKS,
} from "@/lib/themeNav";

export default function PublicSiteFooter({ site }: { site: PublicSite }) {
  const year = new Date().getFullYear();
  const branding = site.branding;
  const logo = resolveMediaUrl(resolveFooterLogo(site.logo, branding));
  const description =
    branding?.footer?.footerDescription ||
    `Stories and updates from ${site.name}. Built with CoreHead.`;
  const copyright =
    branding?.footer?.copyrightText ||
    `© ${year} ${site.name}. All rights reserved.`;
  const quickLinksRaw =
    branding?.footer?.quickLinks?.filter((l) => l?.name && l?.link) || null;
  const quickLinks =
    quickLinksRaw && quickLinksRaw.length > 0
      ? quickLinksRaw
      : DEFAULT_THEME_FOOTER_LINKS;

  const footerStyle: CSSProperties = {
    background: "var(--site-footer-bg, var(--site-surface, #fff))",
    color: "var(--site-footer-fg, var(--site-muted, #64748b))",
  };

  return (
    <footer className="mt-auto border-t border-black/5" style={footerStyle}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row gap-8 sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt=""
                  className="h-9 w-9 rounded-lg object-cover border border-black/5"
                />
              ) : (
                <div
                  className="h-9 w-9 rounded-lg text-white flex items-center justify-center text-xs font-black"
                  style={{ background: "var(--site-primary, #2563eb)" }}
                >
                  {site.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="font-bold text-lg" style={{ color: "inherit" }}>
                {site.name}
              </p>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{description}</p>
          </div>

          <div className="flex flex-col gap-2 text-sm font-semibold">
            <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold mb-1">
              Explore
            </p>
            {quickLinks.map((item) => (
              <Link
                key={`${item.name}-${item.link}`}
                href={mapThemeNavHref(item.link, site.slug)}
                className="hover:text-[var(--site-primary,#2563eb)] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-black/5 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs opacity-70">
          <p>{copyright}</p>
          <p className="font-medium">
            Public site · <span>/s/{site.slug}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
