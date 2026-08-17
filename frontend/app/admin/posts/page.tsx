"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  ChevronDown,
  Loader2,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { resolveAdminMediaUrl } from "@/lib/apiOrigin";
import {
  isPostLive,
  normalizePostStatus,
  postStatusBadgeClass,
} from "@/lib/postStatus";
import EmptyState from "@/components/ui/EmptyState";
import { useOptionalSite } from "@/components/admin/SiteContext";

export default function PostsPage() {
  const siteCtx = useOptionalSite();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [featuredFilter, setFeaturedFilter] = useState("All Posts");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isLaunching, setIsLaunching] = useState(false);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [statusActionId, setStatusActionId] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const currentSiteId = siteCtx?.currentSiteId ?? null;
  const siteLoading = siteCtx?.loading ?? false;

  const extractCategoryNames = (rawCats: any): string[] => {
    if (!rawCats) return [];
    let parsed: any[] = [];
    if (Array.isArray(rawCats)) {
      parsed = rawCats;
    } else if (typeof rawCats === "string" && rawCats.trim()) {
      try {
        const res = JSON.parse(rawCats);
        parsed = Array.isArray(res) ? res : [res];
      } catch {
        parsed = [rawCats];
      }
    } else if (typeof rawCats === "object") {
      parsed = [rawCats];
    }

    return parsed
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (typeof item === "number") return String(item);
        if (typeof item === "object" && item !== null) {
          return (item.name || item.title || item.slug || "").trim();
        }
        return "";
      })
      .filter((name) => name.length > 0);
  };

  useEffect(() => {
    // Premium launch delay to show animation
    const timer = setTimeout(() => {
      setIsLaunching(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchPosts = useCallback(async () => {
    if (siteLoading) return;

    if (!currentSiteId) {
      setPosts([]);
      setFetchError("Create or select a site before managing posts.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const data = await api.getPosts(currentSiteId);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
      setFetchError(err?.message || "Failed to fetch posts for the selected site.");
    } finally {
      setLoading(false);
    }
  }, [currentSiteId, siteLoading]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch categories from DB
  useEffect(() => {
    api.getCategories()
      .then((res: any) => {
        const cats = res?.categories || res || [];
        setDbCategories(cats.map((c: any) => c.name).filter(Boolean));
      })
      .catch(() => setDbCategories([]));
  }, []);

  if (isLaunching) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.3)] flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
            <FileText className="w-12 h-12 text-blue-600 relative z-10" />
          </div>
          
          <h1 className="text-white text-3xl font-black tracking-tighter mb-2 italic">
            CORE<span className="text-blue-500">HEAD</span>
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-blue-500" />
             <p className="text-blue-200/50 font-bold uppercase tracking-[0.3em] text-[10px]">Managing Your Stories</p>
             <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-blue-500 rounded-full animate-progress-loading" style={{ width: '100%' }} />
        </div>

        <style jsx>{`
          @keyframes progress-loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-progress-loading {
            animation: progress-loading 1.5s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!id || !confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  /** T11: Publish post → public site visible */
  const handlePublish = async (id: number) => {
    if (!id) return;
    setStatusActionId(id);
    try {
      const res = await api.publishPost(id);
      const updated = res?.post || res;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...updated, status: "Published", isPublished: true }
            : p
        )
      );

      // Trigger post publication email alert to site subscribers
      const targetPost = postsArray.find((p) => p.id === id);
      const siteSlug = siteCtx?.currentSite?.slug || "";
      const siteName = siteCtx?.currentSite?.name || "Blog";
      api.notifySubscribersNewPost({
        title: updated?.title || targetPost?.title || "New Story Published",
        slug: updated?.slug || targetPost?.slug || "",
        excerpt: updated?.excerpt || targetPost?.excerpt || "",
        coverImage: updated?.thumbnailUrl || targetPost?.thumbnailUrl || undefined,
        siteSlug,
        siteName,
        siteId: currentSiteId || undefined,
      }).catch(() => {});
    } catch (err: any) {
      console.error("Publish failed:", err);
      alert(err?.message || "Failed to publish post");
    } finally {
      setStatusActionId(null);
    }
  };

  /** T11: Unpublish → hidden from public site */
  const handleUnpublish = async (id: number) => {
    if (!id) return;
    if (!confirm("Unpublish this post? It will no longer appear on your public site.")) {
      return;
    }
    setStatusActionId(id);
    try {
      const res = await api.unpublishPost(id, "Draft");
      const updated = res?.post || res;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...updated, status: "Draft", isPublished: false }
            : p
        )
      );
    } catch (err: any) {
      console.error("Unpublish failed:", err);
      alert(err?.message || "Failed to unpublish post");
    } finally {
      setStatusActionId(null);
    }
  };

  const postsArray = Array.isArray(posts) ? posts : [];

  const postCategories = Array.from(
    new Set(
      postsArray.flatMap((p) => extractCategoryNames(p?.categories || p?.category))
    )
  ).filter(Boolean);

  const combinedCategories = Array.from(
    new Set([...dbCategories, ...postCategories])
  ).filter((c) => typeof c === "string" && c.trim().length > 0);

  const allAuthors = Array.from(
    new Set(
      postsArray.map((p) => {
        const name = p?.author?.name || p?.author_name || "Unknown Author";
        return typeof name === "string" ? name.trim() : "Unknown Author";
      })
    )
  ).filter(Boolean) as string[];

  const filteredPosts = postsArray.filter((post) => {
    if (!post) return false;
    const title = String(post?.title || "").toLowerCase();
    const authorName = String(
      post?.author?.name || post?.author_name || "Unknown Author"
    ).toLowerCase();
    const query = searchQuery.toLowerCase();

    if (query && !title.includes(query) && !authorName.includes(query))
      return false;

    if (statusFilter !== "All Statuses") {
      const live = isPostLive(post);
      const normalized = normalizePostStatus(post?.status);
      if (statusFilter === "Published" && !live) return false;
      if (statusFilter === "Draft" && (live || normalized !== "Draft")) return false;
      if (statusFilter === "Unpublished" && (live || normalized !== "Unpublished")) return false;
    }

    if (authorFilter !== "All Authors") {
      const name =
        post?.author?.name || post?.author_name || "Unknown Author";
      if (name.trim() !== authorFilter.trim()) return false;
    }

    if (categoryFilter !== "All Categories") {
      const postCats = extractCategoryNames(post?.categories || post?.category);
      if (!postCats.includes(categoryFilter)) return false;
    }

    if (featuredFilter === "Featured Only") {
      const isFeatured =
        post?.featured === true ||
        post?.featured === 1 ||
        post?.featured === "1" ||
        String(post?.featured).toLowerCase() === "true";
      if (!isFeatured) return false;
    }

    if (featuredFilter === "Regular Only") {
      const isFeatured =
        post?.featured === true ||
        post?.featured === 1 ||
        post?.featured === "1" ||
        String(post?.featured).toLowerCase() === "true";
      if (isFeatured) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#E8F1F9] pt-4 pb-6 px-6">
      <div className="max-w-[1575px] mx-auto">
        {/* Header */}
        <div className="h-[80px] flex items-center justify-between mb-3">
          <div>
            <h1 className="admin-title">Posts</h1>
            <p className="admin-subtitle">
              Welcome back! Here&apos;s your Blog Posts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPosts}
              className="h-10 px-4 flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl admin-btn-secondary text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <RotateCcw className={cn("w-[18px] h-[18px]", loading && "animate-spin")} />
              Refresh
            </button>
            <Link
              href="/admin/posts/create"
              onClick={() => sessionStorage.removeItem("editPostId")}
              className="h-10 px-4 flex items-center gap-2.5 bg-blue-600 text-white rounded-xl admin-btn-primary hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-[18px] h-[18px]" />
              Create Blog
            </Link>
          </div>
        </div>

        {fetchError && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <span>{fetchError}</span>
            <button
              type="button"
              onClick={fetchPosts}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-bold hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-[14px] shadow-sm border border-slate-100 overflow-hidden">
          {/* Filters */}
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[280px] max-w-[400px]">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 admin-input text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-200 focus:bg-white transition-all"
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
                  options={["All Categories", ...combinedCategories]}
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

          {/* Table */}
          <div className="border-t border-slate-100 p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="h-[52px]">
                    <th className="px-4 admin-table-th border-b border-slate-200 w-[80px]">ID</th>
                    <th className="px-4 admin-table-th border-b border-slate-200 w-[350px]">Title</th>
                    <th className="px-4 admin-table-th border-b border-slate-200">Author</th>
                    <th className="px-4 admin-table-th border-b border-slate-200">Categories</th>
                    <th className="px-4 admin-table-th border-b border-slate-200">Featured</th>
                    <th className="px-4 admin-table-th border-b border-slate-200">Status</th>
                    <th className="px-4 admin-table-th border-b border-slate-200 text-right">Actions</th>
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
                      <tr
                        key={post?.id || Math.random()}
                        className="h-[72px] hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0"
                      >
                        <td className="px-4 admin-table-td">{post?.id}</td>
                        <td className="px-4">
                          <p className="admin-table-td-bold line-clamp-1">
                            {post?.title || "Untitled"}
                          </p>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-2.5">
                            {(() => {
                              const author = post?.author;
                              const avatar = author?.avatar;
                              let src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author?.name || post?.author_name || post?.id || "A"}`;
                              if (avatar && typeof avatar === "string") {
                                src =
                                  resolveAdminMediaUrl(avatar) || avatar;
                              }
                              return (
                                <img
                                  src={src}
                                  className="w-8 h-8 rounded-full bg-slate-100 object-cover border border-slate-100"
                                  alt=""
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author?.name || post?.author_name || "A"}`;
                                  }}
                                />
                              );
                            })()}
                            <span className="admin-table-td truncate max-w-[120px]">
                              {post?.author?.name || post?.author_name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const cats = extractCategoryNames(post?.categories || post?.category);
                              return cats.length > 0 ? (
                                cats.slice(0, 2).map((cat, i) => (
                                  <span key={i} className="h-[26px] px-3 flex items-center rounded-full admin-small bg-blue-50 text-blue-600 border border-blue-100">
                                    {cat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[12px] text-slate-300 italic">None</span>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-4">
                          {post?.featured ? (
                            <span className="h-[26px] px-3 inline-flex items-center gap-1.5 rounded-full admin-small bg-amber-50 text-amber-600 border border-amber-100">
                              <Star className="w-3.5 h-3.5 fill-amber-600" />
                              Featured
                            </span>
                          ) : (
                            <span className="h-[26px] px-3 inline-flex items-center rounded-full admin-small bg-slate-50 text-slate-400 border border-slate-100">
                              Regular
                            </span>
                          )}
                        </td>
                        <td className="px-4">
                          <span
                            className={cn(
                              "h-[26px] px-3 inline-flex items-center rounded-full text-[12px] font-bold",
                              postStatusBadgeClass(post?.status)
                            )}
                          >
                            {normalizePostStatus(post?.status)}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPostLive(post) ? (
                              <button
                                type="button"
                                title="Unpublish"
                                disabled={statusActionId === post?.id}
                                onClick={() => handleUnpublish(post?.id)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {statusActionId === post?.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <EyeOff className="w-[18px] h-[18px]" />
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Publish"
                                disabled={statusActionId === post?.id}
                                onClick={() => handlePublish(post?.id)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {statusActionId === post?.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-[18px] h-[18px]" />
                                )}
                              </button>
                            )}
                            <Link
                              href="/admin/posts/create"
                              onClick={() => sessionStorage.setItem("editPostId", String(post?.id))}
                              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-[18px] h-[18px]" />
                            </Link>
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => handleDelete(post?.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : null}
                </tbody>
              </table>
              {!loading && filteredPosts.length === 0 && (
                <div className="pt-4">
                  {postsArray.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="Create your first post"
                      description={
                        siteCtx?.currentSite?.name
                          ? `“${siteCtx.currentSite.name}” has no posts yet. Write a draft, then publish it so readers can see it on your public site.`
                          : "This site has no posts yet. Write a draft, then publish it so readers can see it on your public blog."
                      }
                      actions={[
                        {
                          label: "Create post",
                          href: "/admin/posts/create",
                        },
                        ...(siteCtx?.currentSite?.slug
                          ? [
                              {
                                label: "View public blog",
                                href: `/s/${siteCtx.currentSite.slug}/blog`,
                                variant: "secondary" as const,
                              },
                            ]
                          : []),
                      ]}
                    />
                  ) : (
                    <EmptyState
                      compact
                      icon={Search}
                      title="No posts match your filters"
                      description="Try clearing search or status filters to see all posts on this site."
                      actions={[
                        {
                          label: "Clear filters",
                          variant: "secondary",
                          onClick: () => {
                            setSearchQuery("");
                            setStatusFilter("All Statuses");
                            setAuthorFilter("All Authors");
                            setCategoryFilter("All Categories");
                            setFeaturedFilter("All Posts");
                          },
                        },
                      ]}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <p className="text-[14px] text-slate-500">
                  Showing {filteredPosts.length > 0 ? 1 : 0} to{" "}
                  {Math.min(rowsPerPage, filteredPosts.length)} of{" "}
                  {filteredPosts.length} results
                </p>
                <div className="flex items-center gap-2.5">
                  <span className="text-[14px] text-slate-500">Rows per page:</span>
                  <div className="relative">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 admin-input text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10"
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
                <button
                  className="h-10 px-4 flex items-center gap-2 border border-slate-200 rounded-xl admin-btn-secondary text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                  disabled
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-[14px] shadow-lg shadow-blue-500/20">
                  1
                </button>
                <button
                  className="h-10 px-4 flex items-center gap-2 border border-slate-200 rounded-xl admin-btn-secondary text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                  disabled
                >
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

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-52">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 flex items-center justify-between text-[14px] font-medium text-slate-600 hover:border-slate-300 transition-all cursor-pointer shadow-sm text-left"
      >
        <span className="truncate">{value || options[0]}</span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-[14px] transition-colors hover:bg-slate-50",
                value === opt ? "font-bold text-blue-600 bg-blue-50/50" : "font-medium text-slate-600"
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
