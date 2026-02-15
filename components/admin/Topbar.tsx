"use client";

import { Search, PanelLeft, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Blogs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-0 focus:bg-gray-100 transition-colors text-gray-600 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
          {/* Replace with actual User Avatar image or component */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
