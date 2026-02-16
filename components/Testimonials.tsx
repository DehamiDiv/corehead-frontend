"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Corehead makes it so easy for our marketing team to publish content without needing engineering time.",
    author: "Sarah Jenkins",
    role: "CMO at TechFlow",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    quote:
      "The visual builder is incredible. I can clearly see how my post will look on mobile and desktop while I'm writing.",
    author: "Michael Chen",
    role: "Content Creator",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    quote:
      "Collaboration features are a lifesaver. No more passing Google Docs back and forth.",
    author: "Alex Rivera",
    role: "Editor in Chief",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
            Loved by content teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-blue-500/5 relative hover:shadow-xl hover:shadow-blue-500/10 transition-all"
            >
              <p className="text-lg text-slate-600 mb-8 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full border border-slate-200"
                />
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
