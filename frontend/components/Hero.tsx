"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <section className="relative mx-4 mt-4 rounded-[40px] md:rounded-[60px] overflow-hidden bg-[#89CFF0] min-h-[90vh] flex flex-col items-center pt-32 pb-20">
      <Navbar />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-white/30 to-transparent skew-x-12 transform origin-top-right"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-white/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-blue-400/20 blur-[100px] rounded-full mix-blend-overlay"></div>

        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: "url('https://corehead.app/bg-main.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-5xl px-6 mx-auto text-center mt-8 mb-16"
      >
        <h1 className="max-w-4xl mx-auto text-2xl font-extrabold tracking-tight text-white md:text-7xl lg:text-[5rem] leading-[1.1] mb-8 drop-shadow-sm">
          The fastest foundation for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 drop-shadow-none">
            intelligent content.
          </span>
        </h1>

        <div className="flex flex-col items-center justify-center gap-5 sm:flex-row mt-10">
          <Link
            href="/signup"
            className="group flex items-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-blue-700 rounded-full hover:bg-blue-800 shadow-[0_0_40px_-10px_rgba(29,78,216,0.5)] hover:shadow-[0_0_60px_-15px_rgba(29,78,216,0.7)] hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/#features"
            className="px-8 py-4 text-lg font-bold text-blue-900 transition-all duration-300 bg-white/20 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/30 hover:-translate-y-1 shadow-lg shadow-black/5"
          >
            View Components
          </Link>
        </div>
      </motion.div>

      {/* YouTube Video Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100 }}
        className="relative z-20 w-full max-w-3xl px-6 mb-10"
        style={{ perspective: "1000px" }}
      >
        <div className="relative w-full aspect-[16/9] bg-black/80 backdrop-blur-sm rounded-2xl md:rounded-[32px] shadow-2xl shadow-blue-900/40 border border-white/40 overflow-hidden group hover:border-white/60 transition-colors duration-500">
          {/* Mock UI Header */}
          <div className="absolute inset-x-0 top-0 h-10 md:h-12 bg-white/10 backdrop-blur-md border-b border-white/10 flex items-center px-4 md:px-6 gap-2 z-10">
            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            <div className="ml-2 md:ml-4 text-[10px] md:text-xs text-white/70 font-medium font-mono flex-1 text-center pr-12 md:pr-16 tracking-wider">
              corehead.io/demo
            </div>
          </div>
          {/* YouTube Iframe */}
          <div className="w-full h-full pt-10 md:pt-12">
            <iframe
              src="https://www.youtube.com/embed/hx2W4fmqw_w?autoplay=1&mute=1&loop=1&playlist=hx2W4fmqw_w&controls=0&showinfo=0&rel=0"
              title="CoreHead Demo Video"
              className="w-full h-full object-cover scale-[1.01]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
