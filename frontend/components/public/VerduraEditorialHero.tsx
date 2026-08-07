import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { siteBlogPath, sitePostPath } from "@/lib/publicSite";

type Props = {
  siteName: string;
  siteSlug: string;
  eyebrow: string;
  tagline: string;
  heroImage: string | null;
  ctaText?: string | null;
  ctaBg?: string | null;
  ctaColor?: string | null;
  categories: string[];
  featuredSlug?: string | null;
  captionLeft?: string | null;
  captionRight?: string | null;
};

/**
 * Editorial magazine hero — colours from Appearance CSS vars
 * (--site-bg, --site-primary, --site-cta-*, --site-font).
 */
export default function VerduraEditorialHero({
  siteName,
  siteSlug,
  eyebrow,
  tagline,
  heroImage,
  ctaText,
  ctaBg,
  ctaColor,
  categories,
  featuredSlug,
  captionLeft,
  captionRight,
}: Props) {
  const blogHref = siteBlogPath(siteSlug);
  // Appearance captions only — no hard-coded demo lines
  const leftLines = captionLeft?.trim()
    ? captionLeft.trim().split("\n")
    : [];
  const rightLines = captionRight?.trim()
    ? captionRight.trim().split("\n")
    : [];

  return (
    <section
      className="relative overflow-hidden py-8 sm:py-12"
      style={{ background: "var(--site-bg)" }}
    >
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
          style={{
            background: "var(--site-primary)",
            boxShadow: "0 25px 80px color-mix(in srgb, var(--site-primary) 35%, transparent)",
          }}
        >
          <div className="px-5 sm:px-10 pt-12 sm:pt-16 pb-2 sm:pb-3 text-center">
            <p
              className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.4em] mb-6 sm:mb-8"
              style={{ color: "color-mix(in srgb, var(--site-cta-bg, #f5f0e6) 55%, transparent)" }}
            >
              {eyebrow}
            </p>
            <h1
              className="leading-[0.9] text-[clamp(3rem,12vw,6.25rem)] select-none"
              style={{
                color: "var(--site-cta-bg, var(--site-surface, #f5f0e6))",
                fontFamily: "var(--site-font), Georgia, serif",
                fontWeight: 400,
                letterSpacing: "0.14em",
              }}
            >
              {siteName.toUpperCase()}
            </h1>
          </div>

          <div className="px-5 sm:px-10 pt-4 sm:pt-6 pb-5 sm:pb-8">
            <div
              className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[21/10] ring-1 ring-black/15 flex items-center justify-center"
              style={{ background: "var(--site-surface, var(--site-cta-bg, #f5f0e6))" }}
            >
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt={`${siteName} illustration`}
                  className="relative z-[1] h-[78%] w-auto max-w-[88%] object-contain drop-shadow-sm"
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--site-primary-soft), var(--site-accent, var(--site-primary)))",
                  }}
                />
              )}

              <div
                className="absolute bottom-0 inset-x-0 z-[2] flex items-end justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--site-primary)" }}
              >
                <span className="max-w-[48%] leading-[1.6] opacity-80">
                  {leftLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </span>
                <span className="text-right leading-[1.6] opacity-70">
                  {rightLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-10 sm:pb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p
              className="text-sm sm:text-[15px] leading-relaxed max-w-md"
              style={{
                color: "color-mix(in srgb, var(--site-cta-bg, #f5f0e6) 80%, transparent)",
                fontFamily: "var(--site-font), Georgia, serif",
              }}
            >
              {tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href={blogHref}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{
                  background: ctaBg || "var(--site-cta-bg, var(--site-surface))",
                  color: ctaColor || "var(--site-cta-color, var(--site-primary))",
                }}
              >
                <BookOpen className="h-4 w-4" />
                {ctaText || "Blog"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {featuredSlug ? (
                <Link
                  href={sitePostPath(siteSlug, featuredSlug)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border hover:bg-white/10 transition-colors"
                  style={{
                    borderColor: "color-mix(in srgb, var(--site-cta-bg, #fff) 30%, transparent)",
                    color: "var(--site-cta-bg, var(--site-surface))",
                  }}
                >
                  Featured story
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              ) : null}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="px-6 sm:px-10 pb-10">
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={blogHref}
                    className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold border hover:bg-white/10 transition-colors"
                    style={{
                      borderColor: "color-mix(in srgb, var(--site-cta-bg, #fff) 20%, transparent)",
                      color: "color-mix(in srgb, var(--site-cta-bg, #fff) 85%, transparent)",
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
