import { LayoutGrid, PenTool, Users, Shield, Zap, Cpu, Code } from "lucide-react";
import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Section 2: Fast & Developer-Friendly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
             {/* Blue Background Container */}
             <div className="relative rounded-[32px] overflow-hidden bg-[#0066FF] aspect-[1.2] p-8 shadow-2xl shadow-blue-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 opacity-50" />
                <div className="relative z-10 bg-white rounded-2xl h-full shadow-lg overflow-hidden border border-white/20">
                   <Image 
                    src="https://images.unsplash.com/photo-1551288049-bbbda536639a?w=1200&q=80" 
                    fill 
                    className="object-cover" 
                    alt="CoreHead Admin Posts" 
                   />
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <LayoutGrid className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-600">Features</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
              Fast & Developer-Friendly CMS Built for Performance
            </h2>

            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              Built for stability and speed, CoreHead uses the best tools for every job.
            </p>

            <ul className="space-y-4">
              {[
                "100ms Typical API Response Time",
                "Intuitive Rich-Text Editor",
                "Secure Session Management",
                "1 Click Docker Compose Setup",
                "Scalable Media Storage",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-semibold text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Bento Grid */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h2 className="text-4xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
              Everything you need to build <br />
              <span className="text-slate-900/40 italic font-serif">and scale your content</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
              Streamline your publishing workflow with a platform engineered for speed, collaboration, and SEO success. No bloat, just performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <PenTool className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-50",
                title: "Smart Content Editor",
                desc: "Write, format, and publish blog posts with our intuitive editor. Supports markdown, rich media embedding, and real-time preview for seamless content creation."
              },
              {
                icon: <Users className="w-6 h-6 text-rose-500" />,
                bg: "bg-rose-50",
                title: "Team Collaboration Hub",
                desc: "Manage multiple authors with role-based permissions. Streamline your workflow with draft reviews, content approval, and team activity tracking all in one place."
              },
              {
                icon: <Zap className="w-6 h-6 text-blue-500" />,
                bg: "bg-blue-50",
                title: "Built-in SEO Controls",
                desc: "Optimize every post with AI friendly metadata, automatic sitemaps and analytics integration. Get your content discovered and track what's working."
              },
              {
                icon: <Shield className="w-6 h-6 text-green-500" />,
                bg: "bg-green-50",
                title: "Superfast Performance",
                desc: "Built on Go and Next.js for blazing speed. Your readers get instant page loads, while you enjoy a smooth admin experience that never slows down."
              },
              {
                icon: <Cpu className="w-6 h-6 text-amber-500" />,
                bg: "bg-amber-50",
                title: "Custom Pages Builder",
                desc: "Create custom HTML pages beyond blog posts. Build landing pages, about pages, or any static content with full route control and seamless integration."
              },
              {
                icon: <Code className="w-6 h-6 text-indigo-500" />,
                bg: "bg-indigo-50",
                title: "Lightweight & Efficient",
                desc: "Ultra-lightweight architecture that saves your money. Deploy in seconds, consume minimal server resources, yet scale to thousands of posts and visitors."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
