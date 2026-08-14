"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Facebook,
  Link2,
  Linkedin,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";

type Props = {
  title: string;
  excerpt?: string | null;
  sharePath: string;
};

export default function PostShareButtons({ title, excerpt, sharePath }: Props) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(new URL(sharePath, window.location.origin).toString());
  }, [sharePath]);

  const links = useMemo(() => {
    if (!shareUrl) return null;
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(title);
    return [
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        icon: Facebook,
      },
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${text}%20${url}`,
        icon: MessageCircle,
      },
      {
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        icon: Linkedin,
      },
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        icon: Twitter,
      },
    ];
  }, [shareUrl, title]);

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || undefined,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }
    await copyLink();
  };

  return (
    <section
      aria-labelledby="share-post-title"
      className="mt-10 rounded-2xl border border-black/5 bg-[var(--site-surface,#fff)] p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="share-post-title" className="text-sm font-black text-[var(--site-ink)]">
            Share this story
          </h2>
          <p className="mt-1 text-xs text-[var(--site-muted)]">
            Send this published article to your readers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void nativeShare()}
            disabled={!shareUrl}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--site-primary)] px-3 text-xs font-bold text-white disabled:opacity-50"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button
            type="button"
            onClick={() => void copyLink()}
            disabled={!shareUrl}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/10 px-3 text-xs font-bold text-[var(--site-ink)] hover:bg-black/5 disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          {links?.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${label}`}
              title={`Share on ${label}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[var(--site-muted)] transition hover:border-[var(--site-primary)] hover:text-[var(--site-primary)]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
