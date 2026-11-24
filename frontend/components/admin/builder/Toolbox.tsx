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
  Send,
  ListTree,
  Bookmark,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
  { icon: Send, label: "Contact Form" },
  { icon: ListTree, label: "Table of Contents" },
];

const bottomTools = [
  { icon: Settings, label: "Blog settings" },
  { icon: LayoutGrid, label: "Categories & Tags" },
];

export default function Toolbox() {
  const {
    blocks,
    selectedBlockId,
    addBlock,
    savedSections,
    insertSavedSection,
    deleteSavedSection,
  } = useBuilder();
  const [sectionTab, setSectionTab] = useState<"components" | "saved">("components");

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

  const handleInsertSection = (sectionBlocks: any[]) => {
    const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
    if (selectedBlock) {
      const levelBlocks = blocks.filter(
        (b) => b.parentId === selectedBlock.parentId || (!b.parentId && !selectedBlock.parentId)
      );
      const targetIndex = levelBlocks.findIndex((b) => b.id === selectedBlock.id) + 1;
      insertSavedSection(sectionBlocks, selectedBlock.parentId, targetIndex);
    } else {
      insertSavedSection(sectionBlocks);
    }
  };

  return (
    <aside className="w-full flex-1 flex flex-col p-4 overflow-y-auto">
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setSectionTab("components")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            sectionTab === "components"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Components
        </button>
        <button
          type="button"
          onClick={() => setSectionTab("saved")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
            sectionTab === "saved"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Bookmark size={12} />
          Saved ({savedSections.length})
        </button>
      </div>

      {sectionTab === "components" ? (
        <>
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
                <span className="font-bold text-[12px] text-slate-600 group-hover:text-blue-700 transition-colors uppercase tracking-tight text-center">{tool.label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reusable Sections
            </h3>
          </div>
          {savedSections.length === 0 ? (
            <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60">
              <Bookmark className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No saved sections yet</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Select any block or container on the canvas and click the green Bookmark icon to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedSections.map((sec) => (
                <div
                  key={sec.id}
                  draggable
                  onClick={() => handleInsertSection(sec.blocks)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/corehead-section",
                      JSON.stringify(sec.blocks),
                    );
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  className="group p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer hover:shadow-md transition flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{sec.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {sec.category} • {Array.isArray(sec.blocks) ? sec.blocks.length : 1} block(s)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedSection(sec.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    title="Delete saved section"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
