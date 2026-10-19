"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Order } from "@/types";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ArrowLeft,
  RefreshCw,
  Search,
  Lock,
  Unlock,
} from "lucide-react";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(true); // Default accessible for ease of review

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
          setLoading(false);
        },
        (error) => {
          console.error("Firestore orders listen error:", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    const q = search.toLowerCase();
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
    <div className="min-h-screen bg-[#070709] text-[#f4f4f2] p-6 md:p-12 font-mono-clean">
      {/* Top Admin Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
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
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest">
              LIVE FIREBASE FIRESTORE SYNC
            </span>
          </div>

          <h1 className="font-brand text-3xl md:text-4xl text-white font-extrabold tracking-tight">
            FBFY // ADMIN PORTAL
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-[#8E8E93] block">TOTAL REVENUE</span>
            <span className="font-bold text-lg text-white">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#101014] border border-white/10 p-5">
            <span className="text-[10px] text-[#8E8E93] uppercase block mb-1">
              TOTAL ORDERS
            </span>
            <div className="text-2xl font-bold text-white flex items-center justify-between">
              <span>{orders.length}</span>
              <Package className="w-5 h-5 text-[#8E8E93]" />
            </div>
          </div>

          <div className="bg-[#101014] border border-white/10 p-5">
            <span className="text-[10px] text-[#8E8E93] uppercase block mb-1">
              PENDING ORDERS
            </span>
            <div className="text-2xl font-bold text-amber-400 flex items-center justify-between">
              <span>{pendingCount}</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#101014] border border-white/10 p-5">
            <span className="text-[10px] text-[#8E8E93] uppercase block mb-1">
              PROCESSED & SHIPPED
            </span>
            <div className="text-2xl font-bold text-emerald-400 flex items-center justify-between">
              <span>{orders.length - pendingCount}</span>
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-[#121217] border border-white/10 px-3 py-2 w-full md:w-80">
            <Search className="w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, name, custom text..."
              className="bg-transparent text-xs text-white focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors ${
                  filterStatus === st
                    ? "bg-white text-black font-bold border-white"
                    : "bg-[#101014] text-[#8E8E93] border-white/10 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#0e0e12] border border-white/10 overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-xs text-[#8E8E93]">
              FETCHING FIRESTORE ORDERS...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-xs text-[#8E8E93]">
              NO ORDERS RECORDED IN FIRESTORE YET
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14141a] border-b border-white/10 text-[10px] text-[#8E8E93] uppercase tracking-wider">
                <tr>
                  <th className="p-4">ORDER REF</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">CUSTOM HEM SIGNATURE</th>
                  <th className="p-4">ITEMS & SIZES</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">UPDATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#121217] transition-colors">
                    {/* Order Reference */}
                    <td className="p-4 font-bold text-white">
                      <div>{order.id.slice(0, 10)}...</div>
                      <div className="text-[10px] text-[#6E6E73] font-normal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="font-bold text-white">
                        {order.customerName}
                      </div>
                      <div className="text-[10px] text-[#8E8E93]">
                        {order.customerPhone} • {order.customerEmail}
                      </div>
                      <div className="text-[10px] text-[#6E6E73] mt-0.5">
                        {order.city}, {order.postalCode}
                      </div>
                    </td>

                    {/* Custom Hem Signature */}
                    <td className="p-4">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-black/60 border border-white/10 px-2.5 py-1 mb-1 rounded text-emerald-400 font-bold inline-block"
                        >
                          fbfy by {item.customName}
                        </div>
                      ))}
                    </td>

                    {/* Items */}
                    <td className="p-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-[#A1A1A6] mb-1">
                          <span className="text-white font-medium">
                            {item.quantity}x {item.name}
                          </span>{" "}
                          ({item.size} / {item.color.name})
                        </div>
                      ))}
                    </td>

                    {/* Total */}
                    <td className="p-4 font-bold text-white">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold rounded ${
                          order.status === "PENDING"
                            ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                            : order.status === "SHIPPED"
                            ? "bg-blue-950/60 text-blue-400 border border-blue-500/30"
                            : order.status === "DELIVERED"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Update Dropdown */}
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className="bg-[#181820] border border-white/10 text-white text-[10px] px-2 py-1 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
