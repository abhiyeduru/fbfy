"use client";

import React from "react";

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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

          {/* Links Column 2: Studio & Navigation */}
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
                  STUDIO
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("about")}
                  className="hover:text-white transition-colors"
                >
                  ABOUT
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Social & Specimen */}
          <div className="md:col-span-2">
            <span className="font-mono-clean text-[11px] text-[#8E8E93] tracking-[0.25em] uppercase block mb-4">
              CONNECT
            </span>
            <ul className="space-y-2.5 font-mono-clean text-xs text-[#A1A1A6]">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  INSTAGRAM
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  X / TWITTER
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  STUDIO CHANNEL
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright Only */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between font-mono-clean text-xs text-[#6E6E73] gap-4">
          <div>
            © 2026 FBFY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>FBF NECKLINE MONOGRAM</span>
            <span>fbfy by &#123;name&#125;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
