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
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required. Please verify your email to access habits." },
        { status: 403 }
      );
    }

    const habits = await prisma.habit.findMany({
      where: { userId: user.id, archived: false },
      include: {
        completions: {
          orderBy: { dayNumber: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ habits });
  } catch (error) {
    console.error("GET /api/habits error:", error);
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
        { error: "Email verification required. Please verify your email to create habits." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, category, color, icon } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Habit title is required" }, { status: 400 });
    }

    const count = await prisma.habit.count({ where: { userId: user.id } });

    // Create habit with 90 day completions in transaction
    const newHabit = await prisma.$transaction(async (tx) => {
      const habit = await tx.habit.create({
        data: {
          userId: user.id,
          title: title.trim().toUpperCase(),
          category: category?.trim() || "Core Discipline",
          color: color || "#38bdf8",
          icon: icon || "zap",
          order: count,
        },
      });

      // Generate 90 day boxes
      const completionsData = [];
      for (let day = 1; day <= 90; day++) {
        completionsData.push({
          habitId: habit.id,
          dayNumber: day,
          status: "PENDING",
        });
      }

      await tx.habitCompletion.createMany({
        data: completionsData,
      });

      return tx.habit.findUnique({
        where: { id: habit.id },
        include: {
          completions: {
            orderBy: { dayNumber: "asc" },
          },
        },
      });
    });

    return NextResponse.json({ habit: newHabit }, { status: 201 });
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
