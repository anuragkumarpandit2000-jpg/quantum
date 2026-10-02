/**
 * QUANTUM // MOTIVATION & CONSISTENCY EVALUATOR
 * Analyzes real user habit completion records to detect struggle states,
 * broken streaks, and consistency drops without fabricated data.
 */

export interface HabitCompletionRecord {
  id?: string;
  habitId?: string;
  dayNumber: number;
  status: "COMPLETED" | "MISSED" | "PENDING";
}

export interface HabitRecord {
  id: string;
  title: string;
  completions: HabitCompletionRecord[];
}

export interface StreakRecord {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDay?: number;
  consistencyRate?: number;
}

export interface StruggleAnalysis {
  isStruggling: boolean;
  reason: "CONSECUTIVE_MISSED" | "STREAK_BROKEN" | "CONSISTENCY_DROP" | null;
  consecutiveMissedDays: number;
  lastMissedDay: number;
  brokenStreakLength: number;
  currentStreak: number;
  longestStreak: number;
  consistencyRate: number;
  signature: string;
  title: string;
  subtitle: string;
}

export const MOTIVATION_CONFIG = {
  // At least 2 consecutive missed days required to trigger
  // (Prevents annoying user on a single accidental click)
  MIN_CONSECUTIVE_MISSED_DAYS: 2,
  // Breaking a streak of 3 or more consecutive completed days
  MIN_BROKEN_STREAK_THRESHOLD: 3,
  // Consistency rate drop threshold (in percent)
  CONSISTENCY_DROP_THRESHOLD: 20,
  // Minimum hours before an intervention can trigger again
  COOLDOWN_HOURS: 12,
};

/**
 * Evaluates real habit activity and determines if a motivational intervention is warranted.
 */
