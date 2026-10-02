import { NextResponse } from "next/server";
import { quantumCore } from "@/lib/ai/quantum-core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await quantumCore.analyzeOnboarding(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in onboarding analysis API route:", error);
    return NextResponse.json(
      {
        error: "Failed to perform AI onboarding analysis",
        primary_goal: "Master physical and mental discipline",
        secondary_goal: "Execute daily deep work",
        focus_obstacles: ["Digital distractions", "Inconsistent routines"],
        recommended_habits: [
          "HEAVY WORKOUT (45 MIN)",
          "DEEP WORK / STUDY (90 MIN)",
          "DIGITAL DETOX BEFORE SLEEP",
          "READING / SKILL LOG (30 MIN)",
        ],
        recommended_daily_actions: ["Morning focus block", "Daily habit check-in", "Evening review"],
        accountability_strategy: "Maintain unbroken daily momentum with immediate reset on slips.",
        arc_summary: "Your Arc profile is primed for compounding discipline. Focus on eliminating distractions and executing your core habits daily.",
      },
      { status: 200 } // return 200 so UI continues gracefully with fallback
    );
  }
}
