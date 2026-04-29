"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Eye, Palette, Layout, Sparkles, RefreshCw, X, Settings2, Image as ImageIcon, Send, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const THEMES = [
  {
    id: "default",
    name: "Default",
    description: "Clean white layout with featured post slider and category tabs.",
    preview: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    active: true,
  },
  {
    id: "theme-1",
    name: "Theme 1",
    description: "Nature-inspired green hero with full-width banner and search.",
    preview: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    active: false,
  },
  {
    id: "theme-2",
    name: "Theme 2",
    description: "Bold mosaic hero grid with orange accents and featured articles.",
    preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    active: false,
  },
  {
    id: "theme-3",
    name: "Theme 3",
    description: "Minimalist masonry layout for photography and storytelling.",
    preview: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    active: false,
  },
  {
    id: "theme-4",
    name: "Theme 4",
    description: "Elegant serif typography with high-contrast monochrome design.",
    preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    active: false,
  },
  {
    id: "theme-5",
    name: "Theme 5",
    description: "Futuristic dark mode with neon blue accents and glassmorphism.",
    preview: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    active: false,
  },
];

export default function AppearancePage() {
  const [activeTheme, setActiveTheme] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Customizer State
  const [activeTab, setActiveTab] = useState("header");
  const [headerBg, setHeaderBg] = useState("#ffffff");
  const [headerFont, setHeaderFont] = useState("#000000");
  const [headerLogo, setHeaderLogo] = useState("https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
  const [headerAlt, setHeaderAlt] = useState("header-logo");
  const [navLinks, setNavLinks] = useState([
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Contact", link: "/contact-us" },
    { id: 3, name: "About", link: "/about-us" },
  ]);
  const [newNavName, setNewNavName] = useState("");
  const [newNavLink, setNewNavLink] = useState("");
  const [ctaText, setCtaText] = useState("Sign-In");
  const [ctaUrl, setCtaUrl] = useState("/");
  const [ctaBg, setCtaBg] = useState("#156cab");
  const [ctaColor, setCtaColor] = useState("#ffffff");

  const [isSavingHeader, setIsSavingHeader] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const savedTheme = await api.getSetting("active_theme");
        if (savedTheme && savedTheme.themeId) {
          setActiveTheme(savedTheme.themeId);
        }
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTheme();
  }, []);

  // Fetch header settings when activeTheme changes
  useEffect(() => {
    const fetchHeaderSettings = async () => {
      if (isLoading) return;
      try {
        const headerData = await api.getSetting(`theme_${activeTheme}_header`);
        if (headerData) {
          setHeaderBg(headerData.headerBg || "#ffffff");
          setHeaderFont(headerData.headerFont || "#000000");
          setHeaderLogo(headerData.headerLogo || "https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
          setHeaderAlt(headerData.headerAlt || "header-logo");
          setNavLinks(headerData.navLinks || [
            { id: 1, name: "Home", link: "/" },
            { id: 2, name: "Contact", link: "/contact-us" },
            { id: 3, name: "About", link: "/about-us" },
          ]);
          setCtaText(headerData.ctaText || "Sign-In");
          setCtaUrl(headerData.ctaUrl || "/");
          setCtaBg(headerData.ctaBg || "#156cab");
          setCtaColor(headerData.ctaColor || "#ffffff");
        }
      } catch (error) {
        console.error("Failed to load header settings:", error);
      }
    };
    
    fetchHeaderSettings();
  }, [activeTheme, isLoading]);

  const handleActivateTheme = async (themeId: string) => {
    try {
      await api.updateSetting("active_theme", { themeId });
      setActiveTheme(themeId);
    } catch (error) {
      console.error("Failed to update theme:", error);
      alert("Failed to activate theme.");
    }
  };

  const saveHeaderSettings = async () => {
    setIsSavingHeader(true);
    try {
      const headerSettings = {
        headerBg,
        headerFont,
        headerLogo,
        headerAlt,
        navLinks,
        ctaText,
        ctaUrl,
        ctaBg,
        ctaColor
      };
      await api.updateSetting(`theme_${activeTheme}_header`, headerSettings);
      alert("Header settings updated successfully!");
    } catch (error) {
      console.error("Failed to save header settings:", error);
      alert("Failed to save header settings.");
    } finally {
      setIsSavingHeader(false);
    }
  };

  const addNavLink = () => {
    if (newNavName.trim() && newNavLink.trim()) {
      setNavLinks([...navLinks, { id: Date.now(), name: newNavName, link: newNavLink }]);
      setNewNavName("");
      setNewNavLink("");
    }
  };

  const removeNavLink = (id: number) => {
    setNavLinks(navLinks.filter(n => n.id !== id));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading Themes...</div>;
  }

  const activeThemeName = THEMES.find(t => t.id === activeTheme)?.name || "Default";

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 px-4 sm:px-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
          <p className="text-gray-500 mt-1">Customize the look and feel of your blog</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <RefreshCw className="w-4 h-4 text-gray-400" />
          Update Themes
        </button>
      </div>

      {/* Currently Active Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Currently active</p>
            <h2 className="text-xl font-black text-gray-900 mt-0.5">
              {activeThemeName}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100">
             <CheckCircle2 className="w-4 h-4" />
             Active
           </span>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {THEMES.map((theme) => {
          const isActive = theme.id === activeTheme;
          return (
            <div 
              key={theme.id}
              className={cn(
                "group relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500",
                isActive ? "border-blue-600 shadow-2xl shadow-blue-100" : "border-transparent shadow-xl shadow-gray-200/40 hover:border-blue-200"
              )}
            >
              {/* Preview Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={theme.preview} 
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => {
                      if (!isActive) handleActivateTheme(theme.id);
                      document.getElementById('theme-customizer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                  >
                    <Settings2 className="w-4 h-4" />
                    Edit
                  </button>
                  {!isActive && (
                    <button 
                      onClick={() => handleActivateTheme(theme.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 duration-500 shadow-lg shadow-blue-900/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                </div>

                {/* Top Left Preview Icon */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(theme.preview);
                  }}
                  className="absolute top-4 left-4 z-10 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors shadow-lg"
                  title="Preview Theme"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                {isActive && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-gray-900">{theme.name}</h3>
                  {isActive && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {theme.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Theme Customizer Section */}
      <div id="theme-customizer" className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mt-12 scroll-mt-24">
        <div className="p-8 border-b border-gray-50 flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customize: {activeThemeName}</h2>
              <p className="text-sm text-gray-500 mt-1">Configure colours, header, footer, and homepage for this theme</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-100">
             Configured
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6 border-b border-gray-100 flex gap-4">
          {["Header", "Footer", "Colours", "Fonts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "px-6 py-3 rounded-t-2xl text-sm font-bold transition-all border border-b-0",
                activeTab === tab.toLowerCase() 
                  ? "bg-white text-gray-900 border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] translate-y-[1px]" 
                  : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 bg-white min-h-[500px]">
          {activeTab === "header" && (
            <div className="space-y-10">
              
              {/* Header Styling */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Header Styling</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Configure the appearance of your website header</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Background Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={headerBg} 
                        onChange={(e) => setHeaderBg(e.target.value)}
                        className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input 
                        type="text" 
                        value={headerBg} 
                        onChange={(e) => setHeaderBg(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Font Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={headerFont} 
                        onChange={(e) => setHeaderFont(e.target.value)}
                        className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input 
                        type="text" 
                        value={headerFont} 
                        onChange={(e) => setHeaderFont(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-6 text-center" style={{ backgroundColor: headerBg, color: headerFont }}>
                  <p className="font-bold text-sm">Header Preview</p>
                </div>
              </div>

              {/* Header Logo */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Header Logo</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Upload your website logo for the header</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm font-bold text-gray-900">Logo Image</label>
                  <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Uploaded
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Upload your logo image (PNG or SVG recommended, max 1MB)</p>

                <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-8 mb-6 relative flex justify-center items-center">
                  {headerLogo ? (
                    <>
                      <img src={headerLogo} alt="Logo" className="h-16 object-contain" />
                      <button 
                        onClick={() => setHeaderLogo("")}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                      <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Click to upload logo</button>
                    </div>
                  )}
                </div>

                <label className="text-sm font-bold text-gray-900 block mb-2">Alt Text</label>
                <input 
                  type="text" 
                  value={headerAlt} 
                  onChange={(e) => setHeaderAlt(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              {/* Navigation Links */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Navigation Links</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Add navigation links for your website header</p>

                <label className="text-sm font-bold text-gray-900 block mb-4">Add Navigation Item</label>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Page Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Home, About, Blog"
                      value={newNavName} 
                      onChange={(e) => setNewNavName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Page Link</label>
                    <input 
                      type="text" 
                      placeholder="e.g., /, /about, /blog"
                      value={newNavLink} 
                      onChange={(e) => setNewNavLink(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  onClick={addNavLink}
                  className="w-full py-3 bg-[#93ade9] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors mb-6"
                >
                  <Plus className="w-4 h-4" />
                  Add Navigation Link
                </button>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  {navLinks.map(nav => (
                    <div key={nav.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <Send className="w-4 h-4 text-gray-400 -rotate-45" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{nav.name}</p>
                          <p className="text-xs text-gray-500">{nav.link}</p>
                        </div>
                      </div>
                      <button onClick={() => removeNavLink(nav.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="border border-gray-100 rounded-3xl p-8 relative">
                <h3 className="text-lg font-bold text-gray-900">Call-to-Action Button</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Configure the CTA button in your header</p>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Button Text</label>
                    <input 
                      type="text" 
                      value={ctaText} 
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Button URL</label>
                    <input 
                      type="text" 
                      value={ctaUrl} 
                      onChange={(e) => setCtaUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2">Background Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={ctaBg} 
                          onChange={(e) => setCtaBg(e.target.value)}
                          className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                        />
                        <input 
                          type="text" 
                          value={ctaBg} 
                          onChange={(e) => setCtaBg(e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2">Text Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={ctaColor} 
                          onChange={(e) => setCtaColor(e.target.value)}
                          className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                        />
                        <input 
                          type="text" 
                          value={ctaColor} 
                          onChange={(e) => setCtaColor(e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
                    <span className="text-xs font-bold text-gray-400 self-start">Button Preview:</span>
                    <button 
                      className="px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: ctaBg, color: ctaColor }}
                    >
                      {ctaText}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <button 
                  onClick={saveHeaderSettings}
                  disabled={isSavingHeader}
                  className={cn(
                    "px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all",
                    isSavingHeader ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                  )}
                >
                  {isSavingHeader ? "Updating..." : "Update Header"}
                </button>
              </div>

            </div>
          )}
          
          {activeTab !== "header" && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                <Settings2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{activeTab} Settings</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Configuration options for the {activeTab} will be available in the next update.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <img 
                src={previewImage} 
                alt="Theme Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
