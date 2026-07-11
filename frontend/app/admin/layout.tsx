"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { SiteProvider, useOptionalSite } from "@/components/admin/SiteContext";
import { canAccessAdminPath, canAccessSiteCms } from "@/lib/rbac";
import { Loader2 } from "lucide-react";

/**
 * T5/T16: Zero sites → friendly empty state, then send to create-site wizard.
 */
function RequireSiteGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const siteCtx = useOptionalSite();

  useEffect(() => {
    if (!siteCtx || siteCtx.loading) return;
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
