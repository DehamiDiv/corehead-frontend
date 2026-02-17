"use client";

import Link from "next/link";
import { ArrowLeft, Save, Eye, MonitorPlay } from "lucide-react";

export default function EditorHeader() {
  return (
    <header className="h-16 bg-blue-50/50 backdrop-blur-sm border-b border-blue-100 flex items-center justify-between px-6 sticky top-0 z-50">
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Exit Editor
        </Link>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          Publish Post
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          Preview Post
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          Save Draft
        </button>
      </div>
    </header>
  );
}
