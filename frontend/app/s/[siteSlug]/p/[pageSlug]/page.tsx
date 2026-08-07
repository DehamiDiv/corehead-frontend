import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { resolvePublicSite, siteHomePath, siteBlogPath } from "@/lib/publicSite";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  const slug = String(pageSlug || "")
    .trim()
    .replace(/^\//, "")
    .toLowerCase();

  try {
    const data = await api.getPublicPage(site.id, slug);
    const page = data?.page ?? (data?.name ? data : null);
    if (!page) return { title: `Page | ${site.name}` };
    return {
      title: `${page.name} | ${site.name}`,
      description: `${page.name} — ${site.name}`,
    };
  } catch {
    return { title: `Page | ${site.name}` };
  }
}

export default async function PublicCustomPage({ params }: Props) {
  const { siteSlug, pageSlug } = await params;
  const site = await resolvePublicSite(siteSlug);
  if (!site) notFound();

  // Normalize slug (about-us, /about-us)
  const slug = String(pageSlug || "")
    .trim()
    .replace(/^\//, "")
    .toLowerCase();

  let page: any = null;
  try {
    const data = await api.getPublicPage(site.id, slug);
    page = data?.page ?? (data?.id || data?.name ? data : null);
  } catch (err) {
    console.error("Public page fetch failed:", err);
  }

  if (!page) notFound();

  // Prefer body fragment if full document provided
  let html = String(page.htmlContent || page.content || "");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    html = bodyMatch[1];
  }
  // Strip script tags for safer public embed
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  // If HTML already has an h1 matching page name, avoid double title chrome
  const hasOwnH1 = /<h1[\s>]/i.test(html);

  return (
    <article className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Link
          href={siteHomePath(site.slug)}
          className="inline-flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-colors mb-8"
          style={{ color: "var(--site-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {site.name}
        </Link>

        {!hasOwnH1 && (
          <header className="mb-8">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--site-primary)" }}
            >
              {site.name}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ color: "var(--site-ink, #0f172a)" }}
            >
              {page.name}
            </h1>
          </header>
        )}

        <div
          className="public-custom-page max-w-none text-[var(--site-ink)] leading-relaxed [&_h1]:text-3xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1.5 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-bold"
          style={{ color: "var(--site-ink)" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-12 pt-8 border-t border-black/5 flex flex-wrap gap-4">
          <Link
            href={siteBlogPath(site.slug)}
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
            style={{ color: "var(--site-primary)" }}
          >
            Read the journal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
