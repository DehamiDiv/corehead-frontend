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
import { ArrowLeft } from "lucide-react";
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
  // Absolute cover URL for bindings + guaranteed hero below
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

  // If published layout has no Image block, still show cover (common demo pain)
  const layoutHasImage = (layout.blocks || []).some((b: any) => {
    const t = String(b?.type || "").toLowerCase();
    return t === "image" || t.includes("image");
  });

  return (
    <article className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Link
          href={siteBlogPath(site.slug)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--site-primary,#2563eb)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {site.name} blog
        </Link>

        {layout.source === "template" && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Layout: {layout.templateName || "Published template"}
          </p>
        )}

        {/* Always show featured image when layout template omits an Image block */}
        {coverSrc && !layoutHasImage && (
          <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden bg-slate-100 border border-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverSrc}
              alt={post.title || "Cover"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <PublicPageRenderer
          layout={layout.blocks}
          data={bindData}
          siteBasePath={siteHomePath(site.slug)}
        />

        {/* Reactions + comments on published posts */}
        <div className="mt-12 pt-8 border-t border-slate-100 space-y-8">
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
