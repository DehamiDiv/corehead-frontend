import { LayoutGrid, PenTool, Users, Shield, Zap, Cpu, Code, FileText, BarChart2, Sparkles } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Section 2: Fast & Developer-Friendly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
             {/* Blue Background Container */}
             <div className="relative rounded-[32px] overflow-hidden bg-[#0066FF] shadow-2xl shadow-blue-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 opacity-50" />
                {/* Mac Window Chrome */}
                <div className="relative z-10 m-5 bg-white rounded-2xl shadow-lg overflow-hidden border border-white/20 flex flex-col">
                   {/* Mac-like UI Header */}
                   <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center gap-2">
                     <div className="flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                       <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                       <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                     </div>
                     <div className="flex-1 mx-4 h-5 bg-slate-200 rounded-full text-[10px] text-slate-400 flex items-center justify-center">
                       corehead.io/admin
                     </div>
                   </div>
                   
                   {/* Mock Admin Dashboard UI */}
                   <div className="p-4 space-y-3 bg-slate-50 min-h-[320px]">
                     {/* Top stats row */}
                     <div className="grid grid-cols-3 gap-2">
                       {[
                         { label: "Posts", value: "142", color: "bg-blue-500" },
                         { label: "Views", value: "28.4k", color: "bg-violet-500" },
                         { label: "Users", value: "391", color: "bg-emerald-500" },
                       ].map((stat) => (
                         <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                           <div className={`w-6 h-1.5 rounded-full ${stat.color} mb-2`} />
                           <p className="text-xs font-bold text-slate-800">{stat.value}</p>
                           <p className="text-[10px] text-slate-400">{stat.label}</p>
                         </div>
                       ))}
                     </div>
                     {/* Post list mock */}
                     <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                       <div className="px-3 py-2 border-b border-slate-50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Posts</span>
                         <div className="w-12 h-2 bg-blue-100 rounded-full" />
                       </div>
                       {["AI-Powered Workflows", "Next.js 16 Guide", "Design Systems 101", "REST vs GraphQL"].map((title, i) => (
                         <div key={i} className="px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                           <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                             <FileText className="w-3 h-3 text-blue-500" />
                           </div>
                           <span className="text-[11px] font-semibold text-slate-700 truncate">{title}</span>
                           <div className={`ml-auto w-8 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-emerald-400" : i === 1 ? "bg-blue-400" : "bg-slate-200"}`} />
                         </div>
                       ))}
                     </div>
                     {/* Bottom bar */}
                     <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                       <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0" />
                       <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden">
                         <div className="h-full w-3/4 bg-violet-500 rounded-full animate-pulse" />
                       </div>
                       <span className="text-[10px] font-bold text-violet-500">AI Active</span>
                     </div>
                   </div>
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
