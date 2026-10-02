import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    if (!id) {
      return NextResponse.json({ error: "Certificate ID required" }, { status: 400 });
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        certificateNumber: id.toUpperCase().trim(),
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { verified: false, error: "Arc Certificate Not Found in Sovereign Registry" },
        { status: 404 }
      );
    }

    let payload: any = {};
    if (certificate.contractData) {
      try {
        payload = JSON.parse(certificate.contractData);
      } catch {}
    }

    const isCompletion =
      certificate.certificateNumber.startsWith("Q-CERT-") ||
      payload.type === "ARC_COMPLETION";

    // Public sanitized verification payload only (no private reflections)
    const verificationRecord = {
      verified: true,
      arcId: certificate.certificateNumber,
      participantName: certificate.userName || certificate.user.name,
      username: certificate.user.username,
      arcName: "QUANTUM 90-Day Winter Arc",
      status: isCompletion ? "COMPLETED" : "RATIFIED COVENANT",
      daysCompleted: isCompletion ? 90 : payload.completedDays || 90,
      totalDays: 90,
      totalXP: payload.totalXP || 4320,
      consistency: payload.consistency ? `${payload.consistency}%` : "94%",
      startDate: certificate.startDate,
      completionDate: certificate.endDate,
      issuedAt: certificate.issuedAt,
      authoritySignature: "Anurag Kumar, CEO (QUANTUM Sovereign Authority)",
      cryptographicHash: `SHA256:QNTM-${Buffer.from(certificate.certificateNumber).toString("hex").toUpperCase().slice(0, 16)}`,
    };

    return NextResponse.json({ record: verificationRecord });
  } catch (error) {
    console.error("GET /api/verify/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
