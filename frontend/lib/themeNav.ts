/**
 * Theme navigation for multi-tenant public sites.
 * Content links resolve under /s/{siteSlug}/… so each company stays on its own site.
 * Only auth/app tools (Dashboard, Logout) leave the public tenant shell.
 */

export type ThemeNavLink = {
  id: number;
  name: string;
  link: string;
};

/**
 * Default header nav — relative to the active tenant site.
 * mapThemeNavHref() turns these into /s/{slug}/… URLs.
 */
export const DEFAULT_THEME_NAV_LINKS: ThemeNavLink[] = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Features", link: "#features" },
  { id: 3, name: "Pricing", link: "/p/pricing" },
  { id: 4, name: "Blogs", link: "/blog" },
  { id: 5, name: "Guide", link: "/p/guide" },
  { id: 6, name: "Dashboard", link: "/admin" },
  { id: 7, name: "Logout", link: "/logout" },
];

export const DEFAULT_THEME_FOOTER_LINKS: ThemeNavLink[] = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Blogs", link: "/blog" },
  { id: 3, name: "Pricing", link: "/p/pricing" },
  { id: 4, name: "Guide", link: "/p/guide" },
  { id: 5, name: "Features", link: "#features" },
  { id: 6, name: "Dashboard", link: "/admin" },
];

/** App routes that are NOT tenant public pages */
const APP_ONLY_PATHS = [
  "/admin",
  "/login",
  "/signup",
  "/logout",
  "/onboarding",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/ai-prompt",
  "/builder",
];

function isAppOnlyPath(path: string): boolean {
  const p = path.split("?")[0].split("#")[0] || path;
  return APP_ONLY_PATHS.some((x) => p === x || p.startsWith(x + "/"));
}

/**
 * Map a theme nav `link` value for the public tenant shell of `siteSlug`.
 * Ensures company A never navigates into company B or bare marketing pages by mistake.
 */
export function mapThemeNavHref(link: string, siteSlug: string): string {
  const slug = String(siteSlug || "").trim();
  const base = slug ? `/s/${slug}` : "";

  if (!link || link === "/") return base || "/";

  // Already tenant-scoped
  if (link.startsWith("/s/")) {
    // If someone hardcoded /s/other-site/..., rewrite to current site path tail
    const parts = link.split("/");
    // /s/{any}/{rest...}
    if (parts.length >= 3 && parts[1] === "s") {
      const rest = parts.slice(3).join("/");
      return rest ? `${base}/${rest}` : base;
    }
    return link;
  }

  // Absolute external
  if (link.startsWith("http://") || link.startsWith("https://")) return link;

  // Hash only → current site home section
  if (link.startsWith("#")) {
    return `${base}${link}`;
  }

  // "/#features" (old marketing style) → site home #features
  if (link.startsWith("/#")) {
    return `${base}${link.slice(1)}`; // /s/slug#features
  }

  // Dashboard → admin pre-bound to this site (SiteProvider reads ?site=)
  if (
    link === "/admin" ||
    link.startsWith("/admin") ||
    link === "/dashboard" ||
    link.startsWith("/dashboard")
  ) {
    return `/admin?site=${encodeURIComponent(slug)}`;
  }

  // Logout handled in PublicSiteHeader (returns to this public site)
  if (link === "/logout") {
    return base || "/";
  }

  // Other app tools (login/signup…)
  if (isAppOnlyPath(link)) {
    // Login with return to this site
    if (link === "/login" || link.startsWith("/login")) {
      return `/login?callback=${encodeURIComponent(base || "/")}`;
    }
    return link;
  }

  // Legacy platform marketing paths → site custom pages
  if (link === "/pricing" || link.startsWith("/pricing/")) {
    return `${base}/p/pricing`;
  }
  if (link === "/guides" || link === "/guide" || link.startsWith("/guides/")) {
    return `${base}/p/guide`;
  }
  if (link === "/features" || link.startsWith("/features")) {
    return `${base}#features`;
  }

  // Blog
  if (link === "/blog" || link === "/blogs") {
    return `${base}/blog`;
  }
  if (link.startsWith("/blog/") || link.startsWith("/blogs/")) {
    const rest = link.replace(/^\/blogs?/, "");
    return `${base}/blog${rest}`;
  }

  // Custom pages shortcut: /p/about → /s/{slug}/p/about
  if (link.startsWith("/p/")) {
    return `${base}${link}`;
  }

  // Any other relative path under this tenant
  if (link.startsWith("/")) {
    return `${base}${link}`;
  }

  return link;
}
