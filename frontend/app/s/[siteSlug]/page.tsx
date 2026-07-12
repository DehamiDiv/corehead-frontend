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
import {
  siteEyebrow,
  siteTagline,
  postCategory,
} from "@/lib/publicSiteCopy";
import PublicPostCard from "@/components/public/PublicPostCard";
import EmptyState from "@/components/ui/EmptyState";
import {
  ArrowRight,
  BookOpen,
  Leaf,
  Sparkles,
  TreePine,
  Camera,
  Globe2,
} from "lucide-react";
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

  const branding = resolvePublicBranding(site.branding);
  const description = siteTagline(site.name, branding);

  return {
    title: `${site.name} — Home`,
    description,
    openGraph: {
      title: site.name,
      description,
      type: "website",
    },
  };
}

/**
 * Market-ready public tenant home — magazine layout with featured story,
 * category highlights, value pillars, and CTA (theme-aware).
 */
export default async function PublicSiteHomePage({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    notFound();
  }

  const branding = resolvePublicBranding(site.branding);
  const homeStyle = branding.homeStyle || "classic";
  const isNature = homeStyle === "nature";
  const isDark = homeStyle === "dark";
  const tagline = siteTagline(site.name, branding);
  const eyebrow = siteEyebrow(branding);
  const blogHref = siteBlogPath(site.slug);
  const logo = resolveMediaUrl(site.logo);

  let posts: any[] = [];
  try {
    const postsData = await api.getPreviewPosts(12, site.id);
    const raw = Array.isArray(postsData?.posts)
      ? postsData.posts
      : Array.isArray(postsData)
        ? postsData
        : [];
    posts = raw.filter(isPublishedPost);
  } catch (err) {
    console.error(`Home posts failed for ${site.slug}:`, err);
  }

  const featured =
    posts.find((p) => p.featured) || posts[0] || null;
  const remaining = featured
    ? posts.filter((p) => p.id !== featured.id)
    : posts;
  const sideStories = remaining.slice(0, 3);
  const gridStories = remaining.slice(3, 9);

  const categories = Array.from(
    new Set(
      posts
        .map((p) => postCategory(p))
        .filter((c): c is string => Boolean(c))
    )
  ).slice(0, 8);

  const heroImage =
    resolveMediaUrl(
      featured?.coverImage ||
        featured?.thumbnailUrl ||
        featured?.featured_image
    ) ||
    (isNature
      ? "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
      : null);

  const pillars =
    isNature
      ? [
          {
            icon: Leaf,
            title: "Grow greener",
            body: "Practical gardening and eco-living guides you can use this weekend.",
          },
          {
            icon: TreePine,
            title: "Protect wildlife",
            body: "Conservation stories and ethical ways to reconnect with the wild.",
          },
          {
            icon: Camera,
            title: "See the planet",
            body: "Outdoor adventures and photography tips from the field.",
          },
        ]
      : [
          {
            icon: BookOpen,
            title: "Thoughtful stories",
            body: "Clear writing on the topics that matter to your readers.",
          },
          {
            icon: Sparkles,
            title: "Fresh perspectives",
            body: "Features and guides curated for a modern digital magazine.",
          },
          {
            icon: Globe2,
            title: "Built for your brand",
            body: "A fully branded public site — your name, logo, and voice.",
          },
        ];

  return (
    <main className="w-full" data-theme={branding.themeId}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt=""
              className="h-full w-full object-cover scale-105"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, #0a0a0a 0%, #1e293b 100%)"
                  : "linear-gradient(145deg, var(--site-primary-soft) 0%, var(--site-bg) 55%, var(--site-surface) 100%)",
              }}
            />
          )}
          <div
            className={cn(
              "absolute inset-0",
              heroImage
                ? "bg-gradient-to-r from-black/80 via-black/55 to-black/30"
                : "bg-[var(--site-bg)]/40"
            )}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={site.name}
                  className="h-12 w-12 rounded-2xl object-cover border border-white/20 shadow-lg bg-white/10 backdrop-blur"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                  style={{ background: "var(--site-primary)" }}
                >
                  {site.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p
                className={cn(
                  "text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]",
                  heroImage ? "text-emerald-200/90" : ""
                )}
                style={heroImage ? undefined : { color: "var(--site-primary)" }}
              >
                {eyebrow}
              </p>
            </div>

            <h1
              className={cn(
                "font-black tracking-tight leading-[1.05]",
                "text-4xl sm:text-5xl lg:text-6xl",
                heroImage ? "text-white" : ""
              )}
              style={heroImage ? undefined : { color: "var(--site-ink)" }}
            >
              {site.name}
            </h1>

            <p
              className={cn(
                "mt-5 text-base sm:text-lg leading-relaxed max-w-xl",
                heroImage ? "text-white/85" : ""
              )}
              style={heroImage ? undefined : { color: "var(--site-muted)" }}
            >
              {tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={blogHref}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: branding.header?.ctaBg || "var(--site-accent, var(--site-primary))",
                  color: branding.header?.ctaColor || "#052e16",
                }}
              >
                <BookOpen className="h-4 w-4" />
                {branding.header?.ctaText || "Read the journal"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {featured && (
                <Link
                  href={sitePostPath(site.slug, featured.slug)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border transition-colors",
                    heroImage
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-black/10 hover:bg-black/5"
                  )}
                  style={heroImage ? undefined : { color: "var(--site-ink)" }}
                >
                  Featured story
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              )}
            </div>

            {categories.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={blogHref}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur transition-colors",
                      heroImage
                        ? "bg-white/15 text-white/95 border border-white/20 hover:bg-white/25"
                        : "bg-[var(--site-surface)] border border-black/5 shadow-sm"
                    )}
                    style={heroImage ? undefined : { color: "var(--site-ink)" }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Featured + side rail ─────────────────────────────── */}
      {posts.length > 0 ? (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: "var(--site-primary)" }}
              >
                This week
              </p>
              <h2
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: "var(--site-ink)" }}
              >
                Featured stories
              </h2>
            </div>
            <Link
              href={blogHref}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
              style={{ color: "var(--site-primary)" }}
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {featured && (
              <div className="lg:col-span-3">
                <PublicPostCard
                  post={featured}
                  siteSlug={site.slug}
                  variant="featured"
                />
              </div>
            )}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: "var(--site-muted)" }}
              >
                More to explore
              </p>
              {sideStories.map((post) => (
                <PublicPostCard
                  key={post.id}
                  post={post}
                  siteSlug={site.slug}
                  variant="horizontal"
                />
              ))}
              {sideStories.length === 0 && (
                <p className="text-sm" style={{ color: "var(--site-muted)" }}>
                  More stories will appear here as you publish.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <EmptyState
            icon={BookOpen}
            title="No published posts yet"
            description={`When ${site.name} publishes articles, the latest ones will appear here.`}
            actions={[{ label: "Browse blog", href: blogHref, variant: "secondary" }]}
          />
        </section>
      )}

      {/* ── Value pillars ────────────────────────────────────── */}
      <section
        id="features"
        className="scroll-mt-24 border-y border-black/5"
        style={{ background: "var(--site-surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-2xl mb-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--site-primary)" }}
            >
              Why {site.name}
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: "var(--site-ink)" }}
            >
              A magazine built for modern readers
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--site-muted)" }}>
              Beautiful public pages, published stories only, and branding that
              feels like your own product — not a template dump.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-black/5 bg-[var(--site-bg)] p-6 shadow-sm"
              >
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: "var(--site-primary)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--site-ink)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Latest grid ──────────────────────────────────────── */}
      {gridStories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: "var(--site-primary)" }}
              >
                Latest
              </p>
              <h2
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: "var(--site-ink)" }}
              >
                From the journal
              </h2>
            </div>
            <Link
              href={blogHref}
              className="text-sm font-bold inline-flex items-center gap-1 hover:underline"
              style={{ color: "var(--site-primary)" }}
            >
              Full archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridStories.map((post) => (
              <li key={post.id}>
                <PublicPostCard post={post} siteSlug={site.slug} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-14 text-center shadow-xl"
          style={{
            background:
              homeStyle === "nature"
                ? "linear-gradient(135deg, #14532d 0%, #166534 45%, #052e16 100%)"
                : "linear-gradient(135deg, var(--site-primary) 0%, var(--site-accent, var(--site-primary)) 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-emerald-300 blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70 mb-3">
              Start reading
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-xl mx-auto">
              {isNature
                ? "Grow something good today"
                : `Stay with ${site.name}`}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
              Browse the full archive of published stories, guides, and field notes.
            </p>
            <Link
              href={blogHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ color: isNature ? "#14532d" : "var(--site-primary)" }}
            >
              Explore all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
