"use client";

import { useState, useEffect } from "react";
import { X, Search, Check, Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const BACKEND_URL = "http://localhost:5000";

interface MediaItem {
  id: number | string;
  name: string;
  url: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    api.getMedia()
      .then((data: any) => setMediaItems(Array.isArray(data) ? data : []))
      .catch(() => setMediaItems([]))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  /** Display URL (absolute) for thumbnails in the modal */
  const getFullUrl = (url: string) =>
    url.startsWith("http") || url.startsWith("data:")
      ? url
      : `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  /** Store relative /uploads/... on the post so public pages resolve via API origin */
  const toStoredUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith("data:")) return url;
    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const u = new URL(url);
        if (u.pathname.startsWith("/uploads/")) return u.pathname;
      }
    } catch {
      /* keep original */
    }
    return url.startsWith("/") ? url : `/${url}`;
  };

  const filteredMedia = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select from Media Library</h2>
            <p className="text-sm text-gray-500 mt-0.5">{mediaItems.length} images available</p>
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
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3" />
              <p className="text-sm font-medium">Loading media library...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <ImageOff className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-bold">No images found</p>
              <p className="text-xs mt-1">Upload images to your Media Library first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedUrl(getFullUrl(item.url))}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-4 cursor-pointer transition-all duration-300 group",
                    selectedUrl === getFullUrl(item.url)
                      ? "border-blue-600 ring-4 ring-blue-500/10"
                      : "border-transparent hover:border-blue-100"
                  )}
                >
                  <img
                    src={getFullUrl(item.url)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {selectedUrl === getFullUrl(item.url) && (
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
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <p className="text-xs font-medium text-gray-400">
            {selectedUrl ? "1 image selected" : "No image selected"}
          </p>
          <div className="flex gap-3">
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
                  onSelect(toStoredUrl(selectedUrl));
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
    </div>
  );
}

