"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { SiteProvider, useOptionalSite } from "@/components/admin/SiteContext";
import { canAccessAdminPath, canAccessSiteCms } from "@/lib/rbac";
import { Loader2, ShieldAlert } from "lucide-react";

/**
 * T5/T16: Zero sites → friendly empty state, then send to create-site wizard.
 */
function RequireSiteGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const siteCtx = useOptionalSite();

  useEffect(() => {
    if (!siteCtx || siteCtx.loading) return;
    if (siteCtx.accessDeniedSite) return;
    if (siteCtx.sites.length === 0) {
      const t = setTimeout(() => {
        router.replace("/onboarding/create-site");
      }, 600);
      return () => clearTimeout(t);
    }
  }, [siteCtx, router]);

  if (!siteCtx || siteCtx.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3 px-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading your sites…</p>
      </div>
    );
  }

  if (siteCtx.accessDeniedSite) {
    const publicSiteHref = siteCtx.accessDeniedSiteSlug
      ? `/s/${encodeURIComponent(siteCtx.accessDeniedSiteSlug)}`
      : "/";
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-slate-200/40">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Access denied</p>
          <h1 className="mt-2 text-xl font-black text-slate-900">You cannot manage this site</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            This dashboard is available only to the site owner and authorized team members.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={publicSiteHref}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Return to site
            </a>
            <a
              href="/admin/sites"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
            >
              Open my sites
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (siteCtx.sites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl font-black">
            +
          </div>
          <h1 className="text-xl font-black text-slate-900">Create your site first</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            You need a site before managing posts, media, or settings. Redirecting you to the setup wizard…
          </p>
          <button
            type="button"
            onClick={() => router.replace("/onboarding/create-site")}
            className="mt-6 w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Create site now
          </button>
          <p className="mt-3 text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Taking you to onboarding
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isDashboard = pathname === "/admin";
  const isBuilder = pathname?.startsWith("/admin/builder");

  if (isDashboard || isBuilder) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#e8f1f9]">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-[250px]" : "ml-0"
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!userJson || !token) {
      router.push("/login?callback=" + pathname);
      return;
    }

    try {
      const user = JSON.parse(userJson);

      // R1-1: any site CMS role can enter admin (authors who own a site included).
      // RequireSiteGate still forces create-site when they have zero sites.
      // R1-2: path checks use shared rbac helper.
      if (!canAccessSiteCms(user.role)) {
        router.push("/");
        return;
      }

      if (!canAccessAdminPath(pathname || "/admin", user.role)) {
        router.push("/admin");
        return;
      }

      setIsAuthorized(true);
    } catch (e) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  // SiteProvider + gate: no site → onboarding (T5/T6)
  return (
    <SiteProvider>
      <RequireSiteGate>
        <AdminShell>{children}</AdminShell>
      </RequireSiteGate>
    </SiteProvider>
  );
}
