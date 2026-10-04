"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Zap,
  Flame,
  Trophy,
  ArrowRight,
  Brain,
  CheckCircle2,
  Calendar as CalendarIcon,
  Smartphone,
  QrCode,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
  Activity,
  Heart,
  Star,
  Lock,
  Volume2,
  X,
  MessageSquare,
  Clock,
  User as UserIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DancingLetters from "@/components/ui/dancing-letters";
import MorphingText from "@/components/ui/morphing-text";
import ImageComparison from "@/components/ui/image-comparison";
import AwardBadge from "@/components/ui/award-badge";
import FloatingPaths from "@/components/ui/floating-paths";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import TubesCursor from "@/components/ui/tubes-cursor";
import QuantumTiltCard from "@/components/ui/quantum-tilt-card";
import QuantumMobileExperience from "@/components/landing/quantum-mobile-experience";
import ExperiencesReviewSection from "@/components/landing/experiences-review-section";
import { LiveProofFeedSection } from "@/components/landing/live-proof-feed-section";
import AboutSection from "@/components/landing/about-section";
import QuantumTypographyVideoSection from "@/components/landing/quantum-typography-video-section";
import QuantumWelcomeVideoSection from "@/components/landing/quantum-welcome-video-section";
import WinterArcDayCounter from "@/components/landing/winter-arc-day-counter";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  // Cursor parallax state for hero background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [liveTelemetry, setLiveTelemetry] = useState<{ liveNow: number; totalChallengers: number }>({
    liveNow: 1,
    totalChallengers: 1,
  });

  // Fetch real-time live telemetry
  useEffect(() => {
    fetch("/api/telemetry/live")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.liveNow === "number" && typeof data.totalChallengers === "number") {
          setLiveTelemetry({
            liveNow: data.liveNow,
            totalChallengers: data.totalChallengers,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden">
      {/* 3D TubesCursor Interactive Color-Emitting Background Canvas across the entire page */}
      <TubesCursor fullPage />

      {/* Atmospheric frosted depth blur masks: content below viewport appears blurry before entering */}
      <div className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-30 backdrop-blur-md [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
      <div className="fixed top-0 left-0 right-0 h-16 pointer-events-none z-30 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black_20%,transparent)]" />

      <LandingNavbar />

      {/* ============================================================
          01 — HERO SECTION
          ============================================================ */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        {/* Subtle obsidian vignettes for typography clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/40 via-transparent to-transparent pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-transparent to-[#030712]/40 pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center space-y-8">
          {/* Badge & Live Telemetry Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.25)]">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>WINTER ARC PROTOCOL • 90 CONSECUTIVE DAYS</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{liveTelemetry.totalChallengers.toLocaleString()} CHALLENGERS</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-bold">{liveTelemetry.liveNow} ONLINE LIVE NOW</span>
            </div>
          </div>

          {/* Dynamic Quantum Title with 3D DancingLetters physics */}
          <div className="w-full py-2">
            <DancingLetters
              text="QUANTUM"
              className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-widest"
              letterClassName="text-white drop-shadow-[0_0_35px_rgba(56,189,248,0.6)]"
            />
          </div>

          {/* Morphing Subtitle */}
          <div className="w-full">
            <MorphingText
              texts={[
                "WINTER ARC",
                "90-DAY TRANSFORMATION",
                "COMPOUND DISCIPLINE",
                "QUANTUM OPERATING SYSTEM",
              ]}
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold"
            />
          </div>

          <p className="max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal px-4">
            The definitive personal transformation architecture. Execute your 90-day habit matrix, earn verifiable XP, decompose complex skills, and build unwavering mental armour alongside fellow challengers.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <LiquidButton size="xl" className="shadow-2xl">
                <span>START YOUR JOURNEY</span>
                <ArrowRight size={18} className="text-sky-300 ml-1" />
              </LiquidButton>
            </Link>

            <Link href="/login">
              <Button variant="outline" size="lg" className="font-mono text-xs border-slate-700 bg-slate-950/60 hover:bg-slate-900">
                CHALLENGER LOGIN
              </Button>
            </Link>
          </div>

          {/* Award Badge integration with 3D tilt */}
          <div className="pt-6">
            <QuantumTiltCard maxTilt={5} liftDistance={6} className="p-3 inline-block">
              <AwardBadge type="winter-arc-first" place={1} />
            </QuantumTiltCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 font-mono text-[10px] text-slate-500">
          <span>SCROLL DOWN</span>
          <ChevronDown size={14} className="animate-bounce text-sky-400" />
        </div>
      </section>

      {/* ============================================================
          01.5 — QUANTUM TYPOGRAPHY SPECIFICATION VIDEO SECTION
          ============================================================ */}
      <QuantumTypographyVideoSection />

      {/* ============================================================
          02 — WHAT IS QUANTUM?
          ============================================================ */}
      <section id="what-is-quantum" className="py-28 px-6 relative border-t border-slate-900/60 bg-transparent">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono text-sky-400 tracking-[0.3em] uppercase">
              01 — The Operating Philosophy
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              WHAT IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">QUANTUM</span>?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Traditional habit trackers fail because they treat transformation as passive checkboxes. Quantum is a complete behavioral command center that converts daily discipline into measurable, gamified progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuantumTiltCard className="p-8 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">90-Day Habit Matrix</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Day 01 to Day 90 horizontal matrix. Visualizing full-spectrum consistency across every habit with single-click completion and double-click audit controls.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-8 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Quantum Core AI</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Context-grounded strategic intelligence. Decomposes large goals into micro-tasks, provides instant study schedules, and analyzes consistency bottlenecks.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-8 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                <Trophy size={24} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Real XP & Leaderboard</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Zero fake vanity counters. Earn authentic XP stored in immutable database transactions for every completed habit and verified skill micro-task.
              </p>
            </QuantumTiltCard>
          </div>
        </div>
      </section>

      {/* ============================================================
          02.5 — WELCOME TO QUANTUM: THE TRANSFORMATION ENGINE VIDEO
          ============================================================ */}
      <QuantumWelcomeVideoSection />

      {/* ============================================================
          03 — WINTER ARC
          ============================================================ */}
      <section id="winter-arc" className="py-28 px-6 relative border-t border-slate-900/60 bg-transparent">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-mono text-sky-400 tracking-[0.3em] uppercase">
                02 — The 90-Day Challenge
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                THE WINTER ARC PROTOCOL
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                90 consecutive days when the world slows down, distractions disappear, and you enter intense, silent execution. By the time spring arrives, you emerge unrecognisable.
              </p>
            </div>

            <QuantumTiltCard maxTilt={4} liftDistance={5} className="px-5 py-3 shrink-0">
              <div className="flex items-center gap-4 font-mono text-xs text-sky-300">
                <Flame size={20} className="text-sky-400" />
                <div>
                  <div className="font-bold">UNBROKEN FOCUS</div>
                  <div className="text-[10px] text-slate-400">90 DAYS • 2,160 HOURS</div>
                </div>
              </div>
            </QuantumTiltCard>
          </div>

          {/* Arc Progression Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
            {[
              {
                phase: "PHASE 01",
                days: "DAYS 01 – 20",
                title: "Dopamine Detox & Shock",
                desc: "Strip away digital static, fix sleep schedules, eliminate non-negotiable vices. The brain adapts to friction.",
              },
              {
                phase: "PHASE 02",
                days: "DAYS 21 – 50",
                title: "The Silent Compounding",
                desc: "The initial excitement fades; raw discipline takes over. Habit Matrix completion rates must not dip below 85%.",
              },
              {
                phase: "PHASE 03",
                days: "DAYS 51 – 75",
                title: "Skill & Physical Apex",
                desc: "Skills decompose into advanced mastery. Noticeable physical recomposition and immense mental clarity emerge.",
              },
              {
                phase: "PHASE 04",
                days: "DAYS 76 – 90",
                title: "Permanent Ascendance",
                desc: "The final 14-day sprint. Culminates in the issuance of your verified Winter Arc Completion Certificate.",
              },
            ].map((p, i) => (
              <QuantumTiltCard
                key={i}
                className="p-6 space-y-3"
              >
                <div className="flex justify-between items-center text-xs text-sky-400">
                  <span className="font-bold">{p.phase}</span>
                  <span className="text-[10px] text-slate-500">{p.days}</span>
                </div>
                <h4 className="text-base font-bold text-white font-sans">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.desc}</p>
              </QuantumTiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          04 — TRANSFORMATION SECTION
          ============================================================ */}
      <section id="transformation" className="py-24 px-6 relative border-t border-slate-900/60 bg-transparent">
        {/* Subtle radial ambient blue lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
              <Activity size={12} className="text-sky-400" />
              03 — Visual Proof Story
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              VISUAL ARC TRANSFORMATION
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Real results require relentless daily consistency. Inspect the documented 90-day physical transformation journey of Amit under the Quantum Winter Arc regimen.
            </p>
          </div>

          {/* Side-by-Side: Compact Fitted Image Frame (Left) + 4.5 Rating, Live Status & Days Left (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT: Compact Fitted Before/After Frame */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <QuantumTiltCard
                maxTilt={4}
                liftDistance={6}
                className="p-3 w-full max-w-[340px] sm:max-w-[370px] border-sky-500/30 shadow-[0_0_40px_rgba(56,189,248,0.16)] flex flex-col justify-between"
              >
                {/* Top Tactical Metadata Bar */}
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800/80 font-mono text-[10px] text-slate-400 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-200 font-bold">VERIFIED LOG</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sky-400">AMIT</span>
                  </div>
                  <div className="text-slate-400 text-[9px] tracking-wider">
                    88/90 DAYS [97.8%]
                  </div>
                </div>

                {/* Interactive Drag Comparison Slider - Exact 1086:1448 Fitted Frame */}
                <div className="w-full flex justify-center overflow-hidden rounded-xl bg-black">
                  <ImageComparison
                    beforeImage="/assets/images/transformation_before.png"
                    afterImage="/assets/images/transformation_after.png"
                    altBefore="Amit Day 01 Starting Physique (Skinny)"
                    altAfter="Amit After 90 Days (Muscular Transformation)"
                    labelBefore="DAY 01 • 61 KG"
                    labelAfter="DAY 90 • 74 KG"
                    className="w-full"
                  />
                </div>

                {/* Bottom Technical Metadata Bar */}
                <div className="flex items-center justify-between px-2 py-1.5 border-t border-slate-800/80 font-mono text-[9px] text-slate-400 mt-2.5">
                  <span className="text-slate-400">
                    CALISTHENICS & HYPERTROPHY
                  </span>
                  <span className="text-sky-400 font-bold">
                    WINTER ARC APEX
                  </span>
                </div>
              </QuantumTiltCard>
            </div>

            {/* RIGHT: Real-Time Winter Arc Day Counter & Protocol Status */}
            <div className="lg:col-span-7 w-full flex flex-col justify-center">
              <QuantumTiltCard
                maxTilt={4}
                liftDistance={6}
                className="p-6 sm:p-8 space-y-6 border-sky-500/30 shadow-[0_0_40px_rgba(56,189,248,0.15)] flex flex-col justify-between"
              >
                {/* 1. Winter Arc is Live Indicator Banner */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-sky-950/30 to-slate-900/60 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-emerald-300 tracking-wider">
                      WINTER ARC IS LIVE
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-500/30 font-bold tracking-widest">
                    ACTIVE PROTOCOL COHORT
                  </div>
                </div>

                {/* 2. Real-Time Winter Arc Day Counter */}
                <WinterArcDayCounter />

                {/* 3. Direct Action Link */}
                <div className="pt-1 flex items-center gap-3">
                  <Link href="/signup" className="w-full">
                    <LiquidButton size="lg" className="w-full shadow-xl">
                      <span>LOCK INTO THE WINTER ARC</span>
                      <ArrowRight size={16} className="text-sky-300 ml-1.5" />
                    </LiquidButton>
                  </Link>
                </div>
              </QuantumTiltCard>
            </div>
          </div>

          <div className="text-center text-[11px] font-mono text-slate-500 max-w-xl mx-auto">
            * Verified photographic evidence shared with explicit challenger consent. Progress attained through progressive calisthenics, caloric discipline, and 90 unbroken days of logged effort.
          </div>
        </div>
      </section>

      {/* ============================================================
          05 — COMMUNITY & QUANTUM VANGUARD
          ============================================================ */}
      <section className="py-24 px-6 relative border-t border-slate-900/60 bg-transparent">
        {/* Soft radial blue lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_65%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
                <Shield size={12} className="text-sky-400" />
                04 — Collective Momentum
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                THE QUANTUM VANGUARD
              </h2>
              <p className="text-slate-400 text-sm max-w-xl font-sans leading-relaxed">
                You do not execute the Arc in isolation. Challengers across software engineering, creative design, and athletic disciplines are locking in daily.
              </p>
            </div>

            {/* Tactical Community Induction Stack */}
            <QuantumTiltCard
              maxTilt={4}
              liftDistance={6}
              className="flex items-center gap-3 px-4 py-3 shadow-lg"
            >
              <div className="flex -space-x-3 shrink-0">
                {[1, 2, 3, 4].map((id) => (
                  <div
                    key={id}
                    className="relative w-10 h-10 rounded-full border-2 border-sky-400/50 overflow-hidden shrink-0 aspect-square shadow-[0_0_10px_rgba(56,189,248,0.3)] bg-slate-900"
                  >
                    <Image
                      src="/assets/images/avatars/default_avatar.svg"
                      alt={`Challenger ${id}`}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover object-center p-1"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs font-mono">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE PROTOCOL SQUAD
                </div>
                <div className="text-[10px] text-sky-400">VERIFIED DISCIPLINE COHORT</div>
              </div>
            </QuantumTiltCard>
          </div>

          {/* Connected Command Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <QuantumTiltCard className="p-6 space-y-2 group">
              <div className="text-[10px] text-sky-400 tracking-widest uppercase font-bold">PARAM 01 • DURATION</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-white group-hover:text-sky-300 transition-colors">90</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wide">PROTOCOL DAYS</div>
              <div className="text-[10px] text-slate-500 font-sans">Continuous Winter Arc horizon without restart buffers.</div>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-6 space-y-2 group">
              <div className="text-[10px] text-cyan-400 tracking-widest uppercase font-bold">PARAM 02 • TARGET XP</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-cyan-300 group-hover:text-cyan-200 transition-colors">10,000</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wide">TARGET ARC XP</div>
              <div className="text-[10px] text-slate-500 font-sans">Attained purely through authenticated habits & skill tasks.</div>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-6 space-y-2 group">
              <div className="text-[10px] text-sky-400 tracking-widest uppercase font-bold">PARAM 03 • INTEGRITY</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-white group-hover:text-sky-300 transition-colors">100%</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wide">RELATIONAL STORAGE</div>
              <div className="text-[10px] text-slate-500 font-sans">Immutable database persistence. Zero loss of progress logs.</div>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-6 space-y-2 group">
              <div className="text-[10px] text-sky-400 tracking-widest uppercase font-bold">PARAM 04 • VANITY</div>
              <div className="text-3xl sm:text-5xl font-extrabold text-sky-400 group-hover:text-sky-300 transition-colors">0.0</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wide">VANITY TOLERANCE</div>
              <div className="text-[10px] text-slate-500 font-sans">Zero synthetic score inflation. Only real effort is credited.</div>
            </QuantumTiltCard>
          </div>
        </div>
      </section>

      {/* ============================================================
          06 — REVIEWS & EXPERIENCES INTERACTIVE SECTION
          ============================================================ */}
      <ExperiencesReviewSection />

      {/* ============================================================
          06.5 — LIVE VISUAL PROOFS FEED (PUBLIC ONLY)
          ============================================================ */}
      <LiveProofFeedSection />

      {/* ============================================================
          07 — FEATURES / TACTICAL MODULES
          ============================================================ */}
      <section id="features" className="py-24 px-6 relative border-t border-slate-900/60 bg-transparent">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
              <Layers size={12} className="text-sky-400" />
              06 — Tactical Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              CORE SYSTEM MODULES
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Every interface element is purpose-built to accelerate your transformation and maintain bulletproof accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuantumTiltCard className="p-7 space-y-3">
              <div className="font-mono text-sky-400 text-xs font-bold">01 • HABIT MATRIX</div>
              <h3 className="text-lg font-bold text-white">90-Day Full Spectrum Grid</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Never lose context of your arc. Watch your checkmarks compound from Day 01 through Day 90 without fragmented pages.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-7 space-y-3">
              <div className="font-mono text-sky-400 text-xs font-bold">02 • SKILL DECOMPOSER</div>
              <h3 className="text-lg font-bold text-white">Micro-Task Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Break daunting objectives like Blender, full-stack coding, or calisthenics into tiny bite-sized tasks rewarding real XP.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-7 space-y-3">
              <div className="font-mono text-sky-400 text-xs font-bold">03 • PROOF GALLERY</div>
              <h3 className="text-lg font-bold text-white">Photographic Proof Logs</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Upload daily photographic proof of your workouts, workspace, and projects. Verifiable proof eliminates self-deception.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-7 space-y-3">
              <div className="font-mono text-sky-400 text-xs font-bold">04 • 3D WALL CALENDAR</div>
              <h3 className="text-lg font-bold text-white">Perspective Timeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Interactive spatial wall calendar that responds to mouse tilt and scroll wheel, giving milestones tactile presence.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-7 space-y-3">
              <div className="font-mono text-sky-400 text-xs font-bold">05 • QUANTUM CORE AI</div>
              <h3 className="text-lg font-bold text-white">Tactical Arc Coach</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                AI layer equipped with &quot;Think&quot; and &quot;Deep Search&quot; capabilities to reconstruct schedules and rescue broken streaks.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-7 space-y-3">
              <div className="font-mono text-sky-400 text-xs font-bold">06 • INDUCTION CERTIFICATE</div>
              <h3 className="text-lg font-bold text-white">Official Protocol Pledge</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Generates a printable, high-resolution vector certificate cementing your 90-day pledge with serial numbers and stamps.
              </p>
            </QuantumTiltCard>
          </div>
        </div>
      </section>

      {/* ============================================================
          08 — QUANTUM MOBILE: COMPLETE MOBILE EXPERIENCE SHOWCASE
          ============================================================ */}
      <QuantumMobileExperience />



      {/* ============================================================
          10 — FREQUENTLY ASKED QUESTIONS
          ============================================================ */}
      <section id="faq" className="py-24 px-6 relative border-t border-slate-900/60 bg-transparent">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
              08 — Tactical Inquiries
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What exactly is the Winter Arc 90-day challenge?",
                a: "The Winter Arc is a rigorous 90-day transformation challenge during the final quarter/winter months. Challengers eliminate distractions, lock into non-negotiable daily habits (fitness, deep study, mental clarity), and build immutable personal momentum.",
              },
              {
                q: "How does the 90-Day Habit Matrix work?",
                a: "Each habit you define has 90 individual day boxes (Day 01 → Day 90). Clicking a day marks it Completed (✓) and grants +50 XP. Double-clicking marks it Missed (✕). You can scroll horizontally to inspect your full arc trajectory anytime.",
              },
              {
                q: "Is Quantum completely free?",
                a: "Yes. All core systems—the Habit Matrix, XP Engine, Skills Decomposer, Proof Gallery, Calendar, and Quantum Core AI—are free to use without paywalls.",
              },
              {
                q: "What is the Commitment Certificate?",
                a: "Immediately following onboarding, the system generates an official high-resolution, serial-stamped Winter Arc Commitment Certificate that you can download, print, and hang above your workstation.",
              },
              {
                q: "How does the leaderboard ranking work?",
                a: "The leaderboard ranks users on real verified XP and streak milestones stored in the database. There are no fabricated participants.",
              },
            ].map((faq, i) => (
              <QuantumTiltCard
                key={i}
                maxTilt={3}
                liftDistance={4}
                className="p-5"
              >
                <details className="group">
                  <summary className="font-bold text-white text-sm sm:text-base cursor-pointer list-none flex justify-between items-center select-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="size-4 text-sky-400 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans border-t border-slate-900 pt-3">
                    {faq.a}
                  </p>
                </details>
              </QuantumTiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          11 — PROTOCOL GENESIS
          ============================================================ */}
      <section className="py-20 px-6 relative border-t border-slate-900/60 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <QuantumTiltCard maxTilt={3} liftDistance={6} className="p-8 sm:p-12 space-y-6 text-center font-mono">
            <div className="text-xs text-sky-400 tracking-[0.3em] uppercase">
              09 — The Protocol Genesis
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              ENGINEERED FOR THE UNCOMPROMISING
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Quantum was built out of necessity. In an era of infinite distraction and cheap dopamine, the Winter Arc is a line drawn in the sand. 90 days of deliberate focus, relentless physical and mental exertion, and scientific accountability.
            </p>
            <div className="w-16 h-px bg-sky-500/40 mx-auto" />
            <div className="text-xs text-slate-500 tracking-widest">
              ONE SYSTEM • 90 DAYS • UNBROKEN ARC
            </div>
          </QuantumTiltCard>
        </div>
      </section>

      {/* ============================================================
          12 — FINAL CTA (CINEMATIC CONCLUSION)
          ============================================================ */}
      <section className="py-28 px-6 relative border-t border-slate-900/60 bg-gradient-to-b from-transparent via-[#02050e]/60 to-[#010308]/90 text-center overflow-hidden">
        {/* Soft radial blue spotlight behind shield */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <QuantumTiltCard maxTilt={4} liftDistance={8} className="p-8 sm:p-12 space-y-8">
            <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-400/40 mx-auto flex items-center justify-center p-3 text-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.4)] overflow-hidden">
              <Image
                src="/logo.png"
                alt="Quantum App Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                YOUR WINTER ARC AWAITS.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed max-w-xl mx-auto">
                Do not let another year slip away in comfortable hesitation. Enter the Quantum portal, pledge your 90 days, and claim your transformation.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/signup">
                <LiquidButton size="xxl" className="shadow-2xl">
                  <span>COMMENCE 90-DAY INDUCTION</span>
                  <ArrowRight size={20} className="text-sky-300 ml-1" />
                </LiquidButton>
              </Link>

              <Link href="/login">
                <Button variant="outline" size="lg" className="font-mono text-xs border-slate-800 bg-slate-950/70 hover:bg-slate-900 text-slate-300">
                  CHALLENGER LOGIN
                </Button>
              </Link>
            </div>
          </QuantumTiltCard>
        </div>
      </section>



      <LandingFooter />
    </div>
  );
}
