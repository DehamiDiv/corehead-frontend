"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles, Heart, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

const footerLinks = {
  Product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Visual Builder", href: "/signup" },
    { name: "AI Writer", href: "/signup" },
    { name: "Templates", href: "/signup" },
  ],
  Resources: [
    { name: "Documentation", href: "/guides" },
    { name: "Blog", href: "/blog" },
    { name: "Guides", href: "/guides" },
    { name: "FAQs", href: "/#faq" },
    { name: "Changelog", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "/" },
    { name: "Careers", href: "#", badge: "Hiring" },
    { name: "Contact", href: "#" },
    { name: "Partners", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
};



const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface DetailedFooterProps {
  isSaaS?: boolean;
}

export default function DetailedFooter({ isSaaS = true }: DetailedFooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [footerLogo, setFooterLogo] = useState<string>("/logo.png");
  const [footerDescription, setFooterDescription] = useState<string>("The ultimate AI-powered blog builder. Create, customize, and publish dynamic blogs instantly.");

  useEffect(() => {
    if (isSaaS) return;
    const loadSettings = async () => {
      try {
        const data = await api.getSetting("theme_theme-1_footer");
        if (data && data.footerLogo) {
          setFooterLogo(data.footerLogo);
        }
        if (data && data.footerDescription) {
          setFooterDescription(data.footerDescription);
        }
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
      }
    };
    loadSettings();
  }, [isSaaS]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setStatusMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");
    try {
      const res = await api.subscribeToNewsletter(
        email.trim(),
        undefined,
        undefined,
        "CoreHead",
      );
      if (res?.success || res?.demo) {
        setStatus("success");
        setStatusMessage(res.message || "Successfully subscribed!");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setStatusMessage(res?.error || "Subscription failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setStatus("error");
      setStatusMessage(err?.message || "An unexpected error occurred.");
    }
  };

  return (
    <footer className="relative bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[150px]" />
      </div>

      {/* Top Gradient Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16"
      >
        <div className="relative bg-white border border-gray-200 rounded-3xl p-10 md:p-14 shadow-lg overflow-hidden">
          {/* Decorative sparkles */}
          <div className="absolute top-6 right-8 text-blue-400/30">
            <Sparkles size={24} />
          </div>
          <div className="absolute bottom-8 left-10 text-indigo-400/20">
            <Sparkles size={18} />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Stay ahead of the curve
              </h3>
              <p className="text-gray-600 text-lg max-w-md">
                Get the latest updates on features, tips, and best practices delivered to your inbox.
              </p>
            </div>

            <div className="flex flex-col w-full max-w-md">
              <form onSubmit={handleSubscribe} className="flex w-full">
                <div className="relative flex w-full bg-white/[0.06] border border-gray-200 rounded-2xl p-1.5 focus-within:border-blue-500/40 transition-colors duration-300">
                  <Mail
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-gray-800 placeholder-slate-400 pl-11 pr-4 py-3 text-base outline-none"
                    disabled={status === "loading"}
                  />
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors duration-200 flex items-center gap-2 whitespace-nowrap disabled:bg-blue-400"
                  >
                    {status === "loading" ? (
                      "Subscribing..."
                    ) : status === "success" ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        ✓ Subscribed!
                      </motion.span>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
              {statusMessage && (
                <p className={`mt-2 text-sm ml-4 ${status === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative z-10 max-w-7xl mx-auto px-6 pb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src={footerLogo}
                alt="Footer Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs">
              {footerDescription}
            </p>


          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={itemVariants}>
              <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-widest">
                {title}
              </h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 text-[15px]"
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                      </span>
                      {"badge" in link && link.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full">
                          {link.badge}
                        </span>
                      )}
                      <ExternalLink
                        size={12}
                        className="opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} CoreHead CMS. Crafted with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="inline-flex items-center"
            >
              <Heart size={14} className="text-red-500 fill-red-500 mx-1 align-middle" />
            </motion.span>
            <span>by the CoreHead team.</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-400"
              />
              <span className="text-xs font-medium text-emerald-400">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
