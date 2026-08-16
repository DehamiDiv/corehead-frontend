import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * R1-1 / R1-2: Auth gate for admin + onboarding.
 * R6: custom-domain host rewrite → /s/{slug}/...
 *
 * Site CMS is available to any logged-in user; only /admin/users is platform-admin-only.
 * Site ownership/membership is enforced in the app + API (X-Site-Id).
 */
const protectedPaths: string[] = [
  "/admin",
  // R4-1: legacy /builder redirects to /admin/builder (still gated)
  "/builder",
  "/dashboard",
  "/ai-prompt",
  "/onboarding",
];

const PLATFORM_ADMIN_ONLY_PATHS = ["/admin/users"];

/** Hosts that belong to the CoreHead app itself (not tenant custom domains). */
const PLATFORM_HOSTS = new Set(
  [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    process.env.NEXT_PUBLIC_APP_HOST,
    process.env.VERCEL_URL,
  ]
    .filter(Boolean)
    .map((h) => String(h).toLowerCase().replace(/:\d+$/, "").replace(/\/$/, ""))
);

function isPlatformAdmin(role?: string) {
  const r = String(role || "").toLowerCase();
  return r === "admin" || r === "administrator";
}

function getHostname(request: NextRequest): string {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  return host.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

function shouldSkipDomainRewrite(pathname: string): boolean {
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/s/") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname === "/favicon.ico"
  ) {
    return true;
  }
  return false;
}

/**
 * R6: If Host is a verified tenant custom domain, rewrite to /s/{slug}{path}.
 */
async function tryDomainRewrite(
  request: NextRequest
): Promise<NextResponse | null> {
  const hostname = getHostname(request);
  if (!hostname || PLATFORM_HOSTS.has(hostname)) return null;

  // Treat *.localhost as platform in local multi-host tests optionally later
  if (hostname.endsWith(".localhost")) {
    // e.g. acme.localhost could be used; skip unless configured as full domain in API
  }

  const { pathname } = request.nextUrl;
  if (shouldSkipDomainRewrite(pathname)) return null;

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  try {
    const res = await fetch(
      `${apiBase}/sites/by-domain/${encodeURIComponent(hostname)}`,
      {
        headers: { Accept: "application/json" },
        // Edge fetch — no-store
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const slug = data?.site?.slug;
    if (!slug) return null;

    const rewritePath =
      pathname === "/" ? `/s/${slug}` : `/s/${slug}${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    // keep search
    return NextResponse.rewrite(url);
  } catch {
    // Backend down or network — fall through to normal routing
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // R6 domain rewrite first (public tenant sites on custom host)
  const domainResponse = await tryDomainRewrite(request);
  if (domainResponse) return domainResponse;

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callback", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isPlatformOnly = PLATFORM_ADMIN_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

    if (isPlatformOnly && !isPlatformAdmin(role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
