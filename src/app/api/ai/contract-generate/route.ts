import { NextResponse } from "next/server";
import { quantumCore } from "@/lib/ai/quantum-core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await quantumCore.generateContract(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in contract generation API route:", error);
    const body = await req.json().catch(() => ({}));
    const serialNumber = `QNTM-CONTRACT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return NextResponse.json({
      primaryGoalText: `My primary goal is to achieve ${body.answers?.primaryGoal || "unwavering personal transformation"}.`,
      secondaryGoalText: `My secondary goal is to develop ${body.answers?.secondaryGoal || "daily discipline and cognitive endurance"}.`,
      proofMethodText: `I will verify my daily discipline by submitting ${body.answers?.proofMethod || "daily photographic and check-in logs"}.`,
      arcCommitmentText: `I commit to ${body.answers?.arcCommitment || "dedicating non-negotiable daily effort"} without compromise.`,
      badDayProtocolText: `If external disruption occurs, I will ${body.answers?.badDayProtocol || "execute an immediate reset rep to protect my streak"}.`,
      distractionStrategyText: `When confronted with distractions, I will ${body.answers?.distractionStrategy || "lock down notifications and re-engage focus"}.`,
      consistencyCheckpointText: `My consistency audit checkpoint will be anchored by ${body.answers?.consistencyCheckpoint || "weekly reviews and habit matrix audits"}.`,
      continuationPlanText: body.answers?.continueAfter90
        ? `Following this 90-day arc, I will continue pursuing: ${body.answers?.postArcGoals || "perpetual skill compounding and athletic discipline"}.`
        : "Following this 90-day arc, I will defend my transformed standards as an immutable baseline.",
      generatedDate,
      serialNumber,
    });
  }
}
