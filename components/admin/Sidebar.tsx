"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutList,
  Tags,
  Image,
  MessageSquare,
  Users,
  FileText,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I will use inline class merging or create it

const sidebarItems = [
  { icon: LayoutList, label: "Posts", href: "/admin/blogs" },
  { icon: Tags, label: "Categories", href: "/admin/categories" },
  { icon: Image, label: "Media Library", href: "/admin/media" },
  { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: FileText, label: "Pages", href: "/admin/pages" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 left-0 z-40">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          C
        </div>
        <span className="text-xl font-bold text-gray-900">CoreHead</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                isActive &&
                  "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {item.label}
            </Link>
          );
        })}

        <button className="w-full flex items-center justify-between px-4 py-3 mt-4 rounded-xl transition-colors font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </nav>
    </aside>
  );
}
