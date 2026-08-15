"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit, Trash2, Tags, RotateCcw,
  X, Loader2, Check, FolderTree, Globe, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getCategories();
      if (response && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setName("");
    setSlug("");
    setIsCustomSlug(false);
    setDescription("");
    setParentId(null);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setIsCustomSlug(true);
    setDescription(category.description || "");
    setParentId(category.parentId || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (error: any) {
        alert(error.message || "Failed to delete category");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setIsSubmitting(true);
    try {
      const data = {
        name,
        slug: slug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-"),
        description,
        parentId: parentId ? Number(parentId) : null,
      };

      if (editingId) {
        await api.updateCategory(editingId, data);
      } else {
        await api.createCategory(data);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || `Failed to ${editingId ? "update" : "create"} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parent categories = top-level categories (excluding the one being edited)
  const parentOptions = categories.filter(
    (c) => !c.parentId && c.id !== editingId
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="admin-title">Categories</h1>
          <p className="admin-subtitle">Organize your blog posts efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl admin-btn-secondary text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RotateCcw className={cn("w-4 h-4 text-slate-400", isLoading && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl admin-btn-primary text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-5 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all admin-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-[14px] font-bold text-slate-900 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-50">
          {filteredCategories.length} categories total
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider w-20 text-center">ID</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading categories...</p>
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 text-[13px] font-bold text-slate-300 text-center">#{category.id}</td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-[14px] font-bold text-slate-900 leading-tight">{category.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-1 truncate max-w-[200px]">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        /{category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-500">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Edit"
                          onClick={() => handleOpenEdit(category)}
                          className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(category.id)}
                          className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
          {!isLoading && filteredCategories.length === 0 && (
            <div className="p-6">
              {categories.length === 0 ? (
                <EmptyState
                  icon={Tags}
                  title="No categories yet"
                  description="Organize posts with categories (e.g. News, Guides). Create one to start grouping content on this site."
                  actions={[
                    {
                      label: "Create category",
                      onClick: () => {
                        setEditingId(null);
                        setIsModalOpen(true);
                      },
                    },
                  ]}
                />
              ) : (
                <EmptyState
                  compact
                  icon={Search}
                  title="No categories match your search"
                  description="Try a different name, or clear search to see all categories on this site."
                  actions={[
                    {
                      label: "Clear search",
                      variant: "secondary",
                      onClick: () => setSearchQuery(""),
                    },
                  ]}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Create / Edit Modal (Option B: Compact & Minimal) ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[560px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 pt-7 pb-5 relative border-b border-slate-100 bg-slate-50/40">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900 leading-snug">
                    {editingId ? "Edit Category" : "Create Category"}
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium">
                    {editingId
                      ? "Update your category name and URL identifier."
                      : "Add a new category to group your blog posts."}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="px-8 py-6 space-y-5">
              {/* Row 1: Name & Slug side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technology"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px] text-slate-900 font-medium placeholder:text-slate-400"
                    value={name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setName(newName);
                      if (!isCustomSlug) {
                        setSlug(
                          newName
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-")
                        );
                      }
                    }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[13px] font-semibold text-slate-700">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSlug(!isCustomSlug)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      title={isCustomSlug ? "Auto-generate from name" : "Manually customize slug"}
                    >
                      {isCustomSlug ? (
                        <>
                          <RotateCcw className="w-3 h-3" /> Auto
                        </>
                      ) : (
                        <>
                          <Edit className="w-3 h-3" /> Edit
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      readOnly={!isCustomSlug}
                      placeholder="category-slug"
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all text-[14px] font-medium",
                        isCustomSlug
                          ? "bg-white border-blue-300 text-slate-900 focus:ring-2 focus:ring-blue-500/20"
                          : "bg-slate-100/80 border-slate-200 text-slate-500 cursor-default"
                      )}
                      value={slug}
                      onChange={(e) => {
                        setIsCustomSlug(true);
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-")
                            .replace(/-+/g, "-")
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Live URL Preview Badge */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] text-slate-500 font-medium">
                <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">
                  URL Preview: <span className="font-bold text-slate-700">/category/{slug || "your-slug"}</span>
                </span>
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Parent Category <span className="text-[12px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={parentId ?? ""}
                    onChange={(e) =>
                      setParentId(e.target.value ? parseInt(e.target.value) : null)
                    }
                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px] text-slate-700 font-medium pr-10 cursor-pointer"
                  >
                    <option value="">None (Top-Level Category)</option>
                    {parentOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Description <span className="text-[12px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what posts belong in this category..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px] text-slate-800 font-medium resize-none leading-relaxed placeholder:text-slate-400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !slug.trim()}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 text-[14px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingId ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
