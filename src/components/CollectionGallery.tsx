"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { PRODUCTS } from "@/data/products";
import { ProductCard3D } from "./ProductCard3D";

interface CollectionGalleryProps {
  onSelectProduct: (product: Product) => void;
}

const COLLECTIONS = ["ALL", "SIGNATURE", "GRAPHIC", "WASHED", "LIMITED"] as const;

export function CollectionGallery({ onSelectProduct }: CollectionGalleryProps) {
  const [activeTab, setActiveTab] = useState<(typeof COLLECTIONS)[number]>("ALL");

  const filteredProducts =
    activeTab === "ALL"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.collection === activeTab);

  return (
    <section id="collection" className="relative w-full py-28 md:py-36 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
          <div>
            <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase block mb-3">
              PRODUCT ARCHIVE
            </span>
            <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight">
              COLLECTIONS
            </h2>
          </div>

          {/* Collection Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {COLLECTIONS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-mono-clean uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-white text-black font-semibold"
                    : "bg-[#111114] text-[#8E8E93] hover:text-white border border-white/5 hover:border-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard3D
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
