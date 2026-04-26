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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">
            Manage all uploaded images in one place
          </p>
        </div>
        <button 
          onClick={() => setMediaItems(INITIAL_MEDIA)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-gray-500" />
          Reset Library
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("Library")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "Library"
              ? "bg-white text-gray-900 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <ImageIcon className="w-4 h-4" />
          Library
        </button>
        <button
          onClick={() => setActiveTab("Trash")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "Trash"
              ? "bg-white text-gray-900 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Trash2 className="w-4 h-4" />
          Trash
        </button>
      </div>

      {/* Upload Box */}
      <div 
        className={cn(
          "bg-white p-8 rounded-2xl shadow-sm border transition-all duration-300",
          isDragging ? "border-blue-400 bg-blue-50/20 scale-[1.01]" : "border-gray-100"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center group cursor-pointer transition-all",
            isDragging ? "border-blue-400 bg-blue-50/50" : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/10"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
              <div className="p-4 bg-blue-50 rounded-full">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <div>
                <span className="block text-lg font-semibold text-gray-900">Uploading your files...</span>
                <span className="text-sm text-gray-400">Please wait a moment</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className={cn(
                 "p-5 rounded-2xl transition-colors",
                 isDragging ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
               )}>
                 <UploadCloud className="w-10 h-10" />
               </div>
               <div className="text-center md:text-left">
                 <span className="block text-xl font-bold text-gray-900 mb-1">
                   {isDragging ? "Drop to upload" : "Drop image here or click to upload"}
                 </span>
                 <span className="text-sm text-gray-400">
                   Support PNG, JPG, JPEG, WEBP up to 10MB
                 </span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Count */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search images by name..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          {filteredItems.length} images total
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in zoom-in duration-500"
          >
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white rounded-xl text-gray-700 hover:bg-gray-100 transition-colors shadow-lg">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-1 bg-white">
              <h3 className="text-sm font-bold text-gray-900 truncate" title={item.name}>
                {item.name}
              </h3>
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {item.size}
                </span>
                <span>{item.date}</span>
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
  );
}
