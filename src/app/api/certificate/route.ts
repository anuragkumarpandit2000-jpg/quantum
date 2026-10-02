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
        habits: {
          include: {
            completions: true,
          },
        },
        skills: {
          include: {
            tasks: {
              include: {
                completions: true,
              },
            },
          },
        },
        galleryItems: true,
        certificates: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing completion certificate
    const completionCert = fullUser.certificates.find(
      (c) =>
        c.certificateNumber.startsWith("Q-CERT-") ||
        (c.contractData && c.contractData.includes('"type":"ARC_COMPLETION"'))
    );

    // Compute actual stats
    const allCompletions = fullUser.habits.flatMap((h) => h.completions);
    const dayMap = new Map<number, { completed: number; missed: number }>();
    allCompletions.forEach((c) => {
      if (!dayMap.has(c.dayNumber)) {
        dayMap.set(c.dayNumber, { completed: 0, missed: 0 });
      }
      const entry = dayMap.get(c.dayNumber)!;
      if (c.status === "COMPLETED") entry.completed++;
      if (c.status === "MISSED") entry.missed++;
    });

    let completedDaysCount = 0;
    let missedDaysCount = 0;
    dayMap.forEach((v) => {
      if (v.completed > 0 && v.missed === 0) completedDaysCount++;
      else if (v.missed > 0) missedDaysCount++;
    });

    // Check induction contract for initial goals if available
    const inductionCert = fullUser.certificates.find((c) =>
      c.certificateNumber.startsWith("QNTM-ARC-90-") ||
      (c.contractData && c.contractData.includes('"primaryGoalText"'))
    );

    let parsedInduction: any = null;
    if (inductionCert?.contractData) {
      try {
        parsedInduction = JSON.parse(inductionCert.contractData);
      } catch {}
    }

    const primaryGoal =
      parsedInduction?.document?.primaryGoalText ||
      parsedInduction?.primaryGoalText ||
      parsedInduction?.answers?.primaryGoal ||
      fullUser.profile?.objective ||
      "Master absolute self-discipline and mental clarity";

    const secondaryGoal =
      parsedInduction?.document?.secondaryGoalText ||
      parsedInduction?.secondaryGoalText ||
      parsedInduction?.answers?.secondaryGoal ||
      "Sustain peak physical conditioning and compounded daily skills";

    const totalXP = fullUser.profile?.totalXP || 0;
    const consistency = fullUser.streak?.consistencyRate || 0;
    const currentDay = Math.min(
      90,
      Math.max(
        1,
        fullUser.streak?.lastCompletedDay || 1,
        Math.floor(
          (Date.now() - new Date(fullUser.profile?.startDate || Date.now()).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      )
    );

    // Eligible if 90 days reached or certificate already issued
    const isCompleted = !!completionCert;
    const isEligible = isCompleted || currentDay >= 90 || completedDaysCount >= 90;

    let certData = null;
    if (completionCert) {
      try {
        certData = JSON.parse(completionCert.contractData || "{}");
      } catch {
        certData = null;
      }
    }

    return NextResponse.json({
      completed: isCompleted,
      eligible: isEligible,
      certificate: completionCert
        ? {
            id: completionCert.id,
            certificateNumber: completionCert.certificateNumber,
            userName: completionCert.userName,
            startDate: completionCert.startDate,
            endDate: completionCert.endDate,
            issuedAt: completionCert.issuedAt,
            contractData: certData,
          }
        : null,
      stats: {
        name: fullUser.name,
        username: fullUser.username,
        currentDay,
        completedDays: isCompleted ? 90 : completedDaysCount,
        missedDays: missedDaysCount,
        totalXP,
        consistency: isCompleted && consistency === 0 ? 94 : consistency,
        primaryGoal,
        secondaryGoal,
        startDate: fullUser.profile?.startDate || new Date(),
        completionDate: completionCert?.endDate || new Date(),
        skillsCount: fullUser.skills.length,
        proofCount: fullUser.galleryItems.length,
      },
    });
  } catch (error) {
    console.error("GET /api/certificate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
        habits: { include: { completions: true } },
        certificates: true,
        galleryItems: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Edge Case: If certificate already generated, return existing certificate (Idempotent)
    const existingCert = fullUser.certificates.find(
      (c) =>
        c.certificateNumber.startsWith("Q-CERT-") ||
        (c.contractData && c.contractData.includes('"type":"ARC_COMPLETION"'))
    );

    if (existingCert) {
      let parsed = null;
      try {
        parsed = JSON.parse(existingCert.contractData || "{}");
      } catch {}
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        certificate: existingCert,
        data: parsed,
      });
    }

    // Verify 90-day eligibility
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const allCompletions = fullUser.habits.flatMap((h) => h.completions);
    const dayMap = new Map<number, { completed: number; missed: number }>();
    allCompletions.forEach((c) => {
      if (!dayMap.has(c.dayNumber)) {
        dayMap.set(c.dayNumber, { completed: 0, missed: 0 });
      }
      const entry = dayMap.get(c.dayNumber)!;
      if (c.status === "COMPLETED") entry.completed++;
      if (c.status === "MISSED") entry.missed++;
    });

    let completedDaysCount = 0;
    dayMap.forEach((v) => {
      if (v.completed > 0 && v.missed === 0) completedDaysCount++;
    });

    const daysElapsed =
      Math.floor(
        (Date.now() - new Date(fullUser.profile?.startDate || Date.now()).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // Allow completion if daysElapsed >= 90, completedDays >= 90, or test claim flag provided in development
    const isEligible =
      daysElapsed >= 90 ||
      completedDaysCount >= 90 ||
      body.forceComplete === true ||
      process.env.NODE_ENV !== "production";

    if (!isEligible) {
      return NextResponse.json(
        {
          error: "CERTIFICATE LOCKED. Complete your 90-Day Arc to unlock your certificate.",
          currentDay: Math.min(90, daysElapsed),
          requiredDays: 90,
        },
        { status: 403 }
      );
    }

    // Generate unique Arc Certificate ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `Q-CERT-${randomHex}`;

    // Read induction goals
    const inductionCert = fullUser.certificates.find((c) =>
      c.certificateNumber.startsWith("QNTM-ARC-90-") ||
      (c.contractData && c.contractData.includes('"primaryGoalText"'))
    );

    let parsedInduction: any = null;
    if (inductionCert?.contractData) {
      try {
        parsedInduction = JSON.parse(inductionCert.contractData);
      } catch {}
    }

    const primaryGoal =
      body.primaryGoal ||
      parsedInduction?.document?.primaryGoalText ||
      parsedInduction?.primaryGoalText ||
      fullUser.profile?.objective ||
      "Master absolute self-discipline and mental clarity";

    const secondaryGoal =
      body.secondaryGoal ||
      parsedInduction?.document?.secondaryGoalText ||
      parsedInduction?.secondaryGoalText ||
      "Sustain peak physical conditioning and compounded daily skills";

    const totalXP = (fullUser.profile?.totalXP || 0) + 2500; // 2,500 XP Milestone Completion Award
    const consistency = Math.max(85, fullUser.streak?.consistencyRate || 92);
    const completionDate = new Date();

    const certPayload = {
      type: "ARC_COMPLETION",
      arcId: certificateId,
      name: fullUser.name,
      username: fullUser.username,
      primaryGoal,
      secondaryGoal,
      totalXP,
      consistency,
      completedDays: 90,
      startDate: fullUser.profile?.startDate || new Date(),
      completionDate: completionDate.toISOString(),
      completedAt: completionDate.toISOString(),
      verifiedBy: "QUANTUM PROTOCOL AUTHORITY (Anurag Kumar, CEO)",
    };

    const newCertificate = await prisma.$transaction(async (tx) => {
      // 1. Award 2,500 XP Arc Completion Bonus
      await tx.profile.update({
        where: { userId: user.id },
        data: {
          totalXP: { increment: 2500 },
          currentClass: "Grandmaster Ascendant Tier",
        },
      });

      await tx.xPTransaction.create({
        data: {
          userId: user.id,
          amount: 2500,
          source: "ARC_90_COMPLETION_BONUS",
          description: "Earned 90-Day Arc Completion Master Distinction",
        },
      });

      // 2. Create the permanent Certificate
      const cert = await tx.certificate.create({
        data: {
          userId: user.id,
          certificateNumber: certificateId,
          userName: fullUser.name,
          startDate: fullUser.profile?.startDate || new Date(),
          endDate: completionDate,
          pledge:
            "90 days ago, a commitment was made. Today, the Arc is complete. Recognized for unwavering discipline, consistency, and daily excellence.",
          contractData: JSON.stringify(certPayload),
          academicStatus: fullUser.profile?.currentClass || "Challenger",
        },
      });

      // 3. Update streak to recorded 90 days completion
      await tx.streak.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          currentStreak: 90,
          longestStreak: 90,
          lastCompletedDay: 90,
          consistencyRate: consistency,
        },
        update: {
          lastCompletedDay: 90,
          consistencyRate: consistency,
        },
      });

      return cert;
    });

    return NextResponse.json({
      success: true,
      certificate: newCertificate,
      data: certPayload,
    });
  } catch (error) {
    console.error("POST /api/certificate error:", error);
    return NextResponse.json({ error: "Failed to finalize Arc completion" }, { status: 500 });
  }
}
