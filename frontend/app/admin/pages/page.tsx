"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Edit, Trash2, Globe, FileCode2, ArrowLeft, Eye, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function PagesManagementPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const fetchPages = async () => {
    setIsRefreshing(true);
    try {
      const response = await api.getPages();
      if (response && response.pages) {
        setPages(response.pages);
      }
    } catch (error) {
      console.error("Failed to fetch pages", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreateNew = () => {
    setEditingPageId(null);
    setPageName("");
    setPageSlug("");
    setHtmlContent("<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>");
    setIsPublished(false);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (page: any) => {
    setEditingPageId(page.id);
    setPageName(page.name);
    setPageSlug(page.slug);
    setHtmlContent(page.htmlContent || "");
    setIsPublished(page.status === 'Published');
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

  const handleSave = async () => {
    if (!pageName || !pageSlug || !htmlContent) {
      return alert("Please fill in all required fields.");
    }
    
    // Auto-format slug if user typed spaces
    const formattedSlug = pageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    setIsSubmitting(true);
    try {
      const data = {
        name: pageName,
        slug: formattedSlug,
        htmlContent,
        status: isPublished ? "Published" : "Draft"
      };

      if (editingPageId) {
        await api.updatePage(editingPageId, data);
        alert("Page updated successfully!");
      } else {
        await api.createPage(data);
        alert("Page created successfully!");
      }
      setIsCreateModalOpen(false);
      fetchPages();
    } catch (error: any) {
      alert(error.message || `Failed to ${editingPageId ? "update" : "create"} page`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 mt-1">Manage custom HTML pages and their routes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPages}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
            title="Refresh Pages"
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin text-blue-600")} />
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
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50/50 transition-all group bg-white">
                  <td className="px-6 py-5 font-semibold text-gray-900">{page.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-gray-900 font-semibold">
                      <FileCode2 className="w-4 h-4 text-gray-400" />
                      {page.name}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-[13px] bg-gray-50/80 px-2 py-1 rounded text-gray-600 border border-gray-100/50 font-semibold">
                        /{page.slug.replace(/^\//, '')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold border",
                      page.status === 'Published' 
                        ? "bg-green-50 text-green-600 border-green-100/50" 
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    )}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
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
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No pages found. Click "Create Page" to add one.
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
            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-8">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="mt-1.5 p-1 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[28px] font-bold text-gray-900">{editingPageId ? "Edit Page" : "Create New Page"}</h1>
                <p className="text-gray-500 text-sm">{editingPageId ? "Update your custom HTML page" : "Create a custom HTML page"}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-1 mb-24">
              
              {/* Page Name */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">Page Name <span className="text-gray-900">*</span></label>
                <input 
                  type="text"
                  placeholder="e.g., About Us, Contact"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                />
              </div>

              {/* Slug */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug (Route) <span className="text-gray-900">*</span></label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <span className="px-4 py-2.5 bg-gray-50/50 text-gray-500 border-r border-gray-200 text-sm">/</span>
                  <input 
                    type="text"
                    placeholder="about-us"
                    className="flex-1 px-4 py-2.5 bg-transparent focus:outline-none text-sm placeholder:text-gray-400"
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                  />
                </div>
                <p className="text-[13px] text-gray-500 mt-2">The URL path for this page. Use lowercase letters, numbers, and hyphens only.</p>
              </div>

              {/* HTML Content */}
              <div className="mb-6 flex-1 flex flex-col">
                <label className="block text-sm font-bold text-gray-900 mb-2">HTML Content <span className="text-gray-900">*</span></label>
                <textarea 
                  className="w-full flex-1 min-h-[300px] px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-mono placeholder:text-gray-400 resize-y"
                  placeholder="<!DOCTYPE html> <html> <head> <title>My Page</title> </head> <body> <h1>Hello World</h1> </body> </html>"
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                />
                <p className="text-[13px] text-gray-500 mt-2">Enter your custom HTML code. Include all necessary HTML, CSS, and JavaScript.</p>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-5 border border-gray-100 rounded-xl bg-white shadow-sm mt-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Published</h3>
                  <p className="text-sm text-gray-500">Make this page publicly accessible</p>
                </div>
                <button 
                  onClick={() => setIsPublished(!isPublished)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    isPublished ? "bg-blue-600" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    isPublished ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Footer */}
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
                    if (!htmlContent) return alert("Please enter some HTML content to preview.");
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
                  {isSubmitting ? (editingPageId ? "Updating..." : "Creating...") : (editingPageId ? "Update Page" : "Create Page")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex flex-col p-4 md:p-8">
          <div className="bg-white flex flex-col flex-1 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-500">
                  {pageSlug ? `/${pageSlug}` : 'Untitled Page Preview'}
                </div>
              </div>
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close Preview
              </button>
            </div>
            
            {/* Iframe Content */}
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
