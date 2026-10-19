"use client";

import React, { useState } from "react";
import { useCartAuth } from "@/context/CartAuthContext";
import { X, LogIn, UserPlus, AlertCircle, Loader2 } from "lucide-react";

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, signIn, signUp, user, signOutUser } = useCartAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0c0c10] border border-white/10 shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <span className="font-brand text-xl text-white font-bold tracking-tight">
            {user ? "CUSTOMER PROFILE" : isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
          </span>

          <button
            onClick={() => setIsAuthOpen(false)}
            aria-label="Close"
            className="p-1.5 text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user ? (
          /* Logged In View */
          <div className="space-y-6">
            <div className="p-4 bg-[#141419] border border-white/10 font-mono-clean text-xs">
              <span className="text-[#8E8E93] block mb-1">LOGGED IN AS:</span>
              <span className="text-white font-bold text-sm">{user.email}</span>
              <span className="text-[10px] text-[#6E6E73] block mt-1">
                UID: {user.uid}
              </span>
            </div>

            <button
              onClick={() => {
                signOutUser();
                setIsAuthOpen(false);
              }}
              className="w-full py-3 bg-[#1e1e24] text-white hover:bg-white hover:text-black transition-colors font-mono-clean text-xs uppercase tracking-widest font-bold"
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          /* Sign In / Register Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 font-mono-clean text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-clean text-[10px] uppercase text-[#8E8E93] mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#141419] border border-white/10 text-white font-mono-clean text-xs focus:border-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-mono-clean text-xs uppercase tracking-widest font-bold hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRegister ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>CREATE ACCOUNT</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>SIGN IN</span>
                </>
              )}
            </button>

            <div className="pt-4 border-t border-white/5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="font-mono-clean text-xs text-[#8E8E93] hover:text-white underline"
              >
                {isRegister
                  ? "Already have an account? Sign In"
                  : "New customer? Create an Account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
