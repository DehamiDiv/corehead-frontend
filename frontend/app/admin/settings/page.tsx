"use client";

import { useState } from "react";
import { Save, Globe, Lock, Bell, Palette, Layout, Shield, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("General");

  const sections = [
    { id: "General", icon: Globe },
    { id: "Appearance", icon: Palette },
    { id: "Security", icon: Shield },
    { id: "Notifications", icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your global platform settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                activeSection === section.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.id}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeSection === "General" && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
              <div className="p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">General Configuration</h2>
                <p className="text-sm text-gray-500 mt-1">Basic site information and global metadata.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Site Name</label>
                    <input 
                      type="text" 
                      defaultValue="CoreHead CMS"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Support Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@corehead.app"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Site Description</label>
                  <textarea 
                    rows={4}
                    defaultValue="Design intelligent blogs in minutes with our AI-powered visual builder."
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Brand Keywords</label>
                  <input 
                    type="text" 
                    defaultValue="AI, CMS, Blog, Builder, Visual"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "Appearance" && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
              <div className="p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Branding & Look</h2>
                <p className="text-sm text-gray-500 mt-1">Customize the visual identity of your platform.</p>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <p className="text-sm font-bold text-gray-700">Primary Color</p>
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-blue-600 shadow-lg shadow-blue-100" />
                       <input 
                         type="text" 
                         defaultValue="#2563EB"
                         className="flex-1 px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-mono"
                       />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <p className="text-sm font-bold text-gray-700">Secondary Color</p>
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-slate-900" />
                       <input 
                         type="text" 
                         defaultValue="#0F172A"
                         className="flex-1 px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-mono"
                       />
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-sm font-bold text-gray-700">Theme Selection</p>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {["Light", "Dark", "System"].map(theme => (
                        <div key={theme} className={cn(
                          "p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3",
                          theme === "Light" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100 hover:border-gray-200"
                        )}>
                          <div className={cn(
                            "h-24 w-full rounded-xl",
                            theme === "Light" ? "bg-white shadow-sm" : theme === "Dark" ? "bg-slate-900" : "bg-gradient-to-r from-white to-slate-900"
                          )} />
                          <span className="text-sm font-bold text-gray-900">{theme} Mode</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Save className="w-4 h-4" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
