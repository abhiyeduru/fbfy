"use client";

import React, { useEffect, useState } from "react";

interface FbfyLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export function FbfyLoader({ onComplete, duration = 1800 }: FbfyLoaderProps) {
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507] transition-all duration-700 ease-out select-none pointer-events-none ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background radial studio spotlight */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-3xl pulse-glow pointer-events-none" />

      {/* Shining FBFY Brand Logo */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Ambient Halo Behind Text */}
        <div className="absolute -top-10 w-44 h-24 bg-white/10 blur-2xl rounded-full pointer-events-none" />

        {/* Small, Sleek & Stylish Shining Wordmark */}
        <div className="relative">
          <h1 className="font-brand text-3xl sm:text-4xl md:text-5xl tracking-[0.22em] uppercase font-black fbfy-shine-text">
            FBFY
          </h1>
          {/* Subtle Glint Accent */}
          <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#ffffff] animate-ping" />
        </div>

        {/* Subtitle with refined minimalist lines */}
        <div className="flex items-center gap-3 mt-3 text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.45em] text-[#8E8E93] font-medium">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span>PARIS • TOKYO</span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>

        {/* Minimalist sleek loading line */}
        <div className="w-28 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_1.2s_infinite] w-full" />
        </div>
      </div>
    </div>
  );
}
