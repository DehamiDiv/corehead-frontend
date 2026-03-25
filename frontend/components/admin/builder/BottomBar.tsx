"use client";

import {
  SendHorizontal,
  RotateCcw,
  Settings,
  Bell,
  User,
  Sparkles,
} from "lucide-react";

export default function BottomBar() {
  return (
    <div className="h-16 bg-white border-t border-gray-200 flex items-center px-6 gap-4 sticky bottom-0 z-50">
      <div className="flex-1 max-w-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative flex items-center">
          <Sparkles className="absolute left-4 w-4 h-4 text-blue-500" />
          <input
            type="text"
            placeholder="Ask AI to design, write, or edit..."
            className="w-full h-11 bg-white rounded-full border border-blue-100 pl-10 pr-6 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
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
