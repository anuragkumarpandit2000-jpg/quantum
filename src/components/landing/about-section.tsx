"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Brain,
  Calendar,
  BarChart3,
  Zap,
  Trophy,
  Camera,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Flame,
  Sparkles,
  Award,
  Compass,
  Check,
  ChevronRight,
  ExternalLink,
  Heart,
} from "lucide-react";
import QuantumTiltCard from "@/components/ui/quantum-tilt-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QuantumSupportCard from "@/components/donations/quantum-support-card";

// 6-step Pipeline
const PIPELINE_STEPS = [
  {
    step: "01",
    label: "INTENTION",
    desc: "Declare your non-negotiable target and prime your mindset.",
    icon: Compass,
    color: "from-sky-400 to-blue-500",
  },
  {
    step: "02",
    label: "PLAN",
    desc: "Quantum AI decomposes ambitious goals into high-impact daily missions.",
    icon: Target,
    color: "from-blue-500 to-indigo-500",
  },
  {
    step: "03",
    label: "ACTION",
    desc: "Execute daily non-negotiable habits and deep work blocks.",
    icon: Zap,
    color: "from-indigo-400 to-cyan-400",
  },
  {
    step: "04",
    label: "PROOF",
    desc: "Photograph and document raw evidence of your completed work.",
    icon: Camera,
    color: "from-cyan-400 to-teal-400",
  },
  {
    step: "05",
    label: "PROGRESS",
    desc: "Earn XP, safeguard streaks, and track tangible metric compounding.",
    icon: BarChart3,
    color: "from-teal-400 to-emerald-400",
  },
  {
    step: "06",
    label: "TRANSFORMATION",
    desc: "Complete 90 days to redefine your identity, discipline, and output.",
    icon: Award,
    color: "from-emerald-400 to-sky-400",
  },
];

// 9 System Pillars
const SYSTEM_PILLARS = [
  {
    id: "goals",
    title: "GOALS",
    tagline: "Define what actually matters to you.",
    description:
      "Cut through the noise. Specify your primary and secondary targets with ruthless clarity so every day has singular purpose.",
    icon: Target,
    badge: "PRECISION",
    metric: "1 Primary + 1 Secondary",
  },
  {
    id: "ai",
    title: "QUANTUM AI",
    tagline: "Personalized planning, guidance and accountability.",
    description:
      "Your dedicated AI co-pilot operates 24/7. It tracks your velocity, nudges you when consistency drops, and answers queries in real time.",
    icon: Brain,
    badge: "24/7 COPILOT",
    metric: "Context-Aware Intel",
  },
  {
    id: "habits",
    title: "HABITS",
    tagline: "Build your daily system and maintain consistency.",
    description:
      "A rigorous habit tracker with binary accountability. Every checkmark builds your 90-day trajectory and rewards immediate XP.",
    icon: Calendar,
    badge: "RITUALS",
    metric: "Zero Excuses Protocol",
  },
  {
    id: "analytics",
    title: "ANALYTICS",
    tagline: "Understand your consistency, progress and performance.",
    description:
      "Real-time visual telemetry tracks streak health, XP growth, completion curves, and missed days. See exactly where you stand.",
    icon: BarChart3,
    badge: "TELEMETRY",
    metric: "Live Diagnostics",
  },
  {
    id: "xp",
    title: "XP SYSTEM",
    tagline: "Turn completed actions into measurable progress.",
    description:
      "Every task, habit, and uploaded proof generates XP. Progress through tiered ranks from Initiate to Quantum Sovereign.",
    icon: Zap,
    badge: "GAMIFICATION",
    metric: "+40 to +250 XP / Action",
  },
  {
    id: "competition",
    title: "COMPETITION",
    tagline: "See where you stand among other participants.",
    description:
      "Compare your consistency and XP velocity against global Arc participants on live, unmanipulated leaderboards.",
    icon: Trophy,
    badge: "LEADERBOARD",
    metric: "Global Rank Tracking",
  },
  {
    id: "proof",
    title: "PROOF",
    tagline: "Document your journey.",
    description:
      "Upload photographic evidence of daily physical and intellectual labor. Curate an undeniable 90-day visual testament.",
    icon: Camera,
    badge: "VERIFICATION",
    metric: "90 Days of Evidence",
  },
  {
    id: "skills",
    title: "SKILLS",
    tagline: "Break ambitious skills into micro-goals.",
    description:
      "Select high-value disciplines (Engineering, Blender 3D, Fitness, Languages) and master them through structured sub-milestones.",
    icon: BookOpen,
    badge: "CAPABILITIES",
    metric: "Multi-Tier Curriculums",
  },
  {
    id: "community",
    title: "COMMUNITY",
    tagline: "Improve alongside other participants.",
    description:
      "You are not running the Arc alone. Benchmark against serious individuals striving for peak discipline and mutual elevation.",
    icon: Users,
    badge: "COHORT",
    metric: "Active Arc Operatives",
  },
];

