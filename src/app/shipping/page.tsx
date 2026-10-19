"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Package, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f2] p-6 sm:p-12 md:p-20 font-mono-clean">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#8E8E93] hover:text-white uppercase tracking-widest mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </Link>

        <div className="border-b border-white/10 pb-6 mb-10">
          <span className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] block mb-2 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            DOMESTIC & PAN-INDIA LOGISTICS
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-black text-white tracking-tight">
            SHIPPING & DELIVERY POLICY
          </h1>
          <p className="text-xs text-[#8E8E93] mt-3">
            Last Updated: October 2026 • Verified Fulfillment Protocols
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-[#0e0e13] border border-white/10">
            <Clock className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-white font-bold block text-sm mb-1">2-3 DAYS</span>
            <span className="text-[11px] text-[#8E8E93]">Production &amp; Laser Engraving</span>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-white/10">
            <Truck className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-white font-bold block text-sm mb-1">3-5 DAYS</span>
            <span className="text-[11px] text-[#8E8E93]">Express Courier Transit</span>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-white/10">
            <Package className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-white font-bold block text-sm mb-1">FREE SHIPPING</span>
            <span className="text-[11px] text-[#8E8E93]">On All Prepaid Orders in India</span>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#A1A1A6] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              01. ORDER PROCESSING & CUSTOMIZATION TIMELINE
            </h2>
            <p>
              Because each FBFY garment features unique 280 GSM heavyweight architectural tailoring and bespoke laser hem engraving, each item enters individual garment queueing. Production, inspection, and packaging take <strong>2 to 3 business days</strong> from the moment order verification is completed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              02. ESTIMATED DELIVERY TIMES ACROSS INDIA
            </h2>
            <p>
              Once dispatched from our Hyderabad fulfillment center, delivery timelines are:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#8E8E93]">
              <li>Metro Cities (Hyderabad, Mumbai, Delhi NCR, Bengaluru, Chennai, Kolkata): <strong>2 to 4 business days</strong></li>
              <li>Tier 2 and Tier 3 Cities: <strong>4 to 6 business days</strong></li>
              <li>North-East India and Special Territories: <strong>5 to 7 business days</strong></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              03. SHIPPING COURIER PARTNERS & REAL-TIME TRACKING
            </h2>
            <p>
              All shipments are dispatched through premium logistics providers including <strong>BlueDart, Delhivery, DTDC, and Xpressbees</strong>. As soon as your parcel is scanned into the courier hub, an SMS and Email notification with your AWB tracking link is dispatched.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              04. SHIPPING CHARGES & CASH ON DELIVERY (COD)
            </h2>
            <p>
              Prepaid orders processed via Razorpay (UPI, Cards, NetBanking) enjoy <strong>100% Free Shipping</strong>. For Cash on Delivery (COD) orders, a nominal convenience and handling charge of ₹99 is applied at checkout.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              05. DELAYS OR LOST SHIPMENTS
            </h2>
            <p>
              If your shipment is delayed past the estimated window or shows abnormal courier transit scans, please reach out directly with your Order ID to:
              <br />
              <strong className="text-white">Logistics Support:</strong> shipping@fbfy.in / support@fbfy.in
              <br />
              <strong className="text-white">Helpline:</strong> +91 98765 43210 (Mon-Sat, 10 AM - 7 PM IST)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
