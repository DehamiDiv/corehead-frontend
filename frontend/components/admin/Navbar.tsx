"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Home, FileText, ExternalLink } from "lucide-react";
import SiteSwitcher from "@/components/admin/SiteSwitcher";
import { useOptionalSite } from "@/components/admin/SiteContext";
import { siteBlogPath, siteHomePath } from "@/lib/publicSite";
import { clearSession } from "@/lib/authSession";
import { cn } from "@/lib/utils";
import { resolveAdminMediaUrl } from "@/lib/apiOrigin";

/**
 * Dashboard top navbar:
 * [ Logo (larger) + Dashboard ] ····· [ All Blogs centered ] ····· [ Site · Visit · Profile · Logout ]
 */
export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const siteCtx = useOptionalSite();
  const slug = siteCtx?.currentSite?.slug;
  const [user, setUser] = useState<{
    name?: string;
    username?: string;
    avatar?: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const displayName = user?.username || user?.name || "Admin";
  const avatarSrc =
    resolveAdminMediaUrl(user?.avatar || user?.image) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&bold=true&size=128`;

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const adminPanelPath = "/admin/posts";
  const publicBlogsPath = slug ? siteBlogPath(slug) : "/admin/sites";
  const isDashboard = pathname === "/admin";

  const navBtn = (active: boolean) =>
    cn(
      "inline-flex items-center justify-center gap-2",
      "h-10 px-4 sm:px-5 rounded-full text-sm font-bold",
      "transition-all duration-200 whitespace-nowrap",
      active
        ? "bg-blue-600 text-white shadow-md shadow-blue-200/80"
        : "text-slate-600 hover:bg-white/80 hover:text-slate-900",
    );

  return (
    <div className="relative z-[100] isolate w-full flex justify-center pt-6 sm:pt-8 px-4 sm:px-6">
      <nav
        className={cn(
          "relative z-[100] w-full max-w-5xl overflow-visible",
          "bg-white/70 backdrop-blur-xl border border-white/50",
          "rounded-2xl sm:rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.06)]",
          "flex items-center justify-between gap-3",
          "px-4 sm:px-6 py-3 min-h-[64px]",
        )}
      >
        {/* LEFT — larger logo + Dashboard (shifted left of center) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 z-10">
          <Link
            href="/"
            className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="CoreHead Logo"
              width={180}
              height={48}
              className="h-12 sm:h-14 w-auto object-contain"
              priority
            />
          </Link>

          <Link
            href={adminPanelPath}
            className={navBtn(isDashboard)}
            title="Open the admin content panel"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* CENTER — All Blogs truly centered in the bar */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none sm:pointer-events-auto">
          <Link
            href={publicBlogsPath}
            className={cn(navBtn(false), "pointer-events-auto")}
            aria-disabled={!slug}
            title={
              slug
                ? `View published posts for ${siteCtx?.currentSite?.name || slug}`
                : "Select a site to view its published posts"
            }
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>All Blogs</span>
          </Link>
        </div>

        {/* RIGHT — site tools */}
        <div className="flex items-center justify-end gap-2 min-w-0 z-10">
          <div className="min-w-0 max-w-[140px] sm:max-w-[190px]">
            <SiteSwitcher />
          </div>

          {slug ? (
            <Link
              href={siteHomePath(slug)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-1.5",
                "h-10 px-3 rounded-xl border border-slate-200/80 bg-white/90",
                "text-xs font-bold text-slate-600",
                "hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50",
                "transition-colors shrink-0",
              )}
              title={`Open /s/${slug}`}
            >
              <span className="hidden sm:inline">Visit site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : null}

          {/* Profile — perfect circle */}
          <Link
            href="/admin/settings/profile"
            title={displayName}
            className={cn(
              "relative h-10 w-10 shrink-0 rounded-full overflow-hidden",
              "border-2 border-white ring-2 ring-slate-200/90 shadow-sm",
              "bg-slate-100 hover:ring-blue-400 transition-all",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={displayName}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "inline-flex items-center justify-center",
              "h-10 w-10 rounded-full shrink-0",
              "text-slate-500 border border-transparent",
              "hover:text-red-600 hover:bg-red-50 hover:border-red-100",
              "transition-all",
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}
