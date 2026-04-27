"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Tags, Hash, ArrowUpRight, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const COLORS = ["blue", "emerald", "purple", "rose", "amber", "indigo", "pink", "teal", "orange", "cyan"];

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

  const fetchCategories = async () => {
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
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    if (!name || !slug) return alert("Please fill in required fields.");
    
    setIsSubmitting(true);
    try {
      const data = { name, slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'), description };
      if (editingId) {
        await api.updateCategory(editingId, data);
        alert("Category updated successfully!");
      } else {
        await api.createCategory(data);
        alert("Category created successfully!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || `Failed to ${editingId ? "update" : "create"} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Customize Your Post Categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Loader2 className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </button>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4 w-1/3">Category Name</th>
                <th className="px-6 py-4 w-1/3">Category Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((category) => {
                  // Basic parent-child visual hack using description field for demo
                  const isChild = category.description && category.description !== "";

                  return (
                    <tr key={category.id} className="hover:bg-gray-50/50 transition-all group bg-white">
                      <td className="px-6 py-4 font-bold text-gray-900">{category.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          {isChild && <span className="text-gray-400 font-normal">&gt;</span>}
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleOpenEdit(category)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="w-[18px] h-[18px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No categories found. Click "Create Category" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[520px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Header */}
            <div className="p-6 pb-4 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[22px] font-bold text-gray-900 mb-1">
                {editingId ? "Edit Category" : "Create Category"}
              </h2>
              <p className="text-[15px] text-gray-500">
                {editingId ? "Update your category details." : "Create a new category to organize your blog posts."}
              </p>
            </div>
            
            <form onSubmit={handleSave} className="px-6 pb-6 space-y-5">
              
              {/* Category Image */}
              <div>
                <label className="block text-[15px] font-semibold text-gray-900 mb-3">Category Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload
                      </button>
                      <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Library
                      </button>
                    </div>
                    <span className="text-[13px] text-gray-500">Upload a category image (max 5MB)</span>
                  </div>
                </div>
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-[15px] font-semibold text-gray-900 mb-1.5">Category Name <span className="text-gray-900">*</span></label>
                <input 
                  type="text"
                  required
                  placeholder="Enter category name"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] placeholder:text-gray-400"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'));
                    }
                  }}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[15px] font-semibold text-gray-900 mb-1.5">Slug <span className="text-gray-900">*</span></label>
                <input 
                  type="text"
                  required
                  placeholder="category-slug"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] placeholder:text-gray-400"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <p className="text-[13px] text-gray-500 mt-1.5">URL-friendly identifier. Auto-generated from name but can be customized.</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[15px] font-semibold text-gray-900 mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Enter category description"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] placeholder:text-gray-400 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-[15px] font-semibold text-gray-900 mb-1.5">Parent Category (Optional)</label>
                <select 
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] appearance-none"
                >
                  <option value="">None (Parent Category)</option>
                  <option value="test-cat">Test Cat</option>
                  <option value="remote-work">Remote Work</option>
                  <option value="ai">AI</option>
                  <option value="travelling">Travelling</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="home-living">Home & Living</option>
                  <option value="marketing">Marketing</option>
                </select>
                <p className="text-[13px] text-gray-500 mt-1.5">Leave as "None" to create a parent category.</p>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all text-[15px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 text-[15px]"
                >
                  {isSubmitting ? (editingId ? "Saving..." : "Creating...") : (editingId ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
