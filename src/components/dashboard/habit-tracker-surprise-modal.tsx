"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Lock,
  Sparkles,
  Download,
  Printer,
  X,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  Shield,
  Eye,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { Button, LiquidButton } from "@/components/ui/button";
import confetti from "canvas-confetti";
import PhysicalHabitTracker from "@/components/onboarding/physical-habit-tracker";

interface HabitTrackerSurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHabits?: string[];
  userName?: string;
  forceOpenUnsealed?: boolean;
}

export const HabitTrackerSurpriseModal: React.FC<HabitTrackerSurpriseModalProps> = ({
  isOpen,
  onClose,
  selectedHabits = [],
  userName = "Challenger",
  forceOpenUnsealed = false,
}) => {
  const [isUnsealed, setIsUnsealed] = useState<boolean>(forceOpenUnsealed);
  const [isOpening, setIsOpening] = useState<boolean>(false);

  useEffect(() => {
    if (forceOpenUnsealed) {
      setIsUnsealed(true);
    }
  }, [forceOpenUnsealed]);

  if (!isOpen) return null;

  const handleUnseal = () => {
    setIsOpening(true);

    // Multi-burst confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#22d3ee", "#34d399", "#f59e0b", "#ffffff"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.6 },
          colors: ["#38bdf8", "#22d3ee", "#ffffff"],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.6 },
          colors: ["#38bdf8", "#22d3ee", "#ffffff"],
        });
      }, 200);
    } catch {}

    setTimeout(() => {
      setIsOpening(false);
      setIsUnsealed(true);
    }, 600);
  };

  const handleDismiss = () => {
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-5xl my-auto">
        <AnimatePresence mode="wait">
          {!isUnsealed ? (
            /* =========================================================================
               STATE 1: THE MYSTERY SURPRISE VAULT (CLICK TO OPEN)
               ========================================================================= */
            <motion.div
              key="sealed-vault"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-lg rounded-3xl bg-slate-950/90 border border-sky-500/40 p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(56,189,248,0.25)] backdrop-blur-2xl overflow-hidden"
            >
              {/* Ambient radial glows */}
              <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

              {/* Close / Skip button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Dismiss"
              >
                <X size={18} />
              </button>

              {/* Mystery Gift Container Graphic */}
              <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                {/* Pulsing Outer Rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-3xl border border-sky-400/40 bg-sky-500/10 shadow-[0_0_35px_rgba(56,189,248,0.35)]"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-2xl border border-dashed border-cyan-400/30"
                />

                {/* Center Icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/50">
                  {isOpening ? (
                    <Sparkles size={32} className="animate-spin text-slate-950" />
                  ) : (
                    <Gift size={32} className="text-slate-950 animate-bounce" />
                  )}
                </div>
              </div>

              {/* Badges & Titles */}
              <div className="space-y-3 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 font-mono text-[11px] font-bold tracking-widest uppercase">
                  <Sparkles size={12} className="text-sky-400" />
                  <span>SPECIAL INDUCTION DISPATCH</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  A SURPRISE HAS ARRIVED FOR YOU
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed max-w-sm mx-auto">
                  A confidential physical accountability asset has been unlocked for your 90-Day Winter Arc. Click below to unseal your delivery.
                </p>
              </div>

              {/* THE BUTTON: CLICK TO OPEN */}
              <div className="space-y-3">
                <Button
                  onClick={handleUnseal}
                  disabled={isOpening}
                  size="lg"
                  className="w-full py-6 text-sm font-mono font-black tracking-widest uppercase bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 rounded-xl shadow-[0_0_35px_rgba(56,189,248,0.6)] hover:shadow-[0_0_50px_rgba(56,189,248,0.85)] transition-all duration-300 border-none flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Gift size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>{isOpening ? "UNSEALING REWARD..." : "CLICK TO OPEN"}</span>
                  <Flame size={18} className="text-amber-600 animate-pulse" />
                </Button>

                <div className="text-[10px] font-mono text-slate-500">
                  SECURE CRYPTOGRAPHIC PROTOCOL • INDUCTION GIFT
                </div>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               STATE 2: THE UNSEALED REVEAL (THE HABIT TRACKER SHEET)
               ========================================================================= */
            <motion.div
              key="revealed-sheet"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-3xl bg-slate-950/95 border border-sky-500/40 p-5 sm:p-8 shadow-[0_0_80px_rgba(56,189,248,0.2)] backdrop-blur-2xl space-y-6"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider block">
                      SURPRISE UNLOCKED • INDUCTION WEAPON
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      OFFICIAL 90-DAY PHYSICAL HABIT TRACKER
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Habit Tracker Presentation Component */}
              <PhysicalHabitTracker
                selectedHabits={selectedHabits}
                userName={userName}
              />

              {/* Bottom Confirm & Enter Dashboard Button */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-mono text-slate-400 text-center sm:text-left">
                  Print this sheet in A4 landscape, pin it in sight, and tick every single day with ink.
                </p>

                <Button
                  onClick={handleDismiss}
                  variant="quantum"
                  size="default"
                  className="w-full sm:w-auto font-mono text-xs font-bold gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
                >
                  <span>I&apos;M LOCKED IN — ENTER COMMAND CENTER</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitTrackerSurpriseModal;
