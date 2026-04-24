"use client";

import { motion } from "framer-motion";

export default function TechStack() {
  const techs = [
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "NEXT.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "OpenAI", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  ];

  return (
    <section className="py-32 text-center relative overflow-hidden">
      <div className="mb-10">
         <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Built with Modern Infrastructure</p>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="flex flex-wrap items-center justify-center gap-16 md:gap-24"
      >
        {techs.map((tech, i) => (
          <div key={i} className="flex items-center gap-4 group cursor-default">
            <img
              src={tech.icon}
              alt={tech.name}
              className="h-14 w-14 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
            />
            <span className="font-black text-3xl text-gray-200 group-hover:text-gray-900 transition-colors duration-500 tracking-tighter italic">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
