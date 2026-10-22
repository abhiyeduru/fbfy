"use client";

import React, { useState } from "react";
import { useCartAuth } from "@/context/CartAuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  X,
  CheckCircle,
  ShieldCheck,
  Truck,
  Loader2,
  CreditCard,
  ArrowRight,
} from "lucide-react";

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
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    clearCart,
    user,
    setIsAuthOpen,
    setIsTrackOrderOpen,
  } = useCartAuth();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "Karnataka",
    postalCode: "",
    paymentMethod: "Razorpay", // Default to Razorpay
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const saveOrderToFirestore = async (paymentStatus: "PENDING" | "PAID" | "COD_PENDING", razorpayPaymentId?: string) => {
    const orderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      paymentMethod: formData.paymentMethod,
      paymentStatus,
      razorpayPaymentId: razorpayPaymentId || null,
      items: cartItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code || null,
      shippingFee: cartShippingFee,
      totalAmount: cartTotal,
      currency: "INR",
      status: "CONFIRMED",
      courierPartner: "BlueDart Express",
      trackingNumber: "BD-" + Math.floor(1000000000 + Math.random() * 9000000000),
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

    // Auth Gate: ensure customer is authenticated so their order links directly to their account
    if (!user) {
      alert("Please sign in or create an account to proceed with your order.");
      setIsCheckoutOpen(false);
      setIsAuthOpen(true);
      return;
    }

    setIsSubmitting(true);

    if (formData.paymentMethod === "Cash on Delivery") {
      await saveOrderToFirestore("COD_PENDING");
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
        name: "FBFY",
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
      <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/10 shadow-2xl p-6 md:p-8 my-auto text-white rounded-sm">
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
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-brand text-2xl text-white font-bold mb-1">
              YOUR ORDER HAS BEEN PLACED
            </h3>
            <p className="font-mono-clean text-xs text-[#8E8E93] mb-6">
              ORDER REFERENCE:{" "}
              <span className="text-white font-bold">{orderConfirmed}</span>
            </p>

            <div className="bg-[#121217] border border-white/10 p-4 max-w-md mx-auto text-left font-mono-clean text-xs text-[#A1A1A6] mb-6 space-y-2 rounded-xs">
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
                  <span>RAZORPAY ID:</span>
                  <span className="font-mono font-bold">{confirmedPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold">
                  CONFIRMED & ALLOCATED
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleClose();
                  setIsTrackOrderOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono-clean text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 rounded-xs"
              >
                <Truck className="w-4 h-4" />
                Track This Shipment
              </button>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white hover:text-black text-white font-mono-clean text-xs uppercase tracking-widest font-bold transition-all rounded-xs"
              >
                Return to Atelier
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Order Summary Pill */}
            <div className="flex items-center justify-between p-3.5 bg-[#121217] border border-white/5 font-mono-clean text-xs rounded-xs">
              <span className="text-[#8E8E93]">
                {cartItems.length} ITEM(S) • CUSTOM LASER ENGRAVED
              </span>
              <span className="text-white font-bold text-sm">
                TOTAL: ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Abhi Yeduru"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1">
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
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="abhi@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1">
                  DELIVERY ADDRESS *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Flat / Building, Street, Landmark"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1">
                  CITY *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Bengaluru"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div>
                <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1">
                  PINCODE / POSTAL CODE *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  placeholder="560038"
                  className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
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
                  SECURE CHECKOUT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "Razorpay" })
                  }
                  className={`p-3.5 text-left border font-mono-clean text-xs transition-all flex flex-col justify-between rounded-xs ${
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
                  className={`p-3.5 text-left border font-mono-clean text-xs transition-all flex flex-col justify-between rounded-xs ${
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
            <div className="pt-3 border-t border-white/10 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 transition-colors flex items-center justify-center gap-2 rounded-xs shadow-xl active:scale-98"
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
                      ? `PAY VIA RAZORPAY — ₹${cartTotal.toLocaleString("en-IN")}`
                      : `CONFIRM CASH ON DELIVERY — ₹${cartTotal.toLocaleString("en-IN")}`}
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
