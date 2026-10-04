export interface SovereignBadge {
  id: "admin-prime" | "level-10-mythic" | "level-9-titan" | "level-5-centurion";
  name: string;
  codename: string;
  subtitle: string;
  tier: string;
  rarityLabel: string;
  capacity: number;
  currentClaimed: number;
  remainingSlots: number;
  criteria: string;
  xpThreshold: number;
  daysThreshold: number;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  glowColor: string;
  iconName: "crown" | "gem" | "flame" | "shield";
  isExclusiveAdmin: boolean;
  perks: string[];
}

export const SOVEREIGN_BADGES: Record<string, SovereignBadge> = {
  "admin-prime": {
    id: "admin-prime",
    name: "FOUNDER & SUPREME ARCHITECT",
    codename: "ARCHITECT_PRIME_001",
    subtitle: "GENESIS CREATOR • IMMUTABLE 1 OF 1",
    tier: "SUPREME OMNI TIER",
    rarityLabel: "UNIQUE // 1 OF 1 IN EXISTENCE",
    capacity: 1,
    currentClaimed: 1,
    remainingSlots: 0,
    criteria: "Exclusive to Anurag Pandit (Lead Architect & Founder). Absolute genesis authority across all Quantum sub-systems.",
    xpThreshold: 0,
    daysThreshold: 0,
    accentColor: "#fbbf24", // Golden Amber
    borderColor: "rgba(251, 191, 36, 0.8)",
    bgGradient: "from-amber-500/25 via-rose-500/15 to-cyan-500/25",
    glowColor: "rgba(251, 191, 36, 0.75)",
    iconName: "crown",
    isExclusiveAdmin: true,
    perks: [
      "Omni-access Genesis Protocol Authority",
      "Immutable 1 of 1 Gold Prismatic Aura",
      "Universal verification endorsement rights",
      "Zero reset buffer override capability",
    ],
  },
  "level-10-mythic": {
    id: "level-10-mythic",
    name: "GENESIS MYTHIC TEN",
    codename: "APEX_SOVEREIGN_10",
    subtitle: "THE OLYMPIAN 10 • APEX SOVEREIGN",
    tier: "MYTHIC ASCENDANT TIER",
    rarityLabel: "LIMITED // FIRST 10 PLAYERS ONLY",
    capacity: 10,
    currentClaimed: 0,
    remainingSlots: 10,
    criteria: "Reserved exclusively for the FIRST 10 Challengers in history to reach Level 10 by completing all 90 consecutive days of the Winter Arc gauntlet with 25,000+ XP.",
    xpThreshold: 25000,
    daysThreshold: 90,
    accentColor: "#facc15", // Extreme Gold
    borderColor: "rgba(250, 204, 21, 0.8)",
    bgGradient: "from-yellow-500/25 via-amber-600/20 to-sky-400/25",
    glowColor: "rgba(250, 204, 21, 0.65)",
    iconName: "gem",
    isExclusiveAdmin: false,
    perks: [
      "First 10 immortal podium roster in Hall of Fame",
      "Rotating diamond-celestial prism avatar aura",
      "Lifetime certified physical Arc certificate endorsement",
      "Direct priority queue in Vanguard Leaderboard",
    ],
  },
  "level-9-titan": {
    id: "level-9-titan",
    name: "TITAN OF THE CRUCIBLE",
    codename: "CRUCIBLE_TITAN_50",
    subtitle: "ELITE 50 COHORT • LEVEL 9 ASCENDANT",
    tier: "LEGENDARY TITAN TIER",
    rarityLabel: "LIMITED // FIRST 50 PLAYERS ONLY",
    capacity: 50,
    currentClaimed: 0,
    remainingSlots: 50,
    criteria: "Awarded exclusively to the FIRST 50 Challengers who break through friction to reach Level 9 (75+ consecutive unbroken days and 15,000+ XP).",
    xpThreshold: 15000,
    daysThreshold: 75,
    accentColor: "#d946ef", // Plasma Violet / Neon Fuchsia
    borderColor: "rgba(217, 70, 239, 0.75)",
    bgGradient: "from-fuchsia-600/25 via-purple-700/20 to-amber-500/20",
    glowColor: "rgba(217, 70, 239, 0.55)",
    iconName: "flame",
    isExclusiveAdmin: false,
    perks: [
      "Numbered serial crest (#01 to #50) permanently locked",
      "Dual-flame obsidian cyber aura on profile",
      "Featured Challenger endorsement in live proof feed",
      "Immunity badge for milestone archives",
    ],
  },
  "level-5-centurion": {
    id: "level-5-centurion",
    name: "CENTURION OF DISCIPLINE",
    codename: "CENTURION_100",
    subtitle: "FIRST 100 SQUAD • LEVEL 5 PIONEER",
    tier: "PREMIUM VANGUARD TIER",
    rarityLabel: "LIMITED // FIRST 100 PLAYERS ONLY",
    capacity: 100,
    currentClaimed: 0,
    remainingSlots: 100,
    criteria: "Conferred exclusively to the FIRST 100 Challengers who cross the initial 30-day discipline barrier to reach Level 5 with 5,000+ XP.",
    xpThreshold: 5000,
    daysThreshold: 30,
    accentColor: "#38bdf8", // Cyber Cyan
    borderColor: "rgba(56, 189, 248, 0.75)",
    bgGradient: "from-sky-500/25 via-cyan-600/15 to-indigo-600/20",
    glowColor: "rgba(56, 189, 248, 0.45)",
    iconName: "shield",
    isExclusiveAdmin: false,
    perks: [
      "Numbered pioneer slot badge (#001 to #100)",
      "Cybernetic platinum shield emblem on profile",
      "Access to private Vanguard strategy channels",
      "Permanent XP compound multiplier boost",
    ],
  },
};

