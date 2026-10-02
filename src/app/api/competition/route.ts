import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "xp"; // "xp" | "streak" | "consistency"

    // Fetch users with their profiles and streaks
    const allUsers = await prisma.user.findMany({
      where: {
        settings: {
          leaderboardVisible: true,
        },
      },
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
    });

    // Rank users based on category
    const rankedUsers = [...allUsers].sort((a, b) => {
      if (category === "streak") {
        return (b.streak?.currentStreak || 0) - (a.streak?.currentStreak || 0);
      }
      if (category === "consistency") {
        return (b.streak?.consistencyRate || 0) - (a.streak?.consistencyRate || 0);
      }
      // default: XP
      return (b.profile?.totalXP || 0) - (a.profile?.totalXP || 0);
    });

    const totalParticipants = rankedUsers.length;
    let currentUserRank = -1;

    if (user) {
      currentUserRank = rankedUsers.findIndex((u) => u.id === user.id) + 1;
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
