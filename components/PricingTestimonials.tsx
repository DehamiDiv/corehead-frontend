"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "William Hazelip",
    role: "Homeowner",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
    stars: 5,
    title: "Sparkling Clean Home",
    quote: "Tellus aliquam faucibus imperdiet eget interdum risus diam.",
    bg: "bg-blue-600",
  },
  {
    name: "Teresa Hamilton",
    role: "Homeowner",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teresa",
    stars: 5,
    title: "Professional & Reliable",
    quote: "Tellus aliquam faucibus imperdiet eget interdum risus diam.",
    bg: "bg-blue-600",
  },
  {
    name: "Louis Swanson",
    role: "Homeowner",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Louis",
    stars: 5,
    title: "Flexible Scheduling",
    quote: "Tellus aliquam faucibus imperdiet eget interdum risus diam.",
    bg: "bg-blue-600",
  },
];

export default function PricingTestimonials() {
  return (
    <section className="py-24 px-6 md:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 max-w-lg leading-tight">
            Testimonials from Satisfied Customers
          </h2>
          <button className="hidden md:block px-6 py-2.5 bg-white border border-slate-200 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 pb-12 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full ${t.bg} overflow-hidden`}
                >
                  {/* Using the colored circle placeholder style from image if image fails to load, but image should work */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-none mb-1">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-green-400 fill-current"
                  />
                ))}
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-3">
                {t.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {t.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
