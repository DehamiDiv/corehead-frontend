"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: number | string;
  name: string;
  size: string;
  date: string;
  url: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 1,
    name: "Monster-Traveler-Mini-H...",
    size: "86.74 KB",
    date: "Apr 15, 2026",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  },
  {
    id: 2,
    name: "Monster-Traveler-Mini-H...",
    size: "86.74 KB",
    date: "Apr 15, 2026",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
  {
    id: 3,
    name: "Ahinsa_Kavindi.webp",
    size: "39.27 KB",
    date: "Mar 10, 2026",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    id: 4,
    name: "blogAds4.jpg",
    size: "63.03 KB",
    date: "Mar 10, 2026",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    id: 5,
    name: "blogAds3.png",
    size: "193.55 KB",
    date: "Mar 10, 2026",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    id: 6,
    name: "header-logo.png",
    size: "2.67 KB",
    date: "Feb 17, 2026",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [activeTab, setActiveTab] = useState("Library");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload delay for realism
    setTimeout(() => {
      const newItems: MediaItem[] = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        url: URL.createObjectURL(file),
      }));

      setMediaItems(prev => [...newItems, ...prev]);
      setIsUploading(false);
    }, 1500);
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

  const filteredItems = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={() => setMediaItems(INITIAL_MEDIA)}
          className="flex items-center justify-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-gray-500" />
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

      {/* Upload Box */}
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

      {/* Search and Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-[320px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search images by name..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-[15px] font-semibold text-gray-900">
          {filteredItems.length} images total
        </div>
      </div>

      {/* Image Grid Wrapper */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 min-h-[500px]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-100">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(item.url); alert("URL Copied!"); }}
                    className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:text-blue-600 hover:scale-105 transition-all"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a 
                    href={item.url} 
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
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(confirm("Are you sure you want to delete this image?")) {
                        setMediaItems(prev => prev.filter(m => m.id !== item.id)); 
                      }
                    }}
                    className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:text-red-600 hover:scale-105 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white">
                <h3 className="text-[13px] font-bold text-gray-900 truncate mb-1" title={item.name}>
                  {item.name}
                </h3>
                <div className="flex flex-col text-[11px] text-gray-500 font-medium">
                  <span>{item.size}</span>
                  <span className="mt-0.5">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No images found</h3>
            <p className="text-gray-500">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
