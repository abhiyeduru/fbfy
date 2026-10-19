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
import { Order, Product, ColorVariant } from "@/types";
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
} from "lucide-react";

const COLLECTIONS = ["ALL", "SIGNATURE", "GRAPHIC", "WASHED", "LIMITED"] as const;

export default function AdminPage() {
  const { products, addProduct, editProduct, deleteProduct, seedProductsToFirestore } =
    useCartAuth();

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [filterOrderStatus, setFilterOrderStatus] = useState("ALL");

  // Products State
  const [productSearch, setProductSearch] = useState("");
  const [filterCollection, setFilterCollection] = useState<(typeof COLLECTIONS)[number]>("ALL");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    code: "",
    collection: "SIGNATURE",
    fit: "Oversized Boxy Silhouette",
    fabric: "100% Heavyweight Cotton (240-280 GSM)",
    gsm: 280,
    price: 2999,
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
      "Heavyweight Streetwear Construction",
      "Dense Ribbed Crewneck Collar",
      "Personalized Lower Hem: fbfy by {name}",
    ],
  });

  // Listen to Orders from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Order);
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

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Open modal for creating new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      code: "FBF-00" + (products.length + 1) + "-NEW",
      collection: "SIGNATURE",
      fit: "Oversized Dropped Shoulder Tee",
      fabric: "100% Heavyweight Cotton (240-280 GSM)",
      gsm: 280,
      price: 3299,
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
        "100% Combed Heavy Cotton",
        "Dense 1x1 Bound Rib Collar",
        "Personalized Lower Hem: fbfy by {name}",
      ],
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({ ...product });
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    setIsSubmittingProduct(true);
    try {
      if (editingProductId) {
        // Edit existing
        const updated: Product = {
          ...(formData as Product),
          id: editingProductId,
        };
        await editProduct(updated);
      } else {
        // Create new
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

  // Delete product confirmation
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store?`)) {
      await deleteProduct(id);
    }
  };

  // Seed default archive
  const handleSeed = async () => {
    if (confirm("Push all 8 original FBFY archive products to Firebase Firestore?")) {
      await seedProductsToFirestore();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesCollection = filterCollection === "ALL" || p.collection === filterCollection;
    const q = productSearch.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.fit.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q);
    return matchesCollection && matchesSearch;
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

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f2] p-4 sm:p-8 md:p-12 font-mono-clean">
      {/* Top Admin Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="text-[#8E8E93] hover:text-white flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO STORE
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE FIREBASE FIRESTORE SYNC
            </span>
          </div>

          <h1 className="font-brand text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
            FBFY ARCHIVE ADMIN & OPERATIONS
          </h1>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="px-3.5 py-2 bg-[#101015] border border-white/10">
            <span className="text-[#8E8E93] block text-[9px] uppercase tracking-wider">
              TOTAL PRODUCTS
            </span>
            <span className="text-white font-bold text-base">{products.length} PIECES</span>
          </div>
          <div className="px-3.5 py-2 bg-[#101015] border border-white/10">
            <span className="text-[#8E8E93] block text-[9px] uppercase tracking-wider">
              TOTAL ORDERS
            </span>
            <span className="text-white font-bold text-base">{orders.length}</span>
          </div>
          <div className="px-3.5 py-2 bg-[#101015] border border-white/10">
            <span className="text-[#8E8E93] block text-[9px] uppercase tracking-wider">
              STORE REVENUE
            </span>
            <span className="text-emerald-400 font-bold text-base">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        {/* Main Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 font-mono-clean text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all border ${
              activeTab === "products"
                ? "bg-white text-black border-white"
                : "bg-[#111115] text-[#8E8E93] border-white/10 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>PRODUCTS ARCHIVE ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 font-mono-clean text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all border ${
              activeTab === "orders"
                ? "bg-white text-black border-white"
                : "bg-[#111115] text-[#8E8E93] border-white/10 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>CUSTOMER ORDERS ({orders.length})</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-black font-bold rounded-full">
                {pendingCount} NEW
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div>
            {/* Products Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              {/* Collection Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {COLLECTIONS.map((col) => (
                  <button
                    key={col}
                    onClick={() => setFilterCollection(col)}
                    className={`px-3 py-1.5 text-xs font-mono-clean uppercase tracking-wider border transition-colors whitespace-nowrap ${
                      filterCollection === col
                        ? "bg-white text-black font-bold border-white"
                        : "bg-[#111115] text-[#8E8E93] border-white/10 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-grow md:w-64">
                  <Search className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="SEARCH PRODUCTS..."
                    className="w-full bg-[#111115] border border-white/15 pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#6E6E73] focus:border-white focus:outline-none"
                  />
                </div>

                {/* Seed Firestore Button */}
                <button
                  onClick={handleSeed}
                  title="Push static archive to Firestore"
                  className="px-3 py-1.5 bg-[#14141a] border border-white/15 text-xs text-[#8E8E93] hover:text-white hover:border-white/40 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">SEED FIRESTORE</span>
                </button>

                {/* Add New Product Button */}
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-1.5 bg-white text-black font-mono-clean text-xs font-bold uppercase tracking-wider hover:bg-[#E8E8E4] flex items-center gap-1.5 shadow-xl whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD PRODUCT</span>
                </button>
              </div>
            </div>

            {seedSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Archive successfully synchronized with Firebase Firestore!</span>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0e0e12] border border-white/10 flex flex-col justify-between group hover:border-white/30 transition-all duration-300"
                >
                  {/* Image Header Stage */}
                  <div className="relative aspect-[4/5] bg-black overflow-hidden border-b border-white/10">
                    <Image
                      src={prod.imageFront}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 font-mono-clean text-[9px] bg-black/70 px-2 py-0.5 border border-white/10 text-white/80">
                      {prod.code}
                    </div>
                    <div className="absolute top-2 right-2 font-mono-clean text-[9px] bg-black/70 px-2 py-0.5 border border-white/10 text-emerald-400 font-bold">
                      {prod.gsm} GSM
                    </div>

                    <div className="absolute bottom-2 left-2 font-mono-clean text-[9px] bg-black/80 px-2 py-0.5 border border-white/10 text-white/90">
                      {prod.images?.length || 2} VIEWS
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono-clean text-[10px] text-[#8E8E93] uppercase tracking-widest">
                          {prod.collection}
                        </span>
                        <span className="font-mono-clean text-xs font-bold text-white">
                          ₹{prod.price.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="font-brand text-sm font-bold text-white leading-snug mb-2 line-clamp-2">
                        {prod.name}
                      </h3>

                      <p className="font-mono-clean text-[11px] text-[#8E8E93] line-clamp-1 mb-3">
                        {prod.fit}
                      </p>

                      {/* Colorway preview swatches */}
                      <div className="flex items-center gap-1.5 mb-4">
                        {prod.availableColors?.map((c) => (
                          <div
                            key={c.id}
                            title={c.name}
                            className="w-3.5 h-3.5 border border-white/30"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="flex-1 py-1.5 px-3 bg-[#17171e] hover:bg-white hover:text-black text-white text-[11px] font-mono-clean uppercase tracking-wider border border-white/15 transition-colors flex items-center justify-center gap-1.5 font-bold"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>EDIT</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 bg-[#17171e] hover:bg-red-950/80 text-[#8E8E93] hover:text-red-400 border border-white/15 hover:border-red-500/40 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 border border-white/5 bg-[#0e0e12]">
                <Layers className="w-12 h-12 text-[#2e2e38] mx-auto mb-3" />
                <p className="text-sm text-[#8E8E93] uppercase tracking-wider mb-4">
                  NO PRODUCTS FOUND IN THIS FILTER
                </p>
                <button
                  onClick={() => {
                    setFilterCollection("ALL");
                    setProductSearch("");
                  }}
                  className="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider font-bold"
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div>
            {/* Orders Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              {/* Status Tabs */}
              <div className="flex items-center gap-2">
                {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterOrderStatus(st)}
                    className={`px-3 py-1.5 text-xs font-mono-clean uppercase tracking-wider border transition-colors ${
                      filterOrderStatus === st
                        ? "bg-white text-black font-bold border-white"
                        : "bg-[#111115] text-[#8E8E93] border-white/10 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search Orders */}
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="SEARCH BY ORDER ID, CUSTOMER, CUSTOM NAME..."
                  className="w-full bg-[#111115] border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#6E6E73] focus:border-white focus:outline-none"
                />
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="text-center py-20 text-[#8E8E93]">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white" />
                <p className="text-xs uppercase tracking-widest">
                  SYNCING FIRESTORE ORDERS...
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 border border-white/5 bg-[#0e0e12]">
                <Package className="w-12 h-12 text-[#2e2e38] mx-auto mb-3" />
                <p className="text-sm text-[#8E8E93] uppercase tracking-wider mb-2">
                  NO ORDERS RECORDED
                </p>
                <p className="text-xs text-[#5e5e68]">
                  Orders placed through Checkout write directly to this collection.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 md:p-6 bg-[#0e0e13] border border-white/10 flex flex-col gap-5 hover:border-white/25 transition-colors"
                  >
                    {/* Top Row: ID, Date, Amount & Status Selector */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono-clean text-xs font-bold text-white">
                            ORDER #{order.id}
                          </span>
                          <span className="text-[10px] text-[#6E6E73]">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-[#8E8E93] mt-1">
                          Customer:{" "}
                          <strong className="text-white">{order.customerName}</strong> (
                          {order.customerEmail}) • {order.customerPhone}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">
                            TOTAL AMOUNT
                          </span>
                          <span className="text-sm font-bold text-emerald-400">
                            ₹{order.totalAmount?.toLocaleString()}
                          </span>
                        </div>

                        {/* Status Selector */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as Order["status"]
                            )
                          }
                          className="bg-black border border-white/20 text-xs font-mono-clean uppercase px-3 py-1.5 text-white focus:outline-none focus:border-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle: Items Purchased */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-[#131318] border border-white/5"
                        >
                          <div className="relative w-12 h-14 bg-black border border-white/10 flex-shrink-0">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-brand text-white font-bold truncate">
                              {item.name}
                            </h4>
                            <div className="text-[11px] text-[#8E8E93] flex items-center gap-2 mt-0.5">
                              <span>SIZE {item.size}</span>
                              <span>•</span>
                              <span>QTY {item.quantity}</span>
                              <span>•</span>
                              <span className="text-white">₹{item.price}</span>
                            </div>
                            <div className="mt-1 font-mono-clean text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/20 inline-block font-bold">
                              fbfy by {item.customName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom: Shipping Address */}
                    <div className="pt-3 border-t border-white/5 text-[11px] text-[#8E8E93] flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <strong className="text-white uppercase">SHIPPING ADDRESS: </strong>
                        {order.address}, {order.city} - {order.postalCode}
                      </div>
                      <div className="text-[10px] text-[#6E6E73] uppercase">
                        PAYMENT METHOD: {order.paymentMethod}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0b0b0f] border border-white/20 shadow-2xl p-6 md:p-8 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="font-mono-clean text-[10px] text-emerald-400 uppercase tracking-widest block">
                  {editingProductId ? "EDIT EXISTING PRODUCT" : "NEW PRODUCT CREATION"}
                </span>
                <h2 className="font-brand text-xl text-white font-bold">
                  {editingProductId ? `EDIT // ${formData.code}` : "ADD NEW FBFY PIECE"}
                </h2>
              </div>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-[#8E8E93] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 009 BUILD WHAT DOESN'T EXIST"
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>

                {/* Product Code */}
                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    ITEM CODE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. FBF-009-BWE"
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white uppercase focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Collection */}
                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    COLLECTION
                  </label>
                  <select
                    value={formData.collection || "SIGNATURE"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collection: e.target.value as Product["collection"],
                      })
                    }
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  >
                    <option value="SIGNATURE">SIGNATURE</option>
                    <option value="GRAPHIC">GRAPHIC</option>
                    <option value="WASHED">WASHED</option>
                    <option value="LIMITED">LIMITED</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    PRICE (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 2999}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>

                {/* GSM */}
                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    CALIBRATED GSM
                  </label>
                  <input
                    type="number"
                    value={formData.gsm || 280}
                    onChange={(e) =>
                      setFormData({ ...formData, gsm: Number(e.target.value) })
                    }
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Fit Profile & Fabric Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    FIT SILHOUETTE
                  </label>
                  <input
                    type="text"
                    value={formData.fit || ""}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="e.g. Oversized Dropped Shoulder Tee"
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                    FABRIC MATRIX
                  </label>
                  <input
                    type="text"
                    value={formData.fabric || ""}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. 100% Heavyweight Cotton (240-280 GSM)"
                    className="w-full bg-[#121217] border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Paths */}
              <div className="p-4 bg-[#111116] border border-white/10 space-y-3">
                <span className="font-mono-clean text-[10px] text-white/90 uppercase tracking-widest block font-bold">
                  IMAGE ASSET PATHS (PUBLIC OR CDN URLS)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] text-[#8E8E93] uppercase mb-1">
                      FRONT VIEW URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.imageFront || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageFront: e.target.value })
                      }
                      placeholder="/assets/products/p01_front.jpg"
                      className="w-full bg-black border border-white/15 px-2.5 py-1.5 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-[#8E8E93] uppercase mb-1">
                      BACK GRAPHIC URL
                    </label>
                    <input
                      type="text"
                      value={formData.imageBack || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageBack: e.target.value })
                      }
                      placeholder="/assets/products/p01_back.jpg"
                      className="w-full bg-black border border-white/15 px-2.5 py-1.5 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-[#8E8E93] uppercase mb-1">
                      3D ANGLE VIEW URL
                    </label>
                    <input
                      type="text"
                      value={formData.editorialImage || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, editorialImage: e.target.value })
                      }
                      placeholder="/assets/products/p01_angle.jpg"
                      className="w-full bg-black border border-white/15 px-2.5 py-1.5 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Features (One per line) */}
              <div>
                <label className="block text-[10px] text-[#8E8E93] uppercase tracking-wider mb-1">
                  FEATURES & GRAPHIC DETAILS (ONE PER LINE)
                </label>
                <textarea
                  rows={3}
                  value={formData.features?.join("\n") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value.split("\n").filter((f) => f.trim().length > 0),
                    })
                  }
                  placeholder="Front: Chest Print&#10;Back: Graphic Typography&#10;Personalized Hem: fbfy by {name}"
                  className="w-full bg-[#121217] border border-white/15 p-3 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-[#17171e] text-[#8E8E93] hover:text-white text-xs font-mono-clean uppercase tracking-wider border border-white/10"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2.5 bg-white text-black font-mono-clean text-xs font-bold uppercase tracking-widest hover:bg-[#E8E8E4] transition-colors shadow-2xl flex items-center gap-2"
                >
                  {isSubmittingProduct ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING TO FIRESTORE...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{editingProductId ? "UPDATE PRODUCT" : "CREATE PRODUCT"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
