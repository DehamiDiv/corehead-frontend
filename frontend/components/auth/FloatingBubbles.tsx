"use client";

import React, { useEffect, useState } from "react";

interface BubbleConfig {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  swayDistance: number;
  opacity: number;
}

// Staggered with negative delays so bubbles appear instantly across all heights of the screen
const STATIC_BUBBLES: BubbleConfig[] = [
  { id: 1, size: 50, left: 6, duration: 14, delay: -2, swayDistance: 25, opacity: 0.55 },
  { id: 2, size: 85, left: 16, duration: 18, delay: -8, swayDistance: -35, opacity: 0.45 },
  { id: 3, size: 36, left: 26, duration: 11, delay: -4, swayDistance: 20, opacity: 0.6 },
  { id: 4, size: 105, left: 36, duration: 22, delay: -15, swayDistance: -45, opacity: 0.4 },
  { id: 5, size: 60, left: 50, duration: 16, delay: -6, swayDistance: 30, opacity: 0.5 },
  { id: 6, size: 40, left: 64, duration: 13, delay: -10, swayDistance: -25, opacity: 0.55 },
  { id: 7, size: 90, left: 76, duration: 20, delay: -3, swayDistance: 40, opacity: 0.42 },
  { id: 8, size: 55, left: 88, duration: 15, delay: -12, swayDistance: -30, opacity: 0.52 },
  { id: 9, size: 28, left: 10, duration: 10, delay: -1, swayDistance: 15, opacity: 0.65 },
  { id: 10, size: 70, left: 22, duration: 17, delay: -14, swayDistance: -25, opacity: 0.48 },
  { id: 11, size: 44, left: 44, duration: 12, delay: -7, swayDistance: 35, opacity: 0.55 },
  { id: 12, size: 95, left: 56, duration: 21, delay: -18, swayDistance: -40, opacity: 0.38 },
  { id: 13, size: 34, left: 70, duration: 11, delay: -9, swayDistance: 20, opacity: 0.6 },
  { id: 14, size: 75, left: 82, duration: 19, delay: -5, swayDistance: -35, opacity: 0.45 },
  { id: 15, size: 32, left: 94, duration: 9, delay: -3, swayDistance: 15, opacity: 0.65 },
  { id: 16, size: 58, left: 3, duration: 15, delay: -11, swayDistance: -20, opacity: 0.5 },
  { id: 17, size: 80, left: 32, duration: 18, delay: -13, swayDistance: 30, opacity: 0.42 },
  { id: 18, size: 48, left: 60, duration: 14, delay: -4, swayDistance: -25, opacity: 0.52 },
  { id: 19, size: 100, left: 80, duration: 23, delay: -16, swayDistance: 45, opacity: 0.36 },
  { id: 20, size: 42, left: 48, duration: 13, delay: -8, swayDistance: -20, opacity: 0.58 },
  { id: 21, size: 65, left: 91, duration: 17, delay: -6, swayDistance: 25, opacity: 0.46 },
  { id: 22, size: 38, left: 19, duration: 12, delay: -11, swayDistance: -18, opacity: 0.58 },
];

export default function FloatingBubbles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <style>{`
        @keyframes floatRise {
          0% {
            transform: translateY(110vh) translateX(0) scale(0.85);
            opacity: 0;
          }
          10% {
            opacity: var(--bubble-opacity, 0.5);
          }
          50% {
            transform: translateY(50vh) translateX(var(--sway-distance, 20px)) scale(1.04);
          }
          90% {
            opacity: var(--bubble-opacity, 0.5);
          }
          100% {
            transform: translateY(-20vh) translateX(calc(var(--sway-distance, 20px) * -0.8)) scale(0.95);
            opacity: 0;
          }
        }

        .auth-bubble {
          position: absolute;
          top: 0;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.35) 30%, rgba(191, 219, 254, 0.22) 65%, rgba(255, 255, 255, 0.55) 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(37, 99, 235, 0.2);
          animation: floatRise var(--bubble-duration, 15s) infinite linear;
          animation-delay: var(--bubble-delay, 0s);
          will-change: transform, opacity;
        }

        .bubble-glint {
          position: absolute;
          top: 16%;
          left: 20%;
          width: 28%;
          height: 28%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.3) 70%, transparent 100%);
          border-radius: 9999px;
          transform: rotate(-30deg);
        }

        .bubble-glint-small {
          position: absolute;
          bottom: 20%;
          right: 22%;
          width: 14%;
          height: 14%;
          background: rgba(255, 255, 255, 0.75);
          border-radius: 9999px;
        }
      `}</style>

      {/* Decorative ambient gradient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-blue-400/25 rounded-full filter blur-[90px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-300/30 rounded-full filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] bg-indigo-300/20 rounded-full filter blur-[80px] pointer-events-none" />

      {/* Floating Bubbles */}
      {STATIC_BUBBLES.map((bubble) => (
        <div
          key={bubble.id}
          className="auth-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            ["--bubble-opacity" as any]: bubble.opacity,
            ["--bubble-duration" as any]: `${bubble.duration}s`,
            ["--bubble-delay" as any]: `${bubble.delay}s`,
            ["--sway-distance" as any]: `${bubble.swayDistance}px`,
          }}
        >
          <div className="bubble-glint" />
          <div className="bubble-glint-small" />
        </div>
      ))}
    </div>
  );
}
