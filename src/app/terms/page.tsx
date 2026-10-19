"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f2] p-6 sm:p-12 md:p-20 font-mono-clean">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#8E8E93] hover:text-white uppercase tracking-widest mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </Link>

        <div className="border-b border-white/10 pb-6 mb-10">
          <span className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] block mb-2">
            LEGAL COMPLIANCE // RAZORPAY VERIFIED
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-black text-white tracking-tight">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs text-[#8E8E93] mt-3">
            Last Updated: October 2026 • Governing Law: Jurisdiction of Hyderabad, Telangana, India
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#A1A1A6] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              01. OVERVIEW & ACCEPTANCE
            </h2>
            <p>
              This website is operated by <strong>FBFY</strong> (referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). Throughout the site, the terms &quot;you&quot;, &quot;user&quot;, or &quot;customer&quot; refer to any person accessing or purchasing products from fbfy.in. By accessing our platform, configuring custom-engraved garments, or purchasing goods, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              02. BESPOKE PERSONALIZATION & LASER ENGRAVING
            </h2>
            <p>
              Each FBFY garment is custom-printed and engraved with the user-provided customer signature (<code className="text-emerald-400 font-mono">fbfy by &#123;name&#125;</code>) on the lower right hem. You are solely responsible for ensuring the accuracy and spelling of the personalized name entered during checkout. We reserve the right to decline or censor any engraving text that contains defamatory, unlawful, hateful, or abusive language.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              03. PRICING & PAYMENT GATEWAY (RAZORPAY)
            </h2>
            <p>
              All prices listed on fbfy.in are in Indian Rupees (INR) and are inclusive of applicable goods and services taxes (GST). We utilize <strong>Razorpay Payment Solutions</strong> as our authorized online payment gateway. By opting for online payment, you agree to comply with Razorpay&apos;s terms of service and security standards (PCI-DSS compliant). Cash on Delivery (COD) is also available across serviceable pin codes in India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              04. INTELLECTUAL PROPERTY RIGHTS
            </h2>
            <p>
              All trademarks, product silhouette graphics, 3D interactive visualizations, photography, brand insignias (&quot;fbfy&quot;), and typography are the exclusive intellectual property of FBFY. Unauthorized reproduction, modification, or distribution is strictly prohibited under the Copyright Act, 1957.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              05. LIMITATION OF LIABILITY & GOVERNING LAW
            </h2>
            <p>
              To the maximum extent permitted by applicable Indian law, FBFY shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our products or website. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana, India.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="font-brand text-lg text-white font-bold tracking-wide">
              06. CONTACT FOR LEGAL NOTICES
            </h2>
            <p>
              For questions regarding these Terms &amp; Conditions, contact us at:
              <br />
              <strong className="text-white">Email:</strong> support@fbfy.in
              <br />
              <strong className="text-white">Address:</strong> FBFY Streetwear Studio, Road No 36, Jubilee Hills, Hyderabad, Telangana 500033
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
