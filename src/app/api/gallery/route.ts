import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "mine" | "public"
    const publicOnly = searchParams.get("publicOnly") === "true";

    let whereClause: any = { isPublic: true };

    if (publicOnly) {
      whereClause = { isPublic: true };
    } else if (filter === "mine" && user) {
      whereClause = { userId: user.id };
    } else if (user) {
      // User can see all public proofs + their own private proofs
      whereClause = {
        OR: [{ isPublic: true }, { userId: user.id }],
      };
    }

    const items = await prisma.galleryItem.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile: { select: { avatar: true, level: true, currentClass: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required to log execution proofs." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { dayNumber, caption, fileUrl, fileType, isPublic } = body;

    if (!caption || !caption.trim()) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    const resolvedDay = parseInt(dayNumber, 10) || 1;
    const resolvedPublic = isPublic !== undefined ? !!isPublic : true;

    // 1. Create gallery item
    const item = await prisma.galleryItem.create({
      data: {
        userId: user.id,
        dayNumber: resolvedDay,
        caption: caption.trim(),
        fileUrl: fileUrl || "/assets/images/background.png",
        fileType: fileType || "image",
        isPublic: resolvedPublic,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile: { select: { avatar: true, level: true, currentClass: true } },
          },
        },
      },
    });

    // 2. Award +50 XP for verified proof of execution
    const xpReward = 50;
    await prisma.$transaction([
      prisma.xPTransaction.create({
        data: {
          userId: user.id,
          amount: xpReward,
          source: "PROOF_UPLOAD",
          description: `Logged Day ${resolvedDay} Execution Proof: "${caption.trim().substring(0, 30)}..."`,
        },
      }),
      prisma.profile.update({
        where: { userId: user.id },
        data: {
          totalXP: { increment: xpReward },
        },
      }),
    ]);

    return NextResponse.json({ item, xpEarned: xpReward }, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to upload proof" }, { status: 500 });
  }
}
