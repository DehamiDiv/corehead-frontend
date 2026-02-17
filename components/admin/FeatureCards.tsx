"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, FileText, Sparkles } from "lucide-react"; // Changed LayoutGrid to LayoutTemplate for better match

const features = [
  {
    title: "Drag & Drop Builder",
    description:
      "create stunning blog layouts with an intuitive drag-and-drop interface, no coding needed",
    icon: LayoutTemplate,
  },
  {
    title: "Dynamic CMS Snippets",
    description:
      "Easily bind blog content like titles, images, and experts from your CMS data.",
    icon: FileText,
  },
  {
    title: "AI - Powered Assistant",
    description:
      "Use AI to generate and refine blog layouts that match your content and style preferences",
    icon: Sparkles,
  },
];

export default function FeatureCards() {
  return (
    <section className="px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="p-10 rounded-[2.5rem] bg-blue-300/30 backdrop-blur-sm border border-white/20 text-center flex flex-col items-center hover:bg-blue-300/40 transition-colors shadow-lg shadow-blue-900/5 h-[320px] justify-center"
          >
            <div className="mb-6">
              <feature.icon
                className="w-10 h-10 text-slate-800"
                strokeWidth={1.5}
              />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {feature.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-[280px] font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
