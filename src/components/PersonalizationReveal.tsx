"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ZoomIn } from "lucide-react";
import { useCartAuth } from "@/context/CartAuthContext";

interface PersonalizationRevealProps {
  onFocusHeroPreset?: (preset: "signature") => void;
}

export function PersonalizationReveal({
  onFocusHeroPreset,
}: PersonalizationRevealProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const { customName, setCustomName } = useCartAuth();

  return (
    <section className="relative w-full py-28 md:py-36 bg-[#070709] border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Macro Detail Photography with Dynamic Name Overlay */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div
              className={`relative overflow-hidden border border-white/10 bg-[#121215] aspect-[4/3] group cursor-pointer transition-all duration-700 ${
                isZoomed ? "scale-[1.02]" : ""
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src="/assets/editorial_hem_04.jpg"
                alt="fbfy Hem Signature Macro"
                fill
                className={`object-cover object-center transition-transform duration-700 ease-out ${
                  isZoomed ? "scale-130" : "group-hover:scale-105"
                }`}
                priority
              />

              {/* Dynamic Hem Engraving Simulation Over Hem */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/80 px-6 py-4 border border-white/20 backdrop-blur-md shadow-2xl text-center">
                  <span className="font-mono-clean text-[10px] text-[#8E8E93] uppercase tracking-widest block mb-1">
                    YOUR PERSONALIZED HEM PRINT
                  </span>
                  <div className="font-brand text-2xl md:text-3xl font-extrabold tracking-wider text-white">
                    fbfy by {customName || "YOU"}
                  </div>
                </div>
              </div>

              {/* Minimal Coordinate Overlay */}
              <div className="absolute top-4 left-4 z-10 font-mono-clean text-[10px] text-white/60 tracking-widest bg-black/50 backdrop-blur-sm px-2.5 py-1">
                HEM SIGNATURE // [POS: 0.68, -1.05]
              </div>

              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 font-mono-clean text-[10px] text-white/80 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                <ZoomIn className="w-3.5 h-3.5" />
                {isZoomed ? "RESET ZOOM" : "CLICK TO EXPAND"}
              </div>
            </div>
          </div>

          {/* Right: Technical Details & Typographic Hierarchy */}
          <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
            <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase mb-4">
              02 // HEM SPECIFICATION
            </span>

            <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight mb-8">
              GARMENT SIGNATURE
            </h2>

            {/* Interactive Live Input Box */}
            <div className="bg-[#111115] border border-white/15 p-6 mb-8 font-mono-clean">
              <span className="text-[10px] text-emerald-400 tracking-[0.25em] block mb-2 font-bold">
                TYPE YOUR NAME FOR HEM PRINT:
              </span>
              <input
                type="text"
                maxLength={14}
                value={customName}
                onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                placeholder="YOUR NAME"
                className="w-full px-4 py-2.5 bg-black border border-white/20 text-white font-mono-clean text-sm font-bold tracking-widest uppercase focus:border-white focus:outline-none mb-3"
              />

              <div className="p-3 bg-[#181820] border border-white/5">
                <span className="text-[9px] text-[#6E6E73] block uppercase mb-1">
                  RENDERED PRINT ORDER
                </span>
                <div className="text-base font-extrabold tracking-widest text-white">
                  fbfy by {customName || "YOU"}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-l border-white/10 pl-6 py-2 mb-8 font-mono-clean text-xs text-[#A1A1A6] leading-relaxed">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#6E6E73]">BRAND LINE</span>
                <span className="text-white">fbfy</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#6E6E73]">CLIENT SPECIMEN</span>
                <span className="text-emerald-400 font-bold">
                  by {customName || "YOU"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#6E6E73]">PRINT METHOD</span>
                <span className="text-white">HIGH-DENSITY WATER-BASED MATTE</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6E6E73]">OFFSET</span>
                <span className="text-white">35MM ABOVE LOWER HEM</span>
              </div>
            </div>

            {onFocusHeroPreset && (
              <div>
                <button
                  onClick={() => {
                    const hero = document.getElementById("hero");
                    hero?.scrollIntoView({ behavior: "smooth" });
                    onFocusHeroPreset("signature");
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-mono-clean text-xs uppercase tracking-widest hover:bg-[#E8E8E4] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  3D HEM CAMERA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
