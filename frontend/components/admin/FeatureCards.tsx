"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutTemplate, FileText, Sparkles, ArrowUpRight, Settings, Image as ImageIcon, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Visual Builder",
    description: "Design stunning landing pages with our intuitive drag-and-drop editor. No coding required.",
    icon: LayoutTemplate,
    color: "blue",
    glow: "shadow-blue-500/20",
    href: "/builder"
  },
  {
    title: "AI Layout Generator",
    description: "Generate entire sections or pages using just a text prompt. Fast, creative, and smart.",
    image: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304fb62aa258b39.svg",
    color: "purple",
    glow: "shadow-purple-500/20",
    href: "/ai-prompt"
  },
  {
    title: "Blog Management",
    description: "Create, edit, and organize your blog posts. Manage content seamlessly.",
    icon: FileText,
    color: "emerald",
    glow: "shadow-emerald-500/20",
    href: "/admin/blogs"
  },
];

export default function FeatureCards() {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600",
    slate: "bg-slate-50 text-slate-600 group-hover:bg-slate-600",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600",
  };

  const lineMap: any = {
    blue: "group-hover:bg-blue-600",
    purple: "group-hover:bg-purple-600",
    emerald: "group-hover:bg-emerald-600",
    orange: "group-hover:bg-orange-600",
    slate: "group-hover:bg-slate-600",
    rose: "group-hover:bg-rose-600",
  };

  return (
    <section className="px-8 pb-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link href={feature.href} key={index} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`relative p-8 rounded-[2.5rem] bg-white border border-slate-100 text-left flex flex-col hover:border-transparent transition-all duration-500 hover:shadow-2xl ${feature.glow} h-full overflow-hidden`}
            >
              {/* Background Accent Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${feature.color}-400/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />

              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${colorMap[feature.color]} group-hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center`}>
                  {feature.image ? (
                    <img src={feature.image} alt="Gemini" className="w-7 h-7 group-hover:invert group-hover:brightness-0 transition-all" />
                  ) : (
                    feature.icon && <feature.icon className="w-7 h-7" strokeWidth={2} />
                  )}
                </div>
                <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:text-slate-900 group-hover:bg-white transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {feature.title}
              </h3>

              <p className="text-slate-500 leading-relaxed font-semibold text-sm mb-6 flex-grow">
                {feature.description}
              </p>

              {/* Decorative line */}
              <div className={`h-1.5 w-10 bg-slate-100 rounded-full group-hover:w-full ${lineMap[feature.color]} transition-all duration-500`} />
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
