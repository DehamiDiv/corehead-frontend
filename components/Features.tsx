"use client";

import { motion } from "framer-motion";
import { Users, LayoutGrid, ArrowRight } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Block 1: About Us */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-sm border border-slate-100">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 border border-slate-200 text-slate-600 text-sm font-medium">
              <Users className="w-4 h-4" />
              About Us
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Decoupled Content, Engineered for Speed
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              We streamline content delivery with a focus on security, seamless
              deployment, and uncompromised performance.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all hover:text-blue-700"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="w-full lg:w-1/2">
            {/* Mock Dashboard Image - Right */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white aspect-[4/3] group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-slate-100/50"></div>
              {/* Simple dashboard representation */}
              <div className="absolute top-4 left-4 right-4 bottom-4 bg-white rounded-lg shadow-inner p-4 border border-slate-100 flex gap-4">
                {/* Sidebar */}
                <div className="w-1/4 h-full bg-slate-50 rounded-md space-y-2 p-2">
                  <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                </div>
                {/* Content */}
                <div className="w-3/4 h-full space-y-3">
                  <div className="h-6 w-1/2 bg-slate-100 rounded"></div>
                  <div className="h-32 w-full bg-slate-50 rounded border border-slate-100"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-1/3 bg-blue-100 rounded"></div>
                    <div className="h-8 w-1/3 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Block 2: Features */}
        <div className="bg-white rounded-3xl flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            {/* Mock Dashboard Image - Left (Blue Background based on image) */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-blue-200 bg-blue-500 aspect-[4/3] p-1 group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400"></div>
              {/* Dashboard inside */}
              <div className="relative h-full w-full bg-white rounded-lg overflow-hidden shadow-lg p-3">
                {/* Header */}
                <div className="h-6 w-full bg-slate-50 border-b border-slate-100 mb-3 flex items-center px-2 gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex bg-slate-50 h-full">
                  {/* Sidebar Mock */}
                  <div className="w-16 border-r border-slate-200 p-2 space-y-2">
                    <div className="h-2 w-8 bg-blue-200 rounded"></div>
                    <div className="h-2 w-10 bg-slate-200 rounded"></div>
                    <div className="h-2 w-6 bg-slate-200 rounded"></div>
                  </div>
                  {/* List Layout Mock */}
                  <div className="flex-1 p-3 space-y-2">
                    <div className="h-4 w-32 bg-slate-100 rounded"></div>
                    <div className="space-y-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-1 border-b border-slate-50"
                        >
                          <div className="h-2 w-4 bg-slate-200 rounded"></div>
                          <div className="h-2 w-20 bg-slate-100 rounded"></div>
                          <div className="h-2 w-10 bg-green-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium">
              <LayoutGrid className="w-4 h-4" />
              Features
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Fast & Developer-Friendly CMS Built for Performance
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Built for stability and speed, CoreHead uses the best tools for
              every job.
            </p>

            <ul className="space-y-3 mt-4">
              {[
                "100ms Typical API Response Time",
                "Intuitive Rich-Text Editor",
                "Secure Session Management",
                "1 Click Docker Compose Setup",
                "Scalable Media Storage",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
