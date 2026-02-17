"use client";

import { FileText } from "lucide-react";

export default function Canvas() {
  return (
    <div className="flex-1 bg-white m-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center text-center opacity-50">
        <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mb-6 bg-gray-50">
          <FileText className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">
          Start Building your blog post
        </h2>
        <p className="text-slate-500">Drag components from the left panel</p>
      </div>
    </div>
  );
}
