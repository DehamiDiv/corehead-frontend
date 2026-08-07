import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

/** Layout — Studio: photography / portfolio full-bleed masonry. */
export default function StudioHomeLayout({
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
  const covers = posts.slice(0, 6).map((p) => ({
    post: p,
    src:
      resolveMediaUrl(p.coverImage || p.thumbnailUrl || p.featured_image) ||
      heroImage,
  }));

  return (
    <main
      className="w-full"
      data-home-layout="studio"
      style={{
        background: "var(--site-bg, #0a0a0a)",
        color: "var(--site-ink, #fafafa)",
        fontFamily: "var(--site-font), system-ui, sans-serif",
      }}
    >
      {/* Full-bleed intro strip */}
      <section className="relative min-h-[70vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          {(covers[0]?.src || heroImage) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={covers[0]?.src || heroImage || "https://placehold.co/800x400?text=No+image"}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--site-bg, #0a0a0a) 0%, transparent 55%), linear-gradient(to right, color-mix(in srgb, var(--site-bg, #0a0a0a) 70%, transparent), transparent 60%)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 pb-14 sm:pb-20 pt-32">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.35em] mb-4 opacity-80"
            style={{ color: "var(--site-accent, var(--site-primary))" }}
          >
            {eyebrow || ""}
          </p>
          <h1
            className="text-[clamp(2.8rem,8vw,5.5rem)] font-light tracking-tight leading-[0.95] max-w-3xl"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: "var(--site-ink, #fff)",
            }}
          >
            {siteName}
          </h1>
          <p
            className="mt-5 max-w-md text-sm sm:text-base leading-relaxed opacity-80"
            style={{ color: "var(--site-muted, #a1a1aa)" }}
          >
            {tagline}
          </p>
          <Link
            href={blogHref}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold border-b pb-1 transition-opacity hover:opacity-70"
            style={{
              borderColor: "var(--site-ink, #fff)",
              color: "var(--site-ink, #fff)",
            }}
          >
            {ctaText || "View collection"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Asymmetric gallery */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <h2
            className="text-xl sm:text-2xl font-light tracking-tight"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: "var(--site-ink)",
            }}
          >
            {sections?.featuredTitle || "Selected works"}
          </h2>
          <Link
            href={blogHref}
            className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
            style={{ color: "var(--site-ink)" }}
          >
            Archive
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {covers.map(({ post, src }, i) => {
            const spans = [
              "col-span-12 sm:col-span-7 aspect-[4/3]",
              "col-span-12 sm:col-span-5 aspect-[3/4]",
              "col-span-6 sm:col-span-4 aspect-square",
              "col-span-6 sm:col-span-4 aspect-square",
              "col-span-12 sm:col-span-4 aspect-[4/5]",
              "col-span-12 sm:col-span-8 aspect-[16/9]",
            ];
            return (
              <Link
                key={post.id}
                href={sitePostPath(siteSlug, String(post.slug || post.id))}
                className={`group relative overflow-hidden rounded-sm ${spans[i] || "col-span-6 aspect-square"}`}
              >
                {src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <p className="text-[10px] uppercase tracking-wider text-white/70 mb-0.5">
                    {postCategory(post) || "Work"}
                  </p>
                  <h3 className="text-sm font-medium text-white line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <p
          className="text-sm max-w-md mx-auto leading-relaxed mb-6"
          style={{ color: "var(--site-muted)" }}
        >
          {sections?.ctaBody ||
            "A curated collection of stories and frames from the field."}
        </p>
        <Link
          href={blogHref}
          className="inline-flex items-center gap-2 rounded-none border px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
          style={{
            borderColor: "var(--site-ink)",
            color: "var(--site-ink)",
            background: ctaBg || "transparent",
          }}
        >
          {sections?.ctaButton || ctaText || "Enter the studio"}
        </Link>
      </section>
    </main>
  );
}
