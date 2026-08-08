import Link from "next/link";
import DetailedFooter from "@/components/DetailedFooter";
import { api } from "@/lib/api";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import "./page.css";

export const metadata = {
  title: "Blog | CoreHead",
  description:
    "Explore the latest articles and tutorials from the CoreHead team.",
};

export default async function BlogArchivePage() {
  // Fetch layout and posts concurrently
  const [layout, postsData, bindings] = await Promise.all([
    api.getPublicLayout("blog-loop").catch(() => ({
      blocks: [
        { id: '1', type: 'Heading', content: 'Latest Posts' },
        { id: '2', type: 'Collection List', content: { limit: 6 } }
      ]
    })),
    api.getPreviewPosts(100).catch(() => ({ posts: [] })),
    api.getBindings().catch(() => ({ mode: "dynamic", selected: {} })),
  ]);

  const posts = Array.isArray(postsData) ? postsData : (Array.isArray(postsData?.posts) ? postsData.posts : []);

  // Transform posts for the renderer if needed
  const renderData = {
    posts: posts.filter((p: any) => p.status?.toLowerCase() === "published")
  };

  return (
    <>
      <main className="blog-archive-page max-w-7xl mx-auto px-6 py-12">
        <PublicPageRenderer
          layout={layout as any}
          data={renderData}
          isLoop={true}
          bindings={bindings}
        />
      </main>
      <DetailedFooter />
    </>
  );
}
