"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Zap,
  Flame,
  Trophy,
  Brain,
  Target,
  Calendar,
  CheckCircle2,
  BarChart3,
  Users,
  Camera,
  FileCheck,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  Layers,
  Lock,
  Search,
  Filter,
  Activity,
  Check,
  ChevronRight,
  ChevronDown,
  Terminal,
} from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingFooter from "@/components/landing/footer";
import TubesCursor from "@/components/ui/tubes-cursor";
import QuantumSpecCard from "@/components/ui/quantum-spec-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Category definitions
type SpecCategory = "all" | "core" | "execution" | "progression" | "verification";

interface SpecPillar {
  id: string;
  number: string;
  category: "core" | "execution" | "progression" | "verification";
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  specs: { label: string; value: string }[];
  highlights: string[];
}

const SPEC_PILLARS: SpecPillar[] = [
  // 01. QUANTUM
  {
    id: "quantum",
    number: "SPEC // 01",
    category: "core",
    categoryLabel: "CORE ARCHITECTURE",
    title: "QUANTUM",
    subtitle: "Autonomous Personal Transformation Operating System",
    description:
      "The foundational operating system engineered to eradicate behavioral drift. Combining cognitive behavioral discipline with high-frequency telemetry, Quantum replaces fragmented note apps and static checklists with an integrated command center.",
    icon: Shield,
    accentColor: "from-sky-400 to-blue-500",
    specs: [
      { label: "Platform", value: "Cross-Platform Web App" },
      { label: "Data Persistence", value: "Relational Cloud Sync" },
      { label: "Security", value: "Encrypted Auth & Sessions" },
      { label: "Interface", value: "High-Contrast Dark Theme" },
    ],
    highlights: [
      "Fast responsive interface across desktop, tablet, and mobile",
      "Unified command center for habits, AI coaching, and proof gallery",
      "Elimination of cognitive overhead and vanity metrics",
    ],
  },

  // 02. THE SYSTEM
  {
    id: "system",
    number: "SPEC // 02",
    category: "core",
    categoryLabel: "CORE ARCHITECTURE",
    title: "THE SYSTEM",
    subtitle: "Deterministic Behavioral Habit Engine",
    description:
      "Motivation is a fleeting, volatile biological impulse. The System converts raw personal ambition into deterministic daily routines, closed feedback loops, and verifiable progression milestones that function independently of mood.",
    icon: Layers,
    accentColor: "from-cyan-400 to-blue-600",
    specs: [
      { label: "Input", value: "High-Conviction Targets" },
      { label: "Processing", value: "Matrix Scheduling Grid" },
      { label: "Feedback", value: "Dual Daily Checkpoints" },
      { label: "Output", value: "Exponential Compounding" },
    ],
    highlights: [
      "Eliminates decision fatigue through pre-scheduled routines",
      "Structured execution loops that minimize emotional friction",
      "Automated friction checks and momentum recalculation",
    ],
  },

  // 03. 90-DAY TRANSFORMATION
  {
    id: "transformation-arc",
    number: "SPEC // 03",
    category: "core",
    categoryLabel: "CORE ARCHITECTURE",
    title: "90-DAY TRANSFORMATION",
    subtitle: "The 2,160-Hour Winter Arc Metamorphosis Protocol",
    description:
      "90 consecutive days represent the exact biological and psychological horizon required to hardwire neurobiological habit loops, strip away digital static, and physically recompose mental armour. A 92-day global window (1 Oct – 31 Dec) hosts rolling 90-day personal arcs for challengers joining at any point.",
    icon: Flame,
    accentColor: "from-amber-400 to-rose-500",
    specs: [
      { label: "Total Duration", value: "90 Days (2,160 Hours)" },
      { label: "Global Window", value: "92 Days (1 Oct – 31 Dec)" },
      { label: "Day Cutoff", value: "Local Midnight (IST)" },
      { label: "Pass Threshold", value: "80% Consistency (Max 18 Misses)" },
    ],
    highlights: [
      "Phase 01: Dopamine Detox & Habit Shock (Days 01–20)",
      "Phase 02: Silent Compounding Discipline (Days 21–50)",
      "Phase 03: Physical & Skill Apex Velocity (Days 51–75)",
      "Phase 04: Permanent Identity Transformation (Days 76–90)",
    ],
  },

  // 04. GOALS
  {
    id: "goals",
    number: "SPEC // 04",
    category: "execution",
    categoryLabel: "EXECUTION PROTOCOL",
    title: "GOALS",
    subtitle: "Ruthless Objective Scoping & Target Architecture",
    description:
      "Stop setting 20 diluted new year resolutions. Quantum enforces high-conviction focus by constraining each Arc to 1 Primary North Star Directive and a maximum of 2 Secondary Supporting Pillars.",
    icon: Target,
    accentColor: "from-sky-400 to-cyan-400",
    specs: [
      { label: "Primary Quota", value: "1 Singular North Star" },
      { label: "Secondary Quota", value: "Max 2 Supporting Pillars" },
      { label: "Decomposition", value: "Micro-Milestone Engine" },
      { label: "Binding", value: "100% Habit Bound" },
    ],
    highlights: [
      "Prevents cognitive dilution by capping active directives",
      "Hierarchical alignment with daily non-negotiable habits",
      "Target progress visualization with milestone checkpoints",
    ],
  },

  // 05. HABITS
  {
    id: "habits",
    number: "SPEC // 05",
    category: "execution",
    categoryLabel: "EXECUTION PROTOCOL",
    title: "HABITS",
    subtitle: "Panoramic 90-Day Horizontal Execution Grid",
    description:
      "A high-density 90-column horizontal interactive matrix. Every single day of the challenge has its own coordinate. Double-click to audit, single-click to verify, with color-coded category vectors.",
    icon: Calendar,
    accentColor: "from-blue-400 to-indigo-500",
    specs: [
      { label: "Dimensions", value: "90 Days × N Core Habits" },
      { label: "Control", value: "Single-Click / Double-Audit" },
      { label: "State Engine", value: "Binary Verified / Missed" },
      { label: "Latency", value: "Optimistic Zero-Lag Render" },
    ],
    highlights: [
      "Horizontal matrix visualizes 90 days at a single glance",
      "Color-coded categories: Fitness, Deep Work, Mindset, Skills",
      "Audit log history preserving date, time, and verification state",
    ],
  },

  // 06. DAILY EXECUTION
  {
    id: "daily-execution",
    number: "SPEC // 06",
    category: "execution",
    categoryLabel: "EXECUTION PROTOCOL",
    title: "DAILY EXECUTION",
    subtitle: "Morning Protocol Alignment & Evening Review",
    description:
      "Every day is partitioned into two checkpoints: Morning intent alignment to set non-negotiable daily habits, and Evening Review where completed actions are logged before local midnight.",
    icon: Zap,
    accentColor: "from-cyan-400 to-emerald-400",
    specs: [
      { label: "Cadence", value: "Dual Daily Checkpoints" },
      { label: "Cutoff", value: "Local Midnight (23:59 IST)" },
      { label: "Logging", value: "Metrics, Proof, Time-Spent" },
      { label: "Lockout", value: "Daily Streak Finalization" },
    ],
    highlights: [
      "Morning intent checklist setting non-negotiable priorities",
      "Evening review measuring delta between intent and execution",
      "Automatic day closure at local midnight to maintain streak honesty",
    ],
  },

  // 07. CONSISTENCY
  {
    id: "consistency",
    number: "SPEC // 07",
    category: "execution",
    categoryLabel: "EXECUTION PROTOCOL",
    title: "CONSISTENCY",
    subtitle: "Streak Engine & 80% Completion Threshold",
    description:
      "Discipline compounds exponentially when unbroken. Quantum computes continuous streak velocity with built-in pass thresholds: 80% consistency across the 90 days (allowing up to 18 misses maximum) to earn your official certificate.",
    icon: Activity,
    accentColor: "from-amber-400 to-orange-500",
    specs: [
      { label: "Streak Engine", value: "Daily Consecutive Counter" },
      { label: "Multiplier", value: "Up to 3.0x Velocity Bonus" },
      { label: "Threshold", value: "80% Pass Rate (Max 18 Misses)" },
      { label: "Resilience", value: "Streak Recovery Mechanism" },
    ],
    highlights: [
      "Real-time streak flame counter with dynamic velocity tiers",
      "Realistic consistency buffer allowing up to 18 misses across 90 days",
      "Mathematical compounding curves displaying long-term habit gains",
    ],
  },

  // 08. XP (EXPERIENCE POINTS)
  {
    id: "xp",
    number: "SPEC // 08",
    category: "progression",
    categoryLabel: "PROGRESSION & DATA",
    title: "XP (EXPERIENCE POINTS)",
    subtitle: "Gamification & Level Progression Engine",
    description:
      "Every verified habit, skill micro-task, and community proof yields authentic Experience Points recorded in the database. Zero arbitrary progress inflation.",
    icon: Trophy,
    accentColor: "from-yellow-400 to-amber-500",
    specs: [
      { label: "Habit XP", value: "+50 XP / Habit Completed" },
      { label: "Target Arc XP", value: "10,000 XP Full Horizon" },
      { label: "Milestone XP", value: "+100 to +500 XP / Milestone" },
      { label: "Storage", value: "Relational Database Engine" },
    ],
    highlights: [
      "Level Progression: Initiate → Disciplined → Hardened → Relentless → Centurion → Conqueror",
      "Level-up celebrations with visual and sound feedback",
      "Server-validated XP balance with complete transaction logging",
    ],
  },

  // 09. ANALYTICS
  {
    id: "analytics",
    number: "SPEC // 09",
    category: "progression",
    categoryLabel: "PROGRESSION & DATA",
    title: "ANALYTICS",
    subtitle: "Velocity Telemetry, Discipline Radar & Trend Forecasting",
    description:
      "Full-spectrum telemetry analytics. Inspect weekly completion distribution, habit failure correlation matrices, peak performance temporal windows, and 90-day trajectory forecasts.",
    icon: BarChart3,
    accentColor: "from-sky-400 to-indigo-500",
    specs: [
      { label: "Rendering", value: "SVG Vector & Canvas Charts" },
      { label: "Discipline Radar", value: "5-Axis Behavioral Profile" },
      { label: "Time Horizons", value: "7D, 30D, and 90D Full Arc" },
      { label: "Export", value: "JSON / PDF Telemetry Reports" },
    ],
    highlights: [
      "Multi-axis Radar Chart: Physical, Mental, Skill, Focus, Grit",
      "Heatmaps showing exact execution density across 90 days",
      "Predictive completion probability algorithms",
    ],
  },

  // 10. LEADERBOARD
  {
    id: "leaderboard",
    number: "SPEC // 10",
    category: "progression",
    categoryLabel: "PROGRESSION & DATA",
    title: "LEADERBOARD",
    subtitle: "Real-Time Global Standing & Zero-Vanity Rankings",
    description:
      "See where your discipline ranks across the global cohort. Real challengers, real verified XP, and zero bot accounts. Standings reflect live daily execution velocity and historical streak consistency.",
    icon: Award,
    accentColor: "from-amber-300 to-yellow-500",
    specs: [
      { label: "Sync Engine", value: "Real-Time Server Polling" },
      { label: "Tiers", value: "Podium (Top 3) • Vanguard • Cohort" },
      { label: "Timeframe Filters", value: "All-Time, 30-Day, 7-Day" },
      { label: "Account Check", value: "Strict Email Verification" },
    ],
    highlights: [
      "Podium honors for Top 3 challengers with custom badges",
      "Live rank delta tracking positions gained or lost daily",
      "Private squad leaderboard views for internal competition",
    ],
  },

  // 11. COMPETITION
  {
    id: "competition",
    number: "SPEC // 11",
    category: "progression",
    categoryLabel: "PROGRESSION & DATA",
    title: "COMPETITION",
    subtitle: "Cohort Wars, Peer Accountability & Live Squad Pulse",
    description:
      "Isolation breeds complacency. Quantum cohorts pit squads of disciplined challengers against each other in synchronized 90-day challenges where collective momentum and peer honor matter.",
    icon: Users,
    accentColor: "from-indigo-400 to-purple-500",
    specs: [
      { label: "Squad Roster", value: "4 to 12 Challengers / Squad" },
      { label: "Scoring Metric", value: "Squad Average Matrix %" },
      { label: "Telemetry", value: "Real-Time Live Heartbeat" },
      { label: "Squad Logs", value: "Squad Execution Room" },
    ],
    highlights: [
      "Collective squad shields earned when all members hit 100%",
      "Real-time visual squad pulse indicating who executed today",
      "Peer review audits verifying proof validity among peers",
    ],
  },

  // 12. PROOF OF TRANSFORMATION
  {
    id: "proof",
    number: "SPEC // 12",
    category: "verification",
    categoryLabel: "VERIFICATION & AI",
    title: "PROOF OF TRANSFORMATION",
    subtitle: "Daily Photographic & Video Verification Feed",
    description:
      "Do not just claim discipline—prove it with evidence. Upload daily physical transformation photos, completed skill code/art workspaces, or workout video logs with server timestamps.",
    icon: Camera,
    accentColor: "from-cyan-400 to-teal-400",
    specs: [
      { label: "Media Engine", value: "High-Res PNG, JPG, MP4" },
      { label: "Interactive Cropper", value: "Manual Drag, Zoom & Rotate" },
      { label: "Verification", value: "Server Timestamp Stamping" },
      { label: "Visibility", value: "Public Feed / Private Archive" },
    ],
    highlights: [
      "Manual Drag & Crop tool to perfectly align profile & proof photos",
      "Side-by-side Before/After comparison slider for transformation",
      "Live Community Proof Stream with verified badge endorsements",
    ],
  },

  // 13. AI COMPANION
  {
    id: "ai-companion",
    number: "SPEC // 13",
    category: "verification",
    categoryLabel: "VERIFICATION & AI",
    title: "AI COMPANION",
    subtitle: "Quantum Core AI: Your 24/7 Strategic Transformation Co-Pilot",
    description:
      "Grounded in your real habit matrix data, streaks, and failure points. Quantum Core AI diagnoses consistency bottlenecks, generates adaptive study schedules, and provides direct accountability.",
    icon: Brain,
    accentColor: "from-sky-400 to-indigo-400",
    specs: [
      { label: "Model Engine", value: "Gemini High-Speed AI" },
      { label: "Context Window", value: "Full Habit History & Profile" },
      { label: "Response", value: "Real-Time Streaming Responses" },
      { label: "Tone", value: "Tactical, Disciplined, Direct" },
    ],
    highlights: [
      "Adaptive schedule re-planning when habits fall behind",
      "Root cause analysis identifying triggers for missed routines",
      "Dynamic briefings to initiate immediate execution",
    ],
  },

  // 14. PERSONAL COMMITMENT CONTRACT
  {
    id: "contract",
    number: "SPEC // 14",
    category: "verification",
    categoryLabel: "VERIFICATION & AI",
    title: "PERSONAL COMMITMENT CONTRACT",
    subtitle: "Digital Signature, Personal Integrity & Stakes",
    description:
      "Before initiating Day 01, every challenger signs a Digital Winter Arc Commitment Pledge. Put real stakes on the line to make personal consistency non-negotiable.",
    icon: FileCheck,
    accentColor: "from-amber-400 to-rose-500",
    specs: [
      { label: "Signature", value: "Digital Canvas Signature" },
      { label: "Stakes Protocol", value: "Social / Moral / Accountability" },
      { label: "Witness Engine", value: "Squad Co-Signers" },
      { label: "Format", value: "High-DPI Archival Certificate" },
    ],
    highlights: [
      "Personal declaration of non-negotiable intent",
      "Accountability partner notification capability",
      "Indelibly signed certificate stored in profile portfolio",
    ],
  },

  // 15. FINAL TRANSFORMATION / CHALLENGE COMPLETION
  {
    id: "completion",
    number: "SPEC // 15",
    category: "verification",
    categoryLabel: "VERIFICATION & AI",
    title: "FINAL TRANSFORMATION",
    subtitle: "90-Day Graduation, Verification & Certified Arc Badge",
    description:
      "Upon executing Day 90, the system unlocks the Final Transformation Reckoning: Side-by-side Day 1 vs Day 90 visual comparison, verified certificate of completion, and permanent placement in the Quantum Hall of Discipline.",
    icon: Award,
    accentColor: "from-emerald-400 to-sky-400",
    specs: [
      { label: "Graduation Quota", value: "90/90 Days (>=80% Pass)" },
      { label: "Certificate", value: "Verified Serial Certificate ID" },
      { label: "Honor Badge", value: "Permanent Apex Arc Medal" },
      { label: "Alumni Access", value: "Exclusive Veteran Cohorts" },
    ],
    highlights: [
      "Automated Before/After graduation comparison showcase",
      "Downloadable high-resolution Winter Arc Certificate of Completion",
      "Permanent placement in the Quantum Public Ledger of Discipline",
    ],
  },
];

