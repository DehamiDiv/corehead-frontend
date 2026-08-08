import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { sitePostPath } from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import {
  formatPostDate,
  postCategory,
  readingTimeMinutes,
} from "@/lib/publicSiteCopy";
import { cn } from "@/lib/utils";

type PostLike = {
  id: number | string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  featured_image?: string;
  category?: string | null;
  categories?: Array<string | { name?: string }> | string | null;
  publishedAt?: string;
  published_date?: string;
  createdAt?: string;
  featured?: boolean;
};

export default function PublicPostCard({
  post,
  siteSlug,
  variant = "default",
  className,
}: {
  post: PostLike;
  siteSlug: string;
  variant?: "default" | "featured" | "compact" | "horizontal";
  className?: string;
}) {
  const href = sitePostPath(siteSlug, String(post.slug || post.id));
  const image = resolveMediaUrl(
    post.coverImage || post.thumbnailUrl || post.featured_image
  );
  const date = formatPostDate(
    post.publishedAt || post.published_date || post.createdAt
  );
  const category = postCategory(post);
  const minutes = readingTimeMinutes(post.content || post.excerpt);

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className={cn(
          "group relative grid overflow-hidden rounded-3xl border border-black/5 bg-[var(--site-surface)] shadow-lg shadow-black/5 lg:grid-cols-2",
          className
        )}
      >
        <div className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-black/5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={post.title || ""}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--site-primary), var(--site-accent, var(--site-primary)))",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
              style={{ background: "var(--site-primary)" }}
            >
              Featured
            </span>
            {category && (
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--site-primary)" }}
              >
                {category}
              </span>
            )}
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight group-hover:opacity-90 transition-opacity"
            style={{ color: "var(--site-ink)" }}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p
              className="mt-4 text-sm sm:text-base leading-relaxed line-clamp-3"
              style={{ color: "var(--site-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium"
            style={{ color: "var(--site-muted)" }}
          >
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {date}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min read
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex gap-4 rounded-2xl border border-black/5 bg-[var(--site-surface)] p-3 shadow-sm transition-all hover:shadow-md",
          className
        )}
      >
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-black/5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: "var(--site-primary-soft)" }}
            />
          )}
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          {category && (
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "var(--site-primary)" }}
            >
              {category}
            </p>
          )}
          <h3
            className="font-bold text-sm sm:text-base line-clamp-2 leading-snug"
            style={{ color: "var(--site-ink)" }}
          >
            {post.title}
          </h3>
          {date && (
            <p className="mt-1.5 text-xs" style={{ color: "var(--site-muted)" }}>
              {date}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-[var(--site-surface)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
        variant === "compact" && "rounded-xl",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-black/5",
          variant === "compact" ? "aspect-[16/10]" : "aspect-[16/11]"
        )}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={post.title || ""}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-2xl font-black text-white/80"
            style={{
              background:
                "linear-gradient(135deg, var(--site-primary), var(--site-accent, var(--site-primary)))",
            }}
          >
            {String(post.title || "?").charAt(0)}
          </div>
        )}
        {category && (
          <span
            className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur"
            style={{ color: "var(--site-primary)" }}
          >
            {category}
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-4", variant === "compact" && "p-3.5")}>
        <h3
          className={cn(
            "font-bold leading-snug line-clamp-2 transition-opacity group-hover:opacity-90",
            variant === "compact" ? "text-sm" : "text-base sm:text-[17px]"
          )}
          style={{ color: "var(--site-ink)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && variant !== "compact" && (
          <p
            className="mt-2 flex-1 text-sm line-clamp-2 leading-relaxed"
            style={{ color: "var(--site-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium"
          style={{ color: "var(--site-muted)" }}
        >
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {minutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
