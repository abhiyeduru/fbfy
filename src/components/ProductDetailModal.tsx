"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Product, ColorVariant } from "@/types";
import { useCartAuth } from "@/context/CartAuthContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  Rotate3d,
  ZoomIn,
  Play,
  Pause,
  Layers,
  Sparkles,
  Maximize2,
} from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export function ProductDetailModal({
  product,
  onClose,
  onSelectProduct,
  allProducts,
}: ProductDetailModalProps) {
  const { customName, setCustomName, addToCart } = useCartAuth();
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<(typeof SIZES)[number]>("L");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // 3D View & Interaction states
  const [viewMode, setViewMode] = useState<"3d" | "zoom" | "turntable">("3d");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTurntablePlaying, setIsTurntablePlaying] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const touchStartPos = useRef({ x: 0, y: 0 });
  const turntableTimer = useRef<NodeJS.Timeout | null>(null);

  // Reset active image & rotation when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setRotation({ x: 0, y: 0 });
    setSelectedColor(null);
  }, [product?.id]);

  // Handle keyboard navigation (Left/Right arrows for Amazon/Netflix slider)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!product) return;
      const count = product.images?.length || 2;
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev - 1 + count) % count);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev + 1) % count);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  // Turntable animation
  useEffect(() => {
    if (viewMode === "turntable" || isTurntablePlaying) {
      turntableTimer.current = setInterval(() => {
        setRotation((prev) => ({
          x: Math.sin(Date.now() / 800) * 8,
          y: (prev.y + 1.2) % 360,
        }));
      }, 20);
    } else {
      if (turntableTimer.current) clearInterval(turntableTimer.current);
    }
    return () => {
      if (turntableTimer.current) clearInterval(turntableTimer.current);
    };
  }, [viewMode, isTurntablePlaying]);

  // Build the complete array of images (Amazon / Netflix style one-by-one gallery)
  const galleryImages: { id: string; label: string; url: string; isMacro?: boolean }[] = [];
  if (product) {
    if (product.images && product.images.length > 0) {
      galleryImages.push(...product.images);
    } else {
      galleryImages.push(
        { id: "front", label: "FRONT VIEW", url: product.imageFront },
        { id: "back", label: "BACK GRAPHIC", url: product.imageBack || product.imageFront }
      );
    }

    // Ensure editorial / macro views are also available
    if (!galleryImages.some((img) => img.id === "neck_macro")) {
      galleryImages.push({
        id: "neck_macro",
        label: "NECK MONOGRAM",
        url: "/assets/editorial_neck_05.jpg",
        isMacro: true,
      });
    }
    if (!galleryImages.some((img) => img.id === "hem_macro")) {
      galleryImages.push({
        id: "hem_macro",
        label: "HEM SIGNATURE",
        url: "/assets/editorial_hem_04.jpg",
        isMacro: true,
      });
    }
  }

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];
  const currentColor = selectedColor || (product ? product.availableColors[0] : null);

  const currentIndex = product ? allProducts.findIndex((p) => p.id === product.id) : 0;
  const handlePrevProduct = () => {
    const prevIndex = (currentIndex - 1 + allProducts.length) % allProducts.length;
    onSelectProduct(allProducts[prevIndex]);
  };
  const handleNextProduct = () => {
    const nextIndex = (currentIndex + 1) % allProducts.length;
    onSelectProduct(allProducts[nextIndex]);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };
  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  // 3D Mouse / Drag interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (viewMode === "zoom") {
      const zoomX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const zoomY = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setZoomPos({ x: zoomX, y: zoomY });
      return;
    }

    if (isDragging) {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      setRotation({
        x: Math.max(-30, Math.min(30, currentRotation.current.x - deltaY * 0.25)),
        y: currentRotation.current.y + deltaX * 0.4,
      });
      return;
    }

    if (viewMode === "3d" && !isTurntablePlaying) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = -((y - centerY) / centerY) * 16;
      const rotY = ((x - centerX) / centerX) * 20;
      setRotation({ x: rotX, y: rotY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === "zoom") return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    currentRotation.current = { ...rotation };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      currentRotation.current = { ...rotation };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;
    setRotation({
      x: Math.max(-30, Math.min(30, currentRotation.current.x - deltaY * 0.25)),
      y: currentRotation.current.y + deltaX * 0.45,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (e.changedTouches.length === 1) {
      const swipeDistanceX = e.changedTouches[0].clientX - touchStartPos.current.x;
      const swipeDistanceY = e.changedTouches[0].clientY - touchStartPos.current.y;
      // If horizontal swipe is dominant and significant
      if (Math.abs(swipeDistanceX) > 60 && Math.abs(swipeDistanceY) < 50) {
        if (swipeDistanceX < 0) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
    if (viewMode === "3d" && !isTurntablePlaying) {
      setRotation({ x: 0, y: 0 });
    }
  };

  const handleOrder = () => {
    if (!product || !currentColor) return;
    addToCart(product, currentColor, selectedSize, customName);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 450);
  };

  // Safe check before rendering JSX (All hooks are already guaranteed to have run at top level)
  if (!product || !currentColor || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full min-h-screen sm:min-h-0 sm:max-w-7xl bg-[#0a0a0d] border-0 sm:border sm:border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col pb-16 lg:pb-0">
        {/* Top Minimal Nav Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#0e0e13]">
          <div className="flex items-center gap-3">
            <span className="font-mono-clean text-[11px] text-[#8E8E93] tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              FBFY // 3D SPECIFICATION & INTERACTIVE VIEWER
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="font-mono-clean text-[11px] text-white tracking-widest uppercase hidden sm:inline">
              {product.code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevProduct}
              aria-label="Previous Product"
              title="Previous Design"
              className="p-1.5 text-[#8E8E93] hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextProduct}
              aria-label="Next Product"
              title="Next Design"
              className="p-1.5 text-[#8E8E93] hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close Product View"
              className="p-1.5 text-[#8E8E93] hover:text-white border border-white/10 hover:border-white/30 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* Left Column: Amazon/Netflix Style Multi-Image Gallery & 3D Interactive Stage */}
          <div className="lg:col-span-8 relative bg-[#060608] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col md:flex-row items-stretch p-4 sm:p-6 gap-4">
            {/* Amazon Style Vertical Thumbnail Rail (Horizontal on Mobile) */}
            <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[580px] scrollbar-thin scrollbar-thumb-white/20 pb-2 md:pb-0 shrink-0 z-20">
              <span className="hidden md:block font-mono-clean text-[9px] text-[#6E6E73] tracking-[0.2em] uppercase mb-1">
                VIEWS ({galleryImages.length})
              </span>
              {galleryImages.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={img.id + idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setRotation({ x: 0, y: 0 });
                    }}
                    onMouseEnter={() => {
                      // Netflix/Amazon quick preview on hover
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 md:w-20 md:h-24 shrink-0 overflow-hidden border transition-all text-left group bg-[#0e0e12] ${
                      isActive
                        ? "border-white ring-2 ring-white/40 scale-[1.03] shadow-lg"
                        : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="80px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute bottom-1 left-1 right-1 font-mono-clean text-[7px] leading-tight text-white/90 truncate uppercase">
                      {img.label}
                    </div>
                    {isActive && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Stage: High Definition Interactive 3D Viewer */}
            <div className="relative flex-grow flex flex-col items-center justify-center min-h-[460px] md:min-h-[540px] overflow-hidden">
              {/* 3D Mode Bar & Tools */}
              <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 pointer-events-auto bg-black/70 backdrop-blur-md p-1 border border-white/10">
                  <button
                    onClick={() => {
                      setViewMode("3d");
                      setIsTurntablePlaying(false);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono-clean uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      viewMode === "3d" && !isTurntablePlaying
                        ? "bg-white text-black font-bold"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    <Rotate3d className="w-3 h-3" />
                    <span>3D TILT</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("turntable");
                      setIsTurntablePlaying(!isTurntablePlaying);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono-clean uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      isTurntablePlaying
                        ? "bg-white text-black font-bold"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    {isTurntablePlaying ? (
                      <Pause className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    <span>360° SPIN</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("zoom");
                      setIsTurntablePlaying(false);
                      setRotation({ x: 0, y: 0 });
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono-clean uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      viewMode === "zoom"
                        ? "bg-white text-black font-bold"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>HD LOUPE</span>
                  </button>
                </div>

                {/* Counter Badge */}
                <div className="font-mono-clean text-[10px] tracking-widest text-white/80 bg-black/70 backdrop-blur-md px-3 py-1.5 border border-white/10">
                  {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
                  {String(galleryImages.length).padStart(2, "0")} • {currentImage.label}
                </div>
              </div>

              {/* Prev / Next Slide Arrows on Left and Right (Netflix/Amazon Style) */}
              <button
                onClick={handlePrevImage}
                aria-label="Previous Image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all backdrop-blur-md shadow-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                aria-label="Next Image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all backdrop-blur-md shadow-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* 3D Interactive Canvas Stage */}
              <div
                ref={stageRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative w-full h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center select-none touch-none ${
                  viewMode === "zoom" ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
                }`}
                style={{ perspective: "1300px" }}
              >
                {/* 3D Transforming Container */}
                <div
                  className="relative w-full max-w-[440px] aspect-[4/5] transition-transform duration-150 ease-out flex items-center justify-center"
                  style={{
                    transform:
                      viewMode === "zoom"
                        ? "none"
                        : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${
                            isDragging ? 1.03 : 1
                          })`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Framed Garment */}
                  <div className="relative w-full h-full overflow-hidden bg-[#070709] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
                    {/* Normal/3D Mode Image Render */}
                    <Image
                      src={currentImage.url}
                      alt={currentImage.label}
                      fill
                      className={`object-contain object-center transition-all duration-300 pointer-events-none ${
                        viewMode === "zoom" ? "opacity-30" : "opacity-100"
                      }`}
                      priority
                    />

                    {/* HD Loupe Zoom Mode Lens (Amazon Style Magnifier) */}
                    {viewMode === "zoom" && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `url(${currentImage.url})`,
                          backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                          backgroundSize: "280%",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    )}

                    {/* Specular 3D Glare Lighting that shifts with tilt */}
                    {viewMode === "3d" && (
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at ${
                            50 + rotation.y * 1.5
                          }% ${
                            50 - rotation.x * 1.5
                          }%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)`,
                        }}
                      />
                    )}

                    {/* Dynamic Personalized Hem Signature Overlay in 3D Perspective */}
                    {!currentImage.isMacro && (
                      <div
                        className="absolute bottom-5 right-5 z-20 pointer-events-none font-mono-clean text-right"
                        style={{
                          transform:
                            "perspective(400px) rotateY(-8deg) rotateX(4deg) translateZ(10px)",
                        }}
                      >
                        <div className="bg-black/75 px-3 py-1.5 border border-white/20 backdrop-blur-md text-[11px] font-bold tracking-widest text-emerald-400 shadow-2xl">
                          fbfy by {customName || "YOU"}
                        </div>
                      </div>
                    )}

                    {/* View Info Pill */}
                    <div className="absolute bottom-3 left-3 z-20 font-mono-clean text-[9px] text-white/70 bg-black/80 px-2.5 py-1 border border-white/10 backdrop-blur-md">
                      3D PERSPECTIVE // {currentImage.label}
                    </div>
                  </div>

                  {/* Soft Realistic Contact Shadow on Floor */}
                  <div
                    className="absolute -bottom-6 w-4/5 h-6 bg-black/90 rounded-full blur-xl pointer-events-none"
                    style={{
                      transform: `translateX(${-rotation.y * 1.8}px) scale(${
                        1 - Math.abs(rotation.x) * 0.015
                      })`,
                    }}
                  />
                </div>
              </div>

              {/* Bottom Interactive Prompt */}
              <div className="w-full flex items-center justify-between pt-2 px-2 border-t border-white/5 font-mono-clean text-[10px] text-[#6E6E73]">
                <span>DRAG TO ROTATE IN 3D • MOUSE TILT ACTIVE</span>
                <span className="text-emerald-400">fbfy 280 GSM HEAVYWEIGHT COTTON</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Complete Checkout Action */}
          <div className="lg:col-span-4 p-5 sm:p-8 flex flex-col justify-between bg-[#0b0b0f]">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono-clean text-[10px] tracking-[0.3em] text-[#8E8E93] uppercase">
                  {product.collection} COLLECTION
                </span>
                <span className="font-mono-clean text-lg font-bold text-white">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              <h2 className="font-brand text-xl sm:text-2xl text-white font-extrabold tracking-tight mb-4">
                {product.name}
              </h2>

              {/* Personalization Name Input Field */}
              <div className="mb-5 p-3.5 bg-[#121218] border border-white/15">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono-clean text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>LOWER HEM CUSTOM ENGRAVING:</span>
                  </label>
                  <span className="font-mono-clean text-[9px] text-white/50">
                    REAL-TIME 3D PREVIEW
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-clean text-xs text-[#8E8E93] whitespace-nowrap">
                    fbfy by
                  </span>
                  <input
                    type="text"
                    maxLength={14}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    placeholder="ENTER YOUR NAME"
                    className="w-full px-3 py-1.5 bg-black border border-white/20 text-white font-mono-clean text-xs font-bold tracking-widest uppercase focus:border-white focus:outline-none"
                  />
                </div>
                <span className="font-mono-clean text-[9px] text-[#8E8E93] block mt-1.5">
                  Laser applied to lower right hem:{" "}
                  <strong className="text-white">fbfy by {customName || "YOU"}</strong>
                </span>
              </div>

              {/* Colorways */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2 font-mono-clean text-xs">
                  <span className="text-[#6E6E73] uppercase tracking-wider">COLORWAY</span>
                  <span className="text-white font-medium">{currentColor.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {product.availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`w-7 h-7 rounded-none border transition-all ${
                        currentColor.id === color.id
                          ? "scale-110 border-white ring-2 ring-white/40"
                          : "border-white/20 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2 font-mono-clean text-xs">
                  <span className="text-[#6E6E73] uppercase tracking-wider">SIZE / FIT</span>
                  <span className="text-white font-medium">SIZE {selectedSize} (OVERSIZED)</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-mono-clean uppercase tracking-wider border text-center transition-all ${
                        selectedSize === sz
                          ? "bg-white text-black font-bold border-white"
                          : "bg-[#141418] text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5 font-mono-clean text-[11px] text-[#A1A1A6] mb-5 border-t border-b border-white/10 py-3">
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">FIT PROFILE</span>
                  <span className="text-white">{product.fit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">MATERIAL MATRIX</span>
                  <span className="text-white">{product.fabric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">CALIBRATED GSM</span>
                  <span className="text-white font-bold">{product.gsm} GSM</span>
                </div>
              </div>
            </div>

            {/* Add to Bag Action */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleOrder}
                className="w-full py-4 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2 shadow-2xl active:scale-[0.99]"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>ADDED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG — ₹{product.price.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Netflix Style "MORE FROM FBFY" Horizontal Sliding Reel */}
        <div className="border-t border-white/10 bg-[#08080a] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-clean text-[10px] tracking-[0.25em] text-[#8E8E93] uppercase">
              NETFLIX REEL // EXPLORE ALL FBFY PIECES
            </span>
            <span className="font-mono-clean text-[10px] text-white/40">
              CLICK TO SWITCH DESIGN
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 pb-2">
            {allProducts.map((p) => {
              const isSelected = p.id === product.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className={`relative flex items-center gap-3 p-2 border shrink-0 bg-[#0e0e12] text-left transition-all ${
                    isSelected
                      ? "border-white ring-1 ring-white/50 bg-[#14141a]"
                      : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                  }`}
                >
                  <div className="relative w-12 h-14 bg-black overflow-hidden border border-white/10">
                    <Image
                      src={p.imageFront}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="pr-3">
                    <div className="font-brand text-xs font-bold text-white truncate max-w-[140px]">
                      {p.name}
                    </div>
                    <div className="font-mono-clean text-[10px] text-emerald-400">
                      ₹{p.price.toLocaleString()}
                    </div>
                    <div className="font-mono-clean text-[9px] text-[#6E6E73]">
                      {p.images?.length || 2} VIEWS
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile-Only Sticky Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#0c0c10]/95 backdrop-blur-xl border-t border-white/15 z-50 flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col">
            <span className="font-mono-clean text-[9px] text-[#8E8E93] uppercase">
              {currentColor.name} • SIZE {selectedSize}
            </span>
            <span className="font-mono-clean text-xs font-bold text-white">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleOrder}
            className="flex-1 py-3 px-4 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>ADDED!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