export default function AboutPage() {
  const [activeCategory, setActiveCategory] = useState<SpecCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPillars = useMemo(() => {
    return SPEC_PILLARS.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.highlights.some((h) =>
          h.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col overflow-x-hidden selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* 3D TubesCursor Interactive Background Canvas */}
      <TubesCursor fullPage />

      {/* Atmospheric Frosted Lighting Vignettes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-sky-500/12 via-blue-600/4 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -left-48 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[70%] -right-48 w-96 h-96 bg-indigo-500/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Content Container */}
      <main id="main-content" className="relative z-10 flex-1 pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Navigation Breadcrumb / Return Link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-sky-300 transition-colors group px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-md hover:border-sky-400/40"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO COMMAND CENTER</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[11px] text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">OFFICIAL SPECIFICATION // 15 MODULES</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs tracking-widest uppercase backdrop-blur-md shadow-[0_0_25px_rgba(56,189,248,0.2)]">
            <Terminal size={13} className="text-sky-400" />
            <span>FULL ARCHITECTURAL SPECIFICATION MANUAL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-sans leading-none">
            THE <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]">QUANTUM</span> SYSTEM
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-sans font-normal">
            A comprehensive, rigorous breakdown of the Quantum transformation architecture. Hover and inspect each interactive specification module below to understand how raw intention is converted into undeniable physical and mental ascendance.
          </p>
        </div>

        {/* Controls Bar: Category Filters & Search */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl border border-white/[0.08] bg-slate-950/70 backdrop-blur-xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "all", label: "ALL PILLARS (15)" },
              { id: "core", label: "CORE ENGINE (3)" },
              { id: "execution", label: "DAILY CADENCE (4)" },
              { id: "progression", label: "METRICS & XP (4)" },
              { id: "verification", label: "VERIFICATION & AI (4)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as SpecCategory)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200",
                  activeCategory === cat.id
                    ? "bg-sky-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 h-9 bg-slate-900/60 border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-500 rounded-xl focus:border-sky-400/50 focus:ring-sky-400/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ============================================================
            THE 15 INTERACTIVE SPECIFICATION CARDS GRID
            Featuring 3D Cursor-Following Tilt, Elevation & Dynamic Glow
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredPillars.map((pillar) => {
            const IconComponent = pillar.icon;

            return (
              <QuantumSpecCard
                key={pillar.id}
                indexNumber={pillar.number}
                badge={pillar.categoryLabel}
                className="min-h-[460px]"
              >
                {/* Header Icon & Title */}
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:border-sky-300 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    <IconComponent size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans group-hover:text-sky-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono text-sky-400/90 font-medium mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans font-normal pt-1">
                    {pillar.description}
                  </p>
                </div>

                {/* Technical Parameters Matrix */}
                <div className="my-5 p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] font-mono text-[11px] space-y-1.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity size={10} className="text-sky-400" />
                    <span>SYSTEM PARAMETERS</span>
                  </div>
                  {pillar.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-400">
                      <span className="text-slate-500">{spec.label}:</span>
                      <span className="text-sky-300 font-semibold truncate max-w-[170px] text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Key Architectural Highlights */}
                <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                  {pillar.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                      <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </div>
                  ))}
                </div>
              </QuantumSpecCard>
            );
          })}
        </div>

        {/* If no pillars match search */}
        {filteredPillars.length === 0 && (
          <div className="py-20 text-center space-y-3 font-mono text-slate-400">
            <p className="text-sm">No specification modules match "{searchQuery}".</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-xs border-sky-500/30 text-sky-300"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* ============================================================
            SYSTEM EXECUTION PIPELINE (VISUAL WORKFLOW)
            ============================================================ */}
        <section className="mt-28 p-8 sm:p-12 rounded-3xl border border-sky-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
            <div className="text-xs font-mono text-sky-400 tracking-[0.25em] uppercase">
              WORKFLOW TOPOLOGY
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              THE EXECUTION LIFECYCLE
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              How the 15 specification modules coalesce into an unbreakable daily momentum flywheel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            {[
              {
                step: "01",
                label: "INTENTION",
                desc: "Declare North Star Goal & sign Commitment Contract.",
              },
              {
                step: "02",
                label: "MATRIX SETUP",
                desc: "Configure 90-day habits and daily verification checkpoints.",
              },
              {
                step: "03",
                label: "DAILY AUDIT",
                desc: "Execute routines, log photographic proof & earn live XP.",
              },
              {
                step: "04",
                label: "COHORT SYNC",
                desc: "Ascend global leaderboard and defend squad momentum.",
              },
              {
                step: "05",
                label: "ASCENDANCE",
                desc: "Complete Day 90, claim certificate and permanent badge.",
              },
            ].map((st, i) => (
              <div
                key={st.step}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-col justify-between space-y-2 hover:border-sky-400/40 transition-colors"
              >
                <div className="flex items-center justify-between text-sky-400 font-bold">
                  <span>PHASE {st.step}</span>
                  {i < 4 && <ChevronRight size={14} className="text-slate-600 hidden md:block" />}
                </div>
                <div className="text-white font-bold text-sm">{st.label}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed font-sans">{st.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            FINAL CHALLENGER CALL TO ACTION
            ============================================================ */}
        <section className="mt-20 text-center max-w-4xl mx-auto">
          <div className="p-8 sm:p-14 rounded-3xl border border-sky-400/40 bg-gradient-to-b from-sky-950/40 via-slate-950/80 to-slate-950 p-6 backdrop-blur-2xl shadow-[0_0_80px_rgba(56,189,248,0.25)] space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
              <Sparkles size={12} className="text-sky-400" />
              <span>THE ARCHITECTURE IS READY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              SPECIFICATIONS ARE THE MAP.
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                EXECUTION IS THE TERRITORY.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join the founding cohort locking in for their 90-day transformation. Zero cost, 100% focused discipline.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-6 rounded-xl text-base tracking-wide shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_45px_rgba(56,189,248,0.7)] transition-all flex items-center gap-2">
                <Link href="/signup">
                  <span>Start Day 1</span>
                  <ArrowRight size={18} />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-white/20 hover:border-sky-400/60 bg-slate-900/60 text-white font-mono px-8 py-6 rounded-xl text-sm tracking-wider transition-all"
              >
                <Link href="/login">
                  CHALLENGER LOGIN
                </Link>
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
