"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Check, X, Trash2, Zap, Flame, Trophy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export interface HabitCompletionItem {
  id: string;
  dayNumber: number;
  status: "PENDING" | "COMPLETED" | "MISSED";
}

export interface HabitItem {
  id: string;
  title: string;
  category: string;
  color: string;
  icon: string;
  completions: HabitCompletionItem[];
}

interface HabitMatrixProps {
  initialHabits: HabitItem[];
  onStatsUpdate?: (newXP: number, currentStreak: number, consistencyRate?: number, isLevelUp?: boolean, milestone?: any) => void;
  onHabitsChange?: (updatedHabits: HabitItem[]) => void;
  className?: string;
}

export const HabitMatrix: React.FC<HabitMatrixProps> = ({
  initialHabits,
  onStatsUpdate,
  onHabitsChange,
  className,
}) => {
  const [habits, setHabits] = useState<HabitItem[]>(initialHabits);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Core Discipline");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clickTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const longPressTimerRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const isLongPressRef = useRef<{ [key: string]: boolean }>({});

  // 90 Day Array: 1..90
  const days = Array.from({ length: 90 }, (_, i) => i + 1);

  // Long-press detection for touch devices (Requirement 46)
  const handleTouchStart = (habitId: string, dayNumber: number, currentStatus: string) => {
    const key = `${habitId}-${dayNumber}`;
    isLongPressRef.current[key] = false;
    longPressTimerRef.current[key] = setTimeout(() => {
      isLongPressRef.current[key] = true;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try { navigator.vibrate(40); } catch {}
      }
      updateCompletion(habitId, dayNumber, currentStatus === "MISSED" ? "PENDING" : "MISSED");
    }, 450);
  };

  const handleTouchEnd = (habitId: string, dayNumber: number) => {
    const key = `${habitId}-${dayNumber}`;
    if (longPressTimerRef.current[key]) {
      clearTimeout(longPressTimerRef.current[key]);
      delete longPressTimerRef.current[key];
    }
  };

  // Handle Box Click Logic (Desktop click/double-click + touch tap)
  const handleBoxClick = (habitId: string, dayNumber: number, currentStatus: string) => {
    const key = `${habitId}-${dayNumber}`;
    if (isLongPressRef.current[key]) {
      isLongPressRef.current[key] = false;
      return;
    }

    if (clickTimeoutRef.current[key]) {
      // Double Click Detected! -> Set to MISSED
      clearTimeout(clickTimeoutRef.current[key]);
      delete clickTimeoutRef.current[key];
      updateCompletion(habitId, dayNumber, currentStatus === "MISSED" ? "PENDING" : "MISSED");
    } else {
      // Wait to see if second click occurs
      clickTimeoutRef.current[key] = setTimeout(() => {
        delete clickTimeoutRef.current[key];
        // Single Click -> Set to COMPLETED
        updateCompletion(habitId, dayNumber, currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED");
      }, 250);
    }
  };

  const updateCompletion = async (habitId: string, dayNumber: number, targetStatus: "PENDING" | "COMPLETED" | "MISSED") => {
    // Optimistic UI Update
    setHabits((prevHabits) => {
      const updated = prevHabits.map((h) => {
        if (h.id !== habitId) return h;
        const updatedCompletions = h.completions.map((c) =>
          c.dayNumber === dayNumber ? { ...c, status: targetStatus } : c
        );
        return { ...h, completions: updatedCompletions };
      });
      onHabitsChange?.(updated);
      return updated;
    });

    if (targetStatus === "COMPLETED") {
      // Fire confetti burst on completion
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#38bdf8", "#22d3ee", "#ffffff"],
      });
    }

    try {
      const res = await fetch(`/api/habits/${habitId}/completion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber, status: targetStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (onStatsUpdate && data.totalXP !== undefined) {
          onStatsUpdate(
            data.totalXP,
            data.currentStreak,
            data.consistencyRate,
            data.isLevelUp,
            data.milestone
          );
        }
      }
    } catch (err) {
      console.error("Failed to sync completion with database", err);
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory.trim(),
          color: "#38bdf8",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHabits((prev) => {
          const next = [...prev, data.habit];
          onHabitsChange?.(next);
          return next;
        });
        setNewTitle("");
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to create habit", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to remove this habit? All 90-day progress will be permanently erased.")) return;

    setHabits((prev) => {
      const next = prev.filter((h) => h.id !== habitId);
      onHabitsChange?.(next);
      return next;
    });
    try {
      await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete habit", err);
    }
  };

  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Header controls & instructions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/40 border border-white/10 p-4 rounded-xl backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-heading">
              <span className="text-sky-400">90-DAY</span> HABIT MATRIX
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-[11px] font-mono">
              WINTER ARC
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1.5">
            <Info size={13} className="text-sky-400 shrink-0" />
            <span>Single Click = Completed (✓) | Double Click = Missed (✕) | Re-click = Neutral (□)</span>
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="quantum"
          size="sm"
          className="gap-2 shadow-lg"
        >
          <Plus size={16} /> ADD HABIT
        </Button>
      </div>

      {/* Main 90-Day Horizontal Scroll Matrix */}
      <div className="relative border border-white/10 rounded-xl bg-slate-950/30 shadow-2xl overflow-hidden backdrop-blur-2xl">
        <div className="overflow-x-auto matrix-scrollbar max-w-full">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/40">
                {/* Fixed Sticky Left Header for Habit Name */}
                <th className="sticky left-0 z-30 bg-slate-950/80 backdrop-blur-xl px-4 py-3 text-xs font-mono font-bold tracking-wider text-sky-400 uppercase min-w-[200px] border-r border-white/10 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
                  DAY →
                </th>

                {/* 90 Column Day Headers with Phase Dividers */}
                {days.map((day) => {
                  const isPhaseEnd = day === 30 || day === 60 || day === 90;
                  return (
                    <th
                      key={day}
                      className={cn(
                        "px-1 py-3 text-center text-[11px] font-mono font-bold text-slate-400 min-w-[44px] max-w-[44px] border-r border-slate-800/40 select-none",
                        isPhaseEnd ? "border-r-2 border-r-sky-400/60 bg-sky-950/20" : ""
                      )}
                    >
                      <span className={cn(day <= 14 ? "text-sky-300 font-extrabold" : "")}>
                        {String(day).padStart(2, "0")}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={91} className="py-12 text-center text-slate-500 font-mono text-sm">
                    YOUR ARC STARTS WITH ONE HABIT. CLICK &quot;+ ADD HABIT&quot; TO BEGIN.
                  </td>
                </tr>
              ) : (
                habits.map((habit, idx) => {
                  const completionsMap = new Map(
                    habit.completions.map((c) => [c.dayNumber, c.status])
                  );

                  return (
                    <tr
                      key={habit.id}
                      className={cn(
                        "border-b border-white/5 hover:bg-sky-500/10 transition-colors group",
                        idx % 2 === 0 ? "bg-slate-950/20" : "bg-transparent"
                      )}
                    >
                      {/* Sticky Left Column for Habit Name & Actions */}
                      <td className="sticky left-0 z-20 bg-slate-950/85 backdrop-blur-xl px-4 py-3 border-r border-white/10 min-w-[200px] shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate">
                            <div className="font-bold text-xs tracking-wide text-white group-hover:text-sky-300 transition-colors truncate">
                              {habit.title}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 truncate">
                              {habit.category}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-red-400"
                            title="Remove Habit"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                      {/* 90 Individual Day Boxes */}
                      {days.map((day) => {
                        const status = completionsMap.get(day) || "PENDING";
                        const isPhaseEnd = day === 30 || day === 60 || day === 90;

                        return (
                          <td
                            key={day}
                            className={cn(
                              "p-0.5 text-center border-r border-slate-800/40 min-w-[44px] max-w-[44px]",
                              isPhaseEnd ? "border-r-2 border-r-sky-400/60" : ""
                            )}
                          >
                            <button
                              onClick={() => handleBoxClick(habit.id, day, status)}
                              onTouchStart={() => handleTouchStart(habit.id, day, status)}
                              onTouchEnd={() => handleTouchEnd(habit.id, day)}
                              onTouchCancel={() => handleTouchEnd(habit.id, day)}
                              aria-label={`Habit: ${habit.title}, Day ${day}: ${status}. Tap to complete, long-press to mark missed.`}
                              className={cn(
                                "w-8 h-8 sm:w-7 sm:h-7 mx-auto rounded-md flex items-center justify-center transition-all duration-150 text-xs font-bold border touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                                status === "COMPLETED" &&
                                  "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)] hover:bg-emerald-500/30",
                                status === "MISSED" &&
                                  "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)] hover:bg-red-500/30",
                                status === "PENDING" &&
                                  "bg-slate-900/60 border-slate-800 text-slate-600 hover:border-sky-500/50 hover:text-slate-400"
                              )}
                              title={`Day ${day}: ${status} (Tap: Complete, Long-press/Double Click: Missed)`}
                            >
                              {status === "COMPLETED" && <Check size={14} className="stroke-[3]" />}
                              {status === "MISSED" && <X size={14} className="stroke-[3]" />}
                              {status === "PENDING" && (
                                <span className="opacity-0 hover:opacity-100 text-[10px] font-mono text-sky-400">
                                  +
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="text-sky-400 size-5" /> CREATE NEW ARC HABIT
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">HABIT TITLE</label>
                <Input
                  placeholder="e.g. 5 AM RUNNING, BLENDER 3D, NO SUGAR"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-900/50 border-white/10"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-11 rounded-lg border border-white/10 bg-slate-900/60 px-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Core Discipline">Core Discipline</option>
                  <option value="Physical Power">Physical Power</option>
                  <option value="Intellectual Mastery">Intellectual Mastery</option>
                  <option value="Creative Production">Creative Production</option>
                  <option value="Dopamine Reset">Dopamine Reset</option>
                </select>
              </div>

              <div className="p-3 bg-sky-950/20 border border-sky-500/20 rounded-lg text-xs font-mono text-sky-300">
                ⚡ Creating this habit will automatically generate 90 individual tracking boxes aligned with Day 01 → Day 90.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cool"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Generating 90 Days..." : "Commit Habit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitMatrix;
