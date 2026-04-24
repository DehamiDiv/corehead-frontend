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
  const { blocks, selectedBlockId, updateBlock, removeBlock, templateName, setTemplateName, templateType, setTemplateType } = useBuilder();
  const [activeTab, setActiveTab] = useState<"Content" | "Style" | "Advanced">(
    "Content",
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <aside className="w-72 bg-slate-50 border-l border-gray-200 flex flex-col p-4 h-[calc(100vh-64px)]">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Template Settings
        </h3>
        {/* FR-07: The system shall allow selecting template type (Single Post vs Blog Archive) */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Template Name</label>
            <input 
              type="text" 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. My Default Blog Layout"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Template Type</label>
            <select 
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Single Post">Single Post Template</option>
              <option value="Blog Archive">Blog Archive Template</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              "Single Post" is used for individual articles. "Blog Archive" is used for category and index pages displaying lists.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col items-center justify-center text-center">
            <Layout className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-slate-500">
              Select a block on the canvas to configure styling and data bindings.
            </p>
          </div>
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
                  <option value="post.content">Post Body (Markdown)</option>
                  <option value="post.featured_image">Featured Image URL</option>
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

      {/* Delete Block Actions */}
      <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => removeBlock(selectedBlock.id)}
          className="w-full py-2.5 px-4 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          Delete Component
        </button>
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
  
  if (selectedBlock.type === "Collection List") {
    // Handling Blog Loop / Collection List (FR-18)
    return (
      <div className="space-y-4">
        <div className="space-y-2">
           <label className="text-sm text-slate-700">Display Limit</label>
           <input 
              type="number"
              value={selectedBlock.content?.limit || 6}
              onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock.content, limit: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
           />
           <p className="text-xs text-slate-500">Maximum posts to show in the loop.</p>
        </div>
        <div className="space-y-2">
           <label className="text-sm text-slate-700">Filter by Category</label>
           <select 
              value={selectedBlock.content?.category || ""}
              onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock.content, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
           >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="development">Development</option>
           </select>
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
