import crypto from "crypto";
import prisma from "./prisma";

// Expiration window for verification tokens (24 hours)
export const VERIFICATION_EXPIRY_HOURS = 24;
// Minimum cooldown between resend requests (60 seconds)
export const RESEND_COOLDOWN_SECONDS = 60;
// Max resends allowed within a rolling 1-hour window
export const MAX_RESENDS_PER_HOUR = 5;

export interface GeneratedToken {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Generates a cryptographically secure 256-bit single-use verification token.
 * Returns the raw token (to be sent via email) and its SHA-256 hash (to be stored in the database).
 */
export function generateVerificationToken(): GeneratedToken {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  return { rawToken, tokenHash, expiresAt };
}

/**
 * Computes deterministic SHA-256 hash of raw token for database storage and verification.
 */
export function hashVerificationToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
}

/**
 * Issues a new single-use token in the database, invalidating any previous pending tokens for the user.
 */
export async function issueEmailVerificationToken(userId: string): Promise<GeneratedToken> {
  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();

  // Invalidate (delete) all existing pending tokens for this user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  // Store only the secure hash in the database
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  // Update user's last verification sent timestamp
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastVerificationSentAt: new Date(),
    },
  });

  return { rawToken, tokenHash, expiresAt };
}

/**
 * Validates resend rate limits:
 * 1. Cooldown period (60s)
 * 2. Rolling hourly cap
 */
export async function checkResendRateLimit(userId: string): Promise<{
  allowed: boolean;
  secondsRemaining?: number;
  reason?: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastVerificationSentAt: true },
  });

  if (!user) {
    return { allowed: false, reason: "User not found." };
  }

  const now = Date.now();

  if (user.lastVerificationSentAt) {
    const elapsedSeconds = Math.floor((now - user.lastVerificationSentAt.getTime()) / 1000);
    if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
      const secondsRemaining = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
      return {
        allowed: false,
        secondsRemaining,
        reason: `Rate limit active. Please wait ${secondsRemaining}s before requesting another verification email.`,
      };
    }
  }

  // Check rolling 1-hour cap
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const recentTokensCount = await prisma.emailVerificationToken.count({
    where: {
      userId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentTokensCount >= MAX_RESENDS_PER_HOUR) {
    return {
      allowed: false,
      reason: `Maximum hourly resend limit reached (${MAX_RESENDS_PER_HOUR}/hour). Please check your spam folder or try again later.`,
    };
  }

  return { allowed: true };
}
