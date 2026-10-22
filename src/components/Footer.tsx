"use client";

import React from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer className="w-full bg-[#050507] border-t border-white/[0.08] py-16 md:py-24 text-white">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-14 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-brand text-3xl md:text-5xl font-black tracking-tight text-white block mb-3">
                FBFY
              </span>
              <p className="font-sans text-xs text-[#8E8E93] tracking-wider leading-relaxed max-w-sm font-medium">
                ARCHITECTURAL STREETWEAR ENGINEERING. 280-400 GSM HEAVYWEIGHT SILHOUETTES WITH BESPOKE LASER-ENGRAVED PERSONALIZATION.
              </p>
            </div>

            <div className="mt-8 font-sans text-xs text-[#6E6E73] tracking-widest font-bold">
              DELHI • BENGALURU • MUMBAI • PARIS • TOKYO
            </div>
          </div>

          {/* Links Column 1: Collection */}
          <div className="md:col-span-3">
            <span className="font-sans text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase font-bold block mb-4">
              COLLECTIONS
            </span>
            <ul className="space-y-3 font-sans text-xs text-[#A1A1A6] font-medium">
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  OVERSIZED TEES (280 GSM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  HEAVYWEIGHT HOODIES (380 GSM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  GRAPHIC SERIES ARCHIVE
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  VINTAGE MINERAL WASH
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Legal & Compliance */}
          <div className="md:col-span-2">
            <span className="font-sans text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase font-bold block mb-4">
              POLICIES & LEGAL
            </span>
            <ul className="space-y-3 font-sans text-xs text-[#A1A1A6] font-medium">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  TERMS & CONDITIONS
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  SHIPPING & DELIVERIES
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  RETURN & REFUND POLICY
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Studio & Navigation */}
          <div className="md:col-span-2">
            <span className="font-sans text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase font-bold block mb-4">
              STUDIO QUICK ACCESS
            </span>
            <ul className="space-y-3 font-sans text-xs text-[#A1A1A6] font-medium">
              <li>
                <button
                  onClick={() => scrollTo("hero")}
                  className="hover:text-white transition-colors"
                >
                  3D VISUALIZER
                </button>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  TRACK SHIPMENT
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("studio")}
                  className="hover:text-white transition-colors"
                >
                  FABRIC MATRIX
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Trust Banner */}
        <div className="py-6 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-[#8E8E93]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest text-[#6E6E73] uppercase font-bold">
              100% SECURE PAYMENTS VIA RAZORPAY:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-white font-semibold">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-xs">UPI</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-xs">GPAY</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-xs">PHONEPE</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-xs">CREDIT / DEBIT CARDS</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-xs">NETBANKING</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-xs">CASH ON DELIVERY</span>
            </div>
          </div>
          <div className="text-[10px] text-[#6E6E73] tracking-widest font-bold">
            256-BIT SSL ENCRYPTED GATEWAY
          </div>
        </div>

        {/* Bottom Bar: Copyright & Monogram */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between font-sans text-xs text-[#6E6E73] gap-4 font-medium">
          <div>
            © 2026 FBFY ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>FBF SIGNATURE MONOGRAM</span>
            <span className="text-white font-bold">fbfy by &#123;name&#125;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
