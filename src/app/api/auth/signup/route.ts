import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { createToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { validateChallengerEmail } from "@/lib/email-validator";
import { issueEmailVerificationToken } from "@/lib/email-verification";
import { sendVerificationEmail, getAppBaseUrl } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username, name } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // 1. Strict RFC email and disposable email provider validation
    const emailValidation = validateChallengerEmail(email);
    if (!emailValidation.isValid || !emailValidation.normalizedEmail) {
      return NextResponse.json(
        { error: emailValidation.error || "Invalid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = emailValidation.normalizedEmail;
    const cleanUsername = username.toLowerCase().trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters." },
        { status: 400 }
      );
    }

    // 2. Check existing user
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { username: cleanUsername }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email or callsign is already registered in the Quantum system." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const defaultAvatars = [
      "/assets/images/avatars/avatar_01.png",
      "/assets/images/avatars/avatar_02.png",
      "/assets/images/avatars/avatar_03.png",
      "/assets/images/avatars/avatar_04.jpg",
      "/assets/images/avatars/avatar_05.jpg",
      "/assets/images/avatars/avatar_06.jpg",
      "/assets/images/avatars/avatar_07.jpg",
      "/assets/images/avatars/avatar_08.jpg",
      "/assets/images/avatars/avatar_09.jpg",
      "/assets/images/avatars/avatar_10.jpg",
      "/assets/images/avatars/avatar_11.jpg",
      "/assets/images/avatars/avatar_12.jpg",
    ];
    const defaultAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    // 3. Create user with emailVerified = false (Production requirement)
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        username: cleanUsername,
        name: name?.trim() || cleanUsername,
        passwordHash,
        emailVerified: false,
        emailVerifiedAt: null,
        lastVerificationSentAt: new Date(),
        profile: {
          create: {
            avatar: defaultAvatar,
            totalXP: 0,
            targetXP: 10000,
            level: 1,
            currentClass: "Initiate Tier I",
            onboardingDone: false,
          },
        },
        settings: {
          create: {
            soundEnabled: true,
            theme: "dark",
          },
        },
        streak: {
          create: {
            currentStreak: 0,
            longestStreak: 0,
            lastCompletedDay: 0,
            consistencyRate: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // 4. Generate cryptographically secure single-use token and store hash in DB
    const { rawToken } = await issueEmailVerificationToken(user.id);

    // 5. Send verification email
    const emailResult = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      username: user.username,
      rawToken,
      baseUrl: getAppBaseUrl(req),
    });

    // 6. Create authenticated session cookie
    const token = createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const isDev = process.env.NODE_ENV !== "production";

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          emailVerified: false,
          onboardingDone: user.profile?.onboardingDone || false,
        },
        token,
        requiresVerification: true,
        message: "Challenger credentials created. Verification email dispatched to your inbox.",
        ...(isDev && { devVerificationUrl: emailResult.verificationUrl }),
      },
      { status: 201 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // allow localhost testing
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Registration failed. Internal server error." }, { status: 500 });
  }
}
