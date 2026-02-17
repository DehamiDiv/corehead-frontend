"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FileText,
  Tags,
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
  Icon: any;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Posts", href: "/admin/posts", Icon: FileText },
      { label: "Categories", href: "/admin/categories", Icon: Tags },
      { label: "Media Library", href: "/admin/media", Icon: ImageIcon },
      { label: "Comments", href: "/admin/comments", Icon: MessageSquare },
      { label: "Users", href: "/admin/users", Icon: Users },
      { label: "Pages", href: "/admin/pages", Icon: File },
    ],
    []
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="h-screen w-[280px] bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          C
        </div>
        <span className="text-xl font-semibold text-slate-900">CoreHead</span>
      </div>

      {/* Nav */}
      <nav className="px-4 py-4 space-y-1">
        {navItems.map(({ label, href, Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition",
                active ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {/* icon chip */}
              <span
                className={[
                  "h-9 w-9 rounded-xl flex items-center justify-center border transition",
                  active
                    ? "bg-blue-50 border-blue-100 text-blue-600"
                    : "bg-white border-slate-200 text-slate-500",
                ].join(" ")}
              >
                <Icon size={18} />
              </span>

              <span className={active ? "text-blue-700" : ""}>{label}</span>
            </Link>
          );
        })}

        {/* Settings row (like your UI with dropdown) */}
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className="w-full mt-2 flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <span className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500">
              <SettingsIcon size={18} />
            </span>
            Settings
          </span>
          <ChevronDown size={16} className={settingsOpen ? "rotate-180 transition" : "transition"} />
        </button>

        {settingsOpen && (
          <div className="ml-4 mt-1 pl-3 border-l border-slate-200 space-y-1">
            <Link
              href="/admin/settings/general"
              className="block px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              General
            </Link>
            <Link
              href="/admin/settings/profile"
              className="block px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              Profile
            </Link>
          </div>
        )}
      </nav>

      {/* bottom profile circle (like your screenshot) */}
      <div className="mt-auto p-4">
        <button className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
          N
        </button>
      </div>
    </aside>
  );
}
