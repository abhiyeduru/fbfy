"use client";

import { useEffect } from "react";

export default function StudioRedirect() {
  useEffect(() => {
    window.location.href = "/#studio";
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center font-mono-clean text-xs text-[#8E8E93] uppercase tracking-widest">
      REDIRECTING TO STUDIO...
    </div>
  );
}
