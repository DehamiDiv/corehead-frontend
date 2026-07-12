import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import {
  isPublishedPost,
  resolvePublicSite,
} from "@/lib/publicSite";
import { resolvePublicBranding } from "@/lib/siteBranding";
import { siteTagline } from "@/lib/publicSiteCopy";
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
 * Public blog archive — market-ready magazine grid of published posts only.
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

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <PublicBlogGrid
        posts={posts}
        siteSlug={site.slug}
        siteName={site.name}
        title={
          site.slug === "verdura" || branding.homeStyle === "nature"
            ? `${site.name} Journal`
            : "All stories"
        }
        subtitle={siteTagline(site.name, branding)}
        showHomeLink
      />
    </main>
  );
}
