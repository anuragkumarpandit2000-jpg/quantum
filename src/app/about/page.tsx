"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import TubesCursor from "@/components/ui/tubes-cursor";
import AboutSection from "@/components/landing/about-section";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#02050f] text-slate-100 flex flex-col overflow-x-hidden selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-sky-500/15 via-blue-600/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] -left-48 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[65%] -right-48 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Interactive Tubes Cursor */}
      <TubesCursor />

      {/* Top Navigation Bar */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Full About Section */}
        <AboutSection showHero={true} showCta={true} />

        {/* Final CTA */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-24 text-center">
          <div className="p-10 sm:p-16 rounded-3xl border border-sky-500/30 bg-gradient-to-b from-sky-950/30 to-slate-950/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.2)]">
            <div className="font-mono text-sm tracking-widest text-sky-400 font-bold uppercase mb-4">
              QUANTUM
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              90 DAYS IS THE START.
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                YOUR POTENTIAL IS THE DESTINATION.
              </span>
            </h2>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-6 rounded-xl text-base tracking-wide shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_45px_rgba(56,189,248,0.7)] transition-all flex items-center gap-2">
                  START YOUR ARC
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={scrollToTop}
                className="border-white/15 hover:border-sky-400/50 bg-slate-900/60 text-white font-mono px-8 py-6 rounded-xl text-base tracking-wider transition-all"
              >
                EXPLORE QUANTUM
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