// Timeline Stages
const TIMELINE_STAGES = [
  {
    day: "DAY 01",
    phase: "FOUNDATION",
    subtitle: "The Sacred Contract",
    description:
      "Set your non-negotiables. Sign your official A4 Commitment Contract with ink or digital stamp. The baseline is cemented.",
    accent: "text-sky-400 border-sky-400/40 bg-sky-500/10",
  },
  {
    day: "DAY 30",
    phase: "DISCIPLINE",
    subtitle: "Overcoming Friction",
    description:
      "The initial burst of motivation fades; pure discipline takes over. Habit loops lock into muscle memory and resistance diminishes.",
    accent: "text-cyan-400 border-cyan-400/40 bg-cyan-500/10",
  },
  {
    day: "DAY 60",
    phase: "TRANSFORMATION",
    subtitle: "Compounded Velocity",
    description:
      "Momentum turns into an exponential flywheel. Physical, mental, and cognitive outputs reach unprecedented levels of focus.",
    accent: "text-indigo-400 border-indigo-400/40 bg-indigo-500/10",
  },
  {
    day: "DAY 90",
    phase: "COMPLETION",
    subtitle: "The Proof of Identity",
    description:
      "90/90 completed. The celebration sequence activates and your official, tamper-proof QUANTUM Certificate of Completion is awarded.",
    accent: "text-emerald-400 border-emerald-400/40 bg-emerald-500/10",
  },
];

// Execution steps
const EXECUTION_STEPS = [
  { num: "01", text: "KNOW WHAT TO DO" },
  { num: "02", text: "DO IT" },
  { num: "03", text: "TRACK IT" },
  { num: "04", text: "IMPROVE IT" },
  { num: "05", text: "BECOME THE PERSON WHO CAN" },
];

