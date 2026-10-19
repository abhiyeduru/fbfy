"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useCartAuth } from "@/context/CartAuthContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    setIsCheckoutOpen,
  } = useCartAuth();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-[#0b0b0e] border-l border-white/10 flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0e0e13]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="font-brand text-lg text-white font-bold tracking-tight">
              BAG ({cartCount})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Bag"
            className="p-1.5 text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#2a2a30] mb-4" />
              <p className="font-mono-clean text-sm text-[#8E8E93] uppercase tracking-wider mb-6">
                YOUR BAG IS EMPTY
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-white text-black font-mono-clean text-xs uppercase tracking-widest hover:bg-[#E8E8E4] transition-colors"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-[#121216] border border-white/5 relative group"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 bg-black border border-white/10 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-brand text-sm text-white font-bold leading-tight">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6E6E73] hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono-clean text-xs text-[#8E8E93] mt-1 space-y-0.5">
                      <div>
                        SIZE: <span className="text-white">{item.size}</span> • COLOR:{" "}
                        <span className="text-white">{item.color.name}</span>
                      </div>
                      <div className="text-emerald-400/90 font-medium">
                        fbfy by {item.customName}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center border border-white/10 bg-[#0a0a0d]">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-[#8E8E93] hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono-clean text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-[#8E8E93] hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono-clean text-sm font-bold text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Section */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0e0e13]">
            <div className="space-y-2 font-mono-clean text-xs text-[#A1A1A6] mb-4">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-white font-bold text-sm">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#6E6E73]">
                <span>PERSONALIZED ENGRAVING</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#6E6E73]">
                <span>SHIPPING</span>
                <span>CALCULATED AT CHECKOUT</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
