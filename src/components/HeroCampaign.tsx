"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartAuth } from "@/context/CartAuthContext";
import { Hero3D } from "./Hero3D";
import { CameraPreset } from "@/types";
import {
  ArrowRight,
  Rotate3d,
  Layers,
} from "lucide-react";

interface HeroCampaignProps {
  onOpenProductDetail: () => void;
  activeHeroPreset: CameraPreset;
  onHeroPresetChange: (preset: CameraPreset) => void;
}

export function HeroCampaign({
  onOpenProductDetail,
  activeHeroPreset,
  onHeroPresetChange,
}: HeroCampaignProps) {
  const { storeSettings, setActiveCategoryFilter } = useCartAuth();
  const [viewMode, setViewMode] = useState<"editorial" | "3d">("editorial");
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      image: "/assets/editorial_look_01.jpg",
      season: "DROP 04 ARCHIVE // 2026",
      title: "BUILT TO DEFY ORDINARY",
      subtitle: "Dense 280 GSM architectural combed cotton with bespoke hem personalization.",
      cta: "EXPLORE DROP 04",
      filter: "ALL",
    },
    {
      image: "/assets/editorial_look_02.jpg",
      season: "MINERAL WASH // SERIES 02",
      title: "VISION OVER VALIDATION",
      subtitle: "380 GSM double-layer French Terry & custom enzyme hand-finished washes.",
      cta: "SHOP HOODIES",
      filter: "Hoodies",
    },
  ];

  const currentSlide = heroSlides[activeSlide];

  const handleCtaClick = (filter: string) => {
    setActiveCategoryFilter(filter);
    const el = document.getElementById("collection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full min-h-[94vh] flex flex-col justify-between bg-[#08080a] overflow-hidden">
      {/* View Mode Switcher Pill - Precision Responsive Alignment */}
      <div className="absolute top-20 sm:top-24 md:top-28 right-3 sm:right-8 md:right-12 z-30 flex items-center gap-1 bg-[#0c0c12]/95 backdrop-blur-xl p-1 rounded-full border border-white/15 shadow-2xl">
        <button
          onClick={() => setViewMode("editorial")}
          className={`px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            viewMode === "editorial"
              ? "bg-white text-black shadow-lg"
              : "text-[#8E8E93] hover:text-white"
          }`}
        >
          <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Campaign</span>
        </button>
        <button
          onClick={() => setViewMode("3d")}
          className={`px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full font-sans text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            viewMode === "3d"
              ? "bg-white text-black shadow-lg"
              : "text-[#8E8E93] hover:text-white"
          }`}
        >
          <Rotate3d className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
          <span>3D Studio</span>
        </button>
      </div>

      {viewMode === "editorial" ? (
        <div className="relative w-full min-h-[94vh] flex items-end">
          {/* Background Cinematic Slide Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={currentSlide.image}
              alt={currentSlide.title}
              fill
              priority
              unoptimized
              className="object-cover object-center filter brightness-[0.72] contrast-[1.08] transition-all duration-1000 ease-out"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 pb-14 md:pb-20">
            <div className="max-w-3xl space-y-4">
              {/* Season Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-full text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
                  {storeSettings.heroBadgeText || currentSlide.season}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-brand text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.96] sm:leading-[0.94]">
                {storeSettings.heroHeadline || currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#d8d8dc] max-w-xl leading-relaxed font-normal">
                {storeSettings.heroSubtitle || currentSlide.subtitle}
              </p>

              {/* CTAs */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleCtaClick(currentSlide.filter)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black hover:bg-white/90 font-sans text-xs uppercase tracking-widest font-extrabold rounded-xs flex items-center justify-center gap-2.5 shadow-2xl transition-all hover:gap-3.5 active:scale-98"
                >
                  <span>{storeSettings.heroCtaText || currentSlide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewMode("3d")}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-black/60 hover:bg-black/80 text-white font-sans text-xs uppercase tracking-widest font-bold rounded-xs border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Rotate3d className="w-4 h-4 text-emerald-400" />
                  <span>3D Studio Visualizer</span>
                </button>
              </div>

              {/* Garment Metric Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/15 max-w-lg">
                <div>
                  <span className="text-[10px] font-sans font-bold text-[#8E8E93] uppercase tracking-wider block">
                    FABRIC WEIGHT
                  </span>
                  <span className="font-brand text-sm sm:text-base text-white font-bold">
                    280-400 GSM
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold text-[#8E8E93] uppercase tracking-wider block">
                    CONSTRUCTION
                  </span>
                  <span className="font-brand text-sm sm:text-base text-white font-bold">
                    Boxy Silhouette
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold text-[#8E8E93] uppercase tracking-wider block">
                    PERSONALIZATION
                  </span>
                  <span className="font-brand text-sm sm:text-base text-emerald-400 font-bold">
                    Laser Hem Name
                  </span>
                </div>
              </div>
            </div>

            {/* Slide Switchers */}
            <div className="absolute bottom-14 right-4 sm:right-8 md:right-12 hidden sm:flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 transition-all rounded-full ${
                    activeSlide === idx ? "w-8 bg-white" : "w-3 bg-white/30"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 3D Garment Inspector Stage */
        <div className="relative w-full pt-16">
          <Hero3D
            activePreset={activeHeroPreset}
            onPresetChange={onHeroPresetChange}
            onOpenProductDetail={onOpenProductDetail}
          />
        </div>
      )}
    </section>
  );
}
