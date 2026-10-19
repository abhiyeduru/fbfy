"use client";

import React, { useState } from "react";
import Image from "next/image";

export function EditorialCampaign() {
  const [activeLook, setActiveLook] = useState<0 | 1>(0);

  const looks = [
    {
      id: "LOOK_01",
      image: "/assets/editorial_look_01.jpg",
      location: "BERLIN BRUTALIST SECTOR // 52.5200° N",
      garment: "001 SIGNATURE OVERSIZED TEE (JET BLACK)",
      time: "21:40 DUSK",
    },
    {
      id: "LOOK_02",
      image: "/assets/editorial_look_02.jpg",
      location: "TOKYO MONOLITH CORE // 35.6762° N",
      garment: "003 MINERAL WASHED TEE (CHARCOAL)",
      time: "17:15 ANGLE LIGHT",
    },
  ];

  return (
    <section id="studio" className="relative w-full py-28 md:py-36 bg-[#060608] border-t border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
          <div>
            <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase block mb-3">
              CAMPAIGN ARCHIVE // 2026
            </span>
            <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight">
              EDITORIAL
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono-clean text-xs">
            {looks.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => setActiveLook(idx as 0 | 1)}
                className={`px-4 py-2 uppercase tracking-widest border transition-all ${
                  activeLook === idx
                    ? "bg-white text-black border-white font-bold"
                    : "bg-[#111114] text-[#8E8E93] border-white/10 hover:text-white"
                }`}
              >
                {look.id}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Main Viewport */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-[#09090c] border border-white/10 overflow-hidden group">
          <Image
            src={looks[activeLook].image}
            alt={looks[activeLook].garment}
            fill
            quality={95}
            unoptimized
            className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
            priority
          />

          {/* Vignette & Contrast Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Left Metadata */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 font-mono-clean text-xs text-white/70 space-y-1">
            <span className="block font-bold tracking-widest text-white">
              {looks[activeLook].id}
            </span>
            <span className="block text-[11px] text-[#A1A1A6]">
              {looks[activeLook].location}
            </span>
          </div>

          {/* Bottom Coordinates & Garment Information */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 md:right-8 flex flex-col md:flex-row md:items-end justify-between font-mono-clean text-xs text-white/80 gap-4">
            <div>
              <span className="text-[10px] tracking-widest text-[#8E8E93] uppercase block">
                GARMENT PROPORTION
              </span>
              <span className="text-sm tracking-wide text-white font-bold">
                {looks[activeLook].garment}
              </span>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] tracking-widest text-[#8E8E93] uppercase block">
                LIGHTING ENVIRONMENT
              </span>
              <span className="text-xs text-[#A1A1A6]">
                {looks[activeLook].time}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Secondary Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div
            onClick={() => setActiveLook(0)}
            className="relative aspect-[3/4] bg-[#0c0c0e] border border-white/5 overflow-hidden group cursor-pointer"
          >
            <Image
              src="/assets/editorial_look_01.jpg"
              alt="Editorial Look 01"
              fill
              quality={95}
              unoptimized
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 font-mono-clean text-[11px] text-white/80 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              LOOK_01 // BRUTALIST CONCRETE
            </div>
          </div>

          <div
            onClick={() => setActiveLook(1)}
            className="relative aspect-[3/4] bg-[#0c0c0e] border border-white/5 overflow-hidden group cursor-pointer"
          >
            <Image
              src="/assets/editorial_look_02.jpg"
              alt="Editorial Look 02"
              fill
              quality={95}
              unoptimized
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 font-mono-clean text-[11px] text-white/80 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              LOOK_02 // SHADOW COMPOSITION
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
