import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import {
  isPublishedPost,
  resolvePublicSite,
  siteBlogPath,
  siteHomePath,
  sitePostPath,
} from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import {
  formatPostDate,
  postCategory,
  readingTimeMinutes,
} from "@/lib/publicSiteCopy";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import { postToBindData, resolveTenantLayout } from "@/lib/tenantLayout";
import CommentsSection from "@/components/blog/CommentsSection";
import PostReactions from "@/components/blog/PostReactions";
import PostShareButtons from "@/components/blog/PostShareButtons";

interface Props {
  params: Promise<{ siteSlug: string; postSlug: string }>;
}

function absolutePublicUrl(path: string) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return new URL(path, `${origin}/`).toString();
}

function safeCanonicalUrl(candidate: unknown, fallbackPath: string) {
  if (typeof candidate === "string" && candidate.trim()) {
    try {
      const parsed = new URL(candidate.trim());
      if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
    } catch {
      // Use the tenant route when an editor saved an invalid canonical value.
    }
  }
  return absolutePublicUrl(fallbackPath);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug, postSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) return { title: "Post not found | CoreHead" };

  try {
    const post = await api.getPostBySlug(postSlug, site.id);
    if (!post || !isPublishedPost(post)) {
      return { title: `Post | ${site.name}`, robots: { index: false, follow: false } };
    }
    const title = post.metaTitle || post.meta_title || post.title;
    const description =
      post.metaDescription || post.meta_description || post.excerpt || `Read on ${site.name}`;
    const canonical = safeCanonicalUrl(
      post.canonicalUrl,
      sitePostPath(site.slug, post.slug || postSlug),
    );
    const rawImage = resolveMediaUrl(
      post.coverImage || post.thumbnailUrl || post.featured_image || null,
    );
    const image =
      rawImage && !rawImage.startsWith("data:")
        ? rawImage.startsWith("http")
          ? rawImage
          : absolutePublicUrl(rawImage)
        : null;
    const author = post.author?.name || post.authorName || site.name;
    return {
      title: `${title} | ${site.name}`,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "article",
        url: canonical,
        siteName: site.name,
        title,
        description,
        publishedTime: post.publishedAt || post.published_date || undefined,
        authors: [author],
        images: image ? [{ url: image, alt: post.title }] : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: `Post | ${site.name}` };
  }
}

/**
 * R2-1: Public single post — uses published Single Post template when available.
 * Template owns full article chrome; default layout uses market meta header.
 */
export default async function PublicSitePostPage({ params }: Props) {
  const { siteSlug, postSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    notFound();
  }

  let post: any = null;
  try {
    post = await api.getPostBySlug(postSlug, site.id);
  } catch (err) {
    console.error("Failed to fetch public post:", err);
  }

  if (!post || !isPublishedPost(post)) {
    notFound();
  }

  if (post.siteId != null && Number(post.siteId) !== Number(site.id)) {
    notFound();
  }

  const categoryHint =
    typeof post.category === "string" ? post.category : null;

  const layout = await resolveTenantLayout(
    "single-post",
    site.id,
    categoryHint,
    post.layoutTemplateId ?? null,
  );

  const bindData = postToBindData(post, site.slug);
  const coverSrc =
    resolveMediaUrl(
      post.coverImage ||
        post.thumbnailUrl ||
        post.featured_image ||
        bindData.post?.coverImage ||
        null,
    ) || null;

  if (coverSrc) {
    bindData.post.coverImage = coverSrc;
    bindData.post.featured_image = coverSrc;
    bindData.post.thumbnailUrl = coverSrc;
    bindData.post.imageUrl = coverSrc;
  }

  const useTemplateChrome = layout.source === "template";
  const rawBlocks = layout.blocks || [];

  // Default layout: market chrome already shows title/meta/cover — body only.
  const blocksForRender = useTemplateChrome
    ? rawBlocks
    : rawBlocks.filter((b: any) => {
        const t = String(b?.type || "").toLowerCase();
        const bind = String(b?.bindings?.content || "");
        if (t === "image" || bind.includes("coverImage") || bind.includes("featured_image")) {
          return false;
        }
        if (bind.includes("post.title") || bind === "title") return false;
        if (bind.includes("category")) return false;
        if (bind.includes("excerpt")) return false;
        return true;
      });

  const renderedLayoutHasImage = blocksForRender.some((b: any) => {
    const t = String(b?.type || "").toLowerCase();
    return t === "image" || t.includes("image");
  });

  const category = postCategory(post);
  const dateLabel = formatPostDate(
    post.publishedAt || post.published_date || post.createdAt
  );
  const minutes = readingTimeMinutes(post.content || post.excerpt);
  const authorName =
    post.author?.name || post.authorName || site.name;

  return (
    <article className="w-full" aria-labelledby="public-post-title">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <Link
          href={siteBlogPath(site.slug)}
          className="inline-flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-[var(--site-primary,#2563eb)] transition-colors mb-8"
          style={{ color: "var(--site-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to journal
        </Link>

        {/* Market chrome only when no published Single Post template */}
        {!useTemplateChrome && (
          <>
            <header className="mb-8">
              {category && (
                <p
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] mb-3 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {category}
                </p>
              )}
              <h1
                id="public-post-title"
                className="mb-4 text-3xl font-black leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]"
                style={{ color: "var(--site-ink)" }}
              >
                {post.title}
              </h1>

              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium pb-4 border-b border-black/5 mb-6"
                style={{ color: "var(--site-muted)" }}
              >
                <span className="font-bold flex items-center gap-2" style={{ color: "var(--site-ink)" }}>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  {authorName}
                </span>
                {dateLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {dateLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {minutes} min read
                </span>
              </div>

              {post.excerpt && (
                <p
                  className="text-base sm:text-lg leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1 mb-6"
                  style={{ color: "var(--site-muted)" }}
                >
                  {post.excerpt}
                </p>
              )}
            </header>

            {coverSrc && !renderedLayoutHasImage && (
              <figure className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/5 bg-black/5 shadow-xl shadow-black/10 sm:rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverSrc}
                  alt={post.title || "Cover"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </figure>
            )}
          </>
        )}

        {/* Author line when template handles title but not meta */}
        {useTemplateChrome && (
          <div
            className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium"
            style={{ color: "var(--site-muted)" }}
          >
            <span className="font-semibold" style={{ color: "var(--site-ink)" }}>
              {authorName}
            </span>
            {dateLabel && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min read
            </span>
          </div>
        )}

        <div className="prose-public post-reading-surface" data-layout-source={layout.source}>
          <PublicPageRenderer
            layout={useTemplateChrome
              ? { ...layout.document, blocks: blocksForRender }
              : blocksForRender}
            data={bindData}
            siteBasePath={siteHomePath(site.slug)}
          />
        </div>

        <PostShareButtons
          title={post.title}
          excerpt={post.excerpt}
          sharePath={sitePostPath(site.slug, post.slug)}
        />

        <div className="mt-12 pt-8 border-t border-black/5 space-y-8">
          <PostReactions postId={post.id} siteId={site.id} />
          <CommentsSection
            postId={post.id}
            siteId={site.id}
            allowComments={post.allowComments !== false}
          />
        </div>
      </div>
    </article>
  );
}
