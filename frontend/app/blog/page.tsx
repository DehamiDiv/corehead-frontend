import Link from "next/link";
import "./page.css";

export const metadata = {
  title: "Blog | CoreHead",
  description: "Explore the latest articles and tutorials from the CoreHead team.",
};

async function getPosts() {
  try {
    const res = await fetch("http://localhost:5000/api/posts?status=Published", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function BlogArchivePage() {
  const posts = await getPosts();

  return (
    <main className="blog-archive-page">
      <div className="blog-header">
        <span className="blog-eyebrow">Our Blog</span>
        <h1>Latest Articles</h1>
        <p>Explore the latest insights, tutorials and stories from the CoreHead team.</p>
      </div>

      {posts.length === 0 ? (
        <div className="blog-empty">
          <span>📝</span>
          <p>No posts published yet. Be the first to create one!</p>
          <Link href="/admin/posts/create" className="blog-empty-link">Create a Post →</Link>
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="post-card-link">
              <article className="post-card">
                <div className="post-card-image">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} />
                  ) : (
                    <div className="post-card-placeholder">
                      <span>📄</span>
                    </div>
                  )}
                  {post.categories && (
                    <span className="post-card-category">{post.categories.split(",")[0]}</span>
                  )}
                </div>
                <div className="post-card-body">
                  <h2>{post.title}</h2>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <div className="post-card-meta">
                    <span className="post-card-author">✍️ {post.author?.name || "Admin"}</span>
                    <span className="post-card-read">Read more →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
