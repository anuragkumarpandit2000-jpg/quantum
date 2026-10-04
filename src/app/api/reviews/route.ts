import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
    const body = await req.json();
    const {
      authorName,
      authorTitle,
      quote,
      rating,
      avatarUrl,
      donationAmount,
      donationCurrency,
      isDonation,
    } = body;

    const resolvedRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const isDonationSupporter = Boolean(
      isDonation || (donationAmount && Number(donationAmount) > 0)
    );
    const parsedDonation = isDonationSupporter && donationAmount ? Number(donationAmount) : null;
    const parsedCurrency = donationCurrency?.trim() || "INR";

    const defaultQuote = isDonationSupporter
      ? `Proud patron supporter of the Quantum OS! Contributed ${parsedCurrency} ${parsedDonation || ""}. Unbreakable focus.`
      : `Rated ${resolvedRating}★ in the Quantum Winter Arc. Pure discipline and system execution.`;

    const finalQuote = quote?.trim() || defaultQuote;

    const resolvedName = authorName?.trim() || user?.name || "Verified Challenger";
    const resolvedTitle =
      authorTitle?.trim() ||
      (isDonationSupporter ? "Quantum Royal Patron" : "Arc Challenger");
    const resolvedAvatar =
      avatarUrl || user?.profile?.avatar || "/assets/images/avatars/default_avatar.svg";

    const newFeedback = await prisma.feedback.create({
      data: {
        userId: user?.id || null,
        authorName: resolvedName,
        authorTitle: resolvedTitle,
        quote: finalQuote,
        rating: resolvedRating,
        avatarUrl: resolvedAvatar,
        donationAmount: parsedDonation,
        donationCurrency: parsedCurrency,
        isDonation: isDonationSupporter,
        isApproved: true, // auto-approved for live showcase
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
