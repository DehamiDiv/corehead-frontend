"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Home, FileText, Settings, Layout } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const navItems = [
    { label: "All Blogs", href: "/admin/blogs", icon: FileText },
    { label: "Builder", href: "/builder", icon: Layout },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-full flex justify-center pt-8 px-6">
      <nav className="w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <Link href="/admin" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="CoreHead Logo" 
            width={140} 
            height={36} 
            className="h-10 w-auto object-contain" 
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="hidden sm:flex text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest px-3"
          >
            Visit Site
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 border border-transparent hover:border-red-100"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}
