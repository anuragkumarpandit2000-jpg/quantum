import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Github, Heart } from "lucide-react";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-[#02050c] text-slate-400 py-14 px-6 font-mono text-xs select-none relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand statement */}
        <div className="space-y-4 md:col-span-2">
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
          <p className="text-slate-400 text-xs leading-relaxed max-w-md font-sans">
            A state-of-the-art operating system for rigorous self-discipline, skill acquisition, and physical transformation. Ninety consecutive days of unbroken focus.
          </p>
          <div className="text-[11px] text-slate-500">
            SYSTEM ARCHITECTURE • NEXT.JS 14 • RELATIONAL STORAGE ENGINE • MOTION PROTOCOL
          </div>
        </div>

        {/* Navigation Directives */}
        <div className="space-y-3">
          <div className="text-white font-bold tracking-wider uppercase text-xs">DIRECTIVES</div>
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
              <Link href="#winter-arc" className="hover:text-sky-300 transition">
                02 • The 90-Day Arc
              </Link>
            </li>
            <li>
              <Link href="#transformation" className="hover:text-sky-300 transition">
                03 • Proof Transformation
              </Link>
            </li>
            <li>
              <Link href="#reviews" className="hover:text-sky-300 transition">
                04 • Challenger Reviews
              </Link>
            </li>
            <li>
              <Link href="#mobile" className="hover:text-sky-300 transition">
                05 • Quantum Mobile
              </Link>
            </li>
          </ul>
        </div>

        {/* Engagement & Protocol */}
        <div className="space-y-3">
          <div className="text-white font-bold tracking-wider uppercase text-xs">ENGAGEMENT</div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/login" className="hover:text-sky-300 transition">
                Challenger Sign In
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-sky-300 transition">
                Begin Induction
              </Link>
            </li>
            <li>
              <Link href="#donate" className="hover:text-sky-300 transition">
                Support Quantum
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:text-sky-300 transition">
                Protocol FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>© 2025–2026 QUANTUM PLATFORM. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-1.5">
          <span>ENGINEERED FOR UNCOMPROMISING DISCIPLINE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
