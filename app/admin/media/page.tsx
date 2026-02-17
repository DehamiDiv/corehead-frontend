"use client";

import {
  Upload,
  Image as ImageIcon,
  Video,
  File,
  MoreVertical,
} from "lucide-react";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
          <p className="text-slate-500 mt-1">
            Manage images, videos and files.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Upload className="w-4 h-4" />
          Upload New
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
              <ImageIcon className="w-10 h-10" />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
              <button className="p-1 bg-white rounded-md shadow-sm text-slate-600 hover:text-slate-900">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm border-t border-slate-100 text-xs font-medium text-slate-600 truncate">
              image-{i + 1}.jpg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
