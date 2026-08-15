"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Share2, ChevronDown, ChevronUp, List } from "lucide-react";
import CommentsSection from "@/components/blog/CommentsSection";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  featured_image?: string;
  category?: string;
  categories?: string | string[];
  status: string;
  createdAt: string;
  publishedAt?: string;
  keywords?: string;
  author?: {
    id: number;
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
  };
}

interface BlogPostClientProps {
  post: Post;
  recentPosts: Post[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogPostClient({ post, recentPosts }: BlogPostClientProps) {
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(0);
  const [isShareCopied, setIsShareCopied] = useState(false);

  // 1. Initialize views and likes on mount
  useEffect(() => {
    const seedViews = ((post.id * 7) % 80) + 12;
    const seedLikes = ((post.id * 3) % 20) + 3;

    // Retrieve views
    const storedViews = localStorage.getItem(`views_post_${post.id}`);
    let currentViews = storedViews ? parseInt(storedViews) : seedViews;

    // View increment once per session
    const hasViewedInSession = sessionStorage.getItem(`viewed_post_${post.id}`);
    if (!hasViewedInSession) {
      currentViews += 1;
      sessionStorage.setItem(`viewed_post_${post.id}`, "true");
      localStorage.setItem(`views_post_${post.id}`, String(currentViews));
    }
    setViews(currentViews);

    // Retrieve likes
    const storedLikes = localStorage.getItem(`likes_post_${post.id}`);
    const likesCount = storedLikes ? parseInt(storedLikes) : seedLikes;
    setLikes(likesCount);

    const userLiked = localStorage.getItem(`user_liked_post_${post.id}`) === "true";
    setHasLiked(userLiked);
  }, [post.id]);

  // 2. Handle like toggle
  const toggleLike = () => {
    let newLikes = likes;
    if (hasLiked) {
      newLikes = Math.max(0, newLikes - 1);
      localStorage.removeItem(`user_liked_post_${post.id}`);
      setHasLiked(false);
    } else {
      newLikes += 1;
      localStorage.setItem(`user_liked_post_${post.id}`, "true");
      setHasLiked(true);
    }
    setLikes(newLikes);
    localStorage.setItem(`likes_post_${post.id}`, String(newLikes));
  };

  // 3. Handle Copy Share Link
  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    }
  };

