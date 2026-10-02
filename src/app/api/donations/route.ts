import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
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
    const body = await req.json();
    const { amount, donorName, transactionRef, upiId } = body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    const donation = await prisma.donation.create({
      data: {
        userId: user?.id || null,
        amount: parsedAmount,
        currency: "INR",
        donorName: donorName?.trim() || user?.name || "Anonymous Challenger",
        transactionRef: transactionRef?.trim() || `UPI-TXN-${Date.now()}`,
        upiId: upiId || "quantum@upi",
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ donation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/donations error:", error);
    return NextResponse.json({ error: "Failed to record contribution" }, { status: 500 });
  }
}
