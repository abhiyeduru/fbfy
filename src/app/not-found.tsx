"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f2] flex flex-col items-center justify-center p-6 text-center select-none font-mono-clean">
      <div className="mb-4">
        <span className="font-brand text-6xl md:text-8xl font-black text-white tracking-tighter">
          404
        </span>
      </div>

      <div className="max-w-md space-y-3 mb-8">
        <h1 className="text-sm uppercase tracking-[0.3em] text-white font-bold">
          PAGE NOT FOUND // ARCHIVE LOOKUP
        </h1>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          The requested coordinate does not exist in the FBFY fashion matrix.
        </p>
      </div>

      <Link
        href="/"
        className="px-6 py-3 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center gap-2 shadow-2xl"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO FBFY STORE</span>
      </Link>
    </div>
  );
}
