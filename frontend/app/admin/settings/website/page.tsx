"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Upload, Library, X, Plus, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { api } from "@/lib/api";

export default function WebsiteSettingsPage() {
  const [formData, setFormData] = useState({
    websiteName: "SeekaHost.com",
    pageTitle: "SeekaHost's Blog",
    description: "Personal blog about web development and related topics.",
    favicon: "",
    ogImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    scripts: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState<'favicon' | 'ogImage' | null>(null);

  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const savedSettings = await api.getSetting("website_metadata");
        if (savedSettings) {
          setFormData(savedSettings);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'favicon' | 'ogImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaSelect = (url: string) => {
    if (mediaModalTarget) {
      handleChange(mediaModalTarget, url);
    }
  };

  const openMediaModal = (target: 'favicon' | 'ogImage') => {
    setMediaModalTarget(target);
    setIsMediaModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await api.updateSetting("website_metadata", formData);
      alert("Website settings saved to database successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings to the backend.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading Settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 px-4 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Website Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your website's metadata settings</p>
        </div>
        <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-100 flex items-center gap-2">
           Configured
        </div>
      </div>

      {/* Website Metadata Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Website Metadata</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure your website's basic information and SEO settings</p>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Website Name</label>
            <input 
              type="text" 
              value={formData.websiteName}
              onChange={(e) => handleChange("websiteName", e.target.value)}
              className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none"
            />
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-500 mt-1">
              <Check className="w-3.5 h-3.5" />
              Character count: {formData.websiteName.length}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Page Title</label>
            <input 
              type="text" 
              value={formData.pageTitle}
              onChange={(e) => handleChange("pageTitle", e.target.value)}
              className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm outline-none focus:border-blue-600 transition-all"
            />
            <p className="text-[11px] font-bold text-gray-400 mt-1">This will be used as the default title for pages without a specific title</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Website Description</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm outline-none focus:border-blue-600 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Favicon Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Favicon</h2>
          <p className="text-sm text-gray-500 mt-0.5">Small icon displayed in browser tabs (recommended: 32x32px or 16x16px, .ico or .png, max 1MB)</p>
        </div>
        <div className="p-8">
           <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 bg-gray-50/30">
              {formData.favicon ? (
                <div className="relative group">
                  <img src={formData.favicon} alt="Favicon Preview" className="w-16 h-16 object-contain rounded-xl shadow-sm" />
                  <button onClick={() => handleChange("favicon", "")} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
              )}
              <input type="file" ref={faviconInputRef} accept="image/png, image/jpeg, image/x-icon" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
              <div className="flex items-center gap-3">
                 <button onClick={() => faviconInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 hover:bg-gray-100 transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-gray-400" />
                    Upload Favicon
                 </button>
                 <button onClick={() => openMediaModal('favicon')} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 hover:bg-gray-100 transition-all shadow-sm">
                    <Library className="w-4 h-4 text-gray-400" />
                    Choose from Library
                 </button>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PNG, ICO or JPG (max 1MB)</p>
           </div>
        </div>
      </div>

      {/* Open Graph Image Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Open Graph Image</h2>
            <p className="text-sm text-gray-500 mt-0.5">Image displayed when sharing your website on social media (recommended: 1200x630px, max 1MB)</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openMediaModal('ogImage')} className="px-4 py-2 bg-gray-50 text-gray-600 text-[12px] font-bold rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors border border-gray-100">
               <Library className="w-3.5 h-3.5" />
               Library
            </button>
            <button onClick={() => ogInputRef.current?.click()} className="px-4 py-2 bg-blue-50 text-blue-600 text-[12px] font-bold rounded-xl flex items-center gap-2 hover:bg-blue-100 transition-colors">
               <Upload className="w-3.5 h-3.5" />
               Upload
            </button>
          </div>
          <input type="file" ref={ogInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'ogImage')} />
        </div>
        <div className="p-8">
           <div className="relative group">
              <div className="w-full aspect-[2/1] rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                 <img 
                    src={formData.ogImage} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt="OG Preview"
                 />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter italic">{formData.websiteName}</h1>
                 </div>
              </div>
              <button onClick={() => handleChange("ogImage", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80")} className="absolute top-4 right-4 p-2.5 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform">
                 <X className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      {/* Analytics Scripts Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="text-gray-400">
                <Code className="w-6 h-6" />
             </div>
             <div>
                 <h2 className="text-lg font-bold text-gray-900">Analytics Scripts</h2>
             </div>
          </div>
          <button onClick={() => alert("Feature coming soon: Add custom scripts")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all">
             <Plus className="w-4 h-4 text-gray-400" />
             Add Script
          </button>
        </div>
        <div className="p-8">
           <p className="text-sm text-gray-500 mb-6 font-medium">Add tracking codes for Google Analytics, Meta Pixel, or other analytics services. Each script will be injected into your website's &lt;head&gt; section.</p>
           <div className="border-2 border-dashed border-gray-50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 bg-gray-50/20">
              <div className="text-gray-300">
                <Code className="w-12 h-12" />
              </div>
              <p className="text-sm font-bold text-gray-400">No analytics scripts added yet. Click "Add Script" to get started.</p>
           </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-4 mb-10">
         <button onClick={handleSave} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
            Update Metadata
         </button>
      </div>

      {/* Footer */}
      <div className="pt-10 flex flex-col items-center justify-center text-center gap-2 opacity-40 grayscale group pb-10">
        <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
          Copyright © 2026 SeekaHost Technologies Ltd. All Rights Reserved.
        </p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Company Number: 16028964 | VAT Number: 485829729
        </p>
        <div className="mt-4 flex items-center gap-2">
           <span className="text-[10px] font-black text-gray-300">v1.0.0</span>
        </div>
      </div>

      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
