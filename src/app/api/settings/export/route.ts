import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve full export of user data
    const exportData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        emailVerified: true,
        emailVerifiedAt: true,
        createdAt: true,
        lastActiveAt: true,
        profile: true,
        settings: true,
        streak: true,
        habits: {
          include: {
            completions: {
              orderBy: { dayNumber: "asc" },
            },
          },
        },
        skills: {
          include: {
            tasks: {
              include: {
                completions: true,
              },
            },
          },
        },
        galleryItems: {
          orderBy: { createdAt: "desc" },
        },
        achievements: true,
        feedbacks: true,
        certificates: true,
        donations: true,
        notifications: true,
      },
    });

    if (!exportData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payload = {
      exportVersion: "1.0",
      compliance: "Digital Personal Data Protection (DPDP) Act 2023 / GDPR",
      generatedAt: new Date().toISOString(),
      user: exportData,
    };

    const jsonString = JSON.stringify(payload, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="quantum-challenger-${user.username}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    console.error("GET /api/settings/export error:", error);
    return NextResponse.json(
      { error: "Failed to generate user data export." },
      { status: 500 }
    );
  }
}
