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
import { resolveAdminMediaUrl } from "@/lib/apiOrigin";

type NavItem = {
  label: string;
  href: string;
  Icon: any;
  /** Platform super-admin only (not site owners) */
  platformAdminOnly?: boolean;
};

export default function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();
  const pathnameNormalized = pathname || "";
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [user, setUser] = useState<{
    name?: string;
    role?: string;
    email?: string;
    avatar?: string;
    image?: string;
  } | null>(null);
  const [credits, setCredits] = useState<{ total: number; used: number; status: string } | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setCredits({
            total: parsed.ai_credits ?? 5,
            used: parsed.ai_credits_used ?? 0,
            status: parsed.subscription_status ?? "FREE"
          });
        } catch (e) {
          console.error("Error parsing user inside Sidebar handler:", e);
        }
      }
    };

    handleStorageChange();

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            setCredits({
              total: data.user.ai_credits ?? 5,
              used: data.user.ai_credits_used ?? 0,
              status: data.user.subscription_status ?? "FREE"
            });
          }
        })
        .catch(err => console.error("Error updating user info in Sidebar:", err));
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  const displayName = user?.name || user?.email || "Admin";
  const avatarSrc =
    resolveAdminMediaUrl(user?.avatar || user?.image) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=fff&bold=true&size=128`;

  const navItems: NavItem[] = useMemo(
    () => {
      // R1-1: site CMS menus available to all site operators (not only platform admin).
      // R1-2: only Users is platformAdminOnly.
      const allItems: NavItem[] = [
        { label: "AI Generator", href: "/ai-prompt", Icon: Sparkles },
        { label: "My Sites", href: "/admin/sites", Icon: Globe2 },
        { label: "Team", href: "/admin/team", Icon: UserPlus },
        { label: "Posts", href: "/admin/posts", Icon: FileText },
        { label: "Layouts", href: "/admin/layouts", Icon: LayoutTemplate },
        { label: "Template Assign", href: "/admin/template-assignment", Icon: LayoutTemplate },
        { label: "Visual Builder", href: "/admin/builder", Icon: PanelLeft },
        { label: "Categories", href: "/admin/categories", Icon: Tags },
        { label: "Media Library", href: "/admin/media", Icon: ImageIcon },
        { label: "Interactions", href: "/admin/comments", Icon: MessageSquare },
        // R3-1: site-scoped custom HTML pages
        { label: "Pages", href: "/admin/pages", Icon: File },
        { label: "Users", href: "/admin/users", Icon: Users, platformAdminOnly: true },
      ];

      if (!isPlatformAdmin(user?.role)) {
        return allItems.filter((item) => !item.platformAdminOnly);
      }
      return allItems;
    },
    [user?.role]
  );

  const isActive = (href: string) => {
    const currentPath = pathname || "";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

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
                { label: "Appearance", href: "/admin/settings/appearance" },
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

      {/* Credit & Plan Info */}
      <div className="px-6 py-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 space-y-3.5 border border-slate-100/50">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-500">Plan Option</span>
            <span className={cn(
              "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
              credits?.status === "PRO" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"
            )}>
              {credits?.status || "FREE"}
            </span>
          </div>
          {credits?.status !== "PRO" && (
            <>
              <div className="space-y-1.5Packed">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                  <span>AI Generations</span>
                  <span>{Math.min(credits?.used ?? 0, credits?.total ?? 5)} / {credits?.total ?? 5} used</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(((credits?.used ?? 0) / (credits?.total ?? 5)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <Link
                href="/pricing"
                className="block text-center text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:underline pt-0.5"
              >
                Upgrade to PRO 🚀
              </Link>
            </>
          )}
          {credits?.status === "PRO" && (
            <p className="text-[11px] text-amber-700 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Unlimited AI Enabled
            </p>
          )}
        </div>
      </div>
      <div className="p-6 border-t border-slate-50 mt-auto">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-3 py-2.5 px-4 bg-white/50 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Back to Landing Page
        </Link>
        <Link
          href="/admin/settings/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
        >
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border-2 border-white ring-2 ring-slate-200 shadow-sm bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={displayName}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-[11px] text-slate-400 truncate uppercase tracking-tight font-semibold">
              {user?.role || "Account"}
            </p>
          </div>
        </Link>
      </div>
    </aside >
  );
}
