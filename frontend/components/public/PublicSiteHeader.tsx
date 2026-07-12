"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
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
import { Menu, X } from "lucide-react";

export default function PublicSiteHeader({ site }: { site: PublicSite }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const branding = site.branding;
  const logo = resolveMediaUrl(resolveHeaderLogo(site.logo, branding));
  const homeHref = siteHomePath(site.slug);
  const blogHref = siteBlogPath(site.slug);

  const customNav =
    branding?.header?.navLinks?.filter((n) => n?.name && n?.link) || null;
  const navItems =
    customNav && customNav.length > 0 ? customNav : DEFAULT_THEME_NAV_LINKS;

  // Public marketing nav: hide admin tools from primary bar (still available if configured)
  const primaryNav = navItems.filter((item) => {
    const name = String(item.name).toLowerCase();
    const link = String(item.link || "");
    if (name === "logout" || link === "/logout") return false;
    if (name === "dashboard" || link === "/admin" || link.startsWith("/admin"))
      return false;
    return true;
  });

  const utilityNav = navItems.filter((item) => {
    const name = String(item.name).toLowerCase();
    const link = String(item.link || "");
    return (
      name === "logout" ||
      link === "/logout" ||
      name === "dashboard" ||
      link === "/admin" ||
      link.startsWith("/admin")
    );
  });

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
      router.push(
        `/login?callback=${encodeURIComponent(`/admin?site=${encodeURIComponent(site.slug)}`)}`
      );
      return;
    }

    router.push(`/admin?site=${encodeURIComponent(site.slug)}`);
  };

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
    router.push(homeHref);
  };

  const renderNavItem = (item: { name: string; link: string }, mobile = false) => {
    const nameLower = String(item.name).toLowerCase();
    const isLogout = nameLower === "logout" || item.link === "/logout";
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

    const baseClass = cn(
      "font-semibold transition-colors whitespace-nowrap",
      mobile
        ? "block w-full rounded-xl px-4 py-3 text-sm"
        : "px-3 py-2 text-sm rounded-xl",
      active
        ? "opacity-100 bg-white/10 underline underline-offset-4"
        : "opacity-85 hover:opacity-100 hover:bg-white/5"
    );

    if (isLogout) {
      return (
        <button
          key={`${item.name}-${item.link}`}
          type="button"
          onClick={(e) => {
            handleLogout(e);
            setMobileOpen(false);
          }}
          className={baseClass}
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
          onClick={(e) => {
            openSiteDashboard(e);
            setMobileOpen(false);
          }}
          className={baseClass}
        >
          {item.name}
        </button>
      );
    }

    return (
      <Link
        key={`${item.name}-${item.link}`}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={baseClass}
      >
        {item.name}
      </Link>
    );
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-black/10 shadow-sm backdrop-blur-xl"
      style={{
        ...headerStyle,
        background: `color-mix(in srgb, var(--site-header-bg, var(--site-surface, #fff)) 92%, transparent)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-[70px] flex items-center justify-between gap-3">
        <Link
          href={homeHref}
          className="flex items-center gap-2.5 min-w-0 group shrink-0"
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={site.name}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-contain bg-white border border-white/80 shadow-md p-1"
            />
          ) : (
            <div
              className="h-11 w-11 rounded-full text-white flex items-center justify-center text-sm font-black shadow-md shrink-0"
              style={{ background: "var(--site-primary, #2563eb)" }}
            >
              {site.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-bold truncate text-base sm:text-lg leading-tight">
            {site.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {primaryNav.map((item) => renderNavItem(item))}
          <Link
            href={ctaUrl}
            className="ml-2 inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
            style={{ background: ctaBg, color: ctaColor }}
          >
            {ctaText || "Explore"}
          </Link>
          {utilityNav.length > 0 && (
            <div className="ml-1 pl-2 border-l border-white/15 flex items-center gap-0.5">
              {utilityNav.map((item) => renderNavItem(item))}
            </div>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/10 px-3 pb-4 pt-2 space-y-1"
          style={headerStyle}
        >
          {primaryNav.map((item) => renderNavItem(item, true))}
          <Link
            href={ctaUrl}
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold"
            style={{ background: ctaBg, color: ctaColor }}
          >
            {ctaText || "Explore"}
          </Link>
          {utilityNav.map((item) => renderNavItem(item, true))}
        </div>
      )}
    </header>
  );
}
