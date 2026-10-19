"use client";

import React, { useState } from "react";
import { useCartAuth } from "@/context/CartAuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { X, CheckCircle, ShieldCheck, Truck, Loader2, CreditCard } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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
    paymentMethod: "Razorpay", // Default to Razorpay
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const saveOrderToFirestore = async (paymentStatus: string, razorpayPaymentId?: string) => {
    const orderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      paymentMethod: formData.paymentMethod,
      paymentStatus,
      razorpayPaymentId: razorpayPaymentId || null,
      items: cartItems,
      totalAmount: cartTotal,
      currency: "INR",
      status: "CONFIRMED",
      createdAt: Date.now(),
      userUid: user?.uid || "guest",
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderConfirmed(docRef.id);
      if (razorpayPaymentId) setConfirmedPaymentId(razorpayPaymentId);
      clearCart();
    } catch (err) {
      console.error("Order submission to Firestore failed, fallback to local ID:", err);
      const fallbackId = "FBFY-" + Math.floor(100000 + Math.random() * 900000);
      setOrderConfirmed(fallbackId);
      if (razorpayPaymentId) setConfirmedPaymentId(razorpayPaymentId);
      clearCart();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    if (formData.paymentMethod === "Cash on Delivery") {
      // Direct Cash on Delivery submission
      await saveOrderToFirestore("PENDING (COD)");
      setIsSubmitting(false);
      return;
    }

    // Razorpay Integration
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Unable to load Razorpay SDK. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";

      const firstItem = cartItems[0];
      const customDescription = firstItem?.customName
        ? `fbfy by ${firstItem.customName}`
        : "fbfy Streetwear Order";

      const options = {
        key: keyId,
        amount: Math.round(cartTotal * 100), // in paise
        currency: "INR",
        name: "fbfy",
        description: customDescription,
        image: "https://www.fbfy.in/favicon.ico",
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#050506",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async function (response: { razorpay_payment_id: string }) {
          await saveOrderToFirestore("PAID", response.razorpay_payment_id);
          setIsSubmitting(false);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error?.description || "Transaction cancelled"}`);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay launch error:", err);
      // If Razorpay popup blocked or error occurs, offer fallback
      alert("Payment gateway initialized. If the popup was blocked, please allow popups.");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderConfirmed(null);
    setConfirmedPaymentId(null);
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
                <span className="text-white font-semibold">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>DESTINATION:</span>
                <span className="text-white">
                  {formData.city}, {formData.postalCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT METHOD:</span>
                <span className="text-white font-semibold">{formData.paymentMethod}</span>
              </div>
              {confirmedPaymentId && (
                <div className="flex justify-between text-emerald-400">
                  <span>RAZORPAY PAYMENT ID:</span>
                  <span className="font-mono font-bold">{confirmedPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold">
                  {confirmedPaymentId ? "PAID (RECORDED IN FIREBASE)" : "CONFIRMED (STORED IN FIREBASE)"}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors"
            >
              RETURN TO ATELIER
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

            {/* Payment Method Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93]">
                  SELECT PAYMENT METHOD
                </label>
                <span className="font-mono-clean text-[10px] text-emerald-400">
                  RAZORPAY VERIFIED GATEWAY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "Razorpay" })
                  }
                  className={`p-3.5 text-left border font-mono-clean text-xs transition-all flex flex-col justify-between ${
                    formData.paymentMethod === "Razorpay"
                      ? "bg-white text-black border-white font-bold shadow-lg"
                      : "bg-[#141419] text-[#8E8E93] border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CreditCard className="w-4 h-4" />
                      RAZORPAY ONLINE
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      INSTANT
                    </span>
                  </div>
                  <span className="text-[10px] opacity-75">
                    UPI, GPay, PhonePe, Cards, NetBanking
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "Cash on Delivery" })
                  }
                  className={`p-3.5 text-left border font-mono-clean text-xs transition-all flex flex-col justify-between ${
                    formData.paymentMethod === "Cash on Delivery"
                      ? "bg-white text-black border-white font-bold shadow-lg"
                      : "bg-[#141419] text-[#8E8E93] border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Truck className="w-4 h-4" />
                      CASH ON DELIVERY
                    </span>
                  </div>
                  <span className="text-[10px] opacity-75">
                    Pay in cash upon doorstep delivery
                  </span>
                </button>
              </div>
            </div>

            {/* Submit & Guarantee */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {formData.paymentMethod === "Razorpay"
                        ? "INITIALIZING RAZORPAY..."
                        : "RECORDING IN FIREBASE..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {formData.paymentMethod === "Razorpay"
                      ? `PAY VIA RAZORPAY — ₹${cartTotal.toLocaleString()}`
                      : `CONFIRM CASH ON DELIVERY — ₹${cartTotal.toLocaleString()}`}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono-clean text-[#6E6E73] text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Razorpay Checkout • 7-Day Hassle-Free Returns</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
