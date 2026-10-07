import React from "react";
import Link from "next/link";
import { HeartHandshake, ArrowLeft, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation & Refund Policy | QUANTUM Winter Arc",
  description: "Voluntary community contribution and refund policy for the QUANTUM platform.",
  alternates: {
    canonical: "https://www.transformationyourself.in/refund",
  },
};

export default function DonationRefundPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs">
            <HeartHandshake size={13} className="text-amber-400" />
            <span>COMMUNITY SUPPORT & REFUNDS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Donation & Refund Policy
          </h1>
          <p className="text-slate-400 text-sm">
            Last Updated: January 2026 • Transparency regarding voluntary patron contributions.
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-normal">
          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-400" />
              1. Platform Nature: 100% Free Core Access
            </h2>
            <p>
              QUANTUM is built as an independent, mission-driven operating system. All core transformation systems—including the 90-Day Habit Matrix, Quantum Core AI, Skill Decomposer, Visual Proof Gallery, and Commitment Certificates—are completely free for all challengers.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-3">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <span>👑</span>
              2. Voluntary Patron Contributions
            </h2>
            <p>
              Challengers who wish to support the ongoing server costs, database infrastructure, and independent development may voluntarily contribute via UPI (<code>anuragkumar.pandit2000@okicici</code>).
            </p>
            <p className="text-slate-400 text-xs">
              <strong className="text-white">Strict Anti-Paywall Rule:</strong> Patron contributions grant only a symbolic supporter card and community appreciation label. Donations do <em>not</em> grant unfair XP, artificial streak protection, or purchased leaderboard rank. Prestige in Quantum is earned solely through genuine discipline.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw size={18} className="text-sky-400" />
              3. Refund Policy
            </h2>
            <p>
              Because voluntary patron contributions are made as unconditional goodwill gifts to sustain open infrastructure, they are generally <strong className="text-white">non-refundable</strong> once processed.
            </p>
            <p>
              <strong className="text-white">Exceptions (Erroneous or Duplicate Transfers):</strong> If you made an accidental duplicate payment or entered an incorrect amount, please email us within <strong className="text-white">48 hours</strong> of the transaction with your UPI reference ID (UTR) and transaction screenshot. We will review and initiate a full reversal of the duplicate amount within 5 to 7 business days.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-sky-400" />
              4. Contact for Donation Queries
            </h2>
            <p>
              For any payment or donation assistance:
            </p>
            <div className="font-mono text-xs bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1 text-slate-300">
              <div>Contact: Anurag Pandit</div>
              <div>Email: anuragkumar.pandit2000@gmail.com</div>
              <div>Subject: [Donation Query / Refund Request]</div>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
