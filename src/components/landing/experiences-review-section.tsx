"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Shield,
  Zap,
  Flame,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  Star,
  Check,
  CheckCircle2,
  X,
  Layers,
  ChevronRight,
  Activity,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import QuantumTiltCard from "@/components/ui/quantum-tilt-card";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  callsign: string;
  avatar: string;
  stars: number;
  date: string;
  category: "Habits" | "Physical" | "Skills" | "AI" | "Vanguard";
  verified: boolean;
  text: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Arjun",
    role: "Student & Full-Stack Architect",
    callsign: "VANGUARD_09",
    avatar: "/assets/images/avatars/avatar_09.jpg",
    stars: 5,
    date: "DAY 78 • UNBROKEN",
    category: "Vanguard",
    verified: true,
    text: "Finally, a productivity concept that combines habits, analytics, AI and competition in one place. The whole Quantum experience feels completely different from a normal checkbox tracker.",
  },
  {
    id: "rev-2",
    name: "Aarav",
    role: "Engineering Challenger",
    callsign: "VANGUARD_01",
    avatar: "/assets/images/avatars/avatar_01.png",
    stars: 5,
    date: "DAY 64 • UNBROKEN",
    category: "Habits",
    verified: true,
    text: "Quantum makes my 90-day goals feel much more organized. The horizontal habit matrix and XP engine make it satisfying to lock in and execute every single morning.",
  },
  {
    id: "rev-3",
    name: "Rohan",
    role: "Systems Specialist",
    callsign: "VANGUARD_02",
    avatar: "/assets/images/avatars/avatar_02.png",
    stars: 5,
    date: "DAY 52 • UNBROKEN",
    category: "Skills",
    verified: true,
    text: "I really like how everything is integrated into one interface instead of juggling multiple apps. The progress analytics make my consistency bottlenecks immediately visible.",
  },
  {
    id: "rev-4",
    name: "Ananya",
    role: "Cognitive AI Researcher",
    callsign: "VANGUARD_03",
    avatar: "/assets/images/avatars/avatar_03.png",
    stars: 5,
    date: "DAY 45 • UNBROKEN",
    category: "AI",
    verified: true,
    text: "The Quantum Core AI is an exceptional concept. It feels like having a personal coach that actually understands my arc, breaks down friction, and tracks real consistency.",
  },
  {
    id: "rev-5",
    name: "Kabir",
    role: "Athletic Disciplinarian",
    callsign: "VANGUARD_04",
    avatar: "/assets/images/avatars/avatar_04.jpg",
    stars: 5,
    date: "DAY 88 • UNBROKEN",
    category: "Physical",
    verified: true,
    text: "The 90-day Winter Arc structure makes discipline feel like an actual mission. I especially respect the streak integrity—no fake vanity points or synthetic fluff.",
  },
  {
    id: "rev-6",
    name: "Dev",
    role: "Digital Designer & Creator",
    callsign: "VANGUARD_05",
    avatar: "/assets/images/avatars/avatar_05.jpg",
    stars: 4,
    date: "DAY 31 • ACTIVE",
    category: "Habits",
    verified: true,
    text: "The interface looks extremely clean, dark, and futuristic. The habit tracker is simple enough to use every day without feeling cumbersome, and the audio design is top notch.",
  },
  {
    id: "rev-7",
    name: "Vihaan",
    role: "Competitive Challenger",
    callsign: "VANGUARD_06",
    avatar: "/assets/images/avatars/avatar_06.jpg",
    stars: 5,
    date: "DAY 60 • UNBROKEN",
    category: "Vanguard",
    verified: true,
    text: "I love the idea of earning XP for completing real-life goals. Seeing effort convert into measurable levels makes the Winter Arc journey deeply rewarding.",
  },
  {
    id: "rev-8",
    name: "Aditya",
    role: "Software Engineer",
    callsign: "VANGUARD_07",
    avatar: "/assets/images/avatars/avatar_07.jpg",
    stars: 5,
    date: "DAY 40 • ACTIVE",
    category: "Skills",
    verified: true,
    text: "The skills decomposer is one of my favourite capabilities. Breaking down huge targets like Rust or Blender into tiny actionable quests eliminates cognitive overwhelm.",
  },
  {
    id: "rev-9",
    name: "Ishaan",
    role: "Tactical Strategist",
    callsign: "VANGUARD_08",
    avatar: "/assets/images/avatars/avatar_08.jpg",
    stars: 5,
    date: "DAY 70 • UNBROKEN",
    category: "Vanguard",
    verified: true,
    text: "The competition leaderboard adds a serious layer of positive peer pressure. You can see fellow challengers locking in simultaneously while focusing on your own daily reps.",
  },
  {
    id: "rev-10",
    name: "Reyansh",
    role: "Winter Arc Veteran",
    callsign: "VANGUARD_10",
    avatar: "/assets/images/avatars/avatar_10.jpg",
    stars: 5,
    date: "DAY 90 • APEX COMPLETED",
    category: "Physical",
    verified: true,
    text: "The 90-day concept is simple but relentlessly powerful. Having a verifiable record of daily effort and photographic proof made this my most transformative winter ever.",
  },
];

