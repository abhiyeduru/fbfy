"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollectionRedirect() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = "/#collection";
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center font-mono-clean text-xs text-[#8E8E93] uppercase tracking-widest">
      REDIRECTING TO FBFY COLLECTION...
    </div>
  );
}
