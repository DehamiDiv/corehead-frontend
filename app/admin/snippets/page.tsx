"use client";

import { Search, Plus, FileCode, Copy, MoreHorizontal } from "lucide-react";

const snippets = [
  {
    id: 1,
    name: "Author Bio Box",
    type: "Component",
    lastUpdated: "2 days ago",
    usage: "12 posts",
  },
  {
    id: 2,
    name: "Newsletter Signup (Footer)",
    type: "Form",
    lastUpdated: "5 days ago",
    usage: "Global",
  },
  {
    id: 3,
    name: "Related Posts Grid",
    type: "Layout",
    lastUpdated: "1 week ago",
    usage: "All blog posts",
  },
  {
    id: 4,
    name: "Call to Action (Premium)",
    type: "Banner",
    lastUpdated: "2 weeks ago",
    usage: "5 posts",
  },
];

export default function SnippetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dynamic CMS Snippets
          </h1>
          <p className="text-slate-500 mt-1">
            Manage reusable content blocks and components for your blog.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Create Snippet
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search snippets..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
              <option>All Types</option>
              <option>Component</option>
              <option>Form</option>
              <option>Layout</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Snippet Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3">Usage</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {snippets.map((snippet) => (
              <tr
                key={snippet.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">
                      {snippet.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    {snippet.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {snippet.lastUpdated}
                </td>
                <td className="px-6 py-4 text-slate-500">{snippet.usage}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100 transition-all"
                      title="Copy ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
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
