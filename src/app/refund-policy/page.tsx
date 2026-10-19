"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export default function RefundPolicyPage() {
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
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            7-DAY GUARANTEED RETURNS & REFUNDS
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-black text-white tracking-tight">
            CANCELLATION & REFUND POLICY
          </h1>
          <p className="text-xs text-[#8E8E93] mt-3">
            Last Updated: October 2026 • Razorpay Merchant Standard Operating Procedure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-[#0e0e13] border border-white/10">
            <span className="text-white font-bold block text-sm mb-1">7 DAYS</span>
            <span className="text-[11px] text-[#8E8E93]">Return &amp; Exchange Window</span>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-white/10">
            <span className="text-white font-bold block text-sm mb-1">5-7 DAYS</span>
            <span className="text-[11px] text-[#8E8E93]">Bank Credit Refund Timeline</span>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-white/10">
            <span className="text-white font-bold block text-sm mb-1">FREE PICKUP</span>
            <span className="text-[11px] text-[#8E8E93]">Reverse Courier Pickup at Doorstep</span>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#A1A1A6] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              01. ORDER CANCELLATION BEFORE DISPATCH
            </h2>
            <p>
              You can cancel your order within <strong>12 hours</strong> of placing it or before our studio begins the bespoke laser engraving process. To cancel, email <strong>support@fbfy.in</strong> with your Order ID or message our WhatsApp helpline. Upon cancellation, a <strong>100% immediate full refund</strong> will be initiated back to your original payment method.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              02. 7-DAY RETURN & EXCHANGE ELIGIBILITY
            </h2>
            <p>
              We want you to feel completely confident wearing FBFY. We accept return and size exchange requests within <strong>7 days</strong> of delivery under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#8E8E93]">
              <li>The garment must be unworn, unwashed, and free of perfumes or stains.</li>
              <li>Original brand tags, packaging, and neck labels must be intact.</li>
              <li>Defective items, fabric flaws, or incorrect sizing from our end are eligible for instant free replacement.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              03. REVERSE PICKUP PROCESS
            </h2>
            <p>
              Once your return request is approved, our courier partner will arrange a reverse pickup from your delivery address within 24-48 hours. You do not need to pay the delivery executive any amount for reverse pickup.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              04. REFUND TIMELINE & MODE (RAZORPAY)
            </h2>
            <p>
              Once the returned garment reaches our Hyderabad studio and passes standard quality inspection (within 24 hours of arrival):
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#8E8E93]">
              <li><strong>Prepaid Orders (Razorpay):</strong> The refund is credited back to your original source account (UPI, Bank Account, or Credit/Debit Card) via Razorpay within <strong>5 to 7 business days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> Our support team will request your UPI ID or Bank Account Details, and funds will be transferred via NEFT/UPI within <strong>3 to 5 business days</strong>.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              05. HOW TO INITIATE A RETURN OR REFUND
            </h2>
            <p>
              To start a return or exchange:
              <br />
              <strong className="text-white">Email:</strong> support@fbfy.in / returns@fbfy.in
              <br />
              <strong className="text-white">Subject:</strong> Return Request - Order #[Your Order Number]
              <br />
              <strong className="text-white">Customer Support SLA:</strong> Confirmation within 12 business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
