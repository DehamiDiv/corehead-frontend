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

/** Layout — Bento: modern asymmetric card grid (SaaS / product). */
export default function BentoHomeLayout({
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
  const p0 = posts[0];
  const p1 = posts[1];
  const p2 = posts[2];
  const p3 = posts[3];
  const p4 = posts[4];

  const cover = (post?: PostLike | null) =>
    post
      ? resolveMediaUrl(
          post.coverImage || post.thumbnailUrl || post.featured_image
        )
      : null;

  return (
    <main
      className="w-full"
      data-home-layout="bento"
      style={{
        background: "var(--site-bg, #f8fafc)",
        color: "var(--site-ink, #0f172a)",
        fontFamily: "var(--site-font), system-ui, sans-serif",
      }}
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2 inline-flex items-center gap-1.5"
              style={{ color: "var(--site-primary)" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {eyebrow || "Bento home"}
            </p>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.05]"
              style={{ color: "var(--site-ink)" }}
            >
              {siteName}
            </h1>
            <p
              className="mt-3 text-sm sm:text-base leading-relaxed"
              style={{ color: "var(--site-muted)" }}
            >
              {tagline}
            </p>
          </div>
          <Link
            href={blogHref}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shrink-0 self-start sm:self-auto"
            style={{
              background: ctaBg || "var(--site-cta-bg, var(--site-primary))",
              color: ctaColor || "var(--site-cta-color, #fff)",
            }}
          >
            {ctaText || "Explore"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[160px]">
          {/* Large hero tile */}
          <Link
            href={p0?.slug ? sitePostPath(siteSlug, String(p0.slug)) : blogHref}
            className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden border group"
            style={{
              borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
              background: "var(--site-surface)",
            }}
          >
            {(cover(p0) || heroImage) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover(p0) || heroImage || ""}
                alt=""
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in srgb, var(--site-ink) 85%, transparent), transparent 55%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">
                {postCategory(p0 || {}) || sections?.featuredEyebrow || "Featured"}
              </p>
              <h2 className="text-lg sm:text-2xl font-bold leading-snug line-clamp-2">
                {p0?.title || siteName}
              </h2>
            </div>
          </Link>

          {/* Tall tile */}
          <Link
            href={p1?.slug ? sitePostPath(siteSlug, String(p1.slug)) : blogHref}
            className="col-span-1 row-span-2 relative rounded-3xl overflow-hidden border group"
            style={{
              borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
              background: "var(--site-primary-soft)",
            }}
          >
            {cover(p1) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover(p1) || ""}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 p-4 text-white">
              <h3 className="text-sm font-bold line-clamp-3 leading-snug">
                {p1?.title || sections?.pillarsTitle || "Stories"}
              </h3>
            </div>
          </Link>

          {/* Square accent */}
          <div
            className="col-span-1 row-span-1 rounded-3xl p-4 flex flex-col justify-between border"
            style={{
              background: "var(--site-primary)",
              color: "var(--site-surface, #fff)",
              borderColor: "transparent",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              {sections?.pillarsEyebrow || "Why us"}
            </p>
            <p className="text-sm font-bold leading-snug">
              {sections?.pillars?.[0]?.title || "Built for modern readers"}
            </p>
          </div>

          <Link
            href={p2?.slug ? sitePostPath(siteSlug, String(p2.slug)) : blogHref}
            className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden border group"
            style={{
              borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
              background: "var(--site-surface)",
            }}
          >
            {cover(p2) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover(p2) || ""}
                alt=""
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute bottom-0 p-3 text-white">
              <h3 className="text-xs font-bold line-clamp-2">{p2?.title || "More"}</h3>
            </div>
          </Link>

          <Link
            href={p3?.slug ? sitePostPath(siteSlug, String(p3.slug)) : blogHref}
            className="col-span-1 row-span-1 rounded-3xl border p-4 flex flex-col justify-end"
            style={{
              borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
              background: "var(--site-surface)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "var(--site-primary)" }}
            >
              {postCategory(p3 || {}) || "Read"}
            </p>
            <h3 className="text-sm font-bold line-clamp-2" style={{ color: "var(--site-ink)" }}>
              {p3?.title || sections?.latestTitle || "From the journal"}
            </h3>
          </Link>

          <Link
            href={p4?.slug ? sitePostPath(siteSlug, String(p4.slug)) : blogHref}
            className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden border"
            style={{
              borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
              background: "var(--site-accent, var(--site-primary))",
            }}
          >
            {cover(p4) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover(p4) || ""}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            ) : null}
            <div className="absolute inset-0 flex items-end p-3">
              <span className="text-xs font-bold text-white line-clamp-2">
                {p4?.title || sections?.ctaButton || "Explore all"}
              </span>
            </div>
          </Link>
        </div>
      </section>

      {posts.length > 5 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <ul className="grid sm:grid-cols-3 gap-4">
            {posts.slice(5, 8).map((post) => (
              <li key={post.id}>
                <Link
                  href={sitePostPath(siteSlug, String(post.slug || post.id))}
                  className="block rounded-2xl border p-4 hover:shadow-md transition-shadow"
                  style={{
                    background: "var(--site-surface)",
                    borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: "var(--site-primary)" }}
                  >
                    {postCategory(post) || "Story"}
                  </p>
                  <h3 className="font-bold text-sm line-clamp-2" style={{ color: "var(--site-ink)" }}>
                    {post.title}
                  </h3>
                  {formatPostDate(post.publishedAt || post.createdAt) && (
                    <p className="mt-2 text-[11px]" style={{ color: "var(--site-muted)" }}>
                      {formatPostDate(post.publishedAt || post.createdAt)}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
