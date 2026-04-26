import { api } from '@/lib/api';
import { PublicPageRenderer } from '@/components/Renderer/PublicPageRenderer';
import './page.css';

export const metadata = {
  title: 'Blog | CoreHead',
  description: 'Explore the latest articles and tutorials from the CoreHead team.',
};

export default async function BlogArchivePage() {
  // Fetch layout and posts concurrently
  const [layout, posts, bindings] = await Promise.all([
    api.getPublicLayout('blog-loop'),
    api.getPreviewPosts(16), // Fetch 6 posts
    api.getBindings().catch(() => ({ mode: 'dynamic', selected: {} }))
  ]);

  return (
    <main className="blog-archive-page">
      <PublicPageRenderer 
        layout={layout} 
        data={{ posts }} 
        isLoop={true} 
        bindings={bindings}
      />
    </main>
  );
}
