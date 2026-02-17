"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Settings,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Posts", href: "/admin/blogs" },
  { icon: FileCode, label: "Snippets", href: "/admin/snippets" },
  { icon: Tags, label: "Categories", href: "/admin/categories" },
  { icon: ImageIcon, label: "Media Library", href: "/admin/media" },
  { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="text-xl font-bold text-slate-800">CoreHead</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-blue-600" : "text-gray-400",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User/Footer Area (Optional) */}
      <div className="p-4 border-t border-gray-50">
        {/* Could add logout or simple user info here if not in header */}
      </div>
    </aside>
  );
}
