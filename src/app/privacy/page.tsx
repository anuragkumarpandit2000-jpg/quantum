import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QUANTUM Winter Arc",
  description: "Privacy policy and data protection disclosures for the QUANTUM platform.",
  alternates: {
    canonical: "https://www.transformationyourself.in/privacy",
  },
};

export default function PrivacyPolicyPage() {
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
            <Shield size={13} className="text-sky-400" />
            <span>DATA PROTECTION & PRIVACY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm">
            Last Updated: January 2026 • Compliant with applicable data protection regulations including the Digital Personal Data Protection (DPDP) Act, 2023.
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-normal">
          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-sky-400" />
              1. Introduction
            </h2>
            <p>
              QUANTUM (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), hosted at{" "}
              <span className="text-sky-300 font-mono">transformationyourself.in</span>, operates a 90-day discipline and habit-tracking web platform. We respect your privacy and are committed to safeguarding your personal data. This policy explains what information we collect, why we collect it, and how you retain complete control over your records.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-sky-400" />
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Account Information:</strong> Your name, username, email address, password hash, and optional profile avatar.
              </li>
              <li>
                <strong className="text-white">Execution Logs:</strong> Daily habit checkboxes, timestamps of completion, streak counts, XP scores, and skills tasks.
              </li>
              <li>
                <strong className="text-white">Uploaded Proof Media:</strong> Photos or short progress clips you upload. You explicitly choose whether each upload is <span className="text-emerald-400 font-semibold">Public</span> (visible on the community proof feed) or <span className="text-amber-400 font-semibold">Private</span> (accessible only by your account).
              </li>
              <li>
                <strong className="text-white">AI Conversation Data:</strong> Queries submitted to Quantum Core AI are processed securely to provide personalized discipline suggestions and schedule breakdowns.
              </li>
              <li>
                <strong className="text-white">Technical Data:</strong> Browser user-agent and IP address logged solely for security defense, rate limiting, and session verification.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-sky-400" />
              3. How We Use and Protect Your Data
            </h2>
            <p>
              We use your data solely to deliver the core service: recording your habit history, calculating XP, generating your verifiable completion certificate, and providing AI coaching.
            </p>
            <p>
              We do <strong className="text-white">not</strong> sell, rent, or monetize your personal data. We do not run third-party advertising tracking scripts. Passwords are salted and hashed using industry-standard bcrypt before database insertion. All network transmissions are strictly encrypted via TLS/HTTPS.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-sky-400" />
              4. Your Rights & Data Erasure
            </h2>
            <p>
              You maintain full sovereignty over your data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Access & Export:</strong> You can inspect all your logged habits, proofs, and XP scores directly in your dashboard at any time.
              </li>
              <li>
                <strong className="text-white">Deletion:</strong> You may request full account deletion and complete erasure of all associated habit records and uploaded media by emailing our Grievance Officer.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-sky-400" />
              5. Grievance Officer & Contact
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding your personal data or this Privacy Policy, please contact our designated Grievance Officer:
            </p>
            <div className="font-mono text-xs bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1 text-slate-300">
              <div>Name: Anurag Pandit (Lead Architect)</div>
              <div>Email: anuragkumar.pandit2000@gmail.com</div>
              <div>Platform: QUANTUM (transformationyourself.in)</div>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
