"use client";

import { LogOut, Maximize, Minimize, PanelLeft, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteSwitcher from "@/components/admin/SiteSwitcher";
import VisitPublicSiteButton from "@/components/admin/VisitPublicSiteButton";
import { getApiBaseUrl, resolveAdminMediaUrl } from "@/lib/apiOrigin";
import { clearSession } from "@/lib/authSession";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // If profile data is missing, fetch it from backend
        if ((!parsedUser.avatar && !parsedUser.image) || !parsedUser.name) {
          if (!token) return;
          fetch(`${getApiBaseUrl()}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              if (data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
              }
            })
            .catch(err => console.error("Error fetching user profile:", err));
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const displayName = user?.username || user?.name || "Admin";
  const avatarSrc =
    resolveAdminMediaUrl(user?.avatar || user?.image) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&bold=true&size=128`;

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    clearSession();
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="h-[68px] bg-white border-b border-slate-100 flex items-center justify-between px-[24px] sticky top-0 z-40 max-w-[1700px] mx-auto w-full">
      {/* Left Side: Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center bg-slate-50 rounded-xl px-4 h-[40px] w-[350px] border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-sm">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search blogs and posts..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700 font-medium"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Multi-tenant site switcher (T7) */}
        <SiteSwitcher />
        <VisitPublicSiteButton
          className="hidden md:inline-flex items-center gap-1.5 px-3 h-10 rounded-xl border border-slate-100 bg-white text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
          label="Visit site"
        />

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {/* Profile and session actions */}
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            title={displayName}
            aria-label={`Open account menu for ${displayName}`}
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((open) => !open)}
            className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm ring-2 ring-slate-200/80 transition-all hover:ring-blue-400 focus-visible:outline-none focus-visible:ring-blue-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={displayName}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </button>

          {isProfileMenuOpen && (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-full z-[120] mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15"
            >
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                {user?.email && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
                )}
              </div>

              <Link
                href="/admin/settings/profile"
                role="menuitem"
                onClick={() => setIsProfileMenuOpen(false)}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <UserRound className="h-4 w-4" />
                My Account
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
