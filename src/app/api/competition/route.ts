import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserSovereignBadges } from "@/lib/badges";

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
        where: {
          emailVerified: true,
          settings: { leaderboardVisible: true },
        },
      }),
      prisma.user.findMany({
        where: {
          emailVerified: true,
          settings: { leaderboardVisible: true },
        },
        orderBy: orderByClause,
        take: 50,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
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

    if (user && user.emailVerified) {
      const topIndex = rankedUsers.findIndex((u) => u.id === user.id);
      if (topIndex >= 0) {
        currentUserRank = topIndex + 1;
      } else {
        if (category === "streak") {
          const higher = await prisma.streak.count({
            where: {
              user: {
                emailVerified: true,
                settings: { leaderboardVisible: true },
              },
              currentStreak: { gt: user.streak?.currentStreak || 0 },
            },
          });
          currentUserRank = higher + 1;
        } else if (category === "consistency") {
          const higher = await prisma.streak.count({
            where: {
              user: {
                emailVerified: true,
                settings: { leaderboardVisible: true },
              },
              consistencyRate: { gt: user.streak?.consistencyRate || 0 },
            },
          });
          currentUserRank = higher + 1;
        } else {
          const higher = await prisma.profile.count({
            where: {
              user: {
                emailVerified: true,
                settings: { leaderboardVisible: true },
              },
              totalXP: { gt: user.profile?.totalXP || 0 },
            },
          });
          currentUserRank = higher + 1;
        }
      }
    }

    const mapUserWithBadge = (u: any) => {
      const isAdmin =
        u.role === "ADMIN" ||
        u.email?.toLowerCase() === "anuragkumar.pandit2000@gmail.com";

      const badgeInfo = getUserSovereignBadges({
        email: u.email,
        role: u.role,
        isAdmin,
        level: u.profile?.level || 1,
        streak: u.streak?.currentStreak || 0,
        totalXP: u.profile?.totalXP || 0,
      });

      const { email, ...sanitized } = u;

      return {
        ...sanitized,
        isAdmin,
        badge: badgeInfo.activeBadge
          ? {
              id: badgeInfo.activeBadge.id,
              name: badgeInfo.activeBadge.name,
              tier: badgeInfo.activeBadge.tier,
              rarityLabel: badgeInfo.activeBadge.rarityLabel,
              iconName: badgeInfo.activeBadge.iconName,
            }
          : null,
      };
    };

    const enrichedRankedUsers = rankedUsers.map(mapUserWithBadge);

    return NextResponse.json({
      category,
      totalParticipants,
      currentUserRank: currentUserRank > 0 ? currentUserRank : null,
      top3: enrichedRankedUsers.slice(0, 3),
      leaderboard: enrichedRankedUsers.slice(0, 50),
    });
  } catch (error) {
    console.error("GET /api/competition error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
