"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Star, Search, FileText, ImagePlus, X, Library, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { aiApi } from "@/services/aiApi";

const TONE_OPTIONS = [
  { label: "Professional", value: "informative and professional" },
  { label: "Casual", value: "casual and friendly" },
  { label: "Tech-Focused", value: "tech-focused and detailed" },
  { label: "Inspirational", value: "inspirational and persuasive" },
  { label: "Educational", value: "educational and how-to" },
];

const LENGTH_OPTIONS = [
  { label: "Short (~500 words)", value: "500 words" },
  { label: "Medium (~1000 words)", value: "1000 words" },
  { label: "Long-form (~1500 words)", value: "1500 words" },
];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  // Templates state
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/templates?type=Single%20Post&status=published');
        const data = await res.json();
        // Guard against unexpected shape – ensure we always store an array
        const arr = Array.isArray(data) ? data : (Array.isArray(data.templates) ? data.templates : []);
        setTemplates(arr);
      } catch (e) {
        console.error('Failed to load templates', e);
        setTemplates([]);
      }
    })();
  }, []);

  const [activeTab, setActiveTab] = useState("Content");

  // ── AI Writer tab state ──────────────────────────────────────
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("informative and professional");
  const [aiWordCount, setAiWordCount] = useState("1000 words");
  const [aiKeywordInput, setAiKeywordInput] = useState("");
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState(false);

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

  const handleCreatePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  // ── AI Writer handlers ───────────────────────────────────────
  const handleAddAiKeyword = () => {
    if (aiKeywordInput.trim() && !aiKeywords.includes(aiKeywordInput.trim())) {
      setAiKeywords(prev => [...prev, aiKeywordInput.trim()]);
      setAiKeywordInput("");
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim() || aiTopic.trim().length < 5) {
      setAiError("Please describe your topic in at least 5 characters.");
      return;
    }
    setAiGenerating(true);
    setAiError(null);
    setAiSuccess(false);

    try {
      const result = await (aiApi as any).generateBlogContent({
        topic: aiTopic.trim(),
        tone: aiTone,
        keywords: aiKeywords,
        wordCount: aiWordCount,
      });

      setFormData(prev => ({
        ...prev,
        title: result.title,
        slug: result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        excerpt: result.excerpt || "",
        content: result.content,
        metaTitle: result.seo?.metaTitle || "",
        metaDescription: result.seo?.metaDescription || "",
        keywords: result.seo?.keywords || [],
      }));

      setAiSuccess(true);
      // Auto-switch to Content tab so user can review draft
      setTimeout(() => setActiveTab("Content"), 800);
    } catch (err: any) {
      setAiError(err.message || "Failed to generate blog content. Please try again.");
    } finally {
      setAiGenerating(false);
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

  const tabs = [
    { id: "Content",   icon: <FileText  className="w-4 h-4" /> },

    { id: "Images",    icon: <ImagePlus className="w-4 h-4" /> },
    { id: "SEO",       icon: <Search    className="w-4 h-4" /> },
    { id: "AI Writer", icon: <Sparkles  className="w-4 h-4" /> },
  ];

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
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2",
              activeTab === tab.id
                ? tab.id === "AI Writer"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-gray-50 text-gray-900 border border-gray-200"
                : tab.id === "AI Writer"
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            )}
          >
            {tab.icon}
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

        {/* ── AI WRITER TAB ───────────────────────────────────── */}
        {activeTab === "AI Writer" && (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Gradient banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 0), radial-gradient(circle at 20% 80%, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Blog Writer</h2>
                  <p className="text-blue-100 text-sm mt-1 max-w-lg">
                    Describe your topic below and let Groq AI (Llama) instantly draft a full blog post — title, content, and SEO — directly into your form.
                  </p>
                  {aiSuccess && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-200 text-xs font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Draft generated! Switching to Content tab...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {aiError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                <X className="w-4 h-4 mt-0.5 shrink-0" />
                {aiError}
              </div>
            )}

            {aiGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                  <Sparkles className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">Drafting your post...</p>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    Groq AI is writing your title, content, and SEO fields. This takes 5–15 seconds.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What should the blog post be about? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. A beginner's guide to using React Server Components in Next.js 15, including real-world examples and performance tips."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none placeholder-gray-400"
                    value={aiTopic}
                    onChange={e => { setAiTopic(e.target.value); setAiError(null); }}
                  />
                </div>

                {/* Tone + Length side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tone of Voice</label>
                    <div className="flex flex-wrap gap-2">
                      {TONE_OPTIONS.map(t => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setAiTone(t.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
                            aiTone === t.value
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Length</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-sm font-medium"
                        value={aiWordCount}
                        onChange={e => setAiWordCount(e.target.value)}
                      >
                        {LENGTH_OPTIONS.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Keywords <span className="text-gray-400 font-normal">(optional — AI will also generate its own)</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="e.g. server components"
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      value={aiKeywordInput}
                      onChange={e => setAiKeywordInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddAiKeyword())}
                    />
                    <button
                      type="button"
                      onClick={handleAddAiKeyword}
                      className="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {aiKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {aiKeywords.map(kw => (
                        <span key={kw} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700">
                          {kw}
                          <button type="button" onClick={() => setAiKeywords(prev => prev.filter(k => k !== kw))}>
                            <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate button */}
                <button
                  type="button"
                  disabled={!aiTopic.trim()}
                  onClick={handleGenerateWithAI}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-base font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Blog Post Draft with AI
                </button>

                <p className="text-xs text-center text-gray-400">
                  Generated content will automatically fill the Content, and SEO tabs. You can edit everything before publishing.
                </p>
              </div>
            )}
          </div>
        )}


        
    
            <div className="mt-4">
              {templates.length === 0 ? (
                <p className="text-sm text-gray-500">No published templates found.</p>
              ) : (
                <select
                  value={selectedTemplateId}
                  onChange={async e => {
                    const id = e.target.value;
                    setSelectedTemplateId(id);
                    const tmplRes = await fetch(`http://localhost:5000/api/templates/${id}`);
                    const tmpl = await tmplRes.json();
                    setFormData(prev => ({
                      ...prev,
                      title: tmpl.title || prev.title,
                      slug: tmpl.slug || prev.slug,
                      excerpt: tmpl.excerpt || prev.excerpt,
                      content: tmpl.content || prev.content,
                    }));
                  }}
                  className="p-1 border rounded bg-white"
                >
                  <option value="">Select Template</option>
                  {Array.isArray(templates) && templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name || t.title}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

        {/* Existing Content Tab */}
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
                    onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="url-friendly-slug"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2">Brief summary for blog listings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      value={formData.authorId}
                      onChange={e => setFormData({ ...formData, authorId: e.target.value })}
                    >
                      <option value="1">Admin User</option>
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
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, featured: !formData.featured })}
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Content <span className="text-red-500">*</span></label>
                    {formData.content && (
                      <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Generated
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={15}
                    placeholder="Write your blog post content here... or use the AI Writer tab to generate it automatically!"
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-gray-400">{formData.content.trim().split(/\s+/).filter(Boolean).length} words | {formData.content.length} characters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── IMAGES TAB ──────────────────────────────────────── */}
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

        {/* ── SEO TAB ─────────────────────────────────────────── */}
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
                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
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
                  <p className="text-xs text-gray-500 mt-2">Add keywords that help search engines understand your content.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/blog/post-slug"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.canonicalUrl}
                    onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, structuredData: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2">Optional: Valid JSON-LD markup for enhanced search appearance.</p>
                </div>
              </div>
            </div>
          </div>
        )}
   

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
            onClick={() => setFormData({ ...formData, status: "Draft" })}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={handleCreatePost}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
