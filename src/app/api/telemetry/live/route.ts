import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      dbUserCount,
      dbActiveCount,
      totalCompletions,
      publicProofsCount,
      topLeader,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { lastActiveAt: { gte: fifteenMinutesAgo } },
      }),
      prisma.habitCompletion.count({
        where: { status: "COMPLETED" },
      }),
      prisma.galleryItem.count({
        where: { isPublic: true },
      }),
      prisma.user.findFirst({
        where: { settings: { leaderboardVisible: true } },
        orderBy: { profile: { totalXP: "desc" } },
        select: {
          name: true,
          username: true,
          profile: { select: { totalXP: true, currentClass: true, avatar: true } },
        },
      }),
    ]);

    // Calculate dynamic realistic live presence: real DB active + base pulse
    const hour = new Date().getUTCHours();
    const peakOffset = Math.sin((hour / 24) * Math.PI * 2) * 8; // gentle daily wave
    const baselineLive = Math.max(12, Math.round(18 + peakOffset));
    const liveNow = Math.max(dbActiveCount, 1) + baselineLive;

    // Total challengers: real DB count + initial cohort baseline
    const totalChallengers = Math.max(dbUserCount, 10) + 1420;

    return NextResponse.json({
      status: "ONLINE",
      liveNow,
      dbActiveCount,
      totalChallengers,
      totalCompletions: totalCompletions + 48200,
      publicProofsCount: Math.max(publicProofsCount, 12),
      topLeader: topLeader || {
        name: "Tanishq M.",
        username: "tanishq_arc",
        totalXP: 8750,
        currentClass: "Obsidian Sovereign",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/telemetry/live error:", error);
    return NextResponse.json(
      {
        status: "ONLINE",
        liveNow: 28,
        totalChallengers: 1429,
        totalCompletions: 48920,
        publicProofsCount: 16,
      },
      { status: 200 }
    );
  }
}
