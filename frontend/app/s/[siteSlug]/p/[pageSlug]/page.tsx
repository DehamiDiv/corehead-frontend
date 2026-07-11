import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { resolvePublicSite, siteHomePath } from "@/lib/publicSite";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ siteSlug: string; pageSlug: string }>;
}

/**
 * R3-1: Public custom HTML page for a tenant site.
 * Route: /s/{siteSlug}/p/{pageSlug}
 */
export async function generateMetadata({ params }: Props) {
  const { siteSlug, pageSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) return { title: "Page not found | CoreHead" };

  try {
    const data = await api.getPublicPage(site.id, pageSlug);
    const page = data?.page;
    if (!page) return { title: `Page | ${site.name}` };
    return {
      title: `${page.name} | ${site.name}`,
      description: `${page.name} on ${site.name}`,
    };
  } catch {
    return { title: `Page | ${site.name}` };
  }
}

export default async function PublicCustomPage({ params }: Props) {
  const { siteSlug, pageSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) notFound();

  let page: any = null;
  try {
    const data = await api.getPublicPage(site.id, pageSlug);
    page = data?.page || null;
  } catch (err) {
    console.error("Public page fetch failed:", err);
  }

  if (!page) notFound();

  // Prefer body fragment if full document provided
  let html = String(page.htmlContent || "");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    html = bodyMatch[1];
  }
  // Strip script tags for safer public embed
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  return (
    <article className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Link
          href={siteHomePath(site.slug)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--site-primary,#2563eb)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {site.name}
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-black tracking-tight mb-8"
          style={{ color: "var(--site-ink, #0f172a)" }}
        >
          {page.name}
        </h1>

        <div
          className="prose prose-slate max-w-none public-custom-page"
          // Admin-authored HTML for this tenant page (scripts stripped)
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}
