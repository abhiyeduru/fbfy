"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { CameraPreset } from "@/types";
import { PRODUCTS } from "@/data/products";
import { useCartAuth } from "@/context/CartAuthContext";
import {
  Rotate3d,
  Compass,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Layers,
  ArrowRight,
} from "lucide-react";

interface Hero3DProps {
  onOpenProductDetail?: () => void;
  activePreset?: CameraPreset;
  onPresetChange?: (preset: CameraPreset) => void;
}

export function Hero3D({
  onOpenProductDetail,
  activePreset: externalPreset,
  onPresetChange,
}: Hero3DProps) {
  const [internalPreset, setInternalPreset] = useState<CameraPreset>("hero");
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBackView, setIsBackView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<"normal" | "neck" | "hem">("normal");

  const { customName, setCustomName } = useCartAuth();

  const stageRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const currentPreset = externalPreset || internalPreset;
  const currentProduct = PRODUCTS[selectedProductIndex];

  // Gallery of one-by-one sliced views for the selected product
  const productImages = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : [
        { id: "front", label: "FRONT VIEW", url: currentProduct.imageFront },
        { id: "back", label: "BACK GRAPHIC", url: currentProduct.imageBack },
      ];

  const handlePresetSelect = (preset: CameraPreset) => {
    if (onPresetChange) {
      onPresetChange(preset);
    } else {
      setInternalPreset(preset);
    }

    if (preset === "neck") {
      setZoomLevel("neck");
      setIsBackView(false);
      setRotation({ x: 12, y: 0 });
    } else if (preset === "signature") {
      setZoomLevel("hem");
      setIsBackView(false);
      setRotation({ x: -10, y: -15 });
    } else if (preset === "inspect") {
      setZoomLevel("normal");
      setRotation({ x: 0, y: 35 });
    } else {
      setZoomLevel("normal");
      setRotation({ x: 0, y: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      setRotation({
        x: Math.max(-25, Math.min(25, currentRotation.current.x - deltaY * 0.2)),
        y: currentRotation.current.y + deltaX * 0.35,
      });
      return;
    }

    if (!stageRef.current || zoomLevel !== "normal") return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 16;
    setRotation({ x: rotX, y: rotY });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    currentRotation.current = { ...rotation };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (zoomLevel === "normal") {
      setRotation({ x: 0, y: 0 });
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      currentRotation.current = { ...rotation };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;
    setRotation({
      x: Math.max(-25, Math.min(25, currentRotation.current.x - deltaY * 0.25)),
      y: currentRotation.current.y + deltaX * 0.45,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  let displayImage = productImages[selectedImageIndex]?.url || currentProduct.imageFront;
  if (zoomLevel === "neck") {
    displayImage = "/assets/editorial_neck_05.jpg";
  } else if (zoomLevel === "hem") {
    displayImage = "/assets/editorial_hem_04.jpg";
  }

  return (
    <section
      id="hero"
      className="relative w-full min-h-[680px] md:min-h-[740px] h-[92vh] md:h-screen flex items-center justify-center overflow-hidden bg-[#070709] select-none pt-12 md:pt-0"
    >
      {/* Studio Lighting Background Glow & Subtle Grid */}
      <div className="absolute inset-0 studio-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 cinematic-glow pointer-events-none" />

      {/* Floating Monumental Brand Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1 className="text-[28vw] md:text-[22vw] font-brand tracking-tighter text-[#121216] font-black leading-none opacity-40 blur-[1px]">
          fbfy
        </h1>
      </div>

      {/* Directional Studio Spotlight Beam Behind Shirt */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] md:w-[600px] h-[340px] sm:h-[500px] md:h-[600px] bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Custom Name Input Bar */}
      <div className="absolute top-16 md:top-24 z-30 flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-[#121217]/90 border border-white/10 backdrop-blur-md shadow-2xl max-w-[94vw] sm:max-w-none">
        <span className="font-mono-clean text-[9px] sm:text-[10px] text-[#8E8E93] uppercase tracking-wider pl-1.5 hidden xs:inline">
          NAME FOR HEM:
        </span>
        <input
          type="text"
          maxLength={14}
          value={customName}
          onChange={(e) => setCustomName(e.target.value.toUpperCase())}
          placeholder="YOUR NAME"
          className="px-2 sm:px-3 py-1 bg-black/60 border border-white/15 text-white font-mono-clean text-xs font-bold tracking-widest uppercase focus:border-white focus:outline-none w-28 sm:w-44 text-center"
        />
        <div className="px-2 py-1 font-mono-clean text-[9px] sm:text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 whitespace-nowrap">
          fbfy by {customName || "YOU"}
        </div>
      </div>

      {/* Interactive 3D Garment Center Stage */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full max-w-2xl h-[420px] sm:h-[520px] md:h-[630px] flex items-center justify-center cursor-grab active:cursor-grabbing px-4 touch-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative w-full max-w-lg aspect-square transition-transform duration-200 ease-out flex items-center justify-center"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${
              zoomLevel !== "normal" ? 1.15 : 1.0
            })`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Realistic 3D Garment Render */}
          <div
            onClick={onOpenProductDetail}
            className={`relative w-full h-full overflow-hidden transition-all duration-500 cursor-pointer bg-black/40 border border-white/10 shadow-2xl ${
              zoomLevel !== "normal" ? "border-white/30" : ""
            }`}
          >
            <Image
              src={displayImage}
              alt={currentProduct.name}
              fill
              className={`object-contain object-center transition-transform duration-700 pointer-events-none ${
                isBackView && zoomLevel === "normal"
                  ? "scale-x-[-1] brightness-95"
                  : ""
              }`}
              priority
            />

            {/* Live Personalization Signature Overlay (fbfy by {name}) */}
            {zoomLevel === "normal" && !isBackView && (
              <div
                className="absolute bottom-6 right-6 z-20 pointer-events-none font-mono-clean text-right"
                style={{
                  transform: "perspective(300px) rotateY(-6deg) rotateX(2deg)",
                }}
              >
                <div className="bg-black/70 px-3 py-1.5 border border-white/15 backdrop-blur-sm text-xs font-bold tracking-widest text-emerald-400 shadow-xl">
                  fbfy by {customName || "YOU"}
                </div>
              </div>
            )}

            {/* In-view Zoom Badge */}
            {zoomLevel !== "normal" && (
              <div className="absolute top-4 left-4 z-20 font-mono-clean text-[10px] text-white/80 bg-black/70 px-3 py-1.5 border border-white/10 backdrop-blur-md">
                {zoomLevel === "neck"
                  ? "MACRO // FBFY INNER NECK MONOGRAM"
                  : `MACRO // fbfy by ${customName || "YOU"}`}
              </div>
            )}
          </div>

          {/* Soft Contact Shadow Beneath */}
          <div
            className="absolute -bottom-8 w-3/4 h-8 bg-black/80 rounded-full blur-xl pointer-events-none"
            style={{
              transform: `translateX(${-rotation.y * 1.5}px) scale(${
                1 - Math.abs(rotation.x) * 0.015
              })`,
            }}
          />
        </div>
      </div>

      {/* Desktop Floating Left: Interactive Camera Presets */}
      <div className="hidden md:flex absolute left-6 md:left-12 bottom-12 md:bottom-16 z-20 flex-col gap-3">
        <span className="text-[10px] tracking-[0.25em] text-[#6E6E73] uppercase font-mono-clean mb-1">
          3D CAMERA REVEAL
        </span>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handlePresetSelect("hero")}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono-clean uppercase tracking-wider rounded-none border transition-all ${
              currentPreset === "hero" && zoomLevel === "normal"
                ? "bg-white text-black border-white font-bold"
                : "bg-[#111114]/80 text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            01 SILHOUETTE
          </button>

          <button
            onClick={() => handlePresetSelect("neck")}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono-clean uppercase tracking-wider rounded-none border transition-all ${
              zoomLevel === "neck"
                ? "bg-white text-black border-white font-bold"
                : "bg-[#111114]/80 text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            02 NECK MONOGRAM
          </button>

          <button
            onClick={() => handlePresetSelect("signature")}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono-clean uppercase tracking-wider rounded-none border transition-all ${
              zoomLevel === "hem"
                ? "bg-white text-black border-white font-bold"
                : "bg-[#111114]/80 text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            03 HEM SIGNATURE
          </button>

          <button
            onClick={() => handlePresetSelect("inspect")}
            className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono-clean uppercase tracking-wider rounded-none border transition-all ${
              currentPreset === "inspect" && zoomLevel === "normal"
                ? "bg-white text-black border-white font-bold"
                : "bg-[#111114]/80 text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            04 360° INSPECT
          </button>
        </div>
      </div>

      {/* Desktop Floating Right: FBFY Design Selector & Order Trigger */}
      <div className="hidden md:flex absolute right-6 md:right-12 bottom-12 md:bottom-16 z-20 flex-col items-end gap-3 max-w-xs">
        <span className="text-[10px] tracking-[0.25em] text-[#6E6E73] uppercase font-mono-clean mb-1">
          FBFY PRINT SELECTOR
        </span>

        {/* 5 Quick Design Thumbnails */}
        <div className="flex items-center gap-2 p-2 bg-[#111114]/80 border border-white/10 backdrop-blur-md">
          {PRODUCTS.slice(0, 5).map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => {
                setSelectedProductIndex(idx);
                setSelectedImageIndex(0);
                setZoomLevel("normal");
              }}
              title={prod.name}
              className={`relative w-8 h-8 rounded-none border overflow-hidden transition-all ${
                selectedProductIndex === idx
                  ? "scale-110 border-white ring-2 ring-white/30"
                  : "border-white/20 hover:scale-105 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={prod.imageFront}
                alt={prod.name}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* View Controls & Action */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => {
              setIsBackView(!isBackView);
              setZoomLevel("normal");
              const backIdx = productImages.findIndex((img) => img.id.includes("back"));
              if (!isBackView && backIdx !== -1) {
                setSelectedImageIndex(backIdx);
              } else {
                setSelectedImageIndex(0);
              }
            }}
            className="px-3 py-1.5 text-[11px] font-mono-clean uppercase tracking-wider bg-[#111114]/80 text-[#A1A1A6] border border-white/10 hover:border-white/30 hover:text-white transition-colors"
          >
            {isBackView ? "FLIP: FRONT" : "FLIP: BACK"}
          </button>

          <button
            onClick={() => {
              setRotation({ x: 0, y: 0 });
              setZoomLevel("normal");
              setIsBackView(false);
              setSelectedImageIndex(0);
            }}
            title="Reset 3D Angle"
            className="p-1.5 bg-[#111114]/80 text-[#A1A1A6] border border-white/10 hover:border-white/30 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Order CTA */}
        {onOpenProductDetail && (
          <button
            onClick={onOpenProductDetail}
            className="mt-2 w-full py-2.5 px-4 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ORDER THIS DESIGN</span>
          </button>
        )}

        {/* Selected Product Title */}
        <div className="text-right mt-1 font-mono-clean text-[10px] text-[#8E8E93] tracking-widest leading-relaxed">
          <span className="text-white font-bold">{currentProduct.name}</span>
          <br />
          <span>280 GSM • fbfy by {customName || "YOU"}</span>
        </div>
      </div>

      {/* Floating Center Bottom: One-by-One Views Gallery (Amazon/Netflix Style) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-full max-w-[96vw] px-2">
        {/* Mobile-Only Quick Swatches & Controls */}
        <div className="flex md:hidden items-center justify-between w-full max-w-sm mb-2 px-1">
          {/* Quick Print Mini Swatches */}
          <div className="flex items-center gap-1.5 p-1 bg-black/80 border border-white/15 backdrop-blur-md">
            {PRODUCTS.slice(0, 5).map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => {
                  setSelectedProductIndex(idx);
                  setSelectedImageIndex(0);
                  setZoomLevel("normal");
                }}
                className={`relative w-6 h-7 border transition-all ${
                  selectedProductIndex === idx
                    ? "border-white ring-1 ring-white/50 scale-105"
                    : "border-white/20 opacity-50"
                }`}
              >
                <Image src={prod.imageFront} alt={prod.name} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Mobile Flip & Order */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsBackView(!isBackView);
                setZoomLevel("normal");
                const backIdx = productImages.findIndex((img) => img.id.includes("back"));
                if (!isBackView && backIdx !== -1) {
                  setSelectedImageIndex(backIdx);
                } else {
                  setSelectedImageIndex(0);
                }
              }}
              className="px-2.5 py-1 text-[10px] font-mono-clean uppercase bg-black/80 border border-white/15 text-white"
            >
              {isBackView ? "FRONT" : "BACK"}
            </button>
            {onOpenProductDetail && (
              <button
                onClick={onOpenProductDetail}
                className="px-3 py-1 bg-white text-black font-mono-clean text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>ORDER</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D Angles Selector Strip */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-black/85 border border-white/15 backdrop-blur-md shadow-2xl overflow-x-auto max-w-full scrollbar-none">
          <span className="font-mono-clean text-[9px] text-[#8E8E93] uppercase tracking-wider px-1.5 hidden sm:inline">
            ANGLES:
          </span>
          {productImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => {
                setSelectedImageIndex(idx);
                setZoomLevel("normal");
                if (img.id.includes("back")) setIsBackView(true);
                else setIsBackView(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 text-[9px] sm:text-[10px] font-mono-clean uppercase tracking-wider transition-all border whitespace-nowrap ${
                selectedImageIndex === idx && zoomLevel === "normal"
                  ? "bg-white text-black font-bold border-white"
                  : "bg-[#141418] text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              <div className="relative w-3.5 h-4 bg-black overflow-hidden border border-white/20 hidden xs:block">
                <Image src={img.url || currentProduct.imageFront} alt={img.label} fill className="object-cover" />
              </div>
              <span>{img.label}</span>
            </button>
          ))}
        </div>
        <span className="text-[8px] sm:text-[9px] font-mono-clean tracking-[0.2em] uppercase text-white/50 mt-1">
          SWIPE / DRAG SHIRT IN 3D
        </span>
      </div>
    </section>
  );
}
