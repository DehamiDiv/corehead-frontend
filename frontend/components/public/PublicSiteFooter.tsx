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
import { Mail, MapPin } from "lucide-react";

export default function PublicSiteFooter({ site }: { site: PublicSite }) {
  const year = new Date().getFullYear();
  const branding = site.branding;
  const logo = resolveMediaUrl(resolveFooterLogo(site.logo, branding));
  const description =
    branding?.footer?.footerDescription ||
    `${site.name} publishes thoughtful stories for modern readers.`;
  const copyright =
    branding?.footer?.copyrightText ||
    `© ${year} ${site.name}. All rights reserved.`;
  const quickLinksRaw =
    branding?.footer?.quickLinks?.filter((l) => l?.name && l?.link) || null;
  const quickLinks =
    quickLinksRaw && quickLinksRaw.length > 0
      ? quickLinksRaw
      : DEFAULT_THEME_FOOTER_LINKS.filter((l) => {
          const n = l.name.toLowerCase();
          return n !== "dashboard" && n !== "logout";
        });

  const footerStyle: CSSProperties = {
    background: "var(--site-footer-bg, #0f172a)",
    color: "var(--site-footer-fg, #94a3b8)",
  };

  const isNature = branding?.homeStyle === "nature";

  return (
    <footer className="mt-auto border-t border-black/10" style={footerStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={site.name}
                  className="h-9 w-auto max-w-[150px] object-contain"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-xl text-white flex items-center justify-center text-sm font-black"
                  style={{ background: "var(--site-primary)" }}
                >
                  {site.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="font-bold text-lg text-inherit opacity-95">
                {site.name}
              </p>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{description}</p>
            {isNature && (
              <div className="mt-5 space-y-2 text-sm opacity-85">
                <p className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 opacity-70" />
                  hello@verdura.demo
                </p>
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 opacity-70" />
                  Colombo, Sri Lanka
                </p>
              </div>
            )}
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold opacity-60 mb-4">
              Explore
            </p>
            <div className="flex flex-col gap-2.5 text-sm font-semibold">
              {quickLinks.map((item) => (
                <Link
                  key={`${item.name}-${item.link}`}
                  href={mapThemeNavHref(item.link, site.slug)}
                  className="hover:opacity-100 opacity-90 transition-opacity hover:underline underline-offset-4"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Journal */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold opacity-60 mb-4">
              Journal
            </p>
            <div className="flex flex-col gap-2.5 text-sm font-semibold">
              <Link
                href={siteHomePath(site.slug)}
                className="hover:underline underline-offset-4 opacity-90"
              >
                Home
              </Link>
              <Link
                href={siteBlogPath(site.slug)}
                className="hover:underline underline-offset-4 opacity-90"
              >
                All stories
              </Link>
              <Link
                href={`/s/${site.slug}/p/about`}
                className="hover:underline underline-offset-4 opacity-90"
              >
                About
              </Link>
              <Link
                href={`/s/${site.slug}/p/contact`}
                className="hover:underline underline-offset-4 opacity-90"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs opacity-70">
          <p>{copyright}</p>
          <p className="font-medium">
            Powered by{" "}
            <Link href="/" className="underline underline-offset-2 hover:opacity-100">
              CoreHead
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
