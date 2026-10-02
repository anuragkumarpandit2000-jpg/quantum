import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateLevel, getActiveWinterArcDay, getTimeUntilMidnight } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  // 1. Calculate active 24-hour Winter Arc day (starts at Day 1 for new user login, rolls over at 12:00 AM midnight)
  const startDate = user.profile?.startDate || user.createdAt;
  const currentDay = getActiveWinterArcDay(startDate);
  const timeUntilMidnight = getTimeUntilMidnight();

  // 2. Check 24-hour midnight rollover: if yesterday passed without completing habits, streak resets to 0
  let currentStreak = user.streak?.currentStreak || 0;
  let longestStreak = user.streak?.longestStreak || 0;
  let consistencyRate = user.streak?.consistencyRate || 0;

  if (
    user.streak &&
    currentDay > 1 &&
    user.streak.lastCompletedDay < currentDay - 1 &&
    user.streak.currentStreak > 0
  ) {
    currentStreak = 0;
    // Persist midnight streak reset
    await prisma.streak.update({
      where: { userId: user.id },
      data: { currentStreak: 0 },
    }).catch(() => {});
  }

  // 3. Strict Winter Arc Level calculation based on continuous completed streak days
  // Day 1 completed -> Level 1
  // Day 7 completed -> Level 2
  // Day 14 completed -> Level 3
  // Day 25 completed -> Level 4
  // Day 30 completed -> Level 5
  // Day 45 completed -> Level 6
  // Day 52 completed -> Level 7
  // Day 65 completed -> Level 8
  // Day 75 completed -> Level 9
  // Day 90 completed -> Level 10
  const levelInfo = calculateLevel(currentStreak);

  // If level or class in database drifted, sync it
  if (
    user.profile &&
    (user.profile.level !== levelInfo.level || user.profile.currentClass !== levelInfo.tier)
  ) {
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        level: levelInfo.level,
        currentClass: levelInfo.tier,
      },
    }).catch(() => {});
  }

  const cert = await prisma.certificate.findFirst({
    where: { userId: user.id },
    orderBy: { issuedAt: "desc" },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      isAdmin: user.email.toLowerCase() === "anuragkumar.pandit2000@gmail.com" || user.role === "ADMIN",
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      lastActiveAt: user.lastActiveAt,
      profile: {
        ...user.profile,
        level: levelInfo.level,
        currentClass: levelInfo.tier,
      },
      settings: user.settings,
      streak: user.streak ? {
        ...user.streak,
        currentStreak,
        longestStreak,
        consistencyRate,
      } : null,
      currentDay,
      timeUntilMidnight,
      levelInfo,
      certificate: cert,
    },
  });
}
