"use client";

import React from "react";
import Image from "next/image";
import { useCartAuth } from "@/context/CartAuthContext";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

interface WishlistDrawerProps {
  onSelectProduct: (product: Product) => void;
}

export function WishlistDrawer({ onSelectProduct }: WishlistDrawerProps) {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
  } = useCartAuth();

  if (!isWishlistOpen) return null;

  const currentProducts = products && products.length > 0 ? products : PRODUCTS;
  const wishlistedProducts = currentProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0d12] border-l border-white/10 h-full flex flex-col p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h2 className="font-brand text-lg font-bold tracking-tight">
              WISHLIST ARCHIVE ({wishlistedProducts.length})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {wishlistedProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white/30" />
            </div>
            <p className="font-brand text-base font-bold text-white">
              YOUR WISHLIST IS EMPTY
            </p>
            <p className="text-xs text-[#8E8E93] max-w-xs font-mono-clean">
              Tap the heart icon on any architectural garment to save it for your next studio drop.
            </p>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="mt-4 px-6 py-2.5 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-white/90 transition-all"
            >
              EXPLORE COLLECTION
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 bg-[#131318] border border-white/5 rounded-sm hover:border-white/15 transition-all"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onSelectProduct(product);
                  }}
                  className="relative w-20 aspect-[3/4] bg-black/40 overflow-hidden cursor-pointer rounded-xs shrink-0"
                >
                  <Image
                    src={product.imageFront}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        className="font-brand text-xs font-bold text-white hover:text-white/80 cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-white/40 hover:text-rose-400 p-1"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-mono-clean text-[10px] text-[#8E8E93] mt-0.5">
                      {product.gsm} GSM • {product.category}
                    </p>

                    <p className="font-mono-clean text-xs text-white font-bold mt-1">
                      ₹{product.price.toLocaleString("en-IN")}
                      {product.originalPrice && (
                        <span className="text-[10px] text-white/40 line-through ml-2 font-normal">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        addToCart(
                          product,
                          product.availableColors[0],
                          "L",
                          "YOU",
                          1
                        );
                        setIsWishlistOpen(false);
                      }}
                      className="flex-1 py-1.5 bg-white text-black font-mono-clean text-[10px] uppercase tracking-wider font-bold rounded-xs hover:bg-white/90 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
