"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Globe,
  MessageSquare,
  Tag,
  Eye,
} from "lucide-react";

export default function BlogSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Blog Settings</h1>
            <p className="text-slate-500">
              Configure publication details and interactions.
            </p>
          </div>
          <Link
            href="/admin/builder"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Publishing Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Publishing
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Visibility
                </label>
                <select className="input-field">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Password Protected</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Publish Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="datetime-local" className="input-field pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Author
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select className="input-field pl-9">
                    <option>Admin User</option>
                    <option>Editor User</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Taxonomy */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-500" />
              Taxonomy
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Categories
                </label>
                <div className="space-y-2 border border-slate-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {[
                    "Development",
                    "Design",
                    "Tutorials",
                    "News",
                    "Updates",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Separate tags with commas..."
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Interaction */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-500" />
              Interaction
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Allow Comments
                  </div>
                  <div className="text-xs text-slate-500">
                    Users can leave comments on this post
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Allow Pings
                  </div>
                  <div className="text-xs text-slate-500">
                    Allow trackbacks and pingbacks
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/builder">
            <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
              Cancel
            </button>
          </Link>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            Save Changes
          </button>
        </div>

        <style jsx>{`
          .input-field {
            @apply w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all;
          }
        `}</style>
      </div>
    </div>
  );
}
