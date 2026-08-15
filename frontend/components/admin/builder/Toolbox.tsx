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
  Video,
  Mail,
  Share2,
  MoveVertical,
  Code,
} from "lucide-react";
import Link from "next/link";
import { useBuilder, BlockType } from "./BuilderContext";

const tools = [
  { icon: Type, label: "Heading" },
  { icon: AlignLeft, label: "Paragraph" },
  { icon: ImageIcon, label: "Image" },
  { icon: Quote, label: "Quote" },
  { icon: Minus, label: "Divider" },
  { icon: Square, label: "Button" },
  { icon: LayoutGrid, label: "Container" },
  { icon: LayoutGrid, label: "Columns" },
  { icon: List, label: "Collection List" },
  { icon: ImageIcon, label: "Featured Carousel" },
  { icon: Video, label: "Video" },
  { icon: Mail, label: "Newsletter" },
  { icon: Share2, label: "Social Links" },
  { icon: MoveVertical, label: "Spacer" },
  { icon: Code, label: "Code Block" },
];

const bottomTools = [
  { icon: Settings, label: "Blog settings" },
  { icon: LayoutGrid, label: "Categories & Tags" },
];

export default function Toolbox() {
  const { blocks, selectedBlockId, addBlock } = useBuilder();

  const handleToolClick = (toolLabel: string) => {
    const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
    if (selectedBlock) {
      const levelBlocks = blocks.filter(
        (b) => b.parentId === selectedBlock.parentId || (!b.parentId && !selectedBlock.parentId)
      );
      const targetIndex = levelBlocks.findIndex((b) => b.id === selectedBlock.id) + 1;
      addBlock(toolLabel as BlockType, selectedBlock.parentId, targetIndex);
    } else {
      addBlock(toolLabel as BlockType);
    }
  };

  return (
    <aside className="w-full flex-1 flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Blog Components
        </h3>
        <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
          Drag or Click
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {tools.map((tool) => (
          <div
            key={tool.label}
            draggable
            onClick={() => handleToolClick(tool.label)}
            onDragStart={(e) => {
              e.dataTransfer.setData("application/react-dnd", tool.label);
              e.dataTransfer.effectAllowed = "copy";
            }}
            title="Drag to place anywhere, or click to insert"
            className="flex flex-col items-center justify-center gap-2.5 p-4 bg-gradient-to-br from-white to-blue-50/30 border border-blue-100/50 rounded-2xl cursor-grab hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all group active:cursor-grabbing"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <tool.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <span className="font-bold text-[12px] text-slate-600 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{tool.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
        {bottomTools.map((tool) => {
          if (tool.label === "Blog settings") {
            return (
              <Link
                key={tool.label}
                href="/admin/builder/settings"
                className="flex items-center gap-3 p-2 text-slate-600 hover:bg-blue-100/50 hover:text-blue-700 rounded-lg w-full text-base font-medium transition-colors"
              >
                <tool.icon className="w-5 h-5" />
                {tool.label}
              </Link>
            );
          }
          if (tool.label === "Categories & Tags") {
            return (
              <Link
                key={tool.label}
                href="/admin/builder/taxonomy"
                className="flex items-center gap-3 p-2 text-slate-600 hover:bg-blue-100/50 hover:text-blue-700 rounded-lg w-full text-base font-medium transition-colors"
              >
                <tool.icon className="w-5 h-5" />
                {tool.label}
              </Link>
            );
          }
          return (
            <button
              key={tool.label}
              className="flex items-center gap-3 p-2 text-slate-600 hover:bg-blue-100/50 hover:text-blue-700 rounded-lg w-full text-base font-medium transition-colors"
            >
              <tool.icon className="w-5 h-5" />
              {tool.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
