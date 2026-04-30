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
      { label: "Layouts",       href: "/admin/layouts",    Icon: LayoutTemplate },
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
      "fixed top-0 left-0 h-screen w-[250px] bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out",
      !isOpen && "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="h-20 px-5 flex items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="CoreHead Logo" 
            width={160} 
            height={48} 
            className="h-12 w-auto object-contain" 
            priority
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, href, Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-bold transition-all duration-200",
                active
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {/* icon chip */}
              <span
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200",
                  active
                    ? "bg-blue-100/50 text-blue-600"
                    : "bg-gray-50 text-gray-400 group-hover:bg-white border border-transparent group-hover:border-gray-100"
                )}
              >
                <Icon size={20} />
              </span>

              <span>{label}</span>
            </Link>
          );
        })}

        {/* Settings row */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200",
              settingsOpen && "bg-slate-50/30"
            )}
          >
            <span className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <SettingsIcon size={20} />
              </span>
              Settings
            </span>
            <ChevronDown
              size={18}
              className={cn("text-gray-400 transition-transform duration-300", settingsOpen && "rotate-180")}
            />
          </button>

          {settingsOpen && (
            <div className="mt-1 ml-2 space-y-0.5 animate-in slide-in-from-top-2 duration-300">
              {[
                { label: "Profile Settings", href: "/admin/settings/profile" },
                { label: "Website Settings", href: "/admin/settings/website" },
                { label: "Appearance",       href: "/admin/settings/appearance" },
              ].map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={cn(
                    "flex items-center gap-3 px-8 py-2 rounded-xl text-[14px] font-bold transition-all duration-200",
                    isActive(subItem.href)
                      ? "text-blue-600"
                      : "text-slate-800 hover:text-slate-900 hover:bg-slate-50/50"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    isActive(subItem.href) ? "bg-blue-600" : "bg-gray-300"
                  )} />
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

    </aside>
  );
}