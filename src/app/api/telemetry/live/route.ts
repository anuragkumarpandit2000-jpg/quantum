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
      prisma.user.count({
        where: { emailVerified: true },
      }),
      prisma.user.count({
        where: {
          emailVerified: true,
          lastActiveAt: { gte: fifteenMinutesAgo },
        },
      }),
      prisma.habitCompletion.count({
        where: {
          status: "COMPLETED",
          habit: { user: { emailVerified: true } },
        },
      }),
      prisma.galleryItem.count({
        where: {
          isPublic: true,
          user: { emailVerified: true },
        },
      }),
      prisma.user.findFirst({
        where: {
          emailVerified: true,
          settings: { leaderboardVisible: true },
        },
        orderBy: { profile: { totalXP: "desc" } },
        select: {
          name: true,
          username: true,
          profile: { select: { totalXP: true, currentClass: true, avatar: true } },
        },
      }),
    ]);

    // Real live presence: active challengers in last 15 min (min 1 if users exist)
    const liveNow = Math.max(dbActiveCount, dbUserCount > 0 ? 1 : 0);
    const totalChallengers = dbUserCount;

    return NextResponse.json({
      status: "ONLINE",
      liveNow,
      dbActiveCount,
      totalChallengers,
      totalCompletions,
      publicProofsCount,
      topLeader: topLeader || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/telemetry/live error:", error);
    return NextResponse.json(
      {
        status: "ONLINE",
        liveNow: 1,
        totalChallengers: 1,
        totalCompletions: 0,
        publicProofsCount: 0,
        topLeader: null,
      },
      { status: 200 }
    );
  }
}
