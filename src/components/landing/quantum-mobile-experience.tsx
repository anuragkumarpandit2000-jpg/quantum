"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Brain,
  AlarmClock,
  Volume2,
  CheckCircle2,
  Calendar,
  Flame,
  ListChecks,
  Target,
  Camera,
  Trophy,
  Shield,
  Activity,
  AlertTriangle,
  PlayCircle,
  Bell,
  Mic,
  Award,
  User,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Zap,
  TrendingUp,
  X,
  Radio,
  Clock,
  Smartphone,
  Eye,
  Check,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import MobileRotatingShowcase from "@/components/ui/mobile-rotating-showcase";
import MobileFeaturePanel from "@/components/ui/mobile-feature-panel";
import { cn } from "@/lib/utils";

// --- CATEGORIES FOR TACTICAL NAVIGATION ---
const FEATURE_CATEGORIES = [
  { id: "all", label: "ALL FEATURES", count: 19 },
  { id: "ai", label: "AI & VOICE", count: 5, indices: [0, 1, 2, 13, 14] },
  { id: "habits", label: "HABITS & XP", count: 5, indices: [3, 4, 5, 10, 11] },
  { id: "skills", label: "SKILLS & PROOF", count: 4, indices: [6, 7, 8, 15] },
  { id: "identity", label: "INTEL & AWARDS", count: 5, indices: [9, 12, 16, 17, 18] },
];

interface FeatureItem {
  number: string;
  name: string;
  category: string;
  badge: string;
  subtitle: string;
  description: string;
  statusText: string;
  statusVariant: "online" | "active" | "warning" | "neutral" | "danger";
  icon: React.ReactNode;
  renderContent: () => React.ReactNode;
}

