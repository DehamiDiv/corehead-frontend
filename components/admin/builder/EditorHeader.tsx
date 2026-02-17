"use client";

import Link from "next/link";
import { ArrowLeft, Save, Eye, MonitorPlay } from "lucide-react";

export default function EditorHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="text-xl font-bold text-slate-800">CoreHead</span>
        </Link>
        <span className="text-lg font-semibold text-slate-700">
          Visual Blog Editor
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full text-sm font-medium transition-colors"
        >
          Exit Editor
        </Link>
        <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
          Publish Post
        </button>
        <Link href="/admin/builder/preview">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
            Preview Post
          </button>
        </Link>
        <Link href="/admin/builder/draft">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
        </Link>
      </div>
    </header>
  );
}
