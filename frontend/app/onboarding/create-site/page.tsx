"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Globe2,
  ImagePlus,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { setCurrentSite } from "@/lib/siteStorage";
import { isValidSiteSlug, slugifySiteName } from "@/lib/slugify";

export default function CreateSitePage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      router.replace("/login?callback=/onboarding/create-site");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugifySiteName(name));
    }
  }, [name, slugTouched]);

  const publicPath = useMemo(
    () => (slug ? `/s/${slug}` : "/s/your-site"),
    [slug]
  );

  const validationError = useMemo(() => {
    if (!name.trim()) return "Site name is required.";
    if (name.trim().length > 255)
      return "Site name must be 255 characters or less.";
    if (!slug.trim()) return "URL slug is required.";
    if (!isValidSiteSlug(slug)) {
      return "Slug may only use lowercase letters, numbers, and hyphens (e.g. acme-foods).";
    }
    return null;
  }, [name, slug]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for the logo.");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.createSite({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
      });

      const site = data?.site || data;
      if (!site?.id) {
        throw new Error("Site was created but no site data was returned.");
      }

      let logoUrl: string | null = site.logo ?? null;

      // R3-6: after site exists, upload logo into that site's media and set site.logo
      if (logoFile) {
        setCurrentSite({
          id: site.id,
          name: site.name,
          slug: site.slug,
          status: site.status,
          logo: null,
          ownerId: site.ownerId,
        });
        try {
          const base64Data = await fileToBase64(logoFile);
          const uploaded = await api.uploadMedia({
            name: logoFile.name,
            type: logoFile.type,
            size: String(logoFile.size),
            base64Data,
          });
          logoUrl = uploaded?.url || uploaded?.path || null;
          if (logoUrl) {
            await api.updateSite(site.id, { logo: logoUrl });
          }
        } catch (logoErr) {
          console.warn("Logo upload failed (site still created):", logoErr);
        }
      }

      setCurrentSite({
        id: site.id,
        name: site.name,
        slug: site.slug,
        status: site.status,
        logo: logoUrl,
        ownerId: site.ownerId,
      });

      setSuccess(
        `Site created! Public blog will be at /s/${site.slug}/blog — opening dashboard…`
      );

      setTimeout(() => {
        router.replace("/admin");
      }, 900);
    } catch (err: any) {
      setError(err?.message || "Failed to create site. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex flex-col font-sans">
      <nav className="w-full px-6 py-4 flex items-center justify-between mx-auto max-w-5xl">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CoreHead"
            width={140}
            height={36}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <p className="text-sm text-slate-500 font-medium hidden sm:block">
          Step 1 of 1 · Create your website
        </p>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create your site
            </h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              You need a site before you can write posts or open a public blog.
              Choose a name, URL slug, and optional logo.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-5"
          >
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* R3-6 Logo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Logo <span className="text-slate-400 font-medium">(optional)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Choose image
                  </button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoFile(null);
                        if (logoInputRef.current) logoInputRef.current.value = "";
                      }}
                      className="text-xs font-semibold text-red-500 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="site-name"
              >
                Site name
              </label>
              <input
                id="site-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Foods"
                maxLength={255}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-900 font-medium transition-all"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-bold text-slate-700"
                htmlFor="site-slug"
              >
                Site URL slug
              </label>
              <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 overflow-hidden transition-all">
                <span className="pl-4 text-sm text-slate-400 font-medium shrink-0">
                  /s/
                </span>
                <input
                  id="site-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                        .replace(/-{2,}/g, "-")
                    );
                  }}
                  placeholder="acme-foods"
                  className="flex-1 h-full px-2 bg-transparent outline-none text-slate-900 font-medium"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                Public path preview:{" "}
                <span className="font-semibold text-slate-600">{publicPath}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!validationError}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating site…
                </>
              ) : (
                <>
                  Create site & continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
