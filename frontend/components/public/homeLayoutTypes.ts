import type { HomeSectionCopy } from "@/lib/publicSiteCopy";
import { normalizeHomeLayoutData } from "@/contracts/home-layout-data-v1.js";

export type HomePost = {
  id: number | string;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  featured_image?: string;
  category?: string | null;
  categories?: unknown;
  publishedAt?: string;
  createdAt?: string;
  featured?: boolean;
};

export type HomeLayoutProps = {
  siteName: string;
  siteSlug: string;
  eyebrow?: string | null;
  tagline?: string | null;
  heroImage?: string | null;
  ctaText?: string | null;
  ctaBg?: string | null;
  ctaColor?: string | null;
  posts?: HomePost[];
  sections?: HomeSectionCopy | null;
};

export function normalizeHomeLayoutProps(props: HomeLayoutProps) {
  return normalizeHomeLayoutData(props) as HomeLayoutProps & {
    siteName: string;
    siteSlug: string;
    eyebrow: string;
    tagline: string;
    heroImage: string | null;
    posts: HomePost[];
  };
}

export type NormalizedHomeLayoutProps = ReturnType<
  typeof normalizeHomeLayoutProps
>;
