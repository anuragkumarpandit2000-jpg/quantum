import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required before ratifying your onboarding contract." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      academicStatus,
      currentClass,
      age,
      dailyAvailableHours,
      objective,
      habits: chosenHabits, // array of string titles
      skillTitle,
      signatureUrl,
      contractData,
      certificateNumber,
    } = body;

    const certNumber = certificateNumber || `QNTM-ARC-90-${Math.floor(1000 + Math.random() * 9000)}`;
    const startDate = new Date();
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Profile & User name
      if (name) {
        await tx.user.update({
          where: { id: user.id },
          data: { name: name.trim() },
        });
      }

      const updatedProfile = await tx.profile.update({
        where: { userId: user.id },
        data: {
          objective: objective || "Master complete self-discipline through the 90-Day Winter Arc.",
          currentClass: currentClass || academicStatus || "Initiate Tier I",
          dailyAvailableHours: parseFloat(dailyAvailableHours) || 2.5,
          age: age ? parseInt(age) : null,
          startDate,
          endDate,
          onboardingDone: true,
          totalXP: { increment: 500 }, // 500 XP Welcome Induction Bonus
        },
      });

      // 2. Award Induction XP Transaction
      await tx.xPTransaction.create({
        data: {
          userId: user.id,
          amount: 500,
          source: "ONBOARDING_COMPLETION",
          description: "Winter Arc Induction Pledge Finalized",
        },
      });

      // 3. Create Chosen Habits (or defaults)
      const habitList = Array.isArray(chosenHabits) && chosenHabits.length > 0
        ? chosenHabits
        : ["HEAVY WORKOUT (45 MIN)", "DEEP WORK / STUDY (90 MIN)", "MEDITATION (20 MIN)", "READING (30 MIN)"];

      // Check if user already has habits created to avoid duplication
      const existingHabits = await tx.habit.findMany({ where: { userId: user.id } });
      if (existingHabits.length === 0) {
        for (let i = 0; i < habitList.length; i++) {
          const title = habitList[i].trim().toUpperCase();
          const habit = await tx.habit.create({
            data: {
              userId: user.id,
              title,
              category: "Core Discipline",
              color: "#38bdf8",
              order: i,
            },
          });

          // Generate 90 day completions for each habit
          const completionsData = [];
          for (let day = 1; day <= 90; day++) {
            completionsData.push({
              habitId: habit.id,
              dayNumber: day,
              status: "PENDING",
            });
          }
          await tx.habitCompletion.createMany({ data: completionsData });
        }
      }

      // 4. Create Chosen Skill if provided
      if (skillTitle) {
        const existingSkill = await tx.skill.findFirst({ where: { userId: user.id } });
        if (!existingSkill) {
          const skill = await tx.skill.create({
            data: {
              userId: user.id,
              title: skillTitle.trim().toUpperCase(),
              category: "Arc Focus",
              level: "Level 1: Fundamentals",
              progress: 0,
            },
          });

          // Add starter microtasks
          const starterTasks = [
            { title: `Master fundamentals of ${skillTitle}`, xpReward: 100 },
            { title: "Complete first project iteration", xpReward: 150 },
            { title: "Document proof of mastery in Gallery", xpReward: 200 },
          ];

          for (let t = 0; t < starterTasks.length; t++) {
            const task = await tx.skillTask.create({
              data: {
                skillId: skill.id,
                title: starterTasks[t].title,
                xpReward: starterTasks[t].xpReward,
                order: t,
              },
            });
            await tx.skillTaskCompletion.create({
              data: {
                taskId: task.id,
                completed: false,
              },
            });
          }
        }
      }

      // 5. Generate Official Certificate / Contract
      const fullContractObject = {
        document: typeof contractData === "object" ? contractData : (contractData ? JSON.parse(contractData) : {}),
        analysis: body.onboardingAnalysis || null,
        answers: body.onboardingAnswers || null,
      };

      const certificate = await tx.certificate.create({
        data: {
          userId: user.id,
          certificateNumber: certNumber,
          userName: name || user.name || user.username,
          startDate,
          endDate,
          pledge: objective || "I hereby commit to 90 consecutive days of unwavering focus, intense execution, and relentless self-discipline under the Quantum Winter Arc system.",
          signatureUrl: signatureUrl || null,
          contractData: JSON.stringify(fullContractObject),
          academicStatus: academicStatus || null,
        },
      });

      return { success: true, profile: updatedProfile, certificate };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/onboarding error:", error);
    return NextResponse.json({ error: "Failed to finalize onboarding" }, { status: 500 });
  }
}
