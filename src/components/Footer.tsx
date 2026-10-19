"use client";

import React from "react";

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
    <footer className="w-full bg-[#050506] border-t border-white/10 py-16 md:py-24 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-brand text-3xl md:text-4xl font-extrabold tracking-tighter text-white block mb-4">
                fbfy
              </span>
              <span className="font-mono-clean text-xs text-[#6E6E73] tracking-widest block">
                STREETWEAR SILHOUETTES // ARCHIVE
              </span>
            </div>

            <div className="mt-8 font-mono-clean text-[11px] text-[#6E6E73] tracking-widest">
              PARIS • TOKYO • NEW YORK • BERLIN
            </div>
          </div>

          {/* Links Column 1: Collection */}
          <div className="md:col-span-3">
            <span className="font-mono-clean text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase block mb-4">
              COLLECTION
            </span>
            <ul className="space-y-2.5 font-mono-clean text-xs text-[#A1A1A6]">
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  SIGNATURE (001)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  GRAPHIC (002)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  WASHED (003)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="hover:text-white transition-colors"
                >
                  LIMITED (004)
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Legal & Compliance (Razorpay Requirement) */}
          <div className="md:col-span-2">
            <span className="font-mono-clean text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase block mb-4">
              POLICIES & LEGAL
            </span>
            <ul className="space-y-2.5 font-mono-clean text-xs text-[#A1A1A6]">
              <li>
                <a
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  TERMS & CONDITIONS
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  SHIPPING & DELIVERY
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="hover:text-white transition-colors"
                >
                  REFUND & CANCELLATION
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  CONTACT & STUDIO
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Studio & Navigation */}
          <div className="md:col-span-2">
            <span className="font-mono-clean text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase block mb-4">
              NAVIGATION
            </span>
            <ul className="space-y-2.5 font-mono-clean text-xs text-[#A1A1A6]">
              <li>
                <button
                  onClick={() => scrollTo("hero")}
                  className="hover:text-white transition-colors"
                >
                  3D VISUALIZER
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("film")}
                  className="hover:text-white transition-colors"
                >
                  CAMPAIGN FILM
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("studio")}
                  className="hover:text-white transition-colors"
                >
                  STUDIO ARCHIVE
                </button>
              </li>
              <li>
                <a
                  href="/admin"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  ADMIN PORTAL
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Trust Banner (Razorpay Required) */}
        <div className="py-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono-clean text-xs text-[#8E8E93]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest text-[#6E6E73] uppercase">
              100% SECURE PAYMENTS VIA RAZORPAY:
            </span>
            <div className="flex items-center gap-2 text-[10px] text-white">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">UPI</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">GPAY</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">PHONEPE</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">CREDIT / DEBIT CARDS</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">NETBANKING</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">CASH ON DELIVERY</span>
            </div>
          </div>
          <div className="text-[10px] text-[#6E6E73] tracking-widest">
            256-BIT SSL ENCRYPTED GATEWAY
          </div>
        </div>

        {/* Bottom Bar: Copyright & Monogram */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between font-mono-clean text-xs text-[#6E6E73] gap-4">
          <div>
            © 2026 FBFY ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>FBF SIGNATURE MONOGRAM</span>
            <span className="text-white">fbfy by &#123;name&#125;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