interface AboutSectionProps {
  showHero?: boolean;
  showCta?: boolean;
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  showHero = true,
  showCta = true,
  className,
}) => {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  return (
    <div className={cn("space-y-24", className)}>
      {/* ================================================================= */}
      {/* 1. ABOUT HERO                                                     */}
      {/* ================================================================= */}
      {showHero && (
        <section className="relative text-center max-w-5xl mx-auto pt-6 pb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-xs tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            ABOUT QUANTUM
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            YOU DON'T NEED ANOTHER{" "}
            <span className="text-slate-400 font-medium">PRODUCTIVITY APP.</span>
          </h2>

          <div className="mt-4 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
            YOU NEED A SYSTEM THAT MAKES YOU SHOW UP.
          </div>

          <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            QUANTUM is a personal transformation platform designed to turn vague
            aspirations into measurable, undeniable action. No fake streaks. No
            meaningless checkboxes. Just structured discipline, proof, and execution.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-5 rounded-xl text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all flex items-center gap-2">
              <Link href="/about">
                <span>VIEW FULL ABOUT SPECIFICATION</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* 2. CORE IDEA — FROM INTENTION -> ACTION -> PROOF                  */}
      {/* ================================================================= */}
      <section id="core-idea" className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
            THE ENGINE OF TRANSFORMATION
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            FROM INTENTION → ACTION → PROOF
          </h3>
          <div className="mt-5 text-slate-300 text-sm sm:text-base leading-relaxed space-y-1.5 font-sans">
            <p>Tell QUANTUM what you want to achieve.</p>
            <p className="text-sky-300/90 font-mono text-xs sm:text-sm">
              Your goals become a structured plan. <br />
              Your plan becomes daily habits and tasks. <br />
              Your actions earn XP. <br />
              Your progress becomes data. <br />
              Your data shows where you're improving — and where you're falling behind.
            </p>
          </div>
        </div>

        {/* Visual 6-step Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <QuantumTiltCard
                key={step.step}
                className="p-6 bg-slate-950/50 border-white/10 hover:border-sky-400/40 rounded-2xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-2xl font-black text-white/30 group-hover:text-sky-400/80 transition-colors">
                    {step.step}
                  </span>
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                      step.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold tracking-wide text-white group-hover:text-sky-300 transition-colors mb-1.5">
                  {step.label}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {step.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[11px] font-mono text-sky-400/70 group-hover:text-sky-400 gap-1.5 transition-colors">
                  STAGE {idx + 1} OF 6 <ArrowRight className="w-3 h-3" />
                </div>
              </QuantumTiltCard>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. THE QUANTUM SYSTEM (9 Interactive Pillars)                     */}
      {/* ================================================================= */}
      <section id="system" className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
            INTEGRATED ARCHITECTURE
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            THE QUANTUM SYSTEM
          </h3>
          <p className="mt-3 text-slate-400 text-sm">
            Nine interconnected modules engineered to convert raw ambition into unstoppable momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SYSTEM_PILLARS.map((item) => {
            const Icon = item.icon;
            const isSelected = activePillar === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActivePillar(isSelected ? null : item.id)}
                className="cursor-pointer"
              >
                <QuantumTiltCard
                  className={cn(
                    "p-6 h-full flex flex-col justify-between rounded-2xl transition-all duration-300",
                    isSelected
                      ? "border-sky-400 bg-sky-950/20 shadow-[0_0_30px_rgba(56,189,248,0.25)]"
                      : "border-white/10 hover:border-sky-500/30 bg-slate-950/40"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      {item.title}
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </h4>
                    <p className="text-[11px] font-mono text-sky-400 mb-2">
                      {item.tagline}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span>{item.metric}</span>
                    <span className="text-sky-400 hover:underline flex items-center gap-1">
                      {isSelected ? "Active" : "Inspect"}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </QuantumTiltCard>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. THE 90-DAY ARC                                                 */}
      {/* ================================================================= */}
      <section className="relative max-w-7xl mx-auto">
        <div className="relative rounded-3xl border border-sky-500/20 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 p-6 sm:p-12 overflow-hidden backdrop-blur-xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-400 uppercase px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              THE TRANSFORMATION JOURNEY
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              THE 90-DAY ARC
            </h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              QUANTUM's first transformation experience is the 90-Day Winter Arc.
              For 90 days, you commit to showing up. Not perfectly.{" "}
              <span className="text-sky-400 font-bold tracking-wider">CONSISTENTLY.</span>
            </p>
          </div>

          {/* Timeline Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {TIMELINE_STAGES.map((stage, idx) => (
              <div
                key={stage.day}
                className="relative p-5 rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md flex flex-col justify-between hover:border-sky-400/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border", stage.accent)}>
                      {stage.day}
                    </span>
                    <span className="font-mono text-xs text-white/30">0{idx + 1}/04</span>
                  </div>
                  <h4 className="text-base font-black tracking-wider text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {stage.phase}
                  </h4>
                  <div className="text-[11px] font-mono text-sky-400/80 mb-2">
                    {stage.subtitle}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-sky-400/70" />
                  <span>Non-Negotiable Threshold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. WHY QUANTUM EXISTS — IT'S EXECUTION                            */}
      {/* ================================================================= */}
      <section className="relative max-w-5xl mx-auto text-center">
        <div className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
          THE HARD TRUTH
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
          WHY QUANTUM EXISTS
        </h3>

        <div className="text-base sm:text-xl text-slate-300 space-y-2 font-light leading-relaxed">
          <p>Most people know what they should do.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 py-3 font-mono text-xs sm:text-sm text-slate-400">
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Study.</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Exercise.</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Learn.</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Build.</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Sleep better.</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Stop wasting time.</span>
          </div>
          <p className="text-slate-400 pt-1">The problem isn't always knowledge.</p>
        </div>

        {/* Execution Callout */}
        <div className="my-10 py-8 px-6 rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-blue-950/40 to-sky-950/40 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
          <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-widest text-white drop-shadow-[0_0_35px_rgba(56,189,248,0.7)]">
            IT'S EXECUTION.
          </div>
          <p className="mt-3 text-sm sm:text-lg font-mono text-sky-300 tracking-wider">
            QUANTUM exists to close that gap.
          </p>
        </div>

        {/* Visual Sequence */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 font-mono text-xs">
          {EXECUTION_STEPS.map((item, idx) => (
            <React.Fragment key={item.num}>
              <div className="px-3 py-2 rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 flex items-center gap-2 shadow-sm">
                <span className="text-sky-400 font-bold">{item.num}</span>
                <span>{item.text}</span>
              </div>
              {idx < EXECUTION_STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-sky-400/60 hidden sm:inline" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. PHILOSOPHY & PILLARS                                           */}
      {/* ================================================================= */}
      <section className="relative max-w-5xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-12 text-center backdrop-blur-xl relative overflow-hidden">
          <div className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
            OUR DOCTRINE
          </div>

          <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            “Small actions.
            <br />
            <span className="text-sky-400">Measured progress.</span>
            <br />
            Compounded transformation.”
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/40">
              <div className="text-sky-400 font-bold text-sm mb-1">CONSISTENCY</div>
              <div className="text-[10px] text-slate-400">Showing up daily without exception.</div>
            </div>
            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/40">
              <div className="text-cyan-400 font-bold text-sm mb-1">ACCOUNTABILITY</div>
              <div className="text-[10px] text-slate-400">Photographic proof and AI oversight.</div>
            </div>
            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/40">
              <div className="text-indigo-400 font-bold text-sm mb-1">ACTION</div>
              <div className="text-[10px] text-slate-400">XP rewarded for execution, not words.</div>
            </div>
            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/40">
              <div className="text-emerald-400 font-bold text-sm mb-1">TIME</div>
              <div className="text-[10px] text-slate-400">90 days of exponential compounding.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. THE VISION                                                     */}
      {/* ================================================================= */}
      <section className="relative max-w-4xl mx-auto text-center">
        <div className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
          HORIZON
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          THE VISION
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
          QUANTUM starts with a 90-day challenge. But the vision is much bigger.
          We want to build a self-sustaining system where high performers continuously:
        </p>

        {/* Loop Diagram */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs mb-12">
          {["SET A GOAL", "BUILD A SYSTEM", "EXECUTE", "MEASURE", "IMPROVE", "REPEAT"].map(
            (step, i, arr) => (
              <React.Fragment key={step}>
                <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-300 font-bold">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-sky-400/50" />
                )}
              </React.Fragment>
            )
          )}
        </div>

        {/* Vision Climax */}
        <div className="space-y-2">
          <div className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            THE ARC ENDS.
          </div>
          <div className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">
            THE JOURNEY DOESN'T.
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. SUPPORT & REINFORCE THE QUANTUM PROTOCOL                       */}
      {/* ================================================================= */}
      <section id="about-support" className="relative max-w-5xl mx-auto pt-14 border-t border-slate-900/80">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
            <Heart size={12} className="text-sky-400" />
            REINFORCE THE PROTOCOL
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            SUPPORT QUANTUM
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed font-sans">
            Quantum is 100% free. If you find it useful, you can support the project. Contributions directly reinforce ongoing development, high-frequency infrastructure, and autonomous AI coaching systems.
          </p>
        </div>

        <QuantumSupportCard showPatronWall={true} />
      </section>
    </div>
  );
};

export default AboutSection;
