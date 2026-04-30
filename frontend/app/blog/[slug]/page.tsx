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
  
  // Fetch layout, post, and bindings concurrently
  const [layout, post, bindings] = await Promise.all([
    api.getPublicLayout('single-post').catch(() => ({
      blocks: [
        { id: '1', type: 'Heading', content: 'Post Title' },
        { id: '2', type: 'Markdown', content: 'Post Content' }
      ]
    })),
    api.getPostBySlug(resolvedParams.slug),
    api.getBindings().catch(() => ({ mode: 'dynamic', selected: {} }))
  ]);


  return (
    <article className="single-post-page">
      <PublicPageRenderer 
        layout={layout} 
        data={post}
        bindings={bindings}
      />
    </article>
  );
}
