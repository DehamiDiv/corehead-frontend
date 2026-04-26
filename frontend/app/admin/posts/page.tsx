"use client";

import { useState, useEffect } from "react";
import {
  RotateCcw,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  ChevronDown,
  X,
  Filter,
  MoreHorizontal,
  ExternalLink,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const filteredPosts = Array.isArray(posts) 
    ? posts.filter(post => post.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const stats = [
    { label: "Total Posts", value: Array.isArray(posts) ? posts.length : 0, color: "blue" },
    { label: "Published", value: Array.isArray(posts) ? posts.filter(p => p.status === 'Published').length : 0, color: "emerald" },
    { label: "Drafts", value: Array.isArray(posts) ? posts.filter(p => p.status === 'Draft').length : 0, color: "amber" },
    { label: "Featured", value: Array.isArray(posts) ? posts.filter(p => p.featured).length : 0, color: "purple" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">
            Manage your content, edit stories and track performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPosts}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RotateCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
          <Link 
            href="/admin/posts/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            Create Blogs
          </Link>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <FilterButton label="Status" />
          <FilterButton label="Category" />
          <FilterButton label="Author" />
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Post Details</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Featured</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-500 font-medium">Fetching your posts...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&q=80"} 
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 max-w-[300px]">
                          <p className="text-sm font-bold text-gray-900 truncate" title={post.title}>{post.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {post.categories?.slice(0, 2).map((cat: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                                {cat}
                              </span>
                            ))}
                            <span className="text-[10px] text-gray-400 font-medium">#{post.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-white shadow-sm overflow-hidden">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`} 
                            alt="" 
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{post.author?.name || 'Unknown Author'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border",
                        post.status === "Published" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", post.status === "Published" ? "bg-emerald-500" : "bg-amber-500")} />
                        {post.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button className={cn(
                        "p-2 rounded-xl transition-all",
                        post.featured ? "bg-amber-50 text-amber-500 border border-amber-100 shadow-sm" : "text-gray-300 hover:text-gray-400"
                      )}>
                        <Star className={cn("w-4 h-4", post.featured && "fill-amber-500")} />
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/30 transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50/30 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-gray-900 shadow-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <div className="p-6 bg-gray-50 rounded-full">
                        <FileText className="w-10 h-10" />
                      </div>
                      <p className="text-lg font-bold">No posts found</p>
                      <Link href="/admin/posts/create" className="text-blue-600 font-bold hover:underline">
                        Create your first post
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-8 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 transition-all shadow-sm">
      <span>{label}</span>
      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
    </button>
  );
}
