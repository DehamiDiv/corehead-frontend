"use client";

import React, { useState, useEffect } from "react";
import EditorHeader from "@/components/admin/builder/EditorHeader";
import LeftSidebar from "@/components/admin/builder/LeftSidebar";
import SettingsPanel from "@/components/admin/builder/SettingsPanel";
import Canvas from "@/components/admin/builder/Canvas";
import BottomBar from "@/components/admin/builder/BottomBar";
import { BuilderProvider } from "@/components/admin/builder/BuilderContext";
import { Sparkles } from "lucide-react";

export default function BuilderPage() {
  const [isLaunching, setIsLaunching] = useState(true);

  useEffect(() => {
    // Premium launch delay to show animation
    const timer = setTimeout(() => {
      setIsLaunching(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (isLaunching) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.3)] flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
            <Sparkles className="w-12 h-12 text-blue-600 relative z-10" />
          </div>
          
          <h1 className="text-white text-3xl font-black tracking-tighter mb-2 italic">
            CORE<span className="text-blue-500">HEAD</span>
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-blue-500" />
             <p className="text-blue-200/50 font-bold uppercase tracking-[0.3em] text-[10px]">Launching Visual Builder</p>
             <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-blue-500 rounded-full animate-progress-loading" style={{ width: '100%' }} />
        </div>

        <style jsx>{`
          @keyframes progress-loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-progress-loading {
            animation: progress-loading 1.8s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <BuilderProvider>
      <div className="flex flex-col h-screen bg-white animate-in fade-in duration-500">
        <EditorHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar (Icon Rail + Chat / Blocks / Settings) */}
          <LeftSidebar />

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col bg-slate-50 relative">
            <Canvas />
            <BottomBar />
          </div>

          {/* Right Sidebar */}
          <SettingsPanel />
        </div>
      </div>
    </BuilderProvider>
  );
}
