"use client";

import { Layout } from "lucide-react"; // Placeholder icon

export default function SettingsPanel() {
  return (
    <aside className="w-72 bg-slate-50 border-l border-gray-200 flex flex-col p-4 h-[calc(100vh-64px)]">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Component Settings
      </h3>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-200/50 rounded-lg mb-8">
        {["Content", "Style", "Advanced"].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${i === 0 ? "bg-white text-slate-800 shadow-sm border border-gray-200" : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
        <Layout className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-sm text-slate-500">
          Select a blog component to adjust its content and style settings
        </p>
      </div>
    </aside>
  );
}
