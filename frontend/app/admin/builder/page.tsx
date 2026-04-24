"use client";

import EditorHeader from "@/components/admin/builder/EditorHeader";
import LeftSidebar from "@/components/admin/builder/LeftSidebar";
import SettingsPanel from "@/components/admin/builder/SettingsPanel";
import Canvas from "@/components/admin/builder/Canvas";
import BottomBar from "@/components/admin/builder/BottomBar";
import { BuilderProvider } from "@/components/admin/builder/BuilderContext";

export default function BuilderPage() {
  return (
    <BuilderProvider>
      <div className="flex flex-col h-screen bg-white">
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