export function evaluateUserConsistency(
  habits: HabitRecord[],
  streak: StreakRecord | null
): StruggleAnalysis {
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;

  // Aggregate completion data by dayNumber (1..90)
  const dayStats = new Map<
    number,
    { completed: number; missed: number; pending: number }
  >();

  habits.forEach((habit) => {
    habit.completions?.forEach((comp) => {
      const day = comp.dayNumber;
      if (!dayStats.has(day)) {
        dayStats.set(day, { completed: 0, missed: 0, pending: 0 });
      }
      const entry = dayStats.get(day)!;
      if (comp.status === "COMPLETED") entry.completed++;
      else if (comp.status === "MISSED") entry.missed++;
      else entry.pending++;
    });
  });

  // Identify active days (days with at least one completed or missed habit)
  const activeDays = Array.from(dayStats.keys())
    .filter((day) => {
      const stat = dayStats.get(day);
      return stat && (stat.completed > 0 || stat.missed > 0);
    })
    .sort((a, b) => a - b);

  if (activeDays.length === 0) {
    return {
      isStruggling: false,
      reason: null,
      consecutiveMissedDays: 0,
      lastMissedDay: 0,
      brokenStreakLength: 0,
      currentStreak,
      longestStreak,
      consistencyRate: 0,
      signature: "",
      title: "",
      subtitle: "",
    };
  }

  // Calculate consistency rate across active days
  let totalCompletions = 0;
  let totalMisses = 0;
  let latestActiveDay = activeDays[activeDays.length - 1];

  activeDays.forEach((day) => {
    const s = dayStats.get(day)!;
    totalCompletions += s.completed;
    totalMisses += s.missed;
  });

  const totalLogged = totalCompletions + totalMisses;
  const consistencyRate =
    totalLogged > 0 ? Math.round((totalCompletions / totalLogged) * 100) : 0;

  // Check 1: Consecutive missed days leading up to latest activity
  let consecutiveMissedDays = 0;
  let lastMissedDay = 0;

  for (let i = activeDays.length - 1; i >= 0; i--) {
    const day = activeDays[i];
    const s = dayStats.get(day)!;
    // A day is considered missed if there are missed habits and zero completions
    if (s.missed > 0 && s.completed === 0) {
      consecutiveMissedDays++;
      if (lastMissedDay === 0) lastMissedDay = day;
    } else if (s.completed > 0) {
      break;
    }
  }

  // Check 2: Meaningful streak broken
  // If the user previously had a streak >= MIN_BROKEN_STREAK_THRESHOLD,
  // but now currentStreak === 0 and the latest day had misses
  const latestStat = dayStats.get(latestActiveDay);
  const isLatestDayMissed = (latestStat?.missed ?? 0) > 0;
  const isStreakBroken =
    longestStreak >= MOTIVATION_CONFIG.MIN_BROKEN_STREAK_THRESHOLD &&
    currentStreak === 0 &&
    isLatestDayMissed;

  // Check 3: Significant recent consistency drop
  // Look at last 5 active days vs previous active days
  let isConsistencyDrop = false;
  if (activeDays.length >= 5) {
    const recentDays = activeDays.slice(-3);
    let recentCompleted = 0;
    let recentTotal = 0;
    recentDays.forEach((d) => {
      const s = dayStats.get(d)!;
      recentCompleted += s.completed;
      recentTotal += s.completed + s.missed;
    });
    const recentRate =
      recentTotal > 0 ? Math.round((recentCompleted / recentTotal) * 100) : 0;
    if (consistencyRate - recentRate >= MOTIVATION_CONFIG.CONSISTENCY_DROP_THRESHOLD && recentRate < 50) {
      isConsistencyDrop = true;
    }
  }

  // Determine if struggle state triggered
  let isStruggling = false;
  let reason: "CONSECUTIVE_MISSED" | "STREAK_BROKEN" | "CONSISTENCY_DROP" | null = null;
  let title = "YOU BROKE THE STREAK.";
  let subtitle = "BUT THE ARC ISN'T OVER.";

  if (consecutiveMissedDays >= MOTIVATION_CONFIG.MIN_CONSECUTIVE_MISSED_DAYS) {
    isStruggling = true;
    reason = "CONSECUTIVE_MISSED";
    title = `${consecutiveMissedDays} DAYS OFF THE LINE.`;
    subtitle = "THE WINTER ARC DOES NOT BEND TO COMFORT. RE-LOCK YOUR FOCUS.";
  } else if (isStreakBroken) {
    isStruggling = true;
    reason = "STREAK_BROKEN";
    title = `A ${longestStreak}-DAY STREAK BROKE.`;
    subtitle = "MOMENTUM IS BUILT ONE REP AT A TIME. DO NOT SURRENDER THE ARC.";
  } else if (isConsistencyDrop) {
    isStruggling = true;
    reason = "CONSISTENCY_DROP";
    title = "CONSISTENCY VECTOR FALLING.";
    subtitle = "FRICTION IS RISING. CRUSH HESITATION AND RETURN TO EXECUTION.";
  }

  const signature = `struggle_${reason}_day${lastMissedDay || latestActiveDay}_c${consecutiveMissedDays}`;

  return {
    isStruggling,
    reason,
    consecutiveMissedDays,
    lastMissedDay: lastMissedDay || latestActiveDay,
    brokenStreakLength: longestStreak,
    currentStreak,
    longestStreak,
    consistencyRate,
    signature,
    title,
    subtitle,
  };
}

/**
 * Checks if the intervention has already been acknowledged or is in cooldown.
 */
export function hasAcknowledgedIntervention(signature: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const lastSig = localStorage.getItem("quantum_last_intervention_signature");
    const lastTime = localStorage.getItem("quantum_last_intervention_time");
    if (lastSig === signature) return true;

    if (lastTime) {
      const elapsedHours = (Date.now() - parseInt(lastTime, 10)) / (1000 * 60 * 60);
      if (elapsedHours < MOTIVATION_CONFIG.COOLDOWN_HOURS) {
        return true;
      }
    }
  } catch {
    // LocalStorage unavailable
  }
  return false;
}

/**
 * Records an acknowledged intervention in localStorage.
 */
export function markInterventionAcknowledged(signature: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("quantum_last_intervention_signature", signature);
    localStorage.setItem("quantum_last_intervention_time", String(Date.now()));
  } catch {
    // LocalStorage unavailable
  }
}
