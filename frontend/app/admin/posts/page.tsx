"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Star, 
  ChevronDown, 
  Loader2,
  X,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [featuredFilter, setFeaturedFilter] = useState("All Posts");
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: number) => {
    if (!id || !confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const postsArray = Array.isArray(posts) ? posts : [];

  const allCategories = Array.from(new Set(postsArray.flatMap(p => {
    const rawCats = p?.categories || p?.category;
    if (Array.isArray(rawCats)) return rawCats;
    if (typeof rawCats === 'string' && rawCats.trim()) {
      try { return JSON.parse(rawCats); } catch(e) { return [rawCats]; }
    }
    return [];
  }))).filter(c => typeof c === 'string' && c.length > 0);

  const allAuthors = Array.from(new Set(postsArray.map(p => {
    const name = p?.author?.name || p?.author_name || "Unknown Author";
    return typeof name === 'string' ? name : "Unknown Author";
  }))).filter(Boolean);

  const filteredPosts = postsArray.filter(post => {
    if (!post) return false;
    const title = String(post?.title || "").toLowerCase();
    const authorName = String(post?.author?.name || post?.author_name || "Unknown Author").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    if (query && !title.includes(query) && !authorName.includes(query)) return false;
    
    if (statusFilter !== "All Statuses") {
      const status = post?.status || "Draft";
      if (status !== statusFilter) return false;
    }

    if (authorFilter !== "All Authors") {
      const name = post?.author?.name || post?.author_name || "Unknown Author";
      if (name !== authorFilter) return false;
    }
    
    if (categoryFilter !== "All Categories") {
      let cats: string[] = [];
      const rawCats = post?.categories || post?.category;
      if (Array.isArray(rawCats)) cats = rawCats.map(String);
      else if (typeof rawCats === 'string') {
        try { 
          const parsed = JSON.parse(rawCats);
          cats = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
        } catch(e) { cats = [rawCats]; }
      }
      if (!cats.some(c => c === categoryFilter)) return false;
    }

    if (featuredFilter === "Featured Only" && !post?.featured) return false;
    if (featuredFilter === "Regular Only" && post?.featured) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#E8F1F9] pt-4 pb-6 px-6">
      <div className="max-w-[1575px] mx-auto">
        {/* Header Section */}
        <div className="h-[80px] flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 leading-none">Posts</h1>
            <p className="text-[15px] text-slate-500 font-medium mt-2">Welcome back! Here's your Blog Posts.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchPosts}
              className="h-10 px-4.5 flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <RotateCcw className={cn("w-[18px] h-[18px]", loading && "animate-spin")} />
              Refresh
            </button>
            <Link 
              href="/admin/posts/create"
              className="h-10 px-4.5 flex items-center gap-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-[18px] h-[18px]" />
              Create Blog
            </Link>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[14px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[280px] max-w-[400px]">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-[14px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-200 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <FilterSelect 
                  value={statusFilter} 
                  onChange={setStatusFilter} 
                  options={["All Statuses", "Published", "Draft", "Unpublished"]} 
                />
                <FilterSelect 
                  value={authorFilter} 
                  onChange={setAuthorFilter} 
                  options={["All Authors", ...allAuthors]} 
                />
                <FilterSelect 
                  value={categoryFilter} 
                  onChange={setCategoryFilter} 
                  options={["All Categories", ...allCategories]} 
                />
                <FilterSelect 
                  value={featuredFilter} 
                  onChange={setFeaturedFilter} 
                  options={["All Posts", "Featured Only", "Regular Only"]} 
                />
              </div>

              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All Statuses");
                  setAuthorFilter("All Authors");
                  setCategoryFilter("All Categories");
                  setFeaturedFilter("All Posts");
                }}
                className="h-10 px-4 flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors border border-slate-100 rounded-xl whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="h-[52px]">
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200 w-[80px]">ID</th>
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200 w-[350px]">Title</th>
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200">Author</th>
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200">Categories</th>
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200">Featured</th>
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200">Status</th>
                    <th className="px-4 text-[13px] font-bold text-slate-400 border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-20 text-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <tr key={post?.id || Math.random()} className="h-[72px] hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0">
                        <td className="px-4 text-[14px] font-medium text-slate-900">{post?.id}</td>
                        <td className="px-4">
                          <p className="text-[14px] font-bold text-slate-800 line-clamp-1">{post?.title || "Untitled"}</p>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-2.5">
                            {(() => {
                              const author = post?.author;
                              const avatar = author?.avatar;
                              let src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author?.name || post?.author_name || post?.id || 'A'}`;
                              
                              if (avatar && typeof avatar === 'string') {
                                src = (avatar.startsWith('http') || avatar.startsWith('data:')) 
                                  ? avatar 
                                  : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`;
                              }

                              return (
                                <img 
                                  src={src} 
                                  className="w-8 h-8 rounded-full bg-slate-100 object-cover border border-slate-100"
                                  alt=""
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author?.name || post?.author_name || 'A'}`;
                                  }}
                                />
                              );
                            })()}
                            <span className="text-[14px] font-medium text-slate-700 truncate max-w-[120px]">
                              {post?.author?.name || post?.author_name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              let cats: string[] = [];
                              const rawCats = post?.categories || post?.category;
                              if (Array.isArray(rawCats)) cats = rawCats.map(String);
                              else if (typeof rawCats === 'string') {
                                try { 
                                  const parsed = JSON.parse(rawCats);
                                  cats = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
                                } catch(e) { cats = [rawCats]; }
                              }
                              return cats.length > 0 ? cats.slice(0, 2).map((cat, i) => (
                                <span key={i} className="h-[26px] px-3 flex items-center rounded-full text-[12px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                  {cat}
                                </span>
                              )) : <span className="text-[12px] text-slate-300 italic">None</span>;
                            })()}
                          </div>
                        </td>
                        <td className="px-4">
                          {post?.featured ? (
                            <span className="h-[26px] px-3 inline-flex items-center gap-1.5 rounded-full text-[12px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                              <Star className="w-3.5 h-3.5 fill-amber-600" />
                              Featured
                            </span>
                          ) : (
                            <span className="h-[26px] px-3 inline-flex items-center rounded-full text-[12px] font-bold bg-slate-50 text-slate-400 border border-slate-100">
                              Regular
                            </span>
                          )}
                        </td>
                        <td className="px-4">
                          <span className={cn(
                            "h-[26px] px-3 inline-flex items-center rounded-full text-[12px] font-bold",
                            post?.status === "Published" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          )}>
                            {post?.status || 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              href={`/admin/posts/edit/${post?.id}`}
                              className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                              <Edit className="w-[18px] h-[18px]" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(post?.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-32 text-center text-slate-400">
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <p className="text-[14px] text-slate-500">
                  Showing {filteredPosts.length > 0 ? 1 : 0} to {Math.min(rowsPerPage, filteredPosts.length)} of {filteredPosts.length} results
                </p>
                <div className="flex items-center gap-2.5">
                  <span className="text-[14px] text-slate-500">Rows per page:</span>
                  <div className="relative">
                    <select 
                      value={rowsPerPage} 
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-[14px] font-medium text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-10 px-4 flex items-center gap-2 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-[14px] shadow-lg shadow-blue-500/20">1</button>
                <button className="h-10 px-4 flex items-center gap-2 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50" disabled>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: any[] }) {
  return (
    <div className="relative w-52">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 text-[14px] font-medium text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-200 transition-all cursor-pointer"
      >
        {options.map((opt, i) => (
          <option key={i} value={String(opt)}>{String(opt)}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
