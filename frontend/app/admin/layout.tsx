"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
      const isBuilderPath = pathname?.startsWith("/admin/builder");
      
      // Allow admins to everything, allow authors only to the builder
      if (user.role === "admin" || (user.role === "author" && isBuilderPath)) {
        setIsAuthorized(true);
      } else {
        router.push("/"); // Unauthorized users go to home
      }
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

  const isDashboard = pathname === "/admin";
  const isBuilder = pathname?.startsWith("/admin/builder");

  if (isDashboard || isBuilder) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}