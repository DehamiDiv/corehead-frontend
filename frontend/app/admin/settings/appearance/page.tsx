"use client";

import { useState } from "react";
import { CheckCircle2, Eye, Palette, Layout, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  {
    id: "default",
    name: "Default",
    description: "Clean white layout with featured post slider and category tabs.",
    preview: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    active: true,
  },
  {
    id: "theme-1",
    name: "Theme 1",
    description: "Nature-inspired green hero with full-width banner and search.",
    preview: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    active: false,
  },
  {
    id: "theme-2",
    name: "Theme 2",
    description: "Bold mosaic hero grid with orange accents and featured articles.",
    preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    active: false,
  },
  {
    id: "theme-3",
    name: "Theme 3",
    description: "Minimalist masonry layout for photography and storytelling.",
    preview: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    active: false,
  },
  {
    id: "theme-4",
    name: "Theme 4",
    description: "Elegant serif typography with high-contrast monochrome design.",
    preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    active: false,
  },
  {
    id: "theme-5",
    name: "Theme 5",
    description: "Futuristic dark mode with neon blue accents and glassmorphism.",
    preview: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    active: false,
  },
];

export default function AppearancePage() {
  const [activeTheme, setActiveTheme] = useState("default");

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
          <p className="text-gray-500 mt-1">Customize the look and feel of your blog</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <RefreshCw className="w-4 h-4 text-gray-400" />
          Update Themes
        </button>
      </div>

      {/* Currently Active Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Currently active</p>
            <h2 className="text-xl font-black text-gray-900 mt-0.5">
              {THEMES.find(t => t.id === activeTheme)?.name || "Default"}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100">
             <CheckCircle2 className="w-4 h-4" />
             Active
           </span>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {THEMES.map((theme) => {
          const isActive = theme.id === activeTheme;
          return (
            <div 
              key={theme.id}
              className={cn(
                "group relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500",
                isActive ? "border-blue-600 shadow-2xl shadow-blue-100" : "border-transparent shadow-xl shadow-gray-200/40 hover:border-blue-200"
              )}
            >
              {/* Preview Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={theme.preview} 
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  {!isActive && (
                    <button 
                      onClick={() => setActiveTheme(theme.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 duration-500 shadow-lg shadow-blue-900/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4">
                   <div className="p-2 bg-black/20 backdrop-blur-md rounded-xl border border-white/20 text-white">
                     <Layout className="w-4 h-4" />
                   </div>
                </div>
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-gray-900">{theme.name}</h3>
                  {isActive && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {theme.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
