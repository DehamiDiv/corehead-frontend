"use client";

import { Search, PanelLeft, Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

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
    const token = localStorage.getItem("token");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // If profile data is missing, fetch it from backend
        if (!parsedUser.avatar || !parsedUser.name) {
           fetch('http://localhost:5000/api/auth/me', {
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

  const avatarSrc = user?.avatar 
    ? (user.avatar.startsWith('http') || user.avatar.startsWith('data:') ? user.avatar : `http://localhost:5000${user.avatar}`)
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left Side: Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search Blogs..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {/* User Profile */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer">
          <img
            src={avatarSrc}
            alt={user?.username || user?.name || "Admin User"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
