"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Search,
  Trash2,
  MoreVertical,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Copy,
  Download,
  Undo2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface MediaItem {
  id: number | string;
  name: string;
  size: string;
  url: string;
  type?: string;
  createdAt: string;
}

const BACKEND_URL = 'http://localhost:5000';

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState("Library");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = activeTab === "Library" 
        ? await api.getMedia() 
        : await api.getTrash();
      setMediaItems(data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64Data = await fileToBase64(file);
        
        await api.uploadMedia({
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          base64Data: base64Data
        });
      }
      await fetchMedia();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload one or more files.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleMoveToTrash = async (id: number | string) => {
    try {
      await api.moveToTrash(id);
      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleRestore = async (id: number | string) => {
    try {
      await api.restoreFromTrash(id);
      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  const handleDeletePermanent = async (id: number | string) => {
    if (!confirm("Are you sure you want to permanently delete this image? This action cannot be undone.")) return;
    try {
      await api.deleteMediaPermanently(id);
      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Permanent delete failed:", error);
    }
  };

  const filteredItems = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">
            Manage all uploaded images in one place
          </p>
        </div>
        <button 
          onClick={fetchMedia}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RotateCcw className={cn("w-4 h-4 text-gray-500", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("Library")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors",
            activeTab === "Library"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-white/50 border border-transparent"
          )}
        >
          <ImageIcon className="w-[18px] h-[18px]" />
          Library
        </button>
        <button
          onClick={() => setActiveTab("Trash")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors",
            activeTab === "Trash"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent"
          )}
        >
          <Trash2 className="w-[18px] h-[18px]" />
          Trash
        </button>
      </div>

      {/* Upload Box (Only show in Library tab) */}
      {activeTab === "Library" && (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-[52px] h-[52px] flex-shrink-0 bg-[#eef2ff] hover:bg-[#e0e7ff] text-blue-600 rounded-xl flex items-center justify-center transition-colors"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </button>
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "flex-1 border-2 border-dashed rounded-xl h-[52px] flex items-center justify-center text-gray-500 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-all",
              isDragging ? "border-blue-400 bg-blue-50/50" : "border-gray-200"
            )}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : isDragging ? "Drop image to upload" : "Drop image here or click to upload"}
          </div>
        </div>
      )}

      {/* Search and Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-[320px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === "Library" ? "Search images..." : "Search trash..."}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-[15px] font-semibold text-gray-900">
          {filteredItems.length} images {activeTab === "Library" ? "total" : "in trash"}
        </div>
      </div>

      {/* Image Grid Wrapper */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading media...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-100">
                  <img
                    src={getFullUrl(item.url)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 px-2">
                    {activeTab === "Library" ? (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(getFullUrl(item.url)); alert("URL Copied!"); }}
                          className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:text-blue-600 hover:scale-105 transition-all"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a 
                          href={getFullUrl(item.url)} 
                          download={item.name}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:text-blue-600 hover:scale-105 transition-all flex items-center justify-center"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMoveToTrash(item.id); }}
                          className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:text-red-600 hover:scale-105 transition-all"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRestore(item.id); }}
                          className="p-2 bg-white text-green-600 rounded-lg shadow-sm hover:text-green-700 hover:scale-105 transition-all"
                          title="Restore"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeletePermanent(item.id); }}
                          className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:text-red-700 hover:scale-105 transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <h3 className="text-[13px] font-bold text-gray-900 truncate mb-1" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="flex flex-col text-[11px] text-gray-500 font-medium">
                    <span>{item.size}</span>
                    <span className="mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
              {searchQuery ? <Search className="w-10 h-10 text-gray-300" /> : <ImageIcon className="w-10 h-10 text-gray-300" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {searchQuery ? "No images found" : activeTab === "Library" ? "Your library is empty" : "Trash is empty"}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search query" : activeTab === "Library" ? "Upload some images to get started" : "Deleted images will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
