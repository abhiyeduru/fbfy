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
  Truck,
  ShieldCheck,
  Ruler,
  Star,
  Flame,
  ArrowRight,
  Zap,
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
  const { customName, setCustomName, addToCart, setIsCheckoutOpen } = useCartAuth();
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<(typeof SIZES)[number]>("L");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Delivery Pincode state
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Size Chart modal state
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

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
    setPincodeResult(null);
  }, [product?.id]);

  // Handle keyboard navigation
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

  // Build the complete array of images
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

  const handleBuyNow = () => {
    if (!product || !currentColor) return;
    addToCart(product, currentColor, selectedSize, customName);
    onClose();
    setIsCheckoutOpen(true);
  };

  // Indian Pincode check
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeResult("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeResult("Express Delivery Available: Delivery by Oct 25-27 via BlueDart Express (Free Shipping).");
    }, 600);
  };

  if (!product || !currentColor || !currentImage) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full min-h-screen sm:min-h-0 sm:max-w-7xl bg-[#0a0a0d] border-0 sm:border sm:border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col pb-24 lg:pb-0">
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
          {/* Left Column: Multi-Image Gallery & 3D Interactive Stage */}
          <div className="lg:col-span-8 relative bg-[#060608] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col md:flex-row items-stretch p-4 sm:p-6 gap-4">
            {/* Vertical Thumbnail Rail */}
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

              {/* Prev / Next Slide Arrows */}
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
                  <div className="relative w-full h-full overflow-hidden bg-[#070709] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
                    <Image
                      src={currentImage.url}
                      alt={currentImage.label}
                      fill
                      quality={100}
                      unoptimized
                      className={`object-contain object-center transition-all duration-300 pointer-events-none ${
                        viewMode === "zoom" ? "opacity-30" : "opacity-100"
                      }`}
                      priority
                    />

                    {/* HD Loupe Zoom Mode Lens */}
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

                    {/* Specular 3D Glare */}
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

                    {/* Dynamic Personalized Hem Signature */}
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

                  {/* Soft Realistic Contact Shadow */}
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
                <span className="text-emerald-400">fbfy {product.gsm} GSM HEAVYWEIGHT COTTON</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization, Pincode & Order Actions */}
          <div className="lg:col-span-4 p-5 sm:p-7 flex flex-col justify-between bg-[#0b0b0f] overflow-y-auto max-h-[85vh]">
            <div>
              {/* Category, Rating & Price Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono-clean text-[10px] tracking-[0.25em] text-[#8E8E93] uppercase">
                  {product.category || product.collection}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono-clean">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-white/40">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-brand text-xl sm:text-2xl text-white font-extrabold tracking-tight mb-2">
                {product.name}
              </h2>

              {/* Price & Savings Display */}
              <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-white/10">
                <span className="font-brand text-2xl font-extrabold text-white">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="font-mono-clean text-xs text-white/40 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="font-mono-clean text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-xs">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
                <span className="ml-auto text-[10px] font-mono-clean text-[#8E8E93]">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Personalization Name Input Field */}
              <div className="mb-4 p-3 bg-[#121218] border border-white/15 rounded-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono-clean text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>LOWER HEM CUSTOM SIGNATURE:</span>
                  </label>
                  <span className="font-mono-clean text-[9px] text-white/50">
                    LIVE PREVIEW
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
                    placeholder="YOUR NAME"
                    className="w-full px-3 py-1.5 bg-black border border-white/20 text-white font-mono-clean text-xs font-bold tracking-widest uppercase focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Colorways */}
              <div className="mb-4">
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

              {/* Sizes with Size Chart Trigger & Live Stock Alert */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2 font-mono-clean text-xs">
                  <span className="text-[#6E6E73] uppercase tracking-wider">SIZE / FIT</span>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-white hover:text-emerald-400 font-medium underline flex items-center gap-1 text-[11px]"
                  >
                    <Ruler className="w-3 h-3" /> Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-mono-clean uppercase tracking-wider border text-center transition-all ${
                        selectedSize === sz
                          ? "bg-white text-black font-extrabold border-white"
                          : "bg-[#141418] text-[#8E8E93] border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Stock Urgency */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono-clean text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xs">
                  <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>
                    High Demand: Only <strong className="text-white">{product.stock || 4} units</strong> left in {selectedSize}
                  </span>
                </div>
              </div>

              {/* Delivery PIN Code Check */}
              <div className="mb-4 p-3 bg-[#121217] border border-white/10 rounded-xs">
                <span className="text-[10px] font-mono-clean uppercase tracking-wider text-[#8E8E93] block mb-1.5 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-emerald-400" />
                  Estimate Delivery & Availability
                </span>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 bg-black border border-white/15 px-3 py-1.5 text-xs font-mono-clean text-white focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    disabled={isCheckingPincode}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white font-mono-clean text-[11px] uppercase tracking-wider font-bold transition-colors"
                  >
                    {isCheckingPincode ? "Checking..." : "Check"}
                  </button>
                </form>
                {pincodeResult && (
                  <p className="text-[10px] font-mono-clean text-emerald-400 mt-2">
                    {pincodeResult}
                  </p>
                )}
              </div>

              {/* Product Specifications */}
              <div className="space-y-1.5 font-mono-clean text-[11px] text-[#A1A1A6] mb-4 border-t border-b border-white/10 py-3">
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">FIT PROFILE</span>
                  <span className="text-white">{product.fit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">MATERIAL MATRIX</span>
                  <span className="text-white">{product.fabric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">CALIBRATED WEIGHT</span>
                  <span className="text-white font-bold">{product.gsm} GSM</span>
                </div>
              </div>
            </div>

            {/* Double Action: Add to Bag & Buy Now */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleOrder}
                  className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono-clean text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>ADDED!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-white text-black hover:bg-white/90 font-mono-clean text-xs uppercase tracking-wider font-extrabold transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>BUY NOW</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono-clean text-white/50 pt-1">
                <span>✓ 7-Day Hassle-Free Returns</span>
                <span>✓ 100% Genuine Studio Garment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Size Chart Modal Overlay */}
        {isSizeChartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-[#0e0e14] border border-white/15 p-6 rounded-sm text-white shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-brand text-base font-bold">
                    ARCHITECTURAL SIZE GUIDE (INCHES)
                  </h3>
                </div>
                <button
                  onClick={() => setIsSizeChartOpen(false)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <table className="w-full text-left font-mono-clean text-xs border border-white/10">
                <thead className="bg-[#16161f] text-[#8E8E93]">
                  <tr>
                    <th className="p-2.5 border-b border-white/10">SIZE</th>
                    <th className="p-2.5 border-b border-white/10">CHEST</th>
                    <th className="p-2.5 border-b border-white/10">LENGTH</th>
                    <th className="p-2.5 border-b border-white/10">SHOULDER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-2.5 font-bold">S</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">28"</td>
                    <td className="p-2.5">21"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">M</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">29"</td>
                    <td className="p-2.5">22"</td>
                  </tr>
                  <tr className="bg-emerald-500/10 text-emerald-300">
                    <td className="p-2.5 font-bold">L (Default)</td>
                    <td className="p-2.5">46"</td>
                    <td className="p-2.5">30"</td>
                    <td className="p-2.5">23"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XL</td>
                    <td className="p-2.5">48"</td>
                    <td className="p-2.5">31"</td>
                    <td className="p-2.5">24"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XXL</td>
                    <td className="p-2.5">50"</td>
                    <td className="p-2.5">32"</td>
                    <td className="p-2.5">25"</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] font-mono-clean text-[#8E8E93] mt-4">
                Note: FBFY garments feature an intentional dropped-shoulder architectural oversized drape. Order your normal size for the intended boxy aesthetic.
              </p>
            </div>
          </div>
        )}

        {/* Netflix Style "MORE FROM FBFY" Horizontal Sliding Reel */}
        <div className="border-t border-white/10 bg-[#08080a] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-clean text-[10px] tracking-[0.25em] text-[#8E8E93] uppercase">
              STUDIO ARCHIVE // EXPLORE ALL PIECES
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
                    <div className="font-mono-clean text-[10px] text-emerald-400 font-bold">
                      ₹{p.price.toLocaleString()}
                    </div>
                    <div className="font-mono-clean text-[9px] text-[#6E6E73]">
                      {p.gsm} GSM • {p.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
