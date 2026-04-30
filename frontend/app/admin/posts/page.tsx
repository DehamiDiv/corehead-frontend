"use client";

import { useState, useEffect } from "react";
import {
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Star,
  ChevronDown,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");

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

  const filteredPosts = posts.filter(post => {
    if (statusFilter) {
      const postStatus = post.status || "Draft";
      if (postStatus !== statusFilter) return false;
    }
    if (authorFilter) {
      const postAuthor = post.author?.name || String(post.authorId) || "Unknown Author";
      if (postAuthor !== authorFilter) return false;
    }
    if (categoryFilter) {
      let cats: string[] = [];
      const rawCats = post.categories || post.category;
      if (Array.isArray(rawCats)) cats = rawCats;
      else if (typeof rawCats === 'string') {
        try { cats = JSON.parse(rawCats); } catch(e) { cats = [rawCats]; }
      }
      const hasCategory = cats.some((c: string) => c.toLowerCase() === categoryFilter.toLowerCase());
      if (!hasCategory) return false;
    }
    if (featuredFilter) {
      if (featuredFilter === "Featured Only" && !post.featured) return false;
      if (featuredFilter === "Regular Only" && post.featured) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Posts</h1>
          <p className="text-gray-400 mt-0.5 text-sm font-medium">
            Welcome back! Here's your Blog Posts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchPosts}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RotateCcw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </button>
          <Link 
            href="/admin/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-[13px] font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Blog
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Filters */}
        <div className="p-8 pb-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FilterButton 
              label="All Statuses" 
              options={["Published", "Draft", "Unpublished"]} 
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterButton 
              label="All Authors" 
              options={["Pipuni Piyasooriya", "Dehami Divyanjali", "Nimasha Fernando", "Rashmi Shara", "Corehead"]}
              value={authorFilter}
              onChange={setAuthorFilter}
            />
            <FilterButton 
              label="All Categories" 
              options={["Test Cat", "AI", "Travelling"]}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
            <FilterButton 
              label="All Posts" 
              options={["Featured Only", "Regular Only"]}
              value={featuredFilter}
              onChange={setFeaturedFilter}
            />
          </div>
          <button 
            onClick={() => {
              setStatusFilter("");
              setAuthorFilter("");
              setCategoryFilter("");
              setFeaturedFilter("");
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors w-fit"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-[13px] font-bold text-gray-400 w-16">ID</th>
                <th className="px-3 py-4 text-[13px] font-bold text-gray-400">Title</th>
                <th className="px-3 py-4 text-[13px] font-bold text-gray-400">Author</th>
                <th className="px-3 py-4 text-[13px] font-bold text-gray-400">Categories</th>
                <th className="px-3 py-4 text-[13px] font-bold text-gray-400">Featured</th>
                <th className="px-3 py-4 text-[13px] font-bold text-gray-400">Status</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-500 font-medium">Fetching your posts...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-900">{post.id}</td>
                    <td className="px-3 py-4 text-[13px] font-bold text-gray-900 max-w-[200px] truncate" title={post.title}>
                      {post.title}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <img 
                          src={
                            post.author?.avatar 
                              ? (post.author.avatar.startsWith('http') || post.author.avatar.startsWith('data:') 
                                ? post.author.avatar 
                                : `http://localhost:5000${post.author.avatar}`)
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`
                          } 
                          alt="" 
                          className="w-7 h-7 rounded-full object-cover bg-gray-100"
                        />
                        <span className="text-[13px] font-semibold text-gray-600 truncate max-w-[100px]" title={post.author?.name || String(post.authorId)}>
                          {post.author?.name || String(post.authorId) || 'Unknown Author'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {(() => {
                          let cats: any[] = [];
                          const rawCats = post.categories || post.category;
                          if (Array.isArray(rawCats)) cats = rawCats;
                          else if (typeof rawCats === 'string') {
                            try { cats = JSON.parse(rawCats); } catch(e) { cats = [rawCats]; }
                          }
                          return cats.map((cat: string, i: number) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-500">
                              {cat}
                            </span>
                          ));
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      {post.featured ? (
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-0.5 rounded-full text-[11px] font-bold border border-gray-100 text-gray-400">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <span className={cn(
                        "inline-flex px-3 py-0.5 rounded-full text-[11px] font-bold",
                        post.status === "Published" 
                          ? "bg-emerald-50 text-emerald-500" 
                          : "bg-amber-50 text-amber-500"
                      )}>
                        {post.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/admin/posts/edit/${post.id}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="text-red-400 w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <div className="p-6 bg-gray-50 rounded-full">
                        <FileText className="w-10 h-10" />
                      </div>
                      <p className="text-lg font-bold">No posts found</p>
                      <button 
                        onClick={() => setStatusFilter("")}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing 1 to {Math.min(20, filteredPosts.length)} of {filteredPosts.length} results
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <button className="flex items-center gap-3 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white shadow-sm">
                20 <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                &lt; Previous
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-bold flex items-center justify-center transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1">
                Next &gt;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FilterButton({ label, options, value, onChange }: { label: string, options?: string[], value?: string, onChange?: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!options) {
    return (
      <button className="flex items-center gap-6 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300 transition-all shadow-sm">
        <span>{label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-6 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300 transition-all shadow-sm"
      >
        <span>{value || label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-2">
          <button 
            onClick={() => {
              if(onChange) onChange("");
              setIsOpen(false);
            }}
            className={cn(
              "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50",
              !value ? "font-bold text-blue-600" : "font-medium text-gray-600"
            )}
          >
            {label}
          </button>
          {options.map(opt => (
            <button 
              key={opt}
              onClick={() => {
                if(onChange) onChange(opt);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                value === opt ? "font-bold text-blue-600" : "font-medium text-gray-600"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
