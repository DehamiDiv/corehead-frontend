"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, Calendar, User } from "lucide-react";

export default function LatestPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getPosts();
        const published = Array.isArray(data)
          ? data.filter((p) => p.status === "Published")
          : [];
        setPosts(published.slice(0, 6)); // show top 6
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="relative w-full max-w-[1400px] mx-auto py-24 px-6 lg:px-12 bg-[#F8FAFC]">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-80"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[13px] font-bold uppercase tracking-widest mb-4 border border-blue-100/50">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Latest Insights
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
              Read Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Latest Articles</span>
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-[15px] font-bold text-[#0F172A] hover:text-blue-600 transition-colors bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md border border-slate-200"
          >
            View all posts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug || post.id}`}
              className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Thumbnail Area */}
              <div className="relative h-[240px] w-full overflow-hidden bg-slate-100">
                <img 
                  src={post.thumbnailUrl || `https://picsum.photos/seed/${post.id}/800/600`} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category Pill */}
                {post.categories?.[0] && (
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[12px] font-black uppercase tracking-wider text-blue-600 shadow-sm">
                    {post.categories[0]}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-1 p-8">
                <div className="flex items-center gap-4 text-[13px] font-semibold text-slate-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <User className="w-4 h-4" />
                    {post.author?.name || "Admin"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors mb-4 line-clamp-2 leading-snug">
                  {post.title || "Untitled"}
                </h3>
                
                <p className="text-[15px] text-slate-600 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt || "Read more about this article to explore the full story..."}
                </p>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[14px] font-bold text-blue-600 group-hover:text-indigo-600 transition-colors">
                    Read Article
                  </span>
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
