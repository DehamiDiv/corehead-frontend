"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tags, Hash, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_CATEGORIES = [
  { id: 1, name: "Business", slug: "business", posts: 12, color: "blue" },
  { id: 2, name: "Technology", slug: "technology", posts: 25, color: "emerald" },
  { id: 3, name: "Marketing", slug: "marketing", posts: 8, color: "purple" },
  { id: 4, name: "Lifestyle", slug: "lifestyle", posts: 15, color: "rose" },
  { id: 5, name: "Education", slug: "education", posts: 10, color: "amber" },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = INITIAL_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your blog content with meaningful categories.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Search & Actions */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
          <span>{filteredCategories.length} Categories Total</span>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                `bg-${category.color}-50 text-${category.color}-600`
              )}>
                <Tags className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {category.name}
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
              </h3>
              <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {category.slug}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${category.name + i}`} alt="" />
                   </div>
                 ))}
                 <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                   +2
                 </div>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {category.posts} Posts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
