"use client";

import { motion } from "framer-motion";
import { Zap, Users, Globe, LayoutGrid, BarChart3, Image } from "lucide-react";

const features = [
  {
    icon: <LayoutGrid className="w-6 h-6 text-blue-500" />,
    title: "Visual Builder",
    description:
      "Drag and drop interface to create stunning blog posts without writing code.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Instant Preview",
    description: "See exactly how your content will look before you publish.",
  },
  {
    icon: <Users className="w-6 h-6 text-green-500" />,
    title: "Team Collaboration",
    description:
      "Invite your team, leave comments, and review changes in real-time.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    title: "Built-in SEO",
    description:
      "Automatic SEO optimization suggestions to help your content rank better.",
  },
  {
    icon: <Image className="w-6 h-6 text-pink-500" />,
    title: "Media Management",
    description:
      "Upload, organize, and edit your images and media files in one place.",
  },
  {
    icon: <Globe className="w-6 h-6 text-orange-500" />,
    title: "Easy Publishing",
    description:
      "Publish to your existing site or use our hosted platform with one click.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 px-6 md:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
            Everything you need to blog
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Focus on creating great content. We handle the formatting, SEO, and
            publishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all group"
            >
              <div className="mb-4 p-3 rounded-lg bg-slate-50 w-fit group-hover:bg-blue-50 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
