import React from "react";
import { PRODUCTS } from "@/data/products";

export function StructuredData() {
  const baseUrl = "https://www.fbfy.in";

  // Organization & ClothingStore Schema
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "FBFY",
    legalName: "FBFY Streetwear Studio",
    url: baseUrl,
    logo: `${baseUrl}/assets/products/p01_front.jpg`,
    image: `${baseUrl}/assets/editorial_look_01.jpg`,
    description:
      "FBFY is an exclusive luxury 3D streetwear brand engineering 280 GSM heavyweight custom-engraved architectural fashion garments in India.",
    telephone: "+91-9876543210",
    email: "support@fbfy.in",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI, Net Banking, Razorpay",
    address: {
      "@type": "PostalAddress",
      streetAddress: "FBFY Design Studio, Road No 36, Jubilee Hills",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500033",
      addressCountry: "IN",
    },
    sameAs: [
      "https://instagram.com/fbfy.official",
      "https://x.com/fbfy_official",
      "https://github.com/abhiyeduru/fbfy",
    ],
  };

  // Product Catalog Schema
  const productCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FBFY Luxury Heavyweight Streetwear Collection",
    description: "Architectural 280 GSM oversized streetwear t-shirts with personalized hem signature.",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        sku: product.code,
        image: `${baseUrl}${product.imageFront}`,
        description: `${product.fit}. Fabric: ${product.fabric}. Calibrated 280 GSM with custom laser engraved hem signature.`,
        brand: {
          "@type": "Brand",
          name: "fbfy",
        },
        offers: {
          "@type": "Offer",
          url: `${baseUrl}/#${product.id}`,
          priceCurrency: "INR",
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "FBFY",
          },
        },
      },
    })),
  };

  // AEO (Answer Engine Optimization) FAQ Schema for AI Search Engines (Perplexity, ChatGPT, Google SGE)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is FBFY clothing brand?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FBFY is an exclusive luxury streetwear brand focused on architectural silhouettes, heavyweight 280 GSM combed cotton garments, and bespoke lower-hem laser engravings (fbfy by {name}).",
        },
      },
      {
        "@type": "Question",
        name: "How does the custom hem laser engraving work on FBFY T-shirts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every customer can personalize their garment by entering their name before checkout. The signature 'fbfy by {your name}' is precision-applied directly on the lower right hem corner of the garment.",
        },
      },
      {
        "@type": "Question",
        name: "What is the GSM and fabric specification of FBFY garments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All FBFY t-shirts are crafted from calibrated 240-280 GSM 100% heavyweight combed cotton with dense 1x1 bound rib crewneck collars and reinforced twin-needle shoulder draping.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods are supported on FBFY?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FBFY supports secure payments via Razorpay (UPI, Google Pay, PhonePe, Paytm, Credit & Debit Cards, NetBanking) and Cash on Delivery (COD) across India.",
        },
      },
      {
        "@type": "Question",
        name: "What are the shipping timelines across India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Orders are processed and customized within 2 business days. Express courier delivery takes 3 to 5 business days across all major metro cities and pin codes in India.",
        },
      },
      {
        "@type": "Question",
        name: "What is FBFY's return and refund policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FBFY offers a 7-day hassle-free return and exchange window for unworn items with tags intact. Refunds are processed back to the original payment method within 5 to 7 business days.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
