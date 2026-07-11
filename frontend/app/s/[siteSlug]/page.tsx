import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import {
  isPublishedPost,
  resolvePublicSite,
  siteBlogPath,
  sitePostPath,
} from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { resolvePublicBranding } from "@/lib/siteBranding";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    return { title: "Site not found | CoreHead" };
  }

  return {
    title: `${site.name} | Home`,
    description: `Welcome to ${site.name} — read the latest posts and updates.`,
  };
}

/**
 * T14 + R2-4: Public tenant home — theme-aware hero + latest posts.
 */
export default async function PublicSiteHomePage({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    notFound();
  }

  const branding = resolvePublicBranding(site.branding);
  const homeStyle = branding.homeStyle || "classic";
  const isDark = homeStyle === "dark";

  let posts: any[] = [];
  try {
    const postsData = await api.getPreviewPosts(6, site.id);
    const raw = Array.isArray(postsData?.posts)
      ? postsData.posts
      : Array.isArray(postsData)
        ? postsData
        : [];
    posts = raw.filter(isPublishedPost);
  } catch (err) {
    console.error(`Home posts failed for ${site.slug}:`, err);
  }

  const logo = resolveMediaUrl(site.logo);
  const blogHref = siteBlogPath(site.slug);

  const heroGradient =
    homeStyle === "nature"
      ? "linear-gradient(160deg, var(--site-primary-soft) 0%, var(--site-bg) 45%, #ecfdf5 100%)"
      : homeStyle === "magazine"
        ? "linear-gradient(120deg, var(--site-primary-soft) 0%, var(--site-bg) 50%, var(--site-surface) 100%)"
        : homeStyle === "dark"
          ? "linear-gradient(160deg, #000 0%, var(--site-bg) 55%, var(--site-surface) 100%)"
          : homeStyle === "minimal"
            ? "linear-gradient(180deg, var(--site-surface) 0%, var(--site-bg) 100%)"
            : "linear-gradient(145deg, var(--site-primary-soft) 0%, var(--site-surface) 55%, var(--site-bg) 100%)";

  return (
    <main className="w-full" data-theme={branding.themeId}>
      <section
        className={cn(
          "relative overflow-hidden border-b",
          isDark ? "border-white/10" : "border-black/5"
        )}
        style={{ background: heroGradient }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div
            className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "var(--site-primary)", opacity: 0.2 }}
          />
        </div>

        <div
          className={cn(
            "relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20",
            homeStyle === "magazine" && "sm:py-24"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-8",
              homeStyle === "magazine"
                ? "sm:flex-row sm:items-end sm:justify-between"
                : "sm:flex-row sm:items-center"
            )}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={site.name}
                className={cn(
                  "object-cover border shadow-xl",
                  homeStyle === "minimal"
                    ? "h-16 w-16 rounded-full border-black/5"
                    : "h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-white/20",
                  isDark && "shadow-black/40"
                )}
              />
            ) : (
              <div
                className={cn(
                  "text-white flex items-center justify-center font-black shadow-xl",
                  homeStyle === "minimal"
                    ? "h-16 w-16 rounded-full text-2xl"
                    : "h-20 w-20 sm:h-24 sm:w-24 rounded-2xl text-3xl"
                )}
                style={{ background: "var(--site-primary)" }}
              >
                {site.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "var(--site-primary)" }}
              >
                {homeStyle === "nature"
                  ? "Nature · Stories"
                  : homeStyle === "dark"
                    ? "Featured"
                    : homeStyle === "magazine"
                      ? "Magazine"
                      : "Welcome"}
              </p>
              <h1
                className={cn(
                  "font-black tracking-tight",
                  homeStyle === "magazine"
                    ? "text-4xl sm:text-6xl"
                    : "text-3xl sm:text-5xl"
                )}
                style={{ color: "var(--site-ink)" }}
              >
                {site.name}
              </h1>
              <p
                className="mt-3 text-base sm:text-lg max-w-xl leading-relaxed"
                style={{ color: "var(--site-muted)" }}
              >
                Discover articles, updates, and stories published by {site.name}.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={blogHref}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  style={{
                    background: "var(--site-primary)",
                    color: branding.header?.ctaColor || "#ffffff",
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  {branding.header?.ctaText || "Read the blog"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--site-muted)" }}
                >
                  Theme: {branding.themeId || "default"} · /s/{site.slug}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme nav "Features" → /s/{slug}#features (stays on this site) */}
      <section
        id="features"
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-4 scroll-mt-24"
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--site-primary)" }}
        >
          Features
        </p>
        <h2
          className="text-xl sm:text-2xl font-black mb-2"
          style={{ color: "var(--site-ink)" }}
        >
          Why {site.name}
        </h2>
        <p className="text-sm max-w-2xl" style={{ color: "var(--site-muted)" }}>
          Published stories, branded pages, and a workspace for {site.name} —
          isolated from every other site on the platform.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "var(--site-primary)" }}
            >
              Latest
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black"
              style={{ color: "var(--site-ink)" }}
            >
              Recent posts
            </h2>
          </div>
          {posts.length > 0 && (
            <Link
              href={blogHref}
              className="text-sm font-bold hover:underline inline-flex items-center gap-1"
              style={{ color: "var(--site-primary)" }}
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No published posts yet"
            description={`When ${site.name} publishes articles, the latest ones will appear here.`}
            actions={[
              {
                label: "Browse blog",
                href: blogHref,
                variant: "secondary",
              },
            ]}
          />
        ) : (
          <ul
            className={cn(
              "grid gap-5",
              homeStyle === "magazine"
                ? "sm:grid-cols-2 lg:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {posts.map((post, index) => {
              const href = sitePostPath(site.slug, post.slug);
              const image = resolveMediaUrl(
                post.coverImage || post.thumbnailUrl || post.featured_image
              );
              const date =
                post.publishedAt || post.published_date || post.createdAt;
              const featured = homeStyle === "magazine" && index === 0;

              return (
                <li
                  key={post.id}
                  className={featured ? "sm:col-span-2" : undefined}
                >
                  <Link
                    href={href}
                    className={cn(
                      "group flex h-full overflow-hidden border shadow-sm hover:shadow-md transition-all",
                      featured
                        ? "flex-col sm:flex-row rounded-3xl"
                        : "flex-col rounded-2xl",
                      isDark ? "border-white/10" : "border-black/5"
                    )}
                    style={{
                      background: "var(--site-surface)",
                      color: "var(--site-card-fg, var(--site-ink))",
                    }}
                  >
                    <div
                      className={cn(
                        "bg-black/5 overflow-hidden",
                        featured
                          ? "aspect-[16/10] sm:aspect-auto sm:w-1/2 sm:min-h-[240px]"
                          : "aspect-[16/10]"
                      )}
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white/80 text-2xl font-black"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--site-primary), var(--site-accent, var(--site-primary)))",
                          }}
                        >
                          {String(post.title || "?").charAt(0)}
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "p-4 flex flex-col flex-1",
                        featured && "sm:p-8 sm:justify-center"
                      )}
                    >
                      <h3
                        className={cn(
                          "font-bold line-clamp-2 transition-colors group-hover:opacity-90",
                          featured ? "text-2xl sm:text-3xl" : "text-base"
                        )}
                        style={{ color: "var(--site-ink)" }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p
                          className={cn(
                            "mt-2 text-sm line-clamp-2 flex-1",
                            featured && "sm:line-clamp-3 sm:text-base"
                          )}
                          style={{ color: "var(--site-muted)" }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                      {date && (
                        <p
                          className="mt-3 text-xs font-medium inline-flex items-center gap-1.5"
                          style={{ color: "var(--site-muted)" }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