export const ExperiencesReviewSection: React.FC = () => {
  // Navigation State: 'chain' (State 1) | 'cards' (State 2) | 'archive' (State 3)
  const [viewState, setViewState] = useState<"chain" | "cards" | "archive">("cards");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Modals
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateStep, setRateStep] = useState<1 | 2>(1);
  const [rateScore, setRateScore] = useState<number>(5);
  const [rateSentiment, setRateSentiment] = useState<string>("Unbroken Discipline");
  const [rateText, setRateText] = useState<string>("");

  // Add Review Form State
  const [newAuthor, setNewAuthor] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newCategory, setNewCategory] = useState<"Habits" | "Physical" | "Skills" | "AI" | "Vanguard">("Habits");
  const [newComment, setNewComment] = useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesCat =
        selectedCategory === "all" ||
        (selectedCategory === "Habits" && r.category === "Habits") ||
        (selectedCategory === "Physical" && r.category === "Physical") ||
        (selectedCategory === "Skills" && r.category === "Skills") ||
        (selectedCategory === "AI" && r.category === "AI") ||
        (selectedCategory === "Vanguard" && r.category === "Vanguard");

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.callsign.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [reviews, selectedCategory, searchQuery]);

  // Fetch live reviews from PostgreSQL database on mount
  React.useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const dbItems: ReviewItem[] = data.reviews.map((r: any) => ({
            id: r.id,
            name: r.authorName || "Verified Challenger",
            role: r.authorTitle || "Arc Challenger",
            callsign: `CHALLENGER_${r.id.substring(0, 4).toUpperCase()}`,
            avatar: r.avatarUrl || "/assets/images/avatars/avatar_01.png",
            stars: r.rating || 5,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "VERIFIED ENTRY",
            category: "Vanguard",
            verified: true,
            text: r.quote,
          }));
          setReviews((prev) => {
            const existingIds = new Set(dbItems.map((item) => item.id));
            const uniquePrev = prev.filter((p) => !existingIds.has(p.id));
            return [...dbItems, ...uniquePrev];
          });
        }
      })
      .catch((err) => console.error("Failed to load live reviews:", err));
  }, []);

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const tempId = `rev-${Date.now()}`;
    const newRev: ReviewItem = {
      id: tempId,
      name: newAuthor,
      role: newRole || "Challenger",
      callsign: `CHALLENGER_${Math.floor(Math.random() * 90 + 10)}`,
      avatar: "/assets/images/avatars/avatar_11.jpg",
      stars: newRating,
      date: `DAY ${Math.floor(Math.random() * 30 + 1)} • NEW ENTRY`,
      category: newCategory,
      verified: true,
      text: newComment,
    };

    setReviews([newRev, ...reviews]);
    setIsAddReviewOpen(false);
    setNewAuthor("");
    setNewRole("");
    setNewComment("");
    showToast("Review submitted to live Quantum Archive!");

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: newAuthor,
          authorTitle: newRole || "Challenger",
          rating: newRating,
          quote: newComment,
          avatarUrl: "/assets/images/avatars/avatar_11.jpg",
        }),
      });
    } catch (err) {
      console.error("Live review sync error:", err);
    }
  };

  const handleRateSubmit = async () => {
    const quoteText = rateText || `Rated ${rateScore} Stars — Exceptional 90-day transformation experience in the Quantum Winter Arc.`;
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: "Verified Challenger",
      role: rateSentiment,
      callsign: `RATED_${rateScore}.0`,
      avatar: "/assets/images/avatars/avatar_12.jpg",
      stars: rateScore,
      date: "JUST NOW • VERIFIED",
      category: "Vanguard",
      verified: true,
      text: quoteText,
    };

    setReviews([newRev, ...reviews]);
    setIsRateModalOpen(false);
    setRateStep(1);
    setRateText("");
    showToast("Collaborative score saved to live database!");

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: "Verified Challenger",
          authorTitle: rateSentiment,
          rating: rateScore,
          quote: quoteText,
          avatarUrl: "/assets/images/avatars/avatar_12.jpg",
        }),
      });
    } catch (err) {
      console.error("Live rating sync error:", err);
    }
  };

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 relative border-t border-slate-900 bg-transparent text-slate-100 overflow-hidden">
      {/* Background Micro-Grid & Soft Radial Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.07),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.05),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* ====================================================================
            HEADER
            ==================================================================== */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase">
            <Sparkles size={12} className="text-sky-400" />
            <span>05 — EXPERIENCES & REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            CHALLENGER EXPERIENCES
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-sans">
            Interactive repository of real 90-day execution logs, architectural capabilities, and verified reviews from the Quantum Vanguard.
          </p>

          {/* Interactive State Toggle Pills */}
          <div className="pt-2 flex items-center justify-center gap-2 font-mono text-xs">
            <button
              onClick={() => setViewState("chain")}
              className={cn(
                "px-3 py-1.5 rounded-full border transition flex items-center gap-1.5",
                viewState === "chain"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>3-Node Chain</span>
            </button>

            <button
              onClick={() => setViewState("cards")}
              className={cn(
                "px-3 py-1.5 rounded-full border transition flex items-center gap-1.5",
                viewState === "cards"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Layers size={13} className="text-sky-400" />
              <span>4-Cards Grid</span>
            </button>

            <button
              onClick={() => setViewState("archive")}
              className={cn(
                "px-3 py-1.5 rounded-full border transition flex items-center gap-1.5",
                viewState === "archive"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Star size={13} className="text-amber-400" />
              <span>50+ Archive & Reviews</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            STATE 1: INITIAL CONNECTED CHAIN (3 Circular Badges + SVG Beam)
            ==================================================================== */}
        {viewState === "chain" && (
          <div className="py-10 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <QuantumTiltCard
              maxTilt={4}
              liftDistance={6}
              onClick={() => setViewState("cards")}
              className="relative w-full max-w-3xl flex items-center justify-center py-12 px-6 cursor-pointer group shadow-2xl transition-all duration-300"
              role="button"
              tabIndex={0}
              title="Click or Hover to Expand 4-Card Overview"
            >
              {/* SVG Connecting Beams & Photon Traces */}
              <svg
                className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none z-0 overflow-visible"
                viewBox="0 0 700 120"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="quantumLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                {/* Dashed background trace */}
                <path
                  d="M 120 60 C 220 45, 260 75, 350 60 C 440 45, 480 75, 580 60"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                {/* Glowing traveling beam */}
                <path
                  d="M 120 60 C 220 45, 260 75, 350 60 C 440 45, 480 75, 580 60"
                  fill="none"
                  stroke="url(#quantumLineGradient)"
                  strokeWidth="3"
                  strokeDasharray="160"
                  strokeDashoffset="160"
                  className="animate-pulse"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))",
                  }}
                />
              </svg>

              {/* 3 Circular Connected Nodes */}
              <div className="relative z-10 flex items-center justify-between w-full max-w-xl px-4 sm:px-8">
                {/* Node 1 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 border-2 border-sky-400/40 group-hover:border-sky-400 group-hover:scale-105 flex items-center justify-center text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300">
                    <Zap size={32} />
                  </div>
                  <span className="font-mono text-xs text-slate-300 font-bold tracking-wider uppercase text-center">
                    01 • Habit Matrix
                  </span>
                </div>

                {/* Node 2 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 border-2 border-cyan-400/40 group-hover:border-cyan-300 group-hover:scale-105 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-300">
                    <Brain size={32} />
                  </div>
                  <span className="font-mono text-xs text-slate-300 font-bold tracking-wider uppercase text-center">
                    02 • Quantum Core
                  </span>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 border-2 border-blue-400/40 group-hover:border-blue-400 group-hover:scale-105 flex items-center justify-center text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all duration-300">
                    <Flame size={32} />
                  </div>
                  <span className="font-mono text-xs text-slate-300 font-bold tracking-wider uppercase text-center">
                    03 • Winter Arc Apex
                  </span>
                </div>
              </div>
            </QuantumTiltCard>

            {/* Click to expand hint */}
            <div className="mt-4 flex items-center gap-2 font-mono text-xs text-sky-300/80">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>CLICK TO EXPAND 4-CARD OVERVIEW</span>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 2: EXPANDED 4-CARD SYSTEM
            ==================================================================== */}
        {viewState === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Card 1: Habit Matrix */}
            <QuantumTiltCard className="p-6 flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                    <Zap size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-500/20">
                    PROTOCOL CORE
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    90-Day Habit Matrix
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Continuous Discipline Grid</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Unbroken horizontal matrix from Day 01 through Day 90. Single-click checkmarks, instant streak verification, zero checkboxes lost across devices.
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>98.4% Consistency • Instant Sync</span>
                </div>
              </div>

              <div
                onClick={() => setViewState("archive")}
                className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-sky-400 group-hover:text-sky-300 cursor-pointer"
              >
                <span>View Experiences</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </QuantumTiltCard>

            {/* Card 2: Quantum Core AI */}
            <QuantumTiltCard className="p-6 flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                    <Brain size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    COGNITIVE ENGINE
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Quantum Core AI
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Autonomous Coaching Layer</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Context-grounded intelligence. Decomposes large goals into micro-tasks, diagnoses consistency dips, and triggers real-time motivational interventions.
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Real-time VAD • 0.0 Vanity Tolerance</span>
                </div>
              </div>

              <div
                onClick={() => setViewState("archive")}
                className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300 cursor-pointer"
              >
                <span>View Experiences</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </QuantumTiltCard>

            {/* Card 3: Winter Arc Apex */}
            <QuantumTiltCard className="p-6 flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                    <Flame size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-500/20">
                    PHYSICAL RECOMP
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    Physical Recomposition
                  </h3>
                  <div className="text-xs font-mono text-slate-400">90-Day Athletic Apex</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Rigorous calisthenics, progressive overload, and caloric discipline producing lean hypertrophy and mental toughness across 2,160 hours.
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>+13.3 KG Lean Mass • 90/90 Days</span>
                </div>
              </div>

              <div
                onClick={() => setViewState("archive")}
                className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-blue-400 group-hover:text-blue-300 cursor-pointer"
              >
                <span>View Experiences</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </QuantumTiltCard>

            {/* Card 4: 50+ OTHER EXPERIENCES (Exploratory Gateway Card!) */}
            <QuantumTiltCard
              onClick={() => setViewState("archive")}
              className="p-6 flex flex-col justify-between space-y-5 cursor-pointer relative overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 font-mono">
                    50+
                  </div>
                  <span className="text-[10px] font-mono text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-full border border-sky-400/30">
                    EXPANDED INDEX
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    OTHER EXPERIENCES
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Collaborations & Reviews</div>
                </div>

                {/* Stacked mini preview badges */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center px-2 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                    <span>Habit Protocols</span>
                    <span className="text-sky-400 font-bold">22</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                    <span>Physical Recomp</span>
                    <span className="text-sky-400 font-bold">14</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                    <span>Skill Decompositions</span>
                    <span className="text-sky-400 font-bold">12</span>
                  </div>
                </div>

                {/* Overlapping Avatars Cluster */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="relative w-7 h-7 rounded-full border border-sky-400/50 overflow-hidden aspect-square"
                      >
                        <Image
                          src={`/assets/images/avatars/avatar_0${num}.${num === 1 || num === 2 || num === 3 ? "png" : "jpg"}`}
                          alt="Challenger"
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-sky-950 border border-sky-400/40 flex items-center justify-center text-[9px] font-mono text-sky-300 font-bold">
                      +48
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Verified Challengers</span>
                </div>
              </div>

              {/* Distinct Exploratory Button */}
              <button className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-102 transition-all">
                <span>Explore Archive & Reviews</span>
                <ArrowRight size={14} />
              </button>
            </QuantumTiltCard>
          </div>
        )}

        {/* ====================================================================
            STATE 3: FULL REVIEWS & EXPERIENCE ARCHIVE FEED
            ==================================================================== */}
        {viewState === "archive" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <button
                onClick={() => setViewState("cards")}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-400/40 text-slate-300 hover:text-white font-mono text-xs transition"
              >
                <ArrowLeft size={14} />
                <span>Back to 4 Cards</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddReviewOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition shadow-md"
                >
                  <Plus size={14} />
                  <span>+ Add New Review</span>
                </button>

                <button
                  onClick={() => {
                    setRateStep(1);
                    setIsRateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-950 border border-amber-400/40 hover:border-amber-400 text-amber-300 font-mono text-xs font-bold transition"
                >
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>★ Start / Rate</span>
                </button>
              </div>
            </div>

            {/* Filter & Live Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {[
                  { id: "all", label: "All", count: reviews.length },
                  { id: "Habits", label: "Habits", count: reviews.filter((r) => r.category === "Habits").length },
                  { id: "Physical", label: "Physical Arc", count: reviews.filter((r) => r.category === "Physical").length },
                  { id: "Skills", label: "Skills", count: reviews.filter((r) => r.category === "Skills").length },
                  { id: "AI", label: "Quantum AI", count: reviews.filter((r) => r.category === "AI").length },
                  { id: "Vanguard", label: "Vanguard", count: reviews.filter((r) => r.category === "Vanguard").length },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border transition text-xs",
                      selectedCategory === cat.id
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-sm"
                        : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Dynamic Reviews Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReviews.slice(0, visibleCount).map((r) => (
                <QuantumTiltCard
                  key={r.id}
                  className="p-6 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 text-xs tracking-widest">
                        {"★".repeat(r.stars)}
                        {"☆".repeat(5 - r.stars)}
                      </div>
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20">
                        {r.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-900 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full border border-sky-400/40 overflow-hidden shrink-0 aspect-square shadow-sm">
                      <Image
                        src={r.avatar}
                        alt={r.name}
                        fill
                        sizes="40px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                        <span>{r.name}</span>
                        {r.verified && <CheckCircle2 size={12} className="text-emerald-400" />}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{r.role}</div>
                      <div className="text-[9px] font-mono text-sky-400/80">{r.callsign}</div>
                    </div>
                  </div>
                </QuantumTiltCard>
              ))}
            </div>

            {/* Pagination / Load More */}
            {visibleCount < filteredReviews.length && (
              <div className="flex flex-col items-center justify-center gap-2 pt-4">
                <span className="text-xs font-mono text-slate-500">
                  Displaying {Math.min(visibleCount, filteredReviews.length)} of {filteredReviews.length} experiences
                </span>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-400 text-xs font-mono text-sky-300 transition"
                >
                  Load More Experiences
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL 1: ADD NEW REVIEW COMPOSER
          ==================================================================== */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950 border border-sky-400/40 shadow-[0_0_50px_rgba(56,189,248,0.2)] text-left font-mono space-y-5">
            <button
              onClick={() => setIsAddReviewOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Add New Challenger Review</h3>
              <p className="text-xs text-slate-400 font-sans">
                Document your 90-day progress, habits matrix feedback, or coaching audit.
              </p>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">YOUR NAME / CALLSIGN</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun K."
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">ROLE / PROTOCOL SQUAD</label>
                <input
                  type="text"
                  placeholder="e.g. Student & Calisthenics Athlete"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">RATING (STARS)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs transition",
                        newRating >= s
                          ? "bg-amber-400/20 border-amber-400 text-amber-300"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      )}
                    >
                      {s} ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Habits">Habits Matrix</option>
                  <option value="Physical">Physical Recomposition</option>
                  <option value="Skills">Skill Decomposer</option>
                  <option value="AI">Quantum Core AI</option>
                  <option value="Vanguard">Vanguard Squad</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">YOUR EXPERIENCE</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail your consistency rate, XP compounding, or transformation milestones..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md"
              >
                SUBMIT REVIEW TO LIVE ARCHIVE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: START / RATE 2-STEP GUIDED FLOW
          ==================================================================== */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-950 border border-amber-400/40 shadow-[0_0_50px_rgba(251,191,36,0.2)] text-left font-mono space-y-6">
            <button
              onClick={() => setIsRateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            {rateStep === 1 ? (
              <div className="space-y-5 text-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Rate Your Quantum Arc</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Select your overall execution score for the protocol.
                  </p>
                </div>

                {/* Big Interactive Stars */}
                <div className="flex justify-center gap-3 py-4">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRateScore(val)}
                      className={cn(
                        "p-2 rounded-xl transition-all duration-200",
                        rateScore >= val
                          ? "text-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                          : "text-slate-700 hover:text-slate-500"
                      )}
                    >
                      <Star size={32} className={rateScore >= val ? "fill-amber-400" : ""} />
                    </button>
                  ))}
                </div>

                <div className="text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-500/20 py-1.5 px-3 rounded-full inline-block">
                  {rateScore === 5 && "5.0 / 5.0 (Exceptional Discipline)"}
                  {rateScore === 4 && "4.0 / 5.0 (Strong Arc Progress)"}
                  {rateScore === 3 && "3.0 / 5.0 (Baseline Execution)"}
                  {rateScore <= 2 && "Needs Optimization"}
                </div>

                <button
                  type="button"
                  onClick={() => setRateStep(2)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition"
                >
                  CONTINUE TO STEP 2 →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">How was your transformation?</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Select a core sentiment tag and leave a short reflection.
                  </p>
                </div>

                {/* Sentiment Tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Unbroken Discipline",
                    "Relentless Focus",
                    "Cognitive Rigor",
                    "Flawless UI",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRateSentiment(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full border text-[11px] transition",
                        rateSentiment === tag
                          ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <textarea
                    rows={3}
                    placeholder="In a few sentences, how did Quantum impact your daily habits or focus?"
                    value={rateText}
                    onChange={(e) => setRateText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRateStep(1)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs transition"
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    onClick={handleRateSubmit}
                    className="flex-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition"
                  >
                    SUBMIT RATING
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST FEEDBACK NOTICE
          ==================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default ExperiencesReviewSection;
