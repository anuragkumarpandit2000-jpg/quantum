import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required. Please verify your email to access skills." },
        { status: 403 }
      );
    }

    const skills = await prisma.skill.findMany({
      where: { userId: user.id },
      include: {
        tasks: {
          include: {
            completions: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("GET /api/skills error:", error);
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
        { error: "Email verification required. Please verify your email to create skills." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, category, tasks } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Skill title is required" }, { status: 400 });
    }

    const newSkill = await prisma.$transaction(async (tx) => {
      const skill = await tx.skill.create({
        data: {
          userId: user.id,
          title: title.trim().toUpperCase(),
          category: category || "Technical Mastery",
          level: "Level 1: Fundamentals",
          progress: 0,
        },
      });

      const defaultTasks = Array.isArray(tasks) && tasks.length > 0
        ? tasks
        : [
            "Learn core concepts and viewport navigation",
            "Build first functional project iteration",
            "Refactor code and optimize efficiency",
            "Publish proof artifact to Gallery",
          ];

      for (let i = 0; i < defaultTasks.length; i++) {
        const task = await tx.skillTask.create({
          data: {
            skillId: skill.id,
            title: typeof defaultTasks[i] === "string" ? defaultTasks[i] : defaultTasks[i].title,
            xpReward: 100,
            order: i,
          },
        });

        await tx.skillTaskCompletion.create({
          data: {
            taskId: task.id,
            completed: false,
          },
        });
      }

      return tx.skill.findUnique({
        where: { id: skill.id },
        include: {
          tasks: {
            include: { completions: true },
          },
        },
      });
    });

    return NextResponse.json({ skill: newSkill }, { status: 201 });
  } catch (error) {
    console.error("POST /api/skills error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
