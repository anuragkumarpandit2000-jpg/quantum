import React from "react";
import Link from "next/link";
import Image from "next/image";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-[#02050c] text-slate-400 py-14 px-6 font-mono text-xs select-none relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand statement */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-sky-400/40 bg-slate-950/60 p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <Image
                src="/assets/images/logo/logo.png"
                alt="Quantum Logo"
                width={30}
                height={30}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-extrabold text-lg text-white tracking-widest leading-none whitespace-nowrap">QUANTUM</span>
            <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-400/25 leading-none whitespace-nowrap">
              WINTER ARC
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
            A daily habit and discipline operating system designed for 90 consecutive days of focused execution. Real habits, authenticated progress, and verified milestones.
          </p>
          <div className="text-[11px] text-slate-500">
            SECURE CLOUD STORAGE • VERIFIED EXECUTION • ZERO VANITY
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-3">
          <div className="text-white font-bold tracking-wider uppercase text-xs">SECTIONS</div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/about" className="hover:text-sky-300 transition text-sky-400 font-bold">
                00 • About Quantum
              </Link>
            </li>
            <li>
              <Link href="/#what-is-quantum" className="hover:text-sky-300 transition">
                01 • Operating Philosophy
              </Link>
            </li>
            <li>
              <Link href="/#winter-arc" className="hover:text-sky-300 transition">
                02 • The 90-Day Arc
              </Link>
            </li>
            <li>
              <Link href="/#sovereign-badges" className="hover:text-sky-300 transition">
                03 • Milestone Badges
              </Link>
            </li>
            <li>
              <Link href="/#transformation" className="hover:text-sky-300 transition">
                04 • Transformation Benchmark
              </Link>
            </li>
            <li>
              <Link href="/#reviews" className="hover:text-sky-300 transition">
                05 • Community Reviews
              </Link>
            </li>
            <li>
              <Link href="/#mobile" className="hover:text-sky-300 transition">
                06 • Mobile Experience
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-sky-300 transition">
                08 • Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Engagement & Community */}
        <div className="space-y-3">
          <div className="text-white font-bold tracking-wider uppercase text-xs">COMMUNITY & PORTAL</div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/signup" className="hover:text-sky-300 transition text-sky-400 font-semibold">
                Start Day 1
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-sky-300 transition">
                Challenger Sign In
              </Link>
            </li>
            <li>
              <Link href="/#about-support" className="hover:text-sky-300 transition">
                07 • Community Patron Support
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-sky-300 transition">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Trust Policies */}
        <div className="space-y-3">
          <div className="text-white font-bold tracking-wider uppercase text-xs">LEGAL & POLICIES</div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/privacy" className="hover:text-sky-300 transition">
                Privacy Policy (DPDP Act)
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-sky-300 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-sky-300 transition">
                Donation & Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-sky-300 transition">
                Grievance Redressal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>© 2025–2026 QUANTUM (transformationyourself.in). ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-1.5">
          <span>BUILT FOR PURPOSEFUL PERSONAL DISCIPLINE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
