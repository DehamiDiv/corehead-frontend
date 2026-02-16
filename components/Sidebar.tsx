"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FileText,
  Folder,
  Image as ImageIcon,
  MessageSquare,
  Users,
  File,
  Settings as SettingsIcon,
  ChevronDown,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Posts", href: "/admin/posts", icon: <FileText size={18} /> },
      { label: "Categories", href: "/admin/categories", icon: <Folder size={18} /> },
      { label: "Media Library", href: "/admin/media", icon: <ImageIcon size={18} /> },
      { label: "Comments", href: "/admin/comments", icon: <MessageSquare size={18} /> },
      { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
      { label: "Pages", href: "/admin/pages", icon: <File size={18} /> },
    ],
    []
  );

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="h-screen w-[260px] bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-2 border-b border-slate-100">
        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
          {/* replace with your logo svg/image later */}
          <span className="font-bold text-slate-700">C</span>
        </div>
        <span className="text-lg font-semibold text-slate-800">CoreHead</span>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <span
                className={[
                  "flex items-center justify-center",
                  active ? "text-slate-900" : "text-slate-500",
                ].join(" ")}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings (bottom) */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <span className="flex items-center gap-3">
            <SettingsIcon size={18} className="text-slate-500" />
            Settings
          </span>
          <ChevronDown
            size={16}
            className={["transition", settingsOpen ? "rotate-180" : ""].join(" ")}
          />
        </button>

        {settingsOpen && (
          <div className="mt-1 ml-2 pl-2 border-l border-slate-200 space-y-1">
            <Link
              href="/admin/settings/general"
              className={[
                "block px-4 py-2 rounded-lg text-sm transition",
                pathname === "/admin/settings/general"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              General
            </Link>
            <Link
              href="/admin/settings/profile"
              className={[
                "block px-4 py-2 rounded-lg text-sm transition",
                pathname === "/admin/settings/profile"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
