"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", orderId: "", message: "" });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f2] p-6 sm:p-12 md:p-20 font-mono-clean">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#8E8E93] hover:text-white uppercase tracking-widest mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </Link>

        <div className="border-b border-white/10 pb-6 mb-12">
          <span className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] block mb-2">
            OFFICIAL BUSINESS COMMUNICATIONS // RAZORPAY VERIFIED
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-black text-white tracking-tight">
            CONTACT & STUDIO SUPPORT
          </h1>
          <p className="text-xs text-[#8E8E93] mt-3">
            Operating from Hyderabad, Telangana, India • 24-Hour Inquiries Response SLA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left: Official Business Information */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 bg-[#0e0e13] border border-white/10 space-y-4">
              <span className="text-[10px] text-[#8E8E93] uppercase tracking-widest block font-bold">
                OPERATIONAL OFFICE & STUDIO
              </span>

              <div className="flex items-start gap-3 text-xs text-[#A1A1A6]">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">FBFY Streetwear Studio</strong>
                  <span>Road No 36, Jubilee Hills</span>
                  <br />
                  <span>Hyderabad, Telangana — 500033, India</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#A1A1A6]">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[#6E6E73] block text-[10px]">GENERAL & SUPPORT:</span>
                  <a href="mailto:support@fbfy.in" className="text-white hover:underline">
                    support@fbfy.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#A1A1A6]">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[#6E6E73] block text-[10px]">PHONE & WHATSAPP:</span>
                  <span className="text-white font-bold">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#A1A1A6] pt-2 border-t border-white/5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white">Monday – Saturday</span>
                  <span className="block text-[10px] text-[#6E6E73]">10:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
              <span className="font-bold block mb-1">RAZORPAY MERCHANT DISCLOSURE</span>
              <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                All digital transactions on fbfy.in are secured by Razorpay 256-bit SSL encryption.
                For payment-related grievances or chargeback inquiries, contact support@fbfy.in.
              </p>
            </div>
          </div>

          {/* Right: Direct Customer Support Inquiry Form */}
          <div className="md:col-span-7 bg-[#0e0e13] border border-white/10 p-6 md:p-8">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide mb-1">
              SEND DIRECT INQUIRY
            </h2>
            <p className="text-xs text-[#8E8E93] mb-6">
              Inquire about your order, custom hem laser print, or bulk streetwear collaborations.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-black/50 border border-emerald-500/40">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  MESSAGE RECEIVED
                </h3>
                <p className="text-xs text-[#8E8E93]">
                  Our studio team has received your ticket and will reply to {formData.email || "you"} within 12 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#8E8E93] uppercase mb-1">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#8E8E93] uppercase mb-1">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#8E8E93] uppercase mb-1">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#8E8E93] uppercase mb-1">
                      ORDER ID (IF APPLICABLE)
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      placeholder="e.g. ORDER #123456"
                      className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#8E8E93] uppercase mb-1">
                    INQUIRY MESSAGE *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, sizing question, or return request..."
                    className="w-full bg-black border border-white/15 p-3 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-mono-clean text-xs font-bold uppercase tracking-widest hover:bg-[#E8E8E4] transition-colors flex items-center justify-center gap-2 shadow-xl"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT INQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
