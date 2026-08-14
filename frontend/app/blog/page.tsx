import DetailedFooter from "@/components/DetailedFooter";
import { api } from "@/lib/api";
import BlogArchiveClient from "@/components/blog/BlogArchiveClient";

export const metadata = {
  title: "Blog | CoreHead",
  description:
    "Explore the latest articles and tutorials from the CoreHead team.",
};

export default async function BlogArchivePage() {
  // Fetch posts data
  const postsData = await api.getPreviewPosts(100).catch(() => ({ posts: [] }));
  const posts = Array.isArray(postsData) ? postsData : (postsData?.posts || []);

  const publishedPosts = posts.filter((p: any) => p.status === "Published");

  return (
    <>
      <BlogArchiveClient posts={publishedPosts} />
      <DetailedFooter />
    </>
  );
}
