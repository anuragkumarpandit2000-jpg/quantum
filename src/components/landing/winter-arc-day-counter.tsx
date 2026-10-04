"use client";

import React, { useState, useEffect } from "react";
import { Flame, Calendar, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WinterArcStats {
  status: "pre-launch" | "active" | "completed";
  currentDay: number;
  totalDays: number;
  daysRemaining: number;
  percentage: number;
  dayText: string;
  remainingText: string;
  statusLabel: string;
}

export function calculateWinterArc(date: Date = new Date()): WinterArcStats {
  const year = date.getFullYear();
  const totalDays = 92; // October (31) + November (30) + December (31) = 92 days

  // Fixed Winter Arc Dates: Oct 1 00:00:00 to Dec 31 23:59:59.999 in user's local timezone
  const arcStart = new Date(year, 9, 1, 0, 0, 0, 0); // Month 9 is October
  const arcEnd = new Date(year, 11, 31, 23, 59, 59, 999); // Month 11 is December
  const todayStart = new Date(year, date.getMonth(), date.getDate(), 0, 0, 0, 0);

  if (date < arcStart) {
    const daysUntilStart = Math.ceil((arcStart.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "pre-launch",
      currentDay: 0,
      totalDays,
      daysRemaining: totalDays,
      percentage: 0,
      dayText: "DAY 0 OF 92",
      remainingText: `${daysUntilStart} DAYS UNTIL LAUNCH`,
      statusLabel: "WINTER ARC PRE-LAUNCH",
    };
  } else if (date > arcEnd) {
    return {
      status: "completed",
      currentDay: totalDays,
      totalDays,
      daysRemaining: 0,
      percentage: 100,
      dayText: "DAY 92 OF 92",
      remainingText: "WINTER ARC COMPLETED",
      statusLabel: "WINTER ARC COMPLETED",
    };
  } else {
    // Active between Oct 1 and Dec 31
    // Oct 1 = Day 1, Oct 2 = Day 2, Oct 4 = Day 4, Dec 31 = Day 92
    const diffDays = Math.floor((todayStart.getTime() - arcStart.getTime()) / (1000 * 60 * 60 * 24));
    const currentDay = Math.min(totalDays, Math.max(1, diffDays + 1));
    const daysRemaining = Math.max(0, totalDays - currentDay);
    const percentage = Number(((currentDay / totalDays) * 100).toFixed(1));

    return {
      status: "active",
      currentDay,
      totalDays,
      daysRemaining,
      percentage,
      dayText: `DAY ${currentDay} OF ${totalDays}`,
      remainingText: `${daysRemaining} DAYS REMAINING`,
      statusLabel: "WINTER ARC IS LIVE",
    };
  }
}

export const WinterArcDayCounter: React.FC<{ className?: string }> = ({ className }) => {
  const [stats, setStats] = useState<WinterArcStats>(() => calculateWinterArc(new Date()));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateStats = () => {
      setStats(calculateWinterArc(new Date()));
    };

    updateStats();

    // Calculate milliseconds until next midnight to update immediately when date flips
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      updateStats();
    }, msUntilMidnight);

    // Also poll every 30 seconds to catch system wake/time changes
    const interval = setInterval(updateStats, 30000);

    return () => {
      clearTimeout(midnightTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono shadow-inner transition-all",
        className
      )}
    >
      {/* Header Row: Label & Days Remaining */}
      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
        <span className="text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Flame size={15} className="text-sky-400 animate-pulse" />
          <span>NUMBER OF DAYS LEFT:</span>
        </span>
        <span className="text-sky-300 font-extrabold text-sm sm:text-base tracking-wider drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
          {stats.remainingText}
        </span>
      </div>

      {/* Progress Bar & Day Counter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-300 font-bold">
          <span className="text-white tracking-wide">{stats.dayText}</span>
          <span className="text-emerald-400 font-mono">
            {stats.percentage}% COMPLETED
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
            style={{ width: `${Math.min(100, Math.max(stats.status === "completed" ? 100 : 2, stats.percentage))}%` }}
          />
        </div>
      </div>

      {/* Fixed Winter Arc Dates Information */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2.5 border-t border-slate-800/80 flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-normal">STARTING:</span>
          <span className="text-sky-400 font-bold">1 OCTOBER</span>
        </div>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-normal">ENDING:</span>
          <span className="text-sky-400 font-bold">31 DECEMBER</span>
        </div>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <div className="text-amber-300 font-semibold tracking-wider">
          92-DAY PROTOCOL
        </div>
      </div>

      {/* Subtle Explanatory Subtext */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] text-slate-500 pt-1.5 border-t border-slate-800/40 gap-1 leading-normal font-sans">
        <span className="font-mono text-slate-400">DAY RESETS AT 12:00 AM</span>
        <span>Daily progress is calculated from your local time.</span>
      </div>
    </div>
  );
};

export default WinterArcDayCounter;
