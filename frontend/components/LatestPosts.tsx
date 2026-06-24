"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto py-12">
      <h2 className="text-2xl font-bold text-[#1E293B] mb-6 text-center">
        Latest Articles
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug || post.id}`}
            className="group block bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors mb-2 line-clamp-2">
                {post.title || "Untitled"}
              </h3>
              <p className="text-sm text-[#64748B] line-clamp-3">
                {post.excerpt || ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
