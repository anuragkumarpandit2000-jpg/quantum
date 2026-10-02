import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile: {
              select: {
                avatar: true,
                level: true,
                currentClass: true,
              },
            },
          },
        },
      },
    });

    const totalContributed = donations.reduce((acc, d) => acc + d.amount, 0);

    return NextResponse.json({
      totalContributed,
      count: donations.length,
      recentDonations: donations,
    });
  } catch (error) {
    console.error("GET /api/donations error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. You must sign up or log in first to pledge support to the Quantum community." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, feedback, upiId } = body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Valid contribution amount is required" }, { status: 400 });
    }

    const donorName = user.name || user.username || "Challenger";
    const userRank = user.profile?.currentClass || `Level ${user.profile?.level || 1}`;

    const donation = await prisma.donation.create({
      data: {
        userId: user.id,
        amount: parsedAmount,
        currency: "INR",
        donorName: `${donorName} (${userRank})`,
        transactionRef: feedback?.trim() || "Pledged support for Quantum Community",
        upiId: upiId || "anuragkumar.pandit2000@okicici",
        status: "COMPLETED",
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile: {
              select: {
                avatar: true,
                level: true,
                currentClass: true,
              },
            },
          },
        },
      },
    });

    // Award supporter XP (+5 XP per Rupee)
    await prisma.$transaction([
      prisma.xPTransaction.create({
        data: {
          userId: user.id,
          amount: Math.round(parsedAmount * 5),
          source: "COMMUNITY_DONATION",
          description: `Supported Quantum Community with ₹${parsedAmount}`,
        },
      }),
      prisma.profile.update({
        where: { userId: user.id },
        data: { totalXP: { increment: Math.round(parsedAmount * 5) } },
      }),
    ]).catch(() => {});

    return NextResponse.json({ donation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/donations error:", error);
    return NextResponse.json({ error: "Failed to record contribution" }, { status: 500 });
  }
}

