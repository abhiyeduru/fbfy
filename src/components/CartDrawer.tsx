"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCartAuth } from "@/context/CartAuthContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  Truck,
  Sparkles,
} from "lucide-react";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings,
    setIsCheckoutOpen,
  } = useCartAuth();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

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

  const freeShippingThreshold = storeSettings.freeShippingThreshold || 1999;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#0b0b0e] border-l border-white/10 flex flex-col justify-between shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-[#0e0e13]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="font-brand text-base text-white font-bold tracking-tight">
                SHOPPING BAG ({cartCount})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close Bag"
              className="p-1.5 text-[#8E8E93] hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cartItems.length > 0 && (
            <div className="bg-[#14141a] p-2.5 rounded-xs border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono-clean">
                <span className="flex items-center gap-1.5 text-white/80">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  {remainingForFreeShipping === 0 ? (
                    <strong className="text-emerald-400">UNLOCKED FREE EXPRESS SHIPPING!</strong>
                  ) : (
                    <span>
                      Add <strong className="text-white">₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for Free Shipping
                    </span>
                  )}
                </span>
                <span className="text-white/40">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ShoppingBag className="w-7 h-7 text-white/30" />
              </div>
              <p className="font-brand text-base text-white font-bold">
                YOUR BAG IS EMPTY
              </p>
              <p className="font-mono-clean text-xs text-[#8E8E93] max-w-xs">
                Explore our architectural 280 GSM streetwear collection and customize your piece with custom hem laser-engraving.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold rounded-xs hover:bg-white/90 transition-colors"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3.5 bg-[#121217] border border-white/5 rounded-xs relative group"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 aspect-[3/4] bg-black border border-white/10 overflow-hidden flex-shrink-0 rounded-xs">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-brand text-xs text-white font-bold leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6E6E73] hover:text-rose-400 transition-colors p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono-clean text-[10px] text-[#8E8E93] mt-1 space-y-0.5">
                      <div>
                        SIZE: <span className="text-white font-semibold">{item.size}</span> • COLOR:{" "}
                        <span className="text-white font-semibold">{item.color.name}</span>
                      </div>
                      <div className="text-emerald-400 font-medium">
                        fbfy by {item.customName}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center border border-white/15 bg-[#0a0a0d] rounded-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-[#8E8E93] hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 font-mono-clean text-xs text-white font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-[#8E8E93] hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-brand text-xs font-bold text-white">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Section with Promo Code */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#0e0e13] space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-xs rounded-xs">
                  <span className="font-mono-clean text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Code applied: {appliedCoupon.code} (-₹{cartDiscount.toLocaleString("en-IN")})
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[10px] text-white/50 hover:text-rose-400 underline font-mono-clean"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-[#14141a] border border-white/15 pl-7 pr-3 py-1.5 text-xs font-mono-clean text-white uppercase placeholder-white/30 focus:outline-none focus:border-white rounded-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-mono-clean uppercase tracking-wider font-bold rounded-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponFeedback && !appliedCoupon && (
                <p className="text-[10px] font-mono-clean text-rose-400">
                  {couponFeedback.message}
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 font-mono-clean text-xs text-[#A1A1A6] pt-2 border-t border-white/5">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-white">₹{cartSubtotal.toLocaleString("en-IN")}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT ({appliedCoupon?.code})</span>
                  <span>-₹{cartDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-[11px]">
                <span>EXPRESS SHIPPING</span>
                <span className={cartShippingFee === 0 ? "text-emerald-400 font-bold" : "text-white"}>
                  {cartShippingFee === 0 ? "FREE" : `₹${cartShippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-[#6E6E73]">
                <span>CUSTOM LASER ENGRAVING</span>
                <span className="text-emerald-400">INCLUDED</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/10 text-white font-bold text-sm">
                <span>TOTAL PAYABLE</span>
                <span className="font-brand text-base">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 transition-all flex items-center justify-center gap-2 rounded-xs shadow-xl active:scale-98"
            >
              <span>PROCEED TO CHECKOUT • ₹{cartTotal.toLocaleString("en-IN")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
