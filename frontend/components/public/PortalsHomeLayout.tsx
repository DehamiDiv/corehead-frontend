import Link from "next/link";
import { ArrowRight, Layers, Shield, Sparkles, Zap } from "lucide-react";
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
 * Layout 7 — Portals-style dark 3D product landing.
 * Pure black canvas, left typography + dual CTAs, right floating
 * platforms / neon rings / metallic discs (CSS 3D, no Three.js).
 *
 * Visual reference: Portals DeFi / purple-neon product heroes.
 */
export default function PortalsHomeLayout({
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
  const rest = posts.slice(1, 3);
  const postImage = (post?: PostLike | null) =>
    post
      ? resolveMediaUrl(
          post.coverImage || post.thumbnailUrl || post.featured_image
        )
      : null;

  const pillars = (
    sections?.pillars?.length
      ? sections.pillars
      : [
          {
            title: "Clear expertise",
            body: `Present what ${siteName} does with a focused, credible message.`,
          },
          {
            title: "Useful insights",
            body: "Turn published knowledge into an accessible resource for visitors.",
          },
          {
            title: "Built for action",
            body: "Guide readers from discovery to the next meaningful step.",
          },
        ]
  ).slice(0, 3);

  const pillarIcons = [Zap, Layers, Shield];

  // Prefer Appearance layout palette (CSS vars) — portals pack defaults as fallbacks
  const primaryBg = ctaBg || "var(--site-cta-bg, #ffffff)";
  const primaryFg = ctaColor || "var(--site-cta-color, #0a0a0a)";
  const accent =
    "var(--site-accent, var(--site-primary, #7c3aed))";
  const ink = "var(--site-ink, #fafafa)";
  const muted = "var(--site-muted, #a1a1aa)";

  // Headline: Appearance heroTitle → ctaTitle → default
  const headline =
    sections?.heroTitle?.trim() ||
    `${siteName}\nIdeas, work and\nindustry insight`;
  const headlineLines = headline.split("\n");
  const ctaBgImage = sections?.ctaBackgroundImage
    ? resolveMediaUrl(sections.ctaBackgroundImage)
    : null;

  return (
    <main
      className="w-full overflow-hidden relative"
      data-home-layout="portals"
      style={{
        background: "var(--site-bg, #000000)",
        color: ink,
        fontFamily: 'var(--site-font), Inter, "DM Sans", system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes portals-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes portals-bob-alt {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes portals-pulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        .p-bob { animation: portals-bob 5.5s ease-in-out infinite; }
        .p-bob-d1 { animation: portals-bob 6s ease-in-out infinite; animation-delay: 0.5s; }
        .p-bob-d2 { animation: portals-bob-alt 4.8s ease-in-out infinite; animation-delay: 0.2s; }
        .p-bob-d3 { animation: portals-bob 7s ease-in-out infinite; animation-delay: 1s; }
        .p-pulse { animation: portals-pulse 3s ease-in-out infinite; }
      `}</style>

      {/* Ambient accent wash (right side) — follows layout primary */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute top-0 right-0 w-[75%] h-full"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 75% 45%, color-mix(in srgb, var(--site-primary, #7c3aed) 22%, transparent), transparent 60%)",
          }}
        />
      </div>

      {/* ── Full-bleed hero ──────────────────────────────────── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* LEFT — Portals copy block */}
          <div className="relative z-10 max-w-lg">
            {eyebrow ? (
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5"
                style={{ color: "color-mix(in srgb, var(--site-primary, #7c3aed) 80%, white)" }}
              >
                {eyebrow}
              </p>
            ) : null}

            <h1
              className="text-[clamp(2.5rem,5.8vw,3.85rem)] font-semibold tracking-[-0.03em] leading-[1.05]"
              style={{ color: ink }}
            >
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              className="mt-6 text-[15px] sm:text-[16px] leading-[1.65] max-w-[26rem]"
              style={{ color: muted }}
            >
              {tagline || `Explore the latest thinking, practical guidance and published work from ${siteName}.`}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={blogHref}
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[14px] font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: primaryBg, color: primaryFg }}
              >
                {ctaText || "Get started"}
              </Link>
              <Link
                href={
                  featured?.slug
                    ? sitePostPath(siteSlug, String(featured.slug))
                    : blogHref
                }
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: accent,
                  color: "var(--site-surface, #ffffff)",
                }}
              >
                {featured?.title || "Featured insight"}
              </Link>
            </div>
          </div>

          {/* RIGHT — 3D stage (platforms, rings, coins) */}
          <div
            className="relative h-[360px] sm:h-[440px] lg:h-[520px] -mr-2"
            style={{ perspective: "1000px" }}
            aria-hidden
          >
            {/* Upper-left pixel platform + coin */}
            <div className="absolute left-[-2%] top-[2%] w-[52%] aspect-[1/1] p-bob-d1">
              <div
                className="absolute inset-0"
                style={{
                  transform: "rotateX(58deg) rotateZ(-22deg)",
                  borderRadius: "32%",
                  background: `
                    linear-gradient(160deg, #1c1c22 0%, #0d0d10 100%),
                    radial-gradient(circle, #2a2a32 1px, transparent 1px)
                  `,
                  backgroundSize: "100% 100%, 9px 9px",
                  boxShadow:
                    "0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              />
              {/* Standing coin */}
              <div
                className="absolute left-[30%] top-[8%] w-[34%] aspect-square rounded-full p-bob"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #5a5a64, #222228 45%, #0c0c0e 75%)",
                  boxShadow:
                    "0 18px 36px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute inset-[18%] rounded-full"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background:
                      "radial-gradient(circle at 40% 35%, transparent 40%, rgba(0,0,0,0.35))",
                  }}
                />
              </div>
            </div>

            {/* Floating coin mid-top */}
            <div
              className="absolute right-[22%] top-[0%] w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full p-bob-d3"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, #6b6b75, #1a1a1f 50%, #08080a)",
                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.55), inset 0 2px 6px rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />

            {/* Center neon disc (main focus) */}
            <div className="absolute right-[0%] top-[22%] w-[62%] aspect-square p-bob">
              {/* Outer soft glow */}
              <div
                className="absolute inset-[-8%] rounded-full p-pulse"
                style={{
                  transform: "rotateX(60deg)",
                  background:
                    "radial-gradient(circle, rgba(168,85,247,0.35), transparent 65%)",
                  filter: "blur(8px)",
                }}
              />
              {/* Neon ring */}
              <div
                className="absolute inset-[2%] rounded-full"
                style={{
                  transform: "rotateX(60deg)",
                  border: "3px solid rgba(192,132,252,0.9)",
                  boxShadow:
                    "0 0 40px rgba(168,85,247,0.7), 0 0 80px rgba(124,58,237,0.35), inset 0 0 30px rgba(168,85,247,0.25)",
                }}
              />
              {/* Surface */}
              <div
                className="absolute inset-[10%] rounded-full overflow-hidden"
                style={{
                  transform: "rotateX(60deg)",
                  background: heroImage
                    ? "#12081f"
                    : "radial-gradient(circle at 42% 32%, #3b0764, #0c0614 65%)",
                  boxShadow:
                    "0 30px 50px rgba(0,0,0,0.55), inset 0 0 50px rgba(168,85,247,0.2)",
                  border: "1px solid rgba(216,180,254,0.35)",
                }}
              >
                {heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-75"
                    style={{ transform: "scale(1.4)" }}
                  />
                ) : (
                  <div
                    className="absolute inset-[16%] rounded-[42%] p-pulse"
                    style={{
                      background:
                        "radial-gradient(circle at 40% 35%, rgba(245,243,255,0.95) 0%, rgba(192,132,252,0.55) 38%, transparent 68%)",
                      filter: "blur(2px)",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Lower stacked neon rings */}
            <div className="absolute right-[12%] bottom-[2%] w-[48%] aspect-square p-bob-d2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: `${92 - i * 22}%`,
                    height: `${92 - i * 22}%`,
                    marginLeft: `${-(46 - i * 11)}%`,
                    marginTop: `${-(46 - i * 11) + i * 14}%`,
                    transform: "rotateX(70deg)",
                    border: `${2.5}px solid rgba(${200 - i * 25}, ${140 - i * 15}, 252, ${0.9 - i * 0.18})`,
                    boxShadow: `0 0 ${36 - i * 8}px rgba(168,85,247,${0.5 - i * 0.12})`,
                  }}
                />
              ))}
            </div>

            {/* Tiny path dots suggestion */}
            <div
              className="absolute left-[48%] top-[18%] w-1.5 h-1.5 rounded-full bg-violet-400/40"
              style={{ boxShadow: "0 0 12px rgba(167,139,250,0.6)" }}
            />
            <div
              className="absolute left-[55%] top-[28%] w-1 h-1 rounded-full bg-violet-300/30"
            />
          </div>
        </div>
      </section>

      {/* ── Feature row ──────────────────────────────────────── */}
      <section
        id="features"
        className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 pb-16"
      >
        <div className="grid sm:grid-cols-3 gap-4">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i] || Sparkles;
            return (
              <div
                key={p.title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-6"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "color-mix(in srgb, var(--site-primary, #7c3aed) 18%, transparent)",
                    color: "var(--site-primary, #7c3aed)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-semibold mb-2" style={{ color: ink }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Stories ──────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "var(--site-primary, #7c3aed)" }}
              >
                {sections?.featuredEyebrow || "Insights"}
              </p>
              <h2
                className="text-2xl sm:text-3xl font-semibold tracking-tight"
                style={{ color: ink }}
              >
                {sections?.featuredTitle || "Latest insights"}
              </h2>
            </div>
            <Link
              href={blogHref}
              className="text-sm font-semibold inline-flex items-center gap-1 opacity-90 hover:opacity-100"
              style={{ color: "var(--site-primary, #7c3aed)" }}
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={sitePostPath(siteSlug, String(post.slug || post.id))}
                className="group rounded-2xl overflow-hidden border border-white/[0.07] bg-zinc-950 hover:border-violet-500/25 transition-colors"
              >
                <div className="aspect-[16/10] relative bg-zinc-900 overflow-hidden">
                  {postImage(post) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={postImage(post) || ""}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at top right, color-mix(in srgb, var(--site-primary) 35%, transparent), transparent 65%)",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-5">
                  {postCategory(post) && (
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--site-primary, #7c3aed)" }}
                    >
                      {postCategory(post)}
                    </p>
                  )}
                  <h3
                    className="font-semibold text-[15px] leading-snug line-clamp-2"
                    style={{ color: ink }}
                  >
                    {post.title}
                  </h3>
                  {formatPostDate(post.publishedAt || post.createdAt) && (
                    <p className="mt-2 text-[11px]" style={{ color: muted }}>
                      {formatPostDate(post.publishedAt || post.createdAt)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div
          className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] px-6 sm:px-12 py-12 text-center"
          style={{
            background: "color-mix(in srgb, var(--site-bg, #000) 88%, #111)",
          }}
        >
          {ctaBgImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ctaBgImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-36 w-72 rounded-full blur-3xl opacity-50"
              style={{
                background:
                  "color-mix(in srgb, var(--site-primary, #7c3aed) 40%, transparent)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "var(--site-primary, #7c3aed)" }}
            >
              {sections?.ctaEyebrow || "Get started"}
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold max-w-md mx-auto leading-tight"
              style={{ color: ink }}
            >
              {sections?.ctaTitle && !sections.ctaTitle.includes("\n")
                ? sections.ctaTitle
                : `Discover more from ${siteName}`}
            </h2>
            <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: muted }}>
              {sections?.ctaBody ||
                "Explore the complete archive of published stories and practical insights."}
            </p>
            <Link
              href={blogHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: primaryBg, color: primaryFg }}
            >
              {sections?.ctaButton || ctaText || "Get started"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
