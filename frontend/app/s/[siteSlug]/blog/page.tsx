import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import {
  isPublishedPost,
  resolvePublicSite,
  siteHomePath,
} from "@/lib/publicSite";
import { BookOpen } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import { resolveTenantLayout } from "@/lib/tenantLayout";

interface Props {
  params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) return { title: "Blog | CoreHead" };
  return {
    title: `Blog | ${site.name}`,
    description: `Latest posts from ${site.name}`,
  };
}

/**
 * R2-1: Public blog list — uses published Blog Archive template for this site
 * when available; otherwise default collection layout.
 */
export default async function PublicSiteBlogPage({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    notFound();
  }

  let posts: any[] = [];
  try {
    const postsData = await api.getPreviewPosts(100, site.id);
    const raw = Array.isArray(postsData?.posts)
      ? postsData.posts
      : Array.isArray(postsData)
        ? postsData
        : [];
    posts = raw.filter(isPublishedPost);
  } catch (err) {
    console.error(`Failed to load posts for site ${site.slug}:`, err);
  }

  const layout = await resolveTenantLayout("blog-archive", site.id);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {layout.source === "template" && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Layout: {layout.templateName || "Published template"}
        </p>
      )}

      {posts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No published posts yet"
          description={`${site.name} hasn’t published any articles yet. Check back soon for new stories and updates.`}
        />
      ) : (
        <PublicPageRenderer
          layout={layout.blocks}
          data={{ posts, siteSlug: site.slug, site }}
          isLoop
          siteBasePath={siteHomePath(site.slug)}
        />
      )}
    </main>
  );
}
