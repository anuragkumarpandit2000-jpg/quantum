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

export function calculateLevel(xp: number): { level: number; tier: string; nextLevelXP: number; progressPercent: number } {
  const level = Math.floor(xp / 1000) + 1;
  const currentLevelBase = (level - 1) * 1000;
  const nextLevelXP = level * 1000;
  const progressPercent = Math.min(100, Math.max(0, ((xp - currentLevelBase) / 1000) * 100));

  let tier = "Initiate Tier I";
  if (level >= 10) tier = "Ascended Vanguard";
  else if (level >= 7) tier = "Arc Master";
  else if (level >= 5) tier = "Quantum Adept";
  else if (level >= 3) tier = "Discipline Specialist";

  return { level, tier, nextLevelXP, progressPercent };
}
