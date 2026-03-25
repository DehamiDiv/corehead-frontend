"use client";

import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search Blogs..."
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications (Optional) */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Admin User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
