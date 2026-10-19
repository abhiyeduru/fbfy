"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartAuth } from "@/context/CartAuthContext";
import { Search, Menu, ShoppingBag, User as UserIcon, Shield } from "lucide-react";

interface NavigationProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}

export function Navigation({ onOpenSearch, onOpenMenu }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, setIsCartOpen, setIsAuthOpen, user } = useCartAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080a]/90 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: FBFY Wordmark */}
        <button
          onClick={() => scrollToSection("hero")}
          className="group text-left focus:outline-none"
        >
          <span className="font-brand text-2xl md:text-3xl tracking-tighter text-white font-extrabold transition-opacity group-hover:opacity-80">
            fbfy
          </span>
        </button>

        {/* Center: Collection / Film / Studio / About */}
        <nav className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollToSection("collection")}
            className="text-xs font-mono-clean uppercase tracking-[0.2em] text-[#A1A1A6] hover:text-white transition-colors"
          >
            COLLECTION
          </button>
          <button
            onClick={() => scrollToSection("film")}
            className="text-xs font-mono-clean uppercase tracking-[0.2em] text-[#A1A1A6] hover:text-white transition-colors"
          >
            FILM
          </button>
          <button
            onClick={() => scrollToSection("studio")}
            className="text-xs font-mono-clean uppercase tracking-[0.2em] text-[#A1A1A6] hover:text-white transition-colors"
          >
            STUDIO
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-xs font-mono-clean uppercase tracking-[0.2em] text-[#A1A1A6] hover:text-white transition-colors"
          >
            ABOUT
          </button>
          <Link
            href="/admin"
            className="text-[11px] font-mono-clean uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 border border-emerald-500/20 px-2 py-0.5 rounded"
          >
            <Shield className="w-3 h-3" />
            ADMIN
          </Link>
        </nav>

        {/* Right: Search, Auth, Cart & Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            aria-label="Search Collection"
            className="p-2 text-[#A1A1A6] hover:text-white transition-colors focus:outline-none"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Profile / Login */}
          <button
            onClick={() => setIsAuthOpen(true)}
            aria-label="Customer Login"
            className={`p-2 transition-colors flex items-center gap-1 text-xs font-mono-clean ${
              user ? "text-emerald-400" : "text-[#A1A1A6] hover:text-white"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            {user && (
              <span className="hidden lg:inline text-[10px] max-w-[80px] truncate">
                {user.email?.split("@")[0]}
              </span>
            )}
          </button>

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Bag"
            className="relative p-2 text-white hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black font-mono-clean text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="p-2 text-[#A1A1A6] hover:text-white transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
