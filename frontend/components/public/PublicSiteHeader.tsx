"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
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
import { api, type SiteSummary } from "@/lib/api";
import { Menu, X } from "lucide-react";

export default function PublicSiteHeader({ site }: { site: PublicSite }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const branding = site.branding;
  const logo = resolveMediaUrl(resolveHeaderLogo(site.logo, branding));
  const [logoBroken, setLogoBroken] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [manageableSite, setManageableSite] = useState<SiteSummary | null>(null);

  useEffect(() => {
    setLogoBroken(false);
  }, [logo]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("accessToken");
    setHasSession(Boolean(token));
    setManageableSite(null);

    if (!token) return () => { active = false; };

    api.getManageableSite(site.id)
      .then((matchedSite) => {
        if (active && matchedSite && Number(matchedSite.id) === Number(site.id)) {
          setManageableSite(matchedSite);
        }
      })
      .catch(() => {
        if (active) setManageableSite(null);
      });

    return () => { active = false; };
  }, [site.id]);
  const homeHref = siteHomePath(site.slug);
  const blogHref = siteBlogPath(site.slug);

  const customNav =
    branding?.header?.navLinks?.filter((n) => n?.name && n?.link) || null;
  let navItems =
    customNav && customNav.length > 0 ? customNav : DEFAULT_THEME_NAV_LINKS;

  if (site.slug === "guides") {
    navItems = [
      { id: 1, name: "Home", link: "/" },
      { id: 2, name: "Guides", link: "/guides" },
      { id: 3, name: "All Guides", link: "/s/guides/blog" },
    ];
  }

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
    const isLogout = name === "logout" || link === "/logout";
    const isDashboard =
      name === "dashboard" || link === "/admin" || link.startsWith("/admin");
    if (isDashboard) return Boolean(manageableSite);
    if (isLogout) return hasSession;
    return false;
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
    if (!manageableSite) return;

    setCurrentSite({
      id: manageableSite.id,
      name: manageableSite.name,
      slug: manageableSite.slug,
      status: manageableSite.status,
      logo: manageableSite.logo ?? null,
      ownerId: manageableSite.ownerId,
    });
    router.push(`/admin/posts?site=${encodeURIComponent(manageableSite.slug)}`);
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

    let href = mapThemeNavHref(item.link, site.slug);
    if (site.slug === "guides") {
      if (item.link === "/") href = "/";
      else if (item.link === "/guides") href = "/guides";
      else if (item.link === "/s/guides/blog") href = "/s/guides/blog";
    }
    const active =
      !isLogout &&
      !isDashboard &&
      (pathname === href ||
        (href !== "/" && pathname.startsWith(href + "/")) ||
        (href.includes("/blog") && pathname.includes("/blog")));

    const baseClass = cn(
      "font-semibold leading-none transition-colors whitespace-nowrap",
      mobile
        ? "block w-full rounded-xl px-4 py-3 text-sm"
        : "inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm",
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
      if (!manageableSite) return null;
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
      <div className="grid h-[var(--site-header-mobile-height,64px)] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 transition-[height] sm:px-6 lg:h-[var(--site-header-height,72px)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-10 xl:px-14">
        <Link
          href={homeHref}
          className="group flex h-12 min-w-0 items-center gap-2.5 justify-self-start"
        >
          {logo && !logoBroken ? (
            // Logo image only — name text would double brand wordmarks (e.g. “Blocksy Blocksy”)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={site.name}
              width={160}
              height={44}
              className="block h-auto max-h-10 w-auto max-w-[180px] shrink-0 object-contain object-left"
              onError={() => setLogoBroken(true)}
            />
          ) : (
            <>
              <div
                className="h-10 w-10 rounded-xl text-white flex items-center justify-center text-sm font-black shadow-md shrink-0"
                style={{ background: "var(--site-primary, #2563eb)" }}
              >
                {site.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-base font-bold leading-none sm:text-lg">
                {site.name}
              </span>
            </>
          )}
        </Link>

        <nav className="hidden min-h-12 items-center justify-center gap-0.5 justify-self-center lg:flex">
          {primaryNav.map((item) => renderNavItem(item))}
        </nav>

        <div className="hidden min-h-12 items-center justify-end justify-self-end lg:flex">
          {site.slug !== "guides" && (
            <Link
              href={ctaUrl}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-bold leading-none shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: ctaBg, color: ctaColor }}
            >
              {ctaText || "Explore"}
            </Link>
          )}
          {utilityNav.length > 0 && (
            <div className="ml-1 flex h-10 items-center gap-0.5 border-l border-white/15 pl-2">
              {utilityNav.map((item) => renderNavItem(item))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-xl border border-white/15 bg-white/5 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="space-y-1 border-t border-white/10 px-3 pb-4 pt-2 lg:hidden"
          style={headerStyle}
        >
          {primaryNav.map((item) => renderNavItem(item, true))}
          {site.slug !== "guides" && (
            <Link
              href={ctaUrl}
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold"
              style={{ background: ctaBg, color: ctaColor }}
            >
              {ctaText || "Explore"}
            </Link>
          )}
          {utilityNav.map((item) => renderNavItem(item, true))}
        </div>
      )}
    </header>
  );
}
