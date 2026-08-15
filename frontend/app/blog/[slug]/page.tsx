import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import BlogPostClient from "@/components/blog/BlogPostClient";
import DetailedFooter from "@/components/DetailedFooter";

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

  // Fetch recent posts (fetch up to 10 to filter current one and display 5)
  const postsData = await api.getPreviewPosts(10).catch(() => ({ posts: [] }));
  const posts = Array.isArray(postsData) ? postsData : (postsData?.posts || []);
  const recentPosts = posts
    .filter((p: any) => p.id !== post.id && p.status === "Published")
    .slice(0, 5);

  return (
    <>
      <BlogPostClient post={post} recentPosts={recentPosts} />
      <DetailedFooter />
    </>
  );
}
