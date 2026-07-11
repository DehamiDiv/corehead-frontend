import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { resolvePublicSite } from "@/lib/publicSite";
import PublicSiteShell from "@/components/public/PublicSiteShell";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ siteSlug: string }>;
}

/**
 * T14: Resolve tenant once and wrap all public pages in the default site shell
 * (header + footer branded with site name/logo — not CoreHead marketing chrome).
 */
export default async function PublicSiteSegmentLayout({
  children,
  params,
}: LayoutProps) {
  const { siteSlug } = await params;
  const site = await resolvePublicSite(siteSlug);

  if (!site) {
    notFound();
  }

  return <PublicSiteShell site={site}>{children}</PublicSiteShell>;
}
