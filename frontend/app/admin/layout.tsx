"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      const isAdmin = user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "administrator";
      const isAuthor = user.role?.toLowerCase() === "author" || user.role?.toLowerCase() === "editor" || user.role?.toLowerCase() === "user";
      
      // Allow admins to everything, allow authors/editors/users only to the builder
      if (isAdmin || (isAuthor && isBuilderPath)) {
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
    <div className="flex min-h-screen bg-[#e8f1f9]">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-[250px]' : 'ml-0'}`}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}