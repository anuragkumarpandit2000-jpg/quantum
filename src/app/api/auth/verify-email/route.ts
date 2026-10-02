import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashVerificationToken } from "@/lib/email-verification";
import { createToken, AUTH_COOKIE_NAME, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token } = body;

    if (!token || typeof token !== "string" || !token.trim()) {
      return NextResponse.json(
        {
          status: "INVALID_TOKEN",
          error: "Verification token is required.",
        },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();
    const tokenHash = hashVerificationToken(cleanToken);

    // Look up the token in the database by its secure SHA-256 hash
    const record = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // If token record was not found:
    // It may have already been consumed (single-use), expired & purged, or is completely invalid.
    if (!record) {
      // Check if current logged-in user is already verified
      const currentUser = await getCurrentUser(req);
      if (currentUser?.emailVerified) {
        return NextResponse.json(
          {
            status: "ALREADY_VERIFIED",
            message: "Your Quantum account is already verified. You may proceed directly to your Arc.",
            user: {
              id: currentUser.id,
              email: currentUser.email,
              username: currentUser.username,
              name: currentUser.name,
              emailVerified: true,
              onboardingDone: currentUser.profile?.onboardingDone || false,
            },
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          status: "INVALID_TOKEN",
          error: "This verification link is invalid, corrupted, or has already been used.",
        },
        { status: 400 }
      );
    }

    const { user, expiresAt } = record;

    // Check if the user is already verified
    if (user.emailVerified) {
      // Clean up the obsolete token
      await prisma.emailVerificationToken.delete({
        where: { id: record.id },
      }).catch(() => {});

      return NextResponse.json(
        {
          status: "ALREADY_VERIFIED",
          message: "This Quantum account has already been ratified and verified.",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            emailVerified: true,
            onboardingDone: user.profile?.onboardingDone || false,
          },
        },
        { status: 200 }
      );
    }

    // Check if token has expired
    const now = new Date();
    if (expiresAt < now) {
      // Delete the expired token record
      await prisma.emailVerificationToken.delete({
        where: { id: record.id },
      }).catch(() => {});

      return NextResponse.json(
        {
          status: "EXPIRED_TOKEN",
          error: "This verification link has expired (24-hour limit exceeded). Please request a new verification email.",
          email: user.email,
        },
        { status: 410 }
      );
    }

    // Token is valid and unexpired!
    // 1. Ratify user: emailVerified = true, emailVerifiedAt = now
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: now,
      },
      include: {
        profile: true,
      },
    });

    // 2. Invalidate ALL verification tokens for this user (Single-use guarantee)
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    }).catch(() => {});

    // 3. Issue refreshed session token
    const sessionJwt = createToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });

    const response = NextResponse.json(
      {
        status: "VERIFIED",
        message: "Identity ratified. Email ownership verified successfully.",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          name: updatedUser.name,
          emailVerified: true,
          onboardingDone: updatedUser.profile?.onboardingDone || false,
        },
      },
      { status: 200 }
    );

    // Refresh auth cookie with verified session
    response.cookies.set(AUTH_COOKIE_NAME, sessionJwt, {
      httpOnly: true,
      secure: false, // allow localhost testing
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/verify-email error:", error);
    return NextResponse.json(
      {
        status: "ERROR",
        error: "Verification failed due to a server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
