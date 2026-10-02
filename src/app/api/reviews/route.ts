import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await prisma.feedback.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();
    const { authorName, authorTitle, quote, rating, avatarUrl } = body;

    if (!quote || !quote.trim()) {
      return NextResponse.json({ error: "Quote/Review content is required." }, { status: 400 });
    }

    const resolvedName = authorName?.trim() || user?.name || "Challenger";
    const resolvedTitle = authorTitle?.trim() || "Winter Arc Challenger";
    const resolvedAvatar = avatarUrl || user?.profile?.avatar || "/assets/images/avatars/avatar_01.png";
    const resolvedRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    const newFeedback = await prisma.feedback.create({
      data: {
        userId: user?.id || null,
        authorName: resolvedName,
        authorTitle: resolvedTitle,
        quote: quote.trim(),
        rating: resolvedRating,
        avatarUrl: resolvedAvatar,
        isApproved: true, // auto-approved for live showcase (admin can moderate)
        isSample: false,
      },
    });

    return NextResponse.json({ success: true, review: newFeedback }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
