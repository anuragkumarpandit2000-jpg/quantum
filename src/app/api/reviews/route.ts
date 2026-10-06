import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function sanitizeText(str: string): string {
  return str.replace(/<[^>]*>?/gm, "").trim();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "150", 10)), 500);

    const [reviews, totalCount, aggregations] = await Promise.all([
      prisma.feedback.findMany({
        where: { isApproved: true },
        orderBy: [
          { isDonation: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
      }),
      prisma.feedback.count({
        where: { isApproved: true },
      }),
      prisma.feedback.aggregate({
        where: { isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
        _sum: { rating: true, donationAmount: true },
      }),
    ]);

    const totalVotes = aggregations._count.rating || (totalCount > 0 ? totalCount : 1);
    const rawAvg = aggregations._avg.rating || 5.0;
    const averageRating = Number(rawAvg.toFixed(1));
    const totalDonations = aggregations._sum.donationAmount || 0;

    return NextResponse.json({
      reviews,
      total: totalCount,
      totalVotes,
      averageRating,
      totalDonations,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to submit a verified review." },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required before posting reviews." },
        { status: 403 }
      );
    }

    // Rate-limit review submissions per user (1 every 24h)
    const existingReview = await prisma.feedback.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (existingReview) {
      const hoursSinceLast =
        (Date.now() - new Date(existingReview.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLast < 24 && !isAdmin(user)) {
        return NextResponse.json(
          { error: "You have already submitted a review recently. Please wait 24 hours before submitting another." },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const { authorName, authorTitle, quote, rating, avatarUrl } = body;

    const rawQuote = typeof quote === "string" ? quote : "";
    const cleanQuote = sanitizeText(rawQuote).substring(0, 500);

    if (cleanQuote.length < 5) {
      return NextResponse.json(
        { error: "Review quote must be at least 5 characters long." },
        { status: 400 }
      );
    }

    const resolvedRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    // Verify donation against actual completed database records
    let isDonationSupporter = false;
    let verifiedDonationAmount: number | null = null;
    const completedDonation = await prisma.donation.findFirst({
      where: { userId: user.id, status: "COMPLETED" },
      orderBy: { amount: "desc" },
    });

    if (completedDonation) {
      isDonationSupporter = true;
      verifiedDonationAmount = completedDonation.amount;
    }

    const cleanAuthorName = authorName ? sanitizeText(String(authorName)).substring(0, 50) : "";
    const resolvedName = cleanAuthorName || user.name || user.username || "Verified Challenger";

    const cleanAuthorTitle = authorTitle ? sanitizeText(String(authorTitle)).substring(0, 50) : "";
    const resolvedTitle =
      cleanAuthorTitle ||
      (isDonationSupporter
        ? "Quantum Royal Patron"
        : user.profile?.currentClass || `Level ${user.profile?.level || 1} Challenger`);

    const resolvedAvatar =
      (typeof avatarUrl === "string" && avatarUrl.startsWith("/") ? avatarUrl : null) ||
      user.profile?.avatar ||
      "/assets/images/avatars/default_avatar.svg";

    const newFeedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        authorName: resolvedName,
        authorTitle: resolvedTitle,
        quote: cleanQuote,
        rating: resolvedRating,
        avatarUrl: resolvedAvatar,
        donationAmount: verifiedDonationAmount,
        donationCurrency: "INR",
        isDonation: isDonationSupporter,
        isApproved: true,
        isSample: false,
      },
    });

    // Recompute live stats after this submission
    const aggregations = await prisma.feedback.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
      _sum: { rating: true, donationAmount: true },
    });

    const totalVotes = aggregations._count.rating || 1;
    const averageRating = Number((aggregations._avg.rating || 5.0).toFixed(1));

    return NextResponse.json(
      {
        success: true,
        review: newFeedback,
        totalVotes,
        averageRating,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
