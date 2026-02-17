"use client";

import { SendHorizontal, RotateCcw, Settings, Bell, User } from "lucide-react";

export default function BottomBar() {
  return (
    <div className="h-16 bg-white border-t border-gray-200 flex items-center px-6 gap-4 sticky bottom-0 z-50">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Describe changes or additions..."
          className="w-full h-10 bg-slate-100 rounded-full border border-transparent px-6 text-sm focus:outline-none focus:bg-white focus:border-blue-300 transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        <button className="hover:text-blue-600 transition-colors">
          <SendHorizontal className="w-5 h-5" />
        </button>
        <button className="hover:text-slate-600 transition-colors">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button className="hover:text-slate-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </button>
        <button className="hover:text-slate-600 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
