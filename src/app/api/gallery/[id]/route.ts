import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing proof ID" }, { status: 400 });
    }

    const existing = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete proof" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing proof ID" }, { status: 400 });
    }

    const existing = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    const body = await req.json();
    const { fileUrl, caption, fileType } = body;

    if (!fileUrl && caption === undefined) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    // Replace the proof while strictly preserving original dayNumber, createdAt, and metadata
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(fileUrl ? { fileUrl } : {}),
        ...(caption !== undefined ? { caption: caption.trim() } : {}),
        ...(fileType ? { fileType } : {}),
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

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("PATCH /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to replace proof" }, { status: 500 });
  }
}
