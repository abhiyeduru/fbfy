"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { PRODUCTS } from "@/data/products";
import { Search, X, ArrowRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
  products = PRODUCTS,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0c0c0f] border border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 flex-grow">
            <Search className="w-5 h-5 text-[#8E8E93]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH COLLECTION, SILHOUETTE, CODE..."
              autoFocus
              className="w-full bg-transparent text-white font-mono-clean text-sm placeholder:text-[#6E6E73] focus:outline-none"
            />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center font-mono-clean text-xs text-[#6E6E73]">
              NO MATCHING GARMENTS FOUND
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center justify-between p-3 bg-[#111115] hover:bg-[#16161c] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-14 bg-black border border-white/10 overflow-hidden flex-shrink-0">
                    <Image
                      src={prod.imageFront}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-brand text-sm text-white font-bold group-hover:text-white">
                      {prod.name}
                    </h4>
                    <p className="font-mono-clean text-xs text-[#8E8E93]">
                      {prod.code} • {prod.collection} • {prod.gsm} GSM
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-white transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
