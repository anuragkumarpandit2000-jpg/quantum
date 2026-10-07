import React from "react";
import Link from "next/link";
import { Mail, MessageSquare, ArrowLeft, Shield, Clock, MapPin, Send } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support | QUANTUM Winter Arc",
  description: "Get in touch with the QUANTUM engineering and founder team for questions, support, or feedback.",
  alternates: {
    canonical: "https://www.transformationyourself.in/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      <LandingNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-sky-300 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs">
            <MessageSquare size={13} className="text-sky-400" />
            <span>FOUNDER & GRIEVANCE SUPPORT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Contact & Support
          </h1>
          <p className="text-slate-400 text-sm">
            Have questions about the Winter Arc, feature suggestions, or need assistance? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Direct Support */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-sky-500/25 space-y-4 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Direct Email</h2>
              <p className="text-xs text-slate-400 mt-1">
                For account inquiries, bug reports, and general feedback.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-sky-300 select-all">
              anuragkumar.pandit2000@gmail.com
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <Clock size={12} className="text-emerald-400" />
              <span>Typical response: Within 24–48 hours</span>
            </div>
          </div>

          {/* Card 2: Grievance Officer */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Grievance Redressal</h2>
              <p className="text-xs text-slate-400 mt-1">
                Under the Information Technology (Intermediary Guidelines) Rules, 2021.
              </p>
            </div>
            <div className="space-y-1 font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div>Officer: Anurag Pandit</div>
              <div>Platform: QUANTUM</div>
              <div>Location: Bihar / India</div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <MapPin size={12} className="text-sky-400" />
              <span>transformationyourself.in</span>
            </div>
          </div>
        </div>

        {/* Community Patron & Contribution Info */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-3 font-mono text-xs">
          <div className="text-amber-300 font-bold flex items-center gap-2">
            <span>👑 Community Patron Inquiries</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            QUANTUM is an independently built discipline platform offered free of charge. If you have contributed via UPI (<code>anuragkumar.pandit2000@okicici</code>) and have questions regarding your Patron card or acknowledgment, please send your transaction reference to the email above.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
