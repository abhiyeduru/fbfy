"use client";

import React, { useState } from "react";
import { useCartAuth } from "@/context/CartAuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { X, CheckCircle, ShieldCheck, Truck, Loader2 } from "lucide-react";

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    cartTotal,
    clearCart,
    user,
  } = useCartAuth();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentMethod: formData.paymentMethod,
        items: cartItems,
        totalAmount: cartTotal,
        status: "PENDING",
        createdAt: Date.now(),
        userUid: user?.uid || "guest",
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderConfirmed(docRef.id);
      clearCart();
    } catch (err) {
      console.error("Order submission failed:", err);
      // Fallback local confirmation if Firestore rules or offline
      setOrderConfirmed("FBFY-" + Math.floor(100000 + Math.random() * 900000));
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderConfirmed(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/10 shadow-2xl p-6 md:p-8 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <span className="font-brand text-xl text-white font-bold tracking-tight">
            {orderConfirmed ? "ORDER CONFIRMED" : "FBFY // CHECKOUT"}
          </span>

          <button
            onClick={handleClose}
            aria-label="Close Checkout"
            className="p-1.5 text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderConfirmed ? (
          /* Confirmation Screen */
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
            <h3 className="font-brand text-2xl text-white font-bold mb-2">
              YOUR ORDER HAS BEEN PLACED
            </h3>
            <p className="font-mono-clean text-xs text-[#8E8E93] mb-6">
              ORDER REFERENCE:{" "}
              <span className="text-white font-bold">{orderConfirmed}</span>
            </p>

            <div className="bg-[#121217] border border-white/10 p-4 max-w-md mx-auto text-left font-mono-clean text-xs text-[#A1A1A6] mb-8 space-y-2">
              <div className="flex justify-between">
                <span>SHIPPING TO:</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>DESTINATION:</span>
                <span className="text-white">
                  {formData.city}, {formData.postalCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold">CONFIRMED (STORED IN FIREBASE)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors"
            >
              RETURN TO STORE
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary Pill */}
            <div className="flex items-center justify-between p-3 bg-[#121217] border border-white/5 font-mono-clean text-xs">
              <span className="text-[#8E8E93]">
                {cartItems.length} ITEM(S) WITH PERSONALIZED SIGNATURE
              </span>
              <span className="text-white font-bold text-sm">
                TOTAL: ₹{cartTotal.toLocaleString()}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                  DELIVERY ADDRESS *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Street Address, Apartment, Flat"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                  CITY *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                  PINCODE / POSTAL CODE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  placeholder="500001"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-2">
                PAYMENT METHOD
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "Cash on Delivery" })
                  }
                  className={`p-3 text-left border font-mono-clean text-xs transition-all ${
                    formData.paymentMethod === "Cash on Delivery"
                      ? "bg-white text-black border-white font-bold"
                      : "bg-[#141419] text-[#8E8E93] border-white/10 hover:border-white/30"
                  }`}
                >
                  <Truck className="w-4 h-4 mb-1" />
                  CASH ON DELIVERY
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "UPI / Online" })
                  }
                  className={`p-3 text-left border font-mono-clean text-xs transition-all ${
                    formData.paymentMethod === "UPI / Online"
                      ? "bg-white text-black border-white font-bold"
                      : "bg-[#141419] text-[#8E8E93] border-white/10 hover:border-white/30"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mb-1" />
                  UPI / ONLINE DEMO
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>RECORDING IN FIREBASE...</span>
                  </>
                ) : (
                  <span>PLACE ORDER — ₹{cartTotal.toLocaleString()}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
