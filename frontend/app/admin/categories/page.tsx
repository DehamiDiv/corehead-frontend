"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit, Trash2, Tags, Hash, ArrowUpRight, X, Loader2, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

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

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
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
      const data = { name, slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'), description };
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
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Category Details</th>
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
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <Tags className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-900 leading-tight">{category.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 truncate max-w-[200px]">
                            {category.description || "No description"}
                          </p>
                        </div>
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(category)}
                          className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[24px] font-bold text-slate-900 mb-1">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <p className="text-[14px] text-slate-500 font-medium">
                {editingId ? "Update your category details" : "Create a new category to organize posts"}
              </p>
            </div>
            
            <form onSubmit={handleSave} className="p-8 pt-4 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Category Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Technology"
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-[15px] font-bold text-slate-900"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingId) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'));
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">URL Slug</label>
                  <input 
                    type="text"
                    required
                    placeholder="category-slug"
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-[14px] font-medium text-slate-600"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="What is this category about?"
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-[14px] font-medium text-slate-600 resize-none leading-relaxed"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-[14px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 text-[14px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
