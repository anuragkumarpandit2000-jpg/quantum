import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const cert = await prisma.certificate.findFirst({
    where: { userId: user.id },
    orderBy: { issuedAt: "desc" },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      isAdmin: user.email.toLowerCase() === "anuragkumar.pandit2000@gmail.com" || user.role === "ADMIN",
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      lastActiveAt: user.lastActiveAt,
      profile: user.profile,
      settings: user.settings,
      streak: user.streak,
      certificate: cert,
    },
  });
}
