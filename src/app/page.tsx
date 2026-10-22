"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroCampaign } from "@/components/HeroCampaign";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { CollectionGallery } from "@/components/CollectionGallery";
import { BrandVideoSection } from "@/components/BrandVideoSection";
import { NeckLogoReveal } from "@/components/NeckLogoReveal";
import { PersonalizationReveal } from "@/components/PersonalizationReveal";
import { MaterialShowcase } from "@/components/MaterialShowcase";
import { EditorialCampaign } from "@/components/EditorialCampaign";
import { StudioAbout } from "@/components/StudioAbout";
import { Footer } from "@/components/Footer";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { SearchModal } from "@/components/SearchModal";
import { MenuDrawer } from "@/components/MenuDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { OrderTrackingModal } from "@/components/OrderTrackingModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CustomerDashboardModal } from "@/components/CustomerDashboardModal";
import { FbfyLoader } from "@/components/FbfyLoader";
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
      {/* 00: Shining FBFY Brand Entrance Loading Screen */}
      <FbfyLoader duration={1600} />

      {/* 01: Persistent Navigation with Mega-Menu & Announcement Bar */}
      <Navigation
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 02: Flagship Editorial Campaign Hero & Interactive 3D Studio */}
      <HeroCampaign
        activeHeroPreset={activeHeroPreset}
        onHeroPresetChange={handleHeroPresetChange}
        onOpenProductDetail={() => setSelectedProduct(currentProducts[0])}
      />

      {/* 03: Visual Shop by Category (Inspired by Reference Screenshot) */}
      <CategoryShowcase />

      {/* 04: Curated Collection Gallery with Badges, Ratings, Filters & Quick-Add */}
      <CollectionGallery
        products={currentProducts}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* 05: Cinematic Brand Video Section */}
      <BrandVideoSection />

      {/* 06: Signature Neck Branding Reveal */}
      <NeckLogoReveal
        onFocusHeroPreset={(preset) => handleHeroPresetChange(preset)}
      />

      {/* 07: Bottom-Corner Laser Personalization Reveal */}
      <PersonalizationReveal
        onFocusHeroPreset={(preset) => handleHeroPresetChange(preset)}
      />

      {/* 08: Material & Tactile Construction Showcase */}
      <MaterialShowcase />

      {/* 09: Cinematic Fashion Editorial Campaign / Lookbook */}
      <div id="lookbook">
        <EditorialCampaign />
      </div>

      {/* 10: Studio & Architectural Proportions */}
      <StudioAbout />

      {/* 11: Minimal Dark Footer with Legal & Tracking */}
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

      {/* E-Commerce Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer
        onSelectProduct={(product) => setSelectedProduct(product)}
      />
      <OrderTrackingModal />
      <CheckoutModal />
      <CustomerDashboardModal />
    </main>
  );
}
