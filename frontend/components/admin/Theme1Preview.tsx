"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Phone, Mail } from "lucide-react";
import { api } from "@/lib/api";

interface Theme1PreviewProps {
  onClose: () => void;
  logoUrl?: string;
  navLinks?: Array<{ id: number; name: string; link: string }>;
  headerBg?: string;
  headerFont?: string;
  fontFamily?: string;
  footerLogoUrl?: string;
  footerBg?: string;
  footerFont?: string;
}

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Beginner's Guide to Planting a Vegetable Garden from Scratch",
    excerpt: "Learn how to start your first vegetable garden with this complete beginner-friendly guide covering soil prep, plant selection, and ongoing care.",
    category: "PLANTS & GARDENS",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    large: true,
  },
  {
    id: 2,
    title: "Solar Energy for Your Home: A Beginner's Guide to Going Green",
    excerpt: "Learn how to harness solar power for your home, reduce energy costs, and contribute to a sustainable...",
    category: "ECO LIVING",
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&q=80",
  },
  {
    id: 3,
    title: "Organic Gardening 101: Growing Your Own Vegetables at Home",
    excerpt: "Start your organic gardening journey with this complete guide to growing fresh, healthy vegetables...",
    category: "PLANTS & GARDENS",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
  },
  {
    id: 4,
    title: "Protecting Endangered Species: Conservation Efforts That Are...",
    excerpt: "Discover inspiring conservation success stories and learn how global efforts are saving endangered specie...",
    category: "WILDLIFE",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&q=80",
  },
];

const LATEST_ARTICLES = [
  {
    id: 5,
    title: "How to Photograph Wildlife in Their Natural Habitat: Essential...",
    excerpt: "Learn essential wildlife photography techniques including equipment, camera settings, animal behavior, and ethical...",
    category: "WILDLIFE",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    id: 6,
    title: "Beginner's Guide to Planting a Vegetable Garden from Scratch",
    excerpt: "Learn how to start your first vegetable garden with this complete beginner-friendly guide covering soil prep, an...",
    category: "PLANTS & GARDENS",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  },
  {
    id: 7,
    title: "Climate Change and Its Impact on Global Ecosystems: What You...",
    excerpt: "Explore the profound effects of climate change on ecosystems worldwide, from coral reefs to rainforests, and learn what we...",
    category: "ENVIRONMENT",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&q=80",
  },
];

const CATEGORIES = ["Environment", "Outdoor Adventures", "Natural Wonders", "Eco-Living", "Nature Photography", "Aquatic Plants"];

