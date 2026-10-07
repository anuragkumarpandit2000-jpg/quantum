import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/utils";
import { createToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // 1. IP-level rate limiting: 5 attempts per 15 minutes
    const ipLimit = checkRateLimit(`login:ip:${ip}`, 5, 15 * 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: `Too many login attempts from this network. Please retry in ${ipLimit.resetSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(ipLimit.resetSeconds) } }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }
    const { identifier, password } = body || {};

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password are required." },
        { status: 400 }
      );
    }

    const cleanId = String(identifier).toLowerCase().trim();

    // 2. Account-level rate limiting: 5 attempts per 15 minutes
    const idLimit = checkRateLimit(`login:id:${cleanId}`, 5, 15 * 60 * 1000);
    if (!idLimit.success) {
      return NextResponse.json(
        { error: `Too many failed attempts for this account. Please retry in ${idLimit.resetSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(idLimit.resetSeconds) } }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanId }, { username: cleanId }],
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        emailVerified: user.emailVerified,
        onboardingDone: user.profile?.onboardingDone || false,
      },
      token,
      requiresVerification: !user.emailVerified,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    const msg = error?.message || "";
    if (
      msg.includes("Can't reach database server") ||
      msg.includes("ECONNRESET") ||
      msg.includes("ETIMEDOUT") ||
      error?.code === "P1001"
    ) {
      return NextResponse.json(
        {
          error: "Database unreachable (Port 5432 blocked). If Proton VPN is active, please disconnect or pause it to allow connection to the cloud database.",
          isConnectionIssue: true,
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Authentication failed. Please verify your credentials or network." },
      { status: 500 }
    );
  }
}
