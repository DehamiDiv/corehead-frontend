"use client";

import {
  Type,
  AlignLeft,
  Image as ImageIcon,
  Quote,
  Minus,
  Square,
  List,
  Settings,
  LayoutGrid,
} from "lucide-react";

const tools = [
  { icon: Type, label: "Heading" },
  { icon: AlignLeft, label: "Paragraph" },
  { icon: ImageIcon, label: "Image" },
  { icon: Quote, label: "Quote" },
  { icon: Minus, label: "Divider" },
  { icon: Square, label: "Button" },
  { icon: List, label: "Collection List" },
];

const bottomTools = [
  { icon: Settings, label: "Blog settings" },
  { icon: LayoutGrid, label: "Categories & Tags" },
];

export default function Toolbox() {
  return (
    <aside className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col p-4 h-[calc(100vh-64px)] overflow-y-auto">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
        Blog Components
      </h3>
      <div className="space-y-3 mb-8">
        {tools.map((tool) => (
          <div
            key={tool.label}
            className="flex items-center gap-3 p-3.5 bg-blue-500 text-white rounded-lg cursor-grab hover:bg-blue-600 hover:shadow-md transition-all shadow-sm group border border-transparent"
          >
            <tool.icon className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors" />
            <span className="font-medium text-base">{tool.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
        {bottomTools.map((tool) => (
          <button
            key={tool.label}
            className="flex items-center gap-3 p-2 text-slate-600 hover:bg-blue-100/50 hover:text-blue-700 rounded-lg w-full text-base font-medium transition-colors"
          >
            <tool.icon className="w-5 h-5" />
            {tool.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
