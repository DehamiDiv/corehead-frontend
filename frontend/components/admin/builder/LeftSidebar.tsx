"use client";

import { MessageSquare, LayoutGrid, Bot, User, CornerDownLeft, Sparkles, AlertCircle } from "lucide-react";
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
  const { loadLayout } = useBuilder();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello! I can generate a full page layout for you. Just describe what you want — for example: \"A travel blog with a hero image and post grid\" or \"Tech blog with newsletter section\".",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);
    onAnalyze();

    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || !data.blocks) {
        throw new Error(data.error || "Failed to generate layout");
      }

      // Load the generated blocks into the canvas
      loadLayout(JSON.stringify(data.blocks));

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `✅ Done! I generated ${data.blocks.length} blocks for "${prompt}". You can now drag, reorder, and edit them on the canvas.`,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `❌ Sorry, something went wrong: ${err.message}`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      onDone();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600" />
          <h2 className="font-semibold text-slate-800">AI Layout Generator</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "ai" ? "bg-slate-100" : "bg-slate-800"
              }`}
            >
              {msg.role === "ai" ? (
                <Bot size={18} className={msg.error ? "text-red-500" : "text-slate-600"} />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : ""}`}>
              <span className="text-xs font-semibold text-slate-500">
                {msg.role === "ai" ? "Corehead AI" : "You"}
              </span>
              <div
                className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : msg.error
                    ? "bg-red-50 text-red-700 border border-red-100 rounded-tl-sm"
                    : "bg-slate-100 text-slate-700 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Bot size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex gap-1.5 pt-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Generating layout...</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt suggestions */}
      {messages.length === 1 && !loading && (
        <div className="px-4 pb-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Try these</p>
          <div className="flex flex-col gap-1.5">
            {[
              "A travel blog with hero image and posts",
              "Tech blog with newsletter section",
              "Food blog with recipes and tips",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-left text-[12px] px-3 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg border border-gray-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 mt-auto">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your page layout..."
            className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-[13px] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none min-h-[60px]"
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-300 hover:bg-blue-700 transition-colors"
          >
            <CornerDownLeft size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
