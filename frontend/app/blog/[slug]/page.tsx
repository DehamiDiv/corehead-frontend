import Link from "next/link";
import { notFound } from "next/navigation";
import "./page.css";

interface SinglePostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/slug/${slug}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: SinglePostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | CoreHead Blog" };
  return {
    title: `${post.title} | CoreHead Blog`,
    description: post.excerpt || post.metaDescription || "",
  };
}

export default async function SinglePostPage({ params }: SinglePostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  let categories: string[] = [];
  const rawCats = post.categories || post.category;
  if (Array.isArray(rawCats)) {
    categories = rawCats;
  } else if (typeof rawCats === 'string') {
    try {
      const parsed = JSON.parse(rawCats);
      if (Array.isArray(parsed)) categories = parsed;
      else categories = rawCats.split(",").map((c: string) => c.replace(/[\[\]"']/g, '').trim()).filter(Boolean);
    } catch {
      categories = rawCats.split(",").map((c: string) => c.replace(/[\[\]"']/g, '').trim()).filter(Boolean);
    }
  }

  return (
    <article className="single-post-page">
      {/* Back link */}
      <Link href="/blog" className="post-back-link">← Back to Blog</Link>

      {/* Hero image */}
      {(post.coverImage || post.imageUrl || post.thumbnailUrl) && (
        <div className="post-hero-image">
          <img src={post.coverImage || post.imageUrl || post.thumbnailUrl} alt={post.title} />
        </div>
      )}

      {/* Header */}
      <header className="post-header">
        {categories.length > 0 && (
          <div className="post-categories">
            {categories.map((cat: string) => (
              <span key={cat} className="post-category-badge">{cat}</span>
            ))}
          </div>
        )}
        <h1>{post.title}</h1>
        {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        <div className="post-meta">
          <span className="post-author">✍️ {post.author?.name || "Admin"}</span>
          <span className="post-date">
            🗓️ {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* Content */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
      />

      {/* Footer / Author box */}
      <div className="post-footer">
        <div className="post-author-box">
          <div className="author-avatar">
            {(post.author?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="author-name">{post.author?.name || "Admin"}</p>
            <p className="author-label">Author</p>
          </div>
        </div>
        <Link href="/blog" className="post-back-btn">← All Posts</Link>
      </div>
    </article>
  );
}
