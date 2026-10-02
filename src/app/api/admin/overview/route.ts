import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Forbidden: Super-Admin access required." },
        { status: 403 }
      );
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1. Telemetry Aggregations
    const [
      totalUsers,
      verifiedUsers,
      liveUsersNowCount,
      totalProofs,
      publicProofs,
      totalFeedbacks,
      allUsers,
      recentProofs,
      recentFeedbacks,
      xpSumResult,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { lastActiveAt: { gte: fifteenMinutesAgo } } }),
      prisma.galleryItem.count(),
      prisma.galleryItem.count({ where: { isPublic: true } }),
      prisma.feedback.count(),
      prisma.user.findMany({
        orderBy: { lastActiveAt: "desc" },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          emailVerified: true,
          emailVerifiedAt: true,
          lastActiveAt: true,
          createdAt: true,
          profile: {
            select: {
              avatar: true,
              level: true,
              totalXP: true,
              currentClass: true,
              onboardingDone: true,
            },
          },
          streak: {
            select: {
              currentStreak: true,
              longestStreak: true,
              consistencyRate: true,
            },
          },
        },
      }),
      prisma.galleryItem.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              username: true,
              email: true,
              profile: { select: { avatar: true } },
            },
          },
        },
      }),
      prisma.feedback.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
      }),
      prisma.profile.aggregate({
        _sum: { totalXP: true },
      }),
    ]);

    // Map users with real-time live presence flag
    const usersWithPresence = allUsers.map((u) => {
      const isLiveNow = u.lastActiveAt ? new Date(u.lastActiveAt) >= fifteenMinutesAgo : false;
      return {
        ...u,
        isLiveNow,
      };
    });

    return NextResponse.json({
      adminEmail: user.email,
      stats: {
        totalUsers,
        verifiedUsers,
        liveUsersNow: Math.max(liveUsersNowCount, 1), // At least admin is live
        totalProofs,
        publicProofs,
        privateProofs: totalProofs - publicProofs,
        totalFeedbacks,
        totalCumulativeXP: xpSumResult._sum.totalXP || 0,
      },
      users: usersWithPresence,
      recentProofs,
      recentFeedbacks,
    });
  } catch (error) {
    console.error("GET /api/admin/overview error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
