"use client";

import React, { useEffect } from "react";
import { X, ArrowRight, Compass, Sparkles, Eye, Rotate3d, Film } from "lucide-react";
import { CameraPreset } from "@/types";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset?: (preset: CameraPreset) => void;
}

export function MenuDrawer({
  isOpen,
  onClose,
  onSelectPreset,
}: MenuDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handlePreset = (preset: CameraPreset) => {
    onClose();
    setTimeout(() => {
      const hero = document.getElementById("hero");
      hero?.scrollIntoView({ behavior: "smooth" });
      if (onSelectPreset) {
        onSelectPreset(preset);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-[#09090c] border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="font-brand text-2xl text-white font-extrabold tracking-tight">
              fbfy
            </span>
            <button
              onClick={onClose}
              className="p-2 text-[#8E8E93] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="mt-8 space-y-6">
            <button
              onClick={() => scrollTo("hero")}
              className="w-full text-left font-brand text-2xl text-white font-bold hover:text-white/70 transition-colors flex items-center justify-between group"
            >
              <span>3D VISUALIZER</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => scrollTo("collection")}
              className="w-full text-left font-brand text-2xl text-white font-bold hover:text-white/70 transition-colors flex items-center justify-between group"
            >
              <span>COLLECTION</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => scrollTo("film")}
              className="w-full text-left font-brand text-2xl text-white font-bold hover:text-white/70 transition-colors flex items-center justify-between group"
            >
              <span>CAMPAIGN FILM</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => scrollTo("studio")}
              className="w-full text-left font-brand text-2xl text-white font-bold hover:text-white/70 transition-colors flex items-center justify-between group"
            >
              <span>STUDIO</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => scrollTo("about")}
              className="w-full text-left font-brand text-2xl text-white font-bold hover:text-white/70 transition-colors flex items-center justify-between group"
            >
              <span>ABOUT</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </nav>

          {/* 3D Camera Quick Triggers */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <span className="font-mono-clean text-[10px] tracking-[0.25em] text-[#6E6E73] uppercase block mb-4">
              DIRECT CAMERA REVEAL
            </span>
            <div className="space-y-2">
              <button
                onClick={() => handlePreset("hero")}
                className="w-full flex items-center gap-3 p-3 bg-[#111115] hover:bg-[#16161c] border border-white/5 font-mono-clean text-xs text-white uppercase tracking-wider"
              >
                <Compass className="w-4 h-4 text-[#8E8E93]" />
                <span>01 SILHOUETTE PROPORTION</span>
              </button>

              <button
                onClick={() => handlePreset("neck")}
                className="w-full flex items-center gap-3 p-3 bg-[#111115] hover:bg-[#16161c] border border-white/5 font-mono-clean text-xs text-white uppercase tracking-wider"
              >
                <Eye className="w-4 h-4 text-[#8E8E93]" />
                <span>02 FBF NECKLINE MONOGRAM</span>
              </button>

              <button
                onClick={() => handlePreset("signature")}
                className="w-full flex items-center gap-3 p-3 bg-[#111115] hover:bg-[#16161c] border border-white/5 font-mono-clean text-xs text-white uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-[#8E8E93]" />
                <span>03 HEM SIGNATURE (fbfy by &#123;name&#125;)</span>
              </button>

              <button
                onClick={() => handlePreset("inspect")}
                className="w-full flex items-center gap-3 p-3 bg-[#111115] hover:bg-[#16161c] border border-white/5 font-mono-clean text-xs text-white uppercase tracking-wider"
              >
                <Rotate3d className="w-4 h-4 text-[#8E8E93]" />
                <span>04 360° INTERACTIVE INSPECT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-white/10 font-mono-clean text-xs text-[#6E6E73]">
          <div>fbfy // ARCHIVE 2026</div>
          <div className="mt-1">PARIS • TOKYO • NEW YORK</div>
        </div>
      </div>
    </div>
  );
}
