import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartAuthProvider } from "@/context/CartAuthContext";
import { StructuredData } from "@/components/StructuredData";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fbfy.in"),
  title: {
    default: "FBFY — LUXURY 3D STREETWEAR & BESPOKE SILHOUETTES",
    template: "%s | FBFY",
  },
  description:
    "Exclusive luxury streetwear garment engineering. Heavyweight 280 GSM architectural silhouettes, interactive 3D product visualizer, and custom laser-engraved hem signatures.",
  keywords: [
    "FBFY",
    "fbfy streetwear",
    "luxury streetwear India",
    "280 GSM oversized t-shirt",
    "custom engraved t-shirt",
    "heavyweight cotton tee",
    "architectural fashion",
    "3D clothing visualizer",
    "fbfy by you",
  ],
  authors: [{ name: "FBFY Design Studio", url: "https://www.fbfy.in" }],
  creator: "FBFY",
  publisher: "FBFY",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.fbfy.in",
  },
  openGraph: {
    title: "FBFY — LUXURY 3D STREETWEAR & BESPOKE SILHOUETTES",
    description:
      "Exclusive luxury streetwear garment engineering. Heavyweight 280 GSM architectural silhouettes and interactive 3D product visualizer.",
    url: "https://www.fbfy.in",
    siteName: "FBFY",
    images: [
      {
        url: "/assets/editorial_look_01.jpg",
        width: 1200,
        height: 630,
        alt: "FBFY Luxury Heavyweight Streetwear",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FBFY — LUXURY 3D STREETWEAR",
    description:
      "Exclusive streetwear garment engineering. Heavyweight 280 GSM silhouettes with personalized hem signature.",
    images: ["/assets/editorial_look_01.jpg"],
    creator: "@fbfy_official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} dark`}>
      <head>
        <StructuredData />
      </head>
      <body className="bg-[#08080A] text-[#F4F4F2] min-h-screen selection:bg-white selection:text-black font-sans antialiased">
        <CartAuthProvider>{children}</CartAuthProvider>
      </body>
    </html>
  );
}
