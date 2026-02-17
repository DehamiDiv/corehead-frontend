"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { PartKey, Group } from "./types";
import { saveBindings, getBindings } from "./actions";
import { User, Clock, Tag, Folder, ArrowRight, Layout, LayoutTemplate } from "lucide-react";

const GROUPS: Group[] = [
  {
    title: "Global Parts",
    items: [
      { key: "navbar", label: "Navbar", hint: "Top navigation bar" },
      { key: "footer", label: "Footer", hint: "Bottom footer area" },
    ],
  },
  {
    title: "Post Parts",
    subtitle: "Components for single post pages",
    items: [
      { key: "post_featured_image", label: "Featured Image", hint: "Main post image" },
      { key: "post_content", label: "Post Content", hint: "The main body text" },
      { key: "post_author_info", label: "Author Info", hint: "Author bio and avatar" },
    ],
  },
  {
    title: "Post Meta",
    subtitle: "Metadata details",
    items: [
      { key: "post_date", label: "Post Date", hint: "Publication date" },
      { key: "post_category", label: "Category Link", hint: "Link to category" },
      { key: "post_tags", label: "Tag Links", hint: "List of tags" },
    ],
  },
  {
    title: "Archive Parts",
    subtitle: "Components for archive/listing pages",
    items: [
      { key: "archive_listing", label: "Posts Listing", hint: "Grid or list of posts" },
      { key: "archive_pagination", label: "Pagination", hint: "Next/Prev controls" },
    ],
  },
];

const DEFAULT_SELECTED: Record<PartKey, boolean> = {
  navbar: true,
  footer: true,
  post_featured_image: true,
  post_content: true,
  post_author_info: true,
  post_date: true,
  post_category: true,
  post_tags: true,
  archive_listing: true,
  archive_pagination: true,
};

