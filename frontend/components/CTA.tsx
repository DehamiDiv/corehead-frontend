export default function CTA() {
  return (
    <section className="py-32 px-6 bg-[#2563EB] relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
          Ready to Build Something Faster?
        </h2>

        <p className="text-blue-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Stop fighting legacy systems. Start with the modern, decoupled
          CoreHead with security, speed, and confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="px-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all text-lg">
            Get Started Now
          </button>

          <button className="px-12 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-xl text-lg hover:scale-105 active:scale-95">
            Get a Demo
          </button>
        </div>
      </div>
    </section>
  );
}
