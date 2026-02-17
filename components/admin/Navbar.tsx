"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react"; // Using MessageSquare as a placeholder logo icon if needed, but design has text

export default function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "All Blogs", href: "/admin/blogs" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-blue-300/10 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="text-xl font-bold text-slate-800">CoreHead</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
        Logout
      </button>
    </nav>
  );
}
