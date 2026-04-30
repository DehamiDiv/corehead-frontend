"use client";

import { motion } from "framer-motion";

export default function TechStack() {
  const techs = [
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "Prisma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  ];

  return (
    <section className="py-24 text-center relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-[3rem] border border-white/20 mx-8">
      <div className="mb-16">
         <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.3em]">Built with Enterprise Infrastructure</p>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="flex flex-wrap items-center justify-center gap-16 md:gap-24 px-8"
      >
        {techs.map((tech, i) => (
          <div key={i} className="flex items-center gap-5 group cursor-default">
            <div className="relative">
              <img
                src={tech.icon}
                alt={tech.name}
                className="h-12 w-12 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-6"
              />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="font-bold text-3xl text-slate-200 group-hover:text-slate-900 transition-all duration-700 tracking-tighter">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
