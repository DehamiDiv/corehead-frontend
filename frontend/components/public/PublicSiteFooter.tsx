"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicSite } from "@/lib/publicSite";
import { siteBlogPath, siteHomePath } from "@/lib/publicSite";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { resolveFooterLogo } from "@/lib/siteBranding";
import {
  mapThemeNavHref,
  DEFAULT_THEME_FOOTER_LINKS,
} from "@/lib/themeNav";
import { api } from "@/lib/api";
export default function PublicSiteFooter({ site }: { site: PublicSite }) {
  const year = new Date().getFullYear();
  const branding = site.branding;
  const logo = resolveMediaUrl(resolveFooterLogo(site.logo, branding));
  const [logoBroken, setLogoBroken] = useState(false);

  useEffect(() => {
    setLogoBroken(false);
  }, [logo]);
  const description =
    branding?.footer?.footerDescription ||
    `${site.name} publishes thoughtful stories for modern readers.`;
  const copyright =
    branding?.footer?.copyrightText ||
    `© ${year} ${site.name}. All rights reserved.`;
  const quickLinksRaw =
    branding?.footer?.quickLinks?.filter((item) => {
      if (!item?.name || !item?.link) return false;
      const name = item.name.toLowerCase();
      const link = item.link;
      return (
        name !== "dashboard" &&
        name !== "logout" &&
        link !== "/admin" &&
        !link.startsWith("/admin") &&
        link !== "/logout"
      );
    }) || null;
  const quickLinks =
    quickLinksRaw && quickLinksRaw.length > 0
      ? quickLinksRaw
      : DEFAULT_THEME_FOOTER_LINKS.filter((l) => {
          const n = l.name.toLowerCase();
          return n !== "dashboard" && n !== "logout";
        });

  const footerStyle: CSSProperties = {
    background: "var(--site-footer-bg, #0f172a)",
    color: "var(--site-footer-fg, #94a3b8)",
  };

  return (
    <footer className="mt-auto border-t border-black/10" style={footerStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              {logo && !logoBroken ? (
                // Logo only — avoid “Blocksy Blocksy” when mark already includes the name
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={site.name}
                  width={160}
                  height={40}
                  className="h-10 w-auto max-w-[160px] shrink-0 object-contain object-left"
                  onError={() => setLogoBroken(true)}
                />
              ) : (
                <>
                  <div
                    className="h-10 w-10 rounded-xl text-white flex items-center justify-center text-sm font-black"
                    style={{ background: "var(--site-primary)" }}
                  >
                    {site.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-lg text-inherit opacity-95">
                    {site.name}
                  </p>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed opacity-90">{description}</p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold opacity-60 mb-4">
              Explore
            </p>
            <div className="flex flex-col gap-2.5 text-sm font-semibold">
              {quickLinks.map((item) => (
                <Link
                  key={`${item.name}-${item.link}`}
                  href={mapThemeNavHref(item.link, site.slug)}
                  className="hover:opacity-100 opacity-90 transition-opacity hover:underline underline-offset-4"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Journal */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold opacity-60 mb-4">
              Journal
            </p>
            <div className="flex flex-col gap-2.5 text-sm font-semibold">
              <Link
                href={siteHomePath(site.slug)}
                className="hover:underline underline-offset-4 opacity-90"
              >
                Home
              </Link>
              <Link
                href={siteBlogPath(site.slug)}
                className="hover:underline underline-offset-4 opacity-90"
              >
                All stories
              </Link>
              <Link
                href={`/s/${site.slug}/p/about`}
                className="hover:underline underline-offset-4 opacity-90"
              >
                About
              </Link>
              <Link
                href={`/s/${site.slug}/p/contact`}
                className="hover:underline underline-offset-4 opacity-90"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/90">Stay in the loop</p>
              <p className="text-xs opacity-60 mt-0.5">Get the latest stories in your inbox.</p>
            </div>

            <NewsletterForm siteSlug={site.slug} siteName={site.name} />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs opacity-70">
          <p>{copyright}</p>
          <p className="font-medium">
            Powered by{" "}
            <Link href="/" className="underline underline-offset-2 hover:opacity-100">
              CoreHead
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Small working newsletter form for public site footers (Verdura etc.) */
function NewsletterForm({ siteSlug, siteName }: { siteSlug: string; siteName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      setMessage("Valid email required");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await api.subscribeToNewsletter(trimmed, siteSlug, undefined, siteName);
      if (res?.success || res?.demo) {
        setStatus("success");
        setMessage("Thanks! Check your Gmail.");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 4500);
      } else {
        throw new Error("Failed");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "success") {
    return <p className="text-emerald-400 text-sm font-medium">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-white/10 border border-white/20 text-sm rounded-lg px-3 py-2 outline-none placeholder:text-white/50 focus:border-white/40"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-white/90 active:scale-[0.985] transition disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && message && (
        <span className="text-red-400 text-xs self-center ml-1">{message}</span>
      )}
    </form>
  );
}
