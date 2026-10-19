"use client";

import React from "react";

export function StudioAbout() {
  return (
    <section id="about" className="relative w-full py-28 md:py-36 bg-[#060607] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase block mb-3">
              DISCIPLINE & SILHOUETTE
            </span>
            <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight">
              STUDIO
            </h2>
          </div>

          <div className="font-mono-clean text-xs text-[#8E8E93] tracking-widest uppercase">
            EST. 2026 // MONOCHROME DISCIPLINE
          </div>
        </div>

        {/* 3-Column Studio Blueprint Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Pillar 01 */}
          <div className="border border-white/10 bg-[#0a0a0d] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono-clean text-xs text-[#8E8E93] tracking-widest block mb-4">
                01 // ARCHITECTURAL FIT
              </span>
              <h3 className="font-brand text-xl text-white font-bold mb-4">
                BOXY PROPORTIONS
              </h3>
              <p className="font-mono-clean text-xs text-[#A1A1A6] leading-relaxed">
                Garments engineered with an expanded horizontal chest plane, dropped shoulder seams, and a relaxed vertical hang that preserves volume without cling.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 font-mono-clean text-[10px] text-[#6E6E73]">
              DROP: 45MM // WIDTH RATIO: 1.18
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="border border-white/10 bg-[#0a0a0d] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono-clean text-xs text-[#8E8E93] tracking-widest block mb-4">
                02 // SUBSTANTIAL DENSITY
              </span>
              <h3 className="font-brand text-xl text-white font-bold mb-4">
                280 GSM MASS
              </h3>
              <p className="font-mono-clean text-xs text-[#A1A1A6] leading-relaxed">
                Heavyweight combed cotton calibrated to maintain structural shape throughout prolonged wear. Dense double-knit surface minimizes transparency and crease collapse.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 font-mono-clean text-[10px] text-[#6E6E73]">
              GSM: 280-300 // YARN: 24S COMBED
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="border border-white/10 bg-[#0a0a0d] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono-clean text-xs text-[#8E8E93] tracking-widest block mb-4">
                03 // IDENTITY MONOGRAM
              </span>
              <h3 className="font-brand text-xl text-white font-bold mb-4">
                DUAL MARKING
              </h3>
              <p className="font-mono-clean text-xs text-[#A1A1A6] leading-relaxed">
                Primary inner collar marked with the sharp FBF insignia. Garment lower hem anchored by the understated by fbfy mark accompanied by sample name specimen.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 font-mono-clean text-[10px] text-[#6E6E73]">
              NECK: FBF // HEM: by fbfy + NAME
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
