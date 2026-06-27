"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutTemplate, FileText, Sparkles, ArrowUpRight, MessageSquare, ImageIcon } from "lucide-react";

const features = [
  {
    title: "Posts Management",
    description: "Write, edit, and organize your blog posts with a premium rich-text experience.",
    icon: FileText,
    color: "blue",
    href: "/admin/posts"
  },
  {
    title: "Interactions",
    description: "Moderate comments and engage with your readers in real-time with ease.",
    icon: MessageSquare,
    color: "emerald",
    href: "/admin/comments"
  },
  {
    title: "Media Library",
    description: "Upload and manage all your assets in a unified cloud-based storage system.",
    icon: ImageIcon,
    color: "purple",
    href: "/admin/media"
  },
];

export default function FeatureCards() {
  return (
    <section className="px-8 pb-20">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Link href={feature.href} key={index} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative p-10 rounded-[32px] bg-white border border-slate-100 text-left flex flex-col hover:border-blue-100 transition-all duration-500 shadow-xl shadow-slate-900/5 h-full min-h-[320px] group-hover:shadow-2xl group-hover:shadow-blue-900/5"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={cn(
                  "p-5 rounded-[22px] transition-all duration-500",
                  feature.color === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20" :
                  feature.color === "emerald" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20" :
                  "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/20"
                )}>
                  <feature.icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-[22px] font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-500 leading-relaxed font-medium text-[14px]">
                {feature.description}
              </p>

              {/* Decorative line */}
              <div className="mt-auto pt-8 flex items-center gap-2 overflow-hidden">
                 <div className="h-1.5 w-12 bg-slate-100 rounded-full group-hover:w-20 group-hover:bg-blue-500 transition-all duration-500" />
                 <div className="h-1.5 w-1.5 bg-slate-100 rounded-full group-hover:bg-blue-200 transition-all duration-500" />
                 <div className="h-1.5 w-1.5 bg-slate-100 rounded-full group-hover:bg-blue-200 transition-all duration-500" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
