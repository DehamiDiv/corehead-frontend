"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
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
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  Icon: any;
};

const settingsSubItems = [
  { label: "Profile Settings",  href: "/admin/settings?tab=profile"    },
  { label: "Website Settings",  href: "/admin/settings?tab=general"    },
  { label: "Appearance",        href: "/admin/settings?tab=appearance"  },
];

function SidebarContent() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const currentTab   = searchParams.get("tab");

  const [settingsOpen, setSettingsOpen] = useState(true);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Posts",         href: "/admin/posts",      Icon: FileText       },
      { label: "Categories",    href: "/admin/categories", Icon: Tags           },
      { label: "Media Library", href: "/admin/media",      Icon: ImageIcon      },
      { label: "Interactions",  href: "/admin/comments",   Icon: MessageSquare  },
      { label: "Users",         href: "/admin/users",      Icon: Users          },
      { label: "Pages",         href: "/admin/pages",      Icon: File           },
    ],
    []
  );

  // For normal nav items: match pathname only
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // For settings sub-items: match pathname AND tab query param
  const isSettingsSubActive = (href: string) => {
    const [path, query] = href.split("?");
    const tab = query?.split("=")[1];
    return pathname === path && currentTab === tab;
  };

  // Settings section is "active" when on /admin/settings
  const isSettingsActive = pathname === "/admin/settings";

  return (
    <aside className="fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Logo */}
      <div className="h-24 px-8 flex items-center gap-3">
        <div className="relative h-10 w-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-6 opacity-20"></div>
          <div className="relative h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl italic">C</span>
          </div>
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">CoreHead</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[15px] font-semibold transition-all duration-200",
                active
                  ? "bg-blue-50/50 text-blue-600 shadow-sm shadow-blue-50/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  active
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                <Icon size={20} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Settings accordion */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-[15px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200",
              isSettingsActive && "bg-slate-50/30"
            )}
          >
            <span className="flex items-center gap-3">
              <span
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  isSettingsActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                <SettingsIcon size={20} />
              </span>
              Settings
            </span>
            <ChevronDown
              size={18}
              className={cn(
                "text-gray-400 transition-transform duration-300",
                settingsOpen && "rotate-180"
              )}
            />
          </button>

          {settingsOpen && (
            <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
              {settingsSubItems.map((subItem) => {
                const active = isSettingsSubActive(subItem.href);
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-3 px-10 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                      active
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        active ? "bg-blue-600" : "bg-gray-300"
                      )}
                    />
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Profile/Footer */}
      <div className="p-6 border-t border-gray-50">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Dehami Div</p>
            <p className="text-[11px] text-slate-400 truncate">Admin Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense>
      <SidebarContent />
    </Suspense>
  );
}