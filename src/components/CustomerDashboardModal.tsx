"use client";

import React, { useState, useEffect } from "react";
import { useCartAuth } from "@/context/CartAuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Order, OrderStatus } from "@/types";
import {
  X,
  User,
  ShoppingBag,
  Truck,
  Package,
  Calendar,
  LogOut,
  LogIn,
  UserPlus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const STATUS_CONFIG: Record<
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
    label: "Processing",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/30",
  },
  PACKED: {
    label: "Packed",
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

export function CustomerDashboardModal() {
  const { isAuthOpen, setIsAuthOpen, signIn, signUp, user, signOutUser } =
    useCartAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Customer's order stream
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Sync customer orders from Firestore
  useEffect(() => {
    if (!user) {
      setMyOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);

    try {
      // Query orders by UID
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

          // Sort in-memory by createdAt descending
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setMyOrders(list);
          setLoadingOrders(false);
        },
        (err) => {
          console.warn("Query by UID error, trying fallback:", err);
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
              setMyOrders(list);
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

  if (!isAuthOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#09090c] border border-white/15 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0e0e13]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-brand text-lg text-white font-bold tracking-tight">
                {user ? "CUSTOMER DASHBOARD" : isRegister ? "JOIN FBFY ARCHIVE" : "CUSTOMER SIGN IN"}
              </h2>
              <p className="font-sans text-[11px] text-[#8E8E93]">
                {user
                  ? user.email
                  : "Sign in to track orders, manage deliveries & access exclusive drops"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(false)}
            aria-label="Close"
            className="p-2 text-[#8E8E93] hover:text-white transition-colors rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {user ? (
          /* ================= Authenticated Customer Dashboard ================= */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center border-b border-white/10 px-4 sm:px-6 bg-[#0c0c10]">
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setSelectedOrder(null);
                }}
                className={`py-3.5 px-4 font-sans text-xs uppercase tracking-[0.18em] font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "orders"
                    ? "border-white text-white"
                    : "border-transparent text-[#8E8E93] hover:text-white"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({myOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3.5 px-4 font-sans text-xs uppercase tracking-[0.18em] font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "profile"
                    ? "border-white text-white"
                    : "border-transparent text-[#8E8E93] hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Details</span>
              </button>

              <div className="ml-auto flex items-center">
                <button
                  onClick={() => signOutUser()}
                  className="py-1.5 px-3 font-sans text-[10px] uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Tab: Orders */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {activeTab === "orders" && (
                <>
                  {selectedOrder ? (
                    /* Detailed Order View */
                    <div className="space-y-4">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-xs font-sans text-[#8E8E93] hover:text-white flex items-center gap-1.5 transition-colors mb-2"
                      >
                        ← Back to all orders
                      </button>

                      <div className="p-4 sm:p-5 bg-[#121217] border border-white/10 rounded-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div>
                            <span className="font-sans text-[10px] text-[#8E8E93] uppercase tracking-widest block">
                              ORDER ID
                            </span>
                            <span className="font-mono-clean text-sm font-bold text-white">
                              {selectedOrder.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-xs font-sans text-[10px] uppercase tracking-wider font-bold border ${
                                STATUS_CONFIG[selectedOrder.status]?.border || "border-white/20"
                              } ${STATUS_CONFIG[selectedOrder.status]?.bg || "bg-white/5"} ${
                                STATUS_CONFIG[selectedOrder.status]?.color || "text-white"
                              }`}
                            >
                              {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                            </span>
                          </div>
                        </div>

                        {/* Courier & Tracking Details */}
                        <div className="p-3.5 bg-black/40 border border-white/5 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                          <div>
                            <span className="text-[#8E8E93] block text-[10px] uppercase">
                              Courier Partner:
                            </span>
                            <span className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
                              <Truck className="w-3.5 h-3.5 text-emerald-400" />
                              {selectedOrder.courierPartner || "BlueDart Express"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#8E8E93] block text-[10px] uppercase">
                              AWB Tracking Number:
                            </span>
                            <span className="font-mono-clean text-emerald-400 font-bold mt-0.5 block">
                              {selectedOrder.trackingNumber || "Assigned upon dispatch"}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2.5">
                          <span className="font-sans text-xs text-[#8E8E93] uppercase tracking-wider block font-bold">
                            Purchased Items ({selectedOrder.items?.length || 0})
                          </span>
                          <div className="space-y-2">
                            {selectedOrder.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-14 bg-black/60 border border-white/10 rounded-xs overflow-hidden flex-shrink-0 relative">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-brand text-xs font-bold text-white">
                                      {item.name}
                                    </div>
                                    <div className="font-sans text-[11px] text-[#8E8E93] flex flex-wrap gap-2 mt-0.5">
                                      <span>Size: {item.size}</span>
                                      <span>•</span>
                                      <span>Color: {item.color?.name}</span>
                                      <span>•</span>
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                    {item.customName && (
                                      <div className="font-mono-clean text-[10px] text-emerald-400 mt-1">
                                        Personalized: fbfy by {item.customName}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="font-brand text-xs font-bold text-white text-right">
                                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial breakdown */}
                        <div className="pt-3 border-t border-white/10 space-y-1.5 font-sans text-xs text-[#8E8E93]">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-white font-mono-clean">
                              ₹{(selectedOrder.subtotal || selectedOrder.totalAmount).toLocaleString("en-IN")}
                            </span>
                          </div>
                          {selectedOrder.discount ? (
                            <div className="flex justify-between text-emerald-400">
                              <span>Discount ({selectedOrder.couponCode || "Coupon"})</span>
                              <span className="font-mono-clean">
                                -₹{selectedOrder.discount.toLocaleString("en-IN")}
                              </span>
                            </div>
                          ) : null}
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-white">
                              {selectedOrder.shippingFee ? `₹${selectedOrder.shippingFee}` : "FREE"}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/5 font-bold text-white text-sm">
                            <span>Total Paid ({selectedOrder.paymentMethod})</span>
                            <span className="font-brand text-base text-white">
                              ₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : loadingOrders ? (
                    <div className="py-16 text-center text-[#8E8E93] flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                      <span className="font-sans text-xs uppercase tracking-wider">
                        Syncing your order archives...
                      </span>
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div className="py-14 text-center border border-dashed border-white/10 rounded-sm p-6 space-y-3">
                      <Package className="w-10 h-10 text-white/30 mx-auto" />
                      <h3 className="font-brand text-base text-white font-bold">
                        No Orders Placed Yet
                      </h3>
                      <p className="font-sans text-xs text-[#8E8E93] max-w-sm mx-auto">
                        Your archive wardrobe is currently empty. Explore our latest heavyweight drops to initiate your first order.
                      </p>
                      <button
                        onClick={() => {
                          setIsAuthOpen(false);
                          const el = document.getElementById("collection");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="mt-3 px-5 py-2.5 bg-white text-black font-sans text-xs uppercase tracking-wider font-bold rounded-xs hover:bg-white/90 transition-colors"
                      >
                        Explore Collection
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myOrders.map((ord) => {
                        const statusBadge = STATUS_CONFIG[ord.status] || {
                          label: ord.status,
                          color: "text-white",
                          bg: "bg-white/5",
                          border: "border-white/20",
                        };

                        return (
                          <div
                            key={ord.id}
                            className="p-4 bg-[#111116] border border-white/10 hover:border-white/25 rounded-sm transition-all"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                              <div>
                                <span className="font-mono-clean text-xs font-bold text-white block">
                                  #{ord.id}
                                </span>
                                <span className="font-sans text-[11px] text-[#8E8E93] flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>

                              <span
                                className={`px-2.5 py-0.5 rounded-xs font-sans text-[10px] uppercase tracking-wider font-bold border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.color}`}
                              >
                                {statusBadge.label}
                              </span>
                            </div>

                            <div className="pt-2.5 flex items-center justify-between">
                              <div className="font-sans text-xs text-[#A1A1A6]">
                                <span>{ord.items?.length || 1} item(s)</span>
                                <span className="mx-2">•</span>
                                <span className="text-white font-bold">
                                  ₹{ord.totalAmount?.toLocaleString("en-IN")}
                                </span>
                              </div>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="font-sans text-xs text-white hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors"
                              >
                                <span>Track & Details</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 bg-[#121217] border border-white/10 rounded-sm space-y-4">
                    <h3 className="font-brand text-sm text-white font-bold uppercase tracking-wider">
                      Account Credentials
                    </h3>
                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <span className="text-[#8E8E93] block text-[10px] uppercase">
                          Account Email
                        </span>
                        <span className="text-white font-semibold text-sm">{user.email}</span>
                      </div>
                      <div>
                        <span className="text-[#8E8E93] block text-[10px] uppercase">
                          Customer UID
                        </span>
                        <span className="font-mono-clean text-xs text-[#6E6E73]">{user.uid}</span>
                      </div>
                      <div>
                        <span className="text-[#8E8E93] block text-[10px] uppercase">
                          Authentication Security
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1.5 mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Firebase Encrypted & Verified Session
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= Unauthenticated Customer Login Form ================= */
          <div className="p-5 sm:p-7 overflow-y-auto">
            <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="text-center mb-6">
                <span className="font-brand text-2xl font-black text-white tracking-wider">
                  FBFY
                </span>
                <p className="font-sans text-xs text-[#8E8E93] mt-1">
                  {isRegister
                    ? "Enter your email to unlock personalized drops & order history"
                    : "Sign in with your email to view live shipments and orders"}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 font-sans text-xs flex items-center gap-2 rounded-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#121217] border border-white/15 text-white font-sans text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#121217] border border-white/15 text-white font-sans text-xs focus:border-white focus:outline-none rounded-xs"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 transition-all flex items-center justify-center gap-2 rounded-xs shadow-lg disabled:opacity-50 mt-2"
              >
                {authLoading ? (
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

              <div className="pt-3 text-center border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setAuthError(null);
                  }}
                  className="font-sans text-xs text-[#8E8E93] hover:text-white transition-colors"
                >
                  {isRegister ? (
                    <span>Already have an account? <strong className="text-white underline">Sign In</strong></span>
                  ) : (
                    <span>First time here? <strong className="text-white underline">Create Account</strong></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
