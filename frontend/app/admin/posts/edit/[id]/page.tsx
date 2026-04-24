"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronDown, Star, Search, FileText, ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input 
                    type="text" 
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                  />
                  {formData.thumbnailUrl && (
                    <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                       <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
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
