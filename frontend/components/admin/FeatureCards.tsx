"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutTemplate, FileText, Sparkles, ArrowUpRight, MessageSquare, Image as ImageIcon, Map } from "lucide-react";

const features = [
  {
    title: "Visual Builder",
    description: "Design stunning landing pages with our intuitive drag-and-drop editor. No coding required.",
    icon: LayoutTemplate,
    color: "blue",
    glow: "shadow-blue-500/20",
    href: "/admin/builder"
  },
  {
    title: "AI Layout Generator",
    description: "Generate entire sections or pages using just a text prompt. Fast, creative, and smart.",
    icon: Sparkles,
    color: "purple",
    glow: "shadow-purple-500/20",
    href: "/ai-prompt"
  },
  {
    title: "Content Management",
    description: "Moderate comments, manage categories, media library, and organize your blog posts.",
    icon: FileText,
    color: "emerald",
    glow: "shadow-emerald-500/20",
    href: "/admin/posts"
  },
  {
    title: "Layout Templates",
    description: "Manage visual layout templates and map them to blog categories.",
    icon: Map,
    color: "indigo",
    glow: "shadow-indigo-500/20",
    href: "/admin/layouts"
  },
  {
    title: "Media Library",
    description: "Upload and manage all your assets in a unified cloud-based storage system.",
    icon: ImageIcon,
    color: "purple",
    glow: "shadow-purple-500/20",
    href: "/admin/media"
  },
  {
    title: "Interactions",
    description: "Moderate comments and engage with your readers in real-time with ease.",
    icon: MessageSquare,
    color: "orange",
    glow: "shadow-orange-500/20",
    href: "/admin/comments"
  }
];

export default function FeatureCards() {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600",
    slate: "bg-slate-50 text-slate-600 group-hover:bg-slate-600",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
  };

  const lineMap: any = {
    blue: "group-hover:bg-blue-600",
    purple: "group-hover:bg-purple-600",
    emerald: "group-hover:bg-emerald-600",
    orange: "group-hover:bg-orange-600",
    slate: "group-hover:bg-slate-600",
    rose: "group-hover:bg-rose-600",
    indigo: "group-hover:bg-indigo-600",
  };

  return (
    <section className="px-8 pb-20">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Link href={feature.href} key={index} className="block group h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={cn(
                "relative p-10 rounded-[32px] bg-white border border-slate-100 text-left flex flex-col hover:border-blue-100 transition-all duration-500 shadow-xl shadow-slate-900/5 h-full min-h-[320px] group-hover:shadow-2xl group-hover:shadow-blue-900/5 overflow-hidden",
                feature.glow
              )}
            >
              {/* Background Accent Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={cn(
                  "p-5 rounded-[22px] transition-all duration-500 flex items-center justify-center",
                  colorMap[feature.color] || "bg-slate-50 text-slate-600"
                )}>
                  <feature.icon className="w-8 h-8 group-hover:text-white transition-all duration-300" strokeWidth={2.5} />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-[22px] font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors relative z-10">
                {feature.title}
              </h3>

              <p className="text-slate-500 leading-relaxed font-medium text-[14px] flex-grow relative z-10">
                {feature.description}
              </p>

              {/* Decorative line */}
              <div className="mt-auto pt-8 flex items-center gap-2 overflow-hidden relative z-10">
                <div className={cn("h-1.5 w-12 bg-slate-100 rounded-full group-hover:w-full transition-all duration-500", lineMap[feature.color])} />
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
