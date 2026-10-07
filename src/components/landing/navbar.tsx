"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X, Sparkles, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Track window scroll for subtle glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and handle Escape key when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setDrawerOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  interface NavLinkItem {
    label: string;
    href: string;
    sub: string;
    highlight?: boolean;
    live?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { label: "ABOUT", href: "/about", sub: "FULL SYSTEM SPECIFICATION", highlight: true },
    { label: "01 • SYSTEM", href: "/#what-is-quantum", sub: "OPERATING PHILOSOPHY" },
    { label: "02 • 90-DAY ARC", href: "/#winter-arc", sub: "CHALLENGE BLUEPRINT" },
    { label: "03 • BADGES", href: "/#sovereign-badges", sub: "DISCIPLINE MILESTONES" },
    { label: "04 • TRANSFORMATION", href: "/#transformation", sub: "BENCHMARK PROGRESSION" },
    { label: "05 • REVIEWS", href: "/#reviews", sub: "COMMUNITY RATINGS & FEEDBACK" },
    { label: "06 • MOBILE", href: "/#mobile", sub: "CROSS-PLATFORM COMMAND" },
    { label: "07 • SUPPORT", href: "/#about-support", sub: "COMMUNITY PATRON PORTAL" },
    { label: "08 • FAQ", href: "/#faq", sub: "FREQUENTLY ASKED QUESTIONS" },
  ];

  return (
    <>
      {/* ====================================================================
          TOP FIXED NAVBAR (Minimal & Clean: Logo + 3-Line Hamburger Menu)
          ==================================================================== */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 py-3.5",
          scrolled
            ? "bg-slate-950/85 backdrop-blur-md border-b border-sky-500/20 shadow-2xl py-3"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Logo & Nearby Minimal 3-Line Hamburger Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quantum Brand Logo */}
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="Quantum Home"
            >
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
                <span className="font-extrabold text-lg sm:text-xl tracking-widest text-white leading-none font-sans">
                  QUANTUM
                </span>
                <span className="text-[10px] font-mono tracking-widest text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-400/20 leading-none hidden xs:inline-block">
                  WINTER ARC
                </span>
              </div>
            </Link>

            {/* THREE-LINE HAMBURGER ICON (☰) NEAR LOGO */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className={cn(
                "group/menu relative flex items-center justify-center gap-2 px-3 py-2 rounded-xl",
                "border transition-all duration-200 font-mono text-xs cursor-pointer select-none",
                drawerOpen
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                  : "bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-sky-400/50 text-slate-300 hover:text-white shadow-sm"
              )}
              aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
              title="Open Navigation Menu"
            >
              {/* Animated 3-Line Hamburger Icon */}
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span
                  className={cn(
                    "w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out origin-center",
                    drawerOpen ? "rotate-45 translate-y-[7px]" : ""
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-current rounded-full transition-all duration-200 ease-out",
                    drawerOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out origin-center",
                    drawerOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  )}
                />
              </div>

              {/* Minimal Menu Label */}
              <span className="text-[11px] font-bold tracking-wider hidden sm:inline-block">
                {drawerOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>

          {/* Right: Quick Action Hub (Clean and Uncluttered) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex font-mono text-xs text-slate-300 hover:text-white"
            >
              <Link href="/login">
                LOGIN
              </Link>
            </Button>

            <Button
              asChild
              variant="quantum"
              size="sm"
              className="font-mono text-xs gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            >
              <Link href="/signup">
                <span>Start Day 1</span>
                <ArrowRight size={13} />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          QUANTUM NAVIGATION DRAWER (Full Slide-In Menu)
          ==================================================================== */}
      {/* Backdrop Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/75 backdrop-blur-md transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-full max-w-sm sm:max-w-md",
          "bg-slate-950/95 border-r border-sky-500/25 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.2)]",
          "flex flex-col justify-between transition-transform duration-300 ease-out",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Site Navigation Drawer"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-sky-400/40 bg-slate-950/60 p-0.5 flex items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
              <Image
                src="/assets/images/logo/logo.png"
                alt="Quantum Logo"
                width={30}
                height={30}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wider text-white font-sans">
                QUANTUM SYSTEM
              </div>
              <div className="text-[10px] font-mono text-sky-400">NAVIGATION MENU</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400/50 text-slate-400 hover:text-white transition"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Navigation Links */}
        <div className="p-6 space-y-2 overflow-y-auto flex-1 font-mono">
          <div className="text-[10px] text-slate-500 tracking-widest uppercase font-bold mb-3 px-2">
            SECTIONS
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                link.highlight
                  ? "bg-sky-500/10 border-sky-400/40 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400"
                  : "bg-slate-900/40 border-transparent hover:border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white"
              )}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
                  {link.live && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-sans">
                  {link.sub}
                </span>
              </div>

              <ArrowRight
                size={14}
                className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>

        {/* Drawer Footer: LOGIN & START ARC Action Buttons */}
        <div className="p-6 border-t border-white/[0.08] bg-slate-900/40 space-y-3 font-mono">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 text-xs border-slate-700 bg-slate-950/80 hover:bg-slate-900 hover:text-white"
            >
              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
              >
                LOGIN
              </Link>
            </Button>

            <Button
              asChild
              variant="quantum"
              className="flex-1 text-xs shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Link
                href="/signup"
                onClick={() => setDrawerOpen(false)}
              >
                <span>Start Day 1</span>
                <ArrowRight size={13} className="ml-1" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>92-DAY GLOBAL WINDOW</span>
            <span className="text-emerald-400 font-bold">ROLLING 90-DAY ARCS</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LandingNavbar;
