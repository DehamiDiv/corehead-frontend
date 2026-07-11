"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  FileText,
  Tags,
  Image as ImageIcon,
  MessageSquare,
  Users,
  File,
  Settings as SettingsIcon,
  ChevronDown,
  LayoutTemplate,
  Sparkles,
  PanelLeft,
  Globe2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isPlatformAdmin } from "@/lib/rbac";

type NavItem = {
  label: string;
  href: string;
  Icon: any;
  /** Platform super-admin only (not site owners) */
  platformAdminOnly?: boolean;
};

export default function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [user, setUser] = useState<{ name?: string; role?: string; email?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, []);

  const navItems: NavItem[] = useMemo(
    () => {
      // R1-1: site CMS menus available to all site operators (not only platform admin).
      // R1-2: only Users is platformAdminOnly.
      const allItems: NavItem[] = [
        { label: "AI Generator",    href: "/ai-prompt",        Icon: Sparkles       },
        { label: "My Sites",        href: "/admin/sites",      Icon: Globe2         },
        { label: "Team",            href: "/admin/team",       Icon: UserPlus       },
        { label: "Posts",           href: "/admin/posts",      Icon: FileText       },
        { label: "Layouts",         href: "/admin/layouts",    Icon: LayoutTemplate },
        { label: "Template Assign", href: "/admin/template-assignment", Icon: LayoutTemplate },
        { label: "Visual Builder",  href: "/admin/builder",    Icon: PanelLeft      },
        { label: "Categories",      href: "/admin/categories", Icon: Tags           },
        { label: "Media Library",   href: "/admin/media",      Icon: ImageIcon      },
        { label: "Interactions",    href: "/admin/comments",   Icon: MessageSquare  },
        // R3-1: site-scoped custom HTML pages
        { label: "Pages",           href: "/admin/pages",      Icon: File           },
        { label: "Users",           href: "/admin/users",      Icon: Users,          platformAdminOnly: true },
      ];

      if (!isPlatformAdmin(user?.role)) {
        return allItems.filter((item) => !item.platformAdminOnly);
      }
      return allItems;
    },
    [user?.role]
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-screen w-[250px] bg-white flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-slate-50",
      !isOpen && "-translate-x-full"
    )}>
      {/* Logo Section */}
      <div className="h-[100px] px-5 flex items-center justify-center">
        <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/logo.png"
            alt="CoreHead Logo"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, href, Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 h-[48px] rounded-xl transition-all duration-200 group",
                active
                  ? "bg-[#E8F0FE] text-[#2563EB]"
                  : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200",
                  active
                    ? "bg-[#C6D9FB] text-[#2563EB]"
                    : "bg-slate-50 text-slate-400 group-hover:bg-white border border-transparent group-hover:border-gray-100"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>

              <span className={cn(
                "text-[14px] font-bold tracking-tight",
                active ? "text-[#2563EB]" : "text-[#1E293B]"
              )}>{label}</span>
            </Link>
          );
        })}

        {/* Settings Dropdown */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-3 h-[48px] rounded-xl transition-all duration-200 group",
              settingsOpen ? "text-[#1E293B]" : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
            )}
          >
            <span className="flex items-center gap-3">
              <div className="h-8 w-8 flex items-center justify-center">
                <SettingsIcon size={20} strokeWidth={2} />
              </div>
              <span className="text-[14px] font-bold tracking-tight">Settings</span>
            </span>
            <ChevronDown
              size={16}
              className={cn("text-slate-400 transition-transform duration-300", settingsOpen && "rotate-180")}
            />
          </button>

          {settingsOpen && (
            <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
              {[
                { label: "Profile Settings", href: "/admin/settings/profile" },
                { label: "Website Settings", href: "/admin/settings/website" },
                { label: "Appearance",      href: "/admin/settings/appearance" },
              ].map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={cn(
                    "flex items-center gap-3 px-10 h-[38px] rounded-lg text-[13px] font-bold transition-all duration-200",
                    isActive(subItem.href)
                      ? "text-[#2563EB] bg-blue-50/50"
                      : "text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50/50"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isActive(subItem.href) ? "bg-[#2563EB]" : "bg-slate-300"
                  )} />
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Profile Footer */}
      <div className="p-6 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-[11px] text-slate-400 truncate uppercase tracking-tight font-semibold">
              {user?.role || "Account"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}