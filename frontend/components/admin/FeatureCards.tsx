"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutTemplate, FileText, Sparkles, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Visual Builder",
    description: "Create stunning layouts with an intuitive drag-and-drop interface. No coding required.",
    icon: LayoutTemplate,
    color: "blue",
    href: "/admin/builder"
  },
  {
    title: "Content Sync",
    description: "Easily bind dynamic CMS data like titles, images, and excerpts to your layouts.",
    icon: FileText,
    color: "emerald",
    href: "/admin/snippets"
  },
  {
    title: "AI Co-pilot",
    description: "Use advanced AI to generate and refine layouts that perfectly match your brand.",
    icon: Sparkles,
    color: "purple",
    href: "/admin/posts"
  },
];

export default function FeatureCards() {
  return (
    <section className="px-8 pb-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Link href={feature.href} key={index} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative p-8 rounded-[2.5rem] bg-white border border-gray-100 text-left flex flex-col hover:border-blue-200 transition-all duration-300 shadow-xl shadow-gray-200/20 h-full min-h-[300px]"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 group-hover:bg-${feature.color}-600 group-hover:text-white transition-colors duration-300`}>
                  <feature.icon className="w-8 h-8" strokeWidth={2} />
                </div>
                <div className="p-2 rounded-full bg-gray-50 text-gray-300 group-hover:text-blue-600 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-relaxed font-semibold text-sm">
                {feature.description}
              </p>

              {/* Decorative line */}
              <div className="mt-8 h-1 w-12 bg-gray-100 rounded-full group-hover:w-full group-hover:bg-blue-600 transition-all duration-500" />
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
