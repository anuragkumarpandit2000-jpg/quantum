import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { soundEnabled, soundVolume, theme, leaderboardVisible, activityVisible, notificationsEnabled } = body;

    const updated = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        soundEnabled: soundEnabled ?? true,
        soundVolume: soundVolume ?? 0.4,
        theme: theme || "dark",
        leaderboardVisible: leaderboardVisible ?? true,
        activityVisible: activityVisible ?? true,
        notificationsEnabled: notificationsEnabled ?? true,
      },
      update: {
        ...(soundEnabled !== undefined && { soundEnabled }),
        ...(soundVolume !== undefined && { soundVolume }),
        ...(theme !== undefined && { theme }),
        ...(leaderboardVisible !== undefined && { leaderboardVisible }),
        ...(activityVisible !== undefined && { activityVisible }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      },
    });

    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user and all cascade data
    await prisma.user.delete({
      where: { id: user.id },
    });

    const response = NextResponse.json({ success: true });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  } catch (error) {
    console.error("DELETE /api/settings error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