export default function Theme1Preview({ 
  onClose,
  logoUrl,
  navLinks,
  headerBg,
  headerFont,
  fontFamily,
  footerLogoUrl,
  footerBg,
  footerFont
}: Theme1PreviewProps) {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "contact" | "post">("home");
  const [activePost, setActivePost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Lock body scroll when preview is open
    document.body.style.overflow = "hidden";
    
    const loadPosts = async () => {
      try {
        const data = await api.getPreviewPosts(10);
        const published = Array.isArray(data.posts) ? data.posts : [];
        setPosts(published);
      } catch (err) {
        console.error("Failed to load live preview posts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getPopularArticles = () => {
    if (loading || posts.length === 0) {
      return MOCK_ARTICLES;
    }
    return posts.slice(0, 4).map((post, idx) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : ""),
      content: post.content || "",
      category: post.category || post.categories?.[0]?.name || post.categories?.[0] || "General",
      image: post.thumbnailUrl || `https://images.unsplash.com/photo-${1500400000000 + idx * 1000}?w=800&q=80`,
      author: post.author?.name || "Admin",
      date: post.createdAt,
    }));
  };

  const getLatestArticles = () => {
    if (loading || posts.length < 5) {
      if (posts.length > 0) {
        return posts.map((post, idx) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : ""),
          content: post.content || "",
          category: post.category || post.categories?.[0]?.name || post.categories?.[0] || "General",
          image: post.thumbnailUrl || `https://images.unsplash.com/photo-${1510400000000 + idx * 1000}?w=600&q=80`,
          author: post.author?.name || "Admin",
          date: post.createdAt,
        }));
      }
      return LATEST_ARTICLES;
    }
    return posts.slice(4, 7).map((post, idx) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : ""),
      content: post.content || "",
      category: post.category || post.categories?.[0]?.name || post.categories?.[0] || "General",
      image: post.thumbnailUrl || `https://images.unsplash.com/photo-${1520400000000 + idx * 1000}?w=600&q=80`,
      author: post.author?.name || "Admin",
      date: post.createdAt,
    }));
  };

  // Determine font family style based on selected value
  const getFontStyle = () => {
    if (fontFamily === "dm-sans") return "'DM Sans', sans-serif";
    if (fontFamily === "ibm-plex-sans") return "'IBM Plex Sans', sans-serif";
    return "'Inter', sans-serif";
  };

  const popularArticles = getPopularArticles();
  const latestArticles = getLatestArticles();

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto" style={{ fontFamily: getFontStyle() }}>
      {/* Floating Close Button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[210] p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md shadow-lg"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Page Content — full screen flex wrapper to push footer to bottom */}
      <div className="min-h-screen flex flex-col bg-white">
        {/* ── NAVBAR (Theme 1 style: dark green header or custom) ── */}
        <nav 
          className={`flex items-center justify-between px-10 py-6 z-[25] w-full transition-colors ${activeTab === "home" ? "absolute top-0 bg-transparent" : "sticky top-0 shadow-md"}`}
          style={activeTab === "home" ? {} : { backgroundColor: headerBg || "#0e5c38" }}
        >
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#0e5c38] text-xs font-black">C</span>
                </div>
                <span className="font-extrabold text-white text-base tracking-wide">CoreHead</span>
              </>
            )}
          </div>
          <div 
            className="flex items-center gap-6 text-xs font-medium"
            style={{ color: headerFont || "#ffffff" }}
          >
            {navLinks && navLinks.length > 0 ? (
              navLinks.map((item) => {
                const nameLower = item.name.toLowerCase();
                const isHome = nameLower.includes("home");
                const isAbout = nameLower.includes("about");
                const isContact = nameLower.includes("contact");
                
                let onClickHandler = undefined;
                if (isHome) onClickHandler = () => setActiveTab("home");
                else if (isAbout) onClickHandler = () => setActiveTab("about");
                else if (isContact) onClickHandler = () => setActiveTab("contact");

                return (
                  <button
                    key={item.id}
                    onClick={onClickHandler}
                    className={`hover:opacity-100 transition-opacity py-1 ${
                      (isHome && activeTab === "home") || 
                      (isAbout && activeTab === "about") || 
                      (isContact && activeTab === "contact") 
                        ? "border-b-2 border-current font-bold" 
                        : "opacity-80"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("home")}
                  className={`hover:text-white transition-colors py-1 ${activeTab === "home" ? "border-b-2 border-white text-white font-bold" : ""}`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`hover:text-white transition-colors py-1 ${activeTab === "about" ? "border-b-2 border-white text-white font-bold" : ""}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`hover:text-white transition-colors py-1 ${activeTab === "contact" ? "border-b-2 border-white text-white font-bold" : ""}`}
                >
                  Contact
                </button>
              </>
            )}
            <button className="text-xs px-4 py-1.5 border border-white/40 rounded-full hover:bg-white/10 font-bold transition-all text-white ml-2">
              Sign-In
            </button>
          </div>
        </nav>

        {/* ── VIEW ROUTER ── */}
        <main className="flex-1">
          {activeTab === "home" && (
            <>
              {/* ── HERO ── */}
            <div
              className="relative w-full flex flex-col justify-between"
              style={{
                minHeight: "65vh",
                backgroundImage: "url('https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative z-10 flex-1 flex flex-col justify-center px-10 max-w-[1200px] mx-auto w-full pt-28 pb-16">
                {/* Breadcrumb */}
                <p className="text-white/90 text-sm mb-6 font-medium tracking-wide">Home › What We Do</p>

                {/* Title */}
                <h1 className="text-white font-medium leading-tight mb-8" style={{ fontSize: "clamp(32px, 4.5vw, 52px)", maxWidth: "800px" }}>
                  Nature Is Essential For The Survival Of All Life On Earth. But It&apos;s Diminishing, Fast.
                </h1>

                {/* Search Bar */}
                <div className="flex items-center bg-white rounded-full p-2 shadow-2xl" style={{ maxWidth: "450px" }}>
                  <div className="pl-4 pr-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="text-sm text-gray-600 outline-none flex-1 bg-transparent py-1.5"
                    readOnly
                  />
                  <button className="bg-[#008A00] hover:bg-[#007000] text-white px-7 py-2.5 rounded-full text-sm font-bold transition-colors">
                    Search
                  </button>
                </div>
              </div>

              {/* Bottom Links */}
              <div className="relative z-10 w-full px-10 pb-8">
                <div className="max-w-[1200px] mx-auto flex justify-between items-center text-white font-bold text-sm">
                  <a href="#" className="hover:opacity-80 transition-opacity">Our Website</a>
                  <a href="#" className="hover:opacity-80 transition-opacity">What We Do</a>
                </div>
              </div>
            </div>

            {/* ── POPULAR ARTICLES ── */}
            <div className="px-10 py-10 bg-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[#3d6b35] text-xs font-bold uppercase tracking-wide mb-1">What We Do</p>
                  <h2 className="text-2xl font-black text-gray-900">Popular Articles</h2>
                </div>
                <p className="text-xs text-gray-500 max-w-[200px] text-right leading-relaxed">
                  Fauna &amp; Flora has been using the collective knowledge and experience to protect nature.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Featured Large Article */}
                {popularArticles[0] && (
                  <div 
                    className="group cursor-pointer"
                    onClick={() => { setActivePost(popularArticles[0]); setActiveTab("post"); }}
                  >
                    <div className="rounded-2xl overflow-hidden mb-3 h-44">
                      <img
                        src={popularArticles[0].image}
                        alt={popularArticles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3d6b35] transition-colors mb-2 leading-snug">
                      {popularArticles[0].title}
                    </h3>
                    <p className="text-xs text-[#3d6b35] leading-relaxed mb-3 line-clamp-2">
                      {popularArticles[0].excerpt}
                    </p>
                    <span className="inline-block border border-gray-300 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {popularArticles[0].category}
                    </span>
                  </div>
                )}

                {/* Right Column - 3 Small Articles */}
                <div className="space-y-4">
                  {popularArticles.slice(1).map((article) => (
                    <div 
                      key={article.id} 
                      className="flex gap-3 group cursor-pointer"
                      onClick={() => { setActivePost(article); setActiveTab("post"); }}
                    >
                      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#3d6b35] transition-colors mb-1 leading-snug line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{article.excerpt}</p>
                        <span className="inline-block border border-gray-300 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── LATEST STORIES ── */}
            <div className="px-10 py-10 bg-gray-50">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Latest Stories &amp; Updates</h2>
                <p className="text-xs text-gray-500">
                  Explore our comprehensive collection of articles, news, and{" "}
                  <span className="text-[#3d6b35]">insights</span>.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <button className="p-1.5 bg-white border border-gray-200 rounded-full text-gray-400 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-colors ${
                      i === 2
                        ? "border-gray-900 text-gray-900 bg-white"
                        : "border-gray-200 text-gray-500 bg-white hover:border-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button className="p-1.5 bg-white border border-gray-200 rounded-full text-gray-400 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                {latestArticles.map((article) => (
                  <div 
                    key={article.id} 
                    className="bg-white rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => { setActivePost(article); setActiveTab("post"); }}
                  >
                    <div className="h-36 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-[#3d6b35] mb-2 line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-3 mb-3">{article.excerpt}</p>
                      <span className="inline-block border border-gray-300 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {article.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button className="w-7 h-7 rounded bg-[#3d6b35] text-white text-xs font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded border border-gray-300 text-gray-600 text-xs font-bold flex items-center justify-center hover:border-gray-500">2</button>
                <span className="text-gray-400 text-xs">...</span>
                <button className="w-7 h-7 rounded border border-gray-300 text-gray-600 text-xs font-bold flex items-center justify-center hover:border-gray-500">5</button>
                <button className="px-3 h-7 rounded border border-gray-300 text-gray-600 text-xs font-medium flex items-center justify-center hover:border-gray-500">Next</button>
              </div>
            </div>
          </>
        )}

        {activeTab === "about" && (
          <>
            {/* ── ABOUT US SECTION ── */}
            <div className="max-w-[1200px] mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white">
              <div>
                <h1 className="text-4xl font-extrabold text-[#0f172a] mb-6 leading-tight">About Us</h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-md">
                  We are a passionate team dedicated to delivering reliable solutions that help businesses grow, adapt, and succeed in a rapidly evolving world.
                </p>
                <button className="bg-[#0e5c38] text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#0b4e2f] transition-all">
                  Get Started <span>→</span>
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://img.freepik.com/free-vector/business-analytics-concept-illustration_114360-6397.jpg?w=800"
                  alt="About Us Illustration"
                  className="w-full max-w-[450px] object-contain"
                />
              </div>
            </div>

            {/* ── WHAT WE ACTUALLY DO ── */}
            <div className="py-16 bg-white border-t border-gray-100">
              <div className="text-center max-w-2xl mx-auto mb-12 px-6">
                <h2 className="text-3xl font-extrabold text-[#0f172a] mb-4">What We Actually Do</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We understand how to connect people. Content is communication and it&apos;s what we do best.
                </p>
              </div>
              <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* IT Support */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={2} />
                      <line x1="8" y1="21" x2="16" y2="21" strokeWidth={2} />
                      <line x1="12" y1="17" x2="12" y2="21" strokeWidth={2} />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">IT Support</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">
                    Innovative IT solutions to enhance operational efficiency
                  </p>
                </div>

                {/* Content Creation */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Content Creation</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">
                    Compelling content that engages your audience
                  </p>
                </div>

                {/* Digital Solutions */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Digital Solutions</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">
                    Custom digital solutions designed to support business growth
                  </p>
                </div>

                {/* Influencer Marketing */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Influencer Marketing</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">
                    Dynamic marketing strategies that elevate your brand
                  </p>
                </div>
              </div>
            </div>

            {/* ── EMPOWERING THROUGH INNOVATION ── */}
            <div className="py-16 bg-gray-50">
              <div className="text-center max-w-2xl mx-auto mb-12 px-6">
                <h2 className="text-3xl font-extrabold text-[#0f172a]">Empowering Through Innovation and Impact</h2>
              </div>
              <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Vision */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0e5c38] mb-4">Vision</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    We envision a future where technology and creativity converge to drive unparalleled growth and success for our clients. We aim to be the leading force in transforming businesses through innovative solutions.
                  </p>
                </div>

                {/* Mission */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0e5c38] mb-4">Mission</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Our mission is to provide exceptional IT support, compelling content, and effective marketing services. We empower clients by delivering solutions that enhance operational efficiency and elevate brand presence.
                  </p>
                </div>

                {/* Goal */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0e5c38] mb-4">Goal</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Our goal is to continuously innovate and expand our services to meet evolving client needs. We&apos;re committed to fostering a culture of excellence and making a lasting impact through our expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* ── A TALE OF PASSION, PURPOSE, AND EXCELLENCE ── */}
            <div className="py-16 bg-white">
              <div className="text-center max-w-2xl mx-auto mb-12 px-6">
                <h2 className="text-3xl font-extrabold text-[#0f172a] mb-4">A Tale of Passion, Purpose, and Excellence</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our story is one of relentless passion, clear purpose, and unwavering commitment to excellence. We have established ourselves as trusted partners across the globe.
                </p>
              </div>

              {/* Stats */}
              <div className="max-w-[800px] mx-auto grid grid-cols-3 gap-8 text-center mb-16 px-6">
                <div>
                  <p className="text-4xl font-extrabold text-[#0e5c38] mb-1">17+</p>
                  <p className="text-gray-500 text-xs font-semibold">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-[#0e5c38] mb-1">150+</p>
                  <p className="text-gray-500 text-xs font-semibold">Trusted Partners</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-[#0e5c38] mb-1">20k+</p>
                  <p className="text-gray-500 text-xs font-semibold">Active Installs</p>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="max-w-[1200px] mx-auto px-10">
                <div className="bg-[#0e5c38] rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4 relative z-10">
                    Stand Up, Act Now: Together We Can Make a Difference
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed max-w-xl mx-auto mb-8 relative z-10">
                    We believe in the power of collective action. By working together, we can create meaningful change and drive impactful results.
                  </p>
                  <button className="border border-white hover:bg-white/10 text-white text-xs font-bold px-6 py-3 rounded-full transition-all relative z-10">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "contact" && (
          <>
            {/* ── CONTACT US BANNER ── */}
            <div className="w-full bg-[#e8f5e9] py-16 text-center">
              <h1 className="text-4xl font-extrabold text-[#0f172a] mb-4">Contact Us</h1>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto px-6 leading-relaxed">
                We&apos;re here to help. Get in touch with us for inquiries, support, or business opportunities.
              </p>
            </div>

            {/* ── CONTACT LAYOUT ── */}
            <div className="max-w-[1200px] mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Contact Info */}
              <div>
                <h2 className="text-3xl font-extrabold text-[#0f172a] mb-8">Contact Information</h2>

                {/* Location Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a] mb-0.5">Location</h3>
                    <p className="text-gray-500 text-xs font-medium">United Kingdom</p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a] mb-0.5">Phone Number</h3>
                    <p className="text-gray-500 text-xs font-medium">(+44) 00000 00000</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e5c38] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a] mb-0.5">Email</h3>
                    <p className="text-gray-500 text-xs font-medium">info@company.com</p>
                  </div>
                </div>

                {/* Connect With Us */}
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-4">Connect With Us</h3>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#0e5c38] rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#0e5c38] rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#0e5c38] rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Drop Us a Line Form */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Drop Us a Line</h2>
                
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0f172a] block mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="First Name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#0e5c38] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0f172a] block mb-1">
                        Last <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#0e5c38] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0f172a] block mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter Email"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#0e5c38] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0f172a] block mb-1">
                        Confirm Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Confirm Email"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#0e5c38] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0f172a] block mb-0.5">
                      Comments <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[10px] text-gray-500 mb-2">
                      Please tell us know what&apos;s on your mind. Have a question for us? Ask away.
                    </p>
                    <textarea
                      placeholder="Your message..."
                      rows={5}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#0e5c38] transition-colors resize-none"
                      maxLength={500}
                      required
                    ></textarea>
                    <p className="text-[10px] text-gray-400 mt-1">0 of 500 max characters</p>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#085a2c] hover:bg-[#064220] text-white text-xs font-bold px-8 py-2.5 rounded-full transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {/* ── GET STARTED BANNER ── */}
            <div className="max-w-[1200px] mx-auto px-10 pb-16">
              <div className="bg-[#0e5c38] rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4 relative z-10">
                  Ready to Get Started?
                </h3>
                <p className="text-white/80 text-xs leading-relaxed max-w-xl mx-auto mb-8 relative z-10">
                  Join over 150+ trusted partners who have chosen us for their digital transformation journey.
                </p>
                <button className="border border-white hover:bg-white/10 text-white text-xs font-bold px-6 py-3 rounded-full transition-all relative z-10">
                  Learn More
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── ABOUT VIEW ── */}
        {activeTab === "about" && (
          <div className="px-10 py-20 min-h-[500px] bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
              <p className="text-gray-600 leading-relaxed mb-8">
                Welcome to our blog. We are dedicated to bringing you the best content on nature, environment, and sustainable living. Our team of passionate writers and researchers work tirelessly to provide accurate and engaging articles that inspire and educate.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80" 
                alt="About Us" 
                className="w-full h-[320px] object-cover rounded-3xl shadow-sm"
              />
            </div>
          </div>
        )}

        {/* ── CONTACT VIEW ── */}
        {activeTab === "contact" && (
          <div className="px-10 py-20 min-h-[500px] bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contact Us</h1>
              <p className="text-gray-500 text-sm mb-10 text-center">Have a question or feedback? We&apos;d love to hear from you.</p>
              
              <form className="max-w-xl mx-auto space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-bold text-gray-900 block mb-1.5">Name</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-[#0e5c38] outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-900 block mb-1.5">Email</label>
                  <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-[#0e5c38] outline-none" placeholder="Your email" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-900 block mb-1.5">Message</label>
                  <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-[#0e5c38] outline-none resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button className="w-full bg-[#0e5c38] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#084226] transition-colors mt-2 shadow-md">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── SINGLE POST VIEW ── */}
        {activeTab === "post" && activePost && (
          <div className="bg-white pb-20">
            {/* Post Hero */}
            <div className="relative w-full h-[400px]">
              <img 
                src={activePost.image} 
                alt={activePost.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-end px-10 pb-12 max-w-5xl mx-auto">
                <span className="inline-block bg-[#0e5c38] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 w-fit shadow-md">
                  {activePost.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 shadow-sm">
                  {activePost.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="font-bold">{activePost.author?.[0] || 'A'}</span>
                    </div>
                    <span>By {activePost.author || 'Author'}</span>
                  </div>
                  <span>•</span>
                  <span>{activePost.date ? new Date(activePost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="max-w-3xl mx-auto px-10 py-16">
              <div className="prose prose-sm md:prose-base prose-green max-w-none">
                <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 italic border-l-4 border-[#0e5c38] pl-4">
                  {activePost.excerpt}
                </p>
                {activePost.content ? (
                  <div 
                    className="text-gray-700 space-y-6 leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: activePost.content }} 
                  />
                ) : (
                  <div className="text-gray-700 space-y-6 leading-relaxed">
                    <p>
                      Nature provides the foundation for human survival and prosperity. The intricate web of life, from the smallest microorganisms to the vast oceans, works in harmony to sustain ecosystems. However, this delicate balance is increasingly under threat.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                )}
              </div>

              {/* Tags & Share */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium hover:bg-gray-200 cursor-pointer transition-colors">Environment</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium hover:bg-gray-200 cursor-pointer transition-colors">Nature</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Share</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0e5c38] hover:border-[#0e5c38] transition-colors"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0e5c38] hover:border-[#0e5c38] transition-colors"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </main>

        {/* ── FOOTER (Theme 1 style: matching homepage/about us/contact) ── */}
        <footer 
          className="border-t border-gray-100 px-10 py-8"
          style={{ backgroundColor: footerBg || "#ffffff", color: footerFont || "#0f172a" }}
        >
          <div className="grid grid-cols-3 gap-8 mb-6">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {footerLogoUrl ? (
                  <img src={footerLogoUrl} alt="Footer Logo" className="h-8 object-contain" />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-[#0e5c38] flex items-center justify-center">
                      <span className="text-white text-xs font-black">C</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">CoreHead</span>
                  </>
                )}
              </div>
              <p className="text-xs opacity-80 mb-1">Blogs By CoreHead</p>
              <p className="text-xs opacity-80 mb-1">Email: support@gmail.com</p>
              <p className="text-xs opacity-80">Phone: +94 451 455 454</p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-sm font-bold mb-3">Quick Links</h5>
              <div className="space-y-2">
                <button onClick={() => setActiveTab("home")} className="block text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  Home
                </button>
                <button onClick={() => setActiveTab("about")} className="block text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  About
                </button>
                <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 transition-colors opacity-80 cursor-not-allowed">
                  Privacy Policy
                </a>
                <button onClick={() => setActiveTab("contact")} className="block text-xs hover:opacity-100 opacity-80 transition-opacity">
                  Contact Us
                </button>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h5 className="text-sm font-bold mb-3">Connect</h5>
              <div className="flex gap-3">
                {/* Facebook */}
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                {/* X / Twitter */}
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-current opacity-60 pt-4 flex items-center justify-between">
            <p className="text-[10px]">
              © 2026 <span className="font-bold">CoreHead</span> by SeekaHost Technologies Ltd. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[10px] hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="text-[10px] hover:opacity-100 transition-opacity">Terms of Service</a>
            </div>
          </div>
        </footer>

        {/* Scroll to top button */}
        <div className="fixed bottom-8 right-8 w-8 h-8 bg-[#0e5c38] rounded-full flex items-center justify-center shadow-lg cursor-pointer z-20">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
}
