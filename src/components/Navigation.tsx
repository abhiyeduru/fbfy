"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartAuth } from "@/context/CartAuthContext";
import {
  Search,
  Menu,
  ShoppingBag,
  User as UserIcon,
  Shield,
  ChevronDown,
  Heart,
  Truck,
  ArrowRight,
  Sparkles,
  Flame,
  Tag,
  Home,
  Rotate3d,
} from "lucide-react";

interface NavigationProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}

export function Navigation({ onOpenSearch, onOpenMenu }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    cartCount,
    setIsCartOpen,
    setIsAuthOpen,
    setIsTrackOrderOpen,
    setIsWishlistOpen,
    wishlist,
    user,
    storeSettings,
    setActiveCategoryFilter,
  } = useCartAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnterShop = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveShop = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  const scrollToSection = (id: string, categoryFilter?: string) => {
    setIsMegaMenuOpen(false);
    if (categoryFilter) {
      setActiveCategoryFilter(categoryFilter);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  // Mega-menu 4 visual cards data
  const megaVisualCards = [
    {
      title: "Oversized Tees",
      image: "/assets/products/p02_model.jpg",
      tag: "280 GSM",
      category: "Oversized Tees",
    },
    {
      title: "Hoodies & Fleece",
      image: "/assets/products/p03_front.jpg",
      tag: "380 GSM",
      category: "Hoodies",
    },
    {
      title: "Graphic Editions",
      image: "/assets/products/p01_front.jpg",
      tag: "Screenprint",
      category: "Graphic Editions",
    },
    {
      title: "Bottomwear & Cargos",
      image: "/assets/prod_black.jpg",
      tag: "Utilitarian",
      category: "Bottomwear",
    },
  ];

  return (
    <>
      {/* Fixed Header Wrapper ensuring seamless alignment between announcement bar and header */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* 00: Admin-Controlled Top Announcement Bar */}
        {storeSettings.announcementActive && (
          <aside
            aria-label="Announcement"
            className="bg-[#050508] border-b border-white/[0.08] text-white py-2 px-4 sm:px-8 text-center"
          >
            <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between text-[11px] font-sans tracking-wider">
              <div className="hidden sm:flex items-center gap-2 text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium tracking-widest text-[10px]">DELHI • MUMBAI • BANGALORE • WORLDWIDE</span>
              </div>

              <div className="flex-1 text-center font-medium">
                <span className="text-[#e2e2e5] tracking-wide">
                  {storeSettings.announcementText}
                </span>
                {storeSettings.announcementLinkText && (
                  <button
                    onClick={() => scrollToSection("collection")}
                    className="ml-3 underline font-bold text-white hover:text-emerald-400 transition-colors uppercase tracking-widest inline-flex items-center gap-1"
                  >
                    {storeSettings.announcementLinkText}
                    <ArrowRight className="w-3 h-3 inline" />
                  </button>
                )}
              </div>

              <div className="hidden md:flex items-center gap-4 text-white/60">
                <button
                  onClick={() => setIsTrackOrderOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5 uppercase text-[10px] tracking-widest font-semibold"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Track Order
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* 01: Main Navigation Header */}
        <header
          className={`relative w-full transition-all duration-300 ${
            isScrolled || isMegaMenuOpen
              ? "bg-[#060608]/95 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl"
              : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4 sm:py-5"
          }`}
        >
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
            {/* Left: Brand Monogram / Shield Logo & Wordmark */}
            <div className="flex items-center">
              <button
                onClick={() => scrollToSection("hero")}
                className="group flex items-center gap-3 focus:outline-none"
                aria-label="FBFY Home"
              >
                <div className="flex flex-col text-left py-1">
                  <span className="font-brand text-2xl md:text-3xl tracking-tight text-white font-black group-hover:text-white/80 transition-opacity">
                    FBFY
                  </span>
                  <span className="font-sans text-[8px] tracking-[0.28em] text-[#8E8E93] uppercase -mt-0.5 hidden sm:block font-bold">
                    PARIS • TOKYO
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Navigation Links with "Shop ⌄" Mega Menu */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {/* Mega Menu Trigger: "Shop ⌄" */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterShop}
                onMouseLeave={handleMouseLeaveShop}
              >
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className={`flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] font-semibold py-2 transition-colors ${
                    isMegaMenuOpen ? "text-white font-bold" : "text-[#A1A1A6] hover:text-white"
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isMegaMenuOpen ? "rotate-180 text-white" : "text-[#A1A1A6]"
                    }`}
                  />
                </button>

                {/* Active Underline Pill */}
                {isMegaMenuOpen && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full animate-fade-in" />
                )}
              </div>

              <button
                onClick={() => scrollToSection("collection")}
                className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#A1A1A6] hover:text-white transition-colors"
              >
                Collection
              </button>

              <button
                onClick={() => scrollToSection("lookbook")}
                className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#A1A1A6] hover:text-white transition-colors"
              >
                Lookbook
              </button>

              <button
                onClick={() => scrollToSection("studio")}
                className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#A1A1A6] hover:text-white transition-colors"
              >
                Studio 3D
              </button>

              <button
                onClick={() => setIsTrackOrderOpen(true)}
                className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#A1A1A6] hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                Track
              </button>

              <Link
                href="/dashboard"
                className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#A1A1A6] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </nav>

            {/* Right: Search, Wishlist, Account, Cart & Mobile Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Search */}
              <button
                onClick={onOpenSearch}
                aria-label="Search Collection"
                className="p-2 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-full transition-all focus:outline-none"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Wishlist"
                className="relative p-2 text-[#A1A1A6] hover:text-white hover:bg-white/5 rounded-full transition-all focus:outline-none"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-sans text-[9px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Profile / Login */}
              <button
                onClick={() => setIsAuthOpen(true)}
                aria-label="Customer Login"
                className={`p-2 transition-all rounded-full hover:bg-white/5 flex items-center gap-1.5 text-xs font-sans ${
                  user ? "text-emerald-400" : "text-[#A1A1A6] hover:text-white"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                {user && (
                  <span className="hidden xl:inline text-[10px] max-w-[80px] truncate text-white font-medium">
                    {user.email?.split("@")[0]}
                  </span>
                )}
              </button>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className="relative p-2 text-white hover:opacity-80 transition-opacity bg-white/10 hover:bg-white/20 rounded-full"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black font-sans text-[10px] font-bold flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white/20 text-[8px] flex items-center justify-center font-sans font-medium">
                    0
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={onOpenMenu}
                aria-label="Open Navigation Menu"
                className="lg:hidden p-2 text-[#A1A1A6] hover:text-white transition-colors focus:outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 02: Mega Menu Dropdown */}
          {isMegaMenuOpen && (
            <div
              onMouseEnter={handleMouseEnterShop}
              onMouseLeave={handleMouseLeaveShop}
              className="absolute top-full left-0 right-0 bg-[#07070a]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-8 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 grid grid-cols-12 gap-8 items-start">
                {/* Column 1: Shop by Category */}
                <div className="col-span-12 sm:col-span-3 border-r border-white/5 pr-6">
                  <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8E8E93] font-bold block mb-5">
                    Shop by Category
                  </span>
                  <ul className="space-y-3.5 font-sans text-xs">
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "Oversized Tees")}
                        className="text-white/90 hover:text-white font-medium transition-colors flex items-center justify-between w-full text-left group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          Oversized Tees
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">280 GSM</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "Hoodies")}
                        className="text-white/90 hover:text-white font-medium transition-colors flex items-center justify-between w-full text-left group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          Hoodies & Sweatshirts
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">380 GSM</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "Graphic Editions")}
                        className="text-white/90 hover:text-white font-medium transition-colors flex items-center justify-between w-full text-left group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          Graphic Series
                        </span>
                        <span className="text-[10px] text-white/40">Archival</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "Acid Washed")}
                        className="text-white/90 hover:text-white font-medium transition-colors flex items-center justify-between w-full text-left group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          Vintage & Acid Wash
                        </span>
                        <span className="text-[10px] text-white/40">Enzyme</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "Bottomwear")}
                        className="text-white/90 hover:text-white font-medium transition-colors flex items-center justify-between w-full text-left group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          Bottomwear & Cargos
                        </span>
                        <span className="text-[10px] text-white/40">Utility</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Discover */}
                <div className="col-span-12 sm:col-span-3 border-r border-white/5 pr-6">
                  <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8E8E93] font-bold block mb-5">
                    Discover
                  </span>
                  <ul className="space-y-3.5 font-sans text-xs">
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "NEW DROPS")}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-2 group w-full text-left"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>New Launch</span>
                        <span className="ml-auto bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                          DROP 04
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "BEST SELLERS")}
                        className="text-white/90 hover:text-amber-400 transition-colors flex items-center gap-2 group w-full text-left font-medium"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          Best Sellers
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("collection", "ARCHIVE SALE")}
                        className="text-white/90 hover:text-rose-400 transition-colors flex items-center gap-2 group w-full text-left font-medium"
                      >
                        <Tag className="w-3.5 h-3.5 text-rose-400" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          Price Drop 🏷️
                        </span>
                        <span className="ml-auto text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold">
                          Up to 40% OFF
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("lookbook")}
                        className="text-white/90 hover:text-purple-400 transition-colors flex items-center gap-2 group w-full text-left font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          Designer Wear — Exclusive
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column 3: 4 Visual Category Cards with Model Photos */}
                <div className="col-span-12 sm:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {megaVisualCards.map((card) => (
                    <button
                      key={card.title}
                      onClick={() => scrollToSection("collection", card.category)}
                      className="group relative flex flex-col text-left focus:outline-none"
                    >
                      <div className="relative w-full aspect-[3/4] bg-[#141419] overflow-hidden rounded-xs border border-white/[0.08] group-hover:border-white/40 transition-all">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          unoptimized
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-xs text-[8px] font-sans font-bold text-white/90 border border-white/10">
                          {card.tag}
                        </div>
                      </div>
                      <span className="mt-2 text-[11px] font-sans font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                        {card.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Backdrop overlay for mega-menu */}
      {isMegaMenuOpen && (
        <div
          onClick={() => setIsMegaMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 03: Modern Streetwear Mobile Bottom App Bar (Sticky on phones) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080c]/90 backdrop-blur-xl border-t border-white/[0.12] px-4 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
      >
        <button
          onClick={() => scrollToSection("hero")}
          className="flex flex-col items-center gap-1 text-[#8E8E93] hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-sans text-[9px] uppercase tracking-wider font-bold">Home</span>
        </button>

        <button
          onClick={() => scrollToSection("collection")}
          className="flex flex-col items-center gap-1 text-[#8E8E93] hover:text-white transition-colors"
        >
          <Tag className="w-5 h-5" />
          <span className="font-sans text-[9px] uppercase tracking-wider font-bold">Shop</span>
        </button>

        <button
          onClick={() => scrollToSection("studio")}
          className="flex flex-col items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Rotate3d className="w-5 h-5" />
          <span className="font-sans text-[9px] uppercase tracking-wider font-bold">3D Studio</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[#8E8E93] hover:text-white transition-colors"
        >
          <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-sans text-[8px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="font-sans text-[9px] uppercase tracking-wider font-bold">Wishlist</span>
        </button>

        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-[#8E8E93] hover:text-white transition-colors"
        >
          <UserIcon className="w-5 h-5" />
          <span className="font-sans text-[9px] uppercase tracking-wider font-bold">
            {user ? "Account" : "Login"}
          </span>
        </Link>
      </nav>
    </>
  );
}
