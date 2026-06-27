"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Search, Edit, Trash2, Tags, RotateCcw,
  X, Loader2, Check, Upload, FolderOpen, Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

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
    setDescription("");
    setImageUrl("");
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
    setDescription(category.description || "");
    setImageUrl(category.imageUrl || "");
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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(",")[1];
        try {
          const uploaded = await api.uploadMedia({
            name: file.name,
            type: file.type,
            size: String(file.size),
            base64Data,
          });
          setImageUrl(uploaded.media?.url || uploaded.url || "");
        } catch {
          // Fallback: use local object URL for preview only
          setImageUrl(URL.createObjectURL(file));
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setIsSubmitting(true);
    try {
      // Backend categories table only supports: name, slug, description
      const data = {
        name,
        slug: slug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-"),
        description,
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
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Categories</h1>
          <p className="text-slate-500 mt-1 font-medium">Organize your blog posts efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RotateCcw className={cn("w-4 h-4 text-slate-400", isLoading && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-[14px] font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
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
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-[14px] font-medium"
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
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="p-6 bg-slate-50 rounded-full inline-block mb-4">
                      <Tags className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">No categories found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create / Edit Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-5 relative border-b border-slate-100">
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[22px] font-bold text-slate-900">
                {editingId ? "Edit Category" : "Create Category"}
              </h2>
              <p className="text-[13px] text-slate-500 mt-1">
                {editingId
                  ? "Update your category details below."
                  : "Create a new category to organize your blog posts."}
              </p>
            </div>

            <form onSubmit={handleSave} className="px-8 py-6 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* ── Category Image ── */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-3">
                  Category Image
                </label>
                <div className="flex items-start gap-4">
                  {/* Preview Box */}
                  <div className="w-[88px] h-[88px] flex-shrink-0 rounded-[14px] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {isUploadingImage ? (
                      <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-slate-300" />
                    )}
                  </div>

                  {/* Buttons + hint */}
                  <div>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLibraryOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Library
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">Upload a category image (max 5MB)</p>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="text-[11px] text-red-400 hover:text-red-600 mt-1 transition-colors"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>

              {/* ── Category Name ── */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter category name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[14px] text-slate-900 font-medium"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/-+/g, "-")
                      );
                    }
                  }}
                />
              </div>

              {/* ── Slug ── */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="category-slug"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[14px] text-slate-500 font-medium"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  URL-friendly identifier. Auto-generated from name but can be customized.
                </p>
              </div>

              {/* ── Description ── */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter category description"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[14px] text-slate-500 font-medium resize-none leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ── Parent Category ── */}
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
                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-[14px] text-slate-700 font-medium pr-10 cursor-pointer"
                  >
                    <option value="">None (Parent Category)</option>
                    {parentOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Leave as "None" to create a parent category.
                </p>
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 text-[14px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingId ? "Update Category" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={(url) => {
          setImageUrl(url);
          setIsLibraryOpen(false);
        }}
      />
    </div>
  );
}