export const QuantumMobileExperience: React.FC = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Interactive state for micro-animations & previews
  const [isVoicePlaying, setIsVoicePlaying] = useState<boolean>(false);
  const [habitCompleted, setHabitCompleted] = useState<boolean>(false);
  const [userXp, setUserXp] = useState<number>(2480);
  const [showXpPop, setShowXpPop] = useState<boolean>(false);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [contractModalOpen, setContractModalOpen] = useState<boolean>(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState<boolean>(false);
  const [tasksState, setTasksState] = useState([true, true, false, false]);
  const [skillTasksState, setSkillTasksState] = useState([true, true, false, false]);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance features every 6 seconds if autoplay is active
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % 19);
    }, 6500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gemini AI Voice TTS Player with fallback to browser synthesis
  const handleToggleVoice = async (text: string) => {
    if (isVoicePlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsVoicePlaying(false);
      return;
    }

    setIsVoicePlaying(true);

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;

      const isDefault = text.toLowerCase().includes("kya haal") || text.toLowerCase().includes("day 17");
      const isReminder = text.toLowerCase().includes("workout");
      audio.src = isDefault
        ? "/assets/audio/gemini_voice_preview.wav"
        : isReminder
        ? "/assets/audio/gemini_voice_reminder.wav"
        : `/api/ai/tts?text=${encodeURIComponent(text)}`;

      audio.onended = () => {
        setIsVoicePlaying(false);
      };

      audio.onerror = () => {
        fallbackSpeechSynthesis(text);
      };

      await audio.play();
    } catch (e) {
      console.warn("Gemini audio playback error, falling back:", e);
      fallbackSpeechSynthesis(text);
    }
  };

  const fallbackSpeechSynthesis = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.toLowerCase().includes("in") ||
          v.name.toLowerCase().includes("india") ||
          v.lang.toLowerCase().includes("hi")
      );
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => setIsVoicePlaying(false);
      utterance.onerror = () => setIsVoicePlaying(false);

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setIsVoicePlaying(false), 4500);
      }
    } else {
      setTimeout(() => setIsVoicePlaying(false), 4500);
    }
  };

  // Quick Habit Check-In Handler
  const handleQuickHabitToggle = () => {
    if (!habitCompleted) {
      setHabitCompleted(true);
      setShowXpPop(true);
      setUserXp((prev) => prev + 40);
      setTimeout(() => setShowXpPop(false), 2200);
    } else {
      setHabitCompleted(false);
      setUserXp((prev) => Math.max(2480, prev - 40));
    }
  };

  // Task list toggle
  const toggleTask = (index: number) => {
    setTasksState((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Skill task toggle
  const toggleSkillTask = (index: number) => {
    setSkillTasksState((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // All 18 Features Definition
  const features: FeatureItem[] = useMemo(
    () => [
      // 01 — QUANTUM AI COMPANION (Hero)
      {
        number: "01",
        name: "QUANTUM AI COMPANION",
        category: "ai",
        badge: "HERO FEATURE • V2.4",
        subtitle: "YOUR PERSONAL AI DISCIPLINE SYSTEM",
        description:
          "Your companion tracks your goals, daily habits, and Arc momentum in real time. Always alert, always tactical.",
        statusText: "ONLINE",
        statusVariant: "online" as const,
        icon: <Brain size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1">
            {/* Spoken message bubble */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/30 text-xs font-mono space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] text-sky-400 font-bold uppercase">
                <span className="flex items-center gap-1.5">
                  <Radio size={12} className="text-sky-400 animate-pulse" />
                  GEMINI AI VOICE DISPATCH (AUTHENTIC HINGLISH)
                </span>
                <span>07:00 AM</span>
              </div>
              <p className="text-slate-100 font-sans italic text-xs sm:text-sm leading-relaxed">
                &ldquo;Boss, kya haal? Aaj Day 17 hai. Winter Arc rukna nahi chahiye, full focus bana ke rakhna!&rdquo;
              </p>

              {/* Dynamic Animated Audio Waveform */}
              <div className="flex items-center justify-between gap-1 pt-1.5 h-6">
                {[40, 75, 100, 60, 30, 85, 95, 50, 80, 100, 70, 45, 90, 60, 35].map(
                  (height, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-1 rounded-full transition-all duration-200 bg-sky-400",
                        isVoicePlaying
                          ? "animate-pulse"
                          : "opacity-40"
                      )}
                      style={{
                        height: isVoicePlaying
                          ? `${Math.max(20, (height * ((i % 3) + 1)) % 100)}%`
                          : `${height * 0.4}%`,
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Play Voice CTA */}
            <button
              onClick={() =>
                handleToggleVoice("Boss, kya haal? Aaj Day 17 hai. Winter Arc rukna nahi chahiye, full focus bana ke rakhna!")
              }
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              {isVoicePlaying ? (
                <>
                  <Pause size={14} className="text-sky-400 fill-sky-400" />
                  <span>PAUSE VOICE MESSAGE</span>
                </>
              ) : (
                <>
                  <Play size={14} className="text-sky-400 fill-sky-400" />
                  <span>▶ PLAY GEMINI HINGLISH VOICE</span>
                </>
              )}
            </button>
          </div>
        ),
      },

      // 02 — SMART ALARM
      {
        number: "02",
        name: "SMART ALARM",
        category: "ai",
        badge: "CIRCADIAN SYNC",
        subtitle: "ROUTINE-CALIBRATED WAKE SYSTEM",
        description:
          "QUANTUM syncs with your sleep target and ensures you start your day with unwavering focus.",
        statusText: "ARMED • 06:00 AM",
        statusVariant: "active" as const,
        icon: <AlarmClock size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-500/25 flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider">
                  06:00 <span className="text-sky-400 text-sm">AM</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  WAKE UP PROTOCOL
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 animate-pulse">
                <Bell size={18} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/20 text-xs font-mono text-slate-300">
              <span className="text-sky-400 font-bold block mb-0.5">WAKE COMMAND:</span>
              &ldquo;Boss, kya haal? Aaj ka Arc start karte hain.&rdquo;
            </div>
          </div>
        ),
      },

      // 03 — VOICE REMINDERS
      {
        number: "03",
        name: "VOICE REMINDERS",
        category: "ai",
        badge: "SPOKEN AUDIO",
        subtitle: "HANDS-FREE TACTICAL PROMPTS",
        description:
          "QUANTUM can speak reminders aloud instead of silent text notifications that get buried.",
        statusText: "ACTIVE",
        statusVariant: "online" as const,
        icon: <Volume2 size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/25 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-sky-400">
                <span className="flex items-center gap-1.5">
                  <Volume2 size={13} className="text-sky-400" />
                  AUDIO NOTIFICATION
                </span>
                <span className="text-slate-400">17:30 PM</span>
              </div>
              <p className="text-sm font-sans font-medium text-white italic">
                &ldquo;Boss, workout ka time ho gaya! Utho aur discipline dikhao!&rdquo;
              </p>
            </div>
            <button
              onClick={() =>
                handleToggleVoice("Boss, workout ka time ho gaya! Utho aur discipline dikhao!")
              }
              className="w-full py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 font-mono text-[11px] flex items-center justify-center gap-2 transition"
            >
              <Volume2 size={13} />
              <span>{isVoicePlaying ? "PLAYING AUDIO..." : "▶ PLAY GEMINI VOICE REMINDER"}</span>
            </button>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>EARPHONE SYNCHRONIZATION</span>
              <span className="text-emerald-400">ENABLED</span>
            </div>
          </div>
        ),
      },

      // 04 — QUICK HABIT CHECK-IN
      {
        number: "04",
        name: "QUICK HABIT CHECK-IN",
        category: "habits",
        badge: "ONE-TAP MOBILE",
        subtitle: "INSTANT PROTOCOL CONFIRMATION",
        description:
          "Mark completed protocols on the go with zero menu friction. Lock-screen widgets confirm instantly.",
        statusText: habitCompleted ? "STREAK VERIFIED" : "PENDING",
        statusVariant: habitCompleted ? ("online" as const) : ("warning" as const),
        icon: <CheckCircle2 size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1 relative">
            {/* Interactive Habit Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Cold Shower & Hydration</div>
                <div className="text-[10px] font-mono text-slate-400">DAY 17 PROTOCOL • +40 XP</div>
              </div>

              {/* Clickable checkmark */}
              <button
                onClick={handleQuickHabitToggle}
                className={cn(
                  "px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-lg",
                  habitCompleted
                    ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300"
                    : "bg-sky-500/20 border border-sky-400/50 hover:bg-sky-500/30 text-sky-300 hover:text-white"
                )}
              >
                <Check size={14} className={habitCompleted ? "stroke-[3]" : ""} />
                <span>{habitCompleted ? "COMPLETED" : "COMPLETE"}</span>
              </button>
            </div>

            {/* Subtle XP Animation */}
            {showXpPop && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-sky-400 text-slate-950 font-mono text-xs font-black shadow-[0_0_25px_rgba(56,189,248,0.8)] animate-bounce z-20 pointer-events-none">
                +40 XP AWARDED!
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>CURRENT BALANCE:</span>
              <span className="text-sky-300 font-bold">{userXp} XP</span>
            </div>
          </div>
        ),
      },

      // 05 — 90-DAY HABIT TRACKING
      {
        number: "05",
        name: "90-DAY HABIT TRACKER",
        category: "habits",
        badge: "HABIT MATRIX",
        subtitle: "COMPOUND DISCIPLINE MATRIX",
        description:
          "A miniaturized view of the true Quantum 90-day discipline system. Visual proof of consistency.",
        statusText: "94.2% CONSISTENCY",
        statusVariant: "online" as const,
        icon: <Calendar size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-2 pt-1 font-mono text-[11px]">
            {/* Header row */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 pb-1 border-b border-slate-800">
              <span className="text-left pl-1">HABIT</span>
              <span>D1</span>
              <span>D2</span>
              <span>D3</span>
              <span>D4</span>
              <span>D5</span>
              <span className="text-sky-400 font-bold">D6</span>
            </div>
            {/* Rows */}
            <div className="grid grid-cols-7 gap-1 text-center items-center py-1">
              <span className="text-left font-sans text-xs text-slate-200 truncate pl-1">WORKOUT</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-rose-400/80 font-bold">✕</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center items-center py-1 bg-slate-900/50 rounded">
              <span className="text-left font-sans text-xs text-slate-200 truncate pl-1">MEDITATE</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center items-center py-1">
              <span className="text-left font-sans text-xs text-slate-200 truncate pl-1">STUDY</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-rose-400/80 font-bold">✕</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
              <span className="text-sky-400 font-bold">✓</span>
            </div>
          </div>
        ),
      },

      // 06 — XP & STREAKS
      {
        number: "06",
        name: "XP & STREAKS",
        category: "habits",
        badge: "REPUTATION ENGINE",
        subtitle: "GAMIFIED PROOF OF DISCIPLINE",
        description:
          "Transforming raw discipline into measurable numbers. Every repetition increments your verifiable protocol standing.",
        statusText: "🔥 17 DAY STREAK",
        statusVariant: "active" as const,
        icon: <Flame size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black font-mono text-white tracking-tight">
                  {userXp.toLocaleString()} <span className="text-sky-400 text-sm">XP</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">10,000 XP LEVEL 05 TARGET</div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Flame size={14} className="text-amber-400 fill-amber-400" />
                <span>17 DAYS</span>
              </div>
            </div>

            {/* Glowing progress bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-500"
                  style={{ width: `${(userXp / 10000) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>TIER PROGRESS</span>
                <span>24.8% COMPLETE</span>
              </div>
            </div>
          </div>
        ),
      },

      // 07 — DAILY TASKS
      {
        number: "07",
        name: "TODAY'S TASKS",
        category: "skills",
        badge: "EXECUTION QUEUE",
        subtitle: "PRIORITY DAILY AGENDA",
        description:
          "Dynamic checklist structured by cognitive and physical output with automatic completion tracking.",
        statusText: "2 / 4 COMPLETE",
        statusVariant: "active" as const,
        icon: <ListChecks size={20} className="text-sky-400" />,
        renderContent: () => {
          const tasks = [
            "Mathematics Problem Set",
            "Heavy Strength Workout",
            "Blender 3D Modeling",
            "Evening Meditation",
          ];
          const completedCount = tasksState.filter(Boolean).length;
          return (
            <div className="space-y-2 pt-1">
              <div className="space-y-1.5 font-sans text-xs">
                {tasks.map((task, idx) => (
                  <button
                    key={task}
                    onClick={() => toggleTask(idx)}
                    className={cn(
                      "w-full px-3 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all",
                      tasksState[idx]
                        ? "bg-sky-500/10 border-sky-500/30 text-slate-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <span className={tasksState[idx] ? "line-through text-slate-400" : ""}>
                      {task}
                    </span>
                    <span
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center font-mono text-[10px]",
                        tasksState[idx]
                          ? "bg-sky-500 border-sky-400 text-slate-950 font-bold"
                          : "border-slate-700"
                      )}
                    >
                      {tasksState[idx] ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>DAILY COMPLETION:</span>
                <span className="text-sky-300 font-bold">
                  {Math.round((completedCount / tasks.length) * 100)}%
                </span>
              </div>
            </div>
          );
        },
      },

      // 08 — SKILL MICRO-TASKS
      {
        number: "08",
        name: "SKILL BUILDER",
        category: "skills",
        badge: "MICRO-CURRICULUM",
        subtitle: "SKILL DECOMPOSITION SYSTEM",
        description:
          "Break master-level skills into daily bite-sized micro-tasks that build competence without burnout.",
        statusText: "LEVEL 02 • 80%",
        statusVariant: "online" as const,
        icon: <Target size={20} className="text-sky-400" />,
        renderContent: () => {
          const drills = ["Viewport Mastery", "Navigation Basics", "Hard Surface Modeling", "Procedural Materials"];
          return (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white">BLENDER 3D</span>
                <span className="text-sky-400">+120 XP REWARD</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)] w-4/5" />
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                {drills.map((drill, idx) => (
                  <button
                    key={drill}
                    onClick={() => toggleSkillTask(idx)}
                    className={cn(
                      "p-1.5 rounded border text-left truncate transition-all",
                      skillTasksState[idx]
                        ? "bg-sky-500/10 border-sky-400/40 text-sky-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    )}
                  >
                    {skillTasksState[idx] ? "✓" : "□"} {drill}
                  </button>
                ))}
              </div>
            </div>
          );
        },
      },

      // 09 — DAILY PROOF / GALLERY
      {
        number: "09",
        name: "DAILY PROOF",
        category: "skills",
        badge: "VERIFIED ARCHIVE",
        subtitle: "UNFORGEABLE EVIDENCE VAULT",
        description:
          "Capture and upload transformation photos directly from mobile camera. No excuses, only evidence.",
        statusText: "DAY 17 UPLOADED",
        statusVariant: "online" as const,
        icon: <Camera size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-2.5 pt-1">
            <div className="relative rounded-xl overflow-hidden border border-sky-500/30 bg-slate-900/90 h-24 flex items-center justify-between px-3">
              <div className="space-y-1 z-10">
                <div className="text-xs font-mono font-bold text-white">DAY 17 • PHOTO UPLOADED</div>
                <div className="text-[10px] font-mono text-sky-400">07:14 AM • TIMESTAMPED</div>
                <div className="text-[9px] font-mono text-emerald-400">VERIFIED HASH: #8F39A</div>
              </div>
              <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-sky-400/40 shrink-0">
                <Image
                  src="/assets/images/review character/photo_2026-09-30_20-56-40.jpg"
                  alt="Daily Transformation Proof"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ),
      },

      // 10 — LIVE COMPETITION
      {
        number: "10",
        name: "LIVE COMPETITION",
        category: "competition",
        badge: "GLOBAL STANDINGS",
        subtitle: "REAL-TIME PROTOCOL LEADERBOARD",
        description:
          "Measure your discipline against serious challengers across the globe in real-time.",
        statusText: "RANK #27",
        statusVariant: "active" as const,
        icon: <Trophy size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-1.5 pt-1 font-mono text-xs">
            <div className="flex justify-between items-center py-1 px-2.5 rounded bg-slate-900/60 text-slate-300">
              <span>#01 VIKRAM_S</span>
              <span className="text-sky-300">3,840 XP</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2.5 rounded bg-slate-900/60 text-slate-300">
              <span>#02 ARJUN_K</span>
              <span className="text-sky-300">3,410 XP</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2.5 rounded bg-slate-900/60 text-slate-300">
              <span>#03 MARCUS_V</span>
              <span className="text-sky-300">3,190 XP</span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-sky-500/20 border border-sky-400/50 text-white font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <span>#27 YOU (ARC_07)</span>
              <span className="text-sky-300">{userXp.toLocaleString()} XP</span>
            </div>
          </div>
        ),
      },

      // 11 — ANALYTICS
      {
        number: "11",
        name: "ANALYTICS",
        category: "habits",
        badge: "TELEMETRY DASHBOARD",
        subtitle: "INSTANT ARC METRICS",
        description:
          "Quick insights surfaced on mobile; comprehensive historical deep-dives available on desktop.",
        statusText: "+240 XP / DAY",
        statusVariant: "online" as const,
        icon: <Activity size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-base font-bold text-white">94.2%</div>
                <div className="text-[9px] text-slate-400 uppercase">CONSISTENCY</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-base font-bold text-sky-400">17 DAYS</div>
                <div className="text-[9px] text-slate-400 uppercase">STREAK</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-base font-bold text-emerald-400">91.8%</div>
                <div className="text-[9px] text-slate-400 uppercase">HABIT COMPLETION</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-base font-bold text-white">{userXp}</div>
                <div className="text-[9px] text-slate-400 uppercase">TOTAL XP</div>
              </div>
            </div>
            {/* SVG Sparkline */}
            <div className="p-2 rounded-lg bg-slate-900/60 border border-sky-500/20">
              <svg className="w-full h-7" viewBox="0 0 100 25" preserveAspectRatio="none">
                <path
                  d="M0,20 Q20,18 35,12 T70,8 T100,3"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                />
              </svg>
            </div>
          </div>
        ),
      },

      // 12 — STREAK PROTECTION
      {
        number: "12",
        name: "STREAK PROTECTION",
        category: "habits",
        badge: "EMERGENCY RADAR",
        subtitle: "DISCIPLINE RADAR WARNING",
        description:
          "Active radar alerts when habits remain unfinished before midnight to keep your streak unbroken.",
        statusText: "STREAK AT RISK",
        statusVariant: "warning" as const,
        icon: <AlertTriangle size={20} className="text-amber-400" />,
        renderContent: () => (
          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <AlertTriangle size={13} className="text-amber-400" />
                <span>🔥 17 DAY STREAK • STREAK AT RISK</span>
              </div>
              <div className="text-amber-200/90 text-[11px] font-semibold">2 HABITS REMAIN</div>
              <p className="text-slate-300 font-sans text-xs italic">
                &ldquo;Complete today&apos;s habits to protect your streak.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 px-1">
              <span>RESET COUNTDOWN:</span>
              <span className="text-amber-300 font-bold">4H 18M REMAINING</span>
            </div>
          </div>
        ),
      },

      // 13 — MOTIVATIONAL INTERVENTIONS
      {
        number: "13",
        name: "MOTIVATIONAL INTERVENTION",
        category: "identity",
        badge: "RELAPSE DEFENSE",
        subtitle: "DATA-DRIVEN URGENT BRIEFING",
        description:
          "If consistency drops significantly, QUANTUM provides an urgent motivational intervention.",
        statusText: "DATA-TRIGGERED",
        statusVariant: "active" as const,
        icon: <PlayCircle size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/25 text-xs font-mono space-y-1">
              <div className="text-[10px] text-sky-400 uppercase font-bold">INTERVENTION TRIGGER:</div>
              <p className="text-slate-100 font-sans italic text-xs leading-relaxed">
                &ldquo;Boss, your consistency dropped this week. The Arc isn&apos;t over. Get back in.&rdquo;
              </p>
            </div>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <PlayCircle size={14} className="text-sky-400" />
              <span>🎬 WATCH INTERVENTION BRIEF</span>
            </button>
          </div>
        ),
      },

      // 14 — SMART NOTIFICATIONS
      {
        number: "14",
        name: "SMART NOTIFICATIONS",
        category: "ai",
        badge: "CONTEXTUAL INTELLIGENCE",
        subtitle: "PRECISION PROTOCOL ALERTS",
        description:
          "Context-aware alerts calibrated to your location, routine schedule, and habit windows.",
        statusText: "PRECISION ENGINE",
        statusVariant: "online" as const,
        icon: <Bell size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-1.5 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Clock size={12} className="text-sky-400 shrink-0" />
              <span className="truncate">&ldquo;Your workout is scheduled in 15 minutes.&rdquo;</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Zap size={12} className="text-sky-400 shrink-0" />
              <span className="truncate">&ldquo;120 XP until your next milestone.&rdquo;</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
              <AlertTriangle size={12} className="text-amber-400 shrink-0" />
              <span className="truncate">&ldquo;Your streak is at risk.&rdquo;</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
              <ListChecks size={12} className="text-sky-400 shrink-0" />
              <span className="truncate">&ldquo;3 tasks remaining today.&rdquo;</span>
            </div>
          </div>
        ),
      },

      // 15 — VOICE INTERACTION
      {
        number: "15",
        name: "TALK TO QUANTUM",
        category: "ai",
        badge: "BIDIRECTIONAL VOICE",
        subtitle: "NATURAL LANGUAGE DISPATCH",
        description:
          "Speak directly to your companion. Ask for task breakdowns, morning briefs, or emergency coaching.",
        statusText: "LISTENING",
        statusVariant: "active" as const,
        icon: <Mic size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="text-slate-400 block text-[9px]">USER:</span>
              &ldquo;What should I do today?&rdquo;
            </div>
            <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-200">
              <span className="text-sky-400 block text-[9px] font-bold">QUANTUM:</span>
              &ldquo;Boss, you&apos;ve got 3 priorities today: Strength workout, Blender nodes, and Deep study.&rdquo;
            </div>
          </div>
        ),
      },

      // 16 — ACHIEVEMENTS
      {
        number: "16",
        name: "ACHIEVEMENTS",
        category: "skills",
        badge: "VERIFIED BADGES",
        subtitle: "PERMANENT PROTOCOL BADGES",
        description:
          "Milestones stamped with cryptographic timestamps and proof of sustained discipline.",
        statusText: "3 / 6 UNLOCKED",
        statusVariant: "online" as const,
        icon: <Award size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono text-[10px]">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/40 text-center text-sky-300">
              <Award size={14} className="mx-auto mb-1 text-sky-400" />
              FIRST STEP
            </div>
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/40 text-center text-sky-300">
              <Flame size={14} className="mx-auto mb-1 text-sky-400" />
              7 DAY ARC
            </div>
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/40 text-center text-sky-300">
              <Zap size={14} className="mx-auto mb-1 text-sky-400" />
              1,000 XP
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-300">
              30D DISCIPLINE
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-500">
              🔒 HALFWAY
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-500">
              🔒 ARC COMPLETE
            </div>
          </div>
        ),
      },

      // 17 — PROFILE
      {
        number: "17",
        name: "PROFILE",
        category: "identity",
        badge: "CHALLENGER IDENTITY",
        subtitle: "PROTOCOL PROGRESS CARD",
        description:
          "Your master identity card summarizing your 90-day transformation velocity at a single glance.",
        statusText: "ARC ACTIVE • DAY 17",
        statusVariant: "online" as const,
        icon: <User size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-2.5 pt-1 font-mono text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/30">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-sky-400 shrink-0">
                <Image
                  src="/assets/images/review character/02a2226d-1a2f-4d17-9fe5-da9a5b217889.png"
                  alt="Challenger Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="truncate">
                <div className="font-bold text-white text-sm">ANURAG • ARC_07</div>
                <div className="text-[10px] text-sky-400">RANK #27 • {userXp.toLocaleString()} XP • 🔥 17 DAYS</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>90-DAY PROGRESS:</span>
                <span className="text-sky-300 font-bold">17 / 90 DAYS (18.8%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-sky-400 w-[18.8%]" />
              </div>
            </div>
          </div>
        ),
      },

      // 18 — COMMITMENT CONTRACT
      {
        number: "18",
        name: "COMMITMENT CONTRACT",
        category: "identity",
        badge: "COVENANT SYSTEM",
        subtitle: "MY COMMITMENT • 90-DAY ARC",
        description:
          "Access your sealed 90-day commitment contract anytime from mobile to re-anchor your discipline.",
        statusText: "EXECUTED & SEALED",
        statusVariant: "online" as const,
        icon: <FileText size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-sky-400 uppercase font-bold">MY COMMITMENT</div>
                <div className="font-bold text-white text-sm">90-DAY ARC COVENANT</div>
                <div className="text-[9px] text-slate-400">SEALED • HASH: #QC-90D-2026</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400">
                <FileText size={18} />
              </div>
            </div>
            <button
              onClick={() => setContractModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Eye size={14} className="text-sky-400" />
              <span>VIEW CONTRACT</span>
            </button>
          </div>
        ),
      },

      // 19 — CERTIFICATE
      {
        number: "19",
        name: "CERTIFICATE OF COMPLETION",
        category: "identity",
        badge: "VERIFIED CREDENTIAL",
        subtitle: "90 / 90 DAYS • ARC COMPLETED",
        description:
          "Upon surviving all 90 days, your verified certificate of completion unlocks for inspection and high-res print export.",
        statusText: "CERTIFICATE EARNED",
        statusVariant: "online" as const,
        icon: <Award size={20} className="text-sky-400" />,
        renderContent: () => (
          <div className="space-y-3 pt-1 font-mono text-xs">
            <div className="p-3 rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-900/90 border border-sky-400/50 flex items-center justify-between shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CERTIFICATE EARNED
                </div>
                <div className="font-bold text-white text-sm">90 / 90 DAYS COMPLETED</div>
                <div className="text-[9px] text-slate-400">ID: Q-CERT-88429 • VERIFIED</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-300">
                <Award size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCertificateModalOpen(true)}
                className="py-2 px-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 hover:text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <Eye size={13} />
                <span>VIEW CERTIFICATE</span>
              </button>
              <a
                href="/assets/images/certificate/certificate.png"
                download="QUANTUM_CERTIFICATE_PREVIEW.png"
                className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition text-center"
              >
                <Download size={13} />
                <span>DOWNLOAD</span>
              </a>
            </div>
          </div>
        ),
      },
    ],
    [isVoicePlaying, habitCompleted, userXp, showXpPop, tasksState, skillTasksState]
  );

  const activeFeature = features[activeFeatureIndex];
  // Complementary / Paired feature for flanking composition
  const companionFeatureIndex = (activeFeatureIndex + 1) % features.length;
  const companionFeature = features[companionFeatureIndex];

  // Filter features if category selected
  const displayedIndices = useMemo(() => {
    if (activeCategory === "all") return Array.from({ length: 19 }, (_, i) => i);
    const cat = FEATURE_CATEGORIES.find((c) => c.id === activeCategory);
    return cat?.indices || [];
  }, [activeCategory]);

  return (
    <section id="mobile" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-900 bg-transparent overflow-hidden">
      {/* Soft radial blue atmospheric lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.09),transparent_65%)] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-12">
        {/* ============================================================
            1. SECTION HEADER: "QUANTUM MOBILE"
            ============================================================ */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Smartphone size={14} className="text-sky-400" />
            <span>QUANTUM MOBILE EXPERIENCE • NATIVE SYSTEM</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              QUANTUM MOBILE
            </h2>
            <div className="text-sky-400 font-mono text-base sm:text-xl font-bold tracking-widest">
              [ YOUR ARC, IN YOUR POCKET ]
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal max-w-2xl mx-auto">
            Not just a mobile app—your 24/7 personal AI companion, smart circadian alarm, 90-day habit matrix, and real-time competition hub in one uncompromised interface.
          </p>

          {/* Minimal Feature Tracker Indicator (01 / 19) */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="font-mono text-xs font-bold text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30">
              {activeFeature.number} / 19
            </span>
            <span className="font-mono text-xs text-slate-300 tracking-wider font-semibold">
              {activeFeature.name}
            </span>
          </div>
        </div>

        {/* ============================================================
            2. DESKTOP COMPOSITION (PANEL - PHONE - PANEL)
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
          {/* LEFT FEATURE PANEL (Active Feature) */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col justify-center">
            <MobileFeaturePanel
              featureNumber={activeFeature.number}
              name={activeFeature.name}
              subtitle={activeFeature.subtitle}
              badge={activeFeature.badge}
              description={activeFeature.description}
              statusText={activeFeature.statusText}
              statusVariant={activeFeature.statusVariant}
              icon={activeFeature.icon}
              className="min-h-[360px]"
            >
              {activeFeature.renderContent()}
            </MobileFeaturePanel>
          </div>

          {/* CENTER PHONE (Main Visual Centerpiece - 360 Rotating Canvas) */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center justify-center relative">
            {/* Ambient Cyan Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-[320px] sm:w-[380px] h-[500px] rounded-full bg-sky-500/15 blur-[70px] animate-pulse" />
            </div>

            {/* The existing rotating mobile phone synchronized to feature */}
            <MobileRotatingShowcase activeFeatureIndex={activeFeatureIndex} className="w-full flex justify-center" />
          </div>

          {/* RIGHT FEATURE PANEL (Companion / Synchronized Telemetry Feature) */}
          <div className="lg:col-span-4 order-3 lg:order-3 flex flex-col justify-center">
            <MobileFeaturePanel
              featureNumber={companionFeature.number}
              name={companionFeature.name}
              subtitle={companionFeature.subtitle}
              badge={companionFeature.badge}
              description={companionFeature.description}
              statusText={companionFeature.statusText}
              statusVariant={companionFeature.statusVariant}
              icon={companionFeature.icon}
              className="min-h-[360px]"
            >
              {companionFeature.renderContent()}
            </MobileFeaturePanel>
          </div>
        </div>

        {/* ============================================================
            3. BOTTOM FEATURE PANEL & TACTICAL NAVIGATOR
            ============================================================ */}
        <div className="rounded-2xl p-5 sm:p-6 bg-[#070d1e]/90 backdrop-blur-xl border border-sky-500/20 shadow-[0_0_30px_rgba(56,189,248,0.08)] space-y-6">
          {/* Top Row: Category Tabs + Autoplay Toggle + Prev/Next Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {FEATURE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (cat.indices && cat.indices.length > 0) {
                      setActiveFeatureIndex(cat.indices[0]);
                    }
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full font-mono text-[11px] tracking-wider transition-all",
                    activeCategory === cat.id
                      ? "bg-sky-500/20 border border-sky-400 text-sky-300 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                      : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                  )}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Controls: Prev / Next / Auto-Cycle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-mono transition"
                title={isAutoPlaying ? "Pause auto-switch" : "Resume auto-switch"}
              >
                {isAutoPlaying ? <Pause size={11} className="text-sky-400" /> : <Play size={11} className="text-sky-400" />}
                <span>{isAutoPlaying ? "AUTO" : "PAUSED"}</span>
              </button>

              <button
                onClick={() =>
                  setActiveFeatureIndex((prev) => (prev - 1 + features.length) % features.length)
                }
                className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="Previous Feature"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setActiveFeatureIndex((prev) => (prev + 1) % features.length)}
                className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="Next Feature"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Feature Matrix Chips (Direct access to all 18 features) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {features.map((feat, idx) => {
              const isSelected = activeFeatureIndex === idx;
              const isCompanion = companionFeatureIndex === idx;
              return (
                <button
                  key={feat.number}
                  onClick={() => {
                    setActiveFeatureIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    "p-2 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-16 relative overflow-hidden group",
                    isSelected
                      ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50"
                      : isCompanion
                      ? "bg-sky-950/20 border-sky-500/30 text-slate-300"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[10px] font-bold text-sky-400">
                      {feat.number}
                    </span>
                    <span className="text-[10px] opacity-70 group-hover:opacity-100 transition">
                      {feat.icon}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium leading-tight truncate">
                    {feat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Final Brand Footer Seal */}
          <div className="pt-2 text-center border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <span className="tracking-widest uppercase">
              ALL 19 CAPABILITIES SYNCED TO QUANTUM CORE ENGINE
            </span>
            <span className="text-sky-400 font-bold tracking-wider">
              QUANTUM — YOUR ARC, IN YOUR POCKET.
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          MOTIVATIONAL INTERVENTION VIDEO MODAL (Feature 13)
          ============================================================ */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-sky-500/40 p-5 shadow-[0_0_50px_rgba(56,189,248,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PlayCircle size={18} className="text-sky-400" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  MOTIVATIONAL INTERVENTION • EMERGENCY RECOVERY
                </span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <video
                src="/assets/videos/motivational_1.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs font-mono text-slate-400 text-center italic">
              &ldquo;Boss, your consistency dropped this week. The Arc isn&apos;t over. Get back in.&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          COMMITMENT CONTRACT PREVIEW MODAL (Feature 18)
          ============================================================ */}
      {contractModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-sky-500/40 p-5 shadow-[0_0_50px_rgba(56,189,248,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-sky-400" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  QUANTUM 90-DAY COMMITMENT COVENANT
                </span>
              </div>
              <button
                onClick={() => setContractModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-4 text-xs font-mono space-y-3">
              <div className="flex justify-between items-center text-[10px] text-sky-400 border-b border-slate-800 pb-2">
                <span>CONTRACT NO: #QC-90D-2026-SEALED</span>
                <span>STATUS: ACTIVE & EXECUTED</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                &ldquo;I hereby commit to 90 consecutive days of unwavering focus, intense execution, and relentless self-discipline under the Quantum Winter Arc protocol. No zero days. No excuses.&rdquo;
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span>AUTHORITY: QUANTUM CORE DISCIPLINE</span>
                <span className="text-emerald-400 font-bold">CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setContractModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          CERTIFICATE OF COMPLETION PREVIEW MODAL (Feature 19)
          ============================================================ */}
      {certificateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-sky-500/40 p-5 shadow-[0_0_50px_rgba(56,189,248,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-sky-400" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  QUANTUM 90-DAY COMPLETION CERTIFICATE
                </span>
              </div>
              <button
                onClick={() => setCertificateModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-sky-400/30 bg-white p-4 shadow-xl">
              <div className="relative w-full aspect-[1.414/1] max-h-[380px]">
                <Image
                  src="/assets/images/certificate/certificate.png"
                  alt="Quantum 90-Day Completion Certificate"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-mono text-slate-400">
                VERIFIED BY QUANTUM ARCHITECTURE • HIGH-RES A4 PRINT READY
              </span>
              <div className="flex gap-2">
                <a
                  href="/assets/images/certificate/certificate.png"
                  download="QUANTUM_90_DAY_COMPLETION_CERTIFICATE.png"
                  className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 font-mono text-xs flex items-center gap-1.5 transition"
                >
                  <Download size={14} />
                  <span>DOWNLOAD A4</span>
                </a>
                <button
                  onClick={() => setCertificateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuantumMobileExperience;
