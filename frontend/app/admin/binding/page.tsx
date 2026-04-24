"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { saveBindings, getBindings } from "./actions";

// ----------------------------------------------------------------------
// 1. DATA DEFINITIONS
// ----------------------------------------------------------------------
const GROUPS = [
  {
    id: "meta",
    title: "Post Header & Meta",
    description: "Controls for the top section of your post.",
    items: [
      { key: "post.coverImage", label: "Hero Image", icon: <ImageSvg /> },
      { key: "post.title", label: "Post Title", icon: <TextSvg /> },
      { key: "post.date", label: "Publish Date", icon: <CalendarSvg /> },
      { key: "author.info", label: "Author Info", icon: <UserSvg /> },
      { key: "post.categories", label: "Categories", icon: <FolderSvg /> },
    ]
  },
  {
    id: "content",
    title: "Post Content",
    description: "The main body of your article.",
    items: [
      { key: "post.excerpt", label: "Excerpt / Summary", icon: <AlignLeftSvg /> },
      { key: "post.content", label: "Main Body Content", icon: <DocumentSvg /> },
    ]
  },
  {
    id: "engagement",
    title: "Engagement & Footer",
    description: "Elements to keep readers engaged.",
    items: [
      { key: "post.tags", label: "Tags", icon: <TagSvg /> },
      { key: "post.socialShare", label: "Social Share Buttons", icon: <ShareSvg /> },
      { key: "post.comments", label: "Comments Section", icon: <ChatSvg /> },
    ]
  }
];

const DEFAULT_SELECTED: Record<string, boolean> = {
  "post.coverImage": true,
  "post.title": true,
  "author.info": true,
  "post.date": true,
  "post.content": true,
  "post.socialShare": true,
};

// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------
export default function BindingsPage() {
  const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>(DEFAULT_SELECTED);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    getBindings().then((data) => {
      if (data) {
        setMode(data.mode);
        setSelected(data.selected || {}); 
      }
      setLoading(false);
    });
  }, []);

  // Filter groups
  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [search]);

  // Toggle handlers
  const toggleKey = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSave = async () => {
    const result = await saveBindings(mode, selected);
    if (result.success) {
      alert("🎉 Bindings saved successfully!");
    } else {
      alert("Failed to save bindings.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          <div className="text-slate-500 font-medium">Loading editor...</div>
        </div>
      </div>
    );
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="-m-8 bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] items-stretch">
        
        {/* =========================================
            LEFT PANEL: CONTROLS & SIDEBAR
            ========================================= */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-white border-r border-slate-200 flex flex-col z-10">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                C
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-tight">CoreHead</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bindings Editor</div>
              </div>
            </div>
            <Link href="/admin" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
              <XIcon />
            </Link>
          </div>

          {/* Controls Area (Scroll removed) */}
          <div className="flex-1 p-6 space-y-8">
            
            {/* Context Info */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Configure Layout</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Toggle the elements you want to render. Watch your changes apply instantly in the live preview.
              </p>
            </div>

            {/* Mode Segmented Control */}
            <div className="bg-slate-100/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
              <button
                onClick={() => setMode("dynamic")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === "dynamic" ? "bg-white text-indigo-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                <BoltIcon /> Dynamic
              </button>
              <button
                onClick={() => setMode("static")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === "static" ? "bg-white text-indigo-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                <PinIcon /> Static
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fields..."
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
              />
            </div>

            {/* Groups */}
            <div className="space-y-8">
              {filteredGroups.map((group) => (
                <div key={group.id} className="animate-fade-in-up">
                  <div className="mb-4 px-1">
                    <h3 className="text-sm font-bold text-slate-900">{group.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{group.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={item.key}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleKey(item.key)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleKey(item.key); } }}
                        className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          selected[item.key] 
                            ? "bg-white border-indigo-200 shadow-[0_4px_20px_rgba(99,102,241,0.08)] ring-1 ring-indigo-50" 
                            : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                            selected[item.key] ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                          }`}>
                            {item.icon}
                          </div>
                          <span className={`text-[15px] font-semibold transition-colors duration-300 ${
                            selected[item.key] ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                          }`}>
                            {item.label}
                          </span>
                        </div>

                        {/* Modern iOS style toggle switch */}
                        <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out shrink-0 ${
                          selected[item.key] ? "bg-indigo-600" : "bg-slate-200 group-hover:bg-slate-300"
                        }`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ease-out ${
                            selected[item.key] ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredGroups.length === 0 && (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="text-slate-400 mb-2">🔍</div>
                  <div className="text-sm font-medium text-slate-600">No fields match your search</div>
                </div>
              )}
            </div>
            
            {/* Bottom spacer for scroll */}
            <div className="h-4"></div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4 px-1 text-xs font-semibold text-slate-500">
              <span>{selectedCount} parts active</span>
              <button 
                onClick={() => setSelected({})} 
                className="text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Clear all
              </button>
            </div>
            <button
              onClick={onSave}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[15px] shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* =========================================
            RIGHT PANEL: LIVE PREVIEW
            ========================================= */}
        <div className="flex-1 p-4 sm:p-6 lg:p-10 bg-slate-50 relative min-w-0">
          
          <div className="w-full max-w-[1200px] mx-auto">
            {/* Status pill */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Live Interactive Preview
              </div>
            </div>

            {/* Browser Mockup Wrapper */}
            <div className="rounded-[24px] bg-white border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden ring-1 ring-slate-900/5 min-w-0">
              
              {/* Browser Header */}
              <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center">
                <div className="flex gap-2 w-16 sm:w-20 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                </div>
                <div className="flex-1 flex justify-center min-w-0 px-2">
                  <div className="bg-white/60 border border-slate-200/60 rounded-md px-4 sm:px-12 md:px-32 py-1.5 text-[11px] font-semibold text-slate-400 shadow-sm flex items-center gap-2 truncate max-w-full">
                    <LockIcon /> <span className="truncate">corehead.app/blog/demo</span>
                  </div>
                </div>
                <div className="w-16 sm:w-20 shrink-0"></div> {/* Spacer for balance */}
              </div>

              {/* Preview Content Container */}
              <div className="p-6 sm:p-10 md:p-14 lg:p-20 relative bg-white">
                
                {/* 1. HERO IMAGE */}
                <div 
                  className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
                    selected['post.coverImage'] ? 'h-[280px] md:h-[400px] opacity-100 mb-12 rounded-[20px] scale-100' : 'h-0 opacity-0 mb-0 scale-95'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white relative group">
                     {/* Decorative background pattern */}
                     <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
                     <ImageSvg className="w-16 h-16 opacity-50 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
                     <span className="font-bold text-xl md:text-2xl tracking-tight">Stunning Hero Image</span>
                  </div>
                </div>

                {/* 2. HEADER & META */}
                <div className="max-w-4xl mx-auto space-y-8 mb-12">
                  
                  {/* Title */}
                  <h1 
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-900 leading-[1.15] tracking-tight transition-all duration-500 ${
                      selected['post.title'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 hidden'
                    }`}
                  >
                    The Future of Agentic AI in Modern Web Development
                  </h1>

                  {/* Meta Row */}
                  <div className={`flex flex-wrap items-center gap-y-4 gap-x-8 text-[15px] border-b border-slate-100 pb-8 transition-all duration-500 ${
                    (selected['author.info'] || selected['post.date'] || selected['post.categories']) ? 'opacity-100' : 'opacity-0 hidden border-transparent pb-0'
                  }`}>
                    
                    {/* Author */}
                    {selected['author.info'] && (
                      <div className="flex items-center gap-3 animate-fade-in">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-white shadow-sm ring-2 ring-slate-50">
                          JS
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Jane Smith</div>
                          <div className="text-slate-500 text-xs font-medium">Lead Editor</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Divider if needed */}
                    {selected['author.info'] && (selected['post.date'] || selected['post.categories']) && (
                      <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></div>
                    )}

                    {/* Date */}
                    {selected['post.date'] && (
                      <div className="flex items-center gap-2 text-slate-500 font-medium animate-fade-in">
                        <CalendarSvg className="w-4 h-4" /> April 24, 2026
                      </div>
                    )}

                    {/* Categories */}
                    {selected['post.categories'] && (
                      <div className="flex gap-2 animate-fade-in ml-auto">
                        <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition-colors">Technology</span>
                        <span className="px-3.5 py-1.5 rounded-full bg-violet-50 text-violet-700 font-bold text-xs border border-violet-100 hover:bg-violet-100 cursor-pointer transition-colors">Design</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="max-w-4xl mx-auto">
                  {/* 3. EXCERPT */}
                  <div 
                    className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                      selected['post.excerpt'] ? 'max-h-[500px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'
                    }`}
                  >
                    <div className="border-l-4 border-indigo-500 pl-6 py-2">
                      <p className="text-xl md:text-[22px] text-slate-600 font-medium italic leading-relaxed">
                        Discover how the latest advancements in AI are transforming the way we build, design, and deploy scalable web applications in 2026.
                      </p>
                    </div>
                  </div>

                  {/* 4. CONTENT */}
                  <div 
                    className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      selected['post.content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 hidden'
                    }`}
                  >
                    <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-serif">
                      <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                        Building a robust application requires more than just good code; it demands an intuitive user experience and flawless design. As developers, we are constantly seeking tools that can bridge the gap between complex backend logic and beautiful frontend interfaces.
                      </p>
                      <p>
                        In this comprehensive guide, we dive deep into the architectural patterns that are shaping the future. From server components to edge rendering, the landscape is evolving rapidly. Embracing these changes not only improves performance but also enhances the overall accessibility of our digital products.
                      </p>
                      <div className="p-8 my-8 bg-slate-50 rounded-2xl border border-slate-100 text-center italic text-slate-600 shadow-sm">
                        "The best interfaces are the ones that get out of the user's way, allowing the content to speak for itself."
                      </div>
                      <p>
                        Furthermore, the integration of automated design systems allows teams to scale their UIs consistently without writing repetitive CSS.
                      </p>
                    </div>
                  </div>

                  {/* 5. ENGAGEMENT FOOTER */}
                  <div 
                    className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      (selected['post.tags'] || selected['post.socialShare'] || selected['post.comments']) ? 'opacity-100 mt-16 pt-8 border-t border-slate-200' : 'opacity-0 hidden'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {selected['post.tags'] && (
                          <>
                            <span className="text-[13px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors">#WebDev</span>
                            <span className="text-[13px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors">#AI</span>
                            <span className="text-[13px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors">#Frontend</span>
                          </>
                        )}
                      </div>
                      
                      {/* Social Share */}
                      {selected['post.socialShare'] && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-400 mr-2 uppercase tracking-wide">Share</span>
                          <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#1da1f2] hover:border-[#1da1f2] text-slate-600 hover:text-white transition-all flex items-center justify-center group shadow-sm">
                            <TwitterSvg className="w-4 h-4" />
                          </button>
                          <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#0a66c2] hover:border-[#0a66c2] text-slate-600 hover:text-white transition-all flex items-center justify-center group shadow-sm">
                            <LinkedInSvg className="w-4 h-4" />
                          </button>
                          <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-800 hover:border-slate-800 text-slate-600 hover:text-white transition-all flex items-center justify-center group shadow-sm">
                            <LinkSvg className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Comments */}
                    {selected['post.comments'] && (
                      <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 shadow-sm animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                            <ChatSvg className="w-6 h-6 text-indigo-500" /> Discussion (3)
                          </h3>
                        </div>
                        
                        {/* Comment Input */}
                        <div className="flex gap-4 mb-10">
                          <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
                            <UserSvg className="w-6 h-6" />
                          </div>
                          <div className="flex-1 relative">
                            <textarea 
                              className="w-full rounded-2xl border border-slate-200 p-4 pb-12 text-[15px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all resize-none shadow-sm placeholder-slate-400" 
                              placeholder="Share your thoughts on this article..."
                              rows={2}
                            ></textarea>
                            <button className="absolute bottom-3 right-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md">
                              Post Comment
                            </button>
                          </div>
                        </div>

                        {/* Dummy Comment */}
                        <div className="flex gap-4">
                           <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-sm">MR</div>
                           <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                             <div className="flex items-center justify-between mb-2">
                               <div className="font-bold text-slate-900 text-sm">Mike Roberts</div>
                               <div className="text-xs text-slate-400 font-medium">2 hours ago</div>
                             </div>
                             <p className="text-slate-600 text-[15px] leading-relaxed">
                               This is exactly what I've been looking for. The integration between Next.js and headless CMS makes things so much simpler!
                             </p>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
            
            <div className="h-12"></div> {/* Bottom scroll breathing room */}
          </div>
        </div>
      </div>

      {/* Global minimal styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. SVG ICONS (Clean, inline tailwind-ready icons)
// ----------------------------------------------------------------------
function ImageSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function TextSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
}
function CalendarSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function UserSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}
function FolderSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
}
function AlignLeftSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>;
}
function DocumentSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function TagSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
}
function ShareSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
}
function ChatSvg({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
function SearchIcon({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
}
function XIcon({className="w-5 h-5"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
}
function LockIcon({className="w-3 h-3"}: {className?: string}) {
  return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
}
function BoltIcon({className="w-4 h-4"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
}
function PinIcon({className="w-4 h-4"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
}
function TwitterSvg({className="w-4 h-4"}: {className?: string}) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>;
}
function LinkedInSvg({className="w-4 h-4"}: {className?: string}) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>;
}
function LinkSvg({className="w-4 h-4"}: {className?: string}) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
}
