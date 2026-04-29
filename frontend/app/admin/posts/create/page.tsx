"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, Star, Search, FileText, ImagePlus, X, Library, 
  Eye, Type, Bold, Italic, Underline, Strikethrough, Superscript, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Code, Link as LinkIcon, Image as ImageIcon, LayoutGrid, Minus, RemoveFormatting, Tag, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Content");

  const availableCategories = ["Test Cat", "AI", "Travelling"];

  const handleCreatePost = async (statusOverride?: string) => {
    setLoading(true);
    setError(null);
    try {
      const finalData = {
        ...formData,
        status: statusOverride || formData.status
      };

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      router.push("/admin/posts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const completedFields = [
    formData.title,
    formData.slug,
    formData.excerpt,
    formData.authorId,
    formData.categories.length > 0,
    formData.content
  ].filter(Boolean).length;

  return (
    <div className="max-w-[1200px] mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details below to create a new blog post
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
                    <div className="p-4 rounded-xl border border-red-100 bg-white flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-gray-900">Featured Post (10/10)</span>
                      </div>
                      <p className="text-xs font-medium text-gray-500 pl-6">Highlight this post on your homepage</p>
                      <p className="text-xs font-medium text-red-500 pl-6 mt-0.5">Featured post limit reached. To make this featured, remove one from existing featured posts.</p>
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
                    {/* Fake Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-gray-100 bg-[#fafafa]">
                      <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><Type className="w-4 h-4" /></button>
                      <div className="h-4 w-px bg-gray-300 mx-1" />
                      <button className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded">
                        Paragraph <ChevronDown className="w-3 h-3" />
                      </button>
                      <button className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded">
                        Sans Serif <ChevronDown className="w-3 h-3" />
                      </button>
                      <button className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded">
                        Default <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="h-4 w-px bg-gray-300 mx-1" />
                      <button className="p-1.5 text-gray-900 font-bold hover:bg-gray-200 rounded"><Bold className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 italic hover:bg-gray-200 rounded"><Italic className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 underline hover:bg-gray-200 rounded"><Underline className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 line-through hover:bg-gray-200 rounded"><Strikethrough className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><Superscript className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><span className="text-xs font-bold px-1">A</span></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><span className="text-xs font-bold px-1 bg-gray-200">A</span></button>
                      <div className="h-4 w-px bg-gray-300 mx-1" />
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><List className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><ListOrdered className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><AlignLeft className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><AlignCenter className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><AlignRight className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><AlignJustify className="w-4 h-4" /></button>
                      <div className="h-4 w-px bg-gray-300 mx-1" />
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><Quote className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><Code className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><LinkIcon className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><ImageIcon className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><LayoutGrid className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><Minus className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-900 hover:bg-gray-200 rounded"><RemoveFormatting className="w-4 h-4" /></button>
                    </div>
                    
                    <textarea 
                      rows={15}
                      placeholder="Write your blog post content here..."
                      className="w-full px-6 py-6 border-none focus:outline-none resize-y text-sm text-gray-700 min-h-[400px]"
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                    
                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-[#fafafa]">
                      <div />
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14v-4m16 4v-4M4 4h16m-16 16h16"/></svg>
                        </button>
                        <span className="text-xs font-bold text-gray-500">
                          {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words | {formData.content.length} characters
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
          <div className="space-y-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-400 font-bold">Image Settings (To be implemented)</p>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-400 font-bold">SEO Settings (To be implemented)</p>
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
            onClick={handlePreview}
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button 
            onClick={() => handleCreatePost("Draft")}
            disabled={loading}
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm border border-gray-100 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleCreatePost()}
            disabled={loading}
            className="px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Post"}
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
    </div>
  );
}
