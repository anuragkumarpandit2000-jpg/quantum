import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkResendRateLimit, issueEmailVerificationToken } from "@/lib/email-verification";
import { sendVerificationEmail, getAppBaseUrl } from "@/lib/email-service";
import { validateChallengerEmail } from "@/lib/email-validator";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    let targetUser: any = null;

    // 1. Identify user via provided email or active session cookie
    if (email && typeof email === "string" && email.trim()) {
      const emailValidation = validateChallengerEmail(email);
      if (!emailValidation.isValid || !emailValidation.normalizedEmail) {
        return NextResponse.json(
          { error: emailValidation.error || "Invalid email format." },
          { status: 400 }
        );
      }
      targetUser = await prisma.user.findUnique({
        where: { email: emailValidation.normalizedEmail },
      });
    } else {
      targetUser = await getCurrentUser(req);
    }

    if (!targetUser) {
      // Return ambiguous message to prevent user enumeration attacks
      return NextResponse.json(
        {
          success: true,
          message: "If an unverified Quantum account exists for this address, a verification link has been dispatched.",
        },
        { status: 200 }
      );
    }

    // 2. Check if already verified
    if (targetUser.emailVerified) {
      return NextResponse.json(
        {
          status: "ALREADY_VERIFIED",
          message: "This account has already been verified. No further action is required.",
        },
        { status: 200 }
      );
    }

    // 3. Rate limiting check (60-second cooldown + 5/hour rolling cap)
    const rateCheck = await checkResendRateLimit(targetUser.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          status: "RATE_LIMITED",
          error: rateCheck.reason,
          secondsRemaining: rateCheck.secondsRemaining || 60,
        },
        { status: 429 }
      );
    }

    // 4. Issue a new single-use token (invalidates all previous tokens)
    const { rawToken } = await issueEmailVerificationToken(targetUser.id);

    // 5. Send verification email
    const emailResult = await sendVerificationEmail({
      to: targetUser.email,
      name: targetUser.name,
      username: targetUser.username,
      rawToken,
      baseUrl: getAppBaseUrl(req),
    });

    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json(
      {
        success: true,
        status: "SENT",
        message: "A fresh verification link has been transmitted to your email.",
        email: targetUser.email,
        cooldownSeconds: 60,
        ...(isDev && { devVerificationUrl: emailResult.verificationUrl }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/auth/resend-verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification link. Internal server error." },
      { status: 500 }
    );
  }
}
