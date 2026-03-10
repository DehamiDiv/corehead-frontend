import {
  Layout,
  Type,
  Image as ImageIcon,
  Link,
  AlignLeft,
  Palette,
  Maximize,
  Database,
} from "lucide-react";
import { useBuilder } from "@/components/admin/builder/BuilderContext";
import { useState } from "react";

export default function SettingsPanel() {
  const { blocks, selectedBlockId, updateBlock } = useBuilder();
  const [activeTab, setActiveTab] = useState<"Content" | "Style" | "Advanced">(
    "Content",
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <aside className="w-72 bg-slate-50 border-l border-gray-200 flex flex-col p-4 h-[calc(100vh-64px)]">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Component Settings
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <Layout className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-sm text-slate-500">
            Select a block on the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layout className="w-4 h-4 text-blue-500" />
          Edit {selectedBlock.type}
        </h3>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex p-1 bg-slate-100 rounded-lg">
          {(["Content", "Style", "Advanced"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === "Content" && (
          <div className="space-y-4">
            {/* ... Content inputs handled dynamically based on type ... */}
            <ContentTab
              selectedBlock={selectedBlock}
              updateBlock={updateBlock}
            />
          </div>
        )}

        {activeTab === "Style" && (
          <div className="space-y-6">
            {/* Typography */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-3 h-3" /> Typography
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600">
                    Font Size (px)
                  </label>
                  <input
                    type="number"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-gray-200 rounded text-sm"
                    placeholder="16"
                    value={
                      parseInt(selectedBlock.styles?.fontSize || "0") || ""
                    }
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, selectedBlock.content, {
                        fontSize: `${e.target.value}px`,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                      value={selectedBlock.styles?.color || "#000000"}
                      onChange={(e) =>
                        updateBlock(selectedBlock.id, selectedBlock.content, {
                          color: e.target.value,
                        })
                      }
                    />
                    <span className="text-xs text-slate-500 uppercase">
                      {selectedBlock.styles?.color || "#000"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Text Align</label>
                <div className="flex bg-slate-50 border border-gray-200 rounded-md p-1">
                  {["left", "center", "right", "justify"].map((align) => (
                    <button
                      key={align}
                      onClick={() =>
                        updateBlock(selectedBlock.id, selectedBlock.content, {
                          textAlign: align,
                        })
                      }
                      className={`flex-1 p-1 rounded-sm hover:bg-white hover:shadow-sm transition-all ${selectedBlock.styles?.textAlign === align ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      <AlignLeft
                        className={`w-4 h-4 mx-auto ${align === "center" ? "mx-auto" : ""} ${align === "right" ? "rotate-180" : ""}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-3 h-3" /> Background
              </h4>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                    value={selectedBlock.styles?.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, selectedBlock.content, {
                        backgroundColor: e.target.value,
                      })
                    }
                  />
                  <span className="text-xs text-slate-500 uppercase">
                    {selectedBlock.styles?.backgroundColor || "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Advanced" && (
          <div className="space-y-6">
            {/* Layout */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Maximize className="w-3 h-3" /> Layout Spacing
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600">Padding (px)</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-gray-200 rounded text-sm"
                    placeholder="e.g. 10px or 1rem"
                    value={selectedBlock.styles?.padding || ""}
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, selectedBlock.content, {
                        padding: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600">Margin (px)</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-gray-200 rounded text-sm"
                    placeholder="e.g. 20px"
                    value={selectedBlock.styles?.margin || ""}
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, selectedBlock.content, {
                        margin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Bindings */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3 h-3" /> Dynamic Data
              </h4>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <label className="text-xs font-medium text-blue-800 mb-1 block">
                  Connect to CMS Field
                </label>
                <select
                  className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm text-slate-700 outline-none"
                  value={selectedBlock.bindings?.content || ""}
                  onChange={(e) =>
                    updateBlock(
                      selectedBlock.id,
                      selectedBlock.content,
                      {},
                      { content: e.target.value },
                    )
                  }
                >
                  <option value="">None (Static Content)</option>
                  <option value="post.title">Post Title</option>
                  <option value="post.excerpt">Post Excerpt</option>
                  <option value="post.author">Author Name</option>
                  <option value="post.date">Publish Date</option>
                  <option value="site.name">Site Name</option>
                </select>
                <p className="text-[10px] text-blue-600 mt-1">
                  Overrides static content with dynamic data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// Extracted Content Tab for cleaner main component
function ContentTab({ selectedBlock, updateBlock }: any) {
  if (selectedBlock.type === "Heading") {
    return (
      <div className="space-y-2">
        <label className="text-sm text-slate-700">Heading Text</label>
        <input
          type="text"
          value={selectedBlock.content}
          onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    );
  }
  if (selectedBlock.type === "Paragraph") {
    return (
      <div className="space-y-2">
        <label className="text-sm text-slate-700">Paragraph Text</label>
        <textarea
          rows={6}
          value={selectedBlock.content}
          onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    );
  }
  if (selectedBlock.type === "Image") {
    return (
      <div className="space-y-2">
        <label className="text-sm text-slate-700">Image URL</label>
        <input
          type="text"
          value={selectedBlock.content}
          onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 aspect-video bg-slate-100 relative">
          <img
            src={selectedBlock.content}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }
  if (selectedBlock.type === "Quote") {
    return (
      <div className="space-y-2">
        <label className="text-sm text-slate-700">Quote Text</label>
        <textarea
          rows={4}
          value={selectedBlock.content}
          onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    );
  }
  if (selectedBlock.type === "Button") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-700">Button Text</label>
          <input
            type="text"
            value={selectedBlock.content.text}
            onChange={(e) =>
              updateBlock(selectedBlock.id, {
                ...selectedBlock.content,
                text: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-700">Button URL</label>
          <input
            type="text"
            value={selectedBlock.content.url}
            onChange={(e) =>
              updateBlock(selectedBlock.id, {
                ...selectedBlock.content,
                url: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm text-slate-500">
      No content settings for this block.
    </p>
  );
}
