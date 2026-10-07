import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | QUANTUM Winter Arc",
  description: "Terms and conditions governing the use of the QUANTUM discipline platform.",
  alternates: {
    canonical: "https://www.transformationyourself.in/terms",
  },
};

export default function TermsOfServicePage() {
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
            <Scale size={13} className="text-sky-400" />
            <span>TERMS OF ENGAGEMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm">
            Last Updated: January 2026 • Please read these terms carefully before participating in the Quantum Winter Arc.
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-normal">
          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-sky-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, registering, or using QUANTUM (at <span className="text-sky-300 font-mono">transformationyourself.in</span>), you agree to be bound by these Terms of Service. If you do not agree to these terms, you should not access or use the platform.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-sky-400" />
              2. Fitness & Health Disclaimer
            </h2>
            <p>
              QUANTUM is an autonomous self-discipline, productivity, and habit tracking operating system. It does <strong className="text-white">not</strong> provide medical, psychiatric, nutrition, or physical therapy advice.
            </p>
            <p>
              Any physical fitness routines (including calisthenics, weight training, or dietary choices) logged on this platform are undertaken at your sole risk and responsibility. Always consult a qualified physician or certified fitness professional before embarking on strenuous physical regimens.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-sky-400" />
              3. User Conduct & Acceptable Uploads
            </h2>
            <p>
              You agree to use QUANTUM solely for lawful personal self-improvement. You shall not:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Upload explicit, pornographic, violent, hateful, or copyrighted media to the public proof feed.</li>
              <li>Attempt to manipulate, script, or inject synthetic records into the XP engine or leaderboard.</li>
              <li>Interfere with or probe platform infrastructure or unauthorized endpoints.</li>
            </ul>
            <p>
              We reserve the right to remove non-compliant content and suspend accounts violating these standards without prior notice.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale size={18} className="text-sky-400" />
              4. The Winter Arc Pledge & Certificates
            </h2>
            <p>
              The &quot;Commitment Contract&quot; and subsequent &quot;Completion Certificate&quot; represent symbolic personal accountability pledges and milestone verifications. They do not constitute legally binding legal obligations, contracts of employment, or financial guarantees.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-sky-400" />
              5. Contact & Support
            </h2>
            <p>
              For legal inquiries, dispute resolution, or service assistance, contact us at:
            </p>
            <div className="font-mono text-xs bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1 text-slate-300">
              <div>Email: anuragkumar.pandit2000@gmail.com</div>
              <div>Domain: transformationyourself.in</div>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
