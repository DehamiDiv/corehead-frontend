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
  const [layout, posts, bindings] = await Promise.all([
    api.getPublicLayout("blog-loop").catch(() => ({
      blocks: [
        { id: '1', type: 'Heading', content: 'Latest Posts' },
        { id: '2', type: 'Collection List', content: { limit: 6 } }
      ]
    })),
    api.getPosts().catch(() => []),
    api.getBindings().catch(() => ({ mode: "dynamic", selected: {} })),
  ]);

  // Transform posts for the renderer if needed
  const renderData = {
    posts: posts.filter((p: any) => p.status === "Published")
  };

  return (
    <main className="blog-archive-page">
      <PublicPageRenderer
        layout={layout}
        data={renderData}
        isLoop={true}
        bindings={bindings}
      />
    </main>
  );
}
