"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface ProductCard3DProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export function ProductCard3D({ product, onSelectProduct }: ProductCard3DProps) {
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0]);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const images = product.images && product.images.length > 0
    ? product.images.slice(0, 4)
    : [
        { id: "front", label: "FRONT", url: product.imageFront },
        { id: "back", label: "BACK", url: product.imageBack },
      ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Active view image
  const displayImage = images[activeImageIdx]?.url || product.imageFront;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="group relative flex flex-col bg-[#0e0e11] border border-white/5 hover:border-white/20 transition-all duration-300"
    >
      {/* Product Image Stage */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative w-full aspect-[4/5] bg-[#0c0c0e] overflow-hidden cursor-pointer"
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          quality={95}
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Minimal Item Code Badge */}
        <div className="absolute top-3 left-3 z-10 font-mono-clean text-[10px] text-white/50 tracking-widest bg-black/40 backdrop-blur-sm px-2 py-0.5">
          {product.code}
        </div>

        {/* GSM Indicator */}
        <div className="absolute top-3 right-3 z-10 font-mono-clean text-[10px] text-white/70 tracking-widest bg-black/40 backdrop-blur-sm px-2 py-0.5">
          {product.gsm} GSM
        </div>

        {/* Amazon/Netflix Style Quick Angle Pill Indicators on Hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-sm px-2 py-1 border border-white/10">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx(idx);
              }}
              className={`font-mono-clean text-[8px] uppercase tracking-wider px-1.5 py-0.5 transition-colors ${
                activeImageIdx === idx
                  ? "bg-white text-black font-bold"
                  : "text-[#8E8E93] hover:text-white"
              }`}
            >
              {img.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Product Info Bar */}
      <div className="p-5 flex flex-col justify-between flex-grow bg-[#101013]">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-brand text-sm tracking-wide text-white font-bold">
              {product.name}
            </h3>
            <span className="font-mono-clean text-[11px] text-[#8E8E93]">
              {product.collection}
            </span>
          </div>

          <p className="font-mono-clean text-xs text-[#8E8E93]">
            {product.fit} • {product.fabric}
          </p>
        </div>

        {/* Available Color Swatches & View Product Link */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {/* Color Selectors */}
          <div className="flex items-center gap-1.5">
            {product.availableColors.map((color) => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                title={color.name}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor.id === color.id
                    ? "scale-125 border-white ring-1 ring-white/40"
                    : "border-white/20 hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* View Product CTA */}
          <button
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-1 font-mono-clean text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors"
          >
            <span>VIEW PRODUCT</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
