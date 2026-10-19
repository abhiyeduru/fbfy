import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import { CartAuthProvider } from "@/context/CartAuthContext";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FBFY — LUXURY STREETWEAR",
  description: "Exclusive streetwear garment engineering. Heavyweight luxury silhouettes and architectural 3D product visualization.",
  keywords: ["FBFY", "Streetwear", "Luxury Fashion", "Oversized Tee", "Custom Engraved Streetwear"],
  openGraph: {
    title: "FBFY — LUXURY STREETWEAR",
    description: "Exclusive streetwear garment engineering.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} dark`}>
      <body className="bg-[#08080A] text-[#F4F4F2] min-h-screen selection:bg-white selection:text-black">
        <CartAuthProvider>{children}</CartAuthProvider>
      </body>
    </html>
  );
}
