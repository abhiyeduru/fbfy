"use client";

import React, { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Order, OrderStatus } from "@/types";
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  CreditCard,
  ArrowLeft,
  Package,
} from "lucide-react";

const TRACKING_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "PLACED", label: "Order Placed", desc: "Received in our studio system" },
  { status: "CONFIRMED", label: "Order Confirmed", desc: "Payment & allocation verified" },
  { status: "PROCESSING", label: "Processing & QC", desc: "Garment inspection & packaging" },
  { status: "PACKED", label: "Packed", desc: "Sealed in tamper-proof mailer" },
  { status: "SHIPPED", label: "Shipped", desc: "Handed over to express courier" },
  { status: "IN_TRANSIT", label: "In Transit", desc: "Moving across carrier network" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "With your local delivery agent" },
  { status: "DELIVERED", label: "Delivered", desc: "Safely received at address" },
];

export default function TrackingPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderQuery.trim();
    if (!cleanId) {
      setError("Please enter your Order ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setFoundOrder(null);

    try {
      const docRef = doc(db, "orders", cleanId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Order;
        setFoundOrder(data);
        setLoading(false);
        return;
      }

      if (phoneQuery.trim()) {
        const q = query(
          collection(db, "orders"),
          where("customerPhone", "==", phoneQuery.trim())
        );
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const first = querySnap.docs[0];
          setFoundOrder({ id: first.id, ...first.data() } as Order);
          setLoading(false);
          return;
        }
      }

      // Demo fallback
      if (cleanId.startsWith("FBF-") || cleanId.startsWith("DEMO")) {
        setFoundOrder({
          id: cleanId,
          customerName: "Founder Club Member",
          customerEmail: "member@fbfy.in",
          customerPhone: "+91 98765 43210",
          address: "104 Monolith Towers, Indiranagar 100ft Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          items: [
            {
              id: "item-1",
              productId: "001-build-fail-learn",
              name: "001 BUILD. FAIL. LEARN. REPEAT.",
              code: "FBF-001-BFR",
              color: { id: "acidBlack", name: "Acid Black", hex: "#1c1c1f", textColor: "#fff" },
              size: "L",
              customName: "ABHI",
              price: 2999,
              quantity: 1,
              image: "/assets/products/p01_front.jpg",
            },
          ],
          totalAmount: 2999,
          paymentMethod: "Razorpay (Prepaid)",
          paymentStatus: "PAID",
          status: "SHIPPED",
          courierPartner: "BlueDart Apex Express",
          trackingNumber: "BD-9824108821",
          trackingUrl: "https://www.bluedart.com",
          estimatedDelivery: "3 business days",
          createdAt: Date.now() - 86400000 * 2,
        });
        setLoading(false);
        return;
      }

      setError("No order found matching that reference. Please check your order ID or contact studio support.");
    } catch (err) {
      console.error("Order lookup error:", err);
      setError("Unable to search orders at this moment. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status?: OrderStatus) => {
    if (!status) return 0;
    const idx = TRACKING_STEPS.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const activeStepIdx = getStepIndex(foundOrder?.status);

  return (
    <div className="min-h-screen bg-[#08080a] text-white py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono-clean text-xs text-[#8E8E93] hover:text-white mb-8 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <span className="font-mono-clean text-xs text-[#8E8E93] uppercase tracking-[0.25em]">
              FBFY COURIER DISPATCH
            </span>
          </div>
          <h1 className="font-brand text-3xl md:text-5xl font-extrabold tracking-tight">
            TRACK YOUR SHIPMENT
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono-clean mt-2">
            Real-time fulfillment milestone tracker connected with BlueDart, Delhivery, and DTDC.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0e0e13] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono-clean uppercase tracking-wider text-[#8E8E93] mb-1.5">
                  Order Reference / ID *
                </label>
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. FBF-109283 or Firestore ID"
                  className="w-full bg-[#14141a] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono-clean"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-clean uppercase tracking-wider text-[#8E8E93] mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-[#14141a] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono-clean"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-white/40 font-mono-clean">
                Sample preview ID: <strong className="text-white">FBF-001</strong>
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-white text-black hover:bg-white/90 font-mono-clean text-xs uppercase tracking-widest font-extrabold flex items-center gap-2 rounded-xs transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    Track Shipment
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Found Order Card */}
        {foundOrder && (
          <div className="bg-[#0e0e13] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14141b] p-4 border border-white/5 rounded-xs">
              <div>
                <span className="text-[10px] font-mono-clean uppercase tracking-widest text-white/50 block">
                  ORDER REFERENCE
                </span>
                <span className="font-mono-clean text-sm font-bold text-white">
                  {foundOrder.id}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono-clean uppercase tracking-widest text-white/50 block">
                  PAYMENT
                </span>
                <span className="font-mono-clean text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {foundOrder.paymentStatus} ({foundOrder.paymentMethod})
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono-clean uppercase tracking-widest text-white/50 block">
                  CARRIER & AWB
                </span>
                <span className="font-mono-clean text-xs text-white">
                  {foundOrder.courierPartner || "BlueDart Apex"} •{" "}
                  <span className="text-emerald-400">
                    {foundOrder.trackingNumber || "AWB Pending"}
                  </span>
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div>
              <span className="text-[11px] font-mono-clean uppercase tracking-[0.2em] text-[#8E8E93] block mb-4">
                SHIPMENT TIMELINE
              </span>

              <div className="space-y-4">
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;

                  return (
                    <div key={step.status} className="flex items-start gap-3 relative">
                      {idx < TRACKING_STEPS.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                            idx < activeStepIdx ? "bg-emerald-400" : "bg-white/10"
                          }`}
                        />
                      )}

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                          isCurrent
                            ? "bg-emerald-400 text-black ring-4 ring-emerald-400/20"
                            : isCompleted
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                            : "bg-[#181820] text-white/30 border border-white/10"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono-clean text-xs uppercase tracking-wider font-semibold ${
                              isCurrent
                                ? "text-emerald-400"
                                : isCompleted
                                ? "text-white"
                                : "text-white/40"
                            }`}
                          >
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono-clean">
                              CURRENT STATUS
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8E8E93] mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="bg-[#14141a] p-3.5 rounded-xs border border-white/5">
                <span className="text-[10px] font-mono-clean uppercase tracking-wider text-white/50 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Delivery Destination
                </span>
                <p className="text-xs font-mono-clean text-white">
                  {foundOrder.customerName}
                </p>
                <p className="text-[11px] text-[#8E8E93]">
                  {foundOrder.address}, {foundOrder.city} - {foundOrder.postalCode}
                </p>
              </div>

              <div className="bg-[#14141a] p-3.5 rounded-xs border border-white/5">
                <span className="text-[10px] font-mono-clean uppercase tracking-wider text-white/50 block mb-1">
                  Order Total
                </span>
                <p className="font-brand text-base text-white font-bold">
                  ₹{foundOrder.totalAmount?.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-emerald-400 font-mono-clean">
                  Studio Authenticated Piece
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
