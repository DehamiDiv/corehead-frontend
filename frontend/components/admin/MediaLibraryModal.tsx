"use client";

import { useState } from "react";
import { X, Search, Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: number | string;
  name: string;
  url: string;
}

const MOCK_MEDIA: MediaItem[] = [
  { id: 1, name: "Workspace", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { id: 2, name: "Portrait", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
  { id: 3, name: "Meeting", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
  { id: 4, name: "Office", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: 5, name: "Collaboration", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 6, name: "Technology", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
];

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredMedia = MOCK_MEDIA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Media</h2>
            <p className="text-sm text-gray-500 mt-0.5">Choose an image from your library</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-50">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search images by name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedUrl(item.url)}
                className={cn(
                  "relative aspect-square rounded-2xl overflow-hidden border-4 cursor-pointer transition-all duration-300 group",
                  selectedUrl === item.url ? "border-blue-600 ring-4 ring-blue-500/10" : "border-transparent hover:border-blue-100"
                )}
              >
                <img 
                  src={item.url} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {selectedUrl === item.url && (
                  <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                    <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg scale-110 animate-in zoom-in duration-200">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedUrl}
            onClick={() => {
              if (selectedUrl) {
                onSelect(selectedUrl);
                onClose();
              }
            }}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
}