/**
 * Checks which Sovereign Badges a user qualifies for.
 */
export function getUserSovereignBadges(user: {
  email?: string;
  role?: string;
  isAdmin?: boolean;
  level?: number;
  streak?: number;
  totalXP?: number;
}): {
  activeBadge: SovereignBadge;
  unlockedBadges: SovereignBadge[];
  allBadges: SovereignBadge[];
} {
  const isAdmin =
    user?.isAdmin ||
    user?.role === "ADMIN" ||
    user?.email?.toLowerCase() === "anuragkumar.pandit2000@gmail.com";

  const level = user?.level || 0;
  const streak = user?.streak || 0;
  const xp = user?.totalXP || 0;

  const unlockedBadges: SovereignBadge[] = [];

  // Admin uniquely gets the 1-of-1 Founder badge
  if (isAdmin) {
    unlockedBadges.push(SOVEREIGN_BADGES["admin-prime"]);
  }

  // Level 10 Mythic Badge (Day 90+ & high XP)
  if (level >= 10 || streak >= 90 || xp >= 25000) {
    unlockedBadges.push(SOVEREIGN_BADGES["level-10-mythic"]);
  }

  // Level 9 Titan Badge (Day 75+ & high XP)
  if (level >= 9 || streak >= 75 || xp >= 15000) {
    unlockedBadges.push(SOVEREIGN_BADGES["level-9-titan"]);
  }

  // Level 5 Centurion Badge (Day 30+ & high XP)
  if (level >= 5 || streak >= 30 || xp >= 5000) {
    unlockedBadges.push(SOVEREIGN_BADGES["level-5-centurion"]);
  }

  // Primary/Active badge is the highest tier unlocked
  const activeBadge = unlockedBadges[0] || (isAdmin ? SOVEREIGN_BADGES["admin-prime"] : SOVEREIGN_BADGES["level-5-centurion"]);

  return {
    activeBadge,
    unlockedBadges,
    allBadges: Object.values(SOVEREIGN_BADGES),
  };
}
