"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartAuth } from "@/context/CartAuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Order, OrderStatus } from "@/types";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowLeft,
  Calendar,
  LogOut,
  LogIn,
  UserPlus,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  User,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Tag,
  Sparkles,
} from "lucide-react";

const ORDER_TRACKING_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "PLACED", label: "Order Placed", desc: "Received at our atelier" },
  { status: "CONFIRMED", label: "Confirmed", desc: "Stock allocated & prepped" },
  { status: "PROCESSING", label: "Laser Personalization", desc: "Crafting bespoke engraving" },
  { status: "PACKED", label: "Sealed & QC", desc: "Inspected & sealed" },
  { status: "SHIPPED", label: "Dispatched", desc: "Handed over to carrier" },
  { status: "IN_TRANSIT", label: "In Transit", desc: "En route to hub" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Courier on delivery run" },
  { status: "DELIVERED", label: "Delivered", desc: "Arrived at your door" },
];

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  PLACED: {
    label: "Placed",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/30",
  },
  PROCESSING: {
    label: "Laser Personalizing",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/30",
  },
  PACKED: {
    label: "Packed & Sealed",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/30",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
  },
};

export default function CustomerDashboardPage() {
  const { user, authLoading, signIn, signUp, signOutUser } = useCartAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Authentication inputs
  const [isRegister, setIsRegister] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen to customer orders from Firestore
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);

    try {
      const qByUid = query(
        collection(db, "orders"),
        where("userUid", "==", user.uid)
      );

      const unsubscribe = onSnapshot(
        qByUid,
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Order);
          });
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setOrders(list);
          setLoadingOrders(false);
        },
        (err) => {
          console.warn("UID order stream error:", err);
          if (user.email) {
            const qByEmail = query(
              collection(db, "orders"),
              where("customerEmail", "==", user.email)
            );
            onSnapshot(qByEmail, (snap) => {
              const list: Order[] = [];
              snap.forEach((d) => {
                list.push({ id: d.id, ...d.data() } as Order);
              });
              list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
              setOrders(list);
              setLoadingOrders(false);
            });
          } else {
            setLoadingOrders(false);
          }
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
      setLoadingOrders(false);
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      if (isRegister) {
        await signUp(emailInput, passwordInput);
      } else {
        await signIn(emailInput, passwordInput);
      }
    } catch (err: any) {
      setAuthError(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Helper to calculate progress index in the stepper
  const getStepIndex = (status: OrderStatus) => {
    return ORDER_TRACKING_STEPS.findIndex((s) => s.status === status);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f4f4f2] selection:bg-white selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0c0c10]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[#8E8E93] hover:text-white flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Storefront
            </Link>
            <span className="text-white/20">|</span>
            <span className="font-brand text-lg font-black text-white tracking-wider">
              FBFY CUSTOMER PORTAL
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#8E8E93] hidden sm:inline">
                Signed in as <strong className="text-white">{user.email}</strong>
              </span>
              <button
                onClick={() => signOutUser()}
                className="text-xs text-rose-400 hover:text-rose-300 font-sans uppercase tracking-wider flex items-center gap-1 px-3 py-1.5 rounded bg-rose-500/10 border border-rose-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {!user ? (
          /* ================= LOGIN & REGISTER SECTION ================= */
          <div className="max-w-md mx-auto bg-[#0e0e13] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                <User className="w-5 h-5" />
              </div>
              <h1 className="font-brand text-2xl font-black text-white tracking-tight">
                {isRegister ? "CREATE YOUR FBFY ACCOUNT" : "SIGN IN TO YOUR DASHBOARD"}
              </h1>
              <p className="font-sans text-xs text-[#8E8E93] mt-1.5">
                {isRegister
                  ? "Join the private archive for bespoke laser engravings, drop notifications & live tracking."
                  : "Access your order history, delivery fulfillment steppers & profile credentials."}
              </p>
            </div>

            {authError && (
              <div className="p-3 mb-5 bg-rose-950/40 border border-rose-500/30 text-rose-300 font-sans text-xs flex items-center gap-2 rounded-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#14141a] border border-white/15 text-white font-sans text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#14141a] border border-white/15 text-white font-sans text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 transition-all flex items-center justify-center gap-2 rounded-xs shadow-lg mt-3 disabled:opacity-50"
              >
                {authSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Customer Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setAuthError(null);
                }}
                className="font-sans text-xs text-[#8E8E93] hover:text-white transition-colors"
              >
                {isRegister ? (
                  <span>
                    Already registered?{" "}
                    <strong className="text-white underline font-bold">Sign In</strong>
                  </span>
                ) : (
                  <span>
                    New customer?{" "}
                    <strong className="text-white underline font-bold">Create Account</strong>
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ================= LOGGED IN CUSTOMER DASHBOARD ================= */
          <div className="space-y-8">
            {/* Customer Welcome Header */}
            <div className="bg-[#0e0e13] border border-white/10 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="font-sans text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AUTHENTICATED CLIENT
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl font-black text-white">
                  WELCOME, {user.email?.split("@")[0].toUpperCase()}
                </h1>
                <p className="font-sans text-xs text-[#8E8E93] mt-1">
                  Account: <span className="text-white">{user.email}</span> • Client ID:{" "}
                  <span className="font-mono-clean text-[#6E6E73]">{user.uid}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/#collection"
                  className="px-4 py-2.5 bg-white text-black font-sans text-xs uppercase tracking-wider font-extrabold hover:bg-white/90 rounded-xs flex items-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Shop New Drops
                </Link>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-white/10 gap-2">
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setSelectedOrder(null);
                }}
                className={`py-3 px-5 font-sans text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "orders"
                    ? "border-white text-white bg-white/5"
                    : "border-transparent text-[#8E8E93] hover:text-white"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Wardrobe Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3 px-5 font-sans text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "profile"
                    ? "border-white text-white bg-white/5"
                    : "border-transparent text-[#8E8E93] hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Security & Profile</span>
              </button>
            </div>

            {/* TAB: ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {selectedOrder ? (
                  /* Detailed Order View with Live Stepper */
                  <div className="bg-[#0e0e13] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs font-sans text-[#8E8E93] hover:text-white flex items-center gap-1.5 transition-colors mb-2"
                    >
                      ← Back to order overview
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <span className="font-sans text-[10px] text-[#8E8E93] uppercase tracking-widest block">
                          ORDER ARCHIVE ID
                        </span>
                        <h2 className="font-mono-clean text-lg sm:text-xl font-bold text-white mt-0.5">
                          #{selectedOrder.id}
                        </h2>
                        <span className="text-[11px] text-[#8E8E93] font-sans flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Placed on{" "}
                          {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-xs font-sans text-xs uppercase tracking-wider font-bold border ${
                            STATUS_BADGE[selectedOrder.status]?.border || "border-white/20"
                          } ${STATUS_BADGE[selectedOrder.status]?.bg || "bg-white/5"} ${
                            STATUS_BADGE[selectedOrder.status]?.color || "text-white"
                          }`}
                        >
                          {STATUS_BADGE[selectedOrder.status]?.label || selectedOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* Carrier & Tracking Bar */}
                    <div className="p-4 bg-black/50 border border-white/5 rounded-xs grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                      <div>
                        <span className="text-[#8E8E93] text-[10px] uppercase block">
                          Carrier Partner
                        </span>
                        <span className="text-white font-bold flex items-center gap-1.5 mt-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-400" />
                          {selectedOrder.courierPartner || "BlueDart Express"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#8E8E93] text-[10px] uppercase block">
                          AWB Tracking Number
                        </span>
                        <span className="font-mono-clean text-emerald-400 font-bold mt-1 block">
                          {selectedOrder.trackingNumber || "Pending Dispatch Allocation"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#8E8E93] text-[10px] uppercase block">
                          Shipping Address
                        </span>
                        <span className="text-white text-[11px] mt-1 block">
                          {selectedOrder.address}, {selectedOrder.city} - {selectedOrder.postalCode}
                        </span>
                      </div>
                    </div>

                    {/* LIVE FULFILLMENT STEPPER */}
                    <div className="space-y-4 pt-2">
                      <h3 className="font-brand text-xs uppercase tracking-widest text-[#8E8E93] font-bold">
                        LIVE FULFILLMENT MILESTONES
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ORDER_TRACKING_STEPS.slice(0, 4).map((step, idx) => {
                          const currentIdx = getStepIndex(selectedOrder.status);
                          const isDone = currentIdx >= idx;
                          const isCurrent = currentIdx === idx;

                          return (
                            <div
                              key={step.status}
                              className={`p-3.5 rounded-xs border transition-all ${
                                isCurrent
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                  : isDone
                                  ? "bg-white/[0.03] border-white/20 text-white"
                                  : "bg-white/[0.01] border-white/5 text-[#6E6E73]"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#6E6E73]" />
                                )}
                                <span className="font-sans text-[11px] font-bold uppercase tracking-wider">
                                  {step.label}
                                </span>
                              </div>
                              <p className="font-sans text-[10px] opacity-80">{step.desc}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ORDER_TRACKING_STEPS.slice(4).map((step, idx) => {
                          const realIdx = idx + 4;
                          const currentIdx = getStepIndex(selectedOrder.status);
                          const isDone = currentIdx >= realIdx;
                          const isCurrent = currentIdx === realIdx;

                          return (
                            <div
                              key={step.status}
                              className={`p-3.5 rounded-xs border transition-all ${
                                isCurrent
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                  : isDone
                                  ? "bg-white/[0.03] border-white/20 text-white"
                                  : "bg-white/[0.01] border-white/5 text-[#6E6E73]"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#6E6E73]" />
                                )}
                                <span className="font-sans text-[11px] font-bold uppercase tracking-wider">
                                  {step.label}
                                </span>
                              </div>
                              <p className="font-sans text-[10px] opacity-80">{step.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Purchased Garments */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-brand text-xs uppercase tracking-widest text-[#8E8E93] font-bold">
                        ORDERED SILHOUETTES ({selectedOrder.items?.length || 0})
                      </h3>

                      <div className="space-y-2.5">
                        {selectedOrder.items?.map((it, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-black/40 border border-white/10 rounded-xs flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-16 bg-black border border-white/10 rounded-xs overflow-hidden relative flex-shrink-0">
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-brand text-sm font-bold text-white">
                                  {it.name}
                                </h4>
                                <div className="text-xs text-[#8E8E93] font-sans flex items-center gap-2 mt-0.5">
                                  <span>Size: {it.size}</span>
                                  <span>•</span>
                                  <span>Color: {it.color?.name}</span>
                                  <span>•</span>
                                  <span>Qty: {it.quantity}</span>
                                </div>
                                {it.customName && (
                                  <div className="mt-1 font-mono-clean text-[10px] text-emerald-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Laser Engraved: fbfy by {it.customName}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="font-brand text-sm font-bold text-white">
                              ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Total */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-sans text-xs">
                      <div className="text-[#8E8E93]">
                        Payment via <strong className="text-white">{selectedOrder.paymentMethod}</strong> (Status:{" "}
                        <span className="text-emerald-400 font-bold">{selectedOrder.paymentStatus}</span>)
                      </div>
                      <div className="text-right">
                        <span className="text-[#8E8E93] mr-2">Total Amount:</span>
                        <span className="font-brand text-lg font-black text-white">
                          ₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : loadingOrders ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-[#8E8E93]">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="font-sans text-xs uppercase tracking-wider">
                      Streaming your order archive from Firebase...
                    </span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-white/10 rounded-sm p-8 space-y-4 bg-[#0e0e13]">
                    <Package className="w-12 h-12 text-white/30 mx-auto" />
                    <h3 className="font-brand text-lg text-white font-bold">
                      Your Wardrobe Archive is Empty
                    </h3>
                    <p className="font-sans text-xs text-[#8E8E93] max-w-sm mx-auto">
                      You haven't placed any orders yet. Discover our latest heavy cotton silhouettes and laser-engraved editions.
                    </p>
                    <Link
                      href="/#collection"
                      className="inline-block mt-2 px-6 py-2.5 bg-white text-black font-sans text-xs uppercase tracking-wider font-extrabold rounded-xs hover:bg-white/90 transition-colors"
                    >
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map((ord) => {
                      const badge = STATUS_BADGE[ord.status] || {
                        label: ord.status,
                        color: "text-white",
                        bg: "bg-white/5",
                        border: "border-white/20",
                      };

                      return (
                        <div
                          key={ord.id}
                          className="p-5 bg-[#0e0e13] border border-white/10 hover:border-white/25 rounded-sm transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                            <div>
                              <span className="font-mono-clean text-sm font-bold text-white block">
                                #{ord.id}
                              </span>
                              <span className="font-sans text-xs text-[#8E8E93] flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-xs font-sans text-[10px] uppercase tracking-wider font-bold border ${badge.border} ${badge.bg} ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="font-sans text-xs text-[#A1A1A6]">
                              <span>{ord.items?.length || 1} Silhouettes</span>
                              <span className="mx-2">•</span>
                              <span className="text-white font-bold">
                                ₹{ord.totalAmount?.toLocaleString("en-IN")}
                              </span>
                              {ord.trackingNumber && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="text-emerald-400 font-mono-clean">
                                    AWB: {ord.trackingNumber}
                                  </span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="font-sans text-xs text-white hover:text-emerald-400 font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <span>Track Live Fulfillment</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <div className="max-w-2xl bg-[#0e0e13] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-brand text-lg text-white font-bold">
                    CLIENT CREDENTIALS & SECURITY
                  </h3>
                  <p className="font-sans text-xs text-[#8E8E93] mt-1">
                    Managed securely via Firebase Authentication.
                  </p>
                </div>

                <div className="space-y-4 font-sans text-xs divide-y divide-white/5">
                  <div className="pt-3">
                    <span className="text-[#8E8E93] text-[10px] uppercase block font-bold">
                      Account Email
                    </span>
                    <span className="text-white font-semibold text-sm mt-0.5 block">
                      {user.email}
                    </span>
                  </div>

                  <div className="pt-3">
                    <span className="text-[#8E8E93] text-[10px] uppercase block font-bold">
                      Customer Unique UID
                    </span>
                    <span className="font-mono-clean text-xs text-[#8E8E93] mt-0.5 block">
                      {user.uid}
                    </span>
                  </div>

                  <div className="pt-3">
                    <span className="text-[#8E8E93] text-[10px] uppercase block font-bold">
                      Security Status
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                      Encrypted Cloud Session Active
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => signOutUser()}
                    className="px-5 py-2.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-950/70 font-sans text-xs uppercase tracking-wider font-bold rounded-xs transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out of Customer Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
