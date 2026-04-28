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
    api.getPreviewPosts(16).catch(() => ({ 
      posts: [
        { id: 1, title: 'Welcome to CoreHead', slug: 'welcome', excerpt: 'Discover our new CMS platform.', category: 'General', featured_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80' },
        { id: 2, title: 'Getting Started', slug: 'getting-started', excerpt: 'Learn the basics of blogging with CoreHead.', category: 'Tutorial', featured_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80' },
        { id: 3, title: 'Advanced Tips', slug: 'advanced-tips', excerpt: 'Take your content to the next level.', category: 'Tips', featured_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80' }
      ]
    })),
    api.getBindings().catch(() => ({ mode: "dynamic", selected: {} })),
  ]);

  return (
    <main className="blog-archive-page">
      <PublicPageRenderer
        layout={layout}
        data={posts}
        isLoop={true}
        bindings={bindings}
      />
    </main>
  );
}
