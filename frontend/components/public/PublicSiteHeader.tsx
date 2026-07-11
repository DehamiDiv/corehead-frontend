"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { PublicSite } from "@/lib/publicSite";
import { siteBlogPath, siteHomePath } from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { resolveHeaderLogo } from "@/lib/siteBranding";
import { mapThemeNavHref, DEFAULT_THEME_NAV_LINKS } from "@/lib/themeNav";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/authSession";
import { setCurrentSite } from "@/lib/siteStorage";

export default function PublicSiteHeader({ site }: { site: PublicSite }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const branding = site.branding;
  const logo = resolveMediaUrl(resolveHeaderLogo(site.logo, branding));
  const homeHref = siteHomePath(site.slug);
  const blogHref = siteBlogPath(site.slug);

  const customNav =
    branding?.header?.navLinks?.filter((n) => n?.name && n?.link) || null;
  const navItems =
    customNav && customNav.length > 0 ? customNav : DEFAULT_THEME_NAV_LINKS;

  const headerStyle: CSSProperties = {
    background: "var(--site-header-bg, var(--site-surface, #fff))",
    color: "var(--site-header-fg, var(--site-ink, #0f172a))",
  };

  const ctaBg = branding?.header?.ctaBg || "var(--site-primary, #2563eb)";
  const ctaColor = branding?.header?.ctaColor || "#ffffff";
  const ctaText = branding?.header?.ctaText;
  const ctaUrl = branding?.header?.ctaUrl
    ? mapThemeNavHref(branding.header.ctaUrl, site.slug)
    : blogHref;

  /** Bind admin X-Site-Id to THIS public site before opening dashboard */
  const openSiteDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSite({
      id: site.id,
      name: site.name,
      slug: site.slug,
      status: site.status,
      logo: site.logo ?? null,
      ownerId: site.ownerId,
    });

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      // Login then return to admin for this site
      router.push(
        `/login?callback=${encodeURIComponent(`/admin?site=${encodeURIComponent(site.slug)}`)}`,
      );
      return;
    }

    // Admin with this site pre-selected
    router.push(`/admin?site=${encodeURIComponent(site.slug)}`);
  };

  /** Logout but stay on THIS public site (not main marketing login) */
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      clearSession();
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    // Return to this company's public home as a visitor
    router.push(homeHref);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-black/5 shadow-sm shadow-slate-900/5"
      style={headerStyle}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-[72px] flex items-center justify-between gap-2">
        <Link
          href={homeHref}
          className="flex items-center gap-3 min-w-0 group shrink-0"
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={site.name}
              className="h-10 w-10 rounded-xl object-cover border border-black/5 shadow-sm"
            />
          ) : (
            <div
              className="h-10 w-10 rounded-xl text-white flex items-center justify-center text-sm font-black shadow-md"
              style={{ background: "var(--site-primary, #2563eb)" }}
            >
              {site.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 hidden xs:block sm:block">
            <span className="block font-bold truncate group-hover:opacity-80 transition-opacity text-base sm:text-lg leading-tight">
              {site.name}
            </span>
            <span className="hidden md:block text-[11px] font-medium opacity-60 truncate">
              /s/{site.slug}
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto max-w-[70%] sm:max-w-none scrollbar-thin">
          {navItems.map((item) => {
            const nameLower = String(item.name).toLowerCase();
            const isLogout =
              nameLower === "logout" || item.link === "/logout";
            const isDashboard =
              nameLower === "dashboard" ||
              item.link === "/admin" ||
              item.link.startsWith("/admin");

            const href = mapThemeNavHref(item.link, site.slug);
            const active =
              !isLogout &&
              !isDashboard &&
              (pathname === href ||
                (href !== "/" && pathname.startsWith(href + "/")) ||
                (href.includes("/blog") && pathname.includes("/blog")));

            if (isLogout) {
              return (
                <button
                  key={`${item.name}-${item.link}`}
                  type="button"
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors opacity-80 hover:opacity-100 whitespace-nowrap"
                >
                  {item.name}
                </button>
              );
            }

            if (isDashboard) {
              return (
                <button
                  key={`${item.name}-${item.link}`}
                  type="button"
                  onClick={openSiteDashboard}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors opacity-80 hover:opacity-100 whitespace-nowrap"
                >
                  {item.name}
                </button>
              );
            }

            return (
              <Link
                key={`${item.name}-${item.link}`}
                href={href}
                className={cn(
                  "px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap",
                  active
                    ? "opacity-100 underline underline-offset-4"
                    : "opacity-80 hover:opacity-100",
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href={ctaUrl}
            className="hidden lg:inline-flex ml-1 px-4 py-2 text-sm font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
            style={{ background: ctaBg, color: ctaColor }}
          >
            {ctaText || "Latest posts"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
