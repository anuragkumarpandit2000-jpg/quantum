import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "quantum_winter_arc_secret_jwt_key_2025_90days";
const AUTH_COOKIE_NAME = "quantum_session";

export interface SessionPayload {
  userId: string;
  email: string;
  username: string;
}

export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(req?: Request) {
  try {
    let token: string | undefined;

    // 1. If request object is passed, check Authorization header first
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }

      // 2. Check Cookie header on the request object
      if (!token) {
        const cookieHeader = req.headers.get("cookie");
        if (cookieHeader) {
          const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]*)`));
          if (match) {
            token = decodeURIComponent(match[1]);
          }
        }
      }
    }

    // 3. Fallback to Next.js cookies() helper (async in Next.js 15)
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      } catch {
        // cookies() may throw outside of request context
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        settings: true,
        streak: true,
      },
    });

    if (user) {
      const isSuperAdminEmail = user.email.toLowerCase() === "anuragkumar.pandit2000@gmail.com";
      const shouldPromoteRole = isSuperAdminEmail && user.role !== "ADMIN";

      // Non-blocking update of lastActiveAt and admin role
      prisma.user
        .update({
          where: { id: user.id },
          data: {
            lastActiveAt: new Date(),
            ...(shouldPromoteRole ? { role: "ADMIN" } : {}),
          },
        })
        .catch(() => {});

      if (isSuperAdminEmail) {
        user.role = "ADMIN";
      }
    }

    return user;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}

export function isAdmin(user?: { email?: string; role?: string } | null): boolean {
  if (!user || !user.email) return false;
  return (
    user.email.toLowerCase() === "anuragkumar.pandit2000@gmail.com" ||
    user.role === "ADMIN"
  );
}

export async function requireVerifiedUser(req?: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return { user: null, error: "Unauthorized", status: 401 };
  }
  if (!user.emailVerified) {
    return {
      user: null,
      error: "Email verification required. Please verify your email to unlock Quantum Arc access.",
      status: 403,
    };
  }
  return { user, error: null, status: 200 };
}

export { AUTH_COOKIE_NAME };
