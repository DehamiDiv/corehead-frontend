"use client";

import { MessageSquare, LayoutGrid, Bot, User, CornerDownLeft } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import Toolbox from "./Toolbox";
import { useState } from "react";

export default function LeftSidebar() {
  const { activeSidebar, setActiveSidebar, setIsAnalyzing } = useBuilder();

  return (
    <div className="flex h-full bg-white border-r border-gray-200 shadow-sm relative z-40">
      {/* Icon Rail */}
      <div className="w-14 flex flex-col items-center py-4 gap-4 border-r border-gray-100 bg-slate-50">
        <button
          onClick={() => setActiveSidebar("chat")}
          className={`p-2.5 rounded-xl transition-all ${
            activeSidebar === "chat"
              ? "bg-blue-100 text-blue-700 shadow-sm"
              : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          }`}
          title="AI Assistant"
        >
          <MessageSquare size={20} />
        </button>
        <button
          onClick={() => setActiveSidebar("blocks")}
          className={`p-2.5 rounded-xl transition-all ${
            activeSidebar === "blocks"
              ? "bg-blue-100 text-blue-700 shadow-sm"
              : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          }`}
          title="Drag & Drop Blocks"
        >
          <LayoutGrid size={20} />
        </button>
      </div>

      {/* Active Panel */}
      <div className="w-72 bg-white flex flex-col">
        {activeSidebar === "chat" ? (
          <ChatPanel onAnalyze={() => setIsAnalyzing(true)} />
        ) : activeSidebar === "blocks" ? (
          <Toolbox />
        ) : null}
      </div>
    </div>
  );
}

function ChatPanel({ onAnalyze }: { onAnalyze: () => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Trigger analyzing overlay animation 
    onAnalyze();
    
    // Reset input for demo
    setTimeout(() => {
      setInput("");
    }, 500);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">AI Assistant</h2>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* AI Hello */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
             <Bot size={18} className="text-slate-600" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500">Corehead AI</span>
            <div className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed">
              Hello! I can help you generate a website or add new sections. What would you like to build today?
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-white">
             <User size={16} />
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-semibold text-slate-500">You</span>
            <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] leading-relaxed max-w-[90%]">
              Create a website for My bakery
            </div>
          </div>
        </div>

        {/* AI Typing equivalent state */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
             <Bot size={18} className="text-blue-600" />
          </div>
          <div className="flex flex-col justify-center">
             <div className="flex gap-1.5 pt-2">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        </div>

      </div>

      {/* Input Area */}
      <div className="p-3 bg-white mt-auto">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your website or request changes..."
            className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-[13px] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none min-h-[60px]"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-300 hover:bg-blue-700 transition-colors"
          >
             <CornerDownLeft size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
