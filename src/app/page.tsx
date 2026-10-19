"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero3D } from "@/components/Hero3D";
import { BrandVideoSection } from "@/components/BrandVideoSection";
import { NeckLogoReveal } from "@/components/NeckLogoReveal";
import { PersonalizationReveal } from "@/components/PersonalizationReveal";
import { CollectionGallery } from "@/components/CollectionGallery";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { EditorialCampaign } from "@/components/EditorialCampaign";
import { MaterialShowcase } from "@/components/MaterialShowcase";
import { StudioAbout } from "@/components/StudioAbout";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { MenuDrawer } from "@/components/MenuDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AuthModal } from "@/components/AuthModal";
import { Product, CameraPreset } from "@/types";
import { PRODUCTS } from "@/data/products";
import { useCartAuth } from "@/context/CartAuthContext";

export default function Home() {
  const { products } = useCartAuth();
  const currentProducts = products && products.length > 0 ? products : PRODUCTS;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHeroPreset, setActiveHeroPreset] = useState<CameraPreset>("hero");

  const handleHeroPresetChange = (preset: CameraPreset) => {
    setActiveHeroPreset(preset);
  };

  React.useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const id = window.location.hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 250);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <main className="relative bg-[#08080a] text-[#f4f4f2] min-h-screen">
      {/* Persistent Navigation */}
      <Navigation
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 01: Hero 3D Garment Experience */}
      <Hero3D
        activePreset={activeHeroPreset}
        onPresetChange={handleHeroPresetChange}
        onOpenProductDetail={() => setSelectedProduct(currentProducts[0])}
      />

      {/* 02: Cinematic Brand Video Section */}
      <BrandVideoSection />

      {/* 03: Signature Neck Branding Reveal */}
      <NeckLogoReveal
        onFocusHeroPreset={(preset) => handleHeroPresetChange(preset)}
      />

      {/* 04: Bottom-Corner Personalization Reveal */}
      <PersonalizationReveal
        onFocusHeroPreset={(preset) => handleHeroPresetChange(preset)}
      />

      {/* 05: 3D Product Collection Gallery */}
      <CollectionGallery
        products={currentProducts}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* 06: Material & Tactile Construction Showcase */}
      <MaterialShowcase />

      {/* 07: Cinematic Fashion Editorial Campaign */}
      <EditorialCampaign />

      {/* 08: Studio & Architectural Proportions */}
      <StudioAbout />

      {/* 09: Minimal Dark Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        allProducts={currentProducts}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        products={currentProducts}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectPreset={(preset) => handleHeroPresetChange(preset)}
      />

      {/* E-Commerce & Account Modals */}
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
    </main>
  );
}
