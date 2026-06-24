import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsSection from "@/components/blog/CommentsSection";
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

  // Dynamically extract headings for Table of Contents if showToc is enabled
  const headings: { text: string; id: string; level: string }[] = [];
  let modifiedContent = post.content || "";

  if (post.showToc) {
    // Use `s` flag (dotAll) so `.` matches newlines too — Quill often adds newlines inside tags
    const headingRegex = /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi;
    let index = 0;
    modifiedContent = modifiedContent.replace(headingRegex, (match: string, tag: string, attrs: string, text: string) => {
      const level = tag.toLowerCase();
      // Only build TOC for h2 and h3
      if (level !== 'h2' && level !== 'h3') return match;
      const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
      if (!cleanText) return match;
      const id = `toc-${index++}-${cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      headings.push({ text: cleanText, id, level });
      return `<${tag} id="${id}"${attrs}>${text}</${tag}>`;
    });
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

      {/* Table of Contents */}
      {post.showToc && headings.length > 0 && (
        <div className="post-toc">
          <h3 className="toc-title">Table of Contents</h3>
          <ul className="toc-list">
            {headings.map((h) => (
              <li key={h.id} className={`toc-item toc-${h.level}`}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: modifiedContent.replace(/\n/g, "<br/>") }}
      />

      {/* Comments Section */}
      {post.allowComments && (
        <CommentsSection postId={post.id} />
      )}

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
