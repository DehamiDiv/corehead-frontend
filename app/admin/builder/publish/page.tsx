"use client";

import Link from "next/link";
import {
  Check,
  ArrowRight,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  Home,
} from "lucide-react";
import { useState } from "react";

export default function PublishPage() {
  const [copied, setCopied] = useState(false);
  const postUrl = "https://corehead.app/blog/future-of-ai-web-development";

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Check className="w-12 h-12" strokeWidth={3} />
          </div>
          {/* Decorative dots/confetti could go here */}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Post Published!
          </h1>
          <p className="text-lg text-slate-600">
            Great job! Your post{" "}
            <span className="font-semibold text-slate-800">
              "The Future of AI in Web Development"
            </span>{" "}
            is now live.
          </p>
        </div>

        {/* Live Link Card */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 max-w-md mx-auto">
          <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-slate-600 text-sm truncate font-medium text-left">
            {postUrl}
          </div>
          <button
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
            title="Copy Link"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-100 transition-opacity">
                Copied!
              </span>
            )}
          </button>
          <a
            href="#"
            target="_blank"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ArrowRight className="w-5 h-5 -rotate-45" />
          </a>
        </div>

        {/* Share */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Share your post
          </h3>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:scale-110">
              <Twitter className="w-5 h-5" fill="currentColor" />
            </button>
            <button className="w-12 h-12 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all transform hover:scale-110">
              <Linkedin className="w-5 h-5" fill="currentColor" />
            </button>
            <button className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110">
              <Facebook className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <Link href="/admin">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Home className="w-4 h-4" />
              Dashboard
            </button>
          </Link>
          <Link href="/admin/builder">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              Write Another Post
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
