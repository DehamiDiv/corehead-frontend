"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "All Blogs", href: "/admin/blogs" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <nav className="flex items-center justify-between px-12 py-6">
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full" />
        </div>
        <span className="text-xl font-bold text-slate-800">CoreHead</span>
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
      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20">
        Logout
      </button>
    </nav>
  );
}
