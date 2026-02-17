"use client";

import { motion } from "framer-motion";
import { LayoutGrid, FileText, Sparkles } from "lucide-react";

const features = [
  {
    title: "Drag & Drop Builder",
    description:
      "create stunning blog layouts with an intuitive drag-and-drop interface, no coding needed",
    icon: LayoutGrid,
    color: "bg-blue-100/50",
  },
  {
    title: "Dynamic CMS Snippets",
    description:
      "Easily bind blog content like titles, images, and experts from your CMS data.",
    icon: FileText,
    color: "bg-blue-100/50",
  },
  {
    title: "AI - Powered Assistant",
    description:
      "Use AI to generate and refine blog layouts that match your content and style preferences",
    icon: Sparkles, // Sparkles is a good fit for AI
    color: "bg-blue-100/50",
  },
];

export default function FeatureCards() {
  return (
    <section className="px-6 pb-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="group relative p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 text-center flex flex-col items-center"
          >
            <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-blue-100 shadow-sm text-slate-900 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {feature.title}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
