"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown, Star, Search, FileText, ImagePlus, X, Library,
  Eye, Type, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Code, Link as LinkIcon, Image as ImageIcon, LayoutGrid, Minus, RemoveFormatting, Tag, Loader2,
  Upload,
  ChevronLeft,
  Check,
  Plus,
  Maximize2,
  Settings,
  Globe,
  PlusCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import PostPreviewModal from "@/components/admin/PostPreviewModal";
import AIBlogWriterModal from "@/components/admin/AIBlogWriterModal";
import PaywallModal from "@/components/admin/PaywallModal";
import { api } from "@/lib/api";
import { getApiBaseUrl, resolveAdminMediaUrl } from "@/lib/apiOrigin";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: {
    container: [
      ["undo", "redo"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike", { script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      undo: function (this: any) { this.quill.history.undo(); },
      redo: function (this: any) { this.quill.history.redo(); },
    },
  },
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

export default function CreatePostPage() {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("editPostId");
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("editPostId");
    }
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    authorId: "",
    categories: [] as string[],
    status: "Draft",
    featured: false,
    content: "",
    showToc: false,
    allowComments: true, // public can comment by default
    thumbnailUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    useThumbnailAsFeatured: true,
    canonicalUrl: "",
    structuredData: "",
  });

  const [keywordInput, setKeywordInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(!!editId);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Content");
  const [refining, setRefining] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const handleAiGenerate = (data: any) => {
    setFormData(prev => ({
      ...prev,
      title: data.title || prev.title,
      slug: (data.title || prev.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: data.excerpt || prev.excerpt,
      content: data.content || prev.content,
      metaTitle: data.seo?.metaTitle || prev.metaTitle,
      metaDescription: data.seo?.metaDescription || prev.metaDescription,
      keywords: data.seo?.keywords?.length ? data.seo.keywords : prev.keywords,
    }));
  };

  const handleInlineRefine = async (action: "grammar" | "longer" | "summarize") => {
    if (!formData.content) return;
    setRefining(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/ai/refine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ content: formData.content, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to refine content");
      }
      if (data.refined) {
        setFormData(prev => ({ ...prev, content: data.refined }));
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('LIMIT_EXCEEDED') || err.message?.includes('exceeded') || err.message?.includes('402')) {
        setIsPaywallOpen(true);
      } else {
        setError("AI refinement failed: " + err.message);
      }
    } finally {
      setRefining(false);
    }
  };
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const reader = new FileReader();
      const base64Data: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(file);
      });
      const uploaded = await api.uploadMedia({
        name: file.name,
        type: file.type,
        size: String(file.size),
        base64Data,
      });
      const rawUrl = uploaded.media?.url || uploaded.url || "";
      if (!rawUrl) throw new Error("Upload succeeded but no URL returned");
      setFormData((prev) => ({ ...prev, thumbnailUrl: rawUrl }));
    } catch (err: any) {
      setError(err?.message || "Failed to upload cover image");
    } finally {
      e.target.value = "";
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, postData] = await Promise.all([
        api.getUsers(),
        editId ? api.getPostById(editId) : Promise.resolve(null)
      ]);

      const usersList = usersData.users && Array.isArray(usersData.users) ? usersData.users : [];
      setUsers(usersList);

      if (postData) {
        let cats: string[] = [];
        const rawCats = postData.categories || postData.category;
        if (Array.isArray(rawCats)) cats = rawCats.map(String);
        else if (typeof rawCats === 'string' && rawCats.trim()) {
          try { cats = JSON.parse(rawCats); } catch(e) { cats = [rawCats]; }
        }

        setFormData({
          title: postData.title || "",
          slug: postData.slug || "",
          excerpt: postData.excerpt || "",
          authorId: String(postData.authorId || postData.author?.id || ""),
          categories: cats,
          status: postData.status || "Published",
          featured: !!postData.featured,
          content: postData.content || "",
          showToc: !!postData.show_toc || !!postData.showToc,
          allowComments: postData.allow_comments !== false && postData.allowComments !== false,
          thumbnailUrl: postData.thumbnailUrl || postData.featured_image || "",
          metaTitle: postData.meta_title || postData.metaTitle || "",
          metaDescription: postData.meta_description || postData.metaDescription || "",
          keywords: Array.isArray(postData.tags) ? postData.tags : (postData.tags ? postData.tags.split(',').map((t: string) => t.trim()) : []),
          useThumbnailAsFeatured: true,
          canonicalUrl: postData.canonicalUrl || "",
          structuredData: typeof postData.structuredData === 'string' ? postData.structuredData : JSON.stringify(postData.structuredData, null, 2),
        });
      } else {
        if (usersList.length > 0) {
          setFormData(prev => ({ ...prev, authorId: String(usersList[0].id) }));
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [editId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch categories from DB
  useEffect(() => {
    api.getCategories()
      .then((res: any) => {
        const cats = res?.categories || res || [];
        setAvailableCategories(cats.map((c: any) => c.name).filter(Boolean));
      })
      .catch(() => setAvailableCategories([]));
  }, []);

  // Calculate Progress
  const calculateProgress = () => {
    const fields = [
      formData.title.trim().length > 0,
      formData.slug.trim().length > 0,
      formData.excerpt.trim().length > 0,
      formData.authorId !== "",
      formData.categories.length > 0,
      formData.content.trim().length > 0,
      formData.thumbnailUrl !== "",
      formData.metaTitle !== "",
      formData.metaDescription !== ""
    ];
    const completed = fields.filter(f => f).length;
    return { completed, total: fields.length };
  };

  const { completed, total } = calculateProgress();
  const progressPercent = (completed / total) * 100;

  const handleSavePost = async (overrideStatus?: string) => {
    if (!formData.title || !formData.content) {
      setError("Title and Content are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const nextStatus = overrideStatus || formData.status || "Draft";
    let cover = formData.thumbnailUrl || "";
    if (cover.startsWith("data:")) {
      setError(
        "Cover is still a local preview. Upload again (device upload uses backend) or pick from Media Library.",
      );
      setLoading(false);
      return;
    }
    // Normalize absolute backend URL → relative /uploads/...
    if (cover.includes("/uploads/")) {
      try {
        if (cover.startsWith("http")) {
          cover = new URL(cover).pathname;
        }
      } catch {
        /* keep */
      }
    }

    const finalData: any = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      status: nextStatus,
      category: formData.categories[0] || "General",
      categories: formData.categories,
      tags: formData.keywords,
      authorId: parseInt(formData.authorId),
      thumbnailUrl: cover || null,
      featured: formData.featured,
      meta_title: formData.metaTitle,
      meta_description: formData.metaDescription,
      canonicalUrl: formData.canonicalUrl,
      structuredData: formData.structuredData,
      show_toc: formData.showToc,
      allow_comments: formData.allowComments,

    };

    if (!editId) {
      finalData.published_date = new Date().toISOString();
    }

    try {
      if (editId) {
        await api.updatePost(editId, finalData);
      } else {
        await api.createPost(finalData);
      }
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || `Failed to ${editId ? "update" : "create"} post`);
    } finally {
      setLoading(false);
    }
  };

  const hasRealContent = formData.content.replace(/<[^>]*>/g, '').trim().length > 3;

  if (loading && editId && !formData.title) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#64748B] font-bold">Fetching post details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-32 pt-8 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B]">{editId ? "Edit Post" : "Create New Post"}</h1>
            <p className="text-[15px] text-[#64748B] mt-1">{editId ? "Make changes to your existing blog post" : "Fill in the details below to create a new blog post"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[14px] font-bold rounded-full transition-transform hover:scale-105 shadow-md shadow-blue-200"
            >
              <Sparkles className="w-4 h-4" />
              AI Assist
            </button>
            <span className={cn(
              "px-4 py-1.5 text-white text-[13px] font-bold rounded-full transition-colors",
              formData.status === "Published" ? "bg-emerald-600" : "bg-[#94A3B8]"
            )}>
              {formData.status}
            </span>
          </div>
        </div>

        {/* Progress Bar Card */}
        <div className="bg-white rounded-[20px] p-6 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-bold text-[#1E293B]">Completion Progress</span>
            <span className="text-[13px] font-bold text-[#94A3B8]">{completed}/{total} fields completed</span>
          </div>
          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-[#F8FAFC] rounded-[16px] p-1.5 flex gap-2 border border-[#E2E8F0]">
          {["Content", "Images", "SEO"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 h-12 flex items-center justify-center gap-2 text-[14px] font-bold transition-all rounded-[12px]",
                activeTab === tab
                  ? "bg-white text-[#2563EB] shadow-sm border border-[#E2E8F0]"
                  : "text-[#64748B] hover:text-[#475569]"
              )}
            >
              {tab === "Content" && <FileText className="w-4 h-4" />}
              {tab === "Images" && <ImageIcon className="w-4 h-4" />}
              {tab === "SEO" && <Search className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-[12px] border border-red-100 flex items-center gap-3">
            <X className="w-5 h-5" />
            <span className="text-[14px] font-bold">{error}</span>
          </div>
        )}

        {/* Main Form Content */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-8">

            {/* CONTENT TAB */}
            {activeTab === "Content" && (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#1E293B]">Basic Information</h2>
                    <p className="text-[14px] text-[#64748B] mt-1">Enter the core details of your blog post</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Post Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter an engaging title for your blog post"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">URL Slug <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="url-friendly-slug"
                      className="w-full h-12 bg-[#F1F5F9] border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] text-gray-500 cursor-not-allowed outline-none"
                      value={formData.slug}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Excerpt <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      placeholder="Write a compelling summary..."
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-4 text-[14px] focus:outline-none"
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-[#1E293B]">Author <span className="text-red-500">*</span></label>
                      <select
                        className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] appearance-none"
                        value={formData.authorId}
                        onChange={e => setFormData({ ...formData, authorId: e.target.value })}
                      >
                        {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-[#1E293B]">Publish Status <span className="text-red-500">*</span></label>
                      <select
                        className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px]"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Categories <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {availableCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFormData({
                            ...formData,
                            categories: formData.categories.includes(cat)
                              ? formData.categories.filter(c => c !== cat)
                              : [...formData.categories, cat]
                          })}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                            formData.categories.includes(cat)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-xl bg-white flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="featured"
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <div>
                      <label htmlFor="featured" className="text-sm font-bold text-gray-900 cursor-pointer block">Featured Post</label>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Show this post in the featured section</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-xl bg-white flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="comments"
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                    />
                    <div>
                      <label htmlFor="comments" className="text-sm font-bold text-gray-900 cursor-pointer block">Allow Comments</label>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Allow readers to leave comments on this post</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Content <span className="text-red-500">*</span></label>
                  <p className="text-sm text-gray-500 mb-4 font-medium">Write your blog post content with rich formatting</p>

                  <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(val: string) => setFormData({ ...formData, content: val })}
                      modules={quillModules}
                      className="min-h-[400px] [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-base [&_.ql-editor]:font-medium [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-[#fafafa] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-100"
                      placeholder="Write your blog post content here..."
                    />

                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-[#fafafa] flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> AI Assistant:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleInlineRefine("grammar")}
                          disabled={refining || !hasRealContent}
                          className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Polish Grammar ✍️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInlineRefine("longer")}
                          disabled={refining || !hasRealContent}
                          className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Make Longer 📝
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInlineRefine("summarize")}
                          disabled={refining || !hasRealContent}
                          className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Summarize Content 🔍
                        </button>
                        {refining && (
                          <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin ml-2" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">
                          {formData.content.replace(/<[^>]*>?/gm, '').trim() ? formData.content.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length : 0} words | {formData.content.replace(/<[^>]*>?/gm, '').length} characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeTab === "Images" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Post Images</h2>
              <p className="text-sm text-gray-500 mb-6">Upload thumbnail and featured images for your blog post</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                  <p className="text-xs text-gray-500 mb-4">This image appears in blog listing pages and previews</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                      />
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <ImagePlus className="w-7 h-7 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 mb-1">Upload from Device</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Saves to backend /uploads (required for public posts)</span>
                    </div>

                    <div
                      onClick={() => setIsMediaModalOpen(true)}
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <Library className="w-7 h-7 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 mb-1">Choose from Library</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Select existing media</span>
                    </div>
                  </div>

                  {formData.thumbnailUrl && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0">
                        <img src={resolveAdminMediaUrl(formData.thumbnailUrl) || formData.thumbnailUrl} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Selected Thumbnail</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{formData.thumbnailUrl}</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, thumbnailUrl: "" })}
                        className="p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <MediaLibraryModal
                    isOpen={isMediaModalOpen}
                    onClose={() => setIsMediaModalOpen(false)}
                    onSelect={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Preview */}
            <div className="bg-[#f8f9fa] p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Search Engine Preview</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
                <p className="text-[#1a0dab] text-xl font-medium mb-1 truncate">
                  {formData.metaTitle || formData.title || "Post Title"}
                </p>
                <p className="text-[#006621] text-sm mb-1 truncate">
                  https://corehead.com/blog/{formData.slug || "your-slug"}
                </p>
                <p className="text-[#4d5156] text-sm line-clamp-2">
                  {formData.metaDescription || formData.excerpt || "Please provide a meta description to see how your post appears in search results."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Enter meta title..."
                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm text-gray-900"
                  />
                  <p className="mt-2 text-xs text-gray-400 font-medium flex justify-between">
                    <span>Recommended length: 50-60 characters</span>
                    <span className={cn(formData.metaTitle.length > 60 ? "text-amber-500" : "text-gray-400")}>
                      {formData.metaTitle.length}/60
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Meta Description</label>
                  <textarea
                    rows={4}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Enter meta description..."
                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm text-gray-900 resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-400 font-medium flex justify-between">
                    <span>Recommended length: 150-160 characters</span>
                    <span className={cn(formData.metaDescription.length > 160 ? "text-amber-500" : "text-gray-400")}>
                      {formData.metaDescription.length}/160
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Canonical URL</label>
                  <input
                    type="url"
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder="https://example.com/canonical-url"
                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Focus Keywords</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.keywords.map(kw => (
                      <span key={kw} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                        {kw}
                        <button onClick={() => removeKeyword(kw)} className="hover:text-blue-800 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Add focus keyword..."
                      className="flex-1 px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="px-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar (Card instead of fixed bottom bar) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <button
          onClick={() => router.push('/admin/posts')}
          className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button 
            onClick={() => handleSavePost("Draft")}
            disabled={loading}
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm border border-gray-100 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save as Draft"}
          </button>
          <button 
            onClick={() => handleSavePost()}
            disabled={loading}
            className="px-8 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? (editId ? "Saving..." : "Creating...") : (editId ? "Save Changes" : "Create Post")}
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200/60 pb-8 text-xs font-medium text-gray-400">
        <div>
          <p>Copyright © 2026 SeekaHost Technologies Ltd. All Rights Reserved.</p>
          <p className="mt-1">Company Number: 16026964 | VAT Number: 485829729</p>
        </div>
        <div>
          <span>v1.0.0</span>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({ ...formData, thumbnailUrl: url })}
      />

      <AIBlogWriterModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleAiGenerate}
      />

      <PostPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        post={{
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          status: formData.status,
          categories: formData.categories,
          thumbnailUrl: formData.thumbnailUrl,
          authorName:
            users.find((u) => String(u.id) === String(formData.authorId))?.name ||
            undefined,
        }}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />
    </div>
  );
}

