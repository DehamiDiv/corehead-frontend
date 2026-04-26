"use client";

import { motion } from "framer-motion";

export default function TechStack() {
  const techs = [
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "Prisma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Gemini AI", icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304fb62aa258b39.svg" },
  ];

  return (
    <section className="pb-12 pt-0 text-center relative">
      <div className="mb-8">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Core Technology Infrastructure</p>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 1 }}
        className="flex flex-wrap items-center justify-center gap-12 md:gap-16"
      >
        {techs.map((tech, i) => (
          <div key={i} className="flex items-center gap-3 group cursor-default">
            <img
              src={tech.icon}
              alt={tech.name}
              className="h-8 w-8 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
            />
            <span className="font-bold text-lg text-slate-300 group-hover:text-slate-900 transition-colors duration-500 tracking-tight">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
