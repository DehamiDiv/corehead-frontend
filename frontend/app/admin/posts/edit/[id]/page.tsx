"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronDown, Star, Search, FileText, ImagePlus, X, Loader2, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    authorId: "1",
    categories: [] as string[],
    status: "Published",
    featured: false,
    content: "",
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
  const [activeTab, setActiveTab] = useState("Content");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const availableCategories = ["Business", "Education", "Marketing", "StartUps", "Tech", "Lifestyle"];

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
          authorId: String(data.authorId || "1"),
          categories: data.categories || [],
          status: data.status || "Published",
          featured: data.featured || false,
          content: data.content || "",
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

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
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

  const handleUpdatePost = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
        <p className="text-gray-500 animate-pulse">Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modify the details of your blog post
          </p>
        </div>
        <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm">
          {formData.status}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Completion Progress</span>
          <span className="text-sm text-gray-500">{completedFields}/6 fields completed</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${(completedFields / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex gap-2">
        {[
          { id: "Content", icon: FileText },
          { id: "Images", icon: ImagePlus },
          { id: "SEO", icon: Search }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2",
              activeTab === tab.id 
                ? "bg-gray-50 text-gray-900 border border-gray-200" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.id}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
        {activeTab === "Content" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <p className="text-sm text-gray-500 mb-6">Enter the core details of your blog post</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter an engaging title"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="url-friendly-slug"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                  <textarea 
                    rows={3}
                    placeholder="Write a compelling summary"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                          formData.categories.includes(cat)
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={15}
                    placeholder="Write your content here..."
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Images" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Post Images</h2>
              <p className="text-sm text-gray-500 mb-6">Manage images for your blog post</p>

              <div className="space-y-6">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <ImagePlus className="w-7 h-7 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 mb-1">Upload from Device</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">PNG, JPG, GIF up to 5MB</span>
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
                        <img src={formData.thumbnailUrl} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Current Thumbnail</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{formData.thumbnailUrl}</p>
                      </div>
                      <button 
                        onClick={() => setFormData({...formData, thumbnailUrl: ""})}
                        className="p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <MediaLibraryModal 
                    isOpen={isMediaModalOpen}
                    onClose={() => setIsMediaModalOpen(false)}
                    onSelect={(url) => setFormData({...formData, thumbnailUrl: url})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SEO Optimization</h2>
              <p className="text-sm text-gray-500 mb-6">Optimize your blog post for search engines</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    placeholder="SEO title"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.metaTitle}
                    onChange={e => setFormData({...formData, metaTitle: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea 
                    rows={4}
                    placeholder="SEO description"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    value={formData.metaDescription}
                    onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      placeholder="Add keyword"
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    />
                    <button onClick={handleAddKeyword} className="px-4 py-2.5 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map(kw => (
                      <span key={kw} className="px-3 py-1 bg-white border rounded-full text-xs font-medium flex items-center gap-2">
                        {kw}
                        <button onClick={() => removeKeyword(kw)}><X className="w-3 h-3 text-gray-400 hover:text-red-500" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 flex justify-between items-center z-10">
        <button 
          onClick={() => router.push('/admin/posts')}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleUpdatePost}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving Changes..." : "Update Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
