"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe, Cpu, Layers, Activity } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Lightning Fast",
    description:
      "Built on next-gen infrastructure for milliseconds latency anywhere in the world.",
  },
  {
    icon: <Shield className="w-6 h-6 text-green-400" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and SOC2 compliance out of the box.",
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    title: "Global Edge",
    description: "Deploy your app to 35+ regions with a single click.",
  },
  {
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    title: "AI Powered",
    description:
      "Smart suggestions and automated optimizations for your workflow.",
  },
  {
    icon: <Layers className="w-6 h-6 text-pink-400" />,
    title: "Seamless Integration",
    description:
      "Connect with your favorite tools like GitHub, Slack, and Linear.",
  },
  {
    icon: <Activity className="w-6 h-6 text-orange-400" />,
    title: "Real-time Analytics",
    description: "Monitor performance and user engagement in real-time.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 px-6 md:px-12 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Unleash your potential
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to build, deploy, and scale your applications
            with speed and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group"
            >
              <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
