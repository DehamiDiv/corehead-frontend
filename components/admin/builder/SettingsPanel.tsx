import {
  Layout,
  Type,
  Image as ImageIcon,
  Link,
  AlignLeft,
} from "lucide-react";
import { useBuilder } from "@/components/admin/builder/BuilderContext";

export default function SettingsPanel() {
  const { blocks, selectedBlockId, updateBlock } = useBuilder();

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
            Select a block on the canvas to edit its settings.
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

      <div className="p-4 space-y-6">
        {/* Common: Content */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Content
          </label>

          {selectedBlock.type === "Heading" && (
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Heading Text</label>
              <input
                type="text"
                value={selectedBlock.content}
                onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {selectedBlock.type === "Paragraph" && (
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Paragraph Text</label>
              <textarea
                rows={6}
                value={selectedBlock.content}
                onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {selectedBlock.type === "Image" && (
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
          )}

          {selectedBlock.type === "Quote" && (
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Quote Text</label>
              <textarea
                rows={4}
                value={selectedBlock.content}
                onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {selectedBlock.type === "Button" && (
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
          )}
        </div>
      </div>
    </aside>
  );
}
