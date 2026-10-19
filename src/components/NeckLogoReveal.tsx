"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, Eye } from "lucide-react";

interface NeckLogoRevealProps {
  onFocusHeroPreset?: (preset: "neck") => void;
}

export function NeckLogoReveal({ onFocusHeroPreset }: NeckLogoRevealProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section className="relative w-full py-28 md:py-36 bg-[#09090b] border-t border-b border-white/5 overflow-hidden">
      {/* Studio Lighting Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Technical Labeling & Interactive Trigger */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase mb-4">
              01 // COLLAR SPECIFICATION
            </span>

            <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight mb-8">
              NECKLINE MONOGRAM
            </h2>

            <div className="space-y-4 border-l border-white/10 pl-6 py-2 mb-8 font-mono-clean text-xs text-[#A1A1A6] leading-relaxed">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#6E6E73]">INSIGNIA</span>
                <span className="text-white font-bold tracking-wider">fbfy</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#6E6E73]">APPLICATION</span>
                <span className="text-white">DIRECT SCREENPRINT</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#6E6E73]">RIB PROFILE</span>
                <span className="text-white">1X1 BOUND HIGH-DENSITY RIB</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6E6E73]">PLACEMENT</span>
                <span className="text-white">CENTRAL INNER BACK NECK</span>
              </div>
            </div>

            {onFocusHeroPreset && (
              <div>
                <button
                  onClick={() => {
                    const hero = document.getElementById("hero");
                    hero?.scrollIntoView({ behavior: "smooth" });
                    onFocusHeroPreset("neck");
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-mono-clean text-xs uppercase tracking-widest hover:bg-[#E8E8E4] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  3D NECKLINE CAMERA
                </button>
              </div>
            )}
          </div>

          {/* Right: Macro Photography View */}
          <div className="lg:col-span-7">
            <div
              className={`relative overflow-hidden border border-white/10 bg-[#121215] aspect-[4/3] group cursor-pointer transition-all duration-700 ${
                isZoomed ? "scale-[1.02]" : ""
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src="/assets/editorial_neck_05.jpg"
                alt="fbfy Neck Logo Macro Close-up"
                fill
                className={`object-cover object-center transition-transform duration-700 ease-out ${
                  isZoomed ? "scale-125" : "group-hover:scale-105"
                }`}
                priority
              />

              {/* Minimal Coordinate Overlay */}
              <div className="absolute top-4 left-4 z-10 font-mono-clean text-[10px] text-white/60 tracking-widest bg-black/50 backdrop-blur-sm px-2.5 py-1">
                fbfy // INNER COLLAR [POS: 0.0, 1.25]
              </div>

              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 font-mono-clean text-[10px] text-white/80 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                <ZoomIn className="w-3.5 h-3.5" />
                {isZoomed ? "RESET ZOOM" : "CLICK TO EXPAND"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
