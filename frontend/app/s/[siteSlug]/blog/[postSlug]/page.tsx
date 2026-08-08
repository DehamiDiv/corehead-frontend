import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import {
  isPublishedPost,
  resolvePublicSite,
  siteBlogPath,
  siteHomePath,
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

interface Props {
  params: Promise<{ siteSlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteSlug, postSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) return { title: "Post not found | CoreHead" };

  try {
    const post = await api.getPostBySlug(postSlug, site.id);
    if (!post) return { title: `Post | ${site.name}` };
    return {
      title: `${post.title} | ${site.name}`,
      description: post.excerpt || `Read on ${site.name}`,
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
    categoryHint
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

  const layoutHasImage = rawBlocks.some((b: any) => {
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
    <article className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
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
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] mb-3"
                  style={{ color: "var(--site-primary)" }}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {category}
                </p>
              )}
              <h1
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight leading-[1.15]"
                style={{ color: "var(--site-ink)" }}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p
                  className="mt-4 text-base sm:text-lg leading-relaxed"
                  style={{ color: "var(--site-muted)" }}
                >
                  {post.excerpt}
                </p>
              )}
              <div
                className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium"
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
            </header>

            {coverSrc && !layoutHasImage && (
              <div className="relative w-full aspect-[16/9] mb-10 rounded-2xl overflow-hidden bg-black/5 border border-black/5 shadow-lg shadow-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverSrc}
                  alt={post.title || "Cover"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
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

        <div className="prose-public">
          <PublicPageRenderer
            layout={blocksForRender}
            data={bindData}
            siteBasePath={siteHomePath(site.slug)}
          />
        </div>

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
