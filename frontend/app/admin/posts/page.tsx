"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RotateCcw,
  Plus,
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
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [authorFilter, setAuthorFilter] = useState("All Authors");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
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

  // Helper to parse categories robustly
  const parseCategories = (rawCats: any): string[] => {
    if (!rawCats) return [];
    if (Array.isArray(rawCats)) return rawCats.filter(Boolean);
    if (typeof rawCats === 'string') {
      try {
        const parsed = JSON.parse(rawCats);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        return [String(parsed)].filter(Boolean);
      } catch (e) {
        // Clean up broken strings like "{Tech}" or "['Tech']"
        return rawCats
          .replace(/[\[\]\{\}"']/g, '')
          .split(',')
          .map((c: string) => c.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  // Get unique categories and authors for filter options
  const predefinedCategories = ["Tech", "Education", "Lifestyle", "Business", "Marketing", "Travelling"];
  const allCategories = Array.from(new Set([
    ...predefinedCategories,
    ...(Array.isArray(posts) ? posts.flatMap(p => parseCategories(p.categories || p.category)) : [])
  ])).sort();

  const allAuthors = Array.from(new Set(
    (Array.isArray(posts) ? posts : []).map(p => String(p.author?.name || p.author_name || 'Unknown Author'))
  )).filter(Boolean).sort();

  const filteredPosts = Array.isArray(posts) 
    ? posts.filter(post => {
        const matchesSearch = (post.title || "").toLowerCase().includes((searchQuery || "").toLowerCase());
        
        const postStatus = post.status || "Draft";
        const matchesStatus = statusFilter === "All" || postStatus.toLowerCase() === statusFilter.toLowerCase();
        
        const postCats = parseCategories(post.categories || post.category);
        const matchesCategory = categoryFilter === "All Categories" || postCats.some(c => c.toLowerCase() === categoryFilter.toLowerCase());
        
        const authorName = String(post.author?.name || post.author_name || 'Unknown Author');
        const matchesAuthor = authorFilter === "All Authors" || authorName.toLowerCase() === authorFilter.toLowerCase();
        
        return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
      }).sort((a, b) => (b.id || 0) - (a.id || 0))
    : [];

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All Categories");
    setAuthorFilter("All Authors");
  };

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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blog Posts</h1>
          <p className="text-gray-400 mt-0.5 text-sm font-medium">
            Manage your content, edit stories and track performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchPosts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RotateCcw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </button>
          <Link 
            href="/admin/posts/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-[13px] font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
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
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto pb-2 lg:pb-0">
          <FilterButton 
            label="Status" 
            options={["All", "Published", "Draft"]} 
            value={statusFilter} 
            onChange={setStatusFilter} 
          />
          <FilterButton 
            label="Category" 
            options={["All Categories", ...allCategories]} 
            value={categoryFilter} 
            onChange={setCategoryFilter} 
          />
          <FilterButton 
            label="Author" 
            options={["All Authors", ...allAuthors]} 
            value={authorFilter} 
            onChange={setAuthorFilter} 
          />
          <button 
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">POST DETAILS</th>
                <th className="px-3 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">AUTHOR</th>
                <th className="px-3 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                <th className="px-3 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">FEATURED</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
                filteredPosts.map((post, index) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            src={post.thumbnailUrl || post.coverImage || post.featured_image || post.imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&q=80"} 
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 max-w-[300px]">
                          <p className="text-sm font-bold text-gray-900 truncate" title={post.title}>{post.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              let cats: any[] = [];
                              const rawCats = post.categories || post.category;
                              if (Array.isArray(rawCats)) cats = rawCats;
                              else if (typeof rawCats === 'string') {
                                try { cats = JSON.parse(rawCats); } catch(e) { cats = rawCats.split(',').map((c: string) => c.trim()); }
                              }
                              const firstCat = cats[0];
                              return firstCat ? (
                                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                  {firstCat}
                                </span>
                              ) : null;
                            })()}
                            <span className="text-[11px] font-bold text-gray-400">#{filteredPosts.length - index}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                          {(() => {
                            const author = post.author;
                            const authorName = author?.name || post.author_name || 'Admin';
                            const avatar = author?.image || author?.avatar;
                            const src = avatar 
                              ? (avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `http://localhost:5000${avatar.startsWith('/') ? '' : '/'}${avatar}`)
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
                            return (
                              <img 
                                src={src} 
                                alt="author" 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
                                }}
                              />
                            );
                          })()}
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {post.author?.name || post.author_name || 'Unknown Author'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold",
                        post.status === "Published" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-amber-50 text-amber-600"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          post.status === "Published" ? "bg-emerald-500" : "bg-amber-500"
                        )}></span>
                        {post.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-3 py-5">
                      <button className={cn(
                        "transition-all",
                        post.featured ? "text-amber-400" : "text-gray-300 hover:text-gray-400"
                      )}>
                        <Star className={cn("w-4 h-4", post.featured && "fill-amber-400")} />
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 bg-white border border-red-100 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
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
                      <button 
                        onClick={handleClearFilters}
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
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

function FilterButton({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string, 
  options: string[], 
  value: string, 
  onChange: (val: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-6 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 transition-all shadow-sm"
      >
        <span>{(!value || value.includes("All")) ? label : value}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">
          {options.map(opt => (
            <button 
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                value === opt ? "font-bold text-blue-600 bg-blue-50/50" : "font-medium text-gray-600"
              )}
            >
              {opt}
            </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
