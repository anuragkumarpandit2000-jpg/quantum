import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const adminUser = await getCurrentUser(req);
    if (!adminUser || !isAdmin(adminUser)) {
      return NextResponse.json(
        { error: "Forbidden: Super-Admin access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case "grant_xp": {
        const { targetUserId, amount, reason } = payload;
        if (!targetUserId || !amount) {
          return NextResponse.json({ error: "Missing targetUserId or amount" }, { status: 400 });
        }
        const xpAmount = parseInt(amount, 10);
        await prisma.$transaction([
          prisma.xPTransaction.create({
            data: {
              userId: targetUserId,
              amount: xpAmount,
              source: "ADMIN_BONUS",
              description: reason || "Quantum Admin Sovereign Directive XP Grant",
            },
          }),
          prisma.profile.update({
            where: { userId: targetUserId },
            data: { totalXP: { increment: xpAmount } },
          }),
        ]);
        return NextResponse.json({ success: true, message: `Granted ${xpAmount} XP to challenger.` });
      }

      case "toggle_role": {
        const { targetUserId, newRole } = payload;
        await prisma.user.update({
          where: { id: targetUserId },
          data: { role: newRole || "USER" },
        });
        return NextResponse.json({ success: true, message: `Role updated to ${newRole}.` });
      }

      case "delete_user": {
        const { targetUserId } = payload;
        if (targetUserId === adminUser.id) {
          return NextResponse.json({ error: "Cannot delete your own super-admin account" }, { status: 400 });
        }
        await prisma.user.delete({
          where: { id: targetUserId },
        });
        return NextResponse.json({ success: true, message: "Challenger record purged." });
      }

      case "toggle_proof_visibility": {
        const { proofId, isPublic } = payload;
        await prisma.galleryItem.update({
          where: { id: proofId },
          data: { isPublic: !!isPublic },
        });
        return NextResponse.json({ success: true, message: "Proof visibility updated." });
      }

      case "delete_proof": {
        const { proofId } = payload;
        await prisma.galleryItem.delete({
          where: { id: proofId },
        });
        return NextResponse.json({ success: true, message: "Proof permanently removed." });
      }

      case "approve_feedback": {
        const { feedbackId, isApproved } = payload;
        await prisma.feedback.update({
          where: { id: feedbackId },
          data: { isApproved: isApproved !== undefined ? isApproved : true },
        });
        return NextResponse.json({ success: true, message: "Feedback moderation status updated." });
      }

      case "delete_feedback": {
        const { feedbackId } = payload;
        await prisma.feedback.delete({
          where: { id: feedbackId },
        });
        return NextResponse.json({ success: true, message: "Feedback purged." });
      }

      case "reset_streak": {
        const { targetUserId, streakCount } = payload;
        await prisma.streak.upsert({
          where: { userId: targetUserId },
          create: {
            userId: targetUserId,
            currentStreak: parseInt(streakCount, 10) || 0,
            longestStreak: parseInt(streakCount, 10) || 0,
            lastCompletedDay: parseInt(streakCount, 10) || 0,
            consistencyRate: 100,
          },
          update: {
            currentStreak: parseInt(streakCount, 10) || 0,
            lastCompletedDay: parseInt(streakCount, 10) || 0,
          },
        });
        return NextResponse.json({ success: true, message: "Challenger streak updated." });
      }

      default:
        return NextResponse.json({ error: `Unknown admin action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error("POST /api/admin/actions error:", error);
    return NextResponse.json({ error: "Failed to execute admin action" }, { status: 500 });
  }
}
