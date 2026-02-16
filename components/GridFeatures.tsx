"use client";

import { motion } from "framer-motion";
import { PenTool, Users, Search, Zap, Layout, Server } from "lucide-react";

const features = [
  {
    icon: <PenTool className="w-8 h-8 text-purple-600" />,
    title: "Smart Content Editor",
    description:
      "Write, format, and publish blog posts with our intuitive editor. Supports markdown, rich media embedding, and real-time preview for seamless content creation.",
    bg: "bg-purple-100",
  },
  {
    icon: <Users className="w-8 h-8 text-pink-600" />,
    title: "Team Collaboration Hub",
    description:
      "Manage multiple authors with role-based permissions. Streamline your workflow with draft reviews, content approval, and team activity tracking all in one place.",
    bg: "bg-pink-100",
  },
  {
    icon: <Search className="w-8 h-8 text-blue-600" />,
    title: "SEO Optimization", // Corrected title based on description
    description:
      "Optimize every post with AI friendly metadata, automatic sitemaps and analytics integration. Get your content discovered and track what's working.",
    bg: "bg-blue-100",
  },
  {
    icon: <Zap className="w-8 h-8 text-green-600" />,
    title: "Superfast Performance",
    description:
      "Built on Go and Next.js for blazing speed. Your readers get instant page loads, while you enjoy a smooth admin experience that never slows down.",
    bg: "bg-green-100",
  },
  {
    icon: <Layout className="w-8 h-8 text-yellow-600" />,
    title: "Custom Pages Builder",
    description:
      "Create custom HTML pages beyond blog posts. Build landing pages, about pages, or any static content with full route control and seamless integration with your blog.",
    bg: "bg-yellow-100",
  },
  {
    icon: <Server className="w-8 h-8 text-blue-600" />,
    title: "Lightweight & Efficient",
    description:
      "Ultra-lightweight architecture that saves your money. Deploy in seconds, consume minimal server resources, yet scale to thousands of posts and visitors with ease.",
    bg: "bg-blue-100", // Using blue based on icon color in image
  },
];

export default function GridFeatures() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 max-w-xl leading-tight">
            Everything you need to build and scale your content
          </h2>
          <p className="text-slate-500 text-lg max-w-md leading-relaxed">
            Streamline your publishing workflow with a platform engineered for
            speed, collaboration, and SEO success. No bloat, just performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
