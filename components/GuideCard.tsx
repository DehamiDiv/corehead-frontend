"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GuideCardProps {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image?: string; // Optional image prop if we had images, but for now we might use placeholders or gradients
  delay?: number;
}

export default function GuideCard({
  title,
  description,
  tags,
  link,
  delay = 0,
}: GuideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail Placeholder - would be an image in real implementation */}
      <div className="relative h-48 bg-slate-100 overflow-hidden group-hover:bg-slate-200 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <span className="text-4xl font-bold text-slate-300 select-none opacity-40">
            CoreHead
          </span>
        </div>

        {/* Tags Overlay */}
        <div className="absolute bottom-4 right-4 flex flex-wrap justify-end gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {description}
        </p>

        {/* Not strictly needed as the whole card is clickable usually, but good for visual affordance */}
        {/* <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-blue-600 font-semibold text-sm">
          Read Guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div> */}
      </div>

      {/* Full card link overlay */}
      <Link
        href={link}
        className="absolute inset-0 z-10"
        aria-label={`Read guide: ${title}`}
      />
    </motion.div>
  );
}
