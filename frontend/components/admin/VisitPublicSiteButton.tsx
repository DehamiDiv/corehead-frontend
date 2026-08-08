"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useOptionalSite } from "@/components/admin/SiteContext";
import { siteHomePath } from "@/lib/publicSite";

/**
 * T14: Open the current tenant's public site shell in a new tab.
 */
export default function VisitPublicSiteButton({
  className = "",
  label = "Visit site",
}: {
  className?: string;
  label?: string;
}) {
  const siteCtx = useOptionalSite();
  const slug = siteCtx?.currentSite?.slug;

  if (!slug) return null;

  return (
    <Link
      href={siteHomePath(slug)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest px-3"
      }
      title={`Open /s/${slug}`}
    >
      {label}
      <ExternalLink className="w-3.5 h-3.5" />
    </Link>
  );
}
