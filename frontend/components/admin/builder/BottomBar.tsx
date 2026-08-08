"use client";

import {
  SendHorizontal,
  RotateCcw,
  User,
  Sparkles,
} from "lucide-react";

import { useBuilder } from "./BuilderContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BottomBar() {
  const { generateLayout, isAnalyzing, setActiveSidebar, blocks, removeBlock } = useBuilder();
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  // Undo: remove the last added block
  const handleUndo = () => {
    if (blocks.length === 0) return;
    const lastBlock = blocks[blocks.length - 1];
    removeBlock(lastBlock.id);
  };

  // User: navigate to profile settings
  const handleUser = () => {
    router.push("/admin/settings/profile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isAnalyzing) return;
    
    // Open chat sidebar to show progress/messages
    setActiveSidebar("chat");
    
    await generateLayout(prompt);
    setPrompt("");
  };

  return (
    <div className="h-20 bg-white border-t border-slate-100 flex items-center px-8 gap-6 sticky bottom-0 z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <form onSubmit={handleSubmit} className="flex-1 max-w-3xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
        <div className="relative flex items-center">
          <div className="absolute left-4 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isAnalyzing}
            placeholder={isAnalyzing ? "AI is crafting your vision..." : "Ask AI to design, write, or refine your layout..."}
            className="w-full h-12 bg-slate-50 border border-slate-200 pl-14 pr-14 text-[14px] font-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-400 shadow-sm disabled:bg-slate-100"
          />
          <button 
            type="submit"
            disabled={!prompt.trim() || isAnalyzing}
            className="absolute right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-90 disabled:opacity-30"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-6 text-slate-400 relative">
        <button onClick={handleUndo} className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Undo last block">
          <RotateCcw className="w-6 h-6" />
        </button>
        <div className="w-px h-8 bg-slate-100 mx-1" />
        <button onClick={handleUser} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all overflow-hidden border-2 border-transparent hover:border-blue-100" title="Profile Settings">
           <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

