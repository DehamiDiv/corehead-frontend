import Link from "next/link";
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
  posts: PostLike[];
  sections?: HomeSectionCopy | null;
};

/** Layout — Paper: newspaper / broadsheet multi-column editorial. */
export default function PaperHomeLayout({
  siteName,
  siteSlug,
  eyebrow,
  tagline,
  heroImage,
  ctaText,
  posts,
  sections,
}: Props) {
  const blogHref = siteBlogPath(siteSlug);
  const lead = posts[0];
  const colA = posts.slice(1, 4);
  const colB = posts.slice(4, 7);
  const dateLine = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cover = (p?: PostLike | null) =>
    p
      ? resolveMediaUrl(p.coverImage || p.thumbnailUrl || p.featured_image)
      : null;

  return (
    <main
      className="w-full"
      data-home-layout="paper"
      style={{
        background: "var(--site-bg, #f7f4ef)",
        color: "var(--site-ink, #1c1917)",
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Masthead */}
        <header className="text-center border-b-2 border-double pb-4 mb-2"
          style={{ borderColor: "var(--site-ink)" }}
        >
          <p
            className="text-[10px] font-sans font-bold uppercase tracking-[0.35em] mb-2"
            style={{ color: "var(--site-muted)" }}
          >
            {eyebrow || ""}
          </p>
          <h1
            className="text-[clamp(2.5rem,8vw,4.5rem)] font-black tracking-tight leading-none"
            style={{ color: "var(--site-ink)" }}
          >
            {siteName}
          </h1>
          <p
            className="mt-2 text-sm italic max-w-lg mx-auto"
            style={{ color: "var(--site-muted)" }}
          >
            {tagline}
          </p>
        </header>

        <div
          className="flex flex-wrap items-center justify-between gap-2 py-2 mb-6 border-b text-[11px] font-sans uppercase tracking-wider"
          style={{
            borderColor: "color-mix(in srgb, var(--site-ink) 25%, transparent)",
            color: "var(--site-muted)",
          }}
        >
          <span>{dateLine}</span>
          <Link href={blogHref} className="font-bold hover:underline" style={{ color: "var(--site-primary)" }}>
            {ctaText || "Full edition"}
          </Link>
          <span>{sections?.featuredEyebrow || "Vol. 1"}</span>
        </div>

        {/* Lead story */}
        {lead && (
          <article className="grid md:grid-cols-5 gap-6 mb-10 pb-10 border-b"
            style={{ borderColor: "color-mix(in srgb, var(--site-ink) 20%, transparent)" }}
          >
            <div className="md:col-span-3 order-2 md:order-1">
              <p
                className="text-[11px] font-sans font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--site-primary)" }}
              >
                {postCategory(lead) || "Front page"}
              </p>
              <Link href={sitePostPath(siteSlug, String(lead.slug || lead.id))}>
                <h2
                  className="text-2xl sm:text-4xl font-black leading-[1.15] tracking-tight hover:opacity-80"
                  style={{ color: "var(--site-ink)" }}
                >
                  {lead.title}
                </h2>
              </Link>
              {lead.excerpt && (
                <p
                  className="mt-4 text-[15px] leading-[1.75] first-letter:text-3xl first-letter:font-bold first-letter:mr-1 first-letter:float-left"
                  style={{ color: "var(--site-muted)" }}
                >
                  {lead.excerpt}
                </p>
              )}
              <Link
                href={sitePostPath(siteSlug, String(lead.slug || lead.id))}
                className="inline-block mt-4 text-xs font-sans font-bold uppercase tracking-wider underline underline-offset-4"
                style={{ color: "var(--site-primary)" }}
              >
                Continue reading
              </Link>
            </div>
            <div className="md:col-span-2 order-1 md:order-2">
              {(cover(lead) || heroImage) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover(lead) || heroImage || "https://placehold.co/800x400?text=No+image"}
                  alt=""
                  className="w-full aspect-[4/3] object-cover border"
                  style={{ borderColor: "color-mix(in srgb, var(--site-ink) 15%, transparent)" }}
                />
              )}
            </div>
          </article>
        )}

        {/* Two columns of shorts */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {[colA, colB].map((col, ci) => (
            <div
              key={ci}
              className={ci === 0 ? "md:border-r md:pr-8" : ""}
              style={{
                borderColor: "color-mix(in srgb, var(--site-ink) 15%, transparent)",
              }}
            >
              <h3
                className="text-xs font-sans font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b"
                style={{
                  borderColor: "var(--site-ink)",
                  color: "var(--site-ink)",
                }}
              >
                {ci === 0
                  ? sections?.latestEyebrow || "Inside"
                  : sections?.pillarsEyebrow || "Also today"}
              </h3>
              <ul className="space-y-5">
                {col.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={sitePostPath(siteSlug, String(post.slug || post.id))}
                      className="group block"
                    >
                      <p
                        className="text-[10px] font-sans font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--site-primary)" }}
                      >
                        {postCategory(post) || "News"}
                      </p>
                      <h4
                        className="text-lg font-bold leading-snug group-hover:underline"
                        style={{ color: "var(--site-ink)" }}
                      >
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p
                          className="mt-1 text-sm leading-relaxed line-clamp-2"
                          style={{ color: "var(--site-muted)" }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                      {formatPostDate(post.publishedAt || post.createdAt) && (
                        <p
                          className="mt-1 text-[10px] font-sans"
                          style={{ color: "var(--site-muted)" }}
                        >
                          {formatPostDate(post.publishedAt || post.createdAt)}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer
          className="mt-12 pt-4 border-t text-center text-[10px] font-sans uppercase tracking-widest"
          style={{
            borderColor: "color-mix(in srgb, var(--site-ink) 25%, transparent)",
            color: "var(--site-muted)",
          }}
        >
          {sections?.ctaBody || `All the news that’s fit to print — ${siteName}`}
        </footer>
      </div>
    </main>
  );
}
