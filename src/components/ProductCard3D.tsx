"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, ColorVariant } from "@/types";
import { useCartAuth } from "@/context/CartAuthContext";
import {
  ArrowUpRight,
  Heart,
  Star,
  Check,
  Flame,
} from "lucide-react";

interface ProductCard3DProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const QUICK_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export function ProductCard3D({ product, onSelectProduct }: ProductCard3DProps) {
  const { toggleWishlist, isWishlisted, addToCart, customName } = useCartAuth();
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(
    product.availableColors[0]
  );
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddedSize, setQuickAddedSize] = useState<string | null>(null);

  // Compute discount percent
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Hover image switch: front to back/model
  const primaryImage = product.imageFront;
  const secondaryImage =
    product.imageBack || product.editorialImage || product.images?.[1]?.url || primaryImage;

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, size, customName || "YOU", 1);
    setQuickAddedSize(size);
    setTimeout(() => setQuickAddedSize(null), 1500);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#0e0e13] border border-white/[0.08] hover:border-white/30 transition-all duration-300 rounded-xs overflow-hidden shadow-lg hover:shadow-2xl"
    >
      {/* Product Image Stage */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative w-full aspect-[4/5] bg-[#09090c] overflow-hidden cursor-pointer"
      >
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover object-center transition-all duration-700 ease-out ${
            isHovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />

        {/* Secondary Flip Image on Hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} alternate`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
            }`}
          />
        )}

        {/* Badges: Top Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.badge && (
            <span
              className={`font-sans text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-bold backdrop-blur-md shadow-md ${
                product.badge === "NEW DROP"
                  ? "bg-emerald-500 text-black font-black"
                  : product.badge === "BESTSELLER"
                  ? "bg-amber-400 text-black font-black flex items-center gap-1"
                  : product.badge === "LIMITED EDITION"
                  ? "bg-purple-600 text-white font-black"
                  : "bg-rose-500 text-white font-black"
              }`}
            >
              {product.badge === "BESTSELLER" && <Flame className="w-2.5 h-2.5 inline" />}
              {product.badge}
            </span>
          )}

          {/* GSM Indicator */}
          <span className="font-sans text-[9px] text-white/80 tracking-widest font-semibold bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-xs border border-white/10">
            {product.gsm} GSM
          </span>
        </div>

        {/* Wishlist Heart Button: Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle Wishlist"
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? "bg-rose-500 text-white shadow-lg"
              : "bg-black/50 text-white/70 hover:text-white hover:bg-black/80 backdrop-blur-sm"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Quick-Add Size Pills Bar on Hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 z-20 bg-black/90 backdrop-blur-md p-2.5 border-t border-white/15 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between text-[9px] font-sans uppercase tracking-wider text-white/80 font-bold mb-1.5">
            <span>Quick Select Size:</span>
            {quickAddedSize && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Size {quickAddedSize} Added
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-1">
            {QUICK_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleQuickAdd(sz, e)}
                className="flex-1 py-1 text-center font-sans text-[10px] font-bold text-white bg-white/10 hover:bg-white hover:text-black transition-colors rounded-xs border border-white/10"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Info Stage */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-[#101015]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] font-sans text-[#8E8E93] mb-1 font-medium">
            <span>{product.category || product.collection}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-white/40">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-brand text-xs sm:text-sm font-bold text-white tracking-wide hover:text-white/80 cursor-pointer line-clamp-1 mb-1.5"
          >
            {product.name}
          </h3>

          {/* Pricing & Discount */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-brand text-sm sm:text-base font-bold text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <>
                <span className="font-sans text-[11px] text-white/40 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="font-sans text-[10px] text-emerald-400 font-bold">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Footer: Color Swatches & View CTA */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.08]">
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
                    ? "scale-125 border-white ring-1 ring-white/50"
                    : "border-white/20 hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* View Product CTA */}
          <button
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-1 font-sans text-[11px] uppercase tracking-wider font-bold text-white/70 hover:text-white transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
