"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, Star, Search, FileText, ImagePlus, X, Library, 
  Eye, Type, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Code, Link as LinkIcon, Image as ImageIcon, LayoutGrid, Minus, RemoveFormatting, Tag, Loader2,
  ChevronLeft,
  Check,
  Plus,
  Maximize2,
  Settings,
  Globe,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { api } from "@/lib/api";

export default function CreatePostPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    authorId: "",
    categories: [] as string[],
    status: "Published",
    featured: false,
    content: "",
    showToc: false,
    allowComments: true,
    thumbnailUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "" as string, // Handled as string for easy typing
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Content");

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      const usersList = Array.isArray(data) ? data : [];
      setUsers(usersList);
      if (usersList.length > 0 && !formData.authorId) {
        setFormData(prev => ({ ...prev, authorId: String(usersList[0].id) }));
      }
    } catch (err) {
      setUsers([{ id: 1, name: "Admin User" }]);
      setFormData(prev => ({ ...prev, authorId: "1" }));
    }
  }, [formData.authorId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const availableCategories = ["Technology", "Design", "Business", "Marketing", "Lifestyle", "AI", "Development"];

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

  const handleCreatePost = async (overrideStatus?: string) => {
    if (!formData.title || !formData.content) {
      setError("Title and Content are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const finalData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      status: overrideStatus || formData.status,
      category: formData.categories[0] || "General",
      categories: formData.categories,
      tags: formData.keywords.split(',').map(t => t.trim()).filter(Boolean),
      authorId: parseInt(formData.authorId),
      thumbnailUrl: formData.thumbnailUrl,
      featured: formData.featured,
      meta_title: formData.metaTitle,
      meta_description: formData.metaDescription,
      show_toc: formData.showToc,
      allow_comments: formData.allowComments,
      published_date: new Date().toISOString()
    };

    try {
      await api.createPost(finalData);
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-32 pt-8 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B]">Create New Post</h1>
            <p className="text-[15px] text-[#64748B] mt-1">Fill in the details below to create a new blog post</p>
          </div>
          <span className={cn(
            "px-4 py-1.5 text-white text-[13px] font-bold rounded-full transition-colors",
            formData.status === "Published" ? "bg-[#2563EB]" : "bg-[#94A3B8]"
          )}>
            {formData.status}
          </span>
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
                      onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">URL Slug <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      placeholder="url-friendly-slug"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] focus:outline-none"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Excerpt <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={3}
                      placeholder="Write a compelling summary..."
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-4 text-[14px] focus:outline-none"
                      value={formData.excerpt}
                      onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-[#1E293B]">Author <span className="text-red-500">*</span></label>
                      <select 
                        className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] appearance-none"
                        value={formData.authorId}
                        onChange={e => setFormData({...formData, authorId: e.target.value})}
                      >
                        {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-bold text-[#1E293B]">Publish Status <span className="text-red-500">*</span></label>
                      <select 
                        className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px]"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
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
                      {formData.categories.map(cat => (
                        <span key={cat} className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[12px] font-bold flex items-center gap-1.5">
                          {cat}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({...formData, categories: formData.categories.filter(c => c !== cat)})} />
                        </span>
                      ))}
                    </div>
                    <select 
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px]"
                      onChange={(e) => {
                        if (e.target.value && !formData.categories.includes(e.target.value)) {
                          setFormData({...formData, categories: [...formData.categories, e.target.value]});
                        }
                      }}
                      value=""
                    >
                      <option value="">Add category...</option>
                      {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className={cn("w-5 h-5", formData.featured ? "text-amber-500 fill-amber-500" : "text-slate-300")} />
                      <div>
                        <p className="text-[14px] font-bold text-[#1E293B]">Featured Post</p>
                        <p className="text-[12px] text-[#64748B]">Promote this post to the homepage</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-[#E2E8F0]" 
                      checked={formData.featured}
                      onChange={e => setFormData({...formData, featured: e.target.checked})}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                    <h2 className="text-[20px] font-bold text-[#1E293B]">Post Content <span className="text-red-500">*</span></h2>
                    <div className="border border-[#E2E8F0] rounded-[16px] overflow-hidden">
                      <div className="h-11 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center px-4 gap-1">
                        <Bold className="w-4 h-4 text-[#64748B] mx-2" /><Italic className="w-4 h-4 text-[#64748B] mx-2" /><List className="w-4 h-4 text-[#64748B] mx-2" /><LinkIcon className="w-4 h-4 text-[#64748B] mx-2" />
                      </div>
                      <textarea 
                        rows={15}
                        className="w-full p-6 text-[16px] focus:outline-none min-h-[300px]"
                        placeholder="Start writing your masterpiece..."
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IMAGES TAB */}
            {activeTab === "Images" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1E293B]">Post Images</h2>
                  <p className="text-[14px] text-[#64748B] mt-1">Upload and manage images for this blog post</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[14px] font-bold text-[#1E293B]">Featured Image</label>
                    <div 
                      onClick={() => setIsMediaModalOpen(true)}
                      className={cn(
                        "aspect-video border-2 border-dashed rounded-[20px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                        formData.thumbnailUrl ? "border-blue-200 bg-blue-50/20" : "border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9]"
                      )}
                    >
                      {formData.thumbnailUrl ? (
                        <img src={formData.thumbnailUrl} className="w-full h-full object-cover rounded-[18px]" alt="Thumbnail" />
                      ) : (
                        <>
                          <ImagePlus className="w-8 h-8 text-[#94A3B8]" />
                          <span className="text-[13px] font-bold text-[#64748B]">Choose Featured Image</span>
                        </>
                      )}
                    </div>
                    {formData.thumbnailUrl && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFormData({...formData, thumbnailUrl: ""}); }}
                        className="text-[12px] font-bold text-red-500 hover:underline"
                      >Remove Image</button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === "SEO" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1E293B]">SEO & Metadata</h2>
                  <p className="text-[14px] text-[#64748B] mt-1">Optimize your post for search engines</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Meta Title</label>
                    <input 
                      type="text"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px]"
                      placeholder="Recommended: 60 characters"
                      value={formData.metaTitle}
                      onChange={e => setFormData({...formData, metaTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Meta Description</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-4 text-[14px]"
                      placeholder="Recommended: 160 characters"
                      value={formData.metaDescription}
                      onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Focus Keywords (Comma separated)</label>
                    <input 
                      type="text"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px]"
                      placeholder="e.g. AI, Technology, Future"
                      value={formData.keywords}
                      onChange={e => setFormData({...formData, keywords: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-4 shadow-xl flex items-center justify-between sticky bottom-6 z-40">
          <button 
            onClick={() => router.push('/admin/posts')}
            className="px-6 h-11 border border-[#E2E8F0] rounded-[10px] text-[14px] font-bold text-[#64748B] hover:bg-slate-50"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="h-11 px-6 flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] text-[14px] font-bold text-[#475569]">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button 
              onClick={() => handleCreatePost("Draft")}
              className="h-11 px-6 bg-[#F1F5F9] rounded-[10px] text-[14px] font-bold text-[#475569] hover:bg-slate-200"
            >
              Save as Draft
            </button>
            <button 
              onClick={() => handleCreatePost()}
              disabled={loading}
              className="h-11 px-10 bg-[#2563EB] text-white rounded-[10px] text-[14px] font-bold hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </div>

      </div>
      
      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({...formData, thumbnailUrl: url})}
      />
    </div>
  );
}
