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
import {
  resolvePublicBranding,
  resolveHeaderLogo,
} from "@/lib/siteBranding";
import {
  siteEyebrow,
  siteTagline,
  siteHomeCaptions,
  siteHomeSections,
  hasPillarsSection,
  hasCtaSection,
  postCategory,
} from "@/lib/publicSiteCopy";
import PublicPostCard from "@/components/public/PublicPostCard";
import VerduraEditorialHero from "@/components/public/VerduraEditorialHero";
import { getDedicatedHomeRenderer } from "@/components/public/homeLayoutRegistry";
import { normalizeHomeLayoutProps } from "@/components/public/homeLayoutTypes";
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

/** Always re-read branding.homeStyle after Appearance → Use layout */
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
 * Public tenant home — routes by Appearance homeStyle.
 * Each style is a unique layout component (no duplicate designs).
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
  const tagline = siteTagline(site.name, branding);
  const eyebrow = siteEyebrow(branding, site.name);
  const blogHref = siteBlogPath(site.slug);
  const logo = resolveMediaUrl(
    resolveHeaderLogo(site.logo, branding)
  );

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

  const featured = posts.find((p) => p.featured) || posts[0] || null;
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

  const customHero = branding.home?.heroImage
    ? resolveMediaUrl(branding.home.heroImage) || branding.home.heroImage
    : null;

  const heroImage =
    customHero ||
    resolveMediaUrl(
      featured?.coverImage ||
        featured?.thumbnailUrl ||
        featured?.featured_image
    ) ||
    null;

  const captions = siteHomeCaptions(branding, site.name);
  const sections = siteHomeSections(site.name, branding);

  const shared = normalizeHomeLayoutProps({
    siteName: site.name,
    siteSlug: site.slug,
    eyebrow,
    tagline,
    heroImage,
    ctaText: branding.header?.ctaText,
    ctaBg: branding.header?.ctaBg,
    ctaColor: branding.header?.ctaColor,
    posts,
    sections,
  });

  const DedicatedHomeLayout = getDedicatedHomeRenderer(homeStyle);
  if (DedicatedHomeLayout) {
    return (
      <div data-theme={branding.themeId} data-home-style={homeStyle}>
        <DedicatedHomeLayout {...shared} />
      </div>
    );
  }

  // Classic (+ nature uses editorial hero inside)
  const pillarIcons = isNature
    ? [Leaf, TreePine, Camera]
    : [BookOpen, Sparkles, Globe2];
  const pillars = sections.pillars.slice(0, 6).map((p, i) => ({
    icon: pillarIcons[i % pillarIcons.length] || BookOpen,
    title: p.title,
    body: p.body,
  }));
  const isEditorialHome = homeStyle === "nature";
  const showPillars = hasPillarsSection(sections);
  const showCta = hasCtaSection(sections);
  const heroCtaLabel = branding.header?.ctaText?.trim() || "Blog";

  return (
    <main className="w-full" data-theme={branding.themeId} data-home-style={homeStyle} data-home-layout={homeStyle}>
      {isEditorialHome ? (
        <VerduraEditorialHero
          siteName={site.name}
          siteSlug={site.slug}
          eyebrow={eyebrow}
          tagline={tagline}
          heroImage={heroImage}
          ctaText={branding.header?.ctaText}
          ctaBg={branding.header?.ctaBg}
          ctaColor={branding.header?.ctaColor}
          categories={categories}
          featuredSlug={featured?.slug || null}
          captionLeft={captions.left || null}
          captionRight={captions.right || null}
        />
      ) : (
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
                  background:
                    "linear-gradient(145deg, var(--site-primary-soft) 0%, var(--site-bg) 55%, var(--site-surface) 100%)",
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
                    className="h-12 w-auto max-w-[140px] object-contain"
                  />
                ) : (
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                    style={{ background: "var(--site-primary)" }}
                  >
                    {site.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {eyebrow ? (
                  <p
                    className={cn(
                      "text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]",
                      heroImage ? "text-white/90" : ""
                    )}
                    style={
                      heroImage ? undefined : { color: "var(--site-primary)" }
                    }
                  >
                    {eyebrow}
                  </p>
                ) : null}
              </div>

              {/* Site name only when no logo wordmark (avoid double brand) */}
              {!logo && (
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
              )}

              {tagline ? (
                <p
                  className={cn(
                    "mt-5 text-base sm:text-lg leading-relaxed max-w-xl",
                    heroImage ? "text-white/85" : ""
                  )}
                  style={heroImage ? undefined : { color: "var(--site-muted)" }}
                >
                  {tagline}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={blogHref}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      branding.header?.ctaBg ||
                      "var(--site-cta-bg, var(--site-accent, var(--site-primary)))",
                    color:
                      branding.header?.ctaColor ||
                      "var(--site-cta-color, var(--site-surface, #fff))",
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  {heroCtaLabel}
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
                    {featured.title || "Featured"}
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
                      style={
                        heroImage ? undefined : { color: "var(--site-ink)" }
                      }
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 ? (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          {(sections.featuredEyebrow || sections.featuredTitle) && (
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                {sections.featuredEyebrow ? (
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ color: "var(--site-primary)" }}
                  >
                    {sections.featuredEyebrow}
                  </p>
                ) : null}
                {sections.featuredTitle ? (
                  <h2
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: "var(--site-ink)" }}
                  >
                    {sections.featuredTitle}
                  </h2>
                ) : null}
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
          )}

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
              {sections.sideRailLabel ? (
                <p
                  className="text-[11px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: "var(--site-muted)" }}
                >
                  {sections.sideRailLabel}
                </p>
              ) : null}
              {sideStories.map((post) => (
                <PublicPostCard
                  key={post.id}
                  post={post}
                  siteSlug={site.slug}
                  variant="horizontal"
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <EmptyState
            icon={BookOpen}
            title="No published posts yet"
            description={`Publish posts for ${site.name} to show them on the home page.`}
            actions={[
              { label: "Browse blog", href: blogHref, variant: "secondary" },
            ]}
          />
        </section>
      )}

      {showPillars && (
        <section
          id="features"
          className="scroll-mt-24 border-y border-black/5"
          style={{ background: "var(--site-surface)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
            {(sections.pillarsEyebrow ||
              sections.pillarsTitle ||
              sections.pillarsBody) && (
              <div className="max-w-2xl mb-10">
                {sections.pillarsEyebrow ? (
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: "var(--site-primary)" }}
                  >
                    {sections.pillarsEyebrow}
                  </p>
                ) : null}
                {sections.pillarsTitle ? (
                  <h2
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: "var(--site-ink)" }}
                  >
                    {sections.pillarsTitle}
                  </h2>
                ) : null}
                {sections.pillarsBody ? (
                  <p
                    className="mt-3 text-sm sm:text-base leading-relaxed"
                    style={{ color: "var(--site-muted)" }}
                  >
                    {sections.pillarsBody}
                  </p>
                ) : null}
              </div>
            )}
            {pillars.length > 0 && (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pillars.map(({ icon: Icon, title, body }, idx) => (
                  <li
                    key={`${title}-${idx}`}
                    className="rounded-2xl border border-black/5 bg-[var(--site-bg)] p-6 shadow-sm"
                  >
                    <div
                      className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                      style={{ background: "var(--site-primary)" }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {title ? (
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: "var(--site-ink)" }}
                      >
                        {title}
                      </h3>
                    ) : null}
                    {body ? (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--site-muted)" }}
                      >
                        {body}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {gridStories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          {(sections.latestEyebrow || sections.latestTitle) && (
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                {sections.latestEyebrow ? (
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ color: "var(--site-primary)" }}
                  >
                    {sections.latestEyebrow}
                  </p>
                ) : null}
                {sections.latestTitle ? (
                  <h2
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: "var(--site-ink)" }}
                  >
                    {sections.latestTitle}
                  </h2>
                ) : null}
              </div>
              <Link
                href={blogHref}
                className="text-sm font-bold inline-flex items-center gap-1 hover:underline"
                style={{ color: "var(--site-primary)" }}
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridStories.map((post) => (
              <li key={post.id}>
                <PublicPostCard post={post} siteSlug={site.slug} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {showCta && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-14 text-center shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--site-primary) 0%, var(--site-accent, var(--site-primary)) 100%)",
            }}
          >
            <div className="relative">
              {sections.ctaEyebrow ? (
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70 mb-3">
                  {sections.ctaEyebrow}
                </p>
              ) : null}
              {sections.ctaTitle ? (
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-xl mx-auto">
                  {sections.ctaTitle}
                </h2>
              ) : null}
              {sections.ctaBody ? (
                <p className="mt-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
                  {sections.ctaBody}
                </p>
              ) : null}
              {sections.ctaButton ? (
                <Link
                  href={blogHref}
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "var(--site-surface, #fff)",
                    color: "var(--site-primary)",
                  }}
                >
                  {sections.ctaButton}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
