"use client";

import { Search, Bell, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Blogs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-600 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
        </button> */}
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
          {/* Replace with actual User Avatar image or component */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
