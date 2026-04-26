"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <Image 
          src="/logo.png" 
          alt="CoreHead Logo" 
          width={180} 
          height={50} 
          className="h-10 w-auto object-contain mb-2" 
          priority
        />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-400 text-sm font-medium animate-pulse tracking-wide">Loading Dashboard...</p>
        </div>
      </div>
    </div>
  );
}
