import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

export function formatXP(xp: number): string {
  return new Intl.NumberFormat("en-US").format(xp);
}

export interface WinterArcMilestone {
  level: number;
  minDays: number;
  nextDays: number;
  tier: string;
  title: string;
  quote: string;
  badgeColor: string;
}

/**
 * EXACT USER SPECIFICATION:
 * Day 1 consistent  -> Level 1 (with animation)
 * Day 7 consistent  -> Level 2 (with animation)
 * Day 14 consistent -> Level 3 (with animation)
 * Day 25 consistent -> Level 4 (with animation)
 * Day 30 consistent -> Level 5 (with animation)
 * Day 45 consistent -> Level 6 (with animation)
 * Day 52 consistent -> Level 7 (with animation)
 * Day 65 consistent -> Level 8 (with animation)
 * Day 75 consistent -> Level 9 (with animation)
 * Day 90 consistent -> Level 10 (Apex Arc Master)
 */
export const WINTER_ARC_MILESTONES: WinterArcMilestone[] = [
  {
    level: 1,
    minDays: 1,
    nextDays: 7,
    tier: "Initiate Tier I",
    title: "Quantum Induction",
    quote: "Day 01 sealed. The Winter Arc transformation commences.",
    badgeColor: "#38bdf8",
  },
  {
    level: 2,
    minDays: 7,
    nextDays: 14,
    tier: "Discipline Neophyte",
    title: "Obsidian Persistence",
    quote: "Day 07 unlocked. 1 Full week of continuous, unbroken consistency.",
    badgeColor: "#06b6d4",
  },
  {
    level: 3,
    minDays: 14,
    nextDays: 25,
    tier: "Kinetic Operator",
    title: "Habit Fortress",
    quote: "Day 14 reached. Two full weeks of continuous execution.",
    badgeColor: "#818cf8",
  },
  {
    level: 4,
    minDays: 25,
    nextDays: 30,
    tier: "Focus Vanguard",
    title: "Dopamine Sovereign",
    quote: "Day 25 continuous execution. Distractions permanently neutralized.",
    badgeColor: "#a855f7",
  },
  {
    level: 5,
    minDays: 30,
    nextDays: 45,
    tier: "Quantum Adept",
    title: "Apex Inductor",
    quote: "Day 30 complete! 1/3 of the Winter Arc conquered. Identity rewritten.",
    badgeColor: "#3b82f6",
  },
  {
    level: 6,
    minDays: 45,
    nextDays: 52,
    tier: "Habit Titan",
    title: "Iron Fortitude",
    quote: "Day 45 unlocked! Halfway milestone through the 90-day gauntlet.",
    badgeColor: "#10b981",
  },
  {
    level: 7,
    minDays: 52,
    nextDays: 65,
    tier: "Arc Master",
    title: "Sovereign Disciplinarian",
    quote: "Day 52 reached. Deep neuroplastic discipline crystallized into instinct.",
    badgeColor: "#f59e0b",
  },
  {
    level: 8,
    minDays: 65,
    nextDays: 75,
    tier: "Apex Sentinel",
    title: "Master of Execution",
    quote: "Day 65 unbroken. The physical and mental transformation is undeniable.",
    badgeColor: "#f97316",
  },
  {
    level: 9,
    minDays: 75,
    nextDays: 90,
    tier: "Obsidian Sovereign",
    title: "The Final Crucible",
    quote: "Day 75 milestone! Inching towards legendary completion of the Winter Arc.",
    badgeColor: "#ec4899",
  },
  {
    level: 10,
    minDays: 90,
    nextDays: 90,
    tier: "Ascended Vanguard",
    title: "Apex Arc Completion",
    quote: "Day 90 Absolute Mastery. You have conquered the Winter Arc!",
    badgeColor: "#e11d48",
  },
];

export function calculateLevel(
  xpOrStreak: number,
  streakFallback?: number
): {
  level: number;
  tier: string;
  nextLevelXP: number;
  progressPercent: number;
  minDays: number;
  nextDays: number;
  title: string;
  quote: string;
  badgeColor: string;
} {
  // Use streak for precise Winter Arc level ladder if provided, otherwise support both
  const streak = typeof streakFallback === "number" ? streakFallback : xpOrStreak;
  const s = Math.max(0, streak);

  let m = WINTER_ARC_MILESTONES[0];
  if (s >= 90) m = WINTER_ARC_MILESTONES[9];
  else if (s >= 75) m = WINTER_ARC_MILESTONES[8];
  else if (s >= 65) m = WINTER_ARC_MILESTONES[7];
  else if (s >= 52) m = WINTER_ARC_MILESTONES[6];
  else if (s >= 45) m = WINTER_ARC_MILESTONES[5];
  else if (s >= 30) m = WINTER_ARC_MILESTONES[4];
  else if (s >= 25) m = WINTER_ARC_MILESTONES[3];
  else if (s >= 14) m = WINTER_ARC_MILESTONES[2];
  else if (s >= 7) m = WINTER_ARC_MILESTONES[1];
  else m = WINTER_ARC_MILESTONES[0];

  let progressPercent = 0;
  if (m.level === 10) {
    progressPercent = 100;
  } else {
    const range = m.nextDays - m.minDays;
    const progress = Math.max(0, s - m.minDays);
    progressPercent = Math.min(100, Math.round((progress / Math.max(range, 1)) * 100));
  }

  return {
    level: m.level,
    tier: m.tier,
    nextLevelXP: m.nextDays * 100,
    progressPercent,
    minDays: m.minDays,
    nextDays: m.nextDays,
    title: m.title,
    quote: m.quote,
    badgeColor: m.badgeColor,
  };
}
