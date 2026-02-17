"use client";

import Link from "next/link";
import {
  CheckCircle,
  ArrowLeft,
  Image as ImageIcon,
  Globe,
  Calendar,
  Clock,
} from "lucide-react";

export default function SaveDraftPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Draft Saved Successfully!
          </h1>
          <p className="text-slate-500 text-lg">
            Your progress has been saved. You can safely close this window or
            configure post settings below.
          </p>
        </div>

        {/* Post Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Post Settings
            </h2>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
              Draft Status
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Slug / URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                URL Slug
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                  corehead.app/blog/
                </span>
                <input
                  type="text"
                  defaultValue="future-of-ai-web-development"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Featured Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Click to upload image
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  SVG, PNG, JPG or GIF (max. 2MB)
                </div>
              </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Meta Description (SEO)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Brief summary of your post for search engines..."
                defaultValue="Explore the transformative impact of Artificial Intelligence on modern web development workflows and future trends."
              />
              <div className="text-xs text-right text-slate-400">
                115 / 160 characters
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created: Oct 24, 2024
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Last Saved: Just now
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/admin/builder"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
          <div className="flex gap-3">
            <Link href="/admin/blogs">
              <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
                View All Posts
              </button>
            </Link>
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
