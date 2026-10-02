"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 py-4",
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-sky-400/40 bg-slate-950/60 p-0.5 flex items-center justify-center text-sky-400 group-hover:scale-105 group-hover:border-sky-300 transition shadow-[0_0_15px_rgba(56,189,248,0.25)] shrink-0">
            <Image
              src="/assets/images/logo/logo.png"
              alt="Quantum Logo"
              width={34}
              height={34}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-extrabold text-lg sm:text-xl tracking-widest text-white leading-none">
              QUANTUM
            </span>
            <span className="text-[10px] font-mono tracking-widest text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-400/20 leading-none">
              WINTER ARC
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300">
          <Link href="/#about" className="hover:text-sky-300 transition text-sky-400 font-bold">
            ABOUT
          </Link>
          <Link href="/#what-is-quantum" className="hover:text-sky-300 transition">
            01 • SYSTEM
          </Link>
          <Link href="/#winter-arc" className="hover:text-sky-300 transition">
            02 • 90-DAY ARC
          </Link>
          <Link href="/#transformation" className="hover:text-sky-300 transition">
            03 • TRANSFORMATION
          </Link>
          <Link href="/#reviews" className="hover:text-sky-300 transition">
            04 • REVIEWS
          </Link>
          <Link href="/#proof-feed" className="hover:text-cyan-300 transition text-cyan-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>05 • PROOFS</span>
          </Link>
          <Link href="/#mobile" className="hover:text-sky-300 transition">
            06 • MOBILE
          </Link>
          <Link href="/#donate" className="hover:text-sky-300 transition">
            07 • SUPPORT
          </Link>
          <Link href="/#faq" className="hover:text-sky-300 transition">
            08 • FAQ
          </Link>
        </div>

        {/* Auth CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300 hover:text-white">
              LOGIN
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="quantum" size="sm" className="font-mono text-xs gap-1.5 shadow-md">
              <span>START ARC</span>
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-5 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col gap-4 font-mono text-sm">
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sky-400 font-bold hover:text-white py-1"
          >
            00 • ABOUT QUANTUM
          </Link>
          <Link
            href="/#what-is-quantum"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            01 • WHAT IS QUANTUM
          </Link>
          <Link
            href="#winter-arc"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            02 • 90-DAY WINTER ARC
          </Link>
          <Link
            href="#transformation"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            03 • TRANSFORMATION
          </Link>
          <Link
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            04 • COMMUNITY REVIEWS
          </Link>
          <Link
            href="#proof-feed"
            onClick={() => setMobileMenuOpen(false)}
            className="text-cyan-400 font-bold hover:text-cyan-300 py-1 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>05 • LIVE PROOFS FEED</span>
          </Link>
          <Link
            href="#mobile"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            06 • QUANTUM MOBILE
          </Link>
          <Link
            href="#donate"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            06 • SUPPORT
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-300 py-1"
          >
            07 • FAQ
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs">
                LOGIN
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="quantum" className="w-full text-xs">
                START YOUR JOURNEY
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
