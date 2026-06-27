"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear auth cookies
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Redirect to login page
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "All Blogs", href: "/admin/posts" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <nav className="flex items-center justify-between px-12 py-6">
      {/* Logo */}
      <Link href="/admin" className="flex items-center">
        <Image 
          src="/logo.png" 
          alt="CoreHead Logo" 
          width={160} 
          height={40} 
          className="h-10 w-auto object-contain" 
          priority
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-12">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base font-semibold transition-colors relative pb-1 ${
                isActive
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20"
      >
        Logout
      </button>
    </nav>
  );
}
