import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsSection from "@/components/blog/CommentsSection";
import DetailedFooter from "@/components/DetailedFooter";
import { api } from "@/lib/api";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import "./page.css";

interface SinglePostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SinglePostPageProps) {
  const resolvedParams = await params;
  try {
    const post = await api.getPostBySlug(resolvedParams.slug);
    return {
      title: `${post.title} | CoreHead Blog`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Blog Post | CoreHead",
      description: "Read the latest from CoreHead",
    };
  }
}

export default async function SinglePostPage({ params }: SinglePostPageProps) {
  const resolvedParams = await params;
  let post;
  
  try {
    post = await api.getPostBySlug(resolvedParams.slug);
  } catch (error) {
    console.error("Failed to fetch post:", error);
  }

  if (!post) notFound();

  const imageUrl = post.coverImage || post.imageUrl || post.thumbnailUrl || `https://picsum.photos/seed/${post.id}/1200/600`;
  
  // Try to parse categories
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
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-[14px] font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pt-12">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[12px] font-black uppercase tracking-widest mb-6 border border-blue-100">
            {categoryName}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] leading-[1.1] mb-8 tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                {post.author?.avatar && post.author.avatar.length > 1 ? (
                  <img 
                    src={post.author.avatar.startsWith('http') ? post.author.avatar : `http://localhost:5000${post.author.avatar}`} 
                    alt="Author" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-[12px] font-bold text-blue-600">
                    {post.author?.name?.charAt(0) || "U"}
                  </span>
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
          </div>
        </header>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] md:aspect-[2/1] bg-slate-100 rounded-[32px] overflow-hidden mb-16 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-200/60 relative">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="max-w-[800px] mx-auto bg-white rounded-[32px] p-8 md:p-16 shadow-sm border border-slate-200/60 relative -mt-32 z-10">
          {post.excerpt && (
            <div className="text-xl md:text-2xl font-medium text-slate-600 leading-relaxed mb-10 pb-10 border-b border-slate-100 italic">
              "{post.excerpt}"
            </div>
          )}

          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }} 
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
        </div>

        {/* Comments Section */}
        <div className="max-w-[800px] mx-auto mt-12">
          <CommentsSection postId={post.id} />
        </div>
      </div>
      <DetailedFooter />
    </article>
  );
}
