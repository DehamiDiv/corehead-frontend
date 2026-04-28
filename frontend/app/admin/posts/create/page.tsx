"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Star, Search, FileText, ImagePlus, X, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export default function CreatePostPage() {
  const router = useRouter();
  
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
    structuredData: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article headline",
  "description": "Article description",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  }
}`
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
          // Set default author to first user if exists
          if (data.length > 0 && !formData.authorId) {
            setFormData(prev => ({ ...prev, authorId: data[0].id.toString() }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const [activeTab, setActiveTab] = useState("Content");

  const availableCategories = ["Business", "Education", "Marketing", "StartUps", "Tech", "Lifestyle"];

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, thumbnailUrl: base64 }));
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      // Navigate to the public blog listing page after creation
      router.push('/blog');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details below to create a new blog post
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
          { id: "Content", icon: "FileText" },
          { id: "Images", icon: "Image" },
          { id: "SEO", icon: "Search" }
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
            {tab.id === "Content" && <FileText className="w-4 h-4" />}
            {tab.id === "Images" && <ImagePlus className="w-4 h-4" />}
            {tab.id === "SEO" && <Search className="w-4 h-4" />}
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
                    placeholder="Enter an engaging title for your blog post"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="url-friendly-slug"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2">Auto-generated from title. Edit if needed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                  <textarea 
                    rows={3}
                    placeholder="Write a compelling summary that will appear in blog listings and previews"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2">Brief summary for blog listings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      value={formData.authorId}
                      onChange={e => setFormData({...formData, authorId: e.target.value})}
                    >
                      {users.length > 0 ? (
                        users.map(user => (
                          <option key={user.id} value={user.id.toString()}>
                            {user.name || user.email.split('@')[0]} ({user.role})
                          </option>
                        ))
                      ) : (
                        <option value="1">Admin User</option>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select the author who will be credited for this blog post</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2 mb-3">
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
                  {formData.categories.length === 0 && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                      <span className="text-sm text-gray-500">No categories selected. Please add at least one category.</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Select one or more categories.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Status <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div 
                      onClick={() => setFormData({...formData, featured: !formData.featured})}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-colors flex items-start gap-3",
                        formData.featured ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center mt-0.5",
                        formData.featured ? "bg-amber-500 border-amber-500" : "bg-white border-gray-300"
                      )}>
                        {formData.featured && <Star className="w-3 h-3 text-white fill-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Star className={cn("w-4 h-4", formData.featured ? "text-amber-500 fill-amber-500" : "text-gray-400")} />
                          <span className="text-sm font-medium text-gray-900">Featured Post</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Highlight this post on your homepage</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={15}
                    placeholder="Write your blog post content here..."
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-gray-400">{formData.content.trim().split(/\s+/).filter(Boolean).length} words | {formData.content.length} characters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Images" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Post Images</h2>
              <p className="text-sm text-gray-500 mb-6">Upload thumbnail and featured images for your blog post</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                  <p className="text-xs text-gray-500 mb-4">This image appears in blog listing pages and previews</p>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {uploadError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      {uploadError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <ImagePlus className="w-7 h-7 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 mb-1">Upload from Device</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">PNG, JPG, GIF, WEBP up to 5MB</span>
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
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Selected Thumbnail</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {uploadedFileName || formData.thumbnailUrl}
                        </p>
                      </div>
                      <button 
                        onClick={() => { setFormData({...formData, thumbnailUrl: ""}); setUploadedFileName(""); }}
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
              <p className="text-sm text-gray-500 mb-6">Optimize your blog post for search engines and social media</p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                    <span className={cn("text-xs font-medium", formData.metaTitle.length > 60 ? "text-red-500" : "text-gray-400")}>
                      {formData.metaTitle.length}/60
                    </span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="SEO optimized title (leave empty to use post title)"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.metaTitle}
                    onChange={e => setFormData({...formData, metaTitle: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                    <span className={cn("text-xs font-medium", formData.metaDescription.length > 160 ? "text-red-500" : "text-gray-400")}>
                      {formData.metaDescription.length}/160
                    </span>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Brief description for search engines (leave empty to use excerpt)"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    value={formData.metaDescription}
                    onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2">Recommended: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus Keywords</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      placeholder="Type keyword and press Enter"
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    />
                    <button 
                      onClick={handleAddKeyword}
                      className="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    {formData.keywords.length > 0 ? (
                      formData.keywords.map(kw => (
                        <span key={kw} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                          {kw}
                          <button onClick={() => removeKeyword(kw)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <div className="w-full flex items-center justify-center text-gray-400 text-sm">
                        No keywords added yet. Type a keyword and press Enter or click Add.
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Add keywords that help search engines understand your content. Press Enter or click Add after typing each keyword.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/blog/post-slug"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.canonicalUrl}
                    onChange={e => setFormData({...formData, canonicalUrl: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2">Optional: Specify the preferred URL if this content exists elsewhere</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Structured Data (JSON-LD)</label>
                  <p className="text-xs text-gray-500 mb-2">Advanced: Add structured data for rich search results</p>
                  <textarea 
                    rows={10}
                    className="w-full px-4 py-4 bg-gray-900 text-gray-100 font-mono text-xs rounded-xl focus:outline-none ring-offset-2 ring-blue-500 focus:ring-2 border-none"
                    value={formData.structuredData}
                    onChange={e => setFormData({...formData, structuredData: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2">Optional: Valid JSON-LD markup for enhanced search appearance. Leave empty if not needed.</p>
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
          <button className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            Preview
          </button>
          <button 
            onClick={() => setFormData({...formData, status: "Draft"})}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button 
            onClick={handleCreatePost}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