export default function BindingsPage() {
  const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<PartKey, boolean>>(DEFAULT_SELECTED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBindings().then((data) => {
      if (data) {
        setMode(data.mode || "dynamic");
        setSelected((prev) => ({ ...prev, ...(data.selected || {}) }));
      }
      setLoading(false);
    });
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  function toggleKey(key: PartKey) {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setAll(val: boolean) {
    const newSelected = { ...selected };
    GROUPS.forEach((g) => {
      g.items.forEach((item) => {
        newSelected[item.key] = val;
      });
    });
    setSelected(newSelected);
  }

  async function onSave() {
    const result = await saveBindings(mode, selected);
    if (result.success) {
      alert("Bindings saved successfully!");
    } else {
      alert("Failed to save bindings.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="animate-pulse">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950/60 p-6 font-sans">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              C
            </div>
            <div className="text-lg font-bold text-neutral-800">CoreHead</div>
          </div>
          <Link
            href="/admin"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100"
          >
            ✕
          </Link>
        </div>

        {/* Hero / Title */}
        <div className="px-8 pt-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            SELECT PARTS TO RENDER
          </h1>
          <p className="mt-2 text-neutral-500">
            Bind template elements to render dynamic <span className="font-semibold text-neutral-800">Single Post</span> and{" "}
            <span className="font-semibold text-neutral-800">Archive</span> pages.
          </p>
        </div>

        <div className="grid gap-8 px-8 pb-8 pt-6 lg:grid-cols-[380px_1fr]">
          {/* Controls Panel */}
          <div className="flex flex-col gap-6">
            {/* Mode Switcher */}
            <div className="flex rounded-xl border bg-neutral-50 p-1">
              <button
                onClick={() => setMode("dynamic")}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  mode === "dynamic"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                ⚡ Dynamic
              </button>
              <button
                 onClick={() => setMode("static")}
                 className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  mode === "static"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                📌 Static
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Fields..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                🔍
              </span>
            </div>

            {/* Global Actions */}
            <div className="flex gap-3">
               <button onClick={() => setAll(true)} className="flex-1 rounded-lg border bg-neutral-50 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
                 Select All
               </button>
               <button onClick={() => setAll(false)} className="flex-1 rounded-lg border bg-neutral-50 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
                 Clear All
               </button>
            </div>

            {/* Groups List */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 400px)" }}>
              {filteredGroups.map((group) => (
                <div key={group.title} className="rounded-xl bg-neutral-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-800">{group.title}</h3>
                      {group.subtitle && <p className="text-xs text-neutral-500">{group.subtitle}</p>}
                    </div>
                    <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {group.items.length} fields
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <label
                        key={item.key}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition hover:border-blue-400 hover:shadow-md"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                            selected[item.key]
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-neutral-300 bg-white"
                          }`}
                        >
                          {selected[item.key] && (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={!!selected[item.key]}
                          onChange={() => toggleKey(item.key)}
                        />
                        <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-neutral-800">Live Preview</h2>
            
            <div className="relative flex-1 overflow-hidden rounded-2xl border bg-neutral-100 p-8">
               {/* Simplified Mock Browser/Device */}
               <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
                 
                 {/* Navbar Preview */}
                 {selected["navbar"] && (
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div className="h-6 w-24 rounded bg-neutral-200"></div>
                      <div className="flex gap-4">
                        <div className="h-4 w-12 rounded bg-neutral-100"></div>
                        <div className="h-4 w-12 rounded bg-neutral-100"></div>
                        <div className="h-4 w-20 rounded-full bg-blue-100"></div>
                      </div>
                    </div>
                 )}

                 <div className="p-8">
                    {/* Post Content Preview */}
                    <div className="space-y-6">
                       {selected["post_featured_image"] && (
                         <div className="aspect-video w-full rounded-xl bg-neutral-200">
                           <div className="flex h-full w-full items-center justify-center text-neutral-400">
                             <LayoutTemplate className="h-12 w-12 opacity-20" />
                           </div>
                         </div>
                       )}
                       
                       <div className="space-y-4">
                         <div className="h-8 w-3/4 rounded-lg bg-neutral-800"></div>
                         
                         {/* Meta */}
                         <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                            {selected["post_author_info"] && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>John Doe</span>
                              </div>
                            )}
                            {selected["post_date"] && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>April 12, 2024</span>
                              </div>
                            )}
                             {selected["post_category"] && (
                              <div className="flex items-center gap-2">
                                <Folder className="h-4 w-4" />
                                <span>Web Development</span>
                              </div>
                            )}
                         </div>

                         {selected["post_content"] && (
                           <div className="space-y-3 pt-4">
                             <div className="h-4 w-full rounded bg-neutral-100"></div>
                             <div className="h-4 w-full rounded bg-neutral-100"></div>
                             <div className="h-4 w-5/6 rounded bg-neutral-100"></div>
                             <div className="h-4 w-full rounded bg-neutral-100"></div>
                           </div>
                         )}

                         {selected["post_tags"] && (
                           <div className="flex gap-2 pt-4">
                              <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">#nextjs</span>
                              <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">#react</span>
                           </div>
                         )}
                       </div>
                    </div>

                    {/* Archive Preview (Mini) */}
                    <div className="mt-12 rounded-xl border border-dashed border-neutral-300 p-6">
                        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Archive Section Preview</div>
                        {selected["archive_listing"] ? (
                           <div className="grid gap-4 sm:grid-cols-2">
                              {[1, 2].map((i) => (
                                <div key={i} className="rounded-lg border bg-neutral-50 p-4">
                                   <div className="mb-3 h-32 w-full rounded-lg bg-neutral-200"></div>
                                   <div className="h-4 w-3/4 rounded bg-neutral-300"></div>
                                   <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200"></div>
                                </div>
                              ))}
                           </div>
                        ) : (
                          <div className="py-8 text-center text-sm text-neutral-400 italic">Archive listing hidden</div>
                        )}

                        {selected["archive_pagination"] && (
                           <div className="mt-6 flex justify-center gap-2">
                             <div className="h-8 w-8 rounded bg-neutral-200"></div>
                             <div className="h-8 w-8 rounded bg-blue-600"></div>
                             <div className="h-8 w-8 rounded bg-neutral-200"></div>
                           </div>
                        )}
                    </div>
                 </div>

                 {/* Footer Preview */}
                 {selected["footer"] && (
                    <div className="bg-neutral-900 px-6 py-8 text-neutral-400">
                      <div className="grid grid-cols-3 gap-4">
                         <div className="h-4 w-20 rounded bg-neutral-800"></div>
                         <div className="h-4 w-20 rounded bg-neutral-800"></div>
                         <div className="h-4 w-20 rounded bg-neutral-800"></div>
                      </div>
                    </div>
                 )}
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-4 border-t pt-6">
              <button
                onClick={() => setSelected(DEFAULT_SELECTED)}
                className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                Reset Defaults
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95"
              >
                Save Bindings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

