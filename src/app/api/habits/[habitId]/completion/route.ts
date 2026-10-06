import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { calculateLevel, getActiveWinterArcDay } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> | { habitId: string } }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required before logging habit completions." },
        { status: 403 }
      );
    }

    const { habitId } = await Promise.resolve(params);
    const body = await req.json();
    const { dayNumber, status } = body; // status can be "COMPLETED", "MISSED", or "PENDING"

    if (!dayNumber || dayNumber < 1 || dayNumber > 90) {
      return NextResponse.json({ error: "Invalid dayNumber" }, { status: 400 });
    }

    // Prevent future-day cheating (allow past days or today)
    const currentArcDay = getActiveWinterArcDay(user.profile?.startDate || user.createdAt);
    if (dayNumber > currentArcDay && !isAdmin(user)) {
      return NextResponse.json(
        { error: `Cannot log completions for future days. Current active day is Day ${currentArcDay}.` },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Verify habit belongs to user inside tx
      const habit = await tx.habit.findFirst({
        where: { id: habitId, userId: user.id },
      });

      if (!habit) {
        throw new Error("HABIT_NOT_FOUND");
      }

      // Find existing completion inside tx to prevent race conditions
      const existing = await tx.habitCompletion.findUnique({
        where: {
          habitId_dayNumber: {
            habitId,
            dayNumber,
          },
        },
      });

      const prevStatus = existing?.status || "PENDING";
      const nextStatus = status || (prevStatus === "PENDING" ? "COMPLETED" : prevStatus === "COMPLETED" ? "MISSED" : "PENDING");

      let xpDelta = 0;
      if (prevStatus !== "COMPLETED" && nextStatus === "COMPLETED") {
        xpDelta = 50; // Earn 50 XP
      } else if (prevStatus === "COMPLETED" && nextStatus !== "COMPLETED") {
        xpDelta = -50; // Reverse 50 XP
      }

      // 1. Upsert completion
      const updatedCompletion = await tx.habitCompletion.upsert({
        where: {
          habitId_dayNumber: {
            habitId,
            dayNumber,
          },
        },
        create: {
          habitId,
          dayNumber,
          status: nextStatus,
          completedAt: nextStatus === "COMPLETED" ? new Date() : null,
        },
        update: {
          status: nextStatus,
          completedAt: nextStatus === "COMPLETED" ? new Date() : null,
        },
      });

      // 2. Adjust User profile XP
      let newTotalXP = user.profile?.totalXP || 0;
      if (xpDelta !== 0) {
        newTotalXP = Math.max(0, newTotalXP + xpDelta);
        // Record XP transaction
        if (xpDelta > 0) {
          await tx.xPTransaction.create({
            data: {
              userId: user.id,
              amount: xpDelta,
              source: "HABIT_COMPLETION",
              description: `Completed habit "${habit.title}" on Day ${dayNumber}`,
              referenceId: updatedCompletion.id,
            },
          });
        }
      }

      // Count total active (non-archived) habits for this user
      const activeHabitsCount = await tx.habit.count({
        where: { userId: user.id, archived: false },
      });

      // 3. Recalculate Streak and Consistency taking into account COMPLETED and MISSED days
      const allCompletions = await tx.habitCompletion.findMany({
        where: {
          habit: { userId: user.id, archived: false },
        },
        select: { dayNumber: true, status: true },
      });

      const dayMap = new Map<number, { completedCount: number; missedCount: number }>();
      allCompletions.forEach((c) => {
        if (!dayMap.has(c.dayNumber)) {
          dayMap.set(c.dayNumber, { completedCount: 0, missedCount: 0 });
        }
        const entry = dayMap.get(c.dayNumber)!;
        if (c.status === "COMPLETED") entry.completedCount++;
        if (c.status === "MISSED") entry.missedCount++;
      });

      const loggedDays = Array.from(dayMap.keys()).filter((d) => {
        const s = dayMap.get(d)!;
        return s.completedCount > 0 || s.missedCount > 0;
      });

      const maxDay = loggedDays.length > 0 ? Math.max(...loggedDays) : 1;
      let currentStreak = 0;
      let longestStreak = user.streak?.longestStreak || 0;
      let runningStreak = 0;
      let totalCompletedDays = 0;

      for (let d = 1; d <= maxDay; d++) {
        const info = dayMap.get(d);
        // A day is completed ONLY when ALL active habits for that day are completed and none missed
        const isDayComplete =
          activeHabitsCount > 0 &&
          info !== undefined &&
          info.completedCount >= activeHabitsCount &&
          info.missedCount === 0;

        if (isDayComplete) {
          runningStreak++;
          totalCompletedDays++;
          if (runningStreak > longestStreak) {
            longestStreak = runningStreak;
          }
        } else if (info && info.missedCount > 0) {
          // Explicitly missed habit breaks running streak
          runningStreak = 0;
        } else if (d < dayNumber && (!info || info.completedCount < activeHabitsCount)) {
          // Past incomplete day breaks running streak
          runningStreak = 0;
        }
      }
      currentStreak = runningStreak;

      const consistencyRate =
        loggedDays.length > 0
          ? Math.min(100, Math.round((totalCompletedDays / loggedDays.length) * 100))
          : 0;

      await tx.streak.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          currentStreak,
          longestStreak,
          lastCompletedDay: Math.max(user.streak?.lastCompletedDay || 0, nextStatus === "COMPLETED" ? dayNumber : 0),
          consistencyRate,
          lastActiveDate: new Date(),
        },
        update: {
          currentStreak,
          longestStreak,
          lastCompletedDay: Math.max(user.streak?.lastCompletedDay || 0, nextStatus === "COMPLETED" ? dayNumber : 0),
          consistencyRate,
          lastActiveDate: new Date(),
        },
      });

      // 4. Calculate Winter Arc Level by Continuous Streak Days
      const levelData = calculateLevel(currentStreak);
      const effectivePrevLevel =
        (user.streak?.currentStreak || 0) === 0 ? 0 : (user.profile?.level || 0);
      const isLevelUp = levelData.level > effectivePrevLevel && levelData.level > 0;

      await tx.profile.update({
        where: { userId: user.id },
        data: {
          totalXP: newTotalXP,
          level: levelData.level,
          currentClass: levelData.tier,
        },
      });

      return {
        completion: updatedCompletion,
        totalXP: newTotalXP,
        currentStreak,
        longestStreak,
        consistencyRate,
        level: levelData.level,
        tier: levelData.tier,
        isLevelUp,
        milestone: levelData,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.message === "HABIT_NOT_FOUND") {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }
    console.error("PATCH /api/habits/[habitId]/completion error:", error);
    return NextResponse.json({ error: "Failed to update completion" }, { status: 500 });
  }
}
