"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types";
import { PRODUCTS } from "@/data/products";
import { ProductCard3D } from "./ProductCard3D";
import { useCartAuth } from "@/context/CartAuthContext";
import {
  ArrowUpDown,
  Search,
} from "lucide-react";

interface CollectionGalleryProps {
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

const CATEGORY_TABS = [
  "ALL",
  "Oversized Tees",
  "Hoodies",
  "Graphic Editions",
  "Acid Washed",
  "Bottomwear",
  "NEW DROPS",
  "BEST SELLERS",
  "ARCHIVE SALE",
] as const;

export function CollectionGallery({
  onSelectProduct,
  products = PRODUCTS,
}: CollectionGalleryProps) {
  const { activeCategoryFilter, setActiveCategoryFilter } = useCartAuth();
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter by active category tab
    if (activeCategoryFilter !== "ALL") {
      if (activeCategoryFilter === "NEW DROPS") {
        list = list.filter((p) => p.badge === "NEW DROP");
      } else if (activeCategoryFilter === "BEST SELLERS") {
        list = list.filter((p) => p.badge === "BESTSELLER");
      } else if (activeCategoryFilter === "ARCHIVE SALE") {
        list = list.filter((p) => p.badge === "ARCHIVE SALE" || (p.originalPrice && p.originalPrice > p.price));
      } else {
        list = list.filter(
          (p) =>
            p.category?.toLowerCase() === activeCategoryFilter.toLowerCase() ||
            p.collection?.toLowerCase() === activeCategoryFilter.toLowerCase()
        );
      }
    }

    // Filter by query if typed
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeCategoryFilter, sortBy, searchQuery]);

  return (
    <section id="collection" className="relative w-full py-20 md:py-28 bg-[#08080a]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-sans text-[11px] tracking-[0.25em] text-[#8E8E93] uppercase font-bold">
                DROP 04 ARCHIVE
              </span>
            </div>
            <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl text-white font-black tracking-tight">
              CURATED COLLECTION
            </h2>
            <p className="text-xs text-[#8E8E93] font-sans mt-1.5 font-medium">
              Showing {filteredAndSortedProducts.length} of {products.length} architectural streetwear pieces
            </p>
          </div>

          {/* Sort & Search Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Search inside collection */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#121217] border border-white/10 text-xs text-white pl-8 pr-3 py-2 rounded-xs focus:outline-none focus:border-white/40 font-sans w-44 sm:w-56 font-medium"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#121217] border border-white/10 px-3 py-2 rounded-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-white/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white font-sans focus:outline-none cursor-pointer font-medium"
              >
                <option value="featured" className="bg-[#121217]">Featured Releases</option>
                <option value="price-low" className="bg-[#121217]">Price: Low to High</option>
                <option value="price-high" className="bg-[#121217]">Price: High to Low</option>
                <option value="rating" className="bg-[#121217]">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategoryFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveCategoryFilter(tab)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-sans uppercase tracking-wider font-bold transition-all rounded-xs border ${
                  isActive
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-[#111116] text-[#8E8E93] hover:text-white border-white/[0.08] hover:border-white/20"
                }`}
              >
                {tab === "NEW DROPS" && "✨ "}
                {tab === "BEST SELLERS" && "🔥 "}
                {tab === "ARCHIVE SALE" && "🏷️ "}
                {tab}
              </button>
            );
          })}
        </div>

        {/* 3D Product Grid - 4 Columns fitting large screen & responsive */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-xs p-8">
            <p className="font-brand text-lg text-white font-bold mb-2">
              NO GARMENTS FOUND
            </p>
            <p className="text-xs text-[#8E8E93] font-sans max-w-sm mx-auto mb-6">
              No architectural garments match the selected filters.
            </p>
            <button
              onClick={() => {
                setActiveCategoryFilter("ALL");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold rounded-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard3D
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