  // 4. Parse content headings and assign IDs dynamically
  const { processedContent, headings } = useMemo(() => {
    const items: TocItem[] = [];
    if (!post.content) return { processedContent: "", headings: [] };

    let headingIndex = 0;
    const processed = post.content.replace(/<h(2|3)([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
      // Strip HTML inside the header text for table of contents
      const cleanText = text.replace(/<[^>]*>?/gm, "").trim();
      const id = `heading-section-${headingIndex++}`;
      items.push({ id, text: cleanText, level: parseInt(level) });
      return `<h${level} id="${id}" ${attrs}>${text}</h${level}>`;
    });

    return { processedContent: processed, headings: items };
  }, [post.content]);

  // 5. Scroll to Heading helper
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const imageUrl = post.coverImage || post.imageUrl || post.thumbnailUrl || `https://picsum.photos/seed/${post.id}/1200/600`;

  // Get first category name
  let categoryName = "Article";
  const rawCats = post.categories || post.category;
  if (Array.isArray(rawCats) && rawCats.length > 0) {
    categoryName = rawCats[0];
  } else if (typeof rawCats === "string") {
    try {
      const parsed = JSON.parse(rawCats);
      if (Array.isArray(parsed) && parsed.length > 0) categoryName = parsed[0];
      else categoryName = rawCats.split(",")[0].replace(/[\[\]"']/g, "").trim();
    } catch {
      categoryName = rawCats.split(",")[0].replace(/[\[\]"']/g, "").trim();
    }
  }

  // Calculate reading time roughly
  const wordCount = post.content ? post.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Navigation Bar */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1300px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[14px] font-bold text-slate-600 hover:text-[#006400] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <button 
            onClick={copyShareLink}
            className="px-4 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-[#006400] hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isShareCopied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 pt-12">
        {/* Header Section */}
        <header className="mb-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-green-50 text-[#006400] text-[12px] font-black uppercase tracking-widest mb-6 border border-green-100">
            {categoryName}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] leading-[1.1] mb-8 tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {post.author?.avatar ? (
                  <img src={post.author.avatar} alt="Author" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <span className="text-slate-700 font-bold">{post.author?.name || "CoreHead Editor"}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
            <span className="flex items-center gap-2 hidden sm:flex">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1.5">
              <span>👁️</span>
              <span className="font-bold text-slate-600">{views}</span>
            </span>
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-1.5 cursor-pointer hover:text-red-500 transition-colors ${
                hasLiked ? "text-red-500 font-bold" : ""
              }`}
            >
              <span>{hasLiked ? "❤️" : "🤍"}</span>
              <span>{likes}</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] md:aspect-[2/1] bg-slate-100 rounded-[32px] overflow-hidden mb-16 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-200/60 relative">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Two-Column Responsive Layout (Main Content + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          
          {/* Main Column */}
          <div className="space-y-10">
            {/* Content Container */}
            <div className="bg-white rounded-[32px] p-6 md:p-16 shadow-xs border border-slate-200/60 relative">
              {post.excerpt && (
                <div className="text-xl md:text-2xl font-medium text-slate-600 leading-relaxed mb-10 pb-10 border-b border-slate-100 italic">
                  "{post.excerpt}"
                </div>
              )}

              {/* Table of Contents Section (matching 2nd picture style) */}
              {headings.length > 0 && (
                <div className="mb-10 bg-slate-50/60 border border-slate-200/70 rounded-2xl p-6 transition-all duration-300">
                  <button 
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="w-full flex items-center justify-between text-slate-800 font-bold text-base cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <List className="w-4 h-4 text-slate-500" />
                      <span className="tracking-tight">Table of Contents</span>
                    </div>
                    {isTocOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isTocOpen && (
                    <ul className="mt-5 space-y-3.5 pl-1.5 border-t border-slate-200/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      {headings.map((item, idx) => (
                        <li 
                          key={item.id} 
                          className={`text-sm ${
                            item.level === 3 ? "pl-6 border-l border-slate-200 ml-2 text-slate-500 font-medium" : "text-slate-700 font-bold"
                          }`}
                        >
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className="text-left text-inherit hover:text-[#006400] transition-colors cursor-pointer block w-full hover:underline"
                          >
                            {item.level === 2 ? `${idx + 1}. ` : ""}
                            {item.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Post Body Content */}
              <div 
                className="post-content"
                dangerouslySetInnerHTML={{ 
                  __html: processedContent 
                    ? processedContent.replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ") 
                    : "" 
                }} 
              />

              {/* Tags */}
              {post.keywords && post.keywords.length > 0 && (
                <div className="mt-16 pt-8 border-t border-slate-100">
                  <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.split(",").map((kw: string) => (
                      <span key={kw} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
                        #{kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Profile Box (matching 2nd picture style) */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 md:p-8">
                  <h3 className="text-[18px] font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200/50">
                    Author Profile
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Author Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm relative">
                      {post.author?.avatar ? (
                        <img src={post.author.avatar} alt={post.author.name || "Author"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#006400] to-[#005000] text-white text-3xl font-extrabold uppercase">
                          {(post.author?.name || post.author?.email || "A").charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Author Name and Bio */}
                    <div className="text-center sm:text-left space-y-2">
                      <Link 
                        href={`/author/${encodeURIComponent(post.author?.name || post.author?.email?.split('@')[0] || 'CoreHead Editor')}`}
                        className="text-base font-extrabold text-[#006400] hover:underline block"
                      >
                        {post.author?.name || post.author?.email?.split('@')[0] || "CoreHead Editor"}
                      </Link>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {post.author?.bio || 
                          `${post.author?.name || post.author?.email?.split('@')[0] || "CoreHead Editor"} is a web developer and tech writer who enjoys working with Next.js, React, and modern web tools. He shares practical tips and easy-to-follow guides to help developers build better websites and applications.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Likes, Views and Social Sharing bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                {/* Views and Likes pills */}
                <div className="flex items-center gap-3">
                  {/* Views Pill */}
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-full flex items-center gap-2 text-xs font-bold text-slate-600 shadow-xs">
                    <span className="text-slate-400 text-sm">👁️</span>
                    <span>{views} {views === 1 ? "View" : "Views"}</span>
                  </div>

                  {/* Likes Pill (Clickable) */}
                  <button 
                    onClick={toggleLike}
                    className={`px-4 py-2 border rounded-full flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      hasLiked 
                        ? "bg-[#e2f0d9] border-green-300 text-[#006400]" 
                        : "bg-green-50/50 border-green-100 text-green-700 hover:bg-[#e2f0d9]"
                    }`}
                  >
                    <span className="text-sm">{hasLiked ? "❤️" : "💚"}</span>
                    <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
                  </button>
                </div>

                {/* Social Share icons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 mr-1">Share:</span>
                  
                  {/* Copy Link button */}
                  <button
                    onClick={copyShareLink}
                    className="w-9 h-9 rounded-full bg-[#006400] text-white flex items-center justify-center hover:bg-[#005000] transition-colors cursor-pointer"
                    title="Copy Page Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* X (Twitter) Share */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#006400] text-white flex items-center justify-center hover:bg-[#005000] transition-colors"
                    title="Share on X (Twitter)"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* LinkedIn Share */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#006400] text-white flex items-center justify-center hover:bg-[#005000] transition-colors"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  {/* WhatsApp Share */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}%20${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#006400] text-white flex items-center justify-center hover:bg-[#005000] transition-colors"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.57 2.01 14.1 1.01 11.999 1.01 6.562 1.01 2.138 5.38 2.134 10.81c-.002 1.706.452 3.374 1.314 4.872l-.998 3.645 3.73-.973zm12.14-5.287c-.302-.15-1.785-.88-2.062-.98-.277-.1-.478-.15-.678.15-.2.3-.777.98-.95 1.18-.173.2-.347.225-.65.075-.302-.15-1.276-.47-2.43-1.499-.899-.8-1.505-1.79-1.682-2.09c-.177-.3-.02-.46.13-.61.137-.134.302-.35.453-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.678-1.635-.93-2.245-.244-.59-.49-.51-.678-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.05-.275 1.025-1.05 2.525-1.05 2.575 0 .05.075.1.125.15.115.115 1.83 2.795 4.435 3.92.62.268 1.105.428 1.481.547.624.2 1.192.172 1.64.105.5-.075 1.785-.73 2.037-1.435.252-.705.252-1.31.177-1.435-.075-.125-.277-.2-.578-.35z" />
                    </svg>
                  </a>

                  {/* Facebook Share */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#006400] text-white flex items-center justify-center hover:bg-[#005000] transition-colors"
                    title="Share on Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            {/* Comments Section */}
            <div className="max-w-[800px] mx-auto mt-12 w-full">
              <CommentsSection postId={post.id} />
            </div>
          </div>

          {/* Sidebar Column (Recent Posts) */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs">
              <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                Recent Posts
              </h3>

              {recentPosts.length > 0 ? (
                <div className="space-y-5">
                  {recentPosts.map((rPost) => {
                    const rImageUrl = rPost.coverImage || rPost.imageUrl || rPost.thumbnailUrl || rPost.featured_image || `https://picsum.photos/seed/${rPost.id}/200/150`;
                    const rCat = rPost.category || (Array.isArray(rPost.categories) ? rPost.categories[0] : rPost.categories) || "General";
                    
                    return (
                      <Link 
                        key={rPost.id}
                        href={`/blog/${rPost.slug || rPost.id}`}
                        className="flex gap-4 group/sidebar items-start"
                      >
                        {/* Sidebar Item Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 relative">
                          <img 
                            src={rImageUrl} 
                            alt={rPost.title} 
                            className="w-full h-full object-cover group-hover/sidebar:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Sidebar Item Info */}
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black text-[#006400] uppercase tracking-wider mb-1 block">
                            {rCat}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover/sidebar:text-[#006400] transition-colors">
                            {rPost.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                            {new Date(rPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No other recent posts found.</p>
              )}
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}
