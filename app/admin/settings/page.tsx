"use client";

import { Save, Globe, Lock, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage global site configuration.</p>
      </div>

      <div className="grid gap-8">
        {/* General Section */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              General
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                Site Name
              </label>
              <input
                type="text"
                defaultValue="CoreHead"
                className="input-field"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                Site Description
              </label>
              <textarea
                defaultValue="Design intelligent blogs in minutes."
                className="input-field h-24"
              />
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Appearance
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-700">Dark Mode</div>
                <div className="text-xs text-slate-500">
                  Enable dark theme for the site
                </div>
              </div>
              <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer opacity-80">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-200">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all;
        }
      `}</style>
    </div>
  );
}
