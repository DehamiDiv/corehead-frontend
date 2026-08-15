"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidesHero from "@/components/GuidesHero";
import GuideCard from "@/components/GuideCard";
import { ArrowRight, BookOpen, Zap, Database } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA";
import { api } from "@/lib/api";
import { resolvePublicSite } from "@/lib/publicSite";
import { cn } from "@/lib/utils";

interface Guide {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  category: string;
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"quickstart" | "build">("quickstart");

  useEffect(() => {
    async function fetchGuides() {
      try {
        setLoading(true);
        // Find public site with slug "guides"
        const site = await resolvePublicSite("guides");
        if (site) {
          // Fetch preview posts for this site
          const postsData = await api.getPreviewPosts(12, site.id);
          const raw = Array.isArray(postsData?.posts)
            ? postsData.posts
            : Array.isArray(postsData)
            ? postsData
            : [];

          const formatted: Guide[] = raw.map((post: any) => ({
            title: post.title,
            description: post.excerpt || "",
            tags: post.tags || [],
            image: post.coverImage || post.thumbnailUrl || post.imageUrl || "",
            link: `/s/guides/blog/${post.slug}`,
            category: post.category || "",
          }));
          setGuides(formatted);
        }
      } catch (err) {
        console.error("Failed to load guides:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGuides();
  }, []);

  // Categorize
  const quickstartGuides = guides.filter((g) =>
    g.category.toLowerCase().includes("quickstart")
  );
  const buildGuides = guides.filter((g) =>
    g.category.toLowerCase().includes("build")
  );

  // Filter by search query
  const matchesSearch = (g: Guide) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      g.title.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query) ||
      g.tags.some((t) => t.toLowerCase().includes(query))
    );
  };

  const filteredQuickstart = quickstartGuides.filter(matchesSearch);
  const filteredBuild = buildGuides.filter(matchesSearch);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <GuidesHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setActiveTab("quickstart")}
          className={cn(
            "px-8 py-3.5 rounded-full text-base font-bold transition-all duration-300 shadow-md flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none",
            activeTab === "quickstart"
              ? "bg-blue-600 text-white shadow-blue-200"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Zap className={cn("w-5 h-5 transition-transform duration-300", activeTab === "quickstart" ? "text-amber-300 fill-amber-300 scale-110" : "text-slate-400")} />
          Quickstart Guides
        </button>
        <button
          onClick={() => setActiveTab("build")}
          className={cn(
            "px-8 py-3.5 rounded-full text-base font-bold transition-all duration-300 shadow-md flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none",
            activeTab === "build"
              ? "bg-blue-600 text-white shadow-blue-200"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Database className={cn("w-5 h-5 transition-transform duration-300", activeTab === "build" ? "text-blue-100 scale-110" : "text-slate-400")} />
          Build Application
        </button>
      </div>

      {/* Quickstart Guides Section */}
      {activeTab === "quickstart" && (
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Quickstart guides
                </h2>
                <p className="text-slate-500">
                  Get up and running with CoreHead in minutes.
                </p>
              </div>
              <Link
                href="/s/guides/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
              >
                View more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <GuideCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredQuickstart.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredQuickstart.map((guide, index) => (
                  <GuideCard key={index} {...guide} delay={index * 0.1} target="_blank" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No quickstart guides found</h3>
                <p className="text-slate-500">Try adjusting your search terms or view the full index.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Build Application Section */}
      {activeTab === "build" && (
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Build an application
                </h2>
                <p className="text-slate-500">
                  Deep dives into building complex applications.
                </p>
              </div>
              <Link
                href="/s/guides/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
              >
                View more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <GuideCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredBuild.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBuild.map((guide, index) => (
                  <GuideCard key={index} {...guide} delay={index * 0.1} target="_blank" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No application guides found</h3>
                <p className="text-slate-500">Try adjusting your search terms or view the full index.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <CTA />
      <Footer />
    </main>
  );
}

function GuideCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 rounded-full w-12" />
          <div className="h-6 bg-slate-200 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}
