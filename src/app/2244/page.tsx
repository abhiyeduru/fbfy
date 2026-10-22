"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Order, Product, ColorVariant, OrderStatus } from "@/types";
import { useCartAuth } from "@/context/CartAuthContext";
import { COLOR_VARIANTS } from "@/data/products";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ArrowLeft,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Database,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Settings,
  Flame,
  Tag,
  BarChart3,
  Sliders,
  Send,
  Eye,
  Lock,
  LogOut,
  ShieldAlert,
  KeyRound,
} from "lucide-react";

const PRODUCT_CATEGORIES = [
  "Oversized Tees",
  "Hoodies",
  "Graphic Editions",
  "Acid Washed",
  "Bottomwear",
] as const;

const BADGES = ["NONE", "NEW DROP", "BESTSELLER", "LIMITED EDITION", "ARCHIVE SALE"] as const;

const ORDER_STATUS_STEPS: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const COURIER_PARTNERS = [
  "BlueDart Express",
  "Delhivery Surface",
  "DTDC Air Cargo",
  "Shadowfax Prime",
  "Bluedart Apex",
];

export default function AdminPage() {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
    seedProductsToFirestore,
    storeSettings,
    updateStoreSettings,
  } = useCartAuth();

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminAuthInput, setAdminAuthInput] = useState({ username: "", password: "" });
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Check persisted admin session
  useEffect(() => {
    try {
      const session = sessionStorage.getItem("fbfy_admin_auth");
      if (session === "granted") {
        setIsAdminAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    const u = adminAuthInput.username.trim();
    const p = adminAuthInput.password.trim();

    // Default secure credentials for owner
    if ((u === "admin" || u === "fbfy" || u === "owner") && (p === "2244" || p === "admin2244" || p === "fbfy2026")) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem("fbfy_admin_auth", "granted");
      } catch (err) {}
    } else {
      setAdminAuthError("Invalid Admin credentials. Access Denied.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem("fbfy_admin_auth");
    } catch (err) {}
  };

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "cms">("overview");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [filterOrderStatus, setFilterOrderStatus] = useState("ALL");
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Products State
  const [productSearch, setProductSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // CMS Settings Local Form
  const [cmsForm, setCmsForm] = useState(storeSettings);
  const [cmsSaved, setCmsSaved] = useState(false);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    code: "",
    category: "Oversized Tees",
    collection: "SIGNATURE",
    badge: "NEW DROP",
    fit: "Oversized Boxy Silhouette",
    fabric: "100% Heavyweight Cotton (280 GSM)",
    gsm: 280,
    price: 2999,
    originalPrice: 4499,
    stock: 10,
    rating: 4.9,
    reviewCount: 48,
    defaultColor: "acidBlack",
    availableColors: [COLOR_VARIANTS.acidBlack, COLOR_VARIANTS.espresso],
    imageFront: "/assets/products/p01_front.jpg",
    imageBack: "/assets/products/p01_back.jpg",
    editorialImage: "/assets/products/p01_angle.jpg",
    images: [
      { id: "front", label: "FRONT VIEW", url: "/assets/products/p01_front.jpg" },
      { id: "back", label: "BACK GRAPHIC", url: "/assets/products/p01_back.jpg" },
    ],
    features: [
      "Heavyweight 280 GSM Streetwear Construction",
      "Dense 1x1 Bound Rib Collar",
      "Personalized Lower Hem: fbfy by {name}",
    ],
    description: "Exclusive luxury garment engineered in dense combed cotton.",
    isPublished: true,
  });

  // Sync CMS form when storeSettings updates
  useEffect(() => {
    setCmsForm(storeSettings);
  }, [storeSettings]);

  // Listen to Orders from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Order);
          });
          setOrders(list);
          setOrdersLoading(false);
        },
        (error) => {
          console.error("Firestore orders listen error:", error);
          setOrdersLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setOrdersLoading(false);
    }
  }, []);

  // Update order fulfillment status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Update courier partner & tracking number
  const handleUpdateShipping = async (orderId: string, courier: string, awb: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        courierPartner: courier,
        trackingNumber: awb,
        status: "SHIPPED",
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, courierPartner: courier, trackingNumber: awb, status: "SHIPPED" }
            : o
        )
      );
      alert(`Carrier and AWB updated successfully for order ${orderId}!`);
    } catch (err) {
      console.error("Shipping update error:", err);
    }
  };

  // Open modal for creating new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      code: "FBF-00" + (products.length + 1) + "-NEW",
      category: "Oversized Tees",
      collection: "SIGNATURE",
      badge: "NEW DROP",
      fit: "Oversized Dropped Shoulder Tee",
      fabric: "100% Heavyweight Cotton (280 GSM)",
      gsm: 280,
      price: 3299,
      originalPrice: 4999,
      stock: 12,
      rating: 4.9,
      reviewCount: 32,
      defaultColor: "acidBlack",
      availableColors: [COLOR_VARIANTS.acidBlack, COLOR_VARIANTS.navy],
      imageFront: "/assets/products/p01_front.jpg",
      imageBack: "/assets/products/p01_back.jpg",
      editorialImage: "/assets/products/p01_angle.jpg",
      images: [
        { id: "front", label: "FRONT VIEW", url: "/assets/products/p01_front.jpg" },
        { id: "back", label: "BACK GRAPHIC", url: "/assets/products/p01_back.jpg" },
      ],
      features: [
        "100% Heavyweight Combed Cotton (280 GSM)",
        "Dense 1x1 Bound Rib Collar",
        "Personalized Lower Hem: fbfy by {name}",
      ],
      description: "Engineered dropped-shoulder architectural silhouette.",
      isPublished: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    setIsSubmittingProduct(true);
    try {
      if (editingProductId) {
        const updated: Product = {
          ...(formData as Product),
          id: editingProductId,
        };
        await editProduct(updated);
      } else {
        const newId =
          formData.id ||
          "fbf-" +
            formData.code?.toLowerCase().replace(/[^a-z0-9]/g, "-") ||
          "prod-" + Date.now();
        const created: Product = {
          ...(formData as Product),
          id: newId,
        };
        await addProduct(created);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store?`)) {
      await deleteProduct(id);
    }
  };

  const handleSeed = async () => {
    if (confirm("Push all 9 authentic FBFY archive products to Firebase Firestore?")) {
      await seedProductsToFirestore();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(cmsForm);
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 3000);
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + (o.items?.reduce((itemSum, i) => itemSum + i.quantity, 0) || 0),
    0
  );
  const pendingOrders = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  ).length;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory === "ALL" || p.category === filterCategory;
    const q = productSearch.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.fit.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterOrderStatus === "ALL" || o.status === filterOrderStatus;
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerEmail?.toLowerCase().includes(q) ||
      o.items?.some((i) => i.customName.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // ================= Unauthenticated Admin Login Gate =================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#f4f4f2] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c0c11] border border-white/15 rounded-sm p-7 sm:p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-brand text-2xl font-black text-white tracking-wider">
              FBFY // ADMIN ACCESS
            </h1>
            <p className="font-sans text-xs text-[#8E8E93] mt-1">
              Restricted portal. Enter administrator credentials to proceed.
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3 mb-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 font-sans text-xs flex items-center gap-2 rounded-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold mb-1.5">
                Admin Username / Email
              </label>
              <input
                type="text"
                required
                value={adminAuthInput.username}
                onChange={(e) =>
                  setAdminAuthInput((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/15 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold mb-1.5">
                Admin Security Key / PIN
              </label>
              <input
                type="password"
                required
                value={adminAuthInput.password}
                onChange={(e) =>
                  setAdminAuthInput((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••"
                className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/15 text-white font-mono-clean text-xs focus:border-white focus:outline-none rounded-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 transition-all flex items-center justify-center gap-2 rounded-xs shadow-lg mt-3"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate & Enter Atelier</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs font-sans text-[#8E8E93] hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= Authenticated Admin Atelier =================
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f2] p-4 sm:p-8 font-mono-clean selection:bg-white selection:text-black">
      {/* Top Admin Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="text-[#8E8E93] hover:text-white flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Storefront
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FIREBASE LIVE SYNC
            </span>
          </div>

          <h1 className="font-brand text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
            FBFY // MASTER ATELIER CONTROL
          </h1>
        </div>

        {/* Global Action Buttons & Seed DB & Logout */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeed}
            className="px-3.5 py-2 bg-[#121217] hover:bg-white hover:text-black text-white/80 border border-white/10 text-xs font-bold transition-all flex items-center gap-2 rounded-xs"
            title="Seed sample catalog to Firestore"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Seed Firestore DB</span>
          </button>

          {seedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Seeded!
            </span>
          )}

          <button
            onClick={handleAdminLogout}
            className="px-3.5 py-2 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 rounded-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-white text-white bg-white/5"
                : "border-transparent text-[#8E8E93] hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-white text-white bg-white/5"
                : "border-transparent text-[#8E8E93] hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Dispatch</span>
            {pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center ml-1">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "products"
                ? "border-white text-white bg-white/5"
                : "border-transparent text-[#8E8E93] hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Catalog CRUD ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cms")}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "cms"
                ? "border-white text-white bg-white/5"
                : "border-transparent text-[#8E8E93] hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Store CMS & Announcements</span>
          </button>
        </div>

        {/* ================= TAB 1: EXECUTIVE OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#0c0c10] border border-white/10 rounded-sm">
                <div className="flex items-center justify-between text-[#8E8E93] text-xs uppercase tracking-wider mb-2">
                  <span>Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-brand text-2xl font-black text-white">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-emerald-400 mt-2 font-mono-clean">
                  Across {orders.length} lifetime orders
                </div>
              </div>

              <div className="p-5 bg-[#0c0c10] border border-white/10 rounded-sm">
                <div className="flex items-center justify-between text-[#8E8E93] text-xs uppercase tracking-wider mb-2">
                  <span>Pending Fulfillment</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-brand text-2xl font-black text-amber-400">
                  {pendingOrders}
                </div>
                <div className="text-[10px] text-[#8E8E93] mt-2 font-mono-clean">
                  Awaiting dispatch & tracking assignment
                </div>
              </div>

              <div className="p-5 bg-[#0c0c10] border border-white/10 rounded-sm">
                <div className="flex items-center justify-between text-[#8E8E93] text-xs uppercase tracking-wider mb-2">
                  <span>Active Catalog</span>
                  <Layers className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-brand text-2xl font-black text-white">
                  {products.length} Items
                </div>
                <div className="text-[10px] text-[#8E8E93] mt-2 font-mono-clean">
                  Synchronized with Firebase Firestore
                </div>
              </div>

              <div className="p-5 bg-[#0c0c10] border border-white/10 rounded-sm">
                <div className="flex items-center justify-between text-[#8E8E93] text-xs uppercase tracking-wider mb-2">
                  <span>Units Produced</span>
                  <Package className="w-4 h-4 text-purple-400" />
                </div>
                <div className="font-brand text-2xl font-black text-white">
                  {totalItemsSold} Garments
                </div>
                <div className="text-[10px] text-emerald-400 mt-2 font-mono-clean">
                  Custom Laser-Engraved Personalizations
                </div>
              </div>
            </div>

            {/* Recent Orders Snapshot */}
            <div className="bg-[#0c0c10] border border-white/10 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-brand text-lg text-white font-bold">
                  RECENT ORDERS STREAM
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#8E8E93] hover:text-white flex items-center gap-1 uppercase tracking-wider"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-[#8E8E93] text-xs">
                  No orders recorded yet. Place an order on the storefront or via test checkout!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#8E8E93] uppercase text-[10px] tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Garments</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 font-mono-clean text-emerald-400 font-bold">
                            #{order.id.slice(0, 10)}...
                          </td>
                          <td className="py-3">
                            <div className="text-white font-medium">{order.customerName}</div>
                            <div className="text-[#8E8E93] text-[10px]">{order.customerEmail}</div>
                          </td>
                          <td className="py-3 text-white">
                            {order.items?.length || 1} item(s)
                          </td>
                          <td className="py-3 font-bold text-white font-mono-clean">
                            ₹{order.totalAmount?.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderForDetail(order);
                                setActiveTab("orders");
                              }}
                              className="text-xs text-white hover:underline uppercase tracking-wider font-bold"
                            >
                              Dispatch →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: ORDERS & DISPATCH ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#0c0c10] p-4 border border-white/10 rounded-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Order ID, Customer, Name..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#141419] border border-white/15 pl-9 pr-3 py-2 text-xs font-mono-clean text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">Status:</span>
                {["ALL", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterOrderStatus(st)}
                    className={`px-3 py-1 text-[10px] uppercase font-bold rounded-xs transition-colors ${
                      filterOrderStatus === st
                        ? "bg-white text-black"
                        : "bg-white/5 text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Table */}
            <div className="bg-[#0c0c10] border border-white/10 rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121217] border-b border-white/10 text-[#8E8E93] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer & Address</th>
                      <th className="p-4">Items & Engraving</th>
                      <th className="p-4">Financials</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#8E8E93]">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 align-top">
                            <div className="font-mono-clean text-emerald-400 font-bold text-sm">
                              #{ord.id}
                            </div>
                            <div className="text-[10px] text-[#8E8E93] mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ord.createdAt).toLocaleString("en-IN")}
                            </div>
                            {ord.userUid && (
                              <div className="text-[9px] text-[#6E6E73] mt-0.5 font-mono-clean">
                                UID: {ord.userUid.slice(0, 12)}...
                              </div>
                            )}
                          </td>

                          <td className="p-4 align-top">
                            <div className="text-white font-bold">{ord.customerName}</div>
                            <div className="text-xs text-[#8E8E93]">{ord.customerEmail}</div>
                            <div className="text-xs text-[#8E8E93]">{ord.customerPhone}</div>
                            <div className="text-[10px] text-[#6E6E73] mt-1 max-w-xs">
                              {ord.address}, {ord.city}, {ord.state} - {ord.postalCode}
                            </div>
                          </td>

                          <td className="p-4 align-top">
                            <div className="space-y-1.5">
                              {ord.items?.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px]">
                                  <span className="w-5 h-5 bg-white/10 rounded flex items-center justify-center font-bold text-[9px]">
                                    {it.quantity}x
                                  </span>
                                  <span className="text-white font-medium">{it.name}</span>
                                  <span className="text-[#8E8E93] text-[10px]">({it.size})</span>
                                  {it.customName && (
                                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-mono-clean">
                                      fbfy by {it.customName}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="p-4 align-top">
                            <div className="font-bold text-white text-sm">
                              ₹{ord.totalAmount?.toLocaleString("en-IN")}
                            </div>
                            <div className="text-[10px] text-[#8E8E93]">
                              Method: {ord.paymentMethod}
                            </div>
                            {ord.razorpayPaymentId && (
                              <div className="text-[9px] text-emerald-400 font-mono-clean truncate max-w-[120px]">
                                RZP: {ord.razorpayPaymentId}
                              </div>
                            )}
                          </td>

                          <td className="p-4 align-top">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleStatusChange(ord.id, e.target.value as OrderStatus)
                              }
                              className="bg-[#141419] border border-white/20 text-white text-xs font-bold px-2.5 py-1.5 rounded-xs focus:outline-none focus:border-white"
                            >
                              {ORDER_STATUS_STEPS.map((step) => (
                                <option key={step} value={step}>
                                  {step}
                                </option>
                              ))}
                            </select>

                            <div className="mt-2 text-[10px] text-[#8E8E93]">
                              <div>Carrier: {ord.courierPartner || "Not assigned"}</div>
                              <div className="font-mono-clean text-emerald-400">
                                AWB: {ord.trackingNumber || "—"}
                              </div>
                            </div>
                          </td>

                          <td className="p-4 align-top text-right">
                            <button
                              onClick={() => setSelectedOrderForDetail(ord)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                            >
                              Dispatch Modal
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRODUCT CATALOG CRUD ================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#0c0c10] p-4 border border-white/10 rounded-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter garments by name, code, fabric..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#141419] border border-white/15 pl-9 pr-3 py-2 text-xs font-mono-clean text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 rounded-xs flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Garment</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0c0c10] border border-white/10 hover:border-white/20 rounded-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="w-20 h-24 bg-black border border-white/10 rounded-xs overflow-hidden flex-shrink-0 relative">
                      <img
                        src={prod.imageFront}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-emerald-400 font-mono-clean uppercase">
                        {prod.code}
                      </div>
                      <h4 className="font-brand text-sm font-bold text-white truncate">
                        {prod.name}
                      </h4>
                      <div className="text-xs text-[#8E8E93] mt-0.5">
                        {prod.category} • {prod.gsm} GSM
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-white text-sm">
                          ₹{prod.price.toLocaleString("en-IN")}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-xs text-[#8E8E93] line-through">
                            ₹{prod.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] flex items-center justify-between text-xs">
                    <span className="text-[#8E8E93] text-[10px]">
                      Stock: <strong className="text-white">{prod.stock}</strong> units
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: CMS & ANNOUNCEMENTS ================= */}
        {activeTab === "cms" && (
          <div className="max-w-3xl bg-[#0c0c10] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-brand text-lg text-white font-bold">
                STORE CMS & MARQUEE ANNOUNCEMENTS
              </h3>
              <p className="font-sans text-xs text-[#8E8E93] mt-1">
                Updates push instantly to all storefront visitors via Firebase Firestore live stream.
              </p>
            </div>

            {cmsSaved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 rounded-xs font-bold">
                <Check className="w-4 h-4" />
                <span>Store CMS settings updated live!</span>
              </div>
            )}

            <form onSubmit={handleSaveCMS} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8E8E93] mb-1.5 font-bold">
                  Top Announcement Marquee Text
                </label>
                <textarea
                  rows={2}
                  value={cmsForm.announcementText}
                  onChange={(e) =>
                    setCmsForm((prev) => ({ ...prev, announcementText: e.target.value }))
                  }
                  className="w-full bg-[#141419] border border-white/15 p-3 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8E8E93] mb-1.5 font-bold">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={cmsForm.freeShippingThreshold}
                    onChange={(e) =>
                      setCmsForm((prev) => ({
                        ...prev,
                        freeShippingThreshold: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8E8E93] mb-1.5 font-bold">
                    Cash On Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={cmsForm.codFee}
                    onChange={(e) =>
                      setCmsForm((prev) => ({
                        ...prev,
                        codFee: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8E8E93] mb-1.5 font-bold">
                  Flagship Hero Headline
                </label>
                <input
                  type="text"
                  value={cmsForm.heroHeadline}
                  onChange={(e) =>
                    setCmsForm((prev) => ({ ...prev, heroHeadline: e.target.value }))
                  }
                  className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8E8E93] mb-1.5 font-bold">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={cmsForm.heroSubtitle}
                  onChange={(e) =>
                    setCmsForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                  }
                  className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 rounded-xs flex items-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Save Live CMS Settings</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0c0c11] border border-white/15 rounded-sm p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-brand text-lg text-white font-bold">
                {editingProductId ? "EDIT GARMENT ARCHIVE" : "CREATE NEW GARMENT ARCHIVE"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#8E8E93] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. MONOLITH 400 GSM HOODIE"
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                    Product Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="FBF-001-BLK"
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as any,
                      }))
                    }
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                    }
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, stock: Number(e.target.value) }))
                    }
                    className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                  Front Image URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageFront || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imageFront: e.target.value }))
                  }
                  className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2 bg-white text-black font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-white/90 rounded-xs shadow-lg"
                >
                  {isSubmittingProduct ? "Saving..." : "Save Product to Firestore"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DISPATCH & SHIPPING DETAIL ================= */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c0c11] border border-white/15 rounded-sm p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="font-brand text-base text-white font-bold">
                DISPATCH ORDER #{selectedOrderForDetail.id}
              </h3>
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="text-[#8E8E93] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white/5 rounded-xs space-y-1">
                <div className="text-white font-bold">{selectedOrderForDetail.customerName}</div>
                <div className="text-[#8E8E93]">{selectedOrderForDetail.customerEmail}</div>
                <div className="text-[#8E8E93]">{selectedOrderForDetail.customerPhone}</div>
                <div className="text-[#8E8E93] text-[11px] mt-1">
                  {selectedOrderForDetail.address}, {selectedOrderForDetail.city} -{" "}
                  {selectedOrderForDetail.postalCode}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                  Carrier / Express Courier
                </label>
                <select
                  id="courierSelect"
                  defaultValue={selectedOrderForDetail.courierPartner || "BlueDart Express"}
                  className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                >
                  {COURIER_PARTNERS.map((cp) => (
                    <option key={cp} value={cp}>
                      {cp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8E8E93] mb-1 font-bold">
                  AWB Tracking Number
                </label>
                <input
                  id="awbInput"
                  type="text"
                  defaultValue={selectedOrderForDetail.trackingNumber || ""}
                  placeholder="e.g. BD-9842187321"
                  className="w-full bg-[#141419] border border-white/15 p-2.5 text-xs text-white focus:outline-none focus:border-white rounded-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const courier = (document.getElementById("courierSelect") as HTMLSelectElement).value;
                    const awb = (document.getElementById("awbInput") as HTMLInputElement).value;
                    handleUpdateShipping(selectedOrderForDetail.id, courier, awb);
                    setSelectedOrderForDetail(null);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-sans text-xs uppercase tracking-wider font-extrabold rounded-xs shadow-lg"
                >
                  Confirm Dispatch & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
