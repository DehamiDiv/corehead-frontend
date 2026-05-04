"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { api } from "@/lib/api";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
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
    keywords: [] as string[],
    useThumbnailAsFeatured: true,
    canonicalUrl: "",
    structuredData: "",
  });

  const [keywordInput, setKeywordInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Content");

  const addKeyword = () => {
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
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, thumbnailUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postData, usersData] = await Promise.all([
        api.getPostById(postId),
        api.getUsers()
      ]);
      
      const usersList = usersData.users && Array.isArray(usersData.users) ? usersData.users : [];
      setUsers(usersList);
      
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
        canonicalUrl: postData.canonicalUrl || "",
        structuredData: typeof postData.structuredData === 'string' ? postData.structuredData : JSON.stringify(postData.structuredData, null, 2),
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch post data");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchData();
  }, [fetchData]);

  const availableCategories = ["Technology", "Design", "Business", "Marketing", "Lifestyle", "AI", "Development"];

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

  const handleUpdatePost = async (overrideStatus?: string) => {
    if (!formData.title || !formData.content) {
      setError("Title and Content are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const finalData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      status: overrideStatus || formData.status,
      category: formData.categories[0] || "General",
      categories: formData.categories,
      tags: typeof formData.keywords === 'string' ? formData.keywords.split(',').map(t => t.trim()).filter(Boolean) : formData.keywords,
      authorId: parseInt(formData.authorId),
      thumbnailUrl: formData.thumbnailUrl,
      featured: formData.featured,
      meta_title: formData.metaTitle,
      meta_description: formData.metaDescription,
      canonicalUrl: formData.canonicalUrl,
      structuredData: formData.structuredData,
      show_toc: formData.showToc,
      allow_comments: formData.allowComments
    };

    try {
      await api.updatePost(postId, finalData);
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#64748B] font-bold">Fetching your masterpiece...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-32 pt-8 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin/posts')}
              className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#1E293B] shadow-sm transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[32px] font-bold text-[#1E293B]">Edit Post</h1>
              <p className="text-[15px] text-[#64748B] mt-1">Make changes to your existing blog post</p>
            </div>
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
                    <p className="text-[14px] text-[#64748B] mt-1">Refine the core details of your post</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Post Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] focus:outline-none"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">URL Slug <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[10px] px-4 text-[14px] focus:outline-none"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1E293B]">Excerpt <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={3}
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
                  <p className="text-[14px] text-[#64748B] mt-1">Upload thumbnail and featured images for your blog post</p>
                </div>

                <div className="space-y-6">
                   <div>
                      <h3 className="text-[16px] font-bold text-[#1E293B]">Thumbnail Image</h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">This image appears in blog listing pages and previews</p>
                   </div>

                    <div className="relative group">
                      <div 
                        className={cn(
                          "w-full min-h-[300px] border-2 border-dashed rounded-[20px] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden bg-[#F8FAFC]",
                          formData.thumbnailUrl ? "border-blue-200 bg-blue-50/10" : "border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]"
                        )}
                      >
                        {formData.thumbnailUrl ? (
                          <div className="relative w-full h-full flex items-center justify-center p-4">
                            <img src={formData.thumbnailUrl} className="max-h-[400px] w-auto object-contain rounded-[12px] shadow-sm" alt="Thumbnail" />
                            <button 
                              onClick={(e) => { e.stopPropagation(); setFormData({...formData, thumbnailUrl: ""}); }}
                              className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-md hover:bg-white transition-all"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] flex items-center justify-center mb-1">
                              <ImageIcon className="w-8 h-8 text-[#94A3B8]" />
                            </div>
                            <div className="text-center">
                              <p className="text-[16px] font-bold text-[#1E293B]">Click to upload image</p>
                              <p className="text-[13px] text-[#94A3B8] mt-1 font-medium">PNG, JPG, GIF up to 5MB</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <button 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-10 px-5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-bold text-[#1E293B] shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                  <Upload className="w-4 h-4 text-[#64748B]" />
                                  Upload New
                                </button>
                                <button 
                                  onClick={() => setIsMediaModalOpen(true)}
                                  className="h-10 px-5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-bold text-[#1E293B] shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                  <Library className="w-4 h-4 text-[#64748B]" />
                                  Choose from Library
                                </button>
                            </div>
                          </>
                        )}
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>

                    <div className={cn(
                      "p-5 rounded-[16px] border flex items-center gap-4 transition-all",
                      formData.useThumbnailAsFeatured ? "bg-white border-[#E2E8F0]" : "bg-white border-[#E2E8F0]"
                    )}>
                      <div 
                        className={cn(
                          "w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all",
                          formData.useThumbnailAsFeatured ? "bg-[#2563EB] border-[#2563EB]" : "bg-white border-[#CBD5E1]"
                        )}
                        onClick={() => setFormData({...formData, useThumbnailAsFeatured: !formData.useThumbnailAsFeatured})}
                      >
                        {formData.useThumbnailAsFeatured && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1E293B]">Use thumbnail as featured image</p>
                        <p className="text-[12px] text-[#64748B] mt-0.5">Uncheck to add a separate featured image or no featured image</p>
                      </div>
                    </div>
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === "SEO" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1E293B]">SEO Optimization</h2>
                  <p className="text-[14px] text-[#64748B] mt-1">Optimize your blog post for search engines and social media</p>
                </div>

                <div className="space-y-8 max-w-4xl">
                  {/* Meta Title */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-bold text-[#1E293B]">Meta Title</label>
                      <span className={cn(
                        "text-[12px] font-bold",
                        formData.metaTitle.length > 60 ? "text-red-500" : "text-[#94A3B8]"
                      )}>{formData.metaTitle.length}/60</span>
                    </div>
                    <input 
                      type="text"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[12px] px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                      placeholder="SEO optimized title (leave empty to use post title)"
                      value={formData.metaTitle}
                      onChange={e => setFormData({...formData, metaTitle: e.target.value})}
                    />
                    <p className="text-[12px] text-[#94A3B8] font-medium">Recommended: 50-60 characters</p>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-bold text-[#1E293B]">Meta Description</label>
                      <span className={cn(
                        "text-[12px] font-bold",
                        formData.metaDescription.length > 160 ? "text-red-500" : "text-[#94A3B8]"
                      )}>{formData.metaDescription.length}/160</span>
                    </div>
                    <textarea 
                      rows={3}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[12px] p-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none leading-relaxed"
                      placeholder="Brief description for search engines (leave empty to use excerpt)"
                      value={formData.metaDescription}
                      onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                    />
                    <p className="text-[12px] text-[#94A3B8] font-medium">Recommended: 150-160 characters</p>
                  </div>

                  {/* Focus Keywords */}
                  <div className="space-y-3">
                    <label className="text-[14px] font-bold text-[#1E293B]">Focus Keywords</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        className="flex-1 h-12 bg-white border border-[#E2E8F0] rounded-[12px] px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                        placeholder="Type keyword and press Enter"
                        value={keywordInput}
                        onChange={e => setKeywordInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <button 
                        type="button"
                        onClick={addKeyword}
                        className="h-12 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-[14px] font-bold text-[#64748B] hover:bg-slate-100 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="min-h-[60px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] border-dashed rounded-[12px] flex flex-wrap gap-2">
                      {formData.keywords.length > 0 ? (
                        formData.keywords.map(kw => (
                          <span key={kw} className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#1E293B] flex items-center gap-2 shadow-sm">
                            {kw}
                            <X className="w-3.5 h-3.5 text-[#94A3B8] cursor-pointer hover:text-red-500" onClick={() => removeKeyword(kw)} />
                          </span>
                        ))
                      ) : (
                        <p className="text-[13px] text-[#94A3B8] font-medium m-auto">No keywords added yet. Type a keyword and press Enter or click Add.</p>
                      )}
                    </div>
                    <p className="text-[12px] text-[#94A3B8] font-medium">Add keywords that help search engines understand your content. Press Enter or click Add after typing each keyword.</p>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-3">
                    <label className="text-[14px] font-bold text-[#1E293B]">Canonical URL</label>
                    <input 
                      type="text"
                      className="w-full h-12 bg-white border border-[#E2E8F0] rounded-[12px] px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                      placeholder="https://example.com/blog/post-slug"
                      value={formData.canonicalUrl}
                      onChange={e => setFormData({...formData, canonicalUrl: e.target.value})}
                    />
                    <p className="text-[12px] text-[#94A3B8] font-medium">Optional: Specify the preferred URL if this content exists elsewhere</p>
                  </div>

                  {/* Structured Data */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#1E293B]">Structured Data (JSON-LD)</h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">Advanced: Add structured data for rich search results</p>
                    </div>
                    <textarea 
                      rows={10}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[12px] p-6 text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all leading-relaxed"
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Article headline",\n  "description": "Article description",\n  "author": {\n    "@type": "Person",\n    "name": "Author Name"\n  }\n}`}
                      value={formData.structuredData}
                      onChange={e => setFormData({...formData, structuredData: e.target.value})}
                    />
                    <p className="text-[12px] text-[#94A3B8] font-medium">Optional: Valid JSON-LD markup for enhanced search appearance. Leave empty if not needed.</p>
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
            <button 
              onClick={() => handleUpdatePost()}
              disabled={saving}
              className="h-11 px-10 bg-[#2563EB] text-white rounded-[10px] text-[14px] font-bold hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
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
