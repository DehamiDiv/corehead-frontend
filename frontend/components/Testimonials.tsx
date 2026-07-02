"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const testimonials = [
  {
    name: "William Hazelip",
    role: "Content Creator",
    title: "Lightning Fast Creation",
    quote: "Corehead has made content creation extremely fast and effortless.",
    image: "",
    color: "bg-blue-600",
  },
  {
    name: "Teresa Hamilton",
    role: "Senior Developer",
    title: "Incredibly Modular",
    quote: "The component builder integration is incredibly flexible and elegant.",
    image: "",
    color: "bg-indigo-600",
  },
  {
    name: "Louis Swanson",
    role: "Marketing Director",
    title: "Boosted Our Conversions",
    quote: "Since switching to Corehead, our site load times have dropped and signups are up.",
    image: "",
    color: "bg-purple-600",
  },
  {
    name: "Sophia Rodriguez",
    role: "Product Manager",
    title: "Highly Productive & Fun",
    quote: "Setting up new campaign and landing pages is super fast now. My team loves it.",
    image: "",
    color: "bg-pink-600",
  },
  {
    name: "David Chen",
    role: "Technical Writer",
    title: "Great Developer Experience",
    quote: "The editor is extremely responsive, and the export options saved us hours.",
    image: "",
    color: "bg-sky-600",
  },
  {
    name: "Emma Watson",
    role: "Blog Manager",
    title: "Perfect for Collaboration",
    quote: "Collaborating on layouts and drafts has never been this smooth and fast.",
    image: "",
    color: "bg-emerald-600",
  },
  {
    name: "Marcus Aurelius",
    role: "Head of Growth",
    title: "Scalable Content Platform",
    quote: "We grew our organic traffic by 150% after building our blog on top of Corehead.",
    image: "",
    color: "bg-amber-600",
  },
  {
    name: "Priya Sharma",
    role: "UX Designer",
    title: "Stunning Design Control",
    quote: "Having complete freedom over block layout while maintaining performance is a dream.",
    image: "",
    color: "bg-violet-600",
  },
  {
    name: "Liam O'Connor",
    role: "SEO Specialist",
    title: "Google Loves Our Speed",
    quote: "Our landing pages score a perfect 100/100 on PageSpeed Insights. Incredible results.",
    image: "",
    color: "bg-teal-600",
  },
];

const shortVideos = [
  "LA2tadwk-aw",
  "cM2iK-xpRAs",
  "gOfTY08EDu4",
  "LA2tadwk-aw",
  "cM2iK-xpRAs",
  "gOfTY08EDu4",
];

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight max-w-lg">
            Testimonials from Satisfied Customers
          </h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 rounded-full bg-slate-50 text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all active:scale-95 border border-slate-200 shadow-sm"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedTestimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                layout
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-full ${t.color} shrink-0`}
                    ></div>
                    <div>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 text-lime-400 fill-lime-400"
                      />
                    ))}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {t.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{t.quote}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Video Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-blue-600 p-8 md:p-12 lg:p-16 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold max-w-sm">
              Hear genuine stories from users
            </h2>
            <p className="text-blue-100 max-w-sm text-right md:text-left">
              Real customers share how our service transformed their website
              speed and boosted performance.
            </p>
          </div>

          {/* Video Carousel */}
          <VideoCarousel />
        </div>
      </div>
    </section>
  );
}

function VideoCarousel() {
  const [index, setIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (index < shortVideos.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(shortVideos.length - 1); // Loop to end
    }
  };

  return (
    <div className="relative z-10">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef}>
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          animate={{ x: `-${index * (100 / shortVideos.length)}%` }} 
          transition={{ type: "spring", damping: 30, stiffness: 150 }}
          className="flex gap-4 md:gap-5"
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) handleNext();
            if (info.offset.x > 50) handlePrev();
          }}
        >
          {shortVideos.map((id, i) => (
            <motion.div
              key={i}
              className="w-[85%] md:w-[calc(25%-1.25rem)] aspect-[2/3] rounded-3xl bg-blue-700/50 border border-blue-400/30 relative overflow-hidden group shadow-xl shrink-0"
            >
              {/* Thumbnail Placeholder with User Style */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-900/60 z-10" />
              
              {/* YouTube Thumbnail */}
              <img 
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} 
                alt="Video thumbnail"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={() => setPlayingVideo(id)}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 z-20">
        <button
          onClick={handlePrev}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 z-20">
        <button
          onClick={handleNext}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-sm"
            onClick={() => setPlayingVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
