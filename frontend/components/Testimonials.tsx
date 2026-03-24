"use client";

import { motion } from "framer-motion";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "William Hazelip",
    role: "Homeowner",
    title: "Sparkling Clean Home",
    quote: "Tellus aliquam faucibus imperdiet eget interdum risus diam.",
    image: "", // Placeholder or use initials/color
    color: "bg-blue-600",
  },
  {
    name: "Teresa Hamilton",
    role: "Homeowner",
    title: "Professional & Reliable",
    quote: "Tellus aliquam faucibus imperdiet eget interdum risus diam.",
    image: "",
    color: "bg-blue-600",
  },
  {
    name: "Louis Swanson",
    role: "Homeowner",
    title: "Flexible Scheduling",
    quote: "Tellus aliquam faucibus imperdiet eget interdum risus diam.",
    image: "",
    color: "bg-blue-600",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight max-w-lg">
            Testimonials from Satisfied Customers
          </h2>
          <button className="px-6 py-2.5 rounded-full bg-slate-50 text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors border border-slate-200">
            View All
          </button>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full ${t.color} shrink-0`}
                ></div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-lime-400 fill-lime-400"
                  />
                ))}
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {t.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">{t.quote}</p>
            </motion.div>
          ))}
        </div>

        {/* Video Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-blue-600 p-8 md:p-12 lg:p-16 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold max-w-sm">
              Hear genuine stories from users
            </h2>
            <p className="text-blue-100 max-w-sm text-right md:text-left">
              Real customers share how our service transformed their website
              speed and boosted performance.
            </p>
          </div>

          {/* Video Carousel Mockup */}
          <div className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-slate-200/20 relative overflow-hidden group cursor-pointer hover:bg-slate-200/30 transition-colors"
                >
                  {/* Placeholder user image */}
                  <div className="absolute inset-0 bg-blue-800/40"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Nav arrows */}
            <button className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
