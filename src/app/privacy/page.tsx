"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            DATA ENCRYPTION & PRIVACY STANDARDS
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-black text-white tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-[#8E8E93] mt-3">
            Last Updated: October 2026 • Compliant with Information Technology Act, 2000 & SPDI Rules
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#A1A1A6] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              01. INFORMATION WE COLLECT
            </h2>
            <p>
              When you purchase an item or create an account on fbfy.in, we collect personal information necessary to fulfill your order and customize your garment:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#8E8E93]">
              <li>Contact details: Name, Email Address, Phone Number</li>
              <li>Shipping address: Delivery Street, City, State, Postal Pin Code</li>
              <li>Personalization signature: The custom name entered for the hem print</li>
              <li>Authentication credentials: Managed securely via Firebase Authentication (Google Cloud)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              02. PAYMENT DATA & RAZORPAY SECURITY
            </h2>
            <p>
              FBFY <strong>does not</strong> store, view, or process your credit/debit card numbers, CVVs, or UPI PINs. All financial transactions are directly processed through <strong>Razorpay Payment Solutions Private Limited</strong>. Razorpay operates under strict PCI-DSS Level 1 certification and uses 256-bit SSL encryption to protect your financial credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              03. HOW WE USE YOUR INFORMATION
            </h2>
            <p>Your data is used strictly for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#8E8E93]">
              <li>Processing, manufacturing, and shipping your customized streetwear orders</li>
              <li>Sending order status updates, delivery tracking links, and digital invoices via SMS/Email</li>
              <li>Customer service assistance and resolving inquiries</li>
              <li>Preventing fraudulent transactions and ensuring platform integrity</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              04. COOKIES & LOCAL STORAGE
            </h2>
            <p>
              We use lightweight local browser storage to persist your shopping bag selections and custom engraving preferences across browser sessions. We do not sell your personal data to any third-party brokers.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              05. GRIEVANCE OFFICER & DATA INQUIRIES
            </h2>
            <p>
              In accordance with the Information Technology Act 2000, for any data access, rectification, or deletion requests, contact our designated Grievance Officer:
              <br />
              <strong className="text-white">Officer:</strong> Privacy Grievance Officer, FBFY Studio
              <br />
              <strong className="text-white">Email:</strong> privacy@fbfy.in / support@fbfy.in
              <br />
              <strong className="text-white">Physical Address:</strong> Road No 36, Jubilee Hills, Hyderabad, Telangana 500033
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
