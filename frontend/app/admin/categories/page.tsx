"use client";

import { Plus, Search, MoreHorizontal, Edit, Trash } from "lucide-react";

const categories = [
  { id: 1, name: "Development", slug: "development", posts: 12 },
  { id: 2, name: "Design", slug: "design", posts: 8 },
  { id: 3, name: "Tutorials", slug: "tutorials", posts: 5 },
  { id: 4, name: "News", slug: "news", posts: 3 },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 mt-1">Manage blog post categories.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Count</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-slate-700">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{category.slug}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    {category.posts} posts
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
