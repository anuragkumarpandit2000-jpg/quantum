import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { quantumCore } from "@/lib/ai/quantum-core";

import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required. Please verify your email to interface with Quantum Core." },
        { status: 403 }
      );
    }

    // Rate limiting: max 20 AI queries per day (24 hours) per user
    const aiLimit = checkRateLimit(`ai:user:${user.id}`, 20, 24 * 60 * 60 * 1000);
    if (!aiLimit.success) {
      return NextResponse.json(
        {
          error: "Daily Quantum Core query allowance reached (20/day). Allowance recharges in 24 hours.",
          disclaimer: "AI Coach is designed for habit consistency and tactical planning; not medical or mental health advice.",
        },
        { status: 429, headers: { "Retry-After": String(aiLimit.resetSeconds) } }
      );
    }

    const body = await req.json();
    const { message, thinkActive, deepSearchActive, conversationId } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sanitizedMessage = sanitizePlainText(message, 3000);

    // Fetch user context: habits, skills, certificate with contract & onboarding dossier
    const [habits, skills, cert] = await Promise.all([
      prisma.habit.findMany({
        where: { userId: user.id },
        select: { title: true },
      }),
      prisma.skill.findMany({
        where: { userId: user.id },
        select: { title: true, level: true, progress: true },
      }),
      prisma.certificate.findFirst({
        where: { userId: user.id },
        orderBy: { issuedAt: "desc" },
      }),
    ]);

    // Parse contract and onboarding data if available
    let parsedContract: any = null;
    if (cert?.contractData) {
      try {
        parsedContract = JSON.parse(cert.contractData);
      } catch {
        parsedContract = null;
      }
    }

    const doc = parsedContract?.document || parsedContract || {};
    const answers = parsedContract?.answers || {};
    const analysis = parsedContract?.analysis || {};

    // Get or create conversation (with strict ownership check to prevent IDOR)
    let convId = conversationId;
    if (convId) {
      const existingConv = await prisma.aIConversation.findUnique({
        where: { id: convId },
      });
      if (!existingConv || existingConv.userId !== user.id) {
        // Forbidden or invalid ID: fallback to creating a dedicated user conversation
        convId = null;
      }
    }

    if (!convId) {
      const conv = await prisma.aIConversation.create({
        data: {
          userId: user.id,
          title: sanitizedMessage.slice(0, 40) + "...",
        },
      });
      convId = conv.id;
    }

    // Fetch previous messages for conversational context
    const previousMessages = await prisma.aIMessage.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    const chronologicalMessages = previousMessages.reverse().map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const context = {
      userName: user.name || user.username,
      level: user.profile?.level || 1,
      currentStreak: user.streak?.currentStreak || 0,
      totalXP: user.profile?.totalXP || 0,
      activeHabits: habits.map((h) => h.title),
      objective: doc.primaryGoalText || user.profile?.objective,
      thinkActive: !!thinkActive,
      deepSearchActive: !!deepSearchActive,

      // Rich dossier fields
      age: user.profile?.age || answers.age || "Unspecified",
      academicStatus: cert?.academicStatus || user.profile?.currentClass || answers.academicStatus || "Independent Challenger",
      careerPath: skills?.[0]?.title || answers.careerPath || "High-Performance Execution",
      primaryGoal: doc.primaryGoalText || answers.primaryGoal || user.profile?.objective,
      secondaryGoal: doc.secondaryGoalText || answers.secondaryGoal || "Continuous skill compounding",
      proofMethod: doc.proofMethodText || answers.proofMethod,
      arcCommitment: doc.arcCommitmentText || answers.arcCommitment,
      badDayProtocol: doc.badDayProtocolText || answers.badDayProtocol || analysis.accountability_strategy,
      distractionStrategy: doc.distractionStrategyText || answers.distractionStrategy,
      consistencyCheckpoint: doc.consistencyCheckpointText || answers.consistencyCheckpoint,
      continuationPlan: doc.continuationPlanText || answers.continuationPlan,
      screenTimeApps: answers.screenTimeApps || ["Smartphones / Social Media"],
      dailyScreenHours: answers.dailyScreenHours || "4.5",
      sleepTime: answers.sleepTime || "23:00",
      wakeTime: answers.wakeTime || "06:30",
      avoidedTask: answers.avoidedTask,
      brokenPromise: answers.brokenPromise,
      protectWhat: answers.protectWhat,
      changeWhat: answers.changeWhat,
      aiObservation: analysis.arc_summary,
      frictionPoints: analysis.focus_obstacles || answers.distractions,
      contractSerial: doc.serialNumber || cert?.certificateNumber,
      recentMessages: chronologicalMessages,
    };

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: "user",
        content: message.trim(),
        thinkActive: !!thinkActive,
        deepSearchActive: !!deepSearchActive,
      },
    });

    // Generate AI response grounded in challenger's complete data
    const replyContent = await quantumCore.generateResponse(message.trim(), context);

    // Save assistant message
    const assistantMsg = await prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: "assistant",
        content: replyContent,
        thinkActive: !!thinkActive,
        deepSearchActive: !!deepSearchActive,
      },
    });

    return NextResponse.json({
      conversationId: convId,
      reply: assistantMsg.content,
      createdAt: assistantMsg.createdAt,
      disclaimer: "AI Coach - not medical or mental health advice.",
    });
  } catch (error) {
    console.error("POST /api/ai/chat error:", error);
    return NextResponse.json({ error: "Quantum Core execution error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.aIConversation.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("GET /api/ai/chat error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
