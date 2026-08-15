"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Globe,
  FileCode2,
  ArrowLeft,
  Eye,
  Save,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useSite } from "@/components/admin/SiteContext";
import {
  DEFAULT_THEME_FOOTER_LINKS,
  DEFAULT_THEME_NAV_LINKS,
} from "@/lib/themeNav";

type PageMenuLocation = "header" | "footer" | "both" | "none";

function slugifyPageName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function normalizePageSlug(slug: string): string {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/^\//, "")
    .replace(/^p\//, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function upsertPageLink(
  rawLinks: any[],
  pageName: string,
  href: string,
  keepUtilitiesLast = false,
) {
  const normalizedHref = href.replace(/\/$/, "");
  const nameLower = pageName.trim().toLowerCase();
  const existing = rawLinks.map((link) => ({ ...link }));
  const matchIndex = existing.findIndex((link: any) => {
    const candidate = String(link?.link || "").replace(/\/$/, "");
    return (
      candidate === normalizedHref ||
      candidate === normalizedHref.replace(/^\//, "") ||
      candidate.endsWith(normalizedHref) ||
      String(link?.name || "").trim().toLowerCase() === nameLower
    );
  });

  const pageLink = {
    id: matchIndex >= 0 ? existing[matchIndex]?.id || Date.now() : Date.now(),
    name: pageName.trim() || "Page",
    link: href,
  };

  if (matchIndex >= 0) {
    existing[matchIndex] = pageLink;
    return existing;
  }

  if (keepUtilitiesLast) {
    const utilityIndex = existing.findIndex((link: any) => {
      const name = String(link?.name || "").toLowerCase();
      const candidate = String(link?.link || "");
      return (
        name === "dashboard" ||
        name === "logout" ||
        candidate === "/admin" ||
        candidate.startsWith("/admin") ||
        candidate === "/logout"
      );
    });
    if (utilityIndex >= 0) {
      existing.splice(utilityIndex, 0, pageLink);
      return existing;
    }
  }

  return [...existing, pageLink];
}

/** Keep canonical site chrome and the active theme pack in sync. */
async function addPageToSiteNav(
  pageName: string,
  slug: string,
  location: PageMenuLocation,
) {
  const href = `/p/${normalizePageSlug(slug)}`;
  try {
    const active = await api.getSetting("active_theme");
    const themeId =
      (active && (active.themeId || active.id)) || "default";

    if (location === "header" || location === "both") {
      const [siteRaw, themeRaw] = await Promise.all([
        api.getSetting("site_header"),
        api.getSetting(`theme_${themeId}_header`),
      ]);
      const siteHeader = siteRaw && typeof siteRaw === "object" ? { ...siteRaw } : {};
      const themeHeader = themeRaw && typeof themeRaw === "object" ? { ...themeRaw } : {};
      const baseLinks = Array.isArray((siteHeader as any).navLinks)
        ? (siteHeader as any).navLinks
        : Array.isArray((themeHeader as any).navLinks)
          ? (themeHeader as any).navLinks
          : DEFAULT_THEME_NAV_LINKS;
      const navLinks = upsertPageLink(baseLinks, pageName, href, true);
      await Promise.all([
        api.updateSetting("site_header", { ...siteHeader, navLinks }),
        api.updateSetting(`theme_${themeId}_header`, { ...themeHeader, navLinks }),
      ]);
    }

    if (location === "footer" || location === "both") {
      const [siteRaw, themeRaw] = await Promise.all([
        api.getSetting("site_footer"),
        api.getSetting(`theme_${themeId}_footer`),
      ]);
      const siteFooter = siteRaw && typeof siteRaw === "object" ? { ...siteRaw } : {};
      const themeFooter = themeRaw && typeof themeRaw === "object" ? { ...themeRaw } : {};
      const baseLinks = Array.isArray((siteFooter as any).quickLinks)
        ? (siteFooter as any).quickLinks
        : Array.isArray((themeFooter as any).quickLinks)
          ? (themeFooter as any).quickLinks
          : DEFAULT_THEME_FOOTER_LINKS.filter((link) => {
              const name = link.name.toLowerCase();
              return name !== "dashboard" && name !== "logout";
            });
      const quickLinks = upsertPageLink(baseLinks, pageName, href);
      await Promise.all([
        api.updateSetting("site_footer", { ...siteFooter, quickLinks }),
        api.updateSetting(`theme_${themeId}_footer`, { ...themeFooter, quickLinks }),
      ]);
    }

    return true;
  } catch (err) {
    console.warn("Could not add page to site navigation:", err);
    return false;
  }
}

export default function PagesManagementPage() {
  const { currentSite, currentSiteId } = useSite();
  const [pages, setPages] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  /** New pages default Published so they are public immediately */
  const [isPublished, setIsPublished] = useState(true);
  /** Where the published page link should appear on the public site. */
  const [menuLocation, setMenuLocation] = useState<PageMenuLocation>("header");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const fetchPages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await api.getPages();
      if (response && Array.isArray(response.pages)) {
        setPages(response.pages);
      } else if (Array.isArray(response)) {
        setPages(response);
      } else {
        setPages([]);
      }
    } catch (error) {
      console.error("Failed to fetch pages", error);
      setPages([]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages, currentSiteId]);

  const handleCreateNew = () => {
    setEditingPageId(null);
    setPageName("");
    setPageSlug("");
    setSlugTouched(false);
    setHtmlContent(
      "<!DOCTYPE html>\n<html>\n<head>\n  <title>About Us</title>\n</head>\n<body>\n  <h1>About Us</h1>\n  <p>Tell your story here.</p>\n</body>\n</html>"
    );
    setIsPublished(true);
    setMenuLocation("header");
    setIsCreateModalOpen(true);
  };

  const handleEdit = (page: any) => {
    setEditingPageId(page.id);
    setPageName(page.name || "");
    setPageSlug(normalizePageSlug(page.slug || ""));
    setSlugTouched(true);
    setHtmlContent(page.htmlContent || "");
    setIsPublished(
      String(page.status || "").toLowerCase() === "published"
    );
    setMenuLocation("header");
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        await api.deletePage(id);
        fetchPages();
      } catch (error: any) {
        alert(error.message || "Failed to delete page");
      }
    }
  };

  const handleNameChange = (value: string) => {
    setPageName(value);
    if (!slugTouched || !editingPageId) {
      if (!slugTouched) {
        setPageSlug(slugifyPageName(value));
      }
    }
  };

  const publicPath = (slug: string) => {
    const s = normalizePageSlug(slug);
    const site = currentSite?.slug || "…";
    return `/s/${site}/p/${s}`;
  };

  const handleSave = async () => {
    if (!pageName.trim() || !pageSlug.trim() || !htmlContent.trim()) {
      return alert("Please fill in all required fields.");
    }

    if (!currentSiteId) {
      return alert(
        "No site selected. Switch to the Blocksy (or correct) site in the header first, then create the page."
      );
    }

    const formattedSlug = normalizePageSlug(pageSlug);
    if (!formattedSlug) {
      return alert("Please enter a valid slug (e.g. about-us).");
    }

    setIsSubmitting(true);
    try {
      const data = {
        name: pageName.trim(),
        slug: formattedSlug,
        htmlContent,
        status: isPublished ? "Published" : "Draft",
      };

      if (editingPageId) {
        await api.updatePage(editingPageId, data);
      } else {
        await api.createPage(data);
      }

      let navNote = "";
      if (isPublished && menuLocation !== "none") {
        const added = await addPageToSiteNav(
          pageName.trim(),
          formattedSlug,
          menuLocation,
        );
        const locationLabel =
          menuLocation === "both"
            ? "header and footer menus"
            : `${menuLocation} menu`;
        navNote = added
          ? `\n\n✓ Added to site ${locationLabel} — hard-refresh the public site (Ctrl+Shift+R).`
          : "\n\n(Page was already in the menu, or menu update was skipped.)";
      } else if (!isPublished) {
        navNote =
          "\n\n⚠ Page is Draft — it will NOT appear publicly until you turn on Published.";
      }

      const url = publicPath(formattedSlug);
      alert(
        (editingPageId ? "Page updated." : "Page created.") +
          (isPublished
            ? `\n\nPublic URL:\n${typeof window !== "undefined" ? window.location.origin : ""}${url}`
            : "") +
          navNote
      );

      setIsCreateModalOpen(false);
      fetchPages();
    } catch (error: any) {
      alert(
        error.message ||
          `Failed to ${editingPageId ? "update" : "create"} page`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="admin-title">Pages</h1>
          <p className="text-gray-500 mt-1">
            Custom HTML pages for{" "}
            <span className="font-semibold text-gray-700">
              {currentSite?.name || "this site"}
            </span>
            . Public only when{" "}
            <span className="font-semibold text-green-700">Published</span>
            {" · "}
            URL:{" "}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
              /s/{currentSite?.slug || "…"}/p/&#123;slug&#125;
            </code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPages}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
            title="Refresh Pages"
          >
            <RefreshCw
              size={16}
              className={cn(isRefreshing && "animate-spin text-blue-600")}
            />
            Refresh
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </button>
        </div>
      </div>

      {!currentSiteId && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-medium">
          Select a site in the header switcher before creating pages. Pages are
          scoped to the active site.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium bg-white">
                <th className="px-6 py-5 w-20">ID</th>
                <th className="px-6 py-5 w-1/3">Name</th>
                <th className="px-6 py-5 w-1/3">Route</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => {
                const slug = normalizePageSlug(page.slug || "");
                const published =
                  String(page.status || "").toLowerCase() === "published";
                return (
                  <tr
                    key={page.id}
                    className="hover:bg-gray-50/50 transition-all group bg-white"
                  >
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      {page.id}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 text-gray-900 font-semibold">
                        <FileCode2 className="w-4 h-4 text-gray-400" />
                        {page.name}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-mono text-[13px] bg-gray-50/80 px-2 py-1 rounded text-gray-600 border border-gray-100/50 font-semibold">
                          {publicPath(slug)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold border",
                          published
                            ? "bg-green-50 text-green-600 border-green-100/50"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                      >
                        {page.status || "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {published && currentSite?.slug && (
                          <Link
                            href={publicPath(slug)}
                            target="_blank"
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Open public page"
                          >
                            <ExternalLink className="w-[18px] h-[18px]" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                          title="Edit Page"
                        >
                          <Edit className="w-[18px] h-[18px]" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pages.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No pages found. Click &quot;Create Page&quot; to add About
                    Us, Contact, etc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Page Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#f0f4f8] overflow-y-auto">
          <div className="max-w-[1200px] mx-auto w-full px-6 py-8 flex-1 flex flex-col">
            <div className="flex items-start gap-4 mb-8">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="mt-1.5 p-1 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="admin-title text-[28px]">
                  {editingPageId ? "Edit Page" : "Create New Page"}
                </h1>
                <p className="text-gray-500 text-sm">
                  {editingPageId
                    ? "Update your custom HTML page"
                    : `Create a page for ${currentSite?.name || "this site"} — turn on Published + menu to show it on the site`}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-1 mb-24">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Page Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., About Us, Contact"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                  value={pageName}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Slug (Route) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <span className="px-3 py-2.5 bg-gray-50/50 text-gray-500 border-r border-gray-200 text-xs font-mono whitespace-nowrap">
                    /s/{currentSite?.slug || "site"}/p/
                  </span>
                  <input
                    type="text"
                    placeholder="about-us"
                    className="flex-1 px-4 py-2.5 bg-transparent focus:outline-none text-sm placeholder:text-gray-400"
                    value={pageSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setPageSlug(e.target.value);
                    }}
                  />
                </div>
                <p className="text-[13px] text-gray-500 mt-2">
                  Public URL:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {publicPath(pageSlug || "about-us")}
                  </code>
                  . Must be <strong>Published</strong> to open on the live site.
                </p>
              </div>

              <div className="mb-6 flex-1 flex flex-col">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  HTML Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full flex-1 min-h-[300px] px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-mono placeholder:text-gray-400 resize-y"
                  placeholder="<!DOCTYPE html>..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                />
                <p className="text-[13px] text-gray-500 mt-2">
                  Enter custom HTML. Scripts are stripped on the public site for
                  safety.
                </p>
              </div>

              <div className="space-y-3 mt-8">
                <div className="flex items-center justify-between p-5 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Published
                    </h3>
                    <p className="text-sm text-gray-500">
                      Make this page publicly accessible at the URL above
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      isPublished ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        isPublished ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-4 p-5 border border-gray-100 rounded-xl bg-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Navigation location
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose where visitors can discover this published page
                    </p>
                  </div>
                  <select
                    disabled={!isPublished}
                    value={menuLocation}
                    onChange={(event) =>
                      setMenuLocation(event.target.value as PageMenuLocation)
                    }
                    className="min-w-44 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                    <option value="both">Header and Footer</option>
                    <option value="none">Do not add to navigation</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-all shadow-sm"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!htmlContent)
                      return alert(
                        "Please enter some HTML content to preview."
                      );
                    setIsPreviewModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  Preview
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 rounded-lg transition-all shadow-md shadow-blue-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting
                    ? editingPageId
                      ? "Updating..."
                      : "Creating..."
                    : editingPageId
                      ? "Update Page"
                      : "Create Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex flex-col p-4 md:p-8">
          <div className="bg-white flex flex-col flex-1 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-500">
                  {pageSlug
                    ? publicPath(pageSlug)
                    : "Untitled Page Preview"}
                </div>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close Preview
              </button>
            </div>

            <div className="flex-1 bg-white relative w-full h-full">
              <iframe
                srcDoc={htmlContent}
                className="absolute inset-0 w-full h-full border-none bg-white"
                title="Page Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
