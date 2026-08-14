"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, Plus, X as RemoveIcon } from "lucide-react";
import { aiApi } from "@/services/aiApi";
import { cn } from "@/lib/utils";

interface AIBlogWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    title: string;
    excerpt: string;
    content: string;
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
  }) => void;
}

const TONE_OPTIONS = [
  { label: "Informative & Professional", value: "professional" },
  { label: "Casual & Friendly", value: "casual" },
  { label: "Tech-Focused & Detailed", value: "tech" },
  { label: "Inspirational & Persuasive", value: "inspiring" },
  { label: "Educational & How-To", value: "educational" },
];

const LENGTH_OPTIONS = [
  { label: "Short (~500 words)", value: "500 words" },
  { label: "Medium (~1000 words)", value: "1000 words" },
  { label: "Long-form (~1500 words)", value: "1500 words" },
];

export default function AIBlogWriterModal({ isOpen, onClose, onGenerate }: AIBlogWriterModalProps) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("1000 words");

  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please describe the topic for your blog post.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const selectedToneText = TONE_OPTIONS.find(t => t.value === tone)?.label || tone;
      const result = await aiApi.generateBlogContent({
        topic: topic.trim(),
        tone: selectedToneText,
        keywords,
        wordCount,
      });

      onGenerate(result);
      onClose();

      // Refresh user credentials in background to sync credits with sidebar
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
              // Dispatch events to update sidebar dynamically
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('local-storage-update'));
            }
          })
          .catch(e => console.warn('Failed to sync credits in AIBlogWriterModal:', e));
      }

      // Reset state on success
      setTopic("");
      setKeywords([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate blog content. Make sure your backend API is running.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-100">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Blog Writer</h2>
              <p className="text-sm text-gray-500 mt-0.5">Let Gemini draft your post content and SEO fields</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={generating}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {generating ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900">Drafting Post Content...</h3>
                <p className="text-sm text-gray-500 max-w-sm mt-1 px-4">
                  Gemini is researching, writing outline, constructing headings, and generating SEO meta tags. This takes 5-15 seconds.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Topic / Prompt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What should the blog post be about? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. A comprehensive guide introducing Next.js 16 layouts and server actions. Mention comparison with Next.js 15."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium resize-none placeholder-gray-400"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Tone selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tone of Voice</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl border text-left text-sm font-medium transition-colors",
                        tone === t.value
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Length Target</label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium appearance-none"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                  >
                    {LENGTH_OPTIONS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Keywords (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. server-components"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700"
                      >
                        {kw}
                        <button type="button" onClick={() => handleRemoveKeyword(kw)}>
                          <RemoveIcon className="w-3 h-3 hover:text-red-500 transition-colors" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={generating}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={generating || !topic.trim()}
            onClick={handleGenerate}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate Content
          </button>
        </div>
      </div>
    </div>
  );
}
