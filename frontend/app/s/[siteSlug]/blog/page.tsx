import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import {
  isPublishedPost,
  resolvePublicSite,
  siteHomePath,
} from "@/lib/publicSite";
import { resolvePublicBranding } from "@/lib/siteBranding";
import { siteTagline } from "@/lib/publicSiteCopy";
import { resolveTenantLayout } from "@/lib/tenantLayout";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import PublicBlogGrid from "@/components/public/PublicBlogGrid";

interface Props {
  params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) return { title: "Blog | CoreHead" };
  const branding = resolvePublicBranding(site.branding);
  return {
    title: `Journal | ${site.name}`,
    description: siteTagline(site.name, branding),
  };
}

/**
 * Public blog archive — prefers published Blog Archive template for the site;
 * falls back to market-ready PublicBlogGrid.
 */
export default async function PublicSiteBlogPage({ params }: Props) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    notFound();
  }

  const branding = resolvePublicBranding(site.branding);

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

  // Published site template → PublicPageRenderer (Verdura layouts, etc.)
  if (layout.source === "template" && layout.blocks?.length) {
    return (
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <PublicPageRenderer
          layout={layout.document}
          data={{ posts, siteSlug: site.slug, site }}
          isLoop
          siteBasePath={siteHomePath(site.slug)}
        />
      </main>
    );
  }

  // Fallback magazine grid when no published template
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <PublicBlogGrid
        posts={posts}
        siteSlug={site.slug}
        siteName={site.name}
        title={
          branding.homeStyle === "nature" || branding.homeStyle === "bloom"
            ? `${site.name} Journal`
            : "All stories"
        }
        subtitle={siteTagline(site.name, branding)}
        showHomeLink
      />
    </main>
  );
}
