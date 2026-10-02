import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> | { taskId: string } }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await Promise.resolve(params);

    const task = await prisma.skillTask.findUnique({
      where: { id: taskId },
      include: {
        skill: true,
        completions: true,
      },
    });

    if (!task || task.skill.userId !== user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const currentCompletion = task.completions[0];
    const isCompleted = currentCompletion ? currentCompletion.completed : false;
    const nextCompleted = !isCompleted;
    const xpReward = task.xpReward || 100;
    const xpDelta = nextCompleted ? xpReward : -xpReward;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Upsert completion
      const updatedComp = await tx.skillTaskCompletion.upsert({
        where: { taskId },
        create: {
          taskId,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date() : null,
        },
        update: {
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date() : null,
        },
      });

      // 2. Adjust Profile XP
      const currentXP = user.profile?.totalXP || 0;
      const newTotalXP = Math.max(0, currentXP + xpDelta);
      const newLevel = Math.floor(newTotalXP / 1000) + 1;

      await tx.profile.update({
        where: { userId: user.id },
        data: {
          totalXP: newTotalXP,
          level: newLevel,
        },
      });

      // 3. Log XP transaction if completed
      if (nextCompleted) {
        await tx.xPTransaction.create({
          data: {
            userId: user.id,
            amount: xpReward,
            source: "SKILL_TASK",
            description: `Completed micro-task: "${task.title}"`,
            referenceId: task.id,
          },
        });
      }

      // 4. Update skill overall progress %
      const allTasks = await tx.skillTask.findMany({
        where: { skillId: task.skillId },
        include: { completions: true },
      });

      const completedCount = allTasks.filter(
        (t) => (t.id === taskId ? nextCompleted : t.completions[0]?.completed)
      ).length;
      const progress = Math.round((completedCount / allTasks.length) * 100);

      await tx.skill.update({
        where: { id: task.skillId },
        data: { progress },
      });

      return {
        completed: nextCompleted,
        progress,
        totalXP: newTotalXP,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH /api/skills/[taskId]/toggle error:", error);
    return NextResponse.json({ error: "Failed to update microtask" }, { status: 500 });
  }
}
