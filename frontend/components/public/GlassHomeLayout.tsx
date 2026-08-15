import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteBlogPath, sitePostPath } from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import {
  formatPostDate,
  postCategory,
  type HomeSectionCopy,
} from "@/lib/publicSiteCopy";

type PostLike = {
  id: number | string;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  featured_image?: string;
  category?: string | null;
  publishedAt?: string;
  createdAt?: string;
};

type Props = {
  siteName: string;
  siteSlug: string;
  eyebrow: string;
  tagline: string;
  heroImage: string | null;
  ctaText?: string | null;
  ctaBg?: string | null;
  ctaColor?: string | null;
  posts: PostLike[];
  sections?: HomeSectionCopy | null;
};

/** Layout — Glass: light frosted glassmorphism SaaS home. */
export default function GlassHomeLayout({
  siteName,
  siteSlug,
  eyebrow,
  tagline,
  heroImage,
  ctaText,
  ctaBg,
  ctaColor,
  posts,
  sections,
}: Props) {
  const blogHref = siteBlogPath(siteSlug);
  const featured = posts[0];
  const rest = posts.slice(1, 4);
  const featuredImage =
    heroImage ||
    resolveMediaUrl(
      featured?.coverImage || featured?.thumbnailUrl || featured?.featured_image
    );

  return (
    <main
      className="w-full relative overflow-hidden"
      data-home-layout="glass"
      style={{
        background: "var(--site-bg, #eef2ff)",
        color: "var(--site-ink, #0f172a)",
        fontFamily: "var(--site-font), system-ui, sans-serif",
      }}
    >
      {/* Soft mesh blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full blur-3xl opacity-50"
          style={{ background: "var(--site-primary-soft, #c7d2fe)" }}
        />
        <div
          className="absolute top-1/3 -right-16 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--site-accent, #a5b4fc)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--site-primary)" }}
        />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] border backdrop-blur-xl"
          style={{
            background: "color-mix(in srgb, var(--site-surface, #fff) 55%, transparent)",
            borderColor: "color-mix(in srgb, var(--site-primary) 20%, transparent)",
            color: "var(--site-primary)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {eyebrow || ""}
        </span>

        <h1
          className="mt-6 text-[clamp(2.4rem,6vw,3.75rem)] font-bold tracking-tight leading-[1.1]"
          style={{ color: "var(--site-ink)" }}
        >
          {siteName}
        </h1>
        <p
          className="mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--site-muted)" }}
        >
          {tagline}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={blogHref}
            className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold shadow-lg backdrop-blur-sm"
            style={{
              background: ctaBg || "var(--site-cta-bg, var(--site-primary))",
              color: ctaColor || "var(--site-cta-color, #fff)",
              boxShadow: "0 12px 40px color-mix(in srgb, var(--site-primary) 25%, transparent)",
            }}
          >
            {sections?.ctaButton || ctaText || "Explore the archive"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {featured?.slug && (
            <Link
              href={sitePostPath(siteSlug, String(featured.slug))}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold border backdrop-blur-xl"
              style={{
                background: "color-mix(in srgb, var(--site-surface, #fff) 50%, transparent)",
                borderColor: "color-mix(in srgb, var(--site-ink) 10%, transparent)",
                color: "var(--site-ink)",
              }}
            >
              Featured story
            </Link>
          )}
        </div>

        {/* Frosted hero card */}
        {featuredImage && (
          <div
            className="mt-12 relative mx-auto max-w-3xl rounded-[1.75rem] overflow-hidden border backdrop-blur-2xl shadow-2xl"
            style={{
              borderColor: "color-mix(in srgb, #fff 60%, transparent)",
              background: "color-mix(in srgb, var(--site-surface, #fff) 45%, transparent)",
              boxShadow: "0 25px 80px color-mix(in srgb, var(--site-primary) 15%, transparent)",
            }}
          >
            <div className="aspect-[16/9] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Frosted feature pills */}
      <section id="features" className="scroll-mt-24 max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ul className="grid sm:grid-cols-3 gap-4">
          {(sections?.pillars || [])
            .slice(0, 3)
            .concat(
              sections?.pillars?.length
                ? []
                : [
                    { title: "Curated", body: "A focused collection of the latest published work." },
                    { title: "Insightful", body: "Ideas and perspectives presented with clarity." },
                    { title: "Independent", body: `A distinct publishing home for ${siteName}.` },
                  ]
            )
            .slice(0, 3)
            .map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border p-5 backdrop-blur-xl"
                style={{
                  background: "color-mix(in srgb, var(--site-surface, #fff) 55%, transparent)",
                  borderColor: "color-mix(in srgb, #fff 70%, transparent)",
                }}
              >
                <h3 className="font-bold mb-1.5" style={{ color: "var(--site-ink)" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                  {p.body}
                </p>
              </li>
            ))}
        </ul>
      </section>

      {posts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--site-ink)" }}>
              {sections?.featuredTitle || "Latest"}
            </h2>
            <Link
              href={blogHref}
              className="text-sm font-semibold"
              style={{ color: "var(--site-primary)" }}
            >
              View all
            </Link>
          </div>
          <ul className="grid sm:grid-cols-3 gap-4">
            {(rest.length > 0 ? rest : posts.slice(0, 3)).map((post) => (
              <li key={post.id}>
                <Link
                  href={sitePostPath(siteSlug, String(post.slug || post.id))}
                  className="block rounded-2xl border overflow-hidden backdrop-blur-xl hover:shadow-lg transition-shadow"
                  style={{
                    background:
                      "color-mix(in srgb, var(--site-surface, #fff) 60%, transparent)",
                    borderColor: "color-mix(in srgb, #fff 65%, transparent)",
                  }}
                >
                  <div className="aspect-[16/10] relative bg-white/30">
                    {resolveMediaUrl(
                      post.coverImage || post.thumbnailUrl || post.featured_image
                    ) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(
                          post.coverImage || post.thumbnailUrl || post.featured_image
                        ) || ""}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--site-primary-soft), color-mix(in srgb, var(--site-accent) 22%, var(--site-surface)))",
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    {postCategory(post) && (
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--site-primary)" }}
                      >
                        {postCategory(post)}
                      </p>
                    )}
                    <h3
                      className="font-bold text-sm line-clamp-2"
                      style={{ color: "var(--site-ink)" }}
                    >
                      {post.title}
                    </h3>
                    {formatPostDate(post.publishedAt || post.createdAt) && (
                      <p
                        className="mt-1.5 text-[11px]"
                        style={{ color: "var(--site-muted)" }}
                      >
                        {formatPostDate(post.publishedAt || post.createdAt)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
