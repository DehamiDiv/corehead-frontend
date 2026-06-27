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
  FileImage,
  X
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
    if (!confirm("Are you sure you want to permanently delete this image?")) return;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Media Library</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage all uploaded images in one place</p>
        </div>
        <button 
          onClick={fetchMedia}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          <RotateCcw className={cn("w-4 h-4 text-slate-400", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("Library")}
          className={cn(
            "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200",
            activeTab === "Library"
              ? "bg-white text-blue-600 shadow-md shadow-blue-500/5 border border-blue-50"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          <ImageIcon className="w-[18px] h-[18px]" />
          Library
        </button>
        <button
          onClick={() => setActiveTab("Trash")}
          className={cn(
            "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200",
            activeTab === "Trash"
              ? "bg-white text-blue-600 shadow-md shadow-blue-500/5 border border-blue-50"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          <Trash2 className="w-[18px] h-[18px]" />
          Trash
        </button>
      </div>

      {/* Upload Box (Only show in Library tab) */}
      {activeTab === "Library" && (
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-6 mb-8 transition-all hover:shadow-md">
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
            className="w-[60px] h-[60px] flex-shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-[18px] flex items-center justify-center transition-all shadow-sm shadow-blue-500/5 group"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
          </button>
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "flex-1 border-2 border-dashed rounded-[20px] h-[60px] flex items-center justify-center text-[14px] font-bold transition-all cursor-pointer",
              isDragging ? "border-blue-400 bg-blue-50/50 text-blue-600" : "border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-200"
            )}
          >
            {isUploading ? "Uploading files..." : isDragging ? "Drop images to upload" : "Drop images here or click to upload"}
          </div>
        </div>
      )}

      {/* Search and Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div className="relative w-full max-w-[400px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === "Library" ? "Search images..." : "Search trash..."}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-[14px] font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-[14px] font-bold text-slate-900 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-50">
          {filteredItems.length} images {activeTab === "Library" ? "total" : "in trash"}
        </div>
      </div>

      {/* Image Grid Wrapper */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 min-h-[600px] transition-all">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Fetching media assets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-[20px] overflow-hidden border border-slate-100 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1.5 transition-all duration-500 bg-white"
              >
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                  <img
                    src={getFullUrl(item.url)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5 px-3">
                    {activeTab === "Library" ? (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(getFullUrl(item.url)); }}
                          className="p-2.5 bg-white text-slate-700 rounded-xl shadow-lg hover:text-blue-600 hover:scale-110 transition-all"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMoveToTrash(item.id); }}
                          className="p-2.5 bg-white text-red-500 rounded-xl shadow-lg hover:text-red-600 hover:scale-110 transition-all"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRestore(item.id); }}
                          className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-lg hover:text-emerald-700 hover:scale-110 transition-all"
                          title="Restore"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeletePermanent(item.id); }}
                          className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:text-red-700 hover:scale-110 transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate mb-1" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{item.size}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              {searchQuery ? <Search className="w-8 h-8 text-slate-200" /> : <FileImage className="w-8 h-8 text-slate-200" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {searchQuery ? "No results found" : activeTab === "Library" ? "No media files yet" : "Trash is empty"}
            </h3>
            <p className="text-slate-500 max-w-xs mt-2 font-medium">
              {searchQuery ? "We couldn't find any images matching your search" : activeTab === "Library" ? "Upload your first image to start building your library" : "Items you delete will show up here for 30 days"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
