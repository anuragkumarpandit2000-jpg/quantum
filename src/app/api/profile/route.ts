import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        streak: true,
        skills: { include: { tasks: { include: { completions: true } } } },
        achievements: true,
        certificates: true,
      },
    });

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    console.error("GET /api/profile error:", error);
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
    const { name, avatar, bio, objective } = body;

    const updated = await prisma.$transaction(async (tx) => {
      if (name) {
        await tx.user.update({
          where: { id: user.id },
          data: { name: name.trim() },
        });
      }

      const prof = await tx.profile.update({
        where: { userId: user.id },
        data: {
          ...(avatar !== undefined && { avatar: avatar.trim() }),
          ...(bio !== undefined && { bio }),
          ...(objective && { objective }),
        },
      });

      return prof;
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
