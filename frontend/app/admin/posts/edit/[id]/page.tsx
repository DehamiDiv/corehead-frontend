"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ChevronDown, Star, Search, FileText, ImagePlus, X, Library, 
  Eye, Type, Bold, Italic, Underline, Strikethrough, Superscript, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Code, Link as LinkIcon, Image as ImageIcon, LayoutGrid, Minus, RemoveFormatting, Tag, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
    ['blockquote', 'code-block', 'link', 'image'],
    ['clean']
  ],
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;
  
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
    allowComments: false,
    // Images
    thumbnailUrl: "",
    // SEO
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    canonicalUrl: "",
    structuredData: ""
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Content");

  const availableCategories = ["Tech", "Education", "Lifestyle", "Business", "Marketing", "Travelling"];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post data");
        const data = await res.json();
        
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          authorId: data.authorId || data.author?.name || "",
          categories: data.categories || [],
          status: data.status || "Published",
          featured: data.featured || false,
          content: data.content || "",
          showToc: data.showToc || false,
          allowComments: data.allowComments || false,
          thumbnailUrl: data.coverImage || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          keywords: data.keywords || [],
          canonicalUrl: data.canonicalUrl || "",
          structuredData: data.structuredData || ""
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const handleUpdatePost = async (statusOverride?: string) => {
    setSaving(true);
    setError(null);
    try {
      const finalData = {
        ...formData,
        status: statusOverride || formData.status
      };

      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update post");
      }

      router.push("/admin/posts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== kw)
    }));
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const completedFields = [
    formData.title,
    formData.slug,
    formData.excerpt,
    formData.authorId,
    formData.categories.length > 0,
    formData.content
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500 animate-pulse font-medium text-sm">Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modify the details of your blog post
          </p>
        </div>
        <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-bold shadow-sm">
          {formData.status}
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-900">Completion Progress</span>
          <span className="text-sm font-medium text-gray-400">{completedFields}/6 fields completed</span>
        </div>
        <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gray-100 transition-all duration-300" 
            style={{ width: `${(completedFields / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
        {[
          { id: "Content", icon: "FileText" },
          { id: "Images", icon: "Image" },
          { id: "SEO", icon: "Search" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2",
              activeTab === tab.id 
                ? "bg-gray-50 text-gray-900 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            )}
          >
            {tab.id === "Content" && <FileText className="w-4 h-4" />}
            {tab.id === "Images" && <ImagePlus className="w-4 h-4" />}
            {tab.id === "SEO" && <Search className="w-4 h-4" />}
            {tab.id}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {activeTab === "Content" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              <p className="text-sm text-gray-500 mb-8">Enter the core details of your blog post</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Post Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter an engaging title for your blog post"
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">URL Slug <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="url-friendly-slug"
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                  <p className="text-xs font-medium text-gray-500 mt-2">Auto-generated from title. Edit if needed.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Excerpt <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={3}
                    placeholder="Write a compelling summary that will appear in blog listings and previews"
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm font-medium"
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  />
                  <p className="text-xs font-medium text-gray-500 mt-2">Brief summary for blog listings</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Author <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm font-medium text-gray-500"
                      value={formData.authorId}
                      onChange={e => setFormData({...formData, authorId: e.target.value})}
                    >
                      <option value="" disabled hidden>Select post author</option>
                      <option value="1">Pipuni Piyasooriya</option>
                      <option value="2">Dehami Divyanjali</option>
                      <option value="3">Nimasha Fernando</option>
                      <option value="4">Rashmi Shara</option>
                      <option value="5">Corehead</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-2">Select the author who will be credited for this blog post</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Categories <span className="text-red-500">*</span></label>
                  <div className="relative mb-3">
                    <select 
                      className="w-[250px] px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm font-medium text-gray-500"
                      onChange={(e) => {
                        if (e.target.value && !formData.categories.includes(e.target.value)) {
                          setFormData({...formData, categories: [...formData.categories, e.target.value]});
                        }
                      }}
                      value=""
                    >
                      <option value="" disabled hidden>Add categories to your post</option>
                      {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute left-[220px] top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  {formData.categories.length === 0 ? (
                    <div className="w-full h-32 bg-[#fafafa] rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center gap-3">
                      <Tag className="w-8 h-8 text-gray-300" />
                      <span className="text-sm font-medium text-gray-500">No categories selected. Please add at least one category.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-4 bg-[#fafafa] rounded-2xl border border-gray-100">
                      {formData.categories.map(cat => (
                        <span key={cat} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 flex items-center gap-2 shadow-sm">
                          {cat}
                          <button onClick={() => setFormData({...formData, categories: formData.categories.filter(c => c !== cat)})} className="text-gray-400 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs font-medium text-gray-500 mt-2">Select one or more categories. You can choose both parent categories and their subcategories.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Publish Status <span className="text-red-500">*</span></label>
                    <div className="relative w-fit">
                      <select 
                        className="pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm font-bold text-gray-900 min-w-[160px]"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-2">Choose the visibility of your post</p>
                  </div>

                  <div>
                    <div className={cn(
                      "p-4 rounded-xl border flex flex-col items-start gap-1 transition-all cursor-pointer",
                      formData.featured ? "border-amber-200 bg-amber-50/30" : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                    onClick={() => setFormData({...formData, featured: !formData.featured})}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Star className={cn("w-4 h-4", formData.featured ? "text-amber-500 fill-amber-500" : "text-gray-400")} />
                          <span className="text-sm font-bold text-gray-900">Featured Post</span>
                        </div>
                        <div className={cn(
                          "w-10 h-5 rounded-full relative transition-colors",
                          formData.featured ? "bg-amber-500" : "bg-gray-200"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                            formData.featured ? "right-1" : "left-1"
                          )} />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-500 pl-6">Highlight this post on your homepage and category listings</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="p-4 border border-gray-100 rounded-xl bg-white flex items-start gap-4">
                    <input 
                      type="checkbox" 
                      id="toc"
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={formData.showToc}
                      onChange={(e) => setFormData({...formData, showToc: e.target.checked})}
                    />
                    <div>
                      <label htmlFor="toc" className="text-sm font-bold text-gray-900 cursor-pointer block">Show Table of Contents</label>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Display an automatic table of contents for this post</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-xl bg-white flex items-start gap-4">
                    <input 
                      type="checkbox" 
                      id="comments"
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({...formData, allowComments: e.target.checked})}
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
                      onChange={(val) => setFormData({...formData, content: val})}
                      modules={quillModules}
                      className="min-h-[400px] [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-base [&_.ql-editor]:font-medium [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-[#fafafa] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-100"
                      placeholder="Write your blog post content here..."
                    />
                    
                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-[#fafafa]">
                      <div />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">
                          {formData.content.replace(/<[^>]*>?/gm, '').trim() ? formData.content.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length : 0} words | {formData.content.replace(/<[^>]*>?/gm, '').length} characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Images" && (
          <div className="space-y-8 min-h-[400px]">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Featured Image</h2>
              <p className="text-sm text-gray-500 mb-8">Upload a high-quality image to represent your post.</p>
              
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {formData.thumbnailUrl ? (
                  <div className="relative w-full lg:w-[400px] aspect-video rounded-2xl overflow-hidden border border-gray-200 group shadow-sm shrink-0">
                    <img src={formData.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                      <button 
                        onClick={() => setFormData({...formData, thumbnailUrl: ''})}
                        className="px-4 py-2 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors shadow-lg flex items-center gap-2 font-bold text-sm transform scale-95 group-hover:scale-100"
                      >
                        <X className="w-4 h-4" /> Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="w-full lg:w-[400px] aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer relative group shrink-0">
                      <ImagePlus className="w-10 h-10 mb-3 text-gray-300 group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors">Click to upload image</span>
                      <span className="text-xs font-medium text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                      
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const uploadData = new FormData();
                          uploadData.append('file', file);
                          
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: uploadData,
                            });
                            
                            if (res.ok) {
                              const data = await res.json();
                              if (data.url) {
                                setFormData({...formData, thumbnailUrl: data.url});
                              }
                            } else {
                              alert("Failed to upload image");
                            }
                          } catch (error) {
                            console.error('Upload failed:', error);
                            alert("Upload error occurred");
                          }
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => setIsMediaModalOpen(true)}
                      className="w-full lg:w-[400px] py-3 px-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                    >
                      <Library className="w-5 h-5" /> Choose from Library
                    </button>
                  </div>
                )}
                
                <div className="flex-1 w-full bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-sm font-medium text-blue-800">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-base">
                    <Star className="w-5 h-5 fill-blue-600 text-blue-600" /> Image Guidelines
                  </h3>
                  <ul className="list-disc pl-5 space-y-2.5 text-blue-700/80">
                    <li>Recommended dimensions: <strong className="text-blue-900">1200 x 630 pixels</strong></li>
                    <li>Keep the main subject in the center to avoid cropping on mobile devices</li>
                    <li>Supported formats: JPEG, PNG, WEBP</li>
                    <li>Maximum file size: 5MB for optimal loading speed</li>
                  </ul>
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
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})}
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

      {/* Action Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <button 
          onClick={() => router.push('/admin/posts')}
          className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePreview}
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button 
            onClick={() => handleUpdatePost("Draft")}
            disabled={saving}
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm border border-gray-100 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleUpdatePost()}
            disabled={saving}
            className="px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Update Post"}
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
      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Post Preview</h2>
                <p className="text-sm text-gray-500 font-medium">This is how your post will look</p>
              </div>
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white">
              <article className="max-w-2xl mx-auto space-y-8">
                <header className="space-y-4">
                  {formData.categories.length > 0 && (
                    <div className="flex gap-2">
                      {formData.categories.map(cat => (
                        <span key={cat} className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    {formData.title || "Untitled Post"}
                  </h1>
                  <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
                    {formData.excerpt}
                  </p>
                </header>

                {formData.thumbnailUrl && (
                  <img 
                    src={formData.thumbnailUrl} 
                    alt="" 
                    className="w-full aspect-video object-cover rounded-3xl shadow-lg"
                  />
                )}

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {formData.content || "No content yet..."}
                </div>
              </article>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50">
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({...formData, thumbnailUrl: url})}
      />
    </div>
  );
}
