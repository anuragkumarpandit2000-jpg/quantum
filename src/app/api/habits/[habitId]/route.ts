import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> | { habitId: string } }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId } = await Promise.resolve(params);

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/habits/[habitId] error:", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> | { habitId: string } }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId } = await Promise.resolve(params);
    const body = await req.json();
    const { title, category, color } = body;

    const updated = await prisma.habit.update({
      where: { id: habitId, userId: user.id },
      data: {
        ...(title && { title: title.trim().toUpperCase() }),
        ...(category && { category: category.trim() }),
        ...(color && { color }),
      },
    });

    return NextResponse.json({ habit: updated });
  } catch (error) {
    console.error("PATCH /api/habits/[habitId] error:", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
  }
}
