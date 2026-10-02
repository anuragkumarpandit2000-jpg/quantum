import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "xp"; // "xp" | "streak" | "consistency"

    let orderByClause: any = { profile: { totalXP: "desc" } };
    if (category === "streak") {
      orderByClause = { streak: { currentStreak: "desc" } };
    } else if (category === "consistency") {
      orderByClause = { streak: { consistencyRate: "desc" } };
    }

    const [totalParticipants, rankedUsers] = await Promise.all([
      prisma.user.count({
        where: { settings: { leaderboardVisible: true } },
      }),
      prisma.user.findMany({
        where: { settings: { leaderboardVisible: true } },
        orderBy: orderByClause,
        take: 50,
        select: {
          id: true,
          name: true,
          username: true,
          createdAt: true,
          profile: {
            select: {
              avatar: true,
              level: true,
              totalXP: true,
              currentClass: true,
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
    ]);

    let currentUserRank = -1;

    if (user) {
      const topIndex = rankedUsers.findIndex((u) => u.id === user.id);
      if (topIndex >= 0) {
        currentUserRank = topIndex + 1;
      } else {
        if (category === "streak") {
          const higher = await prisma.streak.count({
            where: { currentStreak: { gt: user.streak?.currentStreak || 0 } },
          });
          currentUserRank = higher + 1;
        } else if (category === "consistency") {
          const higher = await prisma.streak.count({
            where: { consistencyRate: { gt: user.streak?.consistencyRate || 0 } },
          });
          currentUserRank = higher + 1;
        } else {
          const higher = await prisma.profile.count({
            where: { totalXP: { gt: user.profile?.totalXP || 0 } },
          });
          currentUserRank = higher + 1;
        }
      }
    }

    return NextResponse.json({
      category,
      totalParticipants,
      currentUserRank: currentUserRank > 0 ? currentUserRank : null,
      top3: rankedUsers.slice(0, 3),
      leaderboard: rankedUsers.slice(0, 50),
    });
  } catch (error) {
    console.error("GET /api/competition error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
