"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  featured_image?: string;
  category?: string;
  categories?: string | string[];
  status: string;
  createdAt: string;
  publishedAt?: string;
  author?: {
    id: number;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

interface BlogArchiveClientProps {
  posts: Post[];
}

export default function BlogArchiveClient({ posts }: BlogArchiveClientProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Likes and views states
  const [likesMap, setLikesMap] = useState<Record<number, number>>({});
  const [userLikedSet, setUserLikedSet] = useState<Set<number>>(new Set());
  const [viewsMap, setViewsMap] = useState<Record<number, number>>({});
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialLikes: Record<number, number> = {};
    const initialViews: Record<number, number> = {};
    const liked = new Set<number>();

    posts.forEach((post) => {
      const seedViews = ((post.id * 7) % 80) + 12;
      const seedLikes = ((post.id * 3) % 20) + 3;

      const storedViews = localStorage.getItem(`views_post_${post.id}`);
      if (storedViews) {
        initialViews[post.id] = parseInt(storedViews);
      } else {
        initialViews[post.id] = seedViews;
        localStorage.setItem(`views_post_${post.id}`, String(seedViews));
      }

      const storedLikes = localStorage.getItem(`likes_post_${post.id}`);
      if (storedLikes) {
        initialLikes[post.id] = parseInt(storedLikes);
      } else {
        initialLikes[post.id] = seedLikes;
        localStorage.setItem(`likes_post_${post.id}`, String(seedLikes));
      }

      const hasLiked = localStorage.getItem(`user_liked_post_${post.id}`);
      if (hasLiked === "true") {
        liked.add(post.id);
      }
    });

    setLikesMap(initialLikes);
    setViewsMap(initialViews);
    setUserLikedSet(liked);
  }, [posts]);

  const handleLike = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const isLiked = userLikedSet.has(postId);
    const newLikedSet = new Set(userLikedSet);
    let newLikesCount = (likesMap[postId] || 0);

    if (isLiked) {
      newLikedSet.delete(postId);
      newLikesCount = Math.max(0, newLikesCount - 1);
      localStorage.removeItem(`user_liked_post_${postId}`);
    } else {
      newLikedSet.add(postId);
      newLikesCount += 1;
      localStorage.setItem(`user_liked_post_${postId}`, "true");
    }

    setUserLikedSet(newLikedSet);
    setLikesMap((prev) => ({ ...prev, [postId]: newLikesCount }));
    localStorage.setItem(`likes_post_${postId}`, String(newLikesCount));
  };

  const scrollLeftCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRightCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Determine list of slider posts (top 5 posts)
  const sliderPosts = useMemo(() => {
    return posts.slice(0, 5);
  }, [posts]);

  const currentSliderPost = sliderPosts[currentSlideIndex];

  // Dynamically extract categories from posts and merge with base categories
  const categoriesList = useMemo(() => {
    const base = ["All", "Test Cat", "Remote-Work", "AI", "Travelling", "Business", "Education"];
    const found = new Set<string>();
    posts.forEach((post) => {
      const cat = post.category || (Array.isArray(post.categories) ? post.categories[0] : post.categories);
      if (cat && typeof cat === "string") {
        found.add(cat);
      }
    });
    // Merge base with any found categories
    const combined = [...base];
    found.forEach((cat) => {
      if (!combined.some((b) => b.toLowerCase() === cat.toLowerCase())) {
        combined.push(cat);
      }
    });
    return combined;
  }, [posts]);

  // Filter posts based on selected category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      const postCat = post.category || (Array.isArray(post.categories) ? post.categories[0] : post.categories) || "General";
      const matchesCategory =
        selectedCategory === "All" ||
        postCat.toLowerCase() === selectedCategory.toLowerCase();

      // Search query filter
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Slide handlers
  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlideIndex((prev) => (prev === 0 ? sliderPosts.length - 1 : prev - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlideIndex((prev) => (prev === sliderPosts.length - 1 ? 0 : prev + 1));
  };

  // Helper to format tags for slider post
  const getSliderPostTags = (post: Post) => {
    const cat = post.category || (Array.isArray(post.categories) ? post.categories[0] : post.categories) || "General";
    return [cat];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-[1300px] mx-auto h-20 px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="CoreHead Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Links & Auth */}
          <div className="flex items-center gap-8">
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </Link>
              <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
            </nav>
            <Link
              href="/login"
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              Sign-In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1300px] mx-auto px-6 py-10">
        {/* Featured Slider / Carousel */}
        {currentSliderPost && (
          <Link 
            href={`/blog/${currentSliderPost.slug || currentSliderPost.id}`}
            className="group relative block w-full aspect-[21/9] md:h-[450px] rounded-3xl overflow-hidden shadow-sm mb-10 border border-slate-200/40"
          >
            {/* Background Cover Image */}
            <Image
              src={
                currentSliderPost.coverImage ||
                currentSliderPost.imageUrl ||
                currentSliderPost.thumbnailUrl ||
                currentSliderPost.featured_image ||
                `https://picsum.photos/seed/${currentSliderPost.id}/1200/500`
              }
              alt={currentSliderPost.title}
              fill
              className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            {/* Slider Navigation Arrows */}
            {sliderPosts.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition-all border border-white/10 z-20 backdrop-blur-sm"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition-all border border-white/10 z-20 backdrop-blur-sm"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Overlay Info Block */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col gap-4 text-white z-10">
              {/* Category Badges */}
              <div className="flex flex-wrap gap-2">
                {getSliderPostTags(currentSliderPost).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-bold bg-white/15 hover:bg-white/25 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Post Title */}
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-4xl line-clamp-2">
                {currentSliderPost.title}
              </h2>

              {/* Excerpt */}
              <p className="text-white/80 text-sm md:text-base max-w-3xl line-clamp-2 font-normal leading-relaxed">
                {currentSliderPost.excerpt}
              </p>

              {/* Author & Avatar */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                  {currentSliderPost.author?.avatar ? (
                    <img
                      src={currentSliderPost.author.avatar}
                      alt={currentSliderPost.author.name || "Author"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white/70" />
                  )}
                </div>
                <span className="text-sm font-bold text-white/90">
                  {currentSliderPost.author?.name || currentSliderPost.author?.email?.split("@")[0] || "CoreHead Editor"}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Selected Category Header (matching 3rd picture) */}
        <div className="text-center py-6 mb-4">
          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] capitalize tracking-tight mb-3">
            {selectedCategory}
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
            Discover the latest trends and detailed reports in {selectedCategory}.
          </p>
        </div>

        {/* Category Carousel Controls & Tabs */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex items-center gap-3 w-full max-w-3xl justify-center">
            {/* Left scroll chevron */}
            <button 
              onClick={scrollLeftCategories}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={categoriesScrollRef}
              className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
            >
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 text-xs font-black rounded-full transition-all uppercase tracking-wider border cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "text-white bg-[#006400] border-[#006400] shadow-sm"
                      : "text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right scroll chevron */}
            <button 
              onClick={scrollRightCategories}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-[#006400] focus:ring-2 focus:ring-[#006400]/10 transition-all font-medium shadow-inner"
            />
          </div>
        </div>

        {/* Latest News / Filtered Posts Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Latest News</h3>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const postCat = post.category || (Array.isArray(post.categories) ? post.categories[0] : post.categories) || "General";
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug || post.id}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Cover Image Wrapper */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-50 rounded-t-3xl">
                      <Image
                        src={
                          post.coverImage ||
                          post.imageUrl ||
                          post.thumbnailUrl ||
                          post.featured_image ||
                          `https://picsum.photos/seed/${post.id}/400/300`
                        }
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content body */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <h4 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-[#006400] transition-colors mb-2 leading-snug">
                        {post.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-5">
                        {post.excerpt}
                      </p>

                      {/* Card Footer Info (matching 3rd picture) */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        {/* Views & Likes */}
                        <div className="flex items-center gap-4 text-slate-500 text-[13px] font-medium">
                          <span className="flex items-center gap-1.5" title="Views">
                            <span className="text-slate-400 text-sm">👁️</span>
                            <span>{viewsMap[post.id] !== undefined ? viewsMap[post.id] : (((post.id * 7) % 80) + 12)}</span>
                          </span>
                          <button
                            onClick={(e) => handleLike(e, post.id)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer group/like ${
                              userLikedSet.has(post.id) ? "text-red-500 font-bold" : "hover:text-red-500"
                            }`}
                            title={userLikedSet.has(post.id) ? "Unlike post" : "Like post"}
                          >
                            <span className={`text-sm transition-transform group-hover/like:scale-120 duration-150`}>
                              {userLikedSet.has(post.id) ? "❤️" : "🤍"}
                            </span>
                            <span>{likesMap[post.id] !== undefined ? likesMap[post.id] : (((post.id * 3) % 20) + 3)}</span>
                          </button>
                        </div>

                        {/* Category Badge clickable */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedCategory(postCat);
                          }}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#006400] hover:text-white hover:border-[#006400] transition-all cursor-pointer shadow-xs"
                        >
                          {postCat}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <span className="text-4xl mb-4 block">🔍</span>
              <h4 className="text-lg font-bold text-slate-800 mb-1">No posts found</h4>
              <p className="text-sm text-slate-500">We couldn't find any posts matching your search or category filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
