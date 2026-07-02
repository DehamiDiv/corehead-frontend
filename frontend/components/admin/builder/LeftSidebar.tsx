"use client";

import { MessageSquare, LayoutGrid, Bot, User, CornerDownLeft, Sparkles, AlertCircle } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import Toolbox from "./Toolbox";
import { useState } from "react";
import { api } from "@/lib/api";

export default function LeftSidebar() {
  const { activeSidebar, setActiveSidebar, setIsAnalyzing } = useBuilder();

  return (
    <div className="flex h-full bg-slate-50 border-r border-slate-200/60 shadow-sm relative z-40">
      {/* Icon Rail */}
      <div className="w-16 flex flex-col items-center py-6 gap-6 border-r border-slate-100 bg-[#f8fafc]">
        <button
          onClick={() => setActiveSidebar("chat")}
          className={`p-3 rounded-2xl transition-all duration-300 relative group ${
            activeSidebar === "chat"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          }`}
          title="AI Assistant"
        >
          <MessageSquare size={22} />
          {activeSidebar === "chat" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[2px_0_10px_rgba(37,99,235,0.4)]" />
          )}
        </button>
        <button
          onClick={() => setActiveSidebar("blocks")}
          className={`p-3 rounded-2xl transition-all duration-300 relative group ${
            activeSidebar === "blocks"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          }`}
          title="Drag & Drop Blocks"
        >
          <LayoutGrid size={22} />
          {activeSidebar === "blocks" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[2px_0_10px_rgba(37,99,235,0.4)]" />
          )}
        </button>
      </div>

      {/* Active Panel */}
      <div className="w-80 bg-white flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        {activeSidebar === "chat" ? (
          <ChatPanel onAnalyze={() => setIsAnalyzing(true)} onDone={() => setIsAnalyzing(false)} />
        ) : activeSidebar === "blocks" ? (
          <Toolbox />
        ) : null}
      </div>
    </div>
  );
}

// ─── Message type ───────────────────────────────────────────────
type Message = {
  role: "ai" | "user";
  text: string;
  error?: boolean;
};

// ─── Chat Panel ────────────────────────────────────────────────
function ChatPanel({ onAnalyze, onDone }: { onAnalyze: () => void; onDone: () => void }) {
  const { loadLayout, generateLayout } = useBuilder();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello! I'm your CoreHead AI assistant. Describe the page you want to build, and I'll generate a premium layout for you instantly.",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);
    onAnalyze();
    try {
      const provider = await generateLayout(prompt);

      const providerLabel = provider === 'groq' ? '⚡ Groq AI' 
        : provider === 'gemini' ? '✨ Gemini AI' 
        : '🔧 CoreHead Engine';

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Done! I've crafted a custom layout using ${providerLabel}. You can now drag, reorder, and edit the blocks.`,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Error: ${err.message}`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      onDone();
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Sparkles size={18} />
          </div>
          <h2 className="font-bold text-slate-900 tracking-tight text-lg">AI Assistant</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === "ai" ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
              }`}
            >
              {msg.role === "ai" ? (
                <Bot size={20} className={msg.error ? "text-red-400" : "text-blue-400"} />
              ) : (
                <User size={18} />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : ""}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : msg.error
                    ? "bg-red-50 text-red-700 border border-red-100 rounded-tl-none"
                    : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100/50"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div className="flex items-center gap-1.5 px-4 bg-slate-50 rounded-2xl border border-slate-100 h-10">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-50">
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your design request..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none min-h-[80px]"
            rows={2}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
          >
            <CornerDownLeft size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
