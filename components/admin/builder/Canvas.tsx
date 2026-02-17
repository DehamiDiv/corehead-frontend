"use client";

import { FileText } from "lucide-react";

export default function Canvas() {
  return (
    <div className="flex-1 bg-slate-100/50 p-8 flex justify-center overflow-y-auto">
      <div className="w-full max-w-3xl bg-white min-h-[800px] rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center relative">
        <div className="flex flex-col items-center text-center opacity-40 hover:opacity-100 transition-opacity">
          <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center mb-6 bg-slate-50">
            <FileText className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            Start Building your blog post
          </h2>
          <p className="text-slate-500">Drag components from the left panel</p>
        </div>
      </div>
    </div>
  );
}
