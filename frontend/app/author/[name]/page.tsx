import Link from "next/link";
import DetailedFooter from "@/components/DetailedFooter";
import AuthorProfileHeader from "@/components/blog/AuthorProfileHeader";
import { api } from "@/lib/api";
import "./page.css";

interface AuthorProfilePageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: AuthorProfilePageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} - Author Profile | CoreHead`,
    description: `Read articles and posts by ${decodedName} on the CoreHead blog.`,
  };
}

async function getPostsByAuthor(authorName: string) {
  try {
    const postsData = await api.getPreviewPosts(100).catch(() => ({ posts: [] }));
    const posts = Array.isArray(postsData) ? postsData : (postsData?.posts || []);
    
    // Filter posts by author name case-insensitively
    return posts.filter((post: any) => {
      const pAuthorName = post.author?.name || post.author_name || "";
      return pAuthorName.toLowerCase() === authorName.toLowerCase();
    });
  } catch (error) {
    console.error("Failed to get posts by author:", error);
    return [];
  }
}

export default async function AuthorProfilePage({ params }: AuthorProfilePageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const posts = await getPostsByAuthor(decodedName);

  // Extract author info from their first post, or use defaults
  const authorInfo = posts.length > 0 && posts[0].author ? posts[0].author : { name: decodedName, bio: null, avatar: null };

  return (
    <>
      <main className="author-profile-page">
        {/* Author Header */}
        <AuthorProfileHeader authorName={decodedName} initialData={authorInfo} />

        {/* Posts Grid */}
        <section className="author-posts-section">
          <div className="author-posts-header">
            <h2>Posts by {authorInfo.name}</h2>
          </div>

          {posts.length === 0 ? (
            <div className="author-empty">
              <span>📝</span>
              <p>This author hasn't published any posts yet.</p>
              <Link href="/" className="author-empty-link">Back to Home →</Link>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post: any) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="post-card-link">
                  <article className="post-card">
                    <div className="post-card-image">
                      {post.coverImage || post.imageUrl || post.thumbnailUrl ? (
                        <img src={post.coverImage || post.imageUrl || post.thumbnailUrl} alt={post.title} />
                      ) : (
                        <div className="post-card-placeholder">
                          <span>📄</span>
                        </div>
                      )}
                      {(() => {
                        const rawCats = post.categories || post.category;
                        if (!rawCats) return null;
                        let catName = "General";
                        if (Array.isArray(rawCats) && rawCats.length > 0) {
                          catName = rawCats[0];
                        } else if (typeof rawCats === 'string') {
                          try {
                            const parsed = JSON.parse(rawCats);
                            if (Array.isArray(parsed) && parsed.length > 0) catName = parsed[0];
                            else catName = rawCats.split(",")[0].replace(/[\[\]"']/g, '').trim();
                          } catch {
                            catName = rawCats.split(",")[0].replace(/[\[\]"']/g, '').trim();
                          }
                        }
                        return catName ? <span className="post-card-category">{catName}</span> : null;
                      })()}
                    </div>
                    <div className="post-card-body">
                      <h2>{post.title}</h2>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      <div className="post-card-meta">
                        <span className="post-card-read" style={{ marginLeft: "auto" }}>Read more →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <DetailedFooter />
    </>
  );
}
