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
      avatar: null, // Placeholder
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
      avatar: null,
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
      avatar: null,
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
      avatar: null,
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
      avatar: null,
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
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors">
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

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Categories</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {BLOG_POSTS.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50/50 transition-colors"
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
                      <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        {/* Placeholder Avatar */}
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-700 whitespace-nowrap">
                        {post.author.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {post.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
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
                          : "bg-yellow-50 text-yellow-600 border-yellow-100",
                      )}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors">
      <span>{label}</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
}
