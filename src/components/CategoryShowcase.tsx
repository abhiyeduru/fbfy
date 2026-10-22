"use client";

import React from "react";
import Image from "next/image";
import { useCartAuth } from "@/context/CartAuthContext";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function CategoryShowcase() {
  const { setActiveCategoryFilter } = useCartAuth();

  const categories = [
    {
      title: "Oversized Tees",
      subtitle: "280 GSM Heavyweight Architectural Cut",
      image: "/assets/products/p02_model.jpg",
      count: "8 Styles",
      filter: "Oversized Tees",
    },
    {
      title: "Hoodies & Fleece",
      subtitle: "380-400 GSM Double-Layer Construction",
      image: "/assets/products/p03_front.jpg",
      count: "4 Styles",
      filter: "Hoodies",
    },
    {
      title: "Graphic Series",
      subtitle: "Archival Manifesto & Wireframe Prints",
      image: "/assets/products/p01_front.jpg",
      count: "6 Styles",
      filter: "Graphic Editions",
    },
    {
      title: "Acid Wash & Vintage",
      subtitle: "Custom Hand-Treated Mineral Fades",
      image: "/assets/products/p04_front.jpg",
      count: "5 Styles",
      filter: "Acid Washed",
    },
    {
      title: "Bottomwear & Cargos",
      subtitle: "Utilitarian Gusseted 6-Pocket Fit",
      image: "/assets/prod_black.jpg",
      count: "3 Styles",
      filter: "Bottomwear",
    },
  ];

  const handleCategoryClick = (filter: string) => {
    setActiveCategoryFilter(filter);
    const el = document.getElementById("collection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#060608] border-t border-b border-white/[0.08]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-sans text-[11px] tracking-[0.25em] text-[#8E8E93] uppercase font-bold">
                DECONSTRUCTED DEPARTMENTS
              </span>
            </div>
            <h2 className="font-brand text-2xl sm:text-3xl md:text-5xl text-white font-black tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <button
            onClick={() => handleCategoryClick("ALL")}
            className="font-sans text-xs text-white/70 hover:text-white uppercase tracking-widest font-bold flex items-center gap-1.5 group transition-colors"
          >
            <span>View All Garments</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              onClick={() => handleCategoryClick(cat.filter)}
              className="group relative flex flex-col bg-[#0c0c10] border border-white/[0.08] hover:border-white/30 rounded-xs overflow-hidden cursor-pointer transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] bg-[#121217] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  unoptimized
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />

                {/* Count Pill */}
                <span className="absolute top-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-md text-[9px] font-sans font-bold text-white/90 px-2.5 py-0.5 rounded-full border border-white/10">
                  {cat.count}
                </span>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="font-brand text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-[10px] text-[#A1A1A6] truncate mt-0.5 font-medium">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Hover Indicator Bar */}
              <div className="h-0.5 w-0 group-hover:w-full bg-emerald-400 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
