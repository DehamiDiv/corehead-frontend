"use client";

import { useState } from "react";
import {
  RotateCcw,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data to match screenshot
const BLOG_POSTS = [
  {
    id: 26,
    title: "administration works",
    author: {
      name: "Sayuru Piy...",
      avatar: "Sayuru",
    },
    categories: ["Test Cat"],
    featured: false,
    status: "Published",
  },
  {
    id: 23,
    title: "Test",
    author: {
      name: "Sayuru Piy...",
      avatar: "Sayuru",
    },
    categories: ["StartUps", "test cat1"],
    featured: true,
    status: "Unpublished",
  },
  {
    id: 22,
    title: "test blog uni team",
    author: {
      name: "Sayuru Piy...",
      avatar: "Sayuru",
    },
    categories: ["test cat1"],
    featured: true,
    status: "Unpublished",
  },
  {
    id: 20,
    title: "Mastering Remote Work: Practical Strategies f...",
    author: {
      name: "Ahinsa Jay...",
      avatar: "Ahinsa",
    },
    categories: ["Education", "Home & Living", "Marketing", "Remote Tools"],
    featured: true,
    status: "Published",
  },
  {
    id: 19,
    title: "How to Scale Your Small Business in 2025: Pr...",
    author: {
      name: "Sayuru Piy...",
      avatar: "Sayuru",
    },
    categories: ["Business", "StartUps", "Marketing"],
    featured: false,
    status: "Published",
  },
];

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's your Blog Posts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            Create Blog
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <FilterDropdown label="All Statuses" />
          <FilterDropdown label="All Authors" />
          <FilterDropdown label="All Categories" />
          <FilterDropdown label="All Posts" />

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-medium text-gray-500">ID</th>
                <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                <th className="px-6 py-4 font-medium text-gray-500">Author</th>
                <th className="px-6 py-4 font-medium text-gray-500">
                  Categories
                </th>
                <th className="px-6 py-4 font-medium text-gray-500">
                  Featured
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {BLOG_POSTS.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-gray-500">{post.id}</td>
                  <td
                    className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate"
                    title={post.title}
                  >
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-gray-100">
                        {/* Placeholder Avatar */}
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.avatar}`}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-700 whitespace-nowrap text-sm">
                        {post.author.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {post.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100/50"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.featured ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                        <Star className="w-3 h-3 fill-amber-600" />
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
                        Regular
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        post.status === "Published"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100",
                      )}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-between gap-8 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-colors min-w-[140px]">
      <span>{label}</span>
      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
    </button>
  );
}
