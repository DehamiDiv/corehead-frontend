"use client";

import {
  SendHorizontal,
  RotateCcw,
  Settings,
  Bell,
  User,
  Sparkles,
} from "lucide-react";

import { useBuilder } from "./BuilderContext";
import { useState } from "react";

export default function BottomBar() {
  const { generateLayout, isAnalyzing, setActiveSidebar } = useBuilder();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isAnalyzing) return;
    
    // Open chat sidebar to show progress/messages
    setActiveSidebar("chat");
    
    await generateLayout(prompt);
    setPrompt("");
  };

  return (
    <div className="h-16 bg-white border-t border-gray-200 flex items-center px-6 gap-4 sticky bottom-0 z-50">
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative flex items-center">
          <Sparkles className="absolute left-4 w-4 h-4 text-blue-500" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isAnalyzing}
            placeholder={isAnalyzing ? "AI is thinking..." : "Ask AI to design, write, or edit..."}
            className="w-full h-11 bg-white rounded-full border border-blue-100 pl-10 pr-12 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm disabled:bg-slate-50"
          />
          <button 
            type="submit"
            disabled={!prompt.trim() || isAnalyzing}
            className="absolute right-2 top-1.5 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-4 text-slate-400">
        <button className="hover:text-slate-600 transition-colors" title="Undo (Local Only)">
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

