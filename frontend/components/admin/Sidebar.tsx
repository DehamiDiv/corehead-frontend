"use client";

import Image from "next/image";
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
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  Icon: any;
};

export default function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();
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
                    : "text-[#64748B] group-hover:text-[#1E293B]"
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
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Version Footer */}
      <div className="p-6 mt-auto">
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
           v1.0.0 Stable
        </div>
      </div>
    </aside>
  );
}