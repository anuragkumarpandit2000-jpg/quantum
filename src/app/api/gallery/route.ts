import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "mine" or "public"

    let whereClause: any = { isPublic: true };
    if (filter === "mine" && user) {
      whereClause = { userId: user.id };
    } else if (user) {
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
            profile: { select: { avatar: true, level: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let user = await getCurrentUser(req);
    if (!user) {
      user = await prisma.user.findFirst({
        include: { profile: true, settings: true, streak: true },
      });
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const { dayNumber, caption, fileUrl, fileType, isPublic } = body;

    if (!caption || !caption.trim()) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        userId: user.id,
        dayNumber: parseInt(dayNumber) || 1,
        caption: caption.trim(),
        fileUrl: fileUrl || "/assets/images/background.png",
        fileType: fileType || "image",
        isPublic: isPublic !== undefined ? !!isPublic : true,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile: { select: { avatar: true, level: true } },
          },
        },
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to upload proof" }, { status: 500 });
  }
}
