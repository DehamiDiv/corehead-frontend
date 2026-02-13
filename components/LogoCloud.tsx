"use client";

import { motion } from "framer-motion";

const logos = [
  {
    name: "Acme Corp",
    src: "https://generated.vusercontent.net/placeholder.svg?height=40&width=120&text=Acme",
  },
  {
    name: "Globex",
    src: "https://generated.vusercontent.net/placeholder.svg?height=40&width=120&text=Globex",
  },
  {
    name: "Soylent Corp",
    src: "https://generated.vusercontent.net/placeholder.svg?height=40&width=120&text=Soylent",
  },
  {
    name: "Initech",
    src: "https://generated.vusercontent.net/placeholder.svg?height=40&width=120&text=Initech",
  },
  {
    name: "Umbrella",
    src: "https://generated.vusercontent.net/placeholder.svg?height=40&width=120&text=Umbrella",
  },
  {
    name: "Cyberdyne",
    src: "https://generated.vusercontent.net/placeholder.svg?height=40&width=120&text=Cyberdyne",
  },
];

export default function LogoCloud() {
  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
          Trusted by innovative teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Using a text placeholder for now since we don't have actual SVG assets. 
                 In a real app, these would be <img /> or <svg /> tags. */}
              <div className="h-8 flex items-center justify-center font-bold text-xl text-slate-400 select-none">
                {logo.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
