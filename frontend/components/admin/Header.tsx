"use client";

import { PanelLeft, Maximize, Minimize, Search } from "lucide-react";
import { useEffect, useState } from "react";
import SiteSwitcher from "@/components/admin/SiteSwitcher";
import VisitPublicSiteButton from "@/components/admin/VisitPublicSiteButton";
import { getApiBaseUrl, resolveAdminMediaUrl } from "@/lib/apiOrigin";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

        {/* User Profile — perfect circle */}
        <a
          href="/admin/settings/profile"
          title={displayName}
          className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border-2 border-white ring-2 ring-slate-200/80 shadow-sm hover:ring-blue-400 transition-all bg-slate-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt={displayName}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </a>
      </div>
    </header>
  );
}
