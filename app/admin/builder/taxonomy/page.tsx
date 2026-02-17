"use client";

import Link from "next/link";
import { ArrowLeft, Tag, Plus, X, Search, Hash } from "lucide-react";

export default function TaxonomyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Categories & Tags
            </h1>
            <p className="text-slate-500">
              Organize your post for better discoverability.
            </p>
          </div>
          <Link
            href="/admin/builder"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                Categories
              </div>
              <span className="text-xs font-medium text-slate-400">
                2 Selected
              </span>
            </div>

            {/* Search / Add */}
            <div className="p-4 border-b border-slate-50 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-9 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
                <Plus className="w-4 h-4" /> Add New Category
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {[
                "Development",
                "Design",
                "Technology",
                "Tutorials",
                "News",
                "Updates",
                "Community",
                "Events",
                "Resources",
                "Lifestyle",
              ].map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    defaultChecked={["Development", "Technology"].includes(cat)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Hash className="w-4 h-4" />
              </div>
              Tags
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new tag..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                  Add
                </button>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Active Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {["react", "web-dev", "future-tech", "ai"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                    >
                      #{tag}
                      <button className="hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Suggested Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {["javascript", "css", "design-systems", "productivity"].map(
                    (tag) => (
                      <button
                        key={tag}
                        className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-sm hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        + {tag}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
              Tags help users find your content via search.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/builder">
            <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
              Cancel
            </button>
          </Link>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
