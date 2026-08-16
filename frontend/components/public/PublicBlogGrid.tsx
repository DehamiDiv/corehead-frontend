import Link from "next/link";
import { BookOpen } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import PublicPostCard from "@/components/public/PublicPostCard";
import { siteBlogPath, siteHomePath } from "@/lib/publicSite";

export default function PublicBlogGrid({
  posts,
  siteSlug,
  siteName,
  title = "All stories",
  subtitle,
  showHomeLink = false,
}: {
  posts: any[];
  siteSlug: string;
  siteName: string;
  title?: string;
  subtitle?: string;
  showHomeLink?: boolean;
}) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No published posts yet"
        description={`${siteName} hasn’t published any articles yet. Check back soon for new stories.`}
        actions={
          showHomeLink
            ? [{ label: "Back home", href: siteHomePath(siteSlug), variant: "secondary" }]
            : undefined
        }
      />
    );
  }

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured.id);
  const categories = Array.from(
    new Set(
      posts
        .map((p) =>
          typeof p.category === "string" ? p.category : p.categories?.[0]?.name || p.categories?.[0]
        )
        .filter(Boolean)
    )
  ) as string[];

  return (
    <div className="w-full">
      <header className="mb-10 sm:mb-12">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "var(--site-primary)" }}
        >
          Journal
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: "var(--site-ink)" }}
            >
              {title}
            </h1>
            <p
              className="mt-3 max-w-2xl text-base leading-relaxed"
              style={{ color: "var(--site-muted)" }}
            >
              {subtitle ||
                `Explore ${posts.length} published ${posts.length === 1 ? "story" : "stories"} from ${siteName}.`}
            </p>
          </div>
          <p
            className="text-sm font-semibold tabular-nums shrink-0"
            style={{ color: "var(--site-muted)" }}
          >
            {posts.length} articles
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-black/5 bg-[var(--site-surface)] px-3 py-1.5 text-xs font-semibold shadow-sm"
                style={{ color: "var(--site-ink)" }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mb-10">
        <PublicPostCard post={featured} siteSlug={siteSlug} variant="featured" />
      </div>

      {rest.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.id}>
              <PublicPostCard post={post} siteSlug={siteSlug} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-14 text-center">
        <Link
          href={siteHomePath(siteSlug)}
          className="text-sm font-bold hover:underline"
          style={{ color: "var(--site-primary)" }}
        >
          ← Back to home
        </Link>
        <span className="mx-3 opacity-30">·</span>
        <Link
          href={siteBlogPath(siteSlug)}
          className="text-sm font-bold hover:underline"
          style={{ color: "var(--site-muted)" }}
        >
          All posts
        </Link>
      </div>
    </div>
  );
}
