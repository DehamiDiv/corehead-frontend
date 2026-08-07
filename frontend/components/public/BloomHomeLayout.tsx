import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Leaf,
  MessageCircle,
  Shield,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
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

/**
 * Wellness home layout — all colours from Appearance CSS vars.
 */
export default function BloomHomeLayout({
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

  const serviceMeta = [
    { icon: Heart },
    { icon: Users },
    { icon: MessageCircle },
    { icon: Sun },
  ];
  // Appearance pillars only — no hard-coded demo services
  const services = (sections?.pillars || []).slice(0, 4).map((p, i) => ({
    icon: serviceMeta[i]?.icon || Heart,
    title: p.title,
    body: p.body,
  }));
  const showPillars =
    services.length > 0 ||
    Boolean(sections?.pillarsEyebrow) ||
    Boolean(sections?.pillarsTitle) ||
    Boolean(sections?.pillarsBody);
  const showCta =
    Boolean(sections?.ctaEyebrow) ||
    Boolean(sections?.ctaTitle) ||
    Boolean(sections?.ctaBody) ||
    Boolean(sections?.ctaButton);

  const btnBg = ctaBg || "var(--site-cta-bg, var(--site-primary))";
  const btnFg = ctaColor || "var(--site-cta-color, var(--site-surface, #fff))";

  return (
    <main
      className="w-full overflow-hidden"
      style={{
        background: "var(--site-bg)",
        color: "var(--site-ink)",
        fontFamily: "var(--site-font), system-ui, sans-serif",
      }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-24 -right-16 h-80 w-80 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--site-primary-soft)" }}
        />
        <div
          className="absolute top-1/3 -left-20 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--site-accent, var(--site-primary-soft))" }}
        />
      </div>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            {(sections?.heroTitle || eyebrow) ? (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm border"
                style={{
                  background: "var(--site-surface)",
                  borderColor:
                    "color-mix(in srgb, var(--site-primary) 20%, transparent)",
                  color: "var(--site-primary)",
                }}
              >
                <Leaf className="w-3.5 h-3.5" />
                {sections?.heroTitle || eyebrow}
              </span>
            ) : null}
            <h1
              className="mt-6 text-[clamp(2.4rem,5.5vw,3.75rem)] leading-[1.08] font-semibold tracking-tight"
              style={{
                color: "var(--site-ink)",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {siteName}
            </h1>
            {tagline ? (
              <p
                className="mt-5 text-base sm:text-lg leading-relaxed max-w-md"
                style={{ color: "var(--site-muted)" }}
              >
                {tagline}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={blogHref}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: btnBg, color: btnFg }}
              >
                {ctaText || "Blog"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {featured?.slug ? (
                <Link
                  href={sitePostPath(siteSlug, String(featured.slug))}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold border transition-colors"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--site-primary) 25%, transparent)",
                    background: "var(--site-surface)",
                    color: "var(--site-ink)",
                  }}
                >
                  {featured.title || "Featured"}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[2rem] blur-xl opacity-40"
              style={{ background: "var(--site-primary-soft)" }}
            />
            <div
              className="relative rounded-[1.75rem] overflow-hidden shadow-xl border"
              style={{
                background: "var(--site-surface)",
                borderColor: "var(--site-surface)",
              }}
            >
              <div
                className="aspect-[4/5] sm:aspect-[5/5] relative"
                style={{ background: "var(--site-primary-soft)" }}
              >
                {heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="h-40 w-40 rounded-full blur-2xl opacity-60"
                      style={{ background: "var(--site-primary-soft)" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPillars && (
      <section id="features" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {(sections?.pillarsEyebrow || sections?.pillarsTitle || sections?.pillarsBody) && (
        <div className="text-center max-w-xl mx-auto mb-10">
          {sections?.pillarsEyebrow ? (
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: "var(--site-primary)" }}
          >
            {sections.pillarsEyebrow}
          </p>
          ) : null}
          {sections?.pillarsTitle ? (
          <h2
            className="text-2xl sm:text-3xl font-semibold"
            style={{
              color: "var(--site-ink)",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            {sections.pillarsTitle}
          </h2>
          ) : null}
          {sections?.pillarsBody ? (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
              {sections.pillarsBody}
            </p>
          ) : null}
        </div>
        )}
        {services.length > 0 && (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(({ icon: Icon, title, body }, idx) => (
            <li
              key={`${title}-${idx}`}
              className="rounded-[1.35rem] border p-6 shadow-sm hover:-translate-y-0.5 transition-transform"
              style={{
                background: "var(--site-surface)",
                borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
              }}
            >
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--site-primary-soft)", color: "var(--site-primary)" }}
              >
                <Icon className="w-5 h-5" />
              </div>
              {title ? (
              <h3 className="font-bold mb-2" style={{ color: "var(--site-ink)" }}>
                {title}
              </h3>
              ) : null}
              {body ? (
              <p className="text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                {body}
              </p>
              ) : null}
            </li>
          ))}
        </ul>
        )}
      </section>
      )}

      {posts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          {(sections?.featuredEyebrow || sections?.featuredTitle) && (
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              {sections?.featuredEyebrow ? (
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "var(--site-primary)" }}
              >
                {sections.featuredEyebrow}
              </p>
              ) : null}
              {sections?.featuredTitle ? (
              <h2
                className="text-2xl sm:text-3xl font-semibold"
                style={{
                  color: "var(--site-ink)",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                {sections.featuredTitle}
              </h2>
              ) : null}
            </div>
            <Link
              href={blogHref}
              className="text-sm font-bold hover:underline inline-flex items-center gap-1"
              style={{ color: "var(--site-primary)" }}
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          )}

          <div className="grid lg:grid-cols-5 gap-5">
            {featured && (
              <Link
                href={sitePostPath(siteSlug, String(featured.slug || featured.id))}
                className="lg:col-span-3 group rounded-[1.75rem] overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                style={{
                  background: "var(--site-surface)",
                  borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
                }}
              >
                <div
                  className="aspect-[16/10] relative overflow-hidden"
                  style={{ background: "var(--site-primary-soft)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      resolveMediaUrl(
                        featured.coverImage ||
                          featured.thumbnailUrl ||
                          featured.featured_image
                      ) || ""
                    }
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  {postCategory(featured) && (
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: "var(--site-primary)" }}
                    >
                      {postCategory(featured)}
                    </p>
                  )}
                  <h3
                    className="text-xl sm:text-2xl font-semibold leading-snug transition-colors"
                    style={{ color: "var(--site-ink)" }}
                  >
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p
                      className="mt-3 text-sm line-clamp-2 leading-relaxed"
                      style={{ color: "var(--site-muted)" }}
                    >
                      {featured.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={sitePostPath(siteSlug, String(post.slug || post.id))}
                  className="group flex gap-4 rounded-2xl border p-3 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    background: "var(--site-surface)",
                    borderColor: "color-mix(in srgb, var(--site-ink) 8%, transparent)",
                  }}
                >
                  <div
                    className="relative h-24 w-28 shrink-0 rounded-xl overflow-hidden"
                    style={{ background: "var(--site-primary-soft)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        resolveMediaUrl(
                          post.coverImage || post.thumbnailUrl || post.featured_image
                        ) || ""
                      }
                      alt=""
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center py-1">
                    {postCategory(post) && (
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--site-primary)" }}
                      >
                        {postCategory(post)}
                      </p>
                    )}
                    <h3
                      className="font-bold text-sm line-clamp-2 leading-snug"
                      style={{ color: "var(--site-ink)" }}
                    >
                      {post.title}
                    </h3>
                    {formatPostDate(post.publishedAt || post.createdAt) && (
                      <p className="mt-1.5 text-[11px]" style={{ color: "var(--site-muted)" }}>
                        {formatPostDate(post.publishedAt || post.createdAt)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showCta && (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div
          className="relative overflow-hidden rounded-[2rem] px-6 sm:px-12 py-12 sm:py-14 text-center border"
          style={{
            background:
              "linear-gradient(135deg, var(--site-primary-soft), var(--site-bg), color-mix(in srgb, var(--site-accent) 15%, var(--site-bg)))",
            borderColor: "color-mix(in srgb, var(--site-primary) 15%, transparent)",
          }}
        >
          <div className="relative">
            {sections?.ctaEyebrow ? (
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "var(--site-primary)" }}
            >
              {sections.ctaEyebrow}
            </p>
            ) : null}
            {sections?.ctaTitle ? (
            <h2
              className="text-2xl sm:text-4xl font-semibold max-w-lg mx-auto leading-tight"
              style={{
                color: "var(--site-ink)",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {sections.ctaTitle}
            </h2>
            ) : null}
            {sections?.ctaBody ? (
            <p
              className="mt-4 text-sm sm:text-base max-w-md mx-auto leading-relaxed"
              style={{ color: "var(--site-muted)" }}
            >
              {sections.ctaBody}
            </p>
            ) : null}
            {sections?.ctaButton ? (
            <Link
              href={blogHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              style={{ background: btnBg, color: btnFg }}
            >
              {sections.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </Link>
            ) : null}
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
