import { api } from '@/lib/api';
import { PublicPageRenderer } from '@/components/Renderer/PublicPageRenderer';
import './page.css';

interface SinglePostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SinglePostPageProps) {
  const resolvedParams = await params;
  const post = await api.getPostBySlug(resolvedParams.slug);
  return {
    title: `${post.title} | CoreHead Blog`,
    description: post.excerpt,
  };
}

export default async function SinglePostPage({ params }: SinglePostPageProps) {
  const resolvedParams = await params;
  
  // Fetch layout, post, and bindings sequentially or concurrently
  const [layout, post, bindings] = await Promise.all([
    api.getPublicLayout('single-post'),
    api.getPostBySlug(resolvedParams.slug),
    api.getBindings().catch(() => ({ mode: 'dynamic', selected: {} })) // fallback if not set
  ]);


  return (
    <article className="single-post-page">
      <PublicPageRenderer 
        layout={layout} 
        data={{ post }}
        bindings={bindings}
      />
    </article>
  );
}
